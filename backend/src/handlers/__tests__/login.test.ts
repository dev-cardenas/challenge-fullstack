import { handleLogin } from '../login';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

// Mock getJwtSecret
jest.mock('../../utils/getJwtSecret', () => ({
  getJwtSecret: jest.fn().mockResolvedValue('test-secret'),
}));

describe('handleLogin', () => {
  const mockEvent = (body: any) => ({
    body: JSON.stringify(body),
  } as APIGatewayProxyEventV2);

  it('should return 400 if body is missing', async () => {
    const event = {} as APIGatewayProxyEventV2;
    const result = await handleLogin(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ message: 'Missing body' });
  });

  it('should return 401 if credentials are invalid', async () => {
    const event = mockEvent({ username: 'wrong', password: 'wrong' });
    const result = await handleLogin(event);
    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body)).toEqual({ message: 'Invalid credentials' });
  });

  it('should return 200 and token if credentials are correct', async () => {
    const event = mockEvent({ username: 'admin', password: 'admin123' });
    const result = await handleLogin(event);
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('token');
  });
});
