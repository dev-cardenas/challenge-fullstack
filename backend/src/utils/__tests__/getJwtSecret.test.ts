import { mockClient } from "aws-sdk-client-mock";

describe('getJwtSecret', () => {
  const originalEnv = process.env;
  let secretsManagerMock: any;
  let getJwtSecret: any;
  let GetSecretValueCommand: any;

  beforeEach(() => {
    jest.resetModules(); // Clear cache
    process.env = { ...originalEnv };
    
    // Re-require AWS SDK and Mock to handle module reset
    const awsSdk = require("@aws-sdk/client-secrets-manager");
    const { SecretsManagerClient } = awsSdk;
    GetSecretValueCommand = awsSdk.GetSecretValueCommand;
    
    const { mockClient } = require("aws-sdk-client-mock");
    secretsManagerMock = mockClient(SecretsManagerClient);
    
    // Re-require module under test
    getJwtSecret = require('../getJwtSecret').getJwtSecret;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return secret from env var in local development', async () => {
    process.env.USE_LOCAL_DYNAMODB = 'true';
    process.env.JWT_SECRET = 'local-secret';

    const secret = await getJwtSecret();
    expect(secret).toBe('local-secret');
  });

  it('should return default secret in local dev if env var missing', async () => {
    process.env.USE_LOCAL_DYNAMODB = 'true';
    delete process.env.JWT_SECRET;

    const secret = await getJwtSecret();
    expect(secret).toBe('dev-secret');
  });

  it('should fetch secret from Secrets Manager in production', async () => {
    process.env.USE_LOCAL_DYNAMODB = 'false';
    process.env.JWT_SECRET_ARN = 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret';

    secretsManagerMock.on(GetSecretValueCommand).resolves({
      SecretString: 'prod-secret',
    });

    const secret = await getJwtSecret();
    expect(secret).toBe('prod-secret');
  });

  it('should throw error if JWT_SECRET_ARN is missing in production', async () => {
    process.env.USE_LOCAL_DYNAMODB = 'false';
    delete process.env.JWT_SECRET_ARN;

    await expect(getJwtSecret()).rejects.toThrow('JWT_SECRET_ARN environment variable not set');
  });
});
