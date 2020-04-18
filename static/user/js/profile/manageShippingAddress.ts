import {
    GeneralFormValidity,
    getClosestCard,
    getClosestForm, isDirty,
    PostFlags, promptConfirm, submit, submitRemoval, submitUpdate
} from "./ShippingPaymentCommon.js";
import {RegistrationInputValidator, PURPOSE} from "../../../common/js/registration/regValidation.js";

$(".remove-addr-btn").click(function (event) {
    let form = getClosestForm(event);
    let addressId = $(form).attr("nile-address-ident");
    submitRemoval(form, {name: "addressID", value: addressId});
});

$(".update-addr-btn").click(function (event) {
    let form = getClosestForm(event);

    if (!isDirty()) {
        window.alert("No changes were detected");
        event.preventDefault();
        return false;
    }

    let card = getClosestCard(event);

    let addressId = $(form).attr("nile-address-ident");
    let ident = $(form).attr("nile-form-ident");

    const vc = GeneralFormValidity.get(ident);

    let errLoc = <HTMLElement><any>$(card).find(".pre-content");

    if (!vc.validateAll(errLoc)) {
        event.preventDefault();
        return false;
    }
    submitUpdate(form, {name: "addressID", value: addressId});
});

$(".edit-btn").click(function (event) {
    let form: HTMLFormElement = <HTMLFormElement><any>$(getClosestCard(event)).find("form").first();
    $(form).find("input, select").removeAttr("readonly disabled");

    let ident = $(form).attr("nile-form-ident");

    if (!GeneralFormValidity.has(ident)) {
        GeneralFormValidity.set(ident, new RegistrationInputValidator());
    }

    var vc = GeneralFormValidity.get(ident);

    Array<string>('input', 'focusin').forEach((evt: string) => {
        $(form).find(".targetStreet1").bind(evt, function () {
            vc.setValidity(this as HTMLInputElement, this as HTMLElement, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint((this as HTMLInputElement).value))
        });

        //Same situation as above
        $(form).find(".targetZip").bind(evt, function () {
            vc.setValidity(this as HTMLInputElement, this as HTMLElement, PURPOSE.Zip, PURPOSE.Zip.constraint((this as HTMLInputElement).value))
        });

        $(form).find(".targetCity").bind(evt, function () {
            vc.setValidity(this as HTMLInputElement, this as HTMLElement, PURPOSE.City, PURPOSE.City.constraint((this as HTMLInputElement).value))
        });
    });
});

$("#createShippingAddress").click(function (event) {
    let sel = ".info-message";

    if (!createValidator.validateAll(sel)) {
        event.preventDefault();
        return false;
    }
    submit(<HTMLFormElement><any>$("#createShippingAddressForm"))
});

let createValidator = new RegistrationInputValidator();

Array<string>('input', 'focusin').forEach((evt: string) => {
    $("#addAddressStreetAddress").bind(evt, function () {
        createValidator.setValidity(this as HTMLInputElement, this as HTMLElement, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint((this as HTMLInputElement).value))
    });

    //Same situation as above
    $("#addAddressZip").bind(evt, function () {
        createValidator.setValidity(this as HTMLInputElement, this as HTMLElement, PURPOSE.Zip, PURPOSE.Zip.constraint((this as HTMLInputElement).value))
    });

    $("#addAddressCity").bind(evt, function () {
        createValidator.setValidity(this as HTMLInputElement, this as HTMLElement, PURPOSE.City, PURPOSE.City.constraint((this as HTMLInputElement).value))
    });
});


