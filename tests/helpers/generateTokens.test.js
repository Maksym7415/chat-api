const jwt = require('jsonwebtoken');
const jwtSecret = require('../../config/jwtConfig').jwt.secret;
const { tokenHelper, generateAccessToken, generateRefreshToken } = require('../../src/helpers/tokensGenerate');

describe('token generation helper', () => {
  it('it gets object with accessToken', async (done) => {
    const tokens = await tokenHelper('example@mail.com', 'user', 'chrome', 1);
    expect(Object.keys(tokens).length).toBe(2);
    done();
  });

  it('it gets accessToken', async (done) => {
    const accessToken = await generateAccessToken('example@mail.com', 'user', 'chrome', 1);
    const payload = jwt.verify(accessToken, jwtSecret);
    expect(typeof accessToken).toBe('string');
    expect(payload.userId).toBe(1);
    done();
  });

  it('it gets refreshToken', async (done) => {
    const refreshToken = await generateRefreshToken('example@mail.com', 'user', 'chrome', 1);
    const payload = jwt.verify(refreshToken, jwtSecret);
    expect(typeof refreshToken).toBe('string');
    expect(payload.userId).toBe(1);
    done();
  });
});
