export var PostFlags;
(function (PostFlags) {
    PostFlags["REMOVE"] = "REMOVE_FLAG";
    PostFlags["EDIT"] = "EDIT_FLAG";
    PostFlags["CREATE"] = "CREATE_FLAG";
})(PostFlags || (PostFlags = {}));
export function submitRemoval(form, ...names) {
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
$(".edit-btn").click(function (event) {
    let form = $(getClosestCard(event)).find("form").first();
    $(form).find("input, select").removeAttr("readonly disabled");
});
$(":input").click(function (event) {
    if ($(this).attr("readonly") || $(this).attr("readonly")) {
        alert("Click the EDIT button to change values");
    }
});
