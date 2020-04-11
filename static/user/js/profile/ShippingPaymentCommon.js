export var PostFlags;
(function (PostFlags) {
    PostFlags["REMOVE"] = "REMOVE_FLAG";
    PostFlags["EDIT"] = "EDIT_FLAG";
    PostFlags["CREATE"] = "CREATE_FLAG";
})(PostFlags || (PostFlags = {}));
export function submitRemoval(form, ...names) {
    $(form).on("submit", function (e) {
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
export function submitUpdate(form, ...names) {
    $(form).on("submit", function (e) {
        for (let n of names) {
            let x = $("<input>").attr("type", "hidden").attr("name", n['name']).val(n['value']);
            $(form).append(x);
        }
        let flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.EDIT);
        $(form).append(flag);
    });
}
export function submit(form, ...names) {
    $(form).on("submit", function (e) {
        for (let n of names) {
            let x = $("<input>").attr("type", "hidden").attr("name", n['name']).val(n['value']);
            $(form).append(x);
        }
        let flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.CREATE);
        $(form).append(flag);
    });
}
export function getClosestForm(event) {
    let buttonCaller = event.target;
    return $(buttonCaller).closest("form")[0];
}
export function getClosestCard(event) {
    let buttonCaller = event.target;
    return $(buttonCaller).closest('.card')[0];
}
export function promptConfirm(e) {
    let exit = confirm("You have unsaved changes. Are you sure you want to continue?");
    if (!exit) {
        e.preventDefault();
        return false;
    }
}
export const GeneralFormValidity = new Map();
$(":input").click(function (event) {
    if ($(this).attr("readonly") || $(this).attr("disabled")) {
        alert("Click the EDIT button to change values");
        event.preventDefault();
        return false;
    }
});
// $(".collapse-btn-ico").click(function () {
//     $(this).toggleClass("fa-angle-down fa-angle-up")
// });
/* LETS DO THE INPUT CHANGE DETECTION HERE */
var _isDirty = false;
export function isDirty() {
    return _isDirty;
}
$(':input').change(function () {
    _isDirty = true;
});
window.onbeforeunload = function (ev) {
    if (_isDirty) {
        promptConfirm(ev);
    }
};
$("#accountListings").on('click', function (e) {
    if (_isDirty) {
        promptConfirm(e);
    }
});
