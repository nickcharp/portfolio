$(document).ready(function() {
    // Handle non-dropdown nav-link clicks to collapse navbar
    $('.navbar-nav .nav-link').not('.dropdown-toggle').on('click', function() {
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // Prevent navbar collapse and ensure dropdown opens on Projects click
    $('.navbar-nav .dropdown-toggle').on('click', function(e) {
        if ($('.navbar-toggler').is(':visible')) {
            e.preventDefault(); // Stop default collapse behavior
            e.stopImmediatePropagation(); // Stop all event propagation
            const $this = $(this);
            const $dropdown = $this.next('.dropdown-menu');
            
            // If dropdown isn’t open, show it manually
            if (!$dropdown.hasClass('show')) {
                $this.dropdown('show');
            }
        }
    });

    // Collapse navbar when a dropdown-item is clicked
    $('.dropdown-item').on('click', function() {
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-collapse').collapse('hide');
        }
    });
});