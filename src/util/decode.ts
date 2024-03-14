import jwt from "jsonwebtoken";
export const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
