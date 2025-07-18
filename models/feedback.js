const pool = require("../database/db");
const model = {};

model.addFeedbackEntryFromUser = async function(userId, bodyText) {
    try {
        return await pool.query("INSERT INTO feedback (account_id, feedback_body) VALUES ($1, $2)", [userId, bodyText]);
    } catch (error) {
        console.error(error.message);
        return error.message;
    }
}

module.exports = model;