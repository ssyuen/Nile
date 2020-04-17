/*
    TYPE:               SCRIPT
    FILE NAME:          shoppingcart.ts
    DESCRIPTION:        Adds functionality for the shopping cart page
    ASSOCIATED HTML:    reg.html
    REVISIONS:          3rd - As of 3/20/2020
 */
// POC
// const SESSION = {
//     "9789667234578": new CountUp(target: "xcvu", 20.99, options),
//     "9789651234578": new CountUp(target: "xcvv", 20.99, options)
// };
//
//
// session['9789667234578'].start();
// session['9789651234578'].start();
/*
 * I used window.sessionStorage to store information about quantity.
 * This allows the browser session to remember the quantity of each product
 * rather than send a get request every time we go to the addToCart page.
 * To view the application storage, open the browser dev tools, and go
 * to the Application tab. Under storage, go to session storage.
 * The ONLY TIME that we update the quantity in the DB is when the user
 * clicks checkout
 */
import { CountUp } from '../../jsplugin/countUp.min.js';
import { adjustCartTotal } from "./cartUtil.js";
const NILE_ISBN_ATTR = "nile-isbn";
const NILE_BUY_PR_ATTR = "buying-price";
const DURATION_SEC = 0.5; //ANIMATION DURATION IN SECONDS
const DURATION_M_SEC = 500; //PROPORTIONAL TIMEOUT DURATION IN MILLISECONDS
const SESSION = new Map();
/* DEFAULT COUNTER */
SESSION['totalCounter'] = new CountUp("totalPrice", 0, {
    decimalPlaces: 2,
    duration: DURATION_SEC,
    startVal: 0.00
});
SESSION['totalCounter'].start();
$(() => {
    if (!isCartEmpty()) {
        let allSelect = $("select.form-control");
        for (let sel of allSelect) {
            let isbn = sel.getAttribute(NILE_ISBN_ATTR);
            if (isbn in window.sessionStorage) {
                $(sel).children(`option[value=${window.sessionStorage[isbn]}]`).attr('selected', 'selected');
                updateIndividual(sel);
            }
            else {
                window.sessionStorage[isbn] = '1';
            }
        }
        setTimeout(updateTotal, DURATION_M_SEC);
    }
});
$("select.form-control").change(evt => {
    let x = (evt.target);
    updateIndividual(x);
    setTimeout(updateTotal, DURATION_M_SEC);
    let isbn = $(evt.target).attr("nile-isbn");
    $.ajax({
        url: '/shoppingcart/',
        type: 'POST',
        data: { 'bookISBN': isbn, 'newQuantity': $(evt.target).val() }
    });
});
function updateIndividual(sel) {
    let origPrice = parseFloat(sel.getAttribute(NILE_BUY_PR_ATTR));
    let isbn = sel.getAttribute(NILE_ISBN_ATTR);
    let quantity = parseInt(sel.value);
    let priceElem = getPrice(sel);
    if (isbn in SESSION) {
        let counter = SESSION[isbn];
        if (quantity === 1) {
            counter.update(origPrice);
        }
        else {
            counter.update(origPrice * quantity);
        }
    }
    else {
        const options = {
            decimalPlaces: 2,
            duration: DURATION_SEC,
            startVal: origPrice
        };
        if (quantity === 1) {
            SESSION[isbn] = new CountUp(priceElem, origPrice, options);
        }
        else {
            SESSION[isbn] = new CountUp(priceElem, origPrice * quantity, options);
        }
        startAnimation(SESSION[isbn]);
    }
    window.sessionStorage.setItem(isbn, quantity.toString());
}
function updateTotal() {
    let inst = SESSION['totalCounter'];
    inst.update(calcTotal());
}
function calcTotal() {
    let allSelect = $("select.form-control");
    let total = 0.00;
    for (let val of allSelect) {
        let priceOfBook = parseFloat(getPrice(val).innerHTML);
        total += priceOfBook;
    }
    return total;
}
function startAnimation(ctr, callback) {
    if (!ctr.error) {
        ctr.start(callback);
    }
    else {
        console.error(ctr.error);
    }
}
function getPrice(selectElement) {
    return $(selectElement).parent().next().find('div.quant-price')[0];
}
$('.table-shopping-cart').on('click', 'button', function () {
    $(this).closest('tr').remove();
    setTimeout(updateTotal, DURATION_M_SEC);
    isCartEmpty();
    let isbn = $(this).attr("nile-isbn");
    window.sessionStorage.removeItem(isbn);
    $.ajax({
        url: '/shoppingcart/',
        type: 'POST',
        data: { 'bookISBN': isbn }
    });
    let valAsInt = parseInt($("#cartTotal").html());
    adjustCartTotal(--valAsInt);
});
function isCartEmpty() {
    if ($('.table-shopping-cart > tbody > tr').length === 0 ||
        $('.dataTables_empty').length) {
        $("#checkoutBtn").addClass("d-none");
        $("#cartEmptyCard").removeClass("d-none");
        $("#cartCard").addClass("d-none");
        $("#searchCart").prop("disabled", true);
        return true;
    }
    return false;
}
/* This event listener is a fail safe. Ignore it for now. */
$("#checkoutBtn").on("click", (evt) => {
    if (isCartEmpty()) {
        alert("You're Cart is empty");
        evt.preventDefault();
    }
});
