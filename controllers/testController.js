const baseController = {};

baseController.buildHome = async function (req, res) {
    res.render("index", {})
}

module.exports = baseController;