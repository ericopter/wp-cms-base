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
	
	// include the breadcrumbs
	if (file_exists(INCLUDEPATH . 'scripts/breadcrumbs/breadcrumbs.php')) {
		require_once(INCLUDEPATH . 'scripts/breadcrumbs/breadcrumbs.php');
	}
	
	// include multiple featured images
	/*if (file_exists(INCLUDEPATH . 'scripts/MultiPostThumbnails/MultiPostThumbnails.php')) {
		require_once(INCLUDEPATH . 'scripts/MultiPostThumbnails/MultiPostThumbnails.php');
	}*/
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
		get_bloginfo('template_url') . '/css/build.css', 
		null, 
		THEME_VERSION, 
		'screen'
	);
	
	wp_register_style(
		'responsive',
		get_bloginfo('template_url') . '/css/responsive.css',
		array('build'),
		THEME_VERSION,
		'screen'
	);
	
	wp_register_style(
			'project', 
			get_bloginfo('template_url') . '/css/project.css', 
			array('build'), 
			THEME_VERSION, 
			'screen'
		);
		
	
	// Finally register the default wordpress style sheet
	wp_register_style(
		'style', 
		get_bloginfo('template_url') . '/style.css', 
		array('project'), 
		THEME_VERSION, 
		'screen'
	);
	
}
add_action('after_setup_theme', 'ewd_register_styles');

/**
 * Register all the Superfish assets
 */
function ewd_register_superfish()
{
	// Superfish Functionality, styles and scripts
	wp_register_style(
		'superfish', 
		get_bloginfo('template_url') . '/includes/scripts/superfish/css/superfish.css'
	);
	
	wp_register_script(
		'hoverintent', 
		get_bloginfo('template_url') . '/includes/scripts/superfish/js/hoverIntent.js', 
		array('jquery')
	);
	
	wp_register_script(
		'superfish', 
		get_bloginfo('template_url') . '/includes/scripts/superfish/js/superfish.js', 
		array('hoverintent')
	);
	
}
add_action('after_setup_theme', 'ewd_register_superfish');