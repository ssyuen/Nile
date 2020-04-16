export function adjustCartTotal(adjustment: number) {
    $('#cartTotal').html((adjustment).toString());
}