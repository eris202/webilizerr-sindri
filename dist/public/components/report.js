const mNav = document.querySelector("#nav-mobile");
Array.from(document.querySelectorAll(".section-link")).forEach((elem) => {
    elem.addEventListener("click", () => {
        Array.from(document.querySelectorAll(".section-link.active")).forEach((e) => {
            e.classList.remove("active");
        });
        elem.classList.add("active");
        console.log(document.querySelector("section.section-sm.active"));
        document
            .querySelector("section.section-sm.active")
            .classList.remove("active");
        document
            .querySelector("section:nth-child(" + elem.id + ")")
            .classList.add("active");
        mNav.classList.remove("active");
        document.querySelector("body").scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
        if (elem.id === 2) {
            let highestHeight1 = 0;
            Array.from(document.querySelectorAll(".sameSize1")).forEach((elem) => {
                if (elem.clientHeight > highestHeight1) {
                    highestHeight1 = elem.clientHeight;
                }
            });
            Array.from(document.querySelectorAll(".sameSize1")).forEach((elem) => {
                elem.style.height = highestHeight1 + "px";
            });
            let highestHeight2 = 0;
            Array.from(document.querySelectorAll(".sameSize2")).forEach((elem) => {
                if (elem.clientHeight > highestHeight2) {
                    highestHeight2 = elem.clientHeight;
                }
            });
            Array.from(document.querySelectorAll(".sameSize2")).forEach((elem) => {
                elem.style.height = highestHeight2 + "px";
            });
            let highestHeight3 = 0;
            Array.from(document.querySelectorAll(".sameSize3")).forEach((elem) => {
                if (elem.clientHeight > highestHeight3) {
                    highestHeight3 = elem.clientHeight;
                }
            });
            Array.from(document.querySelectorAll(".sameSize3")).forEach((elem) => {
                elem.style.height = highestHeight3 + "px";
            });
            let highestHeight4 = 0;
            Array.from(document.querySelectorAll(".sameSize4")).forEach((elem) => {
                if (elem.clientHeight > highestHeight4) {
                    highestHeight4 = elem.clientHeight;
                }
            });
            Array.from(document.querySelectorAll(".sameSize4")).forEach((elem) => {
                elem.style.height = highestHeight4 + "px";
            });
            let highestHeight5 = 0;
            Array.from(document.querySelectorAll(".sameSize5")).forEach((elem) => {
                if (elem.clientHeight > highestHeight5) {
                    highestHeight5 = elem.clientHeight;
                }
            });
            Array.from(document.querySelectorAll(".sameSize5")).forEach((elem) => {
                elem.style.height = highestHeight5 + "px";
            });
            let highestHeight6 = 0;
            Array.from(document.querySelectorAll(".sameSize6")).forEach((elem) => {
                if (elem.clientHeight > highestHeight6) {
                    highestHeight6 = elem.clientHeight;
                }
            });
            Array.from(document.querySelectorAll(".sameSize6")).forEach((elem) => {
                elem.style.height = highestHeight5 + "px";
            });
        }
    });
});
document.querySelector("#hamburger").addEventListener("click", () => {
    if (mNav.classList.contains("active")) {
        mNav.classList.remove("active");
    }
    else {
        mNav.classList.add("active");
    }
});
document.querySelector("#reccomendation-link").addEventListener("click", () => {
    Array.from(document.querySelectorAll(".section-link.recc")).forEach((elem) => {
        Array.from(document.querySelectorAll(".section-link.active")).forEach((e) => {
            e.classList.remove("active");
        });
        elem.classList.add("active");
        document
            .querySelector("section.section-sm.active")
            .classList.remove("active");
        document
            .querySelector("section.section-sm:nth-child(" + elem.id + ")")
            .classList.add("active");
        mNav.classList.remove("active");
        document.querySelector("body").scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
});
//# sourceMappingURL=report.js.map