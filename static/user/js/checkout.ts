import {CountUp} from '../../jsplugin/countUp.min.js';

$(function () {
    if (!$("#billingAddressSelect").length) {
        $("#billingAddressEntry").addClass("show");
        $("#billingAddressSelectLabel").text("Enter a Billing Address");
    }

    if (!$("#shippingAddressSelect").length) {
        $("#addressEntry").addClass("show");
        $("#shippingAddressSelectLabel").text("Enter a Shipping Address");
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
});
