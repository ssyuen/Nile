import { adjustCartTotal } from "./cartUtil.js";
$("#addToCartBtn").click(function () {
    if ($(this).hasClass("blue-gradient")) {
        addToCart(this, $("#bookISBN"));
    }
    else {
        removeFromCart(this, $("#bookISBN"));
    }
});

export function addToCart(btn, sel) {
    $(btn).removeClass("blue-gradient");
    $(btn).addClass("btn-outline-success");
    $(btn).children("span").html("Added to Cart");
    $.ajax({
        url: '/product/',
        type: 'POST',
        data: {'flag': CART_TYPE.ADD, 'bookISBN': sel.attr("nile-isbn")}
    });
    let valAsInt = parseInt($("#cartTotal").html());
    adjustCartTotal(++valAsInt);
    console.log('posted');
}

export function removeFromCart(btn, sel) {
    $(btn).removeClass("btn-outline-success");
    $(btn).addClass("blue-gradient");
    $(btn).children("span").html("Add to Cart");
    $.ajax({
        url: '/product/',
        type: 'POST',
        data: {'flag': CART_TYPE.REMOVE, 'bookISBN': sel.attr("nile-isbn")}
    });
    let valAsInt = parseInt($("#cartTotal").html());
    adjustCartTotal(--valAsInt);
}
var CART_TYPE;
(function (CART_TYPE) {
    CART_TYPE["ADD"] = "ADD";
    CART_TYPE["REMOVE"] = "REMOVE";
})(CART_TYPE || (CART_TYPE = {}));
