import { Router } from "express";
import {
  createPropertyHandler,
  deletePropertyHandler,
  getAllPropertiesHandler,
  getPropertyByIdHandler,
  updatePropertyHandler,
} from "./property.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", createPropertyHandler);
router.get("/", getAllPropertiesHandler);
router.get("/:id", getPropertyByIdHandler);
router.patch("/:id", updatePropertyHandler);
router.delete("/:id", deletePropertyHandler);

export default router;