<?php get_header(); ?>

<style>
/* CSS-only stagger animation — no JS dependency */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.post-card {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}
.post-card:nth-child(1) { animation-delay: 0.1s; }
.post-card:nth-child(2) { animation-delay: 0.2s; }
.post-card:nth-child(3) { animation-delay: 0.3s; }
.post-card:nth-child(4) { animation-delay: 0.4s; }
.post-card:nth-child(5) { animation-delay: 0.5s; }
.post-card:nth-child(6) { animation-delay: 0.6s; }
.post-card:nth-child(n+7) { animation-delay: 0.7s; }
</style>

<main class="site-content">
  
  <div class="blog-hero">
    <div class="container">
      <h1>Kiến thức<br>& Chia sẻ.</h1>
      <p class="subtitle">Kiến thức thực chiến về edit video, After Effects, GEOLayers 3, data visualization và chiến lược tạo content viral triệu view.</p>
    </div>
  </div>

  <div class="container">
    <?php if (have_posts()) : ?>
      <div class="posts-grid">
        <?php while (have_posts()) : the_post(); ?>
          <article class="post-card">
            <a href="<?php the_permalink(); ?>" class="post-card-thumbnail <?php echo has_post_thumbnail() ? '' : 'no-thumb'; ?>">
              <?php if (has_post_thumbnail()) : ?>
                <?php the_post_thumbnail('medium_large'); ?>
              <?php endif; ?>
            </a>
            <div class="post-card-body">
              <div class="post-card-meta">
                <?php 
                  $categories = get_the_category();
                  if ($categories) : 
                ?>
                  <span class="post-card-category"><?php echo esc_html($categories[0]->name); ?></span>
                <?php endif; ?>
                <span class="post-card-date"><?php echo get_the_date('d M, Y'); ?></span>
              </div>
              <h2 class="post-card-title">
                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
              </h2>
              <p class="post-card-excerpt"><?php echo get_the_excerpt(); ?></p>
              <a href="<?php the_permalink(); ?>" class="post-card-readmore">
                Đọc tiếp <span>&rarr;</span>
              </a>
            </div>
          </article>
        <?php endwhile; ?>
      </div>

      <div class="pagination">
        <?php
          the_posts_pagination(array(
            'mid_size'  => 2,
            'prev_text' => '&larr;',
            'next_text' => '&rarr;',
          ));
        ?>
      </div>

    <?php else : ?>
      <div style="text-align:center; padding:6rem 0;">
        <h2>Chưa có bài viết nào</h2>
        <p style="margin-top:1rem;">Hãy quay lại sau nhé!</p>
      </div>
    <?php endif; ?>
  </div>

</main>

<?php get_footer(); ?>
