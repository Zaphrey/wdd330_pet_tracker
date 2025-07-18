const jwt = require("jsonwebtoken");
require("dotenv").config();
const petModel = require("../models/pet");
const vaccinatedModel = require("../models/vaccination")
const utilities = require("../utilities");
// const { json } = require("body-parser");
const petController = {};

petController.buildHome = async function (req, res) {
    res.render("pets/index", { title: "Pets"})
}

petController.buildAddPage = async function (req, res) {
    res.render("pets/add", { title: "Add Pet" })
}

petController.getAllPets = async function(req, res) {
    const authorization = req.headers.authorization;
    res.header("Content-Type", "application/json");

    utilities.verifyUserAuthorizationToken(authorization, async (error, data) => {
        if (error) {
            return res.status(200).send(JSON.stringify({ message: error}));
        } else {
            const petData = await petModel.getPetsFromUser(data.id);
            return res.status(200).send(JSON.stringify(petData));
        }
    })
}

petController.uploadPet = async function (req, res) {
    const { 
        name, 
        breed, 
        weight, 
        age, 
        pet_lastvetvisit, 
        pet_vaccinated_id 
    } = req.body;

    const image = req.files.image;
    
    const petData = await petModel.createPet(
        res.locals.accountData.id, 
        image, 
        name, 
        breed, 
        weight, 
        age, 
        pet_lastvetvisit, 
        pet_vaccinated_id
    );

    if (req.body.vaccine && req.body.vaccinated_date) {
        if (typeof(req.body.vaccine) == "string") {
            vaccinatedModel.createVaccinatedEntryFromPetVaccineDate(petData.rows[0].pet_id, req.body.vaccine, req.body.vaccinated_date);
        } else {
            console.log(req.body.vaccine, req.body.vaccinated_date)
            for (let index = 0; index < req.body.vaccine.length; index++) {
                vaccinatedModel.createVaccinatedEntryFromPetVaccineDate(petData.rows[0].pet_id, req.body.vaccine[index], req.body.vaccinated_date[index]);
            }
        }
    }

    res.status(200).send(JSON.stringify({ message: "Sucessfully added pet!", success: true }));
}

petController.deletePet = async function(req, res) {
    const authorization = req.headers.authorization;
    const { petId } = req.params;

    res.header("Content-Type", "application/json");

    utilities.verifyUserAuthorizationToken(authorization, async (error, data) => {
        if (error) {
            return res.status(200).send(JSON.stringify({ message: error}));
        } 

        const result = await petModel.deletePetFromUser(data.id, petId);
        console.log(result)
        return res.status(200).send(JSON.stringify({ message: "Pet successfully deleted!" }));
    })
}

// petController.getPetVaccinations = async function (req, res) {
//     const authorization = req.headers.authorization;
//     const { petId } = req.params;
//     res.header("Content-Type", "application/json");

//     utilities.verifyUserAuthorizationToken(authorization, async (error, data) => {
//         if (error) {
//             return res.status(200).send(JSON.stringify({ message: error}));
//         }

//         const query = await vaccinatedModel.getVaccinatedEntriesFromPet(petId);
//         console.log(query)
//         return res.status(200).send(JSON.stringify(query.rows));
//     })
// }

petController.updatePet = async function(req, res) {
    const authorization = req.headers.authorization;
    const { petId } = req.params;
    const { name, breed, age, weight, vaccine, vaccinated_date } = req.body;


    utilities.verifyUserAuthorizationToken(authorization, async (error, data) => {
        if (error) {
            return res.status(200).send(JSON.stringify({ message: error}));
        } 
        // delete all vaccinations and create new vaccinated entries given the updated data
        await vaccinatedModel.deleteAllVaccinatedEntriesFromPet(petId);
        await petModel.updatePet(name, breed, age, weight, data.id, petId);

        if (vaccine && vaccinated_date) {
            if (typeof(vaccine) == "string") {
                vaccinatedModel.createVaccinatedEntryFromPetVaccineDate(petId, vaccine, vaccinated_date);
            } else {
                for (let index = 0; index < vaccine.length; index++) {
                    vaccinatedModel.createVaccinatedEntryFromPetVaccineDate(petId, vaccine[index], vaccinated_date[index]);
                }
            }
        }

        const updatedPetData = await petModel.getPetFromUser(data.id, petId)
        return res.status(200).send(JSON.stringify(updatedPetData[0]));
    })
}

module.exports = petController;