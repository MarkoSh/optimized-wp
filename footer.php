			</div><!-- #main .wrapper -->
			<footer id="colophon" role="contentinfo"></footer><!-- #colophon -->
		</div><!-- #page -->

	<?php
		if ( function_exists( 'woocommerce_photoswipe' ) ) {
			woocommerce_photoswipe();
		}
	?>

	<?php // wp_footer(); // Мне не пригодилась ?>

	<script src="<?php echo get_template_directory_uri(); ?>/scripts.min.js"></script>

	</body>
</html>
