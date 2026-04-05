<?php get_header(); ?>

<main class="site-content">
  <?php while (have_posts()) : the_post(); ?>
    <div class="single-post-header">
      <h1><?php the_title(); ?></h1>
    </div>
    <article class="post-content">
      <?php the_content(); ?>
    </article>
  <?php endwhile; ?>
</main>

<?php get_footer(); ?>
