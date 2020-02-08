<?php

// Выпиливаем шлакоблоки

// REMOVE EMOJI ICONS
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

function remove_styles() { 
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wc-block-style' );
	wp_dequeue_style( 'font-awesome-5' );
	wp_dequeue_style( 'font-awesome-4-shims' );
	wp_dequeue_style( 'themeisle-block_styles' );
	wp_dequeue_style( 'woocommerce-layout' );
	wp_dequeue_style( 'woocommerce-smallscreen' );
	wp_dequeue_style( 'woocommerce-general' );
	wp_dequeue_style( 'woocommerce-inline' );
}
add_action( 'wp_enqueue_scripts', 'remove_styles', 100 );


add_action( 'wp_loaded', function() {
	remove_action( 'wp_head', 'wc_gallery_noscript' );
} );

// Выпилено!

add_theme_support( 'title-tag' );
add_theme_support( 'post-thumbnails' );
add_theme_support( 'post-formats' );
add_theme_support( 'html5' );
add_theme_support( 'custom-logo' );
add_theme_support( 'woocommerce' );

add_action( 'wp_ajax_my_action', 'my_action' );
add_action( 'wp_ajax_nopriv_my_action', 'my_action' );

?>