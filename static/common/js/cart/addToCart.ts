import {adjustCartTotal} from "./cartUtil.js";

$("#addToCartBtn").click(function () {
    if ($(this).hasClass("blue-gradient")) {
        addToCart(this as HTMLButtonElement, $("#bookISBN"));
    } else {
        removeFromCart(this as HTMLButtonElement, $("#bookISBN"));
    }
});

export function addToCart(btn: HTMLButtonElement, sel: JQuery) {
    $(btn).removeClass("blue-gradient");
    $(btn).addClass("btn-outline-success");
    $(btn).children("span").html("Added to Cart");

    $.ajax({
        url: '/product/',
        type: 'POST',
        data: {'flag': CART_TYPE.ADD, 'bookISBN': sel.attr("nile-isbn")}
    });

    let valAsInt: number = parseInt($("#cartTotal").html());
    adjustCartTotal(++valAsInt);

    console.log('posted');
}

export function removeFromCart(btn: HTMLButtonElement, sel: JQuery) {
    $(btn).removeClass("btn-outline-success");
    $(btn).addClass("blue-gradient");
    $(btn).children("span").html("Add to Cart");

    $.ajax({
        url: '/product/',
        type: 'POST',
        data: {'flag': CART_TYPE.REMOVE, 'bookISBN': sel.attr("nile-isbn")}
    });

    let valAsInt: number = parseInt($("#cartTotal").html());
    adjustCartTotal(--valAsInt);
}

enum CART_TYPE {
    ADD = "ADD",
    REMOVE = "REMOVE"
}