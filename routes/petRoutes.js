const app = require("express");
const { buildHome, buildAddPage } = require("../controllers/petControllers");
const router = app.Router();

router.get("/", buildHome);
router.get("/add", buildAddPage);

module.exports =  router;