'use strict';
angular.module('gujaratSamachar.main')
    .controller('recentNewsListController', recentNewsListController);

recentNewsListController.$inject = ['mainService', '$stateParams', '$filter', '$state', '$q', 'AdService', 'sectionFlagDataService', 'GENERAL_CONFIG'];

function recentNewsListController(mainService, $stateParams, $filter, $state, $q, AdService, sectionFlagDataService, GENERAL_CONFIG) {
    var vm = this;
    var sectionFlags;
    var listPageId = parseInt($stateParams.id);
    var pageIndex = $stateParams.pageIndex;
    vm.article = {};
    vm.typeName = "Recent"
    vm.articlesLoaded = false;
    // vm.metaTag = $stateParams.metaTag;
    vm.date = $stateParams.date;
    vm.pageChanged = pageChanged;
    vm.openDate = openDate;
    //vm.topReadNews = [];
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
        $state.go("root.mainSidebar.recentNewsList", obj);
    }

    // Auto set date-picker value if date value found in request parameter
    if (vm.date !== undefined && vm.date !== null && vm.date !== "") {
        vm.article.date = new Date(vm.date)
    }

    function getRecentNewsList(pageNum) {
        var pageIndex ;
        if (!pageNum && pageNum == null && pageNum == "") {
            pageIndex = 0;
        } else {
            pageIndex = pageNum;
        }
        sectionFlagDataService.sectionFlags().then(function(response) {
            sectionFlags = response;
            var reqParam = {
                sectionId: sectionFlags.recentNews._id,
                type: sectionFlags.recentNews.value,
                pageIndex: pageIndex,
            }
            if (vm.date !== undefined) {
                reqParam['publishDate'] = vm.date;
            }
            mainService.getAllRecentNews().get(reqParam, function(response) {
                vm.recentNews = response.data.articles;
                vm.totalCount = response.data.totalCount;
                vm.pageSize = response.data.articlePerPage;
                if (vm.recentNews.length > 0) {
                    vm.recentNews = $filter('imagePathFilter')(vm.recentNews);
                }
                 vm.recentNews = vm.recentNews.map(function(recentNews){
                    if(!recentNews.categorySlug)
                        recentNews.slug = recentNews.magazineSlug;
                    else
                        recentNews.slug = recentNews.categorySlug;
                    return recentNews;
                })
                vm.articlesLoaded = true;
            });
        });
    }
    getRecentNewsList(pageIndex);
};