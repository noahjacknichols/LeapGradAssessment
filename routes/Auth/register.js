const UserSchema = require("../../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const User = mongoose.model("User", UserSchema);
  const { firstname, lastname, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }
    user = new User({
      firstname,
      lastname,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save((err) => {
      if (err) return res.status(400).send("error with saving user");
    });
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: 36000,
      },
      (err, token) => {
        if (err) throw err;
        return res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("error in posting");
  }
};
