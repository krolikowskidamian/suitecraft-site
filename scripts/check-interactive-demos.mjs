/** Isolated headless QA of the fictional marketing demos; no signed-in profile. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdtemp,rm,mkdir,writeFile,access} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outputArg=process.argv.find(v=>v.startsWith('--screenshots='))?.slice(14);
const screenshotDir=outputArg?resolve(outputArg):null;
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+'/'))throw Error('Invalid path');res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise((ok,bad)=>{server.once('error',bad);server.listen(0,'127.0.0.1',ok);});
const origin='http://127.0.0.1:'+server.address().port,profile=await mkdtemp(resolve(tmpdir(),'suitecraft-site-qa-'));
let browser,chrome,client;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try{
 for(const path of [process.env.CHROME_PATH,'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/Applications/Brave Browser.app/Contents/MacOS/Brave Browser','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean)){try{await access(path);browser=path;break;}catch{}}
 if(!browser)throw Error('Set CHROME_PATH to a Chrome/Chromium executable.');
 chrome=spawn(browser,['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync','--disable-gpu','--hide-scrollbars','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
 const debug=await new Promise((ok,bad)=>{let log='';const timeout=setTimeout(()=>bad(Error('Browser startup timeout')),15000);chrome.stderr.on('data',chunk=>{log+=chunk;const match=log.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(match){clearTimeout(timeout);ok(new URL(match[1]));}});chrome.once('exit',code=>{clearTimeout(timeout);bad(Error('Browser exited: '+code));});});
 const targets=await fetch(`http://${debug.host}/json/list`).then(r=>r.json());
 const socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl),pending=new Map(),errors=[];let id=0;
 await new Promise((ok,bad)=>{socket.onopen=ok;socket.onerror=bad;});
 socket.onmessage=event=>{const message=JSON.parse(event.data);if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);if(!message.id)return;const request=pending.get(message.id);if(!request)return;pending.delete(message.id);message.error?request.reject(Error(message.error.message)):request.resolve(message.result);};
 client={call(method,params={}){return new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});},close(){socket.close();}};
 const evaluate=async expression=>{const response=await client.call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(response.exceptionDetails)throw Error(response.exceptionDetails.exception?.description||response.exceptionDetails.text);return response.result.value;};
 const run=fn=>evaluate('('+fn.toString()+')()');
 await client.call('Page.enable');await client.call('Runtime.enable');await client.call('Emulation.setDeviceMetricsOverride',{width:1600,height:1100,deviceScaleFactor:1,mobile:false});await client.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await client.call('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(navigator,'clipboard',{value:{writeText:async value=>{window.__copied=value;}}});"});
 await client.call('Page.navigate',{url:origin+'/index.html'});
 for(let i=0;i<100;i++){if(await evaluate("!!document.querySelector('#ml-title')&&!!document.querySelector('#ms-summary')"))break;if(i===99)throw Error('Demo initialization failed: '+errors.join('\n'));await pause(100);}
 // Checks run in the actual browser DOM, including event handlers and forms.
 await run(()=>{
  const $=s=>document.querySelector(s),check=(ok,message)=>{if(!ok)throw Error(message);},change=(id,value)=>{$(id).value=value;$(id).dispatchEvent(new Event('change',{bubbles:true}));},input=(id,value)=>{$(id).value=value;$(id).dispatchEvent(new Event('input',{bubbles:true}));};
  $('#workspace-tab-lists').click();check($('#ml-title').textContent==='Classes','Lists must open the saved library');check(!$('#ml-list'),'Legacy List filter remains');check($('#ml-table thead').textContent.includes('Parent'),'Classes missing Parent');check(!$('#ml-table thead').textContent.includes('Currency code'),'Classes has currency column');check($('#ml-page-top').textContent.includes('1 / 2'),'List pagination missing');$('#ml-page-top button:last-child').click();check($('#ml-page-bottom').textContent.includes('2 / 2'),'Top and bottom pages differ');
  $('[data-list="currencies"]').click();check($('#ml-table thead').textContent.includes('Currency code'),'Currencies missing code');check(!$('#ml-table thead').textContent.includes('Parent'),'Currencies has Parent');check($('#ml-table').textContent.includes('EUR'),'Currency values absent');
  input('#ml-search','nothing matches');check($('#ml-table').textContent.includes('No matches'),'List empty state missing');check($('#ml-export').disabled,'Empty export enabled');input('#ml-search','');
  $('[data-list="integration"]').click();check($('#ml-table thead').textContent.includes('Display value'),'Custom record columns incorrect');$('[data-list="classes"]').click();input('#ml-library-search','currency');check($('#ml-title').textContent==='Classes','Library search changed selected values');check($('#ml-library').children.length===0||!$('#ml-library').textContent.includes('Departments'),'Library search failed');input('#ml-library-search','');
  $('#ml-manage').click();check(!$('#workspace-panel-sync').hidden&&$('#ms-reference').open,'Manage lists did not open sync settings');
  $('#workspace-tab-favorites').click();check(document.querySelectorAll('.mini-favorite-group').length===3,'Favorites not grouped');const row=$('.mini-favorite-row');[...row.querySelectorAll('button')].find(b=>b.textContent==='Edit note').click();row.querySelector('textarea').value='Updated sample note';row.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));check($('#mf-items').textContent.includes('Updated sample note'),'Favorite note was not saved');input('#mf-search','Updated sample note');check(document.querySelectorAll('.mini-favorite-row').length===1,'Favorite search ignores notes');input('#mf-search','');change('#mf-account','production');check(document.querySelectorAll('.mini-favorite-row').length===1,'Favorite account filter failed');
  $('#workspace-tab-plans').click();check(document.querySelectorAll('.mini-plan-card').length===2,'Active plans missing');change('#mp-type','Testing');check(document.querySelectorAll('.mini-plan-card').length===1&&$('#mp-plans').textContent.includes('Approval validation'),'Plan type filter failed');change('#mp-type','all');const completed=[...document.querySelectorAll('.mini-plan-item select')][1];completed.value='Completed';completed.dispatchEvent(new Event('change'));check($('#mp-plans').textContent.includes('2/3 done'),'Plan completion count stale');
  $('#mp-types').click();$('#mp-type-name').value='Maintenance';$('#mp-type-form').dispatchEvent(new Event('submit',{cancelable:true}));check([...$('#mp-type').options].some(o=>o.value==='Maintenance'),'Custom plan type absent');$('#mp-types-close').click();$('#mp-new').click();$('#mp-new-name').value='Sample maintenance';$('#mp-new-type').value='Maintenance';$('#mp-new-form').dispatchEvent(new Event('submit',{cancelable:true}));check($('#mp-plans').textContent.includes('Sample maintenance'),'New plan absent');$('#workspace-demo [data-demo-play]').click();check(!$('#mp-plans').textContent.includes('Sample maintenance'),'Reset did not restore plans');
  $('#workspace-tab-compare').click();check($('#mc-left').value==='sandbox'&&$('#mc-right').value==='production','Default Source/Target incorrect');const nameButton=[...document.querySelectorAll('#mc-table button')].find(b=>b.textContent==='Approval Required');check(nameButton.closest('tr').textContent.includes('To add'),'Source-only object must be To add');nameButton.click();check($('#mc-detail').textContent.includes('Source: Additional approval indicator.'),'Detail source value missing');$('#mc-swap').click();const swapped=[...document.querySelectorAll('#mc-table button')].find(b=>b.textContent==='Approval Required');check(swapped.closest('tr').textContent.includes('To remove'),'Swap direction inverted');change('#mc-category','Scripts');check(document.querySelectorAll('#mc-table tbody tr').length===1,'Category filter failed');input('#mc-search','unknown');check($('#mc-table').textContent.includes('No matches'),'Compare empty state failed');$('#workspace-demo [data-demo-play]').click();check($('#mc-category').value==='all','Compare reset failed');
  $('#workspace-tab-sync').click();check(document.querySelectorAll('.mini-sync-group').length===3,'Categories not grouped');check(document.querySelectorAll('.ms-category').length===14,'Sync categories missing');check([...document.querySelectorAll('.mini-sync-category')].find(n=>n.textContent.startsWith('Scripts')).textContent.includes('Download details for saved list'),'Saved script detail download missing');$('#ms-none').click();check($('#ms-start').disabled,'Sync without categories must be disabled');$('#ms-all').click();$('#ms-start').click();check($('#ms-progress').value===100&&$('#ms-state').textContent.includes('complete'),'Reduced-motion sync did not complete');
  $('[data-popup-scene="sync"]').click();check(!$('#pp-sync-panel').hidden&&$('#pp-quick-sync').getAttribute('aria-expanded')==='true','Popup sync scene failed');$('#pp-sync-workspace').click();check(!$('#workspace-panel-sync').hidden,'Popup did not navigate to workspace sync');$('#popup-reset').click();check($('#pp-sync-panel').hidden,'Popup reset leaves sync open');$('#pp-share').click();check(!$('#pp-share-panel').hidden,'Share panel did not open');
 });
 await evaluate("document.querySelector('#pp-share-copy').click(); new Promise(resolve=>setTimeout(resolve,20))");assert.equal(await evaluate('window.__copied'),'https://chromewebstore.google.com/detail/suitecraft-for-netsuite/hpcgajocaokahoibhmiofdjdjnnielka');
 await client.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});assert.equal(await evaluate("document.querySelector('#pp-share-panel').hidden"),true);
 // File Cabinet mirrors the extension's type choice and numeric-ID navigation.
 const verifyPopupCabinet=()=>{
  const $=s=>document.querySelector(s),check=(ok,message)=>{if(!ok)throw Error(message);};
  const choose=label=>[...$('#pp-record-types').children].find(b=>b.textContent===label).click();
  const submit=value=>{$('#pp-record-id').value=value;$('#pp-find-form').requestSubmit();};
  $('#popup-reset').click();$('[data-popup-scene="find"]').click();
  check($('#pp-record-types').children.length===9,'File Cabinet category missing');
  check(getComputedStyle($('#pp-cabinet-types')).display==='none','Cabinet choices visible for Transaction');
  choose('File Cabinet');
  check(!$('#pp-cabinet-types').hidden&&$('#pp-cabinet-types').children.length===2,'File/Folder choices missing');
  check($('#pp-record-id-label').textContent==='Internal ID'&&$('#pp-record-id').inputMode==='numeric','Cabinet input should request numeric ID');
  check($('#pp-cabinet-types button[aria-pressed="true"]').textContent==='File','File must be selected by default');
  submit('123');check(!$('#pp-record-result').hidden&&$('#pp-record-result strong').textContent==='Sample File','File preview missing');
  $('#pp-cabinet-types button:last-child').click();check($('#pp-record-result').hidden,'Type change retains stale result');
  submit('456');check($('#pp-record-result strong').textContent==='Sample Folder'&&$('#pp-record-result').textContent.includes('Internal ID: 456'),'Folder preview incorrect');
  for(const value of ['0','-1','folder name','42&foo=bar']){submit(value);check($('#pp-record-result').hidden&&$('#pp-status').textContent.includes('positive numeric Internal ID'),'Invalid Cabinet ID was accepted: '+value);}
  choose('Transaction');check(getComputedStyle($('#pp-cabinet-types')).display==='none','Cabinet choices did not hide');
  submit('Sample invoice');check($('#pp-record-result').textContent.includes('Sample invoice'),'Record name lookup regressed');
  $('#popup-reset').click();check($('#pp-record-id').value===''&&$('#pp-record-result').hidden&&$('#pp-cabinet-types').hidden,'Popup reset did not clear Cabinet state');
  $('[data-popup-scene="find"]').click();choose('File Cabinet');
  check($('#pp-cabinet-types button[aria-pressed="true"]').textContent==='File','Reset retained Folder selection');
  const buttons=[...$('#pp-cabinet-types').children].map(n=>n.getBoundingClientRect());
  check(buttons[0].top===buttons[1].top,'File and Folder should be side by side');
  submit('123');
 };
 await run(verifyPopupCabinet);
 if(screenshotDir){await mkdir(screenshotDir,{recursive:true});await capture('popup-file-cabinet-desktop.png','#popup-demo .popup-shell');}
 await run(()=>document.querySelector('#popup-reset').click());
 const verifyPopupQuickSync=async()=>{
  const $=s=>document.querySelector(s),check=(ok,message)=>{if(!ok)throw Error(message);};
  $('#popup-reset').click();$('#pp-quick-sync').click();
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  check(!$('#pp-sync-panel').hidden&&$('#pp-quick-sync').getAttribute('aria-expanded')==='true','Quick Sync did not expand');
  check($('.pp-body').scrollTop===0,'Quick Sync scrolled its entry point out of view');
  check($('#pp-sync-status').textContent==='Progress opens in Workspace.','Quick Sync progress hint differs from popup');
  check(!$('#pp-sync-panel').textContent.includes('Latest saved sync'),'Quick Sync shows obsolete sample statistics');
  const start=$('#pp-sync-start'),workspace=$('#pp-sync-workspace'),left=start.getBoundingClientRect(),right=workspace.getBoundingClientRect();
  check(start.textContent==='Start sync'&&left.right<right.left&&Math.abs((left.top+left.bottom)-(right.top+right.bottom))<3,'Quick Sync actions must be compact and on opposite sides of one row');
  start.click();check(!$('#workspace-panel-sync').hidden&&$('#ms-state').textContent.includes('complete'),'Start sync did not start the Workspace simulation');
  $('#pp-quick-sync').click();check($('#pp-sync-panel').hidden&&$('#pp-quick-sync').getAttribute('aria-expanded')==='false','Quick Sync did not collapse');
  $('#pp-quick-sync').click();
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 };
 await run(verifyPopupQuickSync);
 if(screenshotDir)await capture('popup-quick-sync-desktop.png','#popup-demo .popup-shell');
 await run(()=>document.querySelector('#popup-reset').click());
 // Non-reduced motion: cancelling and leaving the tab stop work and unlock settings.
 await client.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await run(()=>{const $=s=>document.querySelector(s);$('#workspace-tab-sync').click();$('#ms-start').click();if(!$('#ms-speed').disabled)throw Error('Running sync did not lock settings');$('#ms-cancel').click();if($('#ms-speed').disabled||!$('#ms-state').textContent.includes('cancelled'))throw Error('Cancel did not unlock settings');$('#ms-start').click();$('#workspace-tab-lists').click();if(!$('#ms-state').textContent.includes('paused'))throw Error('Leaving sync did not stop simulation');});
 await client.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 // Every gallery image loads, stays inside the shared frame and opens in full size.
 assert.equal(await evaluate("document.querySelectorAll('#tour-tabs button').length"),14,'Gallery slide count');
 for(let index=0;index<14;index++){
  const view=await evaluate(`(async()=>{showTourSlide(${index});document.querySelector('#tour-media').scrollIntoView({block:'center'});const image=document.querySelector('#tour-image');image.loading='eager';await image.decode();const frame=document.querySelector('#tour-media').getBoundingClientRect(),bounds=image.getBoundingClientRect();return {width:image.naturalWidth,height:image.naturalHeight,ratio:frame.width/frame.height,inside:bounds.left>=frame.left&&bounds.right<=frame.right&&bounds.top>=frame.top&&bounds.bottom<=frame.bottom};})()`);
  assert.ok(view.width>0&&view.height>0,'Gallery image '+index+' failed to load');assert.ok(view.inside,'Gallery image '+index+' is cropped');assert.ok(Math.abs(view.ratio-1.6)<.01,'Gallery frame is not 16:10: '+JSON.stringify(view));
 }
 await run(()=>{document.querySelector('#tour-media').click();if(!document.querySelector('#screenshot-dialog').open)throw Error('Full-size screenshot did not open');document.querySelector('#close-screenshot').click();});
 if(screenshotDir){await mkdir(screenshotDir,{recursive:true});for(const [index,name] of [[0,'gallery-popup.png'],[2,'gallery-lists.png'],[8,'gallery-compare.png'],[13,'gallery-note.png']]){await evaluate(`showTourSlide(${index});document.querySelector('#tour-image').decode()`);await capture(name,'#tour .tour-frame');}}
 // Capture both themes, all changed modules and the compact popup.
 if(screenshotDir){await mkdir(screenshotDir,{recursive:true});for(const scene of ['lists','favorites','plans','compare','sync','popup']){await evaluate(`document.querySelector('#workspace-demo').dataset.theme='light';document.querySelector('#workspace-tab-${scene==='popup'?'lists':scene}').click();document.querySelector('#workspace-demo [data-demo-play]').click();document.querySelector('#popup-reset').click();`);const selector=scene==='popup'?'.popup-shell':'#workspace-demo [data-demo-surface]';await capture(scene+'.png',selector);if(scene==='lists'){await evaluate("document.querySelector('#workspace-demo').dataset.theme='dark'");await capture('lists-dark.png',selector);await evaluate("document.querySelector('#workspace-demo').dataset.theme='light'");}}}
 async function capture(name,selector){const box=await evaluate(`(()=>{const n=document.querySelector(${JSON.stringify(selector)});n.scrollIntoView({block:'start'});const r=n.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:Math.min(r.height,1500),scale:1};})()`);const result=await client.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:box});await writeFile(resolve(screenshotDir,name),Buffer.from(result.data,'base64'));}
 // The popup home must expose every category without an internal scrollbar.
 await client.call('Emulation.setDeviceMetricsOverride',{width:1600,height:1100,deviceScaleFactor:1,mobile:false});
 await run(()=>{document.querySelector('#popup-reset').click();const body=document.querySelector('.pp-body'),tiles=[...document.querySelectorAll('.pp-record-tiles .pp-tool')].map(n=>n.getBoundingClientRect());if(body.scrollHeight>body.clientHeight+1)throw Error('Popup demo home scrolls');if(tiles.length!==2||tiles[0].top!==tiles[1].top)throw Error('Record tools are not side by side');});
 // Mobile should scroll tables locally, without widening the entire demo/page.
 await client.call('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:false});
 await run(verifyPopupCabinet);
 assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+2'),'File Cabinet causes mobile page overflow');
 if(screenshotDir)await capture('popup-file-cabinet-mobile.png','#popup-demo .popup-shell');
 await run(()=>document.querySelector('#popup-reset').click());
 await run(verifyPopupQuickSync);
 assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+2'),'Quick Sync causes mobile page overflow');
 if(screenshotDir)await capture('popup-quick-sync-mobile.png','#popup-demo .popup-shell');
 await run(()=>document.querySelector('#popup-reset').click());
 for(const scene of ['lists','favorites','plans','compare','sync']){await evaluate(`document.querySelector('#workspace-tab-${scene}').click()`);await pause(50);const dimensions=await evaluate("({page:document.documentElement.scrollWidth,viewport:innerWidth,demo:document.querySelector('#workspace-demo').getBoundingClientRect().width,body:document.querySelector('#workspace-demo .mini-demo:not([hidden])')?.getBoundingClientRect().width})");assert.ok(dimensions.page<=dimensions.viewport+2,scene+' causes page overflow: '+JSON.stringify(dimensions));if(screenshotDir&&['lists','plans','compare'].includes(scene))await capture(scene+'-mobile.png','#workspace-demo [data-demo-surface]');}
 await run(()=>{document.querySelector('#workspace-tab-lists').click();document.querySelector('#workspace-demo [data-demo-expand]').click();if(!document.querySelector('.catalogue-demo-dialog[open]'))throw Error('Expanded Workspace missing');document.querySelector('.catalogue-demo-dialog').close();});
 await evaluate("showTourSlide(13);document.querySelector('#tour-image').decode()");const mobileGallery=await evaluate("(()=>{const f=document.querySelector('#tour-media').getBoundingClientRect();return f.width/f.height;})()");assert.ok(Math.abs(mobileGallery-1.6)<.01,'Mobile gallery ratio changed');
 assert.deepEqual(errors,[],'Browser runtime errors');
 console.log('PASS Live demos: list library/columns/pagination, grouped favorites/notes, plan types/create/status/reset, directional compare, sync simulation, popup share/Quick Sync/File Cabinet, expanded view, dark theme, 390px layouts and all 14 gallery images in 16:10 frames.');
}finally{client?.close();if(chrome&&chrome.exitCode===null){const exited=new Promise(resolve=>chrome.once('exit',resolve));chrome.kill();await Promise.race([exited,pause(2000)]);}await new Promise(resolve=>server.close(resolve));await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100});}
