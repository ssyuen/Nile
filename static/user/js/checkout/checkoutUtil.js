export function serializedToObject(items) {
    var data = {};
    $(items).serializeArray().map(function (x) {
        data[x.name] = x.value;
    });
    return data;
}
export function post(path, method = "POST", ...parameters) {
    let form = $('<form></form>');
    form.attr({ "method": method, "action": path });
    form.addClass("d-none");
    $.each(parameters, function (key, value) {
        let field = $('<input></input>');
        field.attr("type", "hidden");
        field.attr("name", key);
        field.attr("value", value);
        form.append(field);
    });
    // Form NEEDS to be in th document body to submit form
    $(document.body).append(form);
    form.submit();
}
export const SALES_TAX = {
    "GA": 1.50,
    "CA": 2.50
};
