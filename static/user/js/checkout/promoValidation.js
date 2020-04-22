import { InputValidator } from "../../../common/js/inputValidator.js";
export class PromotionCheckoutValidation extends InputValidator {
    static promoNameConstraint(value) {
        return value.length >= 1;
    }
}
PromotionCheckoutValidation.INVALID_PROMO_NAME_MSS = [`
        <small class="text-danger error-messsage" id="invalidName">
          Promo Code cannot be empty.
        </small>
`, "#invalidName"];
PromotionCheckoutValidation.PURPOSE = {
    Promo: {
        template: PromotionCheckoutValidation.INVALID_PROMO_NAME_MSS,
        constraint: PromotionCheckoutValidation.promoNameConstraint
    }
};
