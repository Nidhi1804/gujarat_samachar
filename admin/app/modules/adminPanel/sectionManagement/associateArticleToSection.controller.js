'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('AssociateArticleToSectionController', AssociateArticleToSectionController);

AssociateArticleToSectionController.$inject = ['$scope', 'GENERAL_CONFIG', 'AdminService', 'commonService', 'localStorageService', '$q', '$uibModalInstance'];

function AssociateArticleToSectionController($scope, GENERAL_CONFIG, AdminService, commonService, localStorageService, $q, $uibModalInstance) {
	var vm = this;
	vm.articleList = [];
	vm.getArticles = getArticles;
	vm.pageChanged = pageChanged;
	vm.pageId = 1;
	vm.searchArticle = searchArticle;
	vm.pagination = {
		current: vm.pageId
	};
	vm.toggleCheckBox = toggleCheckBox;
	vm.checkAllBox = checkAllBox;
	vm.addSelectedArticles = addSelectedArticles;
	vm.selectedArticleList = [];
	vm.cities = [];
	vm.sections = [];
	vm.getSubCategory = getSubCategory;
	/* Get current login user details */
	getLoginUser();
	/* Get main category list */
	getMainCategories();
	/* Get Article List */
	getArticles(vm.pageId);
	/* Get cities */
	getCities();
	/* Get Magazines */
	getMagazines();
	/* Get Sections */
	getSections();
	vm.subCategoryList = [];
	/* List selected sub-categories IDs */
	vm.models = [];
	
	/* Get Sub Categories */
	function getSubCategory(parentCatId, isMainCategory, index, init) {
		var deferred = $q.defer();
		if (!parentCatId) {
			return deferred.resolve([]);			// If parentId not found than resolve blank subcategory array.
		}
		if (isMainCategory) {
			vm.subCategoryList = [] // Reload subCat array on change of main category
			if (!init) {
				vm.models = []; // Reset sub category models on Main category selection.
			}
		}
		if (index + 1 < vm.subCategoryList.length) {
			vm.subCategoryList.splice(index + 1) // Reload child subCat array on change of parent subCat
			vm.models.splice(index + 1)
		}
		AdminService.subCategories().get({
			sort: 'name',
			parentCatId: parentCatId,
			isActive: true,
			type: 'article'
		}, function (response) {
			if (response && response.data && response.data.list && response.data.list.length) {
				vm.subCategoryList.push({
					list: response.data.list,
					model: "subCat" + index
				})
				if (vm.subCategoryList && vm.subCategoryList.length && vm.subCategoryList[0].list && vm.subCategoryList[0].list.length) {
					vm.subCategoryList[0].list.unshift({
						"_id": "",
						"name": "All",
						"slug": "",
						"isActive": true,
						"count": 1
					});
				}
			}
			return deferred.resolve(vm.subCategoryList);
		})
		return deferred.promise;
	}
	/*Get Login user Details */
	function getLoginUser() {
		let getUserDetails = localStorageService.getLoggedInUserInfo();
		let userDetails = JSON.parse(getUserDetails);
		let loginUserGroup = userDetails.userGroup;
		if (loginUserGroup !== 'Administrator') {
			vm.reporter = userDetails.userId;
			vm.reporterList = []; // If User not admin than hide reporter list dropdown
		} else {
			/* Get reporters list */
			getUsers();
		}
	}

	/* Get articles based on selected page number */
	function pageChanged(newPage) {
		getArticles(newPage);
	}

	function searchArticle() {
		getArticles(vm.pagination.current);
	}

	function getMainCategories() {
		AdminService.categories().get({
			sort: 'name',
			type: 'article',
			isActive: true
		}, function (response) {
			if (response.code == 200) {
				vm.mainCategoryList = response.data;
				vm.mainCategoryList.unshift({
					"_id": "",
					"name": "All",
					"slug": "",
					"isActive": true,
					"count": 1
				});
			}
		})
	}

	function getCities() {
		let getCities = AdminService.cities().get({}, function (res) {
			if (res && res.data && res.data.length) {
				vm.cities = res.data;
				vm.cities.unshift({
					"_id": "",
					"name": "All",
					"isActive": true
				});
			}
		});
	}

	function getMagazines() {
		let getMagazines = AdminService.magazines().get({}, function (res) {
			if (res && res.data && res.data.length) {
				vm.magazines = res.data;
				vm.magazines.unshift({
					"_id": "",
					"name": "All",
					"isActive": true
				});
			}
		});
	}

	function getSections() {
		let getSections = AdminService.sections().get({}, function (res) {
			if (res && res.data.sections && res.data.sections.length) {
				vm.sections = res.data.sections;
				vm.sections = vm.sections.filter(item => {
				    return item._id != $scope.selectedSection;
				});
				vm.sections.unshift({
					"_id": "",
					"title": "All",
					"isActive": true
				});
			}
		});
	}
	function getUsers() {
		AdminService.user().get({
			userGroup: 'Editor'
		}, function (response) {
			if (response.code == 200) {
				vm.reporterList = response.data.userList;
				vm.reporterList = vm.reporterList.map(function (reporter) {
					reporter.fullName = reporter.firstName + ' ' + reporter.lastName;
					return reporter;
				});
				vm.reporterList.unshift({
					"_id": "",
					"fullName": "All"
				})
			}
		})
	}

	function getArticles(pageNumber) {
		vm.selectedArticleList = [];
		vm.isArticleLoaded = false;
		App.startPageLoading({
			animate: true
		});
		var articleService, getParam;
		if (vm.sectionId && vm.sectionId !== 'all') {
			articleService = AdminService.articleBySection(); // Get articles based on sectionFlag
			getParam = {
				pageIndex: pageNumber,
				searchText: vm.searchText,
				reporter: vm.reporter,
				category: vm.category,
				city: vm.city,
				magazine: vm.magazine,
				subCategory: vm.subCategory,
				sectionId: vm.sectionId
			};
		} else {
			articleService = AdminService.articles(); // Get all articles
			getParam = {
				pageIndex: pageNumber,
				searchText: vm.searchText,
				reporter: vm.reporter,
				category: vm.category,
				city: vm.city,
				magazine: vm.magazine,
				subCategory: vm.subCategory,
				section: vm.section,
				selectedSection: $scope.selectedSection
			};
		}
		articleService.get(getParam, function (response) {
			if (response.code == 200) {
				vm.isArticleLoaded = true;
				vm.articlesPerPage = response.data.articlesPerPage;
				vm.totalArticles = response.data.totalArticles;
				vm.articleList = response.data.articles;
				if (response.data.articles.length > 0) {
					vm.articleList = vm.articleList.map(function (article) {
						if (article.articleImage) {
							var uploadFolder = article.articleImage.split("/")[0];
							if (uploadFolder == "uploads")
								article.baseUrl = "http://www.gujaratsamachar.com"; //baseUrl for old admin panel articles
							else
								article.baseUrl = GENERAL_CONFIG.app_base_url + '/articles/articles_thumbs'; //baseUrl for new admin panel articles
						} else {
							article.baseUrl = GENERAL_CONFIG.app_base_url;
							article.articleImage = GENERAL_CONFIG.errorImagePath;
						}
						return article;
					})
				} else {
					if (vm.pageId > 1)
						getArticles(1);
				}
			}
			App.stopPageLoading();
		})
	}
	
	function toggleCheckBox(id, isChecked) {
		if (isChecked) {
			vm.selectedArticleList.push(id);
		} else {
			var index = vm.selectedArticleList.indexOf(id)
			vm.selectedArticleList.splice(index, 1);
		}
		if (vm.selectedArticleList.length == vm.articleList.length) {
			vm.selectAll = true;
		} else {
			vm.selectAll = false
		}
	}

	function checkAllBox() {
		vm.selectedArticleList = [];
		if (vm.selectedArticleList.length == vm.articleList.length || !vm.selectAll) {
			vm.articleList = vm.articleList.map(function (article) {
				article.isChecked = false;
				return article;
			});
		} else {
			if (vm.selectAll) {
				vm.articleList = vm.articleList.map(function (article) {
					article.isChecked = true;
					vm.selectedArticleList.push(article._id);
					return article;
				});
			}
		}
	}

	function addSelectedArticles(articleIds) {
		vm.selectedArticleList = [];
		vm.articleList.map(function (article) {
			if (article.isChecked)
				vm.selectedArticleList.push(article._id);
			return article;
		});
		$uibModalInstance.close(vm.selectedArticleList);
	}

	vm.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	};
}