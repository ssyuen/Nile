import { InputValidationComplex, PURPOSE } from "/static/admin/adminInputValidation.js";
let vc = new InputValidationComplex();
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
    [BOOK_TITLE].forEach(function (elem) {
        elem.addEventListener(evt, function () {
            vc.setValidity(elem, elem, PURPOSE.TITLE, PURPOSE.TITLE.constraint(elem.value));
        });
    });
    [A_FNAME].forEach(function (elem) {
        elem.addEventListener(evt, function () {
            vc.setValidity(elem, elem, PURPOSE.Firstname, PURPOSE.Firstname.constraint(elem.value));
        });
    });
    [A_LNAME].forEach(function (elem) {
        elem.addEventListener(evt, function () {
            vc.setValidity(elem, elem, PURPOSE.Lastname, PURPOSE.Lastname.constraint(elem.value));
        });
    });
    [ISBN].forEach(function (elem) {
        elem.addEventListener(evt, function () {
            vc.setValidity(elem, elem, PURPOSE.ISBN, PURPOSE.ISBN.constraint(elem.value));
        });
    });
    [PUBLISHER].forEach(function (elem) {
        elem.addEventListener(evt, function () {
            vc.setValidity(elem, elem, PURPOSE.PUBLISHER, PURPOSE.PUBLISHER.constraint(elem.value));
        });
    });
});

$(FORM).on("submit", function (e) {
    if (!vc.validateAll('.card-title')) {
        e.preventDefault();
        return false;
    }
});

$("#editBtn").click(function () {
    $("#manageBooksForm input, #manageBooksForm select, #manageBooksForm textarea").removeAttr("readonly disabled");
});
