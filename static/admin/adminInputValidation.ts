/*
    TYPE:               SCRIPT
    FILE NAME:          inputvalidation.ts
    DESCRIPTION:        Generic form registration validation functions
    REVISIONS:          N/A
 */


export class InputValidationComplex {

    static INVALID_PASS_MSS: [string, string] = [`
        <small class="text-danger error-messsage" id="invalidPass">
          Password must be more than 8 or more characters long, contain at least 1 uppercase character, 1 lowercase character, and 1 number.
        </small>
`, "#invalidPass"];
    static INVALID_PASS_CONF_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidPassConf">
          Passwords do not match.
        </small>
`, "#invalidPassConf"];
    static INVALID_EMAIL_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidEmail">
          Email is not valid.
        </small>
`, "#invalidEmail"];
    static INVALID_F_NAME_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidFName">
          Firstname must be more than 1 character.
        </small>    
`, "#invalidFName"];
    static INVALID_L_NAME_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidLName">
          Lastname must be more than 2 characters.
        </small>
`, "#invalidLName"];
    static INVALID_BOOK_TITLE_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidTitle"">
            Title needs 1 or more characters.
        </small>
`, "#invalidTitle"];
    static INVALID_ISBN_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidISBN"">
            Must have 13 digits and be in the format 1234567891011 or 978-0-596-52068-7.
        </small>
`, "#invalidISBN"];
    static INVALID_PUBLISHER_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidPublisher"">
          Publisher needs to be 2 or more characters.
        </small>
`, "#invalidPublisher"];

    /*
    Keeps track of each input element along with its validity.
    On submit, every value of an input with the 'required' attribute
    must be true.
    */
    curr_validity = new Map<string, boolean>();

    public static firstNameConstraint(value: string): boolean {
        return value.length >= 1;
    }

    public static lastNameConstraint(value: string): boolean {
        return value.length >= 2;
    }

    public static emailConstraint(value: string): boolean {
        return (/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i).test(value)
    }

    /*
        Error HTML injection templates
     */

    public static passwordConstraint(value: string): boolean {
        return ((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).test(value)
    }

    public static passwordConfConstraint(value_pass: string, value_pass_conf: string): boolean {
        return value_pass === value_pass_conf;
    }

    public static titleConstraint(value: string) {
        return InputValidationComplex.firstNameConstraint(value);
    }
    public static isbnConstraint(value: string) {
        return (/^[0-9]*[-][0-9]*[-][0-9]*[-][0-9]*[-][0-9]|^\d{13}$/).test(value); // 1234567891021, 123-0-596-52068-7, and 241-1-86197-876-9 valid
    }
    public static publisherConstraint(value: string) {
        return InputValidationComplex.lastNameConstraint(value)
    }
    public setValidity(elem: HTMLInputElement, loc: HTMLElement | string, purpose: IPurpose, constr: boolean) {
        this.curr_validity[elem.id] = this.validator(elem, loc, purpose['template'], constr);
    }

    public static scrollTopOfSelector(selectorPlace: string): any {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(selectorPlace).offset().top
        }, 500);
    }

    public validateAll(selectorPlace: string): boolean {
        let errorHTML: string =
            `<p class="text-center text-danger" id="somethingWrong">
                One or more of the fields were incomplete or invalid
            </p>`;

        for (let key in this.curr_validity) {
            let value: boolean = this.curr_validity[key];
            let req: boolean = document.getElementById(key).hasAttribute('required');

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
    private validator(inputType: HTMLElement,
                      invalidMessageLocation: string | HTMLElement | any,
                      invalidMessageType: [string, string],
                      constraintType: (boolean | RegExpMatchArray)): boolean {

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
        } else {
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

export interface IPurpose {
    template: [string, string],
    constraint: Function
}

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

