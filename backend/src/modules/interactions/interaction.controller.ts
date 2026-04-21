import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { createInteraction, getAllInteractions } from "./interaction.service";
import { createInteractionSchema } from "./interaction.validation";

export const createInteractionHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const validatedData = createInteractionSchema.parse(req.body);
    const interaction = await createInteraction(validatedData, req.user.userId);

    res.status(201).json({
      success: true,
      message: "Interaction created successfully",
      data: interaction,
    });
  }
);

export const getAllInteractionsHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const interactions = await getAllInteractions();

    res.status(200).json({
      success: true,
      message: "Interactions fetched successfully",
      data: interactions,
    });
  }
);