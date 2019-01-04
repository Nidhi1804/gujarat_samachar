'use strict';
angular.module('gujaratSamachar.main')
    .controller('SlideShowController', SlideShowController);

SlideShowController.$inject = ['AdService','$rootScope','GENERAL_CONFIG','mainService', '$stateParams', '$filter', '$state'];

function SlideShowController(AdService,$rootScope,GENERAL_CONFIG, mainService, $stateParams, $filter, $state) {
    var vm = this;
    vm.slideShows = [];
    vm.getSlideShowList = getSlideShowList;
    vm.pageIndex = $stateParams.pageIndex ? $stateParams.pageIndex : 1;
    vm.date = $stateParams.date;
    vm.pageChanged = pageChanged;
    vm.openDate = openDate;
    vm.dateOption = {
        maxDate: new Date(),
        startingDay: 1,
        showWeeks: false
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
        }
        $state.go("root.mainSidebar.slideShow", obj);
    }

    function getSlideShowList(pageNum) {
        var findObj = {};
        if (pageNum == undefined && pageNum == null && pageNum == "") {
            findObj['pageIndex'] = 0;
        } else {
            findObj['pageIndex'] = pageNum;
        }
        if (vm.date !== undefined) {
            findObj['publishDate'] = vm.date;
        }
        mainService.slideShow().get(findObj, function(response) {
            var data = response.data.documents;
            if (data !== undefined && data.length > 0) {
                if (data[0].lastModifiedAt !== undefined) {
                    vm.lastModifyDate = data[0].lastModifiedAt;
                }
                vm.slideShows = $filter('imagePathFilter')(response.data.documents);
                vm.slideShows = $filter('arrayChunk')(vm.slideShows, 3);
                vm.totalCount = response.data.totalCount;
                vm.documentsPerPage = response.data.documentsPerPage;
            }

            vm.slideShowsLoaded = true;
        });
    }
    getSlideShowList(vm.pageIndex);

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
        
            if (currentState == 'root.mainSidebar.slideShow') {
                getParams['pageType'] = 'slide-show';
                getParams['slug'] = '';
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