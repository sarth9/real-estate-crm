import { Router } from "express";
import { getAllUsersHandler } from "./user.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getAllUsersHandler);

export default router;