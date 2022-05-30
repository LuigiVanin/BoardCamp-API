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
        if (result.rowCount) {
            return res
                .status(409)
                .send({ details: "Nome de categoria já existente" });
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
        const gameName = await db.query(
            `
            SELECT * FROM games WHERE name = $1
        `,
            [req.body.name]
        );
        if (!result.rowCount) {
            return res.status(400).send({ details: "Categoria inválida" });
        }
        if (gameName.rowCount) {
            return res.status(409).send({ details: "Conflito de nome" });
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
            return res
                .status(400)
                .send({ details: "Todos os Jogos já foram alugados :(" });
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
