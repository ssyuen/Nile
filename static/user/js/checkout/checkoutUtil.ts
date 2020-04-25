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
    form.addClass("d-none");
    $.each(parameters, function (key, obj) {
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                let field = $('<input></input>');
                field.attr("type", "hidden");
                field.attr("name", <string | any>k);
                field.attr("value", <string | any>obj[k]);
                form.append(field);
            }
        }
    });
    // Form NEEDS to be in th document body to submit form
    $(document.body).append(form);
    form.submit();
}

export interface IFormable {
    name: string,
    value: string
}

export const SALES_TAX = {
    "GA": 1.50,
    "CA": 2.50
};


export const arrSum = arr => arr.reduce((a, b) => a + b, 0);
export const convertToNumber = arr => arr.map(Number);
