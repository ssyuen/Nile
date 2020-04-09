import {
    GeneralFormValidity,
    getClosestCard,
    getClosestForm,
    PostFlags, promptConfirm, submitRemoval, submitUpdate
} from "./ShippingPaymentCommon.js";
import {RegistrationInputValidator, PURPOSE} from "../regValidation.js";

$(".remove-addr-btn").click(function (event) {
    let form = getClosestForm(event);
    let addressId = $(form).attr("nile-address-ident");
    submitRemoval(form, {name: "addressID", value: addressId});
});

$(".update-addr-btn").click(function (event) {
    let form = getClosestForm(event);
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

$("#createShippingAddress").click(function (event) {
    $("#createShippingAddressForm").submit(function () {
        var flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.CREATE);
        $(this).append(flag);
    })
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