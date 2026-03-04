import './style.css'

// --- CONSTANTS ---
const APP_DIR = '/src'
const VIEWS = {
  HOME: 'home',
  PROJECTS: 'projects'
}

// --- STATE ---
let currentView = VIEWS.HOME

// --- HELPERS ---
function getTemplate(view) {
  const commonHeader = `
    <div class="cursor-dot"></div>
    <div class="cursor-outline"></div>

    <header class="container reveal" style="padding: 2rem 2rem; display: flex; justify-content: space-between; align-items: baseline;">
      <div class="logo premium-text" style="font-size: 1.5rem; cursor: pointer;">Vũ An</div>
      <nav style="display: flex; gap: 2rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">
        <a href="#projects">Dự án</a>
        <a href="#course">Khóa học</a>
        <a href="#contact">Liên hệ</a>
      </nav>
    </header>
  `

  const footer = `
    <footer class="container" style="padding: 4rem 2rem; text-align: center; border-top: 1px solid #111;">
      <div class="premium-text" style="font-size: 0.8rem; color: var(--color-subtle);">© 2026 Vũ An. Thủ công & Tỉ mỉ.</div>
    </footer>
  `

  if (view === VIEWS.PROJECTS) {
    return `
      ${commonHeader}
      <main>
        <section class="container">
          <div class="reveal" style="margin-top: 5vh; margin-bottom: 5vh;">
            <h1 style="font-size: clamp(3rem, 10vw, 8rem); line-height: 0.9;">
              Hợp tác &<br>
              <span class="highlight">Sáng tạo</span>
            </h1>
            <p style="max-width: 600px; margin-top: 2rem; font-size: 1.1rem; color: var(--color-subtle);">
              Khám phá sự thay đổi ngoạn mục qua từng dự án. Từ những khung hình thô sơ đến tác phẩm nghệ thuật hoàn chỉnh.
            </p>
          </div>

          <div class="grid" style="display: grid; grid-template-columns: 1fr; gap: 6rem; margin-top: 4rem;">
            <!-- Project 1 -->
            <div class="project-item reveal">
              <div class="comparison-container" data-project="1">
                <img src="https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=2000" class="comparison-image image-before" alt="Before">
                <div class="image-after" style="background-image: url('https://images.unsplash.com/photo-1542204113-e93526276ef1?auto=format&fit=crop&q=80&w=2000'); background-size: cover; background-position: center; position: absolute; top:0; left:0; width:100%; height:100%;"></div>
                <div class="comparison-handle"></div>
                <div class="label-before">Gốc</div>
                <div class="label-after">Đã Edit</div>
              </div>
              <div class="project-meta">
                <div>
                  <h3 class="project-title highlight">Urban Cyberpunk Mood</h3>
                  <div class="project-collab">Collaboration with @AestheticVibes</div>
                </div>
                <div style="font-size: 0.8rem; color: var(--color-subtle);">Color Grading / Sound Design</div>
              </div>
            </div>

            <!-- Project 2 -->
            <div class="project-item reveal">
              <div class="comparison-container" data-project="2">
                <img src="https://images.unsplash.com/photo-1492691523567-673e0165c36b?auto=format&fit=crop&q=80&w=2000" class="comparison-image image-before" alt="Before">
                <div class="image-after" style="background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000'); background-size: cover; background-position: center; position: absolute; top:0; left:0; width:100%; height:100%;"></div>
                <div class="comparison-handle"></div>
                <div class="label-before">Gốc</div>
                <div class="label-after">Đã Edit</div>
              </div>
              <div class="project-meta">
                <div>
                  <h3 class="project-title highlight">Cinematic Nature Narrative</h3>
                  <div class="project-collab">Collaboration with @NatureDoc</div>
                </div>
                <div style="font-size: 0.8rem; color: var(--color-subtle);">Visual Storytelling / VFX</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      ${footer}
    `
  }

  // Home view
  return `
    ${commonHeader}
    <main>
      <section id="hero" class="container">
        <div class="reveal" style="margin-top: 15vh;">
          <h1 style="font-size: clamp(4rem, 15vw, 12rem); line-height: 0.9; margin-left: -0.05em;">
            Kể chuyện<br>
            <span class="highlight">Bằng Dữ Liệu</span>
          </h1>
          <p style="max-width: 600px; margin-top: 2rem; font-size: 1.2rem; line-height: 1.5; color: var(--color-subtle);">
            Tầm nhìn nghệ thuật kết hợp với tư duy phân tích. Tôi biến những thước phim thô thành những câu chuyện hình ảnh đầy mê hoặc và khóa học chuyên sâu về hậu kỳ.
          </p>
        </div>
      </section>

      <section id="work" class="container">
        <h2 class="premium-text reveal" style="font-size: 0.8rem; margin-bottom: 2rem; border-bottom: 1px solid #333; padding-bottom: 1rem; color: var(--color-subtle);">Thị giác & Dữ liệu</h2>
        
        <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
          <div class="card glass reveal" style="padding: 2rem; aspect-ratio: 16/9; display: flex; flex-direction: column; justify-content: space-between;">
             <div style="font-size: 0.7rem; color: var(--color-accent);">[ 01 ] TIMELINE DYNAMICS</div>
             <div class="viz-placeholder" style="height: 60px; display: flex; align-items: flex-end; gap: 4px;">
                <div style="background: var(--color-accent); width: 15%; height: 40%;"></div>
                <div style="background: var(--color-accent); width: 15%; height: 70%;"></div>
                <div style="background: var(--color-accent); width: 15%; height: 50%;"></div>
                <div style="background: var(--color-accent); width: 15%; height: 90%;"></div>
                <div style="background: var(--color-accent); width: 15%; height: 30%;"></div>
             </div>
             <h3 style="font-size: 1.5rem;">Cấu trúc dòng thời gian</h3>
          </div>

          <div class="card glass reveal" style="padding: 2rem; aspect-ratio: 16/9; display: flex; flex-direction: column; justify-content: space-between;">
             <div style="font-size: 0.7rem; color: var(--color-accent);">[ 02 ] COLOR ANALYTICS</div>
             <div class="viz-placeholder" style="display: flex; gap: 10px;">
                <div style="background: #B4FD00; width: 30px; height: 30px; border-radius: 50%;"></div>
                <div style="background: #fff; width: 30px; height: 30px; border-radius: 50%; opacity: 0.5;"></div>
                <div style="background: #555; width: 30px; height: 30px; border-radius: 50%;"></div>
             </div>
             <h3 style="font-size: 1.5rem;">Ngôn ngữ màu sắc</h3>
          </div>
        </div>
      </section>

      <section id="course" style="background: #0a0a0a; border-top: 1px solid #111; border-bottom: 1px solid #111;">
        <div class="container">
           <div class="reveal" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 4rem; align-items: center;">
              <div>
                 <h2 class="highlight" style="font-size: 3rem; margin-bottom: 1.5rem;">Khóa Học<br>Mastering Edit</h2>
                 <p style="color: var(--color-subtle); margin-bottom: 2rem;">Học cách tư duy như một nhà làm phim chuyên nghiệp. Không chỉ là công cụ, mà là nghệ thuật sắp đặt cảm xúc.</p>
                 <ul style="list-style: none; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; margin-bottom: 2rem;">
                    <li style="margin-bottom: 1rem; border-left: 2px solid var(--color-accent); padding-left: 1rem;">Tư duy dựng phim hiện đại</li>
                    <li style="margin-bottom: 1rem; border-left: 2px solid var(--color-accent); padding-left: 1rem;">Kỹ thuật Data Visualization</li>
                    <li style="margin-bottom: 1rem; border-left: 2px solid var(--color-accent); padding-left: 1rem;">Quy trình sản xuất A24 Style</li>
                 </ul>
                 <a href="#" style="background: var(--color-accent); color: #000; padding: 1rem 2rem; display: inline-block; font-weight: 900; text-transform: uppercase;">Đăng ký ngay</a>
              </div>
              <div class="glass" style="padding: 1rem;">
                 <div style="aspect-ratio: 4/5; background: #111; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <span style="color: #333; font-size: 5rem; font-weight: 900;">A24</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <section id="contact" class="container" style="padding: 15vh 2rem;">
         <h2 class="premium-text reveal" style="font-size: 0.8rem; color: var(--color-subtle); margin-bottom: 2rem;">Bắt đầu dự án</h2>
         <div class="reveal">
            <a href="mailto:hello@vuan.com" class="contact-link">hello@vuan.com</a>
            <a href="#" class="contact-link">Facebook</a>
            <a href="#" class="contact-link">Instagram</a>
         </div>
      </section>
    </main>
    ${footer}
  `
}

