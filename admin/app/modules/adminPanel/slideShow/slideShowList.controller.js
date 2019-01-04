'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('SlideShowController', SlideShowController);

SlideShowController.$inject = ['$log', '$scope', '$state', 'toastr', 'GENERAL_CONFIG', 'AuthService', 'AdminService', '$uibModal', '$stateParams', '$location'];
function SlideShowController($log, $scope, $state, toastr, GENERAL_CONFIG, AuthService, AdminService, $uibModal, $stateParams, $location) {
	var vm = this;
	vm.slideShowList = [];
	vm.pageChanged = pageChanged;
	vm.pageId = $stateParams.pageId;
	vm.searchSlideShow = searchSlideShow;
	vm.toggleCheckBox = toggleCheckBox;
	vm.checkAllBox = checkAllBox;
	vm.deleteSingleSlideShow = deleteSingleSlideShow;
	vm.deleteSelectedSlideShowes = deleteSelectedSlideShowes;
	vm.changeStatus = changeStatus;
	vm.deleteIdList = [];
	vm.pagination = {
		current: vm.pageId
	};
	vm.searchText = $location.search().searchText;
	vm.category = $location.search().category;

	vm.resetFilter = resetFilter;

	/* Get slide show category list */
	getMainCategories();

	/* Get slide show list */
	getSlideShowList(vm.pageId);

	/* Get slide show based on selected page number */
	function pageChanged(newPage) {
		$state.go("root.slideShowList", { pageId: newPage });
	}

	function searchSlideShow() {
		$state.go("root.slideShowList", { pageId: vm.pageId, searchText: vm.searchText, reporter: vm.reporter, category: vm.category });
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
		searchSlideShow();
	}

	function getMainCategories() {
		AdminService.categories().get({ sort: 'name', type: 'photo', isActive: true }, function (response) {
			if (response.code == 200) {
				vm.mainCategoryList = response.data;
				vm.mainCategoryList.unshift({ "_id": "", "name": "All", "slug": "", "isActive": true, "count": 1 });
			}
		})
	}

	function getSlideShowList(pageNumber) {
		vm.showLoader = true;
		App.startPageLoading({ animate: true });
		AdminService.slideShow().get({ pageIndex: pageNumber, searchText: vm.searchText, category: vm.category }, function (response) {
			if (response.code == 200) {
				if (response.data.slideShowes.length > 0) {
					vm.itemsPerPage = response.data.slideShowesPerPage;
					vm.totalItems = response.data.totalSlideShowes;
					vm.slideShowList = response.data.slideShowes;
					vm.slideShowList = vm.slideShowList.map(function (slideShow) {
						slideShow.isChecked = false;
						return slideShow;
					});
				} else {
					vm.slideShowList = [];
					if (vm.pageId > 1)
						$state.go("root.slideShowList", { pageId: 1 });
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
		if (vm.deleteIdList.length == vm.slideShowList.length) {
			vm.selectAll = true;
		}
		else {
			vm.selectAll = false
		}
	}

	function checkAllBox() {
		vm.deleteIdList = [];
		if (vm.deleteIdList.length == vm.slideShowList.length || !vm.selectAll) {
			vm.slideShowList = vm.slideShowList.map(function (slideShow) {
				slideShow.isChecked = false;
				return slideShow;
			});
		}
		else {
			if (vm.selectAll) {
				vm.slideShowList = vm.slideShowList.map(function (slideShow) {
					slideShow.isChecked = true;
					vm.deleteIdList.push(slideShow._id);
					return slideShow;
				});
			}
		}
	}

	function deleteSingleSlideShow(slideShowId) {
		vm.deleteIdList = [];
		vm.deleteIdList.push(slideShowId);
		deleteSlideShow()
	}

	function deleteSelectedSlideShowes(slideShowIds) {
		vm.deleteIdList = [];
		vm.slideShowList.map(function (slideShow) {
			if (slideShow.isChecked)
				vm.deleteIdList.push(slideShow._id);
			return slideShow;
		});
		deleteSlideShow()
	}

	function deleteSlideShow() {
		AdminService.slideShow().remove({ slideShowIds: JSON.stringify(vm.deleteIdList) }, function (response) {
			if (response.code == 200) {
				toastr.success(response.message, "", {
					closeButton: true,
					timeOut: 3000,
					preventOpenDuplicates: true
				});
				vm.deleteIdList = [];
				getSlideShowList(vm.pageId);
			}
		})
	}
	function changeStatus(slideShowId, status) {
		AdminService.changeSlideShowStatus().update({ slideShowId: slideShowId }, { slideShowStatus: status }, function (response) {
			if (response.code == 200) {
				toastr.success(response.message, "", {
					closeButton: true,
					timeOut: 3000,
					preventOpenDuplicates: true
				});
				getSlideShowList(vm.pageId);
			}
		})
	}
}