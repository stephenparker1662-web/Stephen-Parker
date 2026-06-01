/* =====================================================
   gallery.js — Photo grid, filters, lightbox
   ===================================================== */

let allPhotos = [];
let currentIndex = 0;
let filteredPhotos = [];

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbMeta = document.getElementById('lbMeta');
  const lbCounter = document.getElementById('lbCounter');

  function openLightbox(index) {
    currentIndex = index;
    const photo = filteredPhotos[index];
    lbImg.src = photo.image || `https://picsum.photos/seed/${encodeURIComponent(photo.title)}/1200/800`;
    lbImg.alt = photo.title;
    lbTitle.textContent = photo.title;
    lbMeta.textContent = photo.category ? photo.category.charAt(0).toUpperCase() + photo.category.slice(1) : '';
    lbCounter.textContent = `${index + 1} / ${filteredPhotos.length}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function prevPhoto() {
    currentIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    openLightbox(currentIndex);
  }

  function nextPhoto() {
    currentIndex = (currentIndex + 1) % filteredPhotos.length;
    openLightbox(currentIndex);
  }

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', prevPhoto);
  document.getElementById('lbNext').addEventListener('click', nextPhoto);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  });

  // ===== RENDER GRID =====
  function renderGrid(photos) {
    filteredPhotos = photos;
    const grid = document.getElementById('photoGrid');
    if (!grid) return;
    if (!photos.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <h3>No photos in this category yet</h3>
        <p>Add photos via the admin panel at <a href="admin/" style="color:var(--gold)">/admin</a></p>
      </div>`;
      return;
    }
    grid.innerHTML = photos.map((p, i) => {
      const src = p.image || `https://picsum.photos/seed/${encodeURIComponent(p.title)}/600/800`;
      return `
        <div class="photo-card fade-in" data-index="${i}">
          <img class="photo-card__img" src="${src}" alt="${p.title}" loading="lazy">
          <div class="photo-card__overlay">
            <div class="photo-card__info">
              <span class="photo-card__category">${p.category || ''}</span>
              <div class="photo-card__title">${p.title}</div>
            </div>
          </div>
        </div>`;
    }).join('');

    // Re-observe new elements for animations
    grid.querySelectorAll('.fade-in').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.05 });
      obs.observe(el);
    });

    // Attach click handlers
    grid.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('click', () => openLightbox(parseInt(card.dataset.index)));
    });
  }

  // ===== FILTERS =====
  function initFilters(photos) {
    const categories = ['all', ...new Set(photos.map(p => p.category).filter(Boolean))];
    const filterBar = document.getElementById('filterBar');
    if (!filterBar) return;
    filterBar.innerHTML = categories.map(cat => `
      <button class="filter-btn${cat === 'all' ? ' active' : ''}" data-cat="${cat}">
        ${cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
      </button>`).join('');

    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        const filtered = cat === 'all' ? photos : photos.filter(p => p.category === cat);
        renderGrid(filtered);
      });
    });

    // Auto-activate filter from URL hash (e.g. #photojournalism or #nature)
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash) {
      const matchBtn = filterBar.querySelector(`[data-cat="${hash}"]`);
      if (matchBtn) matchBtn.click();
    }
  }

  // ===== LOAD PHOTOS =====
  async function loadPhotos() {
    const grid = document.getElementById('photoGrid');
    if (!grid) return;
    const data = await fetchContent('content/photos.json');
    if (!data || !data.photos || !data.photos.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <h3>No photos yet</h3>
        <p>Add your first photo via <a href="admin/" style="color:var(--gold)">the admin panel</a></p>
      </div>`;
      return;
    }
    allPhotos = data.photos;
    initFilters(allPhotos);
    renderGrid(allPhotos);
  }

  loadPhotos();
}
