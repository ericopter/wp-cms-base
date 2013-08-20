<?php
/**
 * This function sets up the theme sidebar areas
 */
function ewd_sidebars_init() {
	
	register_sidebar(array(
		'name' => 'Default Sidebar',
		'id' => 'sidebar',
		'description' => __('This is the default widget area for the sidebar. This will be displayed if the other sidebars have not been populated with widgets.', 'echotheme'),
		'before_widget' => '<div id="%1$s" class="%2$s widget sidebarBox">',
		'after_widget' => '</div>',
		'before_title' => '<h3>',
		'after_title' => '</h3>'
	));
	
	add_filter('widget_text', 'do_shortcode');
}
add_action( 'widgets_init', 'ewd_sidebars_init' );