'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('ConfigController', ConfigController);

ConfigController.$inject = ['$log', '$scope', 'AdminService', 'toastr', '$uibModal', '$state', '$stateParams', 'localStorageService'];
function ConfigController($log, $scope, AdminService, toastr, $uibModal, $state, $stateParams, localStorageService) {
	var vm    = this;
	vm.config = {};

	/* Get app settings */
	getConfig();
	
	function getConfig(pageNumber){
		vm.isContentLoaded = false;
		App.startPageLoading({animate: true});
		AdminService.configuration().get(function(response){
			vm.isContentLoaded = true;
			if(response.code == 200 ){
				vm.configObj = response.data[0];
				vm.configObj.lastModifiedAt = new Date(vm.configObj.lastModifiedAt);
			}
			App.stopPageLoading();
		})
	}
}