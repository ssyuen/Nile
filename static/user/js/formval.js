const form = document.getElementById("regForm");
const fName = document.getElementById("inputFirstname");
const lName = document.getElementById("inputLastname");
const email = document.getElementById("inputEmail");
const pass = document.getElementById("inputPassword");
const passConf = document.getElementById("inputConfirmPassword");

const invalidPass = `
    <div class="error-message" id="invalidPass">
        <small class="text-danger">
          Password be more than 8 or more characters long, contain at least 1 uppercase character, 1 lowercase character, and 1 number.
        </small>
    </div>
`;

const invalidPassConf = `
    <div class="error-message" id="invalidPassConf">
        <small class="text-danger">
          Password's do not match.
        </small>
    </div>
`;

const invalidEmail = `
    <div class="error-message" id="invalidEmail">
        <small class="text-danger">
          Email is not valid.
        </small>
    </div>
`;

const invalidFName = `
    <div class="error-message" id="invalidFName">
        <small class="text-danger">
          Firstname must be more than 1 character.
        </small>
    </div>
`;

const invalidLName = `
    <div class="error-message" id="invalidLName">
        <small class="text-danger">
          Lastname must be more than 2 characters.
        </small>
    </div>
`;

form.addEventListener('submit', (e) => {

});

['input', 'focusin'].forEach((evt) => {

    fName.addEventListener(evt, (e) => {
        console.log(lName);
        let val = fName.value;
        validate(fName, invalidFName, '#invalidFName', val.length >= 1);
    });

    lName.addEventListener(evt, (e) => {
        console.log(lName);
        let val = lName.value;
        validate(lName, invalidLName, '#invalidLName', val.length >= 2);
    });

    email.addEventListener(evt, (e) => {
        validate(email, invalidEmail, '#invalidEmail', emailConstraint());
    });

    pass.addEventListener(evt, (e) => {
        validate(pass, invalidPass, '#invalidPass', validateConstraint());
        validate(passConf, invalidPassConf, '#invalidPassConf', confirmConstraint());
    });

    pass.addEventListener(evt, (e) => {
        validate(pass, invalidPass, '#invalidPass', validateConstraint());
        validate(passConf, invalidPassConf, '#invalidPassConf', confirmConstraint());
    });
});


passConf.addEventListener('input', (e) => {
    validate(passConf, invalidPassConf, '#invalidPassConf', confirmConstraint());
});

function emailConstraint() {
    let val = email.value;
    return val.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
}

function validateConstraint() {
    let val = pass.value;
    return val.match((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
}

function confirmConstraint() {
    let pConf = pass.value;
    let pConfVal = passConf.value;
    return pConf === pConfVal;
}

function validate(inputType, invalidMessageType, invalidMessageTypeId, constraintType) {

    if (constraintType) {
        if ($(invalidMessageTypeId).length > 0) {
            $(invalidMessageTypeId).remove();
        }
        if ($(inputType).hasClass('is-invalid')) {
            $(inputType).removeClass('is-invalid');
        }
        //Prevents duplicate class additions
        if (!$(inputType).hasClass('is-valid')) {
            $(inputType).addClass("is-valid");
        }
    } else {
        if (!$(invalidMessageTypeId).length > 0) {
            $(inputType).after(invalidMessageType);
        }
        if ($(inputType).hasClass('is-valid')) {
            $(inputType).removeClass('is-valid');
        }
        if (!$(inputType).hasClass('is-invalid')) {
            $(inputType).addClass("is-invalid");
        }
    }
}
