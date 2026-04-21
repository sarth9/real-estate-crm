import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { ApiError } from "../../utils/apiError";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  const result = await registerUser(validatedData);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);

  const result = await loginUser(validatedData);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const me = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await getCurrentUser(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: user,
    });
  }
);