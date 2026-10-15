const imageDialog=document.querySelector('#screenshot-dialog');
function openScreenshot(src,title){
  const image=document.querySelector('#screenshot-image');image.src=src;image.alt=`SuiteCraft ${title} using fictional sample data`;
  document.querySelector('#screenshot-title').textContent=title;
  document.querySelector('#screenshot-original').href=src;
  imageDialog.showModal();
}
document.querySelectorAll('.screenshot-open').forEach(button=>button.addEventListener('click',()=>openScreenshot(button.dataset.image,button.dataset.title)));
const tourMedia=document.querySelector('#tour-media');
function enlargeTour(){openScreenshot(document.querySelector('#tour-image').getAttribute('src'),document.querySelector('#tour-title').textContent)}
tourMedia.addEventListener('click',enlargeTour);
tourMedia.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();enlargeTour()}});
document.querySelector('#close-screenshot').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('click',event=>{if(event.target===imageDialog){const rect=imageDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)imageDialog.close()}});

const workspaceTabs=[...document.querySelectorAll('[data-workspace-tab]')];
const workspaceDemo=document.querySelector('#workspace-demo');
function activateWorkspace(key){
  for(const tab of workspaceTabs){const active=tab.dataset.workspaceTab===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.querySelector(`#workspace-panel-${tab.dataset.workspaceTab}`).hidden=!active}
  if(key!=='catalogue'){
    workspaceDemo.querySelector('[data-demo-search]').dispatchEvent(new Event('focus'));
    workspaceDemo.querySelector('[data-demo-caption]').textContent='Try the controls. All changes are temporary and use fictional sample data.';
  }
  workspaceDemo.dispatchEvent(new CustomEvent('workspace-change',{detail:key}));
}
workspaceTabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>activateWorkspace(tab.dataset.workspaceTab));
  tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%workspaceTabs.length;if(event.key==='ArrowLeft')next=(index+workspaceTabs.length-1)%workspaceTabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=workspaceTabs.length-1;if(next!==undefined){event.preventDefault();activateWorkspace(workspaceTabs[next].dataset.workspaceTab);workspaceTabs[next].focus()}});
});
workspaceDemo.addEventListener('show-catalogue',()=>activateWorkspace('catalogue'));

document.querySelectorAll('#tour-tabs [role=tab]').forEach((tab,index)=>{tab.id=`product-slide-${index}`;tab.setAttribute('aria-controls','tour-media')});
showTourSlide(0);
