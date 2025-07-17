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

utilities.verifyUserAuthorizationToken = async function(authorizationHeader, callback) {
    let error = "Authorization header not provided";
    let data = {};

    if (authorizationHeader) {
        const authorizationArray = authorizationHeader.split(" ");
        const token = authorizationArray[1];

        if (token == "null") {
            error = "Authorization token not provided";
        } else {
            data = await jwt.verify(token, process.env.JWT_SECRET);

            if (data) {
                error = false;
            } else {
                error = "Authorization token invalid";
            }
        }
    } 

    callback(error, data);
}

module.exports = utilities