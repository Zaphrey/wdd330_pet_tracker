const app = require("express");
const { buildHome, createAccount, buildRegister, buildLogin, signIn } = require("../controllers/accountController");
const { checkLogin } = require("../utilities");
const router = app.Router();

router.get("/", checkLogin, buildHome);
router.get("/register", buildRegister);
router.get("/login", buildLogin);
router.post("/login", signIn);
router.post("/create", createAccount);

module.exports =  router