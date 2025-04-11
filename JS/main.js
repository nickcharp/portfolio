$(document).ready(function() {
    // Collapse navbar on non-dropdown nav-link clicks
    $('.navbar-nav .nav-link:not(.dropdown-toggle)').on('click', function() {
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

    // Prevent navbar collapse when dropdown-toggle is clicked on mobile
    $('.navbar-nav .dropdown-toggle').on('click', function(e) {
        if ($('.navbar-toggler').is(':visible')) {
            e.preventDefault(); // Prevent default Bootstrap collapse behavior
            e.stopPropagation(); // Stop event bubbling
            // Manually toggle dropdown if not already open
            if (!$(this).parent().hasClass('show')) {
                $(this).dropdown('toggle');
            }
        }
    });

    // Keep navbar open when dropdown is shown
    $('.dropdown').on('shown.bs.dropdown', function() {
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-collapse').collapse('show'); // Ensure navbar stays open
        }
    });
});