/* =====================================================
   main.js — Navigation, scroll animations, utilities
   ===================================================== */

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// Mark active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  link.classList.toggle('active', href === currentPage || (currentPage === '' && href === 'index.html'));
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== CONTENT FETCHER =====
async function fetchContent(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ===== EMPTY STATE HELPER =====
function emptyState(title, desc) {
  return `<div class="empty-state"><h3>${title}</h3><p>${desc}</p></div>`;
}

// ===== FORMAT DATE =====
function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ===== ARTICLE CARD RENDERER =====
function renderArticleCard(item, isPolitics = false) {
  const imgSrc = item.image || `https://picsum.photos/seed/${encodeURIComponent(item.title)}/800/450`;
  const tags = (item.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  const pub = item.publication ? `<span class="article-card__pub">${item.publication}</span>` : '';
  const link = item.url
    ? `<a href="${item.url}" target="_blank" rel="noopener" class="article-card__link">Read Article &rarr;</a>`
    : '';
  return `
    <article class="article-card">
      <img class="article-card__img" src="${imgSrc}" alt="${item.title}" loading="lazy">
      <div class="article-card__body">
        <div class="article-card__meta">
          ${pub}
          <span class="article-card__date">${formatDate(item.date)}</span>
        </div>
        <h3 class="article-card__title">${item.title}</h3>
        <p class="article-card__excerpt">${item.excerpt || ''}</p>
        ${tags ? `<div class="article-card__tags">${tags}</div>` : ''}
        ${link}
      </div>
    </article>`;
}

// ===== WELLINGTON CARD RENDERER =====
function renderWellingtonCard(item, featured = false) {
  const imgSrc = item.image || `https://picsum.photos/seed/${encodeURIComponent(item.title)}/800/600`;
  return `
    <article class="wellington-card${featured ? ' featured' : ''}">
      <img class="wellington-card__img" src="${imgSrc}" alt="${item.title}" loading="lazy">
      <div class="wellington-card__body">
        <span class="wellington-card__date">${formatDate(item.date)}</span>
        <h3 class="wellington-card__title">${item.title}</h3>
        <p class="wellington-card__excerpt">${item.excerpt || ''}</p>
        <a href="#" class="article-card__link">Read More &rarr;</a>
      </div>
    </article>`;
}
