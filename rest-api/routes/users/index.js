const express = require("express");

const app = express.Router();

const api = require("./api.js");

const utils = require("../utils.js");

const config = require("../../config.js");

const authUser = require("../../middlewares/index.js").authUser;

/// API ENDPOINT GOES HERE

/* CREATE NEW USER */
app.post("/users/create-new-user", (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.json({ submitError: true });
    } else {
        api.createNewUser(req.body.username, req.body.password, (response) => {
            if (!response.success) {
                res.json(response);
            } else {
                const cookieSettings = {
                    path: "/",
                    expires: new Date(
                        response.authTokenExpirationTimestamp * 1000
                    ),
                    httpOnly: true,
                    encode: String,
                    secure: process.env.NODE_ENV === "production",
                    domain:
                        process.env.NODE_ENV === "development"
                            ? ""
                            : utils.getDomainFromUrl(
                                  config.productionWebsiteURL
                              ),
                };

                /*
                 * cookie format: user = "username&auth_token"
                 */
                res.cookie(
                    "user",
                    response.username + "&" + response.authToken,
                    cookieSettings
                );

                res.json({ success: true });
            }
        });
    }
});

/* LOGIN USER */
app.put("/users/login", (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.json({ submitError: true });
    } else {
        api.loginUser(req.body.username, req.body.password, (response) => {
            if (!response.success) {
                res.json(response);
            } else {
                const cookieSettings = {
                    path: "/",
                    expires: new Date(
                        response.authTokenExpirationTimestamp * 1000
                    ),
                    httpOnly: true,
                    encode: String,
                    secure: process.env.NODE_ENV === "production",
                    domain:
                        process.env.NODE_ENV === "development"
                            ? ""
                            : utils.getDomainFromUrl(
                                  config.productionWebsiteURL
                              ),
                };

                res.cookie(
                    "user",
                    response.username + "&" + response.authToken,
                    cookieSettings
                );

                res.json({ success: true });
            }
        });
    }
});

app.get("/users/authenticate", authUser, (req, res) => {
    if (!res.locals.userSignedIn) {
        res.json({ success: false, authUser: res.locals });
    } else {
        res.json({ success: true, authUser: res.locals });
    }
});

module.exports = app;
