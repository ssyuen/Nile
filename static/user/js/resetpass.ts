import {
    InputValidationComplex, PURPOSE
} from "./inputvalidation.js";

const FORM: HTMLFormElement = document.getElementById("resetPasswordForm") as HTMLFormElement;
const PASS_NEW: HTMLInputElement = document.getElementById("newPassword") as HTMLInputElement;
const PASS_CONF: HTMLInputElement = document.getElementById("confirmNewPassword") as HTMLInputElement;

const vc = new InputValidationComplex();

FORM.addEventListener("submit", function (e) {

    if (!vc.validateAll(".card-title")) {
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
        vc.setValidity(this, this, PURPOSE.PasswordConfirmation, PURPOSE.PasswordConfirmation.constraint(PASS_NEW.value, this.value))
    });
});

$(document).ready(function () {
    $("#resetBtn").click(function () {
        $(FORM).submit();
    });
});

window.onbeforeunload = function (e: Event) {
    let exit: boolean = true;
    if (PASS_NEW.value.length || PASS_CONF.value.length) {
        var conf = confirm("You have unsaved changes. Are you sure you want to continue?");
        exit = conf;
    }
    if (!exit) {
        e.preventDefault();
        return false;
    }
};