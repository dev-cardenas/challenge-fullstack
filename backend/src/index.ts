import 'dotenv/config';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { ensureTableExists } from "./utils/ensureTable";
import { verifyToken } from "./utils/verifyToken";
import { handleLogin } from "./handlers/login";
import { getSolicitudes, createSolicitud } from "./handlers/solicitudes";

// Configure DynamoDB client for local or AWS
const clientConfig: any = {};

if (process.env.USE_LOCAL_DYNAMODB === 'true') {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
  clientConfig.region = process.env.AWS_REGION || 'us-east-1';
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy'
  };
  console.log('🔧 Using LOCAL DynamoDB at', clientConfig.endpoint);
}

const client = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || "Solicitudes"; // Keep TABLE_NAME here as it's likely used by handlers

// Ensure table exists on cold start (only for local development)
if (process.env.USE_LOCAL_DYNAMODB === 'true') {
  ensureTableExists().catch(console.error);
}

// Common CORS headers
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

/**
 * Main Lambda handler - Routes requests to appropriate handlers
 */
export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event, null, 2));
  const method =
  event?.requestContext?.http?.method ||
  // @ts-expect-error
  event?.httpMethod ||
  null;

const path =
  event?.rawPath ||
  // @ts-expect-error
  event?.path ||
  null;

  console.log(`${method} ${path}`);

  // Handle OPTIONS preflight requests
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "OK" }),
    };
  }

  try {
    // Route: POST /login
    if (method === "POST" && path === "/login") {
      return await handleLogin(event);
    }

    // Route: GET /solicitudes (protected)
    if (method === "GET" && path === "/solicitudes") {
      const decoded = await verifyToken(event);
      if (!decoded) {
        return { 
          statusCode: 403, 
          headers, 
          body: JSON.stringify({ message: "Unauthorized" }) 
        };
      }
      return await getSolicitudes(docClient, headers);
    }

    // Route: POST /solicitudes (public)
    if (method === "POST" && path === "/solicitudes") {
      return await createSolicitud(event, docClient, headers);
    }

    // Fallback: 404 Not Found
    return { 
      statusCode: 404, 
      headers, 
      body: JSON.stringify({ message: "Not Found" }) 
    };
  } catch (error) {
    console.error("Error:", error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ message: "Internal Server Error" }) 
    };
  }
};
