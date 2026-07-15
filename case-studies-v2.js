(()=>{
  const body=document.body;
  body.classList.add('case-page-v2');

  const numbers={
    'strong-relationship':'01','asmr-time':'02','dj-walli':'03','jj-media':'04','defi-intelligence':'05',
    'kitan-design':'06','koerperkult':'07','libi-elektronik':'08','fuehrungskraefte':'09','neuromind':'10'
  };

  document.querySelectorAll('article.case').forEach((card,index)=>{
    const n=numbers[card.id]||String(index+1).padStart(2,'0');
    card.dataset.number=n;
    const number=card.querySelector('.number');
    if(number) number.textContent=`Case ${n}`;

    const visual=card.querySelector('.visual');
    if(visual){
      visual.addEventListener('pointermove',e=>{
        if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r=visual.getBoundingClientRect();
        visual.style.setProperty('--spot-x',`${((e.clientX-r.left)/r.width)*100}%`);
        visual.style.setProperty('--spot-y',`${((e.clientY-r.top)/r.height)*100}%`);
      },{passive:true});
    }
  });

  const reveals=[...document.querySelectorAll('.reveal')];
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}
    });
  },{threshold:.08,rootMargin:'0px 0px -6%'});
  reveals.forEach(el=>io.observe(el));

  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const devices=[...document.querySelectorAll('.device')];
    let ticking=false;
    const update=()=>{
      const vh=innerHeight;
      devices.forEach(device=>{
        const r=device.getBoundingClientRect();
        const center=r.top+r.height/2;
        const distance=Math.min(1,Math.abs(center-vh/2)/(vh*.85));
        const scale=.94+(1-distance)*.06;
        device.style.setProperty('--scroll-scale',scale.toFixed(3));
      });
      ticking=false;
    };
    addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});
    addEventListener('resize',update,{passive:true});
    update();
  }
})();
