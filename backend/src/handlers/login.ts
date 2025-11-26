import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../utils/getJwtSecret";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

/**
 * POST /login - Authenticate user and return JWT token
 */
export async function handleLogin(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };

  if (!event.body) {
    return { 
      statusCode: 400, 
      headers, 
      body: JSON.stringify({ message: "Missing body" }) 
    };
  }

  const { username, password } = JSON.parse(event.body);

  // Validate credentials
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { 
      statusCode: 401, 
      headers, 
      body: JSON.stringify({ message: "Invalid credentials" }) 
    };
  }

  // Generate JWT token
  const jwtSecret = await getJwtSecret();
  const token = jwt.sign({ sub: "admin" }, jwtSecret, { expiresIn: "1h" });

  return { 
    statusCode: 200, 
    headers, 
    body: JSON.stringify({ token }) 
  };
}
