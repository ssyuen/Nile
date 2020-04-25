import * as checkout from "./checkout.js";
import {CreditCard, PURPOSE, RegistrationInputValidator} from "../../../common/js/registration/regValidation.js";
import {post, serializedToObject} from "./checkoutUtil.js";
import {replaceBtn} from "../../../common/js/utility/util.js";

const paymentSelect: JQuery = $("#paymentMethodSelect");
const FORM: JQuery = $("dummyForm");
const CONT_BTN = $("#contToReviewBtn");

/* For the Payment Method */
const pmRad: JQuery = $("#choosePaymentMethodToggle");
const pmToggler: JQuery = $("#paymentMethodToggler");
const entPMRad: JQuery = $("#enterPaymentMethodToggle");
const choosePMToggleLabel: JQuery = $("#choosePaymentMethodToggleLabel");
const pmEntry: JQuery = $("#paymentMethodEntry");
const newPMEntry: JQuery = $("#newPaymentMethodEntry");

if (paymentSelect.length) {
    checkout.stopAllInput(pmEntry);
    fillPMForm(paymentSelect);
    paymentSelect.on("change", function () {
        fillPMForm($(this));
    });
} else {
    checkout.forceEntry(newPMEntry, choosePMToggleLabel, pmToggler, "Enter a Payment Method");
    pmRad.removeAttr("checked");
    entPMRad.attr("checked", "checked");
    $(".pm-radio-holder").hide();
}


entPMRad.on("click", function () {
    $(this).attr("checked", "checked");
    pmRad.removeAttr("checked");
    pmToggler.text("View");
    (<any>newPMEntry).collapse(<any>"show");
    (<any>pmEntry).collapse(<any>"hide");
});


pmRad.on("click", function () {
    $(this).attr("checked", "checked");
    $(entPMRad).removeAttr("checked");
    if (newPMEntry.hasClass("show")) {
        (<any>newPMEntry).collapse(<any>"hide");
    }
    (<any>pmEntry).collapse(<any>"hide");
});


pmToggler.on("click", function () {
    checkout.switchToggler(this);
    if (newPMEntry.hasClass("show")) {
        pmRad.trigger("click");
    }
});


$(function () {
    let now = new Date();
    let minMonth = ("0" + (now.getMonth() + 1)).slice(-2);
    $("#newCCEXP").attr("min", `${now.getFullYear()}-${minMonth}`)
});


function fillPMForm(select: JQuery) {
    let option: HTMLOptionElement = <HTMLOptionElement><any>select.find(":selected");
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


/*
 * Optional Billing Address Fields
 */
const CARD_F_NAME: HTMLInputElement = document.getElementById("newCardHolderFirstName") as HTMLInputElement;
const CARD_L_NAME: HTMLInputElement = document.getElementById("newCardHolderLastName") as HTMLInputElement;
const CCN: HTMLInputElement = document.getElementById("newCCN") as HTMLInputElement;
const CVV: HTMLInputElement = document.getElementById("newCVV") as HTMLInputElement;

const BILLING_ST: HTMLInputElement = document.getElementById("newBillingStreetAddress") as HTMLInputElement;
const BILLING_ZIP: HTMLInputElement = document.getElementById("newBillingAddressZip") as HTMLInputElement;
const BILLING_CITY: HTMLInputElement = document.getElementById("newBillingAddressCity") as HTMLInputElement;
const BILLING_STATE: HTMLSelectElement = document.getElementById("newBillingAddressState") as HTMLSelectElement;
const BILLING_COUNTRY: HTMLSelectElement = document.getElementById("newBillingAddressCountry") as HTMLSelectElement;

const vcBL = new RegistrationInputValidator();
const cc = new CreditCard();


Array<string>('input', 'focusin').forEach((evt: string) => {

    CARD_F_NAME.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.Firstname, PURPOSE.Firstname.constraint(this.value));
    });

    CARD_L_NAME.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.Lastname, PURPOSE.Lastname.constraint(this.value));
    });

    BILLING_ST.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint(this.value))
    });

    BILLING_ZIP.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.Zip, PURPOSE.Zip.constraint(this.value))
    });

    BILLING_CITY.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.City, PURPOSE.City.constraint(this.value))
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
    })
});

Array<string>('change', 'focusin').forEach((evt: string) => {

    BILLING_STATE.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.State, PURPOSE.State.constraint(this))
    });

    BILLING_COUNTRY.addEventListener(evt, function () {
        vcBL.setValidity(this, this, PURPOSE.Country, PURPOSE.Country.constraint(this))
    });
});


function proceedBillingSubmit() {
    let payOpt: HTMLOptionElement = <HTMLOptionElement><any>$(paymentSelect).find(<any>":selected");

    let paymentPayload = {};

    if (pmRad.is(":checked")) {
        paymentPayload["PAYMENT_IDENT"] = $(payOpt).attr("nile-pm-ident");

    } else if (entPMRad.is(":checked")) {
        if (!checkout.checkEmptyInput(newPMEntry) || !vcBL.validateAll('.card-title')) {
            return false;
        }

        if (!cc.checkCard()) {
            if (!$("#creditWrong").length) {
                $('.card-title').after(
                    `<p class="text-center text-danger" id="creditWrong">
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

    replaceBtn(CONT_BTN);

    post(FORM.attr("action"), "POST", paymentPayload);
}

CONT_BTN.on("click", function () {
    proceedBillingSubmit();
});