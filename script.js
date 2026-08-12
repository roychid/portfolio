const header = document.querySelector('.site-header');
const menuBtn = document.querySelector('.menu-btn');
const mobilePanel = document.querySelector('.mobile-panel');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  mobilePanel.classList.toggle('open', !open);
  mobilePanel.setAttribute('aria-hidden', String(open));
  document.body.classList.toggle('menu-open', !open);
});

mobilePanel?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    mobilePanel.classList.remove('open');
    mobilePanel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

// Prevent placeholder contact links from jumping the page before real URLs are added.
document.querySelectorAll('[data-placeholder="true"]').forEach(link => {
  link.addEventListener('click', (event) => event.preventDefault());
});
