'use strict';
angular.module('gujaratSamachar')
	.factory('commonService', commonService);

commonService.$inject = ['toastr']

function commonService(toastr) {
	var service = {
		successToastr: successToastr,
		errorToastr: errorToastr
	}
	return service;
	function successToastr(message) {
		toastr.success(message, {
			closeButton: true,
			timeOut: 3000,
			preventOpenDuplicates: true
		});
	}
	function errorToastr(message) {
		toastr.error(message, {
			closeButton: true,
			timeOut: 3000,
			preventOpenDuplicates: true
		});
	}
}
