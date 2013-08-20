<?php
/**
 * index.php
 */
get_header();
?>
<!-- index.php -->
<div id="index" class="<?php content_class(); ?>">
	<?php get_template_part('part/content', 'excerpt'); ?>
</div>
<?php
get_sidebar();
get_footer();
?>