import { config, hasWhatsApp, whatsappURL } from './config.js';
import { initAnimations } from './animations.js';
import { initPetals } from './three-scene.js';

const $ = s => document.querySelector(s);
const menu = $('.menu-toggle'), mobile = $('#mobile-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); mobile.hidden = true; }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); mobile.hidden = !open; });
mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
const header = $('.header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 35), { passive: true });
document.querySelector('[data-address]').textContent = config.address;
document.querySelector('[data-hours]').textContent = config.hours;
document.querySelector('[data-contact-email]').textContent = config.email;
$('#year').textContent = new Date().getFullYear();
const contact = $('#contact-dialog');
function showContact(message) { $('#order-message').textContent = message; $('#copy-status').textContent = ''; $('#copy-message').textContent = 'Copiar mensagem ↗'; contact.showModal(); }
document.querySelectorAll('.order').forEach(link => { const msg = link.dataset.message || 'Olá! Gostaria de conhecer o Flora Atelier.'; if (link.tagName === 'A' && hasWhatsApp()) { link.href = whatsappURL(msg); link.target = '_blank'; link.rel = 'noopener noreferrer'; } link.addEventListener('click', e => { if (hasWhatsApp()) { if (link.tagName !== 'A') window.open(whatsappURL(msg), '_blank', 'noopener,noreferrer'); return; } e.preventDefault(); showContact(msg); }); });
document.querySelectorAll('[data-social]').forEach(a => { if (config.instagram) { a.href = config.instagram; a.target = '_blank'; a.rel = 'noopener noreferrer'; } else a.addEventListener('click', e => { e.preventDefault(); showContact('Quero acompanhar o olhar do Flora Atelier no Instagram. O perfil será adicionado na personalização.'); }); });
$('#copy-message').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#order-message').textContent); $('#copy-status').textContent = 'Mensagem copiada.'; } catch { $('#copy-status').textContent = 'Selecione o texto acima para copiar a mensagem.'; } });
document.querySelectorAll('dialog').forEach(dialog => { dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close()); dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } }); });
const lightbox = $('#lightbox'); document.querySelectorAll('[data-full]').forEach(b => b.addEventListener('click', () => { const photo = b.querySelector('img'); lightbox.querySelector('img').src = b.dataset.full; lightbox.querySelector('img').alt = photo.alt; lightbox.querySelector('p').textContent = photo.alt; lightbox.showModal(); }));
const quotes = [['Não era apenas um buquê. Era exatamente o que eu queria dizer, traduzido em flores.', 'Marina A.', 'um presente para lembrar'], ['Cada detalhe trouxe delicadeza ao nosso dia. As flores pareciam fazer parte da nossa história.', 'Clara e Pedro', 'uma celebração de amor'], ['Receber aquelas flores transformou uma terça-feira comum em uma memória especial.', 'Helena R.', 'a beleza do inesperado']];
let current = 0; function showQuote(n) { current = (n + quotes.length) % quotes.length; $('#quote-text').textContent = quotes[current][0]; $('#quote-name').replaceChildren(document.createTextNode(quotes[current][1] + ' ')); const span = document.createElement('span'); span.textContent = '— ' + quotes[current][2]; $('#quote-name').append(span); $('#quote-count').textContent = `0${current + 1} / 03`; }
$('#quote-prev').addEventListener('click', () => showQuote(current - 1)); $('#quote-next').addEventListener('click', () => showQuote(current + 1));
document.querySelectorAll('[data-slide]').forEach(b => b.addEventListener('click', () => { const track = $('.products'); track.scrollBy({ left: Number(b.dataset.slide) * (track.querySelector('.product').offsetWidth + 28), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }));
const depth = $('.depth-view'), range = $('#depth'); range.addEventListener('input', () => { depth.querySelector('img').style.transform = `rotateY(${range.value}deg) translateX(${Number(range.value) * .65}px)`; depth.querySelector('.depth-ring').style.transform = `rotateX(60deg) rotateZ(${Number(range.value) * .4}deg)`; });
$('#pause-view').addEventListener('click', e => { const paused = depth.classList.toggle('paused'); e.currentTarget.setAttribute('aria-pressed', String(paused)); e.currentTarget.textContent = paused ? 'Retomar movimento ▷' : 'Pausar movimento Ⅱ'; });
if (matchMedia('(prefers-reduced-motion: reduce)').matches) depth.classList.add('paused');
document.fonts.ready.then(() => initAnimations()).catch(() => { });
initPetals().catch(() => { });
