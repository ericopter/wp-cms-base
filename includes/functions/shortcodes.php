<?php
/**
 * Wordpress editor modification functions
 */

//////////////////////////////////////////////////////////////
// Editor Shortcode Menus
/////////////////////////////////////////////////////////////

add_action( 'init', 'ewd_add_shortcode_button' );

/**
 * Add a button for shortcodes to the WP editor.
 *
 * @access public
 * @return void
 */
function ewd_add_shortcode_button() {
    add_filter('mce_external_plugins', 'ewd_add_tinymce_plugin');
    add_filter('mce_buttons', 'ewd_register_shortcode_button');
}

/**
 *
 */
function ewd_add_tinymce_plugin($plugin_array)
{

    $file = get_template_directory_uri() . '/includes/functions/editor/tinymce_scripts.js.php';
    $plugin_array['ewd_tinymce_shortcodes_plugin'] = $file;
    return $plugin_array;
}

/**
 * Register the shortcode button.
 *
 * @access public
 * @param mixed $buttons
 * @return array
 */
function ewd_register_shortcode_button($buttons) {
	array_push($buttons, "ewd_tinymce_shortcodes_select");

	return $buttons;
}

add_filter( 'mce_buttons_2', 'my_mce_buttons_2' );

/**
 * Add the styles select menu
 */
function my_mce_buttons_2( $buttons ) {
    array_unshift( $buttons, 'styleselect' );

    return $buttons;
}

// add_filter( 'tiny_mce_before_init', 'my_mce_before_init' );

/**
 * Add my style to the style select menu
 */
function my_mce_before_init( $settings ) {

    include 'editor/tinymce_styles_array.php';

    $settings['style_formats'] = json_encode( $style_formats );

    return $settings;

}

//////////////////////////////////////////////////////////////
// Basic Components
/////////////////////////////////////////////////////////////

/**
 * Returns the absolute url value
 */
function absurl_shortcode_func( $atts ){
    return ABSURL;
}
add_shortcode( 'absurl', 'absurl_shortcode_func' );

/**
 * Returns the site url value for usage in posts/widgets
 */
function ewd_shortcode_siteurl($atts)
{
    return site_url();
}
add_shortcode('siteurl', 'ewd_shortcode_siteurl');

/**
 * Returns the template directory url value for usage in posts/widgets
 */
function ewd_shortcode_templatedirectoryurl($atts)
{
    return get_template_directory_uri();
}
add_shortcode('tempdiruri', 'ewd_shortcode_templatedirectoryurl');

/**
 * Outputs a clearing element
 */
function ewd_shortcode_clear($atts, $content = null)
{
	return '<div class="clear"></div>';
}
add_shortcode('clear', 'ewd_shortcode_clear');

/**
 * Outputs a horizontal rule w/optional class name
 */
function ewd_shortcode_hr($atts, $content = null)
{
	extract(shortcode_atts(array(
		'class' => ''
	), $atts));
	return '<hr class="' . $class . '" />';
}
add_shortcode('hr', 'ewd_shortcode_hr');

/**
 * Shortcode to out put div and add optional id/class
 */
function ewd_shortcode_div($atts, $content = null)
{
	extract(shortcode_atts(array(
		'class' => null,
		'id' => null
	),$atts));
	$output = '<div';

	if ($id) {
		$output .= ' id="' . $id . '"';
	}

	if ($class) {
		$output .= ' class="' . $class . '"';
	}

	$output .= '>' . do_shortcode($content) . '</div>';

	return $output;
}
add_shortcode('div', 'ewd_shortcode_div');

//////////////////////////////////////////////////////////////
// Tabs and Toggles
/////////////////////////////////////////////////////////////

// Shortcode: tab
// Usage: [tab title="title 1"]Your content goes here...[/tab]
function ewd_shortcode_tab_func( $atts, $content = null ) {
    extract(shortcode_atts(array(
	    'title'	=> '',
    ), $atts));

    global $tabs;

    $tabs[] = array('title' => $title, 'content' => trim(wpautop(do_shortcode($content))));

    return $tabs;
}
add_shortcode('tab', 'ewd_shortcode_tab_func');

/* Shortcode: tabs
 * Usage:   [tabs]
 * 		[tab title="title 1"]Your content goes here...[/tab]
 * 		[tab title="title 2"]Your content goes here...[/tab]
 * 	    [/tabs]
 */
function ewd_shortcode_tabs_func( $atts, $content = null ) {
    global $tabs;

    $tabs = array(); // clear the array

	do_shortcode($content); // execute the '[tab]' shortcode first to get the title and content

    $tabs_nav = '<div class="clear"></div>';
    $tabs_nav .= '<div class="tabs-wrapper">';
    $tabs_nav .= '<ul class="tabs">';
	$tabs_content .= '<ul class="tabs-content">';

	foreach ($tabs as $tab => $tab_atts) {
		$id = str_replace(' ', '-', $tab_atts['title']);
		$default = ( $tab == 0 ) ? ' class="active"' : '';

		$tabs_nav .= '<li><a href="#'.$id.'"'.$default.'>'.$tab_atts['title'].'</a></li>';
		$tabs_content .= '<li id="'.$id.'"'.$default.'>'.$tab_atts['content'].'</li>';
    }

    $tabs_nav .= '</ul>';
	$tabs_content .= '</ul>';
    $tabs_output .= $tabs_nav . $tabs_content;
    $tabs_output .= '</div><!-- tabs-wrapper end -->';
    $tabs_output .= '<div class="clear"></div>';

    return $tabs_output;
}
add_shortcode('tabs', 'ewd_shortcode_tabs_func');

// Shortcode: toggle_content
// Usage: [toggle_content title="Title"]Your content goes here...[/toggle_content]
function ewd_shortcode_toggle( $atts, $content = null ) {
    extract(shortcode_atts(array(
	    'title'      => '',
    ), $atts));

    $html = '<h4 class="slide_toggle"><a href="#">' .$title. '</a></h4>';
    $html .= '<div class="slide_toggle_content" style="display: none;">'.wpautop(do_shortcode($content)).'</div>';

	return $html;
}
add_shortcode('toggle_content', 'ewd_shortcode_toggle');