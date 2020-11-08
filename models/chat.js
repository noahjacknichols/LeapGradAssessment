const mongoose = require("mongoose");

const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "can't be blank"],
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "can't be blank"],
    },
    content: {
      type: String,
      required: [true, "can't be blank"],
    },
  },
  { timestamps: true }
);

module.exports = ChatSchema;
