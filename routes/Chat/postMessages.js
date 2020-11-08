const mongoose = require("mongoose");
const UserSchema = require("../../models/user");
const MessageSchema = require("../../models/chat");
module.exports = async (req, res, next) => {
  try {
    const User = mongoose.model("User", UserSchema);
    const { id, content } = req.body;
    User.findById(req.user.id, (err, from) => {
      if (err) return res.status(400).send("could not find logged in user");
      User.findById(req.params.id, (err, to) => {
        if (err) return res.status(400).send({ message: "failed" });
        const Message = mongoose.model("Messages", MessageSchema);
        const message = new Message({
          to: to,
          from: from,
          content: content,
        });
        message.save((err) => {
          if (err) return res.status(400).send(err);
          return res.status(200).json(message);
        });
      });
    });
  } catch (err) {
    return next({
      status: 400,
      message: "something went wrong",
      error: err.message,
    });
  }
};
