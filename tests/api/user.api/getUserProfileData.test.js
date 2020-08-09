/* eslint-disable no-undef */
const supertest = require('supertest');
const { app } = require('../../../server');

const request = supertest(app);

describe(' check getUserProfile data api', () => {
  it('successfully give user data profile with his roles', async (done) => {
    const response = await request
      .get('/api/getUserProfileData/1');
    expect(response.status).toBe(200);
    expect(Object.keys(response.body)).toEqual([
      'id',
      'login',
      'firstName',
      'lastName',
      'tagName',
      'fullName',
      'status',
      'verificationCode',
      'userCreationTime',
      'userUpdateTime',
      'userLastTimeOnline',
      'Roles',
    ]);
    done();
  });

  it('returns error if user not found', async (done) => {
    const response = await request
      .get('/api/getUserProfileData/0');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ code: 405, message: 'User not found' });
    done();
  });
});
