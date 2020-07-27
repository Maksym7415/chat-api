/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../../../server');
const middleware = require('../../../src/api/middleware/auth');

const request = supertest(app);

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImxvZ2luIjoicG9wb3ZtYWtzaW03NDE1QGdtYWlsLmNvbSIsInVzZXJBZ2VudCI6ImNyb21lIiwidXNlcklkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNTk1NTk5NzA3LCJleHAiOjE2MDg1NTk3MDd9.3oUUKPPFIbv0ZEzVNGAyf362z2Ben6U3A1mwB33oYVk';
const invalidToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImxvZ2luIjoicG9wb3ZtYWtzaW03NDE1QGdtYWlsLmNvbSIsInVzZXJBZ2VudCI6ImNyb21lIiwidXNlcklkIjowLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNTk1ODU0NTg1LCJleHAiOjE2MDg4MTQ1ODV9.0LtFmKaMsieN5Iyw2a03mDuk4KEZpJTWWRCIvctF5eA';

describe(' check getUserConversation data api', () => {
  it('successfully give user list of conversations with last messages', async (done) => {
    const response = await request
      .get('/api/getUserConversations')
      .set('Authorization', token)
      .set('User-Agent', 'Crome');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('length');
    expect(Object.keys(response.body[0])).toEqual([
      'messageId',
      'fkSenderId',
      'message',
      'messageType',
      'sendDate',
      'conversationId',
      'conversationType',
      'conversationCreationDate',
    ]);
    done();
  });

  it('returns error if header  is not correct', async (done) => {
    const response = await request
      .get('/api/getUserConversations')
      .set('Authorizatin', `${token}`)
      .set('User-Agent', 'Crome');

    expect(response.header).not.toHaveProperty('Authorization');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('header is not correct');

    done();
  });

  it('returns error if header  token is not correct', async (done) => {
    const response = await request
      .get('/api/getUserConversations')
      .set('Authorization', `${invalidToken}`)
      .set('User-Agent', 'Crome');

    expect(response.header).not.toHaveProperty('Authorization');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid token!');

    done();
  });
});
