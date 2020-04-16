import { CountUp } from '../../jsplugin/countUp.min.js';
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
    let total = 0;
    let items = $(".sidebar-item-price").each(function (index, elem) {
        total += parseFloat(elem.innerHTML);
    });
    let ctr = new CountUp("checkoutTotalPrice", total, {
        decimalPlaces: 2,
        duration: 0.5,
        startVal: 0.00
    });
    if (!ctr.error) {
        ctr.start();
    }
    else {
        console.error(ctr.error);
    }
    $(".checkout-select").each(function () {
        $(this).children().first().attr("selected", "selected");
    });
});
/* For the Shipping Address */
$("#enterAddressToggle").on("click", function () {
    $("#newAddressEntry").collapse("show");
    $("#addressEntry").collapse("hide");
});
$("#chooseShippingToggle").on("click", function () {
    let ref = $("#newAddressEntry");
    if (ref.hasClass("show")) {
        ref.collapse("hide");
    }
    $("#addressEntry").collapse("hide");
});
$("#addressToggler").on("click", function () {
    if ($("#newAddressEntry").hasClass("show")) {
        $("#chooseShippingToggle").trigger("click");
    }
});
/* For the Payment Method */
$("#enterPaymentMethodToggle").on("click", function () {
    $("#newPaymentMethodEntry").collapse("show");
    $("#paymentMethodEntry").collapse("hide");
});
$("#choosePaymentMethodToggle").on("click", function () {
    let ref = $("#newPaymentMethodEntry");
    if (ref.hasClass("show")) {
        ref.collapse("hide");
    }
    $("#paymentMethodEntry").collapse("hide");
});
$("#paymentMethodToggler").on("click", function () {
    if ($("#newPaymentMethodEntry").hasClass("show")) {
        $("#choosePaymentMethodToggle").trigger("click");
    }
});
$(function () {
    let ref = $("#shippingAddressSelect");
    fillShippingForm(ref);
    ref.on("change", function () {
        fillShippingForm(this);
    });
    let ref2 = $("#paymentMethodSelect");
    fillPMForm(ref2);
    ref2.on("change", function () {
        fillPMForm(this);
    });
});
function fillShippingForm(select) {
    let option = $(select).find(":selected");
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
function fillPMForm(select) {
    let option = $(select).find(":selected");
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
$("#checkoutForm").on("submit", function () {
});
