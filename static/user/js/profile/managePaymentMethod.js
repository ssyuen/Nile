import { GeneralFormValidity, getClosestCard, getClosestForm, PostFlags, submitRemoval, submitUpdate } from "./ShippingPaymentCommon.js";
import { CreditCard, RegistrationInputValidator, PURPOSE } from "../regValidation.js";
$(".remove-pm-btn").click(function (event) {
    let form = getClosestForm(event);
    let addressId = $(form).attr("nile-address-ident");
    let pmID = $(form).attr("nile-pm-ident");
    submitRemoval(form, { name: "billingAddressID", value: addressId }, { name: "pm_id", value: pmID });
});
$(".update-pm-btn").click(function (event) {
    let form = getClosestForm(event);
    let card = getClosestCard(event);
    let addressId = $(form).attr("nile-address-ident");
    let pmID = $(form).attr("nile-pm-ident");
    let ident = $(form).attr("nile-form-ident");
    const vc = GeneralFormValidity.get(ident);
    let errLoc = $(card).find(".pre-content");
    if (!vc.validateAll(errLoc)) {
        event.preventDefault();
        return false;
    }
    submitUpdate(form, { name: "billingAddressID", value: addressId }, { name: "pm_id", value: pmID });
});
$(".edit-btn").click(function (event) {
    let form = $(getClosestCard(event)).find("form").first();
    $(form).find("input, select").removeAttr("readonly disabled");
    let ident = $(form).attr("nile-form-ident");
    if (!GeneralFormValidity.has(ident)) {
        GeneralFormValidity.set(ident, new RegistrationInputValidator());
    }
    var vc = GeneralFormValidity.get(ident);
    Array('input', 'focusin').forEach((evt) => {
        $(form).find(".targetName1").bind(evt, function () {
            console.log(this);
            vc.setValidity(this, this, PURPOSE.Firstname, PURPOSE.Firstname.constraint(this.value));
        });
        $(form).find(".targetName2").bind(evt, function () {
            vc.setValidity(this, this, PURPOSE.Lastname, PURPOSE.Lastname.constraint(this.value));
        });
        //Obviously, shipping address and billing address have the same constraints
        $(form).find(".targetStreet1").bind(evt, function () {
            vc.setValidity(this, this, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint(this.value));
        });
        //Same situation as above
        $(form).find(".targetZip").bind(evt, function () {
            vc.setValidity(this, this, PURPOSE.Zip, PURPOSE.Zip.constraint(this.value));
        });
        $(form).find(".targetCity").bind(evt, function () {
            vc.setValidity(this, this, PURPOSE.City, PURPOSE.City.constraint(this.value));
        });
    });
});
////////////////////////////////////CREATE SCRIPT/////////////////////////////////////////////////////////////////////
let createValidator = new RegistrationInputValidator();
let createCreditValidator = new CreditCard();
$("#createPaymentMethodBtn").on("click", function (e) {
    let sel = ".info-message";
    if (!createValidator.validateAll(sel)) {
        e.preventDefault();
        return false;
    }
    if (!createCreditValidator.checkCard()) {
        if (!$("#creditWrong").length) { //#creditWrong is the id of the invalid message
            $(sel).after(`<p class="text-center text-danger" id="creditWrong">
            The Credit Card number you provided is invalid
            </p>`);
        }
        $("#createCCN").addClass("invalid").removeClass("valid");
        RegistrationInputValidator.scrollTopOfSelector(sel);
        e.preventDefault();
        return false;
    }
    $("#createPMForm").submit(function () {
        let flag = $("<input>").attr("type", "hidden").attr("name", "form_flag").val(PostFlags.CREATE);
        let ccProv = $("<input>").attr("type", "hidden").attr("name", "CCNProvider").val(createCreditValidator.getProvider());
        $(this).append(flag, ccProv);
    });
});
Array('input', 'focusin').forEach((evt) => {
    $("#createCardHolderFirstName").bind(evt, function () {
        createValidator.setValidity(this, this, PURPOSE.Firstname, PURPOSE.Firstname.constraint(this.value));
    });
    $("#createCardHolderLastName").bind(evt, function () {
        createValidator.setValidity(this, this, PURPOSE.Lastname, PURPOSE.Lastname.constraint(this.value));
    });
    //Obviously, shipping address and billing address have the same constraints
    $("#createBillingStreetAddress").bind(evt, function () {
        createValidator.setValidity(this, this, PURPOSE.StreetAddress, PURPOSE.StreetAddress.constraint(this.value));
    });
    //Same situation as above
    $("#createBillingAddressZip").bind(evt, function () {
        createValidator.setValidity(this, this, PURPOSE.Zip, PURPOSE.Zip.constraint(this.value));
    });
    $("#createBillingAddressCity").bind(evt, function () {
        createValidator.setValidity(this, this, PURPOSE.City, PURPOSE.City.constraint(this.value));
    });
    $("#createCCN").bind(evt, function () {
        createCreditValidator.setCCN(this.value);
        let check = PURPOSE.CCN.constraint(createCreditValidator);
        createValidator.setValidity(this, this, PURPOSE.CCN, check);
        if (check) {
            CreditCard.toggleCardIcon(this, createCreditValidator);
        }
        else {
            CreditCard.toggleCardIcon(this);
        }
    });
    $("#createCVV").bind(evt, function () {
        createCreditValidator.setCVV(this.value);
        createValidator.setValidity(this, this, PURPOSE.CVV, PURPOSE.CVV.constraint(createCreditValidator));
    });
});
