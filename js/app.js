const cNameEl = document.querySelector('#cname');
const cNumberEl = document.querySelector('#cnumber');
const monthEl = document.querySelector('#month');
const yearEl = document.querySelector('#year');
const cvcEl = document.querySelector('#cvc');
const nameHolder = document.querySelector('.card-owner');
const numberHolder = document.querySelector('.card-number');
const expiryHolder = document.querySelector('.card-expiry');
const cvcHolder = document.querySelector('.cvc-number');

const formContainer = document.querySelector('.form-container');
const form = document.querySelector('.form');

const msgContainer = document.querySelector('.msg-container');
const restartBtn = document.querySelector('.msg-btn');

const checkName = () => {

    let valid = false;

    const username = cNameEl.value.trim();

    if (!isRequired(username)) {
        showError(cNameEl, 'Name cannot be blank');
    } else if (isString(username)) {
        showError(cNameEl, `Name must only conatin letters`)
    } else if (!isBetween(username.length, 3, 20)) {
        showError(cNameEl, `Minimum Length 3, Maximum Length 20`);
    } else {
        showSuccess(cNameEl);
        nameHolder.textContent = username;
        valid = true;
    }
    return valid;
};


const checkNumber = () => {

    let valid = false;

    const number = cNumberEl.value.trim().replace(/\s/g, '');

    if (!isRequired(number)) {
        showError(cNumberEl, 'Number cannot be blank');
    } else if (isNumber(number)) {
        showError(cNumberEl, 'Card Number must only conatin numbers');
    } else if (!isBetween(number.length, 16, 16)) {
        showError(cNumberEl, 'Card Number must conatin 16 digits');
    } else {
        showSuccess(cNumberEl);
        numberHolder.textContent = number.match(/\d{4}/g).join(' ');
        valid = true;
    }
    return valid;
};

const checkExpiry = () => {

    let valid = false;

    let month = monthEl.value.trim().replace(/\s/g, '');
    const year = yearEl.value.trim().replace(/\s/g, '');

    if (!isRequired(month) || !isRequired(year)) {
        showError(monthEl, 'Cannot be blank');
    } else if (isNumber(month) || isNumber(year)) {
        showError(monthEl, 'Numbers only');
    } else if (+month < 0 || +month > 12) {
        showError(monthEl, 'Wrong month.');
    } else if (!isBetween(year.length, 2, 2)) {
        showError(monthEl, 'Wrong year');
    } else {
        showSuccess(monthEl);
        month = month.length == 1 ? '0' + month : month;
        expiryHolder.textContent = `${month}/${year}`;
        valid = true;
    }

    return valid;
};

const checkCVC = () => {

    let valid = false;

    const cvcNum = cvcEl.value.trim().replace(/\s/g, '');

    if (!isRequired(cvcNum)) {
        showError(cvcEl, 'Cannot be blank');
    } else if (isNumber(cvcNum)) {
        showError(cvcEl, 'Must only contain numbers');
    } else if (!isBetween(cvcNum.length, 3, 3)) {
        showError(cvcEl, 'Must be 3 digits.');
    } else {
        showSuccess(cvcEl);
        cvcHolder.textContent = cvcNum;
        valid = true;
    }

    return valid;
};

const isNumber = (val) => {
    const re = /[^0-9 ]/g;
    return re.test(val);
};

const isString = (val) => {
    const re = /[^A-Za-z ]/;
    return re.test(val);
};

const isCardNumberCorrect = (num) => {
    const re = /\d{4} \d{4} \d{4} \d{4}/;
    return re.test(num);
};

const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;


const showError = (input, message) => {
    // get the form-field element
    const formField = input.parentElement;
    // add the error class
    formField.classList.remove('success');
    formField.classList.add('error');

    // show the error message
    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    // get the form-field element
    const formField = input.parentElement;

    // remove the error class
    formField.classList.remove('error');
    formField.classList.add('success');

    // hide the error message
    const error = formField.querySelector('small');
    error.textContent = '';
}


form.addEventListener('submit', function (e) {
    // prevent the form from submitting
    e.preventDefault();

    // validate fields
    let isNameValid = checkName(),
        isNumberValid = checkNumber(),
        isExpiryValid = checkExpiry(),
        isCVCValid = checkCVC();

    let isFormValid = isNameValid &&
        isNumberValid &&
        isExpiryValid &&
        isCVCValid;

    // submit to the server if the form is valid
    if (isFormValid) {
        afterSubmit();
    }
});


const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

form.addEventListener('input', debounce(function (e) {
    switch (e.target.id) {
        case 'cname':
            checkName();
            break;
        case 'cnumber':
            checkNumber();
            break;
        case 'month':
        case 'year':
            checkExpiry();
            break;
        case 'cvc':
            checkCVC();
            break;
    }
}));

const afterSubmit = () => {
    form.style.display = 'none';
    msgContainer.style.display = 'block';
};

restartBtn.addEventListener('click', (e) => {
    msgContainer.style.display = 'none';
    form.style.display = 'block';

    cNameEl.value = '';
    cNumberEl.value = '';
    monthEl.value = '';
    yearEl.value = '';
    cvcEl.value = '';

    nameHolder.textContent = 'Jane Appleseed';
    numberHolder.textContent = '0000 0000 0000 0000';
    expiryHolder.textContent = '00/00';
    cvcHolder.textContent = '000';
});