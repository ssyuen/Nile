/*
    TYPE:               SCRIPT
    FILE NAME:          inputvalidation.ts
    DESCRIPTION:        Generic form registration validation functions
    REVISIONS:          N/A
 */
export class InputValidationComplex {
    constructor() {
        /*
        Keeps track of each input element along with its validity.
        On submit, every value of an input with the 'required' attribute
        must be true.
        */
        this.curr_validity = new Map();
    }

    static firstNameConstraint(value) {
        return value.length >= 1;
    }

    static lastNameConstraint(value) {
        return value.length >= 2;
    }

    static emailConstraint(value) {
        return (/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i).test(value);
    }

    /*
        Error HTML injection templates
     */
    static passwordConstraint(value) {
        return ((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).test(value);
    }

    static passwordConfConstraint(value_pass, value_pass_conf) {
        return value_pass === value_pass_conf;
    }

    static streetAddressConstraint(value) {
        return value.length !== 0;
    }

    static zipCodeConstraint(value) {
        return (/^\d{5}$|^\d{5}-\d{4}$/).test(value);
    }
    static creditCardConstraint(cc) {
        return cc.checkCard();
    }
    static cvvConstraint(cc) {
        return cc.checkCVV();
    }
    setValidity(elem, loc, purpose, constr) {
        this.curr_validity[elem.id] = this.validator(elem, loc, purpose['template'], constr);
    }
    validateAll(selectorPlace) {
        let errorHTML = `<p class="text-center text-danger" id="somethingWrong">
                One or more of the fields were incomplete or invalid
            </p>`;
        for (let key in this.curr_validity) {
            let value = this.curr_validity[key];
            let req = document.getElementById(key).hasAttribute('required');
            if (req && !value) {
                let ct = $(selectorPlace);
                if ($('#somethingWrong').length === 0)
                    ct.after(errorHTML);
                $([document.documentElement, document.body]).animate({
                    scrollTop: ct.offset().top
                }, 500);
                return false;
            }
        }
        return true;
    }
    /*
        Generalized validation function
     */
    validator(inputType, invalidMessageLocation, invalidMessageType, constraintType) {
        if (constraintType) {
            if ($(invalidMessageType[1]).length) {
                $(invalidMessageType[1]).remove();
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
            if (!$(invalidMessageType[1]).length) {
                // @ts-ignore
                $(invalidMessageLocation).after(invalidMessageType[0]);
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
}
InputValidationComplex.INVALID_PASS_MSS = [`
    <div class="error-message" id="invalidPass">
        <small class="text-danger">
          Password must be more than 8 or more characters long, contain at least 1 uppercase character, 1 lowercase character, and 1 number.
        </small>
    </div>
`, "#invalidPass"];
InputValidationComplex.INVALID_PASS_CONF_MSS = [`
    <div class="error-message" id="invalidPassConf">
        <small class="text-danger">
          Passwords do not match.
        </small>
    </div>
`, "#invalidPassConf"];
InputValidationComplex.INVALID_EMAIL_MSS = [`
    <div class="error-message" id="invalidEmail">
        <small class="text-danger">
          Email is not valid.
        </small>
    </div>
`, "#invalidEmail"];
InputValidationComplex.INVALID_F_NAME_MSS = [`
    <div class="error-message" id="invalidFName">
        <small class="text-danger">
          Firstname must be more than 1 character.
        </small>
    </div>
`, "#invalidFName"];
InputValidationComplex.INVALID_L_NAME_MSS = [`
    <div class="error-message" id="invalidLName">
        <small class="text-danger">
          Lastname must be more than 2 characters.
        </small>
    </div>
`, "#invalidLName"];
InputValidationComplex.INVALID_STREET_MSS = [`
    <div class="error-message" id="invalidStreet">
        <small class="text-danger">
          Street Address cannot be empty.
        </small>
    </div>
`, "#invalidStreet"];
InputValidationComplex.INVALID_ZIP_MSS = [`
    <div class="error-message" id="invalidZip">
        <small class="text-danger">
          ZIP code is not valid.
        </small>
    </div>
`, "#invalidZip"];
InputValidationComplex.INVALID_CCN_MSS = [`
    <div class="error-message" id="invalidCCN">
        <small class="text-danger">
          Credit Card is not valid.
        </small>
    </div>
`, "#invalidCCN"];
InputValidationComplex.INVALID_CVV_MSS = [`
    <div class="error-message" id="invalidCVV">
        <small class="text-danger">
          CVV is not valid.
        </small>
    </div>
`, "#invalidCVV"];
export const PURPOSE = {
    Firstname: {
        template: InputValidationComplex.INVALID_F_NAME_MSS,
        constraint: InputValidationComplex.firstNameConstraint
    },
    Lastname: {
        template: InputValidationComplex.INVALID_L_NAME_MSS,
        constraint: InputValidationComplex.lastNameConstraint
    },
    Email: {
        template: InputValidationComplex.INVALID_EMAIL_MSS,
        constraint: InputValidationComplex.emailConstraint
    },
    Password: {
        template: InputValidationComplex.INVALID_PASS_MSS,
        constraint: InputValidationComplex.passwordConstraint
    },
    PasswordConfirmation: {
        template: InputValidationComplex.INVALID_PASS_CONF_MSS,
        constraint: InputValidationComplex.passwordConfConstraint
    },
    StreetAddress: {
        template: InputValidationComplex.INVALID_STREET_MSS,
        constraint: InputValidationComplex.streetAddressConstraint
    },
    Zip: {
        template: InputValidationComplex.INVALID_ZIP_MSS,
        constraint: InputValidationComplex.zipCodeConstraint
    },
    CCN: {
        template: InputValidationComplex.INVALID_CCN_MSS,
        constraint: InputValidationComplex.creditCardConstraint
    },
    CVV: {
        template: InputValidationComplex.INVALID_CVV_MSS,
        constraint: InputValidationComplex.cvvConstraint
    }
};
export class CreditCard {
    constructor(no = '', cvv = '') {
        this.network = {
            Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            Mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
            Amex: /^3[47][0-9]{13}$/,
            Discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
        };
        this.ccn = no.replace(/\D/g, '');
        this.cvv = cvv.replace(/\D/g, '');
        this.provider = null;
    }
    static toggleCardIcon(ccnInput, cardClass = "") {
        let ref = $('.billing-card');
        let s = `<i class="billing-card fab fa-2x ${cardClass}" style="position: absolute; right: 50px; bottom: 6.5px;"></i>`;
        if (!cardClass.length) {
            $(ref).remove();
        } else {
            $(ccnInput).after(s);
        }
    }
    setCCN(ccn) {
        this.ccn = ccn;
    }
    setCVV(cvv) {
        this.cvv = cvv;
    }
    getProvider() {
        return this.provider;
    }
    checkCard() {
        if (!this.ccn) {
            return false;
        }
        if (!this.checkLuhn()) {
            return false;
        }
        //If the card is in our network
        return this.checkNetwork();
    }
    checkCVV() {
        return (/^[0-9]{3,4}$/).test(this.cvv);
    }
    /*
        This is Luhn's algorithm. I turned the pseudocode
        to JS from Wikipedia
     */
    checkLuhn() {
        let sum = 0;
        let shouldDouble = false;
        // loop through values starting at the rightmost side
        for (let i = this.ccn.length - 1; i >= 0; i--) {
            let digit = parseInt(this.ccn.charAt(i));
            if (shouldDouble) {
                if ((digit *= 2) > 9)
                    digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) == 0;
    }
    checkNetwork() {
        let ref = this;
        Object.keys(this.network).forEach(function (key) {
            let regex = ref.network[key];
            if (regex.test(ref.ccn)) {
                ref.provider = key;
            }
        });
        return this.provider !== null;
    }
}
