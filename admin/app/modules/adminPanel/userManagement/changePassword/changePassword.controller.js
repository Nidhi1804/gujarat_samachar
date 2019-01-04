(function() {
	'use strict';
	angular.module('gujaratSamachar.adminPanel')
		.controller('ChangePwdController', ChangePwdController);

	ChangePwdController.$inject = ['$scope', '$state', '$stateParams', 'toastr', 'AdminService'];

	function ChangePwdController($scope, $state, $stateParams, toastr, AdminService) {
		var vm = this;
		vm.user = {};
		vm.changePassword = changePassword;
		vm.user.userId = $stateParams.userId;

		function changePassword(isValid, passwordMatch) {
			if (isValid && passwordMatch) {
				AdminService.userChangePassWord().save(vm.user, function (response) {
					if (response.code == 200) {
						toastr.success(response.message, "", {
							closeButton: true,
							timeOut: 3000,
							preventOpenDuplicates: true
						});
						$state.go("root.dashboard");
					}
				});
			}
		}
	}
})();