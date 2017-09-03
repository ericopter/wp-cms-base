/*
    Clear default form values
*/
function fancyForms() {
    // add remove default form values
    $('form input[type=text], form textarea').each(function() {
        var val = $(this).val();

        $(this).focus(function() {
            if ($(this).val() == val) {
                $(this).val('');
            };
        });

        $(this).blur(function() {
            if ($(this).val() == '') {
                $(this).val(val);
            };
        });
    });

}

/*
    various fixes for the footer section
*/
function footerFixes() {

    // allow static text added in WP menu to be treated as such
    $('#footer-nav a').each(function(e) {
        if ($(this).attr('href') == undefined) {
            $(this).addClass('no-decoration');
        }
    });


    // hide the footer nav last pipe ( | ) for ie
    $('#footer-nav li:last-child span').hide();
}

// Content Toggle
jQuery(function($){
    // Initial state of toggle (hide)
    $(".slide_toggle_content").hide();
    // Process Toggle click (http://api.jquery.com/toggle/)
    $(".slide_toggle").toggle(function(){
        $(this).addClass("clicked");
        // $(this).html('Less&hellip;');
    }, function () {
        $(this).removeClass("clicked");
        // $(this).html('More...');
    });
    // Toggle animation (http://api.jquery.com/slideToggle/)
    $(".slide_toggle").click(function(){
        $(this).prev(".slide_toggle_content").slideToggle();
    });
});

// Tabs code
jQuery(function($){
    $('ul.tabs > li > a').click(function(e) {
        //Get Location of tab's content
        var contentLocation = $(this).attr('href');

        //Let go if not a hashed one
        if(contentLocation.charAt(0)=="#") {

            e.preventDefault();

            //Make Tab Active
            $(this).parent().siblings().children('a').removeClass('active');
            $(this).addClass('active');

            //Show Tab Content & add active class
            $(contentLocation).show().addClass('active').siblings().hide().removeClass('active');
        }
    })
});

/*
Function Definition for making columns even height.
*/
$.fn.evenColumns = function() {
    // create the variable
    var max = 0;

    // reset any heights if we are resizing...
    $(this).each(function() {
        $(this).css('height', 'auto');
    });

    // determine the biggest object
    $(this).each(function() {
        if ($(this).innerHeight() > max) {
            max = $(this).innerHeight();
        }
    })

    // set the others to the max height
    $(this).each(function() {
        if ($(this).innerHeight() < max) {
            $(this).innerHeight(max);
        }
    });
}