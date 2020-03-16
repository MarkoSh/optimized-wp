<?php

// Выпиливаем шлакоблоки

// REMOVE EMOJI ICONS
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

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


// Register Custom Post Type
function custom_post_type() {

	$labels = array(
		'name'                  => _x( 'Вариации товаров', 'Post Type General Name', 'text_domain' ),
		'singular_name'         => _x( 'Вариация товара', 'Post Type Singular Name', 'text_domain' ),
		'menu_name'             => __( 'Вариации товаров', 'text_domain' ),
		'name_admin_bar'        => __( 'Вариация товара', 'text_domain' ),
		'archives'              => __( 'Архивы вариаций', 'text_domain' ),
		'attributes'            => __( 'Аттрибуты', 'text_domain' ),
		'parent_item_colon'     => __( 'Родительский товар:', 'text_domain' ),
		'all_items'             => __( 'Все вариации', 'text_domain' ),
		'add_new_item'          => __( 'Добавить вариацию', 'text_domain' ),
		'add_new'               => __( 'Добавить новую', 'text_domain' ),
		'new_item'              => __( 'Новая', 'text_domain' ),
		'edit_item'             => __( 'Редактировать', 'text_domain' ),
		'update_item'           => __( 'Обновить', 'text_domain' ),
		'view_item'             => __( 'Смотреть', 'text_domain' ),
		'view_items'            => __( 'Смотреть', 'text_domain' ),
		'search_items'          => __( 'Искать', 'text_domain' ),
		'not_found'             => __( 'Не найдено', 'text_domain' ),
		'not_found_in_trash'    => __( 'Не найдено в корзине', 'text_domain' ),
		'featured_image'        => __( 'Изображение', 'text_domain' ),
		'set_featured_image'    => __( 'Установить изображение', 'text_domain' ),
		'remove_featured_image' => __( 'Удалить изображение', 'text_domain' ),
		'use_featured_image'    => __( 'Использовать изображение', 'text_domain' ),
		'insert_into_item'      => __( 'Вставить в вариацию', 'text_domain' ),
		'uploaded_to_this_item' => __( 'Загруженные для вариации', 'text_domain' ),
		'items_list'            => __( 'Список', 'text_domain' ),
		'items_list_navigation' => __( 'Навигация', 'text_domain' ),
		'filter_items_list'     => __( 'Фильтровать', 'text_domain' ),
	);
	$args = array(
		'label'                 => __( 'Вариация товара', 'text_domain' ),
		'description'           => __( 'Вариация товара', 'text_domain' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
		'taxonomies'            => array( 'product' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'menu_icon'             => 'dashicons-admin-post',
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => false,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'page',
	);
	register_post_type( 'product_variation', $args );

}
add_action( 'init', 'custom_post_type', 100 );

function product_variation_metabox( $meta_boxes ) {
	$prefix = '';

	$meta_boxes[] = array(
		'id' => 'product_data',
		'title' => esc_html__( 'Данные товара', 'metabox-online-generator' ),
		'post_types' => array( 'product_variation' ),
		'context' => 'advanced',
		'priority' => 'default',
		'autosave' => 'true',
		'fields' => array(
			array(
				'id' => $prefix . 'parent',
				'type' => 'post',
				'name' => esc_html__( 'Родительский товар', 'metabox-online-generator' ),
				'post_type' => 'product',
				'field_type' => 'select',
				'parent' => 'true',
			),
			array(
				'id' => $prefix . '_regular_price',
				'type' => 'text',
				'name' => esc_html__( 'Цена', 'metabox-online-generator' ),
			),
			array(
				'id' => $prefix . '_sale_price',
				'type' => 'text',
				'name' => esc_html__( 'Цена распродажи', 'metabox-online-generator' ),
			),
			array(
				'id' => $prefix . '_sku',
				'type' => 'text',
				'name' => esc_html__( 'Артикул', 'metabox-online-generator' ),
			),
			array(
				'id' => $prefix . '_weight',
				'type' => 'text',
				'name' => esc_html__( 'Вес', 'metabox-online-generator' ),
			),
			array(
				'id' => $prefix . '_length',
				'type' => 'text',
				'name' => esc_html__( 'Длина', 'metabox-online-generator' ),
			),
			array(
				'id' => $prefix . '_width',
				'type' => 'text',
				'name' => esc_html__( 'Ширина', 'metabox-online-generator' ),
			),
			array(
				'id' => $prefix . '_height',
				'type' => 'text',
				'name' => esc_html__( 'Высота', 'metabox-online-generator' ),
			)
		),
	);

	$meta_boxes[] = array(
		'id' => 'product_data_1c',
		'title' => esc_html__( 'Данные 1c', 'metabox-online-generator' ),
		'post_types' => array( 'product', 'product_variation' ),
		'context' => 'advanced',
		'priority' => 'default',
		'autosave' => 'true',
		'fields' => array(
			array(
				'id' => $prefix . '_1c_catalog_id',
				'type' => 'text',
				'name' => esc_html__( 'Идентификатор каталога', 'metabox-online-generator' ),
			),
			array(
				'id' => $prefix . '_1c_product_id',
				'type' => 'text',
				'name' => esc_html__( 'Идентификатор товара', 'metabox-online-generator' ),
			)
		),
	);

	return $meta_boxes;
}
add_filter( 'rwmb_meta_boxes', 'product_variation_metabox' );

add_action( 'woocommerce_variation_options_pricing', function ( $loop, $variation_data, $variation ) {
	$variation_object = wc_get_product( $variation->ID );
	
	$variable_currency_data = get_post_meta( $variation->ID, 'variable_currency_price', true );

	$variable_currency_price 	= $variable_currency_data && array_key_exists( 'variable_currency_price', $variable_currency_data ) ? $variable_currency_data[ 'variable_currency_price' ] : null;
	$variable_currency_symbol 	= $variable_currency_data && array_key_exists( 'variable_currency_symbol', $variable_currency_data ) ? $variable_currency_data[ 'variable_currency_symbol' ] : null;

	woocommerce_wp_text_input(
		array(
			'id'            => "variable_currency_price_{$loop}",
			'name'          => "variable_currency_price[{$loop}]",
			'value'         => $variable_currency_price,
			'data_type'     => 'price',
			'label'         => esc_html__( 'Цена в валюте', 'woocommerce' ),
			'wrapper_class' => 'form-row form-row-first',
		)
	);

	woocommerce_wp_select(
		array(
			'id'            => "variable_currency_symbol_{$loop}",
			'name'          => "variable_currency_symbol[{$loop}]",
			'value'         => $variable_currency_symbol,
			'label'         => __( 'Символ валюты', 'woocommerce' ),
			'options'       => array(
				'usd'	=> 'USD',
				'eur'	=> 'EUR'
			),
			'desc_tip'      => true,
			'wrapper_class' => 'form-row form-row-last',
		)
	);
}, 10, 3 );

add_action( 'woocommerce_save_product_variation', function ( $variation_id, $i ) {

	update_post_meta( $variation_id, 'variable_currency_price', array(
		'variable_currency_price' 	=> isset( $_POST['variable_currency_price'][ $i ] ) ? wc_clean( wp_unslash( $_POST['variable_currency_price'][ $i ] ) ) : null,
		'variable_currency_symbol'	=> isset( $_POST['variable_currency_symbol'][ $i ] ) ? wc_clean( wp_unslash( $_POST['variable_currency_symbol'][ $i ] ) ) : null
	) );

	return $variation_id;

}, 10, 2 );

add_action( 'woocommerce_product_options_pricing', function () {
	if ( isset( $_GET[ 'post' ] ) ) {
		$product_object = wc_get_product( $_GET[ 'post' ] );

		$product_currency_data = get_post_meta( $product_object->get_id(), 'product_currency_price', true );
	
		$product_currency_price 	= $product_currency_data && array_key_exists( 'product_currency_price', $product_currency_data ) ? $product_currency_data[ 'product_currency_price' ] : null;
		$product_currency_symbol 	= $product_currency_data && array_key_exists( 'product_currency_symbol', $product_currency_data ) ? $product_currency_data[ 'product_currency_symbol' ] : null;

		woocommerce_wp_text_input(
			array(
				'id'        => 'product_currency_price',
				'name'      => "product_currency_price",
				'value'     => $product_currency_price,
				'label'     => __( 'Цена в валюте', 'woocommerce' ),
				'data_type' => 'price',
			)
		);
		woocommerce_wp_select(
			array(
				'id'            => "product_currency_symbol",
				'name'          => "product_currency_symbol",
				'value'         => $product_currency_symbol,
				'label'         => __( 'Символ валюты', 'woocommerce' ),
				'options'       => array(
					'usd'	=> 'USD',
					'eur'	=> 'EUR'
				),
				'desc_tip'      => true,
			)
		);
	} else {
		woocommerce_wp_text_input(
			array(
				'id'        => 'product_currency_price',
				'name'      => "product_currency_price",
				'label'     => __( 'Цена в валюте', 'woocommerce' ),
				'data_type' => 'price',
			)
		);
		woocommerce_wp_select(
			array(
				'id'            => "product_currency_symbol",
				'name'          => "product_currency_symbol",
				'label'         => __( 'Символ валюты', 'woocommerce' ),
				'options'       => array(
					'usd'	=> 'USD',
					'eur'	=> 'EUR'
				),
				'desc_tip'      => true,
			)
		);
	}
	
}, 10 );

add_action( 'woocommerce_process_product_meta_simple', '__save_product', 10, 1 );
add_action( 'woocommerce_process_product_meta_external', '__save_product', 10, 1 );
function __save_product( $product_id ) {

	update_post_meta( $product_id, 'product_currency_price', array(
		'product_currency_price' 	=> isset( $_POST['product_currency_price'] ) ? wc_clean( wp_unslash( $_POST['product_currency_price'] ) ) : null,
		'product_currency_symbol'	=> isset( $_POST['product_currency_symbol'] ) ? wc_clean( wp_unslash( $_POST['product_currency_symbol'] ) ) : null
	) );

	return $product_id;

}


?>