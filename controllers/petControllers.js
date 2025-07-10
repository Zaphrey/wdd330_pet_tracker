const jwt = require("jsonwebtoken");
require("dotenv").config();
const petModel = require("../models/pet");
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

    if (authorization) {
        const authorizationArray = authorization.split(" ");
        const token = authorizationArray[1];

        if (token == "null") {
            return res.status(200).send(JSON.stringify({ message: "Authorization token not provided"}));
        } else {
            const data = await jwt.verify(token, process.env.JWT_SECRET);

            if (data) {
                const petData = await petModel.getPetsFromUser(data.id);

                return res.status(200).send(JSON.stringify(petData.rows));
            } else {
                return res.status(200).send(JSON.stringify(JSON.stringify({ message: "Authorization token invalid" })));
            }
        }
    } 

    return res.status(200).send(JSON.stringify({ message: "Authorization header not provided" }));
}

petController.uploadPet = async function (req, res) {
    console.log(req.body)
    const { 
        name, 
        breed, 
        weight, 
        age, 
        pet_lastvetvisit, 
        pet_vaccinated_id 
    } = req.body;

    const image = req.files.image;
    
    await petModel.createPet(
        res.locals.accountData.id, 
        image, 
        name, 
        breed, 
        weight, 
        age, 
        pet_lastvetvisit, 
        pet_vaccinated_id
    );

    res.status(200).send();
}

module.exports = petController;