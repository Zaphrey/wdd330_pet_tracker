import { convertFormDataToJson } from "./utilities.js";
import ErrorList from "./errorList.js";

const form = document.forms[0];
const button = form.querySelector("button");
const errorListElement = document.querySelector(".form-error-list");
const errorList = new ErrorList(errorListElement);

button.addEventListener("click", async e =>  {
    e.preventDefault();

    if (!form.reportValidity()) {
        button.classList.remove("toggled");

        setTimeout(() => {
            button.classList.add("toggled");
        }, 600);
        console.log("asd")
        return;
    }

    let search = new URLSearchParams(window.location.search);
    let redirect = search.get("redirect");
    
    const convertedJson = convertFormDataToJson(form);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(convertedJson),
    };

    const response = await fetch(`/account/login`, options);
    const result = await response.json();

    if (response.ok && response.status === 202) {
        localStorage.setItem("so-token", result.accessToken);
        
        if (redirect) {
            window.location.href = redirect;
        };

        return;
    } else {
        if (result.errors) {
            errorList.addErrorList(errors);
        } else {
            errorList.addError(result.message)
        }
    };

    errorList.showErrors();
});