import db from "../database.js";
import {
    categorySchema,
    customerSchemas,
    gamesSchema,
    rentalsSchemas,
} from "../helpers/schemas.js";

const customerValidation = (req, res, next) => {
    const validation = customerSchemas.validate(req.body, {
        abortEarly: false,
    });
    if (validation.error) {
        return res.status(400).send({
            error: validation.error.details.map((err) => err.message),
        });
    }
    next();
};

const categoryValidation = async (req, res, next) => {
    const validation = categorySchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        return res.status(400).send({
            error: validation.error.details.map((err) => err.message),
        });
    }
    try {
        const result = await db.query(
            `
        SELECT * FROM categories WHERE name = $1
    `,
            [req.body.name]
        );
        console.log(result);
        if (result.rowCount) {
            return res.sendStatus(409);
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
    next();
};

const gamesValidation = async (req, res, next) => {
    const validation = gamesSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        return res.status(400).send({
            error: validation.error.details.map((err) => err.message),
        });
    }
    try {
        const result = await db.query(
            `
            SELECT * FROM categories WHERE id = $1
        `,
            [req.body.categoryId]
        );
        if (!result.rowCount) {
            return res.sendStatus(400);
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
    next();
};

const rentalsValidation = async (req, res, next) => {
    const validation = rentalsSchemas.validate(req.body, { abortEarly: false });
    if (validation.error) {
        return res.status(400).send({
            error: validation.error.details.map((err) => err.message),
        });
    }
    try {
        const hasGame = await db.query(`SELECT * FROM games WHERE id = $1`, [
            req.body.gameId,
        ]);
        const hasCustomer = await db.query(
            `SELECT * FROM customers WHERE id = $1`,
            [req.body.customerId]
        );

        if (!hasCustomer.rowCount || !hasGame.rowCount) {
            return res.sendStatus(400);
        }

        const rentals = await db.query(
            `
        SELECT * FROM rentals WHERE "gameId"=$1 and "returnDate" is null
        `,
            [req.body.gameId]
        );

        if (rentals.rowCount >= hasGame.rows[0].stockTotal) {
            return res.sendStatus(400);
        }
        res.locals.pricePerDay = hasGame.rows[0].pricePerDay;
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
    next();
};

export {
    customerValidation,
    categoryValidation,
    gamesValidation,
    rentalsValidation,
};
