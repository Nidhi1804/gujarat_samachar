'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('SectionListController', SectionListController);

SectionListController.$inject = ['$log', '$scope', '$state', 'toastr', 'AdminService', '$uibModal', '$stateParams'];
function SectionListController($log, $scope, $state, toastr, AdminService, $uibModal, $stateParams) {	
	var vm           = this;
	vm.sectionList   = [];
	vm.changeStatus  = changeStatus;
	vm.getSections   = getSections;
	vm.deleteSection = deleteSection;
	vm.pageChanged   = pageChanged;
	vm.pageId        = $stateParams.pageId;
	vm.pagination    = {
		current: vm.pageId
	};

	/* Get Section List */
	getSections(vm.pageId);

	/* Get sections based on selected page number */
	function pageChanged(newPage){
		$state.go("root.sectionList" , {pageId:newPage});
	}

	function getSections(pageNumber){
		vm.isSectionLoaded = false;
		App.startPageLoading({animate: true});
		AdminService.sections().get({pageIndex:pageNumber, searchText : vm.searchText}, function(response){
			if(response.code == 200 ){
				vm.isSectionLoaded = true;
				vm.sectionsPerPage = response.data.sectionsPerPage;
				vm.totalSections   = response.data.totalSections;
				vm.sectionList     = response.data.sections;				
				if(response.data.sections.length == 0){
					if(vm.pageId > 1)
						$state.go("root.sectionList" , {pageId:1});
				}
			}
			App.stopPageLoading();
		})
	}

	/* Make active/inactive section */
	function changeStatus(sectionId, status){
		var statusText;
		if(status == 0)	statusText = 'Inactive';
		if(status == 1)	statusText = 'Activate';
		$scope.confirmMsg = "Are you sure want to "+statusText+" selected section?";
		var changeStatusInstance = $uibModal.open({
			templateUrl: 'partial-views/confirm-modal/confirm-modal.view.html',
			controller: 'confirmModalController as vm',
			scope:$scope
		});
		changeStatusInstance.result.then(function (result) {
			if(result){
				AdminService.changeSectionStatus().update({sectionId: sectionId}, {sectionStatus:status},function(response){			
					if(response.code == 200 ){
						toastr.success(response.message, "", {
							closeButton: true,
							timeOut: 3000,
							preventOpenDuplicates: true
						});
						/* Update section list */
						getSections();
					}
				})
			}
		},
		function (err) {
			console.info('Modal dismissed at: ' + new Date());
		});
	}		

	/* Delete selected section */
	function deleteSection(size, sectionId) {
		$scope.confirmMsg = "Are you sure want to permanently delete selected section?";
		var deleteUserInstance = $uibModal.open({
			templateUrl: 'partial-views/confirm-modal/confirm-modal.view.html',
			controller: 'confirmModalController as vm',
			scope:$scope
		});
		deleteUserInstance.result.then(function (result) {
			if(result){
				App.startPageLoading({animate: true});
				AdminService.sections().delete({sectionId: sectionId},function(response){			
					if(response.code == 200 ){
						toastr.success(response.message, "", {
							closeButton: true,
							timeOut: 3000,
							preventOpenDuplicates: true
						});
						/* Update section list */
						getSections();
					}
					App.stopPageLoading();
				})
			}
		},
		function (err) {
			console.info('Modal dismissed at: ' + new Date());
		});
	}
}