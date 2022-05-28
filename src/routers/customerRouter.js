import { Router } from "express";
import { createCustomers } from "../controllers/customersController.js";
import { customerValidation } from "../middlewares/validation.js";

const customerRouter = Router();

customerRouter.post("/customers", customerValidation, createCustomers);

export default customerRouter;
