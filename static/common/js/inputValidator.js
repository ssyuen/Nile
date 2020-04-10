export class InputValidator {
    constructor() {
        /*
        Keeps track of each input element along with its validity.
        On submit, every value of an input with the 'required' attribute
        must be true.
        */
        this.curr_validity = new Map();
        this._selectorPlace = undefined;
    }
    static scrollTopOfSelector(selectorPlace) {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(selectorPlace).offset().top
        }, 500);
    }
    validateAll(selectorPlace) {
        let errorHTML = `<p class="text-center text-danger" id="somethingWrong">
                One or more of the fields were incomplete or invalid
            </p>`;
        this._selectorPlace = selectorPlace;
        for (let key in this.curr_validity) {
            let value = this.curr_validity[key];
            let req = document.getElementById(key).hasAttribute('required');
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
    setValidity(elem, loc, purpose, constr) {
        this.curr_validity.set(elem.id, this.validator(elem, loc, purpose['template'], constr));
    }
    /*
        Generalized validation function
     */
    validator(inputType, invalidMessageLocation, invalidMessageType, constraintType) {
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
