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

/**
 * @api {get} /tweets/me Gets all tweets by logged in user
 */
tweet.get("/me", auth, getTweet);

/**
 * @api {get} /tweets/:tweetId Get specific tweet info.
 * @params {MongoId} tweetId
 */
tweet.get(
  "/:tweetId",
  auth,
  getTweetByTweetIdRules(),
  validate,
  getTweetByTweetId
);

/**
 * @api {post} /tweets/  posts a new tweet from user
 * @params {String} content (1-255 characters)
 */
tweet.post("/", auth, tweetPostRules(), validate, postTweet);

/**
 * @api {delete} /tweets/:tweetId deletes a user's tweet
 * @params {MongoId} tweetId
 */
tweet.delete("/:tweetId", auth, tweetDeleteRules(), validate, deleteTweet);

/**
 * @api {put} /tweets/:tweetId updates a user's tweet
 * @params {MongoId} tweetId
 */
tweet.put("/:tweetId", auth, tweetUpdateRules(), validate, updateTweet);

module.exports = tweet;
