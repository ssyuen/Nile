import {CountUp} from '../../../jsplugin/countUp.min.js';
import {post, serializedToObject} from "./checkoutUtil.js";
import {replaceBtn} from "../../../common/js/utility/util.js";

const FORM: HTMLFormElement = <HTMLFormElement><any>$("#dummyForm");
const CHECKOUT_BTN: HTMLButtonElement = <HTMLButtonElement><any>$("#checkoutBtn");

$(function () {
    if (!$("#paymentMethodSelect").length) {
        $("#paymentMethodEntry").addClass("show");
        $("#choosePaymentMethodToggleLabel").text("Enter a Payment Method")
            .removeClass("custom-control-label")
            .closest(".custom-control")
            .removeClass("custom-control");
        $("#paymentMethodToggler").hide();
    }

    if (!$("#shippingAddressSelect").length) {
        $("#addressEntry").addClass("show");
        $("#chooseShippingToggleLabel").text("Enter a Shipping Address")
            .removeClass("custom-control-label")
            .closest(".custom-control")
            .removeClass("custom-control");
        $("#addressToggler").hide();

    }

    let total: number = 0;
    let items = $(".sidebar-item-price").each(function (index: number, elem: HTMLSpanElement) {
        total += parseFloat(elem.innerHTML);
    });
    let ctr = new CountUp("checkoutTotalPrice", total, {
        decimalPlaces: 2,
        duration: 0.5,
        startVal: 0.00
    });
    if (!ctr.error) {
        ctr.start();
    } else {
        console.error(ctr.error);
    }

    $(".checkout-select").each(function () {
        $(this).children().first().attr("selected", "selected");
    });
});

//* For the Shipping Address */
var shipRad = $("#chooseShippingToggle");
var shipToggler = $("#addressToggler");
var entShipRad = $("#enterAddressToggle");
var addrEntry = $("#addressEntry");
var newAddrEntry = $("#newAddressEntry");

entShipRad.on("click", function () {
    $(this).attr("checked", "checked");
    shipRad.removeAttr("checked");
    shipToggler.text("View");
    (<any>newAddrEntry).collapse("show");
    (<any>newAddrEntry).collapse("hide");
});

shipRad.on("click", function () {
    $(this).attr("checked", "checked");
    entShipRad.removeAttr("checked");
    if (newAddrEntry.hasClass("show")) {
        (<any>newAddrEntry).collapse("hide");
    }
    (<any>addrEntry).collapse("hide");
});

shipToggler.on("click", function () {
    switchToggler(this);
    if (newAddrEntry.hasClass("show")) {
        shipRad.trigger("click");
    }
});

var pmRad = $("#choosePaymentMethodToggle");
var pmToggler = $("#paymentMethodToggler");
var entPMRad = $("#enterPaymentMethodToggle");
var pmEntry = $("#paymentMethodEntry");
var newPMEntry = $("#newPaymentMethodEntry");
/* For the Payment Method */

entPMRad.on("click", function () {
    $(this).attr("checked", "checked");
    pmRad.removeAttr("checked");
    pmToggler.text("View");
    (<any>newPMEntry).collapse("show");
    (<any>pmEntry).collapse("hide");
});

pmRad.on("click", function () {
    $(this).attr("checked", "checked");
    $("#enterPaymentMethodToggle").removeAttr("checked");
    if (newPMEntry.hasClass("show")) {
        (<any>newPMEntry).collapse("hide");
    }
    (<any>pmEntry).collapse("hide");
});

pmToggler.on("click", function () {
    switchToggler(this);
    if (newPMEntry.hasClass("show")) {
        pmRad.trigger("click");
    }
});

function switchToggler(toggler: HTMLElement | string | any) {
    if ($(toggler).text() === "View") {
        $(toggler).text("Close View");
    } else {
        $(toggler).text("View");
    }
}

$(function () {
    let ref = <any>$("#shippingAddressSelect");
    fillShippingForm(ref as HTMLSelectElement);

    ref.on("change", function () {
        fillShippingForm(this);
    });

    let ref2 = <any>$("#paymentMethodSelect");
    fillPMForm(ref2 as HTMLSelectElement);

    ref2.on("change", function () {
        fillPMForm(this);
    });
});

function fillShippingForm(select: HTMLSelectElement) {
    let option: HTMLOptionElement = <HTMLOptionElement><any>$(select).find(":selected");
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
function fillPMForm(select: HTMLSelectElement) {
    let option: HTMLOptionElement = <HTMLOptionElement><any>$(select).find(":selected");
    /****** CARD INFORMATION ******/
    $("#paymentMethodEntry #checkoutCardHolderFirstName").attr("value", $(option).attr("nile-card-fname"));
    $("#paymentMethodEntry label[for=checkoutCardHolderFirstName]").addClass("active");
    $("#paymentMethodEntry #checkoutCardHolderLastName").attr("value", $(option).attr("nile-card-lname"));
    $("#paymentMethodEntry label[for=checkoutCardHolderLastName]").addClass("active");
    $("#paymentMethodEntry #checkoutCCEXP").attr("value", $(option).attr("nile-card-expiry"));
    $("#paymentMethodEntry label[for=checkoutCCEXP]").addClass("active");
    /****** END CARD INFORMATION ******/
    $("#paymentMethodEntry #checkoutBillingStreetAddress").attr("value", $(option).attr("nile-billing-street1"));
    $("#paymentMethodEntry label[for=checkoutBillingStreetAddress]").addClass("active");
    let street2 = $(option).attr("nile-billing-street2");
    if (street2.length) {
        $("#paymentMethodEntry #checkoutBillingApartmentOrSuite").attr("value", $(option).attr("nile-billing-street2"));
        $("#paymentMethodEntry label[for=checkoutBillingApartmentOrSuite]").addClass("active");
    }
    $("#paymentMethodEntry #checkoutBillingAddressZip").attr("value", $(option).attr("nile-billing-zip"));
    $("#paymentMethodEntry label[for=checkoutBillingAddressZip]").addClass("active");
    $("#paymentMethodEntry #checkoutBillingAddressCity").attr("value", $(option).attr("nile-billing-city"));
    $("#paymentMethodEntry label[for=checkoutBillingAddressCity]").addClass("active");
    $("#paymentMethodEntry #checkoutBillingAddressState").val($(option).attr("nile-billing-state"));
    $("#paymentMethodEntry #checkoutBillingAddressCountry").val($(option).attr("nile-billing-country"));
}

function proceedCheckoutSubmit() {
    let shipOpt: HTMLOptionElement = <HTMLOptionElement><any>$("#shippingAddressSelect").find(":selected");
    let payOpt: HTMLOptionElement = <HTMLOptionElement><any>$("#paymentMethodSelect").find(":selected");

    let shipPayload = {}, paymentPayload = {};

    if (shipRad.is(":checked")) {
        shipPayload["SHIPPING_IDENT"] = $(shipOpt).attr("nile-shipping-ident");
    } else if (entShipRad.is(":checked")) {
        shipPayload = serializedToObject(newAddrEntry.find("input, select"));
    }
    if (pmRad.is(":checked")) {
        paymentPayload["PAYMENT_IDENT"] = $(payOpt).attr("nile-pm-ident");
    } else if (entPMRad.is(":checked")) {
        paymentPayload = serializedToObject(newPMEntry.find("input, select"));
    }
    replaceBtn(CHECKOUT_BTN);
    let final: Object = $.extend(shipPayload, paymentPayload);
    console.log(final);
    post(FORM.action, "POST", final);
}

$(CHECKOUT_BTN).on("click", function () {
    proceedCheckoutSubmit();
});


