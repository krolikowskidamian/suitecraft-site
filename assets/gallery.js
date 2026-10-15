(function(){
'use strict';
const data=window.SuiteCraftAssets;if(!data)return;
const $=id=>document.getElementById(id),items=data.items,grid=$('asset-grid'),dialog=$('asset-dialog');
const statusLabels={ready:'Gotowe do użycia',brand:'Zestaw marki',source:'Plik źródłowy',variant:'Wariant',preview:'Podgląd projektu',archive:'Archiwum'};
let category='all',visible=items.slice(),current=null,invoker=null;
const formatSize=n=>n>=1048576?(n/1048576).toFixed(2)+' MB':n>=1024?Math.round(n/1024)+' KB':n+' B';
const dims=item=>item.width?`${item.width} × ${item.height}`:'Wymiary w oryginale';
const meta=item=>`${dims(item)} · ${item.format} · ${formatSize(item.bytes)}`;
const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
const image=item=>{const img=node('img');img.src=item.path;img.alt=item.title;img.loading='lazy';img.decoding='async';if(item.width){img.width=item.width;img.height=item.height;}return img;};
const dark=item=>item.path.includes('on-dark');
const cards=new Map();
for(const item of items){
 const article=node('article',null,'asset-card'),preview=node('button',null,'asset-preview'+(dark(item)?' is-dark':''));preview.type='button';preview.setAttribute('aria-label','Powiększ: '+item.title);preview.append(image(item),node('span',item.format,'file-format'));preview.onclick=()=>open(item,preview);
 const copy=node('div',null,'asset-copy'),details=node('p',null,'asset-meta');details.append(node('span',dims(item)),node('span',formatSize(item.bytes)));const links=node('div',null,'asset-links'),original=node('a','Oryginał ↗'),download=node('a','Pobierz ↓');original.href=download.href=item.path;original.target='_blank';original.rel='noopener';download.download=item.path.split('/').pop();links.append(original,download);
 copy.append(node('h2',item.title),details,node('span',statusLabels[item.status]||item.status,'asset-status '+item.status),links);article.append(preview,copy);grid.append(article);cards.set(item.path,article);
}
$('total-assets').textContent=items.length;$('total-size').textContent=formatSize(items.reduce((n,item)=>n+item.bytes,0));
for(const path of ['social/suitecraft-linkedin-banner-1512x256.png','marketing/buy-me-a-coffee/suitecraft-buymeacoffee-cover.png','marketing/chrome-web-store/promo-440x280-current.png']){
 const item=items.find(item=>item.path===path);if(!item)continue;const button=node('button',null,'highlight');button.type='button';button.append(image(item),node('span',item.title+' ↗'));button.onclick=()=>open(item,button);$('highlights').append(button);
}
const filterButtons=[];
for(const group of [{id:'all',label:'Wszystkie'},...data.categories]){
 const button=node('button',group.label);button.type='button';button.setAttribute('aria-pressed',String(group.id==='all'));button.append(node('span',String(group.id==='all'?items.length:items.filter(item=>item.category===group.id).length)));button.onclick=()=>{category=group.id;render();};filterButtons.push({group,button});$('category-filters').append(button);
}
function render(){
 const query=$('asset-search').value.trim().toLocaleLowerCase('pl'),status=$('asset-status').value;
 visible=items.filter(item=>(category==='all'||item.category===category)&&(status==='all'||item.status===status)&&[item.title,item.path,item.categoryLabel,statusLabels[item.status],item.format,item.origin,...item.aliases,...item.usage].join(' ').toLocaleLowerCase('pl').includes(query));
 const sort=$('asset-sort').value;
 if(sort==='name')visible.sort((a,b)=>a.title.localeCompare(b.title,'pl'));else if(sort==='size')visible.sort((a,b)=>b.bytes-a.bytes);else if(sort==='width')visible.sort((a,b)=>(b.width||0)-(a.width||0));
 const shown=new Set(visible.map(item=>item.path));for(const item of items)cards.get(item.path).hidden=!shown.has(item.path);for(const item of visible)grid.append(cards.get(item.path));
 for(const {group,button} of filterButtons)button.setAttribute('aria-pressed',String(category===group.id));
 $('result-count').textContent=`Widoczne: ${visible.length} / ${items.length}`;$('empty-state').hidden=visible.length>0;
}
function updateDialog(){
 $('dialog-title').textContent=current.title;$('dialog-category').textContent=current.categoryLabel+' / '+(statusLabels[current.status]||current.status);$('dialog-meta').textContent=meta(current);$('dialog-path').textContent='assets/'+current.path;$('dialog-origin').textContent=current.origin;
 $('dialog-image').src=current.path;$('dialog-image').alt=current.title;$('dialog-image').parentElement.classList.toggle('is-dark',dark(current));$('dialog-open').href=$('dialog-download').href=current.path;$('dialog-download').download=current.path.split('/').pop();
 const index=visible.indexOf(current);$('dialog-position').textContent=index>=0?`${index+1} / ${visible.length}`:'Wybrana grafika';$('dialog-prev').disabled=$('dialog-next').disabled=visible.length<2;
 history.replaceState(null,'','#'+encodeURIComponent(current.path));
}
function open(item,button){current=item;invoker=button;updateDialog();document.body.classList.add('dialog-open');if(!dialog.open)dialog.showModal();}
function move(offset){const index=visible.indexOf(current);current=visible[index<0?(offset>0?0:visible.length-1):(index+offset+visible.length)%visible.length];if(current)updateDialog();}
$('dialog-close').onclick=()=>dialog.close();$('dialog-prev').onclick=()=>move(-1);$('dialog-next').onclick=()=>move(1);
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}if(event.key==='ArrowRight'){event.preventDefault();move(1);}});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');history.replaceState(null,'',location.pathname+location.search);invoker?.focus();});
$('asset-search').addEventListener('input',render);$('asset-status').addEventListener('change',render);$('asset-sort').addEventListener('change',render);
$('reset-filters').onclick=()=>{category='all';$('asset-search').value='';$('asset-status').value='all';render();$('asset-search').focus();};
$('preview-background').onclick=()=>{const enabled=$('preview-background').getAttribute('aria-pressed')!=='true';$('preview-background').setAttribute('aria-pressed',String(enabled));document.body.dataset.preview=enabled?'dark':'light';};
render();try{const selected=items.find(item=>item.path===decodeURIComponent(location.hash.slice(1)));if(selected)open(selected,cards.get(selected.path).querySelector('button'));}catch{}
})();
