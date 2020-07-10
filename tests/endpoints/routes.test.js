const supertest = require('supertest');
const app = require('../../server');
const request = supertest(app)

describe('Post Endpoints', () => {
  it('gets the test endpoint', async done => {
    const response = await request.get('/test')
  
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('pass!')
    done()
  })
})