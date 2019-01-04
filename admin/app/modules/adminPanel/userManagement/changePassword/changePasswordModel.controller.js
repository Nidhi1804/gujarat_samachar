(function() {
	'use strict';
	angular.module('gujaratSamachar.adminPanel')
		.controller('ChangePwdModelController', ChangePwdModelController);

	ChangePwdModelController.$inject = ['$scope', '$state', 'toastr', 'AdminService', '$uibModalInstance'];

	function ChangePwdModelController($scope, $state, toastr, AdminService, $uibModalInstance) {
		var vm = this;
		vm.user = {};
		vm.changePassword = changePassword;

		if($scope.userId) {
			vm.user.userId = $scope.userId;	
			vm.isFromModel = true;
		} else {
			toastr.success("User not found", "", {
				closeButton: true,
				timeOut: 3000,
				preventOpenDuplicates: true
			});
			$uibModalInstance.close(true);
		}
		
		function changePassword(isValid, passwordMatch) {
			if (isValid && passwordMatch) {
				AdminService.userChangePassWord().save(vm.user, function (response) {
					if (response.code == 200) {
						toastr.success(response.message, "", {
							closeButton: true,
							timeOut: 3000,
							preventOpenDuplicates: true
						});
						$uibModalInstance.close(true);
					}
				});
			}
		}

		vm.cancel = function(){
			$uibModalInstance.dismiss('cancel');
		}
	}
})();