import {
    RegistrationInputValidator, PURPOSE
} from "../regValidation.js";

const FORM: HTMLFormElement = document.getElementById("changePassForm") as HTMLFormElement;
const PASS_CURR: HTMLInputElement = document.getElementById("currentPassword") as HTMLInputElement;
const PASS_NEW: HTMLInputElement = document.getElementById("newPassword") as HTMLInputElement;
const PASS_CONF: HTMLInputElement = document.getElementById("confirmNewPassword") as HTMLInputElement;

const vc = new RegistrationInputValidator();

$(FORM).on("submit", function (e) {
    if (!vc.validateAll("#nameDetails")) {
        e.preventDefault();
        return;
    }
});


Array<string>('input', 'focusin').forEach((evt: string) => {
    PASS_NEW.addEventListener(evt, function () {
        vc.setValidity(this, this, PURPOSE.Password, PURPOSE.Password.constraint(this.value));
        vc.setValidity(PASS_CONF, PASS_CONF, PURPOSE.PasswordConfirmation, PURPOSE.PasswordConfirmation.constraint(this.value, PASS_CONF.value))
    });

    PASS_CONF.addEventListener(evt, function () {
        vc.setValidity(PASS_CONF, PASS_CONF, PURPOSE.PasswordConfirmation, PURPOSE.PasswordConfirmation.constraint(PASS_NEW.value, this.value))
    });
});