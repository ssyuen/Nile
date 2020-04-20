import {
    GeneralFormValidity,
    getClosestCard,
    getClosestForm, isDirty,
    PostFlags, submit, submitRemoval, submitUpdate
} from "./ShippingPaymentCommon.js";

import {CreditCard, RegistrationInputValidator, PURPOSE} from "../../../common/js/registration/regValidation.js";
import {replaceBtn} from "../../../common/js/utility/util";

$(".remove-pm-btn").click(function (event) {

    let form = getClosestForm(event);
    let addressId = $(form).attr("nile-address-ident");
    let pmID = $(form).attr("nile-pm-ident");
    submitRemoval(
        form,
        this as HTMLButtonElement,
        {name: "billingAddressID", value: addressId},
        {name: "pm_id", value: pmID}
    )
});


$(".update-pm-btn").click(function (event) {
    let form = getClosestForm(event);
    let card = getClosestCard(event);

    if (!isDirty()) {
        window.alert("No changes were detected");
        event.preventDefault();
        return false;
    }

    let addressId = $(form).attr("nile-address-ident");
    let pmID = $(form).attr("nile-pm-ident");
    let ident = $(form).attr("nile-form-ident");

    const vc = GeneralFormValidity.get(ident);

    let errLoc = <HTMLElement><any>$(card).find(".pre-content");

    if (!vc.validateAll(errLoc)) {
        event.preventDefault();
        return false;
    }
    submitUpdate(form,
        this as HTMLButtonElement,
        {name: "billingAddressID", value: addressId},
        {name: "pm_id", value: pmID});
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

        $(form).find(".targetName1").bind(evt, function () {
            console.log(this);
            vc.setValidity(this as HTMLInputElement, this as HTMLElement, PURPOSE.Firstname, PURPOSE.Firstname.constraint((this as HTMLInputElement).value));
        });

        $(form).find(".targetName2").bind(evt, function () {
            vc.setValidity(this as HTMLInputElement, this as HTMLElement, PURPOSE.Lastname, PURPOSE.Lastname.constraint((this as HTMLInputElement).value));
        });

        //Obviously, shipping address and billing address have the same constraints
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


////////////////////////////////////CREATE SCRIPT/////////////////////////////////////////////////////////////////////

let createValidator = new RegistrationInputValidator();
let createCreditValidator = new CreditCard();

$("#createPaymentMethodBtn").on("click", function (e: Event) {

    let sel = ".info-message";

    if (!createValidator.validateAll(sel)) {
        e.preventDefault();
        return false;
    }

    if (!createCreditValidator.checkCard()) {
        if (!$("#creditWrong").length) { //#creditWrong is the id of the invalid message
            $(sel).after(
                `<p class="text-center text-danger" id="creditWrong">
            The Credit Card number you provided is invalid
            </p>`);
        }
        $("#createCCN").addClass("invalid").removeClass("valid");
        RegistrationInputValidator.scrollTopOfSelector(sel);
        e.preventDefault();
        return false;
    }

    submit(<HTMLFormElement><any>$("#createPMForm"), this as HTMLButtonElement,
        {name: "CCNProvider", value: createCreditValidator.getProvider()});
});

Array<string>('input', 'focusin').forEach((evt: string) => {

    $("#createCardHolderFirstName").bind(evt, function () {
        createValidator.setValidity(this as HTMLInputElement, this, PURPOSE.Firstname, PURPOSE.Firstname.constraint((this as HTMLInputElement).value));
    });

    $("#createCardHolderLastName").bind(evt, function () {
        createValidator.setValidity(this as HTMLInputElement, this, PURPOSE.Lastname, PURPOSE.Lastname.constraint((this as HTMLInputElement).value));
    });

    //Obviously, shipping address and billing address have the same constraints
    $("#createBillingStreetAddress").bind(evt, function () {
        createValidator.setValidity(this as HTMLInputElement, this, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint((this as HTMLInputElement).value))
    });

    //Same situation as above
    $("#createBillingAddressZip").bind(evt, function () {
        createValidator.setValidity(this as HTMLInputElement, this, PURPOSE.Zip, PURPOSE.Zip.constraint((this as HTMLInputElement).value))
    });

    $("#createBillingAddressCity").bind(evt, function () {
        createValidator.setValidity(this as HTMLInputElement, this, PURPOSE.City, PURPOSE.City.constraint((this as HTMLInputElement).value))
    });

    $("#createCCN").bind(evt, function () {
        createCreditValidator.setCCN((this as HTMLInputElement).value);
        let check = PURPOSE.CCN.constraint(createCreditValidator);
        createValidator.setValidity(this as HTMLInputElement, this, PURPOSE.CCN, check);

        if (check) {
            CreditCard.toggleCardIcon(this as HTMLInputElement, createCreditValidator);
        } else {
            CreditCard.toggleCardIcon(this as HTMLInputElement);
        }
    });

    $("#createCVV").bind(evt, function () {
        createCreditValidator.setCVV((this as HTMLInputElement).value);
        createValidator.setValidity(this as HTMLInputElement, this, PURPOSE.CVV, PURPOSE.CVV.constraint(createCreditValidator));
    })
});

Array<string>('change', 'focusin').forEach((evt: string) => {
    $("#createBillingAddressState").bind(evt, function () {
        createValidator.setValidity(this as HTMLSelectElement, this as HTMLElement, PURPOSE.State, PURPOSE.State.constraint(this as HTMLSelectElement))
    });

    $("#createBillingAddressCountry").bind(evt, function () {
        createValidator.setValidity(this as HTMLSelectElement, this as HTMLElement, PURPOSE.Country, PURPOSE.Country.constraint(this as HTMLSelectElement));
    });
});
