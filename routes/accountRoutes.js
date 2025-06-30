const app = require("express");
const { buildHome} = require("../controllers/accountController");
const router = app.Router();

router.get("/", buildHome)

module.exports =  router