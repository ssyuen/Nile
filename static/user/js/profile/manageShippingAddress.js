import { GeneralFormValidity, getClosestCard, getClosestForm, isDirty, submit, submitRemoval, submitUpdate } from "./ShippingPaymentCommon.js";
import { RegistrationInputValidator, PURPOSE } from "../../../common/js/registration/regValidation.js";
$(".remove-addr-btn").click(function (event) {
    let form = getClosestForm(event);
    let addressId = $(form).attr("nile-address-ident");
    submitRemoval(form, this, { name: "addressID", value: addressId });
});
$(".update-addr-btn").click(function (event) {
    let form = getClosestForm(event);
    if (!isDirty()) {
        window.alert("No changes were detected");
        event.preventDefault();
        return false;
    }
    let card = getClosestCard(event);
    let addressId = $(form).attr("nile-address-ident");
    let ident = $(form).attr("nile-form-ident");
    const vc = GeneralFormValidity.get(ident);
    let errLoc = $(card).find(".pre-content");
    if (!vc.validateAll(errLoc)) {
        event.preventDefault();
        return false;
    }
    submitUpdate(form, this, { name: "addressID", value: addressId });
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
$("#createShippingAddress").click(function (event) {
    let sel = ".info-message";
    if (!createValidator.validateAll(sel)) {
        event.preventDefault();
        return false;
    }
    submit($("#createShippingAddressForm"), this);
});
let createValidator = new RegistrationInputValidator();
Array('input', 'focusin').forEach((evt) => {
    $("#addAddressStreetAddress").bind(evt, function () {
        createValidator.setValidity(this, this, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint(this.value));
    });
    //Same situation as above
    $("#addAddressZip").bind(evt, function () {
        createValidator.setValidity(this, this, PURPOSE.Zip, PURPOSE.Zip.constraint(this.value));
    });
    $("#addAddressCity").bind(evt, function () {
        createValidator.setValidity(this, this, PURPOSE.City, PURPOSE.City.constraint(this.value));
    });
});
Array('change', 'focusin').forEach((evt) => {
    $("#addAddressState").bind(evt, function () {
        createValidator.setValidity(this, this, PURPOSE.State, PURPOSE.State.constraint(this));
    });
    $("#addAddressCountry").bind(evt, function () {
        createValidator.setValidity(this, this, PURPOSE.Country, PURPOSE.Country.constraint(this));
    });
});
