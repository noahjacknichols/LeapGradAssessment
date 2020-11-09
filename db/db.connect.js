const mongoose = require("mongoose");

const UserSchema = require.main.require("../models/user");
const ChatSchema = require.main.require("../models/chat");
const TweetSchema = require.main.require("../models/tweet");

mongoose.connect("<INSERT MONGODB URI HERE>", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  mongoose.model("User", UserSchema);
  mongoose.model("Chat", ChatSchema);
  mongoose.model("Tweet", TweetSchema);
});
