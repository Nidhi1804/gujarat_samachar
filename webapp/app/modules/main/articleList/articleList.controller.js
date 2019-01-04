'use strict';
angular.module('gujaratSamachar.main')
    .controller('ArticleListController', ArticleListController);

ArticleListController.$inject = ['$rootScope','$transitions', 'mainService', '$stateParams', '$filter', '$state', '$q', 'AdService', 'GENERAL_CONFIG'];

function ArticleListController($rootScope,$transitions, mainService, $stateParams, $filter, $state, $q, AdService, GENERAL_CONFIG) {
    var vm = this;
    let Id = parseInt($stateParams.Id);
    let slug = $stateParams.slug;
    let currentState = $state.current.name; 
    var pageIndex = $stateParams.pageIndex;
    vm.typeName = "";
    vm.article = {};
    vm.date = $stateParams.date;
    vm.pageChanged = pageChanged;
    vm.openDate = openDate;
    vm.articles = [];
    vm.dateOption = {
        maxDate: new Date(),
        startingDay: 1,
        showWeeks: false
    }
    /* Article List Type : category / city  */
    var listType = $stateParams.listType;
    vm.pageType = listType

    function openDate() {
        vm.openDate.opened = true;
    }

    vm.pagination = {
        current: pageIndex
    };

    function pageChanged(pageObj) {
        var obj = {};
        obj['pageIndex'] = pageObj.pageIndex;
        if (pageObj.date !== undefined) {
            obj['date'] = $filter('date')(pageObj.date, 'yyyy-MM-dd')
        } else {
            obj['date'] = '';
        }
        $state.go("root.mainSidebar.articleList", obj);
    }
    if (vm.date !== undefined && vm.date !== null && vm.date !== "") {
        vm.article.date = new Date(vm.date)
    }

    function getArticleList(pageNum) {
        var findObj = {};
        if (!pageNum && pageNum == null && pageNum == "") {
            findObj['pageIndex'] = 0;
        } else {
            findObj['pageIndex'] = pageNum;
        }
        if (vm.date !== undefined) {
            findObj['publishDate'] = vm.date;
        }
        /* Set API param and service based on listType */
        var service;
        var getListTypeInfo;
        var typeObj = {};
        if (listType == 'category') {
            findObj['listType'] = listType;
            findObj['slug'] = slug;
            typeObj = findObj;
            service = mainService.getArticleList();
            getListTypeInfo = mainService.getCategory();
        }
        if (listType == 'city') {
            findObj['listType'] = listType;
            findObj['slug'] = slug;
            typeObj['slug'] = slug;
            typeObj['collectionName'] = 'Cities'; //DB Collection name
            service = mainService.getArticleList();
            getListTypeInfo = mainService.getCityInfoBySlug();
        } else {
            findObj['slug'] = slug;
            typeObj = findObj;
            service = mainService.getArticleList();
            getListTypeInfo = mainService.getCategory();
        }
        var promises = {
            articleList: service.get(findObj).$promise
        }
        promises['typeInfo'] = getListTypeInfo.get(typeObj).$promise;
        $q.all(promises).then(function(responses) {
            if (responses && responses.articleList.code == 404) {
                $state.go("root.mainSidebar.home");
            } else {
                if (responses && responses.articleList && responses.articleList.data) {
                    var articles = responses.articleList.data.articles;
                    vm.totalCount = responses.articleList.data.totalCount;
                    vm.pageSize = responses.articleList.data.articlePerPage;
                    if (articles.length > 0) {
                        for (var index in articles) {
                            vm.articles.push($filter('imagePathFilter')(articles)[index]);
                        }
                    }
                }
                if (responses.typeInfo && responses.typeInfo.data && responses.typeInfo.data.length > 0) {
                    vm.typeName = responses.typeInfo.data[0].name;
                    vm.categoryListType = responses.typeInfo.data[0].listType;
                }
                $state.current.data.pageTitle = vm.typeName + (vm.typeName.indexOf("News") == -1 ? " News | " : " | " );
                vm.articlesLoaded = true;
                vm.articles = vm.articles.map(function(artice){
                    if(!artice.categorySlug)
                        artice.slug = artice.magazineSlug;
                    else
                        artice.slug = artice.categorySlug;
                    return artice;
                });
            }
        });
    }
    getArticleList(pageIndex);

    function getLeftSideAdvertis(){
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var adLeftParam = {
            startDate: startDate,
            endDate: endDate,
            pageType: vm.pageType
        }
        if(vm.pageType == 'city')
            adLeftParam['citySlug'] = $stateParams.slug;
        else
            adLeftParam['slug'] = $stateParams.slug;

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
            if (currentState == 'root.mainSidebar.articleList') {
                if (listType == 'city') {
                    getParams['citySlug'] = slug;
                    getParams['pageType'] = 'city';
                } else {
                    getParams['slug'] = slug;
                    getParams['pageType'] = 'category';
                }
                getMobileAdvertise(getParams);
            }
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