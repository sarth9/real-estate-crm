import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/apiError";
import { uploadBufferToCloudinary } from "../../utils/uploadToCloudinary";

export const uploadPropertyImage = async (
  propertyId: string,
  file: Express.Multer.File
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  if (!file) {
    throw new ApiError(400, "Image file is required");
  }

  const uploaded = await uploadBufferToCloudinary(
    file.buffer,
    "real-estate-crm/properties",
    "image"
  );

  const image = await prisma.propertyImage.create({
    data: {
      propertyId,
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
    },
  });

  return image;
};