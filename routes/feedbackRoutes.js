const app = require("express");
const { renderFeedbackPage, uploadFeedback } = require("../controllers/feedbackController");
const { checkLogin } = require("../utilities");
const { feedbackRules, checkData } = require("../utilities/validators");

const router = app.Router();

router.get("/", checkLogin, renderFeedbackPage);
router.post("/", feedbackRules(), checkData, uploadFeedback);

module.exports = router;