import {RegistrationInputValidator} from "../regValidation";

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

export function submitUpdate(form: HTMLFormElement, ...names: Appendable[]) {
    $(form).submit(function (e) {

        for (let n of names) {
            let x = $("<input>").attr("type", "hidden").attr("name", n['name']).val(n['value']);
            $(form).append(x);
        }
        let flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.EDIT);
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

export const GeneralFormValidity = new Map<string, RegistrationInputValidator>();

$(":input").click(function (event) {
    if ($(this).attr("readonly") || $(this).attr("readonly")) {
        alert("Click the EDIT button to change values");
    }
});

// $(".collapse-btn-ico").click(function () {
//     $(this).toggleClass("fa-angle-down fa-angle-up")
// });

/* LETS DO THE INPUT CHANGE DETECTION HERE */

var _isDirty = false;

$(':input').change(function () {
    _isDirty = true;
});

window.onbeforeunload = function (ev) {
    if (_isDirty) {
        promptConfirm(ev);
    }
};

$("#accountListings").on('click', function (e: Event) {
    if (_isDirty) {
        promptConfirm(e);
    }
});

