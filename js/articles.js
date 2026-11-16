/* =====================================================
   articles.js — Writing page articles
   ===================================================== */

// ===== POLITICS PAGE =====
async function loadPoliticsArticles() {
  const featuredEl = document.getElementById('featuredArticle');
  const gridEl = document.getElementById('articlesGrid');
  if (!featuredEl && !gridEl) return;

  const data = await fetchContent('content/articles.json');
  if (!data || !data.articles || !data.articles.length) {
    // Nothing published here yet — hide quietly rather than show an empty state
    if (gridEl) gridEl.style.display = 'none';
    if (featuredEl) featuredEl.style.display = 'none';
    return;
  }

  const [featured, ...rest] = data.articles;

  // Render featured article
  if (featuredEl) {
    const imgSrc = featured.image || `https://picsum.photos/seed/${encodeURIComponent(featured.title)}/1000/600`;
    const link = featured.url
      ? `<a href="${featured.url}" target="_blank" rel="noopener" class="btn btn--primary">Read Article &rarr;</a>`
      : '';
    featuredEl.innerHTML = `
      <img class="featured-article__img" src="${imgSrc}" alt="${featured.title}">
      <div class="featured-article__body">
        <span class="featured-badge">Featured</span>
        ${featured.publication ? `<div class="featured-article__pub">${featured.publication}</div>` : ''}
        <div class="featured-article__date">${formatDate(featured.date)}</div>
        <h2 class="featured-article__title">${featured.title}</h2>
        <p class="featured-article__excerpt">${featured.excerpt || ''}</p>
        ${link}
      </div>`;
  }

  // Render remaining articles grid
  if (gridEl && rest.length) {
    gridEl.innerHTML = rest.map(a => renderArticleCard(a, true)).join('');
    gridEl.querySelectorAll('.article-card').forEach(card => card.classList.add('fade-in'));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.07 });
    gridEl.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  } else if (gridEl) {
    gridEl.style.display = 'none';
  }
}

// Run on page load
loadPoliticsArticles();
