'use strict';
angular.module('gujaratSamachar')
    .controller('StaticPageController', StaticPageController);

StaticPageController.$inject = ['StaticPageService', '$stateParams', '$rootScope', 'metaService', '$state'];

function StaticPageController(StaticPageService, $stateParams, $rootScope, metaService, $state) {
    var vm = this;
    var pageType = $stateParams.pageType;
    $rootScope.metaservice = metaService
    getContactUsContent();
    function getContactUsContent() {
        StaticPageService.getStaticPageData().get({ pageType: pageType }, function(response) {
            if(response && response.code == 404) {
                $state.go("root.404");
            } else {
                vm.content = response.data[0].content;
                var metaKeywordsString = Object.keys(response.data[0].metaKeywords).map(function(k) { return response.data[0].metaKeywords[k].name }).join(", ");
                $state.current.data.pageTitle = response.data[0].title + " | ";
                $rootScope.metaservice.set(response.data[0].metaTitle, response.data[0].metaDescription, metaKeywordsString);
                vm.contentLoaded = true;
            }
        });
    }
}