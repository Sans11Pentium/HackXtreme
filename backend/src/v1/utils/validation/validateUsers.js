const Joi = require("joi");

/**
 * @desc validate new user data using Joi
 * @param  string $data - user data to be varify
 * @return returns validation
 */
const registerValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .min(8),

    email: Joi.string().required().email({ minDomainSegments: 2 }),
  });

  return schema.validate(data);
};

module.exports = { registerValidation };
