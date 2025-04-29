import cloudinary from "@/lib/cloudinary";

function extractPublicId(url: string): string | null {
  const regex = /\/v\d+\/(.*)\.(jpg|jpeg|png|webp|gif)$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function deleteImageFromCloudinary(imageUrl: string) {
  const publicId = extractPublicId(imageUrl);
  if (!publicId) {
    throw new Error("Could not extract public_id from imageUrl");
  }

  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== "ok") {
    throw new Error(`Failed to delete image: ${result.result}`);
  }

  return result;
}
