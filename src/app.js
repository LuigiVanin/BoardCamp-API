import express from "express";
import cors from "cors";
import customerRouter from "./routers/customerRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(customerRouter);

export default app;
