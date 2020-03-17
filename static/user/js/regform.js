/*
    TYPE:               SCRIPT
    FILE NAME:          regform.ts
    DESCRIPTION:        Validates the registration form for Nile
    ASSOCIATED HTML:    reg.html
    REVISIONS:          N/A
 */
import {
    confirmConstraint,
    emailConstraint,
    invalidEmail,
    invalidFName,
    invalidLName,
    invalidPass,
    invalidPassConf,
    invalidStreet,
    invalidZip,
    validateConstraint,
    validator,
    zipCodeConstraint
} from "./genericval.js";

const FORM = document.getElementById("regForm");
const F_NAME = document.getElementById("inputFirstname");
const L_NAME = document.getElementById("inputLastname");
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
    Keeps track of each input element along with its validity.
    On submit, every value of an input with the 'required' attribute
    must be true.
 */
const VALIDITY = new Map();
/*
    Possible errors:

    If the required validation false and address selection is false --> FAIL
    If the required validation true and address selection is true && address validation false --> FAIL
 */
FORM.addEventListener('submit', (e) => {
    let errorHTML = `<p class="text-center text-danger" id="somethingWrong">One or more of the fields were incomplete or invalid</p>`;
    for (let key in VALIDITY) {
        let value = VALIDITY[key];
        let req = document.getElementById(key).hasAttribute('required');
        if (req && !value) {
            let ct = $('.card-title');
            if ($('#somethingWrong').length === 0)
                ct.after(errorHTML);
            $([document.documentElement, document.body]).animate({
                scrollTop: ct.offset().top
            }, 200);
            e.preventDefault();
            break;
        }
    }
});
let tog = false;
document.getElementById("addressToggler").addEventListener("click", function () {
    $('.addr-opt input, select').each((i, e) => {
        if (e.id !== 'addAddressApartmentOrSuite') {
            e.toggleAttribute("required");
        }
    });
    tog = !tog;
    if (tog) {
        scr('#addressToggler');
        $("#toggleCaption").text("Great! We're recording your address now");
    } else {
        scr('#acctCard', 45);
        $("#toggleCaption").text("This is optional. You can always add it later");
    }
});

function scr(selector, off = 0) {
    let el = $(selector);
    $(window).scrollTop(el.offset().top - off);
}

Array('input', 'focusin').forEach((evt) => {
    F_NAME.addEventListener(evt, () => {
        let val = document.getElementById(F_NAME.id).value;
        VALIDITY[F_NAME.id] = validator(F_NAME, invalidFName, '#invalidFName', val.length >= 1);
    });
    L_NAME.addEventListener(evt, () => {
        let val = document.getElementById(L_NAME.id).value;
        VALIDITY[L_NAME.id] = validator(L_NAME, invalidLName, '#invalidLName', val.length >= 2);
    });
    EMAIL.addEventListener(evt, () => {
        VALIDITY[EMAIL.id] = validator(EMAIL, invalidEmail, '#invalidEmail', emailConstraint(EMAIL.id));
    });
    PASS.addEventListener(evt, () => {
        VALIDITY[PASS.id] = validator(PASS, invalidPass, '#invalidPass', validateConstraint(PASS.id));
        VALIDITY[PASS_CONF.id] = validator(PASS_CONF, invalidPassConf, '#invalidPassConf', confirmConstraint(PASS.id, PASS_CONF.id));
    });
    PASS_CONF.addEventListener(evt, () => {
        VALIDITY[PASS_CONF.id] = validator(PASS_CONF, invalidPassConf, '#invalidPassConf', confirmConstraint(PASS.id, PASS_CONF.id));
    });
    STREET_ADDR.addEventListener(evt, () => {
        let constr = document.getElementById(STREET_ADDR.id).value.length !== 0;
        VALIDITY[STREET_ADDR.id] = validator(STREET_ADDR, invalidStreet, '#invalidStreet', constr);
    });
    ZIP.addEventListener(evt, () => {
        VALIDITY[ZIP.id] = validator(ZIP, invalidZip, '#invalidZip', zipCodeConstraint(ZIP.id));
    });
});
