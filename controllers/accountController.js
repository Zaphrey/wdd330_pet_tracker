const baseController = {};

baseController.buildHome = async function (req, res) {
    res.render("account/index", { title: "Account Home" })
}

module.exports = baseController;