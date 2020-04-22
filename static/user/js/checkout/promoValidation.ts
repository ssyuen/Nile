import {InputValidator} from "../../../common/js/inputValidator.js";

export class PromotionCheckoutValidation extends InputValidator {

    static INVALID_PROMO_NAME_MSS: [string, string] = [`
        <small class="text-danger error-messsage" id="invalidName">
          Promo Code cannot be empty.
        </small>
`, "#invalidName"];
    static PURPOSE = {
        Promo: {
            template: PromotionCheckoutValidation.INVALID_PROMO_NAME_MSS,
            constraint: PromotionCheckoutValidation.promoNameConstraint
        }
    };

    public static promoNameConstraint(value: string): boolean {
        return value.length >= 1;
    }

}
