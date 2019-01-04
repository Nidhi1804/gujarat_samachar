'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('ArticleListController', ArticleListController);

ArticleListController.$inject = ['$log', '$scope', '$state', 'toastr', 'GENERAL_CONFIG', 'AuthService', 'AdminService', '$uibModal', '$stateParams', '$location', 'commonService', 'localStorageService', '$q'];

function ArticleListController($log, $scope, $state, toastr, GENERAL_CONFIG, AuthService, AdminService, $uibModal, $stateParams, $location, commonService, localStorageService, $q) {
	var vm = this;
	//vm.baseUrl     = GENERAL_CONFIG.app_base_url;
	//vm.baseUrl     = "http://www.gujaratsamachar.com/"
	vm.webAppBaseUrl = GENERAL_CONFIG.webaApp_base_url;
	vm.articleList = [];
	vm.changeStatus = changeStatus;
	vm.getArticles = getArticles;
	vm.deleteArticle = deleteArticle;
	vm.pageChanged = pageChanged;
	vm.pageId = $stateParams.pageId;
	vm.searchArticle = searchArticle;
	vm.pagination = {
		current: vm.pageId
	};
	vm.searchText = $location.search().searchText;
	vm.reporter = $location.search().reporter;
	vm.category = $location.search().category;
	vm.subCategory = $location.search().subCategory;
	vm.sectionId = $location.search().sectionId;
	vm.section = $location.search().section;
	vm.city = $location.search().city;
	vm.magazine = $location.search().magazine;
	vm.toggleCheckBox = toggleCheckBox;
	vm.checkAllBox = checkAllBox;
	vm.deleteSelectedArticles = deleteSelectedArticles;
	vm.deleteSingleArticle = deleteSingleArticle;
	vm.activeSelectedArticles = activeSelectedArticles;
	vm.deleteIdList = [];
	vm.cities = [];
	vm.sections = [];
	vm.getSubCategory = getSubCategory;
	vm.resetFilter = resetFilter;
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
	if (vm.category) {
		getSubCategory(vm.category, true).then(function() {
			if(vm.models.length > 0) {
				getSubCategory(vm.models[0], false, 0)
			}
		});
		if (vm.subCategory) {
			vm.models = Array.isArray(vm.subCategory) ? vm.subCategory : [vm.subCategory];
			// vm.models.push(vm.subCategory);
		}
	}
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
				if (vm.subCategoryList && vm.subCategoryList.length && vm.subCategoryList[0].list && vm.subCategoryList[0].list.length && vm.subCategoryList[0].list[0].name !== "All") {
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
		if (loginUserGroup !== 'Administrator' && loginUserGroup !== 'Manager') {
			vm.reporter = userDetails.userId;
			vm.reporterList = []; // If User not admin than hide reporter list dropdown
		} else {
			/* Get reporters list */
			getUsers();
		}
	}

	/* Get articles based on selected page number */
	function pageChanged(newPage) {
		$state.go("root.articleList.id", {
			pageId: newPage
		});
	}

	function searchArticle() {
		if(vm.models && (vm.models[0] === "" || vm.models[0] === undefined )) {
			vm.models = [];
		}
		$state.go("root.articleList.id", {
			pageId: vm.pageId,
			searchText: vm.searchText,
			reporter: vm.reporter,
			category: vm.category,
			type: vm.sectionId,
			city: vm.city,
			magazine: vm.magazine,
			subCategory: vm.models,
			section: vm.section
		});
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
		if(vm.city) {
			vm.city = '';
		}
		if(vm.magazine) {
			vm.magazine = '';
		}
		if(vm.section) {
			vm.section = '';
		}
		vm.models = [];
		searchArticle();
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
				vm.sections.unshift({
					"_id": "",
					"title": "All",
					"isActive": true
				});
			}
		});
	}
	function getUsers() {
		AdminService.user().get({}, function (response) {
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
				section: vm.section
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
						if (article.publishScheduleTime && article.publishScheduleTime !== '' && article.publishScheduleTime !== null) {
							if (article.publishScheduleTime == "1970-01-01T00:00:00.000Z")
								article.publishScheduleTime = new Date(article.createdAt);
							else
								article.publishScheduleTime = new Date(article.publishScheduleTime);
						}
						if(article.magazineInfo.length > 0)
							article.shareUrl = GENERAL_CONFIG.webaApp_base_url + '/news/' + article.magazineInfo[0].slug + '/' + article.articleUrl;
						else
							article.shareUrl = GENERAL_CONFIG.webaApp_base_url + '/news/' + article.categoryInfo[0].slug + '/' + article.articleUrl;
						return article;
					})
				} else {
					if (vm.pageId > 1)
						$state.go("root.articleList.id", {
							pageId: 1
						});
				}
			}
			App.stopPageLoading();
		})
	}
	/* Delete selected article */
	function deleteArticle(size, articleId) {
		$scope.confirmMsg = "Are you sure want to permanently delete selected article?";
		var deleteUserInstance = $uibModal.open({
			templateUrl: 'partial-views/confirm-modal/confirm-modal.view.html',
			controller: 'confirmModalController as vm',
			scope: $scope
		});
		deleteUserInstance.result.then(function (result) {
			if (result) {
				App.startPageLoading({
					animate: true
				});
				AdminService.articles().delete({
					articleId: articleId
				}, function (response) {
					if (response.code == 200) {
						toastr.success(response.message, "", {
							closeButton: true,
							timeOut: 3000,
							preventOpenDuplicates: true
						});
						/* Update article list */
						getArticles(vm.pageId);
					}
					App.stopPageLoading();
				})
			}
		},
			function (err) {
				console.info('Modal dismissed at: ' + new Date());
			});
	}

	function toggleCheckBox(id, isChecked) {
		if (isChecked) {
			vm.deleteIdList.push(id);
		} else {
			var index = vm.deleteIdList.indexOf(id)
			vm.deleteIdList.splice(index, 1);
		}
		if (vm.deleteIdList.length == vm.articleList.length) {
			vm.selectAll = true;
		} else {
			vm.selectAll = false
		}
	}

	function checkAllBox() {
		vm.deleteIdList = [];
		if (vm.deleteIdList.length == vm.articleList.length || !vm.selectAll) {
			vm.articleList = vm.articleList.map(function (article) {
				article.isChecked = false;
				return article;
			});
		} else {
			if (vm.selectAll) {
				vm.articleList = vm.articleList.map(function (article) {
					article.isChecked = true;
					vm.deleteIdList.push(article._id);
					return article;
				});
			}
		}
	}

	function deleteSingleArticle(articleId) {
		vm.deleteIdList = [];
		vm.deleteIdList.push(articleId);
		deleteArticle()
	}

	function activeSelectedArticles(articleIds, status) {
		vm.activeIdsList = [];
		vm.articleList.map(function (article) {
			if (article.isChecked)
				vm.activeIdsList.push(article._id);
			return article;
		});
		changeStatus(vm.activeIdsList, status);
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
		AdminService.changeArticleStatus().update({
			idList: JSON.stringify(vm.activeIdsList)
		}, {
				isActive: status
			}, function (response) {
				if (response.code == 200) {
					vm.deleteIdList = [];
					commonService.successToastr(response.message);
				}
				getArticles(vm.pageId);
			});
	}

	function deleteSelectedArticles(articleIds) {
		vm.deleteIdList = [];
		vm.articleList.map(function (article) {
			if (article.isChecked)
				vm.deleteIdList.push(article._id);
			return article;
		});
		deleteArticle()
	}

	function deleteArticle() {
		AdminService.articles().remove({
			articleId: JSON.stringify(vm.deleteIdList)
		}, function (response) {
			if (response.code == 200) {
				toastr.success(response.message, "", {
					closeButton: true,
					timeOut: 3000,
					preventOpenDuplicates: true
				});
				vm.deleteIdList = [];
				getArticles(vm.pageId);
			}
		})
	}
}