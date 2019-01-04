'use strict';
angular.module('gujaratSamachar.main')
    .controller('rightSideNewsController', rightSideNewsController);

rightSideNewsController.$inject = ['$log', 'mainService', '$scope', '$q', '$filter', '$timeout', 'sectionFlagDataService'];

function rightSideNewsController($log, mainService, $scope, $q, $filter, $timeout, sectionFlagDataService) {
    var vm = this;
    vm.magazineSlug = 'gujarat-samachar-plus';
    vm.$onInit = function() {
    	$timeout(function(){
        	vm.componentInitialize = true;
    	},800);
        vm.errorImagePath = 'assets/images/default.png';
    }
}