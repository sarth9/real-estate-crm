import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadPropertyImage } from "./property.upload.service";

export const uploadPropertyImageHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file;
    const image = await uploadPropertyImage(req.params.id, file as Express.Multer.File);

    res.status(201).json({
      success: true,
      message: "Property image uploaded successfully",
      data: image,
    });
  }
);