$("#searchBar").submit(function(e){
    e.preventDefault();

    var form = $(this)
    var url = form.attr("action")

    $.ajax({
        url: url,
        type: "POST",
        data: form.serialize(),
        success: function(books){
            $("#table").append()
        }
    });
});


