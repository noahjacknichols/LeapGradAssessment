var express = require("express");
const chat = express.Router();
const {
  messagePostRules,
  messageGetByIdRules,
  validate,
} = require("../../validation/chat/messages");

const auth = require("../../middleware/auth");
const getChat = require("./getMessagesById");
const postMessage = require("./postMessages");

/**
 * @api {get} /messages/:id returns messages from loggedin user and user with given id
 * @params {MongoId} id
 */
chat.get("/:id", auth, messageGetByIdRules(), validate, getChat);

/**
 * @api {post} /messages/:id adds a new from from loggedin user and user with given id
 * @params {MongoId} id
 */
chat.post("/:id", auth, messagePostRules(), validate, postMessage);

module.exports = chat;
