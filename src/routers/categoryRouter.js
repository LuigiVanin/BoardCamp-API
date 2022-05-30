import { Router } from "express";
import {
    createCategory,
    getCategoryList,
} from "../controllers/categoryController.js";
import { categoryValidation } from "../middlewares/validation.js";

const categoryRouter = Router();

categoryRouter.post("/categories", categoryValidation, createCategory);
categoryRouter.get("/categories", getCategoryList);

export default categoryRouter;
