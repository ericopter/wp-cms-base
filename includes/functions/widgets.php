<?php
/**
 * This file defines the sidebars, includes custom widgets
 * and defines any common widget related functions
 */
return;
// Array of custom post type files
$widgets = array(
	'recent-posts',
	'twitter'
);

foreach ($widgets as $file) {
	$file = INCLUDEPATH . 'widgets/' . $file . '.php';

	if (is_file($file)) {
		require_once($file);
	}
}