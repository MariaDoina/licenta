import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const encodedToken = request.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(
      encodedToken,
      process.env.TOKEN_SECRET!
    ) as JwtPayload;

    if (!decodedToken.id) {
      throw new Error("Token does not contain valid user idc");
    }

    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
