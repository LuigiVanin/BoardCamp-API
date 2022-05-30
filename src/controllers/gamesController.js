import db from "../database.js";

const createGame = async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    try {
        await db.query(
            `
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)
        `,
            [name, image, stockTotal, categoryId, pricePerDay]
        );
        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getGamesList = async (req, res) => {
    try {
        const result = await db.query(`
        SELECT games.*, categories.name as "categoryName" FROM games
        JOIN categories ON categories.id = games."categoryId"
        `);
        return res.status(200).send(result.rows);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

export { createGame, getGamesList };
