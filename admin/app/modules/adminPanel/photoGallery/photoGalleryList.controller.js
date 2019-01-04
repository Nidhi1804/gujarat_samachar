'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('PhotoGalleryController', PhotoGalleryController);

PhotoGalleryController.$inject = ['$scope', '$state', 'toastr', 'AdminService', '$uibModal', '$stateParams', '$location'];
function PhotoGalleryController($scope, $state, toastr, AdminService, $uibModal, $stateParams, $location) {
	const vm = this;
	vm.photoGalleryList = [];
	vm.pageChanged = pageChanged;
	vm.pageId = $stateParams.pageId;
	vm.searchPhotoGallery = searchPhotoGallery;
	vm.toggleCheckBox = toggleCheckBox;
	vm.checkAllBox = checkAllBox;
	vm.deleteSinglePhotoGallery = deleteSinglePhotoGallery;
	vm.deleteSelectedPhotoGalleries = deleteSelectedPhotoGalleries;
	vm.changeStatus = changeStatus;
	vm.deleteIdList = [];
	vm.pagination = {
		current: vm.pageId
	};
	vm.searchText = $location.search().searchText;
	vm.resetFilter = resetFilter;
	

	// /* Get photo gallery list */
	getPhotoGalleryList(vm.pageId);

	// /* Get photo gallery based on selected page number */
	function pageChanged(newPage) {
		$state.go("root.photoGalleryList", { pageId: newPage });
	}

	function searchPhotoGallery() {
		$state.go("root.photoGalleryList", { pageId: vm.pageId, searchText: vm.searchText});
	}

	function resetFilter() {
		vm.pageId = 1;
		vm.searchText = '';
		searchPhotoGallery();
	}

	function getPhotoGalleryList(pageNumber) {
		vm.showLoader = true;
		App.startPageLoading({ animate: true });
		AdminService.photoGallery().get({ pageIndex: pageNumber, searchText: vm.searchText}, response => {
			if (response.code == 200) {
				if (response.data.photoGalleries.length > 0) {
					vm.itemsPerPage = response.data.photoGalleriesPerPage;
					vm.totalItems = response.data.totalPhotoGalleries;
					vm.photoGalleryList = response.data.photoGalleries;
					vm.photoGalleryList = vm.photoGalleryList.map(function (photoGallery) {
						photoGallery.isChecked = false;
						return photoGallery;
					});
				} else {
					vm.photoGalleryList = [];
					if (vm.pageId > 1)
						$state.go("root.photoGalleryList", { pageId: 1 });
				}
			}
			vm.showLoader = false;
			App.stopPageLoading();
		});
	}

	function toggleCheckBox(id, isChecked) {
		if (isChecked) {
			vm.deleteIdList.push(id);
		} else {
			var index = vm.deleteIdList.indexOf(id)
			vm.deleteIdList.splice(index, 1);
		}
		if (vm.deleteIdList.length == vm.photoGalleryList.length) {
			vm.selectAll = true;
		}
		else {
			vm.selectAll = false
		}
	}

	function checkAllBox() {
		vm.deleteIdList = [];
		if (vm.deleteIdList.length == vm.photoGalleryList.length || !vm.selectAll) {
			vm.photoGalleryList = vm.photoGalleryList.map(function (photoGallery) {
				photoGallery.isChecked = false;
				return photoGallery;
			});
		}
		else {
			if (vm.selectAll) {
				vm.photoGalleryList = vm.photoGalleryList.map(function (photoGallery) {
					photoGallery.isChecked = true;
					vm.deleteIdList.push(photoGallery._id);
					return photoGallery;
				});
			}
		}
	}

	function deleteSinglePhotoGallery(photoGalleryId) {
		vm.deleteIdList = [];
		vm.deleteIdList.push(photoGalleryId);
		deletePhotoGallery();
	}

	function deleteSelectedPhotoGalleries(photoGalleryIds) {
		vm.deleteIdList = [];
		vm.photoGalleryList.map(function (photoGallery) {
			if (photoGallery.isChecked)
				vm.deleteIdList.push(photoGallery._id);
			return photoGallery;
		});
		deletePhotoGallery();
	}

	function deletePhotoGallery() {
		AdminService.photoGallery().remove({ photoGalleryIds: JSON.stringify(vm.deleteIdList) }, function (response) {
			if (response.code == 200) {
				toastr.success(response.message, "", {
					closeButton: true,
					timeOut: 3000,
					preventOpenDuplicates: true
				});
				vm.deleteIdList = [];
				getPhotoGalleryList(vm.pageId);
			}
		});
	}

	function changeStatus(photoGalleryId, status) {
		AdminService.changePhotoGalleryStatus().update({ photoGalleryId: photoGalleryId }, { photoGalleryStatus: status }, function (response) {
			if (response.code == 200) {
				toastr.success(response.message, "", {
					closeButton: true,
					timeOut: 3000,
					preventOpenDuplicates: true
				});
				getPhotoGalleryList(vm.pageId);
			}
		});
	}
}