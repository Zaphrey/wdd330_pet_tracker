import { getUserTokenFromStorage, convertFormDataToJson } from "./utilities.js";
import { uploadFeedback } from "./externalServices.js";
import ErrorList from "./errorList.js";

const form = document.forms[0];
const errorListElement = document.querySelector(".form-error-list");
const button = document.querySelector("button");
const userToken = await getUserTokenFromStorage()

const errorList = new ErrorList(errorListElement);

form.addEventListener("submit", async e => {
    e.preventDefault();

    const body = convertFormDataToJson(form);
    const response = await uploadFeedback(userToken, body);

    if (response.errors) {
        errorList.addErrorArray(response.errors);
        errorList.showErrors();

        let html = button.innerHTML;
        button.innerHTML = `<span class="material-symbols-outlined">close</span>`

        button.classList.remove("toggled");
    
        setTimeout(() => {
            button.classList.add("toggled");
            button.innerHTML = html;
        }, 600);

        return;
    }
})