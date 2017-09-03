$(document).ready(function() {
	$('body').removeClass('no-js');
	$('body').addClass('js-enabled');

	fancyForms();
	footerFixes();

	jQuery('.hori-nav').superfish({
		speed : 'fast'
	});

	console.log('done');
});