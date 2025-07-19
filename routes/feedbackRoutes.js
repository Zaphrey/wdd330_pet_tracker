const app = require("express");
const { renderFeedbackPage, uploadFeedback } = require("../controllers/feedbackController");
const { checkLogin } = require("../utilities");
const router = app.Router();

router.get("/", checkLogin, renderFeedbackPage);
router.post("/", uploadFeedback);

module.exports = router;