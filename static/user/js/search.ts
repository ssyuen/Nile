$("#searchBar").submit(function(e){
    e.preventDefault();

    var form = $(this);
    var url = form.attr("action");

    $.ajax({
        url: url,
        type: "POST",
        data: form.serialize(),
        success: function(books){
            $("#table").children().remove();
            for(let book in books){
                $("#table").append('<div class="col-lg-3 col-md-6 mb-4">' +
                '<a href="{{ url_for("common_bp.product", title=book["title"],price=book["price"],author_name=book["author_name"],isbn=book["ISBN"],summary=book["summary"],publicationDate=book["publicationDate"],numPages=book["numPages"],binding=book["binding"],genre=book["genre"],nile_cover_ID=book["nile_cover_ID"]) }}">' +
                '')
            }
        }
    });
});

