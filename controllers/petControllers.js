const petController = {};

petController.buildHome = async function (req, res) {
    res.render("pets/index", { title: "Pets"})
}

petController.buildAddPage = async function (req, res) {
    res.render("pets/add", { title: "Add Pet" })
}

module.exports = petController;