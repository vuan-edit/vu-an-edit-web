<?php get_header(); ?>

<main class="site-content">
  <?php while (have_posts()) : the_post(); ?>
    
    <div class="single-post-header">
      <?php 
        $categories = get_the_category();
        if ($categories) : 
      ?>
        <span class="post-category"><?php echo esc_html($categories[0]->name); ?></span>
      <?php endif; ?>
      
      <h1><?php the_title(); ?></h1>
      
      <p class="post-date">
        <?php echo get_the_date('d F, Y'); ?> &middot; 
        <?php echo ceil(str_word_count(strip_tags(get_the_content())) / 200); ?> phút đọc
      </p>
    </div>

    <?php if (has_post_thumbnail()) : ?>
      <div class="single-post-featured">
        <?php the_post_thumbnail('large'); ?>
      </div>
    <?php endif; ?>

    <article class="post-content">
      <?php the_content(); ?>
    </article>

    <!-- Post Navigation -->
    <div style="max-width:740px; margin:0 auto; padding:2rem 0; border-top:1px solid var(--color-border); display:flex; justify-content:space-between; gap:2rem;">
      <div>
        <?php 
          $prev = get_previous_post();
          if ($prev) : 
        ?>
          <span style="font-size:0.7rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-subtle); display:block; margin-bottom:0.5rem;">&larr; Bài trước</span>
          <a href="<?php echo get_permalink($prev); ?>" style="font-weight:700; font-size:0.95rem; color:var(--color-text);">
            <?php echo get_the_title($prev); ?>
          </a>
        <?php endif; ?>
      </div>
      <div style="text-align:right;">
        <?php 
          $next = get_next_post();
          if ($next) : 
        ?>
          <span style="font-size:0.7rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-subtle); display:block; margin-bottom:0.5rem;">Bài tiếp &rarr;</span>
          <a href="<?php echo get_permalink($next); ?>" style="font-weight:700; font-size:0.95rem; color:var(--color-text);">
            <?php echo get_the_title($next); ?>
          </a>
        <?php endif; ?>
      </div>
    </div>

    <?php if (comments_open() || get_comments_number()) : ?>
      <div class="comments-area">
        <?php comments_template(); ?>
      </div>
    <?php endif; ?>

  <?php endwhile; ?>
</main>

<?php get_footer(); ?>
