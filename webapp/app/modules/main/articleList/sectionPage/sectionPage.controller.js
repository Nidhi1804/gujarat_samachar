'use strict';
angular.module('gujaratSamachar.main')
    .controller('sectionPageController', sectionPageController);

sectionPageController.$inject = ['mainService', '$stateParams', '$filter', '$state'];

function sectionPageController(mainService, $stateParams, $filter, $state) {
    const vm = this;
    if(!$stateParams.slug) {
        $state.go("root.404");
    }
    vm.sectionSlugName = $stateParams.slug;
    let pageIndex = $stateParams.pageIndex;
    vm.article = {};
    vm.articles = [];
    vm.articlesLoaded = false;
    vm.date = $stateParams.date;
    vm.pageChanged = pageChanged; // Change page function
    vm.openDate = openDate; // open date popup
    
    // date options
    vm.dateOption = {
        maxDate: new Date(),
        startingDay: 1,
        showWeeks: false
    };
    
    function openDate() {
        vm.openDate.opened = true;
    }

    vm.pagination = {
        current: pageIndex
    };

    function pageChanged(pageObj) {
        const obj = {};
        obj['pageIndex'] = pageObj.pageIndex;
        if (pageObj.date !== undefined) {
            obj['date'] = $filter('date')(pageObj.date, 'yyyy-MM-dd')
        } else {
            obj['date'] = '';
        }
        $state.go("root.mainSidebar.sectionPage", obj);
    }

    // Auto set date-picker value if date value found in request parameter
    if (vm.date !== undefined && vm.date !== null && vm.date !== "") {
        vm.article.date = new Date(vm.date);
    }

    function getSectionPageList(pageNum) {
        var pageIndex ;
        if (!pageNum && pageNum == null && pageNum == "") {
            pageIndex = 0;
        } else {
            pageIndex = pageNum;
        }

        const postObj = {
            'slug': vm.sectionSlugName,
            'pageIndex': pageIndex
        };
        if (vm.date !== undefined) {
            postObj['publishDate'] = vm.date;
        }
        mainService.getArticlesBySection().get(postObj, response => {
            if (response && response.code == 400) {
                $state.go("root.404");
            } else {
                if (response && response.data && response.data.articles) {
                    vm.articles = response.data.articles;
                    vm.totalCount = response.data.totalCount;
                    vm.pageSize = response.data.articlePerPage;
                    if (vm.articles.length > 0) {
                        vm.articles = $filter('imagePathFilter')(vm.articles);
                    }

                    vm.articles = vm.articles.map(function(artice){
                        artice.slug = $stateParams.slug;
                        return artice;
                    });
                    vm.articlesLoaded = true;
                }
            }
        });
    }
    getSectionPageList(pageIndex);
};