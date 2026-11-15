/* Ersetzt das alte Logo durch die DG-Wortmarke auf Seiten im älteren Layout */
(function(){var h='<span class="dg" aria-hidden="true">DG</span><span class="brand-text">Digitale<br>Gewinner<sup>®</sup></span>';
function run(){document.querySelectorAll('a.brand').forEach(function(a){if(a.querySelector('.dg'))return;a.setAttribute('aria-label','Digitale Gewinner');a.innerHTML=h})}
if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run)})();
