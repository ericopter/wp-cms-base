<?php
/**
 * A unique identifier is defined to store the options in the database and reference them from the theme.
 * By default it uses the theme name, in lowercase and without spaces, but this can be changed if needed.
 * If the identifier changes, it'll appear as if the options have been reset.
 */

function optionsframework_option_name() {

	// This gets the theme name from the stylesheet
	$themename = get_option( 'stylesheet' );
	$themename = preg_replace("/\W/", "_", strtolower($themename) );

	$optionsframework_settings = get_option( 'optionsframework' );
	$optionsframework_settings['id'] = $themename;
	update_option( 'optionsframework', $optionsframework_settings );
}

/**
 * Defines an array of options that will be used to generate the settings page and be saved in the database.
 * When creating the 'id' fields, make sure to use all lowercase and no spaces.
 *
 * If you are making your theme translatable, you should replace 'options_framework_theme'
 * with the actual text domain for your theme.  Read more:
 * http://codex.wordpress.org/Function_Reference/load_theme_textdomain
 */

function optionsframework_options() {

	// If using image radio buttons, define a directory path
	$imagepath =  get_template_directory_uri() . '/images/options/';

	$optionsArr = array(
		'slideshow' => array(
			'display' => 1,
			'layout' => array(
				'full' => 'Full Width',
				'framed' => 'Framed'
			),
			'type' => array(
				'flexslider' => 'Flexslider',
				'nivoslider' => 'NivoSlider'
			),
			'delay' => 6,
			'speed' => 6,
			'effect' => 'fading',
			'direction' => 'horizontal',
			'direction-reverse' => 0,
			'navigation' => 1,
			'pagination' => 1,
			'keyboard' => 1
		)
	);

	$defaults = array(
		'slideshow' => array(
			'display' => 1,
			'layout' => 'framed',
			'type' => 'Flexslider',
			'delay' => 6,
			'speed' => 6,
			'effect' => 'fading',
			'direction' => 'horizontal',
			'direction-reverse' => 0,
			'navigation' => 1,
			'pagination' => 1,
			'keyboard' => 1
		)
	);
/////////////////////////////////////////////////////////////////////////////////////////////
	$options = array();

/*
	boilerplate

	$options[] = array(
		'name' 	=> __('', 'echotheme'),
		'desc'	=> __('', 'echotheme'),
		'type' 	=> '',
		'id' 	=> '',
		'options' => array(),
		'std'	=> '',
		'class'	=> ''
	);
*/

	/******************************************************
	 Slideshow Options
	******************************************************/

	$options[] = array(
		'name' => __('Slideshow Settings', 'options_framework_theme'),
		'type' => 'heading'
	);

	$options[] = array(
		'name' 	=> __('Enable Homepage Slideshow', 'echotheme'),
		'desc'	=> __('Check button to enable homepage slideshow', 'echotheme'),
		'type' 	=> 'checkbox',
		'id' 	=> 'slideshow-display',
		'std'	=> $defaults['slideshow']['display']
	);

	$options[] = array(
		'name' 	=> __('Slideshow Transition Effect', 'echotheme'),
		'desc'	=> __('Choose between a fading or sliding transition', 'echotheme'),
		'type' 	=> 'select',
		'id' 	=> 'slideshow-effect',
		'std'	=> $defaults['slideshow']['effect'],
		'class'	=> 'mini',
		'options' => array(
			'fading' => 'Fading',
			'sliding' => 'Sliding'
		)
	);

	$options[] = array(
		'name' 	=> __('Slideshow Direction', 'echotheme'),
		'desc'	=> __('Direction of sliding movement (for "Sliding" type transition only)', 'echotheme'),
		'type' 	=> 'select',
		'id' 	=> 'slideshow-direction',
		'std'	=> $defaults['slideshow']['direction'],
		'class'	=> 'mini',
		'options' => array(
			'horizontal' => 'Horizontal',
			'vertical' => 'Vertical'
		)
	);

	$options[] = array(
		'name' 	=> __('Reverse Sliding Direction', 'echotheme'),
		'desc'	=> __('Check this box to reverse the default direction of the slide movement', 'echotheme'),
		'type' 	=> 'checkbox',
		'id' 	=> 'slideshow-direction-reverse',
		'std'	=> $defaults['slideshow']['direction-reverse']
	);

	$options[] = array(
		'name' 	=> __('Slideshow Speed', 'echotheme'),
		'desc'	=> __('Delay in seconds to change slides', 'echotheme'),
		'type' 	=> 'select',
		'id' 	=> 'slideshow-delay',
		'std'	=> $defaults['slideshow']['delay'],
		'class'	=> 'mini',
		'options' => array(
			1 => '1 Second',
			2 => '2 Seconds',
			3 => '3 Seconds',
			4 => '4 Seconds',
			5 => '5 Seconds',
			6 => '6 Seconds',
			7 => '7 Seconds',
			8 => '8 Seconds',
			9 => '9 Seconds',
			10 => '10 Seconds',
		)
	);

	$options[] = array(
		'name' 	=> __('Animation Speed', 'echotheme'),
		'desc'	=> __('Time for animation transition effect to occur', 'echotheme'),
		'type' 	=> 'select',
		'id' 	=> 'slideshow-speed',
		'std'	=> $defaults['slideshow']['speed'],
		'class'	=> 'mini',
		'options' => array(
			1 => '.1 Second',
			2 => '.2 Seconds',
			3 => '.3 Seconds',
			4 => '.4 Seconds',
			5 => '.5 Seconds',
			6 => '.6 Seconds',
			7 => '.7 Seconds',
			8 => '.8 Seconds',
			9 => '.9 Seconds',
			10 => '1.0 Seconds',
			11 => '1.1 Seconds',
			12 => '1.2 Seconds',
			13 => '1.3 Seconds',
			14 => '1.4 Seconds',
			15 => '1.5 Seconds',
		)
	);

	$options[] = array(
		'name' 	=> __('Slideshow Pagination', 'echotheme'),
		'desc'	=> __('Check to show navigation links for each slide in the show', 'echotheme'),
		'type' 	=> 'checkbox',
		'id' 	=> 'slideshow-pagination',
		'std'	=> $defaults['slideshow']['pagination'],
	);

	$options[] = array(
		'name' 	=> __('Slideshow Navigation', 'echotheme'),
		'desc'	=> __('Check to show prev/next buttons for the slideshow', 'echotheme'),
		'type' 	=> 'checkbox',
		'id' 	=> 'slideshow-navigation',
		'std'	=> $defaults['slideshow']['navigation'],
	);

	$options[] = array(
		'name' 	=> __('Slideshow Keyboard Navigation', 'echotheme'),
		'desc'	=> __('Check to allow navigating prev/next slides with keyboard arrow keys', 'echotheme'),
		'type' 	=> 'checkbox',
		'id' 	=> 'slideshow-keyboard',
		'std'	=> $defaults['slideshow']['keyboard'],
	);

	/******************************************************
	 Meta Data Options
	******************************************************/
	$options[] = array(
		'name'	=> __('Site Meta Data', 'echotheme'),
		'type'	=> 'heading'
	);

	$options[] = array(
		'name' 	=> __('Meta Description', 'echotheme'),
		'desc'	=> __('Enter your site meta description', 'echotheme'),
		'type' 	=> 'textarea',
		'id' 	=> 'meta-description',
	);

	$options[] = array(
		'name' 	=> __('Meta Keywords', 'echotheme'),
		'desc'	=> __('Enter your sites meta keywords (comma separated)', 'echotheme'),
		'type' 	=> 'textarea',
		'id' 	=> 'meta-keywords',
	);

	$options[] = array(
		'name' 	=> __('Google Analytics', 'echotheme'),
		'desc'	=> __('Paste in your google analytics code (Script tag not required)', 'echotheme'),
		'type' 	=> 'textarea',
		'id' 	=> 'google-analytics',
	);

	return $options;
}

/*
 * This is an example of how to add custom scripts to the options panel.
 * This example shows/hides an option when a checkbox is clicked.
 */

add_action('optionsframework_custom_scripts', 'optionsframework_custom_scripts');

function optionsframework_custom_scripts() { ?>

<script type="text/javascript">
jQuery(document).ready(function($) {

	/*
		Slideshow Options
	*/
	if ($('#slideshow-effect').val() == 'fading') {
		$('#section-slideshow-direction').hide();
		$('#section-slideshow-direction-reverse').hide();
	} else {
		$('#section-slideshow-navigation').hide();

	}

	$('#slideshow-effect').change(function() {
		$('#section-slideshow-direction').slideToggle();
		$('#section-slideshow-direction-reverse').slideToggle();
		$('#section-slideshow-navigation').slideToggle();
	});

});
</script>

<?php
}