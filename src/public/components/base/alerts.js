function alertCST() {

    const elem = document.querySelectorAll('.accent-box  .alertCST-close').forEach(elem => {
        elem.addEventListener('click', () => {
            const alert = elem.parentElement.parentElement.parentElement;
            alert.style.maxHeight = alert.scrollHeight + "px";
            alert.classList.add('hide');
            setTimeout(() => {
                if (alert.style.maxHeight) {
                    alert.style.maxHeight = 0;
                }
            }, 500)
        })
        setTimeout(() => {
            const alert = elem.parentElement.parentElement.parentElement;
            if (alert.style.maxHeight === '') {
                alert.style.maxHeight = alert.scrollHeight + "px";
            }
            alert.classList.add('hide');
            setTimeout(() => {
                if (alert.style.maxHeight) {
                    alert.style.maxHeight = 0;
                }
            }, 500)
        }, 3000)
    })
}

alertCST();

const pi = document.querySelector('#password-input');
const cpi = document.querySelector('#cpassword-input');
const ei = document.querySelector('#email-input');
const ni = document.querySelector('#name-input');

ni.addEventListener('focusout', (e) => {
    if (e.target.value.length < 1) {
        newAlert('Please Enter A Name');
        alertCST();
    }
})
pi.addEventListener('focusout', (e) => {
    if (e.target.value.length < 6) {
        newAlert('Please Enter A Password Of Min 6 Characters');
        alertCST();
    }
})

cpi.addEventListener('focusout', (e) => {
    if (e.target.value !== pi.value) {
        newAlert('Passwords Must Match');
        alertCST();
    }
})

ei.addEventListener('focusout', (e) => {
    if (!validateEmail(e.target.value)) {
        newAlert('Please Enter A Valid Email');
        alertCST();
    }
})

let submit = true;
let checked = false;

document.querySelector('#terms-input').addEventListener('click', (e) => {
    if (!e.target.classList.contains('link')) {
        if (checked) {
            checked = false;
        } else {
            checked = true;
        }
    }
    if (!checked) {
        newAlert('You have to agree with the terms of service');
        alertCST();
    }
})

document.querySelector('#sbmt-btn').addEventListener('click', (e) => {
    submit = true;
    if (ni.value.length < 1) {
        newAlert('Please Enter A Name');
        alertCST();
        submit = false;
    }
    if (!validateEmail(ei.value)) {
        newAlert('Please Enter A Valid Email');
        alertCST();
        submit = false;
    }
    if (pi.value.length < 6) {
        newAlert('Please Enter A Password Of Min 6 Characters');
        alertCST();
        submit = false;
    }
    if (cpi.value !== pi.value) {
        newAlert('Passwords Must Match');
        alertCST();
        submit = false;
    }
    if (!checked) {
        newAlert('You have to agree with the terms of service');
        alertCST();
    }
    if (submit && checked) {
        document.querySelector('#formCST').submit();
    }
    e.preventDefault();
})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function newAlert(text) {
    const alert = `
    
        <div>
            <div class="close-button-wrapper">
                <div class="close-button alertCST-close"></div>
            </div>
            <div class="snackbar snackbar-danger">
                <div class="snackbar-inner">
                    <div class="snackbar-title"><span
                            class="icon snackbar-icon novi-icon int-warning"></span>

                            <span class="alertCST-text">${text}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    const alertWrapper = document.createElement('div');
    alertWrapper.classList = 'row justify-content-center alertCST';
    alertWrapper.innerHTML = alert;
    document.querySelector('.alerts-wrapper').parentElement.insertBefore(alertWrapper, document.querySelector('.alerts-wrapper'));
}