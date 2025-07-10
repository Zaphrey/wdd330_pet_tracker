const jwt = require("jsonwebtoken");
require("dotenv").config();

const utilities = {}

utilities.checkLogin = async function (req, res, next) {
    if (res.locals.loggedin) {
        next();
    } else {
        res.redirect(`/account/login?redirect=${req.originalUrl}`);
    }
}

utilities.checkJWTToken = async function (req, res, next) {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, accountData) => {
            if (err) {
                res.clearCookie("jwt");
                res.redirect(`/account/login?redirect=${req.originalUrl}`);
            };

            res.locals.loggedin = 1;
            res.locals.accountData = accountData;

            next();
        })
    } else {
        next();
    }
}

module.exports = utilities