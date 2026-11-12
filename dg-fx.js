/* DG FX – Startseite: Lichtstrom, 3D-Tiefe, Spotlight, Chart, Laptop-Scroll */
(function(){
  var d=document,w=window;
  var reduce=w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=w.matchMedia('(pointer: fine)').matches;
  function $(s,c){return (c||d).querySelector(s)}
  function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}

  /* 1. Aurora im Hero: WebGL-Shader, weiche Lichtbahn in Gold und Eisblau */
  var hero=$('.hero');
  if(hero&&!reduce){
    var cv=d.createElement('canvas');cv.className='dg-aurora';cv.setAttribute('aria-hidden','true');
    hero.insertBefore(cv,hero.firstChild);
    var gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false});
    if(gl){
      var VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
      var FS='precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;'+
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
      'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p=p*2.03+7.1;a*=.5;}return s;}'+
      'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv;p.x*=r.x/r.y;'+
      'float a1=fbm(p*1.3+vec2(t*.045,-t*.03));float a2=fbm(p*2.1-vec2(t*.035,t*.05)+a1);'+
      'float y=uv.y-.5-(a1-.5)*.75+(uv.x-.6)*.3+(m.y-.5)*.08;'+
      'float rib=exp(-y*y*9.)+.55*exp(-pow(y+.28+(a2-.5)*.3,2.)*26.);'+
      'vec3 gold=vec3(.86,.66,.3),ice=vec3(.62,.87,1.);vec3 c=mix(gold,ice,smoothstep(.38,.74,a2));'+
      'float al=rib*(.2+.8*a2)*.5;vec2 dm=uv-m;al+=.12*exp(-dot(dm,dm)*14.);'+
      'al*=mix(.1,1.,smoothstep(.2,.8,uv.x));al*=smoothstep(0.,.25,uv.y);gl_FragColor=vec4(c*al,al);}';
      function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s}
      var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
      if(gl.getProgramParameter(pr,gl.LINK_STATUS)){
        gl.useProgram(pr);
        var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
        var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
        var uR=gl.getUniformLocation(pr,'r'),uT=gl.getUniformLocation(pr,'t'),uM=gl.getUniformLocation(pr,'m');
        var mx=.75,my=.5,tx=.75,ty=.5,run=false,raf=0,t0=performance.now();
        function size(){var s=.5;cv.width=Math.max(2,hero.clientWidth*s);cv.height=Math.max(2,hero.clientHeight*s);gl.viewport(0,0,cv.width,cv.height)}
        function frame(now){if(!run)return;mx+=(tx-mx)*.04;my+=(ty-my)*.04;
          gl.uniform2f(uR,cv.width,cv.height);gl.uniform1f(uT,(now-t0)/1000);gl.uniform2f(uM,mx,my);
          gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);raf=requestAnimationFrame(frame)}
        function start(){if(!run){run=true;raf=requestAnimationFrame(frame)}}
        function stop(){run=false;cancelAnimationFrame(raf)}
        size();var rz;w.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(size,200)});
        hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=1-(e.clientY-r.top)/r.height},{passive:true});
        if('IntersectionObserver' in w){new IntersectionObserver(function(es){es[0].isIntersecting&&!d.hidden?start():stop()}).observe(hero)}else start();
        d.addEventListener('visibilitychange',function(){d.hidden?stop():(hero.getBoundingClientRect().bottom>0&&start())});
      }
    }
  }

  /* 2. 3D-Tiefe: Porträt kippt, Karten schweben, Lichtreflex folgt dem Cursor */
  var hv=$('.hero-visual'),photo=$('.hero-photo');
  if(hv&&photo&&fine&&!reduce){
    var glare=d.createElement('div');glare.className='dg-glare';photo.appendChild(glare);
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
  /* 6. Lichtstrahl, der am Rand entlangläuft (Border Beam) */
  $$('.statement,.audit,.laptop,.library').forEach(function(el){el.classList.add('dg-beam')});

  /* 7. Überschriften: Wörter blenden nacheinander scharf ein */
  if(!reduce&&'IntersectionObserver' in w){
    var hio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('dg-h-in');hio.unobserve(e.target)}})},{threshold:.3});
    $$('main h2').forEach(function(h){
      if(h.closest('.statement')||h.closest('.screen'))return;
      var i=0,tw=d.createTreeWalker(h,NodeFilter.SHOW_TEXT,null),nodes=[],nd;
      while(nd=tw.nextNode())nodes.push(nd);
      nodes.forEach(function(tn){var fr=d.createDocumentFragment();tn.nodeValue.split(/(\s+)/).forEach(function(part){
        if(!part)return;if(/^\s+$/.test(part)){fr.appendChild(d.createTextNode(' '));return}
        var s=d.createElement('span');s.className='dg-w';s.style.transitionDelay=(i++*55)+'ms';s.textContent=part;fr.appendChild(s)});
        tn.parentNode.replaceChild(fr,tn)});
      h.classList.add('dg-h');hio.observe(h);
    });
  }

  /* 8. Bewertungen als endloses Laufband in zwei Reihen */
  var rg=$('.review-grid');
  if(rg&&!reduce){
    var items=$$('.review',rg),half=Math.ceil(items.length/2),mq=d.createElement('div');mq.className='dg-mq';
    [items.slice(0,half),items.slice(half)].forEach(function(row,ri){
      var tr=d.createElement('div');tr.className='dg-mq-t'+(ri?' rev':'');
      row.forEach(function(el){el.classList.add('visible');tr.appendChild(el)});
      row.forEach(function(el){var c=el.cloneNode(true);c.setAttribute('aria-hidden','true');tr.appendChild(c)});
      mq.appendChild(tr)});
    rg.parentNode.replaceChild(mq,rg);
  }

  /* 9. Filmkorn für Tiefe */
  if(!reduce){var gr=d.createElement('div');gr.className='dg-grain';gr.setAttribute('aria-hidden','true');d.body.appendChild(gr)}

  /* 10. Weiches Scrollen mit Nachlauf (Lenis) */
  if(w.Lenis&&!reduce&&fine){
    try{
      d.documentElement.style.scrollBehavior='auto';
      var lenis=new w.Lenis({lerp:.09});
      if(w.ScrollTrigger&&lenis.on)lenis.on('scroll',w.ScrollTrigger.update);
      (function loop(ts){lenis.raf(ts);requestAnimationFrame(loop)})(performance.now());
      d.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var id=a.getAttribute('href');if(id.length<2)return;var tg=$(id);if(!tg)return;e.preventDefault();lenis.scrollTo(tg,{offset:-90})});
    }catch(err){}
  }
