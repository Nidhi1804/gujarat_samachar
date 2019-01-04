'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('AddEditVideoGalleryController', AddEditVideoGalleryController);

AddEditVideoGalleryController.$inject = ['$log', '$state', 'toastr', 'AdminService', '$stateParams', '$q', '$uibModal', '$scope'];
function AddEditVideoGalleryController($log, $state, toastr, AdminService, $stateParams, $q, $uibModal, $scope) {
	// initialize core components of jQuery plugins(bootstrap-switch)
	$scope.$on('$viewContentLoaded', function () {
		App.initAjax();
	});
	var vm = this;
	vm.disable = false;
	vm.galleryId = $stateParams.galleryId;
	vm.saveGallery = saveGallery;
	vm.gallery = {};
	vm.getSubCategory = getSubCategory;
	vm.addVideo = addVideo;
	vm.removeGalleryItem = removeGalleryItem;
	vm.subCategoryList = [];
	vm.gallery.publishVideoGallery = true;
	var service;
	var flag;


	/* List selected sub-categories IDs */
	vm.models = [];
	vm.gallery.galleryVideos = [{ title: '', videoId: '' }]

	if (vm.galleryId && vm.galleryId !== '' && vm.galleryId !== null) {
		vm.typeTitle = "Edit";
		getGalleryInfo();
	} else {
		vm.typeTitle = "Add New";
		vm.isSectionLoaded = true; // Flag to load html only after retieving Section Info to initialize bootstrap-switch and other js plugins based on data
		vm.gallery.metaTag = [];
		vm.gallery.metaKeywords = [];
	}

	/* Reset form after submission */
	function reset() {
		vm.gallery = {};
		vm.addGalleryForm.$setPristine();
	}

	getMainCategories();

	/* Get gallery info by Id to edit gallery */
	function getGalleryInfo() {
		vm.isSectionLoaded = false;
		App.startPageLoading({ animate: true });
		AdminService.videoGallery().get({ galleryId: vm.galleryId }, function (response) {
			if (response) {
				vm.gallery = response.data;
				if (vm.gallery.publishScheduleTime)
					vm.gallery.publishScheduleTime = moment(new Date(vm.gallery.publishScheduleTime));
				/* Make categories selected based on retrieved values */
				// categories array : first id will be main category id and remaining ids will be sub-category ids
				/* If existing catId found inActive on edit gallery, than append that ID and its info in vm.subCategoryList(Get subCategories API retrieve only active categories) */
				if (vm.gallery.categories && vm.gallery.categories.length > 0) {
					getSelectedSubCategoryInfo();
				}
				vm.isSectionLoaded = true;
			}
			App.stopPageLoading();
		});
	}
	function saveGallery(isValid, method, redirectFlag) {
		if (isValid) {
			vm.disable = true;
			flag = redirectFlag;
			vm.gallery.categories = [] /* Save all category Ids as an array */
			if (vm.parentId !== '' && vm.parentId !== null) {
				vm.gallery.categories.push(vm.parentId);
				if (vm.models.length > 0) {
					vm.models = vm.models.filter(function (val) { return val !== null });
					vm.gallery.categories = vm.gallery.categories.concat(vm.models);
				}
				if (!vm.gallery.publishVideoGallery) {
					vm.gallery.publishScheduleTime = moment(new Date(vm.gallery.publishScheduleTime));
				}
			}
			if (method == 'Add') {
				service = AdminService.videoGallery().save(vm.gallery, successCallback);
			}
			else if (method == 'Update') {
				service = AdminService.videoGallery().update({ galleryId: vm.galleryId }, vm.gallery, successCallback);
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
			vm.gallery = {};
			vm.gallery.metaKeywords = [];
			vm.gallery.metaTag = [];
			vm.gallery.categories = [];
			vm.models = [];
			vm.gallery.galleryVideos = [{ title: '', videoId: '' }];
			if (flag === false) {
				$state.go('root.videoGalleryList', { pageId: 1 });
			}
			else {
				reset();
				$state.go('root.addVideoGallery', {}, { reload: true });
			}
		}
	}
	/* Get Sub video Categories */
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
		AdminService.subCategories().get({ sort: 'name', parentCatId: parentCatId, isActive: true, type: 'video' }, function (response) {
			vm.subCategoryList.push({ label: 'Sub Category', list: response.data.list, model: "subCat" + index })
			return deferred.resolve(response.data.list)
		})
		return deferred.promise;
	}
	/* Get Main video categories */
	function getMainCategories() {
		AdminService.categories().get({ sort: 'name', type: 'video', isActive: true }, function (response) {
			if (response.code == 200) {
				vm.mainCategoryList = response.data;
			}
		})
	}

	function addVideo() {
		vm.gallery.galleryVideos.push({ title: '', videoId: '' });
	}

	function removeGalleryItem(index) {
		vm.gallery.galleryVideos.splice(index, 1);
	}
	/* If existing catId found inActive on edit gallery, than append that ID and its info in vm.subCategoryList(Get subCategories API retrieve only active categories) */
	function getSelectedSubCategoryInfo() {
		/* Get selected categories info */
		AdminService.getCategoryListInfo().get({ categoryIdList: JSON.stringify(vm.gallery.categories) }, function (catListInfoObj) {
			if (catListInfoObj) {
				var lastIndex = vm.gallery.categories.length - 1;
				/* Get Sub categories */
				getSubCategoriesLoop(vm.gallery.categories);
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
}
