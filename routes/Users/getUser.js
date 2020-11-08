const mongoose = require("mongoose");
const UserSchema = require("../../models/user");

module.exports = async (req, res, next) => {
  try {
    const User = mongoose.model("User", UserSchema);
    const user = await User.findById({ _id: req.user.id });
    const payload = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };
    res.status(200).json(payload);
  } catch (e) {
    res.status(400).send({ message: "error in fetching user" });
  }
};
