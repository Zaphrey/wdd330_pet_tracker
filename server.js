const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const static = require("./routes/static");
const baseController = require("./controllers/staticController");
const petRoutes = require("./routes/petRoutes");
const accountRoutes = require("./routes/accountRoutes")

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(static);
app.get("/", baseController.buildHome);
app.use("/pets", petRoutes);
app.use("/account", accountRoutes);

app.listen(process.env.PORT, () => {
    console.log(`app listening on ${process.env.HOST}:${process.env.PORT}`);
})