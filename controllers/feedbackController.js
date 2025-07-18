const { verifyUserAuthorizationToken } = require("../utilities")
const feedbackModel = require("../models/feedback")

let controller = {}

controller.renderFeedbackPage = async function(req, res) {
    res.render("/feedback", { title: Feedback });
}

controller.uploadFeedback = async function(req, res) {
    const { authorization } = req.headers
    const { feedback } = req.body

    verifyUserAuthorizationToken(authorization, async (error, data) => {
        if (error) {
            return res.status(200).send(JSON.stringify({ message: error}));
        } else {
            await feedbackModel.addFeedbackEntryFromUser(data.id, feedback);
            return res.status(200).send(JSON.stringify({ message: "Feedback received!"}));
        }
    })
}

module.exports = controller;