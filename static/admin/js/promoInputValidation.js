import { InputValidator } from "../../common/js/inputValidator.js";
export class PromoInputValidator extends InputValidator {
    static promoNameConstraint(value) {
        return value.length >= 1;
    }
    static promoCodeConstraint(value) {
        return value.length >= 3;
    }
    static promoAmountConstraint(value) {
        return Number(value) >= 5 && Number(value) <= 75;
    }
}
PromoInputValidator.INVALID_PROMO_NAME_MSS = [`
        <small class="text-danger error-messsage" id="invalidName">
          Promotion Name must be more than 1 character.
        </small>
`, "#invalidName"];
PromoInputValidator.INVALID_PROMO_CODE_MSS = [`
        <small class="text-danger error-messsage" id="invalidCode">
          Promo Code must be more than 3 or more characters long.
        </small>
`, "#invalidCode"];
PromoInputValidator.INVALID_PROMO_AMT_MSS = [`
        <small class="text-danger error-messsage" id="invalidAmt">
          Promotion Amount must be more than or equal to 5% and less than or equal to 75%.
        </small>
`, "#invalidAmt"];
export const PURPOSE = {
    PromoName: {
        template: PromoInputValidator.INVALID_PROMO_NAME_MSS,
        constraint: PromoInputValidator.promoNameConstraint
    },
    PromoCode: {
        template: PromoInputValidator.INVALID_PROMO_CODE_MSS,
        constraint: PromoInputValidator.promoCodeConstraint
    },
    PromoAmount: {
        template: PromoInputValidator.INVALID_PROMO_AMT_MSS,
        constraint: PromoInputValidator.promoAmountConstraint
    },
};
