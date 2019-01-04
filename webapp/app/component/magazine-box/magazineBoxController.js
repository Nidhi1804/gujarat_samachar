'use strict';
angular.module('gujaratSamachar.main')
	.controller('magazineBoxController', magazineBoxController);

magazineBoxController.$inject = ['$log', 'mainService', '$scope', '$q', '$filter', '$timeout', 'megazineDataService'];

function magazineBoxController($log, mainService, $scope, $q, $filter, $timeout, megazineDataService) {
	var vm = this;

	vm.$onInit = function() {
		vm.componentInitialize = true;
	}
	getMagazineList();

	function getMagazineList() {
       
        var promises = {
            magazines: megazineDataService.getMagazineData(),
        }
        $q.all(promises).then(function(responses) {
            if (responses.magazines) {
                vm.magazines = responses.magazines.documents;
                vm.magazinesLoaded = true;
            }
        });
    }
}