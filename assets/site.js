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
 {tab:'Popup menu',kicker:'YOUR TOOLS',title:'The SuiteCraft menu, organized around your work.',description:'Open search, Favorites, record tools and System / Debugger controls from the extension popup.',points:['Quick find record and local search','Contextual record tools','Workspace and settings shortcuts'],image:'01-quick-access.png',compact:true},
 {tab:'Navigation search',kicker:'SUITECRAFT SEARCH',title:'Find menus, fields and local data in one place.',description:'Search menu destinations with their full paths, fields on the current form and local Workspace data. Go to record beside the input carries your ID into the record finder.',points:['All, Menu, This page and Workspace','Locate fields and copy IDs','Favorites, Catalogue and List values filters'],image:'09-navigation-search.png',compact:true},
 {tab:'Lists',kicker:'REFERENCE DATA',title:'Your lookup values, ready when you need them.',description:'Browse standard lists and custom record options in Workspace. Choose the field used as the label and keep each account and role separate.',points:['Standard lists included in main sync','Custom record lists by Script ID or Internal ID','Search, copy and export values'],image:'10-reference-lists.png'},
 {tab:'List synchronization',kicker:'CHOOSE YOUR LISTS',title:'Bring the lists you use into Workspace.',description:'Find lists by name or ID, select what to download and configure custom records as lookup lists.',points:['Compact searchable selection','Selected lists shown first','Field help for custom configurations'],image:'12-list-synchronization.png'},
 {tab:'Settings',kicker:'YOUR SUITECRAFT',title:'Choose your tools and your theme.',description:'Set a light or dark theme across SuiteCraft, explore illustrated feature descriptions and enable the tools you need.',points:['Light and dark modes','Expandable feature help','Dedicated enable and disable switches'],image:'11-settings.png'},
	{tab:'Catalogue',kicker:'CUSTOMIZATION CATALOGUE',title:'Find the right object in seconds.',description:'Search by name or Script ID, combine filters and inspect the selected object without leaving the catalogue.',points:['Account and category filters','Direct NetSuite links','Favorites and SDF actions'],image:'02-catalogue.png',step:2},
	{tab:'Favorites',kicker:'ACCOUNT FAVORITES',title:'Keep important NetSuite objects close.',description:'Save frequently used records and customizations with private notes scoped to the relevant account.',points:['Grouped by object type','Account, type and text filters','Direct links back to NetSuite'],image:'06-favorites.png',step:7},
	{tab:'Change Plans',kicker:'RELEASE PLANNING',title:'Turn a list of changes into a release plan.',description:'Keep the plan summary, progress and item actions clear. Collect structural changes and supporting references, compare them with a target account and prepare practical release notes.',points:['Plan progress and item statuses','Target readiness and supporting references','Notes and Markdown, CSV or JSON exports'],image:'08-change-plans.png',step:8},
	{tab:'Compare',kicker:'SNAPSHOT COMPARISON',title:'See what changed between accounts.',description:'Compare environments or historical versions and inspect meaningful differences property by property.',points:['Added, removed and changed statuses','Stable Script ID matching','Level 2 SDF comparison'],image:'04-compare.png',step:5},
	{tab:'Sync',kicker:'LOCAL SNAPSHOTS',title:'Refresh metadata at the pace you choose.',description:'Choose categories and detail levels, then synchronize through the signed-in NetSuite tab. Use sequential downloads or bounded parallel modes and compare timings within the session.',points:['Default, Quick, Quickest and Turbo','Optional workflow and record details','Session timings and snapshot recovery'],image:'05-synchronization.png',step:6},
	{tab:'Record Explorer',kicker:'RECORD INSPECTION',title:'Understand the record in front of you.',description:'Inspect body fields, sublists and Inventory Detail without losing the context of the NetSuite form.',points:['Native and custom field filters','Session pins and sublist context','JSON and CSV export'],image:'03-record-explorer.png',step:3},
	{tab:'Scripts & workflows',kicker:'SCRIPTED RECORDS',title:'See what is attached to this record type.',description:'Review applicable scripts, deployments and workflows together with the workflow activity available on the current record.',points:['Script and deployment IDs','Entry points, status and ownership','Active workflow and history views'],image:'07-script-workflow-inspector.png',step:4}
];
const tour={media:document.querySelector('#tour-media'),overview:document.querySelector('#tour-overview'),image:document.querySelector('#tour-image'),number:document.querySelector('#tour-number'),kicker:document.querySelector('#tour-kicker'),title:document.querySelector('#tour-title'),description:document.querySelector('#tour-description'),points:document.querySelector('#tour-points'),tabs:document.querySelector('#tour-tabs'),previous:document.querySelector('#tour-previous'),next:document.querySelector('#tour-next'),fullscreen:document.querySelector('#tour-fullscreen')};
let activeTourSlide=0;
for(const [index,slide] of tourSlides.entries()){
	const button=document.createElement('button');button.type='button';button.role='tab';button.innerHTML=`<span>${String(index+1).padStart(2,'0')}</span><strong>${slide.tab}</strong>`;button.onclick=()=>showTourSlide(index);tour.tabs.append(button);
}
function showTourSlide(index){
	activeTourSlide=Math.max(0,Math.min(tourSlides.length-1,index));const slide=tourSlides[activeTourSlide];
	tour.media.classList.toggle('overview',!!slide.overview);tour.overview.hidden=!slide.overview;tour.image.hidden=!!slide.overview;
	tour.media.classList.toggle('compact',!!slide.compact);
	if(slide.image){tour.image.src=`assets/screenshots/${slide.image}`;tour.image.alt=`SuiteCraft ${slide.tab} interface using synthetic data`;}
	tour.number.textContent=`${String(activeTourSlide+1).padStart(2,'0')} / ${String(tourSlides.length).padStart(2,'0')}`;tour.kicker.textContent=slide.kicker;tour.title.textContent=slide.title;tour.description.textContent=slide.description;tour.points.replaceChildren(...slide.points.map(value=>{const item=document.createElement('li');item.textContent=value;return item;}));tour.fullscreen.href=slide.step?`demo.html?step=${slide.step}`:`assets/screenshots/${slide.image}`;
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
