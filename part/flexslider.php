<?php
/**
 * display flexslider gallery
 */

$args = array(
	'post_type'		=> 'ewd_slideshow',
	'posts_per_page' => -1,
	'orderby' => 'menu_order',
	'order' => 'ASC'
);

$slides = new WP_Query($args);

if (!$slides->have_posts()) {
	return;
}
?>
<div class="span16">
	<div class="controls-container flexslider">
		<ul class="slides">
			<?php
			while ($slides->have_posts()) :
				$slides->the_post();
			
				// get the image and strip the height attribute
				$image = get_the_post_thumbnail(get_the_ID(), 'flexslider');
		
				// should we display the title and content?
				$title = get_meta_box_value('_ewd_slide_display_title_value') ? get_the_title() : null;
				$content = get_meta_box_value('_ewd_slide_display_content_value') ? get_the_content() : null;
				$link = get_meta_box_value('_ewd_slide_url_value') ? get_meta_box_value('_ewd_slide_url_value') : null;
			?>
			<li>
				<?php 
				echo $image; 
				if ($content || $title) :
				?>
				<div class="slide-info">
					<?php 
					if ($title): 
					?>
					<h2>
						<?php echo $title; ?>
					</h2>
					<?php 
					endif; 
				
					if ($content) {
						echo $content;
					}
					?>
				</div>
				<?php
				endif;
				?>
			</li>
			<?php
			endwhile;
			?>
		</ul>
	</div>
</div>
<?php
// get the theme options pertaining to the slideshow
$delay = of_get_option('slideshow-delay') ? of_get_option('slideshow-delay') * 1000 : 6000;
$speed = of_get_option('slideshow-speed') ? of_get_option('slideshow-speed') * 100 : 600;
$effect = of_get_option('slideshow-effect');
$direction = of_get_option('slideshow-direction');
$navigation = of_get_option('slideshow-navigation') ? 'true' : 'false';
$pagination = of_get_option('slideshow-pagination') ? 'true' : 'false';
$keyboard = of_get_option('slideshow-keyboard') ? 'true' : 'false';
$reverse = of_get_option('slideshow-direction-reverse') ? 'true' : 'false';
?>
<script type="text/javascript">
$(document).ready(function() {
	$('.flexslider').flexslider(
		{	
			<?php
			// seperate certain options based on type of slideshow transition
			if ($effect == 'sliding') : // we are doing a sliding transition
			?>
			animation : 'slide',
			direction : '<?php echo $direction; ?>',
			reverse : <?php echo $reverse ?>,
			<?php
			endif;
			?>
			controlsContainer: ".controls-container .controls-inner",
			directionNav: <?php echo $navigation ?>,
			controlNav: <?php echo $pagination ?>,
			slideshowSpeed: <?php echo $delay ?>,
			animationSpeed: <?php echo $speed ?>,
			keyboard: <?php echo $keyboard ?>,
			multipleKeyboard: true,
			pauseOnHover: true
		}
	);
});
</script>