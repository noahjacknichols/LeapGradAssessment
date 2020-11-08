var express = require("express");
const auth = express.Router();
const { userPostRules, validate } = require("../../validation/users/users");
const login = require("./login");
const register = require("./register");

auth.post("/login", userPostRules(), validate, login);
auth.post("/register", userPostRules(), validate, register);
module.exports = auth;
