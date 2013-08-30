<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<?php ewd_meta_tags(); ?> 
	<title>
		<?php ewd_title(); ?> 
	</title>
	<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/images/favicon.png" />
	<?php
	// stuff we wanna call before wp_head
	ewd_pre_wp_head();
	// call the wp_head stuff
	wp_head();
	// stuff we wana call after wp_head
	ewd_post_wp_head();
	?> 
	<!--[if lt IE 9]>
		<script src="<?php echo get_template_directory_uri() ?>/js/html5.js"></script>
		<link rel="stylesheet" type="text/css" href="<?php echo get_template_directory_uri(); ?>/css/ie.css" />
	<![endif]-->
	
<!-- Website developed by http://www.echowebdynamics.com -->
</head>
<body <?php body_class(); ?>>
	<div id="wrapper">
		<div id="header">
			<div class="container">
				<?php
				get_template_part('part/theme', 'logo');
				get_template_part('part/theme', 'navigation');
				?> 
			</div> <!-- end #header .container -->
		</div> <!-- end #header -->
		
		<div id="content">
			<div class="container">