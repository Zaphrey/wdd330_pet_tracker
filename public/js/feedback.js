import { getUserTokenFromStorage, convertFormDataToJson } from "./utilities.js";
import { uploadFeedback } from "./externalServices.js";
const form = document.forms[0];
const button = document.querySelector("button");

const userToken = await getUserTokenFromStorage()

form.addEventListener("submit", async e => {
    e.preventDefault();

    const body = convertFormDataToJson(form);
    const response = await uploadFeedback(userToken, body);

    console.log(response);
})