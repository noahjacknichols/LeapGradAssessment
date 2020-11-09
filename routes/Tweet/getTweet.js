const mongoose = require("mongoose");

const TweetSchema = require("../../models/tweet");

module.exports = async (req, res, next) => {
  try {
    const Tweet = mongoose.model("Tweet", TweetSchema);
    Tweet.find({ from: req.user.id }, (err, tweets) => {
      if (err)
        return next({
          status: 400,
          message: "err retrieving tweets",
          error: err.message,
        });
      return res.status(200).json(tweets);
    });
  } catch (e) {
    return next({
      status: 400,
      message: "something went wrong getting tweet",
      error: e.message,
    });
  }
};
