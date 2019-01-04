'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('AddEditCityController', AddEditCityController);

AddEditCityController.$inject = ['$log', '$state', 'toastr', 'GENERAL_CONFIG', 'AuthService', 'AdminService', '$stateParams'];
function AddEditCityController($log, $state, toastr, GENERAL_CONFIG, AuthService, AdminService, $stateParams) {
	var vm = this;
	vm.city = {}
	vm.addCity = addCity;
	vm.cityId = $stateParams.cityId;
	vm.updateCity = updateCity;
	
	/* If page in edit mode */
	if (vm.cityId && vm.cityId !== '' && vm.cityId !== null) {
		vm.typeTitle = "Edit"
		getCategoryInfo();
	} else {
		vm.typeTitle = "Add New"
	}
	/* Reset form after submission */
	function reset() {
		vm.addEditCityForm.$setPristine();
	}

	/* Add Main Category */
	function addCity(isValid, redirectFlag) {
		if (isValid) {
			AdminService.cities().save(vm.city, function (response) {
				if (response.code == 200) {
					toastr.success(response.message, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					reset();
					if (redirectFlag === false) {
						$state.go('root.cityList');
					}
					else {
						$state.go($state.current, {}, {reload: true});
					}
				}
			})
		}
	}

	function getCategoryInfo() {
		AdminService.cities().get({ cityId: vm.cityId }, function (response) {
			if (response.data.length > 0) {
				vm.city = response.data[0];
				vm.noDataText = false;
			} else {	
				vm.noDataText = response.message;
			}
		});
	}

	function updateCity(isValid, redirectFlag) {
		if (isValid) {
			AdminService.cities().update({ cityId: vm.cityId }, vm.city, function (response) {
				if (response.code == 200) {
					toastr.success(response.message, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					if (redirectFlag === false) {
						$state.go('root.cityList');
					}
					else {
						reset();
						$state.go('root.addCity');
					}
				}
			});	
		}
	}
}