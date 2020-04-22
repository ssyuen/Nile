$(document).ready(function () {
    var dt = $('#orderHistory').DataTable({
        responsive: true,
        order: [[0, 'asc']],
        rowGroup: {
            dataSrc: 0,
            endRender: function (rows, group) {
                var total = rows
                    .data()
                    .pluck(1)
                    .reduce(function (a, b) {
                    return a + b.replace("$", '') * 1;
                }, 0);
                return 'Order Total for ' + group + ': ' +
                    $.fn.dataTable.render.number(',', '.', 2, '$').display(total).bold();
            }
        }
    });
    dt.column(0).visible(false);
    $(".dtrg-group.dtrg-start")
        .find(":first-child")
        .prepend("<span class='mr-3'>Order Confirmation #:</span>");
});
