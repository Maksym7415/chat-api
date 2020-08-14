/* eslint-disable no-undef */
/* eslint-disable max-len */
const supertest = require('supertest');
const { app } = require('../../../server');

const request = supertest(app);

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImxvZ2luIjoicG9wb3ZtYWtzaW03NDE1QGdtYWlsLmNvbSIsInVzZXJBZ2VudCI6ImNyb21lIiwidXNlcklkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNTk1NTk5NzA3LCJleHAiOjE2MDg1NTk3MDd9.3oUUKPPFIbv0ZEzVNGAyf362z2Ben6U3A1mwB33oYVk';

describe('checkout of "ConversationHistory" API', () => {
  it('Get conversation history successfully', async (done) => {
    const response = await request
      .get('/api/conversationHistory/1')
      //.get('/api/conversationHistory/1?offset=15')
      .set('Authorization', token)
      .set('User-Agent', 'Crome');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
    expect(response.body.data).toEqual(expect.any(Array));
    expect(response.body.pagination).toHaveProperty('allItems');
    expect(response.body.pagination).toHaveProperty('currentPage');
    expect(response.body.pagination.allItems).toEqual(expect.any(Number));
    expect(response.body.pagination.currentPage).toEqual(expect.any(Number));
    done();
  });

  it('Conversation does not exists', async (done) => {
    const response = await request
      .get('/api/conversationHistory/0')
      .set('Authorization', token)
      .set('User-Agent', 'Crome');
    expect(response.status).toBe(400);
    expect(response.body.code).toBe(405);
    expect(response.body.message).toEqual(expect.any(String));
    done();
  });

  it('User has not access to this conversation', async (done) => {
    const response = await request
      .get('/api/conversationHistory/3')
      .set('Authorization', token)
      .set('User-Agent', 'Crome');
    expect(response.status).toBe(403);
    expect(response.body.code).toBe(403);
    expect(response.body.message).toEqual(expect.any(String));
    done();
  });
});
