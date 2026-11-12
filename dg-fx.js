/* DG FX – Startseite: Lichtstrom, 3D-Tiefe, Spotlight, Chart, Laptop-Scroll */
(function(){
  var d=document,w=window;
  var reduce=w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=w.matchMedia('(pointer: fine)').matches;
  function $(s,c){return (c||d).querySelector(s)}
  function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}

  /* 1. Lichtstrom im Hero (Flow-Field, reagiert auf die Maus) */
  var hero=$('.hero');
  if(hero&&!reduce){
    var cv=d.createElement('canvas');cv.className='dg-flow';cv.setAttribute('aria-hidden','true');
    hero.insertBefore(cv,hero.firstChild);
    var ctx=cv.getContext('2d'),W=0,H=0,dpr=Math.min(w.devicePixelRatio||1,1.5),P=[],mx=-9999,my=-9999,run=false,t=0,raf=0;
    var N=w.innerWidth<700?55:150;
    function size(){W=hero.clientWidth;H=hero.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
    function spawn(p){p.x=Math.random()*W;p.y=Math.random()*H;p.l=0;p.m=120+Math.random()*260;p.s=.5+Math.random()*1.1;p.c=Math.random()<.22?'168,228,255':(Math.random()<.5?'240,201,122':'216,166,75');return p}
    function init(){size();P=[];for(var i=0;i<N;i++)P.push(spawn({}))}
    function frame(){
      if(!run)return;t+=.0022;
      ctx.globalCompositeOperation='destination-out';ctx.fillStyle='rgba(0,0,0,.032)';ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation='lighter';ctx.lineWidth=1.3;ctx.lineCap='round';
      for(var i=0;i<P.length;i++){var p=P[i];
        var a=(Math.sin(p.x*.0017+t*2.1)+Math.cos(p.y*.0023-t*1.6)+Math.sin((p.x+p.y)*.0009+t))*1.35;
        var vx=Math.cos(a)*p.s+.35,vy=Math.sin(a)*p.s-.12;
        var dx=mx-p.x,dy=my-p.y,dd=dx*dx+dy*dy;
        if(dd<48000){var f=(1-dd/48000)*.9,ds=Math.sqrt(dd)||1;vx+=(-dy/ds)*f*1.6+dx/ds*f*.35;vy+=(dx/ds)*f*1.6+dy/ds*f*.35}
        var nx=p.x+vx,ny=p.y+vy,al=Math.sin(Math.PI*p.l/p.m)*.5;
        ctx.strokeStyle='rgba('+p.c+','+al.toFixed(3)+')';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(nx,ny);ctx.stroke();
        p.x=nx;p.y=ny;p.l++;
        if(p.l>p.m||nx<-20||nx>W+20||ny<-20||ny>H+20)spawn(p);
      }
      raf=requestAnimationFrame(frame);
    }
    function start(){if(!run){run=true;raf=requestAnimationFrame(frame)}}
    function stop(){run=false;cancelAnimationFrame(raf)}
    init();
    var rz;w.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(init,200)});
    hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
    hero.addEventListener('pointerleave',function(){mx=my=-9999});
    if('IntersectionObserver' in w){new IntersectionObserver(function(es){es[0].isIntersecting&&!d.hidden?start():stop()}).observe(hero)}else start();
    d.addEventListener('visibilitychange',function(){d.hidden?stop():(hero.getBoundingClientRect().bottom>0&&start())});
  }

  /* 2. 3D-Tiefe: Porträt kippt, Karten schweben, Lichtreflex folgt dem Cursor */
  var hv=$('.hero-visual'),photo=$('.hero-photo');
  if(hv&&photo&&fine&&!reduce){
    var gl=d.createElement('div');gl.className='dg-glare';photo.appendChild(gl);
    hv.addEventListener('pointermove',function(e){
      var r=hv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      hv.classList.add('dg-live');
      photo.style.setProperty('--ry',(x*9).toFixed(2)+'deg');photo.style.setProperty('--rx',(-y*7).toFixed(2)+'deg');
      photo.style.setProperty('--gx',((x+.5)*100).toFixed(1)+'%');photo.style.setProperty('--gy',((y+.5)*100).toFixed(1)+'%');
      $$('.float',hv).forEach(function(f,i){var k=14+i*9;f.style.setProperty('--fx',(x*k).toFixed(1)+'px');f.style.setProperty('--fy',(y*k).toFixed(1)+'px')});
      var ring=$('.ring',hv);if(ring){ring.style.setProperty('--fx',(x*22).toFixed(1)+'px');ring.style.setProperty('--fy',(y*22).toFixed(1)+'px')}
    },{passive:true});
    hv.addEventListener('pointerleave',function(){
      hv.classList.remove('dg-live');
      [photo].concat($$('.float',hv),$$('.ring',hv)).forEach(function(el){['--rx','--ry','--fx','--fy'].forEach(function(v){el.style.removeProperty(v)})});
    });
  }
  if(fine&&!reduce)$$('.world').forEach(function(el){
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--ry',(((e.clientX-r.left)/r.width-.5)*5).toFixed(2)+'deg');el.style.setProperty('--rx',(-((e.clientY-r.top)/r.height-.5)*4).toFixed(2)+'deg')},{passive:true});
    el.addEventListener('pointerleave',function(){el.style.removeProperty('--rx');el.style.removeProperty('--ry')});
  });

  /* 3. Spotlight: Lichtkegel folgt dem Cursor über Karten */
  if(fine)$$('.card,.review,.step,.stat,.case,.sys-list>div,.authority-item').forEach(function(el){
    el.classList.add('dg-spot');var l=d.createElement('span');l.className='dg-spot-l';l.setAttribute('aria-hidden','true');el.insertBefore(l,el.firstChild);
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
  });

  /* 4. Wachstumskurve zeichnet sich selbst, Beispiel-Meldungen im Mockup */
  var chart=$('.chart');
  if(chart){
    var paths=$$('path',chart);
    if(paths[0])paths[0].classList.add('dg-area');
    if(paths[1]){paths[1].classList.add('dg-line');try{chart.style.setProperty('--len',Math.ceil(paths[1].getTotalLength())+20)}catch(e){chart.style.setProperty('--len',500)}}
    var lap=$('.laptop'),toast=null,msgs=[['Neue Bewerbung','Pflegefachkraft · 8 km'],['Neue Anfrage','PV-Anlage · Einfamilienhaus'],['Termin vorbereitet','Donnerstag, 10:00 Uhr'],['Nachgefasst','Erinnerung automatisch gesendet']],mi=0,timer=0;
    function cycle(){if(!toast)return;toast.classList.remove('on');setTimeout(function(){var m=msgs[mi++%msgs.length];toast.innerHTML='<i>✓</i><div><b>'+m[0]+'</b><span>'+m[1]+'</span></div>';toast.classList.add('on')},450)}
    if(lap&&!reduce){toast=d.createElement('div');toast.className='dg-toast';toast.setAttribute('aria-hidden','true');lap.appendChild(toast)}
    if('IntersectionObserver' in w){new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){chart.classList.add('dg-in');if(toast&&!timer){setTimeout(cycle,1800);timer=setInterval(cycle,3600)}}
      else if(timer){clearInterval(timer);timer=0;toast&&toast.classList.remove('on')}
    })},{threshold:.35}).observe(chart)}else chart.classList.add('dg-in');
  }

  /* 5. Laptop richtet sich beim Scrollen auf */
  var lp=$('.laptop');
  if(lp&&!reduce){
    var tick=false;
    function upd(){tick=false;var r=lp.getBoundingClientRect(),vh=w.innerHeight;var p=Math.max(0,Math.min(1,(vh-r.top)/(vh*.75)));lp.style.setProperty('--lx',((1-p)*26).toFixed(2)+'deg');lp.style.setProperty('--ls',(.9+p*.1).toFixed(3))}
    w.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
  }
})();
