import { verifyToken } from '../verifyToken';
import jwt from 'jsonwebtoken';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

// Mock getJwtSecret
jest.mock('../getJwtSecret', () => ({
  getJwtSecret: jest.fn().mockResolvedValue('test-secret'),
}));

describe('verifyToken', () => {
  it('should return null if no authorization header', async () => {
    const event = { headers: {} } as unknown as APIGatewayProxyEventV2;
    const result = await verifyToken(event);
    expect(result).toBeNull();
  });

  it('should return null if token is invalid', async () => {
    const event = {
      headers: { authorization: 'Bearer invalid-token' },
    } as unknown as APIGatewayProxyEventV2;

    const result = await verifyToken(event);
    expect(result).toBeNull();
  });

  it('should return decoded payload if token is valid', async () => {
    const token = jwt.sign({ sub: 'user123' }, 'test-secret');
    const event = {
      headers: { authorization: `Bearer ${token}` },
    } as unknown as APIGatewayProxyEventV2;

    const result = await verifyToken(event);
    expect(result).toMatchObject({ sub: 'user123' });
  });
});
