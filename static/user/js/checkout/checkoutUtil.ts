export function serializedToObject(items): object {
    var data = {};
    $(items).serializeArray().map(function (x) {
        data[x.name] = x.value;
    });
    return data;
}

export function post(path: string, method: string = "POST", ...parameters: any[] | IFormable[]) {
    let form = $('<form></form>');
    form.attr({"method": method, "action": path});
    $.each(parameters, function (key, value) {
        let field = $('<input></input>');
        field.attr("type", "hidden");
        field.attr("name", <string | any>key);
        field.attr("value", <string | any>value);
        form.append(field);
    });
    // Form NEEDS to be in th document body to submit form
    $(document.body).append(form);
    form.submit();
}

export interface IFormable {
    name: string,
    value: string
}