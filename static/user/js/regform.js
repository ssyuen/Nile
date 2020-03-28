/*
    TYPE:               SCRIPT
    FILE NAME:          regform.ts
    DESCRIPTION:        Validates the registration form for Nile
    ASSOCIATED HTML:    reg.html
    REVISIONS:          N/A
 */
import {CreditCard, InputValidationComplex, PURPOSE} from "./inputvalidation.js";

const FORM = document.getElementById("regForm");
const F_NAME = document.getElementById("inputFirstName");
const L_NAME = document.getElementById("inputLastName");
const EMAIL = document.getElementById("inputEmail");
const PASS = document.getElementById("inputPassword");
const PASS_CONF = document.getElementById("inputConfirmPassword");
/*
    Optional Address Fields
    There's no need for city, state, country, and apt/suite because they aren't error prone
*/
const STREET_ADDR = document.getElementById("addAddressStreetAddress");
const ZIP = document.getElementById("addZipcode");
/*
 * Optional Billing Address Fields
 */
const CARD_F_NAME = document.getElementById("cardHolderFirstName");
const CARD_L_NAME = document.getElementById("cardHolderLastName");
const CCN = document.getElementById("ccn");
const CVV = document.getElementById("cvv");
const BILLING_ST = document.getElementById("billingStreetAddress");
const BILLING_ZIP = document.getElementById("billingZipcode");
let vc = new InputValidationComplex();
let cc = new CreditCard();
/*
    Possible errors:

    If the required validation false and address selection is false --> FAIL
    If the required validation true and address selection is true && address validation false --> FAIL
 */
$(FORM).on("submit", function (e) {
    $(this).prop("disabled", true);
    let toggleStat = $(FORM).children("#addressToggler").attr("aria-expanded");
    if (!vc.validateAll('.card-title')) {
        e.preventDefault();
        return;
    }
    if (!$("#addressToggler").is(":checked")) {
        $('#addressInfo input').val('');
        $('#addressInfo select').empty();
    }
    if (!$("#paymentToggler").is(":checked")) {
        $('#paymentInfo input').val('');
        $('#paymentInfo select').empty();
    }
});
$("#addressToggler").on("click", function () {
    $('.addr-opt input, select').each((i, e) => {
        if (e.id !== 'addAddressApartmentOrSuite') {
            e.toggleAttribute("required");
        }
    });
    if ($('#addressToggler').is(':checked')) {
        scr('#addressToggler');
    } else {
        scr('#acctCard', 45);
    }
});
$("#paymentToggler").on("click", function () {
    $('.payment-opt input').each((i, e) => {
        if (e.id !== "billingApartmentOrSuite") {
            e.toggleAttribute("required");
        }
    });
    if ($('#paymentToggler').is(':checked')) {
        scr('#paymentToggler');
    } else {
        scr('#acctCard', 45);
    }
});
function scr(selector, off = 0) {
    $([document.documentElement, document.body]).animate({
        scrollTop: $(selector).offset().top - off
    }, 500);
}
Array('input', 'focusin').forEach((evt) => {
    console.log("entered");
    [CARD_F_NAME, F_NAME].forEach(function (elem) {
        elem.addEventListener(evt, function () {
            vc.setValidity(elem, elem, PURPOSE.Firstname, PURPOSE.Firstname.constraint(elem.value));
        });
    });
    [CARD_L_NAME, L_NAME].forEach(function (elem) {
        elem.addEventListener(evt, function () {
            vc.setValidity(elem, elem, PURPOSE.Lastname, PURPOSE.Lastname.constraint(elem.value));
        });
    });
    EMAIL.addEventListener(evt, function () {
        vc.setValidity(this, this, PURPOSE.Email, PURPOSE.Email.constraint(this.value));
    });
    PASS.addEventListener(evt, function () {
        vc.setValidity(this, this, PURPOSE.Password, PURPOSE.Password.constraint(PASS.value));
        vc.setValidity(PASS_CONF, PASS_CONF, PURPOSE.PasswordConfirmation, PURPOSE.PasswordConfirmation.constraint(this.value, PASS_CONF.value));
    });
    PASS_CONF.addEventListener(evt, function () {
        vc.setValidity(this, this, PURPOSE.PasswordConfirmation, PURPOSE.PasswordConfirmation.constraint(PASS.value, this.value));
    });
    //Obviously, shipping address and billing address have the same constraints
    [STREET_ADDR, BILLING_ST].forEach(function (elem) {
        elem.addEventListener(evt, function () {
            vc.setValidity(elem, elem, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint(elem.value));
        });
    });
    //Same situation as above
    [ZIP, BILLING_ZIP].forEach(function (elem) {
        elem.addEventListener(evt, function () {
            vc.setValidity(elem, elem, PURPOSE.Zip, PURPOSE.Zip.constraint(elem.value));
        });
    });
    CCN.addEventListener(evt, function () {
        cc.setCCN(this.value);
        let check = PURPOSE.CCN.constraint(cc);
        vc.setValidity(this, this, PURPOSE.CCN, check);
        if (check) {
            if (cc.getProvider() === "Visa") {
                CreditCard.toggleCardIcon(this, "fa-cc-visa");
            } else if (cc.getProvider() === "Mastercard") {
                CreditCard.toggleCardIcon(this, "fa-cc-mastercard");
            } else if (cc.getProvider() === "Amex") {
                CreditCard.toggleCardIcon(this, "fa-cc-amex");
            } else if (cc.getProvider() === "Discover") {
                CreditCard.toggleCardIcon(this, "fa-cc-discover");
            }
        } else {
            CreditCard.toggleCardIcon(this);
        }
    });
    CVV.addEventListener(evt, function () {
        cc.setCVV(this.value);
        vc.setValidity(this, this, PURPOSE.CVV, PURPOSE.CVV.constraint(cc));
    });
});
