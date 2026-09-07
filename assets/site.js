const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#site-nav');
menuButton?.addEventListener('click',()=>{
	const open=menu.classList.toggle('open');
	menuButton.setAttribute('aria-expanded',String(open));
});
menu?.addEventListener('click',event=>{
	if(event.target.closest('a')){menu.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');}
});
document.querySelector('#year').textContent=String(new Date().getFullYear());

const tourSlides=[
	{tab:'Overview',kicker:'WORKSPACE OVERVIEW',title:'One toolkit for exploring, comparing and organizing NetSuite customizations.',description:'Move from a quick popup search to deeper account inspection without losing the context of your current work.',points:['Quick access from any NetSuite page','One workspace for catalogue, favorites, compare and sync','Local-first by design'],overview:true,step:1},
	{tab:'Popup',kicker:'QUICK ACCESS',title:'Your daily tools, one click away.',description:'Search the current account, open the Workspace and use developer actions from the SuiteCraft popup.',points:['Search local snapshots','Open account Favorites','Copy or switch System and Debugger URLs'],image:'01-quick-access.png',step:1},
	{tab:'Catalogue',kicker:'CUSTOMIZATION CATALOGUE',title:'Find the right object in seconds.',description:'Search by name or Script ID, combine filters and inspect the selected object without leaving the catalogue.',points:['Account and category filters','Direct NetSuite links','Favorites and SDF actions'],image:'02-catalogue.png',step:2},
	{tab:'Record Object',kicker:'RECORD INSPECTION',title:'Understand the record in front of you.',description:'Inspect body fields and sublists using the actual record viewer, populated here from a synthetic NetSuite XML record.',points:['Custom and native field filters','Body and sublist inspection','Visible JSON, TSV and CSV export'],image:'03-record-object.png',step:3},
	{tab:'Compare',kicker:'SNAPSHOT COMPARISON',title:'See what changed between accounts.',description:'Compare environments or historical versions and inspect differences property by property.',points:['Added, removed and changed statuses','Script ID matching across accounts','Level 2 SDF comparison'],image:'04-compare.png',step:4},
	{tab:'Sync',kicker:'LOCAL SNAPSHOTS',title:'Refresh metadata only when you choose.',description:'Use the signed-in NetSuite connection to synchronize selected categories and retain versioned local snapshots.',points:['Manual, category-based synchronization','Optional workflow and record details','Version history and cleanup'],image:'05-synchronization.png',step:5},
	{tab:'Favorites',kicker:'ACCOUNT FAVORITES',title:'Keep important NetSuite objects close.',description:'Save frequently used records and customizations with private notes scoped to the relevant account.',points:['Grouped by object type','Account, type and text filters','Direct links back to NetSuite'],image:'06-favorites.png',step:6}
];
const tour={media:document.querySelector('#tour-media'),overview:document.querySelector('#tour-overview'),image:document.querySelector('#tour-image'),number:document.querySelector('#tour-number'),kicker:document.querySelector('#tour-kicker'),title:document.querySelector('#tour-title'),description:document.querySelector('#tour-description'),points:document.querySelector('#tour-points'),tabs:document.querySelector('#tour-tabs'),previous:document.querySelector('#tour-previous'),next:document.querySelector('#tour-next'),fullscreen:document.querySelector('#tour-fullscreen')};
let activeTourSlide=0;
for(const [index,slide] of tourSlides.entries()){
	const button=document.createElement('button');button.type='button';button.role='tab';button.innerHTML=`<span>${String(index+1).padStart(2,'0')}</span><strong>${slide.tab}</strong>`;button.onclick=()=>showTourSlide(index);tour.tabs.append(button);
}
function showTourSlide(index){
	activeTourSlide=Math.max(0,Math.min(tourSlides.length-1,index));const slide=tourSlides[activeTourSlide];
	tour.media.classList.toggle('overview',!!slide.overview);tour.overview.hidden=!slide.overview;tour.image.hidden=!!slide.overview;
	if(slide.image){tour.image.src=`assets/screenshots/${slide.image}`;tour.image.alt=`SuiteCraft ${slide.tab} interface using synthetic data`;}
	tour.number.textContent=`${String(activeTourSlide+1).padStart(2,'0')} / ${String(tourSlides.length).padStart(2,'0')}`;tour.kicker.textContent=slide.kicker;tour.title.textContent=slide.title;tour.description.textContent=slide.description;tour.points.replaceChildren(...slide.points.map(value=>{const item=document.createElement('li');item.textContent=value;return item;}));tour.fullscreen.href=`demo.html?step=${slide.step}`;
	for(const [buttonIndex,button] of [...tour.tabs.children].entries()){const active=buttonIndex===activeTourSlide;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}
	tour.previous.disabled=activeTourSlide===0;tour.next.disabled=activeTourSlide===tourSlides.length-1;
}
tour.previous.onclick=()=>showTourSlide(activeTourSlide-1);tour.next.onclick=()=>showTourSlide(activeTourSlide+1);
tour.media.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showTourSlide(activeTourSlide-1);}if(event.key==='ArrowRight'){event.preventDefault();showTourSlide(activeTourSlide+1);}});
tour.tabs.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();showTourSlide(activeTourSlide+(event.key==='ArrowRight'?1:-1));tour.tabs.children[activeTourSlide].focus();});
showTourSlide(0);
// Images in the product tour affect layout after the browser's initial anchor
// jump. Re-align direct #tour links once those local assets are ready.
window.addEventListener('load',()=>{if(location.hash==='#tour')requestAnimationFrame(()=>document.querySelector('#tour').scrollIntoView());});
