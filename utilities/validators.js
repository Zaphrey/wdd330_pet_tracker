// const {query, validationResult } = require("express-validator");

const { check, query, validationResult, body } = require("express-validator")
const accountModel = require("../models/account")
const { getAllVaccines } = require("../models/vaccine")

const validators = {}
// abcD12#s
validators.registrationRules = function() {
    return [
        body("fname").notEmpty().escape().withMessage("Please provide a first name."),
        body("lname").notEmpty().escape().withMessage("Please provide a last name."),
        body("email").trim().escape().isEmail().withMessage("Please provide a valid email").custom(async email => {
            const emailExists = await accountModel.checkForExistingEmail(email);

            if (emailExists.rows.length > 0) {
                throw new Error("Email is already in use.")
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

validators.feedbackRules = function() {
    return [
        body("feedback").isLength({ min: 16 }).withMessage("Feedback must be longer than 16 characters.").trim()
    ]
}

validators.petRules = function() {
    return [
        body("name").notEmpty().withMessage("Name cannot be empty."),
        body("breed").notEmpty().withMessage("Breed cannot be empty.").isAlpha().withMessage("Breed can only contain letters."),
        body("age").notEmpty().withMessage("Age cannot be empty.").isInt({ min: 0 }).withMessage("Age can only contain numbers."),
        body("weight").notEmpty().withMessage("Weight cannot be empty.").isInt({ min: 0 }).withMessage("Weight can only contain numbers."),
        body("vaccine").custom(async vaccine => {
            if (vaccine) {
                const vaccines = await getAllVaccines();
                if (Array.isArray(vaccine)) {
                    vaccine.forEach(vaccineId => {
                        let matches = vaccines.rows.some(vaccineRow => {
                            return vaccineRow.vaccine_id == Number.parseInt(vaccineId)
                        });
        
                        if (!matches) {
                            throw new Error("Invalid vaccine selection");
                        }
                    })
                } else if (typeof(parseInt(vaccine)) == "number") {
                    let matches = vaccines.rows.some(vaccineRow => {
                        return vaccineRow.vaccine_id == Number.parseInt(vaccine)
                    })

                    if (!matches) {
                        throw new Error("Invalid vaccine selection");
                    };
                }
            }

            return true;
        }),
        body("vaccination_date").custom(async date => {
            if (date) {
                function isDateValid(date) {
                    return !isNaN(new Date(date));
                }
    
                if (Array.isArray(date)) {
                    date.forEach(dateStr => {
                        if (!isDateValid(dateStr)) {
                            throw new Error("Invalid date");
                        }
                    })
                } else if (date) {
                    if (!isDateValid(date)) {
                        throw new Error("Invalid date");
                    }
                }
            }

            return true;
        }),
        // check("files").optional().custom((value, { req }) => {
        //     console.log(req, value)
        //     let allowedExtensions = ["jpg", "jpeg", "png", "webp"];
        //     let fileExtension = file.name.split(".").pop().toLowerCase();
        
        //     if (!allowedExtensions.some(extension => fileExtension == extension)) {
        //         throw new Error("Unsupported file type. Supported file types include .png, .jpg, .jpeg, and .webp")
        //     }

        //     let maxSize = 8000000 // 8mb
        //     if (file.size > maxSize) throw new Error("File size is too big. Please upload an image smaller than 8mb");

        //     return true
        // })
    ]
}

validators.checkData = async function(req, res, next) {
    let errors = []
    errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send(JSON.stringify(errors));
        return
    };

    next();
}

module.exports = validators;