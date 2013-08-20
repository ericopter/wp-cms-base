<?php
/**
 * search.php
 */
get_header();
?>
<!-- search.php -->
<div id="search" class="<?php content_class(); ?>">
	<?php 
	// get_search_form();
	get_template_part('part/content', 'excerpt'); ?>
</div>
<?php
get_sidebar();
get_footer();
?>
