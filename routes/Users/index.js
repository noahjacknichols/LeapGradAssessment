var express = require("express");
const user = express.Router();
const auth = require("../../middleware/auth");
const get = require("./getUser");

/**
 * @api {get} return id, firstname, lastname, email of logged in user
 */
user.get("/me", auth, get);

module.exports = user;
