const app = require("express");
const { getVaccines } = require("../controllers/vaccineController");
const utilities = require("../utilities");
const router = app.Router();

router.get("/all", getVaccines);

module.exports =  router;