import {AdminInputValidator, PURPOSE} from "../adminInputValidation.js";
import {replaceBtn} from "../../../common/js/utility/util.js";

$("#editBtn").click(function () {
    $("#manageBooksForm input, #manageBooksForm select, #manageBooksForm textarea").removeAttr("disabled");
});

let vc = new AdminInputValidator();
const A_FNAME = document.getElementById("authorFirstName");
const A_LNAME = document.getElementById("authorLastName");
const BOOK_TITLE = document.getElementById("bookTitle");
const ISBN = document.getElementById("isbn");
const PUBLISHER = document.getElementById("publisher");
const FORM = document.getElementById("manageBooksForm");

// GOES THROUGH EACH INPUT AND CHECKS
Array('input', 'focusin').forEach((evt) => {
    console.log("INSIDE MANAGE BOOKS");
    // CHECK BOOK_TITLE
    BOOK_TITLE.addEventListener(evt, function () {
        vc.setValidity(this as HTMLInputElement, this, PURPOSE.TITLE, PURPOSE.TITLE.constraint(this.value));
    });

    A_FNAME.addEventListener(evt, function () {
        vc.setValidity(this as HTMLInputElement, this, PURPOSE.Firstname, PURPOSE.Firstname.constraint(this.value));
    });

    A_LNAME.addEventListener(evt, function () {
        vc.setValidity(this as HTMLInputElement, this, PURPOSE.Lastname, PURPOSE.Lastname.constraint(this.value));
    });

    ISBN.addEventListener(evt, function () {
        vc.setValidity(this as HTMLInputElement, this, PURPOSE.ISBN, PURPOSE.ISBN.constraint(this.value));
    });

    PUBLISHER.addEventListener(evt, function () {
        vc.setValidity(this as HTMLInputElement, this, PURPOSE.PUBLISHER, PURPOSE.PUBLISHER.constraint(this.value));
    });
});

$(FORM).on("submit", function (e) {
    if ($("#manageBooksForm input, #manageBooksForm select, #manageBooksForm textarea").attr("disabled")) {
        e.preventDefault();
        return false;
    }
    if (!vc.validateAll('.card-title')) {
        e.preventDefault();
        return false;
    }
    replaceBtn($("#updateBtn"));
});