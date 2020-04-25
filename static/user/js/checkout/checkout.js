export const COUNTER_DURATION = 0.5;

export function stopAllInput(entry) {
    $(entry).find('select').prop("disabled", true);
    $(entry).find('input').prop("readonly", true);
}

export function startCounter(ctr) {
    if (!ctr.error) {
        ctr.start();
    } else {
        console.error(ctr.error);
    }
}

export function forceEntry(formEntry, toggleLabel, toggler, toggleText) {
    formEntry.addClass("show");
    toggleLabel.text(toggleText)
        .removeClass("custom-control-label")
        .closest(".custom-control")
        .removeClass("custom-control");
    toggler.hide();
}

export function switchToggler(toggler) {
    if ($(toggler).text() === "View") {
        $(toggler).text("Close View");
    } else {
        $(toggler).text("View");
    }
}

export function checkEmptyInput(entry) {
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
