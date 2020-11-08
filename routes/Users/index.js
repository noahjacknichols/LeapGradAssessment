var express = require("express");
const user = express.Router();
const auth = require("../../middleware/auth");

const get = require("./getUser");

user.get("/me", auth, get);

module.exports = user;
