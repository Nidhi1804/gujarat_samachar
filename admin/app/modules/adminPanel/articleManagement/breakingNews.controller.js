'use strict';
angular.module('gujaratSamachar.adminPanel')
    .controller('BreakingNewsController', BreakingNewsController);

BreakingNewsController.$inject = ['toastr', 'GENERAL_CONFIG', 'AdminService',  'localStorageService'];
function BreakingNewsController(toastr, GENERAL_CONFIG, AdminService,  localStorageService) {
    var vm = this;
    var loggedInUserInfo = JSON.parse(localStorageService.getLoggedInUserInfo());
    vm.deleteSingleArticle = deleteSingleArticle;
    vm.requireFileError = false;

    function deleteSingleArticle(articleId) {
        vm.deleteIdList = [];
        vm.deleteIdList.push(articleId);
        deleteArticle()
    }
    function deleteArticle() {
        AdminService.articles().remove({ articleId: JSON.stringify(vm.deleteIdList) }, function (response) {
            if (response.code == 200) {
                toastr.success(response.message, "", {
                    closeButton: true,
                    timeOut: 3000,
                    preventOpenDuplicates: true
                });
                vm.deleteIdList = [];
                getBreakingNewsList(vm.pageId);
            }

        })
    }
    function getBreakingNewsList() {
        var findObj = {};
        AdminService.brekingNewsList().get(findObj, function (response) {
            vm.breakingNewsList = [];
            if (response.data !== undefined && response.data.length > 0) {
                vm.breakingNewsList = response.data;
                vm.breakingNewsList = vm.breakingNewsList.map(function (article) {
                    if (article.articleImage) {
                        var uploadFolder = article.articleImage.split("/")[0];
                        if (uploadFolder == "uploads")
                            article.baseUrl = "http://www.gujaratsamachar.com/"; //baseUrl for old admin panel articles
                        else
                            article.baseUrl = GENERAL_CONFIG.app_base_url; //baseUrl for new admin panel articles
                    }
                    return article;
                });
            }
            vm.breakingNewsLoaded = true;
        });
    }
    getBreakingNewsList();
}