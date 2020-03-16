/*
    TYPE:               SCRIPT
    FILE NAME:          formval.ts
    DESCRIPTION:        Validates the registration form for Nile
    ASSOCIATED HTML:    reg.html
    REVISIONS:          N/A
 */


const form: HTMLElement = document.getElementById("regForm");
const fName: HTMLElement = document.getElementById("inputFirstname");
const lName: HTMLElement = document.getElementById("inputLastname");
const email: HTMLElement = document.getElementById("inputEmail");
const pass: HTMLElement = document.getElementById("inputPassword");
const passConf: HTMLElement = document.getElementById("inputConfirmPassword");

/*
    Optional Address Fields
    There's no need for city, state, country, and apt/suite because they aren't error prone
*/
const streetAddress: HTMLElement = document.getElementById("addAddressStreetAddress");
const zip: HTMLElement = document.getElementById("addZipcode");

let validity = new Map<string, boolean>();

/*
    Possible errors:

    If the required validation false and address selection is false --> FAIL
    If the required validation true and address selection is true && address validation false --> FAIL
 */
form.addEventListener('submit', (e: Event) => {
    let errorHTML: string = `<p class="text-center text-danger" id="somethingWrong">One or more of the fields were incomplete or invalid</p>`;

    for (let key in validity) {
        let value: boolean = validity[key];
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
    tog == true ? scr('#addressToggler') : scr('#acctCard', 45);
});

function scr(selector: string, off: number = 0) {
    let el = $(selector);
    $(window).scrollTop(el.offset().top - off);
}

Array<string>('input', 'focusin').forEach((evt: string) => {

    fName.addEventListener(evt, () => {
        let val = (<HTMLInputElement>document.getElementById(fName.id)).value;
        validity[fName.id] = validate(fName, invalidFName, '#invalidFName', val.length >= 1);
    });

    lName.addEventListener(evt, () => {
        let val = (<HTMLInputElement>document.getElementById(fName.id)).value;
        validity[lName.id] = validate(lName, invalidLName, '#invalidLName', val.length >= 2);
    });

    email.addEventListener(evt, () => {
        validity[email.id] = validate(email, invalidEmail, '#invalidEmail', emailConstraint());
    });

    pass.addEventListener(evt, () => {
        validity[pass.id] = validate(pass, invalidPass, '#invalidPass', validateConstraint());
        validity[passConf.id] = validate(passConf, invalidPassConf, '#invalidPassConf', confirmConstraint());
    });

    passConf.addEventListener(evt, () => {
        validity[passConf.id] = validate(passConf, invalidPassConf, '#invalidPassConf', confirmConstraint());
    });

    streetAddress.addEventListener(evt, () => {
        let constr = (<HTMLInputElement>document.getElementById(streetAddress.id)).value.length !== 0;
        validity[streetAddress.id] = validate(streetAddress, invalidStreet, '#invalidStreet', constr);
    });

    zip.addEventListener(evt, () => {
        validity[zip.id] = validate(zip, invalidZip, '#invalidZip', zipCodeConstraint());
    });
});

function emailConstraint(): RegExpMatchArray {
    let val: string = (<HTMLInputElement>document.getElementById(email.id)).value;
    return val.match(/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)
}

function validateConstraint(): RegExpMatchArray {
    let val: string = (<HTMLInputElement>document.getElementById(pass.id)).value;
    return val.match((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
}

function confirmConstraint(): boolean {
    let pConf: string = (<HTMLInputElement>document.getElementById(pass.id)).value;
    let pConfVal: string = (<HTMLInputElement>document.getElementById(passConf.id)).value;
    return pConf === pConfVal;
}

function zipCodeConstraint(): RegExpMatchArray {
    let val: string = (<HTMLInputElement>document.getElementById(zip.id)).value;
    return val.match(/^\d{5}$|^\d{5}-\d{4}$/);
}

/*
    Generalized validation function
 */
function validate(inputType: HTMLElement, invalidMessageType: string,
                  invalidMessageTypeId: string, constraintType: (boolean | RegExpMatchArray)): boolean {

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

const invalidPass: string = `
    <div class="error-message" id="invalidPass">
        <small class="text-danger">
          Password be more than 8 or more characters long, contain at least 1 uppercase character, 1 lowercase character, and 1 number.
        </small>
    </div>
`;

const invalidPassConf: string = `
    <div class="error-message" id="invalidPassConf">
        <small class="text-danger">
          Password's do not match.
        </small>
    </div>
`;

const invalidEmail: string = `
    <div class="error-message" id="invalidEmail">
        <small class="text-danger">
          Email is not valid.
        </small>
    </div>
`;

const invalidFName: string = `
    <div class="error-message" id="invalidFName">
        <small class="text-danger">
          Firstname must be more than 1 character.
        </small>
    </div>
`;

const invalidLName: string = `
    <div class="error-message" id="invalidLName">
        <small class="text-danger">
          Lastname must be more than 2 characters.
        </small>
    </div>
`;

const invalidStreet: string = `
    <div class="error-message" id="invalidStreet">
        <small class="text-danger">
          Street Address cannot be empty.
        </small>
    </div>
`;

const invalidZip: string = `
    <div class="error-message" id="invalidZip">
        <small class="text-danger">
          ZIP code is not valid.
        </small>
    </div>
`;