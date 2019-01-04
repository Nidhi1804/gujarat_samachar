'use strict';
var app = angular.module('gujaratSamachar.main')
app.controller('BreakingNewsController', BreakingNewsController);

BreakingNewsController.$inject = ['mainService', '$stateParams', 'GENERAL_CONFIG', '$timeout'];

function BreakingNewsController(mainService, $stateParams, GENERAL_CONFIG, $timeout) {
    var vm = this;
    var articleId = $stateParams.articleId;
    var metaTagArr = [];
    var url = $stateParams.url;

    function getBreakingNews() {
        mainService.getBreakingNews().get(function(response) {
            if (response.data && response.data.length > 0) {
                vm.article = response.data[0];
                vm.article.baseUrl = GENERAL_CONFIG.image_base_url;
                if(!vm.article.categorySlug)
                    vm.article.slug = vm.article.magazineSlug;
                else
                    vm.article.slug = vm.article.categorySlug;
            }
            vm.articleLoaded = true;
        });
    }
    getBreakingNews();
};