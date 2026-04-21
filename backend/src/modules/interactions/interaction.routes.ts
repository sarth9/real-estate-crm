import { Router } from "express";
import {
  createInteractionHandler,
  getAllInteractionsHandler,
} from "./interaction.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", createInteractionHandler);
router.get("/", getAllInteractionsHandler);

export default router;