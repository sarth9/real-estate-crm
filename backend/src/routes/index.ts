import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import leadRoutes from "../modules/leads/lead.routes";
import propertyRoutes from "../modules/properties/property.routes";
import clientRoutes from "../modules/clients/client.routes";
import interactionRoutes from "../modules/interactions/interaction.routes";
import dealRoutes from "../modules/deals/deal.routes";
import reportRoutes from "../modules/reports/report.routes";
import userRoutes from "../modules/users/user.routes";
import reminderRoutes from "../modules/reminders/reminder.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/leads", leadRoutes);
router.use("/properties", propertyRoutes);
router.use("/clients", clientRoutes);
router.use("/interactions", interactionRoutes);
router.use("/deals", dealRoutes);
router.use("/reports", reportRoutes);
router.use("/users", userRoutes);
router.use("/reminders", reminderRoutes);

export default router;