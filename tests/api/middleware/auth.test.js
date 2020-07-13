const middleware = require('../../../src/api/middleware/auth');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImxvZ2luIjoicG9wb3ZtYWtzaW03NDE1QGdtYWlsLmNvbSIsInVzZXJBZ2VudCI6ImNyb21lIiwidXNlcklkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNTk0NjQzNDg5LCJleHAiOjE2MDc2MDM0ODl9.GxiTXjM-m9gY4EJmObxW1JSqcMONCAO41f-86Osb07w'

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (authHeader, authUserAgent, data) => ({
  get(name) {
    if (name === 'Authorization') return authHeader
    if (name === 'User-Agent') return authUserAgent
    return null
  },
  token: data
});

describe('checkAuth', () => {

  test('should set token.data if token is valid', async () => {
    const req = mockRequest(token, 'agent', token);
    const res = mockResponse();
    await middleware(req, res, () => {});
    expect(req.token).toEqual(token);
  });

  test('should return 400 when header is not setted', async () => {
    const req = mockRequest(null, 'agent');
    const res = mockResponse();
    await middleware(req, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should return 400 by adding invalid token', async () => {
    const req = mockRequest('12345', 'agent');
    const res = mockResponse();
    await middleware(req, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
  });
});