import {
    getClosestCard,
    getClosestForm,
    PostFlags, submitRemoval
} from "./ShippingPaymentCommon.js";


import {CreditCard, InputValidationComplex, PURPOSE} from "../inputvalidation.js";

$(".remove-pm-btn").click(function (event) {

    let form = getClosestForm(event);
    let addressId = $(form).attr("nile-address-ident");
    let pmID = $(form).attr("nile-pm-ident");
    submitRemoval(
        form,
        {name: "billingAddressID", value: addressId},
        {name: "pm_id", value: pmID}
    )
});


////////////////////////////////////CREATE SCRIPT/////////////////////////////////////////////////////////////////////

let createValidator = new InputValidationComplex();
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
        InputValidationComplex.scrollTopOfSelector(sel);
        e.preventDefault();
        return false;
    }


    $("#createPMForm").submit(function () {
        let flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.CREATE);
        let ccProv = $("<input>").attr("type", "hidden").attr("name", "CCNProvider").val(createCreditValidator.getProvider());
        $(this).append(flag, ccProv);
    })
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
