$("#loginForm").on("submit", function () {
    let ref = $("#loginBtn");
    ref.text("Logging in");
    ref.prop("disabled", true);
});
