import { createUserPet, getAllVaccines } from "./externalServices.js";
import { createVaccineEntry, getUserTokenFromStorage } from "./utilities.js";
const userJWT = getUserTokenFromStorage();
const vaccineList = await getAllVaccines();
const form = document.forms[0];

const addVaccinationButton = document.getElementById("add");
const vaccinationSection = document.getElementById("vaccination-section");

addVaccinationButton.addEventListener("click", (e) => {
    // addVaccineEntry()
    vaccinationSection.insertAdjacentHTML("beforeend", createVaccineEntry(vaccineList))
    const lastElement = vaccinationSection.lastElementChild;
    const elementButton = lastElement.querySelector(".delete-vaccine-button");

    elementButton.addEventListener("click", () => {
        vaccinationSection.removeChild(lastElement);
    });
})

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let formData = new FormData(form);

    const result = await createUserPet(userJWT, formData);

    if (result.success) {
        window.location.href = "/pets";
    }
})

