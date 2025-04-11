$(document).ready(function() {
    // Collapse navbar on nav-link click, excluding dropdown-toggle
    $('.navbar-nav .nav-link:not(.dropdown-toggle)').on('click', function() {
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // Collapse navbar on dropdown-item click
    $('.dropdown-item').on('click', function() {
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // Prevent dropdown-toggle from closing navbar immediately
    $('.navbar-nav .dropdown-toggle').on('click', function(e) {
        if ($('.navbar-toggler').is(':visible')) {
            e.stopPropagation(); // Stop event from triggering navbar collapse
        }
    });
});