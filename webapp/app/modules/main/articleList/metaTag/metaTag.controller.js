'use strict';
angular.module('gujaratSamachar.main')
    .controller('metaController', metaController);

metaController.$inject = ['mainService', '$stateParams', '$filter', '$state', '$q', 'AdService', 'GENERAL_CONFIG'];

function metaController(mainService, $stateParams, $filter, $state, $q, AdService, GENERAL_CONFIG) {
    var vm = this;
    let metaTag = $stateParams.metaTag;
    var pageIndex = $stateParams.pageIndex;
    vm.typeName = "Top Read";
    vm.article = {};
    vm.metaTag = $stateParams.metaTag;
    vm.date = $stateParams.date;
    vm.pageChanged = pageChanged;
    vm.openDate = openDate;
    vm.articles = [];
    vm.dateOption = {
        maxDate: new Date(),
        startingDay: 1,
        showWeeks: false
    }
    /* Article List Type : meta-tag  */
    vm.pageType = 'meta-tag'

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
        $state.go("root.mainSidebar.meta", obj);
    }
    if (vm.date !== undefined && vm.date !== null && vm.date !== "") {
        vm.article.date = new Date(vm.date)
    }

    function getArticleList(pageNum) {
        var findObj = { 'metaTag': vm.metaTag };
        if (!pageNum && pageNum == null && pageNum == "") {
            findObj['pageIndex'] = 0;
        } else {
            findObj['pageIndex'] = pageNum;
        }
        if (vm.date !== undefined) {
            findObj['publishDate'] = vm.date;
        }
        /* Set API param and service */
        var promises = {
            articleList: mainService.getArticleList().get(findObj).$promise
        }
        $q.all(promises).then(function(responses) {
            if (responses.articleList && responses.articleList.data) {
                var articles = responses.articleList.data.articles;
                vm.totalCount = responses.articleList.data.totalCount;
                vm.pageSize = responses.articleList.data.articlePerPage;
                if (articles.length > 0) {
                    for (var index in articles) {
                        vm.articles.push($filter('imagePathFilter')(articles)[index]);
                    }
                }
                vm.articles = vm.articles.map(function(articles){
                    if(!articles.categorySlug)
                        articles.slug = articles.magazineSlug;
                    else
                        articles.slug = articles.categorySlug;
                    return articles;
                })
            }
            vm.typeName = vm.metaTag;
            vm.articlesLoaded = true;
            $state.current.data.pageTitle = "News Search: " + vm.typeName+ " | ";
        });
    }
    getArticleList(pageIndex);
};