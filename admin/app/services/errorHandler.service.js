'use strict';

angular.module('gujaratSamachar')
	.factory('errorHandler', errorHandler);

// Dependency injection
errorHandler.$inject = ['$q', '$injector'];

function errorHandler($q, $injector) {
	function endRequest(response) {
		if (response && response.data) {
			if (response.data) {
				if (response.data.SESSION_TIMED_OUT) {
					var toastr = $injector.get('toastr');
					var $state = $injector.get('$state');
					toastr.error('Your session has timed out. Please login to continue.', "", {
						closeButton: true,
						timeOut: 3000,
						allowHtml:true,
						preventOpenDuplicates: true
					});
					$state.go('login');
				}
				else if (response.data.USER_UNAUTHORIZED) {
					var toastr = $injector.get('toastr');
					var $state = $injector.get('$state');
					toastr.error('User is unauthorized.', "", {
						closeButton: true,
						timeOut: 3000,
						allowHtml:true,
						preventOpenDuplicates: true
					});
					$state.go('login');
				}
				else if (response.data.USER_INACTIVE) {
					var toastr = $injector.get('toastr');
					var $state = $injector.get('$state');
					toastr.error('Your account has been deactivated.', "", {
						closeButton: true,
						timeOut: 3000,
						allowHtml:true,
						preventOpenDuplicates: true
					});
					$state.go('login');
				}
				else if (response.data.code && response.data.code == 400) {
					var toastr = $injector.get('toastr');
					let errMsgs = '';
					if (!Array.isArray(response.data.data.errMsg) && response.data.data.errMsg.charAt(0) + response.data.data.errMsg.charAt(response.data.data.errMsg.length - 1) === '[]') {
						let errors = eval(response.data.data.errMsg);
						for (let er = 0; er < errors.length; er++) {
							errors[er] = errors[er].trim();
							let erString = errors[er].charAt(0).toUpperCase() + errors[er].slice(1).toLowerCase();
							if (errors.length > 1) {
								errMsgs = errMsgs + erString + "</br>"
							}
							else {
								errMsgs = errMsgs + erString;
							}
						}
					} else {
						errMsgs = response.data.data.errMsg;
					}
					toastr.error(errMsgs, "", {
						closeButton: true,
						timeOut: 3000,
						allowHtml:true,
						preventOpenDuplicates: true
					});
				}
			}
		}
		return response;
	}

	// Return interceptor configuration object
	return {
		'response': endRequest,
	};
}
