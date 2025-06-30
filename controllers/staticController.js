const baseController = {};

baseController.buildHome = async function (req, res) {
    res.render("index", { title: "Start" })
}

module.exports = baseController;