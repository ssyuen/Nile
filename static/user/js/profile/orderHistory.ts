import {addToCart} from "../../../common/js/cart/addToCart.js";

$(document).ready(function () {
    var dt = (<any>$('#orderHistory')).DataTable({
        responsive: true,
        order: [[0, 'asc']],
        columnDefs: [
            {targets: [2], orderable: false}
        ],
        rowGroup: {
            dataSrc: 0,

            endRender: function (rows, group, level) {
                var text = rows
                    .data()[0][8];
                console.log(text);
                return text;
            }
        }
    });
    dt.column(0).visible(false);
    dt.column(8).visible(false);
});

//In Order history, we can add to cart, but we can't remove from cart
$(".reorderBtn").click(function () {
    let sel = $(this).closest('tr').children('.isbn').text();
    if ($(this).hasClass("blue-gradient")) {
        addToCart(this as HTMLButtonElement, sel);
    } else {
        window.alert("To remove this item, go to your shopping cart");
    }
});
