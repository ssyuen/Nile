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
    static titleConstraint(value) {
        return InputValidationComplex.firstNameConstraint(value);
    }
    static isbnConstraint(value) {
        return (/^[0-9]*[-][0-9]*[-][0-9]*[-][0-9]*[-][0-9]|^\d{13}$/).test(value); // 1234567891021, 123-0-596-52068-7, and 241-1-86197-876-9 valid
    }
    static publisherConstraint(value) {
        return InputValidationComplex.lastNameConstraint(value);
    }
    setValidity(elem, loc, purpose, constr) {
        this.curr_validity[elem.id] = this.validator(elem, loc, purpose['template'], constr);
    }
    static scrollTopOfSelector(selectorPlace) {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(selectorPlace).offset().top
        }, 500);
    }
    validateAll(selectorPlace) {
        let errorHTML = `<p class="text-center text-danger" id="somethingWrong">
                One or more of the fields were incomplete or invalid
            </p>`;
        for (let key in this.curr_validity) {
            let value = this.curr_validity[key];
            let req = document.getElementById(key).hasAttribute('required');
            if (req && !value) {
                if ($('#somethingWrong').length === 0) {
                    $(selectorPlace).after(errorHTML);
                }
                InputValidationComplex.scrollTopOfSelector(selectorPlace);
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
            if ($(invalidMessageLocation).next(invalidMessageType[1]).length) {
                $(invalidMessageLocation).next(invalidMessageType[1]).remove();
            }
            if ($(inputType).hasClass('invalid')) {
                $(inputType).removeClass('invalid');
            }
            //Prevents duplicate class additions
            if (!$(inputType).hasClass('valid')) {
                $(inputType).addClass("valid");
            }
            $(inputType).prop("aria-invalid", "false");
            return true;
        }
        else {
            if (!$(invalidMessageLocation).next(invalidMessageType[1]).length) {
                $(invalidMessageLocation).after(invalidMessageType[0]);
            }
            if ($(inputType).hasClass('valid')) {
                $(inputType).removeClass('valid');
            }
            if (!$(inputType).hasClass('invalid')) {
                $(inputType).addClass("invalid");
            }
            $(inputType).prop("aria-invalid", "true");
            return false;
        }
    }
}
InputValidationComplex.INVALID_PASS_MSS = [`
        <small class="text-danger error-messsage" id="invalidPass">
          Password must be more than 8 or more characters long, contain at least 1 uppercase character, 1 lowercase character, and 1 number.
        </small>
`, "#invalidPass"];
InputValidationComplex.INVALID_PASS_CONF_MSS = [`
        <small class="text-danger error-message" id="invalidPassConf">
          Passwords do not match.
        </small>
`, "#invalidPassConf"];
InputValidationComplex.INVALID_EMAIL_MSS = [`
        <small class="text-danger error-message" id="invalidEmail">
          Email is not valid.
        </small>
`, "#invalidEmail"];
InputValidationComplex.INVALID_F_NAME_MSS = [`
        <small class="text-danger error-message" id="invalidFName">
          Firstname must be more than 1 character.
        </small>    
`, "#invalidFName"];
InputValidationComplex.INVALID_L_NAME_MSS = [`
        <small class="text-danger error-message" id="invalidLName">
          Lastname must be more than 2 characters.
        </small>
`, "#invalidLName"];
InputValidationComplex.INVALID_BOOK_TITLE_MSS = [`
        <small class="text-danger error-message" id="invalidTitle"">
            Title needs 1 or more characters.
        </small>
`, "#invalidTitle"];
InputValidationComplex.INVALID_ISBN_MSS = [`
        <small class="text-danger error-message" id="invalidISBN"">
            Must have 13 digits and be in the format 1234567891011 or 978-0-596-52068-7.
        </small>
`, "#invalidISBN"];
InputValidationComplex.INVALID_PUBLISHER_MSS = [`
        <small class="text-danger error-message" id="invalidPublisher"">
          Publisher needs to be 2 or more characters.
        </small>
`, "#invalidPublisher"];
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
    TITLE: {
        template: InputValidationComplex.INVALID_BOOK_TITLE_MSS,
        constraint: InputValidationComplex.titleConstraint
    },
    ISBN: {
        template: InputValidationComplex.INVALID_ISBN_MSS,
        constraint: InputValidationComplex.isbnConstraint
    },
    PUBLISHER: {
        template: InputValidationComplex.INVALID_PUBLISHER_MSS,
        constraint: InputValidationComplex.publisherConstraint
    }
};
