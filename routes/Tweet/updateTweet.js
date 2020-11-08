const mongoose = require("mongoose");

const TweetSchema = require("../../models/tweet");

module.exports = async (req, res, next) => {
  const Tweet = mongoose.model("Tweet", TweetSchema);
  Tweet.findOne(
    { _id: req.params.tweetId, from: req.user.id },
    async (err, tweet) => {
      if (err)
        return next({
          status: 400,
          message: "error retrieving tweet",
          error: err.message,
        });
      if (tweet === null)
        return next({ status: 400, message: "no tweet found" });
      tweet.content = req.body.content;
      tweet.save((err) => {
        if (err)
          return next({
            status: 400,
            message: "could not save tweet",
            error: err.message,
          });
        return res.status(200).json(tweet);
      });
    }
  );
};
