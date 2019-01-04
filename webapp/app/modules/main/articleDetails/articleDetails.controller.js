'use strict';
angular.module('gujaratSamachar.main')
    .controller('ArticleDetailsController', ArticleDetailsController);

ArticleDetailsController.$inject = ['$q','AdService','$transitions','mainService', '$stateParams', '$filter', 'GENERAL_CONFIG', '$scope', '$rootScope', 'metaService', '$timeout', '$state'];

function ArticleDetailsController($q,AdService,$transitions, mainService, $stateParams, $filter, GENERAL_CONFIG, $scope, $rootScope, metaService, $timeout, $state) {
    var vm = this;
    let articleId = $stateParams.articleId;
    let baseUrl = GENERAL_CONFIG.app_base_url;
    let metaTagArr = [];
    let url = $stateParams.articleUrl;
    let categorySlug = $stateParams.categorySlug;
    let metaKeywordsString;
    vm.articleUrl = baseUrl + '/news/' + categorySlug + "/" + url;
    vm.sportsSlideConfig = angular.copy(GENERAL_CONFIG.slickSliderConfig);
    vm.entertainmentSlideConfig = angular.copy(GENERAL_CONFIG.slickSliderConfig);
    $rootScope.metaservice = metaService;
    // Icon for share via wahts app will show only in mobile
    if (navigator.userAgent.toString().search('Android') >= 0 || navigator.userAgent.toString().search('iPhone') >= 0) {
        vm.isMobile = true;
    } else {
        vm.isMobile = false;
    }

    var today = new Date();
    var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    vm.magazineSlug = ['ravi-purti','business-plus','sahiyar','shatdal','dharmlok','chitralok','zagmag','gujarat-samachar-plus'];
    var adLeftParam = {
        startDate: startDate,
        endDate: endDate,
        isArticle: true
    }
    var isMagazineDetail = false;
    if(vm.magazineSlug.includes($stateParams.categorySlug) == false){
        adLeftParam['slug'] = $stateParams.categorySlug;
        adLeftParam['pageType'] = 'category';
    }else{
        adLeftParam['magazineSlug'] = $stateParams.categorySlug;
        adLeftParam['pageType'] = 'magazine';
        isMagazineDetail = true;
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
    function getArticleDetails() {
        mainService.articleDetails().get({ categorySlug: categorySlug, articleUrl: url, articleId: articleId }, function(response) {
            if (response && response.code == 404) {
                $state.go("root.404");
            } else {
                $rootScope.detailArticleUrl = response.data.article[0].articleUrl;
                vm.categorySlug = response.data.slug;
                vm.article = response.data.article;
                if (vm.article.length > 0) {
                    vm.article = $filter('imagePathFilter')(vm.article)[0];
                }
                vm.articleLoaded = true;
                var articleImage = vm.article.baseUrl + '/' + vm.article.articleImage;
                if (vm.article.metaKeywords !== undefined && vm.article.metaKeywords.length > 0) {
                    metaKeywordsString = Object.keys(vm.article.metaKeywords).map(function(k) {
                        metaTagArr.push(vm.article.metaKeywords[k].name)
                        return vm.article.metaKeywords[k].name
                    }).join(", ");
                } else {
                    metaKeywordsString = {};
                }
                $rootScope.metaservice.set(vm.article.metaTitle, vm.article.metaDescriptions, metaKeywordsString, articleImage,vm.article.heading);
                $state.current.data.pageTitle = vm.article.heading + " | ";

                // Pass Categories to MainSidebarController to get right sidebar advertises.
                $timeout(function() {
                    //  controller is being initialized before 'headerAdvertise' directive. so unable to catch $on after $emit. So delay $emit by 1 Second to catch value inside directive.
                    $scope.$emit('articleCategories', vm.categorySlug, isMagazineDetail); // Broadcast categories to get advertise in right-sidebar. Article detail page will show advertise based on article Main Category.
                }, 100);
                $scope.$emit('articleMetaTags', metaTagArr); // Broadcast MetaTags to get related articles in right-sidebar

                var postParam = JSON.stringify({
                    "longUrl": vm.articleUrl
                });
                /* google serive call to get short url */
                var urlData = mainService.googleUrlShortener().save(postParam, function(res) {
                    vm.article.linkUrl = res.id;
                });

                vm.jsonIdNewsArticle = {
                    "@context": "http://schema.org",
                    "@type": "NewsArticle",
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": $rootScope.currentUrl
                    },
                    "headline": vm.article.heading,
                    "image": {
                        "@type": "ImageObject",
                        "url": vm.article.baseUrl + "/" + vm.article.articleImage,
                        "height": "630px",
                        "width": "354px"
                    },
                    "datePublished": vm.article.publishScheduleTime,
                    "publisher": {
                        "@type": "Organization",
                        "name": "Gujarat Samachar",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "http://gujaratsamachar.com:4444/assets/images/logo.png",
                            "width": "247px",
                            "height": "94px"
                        }
                    },
                    "description": vm.article.description,
                    "keywords": vm.article.metaKeywords,
                    "articleBody": vm.article.content
                }

                vm.jsonIdArticle = {
                    "@context": "http://schema.org",
                    "@type": "Article",
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": $rootScope.currentUrl
                    },
                    "headline": vm.article.heading,
                    "image": {
                        "@type": "ImageObject",
                        "url": vm.article.baseUrl + "/" + vm.article.articleImage,
                        "height": "630px",
                        "width": "354px"
                    },
                    "datePublished": vm.article.publishScheduleTime,
                    "publisher": {
                        "@type": "Organization",
                        "name": "Gujarat Samachar",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "http://gujaratsamachar.com:4444/assets/images/logo.png",
                            "width": "247px",
                            "height": "94px"
                        }
                    },
                    "description": vm.article.description,
                    "keywords": vm.article.metaKeywords,
                    "articleBody": vm.article.content
                }
            }
        });
    }


    getArticleDetails();
    $transitions.onSuccess({}, function($transitions) {
        vm.currentState = $state.current.name;
        if($transitions.params().articleUrl)
            $rootScope.detailArticleUrl = $transitions.params().articleUrl;
    });


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
            if(vm.magazineSlug.includes($stateParams.categorySlug) == false){
                getParams['slug'] = $stateParams.categorySlug;
                getParams['pageType'] = 'category';
            }else{
                getParams['magazineSlug'] = $stateParams.categorySlug;
                getParams['pageType'] = 'magazine';
            }
            getParams['isArticle'] = true;
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
