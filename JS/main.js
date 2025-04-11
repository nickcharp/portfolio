$(document).ready(function() {
    // Collapse navbar only when a dropdown-item is clicked
    $('.dropdown-item').on('click', function() {
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-collapse').collapse('hide');
        }
    });
});