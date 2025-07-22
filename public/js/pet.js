import ErrorList from "./errorList.js";
import { getAllVaccines, getUserPets, getVaccinationsForPet, removeUserPet, updateUserPet } from "./externalServices.js";
import { createVaccineEntry, getUserTokenFromStorage, processPetFormData } from "./utilities.js";
const userJWT = getUserTokenFromStorage();
const petData = await getUserPets(userJWT);
const vaccinationList = await getAllVaccines();

const petCardsSection = document.getElementById("pet-cards");

const createLabelInputPair = function(label, attributes) {
    let html = `<label>${label}<input`
    for (let [key, value] of Object.entries(attributes)) {
        html += value && ` ${key}="${value}"` || ` ${key}`
    }
    html += "></label>"
    return html
}

const createLabelSelectPair = function(label, attributes, options, selectedValue) {
    let html = `<label>${label}<select`
    if (attributes) {
        for (let [key, value] of Object.entries(attributes)) {
            html += value && ` ${key}="${value}"` || ` ${key}`
        }
    }
    html += ">"
    if (options) {
        options.forEach(option => {
            html += `<option ${selectedValue == option.value && "selected" || ""} value="${option.value}">${option.text}</option>`
        })
    }
    html += "</select></label>"
    return html
}

const vaccineOptions = vaccinationList.map((vaccine) => {
    return { value: vaccine.vaccine_id, text: vaccine.vaccine_name }
})

const unsavedCardDict = {};

let buildPetCardShell = (petData, vaccinations) => {
    let html = `<div class="card-top-bar">
                <p class="pet-name">${ petData.pet_name }</p>
                <button class="settings-button" type="button" aria-label="${ petData.pet_name } settings button">
                    <span class="material-symbols-outlined">
                        settings
                    </span>
                </button>
                <button class="delete-button" type="button" aria-label="${ petData.pet_name } delete button">
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                </button>
            </div>
            
            <img id="pet-img" loading="lazy" src="/upload/${ petData.image_name }" alt="image of (pet-name)">
            <ul class="form-error-list"></ul>
            ${createLabelInputPair("Name", { class: "not-editable", pattern: "[A-Za-z ]+", id: "name", name: "name", value: petData.pet_name, disabled: undefined, required: true })}
            ${createLabelInputPair("Breed", { class: "not-editable", pattern: "[A-Za-z ]+", id: "breed", name: "breed", value: petData.pet_breed, disabled: undefined, required: true })}
            ${createLabelInputPair("Age", { class: "not-editable", pattern: "[0-9]+", id: "age", name: "age", value: petData.pet_age, disabled: undefined, required: true })}
            ${createLabelInputPair("Weight", { class: "not-editable", pattern: "[0-9]+", id: "weight", name: "weight", value: petData.pet_weight, disabled: undefined, required: true })}
            <div class="vaccination-wrapper">
                <div class="button-wrapper hide">
                    <p>Vaccinations</p>
                    <button class="add-button" type="button" aria-label="${ petData.pet_name } settings button">
                        <span class="material-symbols-outlined">
                            add
                        </span>
                    </button>
                </div>`

    if (vaccinations && vaccinations.length > 0) {
        vaccinations.forEach((vaccination, index) => {
            const date = vaccination.vaccinated_date.split("T")[0];
            let vaccineLabel = createLabelSelectPair("Vaccination", { class: "not-editable", name: "vaccine", id: "vaccine", disabled: undefined }, vaccineOptions, vaccination.vaccine_id);
            let dateLabel = createLabelInputPair("Administered", { class: "not-editable", id: "vaccinated_date", name: "vaccinated_date", type: "date", value: date, disabled: undefined })
            html += `<div class="vaccine-label">
                ${vaccineLabel}${dateLabel}
                <button class="delete-vaccine-button hide" type="button" aria-label="vaccine delete button">
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                </button>
            </div>`
        })
    }

    html += `</div></div><button class="hide update-button" type="button">Save changes</button>`
    return html
}

