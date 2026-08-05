
const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}
document.querySelectorAll('[data-year]').forEach(e => e.textContent = new Date().getFullYear());
