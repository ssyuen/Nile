import {
    getClosestCard,
    getClosestForm,
    PostFlags, promptConfirm, submitRemoval
} from "./ShippingPaymentCommon.js";

$(".remove-addr-btn").click(function (event) {
    let form = getClosestForm(event);
    let addressId = $(form).attr("nile-address-ident");
    submitRemoval(form, {name: "addressID", value: addressId});
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


/* LETS DO THE INPUT CHANGE DETECTION HERE */

var _isDirty = false;

$(':input').change(function () {
    _isDirty = true;
});

window.onbeforeunload = function (ev) {
    if (_isDirty) {
        promptConfirm(ev);
    }
};

$("#accountListings").on('click', function (e: Event) {
    if (_isDirty) {
        promptConfirm(e);
    }
});