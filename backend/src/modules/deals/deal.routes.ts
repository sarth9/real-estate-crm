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
import { upload } from "../../middlewares/upload.middleware";
import { uploadDealDocumentHandler } from "./deal.document.controller";

const router = Router();

router.use(protect);

router.post("/", createDealHandler);
router.get("/", getAllDealsHandler);
router.get("/:id", getDealByIdHandler);
router.patch("/:id", updateDealHandler);
router.patch("/:id/stage", updateDealStageHandler);
router.delete("/:id", deleteDealHandler);
router.post("/:id/documents", upload.single("document"), uploadDealDocumentHandler);

export default router;