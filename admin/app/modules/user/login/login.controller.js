'use strict';
angular.module('gujaratSamachar.user')
	.controller('LoginController', LoginController);

LoginController.$inject = ['$state', 'toastr', 'GENERAL_CONFIG', 'localStorageService', 'AuthService'];

function LoginController($state, toastr, GENERAL_CONFIG, localStorageService, AuthService) {
	var vm = this;
	vm.user = {};
	vm.login = login;
	vm.app_image_url = GENERAL_CONFIG.app_image_url;
	vm.rememberUser = JSON.parse(localStorageService.getRememberMe());

	if (vm.rememberUser) {
		vm.user.email = vm.rememberUser.email;
		vm.user.password = vm.rememberUser.password;
		vm.user.remember = true;
	} else {
		vm.user.remember = false;
	}
	getCurrentDateYear();

	function getCurrentDateYear() {
		vm.currentDateYear = new Date().getFullYear();
	}

	function login(isValid) {
		if (isValid) {
			if (!vm.user.remember) {
				vm.user.remember = false;
			}
			AuthService.login(vm.user).save(vm.user, function (response) {
				if (response.code == 200) {
					toastr.success(response.message, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					localStorageService.removeLoggedInUserInfo();
					localStorageService.setLoggedInUserInfo(JSON.stringify(response.data));
					var previousStatesForAllModules = JSON.parse(localStorageService.getPreviousState());
					if (vm.user.remember) {
						var userInfo = {
							email: vm.user.email,
							password: vm.user.password
						}
						localStorageService.setRememberMe(JSON.stringify(userInfo));
					} else {
						localStorageService.removeRememberMe()
					}
					$state.go('root.dashboard');
				}
			})
		}
	}
}