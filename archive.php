<?php
/**
 * archive.php
 */
get_header();
?>
<!-- archive.php -->
<div id="archive" class="<?php content_class(); ?>">
	<?php 
	if (have_posts()): 
	?>
	<header>
		<h1 class="page-title">
			<?php if ( is_day() ) : ?>
				<?php printf( __( 'Daily Archives: %s', 'echotheme' ), '<span>' . get_the_date() . '</span>' ); ?>
			<?php elseif ( is_month() ) : ?>
				<?php printf( __( 'Monthly Archives: %s', 'echotheme' ), '<span>' . get_the_date( _x( 'F Y', 'monthly archives date format', 'echotheme' ) ) . '</span>' ); ?>
			<?php elseif ( is_year() ) : ?>
				<?php printf( __( 'Yearly Archives: %s', 'echotheme' ), '<span>' . get_the_date( _x( 'Y', 'yearly archives date format', 'echotheme' ) ) . '</span>' ); ?>
			<?php else : ?>
				<?php _e( 'Blog Archives', 'echotheme' ); ?>
			<?php endif; ?>
		</h1>
	</header>
	
	<?php
	get_template_part('part/content', 'excerpt');
	
	else: 
	?>
	<article id="post-0" class="post no-results not-found">
		<header>
			<h1 class="post-title">
				<?php _e( 'Nothing Found', 'echotheme' ); ?>
			</h1>
		</header>

		<div class="post-content">
			<p>
				<?php _e( 'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.', 'echotheme' ); ?>
			</p>
			<?php get_search_form(); ?>
		</div>
	</article>
	<?php endif ?>
</div> <!-- end #archive -->
<?php
get_sidebar();
get_footer();
?>