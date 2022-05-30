import { createGame, getGamesList } from "../controllers/gamesController.js";
import { Router } from "express";
import { gamesValidation } from "../middlewares/validation.js";

const gamesRouter = Router();

gamesRouter.post("/games", gamesValidation, createGame);
gamesRouter.get("/games", getGamesList);

export default gamesRouter;
