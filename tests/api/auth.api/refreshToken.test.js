/* eslint-disable no-undef */
const supertest = require('supertest');
const { app } = require('../../../server');
const models = require('../../../models');

const request = supertest(app);

describe('check refreshToken api', () => {
  it('success tokens generation', async (done) => {
    const responce = await request
      .post('/api/refreshToken')
      .send({
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InBvcG92bWFrc2ltNzQxNUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsInVzZXJBZ2VudCI6ImNyb21lIiwidXNlcklkIjoxLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTU5NDcxNzg4MywiZXhwIjoxNjIwNjM3ODgzfQ.pjpu-5Ox3VFhFC1FEa0udPrjOn6z68SiShx_fx2NY8E',
      });
    expect(responce.status).toBe(200);
    expect(typeof responce.body).toBe('object');
    expect(Object.keys(responce.body).length).toBe(2);
    done();
  });

  it('get error message if token life time is over', async (done) => {
    const responce = await request
      .post('/api/refreshToken')
      .send({
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InBvcG92bWFrc2ltNzQxNUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsInVzZXJBZ2VudCI6ImNyb21lIiwidXNlcklkIjoxLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTU5NDY0NjMxMSwiZXhwIjoxNTk0NjQ2MzIxfQ.36g2C2zC97jBHV5-OYjCU7zvBmOIVt3e1v3HtA0qcAk',
      });

    expect(responce.status).toBe(403);
    expect(responce.body.message).toEqual('Refresh token is expired');
    done();
  });

  it('get error if token payload.type is not refresh', async (done) => {
    const responce = await request
      .post('/api/refreshToken')
      .send({
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImxvZ2luIjoicG9wb3ZtYWtzaW03NDE1QGdtYWlsLmNvbSIsInVzZXJBZ2VudCI6ImNyb21lIiwidXNlcklkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNTk0NjQzNDg5LCJleHAiOjE2MDc2MDM0ODl9.GxiTXjM-m9gY4EJmObxW1JSqcMONCAO41f-86Osb07w',
      });
    expect(responce.status).toBe(403);
    expect(responce.body).toEqual({ code: 403, message: 'Refresh token is missed' });
    done();
  });

  // ------------------------------------redone test------------------------------------
  it('get error if token not found in Session table', async (done) => {
    const responce = await request
      .post('/api/refreshToken')
      .send({
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InBvcG92bWFrc2ltNzQxNUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsInVzZXJBZ2VudCI6ImNyb21lIiwidXNlcklkIjowLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTU5NTg1NTA4MywiZXhwIjoxNjIxNzc1MDgzfQ.qMjdWrxURl5IZ11YbuvKUlTC5o1UQxcJqT8nVMCj7HI',
      });
    expect(responce.status).toBe(400);
    expect(responce.body).toEqual({ code: 405, message: 'Tokens not found' });
    done();
  });

  it('get other error', async (done) => {
    const responce = await request
      .post('/api/refreshToken')
      .send({});
    expect(responce.status).toBe(501);
    expect(responce.body).toEqual({ code: 999, message: 'UNHANDLED ERROR' });
    done();
  });
});
