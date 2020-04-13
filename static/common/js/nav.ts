$('#searchFilter').on("change", function (event) {
    let font = $(this).find(":selected").css("font");
    let opt = $(this).find(":selected").text();
    $(this).width(getTextWidth(opt, font) * 1.5);
});

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    // @ts-ignore
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}