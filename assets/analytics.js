// Cloudflare Web Analytics is intentionally limited to the published website.
// Local previews and SuiteCraft extension pages never load the remote beacon.
(() => {
	if(location.hostname !== 'krolikowskidamian.github.io') return;
	const beacon=document.createElement('script');
	beacon.type='module';
	beacon.src='https://static.cloudflareinsights.com/beacon.min.js';
	beacon.dataset.cfBeacon=JSON.stringify({token:'aec12c318029431c8082d9c8849c13e7'});
	document.head.append(beacon);
})();
