import Joi from "joi";

const customerSchemas = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().length(9).required(), //
    cpf: Joi.string().length(11).required(), //.pattern(/^[0-9]+$/)
    birthday: Joi.string()
        .pattern(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/)
        .required(),
});

export { customerSchemas };
