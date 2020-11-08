const { body, param, validationResult } = require("express-validator");

const tweetPostRules = () => {
  return [
    body("content", "no content").exists(),
    body("content", "content isn't a string").isString(),
    body("content", "content is empty or too long").isLength({
      min: 1,
      max: 255,
    }),
  ];
};

const getUserTweetRules = () => {
  return [
    param("userId", "no userId provided").exists(),
    param("userId", "userId isn't a valid mongodb id").isMongoId(),
  ];
};

getTweetByTweetIdRules = () => {
  return [
    param("tweetId", "no tweetId provided").exists(),
    param("tweetId", "tweetId isn't a valid mongodb id").isMongoId(),
  ];
};

const tweetDeleteRules = () => {
  return [
    param("tweetId", "no tweetId provided").exists(),
    param("tweetId", "tweetId isn't a valid mongodb id").isMongoId(),
  ];
};

const tweetUpdateRules = () => {
  return [
    param("tweetId", "no userId provided").exists(),
    param("tweetId", "userId isn't a valid mongodb id").isMongoId(),
    body("content", "no content provided").exists(),
    body("content", "content isn't a string").isString(),
    body("content", "content is empty or too long").isLength({
      min: 1,
      max: 255,
    }),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  tweetPostRules,
  getUserTweetRules,
  tweetDeleteRules,
  tweetUpdateRules,
  validate,
};
