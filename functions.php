<?php

add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

add_theme_support( 'html5' );
add_theme_support( 'woocommerce' );
add_theme_support( 'title-tag' );
add_theme_support( 'menus' );
add_theme_support( 'wc-product-gallery-lightbox' );

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
