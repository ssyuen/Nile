$(document).ready(function () {
    var dt = (<any>$('#orderHistory')).DataTable({
        responsive: true,
        order: [[0, 'asc']],
        columnDefs: [
            {targets: [2], orderable: false}
        ],
        rowGroup: {
            dataSrc: 0,

            endRender: function (rows, group) {
                var total = rows
                    .data()
                    .pluck(1)
                    .reduce(function (a, b) {
                        return a + b.replace("$", '') * 1;
                    }, 0);

                return 'Order Total: ' +
                    (<any>$.fn).dataTable.render.number(',', '.', 2, '$').display(total).bold();
            }
        }
    });
    dt.column(0).visible(false);
});