$("#addToCartBtn").click(function () {
    if ($(this).hasClass("blue-gradient")) {
        addToCart(this as HTMLButtonElement);
    } else {
        removeFromCart(this as HTMLButtonElement);
    }
});

function addToCart(btn: HTMLButtonElement) {
    $(btn).removeClass("blue-gradient");
    $(btn).addClass("btn-outline-success");
    $(btn).children("span").html("Added to Cart");

    $.ajax({
        url: '/product/',
        type: 'POST',
        data: {'flag': CART_TYPE.ADD, 'bookISBN': $("#bookISBN").attr("nile-isbn")}
    });

    let valAsInt: number = parseInt($("#cartTotal").html());
    adjustCartTotal(++valAsInt);

    console.log('posted');
}

function removeFromCart(btn: HTMLButtonElement) {
    $(btn).removeClass("btn-outline-success");
    $(btn).addClass("blue-gradient");
    $(btn).children("span").html("Add to Cart");

    $.ajax({
        url: '/product/',
        type: 'POST',
        data: {'flag': CART_TYPE.REMOVE, 'bookISBN': $("#bookISBN").attr("nile-isbn")}
    });

    let valAsInt: number = parseInt($("#cartTotal").html());
    adjustCartTotal(--valAsInt);
}


function adjustCartTotal(adjustment: number) {
    $('#cartTotal').html((adjustment).toString());
}

enum CART_TYPE {
    ADD = "ADD",
    REMOVE = "REMOVE"
}