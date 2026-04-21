import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getAllUsers } from "./user.service";

export const getAllUsersHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  }
);