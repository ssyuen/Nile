/*
    TYPE:               SCRIPT
    FILE NAME:          formval.js
    DESCRIPTION:        Validates the registration form for Nile
    ASSOCIATED HTML:    reg.html
    REVISIONS:          N/A
 */

const form = document.getElementById("regForm");
const fName = document.getElementById("inputFirstname");
const lName = document.getElementById("inputLastname");
const email = document.getElementById("inputEmail");
const pass = document.getElementById("inputPassword");
const passConf = document.getElementById("inputConfirmPassword");

/*
    Optional Address Fields
    There's no need for city, state, country, and apt/suite because they aren't error prone
*/
const streetAddress = document.getElementById("addAddressStreetAddress");
const zip = document.getElementById("addZipcode");

let validity = {};

/*
    Possible errors:

    If the required validation false and address selection is false --> FAIL
    If the required validation true and address selection is true && address validation false --> FAIL
 */
form.addEventListener('submit', (e) => {
    let errorHTML = `<p class="text-center text-danger" id="somethingWrong">One or more of the fields were incomplete or invalid</p>`;

    for (let key in validity) {
        let value = validity[key];
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

document.getElementById("addressToggler").addEventListener("click", function () {
    $('.addr-opt input, select').each(function () {
        if ($(this)[0].id !== 'addAddressApartmentOrSuite') {
            $(this)[0].toggleAttribute("required");
        }
    })
});

['input', 'focusin'].forEach((evt) => {

    fName.addEventListener(evt, (e) => {
        let val = fName.value;
        validity[fName.id] = validate(fName, invalidFName, '#invalidFName', val.length >= 1);
    });

    lName.addEventListener(evt, (e) => {
        let val = lName.value;
        validity[lName.id] = validate(lName, invalidLName, '#invalidLName', val.length >= 2);
    });

    email.addEventListener(evt, (e) => {
        validity[email.id] = validate(email, invalidEmail, '#invalidEmail', emailConstraint());
    });

    pass.addEventListener(evt, (e) => {
        validity[pass.id] = validate(pass, invalidPass, '#invalidPass', validateConstraint());
        validity[passConf.id] = validate(passConf, invalidPassConf, '#invalidPassConf', confirmConstraint());
    });

    passConf.addEventListener(evt, (e) => {
        validity[passConf.id] = validate(passConf, invalidPassConf, '#invalidPassConf', confirmConstraint());
    });

    streetAddress.addEventListener(evt, (e) => {
        let constr = streetAddress.value.length !== 0;
        validity[streetAddress.id] = validate(streetAddress, invalidStreet, '#invalidStreet', constr);
    });

    zip.addEventListener(evt, (e) => {
        validity[zip.id] = validate(zip, invalidZip, '#invalidZip', zipCodeConstraint());
    });
});

function emailConstraint() {
    let val = email.value;
    return val.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
}

function validateConstraint() {
    let val = pass.value;
    return val.match((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
}

function confirmConstraint() {
    let pConf = pass.value;
    let pConfVal = passConf.value;
    return pConf === pConfVal;
}

function zipCodeConstraint() {
    let val = zip.value;
    return val.match(/^\d{5}$|^\d{5}-\d{4}$/);
}

/*
    Generalized validation function
 */
function validate(inputType, invalidMessageType, invalidMessageTypeId, constraintType) {

    if (constraintType) {
        if ($(invalidMessageTypeId).length > 0) {
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
        if (!$(invalidMessageTypeId).length > 0) {
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
    Error HTML Injection's
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