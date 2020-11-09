const mongoose = require("mongoose");

const TweetSchema = require("../../models/tweet");

module.exports = async (req, res, next) => {
  try {
    const Tweet = mongoose.model("Tweet", TweetSchema);
    Tweet.findById({ _id: req.params.tweetId }, async (err, tweet) => {
      if (err)
        return next({
          status: 400,
          message: "err retrieving tweets",
          error: err.message,
        });
      if (tweet === null)
        // if not found in db
        return next({
          status: 400,
          message: "couldn't find tweet with tweetId",
        });

      return res.status(200).json(tweet);
    });
  } catch (e) {
    return next({
      status: 400,
      message: "something went wrong deleting tweet",
      error: e.message,
    });
  }
};
