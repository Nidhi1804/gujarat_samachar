'use strict';
angular.module('gujaratSamachar.user')
	.controller('ForgotPwdController', ForgotPwdController);

ForgotPwdController.$inject = ['$state', 'toastr', 'GENERAL_CONFIG', 'localStorageService', 'AuthService'];

function ForgotPwdController($state, toastr, GENERAL_CONFIG, localStorageService, AuthService) {
	var vm = this;
	vm.user = {};
	vm.app_image_url = GENERAL_CONFIG.app_image_url;
	vm.forgotPassword = forgotPassword;

	getCurrentDateYear();

	function getCurrentDateYear() {
		vm.currentDateYear = new Date().getFullYear();
	}

	function forgotPassword(isValid) {
		if (isValid) {
			AuthService.forgotPassword().save(vm.user, function (response) {
				if (response.code == 200) {
					toastr.success('Email sent to ' + vm.user.email, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					$state.go('login');
				}
			});
		}
	}
}