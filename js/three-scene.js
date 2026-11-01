export async function initPetals() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches || navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory < 4)) return;
    const THREE = await import('./three.module.js');
    const canvas = document.querySelector('#petals'); let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' }); } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(35, 1, .1, 30); camera.position.z = 9;
    const shape = new THREE.Shape(); shape.moveTo(0, -.09); shape.bezierCurveTo(-.12, -.01, -.1, .1, 0, .14); shape.bezierCurveTo(.12, .08, .08, -.05, 0, -.09);
    const geometry = new THREE.ShapeGeometry(shape, 8), material = new THREE.MeshBasicMaterial({ color: 0xd8a9a1, side: THREE.DoubleSide, transparent: true, opacity: .45 });
    const petals = Array.from({ length: innerWidth < 760 ? 7 : 17 }, () => { const p = new THREE.Mesh(geometry, material); p.position.set((Math.random() - .5) * 11, Math.random() * 8 - 4, Math.random() * 2 - 1); p.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 6); p.userData = { speed: .08 + Math.random() * .1, phase: Math.random() * 6 }; scene.add(p); return p; });
    const hero = document.querySelector('.hero'); let raf = 0, visible = false, disposed = false, last = 0, time = 0;
    function resize() { renderer.setSize(hero.clientWidth, hero.clientHeight, false); camera.aspect = hero.clientWidth / hero.clientHeight; camera.updateProjectionMatrix(); } resize();
    function render(now) { if (disposed || !visible || document.hidden) { raf = 0; last = 0; return; } const dt = last ? Math.min((now - last) / 1000, .05) : 0; last = now; time += dt; for (const p of petals) { p.position.y -= dt * p.userData.speed; p.position.x += Math.sin(time * .4 + p.userData.phase) * dt * .04; p.rotation.z += dt * .13; p.rotation.y += dt * .2; if (p.position.y < -4) p.position.y = 4; } renderer.render(scene, camera); raf = requestAnimationFrame(render); }
    function resume() { if (visible && !document.hidden && !raf && !disposed) raf = requestAnimationFrame(render); }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (!visible) { cancelAnimationFrame(raf); raf = 0; last = 0; } else resume(); }); observer.observe(hero);
    function visibility() { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; } else resume(); }
    function dispose() { disposed = true; cancelAnimationFrame(raf); observer.disconnect(); geometry.dispose(); material.dispose(); renderer.dispose(); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility); }
    window.addEventListener('resize', resize, { passive: true }); document.addEventListener('visibilitychange', visibility); window.addEventListener('pagehide', dispose, { once: true }); reduced.addEventListener('change', () => { if (reduced.matches) dispose(); }, { once: true });
}
