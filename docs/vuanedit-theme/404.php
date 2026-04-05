<?php get_header(); ?>

<main class="site-content">
  <div class="single-post-header">
    <h1>404 — Không tìm thấy</h1>
    <p class="post-date">Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.</p>
  </div>
  
  <div class="container" style="text-align:center; padding:4rem 0;">
    <a href="<?php echo esc_url(home_url('/')); ?>" style="display:inline-block; background:var(--color-accent); color:#000; padding:0.85rem 2rem; border-radius:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; text-decoration:none;">
      &larr; Về Blog
    </a>
  </div>
</main>

<?php get_footer(); ?>
