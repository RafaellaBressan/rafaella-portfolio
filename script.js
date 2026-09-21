'use strict';

// Mensagens específicas para cada serviço; nada é enviado automaticamente.
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  const url = new URL('https://wa.me/5511939620165');
  url.searchParams.set('text', link.dataset.whatsapp);
  link.href = url.toString();
});

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');
function closeMenu(restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  menu.classList.remove('is-open');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('is-open', open);
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header') && menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
});
const desktopMedia = window.matchMedia('(min-width: 681px)');
desktopMedia.addEventListener('change', () => closeMenu());

if ('IntersectionObserver' in window) {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!motionPreference.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
    document.querySelectorAll('.reveal').forEach(element => {
      // O conteúdo acima da dobra permanece visível imediatamente.
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add('will-reveal');
        revealObserver.observe(element);
      }
    });
    motionPreference.addEventListener('change', event => {
      if (event.matches) document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
    });
    // Links de âncora e foco nunca podem levar a conteúdo invisível.
    document.addEventListener('focusin', event => {
      const block = event.target.closest('.reveal');
      if (block) block.classList.add('is-visible');
    });
  }
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        menu.querySelectorAll('a').forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
}
document.getElementById('year').textContent = new Date().getFullYear();
