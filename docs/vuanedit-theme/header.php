<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
  <div class="header-inner">
    <a href="https://vuanedit.online/" class="site-logo">
      <img src="https://vuanedit.online/logo_brand.svg" alt="Vũ An Edit" height="36">
    </a>
    
    <button class="menu-toggle" aria-label="Menu">
      <span></span><span></span>
    </button>
    
    <nav class="main-nav">
      <a href="https://vuanedit.online/">Trang chủ</a>
      <a href="https://vuanedit.online/projects/">Dự án</a>
      <a href="https://vuanedit.online/courses/">Khóa học</a>
      <a href="https://vuanedit.online/store/">Cửa hàng</a>
      <a href="https://vuanedit.online/blog/" class="current">Blog</a>
      <a href="https://vuanedit.online/contact/">Liên hệ</a>
    </nav>
  </div>
</header>

<script>
// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      toggle.classList.toggle('active');
    });
  }
});
</script>
