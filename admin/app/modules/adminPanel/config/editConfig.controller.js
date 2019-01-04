'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('EditConfigController', EditConfigController);

EditConfigController.$inject = ['$log', '$scope', 'AdminService', 'toastr', '$uibModal', '$state', '$stateParams', 'localStorageService'];
function EditConfigController($log, $scope, AdminService, toastr, $uibModal, $state, $stateParams, localStorageService) {
	var vm = this;
	vm.updateConfig = updateConfig;
	vm.config = {};
	vm.allowNumber = /^-?[0-9][^\.]*$/;
	var configId;

	/* Reset form after submission */
	function reset() {
		vm.editConfigFrm.$setPristine();
	}

	/* Get app settings */
	getConfig();

	/* Get config info */
	function getConfig(pageNumber) {
		vm.isContentLoaded = false;
		App.startPageLoading({ animate: true });
		AdminService.configuration().get(function (response) {
			vm.isContentLoaded = true;
			if (response.code == 200) {
				vm.configObj = response.data[0].config;
				configId = response.data[0]._id;
			}
			App.stopPageLoading();
		})
	}

	/* Update config */
	function updateConfig(isValid) {
		if (isValid) {
			AdminService.configuration().update({ configId: configId }, { config: vm.configObj }, function (response) {
				if (response.code == 200) {
					toastr.success(response.message, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					reset();
				}
				$state.go($state.current, {}, { reload: true });
				App.stopPageLoading();
			})
		}
	}
}