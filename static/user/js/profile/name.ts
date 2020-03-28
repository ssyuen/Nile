import {
    InputValidationComplex, PURPOSE
} from "../inputvalidation.js";

const FORM: HTMLFormElement = document.getElementById("changeNameForm") as HTMLFormElement;
const F_NAME: HTMLInputElement = document.getElementById("inputFirstname") as HTMLInputElement;
const L_NAME: HTMLInputElement = document.getElementById("inputLastname") as HTMLInputElement;

let oldFirst: string = F_NAME.value;
let oldLast: string = L_NAME.value;

const EDIT_F: HTMLButtonElement = document.getElementById("editFirstnameBtn") as HTMLButtonElement;
const EDIT_L: HTMLButtonElement = document.getElementById("editLastnameBtn") as HTMLButtonElement;


const vc = new InputValidationComplex();


FORM.addEventListener("submit", function (e) {


    if (!vc.validateAll("#nameDetails")) {
        e.preventDefault();
        return;
    }

    //AJAX SUBMIT

});


Array<string>('input', 'focusin').forEach((evt: string) => {

    F_NAME.addEventListener(evt, function () {
        if ($(F_NAME).is("[readonly]")) return;

        let loc = "#inputFirstnameGroup";
        vc.setValidity(this, loc, PURPOSE.Firstname, PURPOSE.Firstname.constraint(this.value));
    });

    L_NAME.addEventListener(evt, function () {
        if ($(L_NAME).is("[readonly]")) return;
        let loc = "#inputLastnameGroup";
        vc.setValidity(this, loc, PURPOSE.Lastname, PURPOSE.Lastname.constraint(this.value));
    });
});

EDIT_F.addEventListener("click", function () {
    F_NAME.removeAttribute("readonly");
});

EDIT_L.addEventListener("click", function () {
    L_NAME.removeAttribute("readonly");
});

//Make sure the User saved their Changes!!
// @ts-ignore
$("#accountListings").click(function (e: Event) {
    let exit: boolean = true;
    if (oldFirst != F_NAME.value || oldLast != L_NAME.value) {
        var conf = confirm("You have unsaved changes. Are you sure you want to continue?");
        exit = conf;
    }
    if (!exit) {
        e.preventDefault();
        return false;
    }
});




