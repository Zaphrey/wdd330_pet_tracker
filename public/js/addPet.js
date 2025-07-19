import { createUserPet, getAllVaccines } from "./externalServices.js";
import { createVaccineEntry, getUserTokenFromStorage, validateImageExtension, validateImageSize } from "./utilities.js";
import ErrorList from "./errorList.js";
const userJWT = getUserTokenFromStorage();
const vaccineList = await getAllVaccines();
const form = document.forms[0];
const submitButton = document.querySelector(".add-pet-button");
const errorListElement = document.querySelector(".form-error-list");
const errorList = new ErrorList(errorListElement);

const imageInput = document.getElementById("image");
const addVaccinationButton = document.getElementById("add");
const vaccinationSection = document.getElementById("vaccination-section");

imageInput.addEventListener("change", e => {
    if (imageInput.files[0] != undefined) {
        let isExtensionValid = validateImageExtension(imageInput.files[0]);
        let isImageSmallEnough = validateImageSize(imageInput.files[0]);

        if (!isExtensionValid) {
            imageInput.value = "";
            errorList.addError("Unsupported file type. Supported file types include .png, .jpg, .jpeg, and .webp");
            errorList.showErrors();
            return
        }

        if (!isImageSmallEnough) {
            imageInput.value = "";
            errorList.addError("File size is too big. Please upload an image smaller than 8mb");
            errorList.showErrors();
            return
        }

        errorList.hideErrors()
    }
})

addVaccinationButton.addEventListener("click", (e) => {
    // addVaccineEntry()
    vaccinationSection.insertAdjacentHTML("beforeend", createVaccineEntry(vaccineList))
    const lastElement = vaccinationSection.lastElementChild;
    const elementButton = lastElement.querySelector(".delete-vaccine-button");

    elementButton.addEventListener("click", () => {
        vaccinationSection.removeChild(lastElement);
    });
})

submitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!form.reportValidity()) {
        submitButton.classList.remove("toggled");

        setTimeout(() => {
            submitButton.classList.add("toggled");
        }, 600);
    } else {
        let formData = new FormData(form);

        const result = await createUserPet(userJWT, formData);

        if (result.success) {
            window.location.href = "/pets";
        }
    }
})

