import './style.css'
import { getStoreTemplate, initStoreEffects } from '../store/store-main.js'
import { t, getLang, setLang } from '../shared/i18n.js'

// --- CONSTANTS ---
const VIEWS = {
  HOME: 'home',
  PROJECTS: 'projects',
  COURSE: 'course',
  CONTACT: 'contact',
  STORE: 'store',
  BLOG: 'blog'
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
  const lang = getLang()
  return `
    <header class="site-header reveal">
      <div class="logo" data-nav="">
        <img src="/logo_brand.svg" alt="Vũ An - Video Editor & Content Creator">
      </div>
      <button class="mobile-menu-btn" aria-label="Toggle Menu">
        <span></span>
        <span></span>
      </button>
      <nav class="site-nav">
        <a href="/" data-nav="">${t('nav_home')}</a>
        <a href="/projects/">${t('nav_projects')}</a>
        <a href="/courses/">${t('nav_courses')}</a>
        <a href="/store/">${t('nav_store')}</a>
        <a href="/blog/">${t('nav_blog')}</a>
        <a href="/contact/">${t('nav_contact')}</a>
        <button class="lang-toggle" aria-label="Switch language">
          <span class="lang-option ${lang === 'vi' ? 'active' : ''}" data-lang="vi">VI</span>
          <span class="lang-divider">/</span>
          <span class="lang-option ${lang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
        </button>
      </nav>
    </header>
  `
}

function getFooter() {
  return `
    <footer class="site-footer">
      <p>${t('footer_copy')}</p>
      <div style="display:flex; gap:1.5rem; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">
        <a href="https://facebook.com/vuanedit" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://instagram.com/vuanedit" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://tiktok.com/@vuanedit" target="_blank" rel="noopener noreferrer">TikTok</a>
      </div>
    </footer>
  `
}

import { videoData } from './video_data.js'

