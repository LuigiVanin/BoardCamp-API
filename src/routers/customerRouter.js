import { Router } from "express";
import {
    createCustomers,
    getCustomerById,
    getCustomerList,
    updateCustomer,
} from "../controllers/customersController.js";
import { customerValidation } from "../middlewares/validation.js";

const customerRouter = Router();

customerRouter.post("/customers", customerValidation, createCustomers);
customerRouter.get("/customers", getCustomerList);
customerRouter.get("/customers/:id", getCustomerById);
customerRouter.put("/customers/:id", customerValidation, updateCustomer);

export default customerRouter;
