import './store-style.css'
import { supabase, getCurrentUser, signIn, signUp, signOut, getLocalFileUrl, LOCAL_API_URL } from '../shared/supabase.js'

let allProducts = []
let isLoadingProducts = false
let hasInitialFetched = false

async function fetchProductsFromSupabase() {
  if (isLoadingProducts) return
  isLoadingProducts = true
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    allProducts = data || []
  } catch (err) {
    console.error('Error fetching products:', err.message)
  } finally {
    isLoadingProducts = false
    hasInitialFetched = true
    if (typeof window.render === 'function') {
      window.render()
    }
  }
}

function wrapWords(text) {
  return text.split(' ').map(word => `<span class="word">${word}</span>`).join(' ')
}
function hw(text) {
  return `<span class="hover-word">${wrapWords(text)}</span>`
}

function getStoreNav() {
  return `
    <div class="cursor-dot"></div>
    <div class="cursor-outline"></div>

    <header class="site-header reveal">
      <div class="store-nav-brand" data-store-nav="">
        Geo<span>Data</span>
      </div>
      <button class="mobile-menu-btn" aria-label="Toggle Menu">
        <span></span>
        <span></span>
      </button>
      <nav class="site-nav" style="gap: 1.5rem;">
        <a href="/store/" data-store-nav="">Trang chủ Store</a>
        <a href="#store-catalog">Dữ liệu</a>
        <a href="#store-pricing">Bảng giá</a>
        <a href="/geoextractor/" style="color:var(--color-accent); font-weight:700;">GeoExtractor</a>
        <a href="#store-dashboard" id="nav-account-link">Tài khoản</a>
        <a href="/" style="color:#888; margin-left:1rem;">← Về Vũ An Edit</a>
      </nav>
    </header>
  `
}

function getStoreFooter() {
  return `
    <footer class="site-footer" style="border-color: #222;">
      <p>© 2026 GeoData. Dữ liệu bản đồ cho Video Editor.</p>
      <div style="display:flex; gap:1.5rem; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
        <a href="#store-pricing">Gói cước</a>
        <a href="https://zalo.me/0967575313" target="_blank">Hỗ trợ Zalo</a>
      </div>
    </footer>
  `
}

function getStoreHomeTemplate() {
  const featured = allProducts.filter(p => p.featured).slice(0, 3)
  
  const productCards = featured.map(p => {
    const accessTag = p.access === 'free'
      ? `<span style="background:#2ecc71; color:#000; font-size:0.65rem; font-weight:900; padding:0.2rem 0.5rem; text-transform:uppercase; letter-spacing:0.06em;">FREE</span>`
      : `<span style="background:#333; color:#aaa; font-size:0.65rem; font-weight:900; padding:0.2rem 0.5rem; text-transform:uppercase; letter-spacing:0.06em;">PAID</span>`
    const lifetimeBadge = p.is_lifetime 
      ? `<span class="badge badge-lifetime">LIFETIME</span>` 
      : `<span class="badge badge-${p.format}">${p.format}</span>`

    return `
    <a href="#store-product-${p.id}" class="product-card reveal">
      <img src="${p.thumb}" alt="${p.title}" class="product-thumb">
      <div class="product-content">
        <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom:0.5rem;">
          ${lifetimeBadge}
          ${accessTag}
        </div>
        <h3 class="product-title hover-word" style="margin-top:0.5rem;">${wrapWords(p.title)}</h3>
        <p class="product-desc">${p.description || ''}</p>
          <span style="font-size:0.85rem; color:var(--color-accent); font-weight:700;">Xem chi tiết <i class="bi bi-arrow-right"></i></span>
      </div>
    </a>
  `}).join('')

  return `
    ${getStoreNav()}
    <main>
      <section class="store-hero">
        <div class="container reveal">
          <h1 class="hover-word">${wrapWords('Dữ Liệu Bản Đồ')}<br>${wrapWords('Cho Video Editor')}</h1>
          <p>${hw('Khám phá kho tàng KML, GeoJSON và Plugin chất lượng cao, tối ưu tuyệt đối cho công việc dựng phim và mô phỏng bản đồ thực chiến.')}</p>
          <div style="margin-top: 2rem;">
            <a href="#store-catalog" class="plan-btn" style="display:inline-block; width:auto; padding: 1rem 2.5rem; background: var(--color-accent); color: #000; border-color: var(--color-accent);">Khám phá ngay</a>
          </div>
        </div>
      </section>

      <!-- GeoExtractor Feature Banner -->
      <div class="container reveal" style="margin: 4vh auto;">
        <div style="background: transparent; border: 1.5px solid var(--color-accent); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; md:flex-row; box-shadow: 0 0 20px rgba(180, 253, 0, 0.05);">
          <div style="padding: 4rem; flex: 1; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
             <div style="display:inline-block; padding: 0.3rem 0.8rem; background:var(--color-accent); color:#000; font-size:0.75rem; font-weight:900; text-transform:uppercase; border-radius:4px; margin-bottom:1.5rem;">Độc quyền Lifetime</div>
             <h2 style="font-size: 2.8rem; margin-bottom: 1.5rem; color: #fff;">Công cụ <span style="color:var(--color-accent);">GeoExtractor</span></h2>
             <p style="color:var(--color-subtle); max-width:650px; margin-bottom: 2.5rem; line-height: 1.7;">
               Trích xuất dữ liệu bản đồ OpenStreetMap (Tòa nhà, Sông hồ, Đường bộ, Quốc gia) trực tiếp ngay trên trình duyệt.<br>Tải xuống định dạng GeoJSON hoặc KML chỉ với 1 click chuột! Không giới hạn tính năng.
             </p>
             <a href="/geoextractor/" class="plan-btn" style="background:var(--color-accent); color:#000; border-color:var(--color-accent); padding: 1rem 3rem; width: auto; font-size: 1rem; font-weight: 800;">Trải Nghiệm Ngay</a>
          </div>
        </div>
      </div>

      <section class="container" style="padding: 6vh 2rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end;">
          <h2 class="reveal hover-word" style="font-size:2rem;">${wrapWords('Sản Phẩm Nổi Bật')}</h2>
          <a href="#store-catalog" class="reveal" style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--color-accent);">Xem tất cả <i class="bi bi-arrow-right"></i></a>
        </div>
        <div class="product-grid">
          ${productCards}
        </div>
      </section>

      <section class="container reveal" style="padding: 4vh 2rem 8vh; text-align:center;">
        <div style="border: 1.5px solid var(--color-border); padding: 4rem; background: #111;">
          <h2 class="hover-word" style="font-size: 2rem; margin-bottom: 1rem;">${wrapWords('Tham gia gói Hội Viên')}</h2>
          <p style="color:var(--color-subtle); max-width:500px; margin:0 auto 2rem;">Đăng ký gói hội viên để truy cập không giới hạn toàn bộ kho dữ liệu bản đồ cập nhật liên tục.</p>
          <a href="#store-pricing" class="plan-btn" style="display:inline-block; width:auto; padding: 0.8rem 2rem;">Xem Bảng Giá</a>
        </div>
      </section>
    </main>
    ${getStoreFooter()}
  `
}

