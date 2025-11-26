import { getSolicitudes, createSolicitud } from '../solicitudes';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

// Mock uuid to avoid ESM issues
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Solicitudes Handlers', () => {
  const headers = { 'Content-Type': 'application/json' };

  beforeEach(() => {
    ddbMock.reset();
  });

  describe('getSolicitudes', () => {
    it('should return list of solicitudes', async () => {
      const mockItems = [{ id: '1', name: 'Test' }];
      ddbMock.on(ScanCommand).resolves({ Items: mockItems });

      const result = await getSolicitudes(ddbMock as any, headers);
      
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual(mockItems);
    });
  });

  describe('createSolicitud', () => {
    it('should return 400 if body is missing', async () => {
      const event = {} as APIGatewayProxyEventV2;
      const result = await createSolicitud(event, ddbMock as any, headers);
      
      expect(result.statusCode).toBe(400);
    });

    it('should create solicitud and return 201', async () => {
      const body = {
        name: 'Test User',
        email: 'test@example.com',
        amount: 100,
        type: 'Equipment',
        comments: 'Test comment'
      };
      
      const event = {
        body: JSON.stringify(body)
      } as APIGatewayProxyEventV2;

      ddbMock.on(PutCommand).resolves({});

      const result = await createSolicitud(event, ddbMock as any, headers);
      
      expect(result.statusCode).toBe(201);
      const responseBody = JSON.parse(result.body);
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.message).toBe('Solicitud creada');
    });
  });
});
