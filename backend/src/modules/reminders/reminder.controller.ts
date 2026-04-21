import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getAllReminders } from "./reminder.service";

export const getAllRemindersHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const reminders = await getAllReminders();

    res.status(200).json({
      success: true,
      message: "Reminders fetched successfully",
      data: reminders,
    });
  }
);