// --- MONTAGE DATA (Sample for Course Promo) ---
const montageData = [
  {
    id: 1,
    video: '/video_class_preview/vid_1.mp4',
    summary: 'AE Cấp Tốc - Nền tảng dựng phim chuẩn viral.',
    views: '450K',
    likes: '32K'
  },
  {
    id: 2,
    video: '/video_class_preview/vid_2.mp4',
    summary: 'GEOLayers 3 - Làm chủ bản đồ chuyển động.',
    views: '890K',
    likes: '64K'
  },
  {
    id: 3,
    video: '/video_class_preview/vid_3.mp4',
    summary: 'Tư duy Viral - Biến con số thành triệu view.',
    views: '215K',
    likes: '18K'
  }
]

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
            <!-- First Item: Centered Title + CTA -->
            <div class="hero-item hero-text-item">
              <h1 class="hover-word">${wrapWords(t('hero_line1'))}<br>${wrapWords(t('hero_line2'))}</h1>
              <p class="hero-subtitle">${t('hero_sub')}</p>
              <div class="hero-cta-group">
                <a href="/courses/" class="hero-cta-btn">${t('hero_cta')}</a>
              </div>
              <div class="hero-stats-bar">
                <div class="hero-stat-item">
                  <span class="hero-stat-number">${t('hero_stats_views')}</span>
                  <span class="hero-stat-label">${t('hero_stats_views_label')}</span>
                </div>
                <div class="hero-stat-divider"></div>
                <div class="hero-stat-item">
                  <span class="hero-stat-number">${t('hero_stats_students')}</span>
                  <span class="hero-stat-label">${t('hero_stats_students_label')}</span>
                </div>
                <div class="hero-stat-divider"></div>
                <div class="hero-stat-item">
                  <span class="hero-stat-number">${t('hero_stats_channels')}</span>
                  <span class="hero-stat-label">${t('hero_stats_channels_label')}</span>
                </div>
              </div>
            </div>
            <!-- Subsequent Items: Local Videos -->
            ${videoCards}
            <div class="hero-item" style="width: 20vw;"></div> <!-- Spacer at end -->
          </div>
        </div>
      </section>

      <!-- SOCIAL PROOF BAR -->
      <section class="social-proof-section">
        <div class="container">
          <div class="social-proof-inner reveal">
            <p class="social-proof-label">${t('social_proof_title')}</p>
            <div class="social-proof-channels">
              <div class="social-proof-channel">
                <div class="sp-channel-icon"><i class="bi bi-tiktok"></i></div>
                <div class="sp-channel-info">
                  <h3>${t('social_proof_channel1')}</h3>
                  <p>${t('social_proof_channel1_stat')}</p>
                </div>
              </div>
              <div class="social-proof-channel">
                <div class="sp-channel-icon" style="border-color:#ea4335;"><i class="bi bi-tiktok"></i></div>
                <div class="sp-channel-info">
                  <h3>${t('social_proof_channel2')}</h3>
                  <p>${t('social_proof_channel2_stat')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ABOUT (compact) -->
      <section class="about-section">
        <div class="container">
          <div class="about-inner">
            <div class="about-text reveal">
              <h2 class="hover-word">${wrapWords(t('about_title'))}</h2>
              <p style="margin-top:1.5rem; line-height:1.8; max-width: 600px;">${hw(t('about_desc'))}</p>
              
              <div class="project-icon-group">
                <a href="/projects/#finpath" class="project-icon-btn">
                  <span class="project-icon-label">${t('about_project01')}</span>
                  <span class="project-icon-name">Finpath</span>
                </a>
                <a href="/projects/#nqs" class="project-icon-btn">
                  <span class="project-icon-label">${t('about_project02')}</span>
                  <span class="project-icon-name">Người quan sát</span>
                </a>
              </div>
            </div>
              <img src="/Me (0-00-00-00).png" alt="Vũ An" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy">
            </div>
          </div>
        </div>
      </section>

      <!-- COURSE PROMO -->
      <section class="course-promo-section reveal">
        <div class="video-montage-container">
          ${montageData.map((item, idx) => `
            <div class="montage-item vid-${idx + 1}">
              <video src="${item.video}" autoplay loop muted playsinline preload="none"></video>
              <div class="montage-stats">
                <p class="montage-stats-summary">${item.summary}</p>
                <div class="montage-stats-grid">
                  <span><i class="bi bi-eye"></i> ${item.views}</span>
                  <span><i class="bi bi-heart"></i> ${item.likes}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="container course-promo-inner">
          <div class="promo-content-wrapper">
            <h2 class="hover-word promo-heading">
              <span class="line-bold">${wrapWords(t('promo_line1'))}</span>
              <span class="line-black">${wrapWords(t('promo_line2'))}</span>
            </h2>
            <p>${t('promo_desc')}</p>
            <div class="promo-btn-container">
              <a href="/courses/" class="promo-btn">${t('promo_cta')}</a>
            </div>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS -->
      <section class="testimonials-section">
        <div class="container">
          <h2 class="hover-word reveal" style="text-align:center; margin-bottom:3rem;">${wrapWords(t('testimonials_title'))}</h2>
          <div class="testimonials-grid">
            <div class="testimonial-card reveal">
              <div class="testimonial-quote"><i class="bi bi-quote"></i></div>
              <p class="testimonial-text">${t('testimonial_1_text')}</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">${t('testimonial_1_name').charAt(0)}</div>
                <div>
                  <h4>${t('testimonial_1_name')}</h4>
                  <p>${t('testimonial_1_role')}</p>
                </div>
              </div>
            </div>
            <div class="testimonial-card reveal" style="animation-delay:0.1s;">
              <div class="testimonial-quote"><i class="bi bi-quote"></i></div>
              <p class="testimonial-text">${t('testimonial_2_text')}</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">${t('testimonial_2_name').charAt(0)}</div>
                <div>
                  <h4>${t('testimonial_2_name')}</h4>
                  <p>${t('testimonial_2_role')}</p>
                </div>
              </div>
            </div>
            <div class="testimonial-card reveal" style="animation-delay:0.2s;">
              <div class="testimonial-quote"><i class="bi bi-quote"></i></div>
              <p class="testimonial-text">${t('testimonial_3_text')}</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">${t('testimonial_3_name').charAt(0)}</div>
                <div>
                  <h4>${t('testimonial_3_name')}</h4>
                  <p>${t('testimonial_3_role')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DATA SECTION -->
      <section class="data-section">
        <div class="container">
          <div class="reveal" style="max-width:680px;">
            <h2 class="hover-word">${wrapWords(t('data_title'))}</h2>
            <p style="margin-top:1.5rem;">${hw(t('data_desc'))}</p>
          </div>
        </div>
      </section>

      <!-- PRACTICE SECTION -->
      <section class="practice-section">
        <div class="container">
          <div class="reveal" style="max-width:720px;">
            <h2 class="hover-word">${wrapWords(t('practice_title'))}</h2>
            <p style="margin-top:1.5rem;">${hw(t('practice_desc'))}</p>
          </div>
        </div>
      </section>

      <!-- CONTACT LINKS - BIG TEXT -->
      <section style="padding:0; border-top:1.5px solid #000;">
        <div class="container" style="padding:0;">
          <h2 class="reveal" style="padding:2rem 2rem 1rem; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#555; border-bottom:1.5px solid #000;">${t('contact_start')}</h2>
          <a href="mailto:vuan.edit@gmail.com" class="contact-link">vuan.edit@gmail.com</a>
          <a href="https://facebook.com/vuanedit" target="_blank" rel="noopener noreferrer" class="contact-link">Facebook</a>
          <a href="https://instagram.com/vuanedit" target="_blank" rel="noopener noreferrer" class="contact-link">Instagram</a>
          <a href="https://tiktok.com/@vuanedit" target="_blank" rel="noopener noreferrer" class="contact-link">TikTok</a>
        </div>
      </section>

    </main>
    ${getFooter()}
  `
}

function getAnalyticsShowcase(data) {
  const accent = data.accent || '#b4fd00';
  
  // Create an SVG path for the chart bars (0-100 values)
  const points = data.chartBars.map((h, i) => {
    const x = (i / (data.chartBars.length - 1)) * 100;
    // Map max height to 90 so it doesn't touch the very top
    const y = 100 - (h * 0.9);
    return `${x},${y}`;
  });
  
  const polygonPoints = `0,100 ${points.join(' ')} 100,100`; 
  const pathD = `M 0,${100 - (data.chartBars[0] * 0.9)} L ${points.join(' L ')}`;

  // X Axis Labels
  const labels = data.chartLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const labelsHtml = labels.map((lb, i) => {
    let tr = '-50%';
    if (i === 0) tr = '0%';
    else if (i === labels.length - 1) tr = '-100%';
    const leftPos = (i / (labels.length - 1)) * 100;
    return `<div class="ms-x-label" style="left: ${leftPos}%; transform: translateX(${tr})">${lb}</div>`;
  }).join('');

  // Y Axis Lines & Labels
  const maxViews = data.maxChartViews || 50; 
  const yLines = [0, 50, 100].map(val => { // Only show 3 lines for ultra-minimalism: Top, Mid, Bottom
     const viewTick = val === 100 ? '0' : (maxViews * (100 - val) / 100).toFixed(1) + "M";
     return `
       <div class="ms-y-line" style="top: ${val}%">
         <span class="ms-y-label">${viewTick}</span>
       </div>
     `;
  }).join('');

  return `
    <div class="ms-dashboard" style="--accent: ${accent};">
      <div class="ms-header">
        <div class="ms-avatar">${data.avatarHtml}</div>
        <div class="ms-header-info">
          <h3 class="ms-username">${data.username} <i class="bi bi-patch-check-fill" style="color:var(--accent)"></i></h3>
          <p class="ms-desc">${data.desc}</p>
          <div class="ms-followers">
            <span><strong>${data.following}</strong> Following</span>
            <span class="ms-dot"></span>
            <span><strong>${data.followers}</strong> Followers</span>
            <span class="ms-dot"></span>
            <span><strong>${data.videos}</strong> Videos</span>
          </div>
        </div>
      </div>

      <div class="ms-hero-stat">
        <div class="ms-hero-label">TOTAL VIEWS</div>
        <div class="ms-hero-val">${data.stats.views}</div>
        <div class="ms-hero-sub"><i class="bi bi-graph-up-arrow"></i> Outstanding Growth Trajectory</div>
      </div>

      <div class="ms-grid">
        <div class="ms-card">
          <div class="ms-card-label">LIKES</div>
          <div class="ms-card-val">${data.stats.likes}</div>
        </div>
        <div class="ms-card">
          <div class="ms-card-label">COMMENTS</div>
          <div class="ms-card-val">${data.stats.comments}</div>
        </div>
        <div class="ms-card">
          <div class="ms-card-label">SHARES</div>
          <div class="ms-card-val">${data.stats.shares}</div>
        </div>
        <div class="ms-card">
          <div class="ms-card-label">BOOKMARKS</div>
          <div class="ms-card-val">${data.stats.bookmarks}</div>
        </div>
      </div>

      <div class="ms-chart-container">
        <div class="ms-chart-header-line">
          <div class="ms-chart-label">PERFORMANCE TIMELINE</div>
        </div>
        <div class="ms-chart-wrapper">
          <div class="ms-chart-grid">
            ${yLines}
          </div>
          <svg class="ms-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="glowGrad-${data.id}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${accent}" stop-opacity="0.5" />
                <stop offset="100%" stop-color="${accent}" stop-opacity="0.0" />
              </linearGradient>
              <filter id="neon-${data.id}" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="${accent}" flood-opacity="0.6"/>
              </filter>
            </defs>
            <polygon points="${polygonPoints}" fill="url(#glowGrad-${data.id})" class="ms-chart-fill" />
            <path d="${pathD}" fill="none" class="ms-chart-line" filter="url(#neon-${data.id})" vector-effect="non-scaling-stroke" />
          </svg>
          <div class="ms-chart-x-axis">
            ${labelsHtml}
          </div>
        </div>
      </div>

      <div class="ms-footer">
         <div class="ms-f-item">
            <div class="ms-f-label">WATCH TIME</div>
            <div class="ms-f-val">${data.metrics.watchTime}</div>
         </div>
         <div class="ms-f-item">
            <div class="ms-f-label">AVG DURATION</div>
            <div class="ms-f-val">${data.metrics.hours}h</div>
         </div>
         <div class="ms-f-item">
            <div class="ms-f-label">ENGAGEMENT</div>
            <div class="ms-f-val">${data.metrics.engagement}</div>
         </div>
         <div class="ms-f-item">
            <div class="ms-f-label">BUZZ RANK</div>
            <div class="ms-f-val">${data.metrics.rank}</div>
         </div>
      </div>
    </div>
  `;
}

function getProjectsTemplate() {
  const finpathData = {
    id: 'fp',
    accent: '#b4fd00',
    avatarHtml: '<div class="ms-avatar-shape" style="background: linear-gradient(135deg, #111, #333); border: 2px solid #b4fd00; color:#b4fd00;">FP</div>',
    username: "@tinhbao.chungkhoan",
    desc: "Data Visualization & Investment Insights",
    following: "54", followers: "563K", videos: "132",
    stats: { views: "163.6M", likes: "7.3M", comments: "107.3K", shares: "436.6K", bookmarks: "421.7K" },
    metrics: { watchTime: "969.7M", hours: "5.93", rank: "B", engagement: "5%" },
    chartBars: [12, 12, 30, 25, 40, 10, 10, 12, 25, 10, 10, 15, 80, 20, 5],
    chartLabels: ["Thg 10", "Thg 11", "Thg 12", "Thg 01", "Thg 02", "Thg 03"],
    maxChartViews: 25.5
  };

  const nqsData = {
    id: 'nqs',
    accent: '#ea4335',
    avatarHtml: '<div class="ms-avatar-shape" style="background: linear-gradient(135deg, #eee, #fff); border: 2px solid #ea4335; color:#ea4335;">QS</div>',
    username: "@nqs.kinhte <span style='font-size:0.8rem; margin-left:5px;'>🇻🇳</span>",
    desc: "Economic Analysis & Visual Narrative",
    following: "25", followers: "1.2M", videos: "485",
    stats: { views: "374M", likes: "15M", comments: "161.2K", shares: "559.9K", bookmarks: "709.9K" },
    metrics: { watchTime: "11B", hours: "29.46", rank: "B", engagement: "4.4%" },
    chartBars: [2, 35, 30, 28, 12, 5, 5, 8, 30, 6, 10, 15, 6, 8, 12, 7, 50, 15, 20, 18, 5, 5, 6, 5, 4, 3, 5],
    chartLabels: ["Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024"],
    maxChartViews: 45.2
  };

  return `
    ${getHeader()}
    <main>
      <section class="projects-hero container reveal">
        <h1 class="hover-word">${wrapWords(t('projects_title1'))}<br>${wrapWords(t('projects_title2'))}</h1>
        <p>${hw(t('projects_desc'))}</p>
      </section>

      <div class="container">
        <!-- Project 1: Finpath - Tình Báo Thị Trường -->
        <div id="finpath" class="project-item reveal">
          <div class="project-dashboard">
            <div class="project-dashboard-inner">
              <div class="project-dashboard-header">
                <span class="dashboard-tag accent-bg">Data Visualization</span>
                <h2 class="project-dashboard-title">Tình Báo Thị Trường</h2>
                <div class="project-collab">Data Visualization & Motion Branding</div>
              </div>
              ${getAnalyticsShowcase(finpathData)}
            </div>
          </div>
          <div class="project-meta" style="margin-top:2rem;">
            <div class="project-meta-label">BIẾN DỮ LIỆU KHÔ KHAN THÀNH CÂU CHUYỆN CUỐN HÚT</div>
          </div>
        </div>

        <!-- Project 2: Người Quan Sát -->
        <div id="nqs" class="project-item reveal">
          <div class="project-dashboard" style="margin-top:4rem;">
            <div class="project-dashboard-inner">
              <div class="project-dashboard-header">
                <span class="dashboard-tag accent-bg" style="background:#ea4335; color:#fff;">Visual Narrative</span>
                <h2 class="project-dashboard-title" style="color:#ea4335;">Người Quan Sát</h2>
                <div class="project-collab">Analysis & Visual Narrative</div>
              </div>
              ${getAnalyticsShowcase(nqsData)}
            </div>
          </div>
          <div class="project-meta" style="margin-top:2rem;">
            <div class="project-meta-label">KỂ CHUYỆN QUA NHỮNG GÓC NHÌN SÂU SẮC</div>
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
        <h1 class="hover-word">${wrapWords(t('courses_title1'))}<br>${wrapWords(t('courses_title2'))}</h1>
        <p style="margin-top:1.5rem; max-width:600px;">${hw(t('courses_desc'))}</p>
      </section>

      <div class="container">
        <div class="accordion-container reveal">
          <!-- PHASE 1: AE CẤP TỐC -->
          <details class="accordion-item" open>
            <summary class="accordion-title">
              <span>${t('course_phase1_title')}</span>
              <span class="accordion-icon"></span>
            </summary>
            <div class="accordion-content session-list">
              <div class="session-item">
                <div class="session-name">${t('course_session1_name')}</div>
                <div class="session-desc">${t('course_session1_desc')}</div>
              </div>
              <div class="session-item">
                <div class="session-name">${t('course_session2_name')}</div>
                <div class="session-desc">${t('course_session2_desc')}</div>
              </div>
              <div class="session-item">
                <div class="session-name">${t('course_session3_name')}</div>
                <div class="session-desc">${t('course_session3_desc')}</div>
              </div>
              <div class="session-item">
                <div class="session-name">${t('course_session4_name')}</div>
                <div class="session-desc">${t('course_session4_desc')}</div>
              </div>
            </div>
          </details>

          <!-- PHASE 2: GEOLAYERS 3 -->
          <details class="accordion-item">
            <summary class="accordion-title">
              <span>${t('course_phase2_title')}</span>
              <span class="accordion-icon"></span>
            </summary>
            <div class="accordion-content session-list">
              <div class="session-item">
                <div class="session-name">${t('course_session5_name')}</div>
                <div class="session-desc">${t('course_session5_desc')}</div>
              </div>
              <div class="session-item">
                <div class="session-name">${t('course_session6_name')}</div>
                <div class="session-desc">${t('course_session6_desc')}</div>
              </div>
              <div class="session-item">
                <div class="session-name">${t('course_session7_name')}</div>
                <div class="session-desc">${t('course_session7_desc')}</div>
              </div>
              <div class="session-item">
                <div class="session-name">${t('course_session8_name')}</div>
                <div class="session-desc">${t('course_session8_desc')}</div>
              </div>
              <div class="session-item">
                <div class="session-name">${t('course_session9_name')}</div>
                <div class="session-desc">${t('course_session9_desc')}</div>
              </div>
              <div class="session-item">
                <div class="session-name">${t('course_session10_name')}</div>
                <div class="session-desc">${t('course_session10_desc')}</div>
              </div>
              <div class="session-item">
                <div class="session-name">${t('course_session11_name')}</div>
                <div class="session-desc">${t('course_session11_desc')}</div>
              </div>
            </div>
          </details>

          <!-- PHASE 3: CONTENT VIRAL -->
          <details class="accordion-item">
            <summary class="accordion-title">
              <span>${t('course_phase3_title')}</span>
              <span class="accordion-icon"></span>
            </summary>
            <div class="accordion-content session-list">
              <div class="session-item">
                <div class="session-name">${t('course_session12_name')}</div>
                <div class="session-desc">${t('course_session12_desc')}</div>
              </div>
              <div class="session-item">
                <div class="session-name">${t('course_session13_name')}</div>
                <div class="session-desc">${t('course_session13_desc')}</div>
              </div>
            </div>
          </details>
        </div>

        <!-- PRICING TABLE -->
        <section class="pricing-section reveal">
          <h2 class="hover-word" style="text-align: center;">${wrapWords(t('pricing_table_title'))}</h2>
          <div class="pricing-table-wrapper" style="text-align: center;">
            <table class="pricing-table">
              <thead>
                <tr>
                  <th style="text-align: center;">${t('pricing_col_package')}</th>
                  <th style="text-align: center;">${t('pricing_col_sessions')}</th>
                  <th style="text-align: center;">${t('pricing_col_format')}</th>
                  <th style="text-align: center;">${t('pricing_col_price')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${t('pricing_package_ae_title')}</td>
                  <td>${t('pricing_package_ae_sessions')}</td>
                  <td>${t('pricing_package_ae_format')}</td>
                  <td class="price">${t('pricing_package_ae_price')}</td>
                </tr>
                <tr>
                  <td>${t('pricing_package_geolayers_title')}</td>
                  <td>${t('pricing_package_geolayers_sessions')}</td>
                  <td>${t('pricing_package_geolayers_format')}</td>
                  <td class="price">${t('pricing_package_geolayers_price')}</td>
                </tr>
                <tr>
                  <td>${t('pricing_package_viral_title')}</td>
                  <td>${t('pricing_package_viral_sessions')}</td>
                  <td>${t('pricing_package_viral_format')}</td>
                  <td class="price">${t('pricing_package_viral_price')}</td>
                </tr>
                <tr class="highlight-row">
                  <td>${t('pricing_package_tech_combo_title')}</td>
                  <td>${t('pricing_package_tech_combo_sessions')}</td>
                  <td>${t('pricing_package_tech_combo_format')}</td>
                  <td class="price">${t('pricing_package_tech_combo_price')}</td>
                </tr>
                <tr class="main-combo">
                  <td>${t('pricing_package_full_combo_title')}</td>
                  <td>${t('pricing_package_full_combo_sessions')}</td>
                  <td>${t('pricing_package_full_combo_format')}</td>
                  <td class="price">${t('pricing_package_full_combo_price')}</td>
                </tr>
                <tr class="highlight-1on1">
                  <td>${t('pricing_package_1on1_title')}</td>
                  <td>${t('pricing_package_1on1_sessions')}</td>
                  <td>${t('pricing_package_1on1_format')}</td>
                  <td class="price">${t('pricing_package_1on1_price')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style="margin-top: 2rem; font-size: 0.8rem; color: var(--color-subtle); text-align: center;">${t('pricing_note')}</p>
        </section>

        <!-- FAQ SECTION -->
        <section class="faq-section reveal" style="margin-top: 3rem;">
          <h2 class="hover-word" style="text-align: center; margin-bottom: 2rem;">${wrapWords(t('faq_title'))} <span style="color:var(--color-accent)">${t('faq_tag')}</span></h2>
          <div class="accordion-container" style="max-width: 800px; margin: 0 auto;">
            <details class="accordion-item" open>
              <summary class="accordion-title">
                <span>${t('faq_q1')}</span>
                <span class="accordion-icon"></span>
              </summary>
              <div class="accordion-content">
                ${t('faq_a1')}
              </div>
            </details>
            <details class="accordion-item">
              <summary class="accordion-title">
                <span>${t('faq_q2')}</span>
                <span class="accordion-icon"></span>
              </summary>
              <div class="accordion-content">
                ${t('faq_a2')}
              </div>
            </details>
            <details class="accordion-item">
              <summary class="accordion-title">
                <span>${t('faq_q3')}</span>
                <span class="accordion-icon"></span>
              </summary>
              <div class="accordion-content">
                ${t('faq_a3')}
              </div>
            </details>
          </div>
        </section>

        <div class="course-cta reveal">
          <h2 class="hover-word">${wrapWords(t('courses_cta'))}</h2>
          <a href="https://zalo.me/0967575313" target="_blank" rel="noopener noreferrer" class="submit-btn" style="display:inline-block; width:auto; text-decoration:none; text-align:center;">${t('courses_cta_btn')}</a>
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
              <h1 class="hover-word">${wrapWords(t('contact_title1'))}<br>${wrapWords(t('contact_title2'))}</h1>
              <p class="contact-desc">${hw(t('contact_desc'))}</p>
              <div class="contact-details">
                <div>
                  <div class="contact-detail-label">${t('contact_email_label')}</div>
                  <div class="contact-detail-value">
                    <a href="mailto:vuan.edit@gmail.com">vuan.edit@gmail.com</a>
                  </div>
                </div>
                <div>
                  <div class="contact-detail-label">${t('contact_social_label')}</div>
                  <div class="contact-detail-value social-links">
                    <a href="https://facebook.com/vuanedit" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://instagram.com/vuanedit" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://tiktok.com/@vuanedit" target="_blank" rel="noopener noreferrer">TikTok</a>
                    <a href="https://zalo.me/0967575313" target="_blank" rel="noopener noreferrer">Zalo</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="contact-form-wrap reveal" style="animation-delay:0.15s;">
              <form action="https://formspree.io/f/maqpweyd" method="POST">
                <input type="hidden" name="_to" value="vuan.edit@gmail.com">
                <div class="form-group">
                  <label class="contact-label">${t('contact_name')}</label>
                  <input type="text" name="name" class="contact-input" placeholder="${t('contact_name_ph')}" required>
                </div>
                <div class="form-group">
                  <label class="contact-label">${t('contact_phone')}</label>
                  <input type="tel" name="phone" class="contact-input" placeholder="${t('contact_phone_ph')}" required>
                </div>
                <div class="form-group">
                  <label class="contact-label">${t('contact_email')}</label>
                  <input type="email" name="email" class="contact-input" placeholder="${t('contact_email_ph')}" required>
                </div>
                <div class="form-group">
                  <label class="contact-label">${t('contact_message')}</label>
                  <textarea name="message" class="contact-input" rows="4" placeholder="${t('contact_message_ph')}" required></textarea>
                </div>
                <button type="submit" class="submit-btn">${t('contact_submit')}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${getFooter()}
  `
}


// --- BLOG DATA ---
const blogPosts = [
  {
    id: 'cach-edit-video-trieu-view',
    title: 'Cách Edit Video Triệu View — Bí Quyết Từ Thực Chiến',
    excerpt: 'Khám phá quy trình sản xuất video triệu view từ kinh nghiệm thực tế của Vũ An tại kênh Tình Báo Thị Trường.',
    date: '2026-03-25',
    category: 'Video Editing',
    readTime: '8 phút đọc',
    content: `
      <p>Bạn có bao giờ tự hỏi tại sao cùng một chủ đề, có video đạt triệu view nhưng video khác chỉ vài trăm? Bí mật nằm ở <strong>3 yếu tố then chốt</strong>: Hook, Pacing và Visual Storytelling.</p>
      <h3>1. Hook — 3 giây đầu quyết định tất cả</h3>
      <p>Trên TikTok, người xem quyết định lướt hay ở lại chỉ trong 1-3 giây đầu. Một hook hiệu quả thường bắt đầu bằng một câu hỏi gây tò mò hoặc một hình ảnh bất ngờ. Ví dụ: thay vì mở đầu "Hôm nay mình sẽ nói về lạm phát", hãy thử "Nếu bạn có 100 triệu trong ngân hàng, mỗi năm bạn đang mất đi bao nhiêu?"</p>
      <h3>2. Pacing — Nhịp độ video</h3>
      <p>Video viral thường có nhịp nhanh: mỗi 2-3 giây phải có một thay đổi về hình ảnh, text hoặc âm thanh. Sử dụng kỹ thuật zoom, pan, và chuyển cảnh sync với beat nhạc để giữ chân người xem.</p>
      <h3>3. Visual Storytelling — Kể chuyện bằng hình ảnh</h3>
      <p>Thay vì chỉ hiện text trên nền đen, hãy dùng infographic, bản đồ chuyển động, và data visualization. Đây chính là thế mạnh mà mình đã áp dụng cho kênh Tình Báo Thị Trường với hơn 100 triệu lượt xem.</p>
      <h3>Kết luận</h3>
      <p>Edit video triệu view không phải là may mắn — đó là kết quả của việc hiểu người xem và áp dụng đúng kỹ thuật. Nếu bạn muốn học chi tiết hơn, hãy xem <a href="/courses/">khóa học thực chiến</a> của mình.</p>
    `
  },
  {
    id: 'geolayers-3-huong-dan-co-ban',
    title: 'GEOLayers 3 — Hướng Dẫn Toàn Diện Cho Người Mới',
    excerpt: 'Từ cài đặt plugin đến tạo bản đồ chuyển động cinematic trong After Effects với GEOLayers 3.',
    date: '2026-03-20',
    category: 'GEOLayers 3',
    readTime: '12 phút đọc',
    content: `
      <p>GEOLayers 3 là plugin After Effects cho phép bạn tạo <strong>bản đồ chuyển động chất lượng cao</strong> — công cụ mà các kênh như Tình Báo Thị Trường và Người Quan Sát sử dụng hàng ngày.</p>
      <h3>Bước 1: Cài đặt và thiết lập</h3>
      <p>Tải GEOLayers 3 từ aescripts.com, cài vào After Effects. Mở plugin, tạo Mapcomp đầu tiên. Chọn style bản đồ phù hợp — mình recommend style dark cho video news/analysis.</p>
      <h3>Bước 2: Tạo Mapcomp cơ bản</h3>
      <p>Mapcomp là composition chứa bản đồ. Bạn có thể zoom, pan, rotate bản đồ tự do. Ưu điểm lớn nhất: bản đồ vector — zoom bao nhiêu cũng không bị vỡ.</p>
      <h3>Bước 3: Thêm Route và Label</h3>
      <p>Vẽ đường đi (route) giữa hai điểm, thêm marker và label cho các vị trí quan trọng. Kết hợp animation timing để tạo hiệu ứng "khám phá" trên bản đồ.</p>
      <h3>Bước 4: Camera Cinematic</h3>
      <p>Sử dụng Orbit camera để tạo góc nghiêng 3D, thêm terrain và bóng đổ. Color grade bản đồ với Lumetri để trông như phim tài liệu chuyên nghiệp.</p>
      <p>Xem đầy đủ trong <a href="/courses/">Phase 02 của khóa học</a>.</p>
    `
  },
  {
    id: 'tu-duy-viral-content',
    title: 'Tư Duy Viral Content — Tại Sao Video Của Bạn Không Lên Xu Hướng?',
    excerpt: '5 sai lầm phổ biến khiến video không viral và cách khắc phục bằng data-driven approach.',
    date: '2026-03-15',
    category: 'Content Strategy',
    readTime: '6 phút đọc',
    content: `
      <p>Sau 4 năm sản xuất nội dung và hàng trăm video, mình nhận ra rằng viral content không phải là "cầu may" — mà là <strong>khoa học có thể lặp lại</strong>.</p>
      <h3>Sai lầm 1: Không có Hook rõ ràng</h3>
      <p>80% video "flop" vì mở đầu nhàm chán. Người xem không biết video nói về gì trong 3 giây đầu → lướt ngay.</p>
      <h3>Sai lầm 2: Quá nhiều thông tin, thiếu câu chuyện</h3>
      <p>Video 60 giây nhồi 20 ý → người xem choáng ngợp. Thay vào đó, chọn 1 góc nhìn, kể 1 câu chuyện, đưa ra 1 kết luận.</p>
      <h3>Sai lầm 3: Nhịp quá chậm</h3>
      <p>Trên short-form content, mỗi 2-3 giây phải có "sự kiện" mới: text mới, hình ảnh mới, âm thanh mới. Nếu 5 giây không có gì thay đổi, người xem sẽ lướt.</p>
      <h3>Sai lầm 4: Copy format mà không hiểu tại sao</h3>
      <p>Nhiều người copy y hệt format video viral nhưng không hiểu logic đằng sau. Điều quan trọng là hiểu framework rồi adapt cho nội dung của bạn.</p>
      <h3>Sai lầm 5: Không tối ưu sau khi đăng</h3>
      <p>Analytics là bạn thân. Watch time, completion rate, save rate — đây là những metrics cho bạn biết video đang "hỏng" ở đoạn nào. Dùng data này để cải thiện video tiếp theo.</p>
    `
  },
  {
    id: 'data-visualization-cho-video',
    title: 'Data Visualization Cho Video — Biến Số Liệu Thành Câu Chuyện',
    excerpt: 'Cách biến dữ liệu khô khan thành infographic và bản đồ chuyển động cuốn hút người xem.',
    date: '2026-03-10',
    category: 'Data Visualization',
    readTime: '10 phút đọc',
    content: `
      <p>Trong thời đại "data is king", khả năng <strong>kể chuyện bằng dữ liệu</strong> là skill có giá trị nhất cho content creator. Đây là cách mình đã build 2 kênh triệu view chỉ dựa vào data visualization.</p>
      <h3>Nguyên tắc 1: Less is More</h3>
      <p>Một biểu đồ tốt chỉ truyền tải 1 message. Đừng nhồi 10 loại data vào 1 slide. Chia nhỏ, animate từng bước để người xem theo kịp.</p>
      <h3>Nguyên tắc 2: Chọn đúng loại chart</h3>
      <p>So sánh → Bar chart. Xu hướng → Line chart. Tỷ lệ → Pie/Donut. Địa lý → Map. Đừng dùng pie chart cho 15 category — người xem sẽ không đọc được.</p>
      <h3>Nguyên tắc 3: Motion = Emotion</h3>
      <p>Static infographic tốt cho print, nhưng video cần MOTION. Animate số liệu tăng dần, bar chart grow từ 0, map zoom-in vào vị trí quan trọng. Motion tạo ra cảm xúc và giữ chân người xem.</p>
      <h3>Công cụ mình sử dụng</h3>
      <p>After Effects + GEOLayers 3 cho bản đồ, Excel/Google Sheets cho data processing, Figma cho mockup trước khi animate. Flow cơ bản: Data → Insight → Storyboard → Animate.</p>
    `
  }
]

function getBlogTemplate() {
  const postCards = blogPosts.map(post => `
    <article class="blog-card reveal">
      <div class="blog-card-meta">
        <span class="blog-card-category">${post.category}</span>
        <span class="blog-card-date">${new Date(post.date).toLocaleDateString(getLang() === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <h2 class="blog-card-title hover-word">
        <a href="/blog/#post-${post.id}">${wrapWords(post.title)}</a>
      </h2>
      <p class="blog-card-excerpt">${post.excerpt}</p>
      <div class="blog-card-footer">
        <span class="blog-card-readtime"><i class="bi bi-clock"></i> ${post.readTime}</span>
        <a href="/blog/#post-${post.id}" class="blog-card-link">${t('blog_readmore')} <i class="bi bi-arrow-right"></i></a>
      </div>
    </article>
  `).join('')

  return `
    ${getHeader()}
    <main>
      <section class="blog-hero container reveal">
        <h1 class="hover-word">${wrapWords(t('blog_title1'))}<br>${wrapWords(t('blog_title2'))}</h1>
        <p>${hw(t('blog_desc'))}</p>
      </section>

      <div class="container blog-grid">
        ${postCards}
      </div>

      <section class="blog-cta container reveal">
        <div class="blog-cta-inner">
          <h2 class="hover-word">${wrapWords(t('blog_cta_title'))}</h2>
          <p>${t('blog_cta_desc')}</p>
          <a href="/courses/" class="submit-btn" style="display:inline-block; width:auto; text-decoration:none; text-align:center;">${t('blog_cta_btn')}</a>
        </div>
      </section>
    </main>
    ${getFooter()}
  `
}

function getBlogPostTemplate(postId) {
  const post = blogPosts.find(p => p.id === postId)
  if (!post) {
    return `
      ${getHeader()}
      <main>
        <section class="container" style="padding:10vh 2rem; text-align:center;">
          <h1>${t('blog_not_found')}</h1>
          <p style="margin-top:1rem; color:var(--color-subtle);">${t('blog_not_found_desc')}</p>
          <a href="/blog/" style="display:inline-block; margin-top:2rem; color:var(--color-accent); font-weight:700;">${t('blog_back')}</a>
        </section>
      </main>
      ${getFooter()}
    `
  }

  // Get related posts (exclude current)
  const related = blogPosts.filter(p => p.id !== postId).slice(0, 2)
  const relatedCards = related.map(p => `
    <a href="/blog/#post-${p.id}" class="blog-related-card">
      <span class="blog-card-category">${p.category}</span>
      <h4>${p.title}</h4>
      <span class="blog-card-readtime"><i class="bi bi-clock"></i> ${p.readTime}</span>
    </a>
  `).join('')

  return `
    ${getHeader()}
    <main>
      <article class="blog-post-container container">
        <div class="blog-post-header reveal">
          <a href="/blog/" class="blog-back-link"><i class="bi bi-arrow-left"></i> ${t('blog_all_posts')}</a>
          <div class="blog-post-meta">
            <span class="blog-card-category">${post.category}</span>
            <span class="blog-card-date">${new Date(post.date).toLocaleDateString(getLang() === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span class="blog-card-readtime"><i class="bi bi-clock"></i> ${post.readTime}</span>
          </div>
          <h1 class="blog-post-title hover-word">${wrapWords(post.title)}</h1>
        </div>

        <div class="blog-post-body reveal">
          ${post.content}
        </div>

        <div class="blog-post-author reveal">
          <img src="/Me (0-00-00-00).png" alt="Vũ An" class="blog-author-avatar">
          <div>
            <h4>Vũ An</h4>
            <p>Video Editor & Content Creator — Tình Báo Thị Trường, Người Quan Sát</p>
          </div>
        </div>

        ${related.length > 0 ? `
          <div class="blog-related reveal">
            <h3>${t('blog_related')}</h3>
            <div class="blog-related-grid">
              ${relatedCards}
            </div>
          </div>
        ` : ''}
      </article>
    </main>
    ${getFooter()}
  `
}

function getTemplate(view) {
  if (view === VIEWS.PROJECTS) return getProjectsTemplate()
  if (view === VIEWS.COURSE) return getCourseTemplate()
  if (view === VIEWS.CONTACT) return getContactTemplate()
  if (view === VIEWS.BLOG) return getBlogTemplate()
  if (view.startsWith('blog-post-')) return getBlogPostTemplate(view.replace('blog-post-', ''))
  if (view.startsWith(VIEWS.STORE)) return getStoreTemplate(view)
  return getHomeTemplate()
}

// --- RENDER ---
function render(e) {
  const path = window.location.pathname;
  const hash = window.location.hash;
  
  if (path.startsWith('/projects')) {
    currentView = VIEWS.PROJECTS;
  } else if (path.startsWith('/courses')) {
    currentView = VIEWS.COURSE;
  } else if (path.startsWith('/contact')) {
    currentView = VIEWS.CONTACT;
  } else if (path.startsWith('/blog')) {
    if (hash.startsWith('#post-')) {
      currentView = 'blog-post-' + hash.substring(6);
    } else {
      currentView = VIEWS.BLOG;
    }
  } else if (path.startsWith('/store/store-login')) {
    currentView = 'store-login';
  } else if (path.startsWith('/store')) {
    if (hash.startsWith('#store-')) {
       currentView = hash.substring(1);
    } else {
       currentView = VIEWS.STORE;
    }
  } else {
    currentView = VIEWS.HOME;
  }

  const app = document.querySelector('#app')
  const isSilentRender = e && e.type === 'vuanedit:render'

  if (isSilentRender) {
    if (app) {
      app.innerHTML = getTemplate(currentView)
      initEffects()
    }
    return;
  }

  if (app) app.classList.add('fade-out')

  setTimeout(() => {
    if (app) {
      try {
        app.innerHTML = getTemplate(currentView)
        initEffects()
      } catch (err) {
        console.error("[Render Error] Failed to update view:", err);
        // Fallback UI if initialization crashes
        app.innerHTML = `
          <div style="padding: 10vh 2rem; text-align: center;">
            <h1 style="color:red;">Error</h1>
            <p>Something went wrong while loading the page.</p>
            <p style="font-size:0.8rem; color:#888;">${err.message}</p>
            <a href="/" style="color:var(--color-accent); text-decoration:underline;">Try going home</a>
          </div>
        `;
      } finally {
        app.classList.remove('fade-out')
        
        // Handle hash scrolling for anchor links
        const currentHash = window.location.hash;
        if (currentHash) {
          // Wait a tiny bit for the DOM to fully paint
          setTimeout(() => {
            const target = document.querySelector(currentHash);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        } else {
          window.scrollTo(0, 0);
        }
      }
    }
  }, 400)
}
window.render = render;
window.addEventListener('hashchange', render);
window.addEventListener('popstate', render);
window.addEventListener('vuanedit:render', render);
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
// Initialize effects
function initEffects() {

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

  // --- HERO HORIZONTAL SCROLL MANAGER (SINGLETON) ---
  // We use a singleton to prevent multiple listeners and "glitchy" overlays during re-renders.
  if (!window.__VUAN_HERO_SCROLL__) {
    window.__VUAN_HERO_SCROLL__ = {
      initialized: false,
      isIntersecting: false,
      ticking: false,
      
      init() {
        if (this.initialized) return;
        this.initialized = true;
        
        console.log("VUAN_DEBUG: Hero Scroll Manager initialized (v2.3)");
        
        const handleScroll = () => {
          // Double check intersection inside the handler
          if (this.ticking) return;
          
          this.ticking = true;
          window.requestAnimationFrame(() => {
            const container = document.querySelector('.hero-scroll-container');
            const strip = document.getElementById('hero-strip');
            
            if (container && strip) {
              const rect = container.getBoundingClientRect();
              const containerHeight = container.offsetHeight;
              const viewportHeight = window.innerHeight;
              
              // getBoundingClientRect is the most robust way to calculate progress on mobile
              // Starts when rect.top is 0, ends when rect.top reaches -(containerHeight - viewportHeight)
              const totalScrollable = containerHeight - viewportHeight;
              
              // Robust viewport-relative calculation
              let progress = -rect.top / totalScrollable;
              progress = Math.max(0, Math.min(1, progress));
              
              const stripWidth = strip.scrollWidth;
              const viewportWidth = window.innerWidth;
              const maxTranslate = Math.max(0, stripWidth - viewportWidth);
              
              const translateX = progress * maxTranslate;
              strip.style.transform = `translate3d(${-translateX}px, 0, 0)`;
            }
            this.ticking = false;
          });
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        this.handler = handleScroll;
        
        // Use IntersectionObserver to toggle logic only when needed
        const observer = new IntersectionObserver((entries) => {
          this.isIntersecting = entries[0].isIntersecting;
          if (this.isIntersecting) handleScroll();
        }, { threshold: 0 });
        
        this.observer = observer;
      },
      
      update(container) {
        if (this.observer && container) {
          this.observer.disconnect();
          this.observer.observe(container);
          console.log("VUAN_DEBUG: Hero references updated (robust v2.3)");
          // Force an immediate update
          if (this.handler) this.handler();
        }
      }
    };
  }

  // Initialize and update references
  window.__VUAN_HERO_SCROLL__.init();
  const heroContainer = document.querySelector('.hero-scroll-container');
  if (heroContainer) {
    window.__VUAN_HERO_SCROLL__.update(heroContainer);
  }

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active')
    })
  }, { threshold: 0.1 })
  document.querySelectorAll('.reveal, .scroll-reveal').forEach(el => observer.observe(el))

  // Language toggle handler
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const newLang = e.target.dataset.lang
      if (newLang && newLang !== getLang()) {
        setLang(newLang)
        render()
      }
    })
  })

  // IntersectionObserver for video play/pause (performance optimization)
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target
      if (entry.isIntersecting) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, { threshold: 0.25 })
  document.querySelectorAll('video').forEach(v => videoObserver.observe(v))

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

  // Video Montage Touch/Mobile Interactivity
  const montageItems = document.querySelectorAll('.montage-item')
  if (montageItems.length > 0) {
    montageItems.forEach(item => {
      item.onclick = (e) => {
        // Toggle active class on tap
        const isActive = item.classList.contains('active')
        montageItems.forEach(el => el.classList.remove('active'))
        if (!isActive) item.classList.add('active')
      }
    })

    // Clear active state when clicking away
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.montage-item')) {
        montageItems.forEach(el => el.classList.remove('active'))
      }
    }, { passive: true })
  }

  // Store Effects
  if (currentView.startsWith(VIEWS.STORE)) {
    initStoreEffects()
  }
}