function getStoreCatalogTemplate() {
  const productCards = allProducts.map(p => {
    const accessTag = p.access === 'free'
      ? `<span style="background:#2ecc71; color:#000; font-size:0.65rem; font-weight:900; padding:0.2rem 0.5rem; text-transform:uppercase; letter-spacing:0.06em;">FREE</span>`
      : `<span style="background:#333; color:#aaa; font-size:0.65rem; font-weight:900; padding:0.2rem 0.5rem; text-transform:uppercase; letter-spacing:0.06em;">PAID</span>`
    
    const lifetimeBadge = p.is_lifetime 
      ? `<span class="badge badge-lifetime">LIFETIME</span>` 
      : `<span class="badge badge-${p.format}">${p.format}</span>`

    return `
    <a href="#store-product-${p.id}" class="product-card reveal" data-format="${p.format}" data-access="${p.access}" data-lifetime="${p.is_lifetime || false}" data-title="${p.title.toLowerCase()}">
      <img src="${p.thumb}" alt="${p.title}" class="product-thumb">
      <div class="product-content">
        <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom:0.5rem;">
          ${lifetimeBadge}
          ${accessTag}
        </div>
        <h3 class="product-title hover-word" style="margin-top:0.5rem;">${wrapWords(p.title)}</h3>
        <p class="product-desc">${p.description || ''}</p>
        <div class="product-footer">
          <span style="font-size:0.8rem; font-weight:700;">${p.size}</span>
          <span style="font-size:0.85rem; color:var(--color-accent); font-weight:700;">Xem chi tiết <i class="bi bi-arrow-right"></i></span>
        </div>
      </div>
    </a>
  `
  }).join('')

  return `
    ${getStoreNav()}
    <main>
      <section class="container" style="padding: 6vh 2rem;">
        <h1 class="reveal hover-word" style="font-size: 3rem;">${wrapWords('Kho Dữ Liệu')}</h1>
        <p class="reveal" style="color:var(--color-subtle); margin-top:1rem; max-width:600px;">Tìm kiếm và tải xuống các layer bản đồ phù hợp nhất cho dự án video của bạn.</p>

        <div class="store-tools reveal">
          <div class="search-wrapper">
            <i class="bi bi-search search-icon" style="font-size:0.9rem; opacity:0.6;"></i>
            <input type="text" id="store-search" class="search-input" placeholder="Tìm tên sản phẩm hoặc nội dung...">
          </div>
          
          <div class="filter-tabs" id="store-filters">
            <button class="filter-btn active" data-filter="all">Tất cả</button>
            <button class="filter-btn" data-filter="free">Miễn phí</button>
            <button class="filter-btn" data-filter="geojson">GeoJSON</button>
            <button class="filter-btn" data-filter="kml">KML Files</button>
            <button class="filter-btn" data-filter="plugin">Plugins</button>
            <button class="filter-btn" data-filter="lifetime" style="border-color:var(--color-accent); color:var(--color-accent);">PRO Lifetime</button>
          </div>
        </div>

        <div class="product-grid" id="catalog-grid">
          ${productCards}
        </div>
      </section>
    </main>
    ${getStoreFooter()}
  `
}

function getStorePricingTemplate() {
  return `
    ${getStoreNav()}
    <main>
      <section class="container" style="padding: 8vh 2rem;">
        <div style="text-align:center; max-width:600px; margin: 0 auto;">
          <h1 class="reveal hover-word" style="font-size: 3.5rem;">${wrapWords('Gói Hội Viên')}</h1>
        </div>

        <div class="pricing-grid reveal">
          <div class="plan-card">
            <h3 class="plan-name">Monthly</h3>
            <div class="plan-price">79K<span>/tháng</span></div>
            <ul class="plan-features">
              <li>Truy cập toàn bộ KML & GeoJSON</li>
              <li>Sử dụng trong mọi dự án</li>
              <li>Hỗ trợ cơ bản</li>
            </ul>
            <a href="#" class="plan-btn btn-subscribe" data-plan="monthly">Đăng ký ngay</a>
          </div>

          <div class="plan-card popular">
            <div class="plan-badge">Phổ Biến Nhất</div>
            <h3 class="plan-name">Yearly</h3>
            <div class="plan-price">599K<span>/năm</span></div>
            <ul class="plan-features">
              <li><strong>Tiết kiệm 37%</strong> (chỉ ~50k/tháng)</li>
              <li>Truy cập MIỄN PHÍ Plugins</li>
              <li>Cập nhật file hằng tuần</li>
              <li>Hỗ trợ ưu tiên (Zalo 1-kèm-1)</li>
            </ul>
            <a href="#" class="plan-btn btn-subscribe" data-plan="yearly">Đăng ký ngay</a>
          </div>

          <div class="plan-card">
            <h3 class="plan-name">Lifetime</h3>
            <div class="plan-price">1.299K<span>/mãi mãi</span></div>
            <ul class="plan-features">
              <li>Thanh toán 1 lần, dùng trọn đời</li>
              <li>Luôn có toàn bộ file mới nhất</li>
              <li>Thêm file theo yêu cầu (max 2/tháng)</li>
            </ul>
            <a href="#" class="plan-btn btn-subscribe" data-plan="lifetime">Đăng ký ngay</a>
          </div>
        </div>
      </section>
    </main>
    ${getStoreFooter()}
  `
}

function getStoreProductTemplate(productId) {
  const p = allProducts.find(x => x.id === productId)
  if (!p) return `
    ${getStoreNav()}
    <main><div class="container" style="padding: 8vh 2rem; text-align:center;"><h2>Không tìm thấy sản phẩm</h2></div></main>
    ${getStoreFooter()}
  `

  return `
    ${getStoreNav()}
    <main>
      <section class="container" style="padding: 6vh 2rem;">
        <a href="#store-catalog" style="font-size:0.85rem; font-weight:700; color:var(--color-subtle); text-transform:uppercase;"><i class="bi bi-arrow-left"></i> Trở lại Cửa hàng</a>
        
        <div class="reveal" style="margin-top:2rem; border:1.5px solid var(--color-border); background:#111; overflow:hidden;">
          <div style="aspect-ratio:21/9; background:#000; border-bottom:1.5px solid var(--color-border);">
            <img src="${p.thumb}" style="width:100%; height:100%; object-fit:cover; opacity:0.8;">
          </div>
          <div style="padding: 3rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:2rem;">
              <div style="max-width: 600px;">
                <span class="badge badge-${p.format}">${p.format}</span>
                <h1 class="hover-word" style="font-size:2.5rem; margin-top:1rem;">${wrapWords(p.title)}</h1>
                <p style="color:var(--color-subtle); margin-top:1rem; line-height:1.7;">${p.description || ''}</p>
                <div style="margin-top:1.5rem; font-size:0.85rem; font-weight:700; color:#888;">
                  <span style="display:inline-block; margin-right:2rem;">Kích thước: <span style="color:#fff">${p.size}</span></span>
                  <span>Định dạng: <span style="color:#fff; text-transform:uppercase;">${p.format}</span></span>
                </div>
              </div>
              
              <div style="background:#000; padding:2rem; border:1.5px solid var(--color-border); min-width: 300px;">
                <h3 style="margin-bottom:1rem; font-size:1.2rem;">Truy cập tệp tin</h3>
                <div id="product-download-area">
                  <p style="font-size:0.85rem; margin-bottom:1.5rem; color:var(--color-subtle);">Bạn cần đăng nhập và có gói Hội Viên đang hoạt động để tải xuống tệp này.</p>
                  <a href="#store-pricing" class="plan-btn" style="background:var(--color-accent); color:#000; border-color:var(--color-accent); margin-bottom:1rem;">Nâng cấp Hội Viên</a>
                  <a href="#store-login" style="display:block; text-align:center; font-size:0.85rem; text-decoration:underline; font-weight:700;">Đăng nhập</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${getStoreFooter()}
  `
}

function getStoreAuthTemplate() {
  return `
    ${getStoreNav()}
    <main>
      <div class="auth-container reveal">
        <div class="auth-header">
          <h2 class="hover-word" style="font-size:2rem; margin-bottom:0.5rem;" id="auth-title">${wrapWords('Đăng nhập')}</h2>
          <p style="color:var(--color-subtle); font-size:0.9rem;" id="auth-subtitle">Chào mừng trở lại GeoData</p>
        </div>

        <form id="store-auth-form">
          <div id="auth-error" style="color:#e74c3c; font-size:0.8rem; margin-bottom:1rem; display:none; font-weight:700;"></div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="auth-email" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Mật khẩu</label>
            <input type="password" id="auth-password" class="form-input" required>
          </div>
          <button type="submit" class="submit-btn" id="auth-submit-btn">Đăng nhập</button>
        </form>

        <div class="auth-toggle">
          <span id="auth-toggle-text">Chưa có tài khoản?</span>
          <a href="#" id="auth-toggle-btn">Đăng ký ngay</a>
        </div>
      </div>
    </main>
    ${getStoreFooter()}
  `
}

