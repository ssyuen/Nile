/*
    TYPE:               SCRIPT
    FILE NAME:          regValidation.ts
    DESCRIPTION:        Generic form registration validation functions
    REVISIONS:          N/A
 */


import {InputValidator} from "../../common/js/inputValidator.js";

export class AdminInputValidator extends InputValidator {

    static INVALID_PASS_MSS: [string, string] = [`
        <small class="text-danger error-messsage" id="invalidPass">
          Password must be more than 8 or more characters long, contain at least 1 uppercase character, 1 lowercase character, and 1 number
        </small>
`, "#invalidPass"];
    static INVALID_PASS_CONF_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidPassConf">
          Passwords do not match
        </small>
`, "#invalidPassConf"];
    static INVALID_F_NAME_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidFName">
          Firstname must be more than 1 character
        </small>    
`, "#invalidFName"];
    static INVALID_L_NAME_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidLName">
          Lastname must be more than 2 characters
        </small>
`, "#invalidLName"];
    static INVALID_BOOK_TITLE_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidTitle"">
            Title needs 1 or more characters
        </small>
`, "#invalidTitle"];
    static INVALID_ISBN_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidISBN"">
        Must have 13 digits and be in the format 1234567891011, 978-0-596-52068-7, or 978-0735219090
        </small>
`, "#invalidISBN"];
    static INVALID_PUBLISHER_MSS: [string, string] = [`
        <small class="text-danger error-message" id="invalidPublisher"">
          Publisher needs to be 2 or more characters
        </small>
`, "#invalidPublisher"];


    public static firstNameConstraint(value: string): boolean {
        return value.length >= 1;
    }

    public static lastNameConstraint(value: string): boolean {
        return value.length >= 2;
    }

    public static passwordConstraint(value: string): boolean {
        return ((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).test(value)
    }

    public static passwordConfConstraint(value_pass: string, value_pass_conf: string): boolean {
        return value_pass === value_pass_conf;
    }

    public static titleConstraint(value: string) {
        return AdminInputValidator.firstNameConstraint(value);
    }
    public static isbnConstraint(value: string) {
        return (/^[0-9]*[-][0-9]*[-][0-9]*[-][0-9]*[-][0-9]|[0-9]*[-][0-9]*[0-9]|^\d{13}$/).test(value); // 1234567891021, 123-0-596-52068-7, and 241-1-86197-876-9 valid
    }
    public static publisherConstraint(value: string) {
        return AdminInputValidator.lastNameConstraint(value)
    }
}

export const PURPOSE = {
    Firstname: {
        template: AdminInputValidator.INVALID_F_NAME_MSS,
        constraint: AdminInputValidator.firstNameConstraint
    },

    Lastname: {
        template: AdminInputValidator.INVALID_L_NAME_MSS,
        constraint: AdminInputValidator.lastNameConstraint
    },

    Password: {
        template: AdminInputValidator.INVALID_PASS_MSS,
        constraint: AdminInputValidator.passwordConstraint
    },

    PasswordConfirmation: {
        template: AdminInputValidator.INVALID_PASS_CONF_MSS,
        constraint: AdminInputValidator.passwordConfConstraint
    },
    TITLE: {
        template: AdminInputValidator.INVALID_BOOK_TITLE_MSS,
        constraint: AdminInputValidator.titleConstraint
    },
    ISBN: {
        template: AdminInputValidator.INVALID_ISBN_MSS,
        constraint: AdminInputValidator.isbnConstraint
    },
    PUBLISHER: {
        template: AdminInputValidator.INVALID_PUBLISHER_MSS,
        constraint: AdminInputValidator.publisherConstraint
    }
};

