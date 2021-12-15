import Joi from "joi";

const categorySchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(15)
        .trim()
        .required(),

    imgURL: Joi.string().trim()
})

export default categorySchema