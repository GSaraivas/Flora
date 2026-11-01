export function initAnimations() {
  const gsap = window.gsap; if (!gsap) return;
  const { ScrollTrigger, ScrollSmoother, SplitText } = window;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
  const mm = gsap.matchMedia(); let smoother;
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({ delay: .6 });
    if (SplitText) { const split = SplitText.create('h1', { type: 'lines', mask: 'lines' }); tl.from(split.lines, { yPercent: 105, duration: 1.2, stagger: .13, ease: 'power3.out' }, .6); }
    tl.from('.hero-bouquet', { autoAlpha: 0, y: 80, scale: .93, rotation: 5, duration: 1.8, ease: 'power3.out' }, .2).from('.hero-copy>.eyebrow,.hero-description,.hero-actions', { opacity: 0, y: 18, duration: 1, stagger: .12 }, .9);
    gsap.utils.toArray('.reveal').forEach(el => gsap.from(el, { opacity: 0, y: 35, duration: .9, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
    gsap.utils.toArray('.collection-card .image-wrap').forEach(el => gsap.fromTo(el, { clipPath: 'inset(12% 0 12% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } }));
    return () => tl.revert();
  });
  mm.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
    if (ScrollSmoother) smoother = ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: .8, effects: false, smoothTouch: false });
    const heading = document.querySelector('.story-text h2'), desc = document.querySelector('.story-description'), num = document.querySelector('.story-number');
    const stages = [['Primeiro,<br>um <em>encontro.</em>', 'Escolhemos cada flor pelo que ela tem de único. A curva de uma haste. A textura de uma pétala.'], ['Depois,<br>a <em>harmonia.</em>', 'Cores, texturas e movimentos se encontram. Com cuidado, cada haste encontra o seu lugar.'], ['Cada flor conta<br>uma <em>história.</em>', 'Um arranjo inteiro de intenções. Pronto para fazer parte dos seus momentos.']]; let stage = -1;
    const st = gsap.timeline({ scrollTrigger: { trigger: '.story-section', pin: '.story-inner', start: 'top top', end: '+=1700', scrub: 1, onUpdate: self => { const next = Math.min(2, Math.floor(self.progress * 3)); if (next !== stage) { stage = next; heading.innerHTML = stages[next][0]; desc.textContent = stages[next][1]; num.textContent = `0${next + 1} — 03`; } } } });
    st.fromTo('.story-art img', { clipPath: 'inset(0 0 65% 0)', scale: 1.25, rotation: -7 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, rotation: 0, ease: 'none' }, 0).fromTo('.story-progress i', { width: '0%' }, { width: '100%', ease: 'none' }, 0);
    gsap.to('.hero-art', { y: 100, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.fromTo('.about-image img', { objectPosition: '50% 42%' }, { objectPosition: '50% 58%', ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    const move = e => { const x = (e.clientX / innerWidth - .5) * 10, y = (e.clientY / innerHeight - .5) * 8; gsap.to('.hero-bouquet', { x, rotationY: x * .5, rotationX: -y * .4, duration: 1.8, ease: 'power2.out' }); }; document.querySelector('.hero').addEventListener('pointermove', move);
    const clean = [];
    document.querySelectorAll('.magnetic').forEach(el => { const on = e => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .13, y: (e.clientY - r.top - r.height / 2) * .16, duration: .35 }); }; const off = () => gsap.to(el, { x: 0, y: 0, duration: .5 }); el.addEventListener('pointermove', on); el.addEventListener('pointerleave', off); clean.push(() => { el.removeEventListener('pointermove', on); el.removeEventListener('pointerleave', off); }); });
    document.querySelectorAll('.product-photo').forEach(el => { const on = e => { const r = el.getBoundingClientRect(); gsap.to(el, { rotationY: (e.clientX - r.left - r.width / 2) / r.width * 5, rotationX: -(e.clientY - r.top - r.height / 2) / r.height * 5, duration: .35 }); }; const off = () => gsap.to(el, { rotationX: 0, rotationY: 0, duration: .6 }); el.addEventListener('pointermove', on); el.addEventListener('pointerleave', off); clean.push(() => { el.removeEventListener('pointermove', on); el.removeEventListener('pointerleave', off); }); });
    return () => { smoother?.kill(); document.querySelector('.hero').removeEventListener('pointermove', move); clean.forEach(f => f()); heading.innerHTML = 'Cada flor conta<br>uma <em>história.</em>'; desc.textContent = stages[2][1]; };
  });
  // ScrollSmoother's transformed document needs explicit anchor handling.
  document.querySelectorAll('a[href^="#"]:not(.order):not([data-social])').forEach(a => a.addEventListener('click', e => { const target = document.querySelector(a.getAttribute('href')); if (!target) return; if (smoother) { e.preventDefault(); smoother.scrollTo(target, true, 'top 90px'); history.replaceState(null, '', a.getAttribute('href')); target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); } }));
  mm.add('(max-width: 999px), (prefers-reduced-motion: reduce)', () => {
    const h = document.querySelector('.story-text h2'), p = document.querySelector('.story-description');
    h.innerHTML = 'Cada flor conta<br>uma <em>história.</em>';
    p.textContent = 'Escolher com intenção. Compor com cuidado. Entregar com afeto. De uma única haste nasce um arranjo inteiro de sentimentos.';
    document.querySelector('.story-number').textContent = 'ESCOLHER / COMPOR / ENCANTAR';
  });
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
