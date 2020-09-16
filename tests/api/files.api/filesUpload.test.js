/* eslint-disable no-undef */
/* eslint-disable max-len */
const supertest = require('supertest');
const path = require('path');
const { app } = require('../../../server');

const request = supertest(app);

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImxvZ2luIjoicG9wb3ZtYWtzaW03NDE1QGdtYWlsLmNvbSIsInVzZXJBZ2VudCI6ImNyb21lIiwidXNlcklkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNTk1NTk5NzA3LCJleHAiOjE2MDg1NTk3MDd9.3oUUKPPFIbv0ZEzVNGAyf362z2Ben6U3A1mwB33oYVk';
// const invalidToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImxvZ2luIjoidml0OTExMTJAZ21haWwuY29tIiwidXNlckFnZW50IjoiY3JvbWUiLCJ1c2VySWQiOjAsImZpcnN0TmFtZSI6InZpdDkiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjAwMjUxMjcxLCJleHAiOjE2MTMyMTEyNzF9.FAYQa3B3-fnTUAVm-NxvoZJUcjYFKxwuMK_nPovmc-g';
// inva;id token with userId = 0

describe('checkout of "file upload" API', () => {
  it('should upload the test file to CDN', () => {
    // Test if the test file is exist
    const filename = '1c83b640-f672-11ea-bfb2-25a42bf4ee9d.jpg';
    const filePath = path.resolve(__dirname, `../../../uploads/${filename}`);
    return request
      .post('/api/upload')
      .set('Authorization', token)
      .set('User-Agent', 'Crome')
      .attach('file', filePath)
      .then((res) => {
        expect(res.body).toBe('upload is success');
      })
      .catch((err) => console.log(err));
    // });
  });
  it('should be error if file is inCorrect', () => {
    // Test if the test file is exist
    const filename = '1c83b640-f672-11ea-bfb2-25a42bf4ee9d.jpg';
    const filePath = path.resolve(__dirname, `../../../uploads/${filename}`);
    return request
      .post('/api/upload')
      .set('Authorization', token)
      .set('User-Agent', 'Crome')
      .attach('files', filePath)
      .then((res) => {
        const { message } = res.body;
        expect(message).toBe('Undefined error');
      })
      .catch((err) => console.log(err));
    // });
  });
});
