const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
qa('.reveal').forEach(el=>observer.observe(el));
const progress=q('.progress span');
const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%'};
addEventListener('scroll',updateProgress,{passive:true});updateProgress();
const links=qa('.case-index a'),sections=qa('.case-world');
const sectionObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>sectionObserver.observe(s));
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){addEventListener('scroll',()=>{const y=scrollY;q('.hero-card:nth-child(1)').style.setProperty('--p1',y*.025+'px');q('.hero-card:nth-child(2)').style.setProperty('--p2',y*-.018+'px');q('.hero-card:nth-child(3)').style.setProperty('--p3',y*.012+'px')},{passive:true})}