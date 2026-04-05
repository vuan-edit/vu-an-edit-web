<?php
/**
 * Vũ An Edit Blog Theme - functions.php
 * Matching vuanedit.online design
 */

// Theme setup
function vuanedit_setup() {
    // Add title tag support
    add_theme_support('title-tag');
    
    // Featured images
    add_theme_support('post-thumbnails');
    set_post_thumbnail_size(800, 450, true);
    
    // HTML5 markup
    add_theme_support('html5', array(
        'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
    ));
    
    // Custom logo
    add_theme_support('custom-logo', array(
        'height'      => 40,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    
    // Register navigation menu
    register_nav_menus(array(
        'primary' => 'Primary Menu',
        'footer'  => 'Footer Menu',
    ));
}
add_action('after_setup_theme', 'vuanedit_setup');

// Enqueue styles & fonts
function vuanedit_scripts() {
    // Google Fonts - Inter
    wp_enqueue_style(
        'google-fonts-inter',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
        array(),
        null
    );
    
    // Theme stylesheet
    wp_enqueue_style('vuanedit-style', get_stylesheet_uri(), array('google-fonts-inter'), '1.0.0');
    
    // Reveal animation script
    wp_enqueue_script('vuanedit-reveal', get_template_directory_uri() . '/js/reveal.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'vuanedit_scripts');

// Custom excerpt length
function vuanedit_excerpt_length($length) {
    return 25;
}
add_filter('excerpt_length', 'vuanedit_excerpt_length');

// Custom excerpt "more" text
function vuanedit_excerpt_more($more) {
    return '…';
}
add_filter('excerpt_more', 'vuanedit_excerpt_more');

// Register sidebar/widget area
function vuanedit_widgets() {
    register_sidebar(array(
        'name'          => 'Blog Sidebar',
        'id'            => 'blog-sidebar',
        'before_widget' => '<div class="widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'vuanedit_widgets');

// Remove unnecessary WordPress meta
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
