import { Router } from "express";
import {
  assignLeadHandler,
  createLeadHandler,
  deleteLeadHandler,
  getAllLeadsHandler,
  getLeadByIdHandler,
  updateLeadHandler,
  updateLeadStatusHandler,
} from "./lead.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", createLeadHandler);
router.get("/", getAllLeadsHandler);
router.get("/:id", getLeadByIdHandler);
router.patch("/:id", updateLeadHandler);
router.patch("/:id/status", updateLeadStatusHandler);
router.patch("/:id/assign", assignLeadHandler);
router.delete("/:id", deleteLeadHandler);

export default router;