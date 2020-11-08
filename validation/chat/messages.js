const { body, param, validationResult } = require("express-validator");

const messagePostRules = () => {
  return [
    param("id", "Invalid id").exists().isMongoId(),
    body("content", "no message content").exists(),
    body("content", "content isn't a string").isString(),
  ];
};

const messageGetByIdRules = () => {
  return [param("id", "Invalid id").exists().isMongoId()];
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
  messagePostRules,
  messageGetByIdRules,
  validate,
};
