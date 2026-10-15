const canvas = document.querySelector('#field');
const ctx = canvas.getContext('2d');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion');
let paused = reduce.matches, frame = 0, last = 0, time = 0, width = 0, height = 0;
const pointer = { x: .55, y: .3, tx: .55, ty: .3 };

function resize() {
  const rect = canvas.getBoundingClientRect();
  width = rect.width; height = rect.height;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (paused) draw();
}
function draw() {
  ctx.clearRect(0, 0, width, height);
  pointer.x += (pointer.tx - pointer.x) * .035;
  pointer.y += (pointer.ty - pointer.y) * .035;
  const mx = (pointer.x - .5) * 80, my = (pointer.y - .35) * 50;
  ctx.globalCompositeOperation = 'screen';
  for (let glow = 3; glow >= 0; glow--) {
    ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const u = i / 180;
      const angle = u * Math.PI * 1.76 - 1.12;
      const x = width * .54 + Math.cos(angle) * width * .48 + mx + Math.sin(u * 8 + time * .22) * 25;
      const y = height * .45 + Math.sin(angle) * 300 + my + Math.sin(u * 5 - time * .15) * 25;
      i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
    }
    const gradient = ctx.createLinearGradient(0,120,width,850);
    gradient.addColorStop(0,'rgba(101,66,192,0)');
    gradient.addColorStop(.25,`rgba(141,112,222,${glow ? .075 : .38})`);
    gradient.addColorStop(.52,`rgba(203,171,255,${glow ? .12 : .65})`);
    gradient.addColorStop(.8,`rgba(60,93,154,${glow ? .045 : .14})`);
    gradient.addColorStop(1,'rgba(101,66,192,0)');
    ctx.strokeStyle = gradient; ctx.lineWidth = [1,18,70,150][glow];
    ctx.filter = glow ? `blur(${glow * 11}px)` : 'none'; ctx.stroke();
  }
  ctx.filter = 'none';
  for (let row = 0; row < 42; row++) {
    ctx.beginPath();
    for (let col = 0; col <= 92; col++) {
      const u = col / 92, depth = row / 42;
      const x = u * (width + 150) - 75 + mx * depth;
      const envelope = Math.sin(u * Math.PI);
      const y = height * .76 + depth * height * .36 + Math.sin(u * 8.5 + depth * 3.4 + time * .16) * 75 * envelope + Math.cos(u * 12 - time * .13) * 25 + my * depth;
      col ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
    }
    const g = ctx.createLinearGradient(0,0,width,0);
    g.addColorStop(0,'rgba(101,66,192,0)');g.addColorStop(.2,`rgba(101,66,192,${.10 + row * .002})`);g.addColorStop(.48,`rgba(188,145,255,${.2 + row * .003})`);g.addColorStop(.72,'rgba(63,103,170,.16)');g.addColorStop(1,'rgba(101,66,192,0)');
    ctx.strokeStyle=g;ctx.lineWidth=.65;ctx.stroke();
  }
  for(let i=0;i<28;i++){
    const u=((i * .137 + time * .007)%1), depth=(i%12)/12;
    const x=u*(width+150)-75+mx*depth;
    const y=height*.76+depth*height*.36+Math.sin(u*8.5+depth*3.4+time*.16)*75*Math.sin(u*Math.PI)+Math.cos(u*12-time*.13)*25+my*depth;
    ctx.fillStyle=`rgba(209,184,255,${.15 + Math.sin(u*Math.PI)*.45})`;
    ctx.fillRect(x,y,1.6,1.6);
  }
  ctx.globalCompositeOperation='source-over';
}
function animate(now){
  frame=0;
  if(paused||document.hidden)return;
  if(now-last>32){time+=Math.min((now-last)/1000,.05);last=now;draw()}
  frame=requestAnimationFrame(animate);
}
function syncMotion(){
  cancelAnimationFrame(frame);frame=0;
  motionButton.setAttribute('aria-pressed',String(paused));
  motionButton.innerHTML=paused?'▶ <span>Resume motion</span>':'Ⅱ <span>Pause motion</span>';
  if(!paused&&!document.hidden){last=performance.now();frame=requestAnimationFrame(animate)}else draw();
}
motionButton.addEventListener('click',()=>{paused=!paused;syncMotion()});
reduce.addEventListener('change',()=>{paused=reduce.matches;syncMotion()});
document.addEventListener('visibilitychange',syncMotion);
window.addEventListener('resize',resize);
window.addEventListener('pointermove',e=>{if(paused||e.pointerType==='touch')return;pointer.tx=e.clientX/innerWidth;pointer.ty=e.clientY/innerHeight},{passive:true});
resize();syncMotion();

