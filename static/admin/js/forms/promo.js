import { PromoInputValidator, PURPOSE } from "../promoInputValidation.js";
let vc = new PromoInputValidator();
const PROMO_NAME = document.getElementById("promoName");
const PROMO_CODE = document.getElementById("promoCode");
const PROMO_AMOUNT = document.getElementById("promoAmt");
Array('input', 'focusin').forEach((evt) => {
    console.log("TESTING PROMOTIONS");
    // CHECK BOOK_TITLE
    PROMO_NAME.addEventListener(evt, function () {
        vc.setValidity(this, this, PURPOSE.PromoName, PURPOSE.PromoName.constraint(this.value));
    });
    PROMO_CODE.addEventListener(evt, function () {
        vc.setValidity(this, this, PURPOSE.PromoCode, PURPOSE.PromoCode.constraint(this.value));
    });
    PROMO_AMOUNT.addEventListener(evt, function () {
        vc.setValidity(this, this, PURPOSE.PromoAmount, PURPOSE.PromoAmount.constraint(this.value));
    });
});
$(function () {
    /*
        Here we can set the minimum date for the expiry
     */
    let now = new Date();
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let date = ("0" + now.getDate()).slice(-2);
    $("#promoExpiry").attr("min", `${now.getFullYear()}-${month}-${date}`);
    /* Lets put a 25 year promotion cap */
    $("#promoExpiry").attr("max", `${now.getFullYear() + 25}-${month}-${date}`);
});
$('#promoForm').on('submit', function (e) {
    if (!vc.validateAll('.card-title')) {
        e.preventDefault();
        return false;
    }
    let now = new Date();
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let date = ("0" + now.getDate()).slice(-2);
    let promoStartInput = $('<input>')
        .attr('type', 'hidden')
        .attr('name', 'promoStart')
        .val(`${now.getFullYear()}-${month}-${date}`);
    $(this).append(promoStartInput);
});
