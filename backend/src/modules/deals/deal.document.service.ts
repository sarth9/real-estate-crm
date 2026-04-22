import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/apiError";
import { uploadBufferToCloudinary } from "../../utils/uploadToCloudinary";

type DocumentCategory = "AGREEMENT" | "CONTRACT" | "ID_PROOF" | "OTHER";

export const uploadDealDocument = async (
  dealId: string,
  file: Express.Multer.File,
  category: DocumentCategory = "OTHER"
) => {
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
  });

  if (!deal) {
    throw new ApiError(404, "Deal not found");
  }

  if (!file) {
    throw new ApiError(400, "Document file is required");
  }

  const uploaded = await uploadBufferToCloudinary(
    file.buffer,
    "real-estate-crm/deals",
    "raw"
  );

  const document = await prisma.document.create({
    data: {
      dealId,
      fileName: file.originalname,
      fileUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      category,
    },
  });

  return document;
};