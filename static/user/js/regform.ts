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
    INVALID_EMAIL_MSS, INVALID_F_NAME_MSS,
    INVALID_L_NAME_MSS,
    INVALID_PASS_MSS,
    INVALID_PASS_CONF_MSS, INVALID_STREET_MSS, INVALID_ZIP_MSS,
    passwordConstraint,
    validator, zipCodeConstraint, INVALID_U_NAME_MSS
} from "./genericval.js";

const FORM: HTMLElement = document.getElementById("regForm");
const F_NAME: HTMLElement = document.getElementById("inputFirstname");
const L_NAME: HTMLElement = document.getElementById("inputLastname");
const U_NAME: HTMLElement = document.getElementById("inputUsername");
const EMAIL: HTMLElement = document.getElementById("inputEmail");
const PASS: HTMLElement = document.getElementById("inputPassword");
const PASS_CONF: HTMLElement = document.getElementById("inputConfirmPassword");

/*
    Optional Address Fields
    There's no need for city, state, country, and apt/suite because they aren't error prone
*/
const STREET_ADDR: HTMLElement = document.getElementById("addAddressStreetAddress");
const ZIP: HTMLElement = document.getElementById("addZipcode");

/*
    Keeps track of each input element along with its validity.
    On submit, every value of an input with the 'required' attribute
    must be true.
 */
const VALIDITY = new Map<string, boolean>();

/*
    Possible errors:

    If the required validation false and address selection is false --> FAIL
    If the required validation true and address selection is true && address validation false --> FAIL
 */
FORM.addEventListener('submit', (e: Event) => {
    let errorHTML: string = `<p class="text-center text-danger" id="somethingWrong">One or more of the fields were incomplete or invalid</p>`;

    for (let key in VALIDITY) {
        let value: boolean = VALIDITY[key];
        let req: boolean = document.getElementById(key).hasAttribute('required');

        if (req && !value) {
            let ct: JQuery<HTMLElement> = $('.card-title');

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
    $('.addr-opt input, select').each((i: number, e: HTMLElement) => {
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


function scr(selector: string, off: number = 0) {
    let el = $(selector);
    $(window).scrollTop(el.offset().top - off);
}


Array<string>('input', 'focusin').forEach((evt: string) => {

    F_NAME.addEventListener(evt, () => {
        let val = (<HTMLInputElement>document.getElementById(F_NAME.id)).value;
        VALIDITY[F_NAME.id] = validator(F_NAME, INVALID_F_NAME_MSS, '#invalidFName', val.length >= 1);
    });

    L_NAME.addEventListener(evt, () => {
        let val = (<HTMLInputElement>document.getElementById(L_NAME.id)).value;
        VALIDITY[L_NAME.id] = validator(L_NAME, INVALID_L_NAME_MSS, '#invalidLName', val.length >= 2);
    });

    U_NAME.addEventListener(evt, () => {
        let val = (<HTMLInputElement>document.getElementById(U_NAME.id)).value;
        VALIDITY[U_NAME.id] = validator(U_NAME, INVALID_U_NAME_MSS, '#invalidUName', val.length >= 3);
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
        let constr = (<HTMLInputElement>document.getElementById(STREET_ADDR.id)).value.length !== 0;
        VALIDITY[STREET_ADDR.id] = validator(STREET_ADDR, INVALID_STREET_MSS, '#invalidStreet', constr);
    });

    ZIP.addEventListener(evt, () => {
        VALIDITY[ZIP.id] = validator(ZIP, INVALID_ZIP_MSS, '#invalidZip', zipCodeConstraint(ZIP.id));
    });
});
