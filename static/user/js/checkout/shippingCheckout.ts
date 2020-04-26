import {CountUp} from "../../../jsplugin/countUp.min.js";
import * as checkout from "./checkout.js";
import {PURPOSE, RegistrationInputValidator} from "../../../common/js/registration/regValidation.js";
import {post, serializedToObject} from "./checkoutUtil.js";
import {replaceBtn} from "../../../common/js/utility/util.js";

const shippingSelect: JQuery = $("#shippingAddressSelect");
const FORM: JQuery = $("#dummyForm");
const CONT_BTN = $("#contToPayBtn");

/* For the Shipping Address */
const shipRad: JQuery = $("#chooseShippingToggle");
const shipToggler: JQuery = $("#addressToggler");
const entShipRad: JQuery = $("#enterAddressToggle");
const chooseShippingToggleLabel: JQuery = $("#chooseShippingToggleLabel");
const addrEntry: JQuery = $("#addressEntry");
const newAddrEntry: JQuery = $("#newAddressEntry");

let subtotalCounter: CountUp;

if (shippingSelect.length) {
    checkout.stopAllInput($(addrEntry));
    fillShippingForm(shippingSelect);
    shippingSelect.on("change", function () {
        fillShippingForm($(this));
    });
} else {
    checkout.forceEntry(newAddrEntry, chooseShippingToggleLabel, shipToggler, "Enter a Shipping Address");

    shipRad.removeAttr("checked");
    entShipRad.attr("checked", "checked");
    $(".ship-radio-holder").hide();
}

entShipRad.on("click", function () {
    $(this).attr("checked", "checked");
    shipRad.removeAttr("checked");
    shipToggler.text("View");
    (<any>newAddrEntry).collapse(<any>"show");
    (<any>addrEntry).collapse(<any>"hide");
});


shipRad.on("click", function () {
    $(this).attr("checked", "checked");
    entShipRad.removeAttr("checked");
    if (newAddrEntry.hasClass("show")) {
        (<any>newAddrEntry).collapse(<any>"hide");
    }
    (<any>addrEntry).collapse(<any>"hide");
});


shipToggler.on("click", function () {
    checkout.switchToggler(this);
    if (newAddrEntry.hasClass("show")) {
        shipRad.trigger("click");
    }
});


function fillShippingForm(select: JQuery) {
    let option: HTMLOptionElement = <HTMLOptionElement><any>select.find(":selected");
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
const STREET_ADDR: HTMLInputElement = document.getElementById("newAddressStreetAddress") as HTMLInputElement;
const ZIP: HTMLInputElement = document.getElementById("newAddressZip") as HTMLInputElement;
const CITY: HTMLInputElement = document.getElementById("newAddressCity") as HTMLInputElement;
const STATE: HTMLSelectElement = document.getElementById("newAddressState") as HTMLSelectElement;
const COUNTRY: HTMLSelectElement = document.getElementById("newAddressCountry") as HTMLSelectElement;


const vcSH = new RegistrationInputValidator();
Array<string>('input', 'focusin').forEach((evt: string) => {

    STREET_ADDR.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint(this.value))
    });

    ZIP.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.Zip, PURPOSE.Zip.constraint(this.value))
    });

    CITY.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.City, PURPOSE.City.constraint(this.value))
    });
});

Array<string>('change', 'focusin').forEach((evt: string) => {
    STATE.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.State, PURPOSE.State.constraint(this))
    });

    COUNTRY.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.Country, PURPOSE.Country.constraint(this))
    });
});


function proceedShippingSubmit() {
    let shipOpt: HTMLOptionElement = <HTMLOptionElement><any>$(shippingSelect).find(<any>":selected");

    let shipPayload = {};

    if (shipRad.is(":checked")) {
        shipPayload["SHIPPING_IDENT"] = $(shipOpt).attr("nile-shipping-ident");
        shipPayload["SHIPPING_STATE"] = $(shipOpt).attr("nile-shipping-state");
    } else if (entShipRad.is(":checked")) {

        if (!checkout.checkEmptyInput(newAddrEntry)) {
            $('<input type="submit">').hide().appendTo(FORM).click().remove();
            return false;
        }
        if (!vcSH.validateAll('.card-title')) {
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