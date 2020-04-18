export function replaceBtn(btn) {
    let ref = $(btn);
    ref.html(`<i class="fas fa-spinner fa-pulse"></i>`);
    ref.prop("disabled", true);
}
