import cloudinary from "../config/cloudinary";

export const uploadBufferToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  resourceType: "image" | "raw" = "image"
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(fileBuffer);
  });
};