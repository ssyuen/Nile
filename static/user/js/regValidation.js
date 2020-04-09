/*
    TYPE:               SCRIPT
    FILE NAME:          regValidation.ts
    DESCRIPTION:        Generic form registration validation functions
    REVISIONS:          N/A
 */
import {InputValidator} from "../../common/js/inputValidator.js";

export class RegistrationInputValidator extends InputValidator {
    static firstNameConstraint(value) {
        return value.length >= 1;
    }

    static lastNameConstraint(value) {
        return value.length >= 2;
    }

    static emailConstraint(value) {
        return (/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i).test(value);
    }

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

    static cityConstraint(value) {
        return RegistrationInputValidator.firstNameConstraint(value); //Same constraint...that's why
    }

    static creditCardConstraint(cc) {
        return cc.checkNetwork();
    }

    static cvvConstraint(cc) {
        return cc.checkCVV();
    }
}

RegistrationInputValidator.INVALID_PASS_MSS = [`
        <small class="text-danger error-messsage" id="invalidPass">
          Password must be more than 8 or more characters long, contain at least 1 uppercase character, 1 lowercase character, and 1 number.
        </small>
`, "#invalidPass"];
RegistrationInputValidator.INVALID_PASS_CONF_MSS = [`
        <small class="text-danger error-message" id="invalidPassConf">
          Passwords do not match.
        </small>
`, "#invalidPassConf"];
RegistrationInputValidator.INVALID_EMAIL_MSS = [`
        <small class="text-danger error-message" id="invalidEmail">
          Email is not valid.
        </small>
`, "#invalidEmail"];
RegistrationInputValidator.INVALID_F_NAME_MSS = [`
        <small class="text-danger error-message" id="invalidFName">
          Firstname must be more than 1 character.
        </small>    
`, "#invalidFName"];
RegistrationInputValidator.INVALID_L_NAME_MSS = [`
        <small class="text-danger error-message" id="invalidLName">
          Lastname must be more than 2 characters.
        </small>
`, "#invalidLName"];
RegistrationInputValidator.INVALID_STREET_MSS = [`
        <small class="text-danger error-message" id="invalidStreet">
          Street Address cannot be empty.
        </small>
`, "#invalidStreet"];
RegistrationInputValidator.INVALID_ZIP_MSS = [`
        <small class="text-danger error-message" id="invalidZip">
          ZIP code is not valid.
        </small>
`, "#invalidZip"];
RegistrationInputValidator.INVALID_CITY_MSS = [`
        <small class="text-danger error-message" id="invalidCity"">
          City must be more than 1 character.
        </small>
`, "#invalidCity"];
RegistrationInputValidator.INVALID_CCN_MSS = [`
        <small class="text-danger error-message" id="invalidCCN">
          We support AMEX, Discover, Visa, and Mastercard
        </small>
`, "#invalidCCN"];
RegistrationInputValidator.INVALID_CVV_MSS = [`
        <small class="text-danger error-message" id="invalidCVV"">
          CVV is not valid.
        </small>
`, "#invalidCVV"];
export const PURPOSE = {
    Firstname: {
        template: RegistrationInputValidator.INVALID_F_NAME_MSS,
        constraint: RegistrationInputValidator.firstNameConstraint
    },
    Lastname: {
        template: RegistrationInputValidator.INVALID_L_NAME_MSS,
        constraint: RegistrationInputValidator.lastNameConstraint
    },
    Email: {
        template: RegistrationInputValidator.INVALID_EMAIL_MSS,
        constraint: RegistrationInputValidator.emailConstraint
    },
    Password: {
        template: RegistrationInputValidator.INVALID_PASS_MSS,
        constraint: RegistrationInputValidator.passwordConstraint
    },
    PasswordConfirmation: {
        template: RegistrationInputValidator.INVALID_PASS_CONF_MSS,
        constraint: RegistrationInputValidator.passwordConfConstraint
    },
    StreetAddress: {
        template: RegistrationInputValidator.INVALID_STREET_MSS,
        constraint: RegistrationInputValidator.streetAddressConstraint
    },
    Zip: {
        template: RegistrationInputValidator.INVALID_ZIP_MSS,
        constraint: RegistrationInputValidator.zipCodeConstraint
    },
    City: {
        template: RegistrationInputValidator.INVALID_CITY_MSS,
        constraint: RegistrationInputValidator.cityConstraint
    },
    CCN: {
        template: RegistrationInputValidator.INVALID_CCN_MSS,
        constraint: RegistrationInputValidator.creditCardConstraint
    },
    CVV: {
        template: RegistrationInputValidator.INVALID_CVV_MSS,
        constraint: RegistrationInputValidator.cvvConstraint
    }
};
export class CreditCard {
    constructor(no = '', cvv = '') {
        this.network = {
            VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
            MASTERCARD: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
            AMEX: /^3[47][0-9]{13}$/,
            DISCOVER: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
        };
        this.ccn = CreditCard.normalize(no);
        this.cvv = CreditCard.normalize(cvv);
        this._provider = null;
    }
    static toggleCardIcon(ccnInput, creditCard = null) {
        if (creditCard !== null) {
            var cardProvider = creditCard.getProvider();
            var cardClass = undefined;
            switch (cardProvider) {
                case "VISA": {
                    cardClass = "fa-cc-visa";
                    break;
                }
                case "MASTERCARD": {
                    cardClass = "fa-cc-mastercard";
                    break;
                }
                case "AMEX": {
                    cardClass = "fa-cc-amex";
                    break;
                }
                case "DISCOVER": {
                    cardClass = "fa-cc-discover";
                    break;
                }
            }
        }
        if ($(ccnInput).attr("credit-provider") !== cardProvider) {
            let ref = $('.billing-card');
            let s = `<i class="billing-card fab fa-2x ${cardClass}" style="position: absolute; right: 10px; bottom: 6.5px;"></i>`;
            if (creditCard === null) {
                $(ref).remove();
                $(ccnInput).attr("credit-provider", "");
            }
            else {
                $(ref).remove();
                $(ccnInput).after(s);
                $(ccnInput).attr("credit-provider", cardProvider);
            }
        }
    }
    static normalize(ccn) {
        ccn = ccn.replace(/\D/g, '');
        ccn = ccn.replace(/\s/g, '');
        return ccn;
    }
    setCCN(ccn) {
        this.ccn = CreditCard.normalize(ccn);
    }
    getProvider() {
        return this._provider;
    }
    setCVV(cvv) {
        this.cvv = CreditCard.normalize(cvv);
    }
    checkCard() {
        if (!this.ccn) {
            return false;
        }
        return this.checkLuhn();
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
        this._provider = null;
        Object.keys(this.network).forEach(function (key) {
            let regex = ref.network[key];
            if (regex.test(ref.ccn)) {
                ref._provider = key;
            }
        });
        return this._provider !== null;
    }
}
