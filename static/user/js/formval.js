const form = document.getElementById("regForm");
const fName = document.getElementById("inputFirstname");
const lName = document.getElementById("inputLastname");
const email = document.getElementById("inputEmail");
const pass = document.getElementById("inputPassword");
const passConf = document.getElementById("inputConfirmPassword");

form.addEventListener('submit', (e) => {

});

fName.addEventListener('input', (e) => {

    console.log(fName);
    let val = fName.value;

    console.log(val.length);
    if (val.length >= 1) {
        console.log(true);
    } else {
        console.log(false);
    }
});

lName.addEventListener('input', (e) => {

    console.log(lName);
    let val = lName.value;

    console.log(val.length);
    if (val.length >= 2) {
        console.log(true);
    } else {
        console.log(false);
    }
});

email.addEventListener('input', (e) => {

    console.log(email);
    let val = email.value;

    console.log(val.length);
    if (val.length <= 1) {
        console.log(false);
    } else {
        console.log(true);
    }

});

pass.addEventListener('input', (e) => {

    console.log(fName);
    let val = fName.value;

    console.log(val.length);
    if (val.length <= 1) {
        console.log(false);
    } else {
        console.log(true);
    }

});


passConf.addEventListener('input', (e) => {

    console.log(fName);
    let pConf = pass.value;
    let pConfVal = passConf.value;

    if (pConf === pConfVal) {
        console.log(true);
    } else {
        console.log(false);
    }

});


