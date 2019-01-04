'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('DashboardController', DashboardController);

DashboardController.$inject = ['$log', '$state', 'toastr', 'GENERAL_CONFIG', 'localStorageService', 'AuthService', '$scope'];
function DashboardController($log, $state, toastr, GENERAL_CONFIG, localStorageService, AuthService, $scope) {	
	var vm = this;
	var loggedInUserInfo = JSON.parse(localStorageService.getLoggedInUserInfo());
	vm.test = "Dashboard view"
	if(localStorageService.getLoggedInUserInfo() === null){
		toastr.error('Your session has timed out. Please login to continue.', '', {
			closeButton: true,
			timeOut: 3000,
			preventOpenDuplicates: true
		});
		$state.go('login');
		return;
	}
}