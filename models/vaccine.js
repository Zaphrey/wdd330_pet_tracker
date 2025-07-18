const pool = require("../database/db");
const model = {};

model.getAllVaccines = async function() {
    try {
        return await pool.query("SELECT * FROM vaccine");
    } catch(error) {
        return error.message;
    }
};

module.exports = model;