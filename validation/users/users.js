const { body, validationResult } = require("express-validator");

const userPostRules = () => {
  return [
    body("firstname", "no firstname provided").exists().isString(),
    body("lastname", "no lastname provided").exists().isString(),
    body("email", "Invalid email").exists().isEmail(),
    body("password", "password not provided").exists(),
    body("password", "password isn't a string").isString(),
    body("password", "password doesn't conform to requirements").isLength({
      min: 6,
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
  userPostRules,
  validate,
};