function getStoreDashboardTemplate() {
  return `
    ${getStoreNav()}
    <main>
      <section class="container" style="padding: 6vh 2rem;">
        <div class="reveal">
          <h1 class="hover-word" style="font-size:2.5rem;">${wrapWords('Tài Khoản')}</h1>
        </div>

        <div class="dashboard-grid reveal">
          <div style="border-right: 1.5px solid var(--color-border); padding-right:2rem;">
            <div style="margin-bottom:2rem;">
              <div style="font-weight:700; color:var(--color-subtle); text-transform:uppercase; font-size:0.75rem; margin-bottom:0.5rem;">Thông tin</div>
              <div id="dashboard-email" style="font-size:1.1rem; font-weight:700; word-break:break-all;">Loading...</div>
            </div>
            <div style="margin-bottom:2rem;">
              <div style="font-weight:700; color:var(--color-subtle); text-transform:uppercase; font-size:0.75rem; margin-bottom:0.8rem;">Gói hiện tại</div>
              <div class="plan-badge-current" style="display:inline-block; background:#222; color:#fff; padding:0.4rem 0.8rem; font-size:0.8rem; font-weight:700; border:1px solid #444;">MIỄN PHÍ</div>
              <div style="margin-top:1rem;">
                <a href="#store-pricing" style="font-size:0.8rem; color:var(--color-accent); text-decoration:underline;">Nâng cấp gói</a>
              </div>
            </div>
            <button id="btn-logout" style="color:#e74c3c; font-size:0.85rem; font-weight:700; text-transform:uppercase;">Đăng xuất <i class="bi bi-arrow-right"></i></button>
          </div>

          <div>
            <h3 style="margin-bottom:1.5rem; font-size:1.2rem; border-bottom:1.5px solid var(--color-border); padding-bottom:1rem;">Lịch sử tải xuống</h3>
            <p style="color:var(--color-subtle); font-size:0.9rem;">Bạn chưa tải xuống tệp nào.</p>
            <a href="#store-catalog" class="plan-btn" style="display:inline-block; width:auto; padding:0.8rem 1.5rem; margin-top:2rem;">Duyệt sản phẩm</a>
            <div id="dashboard-admin-link"></div>
          </div>
        </div>
      </section>
    </main>
    ${getStoreFooter()}
  `
}

function getStoreCheckoutTemplate() {
  const planId = sessionStorage.getItem('store-auth-plan') || 'Không rõ gói'
  let price = 'Liên hệ'; let planName = 'Gói Chưa Xác Định';
  if(planId === 'monthly') { price = '79.000 VNĐ'; planName = 'Monthly'; }
  if(planId === 'yearly') { price = '599.000 VNĐ'; planName = 'Yearly'; }
  if(planId === 'lifetime') { price = '1.299.000 VNĐ'; planName = 'Lifetime'; }

  return `
    ${getStoreNav()}
    <main>
      <section class="container reveal" style="padding: 8vh 2rem;">
        <div style="max-width: 600px; margin: 0 auto; background: #111; border: 1.5px solid var(--color-border); padding: 3rem;">
          <h1 class="hover-word" style="font-size: 2rem; margin-bottom: 2rem; text-align: center;">${wrapWords('Thanh Toán')}</h1>
          <div style="margin-bottom: 2rem; border-bottom: 1.5px solid var(--color-border); padding-bottom: 1.5rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
              <span style="color:var(--color-subtle);">Gói đã chọn:</span>
              <span style="font-weight:700;">${planName}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size: 1.2rem;">
              <span style="color:var(--color-subtle);">Tổng tiền:</span>
              <span style="font-weight:900; color:var(--color-accent);">${price}</span>
            </div>
          </div>
          <div id="checkout-qr-container" style="margin-bottom: 2rem;">
            <div style="background: #000; border: 1.5px solid var(--color-border); padding: 1.5rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1.5rem;">
              <p style="text-align:center; color:var(--color-accent); font-weight:700;">Đang tạo mã thanh toán...</p>
            </div>
          </div>
          <p style="color:var(--color-subtle); font-size:0.85rem; text-align:center; margin-bottom: 2rem;">
            Hệ thống sẽ tự động kích hoạt gói ngay sau khi bạn hoàn tất chuyển khoản.
          </p>
          <div id="payment-status-message" style="text-align:center; margin-bottom: 1rem; display:none;">
            <p style="color:var(--color-accent); font-weight:700;"><i class="bi bi-check-lg"></i> Đã nhận thanh toán! Đang chuyển hướng...</p>
          </div>
          <a href="https://zalo.me/0967575313" target="_blank" class="plan-btn" style="background:transparent; color:#fff; border-color:#444; text-align:center; font-size:0.8rem;">Gặp sự cố? Liên hệ Admin qua Zalo</a>
          <div style="margin-top: 1.5rem; text-align:center;">
            <a href="#store-pricing" style="color:var(--color-subtle); font-size:0.85rem; text-decoration:underline;"><i class="bi bi-arrow-left"></i> Đổi gói khác</a>
          </div>
        </div>
      </section>
    </main>
    ${getStoreFooter()}
  `
}

