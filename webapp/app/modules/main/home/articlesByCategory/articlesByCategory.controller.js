'use strict';
angular.module('gujaratSamachar.main')
    .controller('ArticlesByCategoryController', ArticlesByCategoryController);

ArticlesByCategoryController.$inject = ['$rootScope','$log', 'GENERAL_CONFIG', 'mainService', '$scope', '$q', '$filter', 'categoryDataService'];

function ArticlesByCategoryController($rootScope, $log, GENERAL_CONFIG, mainService, $scope, $q, $filter, categoryDataService) {
    var vm = this;
    var promises = {
        getMenuList: mainService.getMenuList().get({ sortBy: 'position',isMobile: false }).$promise
    }
    $q.all(promises).then(function(responses) {
        if (responses.getMenuList.data) {
            var getMenuList = responses.getMenuList.data;
            vm.typeOneBlockList1 = [];
            vm.typeOneBlockList2 = [];
            vm.typeOneBlockList3 = [];
            vm.typeTwoBlockList =[];
            getMenuList.splice(0,1);
            angular.forEach(getMenuList, function(menuItem, index) {
                if(menuItem.name == 'Sports'){
                    vm.typeTwoBlockList.push(menuItem);
                }else if(menuItem.name == 'National' || menuItem.name == 'International' || menuItem.name == 'Entertainment' || menuItem.name == 'Business'){
                    vm.typeOneBlockList1.push(menuItem);
                }else if(menuItem.name == 'Editorial' || menuItem.name == 'Magazines' || menuItem.name == 'Gujarat'){
                    vm.typeOneBlockList2.push(menuItem);
                }else if(menuItem.name == 'Recipe' || menuItem.name == 'NRI News'){
                    vm.typeOneBlockList3.push(menuItem);
                }
            });
            vm.blocks = [
                {
                    "index": 1,
                    "type": 1,
                    "categories": vm.typeOneBlockList1
                },
                {
                    "index": 2,
                    "type": 1,
                    "categories": vm.typeOneBlockList2
                },
                {
                    "index": 3,
                    "type": 1,
                    "categories": vm.typeOneBlockList3
                },
                {
                    "index": 4,
                    "type": 2,
                    "categories": {
                        "name": vm.typeTwoBlockList[0].name,
                        "parentId": vm.typeTwoBlockList[0].parentId,
                        "slug": vm.typeTwoBlockList[0].slug,
                        "type": vm.typeTwoBlockList[0].type,
                        "position": vm.typeTwoBlockList[0].position,
                        "_id": vm.typeTwoBlockList[0]._id
                    }
                }
            ];
        }
    });
    
}