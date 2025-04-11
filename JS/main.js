$(document).ready(function() {
    // Collapse navbar on non-dropdown nav-link clicks
    $('.navbar-nav .nav-link').not('.dropdown-toggle').on('click', function() {
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // Collapse navbar when a dropdown-item is clicked
    $('.dropdown-item').on('click', function() {
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-collapse').collapse('hide');
        }
    });
});