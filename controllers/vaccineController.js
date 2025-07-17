const vaccineModel = require("../models/vaccine")
const vaccineController = {}

vaccineController.getVaccines = async function(req, res) {
    const vaccines = await vaccineModel.getAllVaccines();
    return res.status(200).send(vaccines.rows);
};

module.exports = vaccineController;