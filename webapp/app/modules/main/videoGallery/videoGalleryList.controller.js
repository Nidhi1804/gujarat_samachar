'use strict';
angular.module('gujaratSamachar.main')
    .controller('VideoGalleryListController', VideoGalleryListController);

VideoGalleryListController.$inject = ['GENERAL_CONFIG','AdService','$rootScope','mainService', '$stateParams', '$filter', '$state'];

function VideoGalleryListController(GENERAL_CONFIG, AdService,$rootScope,mainService, $stateParams, $filter, $state) {
    var vm = this;
    vm.getGalleryList = getGalleryList;
    vm.pageIndex = $stateParams.pageIndex ? $stateParams.pageIndex : 1;
    vm.pageChanged = pageChanged;
    vm.pagination = {
        current: vm.pageIndex
    };

    function pageChanged(pageObj) {
        var obj = {};
        obj['pageIndex'] = pageObj.pageIndex;
        $state.go("root.mainSidebar.videoGalleryList", obj);
    }

    function getGalleryList(pageNum) {
        var findObj = {};
        if (pageNum == undefined && pageNum == null && pageNum == "") {
            findObj['pageIndex'] = 0;
        } else {
            findObj['pageIndex'] = pageNum;
        }
        vm.videoGalleryLoaded = false;
        mainService.videoGallery().get(findObj, function(response) {
            if (response.data !== undefined && response.data.videos !== undefined && response.data.videos.length > 0) {
                vm.videoGalleries = response.data.videos;
                vm.totalCount = response.data.totalCount;
                vm.documentsPerPage = response.data.documentsPerPage;
                if (vm.videoGalleries[0].lastModifiedAt !== undefined) {
                    vm.lastModifyDate = vm.videoGalleries[0].lastModifiedAt;
                }
            } else {
                vm.videoGalleries = [];
                vm.totalCount = 0;
            }
            vm.videoGalleryLoaded = true;
        })
    }
    getGalleryList(vm.pageIndex);

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
        
            if (currentState == 'root.mainSidebar.videoGalleryList') {
                getParams['pageType'] = 'video-gallery';
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