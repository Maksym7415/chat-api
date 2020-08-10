const MAIN_ERROR_CODES = {
  SYSTEM_ERROR: {
    ERROR_CODE: 100,
    HTTP_CODE: 500,
    MESSAGE: 'SYSTEM ERROR',
  },
  ELEMENT_IN_USE: {
    ERROR_CODE: 200,
    HTTP_CODE: 406,
    MESSAGE: 'ELEMENT IN USE',
  },
  ELEMENT_NOT_INT_USE: {
    ERROR_CODE: 201,
    HTTP_CODE: 406,
    MESSAGE: 'ELEMENT NOT IN USE',
  },
  VALIDATION: {
    ERROR_CODE: 202,
    HTTP_CODE: 400,
    MESSAGE: 'VALIDATION',
  },
  EXEX_LOGIC: {
    ERROR_CODE: 300,
    HTTP_CODE: 406,
    MESSAGE: 'EXECUTION LOGIC',
  },
  USER_BLOCKED: {
    ERROR_CODE: 301,
    HTTP_CODE: 406,
    MESSAGE: 'USER BLOCKED',
  },
  USER_UNAVAILABLE: {
    ERROR_CODE: 302,
    HTTP_CODE: 406,
    MESSAGE: 'USER UNAVAILABLE',
  },
  BAD_REQUEST: {
    ERROR_CODE: 400,
    HTTP_CODE: 400,
    MESSAGE: 'BAD REQUEST',
  },
  UNAUTH: {
    ERROR_CODE: 401,
    HTTP_CODE: 401,
    MESSAGE: 'UNAUTHORIZED',
  },
  FORBIDDEN: {
    ERROR_CODE: 403,
    HTTP_CODE: 403,
    MESSAGE: 'FORBIDDEN',
  },
  TOKEN_ERROR: {
    ERROR_CODE: 406,
    HTTP_CODE: 400,
    MESSAGE: 'TOKEN ERROR',
  },
  NOT_EXISTS: {
    ERROR_CODE: 405,
    HTTP_CODE: 400,
    MESSAGE: 'NOT EXISTS',
  },
  UNHANDLED_ERROR: {
    ERROR_CODE: 999,
    HTTP_CODE: 501,
    MESSAGE: 'UNHANDLED ERROR',
  },
};

const DETAILED_ERROR_CODES = {

};

function formErrorObject(errorObj, message, details) {
  return {
    errorObj,
    message,
    details,
  };
}

function errorHandling(error, req, res, next) {
  if (!error.errorObj || !error.errorObj.ERROR_CODE || !error.errorObj.HTTP_CODE) {
    res.status(500);
    res.json({
      code: '888',
      message: 'Undefined error',
    });
  } else {
    res.status(error.errorObj.HTTP_CODE);
    if (error.errorObj.details && Array.isArray(error.errorObj.details)) {
      res.json({
        code: error.errorObj.ERROR_CODE,
        message: error.message || error.errorObj.MESSAGE,
        details: error.errorObj.details || [],
      });
    } else {
      res.json({
        code: error.errorObj.ERROR_CODE,
        message: error.message || error.errorObj.MESSAGE,
      });
    }
  }
}

module.exports = {
  errorHandling,
  formErrorObject,
  MAIN_ERROR_CODES,
};

/** >>>TYPES OF ERROR RESPONE<<<
 * • Simple error response
 *      1. code - 000-999 code, set unique code of main error
 *      2. message - text, that describes responsed error
 *
 *
 * • Complex Error response
 *      1. code - 000-999 code, set unique code of main error
 *      2. message - text, that describes responsed main error
 *      3. details - array of detailed error objects
 *          3.1 code - 000-999 code, describe type of detailed error (DONT CONFISE WITH ERROR CODE)
 *          3.2 cause - names what has caused detailed error
 *          3.3 message - text, that describes responsed detailed error
 *
 * >>>EXAMPLES<<<
 * • Simple error response
 * {
 *      (http-code)
 *      code: 504,
 *      message: "Client with name = '123' already exist"
 * }
 *
 * • Complex Error response
 * {
 *      (http-code)
 *      code: 201,
 *      message: "Error in validation of request params",
 *      details: [
 *          {
 *              code: 112
 *              cause: "Phone"
 *              message: "should NOT be shorter than 5 symbols"
 *          },
 *          {
 *              code: 358
 *              cause: "Name"
 *              message: "should NOT contain numeric symbols"
 *          }
 *      ]
 * }
 */

/**
  * >>>formErrorObject<<<
  *
  * if without params or params are unparsible -> {code: 888, message: 'undefined error'} http status - 500
  *
  * else if only errorObj (MAIN_ERROR_CODES) passed -> error message will be used from errorObj
  *
  * else -> will be returned manually configured error response
  */
