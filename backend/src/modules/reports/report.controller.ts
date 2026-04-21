import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  getAgentPerformanceReport,
  getDashboardReport,
  getLeadReport,
  getSalesReport,
} from "./report.service";

export const getDashboardReportHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const report = await getDashboardReport();

    res.status(200).json({
      success: true,
      message: "Dashboard report fetched successfully",
      data: report,
    });
  }
);

export const getLeadReportHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const report = await getLeadReport();

    res.status(200).json({
      success: true,
      message: "Lead report fetched successfully",
      data: report,
    });
  }
);

export const getSalesReportHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const report = await getSalesReport();

    res.status(200).json({
      success: true,
      message: "Sales report fetched successfully",
      data: report,
    });
  }
);

export const getAgentPerformanceReportHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const report = await getAgentPerformanceReport();

    res.status(200).json({
      success: true,
      message: "Agent performance report fetched successfully",
      data: report,
    });
  }
);