function alertCST() {
  const elem = document.querySelectorAll(" .alertCST-close").forEach((elem) => {
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
