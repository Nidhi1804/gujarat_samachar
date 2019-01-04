'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('confirmModalController', confirmModalController);

confirmModalController.$inject = ['$log', '$uibModalInstance', '$scope'];
function confirmModalController($log, $uibModalInstance, $scope) {
	var vm = this;	
	vm.ok = function(){
		$uibModalInstance.close(true);
	}
	vm.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
}