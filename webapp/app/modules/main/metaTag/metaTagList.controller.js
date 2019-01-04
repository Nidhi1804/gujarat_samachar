'use strict';
angular.module('gujaratSamachar.main')
    .controller('MetaTagController', MetaTagController);

MetaTagController.$inject = ['mainService', '$stateParams', '$filter', '$state', '$q', 'AdService', 'GENERAL_CONFIG'];

function MetaTagController(mainService, $stateParams, $filter, $state, $q, AdService, GENERAL_CONFIG) {
    var vm = this;
    var articleId = $stateParams.articleId;
    var pageIndex = $stateParams.pageIndex;
    var matchFlag = false;
    var metaTag = $stateParams.metaTag;
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
    vm.getMetaTagList = getMetaTagList;
    /* Article List Type : category / city  */
    var listType = $stateParams.listType;

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
        if (metaTag !== undefined) {
            obj['metaTag'] = metaTag;
        }
        if (articleId !== undefined && articleId !== "" && articleId !== null) {
            obj['articleId'] = articleId;
        }
        if (matchFlag !== undefined) {
            obj['matchFlag'] = matchFlag;
        }
        $state.go("root.mainSidebar.metaTagList", obj);
    }
    if (vm.date !== undefined && vm.date !== null && vm.date !== "") {
        vm.article.date = new Date(vm.date)
    }

    /*
     * Get a list of articles based on matching metaTags. Including clicked article.($stateParams.articleId)
     * Article having $stateParams.articleId will be on top the list.
     * matchFlag: Use of this flag to check whether a clikced article is already on the list or not to make sure not to add 2nd time on other pages.
     */
    function getMetaTagList(pageNum) {
        var findObj = {};
        vm.articlesLoaded = false;
        if (pageNum && pageNum !== null && pageNum !== "") {
            findObj['pageIndex'] = pageNum;
        } else {
            findObj['pageIndex'] = 0;
        }
        if (articleId !== undefined && articleId !== "" && articleId !== null) {
            findObj['articleId'] = articleId;
        }
        if (metaTag !== undefined && metaTag !== "" && metaTag !== null) {
            findObj['metaTag'] = metaTag;
        }
        if (vm.date !== undefined) {
            findObj['publishDate'] = vm.date;
        }
        mainService.getMetaTagList().get(findObj, function(response) {
            if (response.data !== undefined && response.data.documents !== undefined && response.data.documents.length > 0) {
                vm.articles = response.data.documents;
                vm.articles = $filter('imagePathFilter')(vm.articles);
                vm.pageSize = response.data.documentsPerPage;
                vm.totalCount = response.data.totalCount;
                matchFlag = response.data.flag;
            } else {
                mainService.articleDetails().get({ articleId: articleId }, function(response) {
                    if (response.data !== undefined && response.data.length > 0) {
                        vm.articles = response.data;
                        vm.articles = $filter('imagePathFilter')(vm.articles);
                        vm.totalCount = 0;
                    } else {
                        vm.articles = [];
                        vm.totalCount = 0;
                    }
                })
            }
            vm.articles = vm.articles.map(function(article){
                if(!article.categorySlug)
                    article.slug = article.magazineSlug;
                else
                    article.slug = article.categorySlug;
                return article;
            })
            vm.articlesLoaded = true;
        });


    }
    getMetaTagList(pageIndex);
};