<?php
/**
 * category.php
 */
get_header();
?>
<!-- category.php -->
<div id="category" class="<?php content_class(); ?>">
	<header>
		<h1 id="page-title">
			<?php 
			printf('%s Posts', single_cat_title('', false)); 
			?>
		</h1>
	</header>
	
	<?php
	$category_description = category_description();
	if ($category_description) :
	?>
	<div id="category-description">
		<?php echo $category_description; ?>
	</div>
	<?php
	endif;
	// display sub categories of the current category to refine results
	$cat_id = get_cat_ID(single_cat_title( '', false ));
	$sub_cats = get_categories(array('parent' => $cat_id));

	// if the category has posts
	if (count($sub_cats) > 0) : ?>
	<div id="sub-categories">
		<h2 class="sub-title">Sub Categories</h2>
		<?php
		foreach ($sub_cats as $cat) : 
		if ($cat->count > 0):
		?>
		<a class="button-link" href="<?php echo get_category_link($cat->term_id) ?>"><?php echo $cat->name ?></a>
		<?php
		endif;
		endforeach;
		?>
	</div>
	<?php
	endif;	
	
	get_template_part('part/content', 'excerpt');
	?>
</div>
<?php
get_sidebar();
get_footer();
?>