import { RegistrationInputValidator, PURPOSE } from "../../../common/js/registration/regValidation.js";
import { isDirty } from "./ShippingPaymentCommon.js";
const FORM = document.getElementById("changeNameForm");
const F_NAME = document.getElementById("inputFirstname");
const L_NAME = document.getElementById("inputLastname");
let oldFirst = F_NAME.value;
let oldLast = L_NAME.value;
const EDIT = document.getElementById("editBtn");
const vc = new RegistrationInputValidator();
$(FORM).on("submit", function (e) {
    if (!isDirty()) {
        window.alert("No changes were detected");
        e.preventDefault();
        return false;
    }
    if (!vc.validateAll("#nameDetails")) {
        e.preventDefault();
        return;
    }
    $("#changeNameBtn").attr("disabled", "true");
});
function onlyOnEdit() {
    Array('input', 'focusin').forEach((evt) => {
        F_NAME.addEventListener(evt, function () {
            $(this).attr("required", "true");
            vc.setValidity(this, this, PURPOSE.Firstname, PURPOSE.Firstname.constraint(this.value));
        });
        L_NAME.addEventListener(evt, function () {
            $(this).attr("required", "false");
            vc.setValidity(this, this, PURPOSE.Lastname, PURPOSE.Lastname.constraint(this.value));
        });
    });
}
EDIT.addEventListener("click", function () {
    F_NAME.removeAttribute("readonly");
    F_NAME.setAttribute("aria-readonly", "false");
    L_NAME.removeAttribute("readonly");
    L_NAME.setAttribute("aria-readonly", "false");
    onlyOnEdit(); //Register the event listeners only when edit has been clicked
});
$(function () {
    $(".fa-user").removeClass("active");
});
