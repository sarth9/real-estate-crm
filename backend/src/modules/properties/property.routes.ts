import { Router } from "express";
import {
  createPropertyHandler,
  deletePropertyHandler,
  getAllPropertiesHandler,
  getPropertyByIdHandler,
  updatePropertyHandler,
} from "./property.controller";
import { protect } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { uploadPropertyImageHandler } from "./property.upload.controller";

const router = Router();

router.use(protect);

router.post("/", createPropertyHandler);
router.get("/", getAllPropertiesHandler);
router.get("/:id", getPropertyByIdHandler);
router.patch("/:id", updatePropertyHandler);
router.delete("/:id", deletePropertyHandler);
router.post("/:id/images", upload.single("image"), uploadPropertyImageHandler);

export default router;