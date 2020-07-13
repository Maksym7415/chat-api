const axios = require('axios');
const middleware = require('../../../src/api/middleware/auth');
jest.mock('axios');

describe('auth middleware ', () => {
  it('it returns invalid token erro', async done => {
    axios.get.mockImplementation(() => Promise.resolve({ data: {} }));
    await middlewares.authHandler(req, res, next);
    done();
  });
});