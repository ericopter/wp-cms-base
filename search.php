<?php
/**
 * search.php
 */
get_header();
?>
<!-- search.php -->
<div id="search" class="<?php content_class(); ?>">
	<h1>Page Not Found</h1>
	<p class="lead">
		We're sorry, but the requested page could not be found. Please check the URL, try again or use the search form to try and locate what you where looking for
	</p>
	<?php 
	get_search_form();
	get_template_part('part/content', 'excerpt'); ?>
</div>
<?php
get_sidebar();
get_footer();
?>
