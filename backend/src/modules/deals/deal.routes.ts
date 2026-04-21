import { Router } from "express";
import {
  createDealHandler,
  deleteDealHandler,
  getAllDealsHandler,
  getDealByIdHandler,
  updateDealHandler,
  updateDealStageHandler,
} from "./deal.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", createDealHandler);
router.get("/", getAllDealsHandler);
router.get("/:id", getDealByIdHandler);
router.patch("/:id", updateDealHandler);
router.patch("/:id/stage", updateDealStageHandler);
router.delete("/:id", deleteDealHandler);

export default router;