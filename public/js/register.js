const form = document.forms[0];
const button = form.querySelector("button");
const errorList = form.querySelector("ul");
let performedErrorAnimation = false;

button.addEventListener("click", async e => {
    e.preventDefault();

    let errors = [];
    const password = form.password.value;
    const passwordMatch = form.passwordMatch.value;
    const passwordsMatch = password == passwordMatch;

    if (passwordsMatch && form.reportValidity()) {
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
                result.errors.forEach(error => {
                    errors.push(`<li ${performedErrorAnimation && "class=\"no-animate\""}>${ error.msg }</li>`)
                })
            } else {
                errors.push(`<li ${performedErrorAnimation && "class=\"no-animate\""}>${ result.message }</li>`)
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
            errors.push(`<li ${performedErrorAnimation && "class=\"no-animate\""}>Password must have at least one number, one special character, one uppercase and lowercase character, and at least 8 characters total.</li>`);
        }
    }

    errorList.innerHTML = "";
    errors.forEach(error => {
        errorList.insertAdjacentHTML("afterbegin", error)
    })

    performedErrorAnimation = true;
})