// This page uses native details so release notes work without JavaScript.
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
function openLinkedRelease(){
	const entry=document.getElementById(location.hash.slice(1));
	if(!entry?.matches('details.release-entry'))return;
	entry.open=true;
	entry.scrollIntoView({block:'start'});
}
window.addEventListener('hashchange',openLinkedRelease);
window.addEventListener('load',openLinkedRelease);
