/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../../../server');

const request = supertest(app);
const models = require('../../../models');

describe('userController checkCode api', () => {
  it('it gets successfull login', async (done) => {
    const user = await models.User.findOne({ where: { login: 'popovmaksim7415@gmail.com' } });
    const response = await request
      .post('/api/checkVerificationCode')
      .send({
        verificationCode: user.dataValues.verificationCode,
        login: 'popovmaksim7415@gmail.com',
      });
    expect(response.status).toBe(200);
    expect(Object.keys(response.body)).toEqual(['accessToken', 'refreshToken']);
    done();
  });

  it('it returns error', async (done) => {
    const response = await request
      .post('/api/checkVerificationCode')
      .send({
        verificationCode: '1245',
        login: 'example@mail.co',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('there is no such user in the system');
    done();
  });

  it('it returns sesrver error', async (done) => {
    const response = await request
      .post('/api/checkVerificationCode')
      .send({
        verificaonCode: '1245',
      });

    expect(response.status).toBe(501);
    expect(response.body).toEqual({});
    done();
  });
});
