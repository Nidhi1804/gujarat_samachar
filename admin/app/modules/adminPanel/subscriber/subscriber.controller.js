'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('subscriberController', subscriberController);

subscriberController.$inject = ['$log', '$scope', 'AdminService', 'toastr', '$uibModal', '$state', '$stateParams', 'localStorageService'];
function subscriberController($log, $scope, AdminService, toastr, $uibModal, $state, $stateParams, localStorageService) {
	var vm    = this;
	vm.config = {};

	/* Get Subscriber */
	getSubscriber();
	
	function getSubscriber(pageNumber){
		vm.isContentLoaded = false;
		App.startPageLoading({animate: true});
		AdminService.getSubscriberList().get(function(response){
			vm.isContentLoaded = true;
			if(response.code == 200 ){
				vm.subscriberList = response.data;
			}
			App.stopPageLoading();
		})
	}
}