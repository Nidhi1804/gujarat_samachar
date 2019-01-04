'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('CategoryListController', CategoryListController);

CategoryListController.$inject = ['$log', '$scope', 'AdminService', 'toastr', '$uibModal', '$stateParams', '$state', '$location', 'commonService'];
function CategoryListController($log, $scope, AdminService, toastr, $uibModal, $stateParams, $state, $location, commonService) {
	var vm              = this;
	vm.categoryList     = [];
	vm.deleteCategory   = deleteCategory;
	vm.changeStatus     = changeStatus;
	vm.resetFilter      = resetFilter;
	vm.parentId         = $stateParams.parentId;
	vm.breadcrumbList   = [];
	vm.searchCategory   = searchCategory;
	vm.searchText       = $location.search().searchText;
	vm.categoryType     = $location.search().type;
	vm.categoryTypeList = [
		{name:'All', value:''},
		{name:'Article Categories', value:'article'},
		{name:'Photo Categories', value:'photo'},
		{name:'Video Categories', value:'video'},
	]
	if(vm.parentId && vm.parentId!== '' && vm.parentId !== null){
		/* Get Sub category list */
		vm.typeTitle = "Sub Category";
		getSubCategoryInfo();
	}else{
		vm.typeTitle = "Category"
		/* Get Main category list */
		getMainCategories();
	}
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

	vm.categoryList.sort(function (a, b) {
		return a.i > b.i;
	});
	
	function onUpdateSort(e, ui){
		angular.forEach(vm.categoryList, function(city, key){
			city.position = key + 1;
		});
		AdminService.sortCategory().update({categoryList : vm.categoryList},function(response){
			if (response.code == 200) {
				commonService.successToastr(response.message);
			}
		});
	}

	/* Get Category Breadcrumb */
	getBreadcrumb();

	function searchCategory(){
		$state.go("root.categoryList" , {searchText : vm.searchText, type:vm.categoryType}); 
	}

	function resetFilter() {
		vm.searchText = "";
		if(vm.categoryType) {
			vm.categoryType = "";
		}
		searchCategory();
	}

	function getMainCategories(pageNumber){
		vm.showLoader = true;
		App.startPageLoading({animate: true});
		AdminService.categories().get({searchText : vm.searchText, type:vm.categoryType, sort: 'position'},function(response){
			if(response.code == 200 ){
				vm.categoryList = response.data;
				vm.categoryList = vm.categoryList.map(function(category){
					if(category.type == "photo")
						category.catType = "Photo Gallery";
					if(category.type == "video")
						category.catType = "Video Gallery";
					if(category.type == "article")
						category.catType = "Article";
					return category;
				});
			}
			vm.showLoader = false;
			App.stopPageLoading();
		})
	}

	function getSubCategoryInfo(){
		vm.showLoader = true;
		vm.categoryList = []
		App.startPageLoading({animate: true});
		AdminService.subCategories().get({parentCatId:vm.parentId }, function(response){
			if(response.code == 200 ){
				vm.categoryList     = response.data.list;
				vm.mainCategoryName = response.data.mainCategory;
				vm.categoryList = vm.categoryList.map(function(category){
					if(category.type == "photo")
						category.catType = "Photo Gallery";
					if(category.type == "video")
						category.catType = "Video Gallery";
					if(category.type == "article")
						category.catType = "Article";
					return category;
				});
			}
			vm.showLoader = false;
			App.stopPageLoading();
		})
	}

	/* Delete selected category */
	function deleteCategory(size, categoryId) {
		$scope.confirmMsg = "Are you sure want to permanently delete selected category?";
		var deleteUserInstance = $uibModal.open({
			templateUrl: 'partial-views/confirm-modal/confirm-modal.view.html',
			controller: 'confirmModalController as vm',
			scope:$scope
		});
		deleteUserInstance.result.then(function (result) {
			if(result){
				App.startPageLoading({animate: true});
				AdminService.categories().delete({categoryId: categoryId},function(response){
					if(response.code == 200 ){
						toastr.success(response.message, "", {
							closeButton: true,
							timeOut: 3000,
							preventOpenDuplicates: true
						});
						if(vm.parentId && vm.parentId!== '' && vm.parentId !== null){
							/* Get Sub category list */
							getSubCategoryInfo();
						}else{
							/* Get Main category list */
							getMainCategories();
						}
					}
					App.stopPageLoading();
				})
			}
		},
		function (err) {
			console.info('Modal dismissed at: ' + new Date());
		});
	}

	function changeStatus(categoryId, status){
		var statusText;
		if(status == 0) statusText = 'Inactive';
		if(status == 1) statusText = 'Activate';
		$scope.confirmMsg = "Are you sure want to "+statusText+" selected category?";
		var changeStatusInstance = $uibModal.open({
			templateUrl: 'partial-views/confirm-modal/confirm-modal.view.html',
			controller: 'confirmModalController as vm',
			scope:$scope
		});
		changeStatusInstance.result.then(function (result) {
			if(result){
				AdminService.changeCategoryStatus().save({categoryId: categoryId, status:status},function(response){
					if(response.code == 200 ){
						toastr.success(response.message, "", {
							closeButton: true,
							timeOut: 3000,
							preventOpenDuplicates: true
						});
						if(vm.parentId && vm.parentId!== '' && vm.parentId !== null){
							/* Get Sub category list */
							getSubCategoryInfo();
						}else{
							/* Get Main category list */
							getMainCategories();
						}
					}
				})
			}
		},
		function (err) {
			console.info('Modal dismissed at: ' + new Date());
		});
	}

	/* Get Category Breadcrumb */
	function getBreadcrumb(){
		AdminService.categoryBreadCrumb().get({parentCatId:vm.parentId}, function(response){
			if(response.code == 200 ){
				vm.breadcrumbList = response.data;
				vm.breadcrumbList.reverse();
				vm.backPage = vm.breadcrumbList[vm.breadcrumbList.length - 2];
			}
			App.stopPageLoading();
		})
	}
}