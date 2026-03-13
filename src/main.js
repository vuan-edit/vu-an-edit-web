import './style.css'
import { getStoreTemplate, initStoreEffects } from './store/store-main.js'

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
        <a href="#" data-nav="">Trang chủ</a>
        <a href="#projects">Dự án</a>
        <a href="#course-page">Khóa học</a>
        <a href="#store">Cửa hàng</a>
        <a href="#blog">Blog</a>
        <a href="#contact-page">Liên hệ</a>
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

// --- VIEWS ---
function getHomeTemplate() {
  return `
    ${getHeader()}
    <main>

      <!-- HERO: Grid mosaic inspired by reference image -->
      <div class="hero-section">
        <!-- Row 1 - 4 black cells -->
        <div class="hero-cell"></div>
        <div class="hero-cell"></div>
        <div class="hero-cell"></div>
        <div class="hero-cell" style="border-right:none;"></div>
        <!-- Row 2 - text left, 2 black right -->
        <div class="hero-text-cell reveal">
          <h1 class="hover-word">${wrapWords('Làm chủ hình ảnh,')}<br>${wrapWords('kể chuyện cuốn hút.')}</h1>
        </div>
        <div class="hero-cell" style="border-left:none;"></div>
        <div class="hero-cell"></div>
        <div class="hero-cell" style="border-right:none;"></div>
      </div>

      <!-- ABOUT -->
      <section class="about-section">
        <div class="container">
          <div class="about-inner">
            <div class="about-text reveal">
              <h2 class="hover-word">${wrapWords('Chào bạn, mình là Vũ An.')}</h2>
              <p style="margin-top:1.5rem; line-height:1.8;">${hw('Trong 4 năm làm content, mình đã xây dựng hai kênh TikTok "Tình Báo Chứng Khoán" và "Người Quan Sát" đạt hàng trăm triệu lượt xem. Bí mật chính là cách biến dữ liệu khô khan thành video cuốn hút qua bố cục và infographic.')}</p>
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
        <!-- Project 1 -->
        <div class="project-item reveal">
          <div class="comparison-container" data-project="1">
            <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000" class="comparison-image image-before" alt="Before">
            <div class="image-after" style="background-image:url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000'); background-size:cover; background-position:center; position:absolute; top:0; left:0; width:100%; height:100%;"></div>
            <div class="comparison-handle" style="left:50%;"></div>
            <div class="label-before">Gốc</div>
            <div class="label-after">Đã Edit</div>
          </div>
          <div class="project-meta">
            <div>
              <h3 class="project-title hover-word">${wrapWords('Urban Cyberpunk Mood')}</h3>
              <div class="project-collab">Collaboration with @AestheticVibes</div>
            </div>
            <div style="font-size:0.8rem;color:#555;font-weight:700;text-transform:uppercase;">Color Grading / Sound Design</div>
          </div>
        </div>

        <!-- Project 2 -->
        <div class="project-item reveal">
          <div class="comparison-container" data-project="2">
            <img src="https://images.unsplash.com/photo-1492691523567-673e0165c36b?auto=format&fit=crop&q=80&w=2000" class="comparison-image image-before" alt="Before">
            <div class="image-after" style="background-image:url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000'); background-size:cover; background-position:center; position:absolute; top:0; left:0; width:100%; height:100%;"></div>
            <div class="comparison-handle" style="left:50%;"></div>
            <div class="label-before">Gốc</div>
            <div class="label-after">Đã Edit</div>
          </div>
          <div class="project-meta">
            <div>
              <h3 class="project-title hover-word">${wrapWords('Cinematic Nature Narrative')}</h3>
              <div class="project-collab">Collaboration with @NatureDoc</div>
            </div>
            <div style="font-size:0.8rem;color:#555;font-weight:700;text-transform:uppercase;">Visual Storytelling / VFX</div>
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
  const hash = window.location.hash
  if (hash === '#projects') {
    currentView = VIEWS.PROJECTS
  } else if (hash === '#course-page') {
    currentView = VIEWS.COURSE
  } else if (hash === '#contact-page') {
    currentView = VIEWS.CONTACT
  } else if (hash.startsWith('#store')) {
    currentView = hash.substring(1) || VIEWS.STORE
  } else {
    currentView = VIEWS.HOME
  }

  const app = document.querySelector('#app')
  app.classList.add('fade-out')

  setTimeout(() => {
    app.innerHTML = getTemplate(currentView)
    initEffects()
    app.classList.remove('fade-out')
    window.scrollTo(0, 0)
  }, 400)
}
window.render = render

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
    el.onclick = () => {
      window.location.hash = ''
      if (currentView !== VIEWS.HOME) render()
      // Also close mobile menu on logo click
      if (menuBtn && nav) {
        menuBtn.classList.remove('active')
        nav.classList.remove('active')
      }
    }
  })

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active')
    })
  }, { threshold: 0.08 })
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

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
window.addEventListener('hashchange', render)
render()
