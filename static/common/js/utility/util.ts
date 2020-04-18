export function replaceBtn(btn: HTMLButtonElement | string | any) {
    let ref = $(btn);
    ref.html(`<i class="fas fa-spinner fa-pulse"></i>`);
    ref.prop("disabled", true);
}