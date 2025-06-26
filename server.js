const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const static = require("./routes/static");
const baseController = require("./controllers/testController");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout")

app.use(static)
app.use("/", baseController.buildHome)

app.listen(process.env.PORT, () => {
    console.log(`app listening on ${process.env.HOST}:${process.env.PORT}`);
})