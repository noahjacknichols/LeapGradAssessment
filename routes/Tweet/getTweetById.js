const mongoose = require("mongoose");

const TweetSchema = require("../../models/tweet");

//unused anymore for scope of project, but would be useful if we were to say look at a different user's account page
//for their tweets

module.exports = async (req, res, next) => {
  try {
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
  } catch (e) {
    return next({
      status: 400,
      message: "something went wrong getting tweet",
      error: e.message,
    });
  }
};
