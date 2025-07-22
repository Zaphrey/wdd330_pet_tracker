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
const vaccineRoutes = require("./routes/vaccineRoutes");
const vaccinatedRoutes = require("./routes/vaccinatedRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes")
const utilities = require("./utilities");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");

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

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
app.use("/vaccine", vaccineRoutes);
app.use("/feedback", feedbackRoutes);
// app.use("/vaccinated", vaccinatedRoutes);

app.use(async (err, req, res, next) => {
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    if (err.status == 404) { message = err.message } else { message = "Oh no! There was a crash. Maybe try a different route?" }
    res.redirect("/");
})

app.listen(process.env.PORT, () => {
    console.log(`app listening on ${process.env.HOST}:${process.env.PORT}`);
})