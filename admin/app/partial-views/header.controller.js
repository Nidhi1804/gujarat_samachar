'use strict';
angular.module('gujaratSamachar')
	.controller('HeaderController', HeaderController);

HeaderController.$inject = ['$log', '$state', 'toastr', 'GENERAL_CONFIG', 'localStorageService', 'AuthService', '$http', '$rootScope'];
function HeaderController($log, $state, toastr, GENERAL_CONFIG, localStorageService, AuthService, $http, $rootScope) {
	var vm           = this;
	vm.app_image_url = GENERAL_CONFIG.app_image_url;
	vm.logout        = logout;

	if(localStorageService.getLoggedInUserInfo() === null || localStorageService.getLoggedInUserInfo() == ''){
		toastr.error('Your session has timed out. Please login to continue.', "", {
			closeButton: true,
			timeOut: 3000,
			preventOpenDuplicates: true
		});
		$state.go('login');
		return;
	}else{
		vm.loggedInUserInfo = JSON.parse(localStorageService.getLoggedInUserInfo());
		vm.userLoggedIn = false;
	}
	
	/* Update username and profile pic in header on user profile update */
	$rootScope.$on('refreshUserHeaderDetail', function(event, data){
		if(data) vm.loggedInUserInfo = JSON.parse(localStorageService.getLoggedInUserInfo());
	});


	function logout(){
		AuthService.logout().get(function(response){
			localStorageService.removeLoggedInUserInfo();
			delete $http.defaults.headers.common['Authorization'];
			toastr.success('You are successfully logged out.', "", {
				closeButton: true,
				timeOut: 3000,
				preventOpenDuplicates: true
			});
			$state.go('login');
		});
	}
}