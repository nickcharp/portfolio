<script>
$(document).ready(function() {
    // Collapse navbar on link click
    $('.navbar-nav .nav-link').on('click', function() {
        if ($('.navbar-toggler').is(':visible')) { // Only on mobile when toggler is visible
            $('.navbar-collapse').collapse('hide');
        }
    });
});
</script>