import {PromotionCheckoutValidation} from "./promoValidation.js";
import {CountUp} from "../../../jsplugin/countUp.min.js";
import {post} from "./checkoutUtil.js";
import {replaceBtn} from "../../../common/js/utility/util.js";
import {COUNTER_DURATION} from "./checkout.js";

const GRAND_TOTAL = $("#checkoutTotalPrice");
const PLACE_ORDER_BTN = $("#placeOrder");
const DUMMY = $("#dummy");
const pcv = new PromotionCheckoutValidation();
const PROMO_CODE_INPUT: HTMLInputElement = document.getElementById("promoCodeInput") as HTMLInputElement;
var promoData = null;

$("#addPromoForm").on("submit", function (e: Event) {
    e.preventDefault();

    let ref = PROMO_CODE_INPUT.value;
    if (!pcv.validateAll(undefined)) {
        return false;
    }

    if (!$(".promo-list").length && !$("#invalidPromo").length) {
        $.ajax({
            type: "POST",
            url: "/api/promo",
            data: {"PROMO_IDENT": ref},
            success: function (data) {
                if (data['code'] !== false) {
                    applyPromo(data);
                    promoData = data;
                } else {
                    $("#promoCodeInputGroup").after(`<small class="text-danger" id="invalidPromo">The Promotion you entered was not valid.</small>`);
                }
            }
        });
    }
});

function applyPromo(data: string) {
    let template = `<li class="list-group-item d-flex justify-content-between bg-light sidebar-item-price promo-list">
                        <div class="text-success">
                            <h6 class="my-0 complement-light">Promo code</h6>
                            <small>${data['code']}</small>
                        </div>
                        <span class="text-success complement">%${data['value'] * 100} off</span>
                    </li>`;
    $("#salesTaxListElement").after(template);

    let ct = parseFloat(GRAND_TOTAL.text().replace(",", ""));
    let val = ct - ct * data['value'];

    let gtc = new CountUp(GRAND_TOTAL.attr('id'), val, {
        decimalPlaces: 2,
        duration: COUNTER_DURATION,
        startVal: ct
    });

    if (!gtc.error) {
        gtc.start();
    } else {
        console.error(gtc.error);
    }
}

Array<string>('input', 'focusin').forEach((evt: string) => {
    PROMO_CODE_INPUT.addEventListener(evt, function () {
        removePromoError();
        pcv.setValidity(this,
            <HTMLElement><any>$("#promoCodeInputGroup")[0],
            PromotionCheckoutValidation.PURPOSE.Promo,
            PromotionCheckoutValidation.PURPOSE.Promo.constraint(this.value));
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

PLACE_ORDER_BTN.on("click", function () {
    let payload = {};
    if (promoData != null) {
        payload["PROMO_IDENT"] = promoData['code'];
    }
    payload["GRAND_TOTAL"] = GRAND_TOTAL.text().replace(",", "");
    replaceBtn(this);
    post(DUMMY.attr("nile-form-action"), "POST", payload);
});
