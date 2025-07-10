const express = require("express");
const app = express();
const pool = require("./database/db")
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
// const session = require("express-session");
const static = require("./routes/static");
const baseController = require("./controllers/staticController");
const petRoutes = require("./routes/petRoutes");
const accountRoutes = require("./routes/accountRoutes");
const cookieParser = require("cookie-parser");
const utilities = require("./utilities");
const fileUpload = require("express-fileupload");

// app.use(session({
//     store: new (require('connect-pg-simple')(session))({
//         createTableIfMissing: true,
//         pool,
//     }),
//     secret: process.env.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true,
//     name: 'sessionId',
// }))

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use("/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://wdd330-pet-tracker.onrender.com");
    next();
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(utilities.checkJWTToken);
app.use(fileUpload());

app.use(static);
app.get("/", baseController.buildHome);
app.use("/pets", petRoutes);
app.use("/account", accountRoutes);

app.listen(process.env.PORT, () => {
    console.log(`app listening on ${process.env.HOST}:${process.env.PORT}`);
})