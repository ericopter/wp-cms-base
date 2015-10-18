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
    if (function_exists('of_get_option') && of_get_option('site-responsive') == 'yes'):
    $args = array(
    	'theme_location' 	=> 'header-menu',
    	'container'       	=> false,
    	'menu_id'        	=> 'responsive',
    	'menu_class' 		=> 'vert-nav',
    	'echo'				=> false,
    	'fallback_cb' 		=> false
    );
    $menu = wp_nav_menu($args);
    if ($menu) :
?>
<div id="responsive-menu">
    <div class="container">
        <a class="toggleMenu" href="#">Menu<span class="arrow"></span></a>
        <?php
        echo $menu;
        ?>
    </div> <!-- end .container -->
</div> <!-- end #responsive-menu -->
<script type="text/javascript">
$('.toggleMenu').click(function(e) {
    e.preventDefault();
    $(this).find('.arrow').toggleClass('active');
    $(this).next('ul').slideToggle();
});
</script>
<?php
    endif;
endif;
?>