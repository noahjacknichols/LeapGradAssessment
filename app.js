var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var usersRouter = require("./routes/Users/index");
var authRouter = require("./routes/Auth/index");
var messageRouter = require("./routes/Chat/index");
var tweetRouter = require("./routes/Tweet/index");
if (process.env.NODE_ENV.trim() === "dev") {
  console.log("connecting to dev db");
  require("./db/db.connect");
}

var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/messages", messageRouter);
app.use("/tweets", tweetRouter);

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    success: false,
    message: err.message || "An error occurred",
    errors: err.error || [],
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Resource not found." });
});

module.exports = app;
