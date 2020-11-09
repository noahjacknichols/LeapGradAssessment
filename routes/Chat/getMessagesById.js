const mongoose = require("mongoose");
const UserSchema = require("../../models/user");
const MessageSchema = require("../../models/chat");

/**
 * perhaps I'm adding business logic, but I assumed messaging a user means
 * both user's must still exist
 **/
module.exports = async (req, res, next) => {
  try {
    const User = mongoose.model("User", UserSchema);
    const id = new mongoose.Types.ObjectId(req.params.id);
    User.findById(req.user.id, async (err, from) => {
      if (err)
        return res
          .status(400)
          .send({ error: "something went wrong with query" });
      if (from === null)
        return next({ status: 400, message: "could not find logged in user" });

      User.findById(req.params.id, async (err, to) => {
        if (err) return next({ status: 400, message: "failed to query db" });
        if (to === null)
          return next({
            status: 400,
            message: "could not find user sent message to",
          });

        const Messages = mongoose.model("Messages", MessageSchema);
        Messages.find({ to: to, from: from })
          .lean()
          .exec((err, messages) => {
            if (err)
              return next({
                status: 400,
                message: "could not execute query something went wrong",
                error: err.message,
              });
            return res.status(200).json(messages);
          });
      });
    });
  } catch (e) {
    return res.status(400).send({ message: "error in fetching user" });
  }
};