function getStoreAdminTemplate() {
  return `
    ${getStoreNav()}
    <main>
      <section class="container reveal" style="padding: 8vh 2rem;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 class="hover-word" style="font-size: 2.5rem; margin-bottom: 1rem;">${wrapWords('Quản Lý Dữ Liệu')}</h1>
          <p style="color:var(--color-subtle); margin-bottom: 2rem;">Thêm và quản lý dữ liệu trên Store.</p>
          
          <div class="filter-tabs reveal" id="admin-tabs" style="margin-bottom: 2rem;">
            <button class="filter-btn active" data-target="admin-tab-upload" id="btn-tab-upload">Thêm Dữ Liệu</button>
            <button class="filter-btn" data-target="admin-tab-products">Danh Sách Dữ Liệu</button>
            <button class="filter-btn" data-target="admin-tab-users">Thành Viên</button>
            <button class="filter-btn" data-target="admin-tab-config" id="btn-tab-config">Cấu hình Tunnel</button>
          </div>

          <div id="admin-tab-config" class="admin-tab-content" style="display: none; background: #111; border: 1.5px solid var(--color-border); padding: 3rem;">
            <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Cấu hình Cloudflare Tunnel</h2>
            <p style="color:var(--color-subtle); margin-bottom: 2rem;">Cập nhật địa chỉ Tunnel để toàn bộ website tự động nhận diện dữ liệu từ máy tính của bạn.</p>
            
            <div class="form-group">
                <label class="form-label">Địa chỉ Tunnel hiện tại</label>
                <div style="display:flex; gap:1rem;">
                    <input type="url" id="admin-config-tunnel-url" class="form-input" placeholder="https://xxx.trycloudflare.com">
                    <button id="btn-save-tunnel" class="plan-btn" style="width:auto; padding:0.5rem 2rem; background:var(--color-accent); color:#000;">Lưu cấu hình</button>
                </div>
                <p style="font-size:0.75rem; color:#888; margin-top:0.8rem;">
                    * Sau khi lưu, toàn bộ người dùng truy cập web sẽ tự động kết nối tới máy chủ của bạn mà không cần dùng Console.
                </p>
            </div>
          </div>
          
          <div id="admin-tab-upload" class="admin-tab-content active" style="background: #111; border: 1.5px solid var(--color-border); padding: 3rem;">
            <form id="admin-upload-form">
              <input type="hidden" id="admin-id">
              <div class="form-group">
                <label class="form-label" id="form-mode-title">Thêm sản phẩm mới</label>
              </div>
              <div class="form-group">
                <label class="form-label">Tên sản phẩm</label>
                <input type="text" id="admin-title" class="form-input" placeholder="Ví dụ: Bản đồ Giao thông Hà Nội" required>
              </div>
              <div class="form-group">
                <label class="form-label">Mô tả tóm tắt</label>
                <textarea id="admin-desc" class="form-input" placeholder="Mô tả về dữ liệu này..." style="min-height: 80px;" required></textarea>
              </div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                  <label class="form-label">Định dạng</label>
                  <select id="admin-format" class="form-input" style="background:transparent; color:#fff;" required>
                    <option value="geojson" style="color:#000">GeoJSON</option>
                    <option value="kml" style="color:#000">KML</option>
                    <option value="plugin" style="color:#000">Plugin</option>
                  </select>
                </div>
                <div>
                  <label class="form-label">Kích thước file</label>
                  <input type="text" id="admin-size" class="form-input" placeholder="Ví dụ: 15.2 MB" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Quyền truy cập</label>
                <select id="admin-access" class="form-input" style="background:transparent; color:#fff;" required>
                  <option value="paid" style="color:#000">Trả phí (Hội viên)</option>
                  <option value="free" style="color:#000">Miễn phí</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Ảnh Thumbnail (URL)</label>
                <input type="url" id="admin-thumb" class="form-input" placeholder="https://example.com/image.jpg" required>
              </div>
              <div class="form-group" style="display:flex; gap:1rem; align-items:flex-end;">
                <div style="flex:1;">
                  <label class="form-label">File Dữ Liệu (Tải lên để đồng bộ GeoExtractor)</label>
                  <input type="file" id="admin-file-upload" class="form-input" accept=".geojson,.json,.kml,.zip">
                  <input type="url" id="admin-file-url" class="form-input" placeholder="Hoặc dán Link URL nếu không tải lên (tùy chọn)" style="margin-top:8px; font-size:12px; background:#111;">
                </div>
                <div style="width:250px;">
                  <label class="form-label">Tích hợp GeoExtractor</label>
                  <select id="admin-zoom-level" class="form-input" style="background:#222; color:#fff;">
                    <option value="none">Không đồng bộ Tool</option>
                    <option value="2">Quốc Gia (Zoom 2-8)</option>
                    <option value="4">Tỉnh Thành (Zoom 9-11)</option>
                    <option value="6">Quận Huyện (Zoom 12-13)</option>
                    <option value="8">Phường Xã (Zoom 14-15)</option>
                    <option value="16">Tòa nhà (Zoom 16+)</option>
                  </select>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                <input type="checkbox" id="admin-featured" style="width: 18px; height: 18px;">
                <label for="admin-featured" style="font-size: 0.85rem; font-weight: 700;">Đánh dấu Nổi Bật (xuất hiện ở Trang Chủ)</label>
              </div>
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                <input type="checkbox" id="admin-lifetime" style="width: 18px; height: 18px;">
                <label for="admin-lifetime" style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent);">Sản phẩm PRO Lifetime (Bắt buộc gói Lifetime)</label>
              </div>
              
              <div id="admin-preview-area" style="display:none; margin-bottom: 2rem; border:1px solid #333; padding:1rem;">
                <canvas id="admin-preview-canvas" style="width:100%; aspect-ratio:16/9; background:#000;"></canvas>
                <p style="font-size:0.7rem; color:#888; margin-top:0.5rem; text-align:center;">Bản xem trước tự động sinh từ dữ liệu</p>
              </div>

              <div class="form-group" style="margin-bottom: 2.5rem; padding: 1.5rem; border: 1px dashed #444; background: #000;">
                <label class="form-label" style="color:var(--color-accent); font-size:0.8rem;">Tự động tạo ảnh từ file (GeoJSON/JSON)</label>
                <div style="display:flex; gap:1rem; align-items:center; margin-top:0.5rem;">
                   <input type="file" id="admin-file-local" accept=".json,.geojson" style="font-size:0.8rem; color:#888;">
                   <button type="button" id="btn-generate-thumb" class="plan-btn" style="width:auto; padding:0.5rem 1rem; font-size:0.8rem; background:#222; border-color:#444;">Tạo Ảnh Thumb</button>
                </div>
              </div>
              
              <div id="form-actions" style="display:flex; gap:1rem;">
                <button type="submit" id="btn-admin-submit" class="plan-btn" style="background:var(--color-accent); color:#000; border-color:var(--color-accent); padding: 1rem 3rem; flex:1;">Tải Lên Store</button>
                <button type="button" id="btn-admin-cancel" class="plan-btn" style="display:none; background:#333; color:#fff; border-color:#444; padding: 1rem 2rem;">Hủy</button>
              </div>
            </form>
          </div>

          <div id="admin-tab-products" class="admin-tab-content" style="display: none; background: #111; border: 1.5px solid var(--color-border); padding: 3rem;">
            <div style="margin-bottom: 2rem;"><h2 style="font-size: 1.5rem;">Dữ liệu hiện có</h2></div>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                  <tr style="border-bottom: 1.5px solid var(--color-border);">
                    <th style="padding: 1rem 0; font-size: 0.85rem; color: var(--color-subtle); text-transform: uppercase;">Sản phẩm</th>
                    <th style="padding: 1rem 0; font-size: 0.85rem; color: var(--color-subtle); text-transform: uppercase;">Loại</th>
                    <th style="padding: 1rem 0; font-size: 0.85rem; color: var(--color-subtle); text-transform: uppercase;">Quyền</th>
                    <th style="padding: 1rem 0; font-size: 0.85rem; color: var(--color-subtle); text-transform: uppercase; text-align: right;">Hành Động</th>
                  </tr>
                </thead>
                <tbody id="admin-products-tbody">
                  <tr><td colspan="4" style="padding: 2rem 0; text-align: center; color: var(--color-subtle);">Đang tải danh sách...</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="admin-tab-users" class="admin-tab-content" style="display: none; background: #111; border: 1.5px solid var(--color-border); padding: 3rem;">
            <div style="margin-bottom: 2rem;"><h2 style="font-size: 1.5rem;">Cấp Quyền Hội Viên</h2></div>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                  <tr style="border-bottom: 1.5px solid var(--color-border);">
                    <th style="padding: 1rem 0; font-size: 0.85rem; color: var(--color-subtle); text-transform: uppercase;">Email</th>
                    <th style="padding: 1rem 0; font-size: 0.85rem; color: var(--color-subtle); text-transform: uppercase;">Ngày Đăng Ký</th>
                    <th style="padding: 1rem 0; font-size: 0.85rem; color: var(--color-subtle); text-transform: uppercase;">Gói Cước</th>
                    <th style="padding: 1rem 0; font-size: 0.85rem; color: var(--color-subtle); text-transform: uppercase; text-align: right;">Hành Động</th>
                  </tr>
                </thead>
                <tbody id="admin-users-tbody">
                  <tr><td colspan="4" style="padding: 2rem 0; text-align: center; color: var(--color-subtle);">Đang tải danh sách thành viên...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div style="margin-top: 3rem; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #333; padding-top:2rem;">
            <a href="#store-dashboard" style="color:var(--color-subtle); text-decoration:underline; font-size:0.85rem;"><i class="bi bi-arrow-left"></i> Về Dashboard</a>
            <a href="/geoextractor/" style="background:#222; border:1px solid #444; color:#b4fd00; padding:10px 20px; font-size:0.85rem; font-weight:700; text-decoration:none; border-radius:4px;"><i class="bi bi-gear-fill"></i> Mở thư viện Data Bản đồ (GeoExtractor)</a>
          </div>
        </div>
      </section>
    </main>
    ${getStoreFooter()}
  `
}

