<?php
if (have_posts()) :
	while (have_posts()) :
		the_post();
?>
<!-- part/content-page.php -->
<article>
	<header>
		<h1>
			<?php the_title(); ?>
		</h1>
	</header>
	
	<div class="post-content">
		<?php the_content(); ?>
	</div>
</article>
<?php
	endwhile;
endif;
?>