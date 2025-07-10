const pool = require("../database/db");
const bcrypt = require("bcrypt");
const model = {};

model.registerAccount = async function (fname, lname, email, password) {
    try {
        let query = await pool.query("SELECT * FROM account WHERE account_email = $1;", [ email ]);
        const hashedPassword = await bcrypt.hash(password, 10);
        return await pool.query("INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *;", [ fname, lname, email, hashedPassword ]);
    } catch (error) {
        return error.message;
    }
}

model.getAccountFromEmail = async function(email) {
    try {
        return await pool.query("SELECT * FROM account WHERE account_email = $1;", [email]);
    } catch (error) {
        return error.message;
    }
}

module.exports = model;