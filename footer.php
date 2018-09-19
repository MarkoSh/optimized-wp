			</div><!-- #main .wrapper -->
			<footer id="colophon" role="contentinfo"></footer><!-- #colophon -->
		</div><!-- #page -->

	<?php
		if ( function_exists( 'woocommerce_photoswipe' ) ) {
			woocommerce_photoswipe();
		}
	?>

	<script src="<?php echo get_template_directory_uri(); ?>/scripts.min.js"></script>

	</body>
</html>
