import { Router } from "express";
import {
    createRentals,
    deleteRentals,
    rentalsList,
    returnRentals,
} from "../controllers/rentalsController.js";
import { rentalsValidation } from "../middlewares/validation.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", rentalsValidation, createRentals);
rentalsRouter.get("/rentals", rentalsList);
rentalsRouter.delete("/rentals/:id", deleteRentals);
rentalsRouter.post("/rentals/:id/return", returnRentals);

export default rentalsRouter;
