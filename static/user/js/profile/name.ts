import {
    RegistrationInputValidator, PURPOSE
} from "../regValidation.js";
import {isDirty} from "./ShippingPaymentCommon";

const FORM: HTMLFormElement = document.getElementById("changeNameForm") as HTMLFormElement;
const F_NAME: HTMLInputElement = document.getElementById("inputFirstname") as HTMLInputElement;
const L_NAME: HTMLInputElement = document.getElementById("inputLastname") as HTMLInputElement;

let oldFirst: string = F_NAME.value;
let oldLast: string = L_NAME.value;

const EDIT: HTMLButtonElement = document.getElementById("editBtn") as HTMLButtonElement;

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


Array<string>('input', 'focusin').forEach((evt: string) => {

    F_NAME.addEventListener(evt, function () {
        if ($(F_NAME).is("[readonly]")) return false;

        let loc = "#inputFirstnameGroup";
        vc.setValidity(this, loc, PURPOSE.Firstname, PURPOSE.Firstname.constraint(this.value));
    });

    L_NAME.addEventListener(evt, function () {
        if ($(L_NAME).is("[readonly]")) return false;
        let loc = "#inputLastnameGroup";
        vc.setValidity(this, loc, PURPOSE.Lastname, PURPOSE.Lastname.constraint(this.value));
    });
});

EDIT.addEventListener("click", function () {
    F_NAME.removeAttribute("readonly");
    F_NAME.setAttribute("aria-readonly", "false");

    L_NAME.removeAttribute("readonly");
    L_NAME.setAttribute("aria-readonly", "false")
});


//Make sure the User saved their Changes!!
// @ts-ignore
$("#accountListings").click(function (e: Event) {
    let exit: boolean = true;
    if (oldFirst != F_NAME.value || oldLast != L_NAME.value) {
        let conf = confirm("You have unsaved changes. Are you sure you want to continue?");
        exit = conf;
    }
    if (!exit) {
        e.preventDefault();
        return false;
    }
});





