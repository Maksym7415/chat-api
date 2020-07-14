const supertest = require('supertest');
const app = require('../../../server');
const request = supertest(app);
const models = require('../../../models');

describe('userController signUp api', () => {
  it('it gets successfull registration', async done => {
    const response = await request
      .post('/api/signUp')
      .send({
        firstName: 'Maks',
        lastName: 'Popov',
        login: 'maks@gmail.com',
        status: 'free'
      });

    await models.User.destroy({ where: { login: 'maks@gmail.com' } });
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({email: 'maks@gmail.com'});
    done();
  });

  it('it return error by sending email', async done => {
    const response = await request
      .post('/api/signUp')
      .send({
        login: 'popovmaksim7415@gmail.com'
      });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('such login already used in the system');
    done();
  });

  it('it returns server error', async done => {
    const response = await request
      .post('/api/signUp')
      .send({
      });
  
    expect(response.status).toBe(501);
    expect(response.body).toEqual({});
    done();
  });
})