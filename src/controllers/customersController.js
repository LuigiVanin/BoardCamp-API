import db from "../database.js";

const createCustomers = async (req, res) => {
    const { name, phone, cpf, birthday } = req.body;
    try {
        console.log(req.body);
        const postCustomer = await db.query(
            `
        INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, to_date($4, 'DD-MM-YYYY'));
        `,
            [name, phone, cpf, birthday]
        );

        console.log(postCustomer);

        res.status(201).send({ message: "okay" });
    } catch (err) {
        console.log(err);
    }
};

export { createCustomers };
