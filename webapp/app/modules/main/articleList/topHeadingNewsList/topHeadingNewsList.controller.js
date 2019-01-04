'use strict';
angular.module('gujaratSamachar.main')
    .controller('topHeadingNewsListController', topHeadingNewsListController);

topHeadingNewsListController.$inject = ['$rootScope','mainService', '$stateParams', '$filter', '$state', '$q', 'AdService', 'sectionFlagDataService', 'GENERAL_CONFIG'];

function topHeadingNewsListController($rootScope, mainService, $stateParams, $filter, $state, $q, AdService, sectionFlagDataService, GENERAL_CONFIG) {
    var vm = this;
    var sectionFlags;
    var listPageId = parseInt($stateParams.id);
    var pageIndex = $stateParams.pageIndex;
    vm.article = {};
    vm.typeName = "Top Head"
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
        $state.go("root.mainSidebar.topHeadingNewsList", obj);
    }

    // Auto set date-picker value if date value found in request parameter
    if (vm.date !== undefined && vm.date !== null && vm.date !== "") {
        vm.article.date = new Date(vm.date)
    }

    function getTopHeadingNewsList(pageNum) {
        sectionFlagDataService.sectionFlags().then(function(response) {
            sectionFlags = response;
            var topStoryReqParam = {
                sectionId: sectionFlags.topStories._id,
                type: sectionFlags.topStories.value,
                pageIndex: pageIndex,
            }
            var topSubStoryReqParam = {
                sectionId: sectionFlags.topSubStories._id,
                type: sectionFlags.topSubStories.value,
                pageIndex: pageIndex,
            }
            if (vm.date !== undefined) {
                topStoryReqParam['publishDate'] = vm.date;
                topSubStoryReqParam['publishDate'] = vm.date;
            }
            mainService.getAllTopHeadingNews().get(topStoryReqParam, function(response) {
                var topStoryData = response.data.articles;
                var topsStoryTotalCount = response.data.totalCount;
                var topStoryPageSize =  response.data.articlePerPage;
                mainService.getAllTopHeadingNews().get(topSubStoryReqParam, function(response) {
                    var topSubStoryData = response.data.articles;
                    var topSubStoryTotalCount = response.data.totalCount;
                    var topSubStoryPageSize =  response.data.articlePerPage;
                    vm.topHeadingNews = topStoryData.concat(topSubStoryData);
                    vm.totalCount = topsStoryTotalCount + topSubStoryTotalCount;
                    vm.pageSize = topStoryPageSize + topSubStoryPageSize;
                    if (vm.topHeadingNews.length > 0) {
                        vm.topHeadingNews = $filter('imagePathFilter')(vm.topHeadingNews);
                    }
                    vm.topHeadingNews = vm.topHeadingNews.map(function(topHeadingNews){
                        if(!topHeadingNews.categorySlug)
                            topHeadingNews.slug = topHeadingNews.magazineSlug;
                        else
                            topHeadingNews.slug = topHeadingNews.categorySlug;
                        return topHeadingNews;
                    })
                    vm.articlesLoaded = true;
                });
            });
        });
    }
    getTopHeadingNewsList(pageIndex);
};