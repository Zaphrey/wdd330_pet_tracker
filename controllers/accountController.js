const { registerAccount, getAccountFromEmail } = require("../models/account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const baseController = {};

baseController.buildHome = async function (req, res) {
    // res.render("account", { title: "Account Home" });
    res.render("account/", { title: "Register Account" });
}

baseController.buildRegister = async function (req, res) {
    res.render("account/register", { title: "Register Account" });
}

baseController.buildLogin = async function (req, res) {
    res.render("account/login", { title: "Login" });
}

baseController.createAccount = async function (req, res) {
    const { fname, lname, email, password } = req.body;
    const result = await registerAccount(fname, lname, email, password);
    console.error(result)
    if (typeof(result) === "string") {
        return res.status(400).send("A user with that email already exists!");
    }

    res.set("Content-Type", "application/json");
    return res.status(200).send(JSON.stringify(result.rows));
}

baseController.signIn = async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await getAccountFromEmail(email);

        if (user.rows < 1) {
            res.set("Content-Type", "application/json");
            return res.status(200).send(JSON.stringify({ message: "Could not find a user with that email address." }));
        }

        const isPasswordValid = await bcrypt.compare(password, user.rows[0].account_password);

        if (!isPasswordValid) {
            res.set("Content-Type", "application/json");
            return res.status(200).send(JSON.stringify({ message: "Invalid password." }));
        }

        const options = {
            algorithm: "HS256",
            expiresIn: 3600 * 1000,
        }

        const accessToken = jwt.sign({ 
            id: user.rows[0].account_id, 
            firstname: user.rows[0].account_firstname,
            lastname: user.rows[0].account_lastname,
            email: user.rows[0].account_email 
        }, process.env.JWT_SECRET, options);

        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }

        res.set("Content-Type", "application/json");
        return res.status(202).send(JSON.stringify({ "accessToken": accessToken }));
    } catch (error) {
        console.log(error.message)
        res.set("Content-Type", "application/json");
        return res.status(500).send(JSON.stringify({message: error.message }));
    }
}

module.exports = baseController;