const connectEventsToCard = function(card) {
    const deleteButton = card.querySelector(".delete-button");
    const addVaccineButton = card.querySelector(".add-button");
    const vaccinationWrapper = card.querySelector(".vaccination-wrapper");
    const settingsButton = card.querySelector(".settings-button");
    const updateButton = card.querySelector(".update-button");
    const errorListElement = card.querySelector(".form-error-list");
    const errorList = new ErrorList(errorListElement);
    
    card.querySelectorAll(".delete-vaccine-button").forEach(button => {
        button.addEventListener("click", e => {
            vaccinationWrapper.removeChild(button.parentElement);
        });
    })

    addVaccineButton.addEventListener("click", () => {
        vaccinationWrapper.insertAdjacentHTML("beforeend", createVaccineEntry(vaccinationList, null, null, "vaccine-label"));
        const lastElement = vaccinationWrapper.lastElementChild;
        const deleteButton = lastElement.querySelector(".delete-vaccine-button");

        deleteButton.addEventListener("click", () => {
            vaccinationWrapper.removeChild(lastElement)
        });
    });

    settingsButton.addEventListener("click", () => {
        if (!card.classList.contains("editable")) {
            makeCardEditable(card);
        } else {
            makeCardUneditable(card);
        }
        
        card.classList.toggle("editable");
    })

    deleteButton.addEventListener("click", async () => {
        await removeUserPet(userJWT, card.getAttribute("card-id"));
        petCardsSection.removeChild(card);
    })

    updateButton.addEventListener("click", async e => {
        const updatedForm = new FormData(card);
        const result = await updateUserPet(userJWT, card.getAttribute("card-id"), updatedForm);

        if (result.errors) {
            errorList.addErrorArray(result.errors);
            errorList.showErrors();
            return;
        }

        petData.some((pet, index) => {
            if (pet.pet_id == result.pet_id) {
                petData[index] = result;
                return true;
            }
        });

        makeCardUneditable(card);
    })
}

const buildPetCard = (petData, vaccinations, fadeTime) => {
    let html = `<form action="/pets/update/${petData.pet_id}" method="post" card-id="${ petData.pet_id }" class="hide pet-card">`
    html += buildPetCardShell(petData, vaccinations)
    html += `</form>`

    // const vaccinations = await getVaccinationsForPet(userJWT, pet.pet_id);
    petCardsSection.insertAdjacentHTML("beforeend", html);
    const newestCard = petCardsSection.lastElementChild;
    
    connectEventsToCard(newestCard);

    // Avoid falsy values
    if (fadeTime || fadeTime === 0) {
        newestCard.querySelector("img").onload = () => {
            setTimeout(() => {
                newestCard.classList.add("card-fade-in");
                newestCard.classList.remove("hide");
            }, fadeTime);
        };
    } else {
        newestCard.classList.remove("hide");
    }
}

const makeCardEditable = function(card) {
    const elements = card.querySelectorAll("input, select, label")
    const button = card.querySelector(".update-button");
    const vaccineButtonWrapper = card.querySelector(".button-wrapper")

    vaccineButtonWrapper.classList.remove("hide");
    button.classList.remove("hide");
    
    for (let element of elements) {
        if (!(typeof(element) == "function")) {
            element.classList.remove("not-editable")
            element.removeAttribute("disabled");
        }
    }

    card.querySelectorAll(".delete-vaccine-button").forEach(button => {
        button.classList.remove("hide");
    })

    unsavedCardDict[card.getAttribute("card-id")] = true;
}

const makeCardUneditable = function(card) {
    const cardPetId = card.getAttribute("card-id")
    let data = null;

    // Find pet data from pet id
    const dataExists = petData.some(pet => {
        if (pet.pet_id == cardPetId) {
            data = pet;
            return true;
        }
    });

    if (dataExists) {
        // Just clear out the contents of the card and reload it
        card.innerHTML = buildPetCardShell(data, data.vaccinations)
        connectEventsToCard(card);
        unsavedCardDict[card.getAttribute("card-id")] = false;
    }
}

let createPetCards = async (petData) => {
    petData.forEach(async (pet, index) => {
        // 100ms times the index. The higher the index, the longer it takes to fade in.
        let fadeTime = 100 * index
        buildPetCard(pet, pet.vaccinations, fadeTime)
    });
}

// https://stackoverflow.com/a/33240387
// window.addEventListener("beforeunload", e => {
//     let allCardsSaved = true;

//     for (let value in unsavedCardDict) {
//         if (unsavedCardDict[value]) allCardsSaved = false
//     }

//     if (!allCardsSaved) {
//         e.preventDefault();
//         e.returnValue = "You may have unsaved changes. Are you sure you want to leave?" 
//     }
// })

if (petData.length > 0) {
    createPetCards(petData)
} else {
    let notFound = document.querySelector(".not-found");
    notFound.classList.remove("hide");
}