import { InputValidationComplex, PURPOSE } from "./inputvalidation.js";
let vc = new InputValidationComplex();
const A_FNAME = document.getElementById("authorFirstName");
const A_LNAME = document.getElementById("authorLastName");
const BOOK_TITLE = document.getElementById("bookTitle");
const ISBN = document.getElementById("isbn");
const PUBLISHER = document.getElementById("publisher");

// GOES THROUGH EACH INPUT AND CHECKS
Array('input', 'focusin').forEach((evt) => {
    console.log("INSIDE MANAGE BOOKS");
    // CHECK BOOK_TITLE
    [BOOK_TITLE].forEach(function (elem) {
        elem.addEventListener(evt, function () {
        });
    });

