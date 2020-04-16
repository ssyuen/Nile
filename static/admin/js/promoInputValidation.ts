import {InputValidator} from "../../common/js/inputValidator.js";

export class PromoInputValidator extends InputValidator {

    static INVALID_PROMO_NAME_MSS: [string, string] = [`
        <small class="text-danger error-messsage" id="invalidName">
          Promotion Name must be more than 1 character.
        </small>
`, "#invalidName"];
    static INVALID_PROMO_CODE_MSS: [string, string] = [`
        <small class="text-danger error-messsage" id="invalidCode">
          Promo Code must be more than 3 or more characters long.
        </small>
`, "#invalidCode"];
    static INVALID_PROMO_AMT_MSS: [string, string] = [`
        <small class="text-danger error-messsage" id="invalidAmt">
          Promotion Amount must be more than or equal to 5% and less than or equal to 75%.
        </small>
`, "#invalidAmt"];

    public static promoNameConstraint(value: string): boolean {
        return value.length >= 1;
    }

    public static promoCodeConstraint(value: string): boolean {
        return value.length >= 3;
    }

    public static promoAmountConstraint(value: string): boolean {
        return Number(value) >= 5 && Number(value) <= 75;
    }
}

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