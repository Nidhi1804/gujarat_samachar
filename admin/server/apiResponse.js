const erMsg = 'Bad Request or Internal Server Error. Please see data for inner exception.';

const setSuccessResponse = function (res_code, message, data) {
	return { code: res_code, message, data };
}

const setFailureResponse = function(err) {
	return { code: 400, message: erMsg, data: { errMsg: err } };
}

module.exports.setSuccessResponse = setSuccessResponse;
module.exports.setFailureResponse = setFailureResponse;