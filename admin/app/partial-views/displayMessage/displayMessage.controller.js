angular.module('gujaratSamachar')
	.controller('DisplayMessageController',DisplayMessageController);

	// Dependency injection
	DisplayMessageController.$inject = ['$state', 'GENERAL_CONFIG'];

	function DisplayMessageController($state, GENERAL_CONFIG) {
		var vm           = this;
		vm.app_image_url = GENERAL_CONFIG.app_image_url;
		vm.displayMsg    = $state.params.msg;
	}