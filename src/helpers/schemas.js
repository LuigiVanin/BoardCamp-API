import Joi from "joi";

const customerSchemas = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(11)
        .required(), //
    cpf: Joi.string()
        .pattern(/^[0-9]+$/)
        .length(11)
        .required(), //.pattern(/^[0-9]+$/)
    birthday: Joi.string()
        .pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
        .required(),
});

const categorySchema = Joi.object({
    name: Joi.string().required(),
});

const gamesSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    stockTotal: Joi.number().integer().min(1).required(),
    categoryId: Joi.number().integer().required(),
    pricePerDay: Joi.number().min(1).required(),
});

const rentalsSchemas = Joi.object({
    customerId: Joi.number().integer().required(),
    gameId: Joi.number().integer().required(),
    daysRented: Joi.number().integer().min(1).required(),
});

export { customerSchemas, categorySchema, gamesSchema, rentalsSchemas };
