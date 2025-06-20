import { connect } from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

connect();

type CloudinaryUploadResult = {
  secure_url: string;
  // Poți adăuga alte câmpuri dacă e nevoie
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("profileImage") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "profile_images" }, (error, result) => {
            if (error) return reject(error);
            resolve(result as CloudinaryUploadResult);
          })
          .end(buffer);
      }
    );

    return NextResponse.json({ imageUrl: uploadResult.secure_url });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
