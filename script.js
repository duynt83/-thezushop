const ZALO_LINK = 'https://zalo.me/0962467083';

function buildZaloLink(productName) {
  return `${ZALO_LINK}?text=${encodeURIComponent(`Mình muốn mua ${productName}`)}`;
}

function normalizeProducts(rows) {
  return (rows || []).map((item) => ({
    name: item.name,
    subtitle: item.subtitle || '',
    logo: item.image_url || '',
    priceLines: Array.isArray(item.price_lines) ? item.price_lines : [],
    ctaLabel: 'Mua qua Zalo'
  }));
}

function renderPriceLines(priceLines = []) {
  return priceLines.map((line) => `<li>${line}</li>`).join('');
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  const loading = document.getElementById('loadingNote');
  if (!grid) return;
  if (loading) loading.style.display = 'none';

  grid.innerHTML = products.map((product) => `
      <article class="showcase-card">
        <div class="showcase-top">
          <div class="product-logo image-logo"><img src="${product.logo}" alt="${product.name}" class="product-logo-img" /></div>
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

async function loadProducts() {
  const loading = document.getElementById('loadingNote');
  try {
    const config = window.SUPABASE_CONFIG;
    if (!config?.url || !config?.anonKey || config.url === 'YOUR_SUPABASE_URL') {
      renderProducts(window.DEFAULT_PRODUCTS || []);
      if (loading) loading.textContent = 'Đang hiển thị dữ liệu mẫu local. Gắn Supabase để lấy dữ liệu online.';
      return;
    }

    const client = window.supabase.createClient(config.url, config.anonKey);
    const { data, error } = await client
      .from('products')
      .select('name, subtitle, price_lines, image_url, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    renderProducts(normalizeProducts(data));
  } catch (error) {
    console.error(error);
    if (loading) loading.textContent = 'Không tải được dữ liệu Supabase, đang dùng dữ liệu mẫu local.';
    renderProducts(window.DEFAULT_PRODUCTS || []);
  }
}

loadProducts();
