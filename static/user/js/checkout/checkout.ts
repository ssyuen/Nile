export const COUNTER_DURATION = 0.5;

export function stopAllInput(entry: JQuery) {
    $(entry).find(<any>'select').prop("disabled", true);
    $(entry).find(<any>'input').prop("readonly", true);
}

export function forceEntry(formEntry: JQuery, toggleLabel: JQuery, toggler: JQuery, toggleText: string) {
    formEntry.addClass("show");
    toggleLabel.text(toggleText)
        .removeClass("custom-control-label")
        .closest(".custom-control")
        .removeClass("custom-control");
    toggler.hide();
}

export function switchToggler(toggler: HTMLElement | string | any) {
    if ($(toggler).text() === "View") {
        $(toggler).text(<any>"Close View");
    } else {
        $(toggler).text("View");
    }
}

export function checkEmptyInput(entry: JQuery<HTMLElement>): boolean {
    let result = true;
    entry.find("input:required, select:required").each(function (index, value) {
        if ($(value).is('input')) {
            if ($(value).val() === "") {
                result = false;
                return false;
            }
        } else {
            if ($(value).find(":selected").val() === "") {
                result = false;
                return false;
            }
        }
    });
    return result;
}

$('.remember-me[type="checkbox"]').on("click", function () {
    $(this).attr("value", function (index, attr) {
        return attr === '0' ? '1' : '0';
    });
});