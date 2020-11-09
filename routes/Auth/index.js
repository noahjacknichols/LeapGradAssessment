var express = require("express");
const auth = express.Router();
const { userPostRules, validate } = require("../../validation/users/users");
const login = require("./login");
const register = require("./register");

/**
 * @api {post} /auth/login logs in with user credentials
 * @params {Email} email
 * @params {String} password
 */
auth.post("/login", userPostRules(), validate, login);

/**
 * @api {post} /auth/register registers a new user
 * @params {String} firstname
 * @params {String} lastname
 * @params {Email} email
 * @params {String} password min 6 chars
 */
auth.post("/register", userPostRules(), validate, register);
module.exports = auth;
