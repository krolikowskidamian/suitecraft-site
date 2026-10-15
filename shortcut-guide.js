(()=>{
 const root=document.querySelector('#onpage-demo'),page=root.querySelector('.op-page'),labels=root.querySelector('#op-guide-labels'),toggle=root.querySelector('#op-guide-toggle');
 const launcher=root.querySelector('.op-netsuite-nav>[data-op-tool="search"]'),shortcuts=root.querySelector('.op-shortcuts');let visible=true;
 const marks=[launcher,shortcuts].map((target,index)=>{const mark=document.createElement('div');mark.className='op-guide-ring';mark.setAttribute('aria-hidden','true');const number=document.createElement('span');number.textContent=String(index+1);mark.append(number);page.append(mark);return {target,mark}});
 function position(){const parent=page.getBoundingClientRect();for(const {target,mark} of marks){const rect=target.getBoundingClientRect();mark.style.left=(rect.left-parent.left-5)+'px';mark.style.top=(rect.top-parent.top-5)+'px';mark.style.width=(rect.width+10)+'px';mark.style.height=(rect.height+10)+'px'}}
 function setVisible(value){visible=value;labels.hidden=!value;marks.forEach(({mark})=>mark.hidden=!value);toggle.textContent=value?'Hide shortcuts':'Show shortcuts';toggle.setAttribute('aria-pressed',String(value));if(value)position()}
 toggle.addEventListener('click',()=>{if(!visible){const close=root.querySelector('#op-close');if(!root.querySelector('#op-panel').hidden)close.click()}setVisible(!visible)});
 function clearHighlight(){root.querySelectorAll('.op-tool-highlight').forEach(el=>el.classList.remove('op-tool-highlight'))}
 root.querySelectorAll('.op-scenes [data-op-tool]').forEach(button=>{
  function highlight(){clearHighlight();const key=button.dataset.opTool;const target=key==='search'?launcher:shortcuts.querySelector(`[data-op-tool="${key}"]`);target?.classList.add('op-tool-highlight')}
  button.addEventListener('pointerenter',highlight);button.addEventListener('pointerleave',()=>{if(document.activeElement!==button)clearHighlight()});button.addEventListener('focus',highlight);button.addEventListener('blur',clearHighlight);
 });
 root.addEventListener('click',event=>{if(event.target.closest('[data-op-tool]')){setVisible(false);clearHighlight()}});
 root.querySelector('#op-reset').addEventListener('click',()=>{clearHighlight();setVisible(true)});
 window.addEventListener('resize',position);root.querySelector('.op-netsuite-nav').addEventListener('scroll',position,{passive:true});
 const observer=new ResizeObserver(position);observer.observe(page);observer.observe(shortcuts);document.fonts?.ready.then(position);position();
})();
