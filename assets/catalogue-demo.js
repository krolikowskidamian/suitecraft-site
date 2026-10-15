/* Standalone marketing scene: fictional data, no extension source or NetSuite requests. */
(()=>{
	const demo=document.querySelector('#workspace-demo');if(!demo)return;
	const $=selector=>demo.querySelector(selector),account=$('[data-demo-account]'),category=$('[data-demo-category]'),search=$('[data-demo-search]'),rows=$('[data-demo-rows]'),detail=$('[data-demo-detail]'),count=$('[data-demo-count]'),empty=$('[data-demo-empty]'),playButton=$('[data-demo-play]'),caption=$('[data-demo-caption]'),status=$('[data-demo-status]'),surface=$('[data-demo-surface]'),cursor=$('.catalogue-demo-cursor'),home=demo.parentElement;
	const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
	const definitions=[
		{key:'approval-script',category:'scripts',type:'User Event Script',name:'Approval Guard',scriptId:'customscript_approval_guard',internalId:'401',description:'Checks approval transitions before a transaction is submitted.',extra:'SuiteScript 2.1'},
		{key:'approval-field',category:'fields',type:'Transaction Body Field',name:'Approval Required',scriptId:'custbody_approval_required',internalId:'101',description:'Indicates whether the transaction needs an additional approval.',extra:'Checkbox'},
		{key:'project-record',category:'records',type:'Custom Record Type',name:'Project Register',scriptId:'customrecord_project_register',internalId:'201',description:'Stores the configuration used by the project automation.',extra:'Custom Record Type'},
		{key:'delivery-list',category:'lists',type:'Custom List',name:'Delivery Channels',scriptId:'customlist_delivery_channels',internalId:'301',description:'Available delivery channels for transaction processing.',extra:'Custom List'},
		{key:'invoice-workflow',category:'workflows',type:'Workflow',name:'Invoice Approval',scriptId:'customworkflow_invoice_approval',internalId:'501',description:'Routes invoices through the configured approval stages.',extra:'Released'},
		{key:'delivery-script',category:'scripts',type:'Scheduled Script',name:'Delivery Schedule',scriptId:'customscript_delivery_schedule',internalId:'402',description:'Prepares the next set of scheduled deliveries.',extra:'SuiteScript 2.1'}
	];
	const objects=['sandbox','production'].flatMap((scope,index)=>definitions.map(object=>({...object,key:scope+'-'+object.key,account:scope,internalId:String(Number(object.internalId)+index*500),role:'Administrator'})));
	let selected=null,controller=null,played=false,dialog=null,expanded=false;
	function node(tag,text,className){const value=document.createElement(tag);if(text!==undefined)value.textContent=text;if(className)value.className=className;return value;}
	function matches(){const terms=search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);return objects.filter(object=>(account.value==='all'||object.account===account.value)&&(category.value==='all'||object.category===category.value)&&terms.every(term=>[object.name,object.scriptId,object.internalId,object.type].join(' ').toLowerCase().includes(term)));}
	function render(){
		const results=matches();if(!results.some(object=>object.key===selected))selected=null;
		rows.replaceChildren();
		for(const object of results){const row=node('tr',undefined,'catalogue-demo-row');row.classList.toggle('is-selected',object.key===selected);const cell=node('td'),button=node('button',undefined,'catalogue-demo-row-button');button.type='button';button.dataset.object=object.key;button.setAttribute('aria-label',object.name+' — northstar-'+object.account);button.setAttribute('aria-pressed',String(object.key===selected));button.append(node('strong',object.name),node('small',object.scriptId));cell.append(button);const type=node('td');type.append(node('span',object.type),node('small',object.account,'catalogue-demo-row-account'));row.append(cell,type);rows.append(row);}
		count.textContent=`${results.length} ${results.length===1?'result':'results'} · ${account.value==='all'?'2 sample accounts':'northstar-'+account.value}`;empty.hidden=results.length!==0;
		renderDetail();
	}
	function renderDetail(){
		detail.replaceChildren();const object=objects.find(value=>value.key===selected);
		if(!object){detail.append(node('h4','Details'),node('p','Select an object to inspect its saved details.'));return;}
		detail.append(node('small',object.type),node('h4',object.name),node('code',object.scriptId));const list=node('dl');
		for(const [label,value] of [['Internal ID',object.internalId],['Account','northstar-'+object.account],['Role',object.role],['Type / status',object.extra]]){const pair=node('div');pair.append(node('dt',label),node('dd',value));list.append(pair);}
		detail.append(list,node('p',object.description));
	}
	function select(key,announce=true){selected=key;demo.querySelectorAll('[data-object]').forEach(button=>{const current=button.dataset.object===key;button.setAttribute('aria-pressed',String(current));button.closest('tr').classList.toggle('is-selected',current);});renderDetail();detail.classList.remove('is-demo-selected');void detail.offsetWidth;detail.classList.add('is-demo-selected');const object=objects.find(value=>value.key===key);if(announce&&object)status.textContent=`Selected ${object.name}. Details shown.`;}
	function stop(message){controller?.abort();controller=null;cursor.hidden=true;demo.querySelectorAll('.is-demo-target').forEach(value=>value.classList.remove('is-demo-target'));playButton.textContent='Replay walkthrough';if(message)caption.textContent=message;}
	function interact(){played=true;stop('Your turn — search, filter and select a result.');}
	function wait(ms,signal){return new Promise(resolve=>{if(signal.aborted){resolve();return;}const done=()=>{clearTimeout(timer);signal.removeEventListener('abort',done);resolve();};const timer=setTimeout(done,ms);signal.addEventListener('abort',done,{once:true});});}
	async function point(target,signal){if(signal.aborted)return;demo.querySelectorAll('.is-demo-target').forEach(value=>value.classList.remove('is-demo-target'));const a=target.getBoundingClientRect(),b=surface.getBoundingClientRect();cursor.hidden=false;cursor.style.setProperty('--demo-x',`${a.left-b.left+Math.min(a.width*.65,100)}px`);cursor.style.setProperty('--demo-y',`${a.top-b.top+a.height*.6}px`);target.classList.add('is-demo-target');await wait(550,signal);if(signal.aborted)return;cursor.classList.add('is-clicking');await wait(350,signal);cursor.classList.remove('is-clicking');}
	function finalScene(){playButton.textContent='Replay walkthrough';account.value='sandbox';category.value='scripts';search.value='approval';selected='sandbox-approval-script';render();caption.textContent='One match. Its Script ID and saved details, together.';}
	async function play(){
		demo.dispatchEvent(new CustomEvent('show-catalogue'));stop();played=true;if(reduceMotion.matches){finalScene();status.textContent='Walkthrough result shown with reduced motion.';return;}
		const run=new AbortController(),signal=run.signal;controller=run;playButton.textContent='Pause';account.value='all';category.value='all';search.value='';selected=null;render();
		try{
			caption.textContent='1 / 4 · Choose a saved account.';await wait(500,signal);if(signal.aborted)return;await point(account,signal);if(signal.aborted)return;account.value='sandbox';render();
			await wait(500,signal);if(signal.aborted)return;caption.textContent='2 / 4 · Narrow the catalogue to scripts.';await point(category,signal);if(signal.aborted)return;category.value='scripts';render();
			await wait(450,signal);if(signal.aborted)return;caption.textContent='3 / 4 · Search by name or Script ID.';await point(search,signal);if(signal.aborted)return;
			for(const letter of 'approval'){if(signal.aborted)return;search.value+=letter;render();await wait(120,signal);}
			await wait(600,signal);if(signal.aborted)return;caption.textContent='4 / 4 · Select the result to inspect its details.';const result=$('[data-object="sandbox-approval-script"]');await point(result,signal);if(signal.aborted)return;select('sandbox-approval-script',false);await wait(650,signal);if(signal.aborted)return;caption.textContent='Found it. Try another search, or explore a different category.';status.textContent='Walkthrough complete. Approval Guard selected. You can now explore the sample catalogue.';
		}finally{if(controller===run)stop();}
	}
	for(const control of [account,category,search]){control.addEventListener('focus',interact);control.addEventListener('pointerdown',interact);control.addEventListener(control===search?'input':'change',()=>{interact();render();status.textContent=count.textContent;});}
	rows.addEventListener('focusin',interact);rows.addEventListener('click',event=>{const button=event.target.closest('[data-object]');if(button){interact();select(button.dataset.object);}});
	playButton.addEventListener('click',()=>{if(controller)stop('Paused. Explore the catalogue or replay the walkthrough.');else play();});
	$('[data-demo-theme]').addEventListener('click',event=>{interact();const dark=demo.dataset.theme!=='dark';demo.dataset.theme=dark?'dark':'light';event.currentTarget.setAttribute('aria-pressed',String(dark));});
	$('[data-demo-expand]').addEventListener('click',()=>{
		interact();if(!dialog){dialog=node('dialog',undefined,'catalogue-demo-dialog');dialog.setAttribute('aria-labelledby','catalogue-demo-dialog-title');const head=node('div',undefined,'catalogue-demo-dialog-head'),title=node('h2','Explore Customization Workspace');title.id='catalogue-demo-dialog-title';const close=node('button','×');close.type='button';close.setAttribute('aria-label','Close expanded demo');close.addEventListener('click',()=>dialog.close());head.append(title,close);dialog.append(head,node('div',undefined,'catalogue-demo-dialog-body'));document.body.append(dialog);dialog.addEventListener('close',()=>{stop();home.append(demo);expanded=false;$('[data-demo-expand]').hidden=false;$('[data-demo-expand]').focus();});}
		expanded=true;dialog.querySelector('.catalogue-demo-dialog-body').append(demo);$('[data-demo-expand]').hidden=true;dialog.showModal();
	});
	const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&!played&&!reduceMotion.matches&&!demo.matches(':focus-within'))play();else if(!entry.isIntersecting&&!expanded&&controller)stop('Explore the catalogue or replay the walkthrough.');}},{threshold:.4});
	document.addEventListener('visibilitychange',()=>{if(document.hidden&&controller)stop('Explore the catalogue or replay the walkthrough.');});
	reduceMotion.addEventListener('change',()=>{stop();if(reduceMotion.matches){played=true;finalScene();}});
	render();if(reduceMotion.matches){played=true;finalScene();}demo.hidden=false;observer.observe(demo);
})();
