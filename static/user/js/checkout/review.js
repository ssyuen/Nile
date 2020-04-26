import { PromotionCheckoutValidation } from "./promoValidation.js";
import { CountUp } from "../../../jsplugin/countUp.min.js";
const GRAND_TOTAL = $("#checkoutTotalPrice");
const pcv = new PromotionCheckoutValidation();
const PROMO_CODE_INPUT = document.getElementById("promoCodeInput");
var promoData = null;
$("#addPromoForm").on("submit", function (e) {
    e.preventDefault();
    let ref = PROMO_CODE_INPUT.value;
    if (!pcv.validateAll(undefined)) {
        return false;
    }
    $.ajax({
        type: "POST",
        url: "/api/promo",
        data: { "PROMO_IDENT": ref },
        success: function (data) {
            if (data['code'] !== false) {
                applyPromo(data);
                promoData = data;
            }
            else {
                $("#promoCodeInputGroup").after(`<small class="text-danger" id="invalidPromo">The Promotion you entered was not valid. Idiot.</small>`);
            }
        }
    });
});
function applyPromo(data) {
    let template = `<li class="list-group-item d-flex justify-content-between bg-light sidebar-item-price">
                        <div class="text-success">
                            <h6 class="my-0 complement-light">Promo code</h6>
                            <small>${data['code']}</small>
                        </div>
                        <span class="text-success complement">%${data['value'] * 100} off</span>
                    </li>`;
    $("#salesTaxListElement").after(template);
    let ct = parseFloat(GRAND_TOTAL.text());
    let val = ct - ct * data['value'];
    let gtc = new CountUp(GRAND_TOTAL.attr('id'), val, {
        decimalPlaces: 2,
        duration: 0.5,
        startVal: ct
    });
    if (!gtc.error) {
        gtc.start();
    }
    else {
        console.error(gtc.error);
    }
}
Array('input', 'focusin').forEach((evt) => {
    PROMO_CODE_INPUT.addEventListener(evt, function () {
        removePromoError();
        pcv.setValidity(this, $("#promoCodeInputGroup")[0], PromotionCheckoutValidation.PURPOSE.Promo, PromotionCheckoutValidation.PURPOSE.Promo.constraint(this.value));
    });
});
PROMO_CODE_INPUT.addEventListener("focusout", function () {
    $(this).removeClass("invalid");
    $(PromotionCheckoutValidation.PURPOSE.Promo.template[1]).remove();
    removePromoError();
});
function removePromoError() {
    let ref = $("#invalidPromo");
    if (ref.length) {
        ref.remove();
    }
}
