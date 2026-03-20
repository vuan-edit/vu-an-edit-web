import './style.css'
import { getStoreTemplate, initStoreEffects } from '../store/store-main.js'

// --- CONSTANTS ---
const VIEWS = {
  HOME: 'home',
  PROJECTS: 'projects',
  COURSE: 'course',
  CONTACT: 'contact',
  STORE: 'store'
}

// --- STATE ---
let currentView = VIEWS.HOME

// --- HELPER: Wrap each word in a <span class="word"> for hover highlight ---
function wrapWords(text) {
  return text
    .split(' ')
    .map(word => `<span class="word">${word}</span>`)
    .join(' ')
}

// Helper: Create hover-word wrapped paragraph
function hw(text) {
  return `<span class="hover-word">${wrapWords(text)}</span>`
}

// --- TEMPLATE PARTS ---
function getHeader() {
  return `
    <div class="cursor-dot"></div>
    <div class="cursor-outline"></div>

    <header class="site-header reveal">
      <div class="logo" data-nav="">
        <img src="/logo_brand.svg" alt="Vũ An">
      </div>
      <button class="mobile-menu-btn" aria-label="Toggle Menu">
        <span></span>
        <span></span>
      </button>
      <nav class="site-nav">
        <a href="/" data-nav="">Trang chủ</a>
        <a href="/projects/">Dự án</a>
        <a href="/courses/">Khóa học</a>
        <a href="/store/">Cửa hàng</a>
        <a href="/#blog">Blog</a>
        <a href="/contact/">Liên hệ</a>
      </nav>
    </header>
  `
}

function getFooter() {
  return `
    <footer class="site-footer">
      <p>© 2026 Vũ An. Thủ công &amp; Tỉ mỉ.</p>
      <div style="display:flex; gap:1.5rem; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">
        <a href="https://facebook.com/vuanedit" target="_blank">Facebook</a>
        <a href="https://instagram.com/vuanedit" target="_blank">Instagram</a>
        <a href="https://tiktok.com/@vuanedit" target="_blank">TikTok</a>
      </div>
    </footer>
  `
}

import { videoData } from './video_data.js'

