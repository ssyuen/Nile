import { RegistrationInputValidator, PURPOSE } from "./regValidation.js";
const FORM = document.getElementById("resetPasswordForm");
const PASS_NEW = document.getElementById("newPassword");
const PASS_CONF = document.getElementById("confirmNewPassword");
const vc = new RegistrationInputValidator();
FORM.addEventListener("submit", function (e) {
    if (!vc.validateAll(".card-title")) {
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
        vc.setValidity(this, this, PURPOSE.PasswordConfirmation, PURPOSE.PasswordConfirmation.constraint(PASS_NEW.value, this.value));
    });
});
$("#resetBtn").click(function () {
    $(FORM).submit();
});
window.onbeforeunload = function (e) {
    let exit = true;
    if (PASS_NEW.value.length || PASS_CONF.value.length) {
        var conf = confirm("You have unsaved changes. Are you sure you want to continue?");
        exit = conf;
    }
    if (!exit) {
        e.preventDefault();
        return false;
    }
};
