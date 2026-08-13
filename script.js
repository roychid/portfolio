const themeButtons = document.querySelectorAll('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const THEME_KEY = 'roy-portfolio-theme';

function readSavedTheme() {
  try { return localStorage.getItem(THEME_KEY); } catch (_) { return null; }
}
function saveTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
}
function applyTheme(theme, persist = false) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  if (persist) saveTheme(next);
  if (themeMeta) themeMeta.setAttribute('content', next === 'dark' ? '#0b0d0a' : '#f4f2ec');
  themeButtons.forEach((button) => {
    const isDark = next === 'dark';
    button.setAttribute('aria-pressed', String(isDark));
    button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    button.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    const icon = button.querySelector('.theme-icon');
    const label = button.querySelector('.theme-label');
    if (icon) icon.textContent = isDark ? '☀' : '☾';
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
  });
}

const initialTheme = document.documentElement.dataset.theme || readSavedTheme() ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(initialTheme);
themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  });
});

const header = document.querySelector('.site-header');
const menuBtn = document.querySelector('.menu-btn');
const mobilePanel = document.querySelector('.mobile-panel');
window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 20));
menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  mobilePanel?.classList.toggle('open', !open);
  mobilePanel?.setAttribute('aria-hidden', String(open));
  document.body.classList.toggle('menu-open', !open);
});
mobilePanel?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuBtn?.setAttribute('aria-expanded', 'false');
  mobilePanel.classList.remove('open');
  mobilePanel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
window.setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
}, 4000);
const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = new Date().getFullYear();
document.querySelectorAll('[data-placeholder="true"]').forEach(link => {
  link.addEventListener('click', (event) => event.preventDefault());
});

const galleries = {
  bootcamp: [
    { src:'assets/bootcamp-stage.webp', alt:'Roy presenting YorShield Security at the AI for Impact Challenge', caption:'Presenting YorShield Security during the AI for Impact Challenge 2026.' },
    { src:'assets/bootcamp-challenge.webp', alt:'Roy at the AI for Impact Challenge venue', caption:'At the AI for Impact Challenge venue during the 2026 bootcamp.' },
    { src:'assets/bootcamp-potraz.webp', alt:'Roy at POTRAZ during the AI for Impact Challenge', caption:'At POTRAZ during the AI for Impact Challenge 2026.' },
    { src:'assets/bootcamp-working.webp', alt:'Roy working during an AI4I bootcamp session', caption:'Working during a bootcamp session at the AI for Impact Challenge 2026.' },
    { src:'assets/bootcamp-group.webp', alt:'Roy with fellow AI4I participants', caption:'A group moment during the AI for Impact Challenge 2026.' },
    { src:'assets/ai4i-session-front.webp', alt:'Roy seated during an AI4I programme session', caption:'During the AI for Impact Challenge 2026 programme sessions.' },
    { src:'assets/ai4i-dinner-three.webp', alt:'Roy with fellow participants during AI4I 2026', caption:'With fellow participants during the AI for Impact Challenge 2026.' },
    { src:'assets/ai4i-session-wide.webp', alt:'AI4I 2026 programme environment', caption:'Inside the AI for Impact Challenge 2026 programme environment.' },
    { src:'assets/ai4i-dinner-four.webp', alt:'Roy networking with fellow participants during AI4I 2026', caption:'Networking with fellow participants during AI4I 2026.' }
  ],
  certificate: [
    { src:'assets/yorshield-certificate.webp', alt:'Certificate of Appreciation presented to YorShield Security', caption:'Certificate of Appreciation presented to YorShield Security for contribution as an innovator during the AI for Impact Challenge 2026.' }
  ]
};

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxThumbs = document.getElementById('lightboxThumbs');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let activeGallery = 'bootcamp';
let activeIndex = 0;

function renderGallery() {
  const items = galleries[activeGallery] || [];
  if (!items.length || !lightboxImage) return;
  activeIndex = Math.max(0, Math.min(activeIndex, items.length - 1));
  const item = items[activeIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  if (lightboxCaption) lightboxCaption.textContent = item.caption;
  if (lightboxCounter) lightboxCounter.textContent = `${activeIndex + 1} / ${items.length}`;
  const single = items.length <= 1;
  if (lightboxPrev) lightboxPrev.hidden = single;
  if (lightboxNext) lightboxNext.hidden = single;
  if (lightboxThumbs) {
    lightboxThumbs.innerHTML = '';
    if (!single) {
      items.forEach((thumbItem, index) => {
        const btn = document.createElement('button');
        btn.className = `lightbox-thumb${index === activeIndex ? ' active' : ''}`;
        btn.type = 'button';
        btn.setAttribute('aria-label', `View image ${index + 1}`);
        btn.innerHTML = `<img src="${thumbItem.src}" alt="">`;
        btn.addEventListener('click', () => { activeIndex = index; renderGallery(); });
        lightboxThumbs.appendChild(btn);
      });
      lightboxThumbs.querySelector('.active')?.scrollIntoView({ inline:'center', block:'nearest', behavior:'smooth' });
    }
  }
}

function openGallery(name, index = 0) {
  if (!galleries[name] || !lightbox) return;
  activeGallery = name;
  activeIndex = Number(index) || 0;
  renderGallery();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose?.focus();
}
function closeGallery() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function moveGallery(delta) {
  const items = galleries[activeGallery] || [];
  if (items.length <= 1) return;
  activeIndex = (activeIndex + delta + items.length) % items.length;
  renderGallery();
}

document.querySelectorAll('[data-gallery]').forEach((button) => {
  button.addEventListener('click', () => openGallery(button.dataset.gallery, button.dataset.galleryIndex));
});
lightboxClose?.addEventListener('click', closeGallery);
lightboxPrev?.addEventListener('click', () => moveGallery(-1));
lightboxNext?.addEventListener('click', () => moveGallery(1));
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeGallery(); });
document.addEventListener('keydown', (event) => {
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') moveGallery(-1);
  if (event.key === 'ArrowRight') moveGallery(1);
});
