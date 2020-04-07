enum PostFlags {
    REMOVE = "REMOVE_FLAG",
    EDIT = "EDIT_FLAG",
    CREATE = "CREATE_FLAG"
}

$(".remove-addr-btn").click(function (event) {

    let form = getClosestForm(event);
    let addressId = $(form).attr("nile-address-ident");
    let card = getClosestCard(event);

    $(form).submit(function (e) {

        let ans = confirm("Are you sure you want to remove this address?");

        if (!ans) {
            e.preventDefault();
            return false;
        }

        var input = $("<input>").attr("type", "hidden").attr("name", "addressID").val(addressId);
        var flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.REMOVE);
        $(form).append(input, flag);
    })
});


$(".update-addr-btn").click(function (event) {
    let form = getClosestForm(event);
    let addressId = $(form).attr("nile-address-ident");
    let card = getClosestCard(event);

    $(form).submit(function () {
        var input = $("<input>").attr("type", "hidden").attr("name", "addressID").val(addressId);
        var flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.EDIT);
        $(form).append(input, flag);
    })
});

$("#createShippingAddress").click(function (event) {
    $("#createShippingAddressForm").submit(function () {
        var flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.CREATE);
        $(this).append(flag);
    })
});

$(".edit-btn").click(function (event) {
    let form: HTMLFormElement = <HTMLFormElement><any>$(getClosestCard(event)).find("form").first();
    $(form).find("input, select").removeAttr("readonly disabled")
});


$(":input").click(function (event) {
    if ($(this).attr("readonly") || $(this).attr("readonly")) {
        alert("Click the EDIT button to change values");
    }
});

function getClosestForm(event): HTMLFormElement {
    let buttonCaller: HTMLButtonElement = event.target;
    return <HTMLFormElement><any>$(buttonCaller).closest("form")[0];
}

function getClosestCard(event): HTMLElement {
    let buttonCaller: HTMLButtonElement = event.target;
    return <HTMLElement><any>$(buttonCaller).closest('.card')[0];
}

function promptConfirm(e: Event) {
    let exit: boolean = true;
    let conf = confirm("You have unsaved changes. Are you sure you want to continue?");
    exit = conf;
    if (!exit) {
        e.preventDefault();
        return false;
    }
}

/* LETS DO THE INPUT CHANGE DETECTION HERE */

var _isDirty = false;

$(':input').change(function () {
    _isDirty = true;
});

window.onbeforeunload = function (ev) {
    promptConfirm(ev);
};

$("#accountListings").on('click', function (e: Event) {
    promptConfirm(e);
});