export function getStoreTemplate(view) {
  if (!hasInitialFetched && !isLoadingProducts) {
    fetchProductsFromSupabase()
  }
  
  if (isLoadingProducts && allProducts.length === 0) {
    return `
      ${getStoreNav()}
      <main><div class="container" style="padding: 10vh 2rem; text-align:center;"><p style="letter-spacing:0.1em; color:#888;">ĐANG TẢI DỮ LIỆU...</p></div></main>
      ${getStoreFooter()}
    `
  }
  if (view === 'store-catalog') return getStoreCatalogTemplate()
  if (view === 'store-pricing') return getStorePricingTemplate()
  if (view === 'store-login') return getStoreAuthTemplate()
  if (view === 'store-dashboard') return getStoreDashboardTemplate()
  if (view === 'store-checkout') return getStoreCheckoutTemplate()
  if (view === 'store-admin') return getStoreAdminTemplate()
  if (view.startsWith('store-product-')) {
    const id = view.replace('store-product-', '')
    return getStoreProductTemplate(id)
  }
  return getStoreHomeTemplate()
}

export function initStoreEffects() {
  document.querySelectorAll('[data-store-nav]').forEach(el => {
    el.onclick = () => { window.location.href = '/store/' }
  })

  // Mobile menu toggle for Store
  const menuBtn = document.querySelector('.mobile-menu-btn')
  const nav = document.querySelector('.site-nav')
  if (menuBtn && nav) {
    menuBtn.onclick = () => {
      menuBtn.classList.toggle('active')
      nav.classList.toggle('active')
    }
    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.onclick = (e) => {
        // If it's a store nav brand, don't prevent hash change
        if (link.hasAttribute('data-store-nav')) {
           window.location.href = '/store/'
        }
        menuBtn.classList.remove('active')
        nav.classList.remove('active')
      }
    })
  }

  const filters = document.getElementById('store-filters')
  const searchInput = document.getElementById('store-search')
  
  if (filters && searchInput) {
    const btns = filters.querySelectorAll('.filter-btn')
    const cards = document.querySelectorAll('#catalog-grid .product-card')
    let currentFilter = 'all'

    const refreshFilters = () => {
      const query = searchInput.value.toLowerCase().trim()
      cards.forEach(card => {
        const title = card.dataset.title || ''
        const format = card.dataset.format
        const access = card.dataset.access
        const isLifetime = card.dataset.lifetime === 'true'

        const matchesQuery = title.includes(query)
        let matchesFilter = false
        
        if (currentFilter === 'all') matchesFilter = true
        else if (currentFilter === 'free') matchesFilter = (access === 'free')
        else if (currentFilter === 'lifetime') matchesFilter = isLifetime
        else matchesFilter = (format === currentFilter)

        card.style.display = (matchesQuery && matchesFilter) ? 'flex' : 'none'
      })
    }

    btns.forEach(btn => {
      btn.onclick = () => {
        btns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        currentFilter = btn.dataset.filter
        refreshFilters()
      }
    })

    searchInput.oninput = refreshFilters
  }
  if (document.getElementById('store-auth-form')) initAuthLogic()
  if (document.getElementById('dashboard-email')) initDashboardLogic()
  checkAuthForNav()
  if (document.getElementById('admin-upload-form')) initAdminLogic()
  document.querySelectorAll('.btn-subscribe').forEach(btn => {
    btn.onclick = async (e) => {
      e.preventDefault(); const planId = btn.dataset.plan; const user = await getCurrentUser();
      if (user) { sessionStorage.setItem('store-auth-plan', planId); window.location.hash = '#store-checkout'; }
      else { sessionStorage.setItem('store-auth-mode', 'signup'); sessionStorage.setItem('store-auth-plan', planId); window.location.href = '/store/store-login/'; }
    }
  })
  if (window.location.hash === '#store-checkout') initCheckoutLogic()
}

async function initCheckoutLogic() {
  const container = document.getElementById('checkout-qr-container')
  if (!container) return

  const user = await getCurrentUser()
  if (!user) { window.location.hash = '#store-login'; return; }

  const planId = sessionStorage.getItem('store-auth-plan')
  const prices = { monthly: 79000, yearly: 599000, lifetime: 1299000 }
  const amount = prices[planId] || 0
  const orderCode = Math.floor(100000 + Math.random() * 900000) // Generate 6-digit code
  const memo = `VCK ${orderCode}`

  try {
    // 1. Save pending transaction to Supabase
    const { error } = await supabase.from('payment_history').insert([{
      user_id: user.id,
      order_code: orderCode.toString(),
      amount: amount,
      plan_id: planId,
      status: 'pending'
    }])
    if (error) throw error

    // 2. Render real QR from SePay
    // Template: compact, amount: X, des: MEMO, account: BIDV - 8808162732 - VU AN
    const qrUrl = `https://qr.sepay.vn/img?bank=BIDV&acc=8808162732&template=compact&amount=${amount}&des=${encodeURIComponent(memo)}`
    
    container.innerHTML = `
      <div style="background: #000; border: 1.5px solid var(--color-border); padding: 1.5rem; border-radius: 4px; display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">
        <div style="flex:1;">
          <h3 style="font-size:1rem; margin-bottom: 1rem;">Hướng dẫn thanh toán</h3>
          <div style="margin-bottom: 0.8rem;">
            <span style="font-size:0.7rem; color:var(--color-subtle); text-transform:uppercase;">Ngân hàng</span>
            <div style="font-weight:700;">BIDV</div>
          </div>
          <div style="margin-bottom: 0.8rem;">
            <span style="font-size:0.7rem; color:var(--color-subtle); text-transform:uppercase;">Số tài khoản</span>
            <div style="font-weight:700; font-size:1.1rem; color:var(--color-accent);">8808162732</div>
          </div>
          <div style="margin-bottom: 0.8rem;">
            <span style="font-size:0.7rem; color:var(--color-subtle); text-transform:uppercase;">Chủ tài khoản</span>
            <div style="font-weight:700;">VŨ THANH AN</div>
          </div>
          <div>
            <span style="font-size:0.7rem; color:var(--color-subtle); text-transform:uppercase;">Nội dung chuyển khoản</span>
            <div style="font-weight:900; font-size:1.2rem; color:var(--color-accent); letter-spacing:1px; border:1px dashed #444; padding:0.5rem; text-align:center; margin-top:0.5rem; background:#111;">${memo}</div>
          </div>
        </div>
        <div style="width: 180px; height: 180px; background: #fff; padding: 10px; border-radius: 8px;">
          <img src="${qrUrl}" alt="Payment QR" style="width:100%; height:100%;">
        </div>
      </div>
    `

    // 3. Listen for Realtime update on profiles table
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles',
        filter: `id=eq.${user.id}` 
      }, (payload) => {
        if (payload.new.plan_id === planId) {
          const statusMsg = document.getElementById('payment-status-message')
          if (statusMsg) statusMsg.style.display = 'block'
          setTimeout(() => { window.location.hash = '#store-dashboard' }, 3000)
          supabase.removeChannel(channel)
        }
      })
      .subscribe()

  } catch (err) {
    container.innerHTML = `<p style="color:#e74c3c;">Lỗi: ${err.message}</p>`
  }
}

