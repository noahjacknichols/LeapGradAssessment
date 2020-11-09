const mongoose = require("mongoose");

const TweetSchema = require("../../models/tweet");

module.exports = async (req, res, next) => {
  try {
    const Tweet = mongoose.model("Tweet", TweetSchema);
    Tweet.deleteOne(
      { _id: req.params.tweetId, from: req.user.id },
      (err, deleted) => {
        if (err)
          return next({
            status: 400,
            message: "err deleting tweet",
            error: err.message,
          });
        if (deleted.deletedCount === 0)
          return next({
            status: 400,
            message: "could not find tweet with specified id",
          });

        //could be 204 but prefer 200 with message
        return res.status(200).json({ message: "deleted successfully" });
      }
    );
  } catch (e) {
    return next({
      status: 400,
      message: "something went wrong deleting tweet",
      error: e.message,
    });
  }
};
