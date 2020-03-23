$(function () {

    $("#accountOverview").on("click", function () {
        changeView(this, "#accountOverviewTemplate");
    });

    $("#changeMyName").on("click", function () {
        changeView(this, "#changeNameTemplate");
    });

    $("#changeMyPass").on("click", function () {
        changeView(this, "#changePasswordTemplate");
    });

    $("#orderHist").on("click", function () {
        changeView(this, "#orderHistTemplate");
    });

    $("#manageAddress").on("click", function () {
        changeView(this, "#manageShippingAddressTemplate");
    });

    $("#manageBilling").on("click", function () {
        changeView(this, "#manageBillingAddressTemplate");
    });

    $("#managePaymentInfo").on("click", function () {
        changeView(this, "#managePaymentInformationTemplate");
    });

    $("#returnRefund").on("click", function () {
        changeView(this, "#returnRefundTemplate");
    });
});

function changeView(listSelection, idOfTemplateToShow: string): any {
    $(".list-group-item.active").toggleClass("active");
    $("#mainContent").children(":not(.d-none)").toggleClass("d-none");
    $(listSelection).addClass("active");
    $(idOfTemplateToShow).removeClass("d-none");
}