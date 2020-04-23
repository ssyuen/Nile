var emailSubscription = <HTMLInputElement> document.getElementById("emailSubscription")


$(emailSubscription).change(function() {
    var flag
    if(this.checked) {
        var returnVal = confirm("Are you sure?");
        $(this).prop("checked", returnVal);
        flag = email.SUBSCRIBE
    }
    else {
        var returnVal = confirm("Are you sure?");
        $(this).prop("unchecked", returnVal);
        flag = email.UNSUBSCRIBE
    }
    $.ajax({
        url: '/nileuser/settings/',
        type: 'POST',
        data: {'flag': flag}
    });
});

enum email {
    SUBSCRIBE = "SUBSCRIBE",
    UNSUBSCRIBE = "UNSUBSCRIBE"
}
