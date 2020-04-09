import { GeneralFormValidity, getClosestCard, getClosestForm, PostFlags, submitRemoval, submitUpdate } from "./ShippingPaymentCommon.js";
import { RegistrationInputValidator, PURPOSE } from "../regValidation.js";
$(".remove-addr-btn").click(function (event) {
    let form = getClosestForm(event);
    let addressId = $(form).attr("nile-address-ident");
    submitRemoval(form, { name: "addressID", value: addressId });
});
$(".update-addr-btn").click(function (event) {
    let form = getClosestForm(event);
    let card = getClosestCard(event);
    let addressId = $(form).attr("nile-address-ident");
    let ident = $(form).attr("nile-form-ident");
    const vc = GeneralFormValidity.get(ident);
    let errLoc = $(card).find(".pre-content");
    if (!vc.validateAll(errLoc)) {
        event.preventDefault();
        return false;
    }
    submitUpdate(form, { name: "addressID", value: addressId });
});
$("#createShippingAddress").click(function (event) {
    $("#createShippingAddressForm").submit(function () {
        var flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.CREATE);
        $(this).append(flag);
    });
});
$(".edit-btn").click(function (event) {
    let form = $(getClosestCard(event)).find("form").first();
    $(form).find("input, select").removeAttr("readonly disabled");
    let ident = $(form).attr("nile-form-ident");
    if (!GeneralFormValidity.has(ident)) {
        GeneralFormValidity.set(ident, new RegistrationInputValidator());
    }
    var vc = GeneralFormValidity.get(ident);
    Array('input', 'focusin').forEach((evt) => {
        $(form).find(".targetStreet1").bind(evt, function () {
            vc.setValidity(this, this, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint(this.value));
        });
        //Same situation as above
        $(form).find(".targetZip").bind(evt, function () {
            vc.setValidity(this, this, PURPOSE.Zip, PURPOSE.Zip.constraint(this.value));
        });
        $(form).find(".targetCity").bind(evt, function () {
            vc.setValidity(this, this, PURPOSE.City, PURPOSE.City.constraint(this.value));
        });
    });
});
