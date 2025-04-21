import { connect } from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

connect();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "recipeImages" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(buffer);
    });
    return NextResponse.json({ imageUrl: (uploadResult as any).secure_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
