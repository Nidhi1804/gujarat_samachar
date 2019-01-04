'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('VideoGalleryController', VideoGalleryController);

VideoGalleryController.$inject = ['$log', '$scope', '$state', 'toastr', 'GENERAL_CONFIG', 'AuthService', 'AdminService', '$uibModal', '$stateParams', '$location'];
function VideoGalleryController($log, $scope, $state, toastr, GENERAL_CONFIG, AuthService, AdminService, $uibModal, $stateParams, $location) {
	var vm = this;
	vm.galleryList = [];
	vm.pageChanged = pageChanged;
	vm.pageId = $stateParams.pageId;
	vm.searchGallery = searchGallery;
	vm.toggleCheckBox = toggleCheckBox;
	vm.checkAllBox = checkAllBox;
	vm.deleteSingleGallery = deleteSingleGallery;
	vm.deleteSelectedGalleries = deleteSelectedGalleries;
	vm.inactiveSelectedVideo = inactiveSelectedVideo;
	vm.changeStatus = changeStatus;
	vm.deleteIdList = [];
	vm.pagination = {
		current: vm.pageId
	};
	vm.searchText = $location.search().searchText;
	vm.category = $location.search().category;
	vm.resetFilter = resetFilter;
	/* Get video category list */
	getMainCategories();

	/* Get video gallery list */
	getGalleryList(vm.pageId);

	/* Get video gallery based on selected page number */
	function pageChanged(newPage) {
		$state.go("root.videoGalleryList", { pageId: newPage });
	}

	function searchGallery() {
		$state.go("root.videoGalleryList", { pageId: vm.pageId, searchText: vm.searchText, reporter: vm.reporter, category: vm.category });
	}

	function resetFilter() {
		vm.pageId = 1;
		vm.searchText = '';
		if(vm.reporter) {
			vm.reporter = '';
		}
		if(vm.category) {
			vm.category = '';
		}
		searchGallery();
	}

	function getMainCategories() {
		AdminService.categories().get({ sort: 'name', type: 'video', isActive: true }, function (response) {
			if (response.code == 200) {
				vm.mainCategoryList = response.data;
				vm.mainCategoryList.unshift({ "_id": "", "name": "All", "slug": "", "isActive": true, "count": 1 });
			}
		})
	}

	function getGalleryList(pageNumber) {
		vm.showLoader = true;
		App.startPageLoading({ animate: true });
		AdminService.videoGallery().get({ pageIndex: pageNumber, searchText: vm.searchText, category: vm.category }, function (response) {
			if (response.code == 200) {
				vm.selectAll = false;
				if (response.data.galleries.length > 0) {
					vm.itemsPerPage = response.data.galleriesPerPage;
					vm.totalItems = response.data.totalGalleries;
					vm.galleryList = response.data.galleries;
					vm.galleryList = vm.galleryList.map(function (gallery) {
						gallery.isChecked = false;
						return gallery;
					});
				} else {
					vm.galleryList = [];
					if (vm.pageId >= 1)
						$state.go("root.videoGalleryList", { pageId: 1 });
				}
			}

			vm.showLoader = false;
			App.stopPageLoading();
		})
	}

	function toggleCheckBox(id, isChecked) {
		if (isChecked) {
			vm.deleteIdList.push(id);
		} else {
			var index = vm.deleteIdList.indexOf(id)
			vm.deleteIdList.splice(index, 1);
		}
		if (vm.deleteIdList.length == vm.galleryList.length) {
			vm.selectAll = true;
		}
		else {
			vm.selectAll = false
		}
	}

	function checkAllBox() {
		vm.deleteIdList = [];
		if (vm.deleteIdList.length == vm.galleryList.length || !vm.selectAll) {
			vm.galleryList = vm.galleryList.map(function (gallery) {
				gallery.isChecked = false;
				return gallery;
			});
		}
		else {
			if (vm.selectAll) {
				vm.galleryList = vm.galleryList.map(function (gallery) {
					gallery.isChecked = true;
					vm.deleteIdList.push(gallery._id);
					return gallery;
				});
			}
		}
	}

	function deleteSingleGallery(galleryId) {
		vm.deleteIdList = [];
		vm.deleteIdList.push(galleryId);
		deleteGallery()
	}

	function deleteSelectedGalleries(galleryIds) {
		vm.deleteIdList = [];
		vm.galleryList.map(function (gallery) {
			if (gallery.isChecked)
				vm.deleteIdList.push(gallery._id);
			return gallery;
		});
		deleteGallery()
	}

	function deleteGallery() {
		AdminService.videoGallery().remove({ galleryIds: JSON.stringify(vm.deleteIdList) }, function (response) {
			if (response.code == 200) {
				toastr.success(response.message, "", {
					closeButton: true,
					timeOut: 3000,
					preventOpenDuplicates: true
				});
				vm.deleteIdList = [];
				getGalleryList(vm.pageId);
			}

		})
	}
	function changeStatus(ids, status) {
		if (ids !== undefined && ids !== null && ids !== "" && !Array.isArray(ids)) {
            vm.activeIdsList = [];
            vm.activeIdsList.push(ids);
        }
        if (status !== undefined && status !== "" && status !== null) {
            if (status == 1) {
                status = true;
            } else {
                status = false;
            }
        }
        
        AdminService.changeVideoGalleryStatus().update({ idList: JSON.stringify(vm.activeIdsList) }, { isActive: status }, function (response) {
            if (response.code == 200) {
            	vm.activeIdsList = [];
                toastr.success(response.message, "", {
					closeButton: true,
					timeOut: 3000,
					preventOpenDuplicates: true
				});
            	getGalleryList(vm.pageId);
            }
        });
	}

	function inactiveSelectedVideo(videoGalleryIds, status) {
		vm.activeIdsList = [];
        vm.galleryList.map(function (gallery) {
            if (gallery.isChecked)
                vm.activeIdsList.push(gallery._id);
            return gallery;
        });  
        changeStatus(vm.activeIdsList, status);
    }
}