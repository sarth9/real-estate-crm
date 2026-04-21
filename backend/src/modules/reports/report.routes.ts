import { Router } from "express";
import {
  getAgentPerformanceReportHandler,
  getDashboardReportHandler,
  getLeadReportHandler,
  getSalesReportHandler,
} from "./report.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/dashboard", getDashboardReportHandler);
router.get("/leads", getLeadReportHandler);
router.get("/sales", getSalesReportHandler);
router.get("/agents", getAgentPerformanceReportHandler);

export default router;