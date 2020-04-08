export enum PostFlags {
    REMOVE = "REMOVE_FLAG",
    EDIT = "EDIT_FLAG",
    CREATE = "CREATE_FLAG"
}

export interface Appendable {
    name: string
    value: string
}


export function submitRemoval(form: HTMLFormElement, ...names: Appendable[]) {

    $(form).submit(function (e) {
        let ans = confirm("Are you sure you would like to remove this?");

        if (!ans) {
            e.preventDefault();
            return false;
        }

        for (let n of names) {
            let x = $("<input>").attr("type", "hidden").attr("name", n['name']).val(n['value']);
            $(form).append(x);
        }
        let flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.REMOVE);
        $(form).append(flag);
    });
}


export function getClosestForm(event): HTMLFormElement {
    let buttonCaller: HTMLButtonElement = event.target;
    return <HTMLFormElement><any>$(buttonCaller).closest("form")[0];
}

export function getClosestCard(event): HTMLElement {
    let buttonCaller: HTMLButtonElement = event.target;
    return <HTMLElement><any>$(buttonCaller).closest('.card')[0];
}

export function promptConfirm(e: Event) {
    let exit = confirm("You have unsaved changes. Are you sure you want to continue?");
    if (!exit) {
        e.preventDefault();
        return false;
    }
}

$(".edit-btn").click(function (event) {
    let form: HTMLFormElement = <HTMLFormElement><any>$(getClosestCard(event)).find("form").first();
    $(form).find("input, select").removeAttr("readonly disabled")
});


$(":input").click(function (event) {
    if ($(this).attr("readonly") || $(this).attr("readonly")) {
        alert("Click the EDIT button to change values");
    }
});