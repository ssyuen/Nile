import { InputValidationComplex, PURPOSE } from "../inputvalidation.js";
const FORM = document.getElementById("changeNameForm");
const F_NAME = document.getElementById("inputFirstname");
const L_NAME = document.getElementById("inputLastname");
let oldFirst = F_NAME.value;
let oldLast = L_NAME.value;
const EDIT_F = document.getElementById("editFirstnameBtn");
const EDIT_L = document.getElementById("editLastnameBtn");
const vc = new InputValidationComplex();
FORM.addEventListener("submit", function (e) {
    if (!vc.validateAll("#nameDetails")) {
        e.preventDefault();
        return;
    }
    //AJAX SUBMIT
});
Array('input', 'focusin').forEach((evt) => {
    F_NAME.addEventListener(evt, function () {
        if ($(F_NAME).is("[readonly]"))
            return;
        let loc = "#inputFirstnameGroup";
        vc.setValidity(this, loc, PURPOSE.Firstname, PURPOSE.Firstname.constraint(this.value));
    });
    L_NAME.addEventListener(evt, function () {
        if ($(L_NAME).is("[readonly]"))
            return;
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
$("#accountListings").click(function (e) {
    let exit = true;
    if (oldFirst != F_NAME.value || oldLast != L_NAME.value) {
        var conf = confirm("You have unsaved changes. Are you sure you want to continue?");
        exit = conf;
    }
    if (!exit) {
        e.preventDefault();
        return false;
    }
});