async function checkAuthForNav() {
  const user = await getCurrentUser()
  const navAcc = document.getElementById('nav-account-link')
  if (navAcc) {
    navAcc.textContent = user ? 'Dashboard' : 'Đăng nhập'
    navAcc.href = user ? '#store-dashboard' : '/store/store-login/'
  }
  const dlArea = document.getElementById('product-download-area')
  if (dlArea && user) {
    let canDownload = false; let needsLifetime = false;
    const currentHash = window.location.hash; const prodId = currentHash.replace('#store-product-', '');
    const product = allProducts.find(p => p.id === prodId)
    
    if (product) {
      if (product.access === 'free') { 
        canDownload = true 
      } else {
        try {
          const { data: profile } = await supabase.from('profiles').select('plan_id').eq('id', user.id).maybeSingle()
          if (profile) {
            if (product.is_lifetime) {
              if (profile.plan_id === 'lifetime') canDownload = true
              else needsLifetime = true
            } else {
              if (profile.plan_id !== 'free') canDownload = true
            }
          }
        } catch (_) {}
      }
    }

    if (canDownload) {
      dlArea.innerHTML = `<button id="btn-actual-download" class="plan-btn" style="background:var(--color-accent); color:#000; border-color:var(--color-accent); font-size:1rem;">Tải Xuống Ngay</button><p style="font-size:0.75rem; color:var(--color-subtle); margin-top:1rem; text-align:center;">Tệp sẽ được nén dưới định dạng .ZIP</p>`
      document.getElementById('btn-actual-download').onclick = () => {
        const fileUrl = getLocalFileUrl(product.file_url.split('/').pop(), 'products');
        window.open(fileUrl, '_blank');
      }
    } else if (needsLifetime) {
      dlArea.innerHTML = `<p style="font-size:0.85rem; margin-bottom:1.5rem; color:#f1c40f; font-weight:700;">Sản phẩm này yêu cầu gói <span style="color:var(--color-accent)">LIFETIME</span>.</p><a href="#store-pricing" class="plan-btn" style="background:var(--color-accent); color:#000; border-color:var(--color-accent); margin-bottom:1rem;">Nâng cấp lên Lifetime</a>`
    } else {
      dlArea.innerHTML = `<p style="font-size:0.85rem; margin-bottom:1.5rem; color:var(--color-subtle);">Bạn cần gói Hội Viên đang hoạt động để tải xuống tệp này.</p><a href="#store-pricing" class="plan-btn" style="background:var(--color-accent); color:#000; border-color:var(--color-accent); margin-bottom:1rem;">Nâng cấp Hội Viên</a><a href="#store-login" style="display:block; text-align:center; font-size:0.85rem; text-decoration:underline; font-weight:700;">Tài khoản của tôi</a>`
    }
  }
}

let isLoginMode = true;
function initAuthLogic() {
  const toggleBtn = document.getElementById('auth-toggle-btn'); const title = document.getElementById('auth-title'); const subtitle = document.getElementById('auth-subtitle');
  const submitBtn = document.getElementById('auth-submit-btn'); const toggleText = document.getElementById('auth-toggle-text'); const form = document.getElementById('store-auth-form');
  const errorAlert = document.getElementById('auth-error')
  const performToggle = (mode) => {
    isLoginMode = mode;
    title.innerHTML = wrapWords(isLoginMode ? 'Đăng nhập' : 'Tạo tài khoản')
    subtitle.textContent = isLoginMode ? 'Chào mừng trở lại GeoData' : 'Tham gia để tải xuống ngay'
    submitBtn.textContent = isLoginMode ? 'Đăng nhập' : 'Đăng ký'
    toggleText.textContent = isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'
    toggleBtn.textContent = isLoginMode ? 'Đăng ký ngay' : 'Đăng nhập'
  }
  if (sessionStorage.getItem('store-auth-mode') === 'signup') { performToggle(false); sessionStorage.removeItem('store-auth-mode'); }
  toggleBtn.onclick = (e) => { e.preventDefault(); performToggle(!isLoginMode); errorAlert.style.display = 'none'; }
  form.onsubmit = async (e) => {
    e.preventDefault(); const email = document.getElementById('auth-email').value; const pass = document.getElementById('auth-password').value;
    errorAlert.style.display = 'none'; submitBtn.textContent = 'Đang xử lý...';
    try {
      // Skip configuration check for local development
      if (false) throw new Error('Supabase chưa được cấu hình.')
      const result = isLoginMode ? await signIn(email, pass) : await signUp(email, pass)
      if (result.error) throw result.error
      if (!isLoginMode && result.data?.user && !result.data?.session) {
        errorAlert.textContent = 'Kiểm tra email của bạn để xác thực tài khoản.'; errorAlert.style.color = 'var(--color-accent)'; errorAlert.style.display = 'block'
      } else { window.location.href = '/store/#store-dashboard' }
    } catch (err) { errorAlert.textContent = err.message; errorAlert.style.color = '#e74c3c'; errorAlert.style.display = 'block'
    } finally { submitBtn.textContent = isLoginMode ? 'Đăng nhập' : 'Đăng ký' }
  }
}

async function initDashboardLogic() {
  const dashEmail = document.getElementById('dashboard-email'); const btnLogout = document.getElementById('btn-logout'); const adminLinkContainer = document.getElementById('dashboard-admin-link');
  const user = await getCurrentUser()
  if (!user) { window.location.href = '/store/store-login/'; return; }
  dashEmail.textContent = user.email
  const planLabels = { free: 'MIỄN PHÍ', monthly: 'MONTHLY', yearly: 'YEARLY', lifetime: 'LIFETIME' }
  const planColors = { free: '#444', monthly: '#2ecc71', yearly: 'var(--color-accent)', lifetime: 'var(--color-accent)' }
  const planBadge = document.querySelector('.plan-badge-current')
  try {
    const { data: profile, error } = await supabase.from('profiles').select('plan_id').eq('id', user.id).maybeSingle()
    if (error) throw error
    if (profile && planBadge) {
      planBadge.textContent = planLabels[profile.plan_id] || 'MIỄN PHÍ'
      planBadge.style.background = planColors[profile.plan_id] || '#444'
      planBadge.style.color = profile.plan_id === 'free' ? '#fff' : '#000'
    }
  } catch (err) { console.error('Plan fetch error:', err.message) }
  if (user.email === 'vuan.edit@gmail.com' && adminLinkContainer) {
    adminLinkContainer.innerHTML = '<a href="#store-admin" style="display:block; margin-top:1.5rem; font-size:0.85rem; color:var(--color-accent); font-weight: 700;"><i class="bi bi-arrow-right"></i> Trang Quản Trị Admin (Quản lý dữ liệu)</a>'
  }
  btnLogout.onclick = async () => { await signOut(); window.location.href = '/store/' }
}

