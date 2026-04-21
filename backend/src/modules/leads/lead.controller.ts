import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import {
  assignLeadToAgent,
  createLead,
  deleteLead,
  getAllLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
} from "./lead.service";
import {
  assignLeadSchema,
  createLeadSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
} from "./lead.validation";

export const createLeadHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const validatedData = createLeadSchema.parse(req.body);
    const lead = await createLead(validatedData, req.user.userId);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  }
);

export const getAllLeadsHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const leads = await getAllLeads();

    res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: leads,
    });
  }
);

export const getLeadByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const lead = await getLeadById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lead fetched successfully",
      data: lead,
    });
  }
);

export const updateLeadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = updateLeadSchema.parse(req.body);
    const lead = await updateLead(req.params.id, validatedData);

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  }
);

export const updateLeadStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = updateLeadStatusSchema.parse(req.body);
    const lead = await updateLeadStatus(req.params.id, validatedData.status);

    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: lead,
    });
  }
);

export const assignLeadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = assignLeadSchema.parse(req.body);
    const lead = await assignLeadToAgent(
      req.params.id,
      validatedData.assignedAgentId
    );

    res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      data: lead,
    });
  }
);

export const deleteLeadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await deleteLead(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);