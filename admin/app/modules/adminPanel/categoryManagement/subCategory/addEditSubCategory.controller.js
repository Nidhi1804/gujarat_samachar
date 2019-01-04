'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('AddEditSubCategoryController', AddEditSubCategoryController);

AddEditSubCategoryController.$inject = ['localStorageService', 'Upload', '$log', '$state', 'toastr', 'GENERAL_CONFIG', 'AuthService', 'AdminService', '$stateParams'];
function AddEditSubCategoryController(localStorageService, Upload, $log, $state, toastr, GENERAL_CONFIG, AuthService, AdminService, $stateParams) {
	var vm = this;
	var url;
	var method;
	vm.category = {};
	var loggedInUserInfo = JSON.parse(localStorageService.getLoggedInUserInfo());
	vm.addCategory = addCategory;
	vm.categoryId = $stateParams.categoryId;
	vm.updateSubCategory = updateSubCategory;
	vm.getSubCategory = getSubCategory;
	vm.category.listType = 'all';
	vm.getMainCategories = getMainCategories;
	vm.removethisIcon = removethisIcon;
	vm.subCategoryList = [];

	vm.subCategoryList = []
	vm.hideMainCategory = false;
	vm.mainCategoryList = [];
	/* List selected sub-categories IDs */
	vm.models = [];

	/* If page in edit mode */
	if (vm.categoryId && vm.categoryId !== '' && vm.categoryId !== null) {
		vm.typeTitle = "Edit";
		getCategoryInfo();
		method = 'PUT';
        url = GENERAL_CONFIG.app_base_url + '/api/categories/' + vm.categoryId;
	} else {
		vm.typeTitle = "Add New";
		getMainCategories();
		method = 'POST';
        url = GENERAL_CONFIG.app_base_url + '/api/categories';
	}

	/* Get category list on select of category type */
	function getMainCategories(isActive) {
		AdminService.categories().get({ sort: 'name', type: 'article', isActive: isActive }, function (response) {
			if (response.code == 200) {
				vm.mainCategoryList = response.data;
			}
		})
	}

	/* Reset form after submission */
	function reset() {
		vm.addSubCatFrm.$setPristine();
	}

	/* Get Main Category/Sub Category info on edit mode. */
	function getCategoryInfo() {
		AdminService.categories().get({ categoryId: vm.categoryId }, function (response) {
			if (response.data.length > 0) {
				vm.category = response.data[0];
				if(vm.category.type == 'article') {
					vm.category.listType = "all";
				}				
				if (response.data[0].parentId !== '0') {
					var parentId = response.data[0].parentId
					vm.models.push(parentId); // Model value for selected sub categories					
					/* Get parent Info */
					AdminService.categories().get({ categoryId: parentId }, function (parentInfo) {
						if (parentInfo.data[0].parentId === 0) {
							vm.parentId = parentId;
							vm.hideMainCategory = false;
							getMainCategories(false);
						} else {
							vm.hideMainCategory = true
							AdminService.subCategories().get({ parentCatId: parentInfo.data[0].parentId }, function (subCatResOnj) {
								if (subCatResOnj.code == 200 && subCatResOnj.data.list.length > 0) {
									vm.subCategoryList.push({ label: 'Sub Category', list: subCatResOnj.data.list, model: "subCat" + 1 })
								}
							})
						}
					})
				}
				vm.noDataText = false;
			} else {
				vm.noDataText = response.message;
			}
		});
	}

	function addCategory(isValid, redirectFlag) {
		if (isValid) {
			if (vm.models.length == 0) {
				var parentId = vm.parentId;
			}
			else {
				var parentId = vm.models[vm.models.length - 1];
			}
			vm.invalidForm = false;
			var category = {
				parentId: parentId, 
				name: vm.category.name, 
				type: 'article', 
				listType: vm.category.listType,
				icon: vm.category.icon
			};
			Upload.upload({
            url: url,// Based on add/edit operation
            method: method,
            headers: {
                'Authorization': 'Bearer ' + loggedInUserInfo.token
            },
            data: category
        }).then(function (response) {
        	var response = response.data;
            if (response.code == 200) {
				toastr.success(response.message, "", {
					closeButton: true,
					timeOut: 3000,
					preventOpenDuplicates: true
				});
				vm.category = {}
				if (redirectFlag === false) {
					$state.go('root.subCategoryList', { parentId: vm.parentId })
				}
				else {
					reset();
					$state.go('root.addSubCategory')
				}
			} else {
				getMainCategories(true)
			}
        }, function (response) {
            console.log('Error status: ' + response);
        });
		} else {
			vm.invalidForm = true;
		}
	}
	function updateSubCategory(isValid, redirectFlag) {
		if (isValid) {
			AdminService.categories().update({ categoryId: vm.categoryId }, vm.category, function (response) {
				if (response.code == 200) {
					toastr.success(response.message, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					if (redirectFlag === false) {
						$state.go('root.subCategoryList', { parentId: vm.parentId })
					}
					else {
						reset();
						$state.go('root.addSubCategory')
					}
				}
			});
		}
	}

	/* Get Sub Categories */
	function getSubCategory(parentCatId, isMainCategory, index) {
		if(index == undefined){			
			if (isMainCategory) {
				vm.subCategoryList = [] // Reload subCat array on change of main category
			}
			if (index + 1 < vm.subCategoryList.length) {
				vm.subCategoryList.splice(index + 1)  // Reload child subCat array on change of parent subCat 
			}
			AdminService.subCategories().get({ isActive: true, parentCatId: parentCatId, type: 'article' }, function (response) {
				if (response.code == 200 && response.data.list.length > 0) {
					vm.subCategoryList.push({ label: 'Sub Category', list: response.data.list, model: "subCat" + index })
				}
			})
		}
	}

	function removethisIcon(){
		vm.category.icon = '';	
	}

}