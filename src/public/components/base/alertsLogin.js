function alertCST() {
  const elem = document
    .querySelectorAll(".accent-box  .alertCST-close")
    .forEach((elem) => {
      elem.addEventListener("click", () => {
        const alert = elem.parentElement.parentElement.parentElement;
        alert.style.maxHeight = alert.scrollHeight + "px";
        alert.classList.add("hide");
        setTimeout(() => {
          if (alert.style.maxHeight) {
            alert.style.maxHeight = 0;
          }
        }, 500);
      });
      setTimeout(() => {
        const alert = elem.parentElement.parentElement.parentElement;
        if (alert.style.maxHeight === "") {
          alert.style.maxHeight = alert.scrollHeight + "px";
        }
        alert.classList.add("hide");
        setTimeout(() => {
          if (alert.style.maxHeight) {
            alert.style.maxHeight = 0;
          }
        }, 500);
      }, 3000);
    });
}

alertCST();

const pi = document.querySelector("#password-input");
const ni = document.querySelector("#name-input");

ni.addEventListener("focusout", (e) => {
  if (e.target.value.length < 1) {
    newAlert("Please Enter A Name");
    alertCST();
  }
});
pi.addEventListener("focusout", (e) => {
  if (e.target.value.length < 6) {
    newAlert("Please Enter A Password Of Min 6 Characters");
    alertCST();
  }
});

let submit = true;

document.querySelector("#sbmt-btn").addEventListener("click", (e) => {
  submit = true;
  if (ni.value.length < 1) {
    newAlert("Please Enter A Name");
    alertCST();
    submit = false;
  }
  if (pi.value.length < 6) {
    newAlert("Please Enter A Password Of Min 6 Characters");
    alertCST();
    submit = false;
  }
  if (submit) {
    document.querySelector("#formCST").submit();
  }
  e.preventDefault();
});

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
    `;
  const alertWrapper = document.createElement("div");
  alertWrapper.classList = "row justify-content-center alertCST";
  alertWrapper.innerHTML = alert;
  document
    .querySelector(".alerts-wrapper")
    .parentElement.insertBefore(
      alertWrapper,
      document.querySelector(".alerts-wrapper")
    );
}
