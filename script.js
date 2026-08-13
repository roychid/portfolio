const THEME_KEY = 'roy-portfolio-theme';
const root = document.documentElement;
const themeButtons = document.querySelectorAll('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function getTheme() {
  try { return localStorage.getItem(THEME_KEY) || root.dataset.theme || 'light'; }
  catch (_) { return root.dataset.theme || 'light'; }
}
function applyTheme(theme, persist = false) {
  const next = theme === 'dark' ? 'dark' : 'light';
  root.dataset.theme = next;
  if (persist) { try { localStorage.setItem(THEME_KEY, next); } catch (_) {} }
  if (themeMeta) themeMeta.content = next === 'dark' ? '#0b0d0a' : '#f4f2ec';
  themeButtons.forEach(btn => {
    btn.setAttribute('aria-pressed', String(next === 'dark'));
    btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    btn.title = next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  });
}
applyTheme(getTheme());
themeButtons.forEach(btn => btn.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true)));

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 16));
const menuBtn = document.querySelector('.menu-btn');
const mobilePanel = document.querySelector('.mobile-panel');
menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  mobilePanel?.classList.toggle('open', !open);
  mobilePanel?.setAttribute('aria-hidden', String(open));
  document.body.classList.toggle('menu-open', !open);
});
mobilePanel?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuBtn?.setAttribute('aria-expanded', 'false');
  mobilePanel.classList.remove('open');
  mobilePanel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold:.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
setTimeout(() => document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible')), 2500);
const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
document.querySelectorAll('[data-placeholder="true"]').forEach(link => link.addEventListener('click', e => e.preventDefault()));

// Inner-page image viewer.
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const galleryButtons = [...document.querySelectorAll('[data-view-image]')];
let galleryIndex = 0;
function openImage(index) {
  if (!lightbox || !galleryButtons.length) return;
  galleryIndex = (index + galleryButtons.length) % galleryButtons.length;
  const btn = galleryButtons[galleryIndex];
  if (lightboxImg) { lightboxImg.src = btn.dataset.viewImage; lightboxImg.alt = btn.dataset.alt || ''; }
  if (lightboxCaption) lightboxCaption.textContent = btn.dataset.caption || '';
  lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}
function closeImage(){ if(!lightbox)return; lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
galleryButtons.forEach((btn,i)=>btn.addEventListener('click',()=>openImage(i)));
document.querySelector('.lightbox-close')?.addEventListener('click',closeImage);
document.querySelector('.lightbox-prev')?.addEventListener('click',()=>openImage(galleryIndex-1));
document.querySelector('.lightbox-next')?.addEventListener('click',()=>openImage(galleryIndex+1));
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeImage()});
document.addEventListener('keydown',e=>{if(!lightbox?.classList.contains('open'))return;if(e.key==='Escape')closeImage();if(e.key==='ArrowLeft')openImage(galleryIndex-1);if(e.key==='ArrowRight')openImage(galleryIndex+1)});
