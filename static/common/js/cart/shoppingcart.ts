/*
    TYPE:               SCRIPT
    FILE NAME:          shoppingcart.ts
    DESCRIPTION:        Adds functionality for the shopping cart page
    ASSOCIATED HTML:    reg.html
    REVISIONS:          3rd - As of 3/20/2020
 */

import {CountUp} from '../../../jsplugin/countUp.min.js';
import {adjustCartTotal} from "./cartUtil.js";

const NILE_ISBN_ATTR: string = "nile-isbn";
const NILE_BUY_PR_ATTR: string = "buying-price";

const DURATION_SEC: number = 0.5;   //ANIMATION DURATION IN SECONDS
const DURATION_M_SEC: number = 500; //PROPORTIONAL TIMEOUT DURATION IN MILLISECONDS

const SESSION = new Map<string, CountUp>();

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
            updateIndividual(inp as HTMLInputElement);
        }
        setTimeout(updateTotal, DURATION_M_SEC);
    }
});


$(".quantity").on("input", function (evt: Event) {
    let check = parseInt(<string>$(evt.target).val());
    if (check <= 0 || check > 80 || isNaN(check) || check === null || check === undefined) {
        evt.preventDefault();
        return false;
    }
    let x: HTMLInputElement = (evt.target) as HTMLInputElement;
    updateIndividual(x);
    setTimeout(updateTotal, DURATION_M_SEC);
    let isbn = $(evt.target).attr("nile-isbn");

    $.ajax({
        url: '/shoppingcart/',
        type: 'POST',
        data: {'bookISBN': isbn, 'newQuantity': $(evt.target).val()}
    });
});

function updateIndividual(inp: HTMLInputElement): any {
    let origPrice = parseFloat(inp.getAttribute(NILE_BUY_PR_ATTR));
    let isbn = inp.getAttribute(NILE_ISBN_ATTR);
    let quantity = parseInt(inp.value);
    let priceElem = getPrice(inp);

    if (isbn in SESSION) {
        let counter = SESSION[isbn];
        if (quantity === 1) {
            counter.update(origPrice)
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
            SESSION[isbn] = new CountUp(priceElem, origPrice, options)
        } else {
            SESSION[isbn] = new CountUp(priceElem, origPrice * quantity, options)
        }
        startAnimation(SESSION[isbn]);
    }
}

function updateTotal(): any {
    let inst = SESSION['totalCounter'];
    inst.update(calcTotal());
}

function calcTotal(): number {
    let allSelect = $(".quantity");
    let total: number = 0.00;
    for (let val of allSelect) {
        let priceOfBook = parseFloat(getPrice(val).innerHTML);
        total += priceOfBook;
    }
    return total;
}

function startAnimation(ctr: CountUp, callback?: Function): any {
    if (!ctr.error) {
        ctr.start(callback);
    } else {
        console.error(ctr.error);
    }
}

function getPrice(inputElement: HTMLElement): HTMLElement {
    return $(inputElement).parent().parent().next().find('div.quant-price')[0];
}

$('.remove-btn').on('click', function () {
    $(this).closest('tr').remove();
    setTimeout(updateTotal, DURATION_M_SEC);
    isCartEmpty();
    let isbn = $(this).attr("nile-isbn");

    $.ajax({
        url: '/shoppingcart/',
        type: 'POST',
        data: {'bookISBN': isbn}
    });

    let valAsInt: number = parseInt($("#cartTotal").html());
    adjustCartTotal(--valAsInt);
});


$(".plus").on("click", function (evt: Event) {
    let closestQuant = $(this).prev(".quantity");
    let increment = parseInt(<string>$(closestQuant).val()) + 1;
    if (increment > 0 && increment <= 80) {
        $(closestQuant).attr("value", increment).trigger("input");
    }
});

$(".minus").on("click", function (evt: Event) {
    let closestQuant = $(this).next(".quantity");
    let increment = parseInt(<string>$(closestQuant).val()) - 1;
    if (increment > 0 && increment <= 80) {
        $(closestQuant).attr("value", increment).trigger("input");
    }
});

function isCartEmpty(): boolean {
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