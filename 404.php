<?php
/**
 * 404.php
 */
get_header();
?>
<!-- 404.php -->
<div id="error-page" class="<?php content_class(); ?>">
	<article>
		<h1 class="page-title">
			Page Not Found
		</h1>
		
		<div id="page-content">
			The page you requested could not be found. Please try your browsers back button and make sure you spelt everything correctly. You can also try using the search form below.
			<?php get_search_form(); ?>
		</div>
	</article>
</div>
<?php
get_sidebar();
get_footer();
?>