async function initAdminLogic() {
  const user = await getCurrentUser()
  if (!user || user.email !== 'vuan.edit@gmail.com') { window.location.href = '/store/store-login/'; return; }
  const tabBtns = document.querySelectorAll('#admin-tabs .filter-btn'); const tabContents = document.querySelectorAll('.admin-tab-content');
  tabBtns.forEach(btn => {
    btn.onclick = () => {
      tabBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
      const target = btn.dataset.target; tabContents.forEach(tab => { tab.style.display = tab.id === target ? 'block' : 'none' })
      if (target === 'admin-tab-users') loadUserList()
      if (target === 'admin-tab-products') loadAdminProductList()
      if (target === 'admin-tab-config') loadTunnelConfig()
    }
  })
  const form = document.getElementById('admin-upload-form'); const btnCancel = document.getElementById('btn-admin-cancel');
  const formModeTitle = document.getElementById('form-mode-title'); const btnSubmit = document.getElementById('btn-admin-submit');
  btnCancel.onclick = () => {
    form.reset(); document.getElementById('admin-id').value = '';
    document.getElementById('admin-file-url').value = '';
    document.getElementById('admin-zoom-level').value = 'none';
    document.getElementById('admin-preview-area').style.display = 'none';
    formModeTitle.textContent = 'Thêm sản phẩm mới'; btnSubmit.textContent = 'Tải Lên Store'; btnCancel.style.display = 'none';
  }

  const btnGenerate = document.getElementById('btn-generate-thumb');
  const fileLocal = document.getElementById('admin-file-local');
  const canvas = document.getElementById('admin-preview-canvas');

  btnGenerate.onclick = async () => {
    const file = fileLocal.files[0];
    if (!file) { alert('Vui lòng chọn file .json hoặc .geojson'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geojson = JSON.parse(e.target.result);
        renderGeoJsonToCanvas(geojson, canvas);
        document.getElementById('admin-preview-area').style.display = 'block';
        
        // Convert canvas to data URL and set to thumb input
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        document.getElementById('admin-thumb').value = dataUrl;
        alert('Đã tạo ảnh preview thành công!');
      } catch (err) {
        alert('Lỗi đọc file: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  form.onsubmit = async (e) => {
    e.preventDefault(); const id = document.getElementById('admin-id').value;
    btnSubmit.textContent = 'Đang tải lên và xử lý...';
    try {
      let file_url = document.getElementById('admin-file-url').value;
      const fileInput = document.getElementById('admin-file-upload');
      let file_path = null;

      if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          
          // Hybrid: Try local upload first if LOCAL_API_URL is available
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'products');

          try {
              console.log("[Store Admin] Attempting local upload to:", LOCAL_API_URL);
              const uploadRes = await fetch(`${LOCAL_API_URL}/api/upload`, { method: 'POST', body: formData });
              if (!uploadRes.ok) throw new Error('Local server upload failed');
              const uploadData = await uploadRes.json();
              
              file_url = `${LOCAL_API_URL}${uploadData.path}`;
              file_path = uploadData.filename;
              console.log("[Store Admin] Local upload success:", file_url);
          } catch (err) {
              console.warn("[Store Admin] Local upload failed, falling back to Supabase:", err.message);
              const fileName = `${Date.now()}_${file.name}`;
              const { error: uploadErr } = await supabase.storage.from('geodata').upload(fileName, file);
              if (uploadErr) throw uploadErr;
              file_path = fileName;
              const { data } = supabase.storage.from('geodata').getPublicUrl(fileName);
              file_url = data.publicUrl;
          }
      } else if (!file_url && !id) {
          throw new Error("Vui lòng tải lên file dữ liệu hoặc cung cấp Link URL.");
      }

      const productData = {
        title: document.getElementById('admin-title').value,
        description: document.getElementById('admin-desc').value,
        format: document.getElementById('admin-format').value,
        size: document.getElementById('admin-size').value,
        thumb: document.getElementById('admin-thumb').value,
        file_url: file_url,
        featured: document.getElementById('admin-featured').checked,
        is_lifetime: document.getElementById('admin-lifetime').checked,
        access: document.getElementById('admin-access').value
      }
      
      let productId = id;
      if (!id) {
        const { data, error } = await supabase.from('products').insert([productData]).select();
        if (error) throw error;
        productId = data[0].id;
      } else {
        const { error } = await supabase.from('products').update(productData).eq('id', id);
        if (error) throw error;
      }

      // GeoExtractor Integration
      const zoomVal = document.getElementById('admin-zoom-level').value;
      if (zoomVal !== 'none' || file_path) {
          const { data: existingLayer } = await supabase.from('geodata_layers').select('id, file_path').eq('product_id', productId).single();
          let targetFilePath = file_path || (existingLayer ? existingLayer.file_path : null);
          
          // If no new upload and layer doesn't exist yet, extract path from existing file_url
          if (!targetFilePath && file_url && file_url.includes('/geodata/')) {
              targetFilePath = file_url.split('/geodata/')[1];
          }
          
          if (zoomVal !== 'none' && targetFilePath) {
              if (existingLayer) {
                  await supabase.from('geodata_layers').update({ zoom_min: parseInt(zoomVal), file_path: targetFilePath, name: productData.title }).eq('id', existingLayer.id);
              } else {
                  await supabase.from('geodata_layers').insert([{
                      name: productData.title,
                      category: 'store',
                      zoom_min: parseInt(zoomVal),
                      file_path: targetFilePath,
                      product_id: productId
                  }]);
              }
          } else if (zoomVal === 'none' && existingLayer) {
              await supabase.from('geodata_layers').delete().eq('id', existingLayer.id);
          }
      }

      alert(id ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!')
      form.reset(); document.getElementById('admin-id').value = ''; 
      document.getElementById('admin-file-url').value = '';
      document.getElementById('admin-zoom-level').value = 'none';
      formModeTitle.textContent = 'Thêm sản phẩm mới';
      btnSubmit.textContent = 'Tải Lên Store'; btnCancel.style.display = 'none';
      fetchProductsFromSupabase()
    } catch (err) { alert('Lỗi: ' + err.message); btnSubmit.textContent = id ? 'Cập nhật' : 'Tải Lên Store'; }
  }
}

async function loadAdminProductList() {
  const tbody = document.getElementById('admin-products-tbody'); if (!tbody) return
  tbody.innerHTML = '<tr><td colspan="4" style="padding:2rem 0; text-align:center; color:#888;">Đang tải...</td></tr>'
  try {
    const { data: prods, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) throw error
    if (!prods || prods.length === 0) { tbody.innerHTML = '<tr><td colspan="4" style="padding:2rem 0; text-align:center; color:#888;">Chưa có sản phẩm nào.</td></tr>'; return; }
    tbody.innerHTML = prods.map(p => {
      const accessBadge = p.access === 'free' 
        ? `<span style="font-size:0.7rem; font-weight:900; padding:0.2rem 0.4rem; background:#2ecc71; color:#000;">FREE</span>`
        : `<span style="font-size:0.7rem; font-weight:900; padding:0.2rem 0.4rem; background:#333; color:#aaa;">PAID</span>`
      
      const lifetimeBadge = p.is_lifetime 
        ? `<span style="font-size:0.7rem; font-weight:900; padding:0.2rem 0.4rem; background:var(--color-accent); color:#000; margin-left:0.5rem;">LIFETIME</span>`
        : ''

      return `
      <tr style="border-bottom: 1px solid #222;">
        <td style="padding: 1rem 0;"><div style="font-weight:700;">${p.title}</div><div style="font-size:0.75rem; color:#666;">${p.size}</div></td>
        <td style="padding: 1rem 0; text-transform:uppercase; font-size:0.8rem;">${p.format}</td>
        <td style="padding: 1rem 0;">${accessBadge}${lifetimeBadge}</td>
        <td style="padding: 1rem 0; text-align:right;"><button class="btn-edit-prod" data-id="${p.id}" style="color:var(--color-accent); font-weight:700; margin-right:1rem; font-size:0.85rem;">Sửa</button><button class="btn-delete-prod" data-id="${p.id}" style="color:#e74c3c; font-weight:700; font-size:0.85rem;">Xóa</button></td>
      </tr>
    `}).join('')
    tbody.querySelectorAll('.btn-edit-prod').forEach(btn => {
      btn.onclick = () => {
        const p = prods.find(x => x.id === btn.dataset.id); if (!p) return
        document.getElementById('btn-tab-upload').click(); document.getElementById('admin-id').value = p.id;
        document.getElementById('admin-title').value = p.title; document.getElementById('admin-desc').value = p.description || '';
        document.getElementById('admin-format').value = p.format; document.getElementById('admin-size').value = p.size;
        document.getElementById('admin-thumb').value = p.thumb; document.getElementById('admin-file-url').value = p.file_url || '';
        document.getElementById('admin-featured').checked = p.featured;
        document.getElementById('admin-lifetime').checked = p.is_lifetime || false;
        document.getElementById('admin-access').value = p.access || 'paid';
        
        // Fetch existing zoom level link
        supabase.from('geodata_layers').select('zoom_min').eq('product_id', p.id).single().then(({data}) => {
            document.getElementById('admin-zoom-level').value = data ? data.zoom_min : 'none';
        });

        document.getElementById('form-mode-title').textContent = 'Chỉnh sửa: ' + p.title; document.getElementById('btn-admin-submit').textContent = 'Cập nhật'; document.getElementById('btn-admin-cancel').style.display = 'block';
      }
    })
    tbody.querySelectorAll('.btn-delete-prod').forEach(btn => {
      btn.onclick = async () => {
        if (btn.innerText === 'Xóa') {
          btn.innerText = 'Chắc chắn?';
          btn.style.color = '#fff';
          btn.style.background = '#e74c3c';
          btn.style.padding = '0.2rem 0.5rem';
          btn.style.borderRadius = '4px';
          setTimeout(() => {
            if (btn.innerText === 'Chắc chắn?') {
              btn.innerText = 'Xóa';
              btn.style.color = '#e74c3c';
              btn.style.background = 'transparent';
              btn.style.padding = '0';
            }
          }, 3000);
          return;
        }

        btn.innerText = 'Đang xóa...';
        btn.disabled = true;
        
        const productId = btn.dataset.id;
        
        // Remove linked offline layer first to respect possible foreign key constraints
        await supabase.from('geodata_layers').delete().eq('product_id', productId);
        
        const { error } = await supabase.from('products').delete().eq('id', productId);
        
        if (error) { 
            alert('Lỗi: ' + error.message); 
            btn.innerText = 'Lỗi'; 
            btn.disabled = false;
        } else { 
            fetchProductsFromSupabase(); 
            loadAdminProductList(); 
        }
      }
    })
  } catch (err) { tbody.innerHTML = `<tr><td colspan="4" style="padding:2rem 0; text-align:center; color:#e74c3c;">Lỗi: ${err.message}</td></tr>` }
}

function renderGeoJsonToCanvas(geojson, canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = 1200;
  const h = canvas.height = 675; // 16:9

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#b4fd00';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  let coords = [];
  const extractCoords = (obj) => {
    if (obj.type === 'Point') coords.push(obj.coordinates);
    else if (obj.type === 'LineString' || obj.type === 'MultiPoint') coords.push(...obj.coordinates);
    else if (obj.type === 'Polygon' || obj.type === 'MultiLineString') obj.coordinates.forEach(c => coords.push(...c));
    else if (obj.type === 'MultiPolygon') obj.coordinates.forEach(poly => poly.forEach(ring => coords.push(...ring)));
    else if (obj.type === 'Feature') extractCoords(obj.geometry);
    else if (obj.type === 'FeatureCollection') obj.features.forEach(f => extractCoords(f));
    else if (obj.type === 'GeometryCollection') obj.geometries.forEach(g => extractCoords(g));
  };
  extractCoords(geojson);

  if (coords.length === 0) return;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  coords.forEach(c => {
    if (c[0] < minX) minX = c[0]; if (c[0] > maxX) maxX = c[0];
    if (c[1] < minY) minY = c[1]; if (c[1] > maxY) maxY = c[1];
  });

  const pad = 180;
  const scaleX = (w - pad * 2) / (maxX - minX || 1);
  const scaleY = (h - pad * 2) / (maxY - minY || 1);
  const scale = Math.min(scaleX, scaleY);
  const offsetX = (w - (maxX - minX) * scale) / 2;
  const offsetY = (h - (maxY - minY) * scale) / 2;

  const project = (c) => [
    offsetX + (c[0] - minX) * scale,
    h - (offsetY + (c[1] - minY) * scale) // Flip Y for canvas
  ];

  const drawGeom = (geom) => {
    if (!geom) return;
    if (geom.type === 'LineString') {
      ctx.beginPath();
      geom.coordinates.forEach((c, i) => {
        const p = project(c);
        if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
      });
      ctx.stroke();
    } else if (geom.type === 'Polygon') {
      ctx.beginPath(); ctx.fillStyle = 'rgba(180, 253, 0, 0.2)';
      geom.coordinates.forEach(ring => {
        ring.forEach((c, i) => {
          const p = project(c);
          if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
        });
      });
      ctx.fill(); ctx.stroke();
    } else if (geom.type === 'MultiLineString') {
      geom.coordinates.forEach(line => drawGeom({ type: 'LineString', coordinates: line }));
    } else if (geom.type === 'MultiPolygon') {
      geom.coordinates.forEach(poly => drawGeom({ type: 'Polygon', coordinates: poly }));
    } else if (geom.type === 'Feature') {
      drawGeom(geom.geometry);
    } else if (geom.type === 'FeatureCollection') {
      geom.features.forEach(f => drawGeom(f));
    }
  };

  drawGeom(geojson);
  
  // Add some grid/aesthetic
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for(let i=0; i<w; i+=50) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke(); }
  for(let j=0; j<h; j+=50) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(w,j); ctx.stroke(); }
}

