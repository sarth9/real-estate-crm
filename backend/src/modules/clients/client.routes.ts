import { Router } from "express";
import {
  createClientHandler,
  deleteClientHandler,
  getAllClientsHandler,
  getClientByIdHandler,
  updateClientHandler,
} from "./client.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", createClientHandler);
router.get("/", getAllClientsHandler);
router.get("/:id", getClientByIdHandler);
router.patch("/:id", updateClientHandler);
router.delete("/:id", deleteClientHandler);

export default router;