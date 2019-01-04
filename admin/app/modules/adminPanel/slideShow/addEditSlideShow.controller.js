'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('AddEditSlideShowController', AddEditSlideShowController);

AddEditSlideShowController.$inject = ['$log', '$state', 'toastr', 'AdminService', '$stateParams', '$q', '$uibModal', '$scope', 'commonService'];
function AddEditSlideShowController($log, $state, toastr, AdminService, $stateParams, $q, $uibModal, $scope, commonService) {
	// initialize core components of jQuery plugins(bootstrap-switch)
	$scope.$on('$viewContentLoaded', function () {
		App.initAjax();
	});

	var vm = this;
	vm.disable = false;
	vm.slideShowId = $stateParams.slideShowId;
	vm.saveSlideShow = saveSlideShow;
	vm.slideShow = {};
	vm.getSubCategory = getSubCategory;
	vm.openAddModal = openAddModal;
	vm.addPhoto = addPhoto;
	vm.removeSlideShowItem = removeSlideShowItem;
	vm.subCategoryList = [];
	vm.addImagePhotoGallery = addImagePhotoGallery;
	vm.removeImagePhotoGallery = removeImagePhotoGallery;
	vm.slideShow.publishSlideShow = true;
	var redirectFlagValue;
	var service;
	vm.galleryImageIds = [];
	vm.galleryImagePath = [];
	/* List selected sub-categories IDs */
	vm.models = [];
	vm.slideShow.slideShowImages = [{ title: '', image: '' }]
	if (vm.slideShowId !== undefined && vm.slideShowId !== '' && vm.slideShowId !== null) {
		vm.typeTitle = "Edit";
		getSlideShowInfo();
	} else {
		vm.typeTitle = "Add New";
		vm.isSectionLoaded = true; // Flag to load html only after retieving Section Info to initialize bootstrap-switch and other js plugins based on data
		vm.slideShow.metaTag = [];
		vm.slideShow.metaKeywords = [];
	}
	/* Reset form after submission */
	function reset() {
		vm.slideShow = {};
		// vm.addSlideShowForm.$setPristine();
	}

	getMainCategories();

	/* Get slide Show info by Id to edit slide Show */
	function getSlideShowInfo() {
		vm.isSectionLoaded = false;
		App.startPageLoading({ animate: true });
		AdminService.slideShow().get({ slideShowId: vm.slideShowId }, function (response) {
			if (response) {
				vm.slideShow = response.data;
				if (vm.slideShow.publishScheduleTime)
					vm.slideShow.publishScheduleTime = moment(new Date(vm.slideShow.publishScheduleTime));
				/* Make categories selected based on retrieved values */
				// categories array : first id will be main category id and remaining ids will be sub-category ids
				/* If existing catId found inActive on edit slide Show, than append that ID and its info in vm.subCategoryList(Get subCategories API retrieve only active categories) */
				if (vm.slideShow.categories && vm.slideShow.categories.length > 0) {
					getSelectedSubCategoryInfo();
				}
				vm.isSectionLoaded = true;
			}
			App.stopPageLoading();
		});
	}

	function saveSlideShow(method, redirectFlag) {
		//slideImageValidation
		redirectFlagValue = redirectFlag;
		if (vm.slideShow.slideShowImages) {
			var count = 0;
			vm.slideShow.slideShowImages.forEach(function (imageInfo) {
				if (!imageInfo.image) {
					count++;
				}
			})
			if (count > 0) {
				vm.addSlideShowForm.$setValidity('slideImageValidation', false);
			} else {
				vm.addSlideShowForm.$setValidity('slideImageValidation', true);
			}
		} else {
			vm.addSlideShowForm.$setValidity('slideImageValidation', false);
		}
		if (vm.addSlideShowForm.$valid) {
			vm.disable = true;
			vm.slideShow.categories = [] /* Save all category Ids as an array */
			if (vm.parentId !== '' && vm.parentId !== null) {
				vm.slideShow.categories.push(vm.parentId);
				if (vm.models.length > 0) {
					vm.models = vm.models.filter(function (val) { return val !== null });
					vm.slideShow.categories = vm.slideShow.categories.concat(vm.models);
				}
				if (!vm.slideShow.publishSlideShow) {
					vm.slideShow.publishScheduleTime = moment(new Date(vm.slideShow.publishScheduleTime));
				}
			}

			if (method == 'Add') {
				service = AdminService.slideShow().save(vm.slideShow, successCallback);
			}
			else if (method == 'Update') {
				service = AdminService.slideShow().update({ slideShowId: vm.slideShowId }, vm.slideShow, successCallback);
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
			if (vm.galleryImageIds !== undefined && vm.galleryImageIds.length > 0) {
				AdminService.removeGalleryImage().delete({ galleryImageIds: JSON.stringify(vm.galleryImageIds), pathArr: JSON.stringify(vm.galleryImagePath) }, function (status) {
					if (redirectFlagValue === false) {
						$state.go("root.slideShowList", { pageId: 1 });
					}
					if (redirectFlagValue === true) {
						vm.slideShow = {};
						$state.go("root.addSlideShow");
					}
				});
			}
			if (redirectFlagValue === false) {
				$state.go("root.slideShowList", { pageId: 1 });
			}
			if (redirectFlagValue === true) {
				vm.slideShow = {};
				$state.go("root.addSlideShow");
			}
		}
	}
	/* Get Sub photo Categories */
	function getSubCategory(parentCatId, isMainCategory, index, init) {
		var deferred = $q.defer();
		if (isMainCategory) {
			vm.subCategoryList = [] // Reload subCat array on change of main category
			if (!init) {
				vm.models = []; // Reset sub category models on Main category selection.
			}
		}
		if (index + 1 < vm.subCategoryList.length) {
			vm.subCategoryList.splice(index + 1)  // Reload child subCat array on change of parent subCat 
			vm.models.splice(index + 1)
		}
		AdminService.subCategories().get({ sort: 'name', parentCatId: parentCatId, isActive: true, type: 'photo' }, function (response) {
			vm.subCategoryList.push({ label: 'Sub Category', list: response.data.list, model: "subCat" + index })
			return deferred.resolve(response.data.list)
		})
		return deferred.promise;
	}
	/* Get Main photo categories */
	function getMainCategories() {
		AdminService.categories().get({ sort: 'name', type: 'photo', isActive: true }, function (response) {
			if (response.code == 200) {
				vm.mainCategoryList = response.data;
			}
		})
	}

	function openAddModal(index) {
		var modalInstance = $uibModal.open({
			templateUrl: 'modules/adminPanel/slideShow/slideShowImage/addImage.view.html',
			controller: 'AddSlideShowImageController',
			controllerAs: 'vm',
			backdrop: 'static',
		});

		modalInstance.result.then(function (result) {
			if (result && result.success) {
				angular.forEach(vm.slideShow.slideShowImages, function (value, key) {
					if (index == key)
						value.image = result.croppedImage;
				});
			}
		},
			function (err) {
				console.info('Modal dismissed at: ' + new Date());
			});
	}

	function addPhoto() {
		if (vm.slideShow.slideShowImages !== undefined) {
			vm.slideShow.slideShowImages.push({ title: '', image: '' });
		} else {
			vm.slideShow.slideShowImages = [];
			vm.slideShow.slideShowImages.push({ title: '', image: '' });
		}

	}
	function removeSlideShowItem(index) {
		var galleryImageId = vm.slideShow.slideShowImages[index]._id;
		var path = vm.slideShow.slideShowImages[index].image;
		vm.slideShow.slideShowImages.splice(index, 1);
		vm.galleryImageIds.push(galleryImageId);
		vm.galleryImagePath.push(path);

	}
	/* If existing catId found inActive on edit slideShow, than append that ID and its info in vm.subCategoryList(Get subCategories API retrieve only active categories) */
	function getSelectedSubCategoryInfo() {
		/* Get selected categories info */
		AdminService.getCategoryListInfo().get({ categoryIdList: JSON.stringify(vm.slideShow.categories) }, function (catListInfoObj) {
			if (catListInfoObj) {
				var lastIndex = vm.slideShow.categories.length - 1;
				/* Get Sub categories */
				getSubCategoriesLoop(vm.slideShow.categories);
				function getSubCategoriesLoop(categories) {
					var counter = 0;
					function next() {
						if (counter < categories.length) {
							var index = counter;
							counter++;
							var isMainCategory, subCatIndex, init;
							if (index > 0) {
								isMainCategory = false;
								init = false;
								subCatIndex = index;
							} else if (index == 0) {
								isMainCategory = true;
								init = true;
								subCatIndex = '';
							}
							getSubCategory(categories[index], isMainCategory, subCatIndex, init).then(function (subCategoryList) {
								var isSubCategoryfound = false;
								var isMainCategoryFound = false;
								if (index > 0) {
									vm.models.push(categories[index])
								} else if (index == 0) {
									vm.parentId = categories[index]// If already selected id is inactive, than retrieve its info
								}

								if (subCategoryList.length > 0) {
									subCategoryList.forEach(function (subCatItem) {
										if (subCatItem._id == categories[index + 1]) {
											isSubCategoryfound = true;
										}
									})
								}
								vm.mainCategoryList.forEach(function (mainCategory) {
									if (mainCategory._id == vm.parentId) {
										isMainCategoryFound = true;
									}
								});

								catListInfoObj.data.forEach(function (catInfo) {
									if (!isSubCategoryfound && categories[index + 1]) {
										if (catInfo._id == categories[index + 1]) {
											vm.subCategoryList[vm.subCategoryList.length - 1].list.push(catInfo)
										}
									}
									if (index == 0 && !isMainCategoryFound && categories[index]) {
										if (catInfo._id == categories[index]) {
											vm.mainCategoryList.push(catInfo);
										}
									}
								})
								next();
							});
						}
					}
					next();
				}
			}
		});
	}
	function addImagePhotoGallery(slideInfo) {
		AdminService.addImagePhotoGallery().update({ slideShowId: vm.slideShowId, imageId: slideInfo._id, isGalleryImage: true }, function (response) {
			if (response.code == 200) {
				commonService.successToastr(response.message);
			} else {
				commonService.errorToastr(response.message);
			}
			getSlideShowInfo();
		})

	}
	function removeImagePhotoGallery(slideInfo) {
		AdminService.addImagePhotoGallery().update({ slideShowId: vm.slideShowId, imageId: slideInfo._id, isGalleryImage: false }, function (response) {
			if (response.code == 200) {
				commonService.successToastr(response.message);
			} else {
				commonService.errorToastr(response.message);
			}
			getSlideShowInfo();
		})

	}
}
