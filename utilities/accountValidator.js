// const {query, validationResult } = require("express-validator");

const { query, validationResult, body } = require("express-validator")
const accountModel = require("../models/account")

const validators = {}
// abcD12#s
validators.registrationRules = function() {
    return [
        body("fname").notEmpty().escape().withMessage("Please provide a first name."),
        body("lname").notEmpty().escape().withMessage("Please provide a last name."),
        body("email").notEmpty().trim().escape().isEmail().withMessage("Please provide a valid email").custom(async email => {
            const emailExists = await accountModel.checkForExistingEmail(email);

            if (emailExists.rows.length > 0) {
                throw new Error("Email is already in use.")
            } else {
                return true;
            }
        }),
        body("password").notEmpty().withMessage("Password is empty.").isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            }).withMessage("Password must have at least one number, one special character, one uppercase and lowercase character, and at least 8 characters total."),
    ]
}

validators.loginRules = function() {
    return [
        body("email").notEmpty().trim().escape().isEmail().withMessage("Please provide a valid email").custom(async email => {
            const emailExists = await accountModel.checkForExistingEmail(email);

            if (emailExists.rows.length == 0) {
                throw new Error("Cannot find account with that email.")
            } else {
                return true;
            }
        }),
        body("password").isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            }).withMessage("Password must have at least one number, one special character, one uppercase and lowercase character, and at least 8 characters total."),
    ]
}

// validators.checkRegistration = async function(req, res, next) {
//     let errors = []
//     console.log(req.body)
//     errors = validationResult(req);
//     console.log(errors)

//     if (!errors.isEmpty()) {
//         res.status(401).send(JSON.stringify(errors));
//         return
//     };

//     next();
// }

validators.checkData = async function(req, res, next) {
    let errors = []
    errors = validationResult(req);
    console.log(errors)

    if (!errors.isEmpty()) {
        res.status(401).send(JSON.stringify(errors));
        return
    };

    next();
}

module.exports = validators;