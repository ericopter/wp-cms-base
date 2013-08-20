<?php
/**
 * Output the main menu if set
 */
$args = array(
	'theme_location' 	=> '',
	'container'       	=> false,
	'menu_id'        	=> '',
	'menu_class' 		=> 'hori-nav',
	'echo'				=> false,
	'fallback_cb' 		=> false
);
$menu = wp_nav_menu($args);
if ($menu) :
?>
<div id="header-navigation">
	<?php
		echo $menu;
	?>
</div> <!-- end #header-navigation -->
<?php
endif;
?>