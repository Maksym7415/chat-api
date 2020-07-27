/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../../../server');

const request = supertest(app);
const { User, Role } = require('../../../models');

describe(' check getUserProfile data api', () => {
  it('successfully give user data profile with his roles', async (done) => {
    const user = await User.findOne({
      where: { id: 1 },
      include: {
        model: Role,
        through: {
          attributes: [],
        },
      },
    });
    const response = await request
      .get('/api/getUserProfileData/1')
      .send({
        user,
      });
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
      'Roles',
    ]);
    done();
  });

  it('returns error if user not found', async (done) => {
    const user = await User.findOne({
      where: { id: 0 },
      include: {
        model: Role,
        through: {
          attributes: [],
        },
      },
    });
    const response = await request
      .get('/api/getUserProfileData/0')
      .send({
        user,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({"code": 405, "message": "User not found"});
    done();
  });
});
