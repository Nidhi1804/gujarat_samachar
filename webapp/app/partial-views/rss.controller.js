'use strict';
angular.module('gujaratSamachar')
    .controller('RssController', RssController);

RssController.$inject = ['cityDataService','categoryDataService','megazineDataService','$log', 'AdService', '$q', '$filter', '$state', 'GENERAL_CONFIG', '$transitions', '$stateParams', 'shareData', '$scope', 'mainService', '$rootScope', '$timeout'];

function RssController(cityDataService,categoryDataService,megazineDataService, $log, AdService, $q, $filter, $state, GENERAL_CONFIG, $transitions, $stateParams, shareData, $scope, mainService, $rootScope, $timeout) {
    var vm = this;
    vm.appBaseUrl = GENERAL_CONFIG.app_base_url;
    var promises = {
        mainCategories: categoryDataService.getMainCategories(),
        magazines: megazineDataService.getMagazineData(),
        cities: cityDataService.getCityData(),
        vaividhyaLinks: mainService.getSubCategories().get({ name: "Editorial", type: 'article' }).$promise
    }
    $q.all(promises).then(function(responses) {
        vm.mainCategories = responses.mainCategories;
        vm.magazines = responses.magazines.documents;
        vm.cities = responses.cities.documents;
        vm.vaividhyaLinks = responses.vaividhyaLinks.data;
        vm.dataLoaded = true;
    })
}