/*
    TYPE:               SCRIPT
    FILE NAME:          formval.ts
    DESCRIPTION:        Validates the registration form for Nile
    ASSOCIATED HTML:    reg.html
    REVISIONS:          N/A
 */
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
        VALIDITY[F_NAME.id] = validate(F_NAME, invalidFName, '#invalidFName', val.length >= 1);
    });
    L_NAME.addEventListener(evt, () => {
        let val = document.getElementById(L_NAME.id).value;
        VALIDITY[L_NAME.id] = validate(L_NAME, invalidLName, '#invalidLName', val.length >= 2);
    });
    EMAIL.addEventListener(evt, () => {
        VALIDITY[EMAIL.id] = validate(EMAIL, invalidEmail, '#invalidEmail', emailConstraint());
    });
    PASS.addEventListener(evt, () => {
        VALIDITY[PASS.id] = validate(PASS, invalidPass, '#invalidPass', validateConstraint());
        VALIDITY[PASS_CONF.id] = validate(PASS_CONF, invalidPassConf, '#invalidPassConf', confirmConstraint());
    });
    PASS_CONF.addEventListener(evt, () => {
        VALIDITY[PASS_CONF.id] = validate(PASS_CONF, invalidPassConf, '#invalidPassConf', confirmConstraint());
    });
    STREET_ADDR.addEventListener(evt, () => {
        let constr = document.getElementById(STREET_ADDR.id).value.length !== 0;
        VALIDITY[STREET_ADDR.id] = validate(STREET_ADDR, invalidStreet, '#invalidStreet', constr);
    });
    ZIP.addEventListener(evt, () => {
        VALIDITY[ZIP.id] = validate(ZIP, invalidZip, '#invalidZip', zipCodeConstraint());
    });
});
function emailConstraint() {
    let val = document.getElementById(EMAIL.id).value;
    return val.match(/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
}
function validateConstraint() {
    let val = document.getElementById(PASS.id).value;
    return val.match((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/));
}
function confirmConstraint() {
    let pConf = document.getElementById(PASS.id).value;
    let pConfVal = document.getElementById(PASS_CONF.id).value;
    return pConf === pConfVal;
}
function zipCodeConstraint() {
    let val = document.getElementById(ZIP.id).value;
    return val.match(/^\d{5}$|^\d{5}-\d{4}$/);
}
/*
    Generalized validation function
 */
function validate(inputType, invalidMessageType, invalidMessageTypeId, constraintType) {
    if (constraintType) {
        if ($(invalidMessageTypeId).length) {
            $(invalidMessageTypeId).remove();
        }
        if ($(inputType).hasClass('is-invalid')) {
            $(inputType).removeClass('is-invalid');
        }
        //Prevents duplicate class additions
        if (!$(inputType).hasClass('is-valid')) {
            $(inputType).addClass("is-valid");
        }
        return true;
    } else {
        if (!$(invalidMessageTypeId).length) {
            $(inputType).after(invalidMessageType);
        }
        if ($(inputType).hasClass('is-valid')) {
            $(inputType).removeClass('is-valid');
        }
        if (!$(inputType).hasClass('is-invalid')) {
            $(inputType).addClass("is-invalid");
        }
        return false;
    }
}
/*
    Error HTML injection templates
 */
const invalidPass = `
    <div class="error-message" id="invalidPass">
        <small class="text-danger">
          Password be more than 8 or more characters long, contain at least 1 uppercase character, 1 lowercase character, and 1 number.
        </small>
    </div>
`;
const invalidPassConf = `
    <div class="error-message" id="invalidPassConf">
        <small class="text-danger">
          Password's do not match.
        </small>
    </div>
`;
const invalidEmail = `
    <div class="error-message" id="invalidEmail">
        <small class="text-danger">
          Email is not valid.
        </small>
    </div>
`;
const invalidFName = `
    <div class="error-message" id="invalidFName">
        <small class="text-danger">
          Firstname must be more than 1 character.
        </small>
    </div>
`;
const invalidLName = `
    <div class="error-message" id="invalidLName">
        <small class="text-danger">
          Lastname must be more than 2 characters.
        </small>
    </div>
`;
const invalidStreet = `
    <div class="error-message" id="invalidStreet">
        <small class="text-danger">
          Street Address cannot be empty.
        </small>
    </div>
`;
const invalidZip = `
    <div class="error-message" id="invalidZip">
        <small class="text-danger">
          ZIP code is not valid.
        </small>
    </div>
`;
