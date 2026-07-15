(()=>{
  if(document.body.classList.contains('dg-case-page')) return;

  const system=document.querySelector('#system');
  if(system){
    const heading=system.querySelector('h2');
    if(heading) heading.innerHTML='3 Orte. <span class="gold">1 Eindruck.</span>';
    const intro=system.querySelector('.section-head > p');
    if(intro) intro.textContent='Potenzielle Kunden und Mitarbeiter prüfen Ihr Unternehmen über Google, Website und Social Media. Nur wenn alle drei denselben starken Eindruck vermitteln, entsteht echte Entscheidungssicherheit.';

    system.querySelectorAll('.pillar').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r=card.getBoundingClientRect();
        card.style.setProperty('--spot-x',`${((e.clientX-r.left)/r.width)*100}%`);
        card.style.setProperty('--spot-y',`${((e.clientY-r.top)/r.height)*100}%`);
      },{passive:true});
    });
  }
})();
