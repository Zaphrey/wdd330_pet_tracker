const app = require("express");
const { buildHome, createAccount, buildRegister, buildLogin, signIn } = require("../controllers/accountController");
const { checkLogin } = require("../utilities");
const { registrationRules, loginRules, checkData } = require("../utilities/accountValidator");
const router = app.Router();

router.get("/", checkLogin, buildHome);
router.get("/register", buildRegister);
router.get("/login", buildLogin);
router.post("/login", loginRules(), checkData, signIn);
router.post("/create", registrationRules(), checkData, createAccount);

module.exports =  router