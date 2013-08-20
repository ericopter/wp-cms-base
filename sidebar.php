<?php
/**
 * sidebar.php
 */
?>
<!-- sidebar.php -->
<div id="sidebar" class="<?php sidebar_class(); ?>">
	<?php
	// Reach for the appropriate Sidebar
	if ((is_archive() || is_home() || is_single() || is_search()) && is_active_sidebar('sidebar_posts')) {
		dynamic_sidebar('sidebar_posts');
	} else if (is_page() && is_active_sidebar('sidebar_pages')) {
		dynamic_sidebar('sidebar_pages');
	} else if (is_front_page() && is_active_sidebar('sidebar_home')) {
		dynamic_sidebar('sidebar_home');
	} else if (is_active_sidebar('sidebar')) {
		dynamic_sidebar('sidebar');
	}
	?>
</div>