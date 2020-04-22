import {CountUp} from '../../../jsplugin/countUp.min.js';
import {post, SALES_TAX, serializedToObject} from "./checkoutUtil.js";
import {replaceBtn} from "../../../common/js/utility/util.js";
import {CreditCard, PURPOSE, RegistrationInputValidator} from "../../../common/js/registration/regValidation.js";
import {PromotionCheckoutValidation} from "./promoValidation.js";

const COUNTER_DURATION = 0.5;
const FORM = $("#dummyForm");
const CHECKOUT_BTN = $("#checkoutBtn");
const CHECKOUT_TOTAL_PRICE = $("#checkoutTotalPrice");
const SUBTOTAL = $(CHECKOUT_TOTAL_PRICE).html();
const SHIPPING_TOTAL = $("#shippingTotal");
const SUBTOTAL_PLUS_SHIPPING = parseFloat(CHECKOUT_TOTAL_PRICE.html()) + parseFloat(SHIPPING_TOTAL.html());
const arrSum = arr => arr.reduce((a, b) => a + b, 0);
const convertToNumber = arr => arr.map(Number);
//* For the Shipping Address */
const shipRad = $("#chooseShippingToggle");
const shipToggler = $("#addressToggler");
const entShipRad = $("#enterAddressToggle");
const chooseShippingToggleLabel = $("#chooseShippingToggleLabel");
const addrEntry = $("#addressEntry");
const newAddrEntry = $("#newAddressEntry");
/* For the Payment Method */
const pmRad = $("#choosePaymentMethodToggle");
const pmToggler = $("#paymentMethodToggler");
const entPMRad = $("#enterPaymentMethodToggle");
const choosePMToggleLabel = $("#choosePaymentMethodToggleLabel");
const pmEntry = $("#paymentMethodEntry");
const newPMEntry = $("#newPaymentMethodEntry");
const paymentSelect = $("#paymentMethodSelect");
const shippingSelect = $("#shippingAddressSelect");
if (paymentSelect.length) {
    stopAllInput(pmEntry);
    fillPMForm(paymentSelect);
    paymentSelect.on("change", function () {
        fillPMForm($(this));
    });
}
if (shippingSelect.length) {
    stopAllInput($(addrEntry));
    fillShippingForm(shippingSelect);
    shippingSelect.on("change", function () {
        fillShippingForm($(this));
        let num = updateSalesTax($(this));
        updateTotal(num);
    });
}
let counter;
let salesTaxCounter;
salesTaxCounter = new CountUp('salesTax', 0.00, {
    decimalPlaces: 2,
    duration: COUNTER_DURATION,
    startVal: 0.00
});
startCounter(salesTaxCounter);
let salestax = 0;
if (!shippingSelect.length) {
    forceEntry(newAddrEntry, chooseShippingToggleLabel, shipToggler, "Enter a Shipping Address", 1 /* SHIPPING */);
} else {
    salestax = updateSalesTax(shippingSelect);
}
if (!paymentSelect.length) {
    forceEntry(newPMEntry, choosePMToggleLabel, pmToggler, "Enter a Payment Method", 2 /* PAYMENT_METHOD */);
}
let total = 0;
$(".sidebar-item-price").each(function (index, elem) {
    total += parseFloat(elem.innerHTML);
});
counter = new CountUp(CHECKOUT_TOTAL_PRICE.attr('id'), total + salestax, {
    decimalPlaces: 2,
    duration: COUNTER_DURATION,
    startVal: 0.00
});
startCounter(counter);
function stopAllInput(entry) {
    $(entry).find('select').prop("disabled", true);
    $(entry).find('input').prop("readonly", true);
}
function startCounter(ctr) {
    if (!ctr.error) {
        ctr.start();
    } else {
        console.error(ctr.error);
    }
}
function forceEntry(formEntry, toggleLabel, toggler, toggleText, inputType) {
    formEntry.addClass("show");
    toggleLabel.text(toggleText)
        .removeClass("custom-control-label")
        .closest(".custom-control")
        .removeClass("custom-control");
    toggler.hide();
    if (inputType == 1 /* SHIPPING */) {
        shipRad.removeAttr("checked");
        entShipRad.attr("checked", "checked");
        $(".ship-radio-holder").hide();
    } else {
        pmRad.removeAttr("checked");
        entPMRad.attr("checked", "checked");
        $(".pm-radio-holder").hide();
    }
}
function updateSalesTax(sel, withOption = true) {
    let salesTax = (withOption === true ?
        SALES_TAX[sel.find(":selected").attr("nile-shipping-state")] :
        SALES_TAX[sel.find(":selected").val()]);
    salesTaxCounter.update(salesTax);
    return salesTax;
}
function switchToggler(toggler) {
    if ($(toggler).text() === "View") {
        $(toggler).text("Close View");
    } else {
        $(toggler).text("View");
    }
}
function updateTotal(...args) {
    let sum = arrSum(args);
    let newVal = SUBTOTAL_PLUS_SHIPPING + sum;
    counter.update(newVal);
}
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
function fillPMForm(select) {
    let option = select.find(":selected");
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
/*
 * Optional Billing Address Fields
 */
const CARD_F_NAME = document.getElementById("newCardHolderFirstName");
const CARD_L_NAME = document.getElementById("newCardHolderLastName");
const CCN = document.getElementById("newCCN");
const CVV = document.getElementById("newCVV");
const BILLING_ST = document.getElementById("newBillingStreetAddress");
const BILLING_ZIP = document.getElementById("newBillingAddressZip");
const BILLING_CITY = document.getElementById("newBillingAddressCity");
const BILLING_STATE = document.getElementById("newBillingAddressState");
const BILLING_COUNTRY = document.getElementById("newBillingAddressCountry");
const vcSH = new RegistrationInputValidator();
const vcBL = new RegistrationInputValidator();
const cc = new CreditCard();
function proceedCheckoutSubmit() {
    let shipOpt = $(shippingSelect).find(":selected");
    let payOpt = $(paymentSelect).find(":selected");
    let shipPayload = {}, paymentPayload = {};
    if (shipRad.is(":checked")) {
        shipPayload["SHIPPING_IDENT"] = $(shipOpt).attr("nile-shipping-ident");
    } else if (entShipRad.is(":checked")) {
        if (!checkEmptyInput(newAddrEntry) || !vcSH.validateAll('.card-title')) {
            return false;
        }
        shipPayload = serializedToObject(newAddrEntry.find("input, select"));
        shipPayload["REMEMBER_SHIPPING"] = $("#rememberShipping").attr("value");
    }
    if (pmRad.is(":checked")) {
        paymentPayload["PAYMENT_IDENT"] = $(payOpt).attr("nile-pm-ident");
    } else if (entPMRad.is(":checked")) {
        if (!checkEmptyInput(newPMEntry) || !vcBL.validateAll('.card-title')) {
            return false;
        }
        if (!cc.checkCard()) {
            if (!$("#creditWrong").length) {
                $('.card-title').after(`<p class="text-center text-danger" id="creditWrong">
            The Credit Card number you provided is invalid
            </p>`);
            }
            $(CCN).addClass("invalid").removeClass("valid");
            RegistrationInputValidator.scrollTopOfSelector('.card-title');
            return false;
        }
        paymentPayload = serializedToObject(newPMEntry.find("input, select"));
        paymentPayload["CCNProvider"] = cc.getProvider();
        paymentPayload["REMEMBER_PAYMENT"] = $("#rememberPM").attr("value");
    }
    replaceBtn(CHECKOUT_BTN);
    let final = $.extend(shipPayload, paymentPayload);
    final["SHIPPING_COST"] = $(SHIPPING_TOTAL).text();
    final["SALES_TAX"] = $("#salesTax").text();
    final["SUB_TOTAL"] = SUBTOTAL;
    final['GRAND_TOTAL'] = $(CHECKOUT_TOTAL_PRICE).text();
    post(FORM.attr("action"), "POST", final);
}
function checkEmptyInput(entry) {
    entry.find("input:required, select:required").each(function (index, value) {
        if ($(value).is('input')) {
            if ($(value).val() === "") {
                return false;
            }
        } else {
            if ($(value).find(":selected").val() === "") {
                return false;
            }
        }
    });
    return true;
}
Array('input', 'focusin').forEach((evt) => {
    CARD_F_NAME.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.Firstname, PURPOSE.Firstname.constraint(this.value));
    });
    CARD_L_NAME.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.Lastname, PURPOSE.Lastname.constraint(this.value));
    });
    STREET_ADDR.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint(this.value));
    });
    BILLING_ST.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint(this.value));
    });
    ZIP.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.Zip, PURPOSE.Zip.constraint(this.value));
    });
    BILLING_ZIP.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.Zip, PURPOSE.Zip.constraint(this.value));
    });
    CITY.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.City, PURPOSE.City.constraint(this.value));
    });
    BILLING_CITY.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.City, PURPOSE.City.constraint(this.value));
    });
    CCN.addEventListener(evt, function () {
        cc.setCCN(this.value);
        let check = PURPOSE.CCN.constraint(cc);
        vcBL.setValidity(this, this, PURPOSE.CCN, check);
        if (check) {
            CreditCard.toggleCardIcon(this, cc);
        } else {
            CreditCard.toggleCardIcon(this);
        }
    });
    CVV.addEventListener(evt, function () {
        cc.setCVV(this.value);
        vcBL.setValidity(this, this, PURPOSE.CVV, PURPOSE.CVV.constraint(cc));
    });
});
Array('change', 'focusin').forEach((evt) => {
    STATE.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.State, PURPOSE.State.constraint(this));
    });
    COUNTRY.addEventListener(evt, function () {
        vcSH.setValidity(this, this, PURPOSE.Country, PURPOSE.Country.constraint(this));
    });
    BILLING_STATE.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.State, PURPOSE.State.constraint(this));
    });
    BILLING_COUNTRY.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.Country, PURPOSE.Country.constraint(this));
    });
});
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
        let num = updateSalesTax(shippingSelect);
        updateTotal(num);
    }
    addrEntry.collapse("hide");
});
shipToggler.on("click", function () {
    switchToggler(this);
    if (newAddrEntry.hasClass("show")) {
        shipRad.trigger("click");
    }
});
entPMRad.on("click", function () {
    $(this).attr("checked", "checked");
    pmRad.removeAttr("checked");
    pmToggler.text("View");
    newPMEntry.collapse("show");
    pmEntry.collapse("hide");
});
pmRad.on("click", function () {
    $(this).attr("checked", "checked");
    $(entPMRad).removeAttr("checked");
    if (newPMEntry.hasClass("show")) {
        newPMEntry.collapse("hide");
    }
    pmEntry.collapse("hide");
});
pmToggler.on("click", function () {
    switchToggler(this);
    if (newPMEntry.hasClass("show")) {
        pmRad.trigger("click");
    }
});
newAddrEntry.find("#newAddressState").on("change", function () {
    let num = updateSalesTax($(this), false);
    updateTotal(num);
});
CHECKOUT_BTN.on("click", function () {
    proceedCheckoutSubmit();
});
$('.remember-me[type="checkbox"]').on("click", function () {
    $(this).attr("value", function (index, attr) {
        return attr === '0' ? '1' : '0';
    });
});
$(function () {
    let now = new Date();
    let minMonth = ("0" + (now.getMonth() + 1)).slice(-2);
    $("#newCCEXP").attr("min", `${now.getFullYear()}-${minMonth}`);
});
$(document).scroll(function () {
    if ($(window).width() >= 992) {
        var y = $(document).scrollTop(), header = $("#sidebar");
        if (y >= (y + $('.card').offset().top)) {
            header.css({"position": "static", "width": "auto"});
        } else {
            header.css({"position": "sticky", "width": "auto", "top": "20px"});
        }
    }
});
const pcv = new PromotionCheckoutValidation();
const PROMO_CODE_INPUT = document.getElementById("promoCodeInput");
$("#promotBtn").on("click", function () {
    let ref = PROMO_CODE_INPUT.value;
    if (!pcv.validateAll(undefined)) {
        return false;
    }
    $.ajax({
        type: "POST",
        url: "/checkout/promo_app/",
        data: {"PROMO_IDENT": ref},
        success: function (data) {
            //Do something with the data (true or false) and display to customer
        }
    });
});
Array('input', 'focusin').forEach((evt) => {
    PROMO_CODE_INPUT.addEventListener(evt, function () {
        pcv.setValidity(this, $("#promoCodeInputGroup")[0], PromotionCheckoutValidation.PURPOSE.Promo, PromotionCheckoutValidation.PURPOSE.Promo.constraint(this.value));
    });
});
PROMO_CODE_INPUT.addEventListener("focusout", function () {
    $(this).removeClass("invalid");
    $(PromotionCheckoutValidation.PURPOSE.Promo.template[1]).remove();
});
