const app = require("express");
const { buildHome, buildAddPage, uploadPet, getAllPets, deletePet, getPetVaccinations, updatePet } = require("../controllers/petControllers");
const utilities = require("../utilities");
const { petRules, checkData } = require("../utilities/validators");
const router = app.Router();

router.get("/", utilities.checkLogin, buildHome);
router.get("/add", utilities.checkLogin, buildAddPage);
router.post("/add", utilities.checkLogin, uploadPet);
router.delete("/:petId", deletePet)

// Independent from session cookies
router.get("/all", getAllPets);
router.put("/update/:petId", petRules(), checkData, updatePet);

module.exports =  router;