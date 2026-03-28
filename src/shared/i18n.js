// ============================================================
// i18n — Internationalization Module
// Default: Vietnamese (vi), Optional: English (en)
// ============================================================

const LANG_KEY = 'vuanedit_lang'

export function getLang() {
  return localStorage.getItem(LANG_KEY) || 'vi'
}

export function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang)
}

export function t(key) {
  const lang = getLang()
  const dict = translations[lang] || translations.vi
  return dict[key] || translations.vi[key] || key
}

// ============================================================
// TRANSLATIONS
// ============================================================
export const translations = {
  vi: {
    // --- NAV ---
    nav_home: 'Trang chủ',
    nav_projects: 'Dự án',
    nav_courses: 'Khóa học',
    nav_store: 'Cửa hàng',
    nav_blog: 'Blog',
    nav_contact: 'Liên hệ',
    footer_copy: '© 2026 Vũ An. Thủ công &amp; Tỉ mỉ.',

    // --- HOME ---
    hero_line1: 'Làm chủ hình ảnh,',
    hero_line2: 'kể chuyện cuốn hút.',
    about_title: 'Chào bạn, mình là Vũ An.',
    about_desc: 'Trong 4 năm làm content, mình đã xây dựng hai kênh TikTok "Tình Báo Chứng Khoán" và "Người Quan Sát" đạt hàng trăm triệu lượt xem. Bí mật chính là cách biến dữ liệu khô khan thành video cuốn hút qua bố cục và infographic.',
    about_project01: 'Dự án 01',
    about_project02: 'Dự án 02',
    data_title: 'Dữ liệu cũng có những câu chuyện.',
    data_desc: 'Đó là lúc tôi khám phá ra sức mạnh của việc trực quan hóa thông tin — từ làm bản đồ chuyển động, thiết kế infographic, đến tư duy sắp xếp dữ liệu để một câu chuyện giữ chân người xem từ đầu đến cuối.',
    promo_line1: 'Từ con số 0 đến',
    promo_line2: 'video triệu view',
    promo_desc: 'Học trọn bộ kỹ năng: After Effects nền tảng, GEOLayers 3 chuyên sâu và Tư duy viral content. Biến dữ liệu khô khan thành những câu chuyện bản đồ chuyển động đầy cuốn hút.',
    promo_cta: 'Khám phá khóa học',
    practice_title: 'Học thực chiến, làm ra sản phẩm thực tế.',
    practice_desc: 'Nếu bạn muốn học thực hành về video, kỹ thuật, phân tích chuyên nghiệp và sản xuất nội dung từ thực tế, không lan man, thì khóa học này sẽ là thứ bạn cần.',
    contact_start: 'Bắt đầu dự án',

    // --- PROJECTS ---
    projects_title1: 'Hợp tác &',
    projects_title2: 'Sáng tạo',
    projects_desc: 'Khám phá sự thay đổi ngoạn mục qua từng dự án. Từ những khung hình thô sơ đến tác phẩm nghệ thuật hoàn chỉnh.',

    // --- COURSES ---
    courses_title1: 'Làm chủ',
    courses_title2: 'Kể chuyện bằng Dữ liệu',
    courses_desc: 'Khóa học 10 buổi (15 giờ) – Từ con số 0 đến làm chủ quy trình sản xuất video triệu view theo phong cách "Người Quan Sát" và "Tình Báo Thị Trường".',
    courses_cta: 'Sẵn sàng để bắt đầu hành trình?',
    courses_cta_btn: 'Nhận tư vấn ngay',

    // Phase titles
    course_phase1_title: 'Phase 01: AE Cấp tốc (Nền tảng dựng video)',
    course_phase2_title: 'Phase 02: GEOLayers 3 (Video bản đồ chuyên sâu)',
    course_phase3_title: 'Phase 03: Content Viral (Tư duy & Tối ưu)',

    // Sessions
    course_session1_name: 'Buổi 1: AE nền tảng + Moodboard',
    course_session1_desc: 'Làm quen giao diện, timeline, layer, keyframe. Bố cục 9:16 chuẩn MXH. Hướng dẫn tạo moodboard cá nhân (Canva/Milanote). Thực hành dựng 1 đoạn 10-15s cơ bản.',
    course_session2_name: 'Buổi 2: Motion + Sound mixing cơ bản',
    course_session2_desc: 'Kỹ thuật zoom, pan, shake, blur, fade. Cách sync chuyển cảnh với beat nhạc. Tổ chức track âm thanh (VO, nhạc nền, SFX). Thực hành dựng đoạn 20-30s.',
    course_session3_name: 'Buổi 3: Template Storytelling + SFX',
    course_session3_desc: 'Cấu trúc 30-60s: Hook, Body, Outro. Xây dựng project template tối ưu. Làm chủ SFX (whoosh, pop, click). Thực hành chỉnh video 20-30s với nhịp ổn.',
    course_session4_name: 'Buổi 4: Bản đồ cơ bản',
    course_session4_desc: 'Cài đặt plugin GEOLayers, nguồn map, xử lý lỗi. Tạo Mapcomp, chọn style map, camera cơ bản. Thực hành tạo comp bản đồ Việt Nam/tỉnh thành.',
    course_session5_name: 'Buổi 5: Khoanh vùng, Route & Label',
    course_session5_desc: 'Vẽ vùng dự án, tạo đường đi (route) từ sân bay/trung tâm. Cách đặt label, chú giải chuyên nghiệp. Timing chuyển động map kết hợp SFX.',
    course_session6_name: 'Buổi 6: Camera Cinematic & 3D Terrain',
    course_session6_desc: 'Điều khiển Orbit, dolly, tilt. Tận dụng 3D terrain, bóng đổ, vignette. Color grade bản đồ để trông "cinematic" như phim tài liệu.',
    course_session7_name: 'Buổi 7: Ghép AE + Text & Infographic',
    course_session7_desc: 'Đưa Mapcomp vào AE tổng. Thêm text, icon, infographic (dòng vốn, cung-cầu). Cách chia giọng VO cho kịch bản BĐS/thị trường 30-60s.',
    course_session8_name: 'Buổi 8: Hoàn thiện sản phẩm & Checklist',
    course_session8_desc: 'Checklist pacing (10-12 ý mỗi 3s), âm thanh (VO rõ, nhạc không lấn). Chuẩn export TikTok/Reels. Xuất video bản đồ hoàn chỉnh được review 1-1.',
    course_session9_name: 'Buổi 9: Hook, Kịch bản & Moodboard âm thanh',
    course_session9_desc: 'Phân tích cấu trúc video viral. 5-7 mẫu hook (mistake, curiosity gap...). Viết kịch bản cho chủ đề BĐS & Tình báo thị trường. Chọn nhạc nền signature.',
    course_session10_name: 'Buổi 10: Quy trình sản xuất & Tối ưu kênh',
    course_session10_desc: 'Cách bắt trend, tối ưu hashtag, caption, thumbnail. Template kênh đồng bộ. Lập Content calendar cho 15-30 video. Quy trình tái sử dụng template.',

    // Pricing
    pricing_table_title: 'Bảng giá & Gói học',
    pricing_col_package: 'Gói học',
    pricing_col_sessions: 'Số buổi',
    pricing_col_format: 'Hình thức',
    pricing_col_price: 'Giá ưu đãi',
    pricing_package_ae_title: 'AE cấp tốc (Buổi 1-3)',
    pricing_package_ae_sessions: '3',
    pricing_package_ae_format: 'Nhóm online',
    pricing_package_ae_price: '590.000 VNĐ',
    pricing_package_geolayers_title: 'GEOLayers 3 (Buổi 4-8)',
    pricing_package_geolayers_sessions: '5',
    pricing_package_geolayers_format: 'Nhóm online',
    pricing_package_geolayers_price: '1.990.000 VNĐ',
    pricing_package_viral_title: 'Content Viral (Buổi 9-10)',
    pricing_package_viral_sessions: '2',
    pricing_package_viral_format: 'Nhóm online',
    pricing_package_viral_price: '890.000 VNĐ',
    pricing_package_tech_combo_title: 'Combo kỹ thuật (AE + GEOLayers)',
    pricing_package_tech_combo_sessions: '8',
    pricing_package_tech_combo_format: 'Nhóm online',
    pricing_package_tech_combo_price: '2.390.000 VNĐ',
    pricing_package_full_combo_title: 'Combo FULL (All in one)',
    pricing_package_full_combo_sessions: '10',
    pricing_package_full_combo_format: 'Nhóm online',
    pricing_package_full_combo_price: '3.190.000 VNĐ',
    pricing_package_1on1_title: 'Kèm 1-1 Online (Toàn bộ khóa)',
    pricing_package_1on1_sessions: '10',
    pricing_package_1on1_format: '1-1 online',
    pricing_package_1on1_price: '7.500.000 VNĐ',
    pricing_note: '* Các gói lẻ 1-1 vui lòng nhắn tin trực tiếp để nhận báo giá chi tiết.',

    // --- CONTACT ---
    contact_title1: 'Liên hệ &',
    contact_title2: 'Hợp tác',
    contact_desc: 'Bạn có ý tưởng? Hãy cùng nhau biến nó thành hiện thực. Tôi sẽ phản hồi sớm nhất có thể.',
    contact_email_label: 'Email',
    contact_social_label: 'Social',
    contact_name: 'Họ và tên',
    contact_name_ph: 'Ví dụ: Nguyễn Văn A',
    contact_phone: 'Số điện thoại (Zalo)',
    contact_phone_ph: '090 123 4567',
    contact_email: 'Email',
    contact_email_ph: 'name@example.com',
    contact_message: 'Lời nhắn',
    contact_message_ph: 'Chia sẻ về dự án của bạn...',
    contact_submit: 'Gửi yêu cầu',

    // --- BLOG ---
    blog_title1: 'Blog &',
    blog_title2: 'Chia sẻ Kinh nghiệm',
    blog_desc: 'Kiến thức thực chiến về edit video, After Effects, GEOLayers 3, và chiến lược content viral từ kinh nghiệm sản xuất hàng trăm video triệu view.',
    blog_readmore: 'Đọc tiếp',
    blog_cta_title: 'Muốn học sâu hơn?',
    blog_cta_desc: 'Khóa học thực chiến 10 buổi — từ After Effects đến viral content strategy.',
    blog_cta_btn: 'Xem khóa học',
    blog_all_posts: 'Tất cả bài viết',
    blog_related: 'Bài viết liên quan',
    blog_not_found: 'Bài viết không tồn tại',
    blog_not_found_desc: 'Bài viết bạn tìm không tồn tại hoặc đã bị xóa.',
    blog_back: '← Về trang Blog',
  },

  en: {
    // --- NAV ---
    nav_home: 'Home',
    nav_projects: 'Projects',
    nav_courses: 'Courses',
    nav_store: 'Store',
    nav_blog: 'Blog',
    nav_contact: 'Contact',
    footer_copy: '© 2026 Vũ An. Handcrafted &amp; Meticulous.',

    // --- HOME ---
    hero_line1: 'Master visuals,',
    hero_line2: 'tell captivating stories.',
    about_title: 'Hi, I\'m Vũ An.',
    about_desc: 'Over 4 years in content creation, I built two TikTok channels "Tình Báo Chứng Khoán" and "Người Quan Sát" achieving hundreds of millions of views. The secret is transforming dry data into captivating videos through composition and infographics.',
    about_project01: 'Project 01',
    about_project02: 'Project 02',
    data_title: 'Data also tells stories.',
    data_desc: 'That\'s when I discovered the power of data visualization — from creating motion maps, designing infographics, to organizing data so a story keeps viewers engaged from start to finish.',
    promo_line1: 'From zero to',
    promo_line2: 'million-view videos',
    promo_desc: 'Master the complete skill set: After Effects fundamentals, advanced GEOLayers 3, and viral content strategy. Transform dry data into captivating motion map stories.',
    promo_cta: 'Explore the course',
    practice_title: 'Learn by doing, create real products.',
    practice_desc: 'If you want to learn hands-on video production, professional techniques, analysis, and content creation from real experience without filler, this course is exactly what you need.',
    contact_start: 'Start a project',

    // --- PROJECTS ---
    projects_title1: 'Collaboration &',
    projects_title2: 'Creativity',
    projects_desc: 'Discover the spectacular transformation across each project. From raw footage to polished art pieces.',

    // --- COURSES ---
    courses_title1: 'Master',
    courses_title2: 'Data Storytelling',
    courses_desc: '10-session course (15 hours) — From zero to mastering the production workflow for million-view videos in the style of "Người Quan Sát" and "Tình Báo Thị Trường".',
    courses_cta: 'Ready to start your journey?',
    courses_cta_btn: 'Get consultation now',

    // Phase titles
    course_phase1_title: 'Phase 01: AE Crash Course (Video Foundation)',
    course_phase2_title: 'Phase 02: GEOLayers 3 (Advanced Map Videos)',
    course_phase3_title: 'Phase 03: Viral Content (Strategy & Optimization)',

    // Sessions
    course_session1_name: 'Session 1: AE Basics + Moodboard',
    course_session1_desc: 'Interface, timeline, layers, keyframes. 9:16 layout for social media. Creating a personal moodboard (Canva/Milanote). Practice building a basic 10-15s clip.',
    course_session2_name: 'Session 2: Motion + Basic Sound Mixing',
    course_session2_desc: 'Zoom, pan, shake, blur, fade techniques. Syncing transitions with music beats. Organizing audio tracks (VO, BGM, SFX). Practice building a 20-30s clip.',
    course_session3_name: 'Session 3: Template Storytelling + SFX',
    course_session3_desc: '30-60s structure: Hook, Body, Outro. Building optimized project templates. Mastering SFX (whoosh, pop, click). Practice editing 20-30s clips with steady rhythm.',
    course_session4_name: 'Session 4: Basic Maps',
    course_session4_desc: 'Installing GEOLayers plugin, map sources, troubleshooting. Creating Mapcomp, map style selection, basic camera. Practice creating Vietnam/province map comps.',
    course_session5_name: 'Session 5: Zones, Routes & Labels',
    course_session5_desc: 'Drawing project zones, creating routes from airports/centers. Professional labeling and annotations. Map motion timing combined with SFX.',
    course_session6_name: 'Session 6: Cinematic Camera & 3D Terrain',
    course_session6_desc: 'Orbit, dolly, tilt controls. Leveraging 3D terrain, shadows, vignette. Color grading maps for a cinematic documentary look.',
    course_session7_name: 'Session 7: AE Integration + Text & Infographics',
    course_session7_desc: 'Importing Mapcomp into main AE. Adding text, icons, infographics (capital flow, supply-demand). VO scripting for real estate/market 30-60s videos.',
    course_session8_name: 'Session 8: Final Product & Checklist',
    course_session8_desc: 'Pacing checklist (10-12 points per 3s), audio (clear VO, balanced music). TikTok/Reels export standards. Complete map video with 1-on-1 review.',
    course_session9_name: 'Session 9: Hook, Script & Audio Moodboard',
    course_session9_desc: 'Analyzing viral video structures. 5-7 hook templates (mistake, curiosity gap...). Scripting for real estate & market intelligence. Choosing signature BGM.',
    course_session10_name: 'Session 10: Production Workflow & Channel Optimization',
    course_session10_desc: 'Trend catching, hashtag/caption/thumbnail optimization. Consistent channel templates. Building a 15-30 video content calendar. Template reuse workflow.',

    // Pricing
    pricing_table_title: 'Pricing & Packages',
    pricing_col_package: 'Package',
    pricing_col_sessions: 'Sessions',
    pricing_col_format: 'Format',
    pricing_col_price: 'Price',
    pricing_package_ae_title: 'AE Crash Course (Sessions 1-3)',
    pricing_package_ae_sessions: '3',
    pricing_package_ae_format: 'Group online',
    pricing_package_ae_price: '590,000 VNĐ',
    pricing_package_geolayers_title: 'GEOLayers 3 (Sessions 4-8)',
    pricing_package_geolayers_sessions: '5',
    pricing_package_geolayers_format: 'Group online',
    pricing_package_geolayers_price: '1,990,000 VNĐ',
    pricing_package_viral_title: 'Viral Content (Sessions 9-10)',
    pricing_package_viral_sessions: '2',
    pricing_package_viral_format: 'Group online',
    pricing_package_viral_price: '890,000 VNĐ',
    pricing_package_tech_combo_title: 'Tech Combo (AE + GEOLayers)',
    pricing_package_tech_combo_sessions: '8',
    pricing_package_tech_combo_format: 'Group online',
    pricing_package_tech_combo_price: '2,390,000 VNĐ',
    pricing_package_full_combo_title: 'FULL Combo (All in one)',
    pricing_package_full_combo_sessions: '10',
    pricing_package_full_combo_format: 'Group online',
    pricing_package_full_combo_price: '3,190,000 VNĐ',
    pricing_package_1on1_title: '1-on-1 Online (Full course)',
    pricing_package_1on1_sessions: '10',
    pricing_package_1on1_format: '1-on-1 online',
    pricing_package_1on1_price: '7,500,000 VNĐ',
    pricing_note: '* For individual 1-on-1 sessions, please message directly for detailed pricing.',

    // --- CONTACT ---
    contact_title1: 'Contact &',
    contact_title2: 'Collaborate',
    contact_desc: 'Got an idea? Let\'s bring it to life together. I\'ll respond as soon as possible.',
    contact_email_label: 'Email',
    contact_social_label: 'Social',
    contact_name: 'Full name',
    contact_name_ph: 'e.g. John Doe',
    contact_phone: 'Phone (Zalo)',
    contact_phone_ph: '090 123 4567',
    contact_email: 'Email',
    contact_email_ph: 'name@example.com',
    contact_message: 'Message',
    contact_message_ph: 'Tell me about your project...',
    contact_submit: 'Send request',

    // --- BLOG ---
    blog_title1: 'Blog &',
    blog_title2: 'Knowledge Sharing',
    blog_desc: 'Hands-on knowledge about video editing, After Effects, GEOLayers 3, and viral content strategy from producing hundreds of million-view videos.',
    blog_readmore: 'Read more',
    blog_cta_title: 'Want to learn more?',
    blog_cta_desc: '10-session hands-on course — from After Effects to viral content strategy.',
    blog_cta_btn: 'View courses',
    blog_all_posts: 'All posts',
    blog_related: 'Related posts',
    blog_not_found: 'Post not found',
    blog_not_found_desc: 'The post you\'re looking for doesn\'t exist or has been removed.',
    blog_back: '← Back to Blog',
  }
}
