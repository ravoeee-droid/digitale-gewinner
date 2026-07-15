(()=>{
  const boot=()=>{
    if(document.body.classList.contains('dg-case-page')) return;
    document.body.classList.add('home-case-style');

    const mark=(selector,classes,scene)=>{
      const node=document.querySelector(selector);
      if(!node) return;
      const section=node.matches('section')?node:node.closest('section');
      if(!section) return;
      classes.split(' ').filter(Boolean).forEach(c=>section.classList.add(c));
      if(scene) section.dataset.scene=scene;
    };

    mark('.statement','cs-scene cs-cream','01');
    mark('.grid3','cs-scene cs-wine','02');
    mark('#system','cs-scene cs-blue','03');

    const impact=document.querySelector('.dg-impact-section');
    if(impact) impact.dataset.scene='04';

    const cases=document.querySelector('#cases');
    if(cases) cases.dataset.scene='05';

    mark('#bewertungen','cs-scene cs-wine cs-reviews','06');
    mark('#raphael','cs-scene cs-orange cs-about','07');
    mark('.process','cs-scene cs-blue cs-process','08');
    mark('#analyse','cs-scene cs-graphite cs-audit','09');
    mark('.faq','cs-scene cs-cream cs-faq','10');
    mark('.final','cs-scene cs-gold cs-final','11');

    document.querySelectorAll('.grid3 .card').forEach((card,i)=>card.classList.add(`cs-card-${i+1}`));
    document.querySelectorAll('.pillar').forEach((card,i)=>card.classList.add(`cs-pillar-${i+1}`));
    document.querySelectorAll('.review').forEach((card,i)=>card.classList.add(`cs-review-${i+1}`));

    const hero=document.querySelector('.hero');
    if(hero){
      hero.dataset.scene='00';
      hero.addEventListener('pointermove',e=>{
        if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r=hero.getBoundingClientRect();
        hero.style.setProperty('--mx',`${((e.clientX-r.left)/r.width)*100}%`);
        hero.style.setProperty('--my',`${((e.clientY-r.top)/r.height)*100}%`);
      },{passive:true});
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
