export interface IPurpose {
    template: [string, string],
    constraint: Function
}

export class InputValidator {

    /*
    Keeps track of each input element along with its validity.
    On submit, every value of an input with the 'required' attribute
    must be true.
    */
    curr_validity = new Map<string, boolean>();
    private _selectorPlace = undefined;

    public static scrollTopOfSelector(selectorPlace: string | HTMLElement | any): any {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(selectorPlace).offset().top
        }, 500);
    }

    public validateAll(selectorPlace: string | HTMLElement | any): boolean {

        let errorHTML: string =
            `<p class="text-center text-danger" id="somethingWrong">
                One or more of the fields were incomplete or invalid
            </p>`;

        this._selectorPlace = selectorPlace;

        for (const [key, value] of this.curr_validity.entries()) {
            let req: boolean = document.getElementById(key).hasAttribute('required');

            if (req && !value) {
                if (!$(selectorPlace).next("#somethingWrong").length) {
                    $(selectorPlace).after(errorHTML);
                }
                InputValidator.scrollTopOfSelector(selectorPlace);
                return false;
            }
        }
        return true;
    }

    public setValidity(elem: HTMLInputElement | HTMLSelectElement, loc: HTMLElement | string, purpose: IPurpose, constr: boolean) {
        this.curr_validity.set(elem.id, this.validator(elem, loc, purpose['template'], constr));
    }

    /*
        Generalized validation function
     */
    private validator(inputType: HTMLInputElement | HTMLSelectElement,
                      invalidMessageLocation: string | HTMLElement | any,
                      invalidMessageType: [string, string],
                      constraintType: (boolean | RegExpMatchArray)): boolean {

        if (this._selectorPlace != undefined) {
            $("#somethingWrong").remove();
        }

        if (constraintType) {
            if ($(invalidMessageLocation).next(invalidMessageType[1]).length) {
                $(invalidMessageLocation).next(invalidMessageType[1]).remove();
            }
            if ($(inputType).hasClass('invalid')) {
                $(inputType).removeClass('invalid');
            }
            //Prevents duplicate class additions
            if (!$(inputType).hasClass('valid')) {
                $(inputType).addClass("valid");
            }
            $(inputType).prop("aria-invalid", "false");
            return true;
        } else {
            if (!$(invalidMessageLocation).next(invalidMessageType[1]).length) {
                $(invalidMessageLocation).after(invalidMessageType[0]);
            }
            if ($(inputType).hasClass('valid')) {
                $(inputType).removeClass('valid');
            }
            if (!$(inputType).hasClass('invalid')) {
                $(inputType).addClass("invalid");
            }
            $(inputType).prop("aria-invalid", "true");
            return false;
        }
    }
}