// --- VIEWS ---
function getHomeTemplate() {
  const videoCards = videoData.map(item => `
    <div class="hero-item">
      <div class="hero-video-item">
        <video poster="${item.poster}" muted autoplay loop playsinline preload="metadata">
          <source src="${item.srcWebm}" type="video/webm">
          <source src="${item.srcMp4}" type="video/mp4">
        </video>
        <div class="video-stats-overlay">
          <p class="video-summary">${item.summary}</p>
          <div class="stats-grid">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> ${item.views}</span>
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 000-7.78v0z"/></svg> ${item.likes}</span>
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> ${item.comments}</span>
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> ${item.shares}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('')

  return `
    ${getHeader()}
    <main>

      <!-- HERO: Horizontal Sticky Scroll Section -->
      <section class="hero-scroll-container">
        <div class="hero-sticky-wrapper">
          <div class="hero-horizontal-strip" id="hero-strip">
            <!-- First Item: Centered Title -->
            <div class="hero-item hero-text-item">
              <h1 class="hover-word">${wrapWords('Làm chủ hình ảnh,')}<br>${wrapWords('kể chuyện cuốn hút.')}</h1>
            </div>
            <!-- Subsequent Items: Local Videos -->
            ${videoCards}
            <div class="hero-item" style="width: 20vw;"></div> <!-- Spacer at end -->
          </div>
        </div>
      </section>

      <!-- ABOUT -->
      <section class="about-section">
        <div class="container">
          <div class="about-inner">
            <div class="about-text reveal">
              <h2 class="hover-word">${wrapWords('Chào bạn, mình là Vũ An.')}</h2>
              <p style="margin-top:1.5rem; line-height:1.8; max-width: 600px;">${hw('Trong 4 năm làm content, mình đã xây dựng hai kênh TikTok "Tình Báo Chứng Khoán" và "Người Quan Sát" đạt hàng trăm triệu lượt xem. Bí mật chính là cách biến dữ liệu khô khan thành video cuốn hút qua bố cục và infographic.')}</p>
              
              <div class="project-icon-group">
                <a href="/projects/" class="project-icon-btn">
                  <span class="project-icon-label">Dự án 01</span>
                  <span class="project-icon-name">Finpath</span>
                </a>
                <a href="/projects/" class="project-icon-btn">
                  <span class="project-icon-label">Dự án 02</span>
                  <span class="project-icon-name">Người quan sát</span>
                </a>
              </div>
            </div>
            <div class="about-portrait reveal" style="animation-delay:0.15s; border:3px solid #fff; background:#000;">
              <img src="/Me (0-00-00-00).png" alt="Vũ An" style="width:100%;height:100%;object-fit:cover;display:block;">
            </div>
          </div>
        </div>
      </section>

      <!-- DATA SECTION -->
      <section class="data-section">
        <div class="container">
          <div class="reveal" style="max-width:680px;">
            <h2 class="hover-word">${wrapWords('Dữ liệu cũng có những câu chuyện.')}</h2>
            <p style="margin-top:1.5rem;">${hw('Đó là lúc tôi khám phá ra mình đang mô hình số hướng dẫn chọn cách thực quan hóa thông tin để làm bản đồ chuyển động, thiết kế infographic, đến tư duy sắp xếp ít dữ liệu để một câu chuyện giữ chân người xem từ đầu đến cuối.')}</p>
          </div>
        </div>
      </section>

      <!-- PRACTICE SECTION -->
      <section class="practice-section">
        <div class="container">
          <div class="reveal" style="max-width:720px;">
            <h2 class="hover-word">${wrapWords('Học thực chiến, làm ra sản phẩm thực tế.')}</h2>
            <p style="margin-top:1.5rem;">${hw('Nếu bạn muốn học thực hành về video, kỹ thuật, phân tích chuyên nghiệp và sản xuất từ tâm sắt vì đang, không lan man, thì khóa học này sẽ là thứ bạn cần.')}</p>
          </div>
        </div>
      </section>

      <!-- CONTACT LINKS - BIG TEXT -->
      <section style="padding:0; border-top:1.5px solid #000;">
        <div class="container" style="padding:0;">
          <h2 class="reveal" style="padding:2rem 2rem 1rem; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#555; border-bottom:1.5px solid #000;">Bắt đầu dự án</h2>
          <a href="mailto:vuan.edit@gmail.com" class="contact-link">vuan.edit@gmail.com</a>
          <a href="https://facebook.com/vuanedit" target="_blank" class="contact-link">Facebook</a>
          <a href="https://instagram.com/vuanedit" target="_blank" class="contact-link">Instagram</a>
          <a href="https://tiktok.com/@vuanedit" target="_blank" class="contact-link">TikTok</a>
        </div>
      </section>

    </main>
    ${getFooter()}
  `
}

function getProjectsTemplate() {
  return `
    ${getHeader()}
    <main>
      <section class="projects-hero container reveal">
        <h1 class="hover-word">${wrapWords('Hợp tác &')}<br>${wrapWords('Sáng tạo')}</h1>
        <p>${hw('Khám phá sự thay đổi ngoạn mục qua từng dự án. Từ những khung hình thô sơ đến tác phẩm nghệ thuật hoàn chỉnh.')}</p>
      </section>

      <div class="container">
        <!-- Project 1: Finpath - Tình Báo Thị Trường -->
        <div class="project-item reveal">
          <div class="project-dashboard" style="border-radius: 12px; overflow: hidden; border: 1.5px solid var(--color-border); padding: 0;">
            <div style="padding: 3rem; background: #000;">
              <div style="margin-bottom: 3rem;">
                <span class="dashboard-tag accent-bg" style="border-radius: 4px;">Update: 18/03/2026</span>
                <h2 style="font-size: clamp(2rem, 5vw, 4rem); color: var(--color-accent); text-transform: uppercase; line-height: 0.9; margin-bottom: 0.5rem;">Tình báo thị trường</h2>
                <div class="project-collab" style="color: var(--color-subtle); letter-spacing: 0.05em;">Data Visualization & Motion Branding</div>
              </div>
 
              <div class="dashboard-grid">
                <div class="dark-card">
                  <h3 style="font-size: 0.8rem; margin-bottom: 1.5rem; border-bottom: 1.5px solid #222; padding-bottom: 0.8rem; text-align: center; color: var(--color-accent);">Tổng quan tập khách hàng</h3>
                  <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="font-size: 3rem;">👤</div>
                    <div style="font-size: 0.8rem; line-height: 1.5; color: #ccc;">
                      <p><strong style="color: #fff;">Độ tuổi:</strong> 18 - 24 (52.7%)</p>
                      <p><strong style="color: #fff;">Nghề nghiệp:</strong> Sinh viên, Văn phòng</p>
                      <p><strong style="color: #fff;">Sở thích:</strong> Tài chính, Chứng khoán</p>
                    </div>
                  </div>
                  <div style="border-top: 1.5px solid #222; padding-top: 1rem;">
                    <div style="height: 8px; background: #222; border-radius: 4px; overflow: hidden; display: flex; margin-bottom: 0.5rem;">
                      <div style="width: 72%; background: var(--color-accent);"></div>
                      <div style="width: 28%; background: #333;"></div>
                    </div>
                    <p style="font-size: 0.75rem; color: #888;"><span style="color: var(--color-accent);">Nam: 72%</span> | Nữ: 27%</p>
                    <p style="font-size: 0.75rem; color: #888; margin-top: 0.5rem;">Vị trí: HN (30%), HCM (28%)</p>
                  </div>
                </div>
 
                <div class="dark-card">
                  <h3 style="font-size: 0.8rem; margin-bottom: 1.5rem; border-bottom: 1.5px solid #222; padding-bottom: 0.8rem; text-align: center; color: var(--color-accent);">Chỉ số 3 tháng gần nhất</h3>
                  <div class="stats-container" style="grid-template-columns: repeat(3, 1fr); gap: 0.8rem;">
                    <div class="stat-item" style="padding: 0.8rem; border-color: #222; background: #0a0a0a;"><span class="label" style="font-size:0.55rem; color: #888;">Xem</span><div class="stat-value" style="font-size:1.2rem; color: var(--color-accent);">119M</div></div>
                    <div class="stat-item" style="padding: 0.8rem; border-color: #222; background: #0a0a0a;"><span class="label" style="font-size:0.55rem; color: #888;">Like</span><div class="stat-value" style="font-size:1.2rem; color: var(--color-accent);">5.8M</div></div>
                    <div class="stat-item" style="padding: 0.8rem; border-color: #222; background: #0a0a0a;"><span class="label" style="font-size:0.55rem; color: #888;">Cmt</span><div class="stat-value" style="font-size:1.2rem; color: var(--color-accent);">215K</div></div>
                    <div class="stat-item" style="padding: 0.8rem; border-color: #222; background: #0a0a0a;"><span class="label" style="font-size:0.55rem; color: #888;">Share</span><div class="stat-value" style="font-size:1.2rem; color: var(--color-accent);">431K</div></div>
                    <div class="stat-item" style="padding: 0.8rem; border-color: #222; background: #0a0a0a;"><span class="label" style="font-size:0.55rem; color: #888;">Reach</span><div class="stat-value" style="font-size:1.2rem; color: var(--color-accent);">9M</div></div>
                    <div class="stat-item" style="padding: 0.8rem; border-color: #222; background: #0a0a0a;"><span class="label" style="font-size:0.55rem; color: #888;">Profile</span><div class="stat-value" style="font-size:1.2rem; color: var(--color-accent);">946K</div></div>
                  </div>
                </div>
              </div>
 
              <div style="margin-top: 3rem;">
                <h3 class="dashboard-tag accent-bg" style="margin-bottom: 2rem;">Top content</h3>
                <div class="content-gallery" style="grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                  <div class="content-card" style="background: #111; border: 1.5px solid #222;">
                    <div class="content-card-thumb" style="aspect-ratio: 9/16; background: #222;"><div class="views accent-bg">6.9M</div></div>
                    <div class="content-card-info" style="padding: 0.8rem; color: #fff;">
                      <p style="font-size: 0.75rem;"><strong>Lạm phát là gì?</strong></p>
                      <div class="stats" style="font-size: 0.6rem; color: var(--color-accent);">❤️ 335K | 🔄 5K</div>
                    </div>
                  </div>
                  <div class="content-card" style="background: #111; border: 1.5px solid #222;">
                    <div class="content-card-thumb" style="aspect-ratio: 9/16; background: #222;"><div class="views accent-bg">6.9M</div></div>
                    <div class="content-card-info" style="padding: 0.8rem; color: #fff;">
                      <p style="font-size: 0.75rem;"><strong>Hàng hóa VN giá cao?</strong></p>
                      <div class="stats" style="font-size: 0.6rem; color: var(--color-accent);">❤️ 290K | 🔄 11K</div>
                    </div>
                  </div>
                  <div class="content-card" style="background: #111; border: 1.5px solid #222;">
                    <div class="content-card-thumb" style="aspect-ratio: 9/16; background: #222;"><div class="views accent-bg">6.2M</div></div>
                    <div class="content-card-info" style="padding: 0.8rem; color: #fff;">
                      <p style="font-size: 0.75rem;"><strong>Kênh đào Phù Nam?</strong></p>
                      <div class="stats" style="font-size: 0.6rem; color: var(--color-accent);">❤️ 199K | 🔄 9K</div>
                    </div>
                  </div>
                </div>
              </div>
 
              <div style="margin-top: 3rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div class="team-card" style="background: #111; padding: 1.5rem; border-radius: 12px; border: 1.5px solid #222;">
                  <img src="/Me (0-00-00-00).png" class="team-avatar" style="width: 60px; height: 60px; border-color: var(--color-accent);">
                  <div class="team-meta">
                    <h4 style="font-size: 0.9rem; color: #fff;">Editor: Vũ An</h4>
                    <span class="accent-bg" style="font-size: 0.6rem;">3 năm exp</span>
                  </div>
                </div>
                <div class="team-card" style="background: #111; padding: 1.5rem; border-radius: 12px; border: 1.5px solid #222;">
                  <div class="team-avatar" style="width: 60px; height: 60px; display:flex; align-items:center; justify-content:center; background:#000; font-size:1.5rem; border-color: var(--color-accent);">👩‍💻</div>
                  <div class="team-meta">
                    <h4 style="font-size: 0.9rem; color: #fff;">Writer: Thanh Huyền</h4>
                    <span class="accent-bg" style="font-size: 0.6rem;">7 năm exp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="project-meta">
            <div style="font-size:0.8rem;color:#555;font-weight:700;text-transform:uppercase;">BIẾN DỮ LIỆU KHÔ KHAN THÀNH CÂU CHUYỆN CUỐN HÚT</div>
          </div>
        </div>

        <!-- Project 2: Người Quan Sát -->
        <div class="project-item reveal">
          <div class="comparison-container" data-project="2">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000" class="comparison-image image-before" alt="Before">
            <div class="image-after" style="background-image:url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=2000'); background-size:cover; background-position:center; position:absolute; top:0; left:0; width:100%; height:100%;"></div>
            <div class="comparison-handle" style="left:50%;"></div>
            <div class="label-before">Draft</div>
            <div class="label-after">Final Story</div>
          </div>
          <div class="project-meta">
            <div>
              <h3 class="project-title hover-word">${wrapWords('Người Quan Sát')}</h3>
              <div class="project-collab">Analysis & Visual Narrative</div>
            </div>
            <div style="font-size:0.8rem;color:#555;font-weight:700;text-transform:uppercase;">KỂ CHUYỆN QUA NHỮNG GÓC NHÌN SÂU SẮC</div>
          </div>
        </div>
      </div>
    </main>
    ${getFooter()}
  `
}

function getCourseTemplate() {
  return `
    ${getHeader()}
    <main>
      <section class="course-hero container reveal">
        <h1 class="hover-word">${wrapWords('Mastering')}<br>${wrapWords('Visual Storytelling')}</h1>
        <p>${hw('Khóa học chuyên sâu dành cho những ai muốn nâng tầm kỹ năng dựng phim từ cơ bản đến nghệ thuật kể chuyện đỉnh cao.')}</p>
      </section>

      <div class="container">
        <div class="course-cards reveal">
          <div class="course-card">
            <h3 class="hover-word">${wrapWords('01. Tư duy hình ảnh')}</h3>
            <p>${hw('Khám phá cách sắp đặt khung hình để dẫn dắt cảm xúc người xem một cách tinh tế.')}</p>
          </div>
          <div class="course-card">
            <h3 class="hover-word">${wrapWords('02. Kỹ thuật A24 Style')}</h3>
            <p>${hw('Học cách tạo ra màu sắc và nhịp điệu đặc trưng của những bộ phim nghệ thuật đương đại.')}</p>
          </div>
          <div class="course-card">
            <h3 class="hover-word">${wrapWords('03. Hậu kỳ chuyên sâu')}</h3>
            <p>${hw('Làm chủ các công cụ mạnh mẽ và quy trình làm việc của một editor chuyên nghiệp.')}</p>
          </div>
        </div>

        <div class="course-cta reveal">
          <h2 class="hover-word">${wrapWords('Sẵn sàng để bắt đầu hành trình?')}</h2>
          <a href="https://t.me/vuanedit" target="_blank" class="submit-btn" style="display:inline-block; width:auto; text-decoration:none; text-align:center;">Nhận tư vấn ngay</a>
        </div>
      </div>
    </main>
    ${getFooter()}
  `
}

function getContactTemplate() {
  return `
    ${getHeader()}
    <main>
      <section class="contact-section">
        <div class="container">
          <div class="contact-inner">
            <div class="contact-info reveal">
              <h1 class="hover-word">${wrapWords('Liên hệ &')}<br>${wrapWords('Hợp tác')}</h1>
              <p>${hw('Bạn có ý tưởng? Hãy cùng nhau biến nó thành hiện thực. Tôi sẽ phản hồi sớm nhất có thể.')}</p>
              <div style="display:flex;flex-direction:column;gap:1.5rem;">
                <div>
                  <div class="contact-detail-label">Email</div>
                  <div class="contact-detail-value">
                    <a href="mailto:vuan.edit@gmail.com">vuan.edit@gmail.com</a>
                  </div>
                </div>
                <div>
                  <div class="contact-detail-label">Social</div>
                  <div class="contact-detail-value" style="display:flex;gap:1.5rem;flex-wrap:wrap;">
                    <a href="https://facebook.com/vuanedit" target="_blank">Facebook</a>
                    <a href="https://instagram.com/vuanedit" target="_blank">Instagram</a>
                    <a href="https://tiktok.com/@vuanedit" target="_blank">TikTok</a>
                    <a href="https://t.me/vuanedit" target="_blank">Telegram</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="contact-form-wrap reveal" style="animation-delay:0.15s;">
              <form action="https://formspree.io/f/maqpweyd" method="POST">
                <input type="hidden" name="_to" value="vuan.edit@gmail.com">
                <div class="form-group">
                  <label class="form-label">Họ và tên</label>
                  <input type="text" name="name" class="form-input" placeholder="Ví dụ: Nguyễn Văn A" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Số điện thoại (Zalo)</label>
                  <input type="tel" name="phone" class="form-input" placeholder="090 123 4567" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" name="email" class="form-input" placeholder="name@example.com" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Lời nhắn</label>
                  <textarea name="message" class="form-input" placeholder="Chia sẻ về dự án của bạn..." required></textarea>
                </div>
                <button type="submit" class="submit-btn">Gửi yêu cầu</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${getFooter()}
  `
}


function getTemplate(view) {
  if (view === VIEWS.PROJECTS) return getProjectsTemplate()
  if (view === VIEWS.COURSE) return getCourseTemplate()
  if (view === VIEWS.CONTACT) return getContactTemplate()
  if (view.startsWith(VIEWS.STORE)) return getStoreTemplate(view)
  return getHomeTemplate()
}

// --- RENDER ---
function render() {
  const path = window.location.pathname;
  const hash = window.location.hash;
  
  if (path.startsWith('/projects')) {
    currentView = VIEWS.PROJECTS;
  } else if (path.startsWith('/courses')) {
    currentView = VIEWS.COURSE;
  } else if (path.startsWith('/contact')) {
    currentView = VIEWS.CONTACT;
  } else if (path.startsWith('/store/store-login')) {
    currentView = 'store-login';
  } else if (path.startsWith('/store')) {
    if (hash.startsWith('#store-')) {
       currentView = hash.substring(1);
    } else {
       currentView = VIEWS.STORE;
    }
  } else if (path.startsWith('/geoextractor')) {
    return;
  } else {
    currentView = VIEWS.HOME;
  }

  const app = document.querySelector('#app')
  if (app) app.classList.add('fade-out')

  setTimeout(() => {
    if (app) {
      app.innerHTML = getTemplate(currentView)
      initEffects()
      app.classList.remove('fade-out')
    }
    window.scrollTo(0, 0)
  }, 400)
}
window.render = render;
window.addEventListener('hashchange', render);
window.addEventListener('popstate', render);
// --- EFFECTS ---

// --- EFFECTS ---
function initEffects() {
  const dot = document.querySelector('.cursor-dot')
  const outline = document.querySelector('.cursor-outline')

  // Custom cursor
  if (dot && outline) {
    window.onmousemove = (e) => {
      const posX = e.clientX
      const posY = e.clientY
      dot.style.transform = `translate(${posX - 3}px, ${posY - 3}px)`
      outline.animate({
        transform: `translate(${posX - 18}px, ${posY - 18}px)`
      }, { duration: 450, fill: 'forwards' })
    }

    // Expand cursor on interactive elements
    document.querySelectorAll('a, button, .logo').forEach(el => {
      el.onmouseenter = () => {
        outline.style.width = '52px'
        outline.style.height = '52px'
        outline.style.borderColor = '#b4fd00'
        dot.style.backgroundColor = '#b4fd00'
      }
      el.onmouseleave = () => {
        outline.style.width = '36px'
        outline.style.height = '36px'
        outline.style.borderColor = '#fff'
        dot.style.backgroundColor = '#fff'
      }
    })
  }

  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn')
  const nav = document.querySelector('.site-nav')
  if (menuBtn && nav) {
    menuBtn.onclick = () => {
      menuBtn.classList.toggle('active')
      nav.classList.toggle('active')
    }
    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.onclick = () => {
        menuBtn.classList.remove('active')
        nav.classList.remove('active')
      }
    })
  }

  // Logo click → home
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.style.cursor = 'pointer'
    el.onclick = (e) => {
      e.preventDefault();
      window.location.href = '/';
    }
  })

  // Horizontal Scroll Effect for Hero
  const heroContainer = document.querySelector('.hero-scroll-container')
  const heroStrip = document.getElementById('hero-strip')
  
  if (heroContainer && heroStrip) {
    const handleHeroScroll = () => {
      const rect = heroContainer.getBoundingClientRect()
      const scrollHeight = rect.height - window.innerHeight
      const scrolled = -rect.top
      
      let progress = scrolled / scrollHeight
      if (progress < 0) progress = 0
      if (progress > 1) progress = 1
      
      // Map progress [0, 1] to translation [0%, -75%]
      // Adjust -75% based on content width if needed, but -75% is the user's request
      const translateX = progress * -75
      heroStrip.style.transform = `translateX(${translateX}%)`
    }
    
    window.addEventListener('scroll', handleHeroScroll)
    // Initial call
    handleHeroScroll()
  }

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active')
    })
  }, { threshold: 0.1 })
  document.querySelectorAll('.reveal, .scroll-reveal').forEach(el => observer.observe(el))

  // Comparison Slider
  document.querySelectorAll('.comparison-container').forEach(container => {
    const afterImg = container.querySelector('.image-after')
    const handle = container.querySelector('.comparison-handle')

    const updateSlider = (e) => {
      const rect = container.getBoundingClientRect()
      const clientX = e.clientX || (e.touches && e.touches[0].clientX)
      let position = ((clientX - rect.left) / rect.width) * 100
      if (position < 0) position = 0
      if (position > 100) position = 100
      afterImg.style.clipPath = `inset(0 0 0 ${position}%)`
      handle.style.left = `${position}%`
    }

    container.onmousemove = updateSlider
    container.ontouchmove = updateSlider
  })

  // Store Effects
  if (currentView.startsWith(VIEWS.STORE)) {
    initStoreEffects()
  }
}

// --- INIT ---
render()
