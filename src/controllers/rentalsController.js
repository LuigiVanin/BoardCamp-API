import db from "../database.js";

const createRentals = async (req, res) => {
    const { customerId, gameId, daysRented } = req.body;
    const { pricePerDay } = res.locals;
    try {
        await db.query(
            `
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented","returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, now(), $3, null, $4, null)
        `,
            [customerId, gameId, daysRented, pricePerDay * daysRented]
        );
        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const rentalsList = async (req, res) => {
    try {
        let rentals = await db.query(`
        SELECT rentals.*,
               customers.name as "customerName", 
               games.name as "gameName", 
               categories.name as "categoryName",
               categories.id as "categoryId"
        FROM rentals
        JOIN customers ON customers.id = rentals."customerId"
        JOIN games ON games.id = rentals."gameId"
        JOIN categories ON categories.id = games."categoryId"
        `);
        rentals.rows = rentals.rows.map((item) => {
            let result = {
                ...item,
                customer: {
                    id: item.categoryId,
                    name: item.customerName,
                },
                game: {
                    id: item.gameId,
                    name: item.gameName,
                    categoryId: item.categoryId,
                    categoryName: item.categoryName,
                },
            };
            delete result.customerName;
            delete result.gameName;
            delete result.categoryId;
            delete result.categoryName;
            return result;
        });
        return res.status(200).send(rentals.rows);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const returnRentals = async (req, res) => {
    const { id } = req.params;
    const today = new Date();
    try {
        let rental = await db.query(
            `
            SELECT rentals.*, games."pricePerDay" FROM rentals
            JOIN games ON games.id = rentals."gameId"
            WHERE rentals.id = $1
        `,
            [id]
        );

        if (!rental.rowCount) {
            return res.status(404).send({ details: "Aluguel Inexistente" });
        }
        rental = rental.rows[0];
        if (rental.returnDate != null) {
            return res.status(400).send({ details: "Aluguel já finalizado" });
        }
        let dayDiff = today - rental.rentDate;
        dayDiff = Math.floor(dayDiff / (1000 * 60 * 60 * 24));
        const delayFee =
            dayDiff - rental.daysRented < 0 ? 0 : dayDiff * rental.pricePerDay;
        await db.query(
            `
            UPDATE rentals SET "returnDate"=now(), "delayFee"=$2
            WHERE id = $1
        `,
            [id, delayFee]
        );
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const deleteRentals = async (req, res) => {
    const { id } = req.params;
    try {
        const hasRental = await db.query(
            `
        SELECT * FROM rentals WHERE id = $1
        `,
            [id]
        );
        if (!hasRental.rowCount) {
            return res.status(404).send({ details: "Aluguel Inexistente" });
        }
        console.log(hasRental.rows[0].returnDate);
        if (hasRental.rows[0].returnDate != null) {
            return res.status(400).send({ details: "Aluguel já finalizado" });
        }
        await db.query(
            `
        DELETE FROM rentals WHERE id = $1
        `,
            [id]
        );
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

export { createRentals, rentalsList, deleteRentals, returnRentals };