/* 11. Signatur-Szene: Partikel formen Wörter und verwandeln sich beim Scrollen */
  (function(){
    var st=$('.statement');if(!st||reduce)return;
    var sec=st.closest('section');if(!sec)return;
    var STAGES=[['Webseite','Webseiten waren gestern.'],['System','Heute arbeitet ein System für dich.'],['Kunden','Es bringt Anfragen aus deiner Region.'],['Bewerber','Es bringt Bewerbungen, die wirklich passen.'],['DG','Ein System. Mehr Kunden. Mehr Bewerber. Weniger Aufwand.']];
    var scene=d.createElement('section');scene.className='dg-scene';scene.id='wandel';
    scene.innerHTML='<div class="dg-scene-pin"><canvas aria-hidden="true"></canvas><div class="dg-scene-cap"><span class="eyebrow">Der Unterschied</span><p></p></div><div class="dg-scene-dots" aria-hidden="true">'+STAGES.map(function(){return '<i></i>'}).join('')+'</div><span class="dg-scene-hint" aria-hidden="true">Scrollen</span></div><p class="dg-sr">'+STAGES.map(function(s){return s[1]}).join(' ')+'</p>';
    sec.parentNode.replaceChild(scene,sec);
    var pin=$('.dg-scene-pin',scene),cv=$('canvas',scene),ctx=cv.getContext('2d'),cap=$('.dg-scene-cap p',scene),dots=$$('.dg-scene-dots i',scene);
    var W=0,H=0,dpr=Math.min(w.devicePixelRatio||1,1.5),N=w.innerWidth<700?1800:5200,T=[],P=[],ready=false,run=false,raf=0,mx=-9999,my=-9999,curStage=-1;
    function sample(word,italic){
      var o=d.createElement('canvas'),c=o.getContext('2d');o.width=W;o.height=H;
      var fs=Math.min(H*.42,W*.2);c.font=(italic?'italic ':'')+'800 '+fs+'px Sora,Arial,sans-serif';
      var tw=c.measureText(word).width,max=W*.8;if(tw>max){fs*=max/tw;c.font=(italic?'italic ':'')+'800 '+fs+'px Sora,Arial,sans-serif'}
      c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.fillText(word,W/2,H*.44);
      var data=c.getImageData(0,0,W,H).data,pts=[],step=Math.max(2,Math.round(W/420));
      for(var y=0;y<H;y+=step)for(var x=0;x<W;x+=step)if(data[(y*W+x)*4+3]>128)pts.push(x,y);
      var out=new Float32Array(N*2),n=pts.length/2;
      for(var i=0;i<N;i++){var k=n?((Math.random()*n)|0)*2:0;out[i*2]=(n?pts[k]:W/2)+(Math.random()-.5)*step;out[i*2+1]=(n?pts[k+1]:H/2)+(Math.random()-.5)*step}
      return out;
    }
    function build(){
      W=pin.clientWidth;H=pin.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      T=STAGES.map(function(s,i){return sample(s[0],i===STAGES.length-1)});
      if(!P.length)for(var i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,rx:(Math.random()-.5),ry:(Math.random()-.5),s:Math.random()<.25?2.4:1.6,c:Math.random()<.24?1:0});
      ready=true;
    }
    function prog(){var r=scene.getBoundingClientRect(),tot=r.height-w.innerHeight;return Math.max(0,Math.min(1,-r.top/Math.max(1,tot)))*(STAGES.length-1)}
    function frame(){
      if(!run)return;raf=requestAnimationFrame(frame);if(!ready)return;
      var p=prog(),i=Math.min(STAGES.length-2,Math.floor(p)),f=p-i,e=f<.22?0:f>.78?1:(f-.22)/.56;e=e*e*(3-2*e);
      var A=T[i],B=T[i+1],burst=Math.sin(Math.PI*e)*Math.min(W,H)*.55,stg=Math.round(p);
      if(stg!==curStage){curStage=stg;cap.classList.remove('on');setTimeout(function(){cap.textContent=STAGES[stg][1];cap.classList.add('on')},180);dots.forEach(function(el,k){el.classList.toggle('on',k===stg)})}
      ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
      for(var pass=0;pass<2;pass++){
        ctx.fillStyle=pass?'rgba(168,228,255,.85)':'rgba(240,201,122,.8)';
        for(var k=0;k<N;k++){var q=P[k];if(q.c!==pass)continue;
          var tx=A[k*2]+(B[k*2]-A[k*2])*e+q.rx*burst,ty=A[k*2+1]+(B[k*2+1]-A[k*2+1])*e+q.ry*burst;
          var dx=q.x-mx,dy=q.y-my,dd=dx*dx+dy*dy;if(dd<9000){var fo=(1-dd/9000)*26,ds=Math.sqrt(dd)||1;tx+=dx/ds*fo;ty+=dy/ds*fo}
          q.x+=(tx-q.x)*.14;q.y+=(ty-q.y)*.14;ctx.fillRect(q.x,q.y,q.s,q.s)}
      }
    }
    function start(){if(!run){run=true;raf=requestAnimationFrame(frame)}}
    function stop(){run=false;cancelAnimationFrame(raf)}
    var go=function(){build();if('IntersectionObserver' in w){new IntersectionObserver(function(es){es[0].isIntersecting?start():stop()}).observe(scene)}else start()};
    (d.fonts&&d.fonts.load?d.fonts.load('800 80px Sora').then(go,go):go());
    var rz;w.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(function(){if(Math.abs(pin.clientWidth-W)>2)build()},250)});
    pin.addEventListener('pointermove',function(e){var r=pin.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
    pin.addEventListener('pointerleave',function(){mx=my=-9999});
  })();
})();
