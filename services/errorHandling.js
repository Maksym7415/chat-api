module.exports = function errorHandling(error, req, res, next){
    console.log(error);
    res.status(error.status || 500);
    if(error.details && Array.isArray(error.details)){
        res.send({
            code: error.code || '999',
            message: error.message || 'Unhandled error',
            details: error.details || []
        });
    }
    else{
        res.send({
            code: error.code || '999',
            message: error.message || 'Unhandled error'
        });
    }
}

/**>>>TYPES OF ERROR RESPONE<<<
 * • Simple error response
 *      1. code - 000-999 code, set unique code of error
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
 *      code: 504,
 *      message: "Client with name = '123' already exist"
 * }
 * 
 * • Complex Error response
 * {
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