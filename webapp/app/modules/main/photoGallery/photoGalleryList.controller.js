'use strict';
angular.module('gujaratSamachar.main')
    .controller('PhotoGalleryListController', PhotoGalleryListController);

PhotoGalleryListController.$inject = ['AdService','$rootScope','GENERAL_CONFIG','mainService', '$stateParams', '$filter', '$state', '$log', '$document'];

function PhotoGalleryListController(AdService,$rootScope,GENERAL_CONFIG,mainService, $stateParams, $filter, $state, $log, $document) {
    var vm = this;
    vm.baseUrl = GENERAL_CONFIG.image_base_url + '/slide_show';
    vm.pageIndex = $stateParams.pageIndex;
    vm.getGalleryList = getGalleryList;
    vm.pageChanged = pageChanged;
    vm.previousSlide = previousSlide;
    vm.nextSlide = nextSlide;
    vm.pagination = {
        current: vm.pageIndex
    };

    function pageChanged(newPage) {
        $state.go("root.mainSidebar.photoGallery", { pageIndex: newPage });
    }

    vm.photoGalleryConfig = { 'titleShow': false };
    vm.photoGalleryGroup = {
        'transitionIn': 'none',
        'transitionOut': 'none',
        'titlePosition': 'over',
        'titleFormat': function(title, currentArray, currentIndex, currentOpts) {
            return '<span id="fbplus-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + ' ' + title + '</span>';
        }
    };

    vm.galleryConfig1Loaded = true;
    vm.galleryConfig1 = {
        autoplay: true,
        infinite: true,
        arrows: false,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
        method: {}
    }

    function previousSlide($event, $index) {
        var prevBtn = angular.element(document.querySelectorAll('#arrowBtn'));
        prevBtn.removeClass('active-arrow');
        angular.element($event.currentTarget).addClass("active-arrow");
        vm.galleries[$index].galleryConfig.method.slickPrev()
    }

    function nextSlide($event, $index) {
        var prevBtn = angular.element(document.querySelectorAll('#arrowBtn'));
        prevBtn.removeClass('active-arrow');
        angular.element($event.currentTarget).addClass("active-arrow");
        vm.galleries[$index].galleryConfig.method.slickNext();
    }

    function getGalleryList() {
        var findObj = {};
        if (vm.pageIndex !== undefined && vm.pageIndex !== null && vm.pageIndex !== "") {
            findObj['pageIndex'] = vm.pageIndex;
        } else {
            findObj['pageIndex'] = 1;
        }
        mainService.getGalleryList().get(findObj, function(response) {
            vm.galleries = response.data.images;

            if (vm.galleries.length > 0) {
                for (var index in vm.galleries) {
                    vm.galleries[index].galleryConfig = angular.copy(vm.galleryConfig1);
                    for (var idx in vm.galleries[index]) {
                        var galleries = $filter('imagePathFilter')(vm.galleries[index][idx]);
                    }
                }
                vm.totalCount = response.data.totalCount;
                vm.documentsPerPage = response.data.documentsPerPage;

            }
            vm.galleriesLoaded = true;
        });
    }

    getGalleryList();

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
        
            if (currentState == 'root.mainSidebar.photoGallery') {
                getParams['pageType'] = 'photo-gallery';
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