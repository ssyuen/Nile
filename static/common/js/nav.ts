document.getElementById('searchFilter').addEventListener("change", function (event) {
    calculateOptionWidth(this as HTMLOptionElement);
});

function calculateOptionWidth(opt: HTMLOptionElement) {
    let optText: string = $(opt).find(":selected").text();
    let compStyle = window.getComputedStyle(opt);
    let icoPad = parseFloat(compStyle.paddingRight);
    let fontMetric: string = compStyle.fontSize + ' ' + compStyle.fontFamily;

    $(opt).width(Math.floor(getTextWidth(optText, fontMetric) + (icoPad / 2)));
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
    let opt = document.getElementById("searchFilter");
    calculateOptionWidth(opt as HTMLOptionElement);
});
