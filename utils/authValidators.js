const Joi = require("joi");

const { regex, userSubscriptionEnum } = require("../constants");

exports.createUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string()
        .email()
        .required()
        .messages({ "any.required": "Missing required email field" }),
      password: Joi.string()
        .regex(regex.PASSWD_REGEX)
        .required()
        .messages({ "any.required": "Missing required password field" }),
      subscription: Joi.string().valid(...Object.values(userSubscriptionEnum)),
    })
    .validate(data);

exports.loginUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string()
        .email()
        .required()
        .messages({ "any.required": "Missing required email field" }),
      password: Joi.string()
        .required()
        .messages({ "any.required": "Missing required password field" }),
    })
    .validate(data);

exports.SubscriptionDataValidator = (data) =>
  Joi.object()
    .keys({
      subscription: Joi.string()
        .required()
        .messages({ "any.required": "Missing required subscription field" })
        .valid(...Object.values(userSubscriptionEnum)),
    })
    .validate(data);

exports.VerifyEmailValidator = (data) =>
  Joi.object()
    .keys({
      email: Joi.string()
        .email()
        .required()
        .messages({ "any.required": "Missing required email field" })
    })
    .validate(data);
