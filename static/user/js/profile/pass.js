import { RegistrationInputValidator, PURPOSE } from "../regValidation.js";
import { isDirty } from "./ShippingPaymentCommon.js";
const FORM = document.getElementById("changePassForm");
const PASS_CURR = document.getElementById("currentPassword");
const PASS_NEW = document.getElementById("newPassword");
const PASS_CONF = document.getElementById("confirmNewPassword");
const vc = new RegistrationInputValidator();
FORM.addEventListener("submit", function (e) {
    if (!isDirty()) {
        window.alert("No changes were detected");
        e.preventDefault();
        return false;
    }
    if (!vc.validateAll("#nameDetails")) {
        e.preventDefault();
        return;
    }
});
Array('input', 'focusin').forEach((evt) => {
    PASS_NEW.addEventListener(evt, function () {
        vc.setValidity(this, this, PURPOSE.Password, PURPOSE.Password.constraint(this.value));
        vc.setValidity(PASS_CONF, PASS_CONF, PURPOSE.PasswordConfirmation, PURPOSE.PasswordConfirmation.constraint(this.value, PASS_CONF.value));
    });
    PASS_CONF.addEventListener(evt, function () {
        let loc = "#inputLastnameGroup";
        vc.setValidity(PASS_CONF, PASS_CONF, PURPOSE.PasswordConfirmation, PURPOSE.PasswordConfirmation.constraint(PASS_NEW.value, this.value));
    });
});
//Make sure the User saved their Changes!!
// @ts-ignore
$("#accountListings").click(function (e) {
    let exit = true;
    if (PASS_CURR.value.length) {
        var conf = confirm("You have unsaved changes. Are you sure you want to continue?");
        exit = conf;
    }
    if (!exit) {
        e.preventDefault();
        return false;
    }
});
