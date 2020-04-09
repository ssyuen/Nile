import {
    GeneralFormValidity,
    getClosestCard,
    getClosestForm,
    PostFlags, promptConfirm, submitRemoval
} from "./ShippingPaymentCommon.js";
import {InputValidationComplex} from "../inputvalidation";

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


$(".edit-btn").click(function (event) {
    let form: HTMLFormElement = <HTMLFormElement><any>$(getClosestCard(event)).find("form").first();
    $(form).find("input, select").removeAttr("readonly disabled");
    GeneralFormValidity.set(form, new InputValidationComplex());


});