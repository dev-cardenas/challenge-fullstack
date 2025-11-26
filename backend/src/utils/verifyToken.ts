import { APIGatewayProxyEventV2 } from "aws-lambda";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "./getJwtSecret";

/**
 * Verifies JWT token from Authorization header
 * @returns Decoded token payload or null if invalid
 */
export async function verifyToken(event: APIGatewayProxyEventV2): Promise<any | null> {
  const authHeader = event.headers["Authorization"] || event.headers["authorization"];
  
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
  
  try {
    const jwtSecret = await getJwtSecret();
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
