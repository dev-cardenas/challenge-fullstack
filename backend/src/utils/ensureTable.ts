import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";

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
const TABLE_NAME = process.env.TABLE_NAME || "Requests";

/**
 * Ensures the DynamoDB table exists, creates it if it doesn't
 */
export async function ensureTableExists(): Promise<void> {
  try {
    // Try to describe the table (check if it exists)
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    // console.log(`✅ Table "${TABLE_NAME}" already exists`);
  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
    //   console.log(`📦 Creating table "${TABLE_NAME}"...`);
      
      // Create the table
      await client.send(new CreateTableCommand({
        TableName: TABLE_NAME,
        KeySchema: [
          { AttributeName: 'id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
      }));
      
    //   console.log(`✅ Table "${TABLE_NAME}" created successfully!`);
    } else {
    //   console.error('Error checking/creating table:', error);
      throw error;
    }
  }
}
