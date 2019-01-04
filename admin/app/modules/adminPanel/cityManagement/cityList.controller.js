'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('CityListController', CityListController);

CityListController.$inject = ['$log', '$scope', 'AdminService', '$state', '$location', 'commonService'];
function CityListController($log, $scope, AdminService, $state, $location, commonService) {
	var vm = this;
	vm.searchCity = searchCity;
	vm.searchText = $location.search().searchText;
	vm.changeStatus = changeStatus;
	vm.toggleCheckBox = toggleCheckBox;
	vm.cityList = vm.cityList;
	vm.checkAllBox = checkAllBox;
	vm.activeSelectedCities = activeSelectedCities;
	vm.cityList = [];

	vm.sortableOptions = {
		'ui-floating': true,
		'stop': onUpdateSort,
		helper: function(e, tr) {
			// Adjust table tr, td width for UI Sortable
			var $originals = tr.children();
			var $helper = tr.clone();
			$helper.children().each(function(index)
			{
				// Set helper cell sizes to match the original sizes
				$(this).outerWidth($originals.eq(index).outerWidth());
			});
			return $helper;
		}
	}
	vm.cityList.sort(function (a, b) {
		return a.i > b.i;
	});
	vm.sortingLog = [];	
	
	function onUpdateSort(e, ui){
		angular.forEach(vm.cityList, function(city, key){
			city.position = key + 1;
		});
		AdminService.sortCity().update({cityList : vm.cityList},function(response){
			if (response.code == 200) {
				commonService.successToastr(response.message);
			}
		});
	}

	function searchCity() {
		$state.go("root.cityList" , {searchText : vm.searchText}); 
	}

	getCities();

	function getCities() {
		AdminService.cities().get({searchText : vm.searchText, sort: 'position'},function(response){
			if(response.code == 200 ){
				vm.cityList = response.data;
				vm.selectAll = false;
			}
			vm.showLoader = false;
			App.stopPageLoading();
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
		AdminService.changeCityStatus().update({ idList: JSON.stringify(vm.activeIdsList) }, { isActive: status }, function (response) {
			if (response.code == 200) {
				vm.idList = [];
				commonService.successToastr(response.message);
			}
			getCities();
		});
	}

	function toggleCheckBox(id, isChecked) {
		if (isChecked) {
			vm.idList.push(id);
		} else {
			var index = vm.idList.indexOf(id)
			vm.idList.splice(index, 1);
		}
		if (vm.idList.length == vm.cityList.length) {
			vm.selectAll = true;
		}
		else {
			vm.selectAll = false
		}
	}

	function checkAllBox() {
		vm.idList = [];
		if (vm.idList.length == vm.cityList.length || !vm.selectAll) {
			vm.cityList = vm.cityList.map(function (article) {
				article.isChecked = false;
				return article;
			});
		}
		else {
			if (vm.selectAll) {
				vm.cityList = vm.cityList.map(function (article) {
					article.isChecked = true;
					vm.idList.push(article._id);
					return article;
				});
			}
		}
	}
	
	function activeSelectedCities(articleIds, status) {
		vm.activeIdsList = [];
		vm.cityList.map(function (article) {
			if (article.isChecked)
				vm.activeIdsList.push(article._id);
			return article;
		});
		changeStatus(vm.activeIdsList, status);
	}
}
