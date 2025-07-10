import { getUserPets } from "./externalServices.js";
import { getUserTokenFromStorage } from "./utilities.js";
const userJWT = getUserTokenFromStorage();
const petData = await getUserPets(userJWT);

const petCardsSection = document.getElementById("pet-cards");

let buildPetCard = (petData) => {
    return `
            <div class="pet-card hide">
                <img id="pet-img" loading="lazy" src="/upload/${ petData.image_name }" alt="image of (pet-name)">
                <p id="pet-name">Name: ${ petData.pet_name }</p>
                <p id="pet-breed">Breed: ${ petData.pet_breed }</p>
                <p id="pet-age"> Age: ${ petData.pet_age }</p>
                <p id="pet-weight">Weight: ${ petData.pet_weight }</p>
                <p id="pet-lastvetvisit" class="hide">Last vet visit: ${ petData.pet_lastvetvisit }</p>
            </div>
            `
}

let createPetCards = (petData) => {
    petData.forEach((pet, index) => {
        petCardsSection.insertAdjacentHTML("beforeend", buildPetCard(pet));
        const newestCard = petCardsSection.lastElementChild;
        newestCard.querySelector("img").onload = () => {
            setTimeout(() => {
                console.log(newestCard)
                newestCard.classList.add("card-fade-in");
                newestCard.classList.remove("hide");
            }, 100 * index);
            console.log(index % 2)
        };
    });
}

createPetCards(petData)