var express = require("express");
const tweet = express.Router();
const auth = require("../../middleware/auth");
const {
  tweetPostRules,
  getUserTweetRules,
  tweetDeleteRules,
  tweetUpdateRules,
  validate,
} = require("../../validation/tweet/tweet");

const getTweet = require("./getTweet");
const deleteTweet = require("./deleteTweet");
const postTweet = require("./postTweet");
const updateTweet = require("./updateTweet");
const getTweetById = require("./getTweetById");
const getTweetByTweetId = require("./getTweetByTweetId");

tweet.get("/me", auth, getTweet);
// tweet.get("/:userId", auth, getUserTweetRules(), validate, getTweetById);
tweet.get(
  "/:tweetId",
  auth,
  getTweetByTweetIdRules(),
  validate,
  getTweetByTweetId
);
tweet.post("/", auth, tweetPostRules(), validate, postTweet);
tweet.delete("/:tweetId", auth, tweetDeleteRules(), validate, deleteTweet);
tweet.put("/:tweetId", auth, tweetUpdateRules(), validate, updateTweet);
module.exports = tweet;
