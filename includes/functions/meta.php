<?php
/**
 * function remove_wp_headlinks()
 * 
 * Remove unnecessary headlinks that screw validation in wp_head hook
 */
function ewd_remove_headlinks()
{
	remove_action('wp_head', 'index_rel_link');
	remove_action('wp_head', 'rsd_link');
	remove_action('wp_head', 'wlwmanifest_link');
	remove_action('wp_head', 'wp_generator');
}

add_action('init', 'ewd_remove_headlinks');

/**
 * generates the title text
 */
function ewd_title()
{
	/*
	 * Print the title for the <title> tag based on what is being viewed.
	 */
	global $page, $paged;
	
	$separator = ' - ';

	wp_title( $separator, true, 'right' );

	// Add the blog name.
	bloginfo( 'name' );

	// Add the blog description for the home/front page.
	$site_description = get_bloginfo( 'description', 'display' );
	if ( $site_description && ( is_home() || is_front_page() ) )
		echo $separator . $site_description;

	// Add a page number if necessary:
	if ( $paged >= 2 || $page >= 2 )
		echo $separator . sprintf( __( 'Page %s', 'twentyten' ), max( $paged, $page ) );
}

/**
 * Generate the custom meta description/keywords tags for our SEO smart theme
 */
function ewd_meta_tags()
{
	global $post;
	$description = null;
	$keywords = null;
	
	// output responsive meta tag if options set
	if (function_exists('of_get_option') && of_get_option('site-responsive') == 'yes') {
		echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
	}
	
	// if we have theme options and the meta description/keywords value is set
	if (function_exists('of_get_option')) {
		$description = of_get_option('meta-description') ? 
			of_get_option('meta-description') : $description;
		$keywords = of_get_option('meta-keywords') ? 
			of_get_option('meta-keywords') : $keywords;
	}
	
	// if the particular page/post meta description/keyword value is set
	$description = get_meta_box_value('_ewd_meta_description_value') ? 
		get_meta_box_value('_ewd_meta_description_value') : $description;
	$keywords = get_meta_box_value('_ewd_meta_keywords_value') ? 
		get_meta_box_value('_ewd_meta_keywords_value') : $keywords;
	
	// if $description isn't null, output meta tag
	if ($description) {
		echo '<meta name="description" content="' . $description . '">' . "\n";
	}
	
	// if $keywords isn't null, output meta tag
	if ($keywords) {
		echo '<meta name="keywords" content="' . $keywords . '">' . "\n";
	}
}

/**
 * Use my jQuery instead of Wordpress's
 */
function ewd_jquery() {
	wp_deregister_script('jquery');
	wp_register_script(
		'jquery', 
		get_template_directory_uri() . '/js/jquery-1.8.3.min.js', 
		null ,
		'1.8.3'
	);
	wp_enqueue_script('jquery');
	
	wp_register_script(
		'jquery-easing', 
		get_template_directory_uri() . '/js/jquery.easing.js', 
		array('jquery'), 
		'1.3'
	);
}
add_action('wp_enqueue_scripts', 'ewd_jquery');

/**
 * general javascript files required by all pages
 */
function ewd_general_javascript()
{
	// load superfish script
	wp_enqueue_script('superfish');
	
	// load general javascript file
	wp_enqueue_script(
		'general', 
		get_template_directory_uri() . '/js/general.js', 
		array('jquery')
	);
}

add_action('wp_enqueue_scripts', 'ewd_general_javascript');

/**
 * Function for linking to custom css files
 */
function ewd_general_css()
{ 
	wp_enqueue_style('style');
	
	// Include the responsive stylesheet?
	if (function_exists('of_get_option') && of_get_option('site-responsive') == 'yes') {
		wp_enqueue_style('responsive');
	}
}

add_action('wp_print_styles', 'ewd_general_css');

/**
 * Creates action hook to be called directly before wp_head action
 */
function ewd_pre_wp_head()
{ 
	// run the hook to add custom stuff at end of head
	do_action('ewd_pre_wp_head');
}

/**
 * Creates action hook to be called directly before closing the head
 */
function ewd_post_wp_head()
{ 
	// run the hook to add custom stuff at end of head
	do_action('ewd_post_wp_head');
}

/**
 * Function/hook for adding Flexslider Slideshow assets to a page
 */
function ewd_load_flexslider()
{
	wp_enqueue_script(
		'flexslider', 
		get_bloginfo('template_url') . '/includes/scripts/flexslider/jquery.flexslider-min.js', 
		array('jquery-easing')
	);
}
// add_action('ewd_pre_wp_head', 'ewd_load_flexslider');

/**
 * Function to load isotope
 */
function ewd_load_isotope()
{
	// isotope
	wp_enqueue_script(
		'isotope', 
		get_bloginfo('template_url') . '/includes/scripts/isotope/jquery.isotope.min.js', 
		array('jquery')
	);
}
// add_action('ewd_pre_wp_head', 'ewd_load_isotope');

/**
 * Function/hook for adding Shadowbox to a page
 */
function ewd_load_shadowbox()
{
	wp_enqueue_script(
		'shadowbox', 
		get_bloginfo('template_url') . '/includes/scripts/shadowbox/shadowbox.js', 
		array('jquery')
	);	
}
// add_action('ewd_pre_wp_head', 'ewd_load_shadowbox');

/**
 * Output google analytics from control panel
 */
function ewd_analytics()
{
	if (function_exists('of_get_option') && $analytics = of_get_option('google-analytics')) :
?> 
	<script type="text/javascript"><?php echo $analytics ?></script>
<?php
	endif;
}

add_action('ewd_post_wp_head', 'ewd_analytics');