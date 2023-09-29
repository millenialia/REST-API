const Joi = require('joi')

exports.createContactDataValidator = (data) => 
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            name: Joi.string().min(3).max(12).required().messages({"any.required": "Missing required name field"}),
            email: Joi.string().email().required().messages({"any.required": "Missing required email field"}),
            phone: Joi.number().required().messages({ "any.required": "Missing required phone field" }),
            favorite: Joi.boolean(),
        })
        .validate(data)


exports.favoriteContactDataValidator = (data) =>
    Joi
        .object()
        .keys({
            favorite: Joi.boolean().required().messages({"any.required": "Missing field favorite"}),
        })
        .validate(data)