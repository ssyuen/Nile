$("#loginForm").on("submit", function () {
    let ref = $("#loginBtn");
    ref.html(`<i class="fas fa-spinner fa-pulse"></i>`);
    ref.prop("disabled", true);
});

$("#loginBtn").on("click", function () {
    $("loginForm").submit();
});