// --- LOGIC ---
function render() {
  const hash = window.location.hash
  currentView = hash === '#projects' ? VIEWS.PROJECTS : VIEWS.HOME

  const app = document.querySelector('#app')
  app.classList.add('fade-out')

  setTimeout(() => {
    app.innerHTML = getTemplate(currentView)
    initEffects()
    app.classList.remove('fade-out')
    window.scrollTo(0, 0)
  }, 500)
}

function initEffects() {
  const dot = document.querySelector('.cursor-dot')
  const outline = document.querySelector('.cursor-outline')

  // Cursor
  window.onmousemove = (e) => {
    const posX = e.clientX
    const posY = e.clientY
    dot.style.transform = `translate(${posX - 4}px, ${posY - 4}px)`
    outline.animate({
      transform: `translate(${posX - 20}px, ${posY - 20}px)`
    }, { duration: 500, fill: 'forwards' })
  }

  // Scroll Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active')
    })
  }, { threshold: 0.1 })
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

  // Hover
  document.querySelectorAll('a, button, .logo').forEach(el => {
    el.onclick = (e) => {
      if (el.classList.contains('logo')) {
        window.location.hash = '#'
      }
    }
    el.onmouseenter = () => {
      outline.style.transform = 'scale(1.5)'
      outline.style.backgroundColor = 'rgba(180, 253, 0, 0.1)'
    }
    el.onmouseleave = () => {
      outline.style.transform = 'scale(1)'
      outline.style.backgroundColor = 'transparent'
    }
  })

  // Comparison Slider Logic
  document.querySelectorAll('.comparison-container').forEach(container => {
    const afterImg = container.querySelector('.image-after')
    const handle = container.querySelector('.comparison-handle')

    const updateSlider = (e) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX || (e.touches && e.touches[0].clientX) - rect.left
      let position = ((e.clientX - rect.left) / rect.width) * 100
      if (position < 0) position = 0
      if (position > 100) position = 100

      afterImg.style.clipPath = `inset(0 0 0 ${position}%)`
      handle.style.left = `${position}%`
    }

    container.onmousemove = updateSlider
    container.ontouchmove = updateSlider
  })
}

// --- INIT ---
window.addEventListener('hashchange', render)
render()
