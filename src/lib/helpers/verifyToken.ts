import jwt from "jsonwebtoken";

//define type for JWT payload
export interface CustomJwtPayLoad extends jwt.JwtPayload {
  id: string;
  email?: string;
  username?: string;
}

export function verifyToken(token?: string): CustomJwtPayLoad | null {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.TOKEN_SECRET!) as CustomJwtPayLoad;
  } catch {
    return null;
  }
}
