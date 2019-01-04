'use strict';
angular.module('gujaratSamachar')
    .controller('sitemapController', sitemapController);

sitemapController.$inject = ['categoryDataService', 'megazineDataService', 'cityDataService', 'mainService', '$q'];

function sitemapController(categoryDataService, megazineDataService, cityDataService, mainService, $q) {
    let vm = this;
    let counter = 0;
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