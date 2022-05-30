import db from "../database.js";

const getCustomerList = async (req, res) => {
    try {
        const cpf = !req.query.cpf ? "%" : `${req.query.cpf}%`;
        const customers = await db.query(
            `
            SELECT * FROM customers WHERE cpf LIKE $1
        `,
            [cpf]
        );
        res.status(200).send(customers.rows);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customers = await db.query(
            `
            SELECT * FROM customers WHERE id = $1
        `,
            [id]
        );
        if (!customers.rowCount) {
            return res.status(404).send({ details: "Cliente Inexistente" });
        }
        res.status(200).send(customers.rows);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createCustomers = async (req, res) => {
    const { name, phone, cpf, birthday } = req.body;
    try {
        const hasCpf = await db.query(
            `
            SELECT cpf FROM customers WHERE cpf = $1
        `,
            [cpf]
        );
        if (hasCpf.rowCount) {
            return res.status(409).send({ details: "Conflito de CPF" });
        }
        await db.query(
            `
        INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, to_date($4, 'YYYY-MM-DD'));
        `,
            [name, phone, cpf, birthday]
        );

        res.status(201).send({ message: "okay" });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const updateCustomer = async (req, res) => {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;
    try {
        const customers = await db.query(
            `
            SELECT * FROM customers WHERE id = $1
        `,
            [id]
        );
        if (!customers.rows.length) {
            return res.sendStatus(400);
        }
        await db.query(
            `
            UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=to_date($4, 'YYYY-MM-DD')
            WHERE id = $5
        `,
            [name, phone, cpf, birthday, id]
        );
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

export { createCustomers, getCustomerList, getCustomerById, updateCustomer };
