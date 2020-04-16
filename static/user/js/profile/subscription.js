var emailSubscription = document.getElementById("emailSubscription");
$(emailSubscription).change(function () {
    var flag;
    if (this.checked) {
        var returnVal = confirm("Are you sure?");
        $(this).prop("checked", returnVal);
        flag = email.SUBSCRIBE;
    }
    else {
        var returnVal = confirm("Are you sure?");
        $(this).prop("unchecked", returnVal);
        flag = email.UNSUBSCRIBE;
    }
    $.ajax({
        url: '/nileuser/subscriptions/',
        type: 'POST',
        data: { 'flag': flag }
    });
});
var email;
(function (email) {
    email["SUBSCRIBE"] = "SUBSCRIBE";
    email["UNSUBSCRIBE"] = "UNSUBSCRIBE";
})(email || (email = {}));
