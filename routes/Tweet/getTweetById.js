const mongoose = require("mongoose");

const TweetSchema = require("../../models/tweet");

module.exports = async (req, res, next) => {
  const Tweet = mongoose.model("Tweet", TweetSchema);
  Tweet.find({ from: req.params.userId }, (err, tweets) => {
    if (err)
      return next({
        status: 400,
        message: "err retrieving tweets",
        error: err.message,
      });
    return res.status(200).json(tweets);
  });
};
