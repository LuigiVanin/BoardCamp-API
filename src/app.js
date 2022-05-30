import express from "express";
import cors from "cors";
import customerRouter from "./routers/customerRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import gamesRouter from "./routers/gamesRouter.js";
import rentalsRouter from "./routers/rentalsRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(customerRouter);
app.use(categoryRouter);
app.use(gamesRouter);
app.use(rentalsRouter);

export default app;
