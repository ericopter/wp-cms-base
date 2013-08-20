<?php
/**
 * Template Name: Page w/ Sidebar
 */
get_header();
?>
<!-- page.php -->
<div id="page" class="<?php content_class(); ?>">
	<?php get_template_part('part/content', 'page'); ?>
</div>
<?php
get_sidebar();
get_footer();
?>
