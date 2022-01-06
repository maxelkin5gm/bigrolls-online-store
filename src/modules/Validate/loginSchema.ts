import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .trim()
    .required(),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

export default loginSchema;
