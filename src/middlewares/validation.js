import { customerSchemas } from "../helpers/schemas.js";

const customerValidation = (req, res, next) => {
    const validation = customerSchemas.validate(req.body, {
        abortEarly: false,
    });
    if (validation.error) {
        return res.send({
            error: validation.error.details.map((err) => err.message),
        });
    }
    next();
};

export { customerValidation };
