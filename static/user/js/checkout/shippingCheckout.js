import * as checkout from "./checkout.js";
import { PURPOSE, RegistrationInputValidator } from "../../../common/js/registration/regValidation.js";
import { post, serializedToObject } from "./checkoutUtil.js";
import { replaceBtn } from "../../../common/js/utility/util.js";
const shippingSelect = $("#shippingAddressSelect");
const FORM = $("#dummyForm");
const CONT_BTN = $("#contToPayBtn");
/* For the Shipping Address */
const shipRad = $("#chooseShippingToggle");
const shipToggler = $("#addressToggler");
const entShipRad = $("#enterAddressToggle");
const chooseShippingToggleLabel = $("#chooseShippingToggleLabel");
const addrEntry = $("#addressEntry");
const newAddrEntry = $("#newAddressEntry");
let subtotalCounter;
if (shippingSelect.length) {
    checkout.stopAllInput($(addrEntry));
    fillShippingForm(shippingSelect);
    shippingSelect.on("change", function () {
        fillShippingForm($(this));
    });
}
else {
    checkout.forceEntry(newAddrEntry, chooseShippingToggleLabel, shipToggler, "Enter a Shipping Address");
    shipRad.removeAttr("checked");
    entShipRad.attr("checked", "checked");
    $(".ship-radio-holder").hide();
}
entShipRad.on("click", function () {
    $(this).attr("checked", "checked");
    shipRad.removeAttr("checked");
    shipToggler.text("View");
    newAddrEntry.collapse("show");
    addrEntry.collapse("hide");
});
shipRad.on("click", function () {
    $(this).attr("checked", "checked");
    entShipRad.removeAttr("checked");
    if (newAddrEntry.hasClass("show")) {
        newAddrEntry.collapse("hide");
    }
    addrEntry.collapse("hide");
});
shipToggler.on("click", function () {
    checkout.switchToggler(this);
    if (newAddrEntry.hasClass("show")) {
        shipRad.trigger("click");
    }
});
function fillShippingForm(select) {
    let option = select.find(":selected");
    $("#addressEntry #checkoutAddressStreetAddress").attr("value", $(option).attr("nile-shipping-street1"));
    $("#addressEntry label[for=checkoutAddressStreetAddress]").addClass("active");
    let street2 = $(option).attr("nile-shipping-street2");
    if (street2.length) {
        $("#addressEntry #checkoutAddressApartmentOrSuite").attr("value", $(option).attr("nile-shipping-street2"));
        $("#addressEntry label[for=checkoutAddressApartmentOrSuite]").addClass("active");
    }
    $("#addressEntry #checkoutAddressZip").attr("value", $(option).attr("nile-shippping-zip"));
    $("#addressEntry label[for=checkoutAddressZip]").addClass("active");
    $("#addressEntry #checkoutAddressCity").attr("value", $(option).attr("nile-shipping-city"));
    $("#addressEntry label[for=checkoutAddressCity]").addClass("active");
    $("#addressEntry #checkoutAddressState").val($(option).attr("nile-shipping-state"));
    $("#addressEntry #checkoutAddressCountry").val($(option).attr("nile-shipping-country"));
}
/* Input Validation amirite? */
/*
    Optional Address Fields
    There's no need for city, state, country, and apt/suite because they aren't error prone
*/
const STREET_ADDR = document.getElementById("newAddressStreetAddress");
const ZIP = document.getElementById("newAddressZip");
const CITY = document.getElementById("newAddressCity");
const STATE = document.getElementById("newAddressState");
const COUNTRY = document.getElementById("newAddressCountry");
const vcSH = new RegistrationInputValidator();
Array('input', 'focusin').forEach((evt) => {
    STREET_ADDR.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint(this.value));
    });
    ZIP.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.Zip, PURPOSE.Zip.constraint(this.value));
    });
    CITY.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.City, PURPOSE.City.constraint(this.value));
    });
});
Array('change', 'focusin').forEach((evt) => {
    STATE.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.State, PURPOSE.State.constraint(this));
    });
    COUNTRY.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.Country, PURPOSE.Country.constraint(this));
    });
});
function proceedShippingSubmit() {
    let shipOpt = $(shippingSelect).find(":selected");
    let shipPayload = {};
    if (shipRad.is(":checked")) {
        shipPayload["SHIPPING_IDENT"] = $(shipOpt).attr("nile-shipping-ident");
    }
    else if (entShipRad.is(":checked")) {
        if (!checkout.checkEmptyInput(newAddrEntry) || !vcSH.validateAll('.card-title')) {
            return false;
        }
        shipPayload = serializedToObject(newAddrEntry.find("input, select"));
        shipPayload["REMEMBER_SHIPPING"] = $("#rememberShipping").attr("value");
    }
    replaceBtn(CONT_BTN);
    post(FORM.attr("action"), "POST", shipPayload);
}
CONT_BTN.on("click", function () {
    proceedShippingSubmit();
});
