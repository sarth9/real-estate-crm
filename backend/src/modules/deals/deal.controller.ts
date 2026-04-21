import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createDeal,
  deleteDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  updateDealStage,
} from "./deal.service";
import {
  createDealSchema,
  updateDealSchema,
  updateDealStageSchema,
} from "./deal.validation";

export const createDealHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = createDealSchema.parse(req.body);
    const deal = await createDeal(validatedData);

    res.status(201).json({
      success: true,
      message: "Deal created successfully",
      data: deal,
    });
  }
);

export const getAllDealsHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const deals = await getAllDeals();

    res.status(200).json({
      success: true,
      message: "Deals fetched successfully",
      data: deals,
    });
  }
);

export const getDealByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const deal = await getDealById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deal fetched successfully",
      data: deal,
    });
  }
);

export const updateDealHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = updateDealSchema.parse(req.body);
    const deal = await updateDeal(req.params.id, validatedData);

    res.status(200).json({
      success: true,
      message: "Deal updated successfully",
      data: deal,
    });
  }
);

export const updateDealStageHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = updateDealStageSchema.parse(req.body);
    const deal = await updateDealStage(req.params.id, validatedData.stage);

    res.status(200).json({
      success: true,
      message: "Deal stage updated successfully",
      data: deal,
    });
  }
);

export const deleteDealHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await deleteDeal(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);