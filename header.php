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
		<div id="content" class="content">
			<header id="main_header" class="main-header">
				{{ header }}
			</header>
			{{ content }}
		
