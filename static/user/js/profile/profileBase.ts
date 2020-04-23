$(document).scroll(function () {
    if ($(window).width() >= 992) {
        var y = $(document).scrollTop(),
            header = $("#accountListings");
        console.log(y);
        if (y >= (y + $('#mainContent').offset().top) || Math.floor(y) <= 230) {
            header.css({"position": "static", "width": "auto"});
            $("#scrollWelcome").hide('fast', function () {
                $("#scrollWelcome").remove();
            });
        } else {
            header.css({"position": "sticky", "width": "auto", "top": "20px"});
            let name = $("#name").html();

            if (!$("#scrollWelcome").length) {
                $(`<div id="scrollWelcome" class="mb-2 primary-md">Welcome Back, ${name}</div>`)
                    .insertBefore("#accountOverview");
            }
        }
    }
});