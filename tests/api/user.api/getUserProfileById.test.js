/* eslint-disable no-undef */
const supertest = require('supertest');
const { app } = require('../../../server');
const token = require('../../testToken');

const request = supertest(app);

describe(' check getUserProfileById data api', () => {
  it('successfully give user data profile with his roles', async (done) => {
    const response = await request
      .get('/api/getUserProfileById/2')
      .set('Authorization', token)
      .set('User-Agent', 'Crome');

    expect(response.status).toBe(200);
    expect(Object.keys(response.body)).toEqual([
      'id',
      'login',
      'firstName',
      'lastName',
      'tagName',
      'fullName',
      'userAvatar',
      'userLastTimeOnline',
      'Roles',
    ]);
    done();
  });
});
