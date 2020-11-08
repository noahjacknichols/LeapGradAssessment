const mongoose = require("mongoose");

const TweetSchema = require("../../models/tweet");

module.exports = async (req, res, next) => {
  const Tweet = mongoose.model("Tweet", TweetSchema);
  let tweet = new Tweet({ from: req.user.id, content: req.body.content });
  tweet.save(tweet, (err, newTweet) => {
    if (err)
      return next({
        status: 400,
        message: "couldn't save to db",
        error: err.message,
      });
    const payload = {
      id: newTweet._id,
      from: newTweet.from,
      content: newTweet.content,
    };
    return res.status(201).json(payload);
  });
};
