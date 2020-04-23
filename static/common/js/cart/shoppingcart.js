/*
    TYPE:               SCRIPT
    FILE NAME:          shoppingcart.ts
    DESCRIPTION:        Adds functionality for the shopping cart page
    ASSOCIATED HTML:    reg.html
    REVISIONS:          3rd - As of 3/20/2020
 */
import {CountUp} from '../../../jsplugin/countUp.min.js';
import {adjustCartTotal} from "./cartUtil.js";

const NILE_ISBN_ATTR = "nile-isbn";
const NILE_BUY_PR_ATTR = "buying-price";
const DURATION_SEC = 0.5; //ANIMATION DURATION IN SECONDS
const DURATION_M_SEC = 500; //PROPORTIONAL TIMEOUT DURATION IN MILLISECONDS
const SESSION = new Map();
var cartTable;
$(document).ready(function () {
    cartTable = $('#shoppingCart').DataTable({
        "bLengthChange": false,
        "bFilter": true,
        "bInfo": false,
        "bAutoWidth": false,
        "pageLength": 5,
        "dom": '<"top"flp<"clear">>rt<"bottom"ifp<"clear">>'
    });
    $("#searchCart").on("keyup", function () {
        cartTable.search(this.value).draw();
    });
    $(".dataTables_filter").hide();
});
/* DEFAULT COUNTER */
SESSION['totalCounter'] = new CountUp("totalPrice", 0, {
    decimalPlaces: 2,
    duration: DURATION_SEC,
    startVal: 0.00
});
SESSION['totalCounter'].start();
$(() => {
    if (!isCartEmpty()) {
        let allQuant = $(".quantity");
        for (let inp of allQuant) {
            updateIndividual(inp);
        }
        setTimeout(updateTotal, DURATION_M_SEC);
    }
});
$(".quantity").on("input", function (evt) {
    let check = parseInt($(evt.target).val());
    if (check <= 0 || check > 80 || isNaN(check) || check === null || check === undefined) {
        evt.preventDefault();
        return false;
    }
    let x = (evt.target);
    updateIndividual(x);
    setTimeout(updateTotal, DURATION_M_SEC);
    let isbn = $(evt.target).attr("nile-isbn");
    $.ajax({
        url: '/shoppingcart/',
        type: 'POST',
        data: {'bookISBN': isbn, 'newQuantity': $(evt.target).val()}
    });
});
function updateIndividual(inp) {
    let origPrice = parseFloat(inp.getAttribute(NILE_BUY_PR_ATTR));
    let isbn = inp.getAttribute(NILE_ISBN_ATTR);
    let quantity = parseInt(inp.value);
    let priceElem = getPrice(inp);
    if (isbn in SESSION) {
        let counter = SESSION[isbn];
        if (quantity === 1) {
            counter.update(origPrice);
        } else {
            counter.update(origPrice * quantity);
        }
    } else {
        const options = {
            decimalPlaces: 2,
            duration: DURATION_SEC,
            startVal: origPrice
        };
        if (quantity === 1) {
            SESSION[isbn] = new CountUp(priceElem, origPrice, options);
        } else {
            SESSION[isbn] = new CountUp(priceElem, origPrice * quantity, options);
        }
        startAnimation(SESSION[isbn]);
    }
}
function updateTotal() {
    let inst = SESSION['totalCounter'];
    inst.update(calcTotal());
}
function calcTotal() {
    let allSelect = $(".quantity");
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
    } else {
        console.error(ctr.error);
    }
}
function getPrice(inputElement) {
    return $(inputElement).parent().parent().next().find('div.quant-price')[0];
}

$('#shoppingCart tbody').on('click', '.remove-btn', function () {
    cartTable
        .row($(this).parents('tr'))
        .remove()
        .draw();
    setTimeout(updateTotal, DURATION_M_SEC);
    isCartEmpty();
    let isbn = $(this).attr("nile-isbn");
    $.ajax({
        url: '/shoppingcart/',
        type: 'POST',
        data: {'bookISBN': isbn}
    });
    let valAsInt = parseInt($("#cartTotal").html());
    adjustCartTotal(--valAsInt);
});
$(".plus").on("click", function (evt) {
    let closestQuant = $(this).prev(".quantity");
    let increment = parseInt($(closestQuant).val()) + 1;
    if (increment > 0 && increment <= 80) {
        $(closestQuant).attr("value", increment).trigger("input");
    }
});
$(".minus").on("click", function (evt) {
    let closestQuant = $(this).next(".quantity");
    let increment = parseInt($(closestQuant).val()) - 1;
    if (increment > 0 && increment <= 80) {
        $(closestQuant).attr("value", increment).trigger("input");
    }
});
function isCartEmpty() {
    if (!(cartTable.data().any())) {
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
