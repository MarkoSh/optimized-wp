<?php

add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

add_theme_support( 'html5' );
add_theme_support( 'woocommerce' );
add_theme_support( 'title-tag' );
add_theme_support( 'menus' );
add_theme_support( 'wc-product-gallery-lightbox' );

add_action( 'after_setup_theme', function() {
	register_nav_menus( array(
		'primary' 		=> 'Первичное',
		'secondary'		=> 'Вторичное',
		'tertiary'		=> 'Третичное'
	) );
} );

add_action( 'wp_head', 'add_ajax_url' );
function add_ajax_url() {
	?>
	<script>
		var ajax_url = '<?php echo admin_url('admin-ajax.php'); ?>',
			template_url = '<?php echo get_template_directory_uri(); ?>/';
	</script>
	<?php
}

add_filter( 'show_admin_bar', '__return_false' ); // Убираем панелькеу из фронта для всего на свете, ненавижу ее во фронте

if ( wp_doing_ajax() ) {

	// Опишите экшены аякса здесь
	add_action('wp_ajax_myaction', 'ajax_handler');
	add_action('wp_ajax_nopriv_myaction', 'ajax_handler');

}

/*
 *
 * AJAX Обработчик
 * 
 */
function ajax_handler() {
	if ( isset( $_POST[ 'captcha' ] ) && $_POST[ 'captcha' ] > 120000 && $_POST[ 'captcha' ] <= 500000 ) {
		// Если прошли проверку простой капчи
		
		wp_send_json_success();
	}
	wp_send_json_error();
}