const supertest = require('supertest');
const app = require('../../../server');
const request = supertest(app)

describe('userController signIn api', () => {
  it('it gets successfull login verification', async done => {
    const response = await request
      .post('/api/signIn')
      .send({
        login: 'popovmaksim7415@gmail.com'
      });
  
    expect(response.status).toBe(200);
    expect(response.body).toBe('send you your verification code');
    done();
  });

  it('it return error by sending email', async done => {
    const response = await request
      .post('/api/signIn')
      .send({
        login: 'popovmaksim7@gmail.com'
      });
  
    expect(response.status).toBe(400);
    expect(response.body).toEqual({});
    done();
  });

  it('it returns server error', async done => {
    const response = await request
      .post('/api/signIn')
      .send({
      });
  
    expect(response.status).toBe(501);
    expect(response.body).toEqual({});
    done();
  });
});