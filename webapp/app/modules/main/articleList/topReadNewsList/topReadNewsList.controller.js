'use strict';
angular.module('gujaratSamachar.main')
    .controller('TopReadNewsListController', TopReadNewsListController);

TopReadNewsListController.$inject = ['mainService', '$stateParams', '$filter', '$state', '$q', 'AdService', 'sectionFlagDataService', 'GENERAL_CONFIG'];

function TopReadNewsListController(mainService, $stateParams, $filter, $state, $q, AdService, sectionFlagDataService, GENERAL_CONFIG) {
    var vm = this;
    var sectionFlags;
    var listPageId = parseInt($stateParams.id);
    var pageIndex = $stateParams.pageIndex;
    vm.article = {};
    vm.typeName = "Top Read"
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
        $state.go("root.mainSidebar.topReadNewsList", obj);
    }

    // Auto set date-picker value if date value found in request parameter
    if (vm.date !== undefined && vm.date !== null && vm.date !== "") {
        vm.article.date = new Date(vm.date)
    }

    function getTopReadNewsList(pageNum) {
        sectionFlagDataService.sectionFlags().then(function(response) {
            sectionFlags = response;
            var reqParam = {
                sectionId: sectionFlags.topReadNews._id,
                type: sectionFlags.topReadNews.value,
                pageIndex: pageIndex,
            }
            if (vm.date !== undefined) {
                reqParam['publishDate'] = vm.date;
            }
            mainService.getAllTopReadNews().get(reqParam, function(response) {
                vm.topReadNews = response.data.articles;
                vm.totalCount = response.data.totalCount;
                vm.pageSize = response.data.articlePerPage;
                if (vm.topReadNews.length > 0) {
                    vm.topReadNews = $filter('imagePathFilter')(vm.topReadNews);
                }
                 vm.topReadNews = vm.topReadNews.map(function(topReadNews){
                    if(!topReadNews.categorySlug)
                        topReadNews.slug = topReadNews.magazineSlug;
                    else
                        topReadNews.slug = topReadNews.categorySlug;
                    return topReadNews;
                })
                vm.articlesLoaded = true;
            });
        });
    }
    getTopReadNewsList(pageIndex);
};