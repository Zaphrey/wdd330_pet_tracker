import ErrorList from "./errorList.js";

const form = document.forms[0];
const button = form.querySelector("button");
const errorListElement = document.querySelector(".form-error-list");
const errorList = new ErrorList(errorListElement);

button.addEventListener("click", async e => {
    e.preventDefault();

    const password = form.password.value;
    const passwordMatch = form.passwordMatch.value;
    const passwordsMatch = password == passwordMatch;

    let html = button.innerHTML;
    button.innerHTML = `<span class="material-symbols-outlined">close</span>`

    button.classList.remove("toggled");

    setTimeout(() => {
        button.classList.add("toggled");
        button.innerHTML = html;
    }, 600);

    if (passwordsMatch) {
        let formData = new FormData(form);
        let convertedJson = {};

        formData.forEach((value, key) => {
            convertedJson[key] = value;
        });

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(convertedJson),
        };

        const response = await fetch(`/account/create`, options);
        const result = await response.json();
        
        if (response.ok && response.status === 202) {
            localStorage.setItem("so-token", result.accessToken);
            
            window.location.href = "/pets";
            return;
        } else {
            if (result.errors) {
                errorList.addErrorArray(result.errors);
            } else {
                errorList.addError(result.message);
            }
        };
    } else {
        errors.push(`<li ${performedErrorAnimation && "class=\"no-animate\""}>Passwords do not match.</li>`);
    }

    if (!form.reportValidity()) {
        let passwordPatternMismatch = false;
        let inputs = form.querySelectorAll("input")

        inputs.forEach(input => {
            if (input.getAttribute("type") == "password") {
                passwordPatternMismatch = input.validity.patternMismatch
            }
        })

        if (passwordPatternMismatch) {
            errorList.addError("Password must have at least one number, one special character, one uppercase and lowercase character, and at least 8 characters total.");
        }
    }

    errorList.showErrors();
})