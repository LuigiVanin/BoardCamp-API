import chalk from "chalk";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(
        chalk.bold.blue("\n---\n") +
            chalk.bold.blue("Server is up at port: ") +
            chalk.bold.blue(PORT)
    );
});
