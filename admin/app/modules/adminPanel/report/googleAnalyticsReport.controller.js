(function(){
	'use strict';
	angular.module('gujaratSamachar.adminPanel')
	    .controller('googleAnalyticsReportController', googleAnalyticsReportController);

	googleAnalyticsReportController.$inject = ['$log', 'AdminService', '$state', '$q', 'commonService', 'GENERAL_CONFIG'];
	function googleAnalyticsReportController($log, AdminService, $state, $q, commonService, GENERAL_CONFIG) {
		const vm = this;
		vm.webAppBaseUrl = GENERAL_CONFIG.webaApp_base_url;
		let displaySubCategory = false;
	    let subCategoryArrList;
	    let allMainCategoryList;
	    let allSubCategoryList = [];
	    vm.isArticleLoaded = true;
	    vm.totalArticles = 0;
		vm.pageIndex = 1;
	    vm.pagination = {
	        current: vm.pageIndex
	    };

	    vm.mainCategoryList = [];
	    vm.subCategoryList = [];
	    vm.articleList = [];

	    vm.getSubCategory = getSubCategory;
	    vm.getArticles = getArticles;
	    vm.pageChanged = pageChanged;
	    vm.searchArticles = searchArticles;
	    vm.updateStartDateConfig = updateStartDateConfig;
	    vm.updateEndDateConfig = updateEndDateConfig;
	    vm.openStartDate = openStartDate;
	    vm.openEndDate = openEndDate;
	    vm.getSelectedCategory = getSelectedCategory;
	    vm.resetFilter = resetFilter;

	    vm.dateOption = {
	        startingDay: 1,
	        showWeeks: false
	    };
	    vm.dateOptionsStartDate = {
	        startingDay: 1,
	        minDate: "2018-08-13"
	    }
	    vm.dateOptionsEndDate = {
	        startingDay: 1
	    }
	    function openStartDate() {
	        vm.openStartDate.opened = true;
	    }
	    function openEndDate() {
	        vm.openEndDate.opened = true;
	    }
	    /* Update max-date of From date on selection of To Date */
	    function updateStartDateConfig() {
	        vm.dateOptionsStartDate.maxDate = vm.endDate;
	    }
	    /* Update min-date of To date on selection of From Date */
	    function updateEndDateConfig() {
	        vm.dateOptionsEndDate.minDate = vm.startDate;
	    }
	    //Search By Form Submit
	    function searchArticles() {
	    	vm.pagination = {
		        current: vm.pageIndex
		    };
	    	getArticles(vm.pagination.current);
	    }

	    function resetFilter() {
	        if(vm.parentId) {
	            vm.parentId = '';
	        }
	        if(vm.subCategoryId) {
	            vm.subCategoryId = '';
	        }
	        vm.startDate = "";
	        vm.endDate = "";
	        searchArticles();
	    }

	    /* Get users based on selected page number */
	    function pageChanged(newPage) {
	    	getArticles(vm.pagination.current);
	    }
	    var promises = {
	        usersPromise: AdminService.user().get({userGroup: 'Editor'}).$promise,
	        mainCategoriesPromise: AdminService.categories().get({ sort: 'name', type: 'article', isActive: true }).$promise
	    }
	    $q.all(promises).then(function (responses) {
	        if (responses.usersPromise.data) {
	            vm.userNameList = responses.usersPromise.data.userList;
	            vm.userNameList = vm.userNameList.map(function (user) {
	                user.fullName = user.firstName + ' ' + user.lastName;
	                return user;
	            });
	            vm.userNameList.unshift({ _id: "", fullName: "Select User" });
	        }
	        if (responses.mainCategoriesPromise.data && vm.userId !== "") {
	            vm.mainCategoryList = responses.mainCategoriesPromise.data;
	            vm.mainCategoryList.unshift({ _id: "", name: "All Category" });
	            allMainCategoryList = vm.mainCategoryList;
	        }
	    }, function (error) {
	        $log.log(error);
	    });

	    /* Get Main Category based on selected user */
	    function getSelectedCategory() {
	        var deferred = $q.defer();
	        if (vm.userId !== undefined && vm.userId !== null && vm.userId !== "") {
	            var findObj = {
	                userId: vm.userId
	            };
	            AdminService.getSelectedCategory().get(findObj, function (response) {
	                if (response.data !== undefined && response.data !== null && response.data !== "") {
	                    if (response.data.mainCategoryArr !== undefined && response.data.mainCategoryArr.length > 0) {
	                        var mainList = allMainCategoryList;
	                        var mainCategoryArr = response.data.mainCategoryArr;
	                        vm.mainCategoryList = [];
	                        //Compare mainCategory with response mainCategory
	                        //Display only Active Category
	                        for (var i in mainList) {
	                            var index = mainCategoryArr.indexOf(mainList[i]._id);
	                            if (index > -1) {
	                                if (vm.mainCategoryList.length > 0) {
	                                    var index2 = vm.mainCategoryList.indexOf(mainList[i]._id);
	                                    if (index2 === -1) {
	                                        vm.mainCategoryList.push(mainList[i]);
	                                    }
	                                } else {
	                                    vm.mainCategoryList.push(mainList[i]);
	                                }
	                            }
	                        }
	                        vm.mainCategoryList.unshift({ _id: "", name: "All Category" });
	                        var subCatArr = [];
	                        if (response.data.subCategoryArr !== undefined && response.data.subCategoryArr.length > 0) {
	                            subCategoryArrList = response.data.subCategoryArr;
	                            displaySubCategory = true;
	                        }
	                    } else {
	                        vm.mainCategoryList = [];
	                    }
	                    $state.go($state.current, { reload: true });
	                    return deferred.resolve(true);
	                }
	            });
	        }
	        return deferred.promise;
	    }

	    /* Get Sub Categories */
	    function getSubCategory(parentCatId, isMainCategory, index, init) {
	    	var deferred = $q.defer();
	        if (parentCatId !== undefined && parentCatId !== "") {
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
	            if (vm.models.length > 0) {
	                vm.subCategoryId = vm.models[0]
	            }
	            if (parentCatId !== undefined && parentCatId !== "" && parentCatId !== null) {
	                AdminService.subCategories().get({ sort: 'name', parentCatId: parentCatId, isActive: true, type: 'article' }, function (response) {
	                    if (response.data !== undefined && response.data.list !== undefined && response.data.list.length > 0) {
	                        if (vm.subCategoryList.length === 0 && displaySubCategory === false) {
	                            vm.subCategoryList.push({ label: 'Sub Category', list: response.data.list, model: "subCat" + index })
	                        }
	                        // console.log('Get Sub Category List response', response.data.list)
	                        //console.log("subCategoryArrList : ", subCategoryArrList)
	                        if (subCategoryArrList !== undefined && subCategoryArrList.length > 0 && displaySubCategory === true) {
	                            var subCatInfoList = [];
	                            var subList = response.data.list;
	                            //console.log('Sub list', subList)
	                            for (var fIndex in subCategoryArrList) {
	                                if (subCategoryArrList[fIndex].mainCategoryId.toString() === parentCatId.toString()) {
	                                    for (var subIdx in subList) {
	                                        var sidx = subCategoryArrList[fIndex].subCategoryId.indexOf(subList[subIdx]._id);
	                                        if (sidx > -1) {
	                                            subCatInfoList.push(subList[subIdx]);
	                                        }
	                                    }
	                                }
	                            }
	                            // console.log('Sub Category Filster List', subCatInfoList)
	                            if (subCatInfoList.length > 0) {
	                                var obj = { label: 'Sub Category', list: subCatInfoList, model: "subCat" + index };
	                                vm.subCategoryList.push(obj);
	                            }
	                            else {
	                                vm.subCategoryList = [];
	                            }
	                        }
	                        // console.log('subCatInfoList', subCatInfoList)
	                        var index = response.data.list.findIndex(function (res) {
	                            return res._id === vm.subCategoryId
	                        });
	                        if (index === -1) {
	                            vm.subCategoryId = "";
	                        }
	                        return deferred.resolve(response.data.list)
	                    } else {
                    	    vm.subCategoryId = "";
                			vm.subCategoryList = [];
	                        return deferred.resolve([]);
	                    }

	                })
	            }
	            // else {
	            //     vm.subCategoryId = "";
	            //     vm.subCategoryList = [];
	            // }
			} else {
	        	vm.subCategoryId = "";
	            vm.subCategoryList = [];
	        }
	        return deferred.promise;
	    }

	    function getArticles(pageNumber) {
	    	if(!vm.userId){
				commonService.errorToastr('Please Select User');
				return;
	    	}
	        vm.isArticleLoaded = false;
	        App.startPageLoading({ animate: true });
	        if (vm.startDate !== undefined && vm.startDate !== "" && vm.startDate !== null) {
	            vm.startDate = new Date(vm.startDate);
	        }
	        if (vm.endDate !== undefined && vm.endDate !== "" && vm.endDate !== null) {
	            vm.endDate = new Date(vm.endDate);
	        }
	        if (vm.parentId === undefined || vm.parentId === null || vm.parentId === "") {
	            vm.subCategoryId = "";
	        }
	        var findObj = { pageIndex: pageNumber, userId: vm.userId, categoryId: vm.parentId, startDate: vm.startDate, endDate: vm.endDate, subCategoryId: vm.subCategoryId };
	        AdminService.articleReport().save(findObj, response => {
	        	if(response.code == 200 && response.data) {
					vm.articleList = response.data.articles;
					vm.totalArticles = response.data.totalArticles;
                	vm.articlesPerPage = response.data.articlesPerPage;
	        	} else {
	        		vm.articleList = [];
	        		vm.totalArticles = 0;
	        	}
	        	vm.isArticleLoaded = true;
	            App.stopPageLoading();
	        });
	    }
	}
})();