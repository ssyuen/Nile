import { RegistrationInputValidator, PURPOSE } from "../regValidation.js";
const FORM = document.getElementById("changePassForm");
const PASS_CURR = document.getElementById("currentPassword");
const PASS_NEW = document.getElementById("newPassword");
const PASS_CONF = document.getElementById("confirmNewPassword");
const vc = new RegistrationInputValidator();
$(FORM).on("submit", function (e) {
    if (!vc.validateAll("#nameDetails")) {
        e.preventDefault();
        return false;
    }
    if (PASS_NEW.value === PASS_CURR.value || PASS_CONF.value === PASS_CURR.value) {
        alert("Your new password cannot be the same as your old one.");
        PASS_CURR.value = '';
        PASS_NEW.value = '';
        PASS_CONF.value = '';
        e.preventDefault();
        return false;
    }
});
Array('input', 'focusin').forEach((evt) => {
    PASS_NEW.addEventListener(evt, function () {
        vc.setValidity(this, this, PURPOSE.Password, PURPOSE.Password.constraint(this.value));
        vc.setValidity(PASS_CONF, PASS_CONF, PURPOSE.PasswordConfirmation, PURPOSE.PasswordConfirmation.constraint(this.value, PASS_CONF.value));
    });
    PASS_CONF.addEventListener(evt, function () {
        vc.setValidity(PASS_CONF, PASS_CONF, PURPOSE.PasswordConfirmation, PURPOSE.PasswordConfirmation.constraint(PASS_NEW.value, this.value));
    });
});
