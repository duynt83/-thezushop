const ZALO_LINK = 'https://zalo.me/0962467083';

function buildZaloLink(productName) {
  return `${ZALO_LINK}?text=${encodeURIComponent(`Mình muốn mua ${productName}`)}`;
}

function renderPriceLines(priceLines = []) {
  return priceLines.map((line) => `<li>${line}</li>`).join('');
}

function getLogoClass(product) {
  const path = String(product.logo || '').toLowerCase();
  if (path.includes('youtube-premium')) return 'product-logo image-logo logo-wide';
  if (path.includes('spotify.jpg')) return 'product-logo image-logo logo-large';
  return 'product-logo image-logo logo-large';
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  const loading = document.getElementById('loadingNote');
  if (!grid) return;
  if (loading) loading.style.display = 'none';

  grid.innerHTML = products.map((product) => `
      <article class="showcase-card">
        <div class="showcase-top">
          <div class="${getLogoClass(product)}"><img src="${product.logo}" alt="${product.name}" class="product-logo-img" /></div>
          <div>
            <h3>${product.name}</h3>
            <p>${product.subtitle || ''}</p>
          </div>
        </div>
        <ul class="price-list compact-price-list">
          ${renderPriceLines(product.priceLines || [])}
        </ul>
        <a class="btn btn-primary full" href="${buildZaloLink(product.name)}" target="_blank" rel="noreferrer">${product.ctaLabel || 'Mua qua Zalo'}</a>
      </article>
    `).join('');
}

renderProducts(window.DEFAULT_PRODUCTS || []);
window.thezuShop = { renderProducts };
