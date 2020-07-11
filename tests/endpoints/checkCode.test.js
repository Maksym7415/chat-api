const supertest = require('supertest');
const app = require('../../server');
const request = supertest(app)

describe('Post Endpoints', () => {
  it('it gets successfull login', async done => {
    const response = await request
      .post('/api/checkVerificationCode')
      .send({
        verificationCode: '12345',
        login: 'example@mail.com'
      })
  
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('successful login')
    done()
  })

  it('it returns error', async done => {
    const response = await request
      .post('/api/sendCheckCode')
      .send({
        verificationCode: '1245',
        login: 'example@mail.co'
      })
      
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('there is no such user in the system')
    done()
  })
})