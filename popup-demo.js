(()=>{
 const root=document.querySelector('#popup-demo');if(!root)return;
 const $=s=>root.querySelector(s), status=$('#pp-status'), body=$('.pp-body');
 const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
 const types=['Transaction','Entity','Item','Custom Record','Custom Field','Saved Search','Script','Inventory Number','File Cabinet'];let type=types[0],cabinetType='File';
 const fixtures=[{name:'Approval Guard',id:'customscript_approval_guard',internal:'401',type:'Script',note:'Review before release.'},{name:'Approval Required',id:'custbody_approval_required',internal:'101',type:'Field',note:'Approval checkbox.'},{name:'Invoice Approval',id:'customworkflow_invoice_approval',internal:'501',type:'Workflow',note:'Production approval process.'}];
 const favorites=[fixtures[0],{name:'Project Register',id:'customrecord_project_register',internal:'201',type:'Custom record',note:'Project configuration.'},fixtures[2]];
 const lists={delivery:[['Email','11'],['Customer portal','12'],['Printed document','13']],status:[['Planned','21'],['In progress','22'],['Completed','23']]};
 const defaultSaved=()=>[{value:'customrecord_project_register',name:'Project Register',pinned:true,at:3},{value:'customrecord_integration_log',name:'Integration Log',pinned:false,at:2},{value:'218',name:'Sample type #218',pinned:false,at:1}];
 let saved=defaultSaved(),clock=10;const validType=/^(?:[1-9]\d*|customrecord_[a-z0-9_]+)$/i;
 const announce=text=>status.textContent=text;
 function orderedSaved(){const newest=(a,b)=>b.at-a.at;return [...saved.filter(i=>i.pinned).sort(newest),...saved.filter(i=>!i.pinned).sort(newest).slice(0,8)]}
 function renderSaved(){
  const box=$('#pp-saved'),items=orderedSaved();box.replaceChildren();box.hidden=type!=='Custom Record'||!items.length;if(box.hidden)return;
  box.append(node('span','Pinned and recent','pp-saved-title'));
  items.forEach(item=>{
   const row=node('div',undefined,'pp-saved-row'+(item.pinned?' pinned':'')),use=node('button',undefined,'pp-saved-use'),pin=node('button',undefined,'pp-saved-pin'),remove=node('button',undefined,'pp-saved-remove');
   use.type=pin.type=remove.type='button';use.append(node('strong',item.name||item.value));if(item.name)use.append(node('small',item.value));
   use.addEventListener('click',()=>{$('#pp-custom-type').value=item.value;$('#pp-record-id').focus()});
   pin.title=pin.ariaLabel=(item.pinned?'Unpin type: ':'Pin type: ')+(item.name||item.value);pin.setAttribute('aria-pressed',String(item.pinned));pin.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4h6M10 4v6l-2.5 4h9L14 10V4M12 14v6"/></svg>';
   pin.addEventListener('click',()=>{if(!item.pinned&&saved.filter(i=>i.pinned).length>=12){announce('Pin limit reached. Unpin a type first.');return}item.pinned=!item.pinned;renderSaved()});
   remove.title=remove.ariaLabel='Remove from list: '+(item.name||item.value);remove.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>';
   remove.addEventListener('click',()=>{saved=saved.filter(i=>i!==item);renderSaved()});
   row.append(use,pin,remove);box.append(row)});
 }
 function rememberType(value){const known=saved.find(i=>i.value.toLowerCase()===value.toLowerCase());if(known)known.at=++clock;else saved.push({value,name:'',pinned:false,at:++clock});renderSaved()}
 async function copy(value){try{await navigator.clipboard.writeText(value);announce('Copied sample value: '+value)}catch{announce('Sample value to copy: '+value)}}
 function markScene(key){root.querySelectorAll('[data-popup-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.popupScene===key)))}
 function showScene(key){$('#pp-sync-panel').hidden=key!=='sync';$('#pp-quick-sync').setAttribute('aria-expanded',String(key==='sync'));root.querySelectorAll('[data-popup-panel]').forEach(p=>p.open=p.dataset.popupPanel===key);markScene(key);if(key==='home'){body.scrollTo({top:0,behavior:'instant'});return}const panel=key==='sync'?$('#pp-sync-panel'):root.querySelector(`[data-popup-panel="${key}"]`);requestAnimationFrame(()=>{body.scrollTo({top:key==='sync'?0:panel.offsetTop-body.offsetTop-8,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});announce('Try '+root.querySelector(`[data-popup-scene="${key}"] strong`).textContent+'. Fictional sample data.');}
 root.querySelectorAll('[data-popup-scene]').forEach(b=>b.addEventListener('click',()=>showScene(b.dataset.popupScene)));
 root.querySelectorAll('[data-popup-panel]').forEach(p=>p.addEventListener('toggle',()=>{if(p.open){$('#pp-sync-panel').hidden=true;$('#pp-quick-sync').setAttribute('aria-expanded','false');root.querySelectorAll('[data-popup-panel]').forEach(other=>{if(other!==p)other.open=false});markScene(p.dataset.popupPanel)}else if(!root.querySelector('details[open]'))markScene('home')}));
 function renderTypes(){
  const group=$('#pp-record-types');group.replaceChildren();
  types.forEach(value=>{const b=node('button',value);b.type='button';b.setAttribute('aria-pressed',String(type===value));b.addEventListener('click',()=>{type=value;renderTypes();$('#pp-record-result').hidden=true;$('#pp-record-id').focus()});group.append(b)});
  const cabinet=$('#pp-cabinet-types'),isCabinet=type==='File Cabinet';cabinet.hidden=!isCabinet;cabinet.replaceChildren();
  ['File','Folder'].forEach(value=>{const b=node('button',value);b.type='button';b.setAttribute('aria-pressed',String(cabinetType===value));b.addEventListener('click',()=>{cabinetType=value;renderTypes();$('#pp-record-result').hidden=true;$('#pp-record-id').focus()});cabinet.append(b)});
  $('#pp-custom-wrap').hidden=type!=='Custom Record';renderSaved();
  $('#pp-record-id-label').textContent=isCabinet?'Internal ID':'Internal ID or exact name';
  $('#pp-record-help').textContent=isCabinet?'Choose File or Folder, enter its Internal ID and press Enter.':type==='Custom Record'?'Enter the type Internal ID or choose its Script ID. Then enter the entry Internal ID or exact name.':'Press Enter to preview a fictional record.';
  $('#pp-record-id').inputMode=isCabinet?'numeric':'text';
 }
 $('#pp-find-form').addEventListener('submit',event=>{
  event.preventDefault();const query=$('#pp-record-id').value.trim(),isCabinet=type==='File Cabinet',result=$('#pp-record-result');
  result.hidden=true;
  if(isCabinet&&!/^[1-9]\d*$/.test(query)){announce('Choose File or Folder and enter a positive numeric Internal ID.');return}
  if(!query){announce('Enter an ID or name to preview a sample record.');return}
  const customType=$('#pp-custom-type').value.trim();
  if(type==='Custom Record'&&!validType.test(customType)){announce('Enter the Custom Record Type as a numeric ID or a customrecord_ Script ID.');return}
  const label=isCabinet?cabinetType:type;
  result.replaceChildren(node('strong','Sample '+label),node('p',(isCabinet?'Internal ID: ':'Entered ID / name: ')+query),node('p','Northstar sample account · Preview only'));if(type==='Custom Record'){result.querySelector('p').textContent+=' · Type: '+customType;rememberType(customType)}result.hidden=false;
  announce('Sample '+label+' preview shown. No NetSuite '+(isCabinet?'file or folder':'record')+' was opened.');
 });
 function resultCard(item,onClick){const card=node('button',undefined,'pp-result-card');card.type='button';card.append(node('strong',item.name),node('code',item.id),node('small',item.type));card.addEventListener('click',onClick);return card}
 function renderCustom(){const q=$('#pp-custom-search').value.trim().toLowerCase(),category=$('#pp-category').value,filtered=fixtures.filter(x=>(category==='all'||x.type===category)&&[x.name,x.id,x.internal].join(' ').toLowerCase().includes(q));const box=$('#pp-custom-results');box.replaceChildren();filtered.forEach(item=>box.append(resultCard(item,()=>{announce(`${item.name} · Internal ID ${item.internal} · ${item.note}`);box.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.textContent.includes(item.id)))})));if(!filtered.length)box.append(node('p','No matches. Try “approval” or another category.'))}
 function renderLists(){const q=$('#pp-list-search').value.trim().toLowerCase(),all=lists[$('#pp-list').value],filtered=all.filter(x=>x.join(' ').toLowerCase().includes(q)),box=$('#pp-list-results');box.replaceChildren();$('#pp-list-status').textContent=filtered.length?`Showing ${filtered.length} of ${all.length}.`:'No matching results.';filtered.forEach(([name,id])=>{const row=node('div',undefined,'pp-list-row'),copyButton=node('button','#'+id);copyButton.type='button';copyButton.title='Copy ID';copyButton.setAttribute('aria-label','Copy sample ID '+id+' for '+name);copyButton.addEventListener('click',()=>copy(id));row.append(node('strong',name),copyButton);box.append(row)})}
 function renderFavorites(){const q=$('#pp-favorite-search').value.trim().toLowerCase(),type=$('#pp-favorite-type').value,filtered=favorites.filter(x=>(type==='all'||x.type===type)&&[x.name,x.id,x.note].join(' ').toLowerCase().includes(q)),box=$('#pp-favorite-results');box.replaceChildren();$('#pp-favorite-status').textContent=filtered.length?`${filtered.length} favorites shown.`:'No matching favorites.';filtered.forEach(item=>{const card=resultCard(item,()=>announce(item.name+' · Private sample note: '+item.note));card.append(node('small','northstar-sandbox'));box.append(card)})}
 $('#pp-category').addEventListener('change',renderCustom);$('#pp-custom-search').addEventListener('input',renderCustom);$('#pp-list').addEventListener('change',renderLists);$('#pp-list-search').addEventListener('input',renderLists);$('#pp-favorite-type').addEventListener('change',renderFavorites);$('#pp-favorite-search').addEventListener('input',renderFavorites);
 $('#pp-open-lists').addEventListener('click',()=>{document.querySelector('#workspace-tab-lists').click();document.querySelector('#workspace').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});
 $('#pp-open-favorites').addEventListener('click',()=>announce('Sample: this opens all Favorites in Workspace.'));
 $('#pp-update-lists').addEventListener('click',()=>{renderLists();announce('Sample lists refreshed. No account was contacted.')});
 $('#pp-record-explorer').addEventListener('click',()=>openScreenshot('assets/screenshots/03-record-explorer.png','Record Explorer'));
 $('#pp-inspector').addEventListener('click',()=>openScreenshot('assets/screenshots/07-script-workflow-inspector.png','Script & Workflow Inspector'));
 $('#pp-settings').addEventListener('click',()=>openScreenshot('assets/screenshots/11-settings.png','Settings'));
 const urls={system:'https://northstar-sandbox.app.netsuite.com/app/common/entity/custjob.nl?id=123',debugger:'https://northstar-sandbox.debugger.netsuite.com/app/common/entity/custjob.nl?id=123'};
 root.querySelectorAll('[data-pp-url]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.ppUrl,mode=key.includes('debugger')?'debugger':'system';if(key.startsWith('copy-'))copy(urls[mode]);else{$('#pp-url').value=urls[mode];announce('Sample URL switched to '+mode+'. No navigation performed.')}}));
 const share=$('#pp-share'),sharePanel=$('#pp-share-panel');
 function closeShare(){sharePanel.hidden=true;share.setAttribute('aria-expanded','false');}
 share.addEventListener('click',()=>{sharePanel.hidden=!sharePanel.hidden;share.setAttribute('aria-expanded',String(!sharePanel.hidden));$('#pp-share-status').textContent='';if(!sharePanel.hidden)$('#pp-share-copy').focus();});
 document.addEventListener('click',event=>{if(!sharePanel.hidden&&!sharePanel.contains(event.target)&&!share.contains(event.target))closeShare();});
 document.addEventListener('focusin',event=>{if(!sharePanel.hidden&&!sharePanel.contains(event.target)&&!share.contains(event.target))closeShare();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!sharePanel.hidden){event.preventDefault();closeShare();share.focus();}});
 $('#pp-share-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(sharePanel.querySelector('a').href);$('#pp-share-status').textContent='Link copied';}catch{$('#pp-share-status').textContent='Open Chrome Web Store to copy its address.';}});
 $('#pp-quick-sync').addEventListener('click',()=>showScene($('#pp-sync-panel').hidden?'sync':'home'));
 function workspaceSync(start=false){document.querySelector('#workspace-tab-sync').click();document.querySelector('#workspace').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});if(start)document.querySelector('#ms-start').click();announce(start?'Sample sync started in Workspace. No account is contacted.':'Synchronization settings opened in the Workspace demo.');}
 $('#pp-sync-start').addEventListener('click',()=>workspaceSync(true));$('#pp-sync-workspace').addEventListener('click',()=>workspaceSync());
 $('#popup-reset').addEventListener('click',()=>{closeShare();type=types[0];cabinetType='File';renderTypes();$('#pp-record-id').value='';$('#pp-custom-type').value='';saved=defaultSaved();renderSaved();$('#pp-record-result').hidden=true;$('#pp-category').value='all';$('#pp-custom-search').value='';$('#pp-list').value='delivery';$('#pp-list-search').value='';$('#pp-favorite-type').value='all';$('#pp-favorite-search').value='';$('#pp-url').value=urls.system;renderCustom();renderLists();renderFavorites();showScene('home');announce('Popup demo reset. Choose a scene or explore the menu.')});
 renderTypes();renderCustom();renderLists();renderFavorites();
})();
