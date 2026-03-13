import './store-style.css'
import { products } from './data/products.js'
import { supabase, getCurrentUser, signIn, signUp, signOut } from './supabase.js'

// Helper: wrap words like main.js
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
        Vũ An <span>MapData</span>
      </div>
      <nav class="site-nav" style="gap: 1.5rem;">
        <a href="#store" data-store-nav="">Trang chủ Store</a>
        <a href="#store-catalog">Dữ liệu</a>
        <a href="#store-pricing">Bảng giá</a>
        <a href="#store-dashboard" id="nav-account-link">Tài khoản</a>
        <a href="#" style="color:#888; margin-left:1rem;">← Về Vũ An Edit</a>
      </nav>
    </header>
  `
}

function getStoreFooter() {
  return `
    <footer class="site-footer" style="border-color: #222;">
      <p>© 2026 Vũ An MapData. Dữ liệu bản đồ cho Video Editor.</p>
      <div style="display:flex; gap:1.5rem; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
        <a href="#store-pricing">Gói cước</a>
        <a href="mailto:vuan.edit@gmail.com">Hỗ trợ</a>
      </div>
    </footer>
  `
}

// ------------------------------------------------------------------
// VIEWS
// ------------------------------------------------------------------

function getStoreHomeTemplate() {
  const featured = products.filter(p => p.featured).slice(0, 3)
  
  const productCards = featured.map(p => `
    <a href="#store-product-${p.id}" class="product-card reveal">
      <img src="${p.thumb}" alt="${p.title}" class="product-thumb">
      <div class="product-content">
        <span class="badge badge-${p.format}">${p.format}</span>
        <h3 class="product-title hover-word" style="margin-top:0.75rem;">${wrapWords(p.title)}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <span style="font-size:0.8rem; font-weight:700;">${p.size}</span>
          <span style="font-size:0.85rem; color:var(--color-accent); font-weight:700;">Xem chi tiết &rarr;</span>
        </div>
      </div>
    </a>
  `).join('')

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

      <div class="store-stats container reveal">
        <div class="stat-item">
          <div class="stat-val">12+</div>
          <div class="stat-label">Sản phẩm chất lượng</div>
        </div>
        <div class="stat-item">
          <div class="stat-val">∞</div>
          <div class="stat-label">Tải không giới hạn</div>
        </div>
        <div class="stat-item">
          <div class="stat-val">24/7</div>
          <div class="stat-label">Hỗ trợ kĩ thuật</div>
        </div>
      </div>

      <section class="container" style="padding: 6vh 2rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end;">
          <h2 class="reveal hover-word" style="font-size:2rem;">${wrapWords('Sản Phẩm Nổi Bật')}</h2>
          <a href="#store-catalog" class="reveal" style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--color-accent);">Xem tất cả &rarr;</a>
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
  const productCards = products.map(p => `
    <a href="#store-product-${p.id}" class="product-card reveal" data-format="${p.format}">
      <img src="${p.thumb}" alt="${p.title}" class="product-thumb">
      <div class="product-content">
        <span class="badge badge-${p.format}">${p.format}</span>
        <h3 class="product-title hover-word" style="margin-top:0.75rem;">${wrapWords(p.title)}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <span style="font-size:0.8rem; font-weight:700;">${p.size}</span>
          <span style="font-size:0.85rem; color:var(--color-accent); font-weight:700;">Xem chi tiết &rarr;</span>
        </div>
      </div>
    </a>
  `).join('')

  return `
    ${getStoreNav()}
    <main>
      <section class="container" style="padding: 6vh 2rem;">
        <h1 class="reveal hover-word" style="font-size: 3rem;">${wrapWords('Kho Dữ Liệu')}</h1>
        <p class="reveal" style="color:var(--color-subtle); margin-top:1rem; max-width:600px;">Tìm kiếm và tải xuống các layer bản đồ phù hợp nhất cho dự án video của bạn.</p>

        <div class="filter-tabs reveal" id="store-filters">
          <button class="filter-btn active" data-filter="all">Tất cả</button>
          <button class="filter-btn" data-filter="geojson">GeoJSON</button>
          <button class="filter-btn" data-filter="kml">KML Files</button>
          <button class="filter-btn" data-filter="plugin">Plugins</button>
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
          <!-- Monthly -->
          <div class="plan-card">
            <h3 class="plan-name">Monthly</h3>
            <div class="plan-price">79K<span>/tháng</span></div>
            <ul class="plan-features">
              <li>Truy cập toàn bộ KML & GeoJSON</li>
              <li>Sử dụng trong mọi dự án</li>
              <li>Hỗ trợ cơ bản</li>
            </ul>
            <a href="#store-login" class="plan-btn">Đăng ký ngay</a>
          </div>

          <!-- Yearly -->
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
            <a href="#store-login" class="plan-btn">Đăng ký ngay</a>
          </div>

          <!-- Lifetime -->
          <div class="plan-card">
            <h3 class="plan-name">Lifetime</h3>
            <div class="plan-price">1.299K<span>/mãi mãi</span></div>
            <ul class="plan-features">
              <li>Thanh toán 1 lần, dùng trọn đời</li>
              <li>Luôn có toàn bộ file mới nhất</li>
              <li>Thêm file theo yêu cầu (max 2/tháng)</li>
            </ul>
            <a href="#store-login" class="plan-btn">Đăng ký ngay</a>
          </div>
        </div>
      </section>
    </main>
    ${getStoreFooter()}
  `
}

function getStoreProductTemplate(productId) {
  const p = products.find(x => x.id === productId)
  if (!p) return `
    ${getStoreNav()}
    <main><div class="container" style="padding: 8vh 2rem; text-align:center;"><h2>Không tìm thấy sản phẩm</h2></div></main>
    ${getStoreFooter()}
  `

  return `
    ${getStoreNav()}
    <main>
      <section class="container" style="padding: 6vh 2rem;">
        <a href="#store-catalog" style="font-size:0.85rem; font-weight:700; color:var(--color-subtle); text-transform:uppercase;">&larr; Trở lại Cửa hàng</a>
        
        <div class="reveal" style="margin-top:2rem; border:1.5px solid var(--color-border); background:#111; overflow:hidden;">
          <div style="aspect-ratio:21/9; background:#000; border-bottom:1.5px solid var(--color-border);">
            <img src="${p.thumb}" style="width:100%; height:100%; object-fit:cover; opacity:0.8;">
          </div>
          <div style="padding: 3rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:2rem;">
              <div style="max-width: 600px;">
                <span class="badge badge-${p.format}">${p.format}</span>
                <h1 class="hover-word" style="font-size:2.5rem; margin-top:1rem;">${wrapWords(p.title)}</h1>
                <p style="color:var(--color-subtle); margin-top:1rem; line-height:1.7;">${p.desc}</p>
                <div style="margin-top:1.5rem; font-size:0.85rem; font-weight:700; color:#888;">
                  <span style="display:inline-block; margin-right:2rem;">Kích thước: <span style="color:#fff">${p.size}</span></span>
                  <span>Định dạng: <span style="color:#fff text-transform:uppercase;">${p.format}</span></span>
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
          <p style="color:var(--color-subtle); font-size:0.9rem;" id="auth-subtitle">Chào mừng trở lại Vũ An MapData</p>
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
              <div style="display:inline-block; background:#222; color:#fff; padding:0.4rem 0.8rem; font-size:0.8rem; font-weight:700; border:1px solid #444;">MIỄN PHÍ</div>
              <div style="margin-top:1rem;">
                <a href="#store-pricing" style="font-size:0.8rem; color:var(--color-accent); text-decoration:underline;">Nâng cấp gói</a>
              </div>
            </div>
            <button id="btn-logout" style="color:#e74c3c; font-size:0.85rem; font-weight:700; text-transform:uppercase;">Đăng xuất &rarr;</button>
          </div>

          <div>
            <h3 style="margin-bottom:1.5rem; font-size:1.2rem; border-bottom:1.5px solid var(--color-border); padding-bottom:1rem;">Lịch sử tải xuống</h3>
            <p style="color:var(--color-subtle); font-size:0.9rem;">Bạn chưa tải xuống tệp nào.</p>
            <a href="#store-catalog" class="plan-btn" style="display:inline-block; width:auto; padding:0.8rem 1.5rem; margin-top:2rem;">Duyệt sản phẩm</a>
          </div>
        </div>
      </section>
    </main>
    ${getStoreFooter()}
  `
}

// ------------------------------------------------------------------
// ROUTER LOGIC FOR STORE
// ------------------------------------------------------------------
export function getStoreTemplate(view) {
  if (view === 'store-catalog') return getStoreCatalogTemplate()
  if (view === 'store-pricing') return getStorePricingTemplate()
  if (view === 'store-login') return getStoreAuthTemplate()
  if (view === 'store-dashboard') return getStoreDashboardTemplate()
  if (view.startsWith('store-product-')) {
    const id = view.replace('store-product-', '')
    return getStoreProductTemplate(id)
  }
  return getStoreHomeTemplate()
}

export function initStoreEffects() {
  // Store navigation home redirect
  document.querySelectorAll('[data-store-nav]').forEach(el => {
    el.style.cursor = 'pointer'
    el.onclick = () => {
      window.location.hash = '#store'
    }
  })

  // Catalog Filters
  const filters = document.getElementById('store-filters')
  if (filters) {
    const btns = filters.querySelectorAll('.filter-btn')
    const cards = document.querySelectorAll('#catalog-grid .product-card')
    
    btns.forEach(btn => {
      btn.onclick = () => {
        btns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const t = btn.dataset.filter
        cards.forEach(card => {
          if (t === 'all' || card.dataset.format === t) {
            card.style.display = 'flex'
          } else {
            card.style.display = 'none'
          }
        })
      }
    })
  }

  // Auth Layout Logic
  const authForm = document.getElementById('store-auth-form')
  if (authForm) {
    initAuthLogic()
  }

  // Dashboard Logic
  const dashEmail = document.getElementById('dashboard-email')
  if (dashEmail) {
    initDashboardLogic()
  }

  // Check auth for Account link
  checkAuthForNav()
}

// Auth State Check
async function checkAuthForNav() {
  const user = await getCurrentUser()
  const navAcc = document.getElementById('nav-account-link')
  if (navAcc) {
    if (user) {
      navAcc.textContent = 'Dashboard'
      navAcc.href = '#store-dashboard'
    } else {
      navAcc.textContent = 'Đăng nhập'
      navAcc.href = '#store-login'
    }
  }

  // Product page download button
  const dlArea = document.getElementById('product-download-area')
  if (dlArea) {
    if (user) {
      dlArea.innerHTML = `
        <button class="plan-btn" style="background:var(--color-accent); color:#000; border-color:var(--color-accent); font-size:1rem;">Tải Xuống Ngay</button>
        <p style="font-size:0.75rem; color:var(--color-subtle); margin-top:1rem; text-align:center;">Tệp sẽ được nén dưới định dạng .ZIP</p>
      `
    }
  }
}

let isLoginMode = true;

function initAuthLogic() {
  const toggleBtn = document.getElementById('auth-toggle-btn')
  const title = document.getElementById('auth-title')
  const subtitle = document.getElementById('auth-subtitle')
  const submitBtn = document.getElementById('auth-submit-btn')
  const toggleText = document.getElementById('auth-toggle-text')
  const form = document.getElementById('store-auth-form')
  const errorAlert = document.getElementById('auth-error')

  toggleBtn.onclick = (e) => {
    e.preventDefault()
    isLoginMode = !isLoginMode
    if (isLoginMode) {
      title.innerHTML = wrapWords('Đăng nhập')
      subtitle.textContent = 'Chào mừng trở lại Vũ An MapData'
      submitBtn.textContent = 'Đăng nhập'
      toggleText.textContent = 'Chưa có tài khoản?'
      toggleBtn.textContent = 'Đăng ký ngay'
    } else {
      title.innerHTML = wrapWords('Tạo tài khoản')
      subtitle.textContent = 'Tham gia để tải xuống ngay'
      submitBtn.textContent = 'Đăng ký'
      toggleText.textContent = 'Đã có tài khoản?'
      toggleBtn.textContent = 'Đăng nhập'
    }
    errorAlert.style.display = 'none'
  }

  form.onsubmit = async (e) => {
    e.preventDefault()
    const email = document.getElementById('auth-email').value
    const pass = document.getElementById('auth-password').value
    errorAlert.style.display = 'none'
    submitBtn.textContent = 'Đang xử lý...'

    try {
      // NOTE: We check if supabase config exists, if it's placeholder it will throw
      if (supabase.supabaseUrl.includes('YOUR_SUPABASE_PROJECT_ID')) {
         throw new Error('Supabase chưa được cấu hình. Vui lòng thêm Project ID và Anon Key vào src/store/supabase.js')
      }

      let result;
      if (isLoginMode) {
        result = await signIn(email, pass)
      } else {
        result = await signUp(email, pass)
      }

      if (result.error) throw result.error

      if (!isLoginMode && result.data?.user && !result.data?.session) {
        errorAlert.textContent = 'Kiểm tra email của bạn để xác thực tài khoản.'
        errorAlert.style.color = 'var(--color-accent)'
        errorAlert.style.display = 'block'
      } else {
        window.location.hash = '#store-dashboard'
      }
    } catch (err) {
      errorAlert.textContent = err.message
      errorAlert.style.color = '#e74c3c'
      errorAlert.style.display = 'block'
    } finally {
      submitBtn.textContent = isLoginMode ? 'Đăng nhập' : 'Đăng ký'
    }
  }
}

async function initDashboardLogic() {
  const dashEmail = document.getElementById('dashboard-email')
  const btnLogout = document.getElementById('btn-logout')
  
  const user = await getCurrentUser()
  if (!user) {
    window.location.hash = '#store-login'
    return
  }

  dashEmail.textContent = user.email

  btnLogout.onclick = async () => {
    await signOut()
    window.location.hash = '#store'
  }
}
