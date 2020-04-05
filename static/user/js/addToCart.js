$("#addToCartBtn").click(function () {
    if ($(this).hasClass("blue-gradient")) {
        addToCart(this);
    }
    else {
        removeFromCart(this);
    }
    $('#cartTotal').load(document.URL + ' #cartTotal');
});
function addToCart(btn) {
    $(btn).removeClass("blue-gradient");
    $(btn).addClass("btn-outline-success");
    $(btn).children("span").html("Added to Cart");
    $.ajax({
        url: '/product/',
        type: 'POST',
        data: { 'bookISBN': $("#bookISBN").attr("nile-isbn") }
    });
    console.log('posted');
}
function removeFromCart(btn) {
    $(btn).removeClass("btn-outline-success");
    $(btn).addClass("blue-gradient");
    $(btn).children("span").html("Add to Cart");
    $.ajax({
        url: '/product/',
        type: 'POST',
        data: { 'bookISBN': $("#bookISBN").attr("nile-isbn") }
    });
}
