$('#searchFilter').on("change", function (event) {
    calculateOptionWidth(this);
});

function calculateOptionWidth(opt) {
    let optText = $(opt).find(":selected").text();
    let compStyle = window.getComputedStyle(opt);
    let icoPad = parseFloat(compStyle.paddingRight);
    let fontMetric = compStyle.fontSize + ' ' + compStyle.fontFamily;
    $(opt).width(getTextWidth(optText, fontMetric) + (icoPad / 2));
}

function getTextWidth(text, font) {
    // @ts-ignore
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

$(function () {
    let opt = $("#searchFilterAllOption");
    calculateOptionWidth(opt);
});