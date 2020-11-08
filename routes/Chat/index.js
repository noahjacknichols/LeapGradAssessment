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

chat.get("/:id", auth, messageGetByIdRules(), validate, getChat);
chat.post("/:id", auth, messagePostRules(), validate, postMessage);
module.exports = chat;
