'use strict';
angular.module('gujaratSamachar.adminPanel')
    .controller('AdvertiseController', AdvertiseController);

AdvertiseController.$inject = ['GENERAL_CONFIG', '$log', 'AdminService', '$stateParams', '$q', '$state', '$location', 'commonService'];
function AdvertiseController(GENERAL_CONFIG, $log, AdminService, $stateParams, $q, $state, $location, commonService) {

    var vm = this;
    vm.advertiseList = [];
    vm.pageChanged = pageChanged;
    vm.pageIndex = $stateParams.pageIndex;
    vm.searchAdvertise = searchAdvertise;
    vm.pagination = {
        current: vm.pageIndex
    };

    vm.userAgentList = [{_id:'', name:'web'},{_id:'',name:'mobile'}];
    vm.AdvertiseTypeList = [{_id:'1', name:'All'},{_id:'2',name:'Expired'}];
    vm.reverse = false;
    vm.toggleCheckBox = toggleCheckBox;
    vm.deleteAdvertise = deleteAdvertise;
    vm.checkAllBox = checkAllBox;
    vm.deleteSelectedAd = deleteSelectedAd;
    vm.deleteSingleAd = deleteSingleAd;
    vm.pageTypeList = GENERAL_CONFIG.pageType;
    vm.activeSelectedAdvertise = activeSelectedAdvertise;
    vm.deleteIdList = [];
    vm.searchText = $location.search().searchText;
    vm.categoryId = $location.search().categoryId;
    vm.pageType = $location.search().pageType;
    vm.magazineId = $location.search().magazineId;
    vm.cityId = $location.search().cityId;
    vm.userAgent = $location.search().userAgent;
    vm.position = $location.search().position;
    vm.advertiseType = $location.search().advertiseType;
    var positionListWeb = angular.copy(GENERAL_CONFIG.avertisePositions);
    var positionListMobile = angular.copy(GENERAL_CONFIG.avertiseMobilePositions);
    vm.positionList = positionListWeb.concat(positionListMobile);
    vm.changeStatus = changeStatus;
    vm.resetFilter = resetFilter;
    function pageChanged(newPage) {
        $state.go("root.getAdvertiseList", { pageIndex: newPage });
    }
    function searchAdvertise() {
        $state.go("root.getAdvertiseList", { pageIndex: vm.pageIndex, searchText: vm.searchText, categoryId: vm.categoryId, pageType: vm.pageType, magazineId: vm.magazineId, cityId: vm.cityId, userAgent: vm.userAgent, position: vm.position, advertiseType: vm.advertiseType});
    }

    function resetFilter() {
        vm.pageIndex = 1;
        vm.searchText = '';
        if(vm.categoryId) {
            vm.categoryId = '';
        }
        if(vm.magazineId) {
            vm.magazineId = '';
        }
        if(vm.cityId) {
            vm.cityId = '';
        }
        if(vm.position) {
            vm.position = '';
        }
        if(vm.userAgent) {
            vm.userAgent = '';
        }
        if(vm.pageType) {
            vm.pageType = '';
        }
        if(vm.advertiseType){
            vm.advertiseType = '';
        }
        searchAdvertise();
    }

    function toggleCheckBox(id, isChecked) {
        if (isChecked) {
            vm.deleteIdList.push(id);
        } else {
            var index = vm.deleteIdList.indexOf(id)
            vm.deleteIdList.splice(index, 1);
        }
        if (vm.deleteIdList.length == vm.advertiseList.length) {
            vm.selectAll = true;
        }
        else {
            vm.selectAll = false
        }
    }
    function checkAllBox() {
        vm.deleteIdList = [];
        if (vm.deleteIdList.length == vm.advertiseList.length || !vm.selectAll) {
            vm.advertiseList = vm.advertiseList.map(function (advertise) {
                advertise.isChecked = false;
                return advertise;
            });
        }
        else {
            if (vm.selectAll) {
                vm.advertiseList = vm.advertiseList.map(function (advertise) {
                    advertise.isChecked = true;
                    vm.deleteIdList.push(advertise._id);
                    return advertise;
                });
            }
        }
    }
    function deleteSingleAd(advertiseId) {
        vm.deleteIdList = [];
        vm.deleteIdList.push(advertiseId);
        deleteAdvertise()
    }

    function deleteSelectedAd(advertiseIds) {
        vm.deleteIdList = [];
        vm.advertiseList.map(function (advertise) {
            if (advertise.isChecked)
                vm.deleteIdList.push(advertise._id);
            return advertise;
        });
        deleteAdvertise()
    }

    function deleteAdvertise(id) {
        if (id !== undefined && id !== "" && id !== null) {
            vm.deleteIdList = [];
            vm.deleteIdList.push(id);
        }
        AdminService.advertise().remove({ advertiseId: JSON.stringify(vm.deleteIdList) }, function (response) {
            if (response.code == 200) {
                vm.deleteIdList = [];
                commonService.successToastr(response.message);
                getAdvertiseList(vm.pageIndex);
            }
        });
    }
    function activeSelectedAdvertise(advertiseIds, status) {
        //console.log("advertiseIds : ", advertiseIds, status);
        vm.activeIdsList = [];
        vm.advertiseList.map(function (advertise) {
            if (advertise.isChecked)
                vm.activeIdsList.push(advertise._id);
            return advertise;
        });        
        changeStatus(vm.advertiseList, status);
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
        
        AdminService.changeStatus().update({ idList: JSON.stringify(vm.activeIdsList) }, { isActive: status }, function (response) {
            if (response.code == 200) {
                vm.deleteIdList = [];
                commonService.successToastr(response.message);
            }
            getAdvertiseList();
        });
    }
    var promises = {
        mainCategoriesPromise: AdminService.categories().get({ sort: 'name', type: 'article', isActive: true }).$promise,
        magazinesPromise: AdminService.magazines().get().$promise,
        citiesPromise: AdminService.cities().get().$promise,
        subCategoriesPromise: AdminService.subCategories().get({ sort: 'name', type: 'article', isActive: true }).$promise
    }
    $q.all(promises).then(function (responses) {
        if (responses.mainCategoriesPromise.data) {
            vm.mainCategoryList = responses.mainCategoriesPromise.data;
        }
        if (responses.magazinesPromise.data) {
            vm.magazineList = responses.magazinesPromise.data;
        }
        if (responses.citiesPromise.data) {
            vm.citiesList = responses.citiesPromise.data;
        }
        if (responses.subCategoriesPromise.data) {
            vm.subCategoryList = responses.subCategoriesPromise.data;
        }
    }, function (error) {
        $log.log(error);
    });
    function getAdvertiseList() {
        var findQuery = {};
        if (vm.pageIndex !== undefined && vm.pageIndex !== null && vm.pageIndex !== "") {
            findQuery['pageIndex'] = vm.pageIndex;
        }
        if (vm.categoryId !== undefined && vm.categoryId !== null && vm.categoryId !== "") {
            findQuery['categoryId'] = vm.categoryId;
        }
        if (vm.searchText !== undefined && vm.searchText !== null && vm.searchText !== "") {
            findQuery['searchText'] = vm.searchText;
        }
        if (vm.pageType !== undefined && vm.pageType !== null && vm.pageType !== "") {
            findQuery['pageType'] = vm.pageType;
        }
        if (vm.magazineId !== undefined && vm.magazineId !== null && vm.magazineId !== "") {
            findQuery['magazineId'] = vm.magazineId;
        }
        if (vm.cityId !== undefined && vm.cityId !== null && vm.cityId !== "") {
            findQuery['cityId'] = vm.cityId;
        }
        if (vm.userAgent !== undefined && vm.userAgent !== null && vm.userAgent !== "") {
            findQuery['userAgent'] = vm.userAgent;
        }
        if (vm.position !== undefined && vm.position !== null && vm.position !== "") {
            findQuery['position'] = vm.position;
        }
        if (vm.advertiseType !== undefined && vm.advertiseType !== null && vm.advertiseType !== "") {
            findQuery['advertiseType'] = vm.advertiseType;
        }
        AdminService.advertise().get(findQuery, function (response) {
            vm.selectAll = false;
            if (response.data && response.data.advertise !== undefined && response.data.advertise.length > 0) {
                vm.advertiseList = response.data.advertise;
                vm.totalCount = response.data.totalCount;
                vm.advertisePerPage = response.data.advertisePerPage;
            } else {
                vm.advertiseList = [];
                if (vm.pageIndex > 1) {
                    $state.go("root.getAdvertiseList", { pageIndex: 1 });
                }
            }
            vm.isAdvertiseLoaded = true;
        })
    }
    getAdvertiseList();
}