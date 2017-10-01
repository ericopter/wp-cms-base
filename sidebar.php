<?php
/**
 * sidebar.php
 */
?>
<!-- sidebar.php -->
<div id="sidebar" class="<?php sidebar_class(); ?>">
	<?php
	// Reach for the appropriate Sidebar
	if (is_active_sidebar('sidebar')) {
		dynamic_sidebar('sidebar');
	}
	?>
</div>