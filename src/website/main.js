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

      <!-- Global background elements removed in favor of site-wavy-background in CSS -->
    </div>

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
        <video poster="${item.poster}" muted autoplay loop playsinline preload="metadata" loading="lazy">
          <source src="${item.srcWebm}" type="video/webm">
          <source src="${item.srcMp4}" type="video/mp4">
        </video>
        <div class="video-stats-overlay">
          <p class="video-summary">${item.summary}</p>
          <div class="stats-grid">
            <span><i class="bi bi-eye"></i> ${item.views}</span>
            <span><i class="bi bi-heart"></i> ${item.likes}</span>
            <span><i class="bi bi-chat-dots"></i> ${item.comments}</span>
            <span><i class="bi bi-share"></i> ${item.shares}</span>
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
              <img src="/Me (0-00-00-00).png" alt="Vũ An" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy">
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

      <section class="course-promo-section reveal">
        <div class="video-montage-container">
          <div class="montage-item vid-1">
            <video src="/video_class_preview/vid_1.mp4" autoplay loop muted playsinline loading="lazy"></video>
          </div>
          <div class="montage-item vid-2">
            <video src="/video_class_preview/vid_2.mp4" autoplay loop muted playsinline loading="lazy"></video>
          </div>
          <div class="montage-item vid-3">
            <video src="/video_class_preview/vid_3.mp4" autoplay loop muted playsinline loading="lazy"></video>
          </div>
        </div>
        <div class="container course-promo-inner">
          <div class="promo-content-wrapper">
            <h2 class="hover-word promo-heading">
              <span class="line-bold">${wrapWords('Từ con số 0 đến')}</span>
              <span class="line-black">${wrapWords('video triệu view')}</span>
            </h2>
            <p>Học trọn bộ kỹ năng: After Effects nền tảng, GEOLayers 3 chuyên sâu và Tư duy viral content. Biến dữ liệu khô khan thành những câu chuyện bản đồ chuyển động đầy cuốn hút.</p>
            <div class="promo-btn-container">
              <a href="/courses/" class="promo-btn">Khám phá khóa học</a>
            </div>
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
                    <div style="font-size: 2.5rem; color: #fff;"><i class="bi bi-person-bounding-box"></i></div>
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
                      <div class="stats" style="font-size: 0.6rem; color: var(--color-accent);"><i class="bi bi-heart-fill"></i> 335K | <i class="bi bi-arrow-repeat"></i> 5K</div>
                    </div>
                  </div>
                  <div class="content-card" style="background: #111; border: 1.5px solid #222;">
                    <div class="content-card-thumb" style="aspect-ratio: 9/16; background: #222;"><div class="views accent-bg">6.9M</div></div>
                    <div class="content-card-info" style="padding: 0.8rem; color: #fff;">
                      <p style="font-size: 0.75rem;"><strong>Hàng hóa VN giá cao?</strong></p>
                      <div class="stats" style="font-size: 0.6rem; color: var(--color-accent);"><i class="bi bi-heart-fill"></i> 290K | <i class="bi bi-arrow-repeat"></i> 11K</div>
                    </div>
                  </div>
                  <div class="content-card" style="background: #111; border: 1.5px solid #222;">
                    <div class="content-card-thumb" style="aspect-ratio: 9/16; background: #222;"><div class="views accent-bg">6.2M</div></div>
                    <div class="content-card-info" style="padding: 0.8rem; color: #fff;">
                      <p style="font-size: 0.75rem;"><strong>Kênh đào Phù Nam?</strong></p>
                      <div class="stats" style="font-size: 0.6rem; color: var(--color-accent);"><i class="bi bi-heart-fill"></i> 280K | <i class="bi bi-arrow-repeat"></i> 9K</div>
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
                  <div class="team-avatar" style="width: 60px; height: 60px; display:flex; align-items:center; justify-content:center; background:#000; font-size:1.8rem; border: 1px solid var(--color-accent);"><i class="bi bi-person-workspace" style="color:#fff;"></i></div>
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

        <div class="project-item reveal">
          <div class="comparison-container" data-project="2">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000" class="comparison-image image-before" alt="Before" loading="lazy">
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
        <h1 class="hover-word">${wrapWords('Làm chủ')}<br>${wrapWords('Kể chuyện bằng Dữ liệu')}</h1>
        <p>${hw('Khóa học 10 buổi (15 giờ) – Từ con số 0 đến làm chủ quy trình sản xuất video triệu view theo phong cách "Người Quan Sát" và "Tình Báo Thị Trường".')}</p>
      </section>

      <div class="container">
        <!-- PHASE 1: AE CẤP TỐC -->
        <div class="course-phase reveal">
          <div class="phase-title">Phase 01: AE Cấp tốc (Nền tảng dựng video)</div>
          <div class="session-list">
            <div class="session-item">
              <div class="session-name">Buổi 1: AE nền tảng + Moodboard</div>
              <div class="session-desc">Làm quen giao diện, timeline, layer, keyframe. Bố cục 9:16 chuẩn MXH. Hướng dẫn tạo moodboard cá nhân (Canva/Milanote). Thực hành dựng 1 đoạn 10-15s cơ bản.</div>
            </div>
            <div class="session-item">
              <div class="session-name">Buổi 2: Motion + Sound mixing cơ bản</div>
              <div class="session-desc">Kỹ thuật zoom, pan, shake, blur, fade. Cách sync chuyển cảnh với beat nhạc. Tổ chức track âm thanh (VO, nhạc nền, SFX). Thực hành dựng đoạn 20-30s.</div>
            </div>
            <div class="session-item">
              <div class="session-name">Buổi 3: Template Storytelling + SFX</div>
              <div class="session-desc">Cấu trúc 30-60s: Hook, Body, Outro. Xây dựng project template tối ưu. Làm chủ SFX (whoosh, pop, click). Thực hành chỉnh video 20-30s với nhịp ổn.</div>
            </div>
          </div>
        </div>

        <!-- PHASE 2: GEOLAYERS 3 -->
        <div class="course-phase reveal">
          <div class="phase-title">Phase 02: GEOLayers 3 (Video bản đồ chuyên sâu)</div>
          <div class="session-list">
            <div class="session-item">
              <div class="session-name">Buổi 4: Bản đồ cơ bản</div>
              <div class="session-desc">Cài đặt plugin GEOLayers, nguồn map, xử lý lỗi. Tạo Mapcomp, chọn style map, camera cơ bản. Thực hành tạo comp bản đồ Việt Nam/tỉnh thành.</div>
            </div>
            <div class="session-item">
              <div class="session-name">Buổi 5: Khoanh vùng, Route & Label</div>
              <div class="session-desc">Vẽ vùng dự án, tạo đường đi (route) từ sân bay/trung tâm. Cách đặt label, chú giải chuyên nghiệp. Timing chuyển động map kết hợp SFX.</div>
            </div>
            <div class="session-item">
              <div class="session-name">Buổi 6: Camera Cinematic & 3D Terrain</div>
              <div class="session-desc">Điều khiển Orbit, dolly, tilt. Tận dụng 3D terrain, bóng đổ, vignette. Color grade bản đồ để trông "cinematic" như phim tài liệu.</div>
            </div>
            <div class="session-item">
              <div class="session-name">Buổi 7: Ghép AE + Text & Infographic</div>
              <div class="session-desc">Đưa Mapcomp vào AE tổng. Thêm text, icon, infographic (dòng vốn, cung-cầu). Cách chia giọng VO cho kịch bản BĐS/thị trường 30-60s.</div>
            </div>
            <div class="session-item">
              <div class="session-name">Buổi 8: Hoàn thiện sản phẩm & Checklist</div>
              <div class="session-desc">Checklist pacing (10-12 ý mỗi 3s), âm thanh (VO rõ, nhạc không lấn). Chuẩn export TikTok/Reels. Xuất video bản đồ hoàn chỉnh được review 1-1.</div>
            </div>
          </div>
        </div>

        <!-- PHASE 3: CONTENT VIRAL -->
        <div class="course-phase reveal">
          <div class="phase-title">Phase 03: Content Viral (Tư duy & Tối ưu)</div>
          <div class="session-list">
            <div class="session-item">
              <div class="session-name">Buổi 9: Hook, Kịch bản & Moodboard âm thanh</div>
              <div class="session-desc">Phân tích cấu trúc video viral. 5-7 mẫu hook (mistake, curiosity gap...). Viết kịch bản cho chủ đề BĐS & Tình báo thị trường. Chọn nhạc nền signature.</div>
            </div>
            <div class="session-item">
              <div class="session-name">Buổi 10: Quy trình sản xuất & Tối ưu kênh</div>
              <div class="session-desc">Cách bắt trend, tối ưu hashtag, caption, thumbnail. Template kênh đồng bộ. Lập Content calendar cho 15-30 video. Quy trình tái sử dụng template.</div>
            </div>
          </div>
        </div>

        <!-- PRICING TABLE -->
        <section class="pricing-section reveal">
          <h2 class="hover-word">${wrapWords('Bảng giá & Gói học')}</h2>
          <div class="pricing-table-wrapper">
            <table class="pricing-table">
              <thead>
                <tr>
                  <th>Gói học</th>
                  <th>Số buổi</th>
                  <th>Hình thức</th>
                  <th>Giá ưu đãi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AE cấp tốc (Buổi 1-3)</td>
                  <td>3</td>
                  <td>Nhóm online</td>
                  <td class="price">590.000 VNĐ</td>
                </tr>
                <tr>
                  <td>GEOLayers 3 (Buổi 4-8)</td>
                  <td>5</td>
                  <td>Nhóm online</td>
                  <td class="price">1.990.000 VNĐ</td>
                </tr>
                <tr>
                  <td>Content Viral (Buổi 9-10)</td>
                  <td>2</td>
                  <td>Nhóm online</td>
                  <td class="price">890.000 VNĐ</td>
                </tr>
                <tr class="highlight-row">
                  <td>Combo kỹ thuật (AE + GEOLayers)</td>
                  <td>8</td>
                  <td>Nhóm online</td>
                  <td class="price">2.390.000 VNĐ</td>
                </tr>
                <tr class="main-combo">
                  <td>Combo FULL (All in one)</td>
                  <td>10</td>
                  <td>Nhóm online</td>
                  <td class="price">3.190.000 VNĐ</td>
                </tr>
                <tr>
                  <td>Kèm 1-1 Online (Toàn bộ khóa)</td>
                  <td>10</td>
                  <td>1-1 online</td>
                  <td class="price">7.500.000 VNĐ</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style="margin-top: 2rem; font-size: 0.8rem; color: var(--color-subtle);">* Các gói lẻ 1-1 vui lòng nhắn tin trực tiếp để nhận báo giá chi tiết.</p>
        </section>

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
// Injects a global video background with parallax
function injectBackground() {
  if (document.querySelector('.site-video-background')) return;
  const container = document.createElement('div');
  container.className = 'site-video-background';
  
  const video = document.createElement('video');
  video.src = '/video_background.mp4';
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  
  const overlay = document.createElement('div');
  overlay.className = 'video-overlay';
  
  container.appendChild(video);
  container.appendChild(overlay);
  document.body.prepend(container);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  render();
  injectBackground();
});

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
    let ticking = false
    
    const handleHeroScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = heroContainer.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          
          // Use a more robust scroll progress calculation
          // Starts scrolling when the container's top hits the top of the viewport
          // Ends scrolling when the container's bottom hits the bottom of the viewport
          const totalScrollable = rect.height - viewportHeight
          let scrolled = -rect.top
          
          let progress = scrolled / totalScrollable
          if (progress < 0) progress = 0
          if (progress > 1) progress = 1
          
          // Calculate the correct translation to show all items
          // translateX = -(stripWidth - viewportWidth) * progress
          const stripWidth = heroStrip.scrollWidth
          const viewportWidth = window.innerWidth
          const maxTranslate = Math.max(0, stripWidth - viewportWidth)
          
          const translateX = progress * maxTranslate
          heroStrip.style.transform = `translateX(${-translateX}px)`
          
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleHeroScroll, { passive: true })
    window.addEventListener('resize', handleHeroScroll, { passive: true })
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

    container.addEventListener('mousemove', updateSlider)
    container.addEventListener('touchmove', updateSlider, { passive: true })
    
    // Add active class for better mobile feedback
    container.addEventListener('touchstart', () => container.classList.add('active'), { passive: true })
    container.addEventListener('touchend', () => container.classList.remove('active'), { passive: true })
  })

  // Store Effects
  if (currentView.startsWith(VIEWS.STORE)) {
    initStoreEffects()
  }
}
