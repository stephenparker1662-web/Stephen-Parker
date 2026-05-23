/* =====================================================
   articles.js — Politics articles & Wellington posts
   ===================================================== */

// ===== POLITICS PAGE =====
async function loadPoliticsArticles() {
  const featuredEl = document.getElementById('featuredArticle');
  const gridEl = document.getElementById('articlesGrid');
  if (!featuredEl && !gridEl) return;

  const data = await fetchContent('content/articles.json');
  if (!data || !data.articles || !data.articles.length) {
    if (gridEl) gridEl.innerHTML = emptyState('No articles yet', 'Add your first article via the admin panel.');
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

// ===== WELLINGTON PAGE =====
async function loadWellingtonPosts() {
  const featuredEl = document.getElementById('wellingtonFeatured');
  const gridEl = document.getElementById('wellingtonGrid');
  if (!featuredEl && !gridEl) return;

  const data = await fetchContent('content/wellington.json');
  if (!data || !data.posts || !data.posts.length) {
    if (featuredEl) featuredEl.innerHTML = emptyState('No stories yet', 'Add your first Wellington story via the admin panel.');
    if (gridEl) gridEl.style.display = 'none';
    return;
  }

  const [featuredLeft, featuredRight, ...rest] = data.posts;

  if (featuredEl) {
    let html = '';
    if (featuredLeft) html += renderWellingtonCard(featuredLeft, true);
    if (featuredRight) html += renderWellingtonCard(featuredRight, false);
    featuredEl.innerHTML = html;
  }

  if (gridEl && rest.length) {
    gridEl.innerHTML = rest.map(p => renderWellingtonCard(p, false)).join('');
  } else if (gridEl) {
    gridEl.style.display = 'none';
  }
}

// Run on page load
loadPoliticsArticles();
loadWellingtonPosts();
