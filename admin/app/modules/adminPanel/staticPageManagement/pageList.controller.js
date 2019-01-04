'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('PageListController', PageListController);

PageListController.$inject = ['$log', 'toastr', '$scope', 'AdminService', '$uibModal'];
function PageListController($log, toastr, $scope, AdminService, $uibModal) {	
	var vm          = this;
	vm.pageList     = [];
	vm.changeStatus = changeStatus;
	
	/* Get list of pages */
	getPages();

	function getPages(){
		vm.isPageLoaded = false;
		App.startPageLoading({animate: true});
		AdminService.staticPages().get(function(response){
			vm.isPageLoaded = true
			if(response.code == 200 ){
				vm.pageList = response.data;
			}
			App.stopPageLoading();
		})
	}

	/* Make active/inactive page */
	function changeStatus(pageId, status){
		var statusText;
		if(status == 0)	statusText = 'Inactive';
		if(status == 1)	statusText = 'Activate';
		$scope.confirmMsg = "Are you sure want to "+statusText+" selected page?";
		var changeStatusInstance = $uibModal.open({
			templateUrl: 'partial-views/confirm-modal/confirm-modal.view.html',
			controller: 'confirmModalController as vm',
			scope:$scope
		});
		changeStatusInstance.result.then(function (result) {
			if(result){
				AdminService.changePageStatus().update({id: pageId}, {status:status},function(response){			
					if(response.code == 200 ){
						toastr.success(response.message, "", {
							closeButton: true,
							timeOut: 3000,
							preventOpenDuplicates: true
						});
						/* Update page list */
						getPages();
					}
				})
			}
		},
		function (err) {
			console.info('Modal dismissed at: ' + new Date());
		});
	}
}