import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadDealDocument } from "./deal.document.service";

export const uploadDealDocumentHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file;
    const category =
      (req.body.category as "AGREEMENT" | "CONTRACT" | "ID_PROOF" | "OTHER") ||
      "OTHER";

    const document = await uploadDealDocument(
      req.params.id,
      file as Express.Multer.File,
      category
    );

    res.status(201).json({
      success: true,
      message: "Deal document uploaded successfully",
      data: document,
    });
  }
);