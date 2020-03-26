/*
    TYPE:               SCRIPT
    FILE NAME:          regform.ts
    DESCRIPTION:        Validates the registration form for Nile
    ASSOCIATED HTML:    reg.html
    REVISIONS:          N/A
 */
import {
    passwordConfConstraint,
    emailConstraint,
    INVALID_EMAIL_MSS,
    INVALID_F_NAME_MSS,
    INVALID_L_NAME_MSS,
    INVALID_PASS_MSS,
    INVALID_PASS_CONF_MSS,
    INVALID_STREET_MSS,
    INVALID_ZIP_MSS,
    passwordConstraint,
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
            }, 500);
            e.preventDefault();
            return;
        }
    }
    $("registerBtn").prop("disabled", true);
    let toggleStat = $(FORM).children("#addressToggler").attr("aria-expanded");
    //They don't want to put an address
    let data;
    if (toggleStat === undefined || toggleStat === 'false') {
        data = $.param({
            "inputFirstname": F_NAME.value,
            "inputLastname": L_NAME.value,
            "inputEmail": EMAIL.value,
            "inputPassword": PASS.value,
            "inputConfirmPassword": PASS_CONF.value
        });
    } else { //They do
        data = $(FORM).serialize();
    }
    $.ajax({
        type: "POST",
        url: "/register/",
        data: data,
        success: function (data) {
            console.log("Sent Entry");
        }
    });
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
    $([document.documentElement, document.body]).animate({
        scrollTop: $(selector).offset().top - off
    }, 500);
}
Array('input', 'focusin').forEach((evt) => {
    F_NAME.addEventListener(evt, () => {
        let val = document.getElementById(F_NAME.id).value;
        VALIDITY[F_NAME.id] = validator(F_NAME, INVALID_F_NAME_MSS, '#invalidFName', val.length >= 1);
    });
    L_NAME.addEventListener(evt, () => {
        let val = document.getElementById(L_NAME.id).value;
        VALIDITY[L_NAME.id] = validator(L_NAME, INVALID_L_NAME_MSS, '#invalidLName', val.length >= 2);
    });
    EMAIL.addEventListener(evt, () => {
        VALIDITY[EMAIL.id] = validator(EMAIL, INVALID_EMAIL_MSS, '#invalidEmail', emailConstraint(EMAIL.id));
    });
    PASS.addEventListener(evt, () => {
        VALIDITY[PASS.id] = validator(PASS, INVALID_PASS_MSS, '#invalidPass', passwordConstraint(PASS.id));
        VALIDITY[PASS_CONF.id] = validator(PASS_CONF, INVALID_PASS_CONF_MSS, '#invalidPassConf', passwordConfConstraint(PASS.id, PASS_CONF.id));
    });
    PASS_CONF.addEventListener(evt, () => {
        VALIDITY[PASS_CONF.id] = validator(PASS_CONF, INVALID_PASS_CONF_MSS, '#invalidPassConf', passwordConfConstraint(PASS.id, PASS_CONF.id));
    });
    STREET_ADDR.addEventListener(evt, () => {
        let constr = document.getElementById(STREET_ADDR.id).value.length !== 0;
        VALIDITY[STREET_ADDR.id] = validator(STREET_ADDR, INVALID_STREET_MSS, '#invalidStreet', constr);
    });
    ZIP.addEventListener(evt, () => {
        VALIDITY[ZIP.id] = validator(ZIP, INVALID_ZIP_MSS, '#invalidZip', zipCodeConstraint(ZIP.id));
    });
});
