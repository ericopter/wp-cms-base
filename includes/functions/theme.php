<?php
/**
 * Set up the theme and include other functions files
 */
function ewd_include_files()
{
	// Load main options panel file
	if ( !function_exists( 'optionsframework_init' ) ) {
		define('OPTIONS_FRAMEWORK_URL', TEMPLATEPATH . '/includes/options/');
		define('OPTIONS_FRAMEWORK_DIRECTORY', get_bloginfo('template_directory') . '/includes/options/');
		require_once (OPTIONS_FRAMEWORK_URL . 'options-framework.php');
	}
}
ewd_include_files();

/**
 * Set up featured image support on pages
 */
function ewd_setup()
{
	// This theme uses post thumbnails
	add_theme_support( 'post-thumbnails' );

	// define the image theme sizes
	add_image_size( 'theme-image', 520, 440, true );
	add_image_size( 'flexslider', 940, 400, true);

	// define the theme menu areas
	register_nav_menus(
		array(
			'header-menu' 	=> 'Header Area Menu',
			'top-menu' 		=> 'Horizontal Nav Bar',
			'footer-menu'	=> 'Footer Menu'
		)
	);

	// Fix wordpress's auto "p" tagging
	remove_filter('the_content', 'wpautop');
	add_filter( 'the_content', 'wpautop' , 99);
	add_filter( 'the_excerpt', 'wpautop');
}

add_action('after_setup_theme', 'ewd_setup');

function ewd_register_styles()
{
	// Register all theme related assests
	wp_register_style(
		'build',
		get_bloginfo('template_url') . '/css/build.min.css',
		null,
		THEME_VERSION,
		'screen'
	);
}
add_action('after_setup_theme', 'ewd_register_styles');