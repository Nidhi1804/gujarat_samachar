'use strict';
angular.module('gujaratSamachar.main')
    .controller('articleByMagazine', articleByMagazine);

articleByMagazine.$inject = ['$rootScope','GENERAL_CONFIG','$q','AdService','mainService', '$stateParams', '$filter', '$state'];

function articleByMagazine($rootScope,GENERAL_CONFIG,$q,AdService, mainService, $stateParams, $filter, $state) {
    var vm = this;
    vm.magazine = {};
    vm.getMagazineList = getMagazineList;
    vm.slug = $stateParams.slug;
    vm.pageIndex = $stateParams.pageIndex;
    vm.date = $stateParams.date;
    vm.pageChanged = pageChanged;
    vm.openDate = openDate;
    vm.dateOption = {
        maxDate: new Date(),
        startingDay: 1,
        showWeeks: false
    }
    if (vm.date && vm.date !== undefined && vm.date !== null) {
        vm.magazine.date = new Date(vm.date)
    }


    function openDate() {
        vm.openDate.opened = true;
    }
    vm.pagination = {
        current: vm.pageIndex
    };

    function pageChanged(pageObj) {
        var obj = {};
        obj['pageIndex'] = pageObj.pageIndex;
        if (pageObj.date !== undefined) {
            obj['date'] = $filter('date')(pageObj.date, 'yyyy-MM-dd')
        } else {
            obj['date'] = '';
        }
        $state.go("root.mainSidebar.articleByMagazine", obj);
    }

    function getMagazineList(pageNum) {
        var findObj = {};
        if (!pageNum && pageNum == null && pageNum == "") {
            findObj['pageIndex'] = 0;
        } else {
            findObj['pageIndex'] = pageNum;
        }
        findObj['slug'] = vm.slug;
        if (vm.date !== undefined) {
            findObj['publishDate'] = vm.date;
        }
        mainService.magazineList().get(findObj, function(response) {
            if (response.code == 404) {
                $state.go("root.404");
            } else {
                mainService.magazineName().get({ slug: vm.slug }, function(magazineName) {
                    if (magazineName.data.length > 0) {
                        vm.magazineName = magazineName.data[0].name;
                    } else {
                        vm.magazineName = "";
                    }
                    vm.totalCount = response.data.totalCount;
                    vm.pageSize = response.data.magazinePerPage;
                    vm.magazineList = response.data.documents;
                    if (vm.magazineList.length > 0) {
                        vm.magazineList = $filter('imagePathFilter')(vm.magazineList);
                    }
                    vm.magazineListLoaded = true;
                    $state.current.data.pageTitle = "Magazines - " + vm.magazineName + " | ";
                });
            }
        });
    }
    getMagazineList(vm.pageIndex);
    function getLeftSideAdvertis(){
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var adLeftParam = {
            startDate: startDate,
            endDate: endDate,
            pageType: 'magazine',
            magazineSlug: $stateParams.slug
        }
        var promises = {
            adLeftSide: AdService.getLeftPanelAd().get(adLeftParam).$promise
        }
        $q.all(promises).then(function(responses) {
            if (responses.adLeftSide.data && responses.adLeftSide.data.length > 0) {
                vm.adLeftSide = responses.adLeftSide.data;
                angular.forEach(vm.adLeftSide, function(adLeftSide, key) {
                    if (adLeftSide.fileType == 'Image') {
                        adLeftSide.imageUrl = GENERAL_CONFIG.image_base_url + '/' + adLeftSide.image;
                    }
                });
            } else {
                vm.adLeftSide = ''
            }
        });
    }
    
    getLeftSideAdvertis();

    if($rootScope.isMobile){
        var cleanupArticleCategories;
        checkCurrentState($state.current.name, $stateParams.slug, $stateParams.listType)

        function checkCurrentState(currentState, slug, listType) {
            var getParams = {};
            /*Sending today date from client side because of Timezone issue*/
            var today = new Date();
            var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            getParams['startDate'] = startDate;
            getParams['endDate'] = endDate;
            vm.magazineSlug = ['ravi-purti','business-plus','sahiyar','shatdal','dharmlok','chitralok','zagmag','gujarat-samachar-plus'];
        
            if (currentState == 'root.mainSidebar.articleByMagazine') {
                getParams['pageType'] = 'magazine';
                getParams['magazineSlug'] = slug;
            }
            getMobileAdvertise(getParams);
        }
        function getMobileAdvertise(getParams){
            AdService.getMainSectionMobileAd().get(getParams, function (response) {
                if (response.data && response.data.length > 0 ) {
                    vm.mobileAd = response.data;
                    angular.forEach(vm.mobileAd,function(advertise, index) {
                        if(advertise.fileType == 'Image') {
                            advertise.imageUrl = GENERAL_CONFIG.image_base_url + '/' + advertise.image;
                        }
                    });
                } else {
                    vm.mobileAd = ''
                }
            })
        }
    }
};