async function loadUserList() {
  const tbody = document.getElementById('admin-users-tbody'); if (!tbody) return
  tbody.innerHTML = '<tr><td colspan="4" style="padding:2rem 0; text-align:center; color:var(--color-subtle);">Đang tải...</td></tr>'
  try {
    const { data: profiles, error } = await supabase.from('profiles').select('id, email, plan_id, created_at').order('created_at', { ascending: false })
    if (error || !profiles) throw error || new Error('Không lấy được dữ liệu')
    if (profiles.length === 0) { tbody.innerHTML = '<tr><td colspan="4" style="padding:2rem 0; text-align:center; color:var(--color-subtle);">Chưa có thành viên nào.</td></tr>'; return; }
    tbody.innerHTML = profiles.map(p => `
      <tr style="border-bottom: 1px solid #222;" data-user-id="${p.id}">
        <td style="padding: 1rem 0; word-break:break-all;">${p.email}</td>
        <td style="padding: 1rem 0; color:var(--color-subtle);">${new Date(p.created_at).toLocaleDateString('vi-VN')}</td>
        <td style="padding: 1rem 0;"><select class="plan-select form-input" style="background:#000; color:#fff; width:auto; padding:0.4rem 0.8rem;" data-user-id="${p.id}"><option value="free" ${p.plan_id === 'free' ? 'selected' : ''}>Miễn phí</option><option value="monthly" ${p.plan_id === 'monthly' ? 'selected' : ''}>Monthly</option><option value="yearly" ${p.plan_id === 'yearly' ? 'selected' : ''}>Yearly</option><option value="lifetime" ${p.plan_id === 'lifetime' ? 'selected' : ''}>Lifetime</option></select></td>
        <td style="padding: 1rem 0; text-align:right;"><button class="btn-update-plan" data-user-id="${p.id}" style="background:var(--color-accent); color:#000; font-weight:700; font-size:0.8rem; padding:0.5rem 1rem; border:none; cursor:pointer;">Lưu</button></td>
      </tr>
    `).join('')
    tbody.querySelectorAll('.btn-update-plan').forEach(btn => {
      btn.onclick = async () => {
        const userId = btn.dataset.userId; const newPlan = tbody.querySelector(`tr[data-user-id="${userId}"] .plan-select`).value;
        btn.textContent = '...'; const { error } = await supabase.from('profiles').update({ plan_id: newPlan, updated_at: new Date().toISOString() }).eq('id', userId)
        if (error) { btn.textContent = 'Lỗi!'; btn.style.background = '#e74c3c' }
        else { btn.textContent = '✓ Xong'; btn.style.background = '#2ecc71'; setTimeout(() => { btn.textContent = 'Lưu'; btn.style.background = 'var(--color-accent)' }, 2000) }
      }
    })
  } catch (err) { tbody.innerHTML = `<tr><td colspan="4" style="padding:2rem 0; text-align:center; color:#e74c3c;">Lỗi: ${err.message}<br><small>Hãy chạy SQL trong Supabase Dashboard để tạo bảng profiles.</small></td></tr>` }
}

async function loadTunnelConfig() {
    const input = document.getElementById('admin-config-tunnel-url');
    const btnSave = document.getElementById('btn-save-tunnel');
    if (!input || !btnSave) return;

    input.value = 'Đang tải...';
    input.disabled = true;

    try {
        const { data, error } = await supabase.from('app_config').select('value').eq('key', 'tunnel_url').single();
        if (data) {
            input.value = data.value;
        } else {
            input.value = '';
        }
    } catch (err) {
        console.error("Lỗi load tunnel config:", err);
    } finally {
        input.disabled = false;
    }

    btnSave.onclick = async () => {
        const newUrl = input.value.trim();
        if (!newUrl) return alert("Vui lòng nhập URL.");
        
        btnSave.textContent = '...';
        btnSave.disabled = true;

        try {
            const { error } = await supabase.from('app_config').upsert({ key: 'tunnel_url', value: newUrl, updated_at: new Date().toISOString() });
            if (error) throw error;
            alert("✓ Đã cập nhật Tunnel URL thành công!");
            localStorage.setItem('vuanedit_api_url', newUrl);
            window.location.reload(); 
        } catch (err) {
            alert("Lỗi: " + err.message);
        } finally {
            btnSave.textContent = 'Lưu cấu hình';
            btnSave.disabled = false;
        }
    }
}
