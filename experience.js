(()=>{
 const header=document.querySelector('.site-header');let queued=false;
 function updateHeader(){header.classList.toggle('is-compact',scrollY>55);queued=false}
 window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateHeader)}},{passive:true});updateHeader();
 const tip=document.createElement('div');tip.id='sc-context-help';tip.className='sc-tooltip';tip.role='tooltip';tip.hidden=true;document.body.append(tip);
 let target=null,showTimer=null,hideTimer=null;
 const workspace={catalogue:['Catalogue','Search saved customizations by account, category, name or Script ID. Select a result to inspect its details.'],lists:['Lists & reference data','Find saved list values, copy Internal IDs and export the filtered sample list.'],favorites:['Favorites','Keep important objects close. Select a favorite to view its note or try editing it.'],plans:['Change Plans','Organize a release checklist, update item statuses and see how readiness changes.'],compare:['Compare snapshots','Find added, removed and changed objects, then inspect their property differences.'],sync:['Synchronization','Choose categories and watch a sample sync. The demo does not download real account data.']};
 const tools={search:['SuiteCraft Search','Search menus, fields on this page and saved Workspace data from the SC menu.'],explorer:['Record Explorer','Inspect field IDs and values. Search, filter native or custom fields and pin useful results.'],inspector:['Script & Workflow Inspector','Explore scripts and workflows applicable to the record type, plus their statuses and entry points.'],plan:['Add to Change Plan','Keep this record as a supporting reference in a sample plan, with a status and notes.'],favorite:['Favorites & notes','Save this sample record and a private note about why it matters.']};
 const scenes={home:['Your starting point','Explore the SuiteCraft popup, with shortcuts to Workspace and everyday record tools.'],find:['Quick find record','Choose a record type and enter an ID or exact name. This demo shows a fictional record preview.'],custom:['Search customizations','Filter the local catalogue and find a sample customization by name, Script ID or Internal ID.'],lists:['Search list values','Search saved options and copy an Internal ID without opening a separate list page.'],favorites:['Favorites','Find saved objects by type, name or note. Select a result to see its sample note.'],urls:['System & Debugger','Copy the two sample URL variants or switch the URL shown in this demo.']};
 const ids={
 'op-native-history':['Recent Records','Preview the most recently viewed sample record.'], 'op-native-home':['Home','Return the on-page demo to its starting state.'],
 'op-reset':['Reset this demo','Clear sample notes, pins and selections, and close the active record tool.'], 'popup-reset':['Reset popup','Collapse the popup panels and restore the initial sample searches.'],
 'pp-record-explorer':tools.explorer,'pp-inspector':tools.inspector,'pp-settings':['Settings','View the actual SuiteCraft Settings screen with fictional sample data.'],
 'pp-open-lists':['Open all lists','Jump to the interactive Lists tab in the Workspace demo.'], 'pp-update-lists':['Update sample lists','Refresh the values displayed in this isolated popup preview.'],
 'ml-export':['Export CSV','Download the currently filtered list of fictional values as a CSV file.'], 'mp-export':['Export plan','Download this sample checklist, including each item’s status, as CSV.'],
 'mp-add':['Add a customization','Add Delivery Channels to the sample release checklist.'], 'mc-swap':['Swap snapshots','Reverse the comparison direction. Added and removed objects change sides too.'],
 'ms-start':['Start sample sync','Process the selected fictional categories and follow the simulated progress.'], 'ms-cancel':['Cancel simulation','Stop the running demo without changing any real data.'],
 'op-close':['Close tool','Close this panel and return to the same sample record.'], 'op-close-bottom':['Close tool','Close this panel and return to the same sample record.'],
 'close-screenshot':['Close screenshot','Return to the page. Escape also closes the enlarged screenshot.'], 'tour-previous':['Previous screen','Move to the previous product screen in the tour.'], 'tour-next':['Next screen','Move to the next product screen in the tour.']
 };
 function describe(el){
  if(el.dataset.workspaceTab)return workspace[el.dataset.workspaceTab];
  if(el.dataset.opTool)return tools[el.dataset.opTool];
  if(el.dataset.popupScene)return scenes[el.dataset.popupScene];
  const summary=el.closest('[data-popup-panel]');if(summary&&el.tagName==='SUMMARY')return scenes[summary.dataset.popupPanel];
  if(ids[el.id])return ids[el.id];
  if(el.matches('[data-demo-play]'))return el.textContent.includes('Reset')?['Reset sample demo','Restore the current tab’s initial sample data and selections.']:['Catalogue walkthrough','Follow account selection, category filtering, search and object inspection. You can take over at any point.'];
  if(el.matches('[data-demo-theme]'))return ['Change demo theme','Switch the Workspace preview between light and dark appearance.'];
  if(el.matches('[data-demo-expand]'))return ['Expand Workspace','Open a larger interactive Workspace preview. Escape returns you to the page.'];
  if(el.matches('[data-object]'))return ['Inspect customization','Show this object’s saved identifiers, account context and details alongside the results.'];
  if(el.matches('.screenshot-open,#tour-media'))return ['Enlarge product screen','Inspect the full interface in a larger view, then close it to continue exploring.'];
  if(el.closest('#tour-tabs'))return [el.querySelector('strong')?.textContent||'Product screen','View the real product screen and a short explanation of this feature.'];
  if(el.matches('[data-pp-url]'))return ['System & Debugger',el.dataset.ppUrl.startsWith('copy')?'Copy this fictional URL variant to your clipboard.':'Change the URL shown in this preview. The demo does not navigate to NetSuite.'];
  const text=(el.getAttribute('aria-label')||el.textContent||'').replace(/[↗↻☆★▣⌕⇄]/g,'').replace(/\s+/g,' ').trim();
  if(!text)return null;
  if(el.closest('.site-header')){if(text.includes('Install'))return ['Install extension','Open the SuiteCraft listing in the Chrome Web Store.'];return [text,'Jump to '+text.toLowerCase()+' on this page.']}
  if(el.matches('.mini-item'))return ['Favorite details','View this saved object and its sample private note.'];
  if(el.matches('.pp-result-card'))return ['Saved object','Select this sample object to see its saved details or note below the preview.'];
  if(el.matches('.mini-link'))return ['Inspect differences','Show the saved property values on each side of this comparison.'];
  if(el.closest('.pp-types'))return [text,'Use this record type for the Quick find sample lookup.'];
  if(el.closest('.op-tabs'))return [text,'Limit the current tool to this view while keeping your sample search.'];
  if(text.includes('Copy'))return [text,'Copy the selected sample identifier to your clipboard.'];
  if(text.startsWith('Pin ')||text.startsWith('Unpin '))return [text,'Keep this field easy to find with the Pinned fields filter.'];
  if(text.includes('Save')&&text.includes('note'))return [text,'Update the note in this demo. It resets when the page is reloaded.'];
  if(text.includes('Remove')&&text.includes('favorite'))return [text,'Remove this object from the sample Favorites list.'];
  if(text==='Undo')return ['Restore favorite','Bring the sample favorite back with its note.'];
  if(text.includes('Go to record')||text.includes('Open sample record'))return ['Find a record','Preview a fictional record using the entered name or ID.'];
  if(text.includes('Open in Workspace'))return ['Open in Workspace','Continue in the matching interactive Workspace tab.'];
  if(text.includes('Add to Favorites')||text.includes('Add sample favorite'))return ['Save a favorite','Keep the sample record close and add a note for later.'];
  if(text.includes('Create')&&text.includes('plan'))return ['Create sample plan','Give the sample checklist a name before adding the record reference.'];
  if(text.includes('sample plan')||text.includes('sample reference'))return ['Save plan reference','Add or update this fictional record’s supporting reference in the selected sample plan.'];
  if(el.matches('.op-search-details'))return [text,'Inspect this result in the appropriate sample tool.'];
  if(el.closest('.op-search-snapshot'))return ['Refresh results','Refresh the sample search without connecting to an account.'];
  if(el.closest('.mini-demo,.pp-panel,.op-panel'))return [text,'Try this action using the fictional data in the preview.'];
  return null;
 }
 const selector='#workspace-demo button,#popup-demo button,#popup-demo summary,#onpage-demo button,.site-header nav a,#tour-tabs button,#tour-media,.screenshot-open,.tour-arrows button,#close-screenshot,.catalogue-demo-dialog button';
 function find(el){return el instanceof Element?el.closest(selector):null}
 function hide(){clearTimeout(showTimer);clearTimeout(hideTimer);if(target){const ids=(target.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==tip.id);ids.length?target.setAttribute('aria-describedby',ids.join(' ')):target.removeAttribute('aria-describedby')}target=null;tip.hidden=true}
 function position(){if(!target||!target.isConnected){hide();return}const r=target.getBoundingClientRect(),t=tip.getBoundingClientRect();const below=r.top<t.height+18;const top=below?r.bottom+10:r.top-t.height-10;const left=Math.max(12,Math.min(innerWidth-t.width-12,r.left+r.width/2-t.width/2));tip.style.top=Math.max(10,Math.min(innerHeight-t.height-10,top))+'px';tip.style.left=left+'px';tip.style.setProperty('--tip-x',Math.max(14,Math.min(t.width-14,r.left+r.width/2-left))+'px');tip.dataset.placement=below?'below':'above'}
 function show(el){hide();const content=describe(el);if(!content||!el.isConnected)return;target=el;tip.replaceChildren();const title=document.createElement('strong');title.textContent=content[0];tip.append(title,document.createTextNode(content[1]));const host=el.closest('dialog[open]')||document.body;host.append(tip);el.removeAttribute('title');const previous=(el.getAttribute('aria-describedby')||'').trim();el.setAttribute('aria-describedby',(previous+' '+tip.id).trim());tip.hidden=false;position()}
 function schedule(el,delay=300){clearTimeout(hideTimer);clearTimeout(showTimer);if(el===target)return;showTimer=setTimeout(()=>show(el),delay)}
 document.addEventListener('pointerover',event=>{if(event.pointerType==='touch')return;const el=find(event.target);if(el&&!el.contains(event.relatedTarget))schedule(el)});
 document.addEventListener('pointerout',event=>{const el=find(event.target);if(el&&!el.contains(event.relatedTarget)&&!(el===document.activeElement&&el.matches(':focus-visible')))hideTimer=setTimeout(()=>{if(!(target===document.activeElement&&target?.matches(':focus-visible')))hide()},160)});
 tip.addEventListener('pointerenter',()=>clearTimeout(hideTimer));tip.addEventListener('pointerleave',()=>{if(!(target===document.activeElement&&target?.matches(':focus-visible')))hide()});
 document.addEventListener('focusin',event=>{const el=find(event.target);if(el)show(el)});
 document.addEventListener('focusout',()=>{hideTimer=setTimeout(hide,80)});
 document.addEventListener('click',hide,true);document.addEventListener('keydown',event=>{if(event.key==='Escape')hide()});
 window.addEventListener('scroll',()=>{const focused=find(document.activeElement);if(focused&&focused.matches(':focus-visible')){if(target===focused&&!tip.hidden)position();else schedule(focused,180)}else hide()},{capture:true,passive:true});window.addEventListener('resize',hide);
})();
