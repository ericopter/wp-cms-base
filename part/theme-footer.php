<?php
// Reach for the appropriate Sidebar
if ((is_archive() || is_home() || is_single() || is_search()) && is_active_sidebar('footer_posts')) {
	dynamic_sidebar('footer_posts');
} else if (is_page() && is_active_sidebar('footer_pages')) {
	dynamic_sidebar('footer_pages');
} else if (is_front_page() && is_active_sidebar('footer_home')) {
	dynamic_sidebar('footer_home');
} else if (is_active_sidebar('footer')) {
	dynamic_sidebar('footer');
}
?>
<div class="span16 center">
	Footer Section
</div>