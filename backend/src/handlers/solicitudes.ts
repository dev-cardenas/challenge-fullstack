import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = process.env.TABLE_NAME || "Solicitudes";

/**
 * GET /solicitudes - List all solicitudes
 */
export async function getSolicitudes(
  docClient: DynamoDBDocumentClient,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const command = new ScanCommand({ TableName: TABLE_NAME });
  const response = await docClient.send(command);
  
  return { 
    statusCode: 200, 
    headers, 
    body: JSON.stringify(response.Items) 
  };
}

/**
 * POST /solicitudes - Create a new solicitud
 */
export async function createSolicitud(
  event: APIGatewayProxyEventV2,
  docClient: DynamoDBDocumentClient,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return { 
      statusCode: 400, 
      headers, 
      body: JSON.stringify({ message: "Missing body" }) 
    };
  }

  const body = JSON.parse(event.body);
  const id = uuidv4();
  const timestamp = new Date().toISOString();

  const item = {
    id,
    name: body.name,
    email: body.email,
    amount: body.amount,
    type: body.type,
    comments: body.comments,
    createdAt: timestamp,
  };

  const command = new PutCommand({ TableName: TABLE_NAME, Item: item });
  await docClient.send(command);

  return { 
    statusCode: 201, 
    headers, 
    body: JSON.stringify({ message: "Solicitud creada", id }) 
  };
}
