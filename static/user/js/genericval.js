/*
    TYPE:               SCRIPT
    FILE NAME:          genericval.ts
    DESCRIPTION:        Generic form registration validation functions
    REVISIONS:          N/A
 */
export function emailConstraint(id) {
    let val = document.getElementById(id).value;
    return val.match(/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
}
export function validateConstraint(id) {
    let val = document.getElementById(id).value;
    return val.match((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/));
}
export function confirmConstraint(id_pass, id_pass_conf) {
    let pConf = document.getElementById(id_pass).value;
    let pConfVal = document.getElementById(id_pass_conf).value;
    return pConf === pConfVal;
}
export function zipCodeConstraint(id) {
    let val = document.getElementById(id).value;
    return val.match(/^\d{5}$|^\d{5}-\d{4}$/);
}
/*
    Generalized validation function
 */
export function validator(inputType, invalidMessageType, invalidMessageTypeId, constraintType) {
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
    }
    else {
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
export const INVALID_PASS_MSS = `
    <div class="error-message" id="invalidPass">
        <small class="text-danger">
          Password be more than 8 or more characters long, contain at least 1 uppercase character, 1 lowercase character, and 1 number.
        </small>
    </div>
`;
export const INVALID_PASS_CONF_MSS = `
    <div class="error-message" id="invalidPassConf">
        <small class="text-danger">
          Password's do not match.
        </small>
    </div>
`;
export const INVALID_EMAIL_MSS = `
    <div class="error-message" id="invalidEmail">
        <small class="text-danger">
          Email is not valid.
        </small>
    </div>
`;
export const INVALID_F_NAME_MSS = `
    <div class="error-message" id="invalidFName">
        <small class="text-danger">
          Firstname must be more than 1 character.
        </small>
    </div>
`;
export const INVALID_L_NAME_MSS = `
    <div class="error-message" id="invalidLName">
        <small class="text-danger">
          Lastname must be more than 2 characters.
        </small>
    </div>
`;
export const INVALID_STREET_MSS = `
    <div class="error-message" id="invalidStreet">
        <small class="text-danger">
          Street Address cannot be empty.
        </small>
    </div>
`;
export const INVALID_ZIP_MSS = `
    <div class="error-message" id="invalidZip">
        <small class="text-danger">
          ZIP code is not valid.
        </small>
    </div>
`;
