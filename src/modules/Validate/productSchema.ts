import Joi from "joi";

const productSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(15)
        .trim()
        .required(),

    price: Joi.number()
        .integer()
        .min(0)
        .required(),

    category: Joi.string()
        .min(3)
        .max(15)
        .trim()
        .required(),

    imgURL: Joi.string().trim()
})

export default productSchema