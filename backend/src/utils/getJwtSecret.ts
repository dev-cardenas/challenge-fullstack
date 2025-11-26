import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secretsClient = new SecretsManagerClient({});

let cachedJwtSecret: string | null = null;

/**
 * Gets JWT secret from AWS Secrets Manager (cached after first call)
 */
export async function getJwtSecret(): Promise<string> {
  // Return cached value if available
  if (cachedJwtSecret) {
    return cachedJwtSecret;
  }

  // For local development, use environment variable
  if (process.env.USE_LOCAL_DYNAMODB === 'true') {
    cachedJwtSecret = process.env.JWT_SECRET || 'dev-secret';
    return cachedJwtSecret;
  }

  // For production, fetch from Secrets Manager
  const secretArn = process.env.JWT_SECRET_ARN;
  
  if (!secretArn) {
    throw new Error('JWT_SECRET_ARN environment variable not set');
  }

  try {
    const command = new GetSecretValueCommand({
      SecretId: secretArn,
    });

    const response = await secretsClient.send(command);
    
    if (!response.SecretString) {
      throw new Error('Secret value is empty');
    }

    cachedJwtSecret = response.SecretString;
    // console.log('✅ JWT secret loaded from Secrets Manager');
    
    return cachedJwtSecret;
  } catch (error) {
    console.error('Error fetching JWT secret from Secrets Manager:', error);
    throw error;
  }
}
