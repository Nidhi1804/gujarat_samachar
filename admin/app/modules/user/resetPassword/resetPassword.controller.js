'use strict';
angular.module('gujaratSamachar.user')
	.controller('ResetPwdController', ResetPwdController);

ResetPwdController.$inject = ['$state', 'toastr', 'GENERAL_CONFIG', 'AuthService', '$location'];

function ResetPwdController($state, toastr, GENERAL_CONFIG, AuthService, $location) {
	var vm = this;
	vm.user = {};
	vm.app_image_url = GENERAL_CONFIG.app_image_url;
	vm.resetPassword = resetPassword;
	getCurrentDateYear();

	function getCurrentDateYear() {
		vm.currentDateYear = new Date().getFullYear();
	}

	function resetPassword(isValid) {
		vm.user.email = $location.search().email;
		if (isValid) {
			AuthService.resetPassword().save(vm.user, function (response) {
				if (response.code == 200) {
					toastr.success('Your password has been changed.', "", {
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