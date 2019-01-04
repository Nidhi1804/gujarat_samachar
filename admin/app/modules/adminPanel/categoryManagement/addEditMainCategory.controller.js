'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('AddEditCategoryController', AddEditCategoryController);

AddEditCategoryController.$inject = ['localStorageService', 'Upload', '$log', '$state', 'toastr', 'GENERAL_CONFIG', 'AuthService', 'AdminService', '$stateParams'];
function AddEditCategoryController(localStorageService, Upload, $log, $state, toastr, GENERAL_CONFIG, AuthService, AdminService, $stateParams) {
	var vm = this;
	var method;
	var url;
	vm.category = {}
	vm.addMainCategory = addMainCategory;
	vm.categoryId = $stateParams.categoryId;
	vm.category.listType = 'all';
	//vm.updateCategory = updateCategory;
	vm.removethisIcon = removethisIcon;
	var loggedInUserInfo = JSON.parse(localStorageService.getLoggedInUserInfo());

	/* If page in edit mode */
	if (vm.categoryId && vm.categoryId !== '' && vm.categoryId !== null) {
		vm.typeTitle = "Edit"
		getCategoryInfo();
		method = 'PUT';
        url = GENERAL_CONFIG.app_base_url + '/api/categories/' + vm.categoryId;
	} else {
		vm.typeTitle = "Add New"
		method = 'POST';
		vm.category.parentId = 0;
        url = GENERAL_CONFIG.app_base_url + '/api/categories';
	}

	/* Reset form after submission */
	function reset() {
		vm.category = {};
       // vm.parentId = [];
		vm.addMainCatFrm.$setPristine();
	}

	/* Add Main Category */
	function addMainCategory(isValid, redirectFlag) {
		if (isValid) {
			Upload.upload({
	            url: url,// Based on add/edit operation
	            method: method,
	            headers: {
	                'Authorization': 'Bearer ' + loggedInUserInfo.token
	            },
	            data: vm.category
	        }).then(function (response) {
	        	var response = response.data;
	            if (response.code == 200) {
						toastr.success(response.message, "", {
							closeButton: true,
							timeOut: 3000,
							preventOpenDuplicates: true
						});
	            		//reset();
						vm.category = {}
						if (redirectFlag === false) {
							$state.go('root.categoryList');
						}
						else {
							reset();
							$state.go('root.addCategory');
						}
				}    
	        }, function (response) {
	            console.log('Error status: ' + response);
	        });
		} else {
			vm.invalidForm = true;
		}
	}

	function getCategoryInfo() {
		AdminService.categories().get({ categoryId: vm.categoryId }, function (response) {
			if (response.data.length > 0) {
				vm.category = response.data[0];
				if(vm.category.type == 'article') {
					vm.category.listType = "all";
				}
				vm.noDataText = false;
			} else {
				vm.noDataText = response.message;
			}
		});
	}

	function removethisIcon(){
        vm.category.icon = '';
    }
}