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
});
$("#enterAddressToggle, #chooseShippingToggle").on("click", function () {
    $("#newAddressTogglerHidden").trigger("click");
});
$("#enterPaymentMethodToggle, #choosePaymentMethodToggle").on("click", function () {
    $("#newPMTogglerHidden").trigger("click");
});
