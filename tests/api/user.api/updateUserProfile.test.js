/* eslint-disable no-undef */
const supertest = require('supertest');
const { app } = require('../../../server');

const request = supertest(app);

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImxvZ2luIjoicG9wb3ZtYWtzaW03NDE1QGdtYWlsLmNvbSIsInVzZXJBZ2VudCI6ImNyb21lIiwidXNlcklkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNTk1NTk5NzA3LCJleHAiOjE2MDg1NTk3MDd9.3oUUKPPFIbv0ZEzVNGAyf362z2Ben6U3A1mwB33oYVk';

describe('updateUserProfile', () => {
  it('successfull update', async (done) => {
    const response = await request
      .put('/api/updateProfile')
      .set('Authorization', token)
      .set('User-Agent', 'Crome')
      .send({
        firstName: 'Maksim',
      });
    expect(response.status).toBe(200);
    done();
  });

  it('bad request', async (done) => {
    const response = await request
      .put('/api/updateProfile')
      .set('Authorization', token)
      .set('User-Agent', 'Crome')
      .send({
        first: 'Maksim',
      });
    expect(response.status).toBe(400);
    done();
  });
});
