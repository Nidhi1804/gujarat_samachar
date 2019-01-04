'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('AddEditPhotoGalleryController', AddEditPhotoGalleryController);

AddEditPhotoGalleryController.$inject = ['$state', 'toastr', 'AdminService', '$stateParams', '$uibModal', '$scope', 'commonService'];
function AddEditPhotoGalleryController($state, toastr, AdminService, $stateParams, $uibModal, $scope, commonService) {
	// initialize core components of jQuery plugins(bootstrap-switch)
	$scope.$on('$viewContentLoaded', function () {
		App.initAjax();
	});

	const vm = this;
	vm.disable = false;
	vm.photoGalleryId = $stateParams.photoGalleryId;
	vm.savePhotoGallery = savePhotoGallery;
	vm.photoGallery = {};
	vm.openAddModal = openAddModal;
	
	let redirectFlagValue;
	let service;
	
	if (vm.photoGalleryId !== undefined && vm.photoGalleryId !== '' && vm.photoGalleryId !== null) {
		vm.typeTitle = "Edit";
		getPhotoGalleyInfo();
	} else {
		vm.typeTitle = "Add New";
		vm.isSectionLoaded = true; // Flag to load html only after retieving Section Info to initialize bootstrap-switch and other js plugins based on data
	}
	/* Reset form after submission */
	function reset() {
		vm.photoGallery = {};
		// vm.addPhotoGalleryForm.$setPristine();
	}


	/* Get photo galley info by Id to edit slide Show */
	function getPhotoGalleyInfo() {
		vm.isSectionLoaded = false;
		App.startPageLoading({ animate: true });
		AdminService.photoGallery().get({ photoGalleryId: vm.photoGalleryId }, response => {
			if (response) {
				vm.photoGallery = response.data;
				vm.isSectionLoaded = true;
			}
			App.stopPageLoading();
		});
	}

	function savePhotoGallery(method, redirectFlag) {
		//slideImageValidation
		redirectFlagValue = redirectFlag;
		if (vm.photoGallery.image) {
			vm.addPhotoGalleryForm.$setValidity('slideImageValidation', true);
		} else {
			vm.addPhotoGalleryForm.$setValidity('slideImageValidation', false);
		}
		if (vm.addPhotoGalleryForm.$valid) {
			vm.disable = true;
			if (method == 'Add') {
				service = AdminService.photoGallery().save(vm.photoGallery, successCallback);
			} else if (method == 'Update') {
				service = AdminService.photoGallery().update({ photoGalleryId: vm.photoGalleryId }, vm.photoGallery, successCallback);
			}

		}
	}

	function successCallback(response) {
		if (response.code == 200) {
			toastr.success(response.message, "", {
				closeButton: true,
				timeOut: 3000,
				preventOpenDuplicates: true
			});
			if (redirectFlagValue === false) {
				$state.go("root.photoGalleryList", { pageId: 1 });
			}
			if (redirectFlagValue === true) {
				vm.photoGallery = {};
				vm.disable = false;
				$state.go("root.addPhotoGallery");
			}
		}
	}
	

	function openAddModal() {
		var modalInstance = $uibModal.open({
			templateUrl: 'modules/adminPanel/slideShow/slideShowImage/addImage.view.html',
			controller: 'AddSlideShowImageController',
			controllerAs: 'vm',
			backdrop: 'static',
		});

		modalInstance.result.then(function (result) {
			if (result && result.success) {
				vm.photoGallery.image = result.croppedImage;
			}
		},
		function (err) {
			console.info('Modal dismissed at: ' + new Date());
		});
	}
}
