import db from "../database.js";

const createCategory = (req, res) => {
    const { name } = req.body;
    try {
        db.query(
            `
        INSERT INTO categories (name) 
        VALUES ($1)
        `,
            [name]
        );
        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getCategoryList = async (req, res) => {
    try {
        const categoriesList = await db.query(`
        SELECT * FROM categories
        `);
        return res.status(200).send(categoriesList.rows);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

export { createCategory, getCategoryList };
