import Joi from "joi";

const orderSchema = Joi.object({
    client: {
        name: Joi.string().min(0),
        tel: Joi.string().required(),
        street: Joi.string().min(0),
        home: Joi.string().min(0),
        apartment: Joi.string().min(0)
    },

    info: Joi.object({
        delivery: Joi.string().min(0),
        additionalInfo: Joi.string().min(0),
        totalPrice: Joi.number()
    }).required(),

    basket: Joi.object().required().pattern(/.*/, Joi.object({
        name: Joi.string().min(0),
        price: Joi.string().min(0),
        imgURL: Joi.string().min(0),
        amount: Joi.number().min(1).integer().required(),
    }))
})


export default orderSchema
