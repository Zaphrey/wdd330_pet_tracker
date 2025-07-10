const app = require("express");
const { buildHome, buildAddPage, uploadPet, getAllPets } = require("../controllers/petControllers");
const utilities = require("../utilities");
const router = app.Router();

router.get("/", utilities.checkLogin, buildHome);
router.get("/add", utilities.checkLogin, buildAddPage);
router.post("/add", utilities.checkLogin, uploadPet);

// Independant from session cookies
router.get("/all", getAllPets);

module.exports =  router;