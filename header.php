<!DOCTYPE html>
<html <?php language_attributes(); ?>>

	<head>

		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		
		<!-- Custom Browsers Color Start -->
		<meta name="theme-color" content="#000">
		<!-- Custom Browsers Color End -->

		<?php wp_head(); ?>

		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.min.css">

	</head>

	<body <?php body_class(); ?>>
		<div id="page" class="hfeed site">
			<header id="masthead" class="site-header" role="banner">
				<?php
					wp_nav_menu( array(
						'theme_location'  => 'primary', // Используйте мнемонические названия меню - primary, secondary, tertiary, etc.
						'container'       => 'nav', // Рекомендую использовать nav тэг, так как все таки это навигация по сайту
						'container_class' => 'primary-menu-container', 
						'container_id'    => 'primary_menu_container',
						'menu_class'      => 'primary-menu', 
						'menu_id'         => 'primary_menu',
						'items_wrap'      => '<a href="#" class="burger"><div class="line bun"></div><div class="line beef"></div><div class="line bun"></div></a><ul id="%1$s" class="%2$s">%3$s</ul>',
					) );
				?>
			</header><!-- .site-header -->
			<div id="main" class="wrapper">

