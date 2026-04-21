import { Router } from "express";
import { getAllRemindersHandler } from "./reminder.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getAllRemindersHandler);

export default router;