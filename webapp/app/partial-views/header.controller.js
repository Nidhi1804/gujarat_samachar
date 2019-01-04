'use strict';
angular.module('gujaratSamachar')
    .controller('HeaderController', HeaderController);

HeaderController.$inject = ['$log', 'mainService', '$q', '$filter', '$timeout', '$state', 'moment', 'megazineDataService', 'cityDataService', 'sectionFlagDataService', '$transitions', '$stateParams', '$location'];

function HeaderController($log, mainService, $q, $filter, $timeout, $state, moment, megazineDataService, cityDataService, sectionFlagDataService, $transitions, $stateParams, $location) {
    var vm = this;
    var sectionFlags;
    let Id = parseInt($stateParams.Id);
    let slug = $stateParams.slug;
    vm.currentState;
    var magazines;
    var gujaratCitites;
    vm.currentDate = moment().format('Do MMMM YYYY'); // September 23rd 2017, 5:13:46 pm
    vm.currentTime = moment().format('LT'); // 5:15 PM
    vm.isNavCollapsed = true;
    vm.currentState = $state.current.name;
    vm.closeMenu = closeMenu;
    magazines = [{"name":"Ravi Purti","slug":"ravi-purti"},{"name":"Business Plus","slug":"business-plus"},{"name":"Sahiyar","slug":"sahiyar"},{"name":"Shatdal","slug":"shatdal"},{"name":"Dharmlok","slug":"dharmlok"},{"name":"Chitralok","slug":"chitralok"},{"name":"Zagmag","slug":"zagmag"},{"name":"Gujarat Samachar Plus","slug":"gujarat-samachar-plus"}];
    vm.magazine = ['ravi-purti','business-plus','sahiyar','shatdal','dharmlok','chitralok','zagmag','gujarat-samachar-plus'];
    if($state.current.name == 'root.mainSidebar.articleDetails'){
        let currentMagazine = magazines.filter(function(magazine) {
            return magazine.slug == $state.params.categorySlug;
        });
        if(vm.magazine.includes($state.params.categorySlug) == true && currentMagazine[0].name !== 'Gujarat Samachar Plus'){
            vm.logo = 'assets/images/magazine-logo/' + currentMagazine[0].name + '.png';
            vm.activeTab = 'Magazines';
        }else{
            vm.logo = 'assets/images/logo.png';
            vm.activeTab = $state.params.categorySlug;
        }
    }else{
        vm.logo = 'assets/images/logo.png';
        vm.activeTab = $state.params.slug;
    }
    vm.isCity = $state.params.listType;
    if ($state.current.name !== 'root.mainSidebar.articleByMagazine' && $state.current.name != 'root.mainSidebar.articleDetails' && $stateParams.listType !== 'city'){
        vm.logo = 'assets/images/logo.png';
    }
    if ($state.current.name == 'root.mainSidebar.articleList' && $stateParams.listType == 'city') {
        vm.currentState = 'city';
        vm.activeTab = 'City News';
    }
    if ($state.current.name == 'root.mainSidebar.articleByMagazine' && $stateParams.listType !== 'city'){
        vm.activeTab = 'Magazines';
    }
    sectionFlagDataService.sectionFlags().then(function(response) {
        sectionFlags = response;
        var promises = {
            getMenuList: mainService.getMenuList().get({ sortBy: 'position',isMobile: false }).$promise
        }
        vm.tickerShow = false;
        vm.goToDetail = goToDetail;

        $q.all(promises).then(function(responses) {
            if (responses.getMenuList.data) {
                var getMenuList = responses.getMenuList.data;
                vm.menuList = getMenuList;
                var menuCharLength = 0;
                /* Show Main menu based on character count */
                angular.forEach(getMenuList, function(menuItem, index) {
                    menuCharLength += menuItem.name.length;
                    if (menuCharLength <= 67) {// This will exclude char count of City News, Magazines and ePaper
                        if(menuItem.submenu){
                            angular.forEach(menuItem.submenu, function(subMenuItem, index) {
                                if($stateParams.slug == subMenuItem.slug || $stateParams.categorySlug == subMenuItem.slug)
                                    vm.activeTab = menuItem.slug;
                            });
                        }
                        getMenuList = responses.getMenuList.data.slice(0, index + 1);
                        vm.moreCategories = responses.getMenuList.data.slice(index + 1);
                    } else {
                    }
                });
                angular.forEach(vm.moreCategories, function(menuItem, index) {
                    if($stateParams.slug == menuItem.slug || $stateParams.categorySlug == menuItem.slug)
                        vm.activeTab = 'More';
                });
                
                /* First 2 menu (Home, City News) and 2nd last menu(Magazines) will be static */
                let cityNews = {
                    name: "City News",
                    parentId: 0,
                    position: 2,
                    type: "article",
                    state: 'city'
                }
                /*Magazines will be static, its have rare chance to change so, No need to call API for this*/
                var currentMagazine = [{"name":"Ravi Purti","slug":"ravi-purti"},{"name":"Business Plus","slug":"business-plus"},{"name":"Sahiyar","slug":"sahiyar"},{"name":"Shatdal","slug":"shatdal"},{"name":"Dharmlok","slug":"dharmlok"},{"name":"Chitralok","slug":"chitralok"},{"name":"Zagmag","slug":"zagmag"},{"name":"Gujarat Samachar Plus","slug":"gujarat-samachar-plus"}];
                vm.getMenuList = angular.copy(getMenuList)
                vm.getMenuList.splice(0, 0, cityNews); // Add static menu item for City News(Gujarat)
                let magazinePosition = vm.getMenuList.length - 1;
                let magazineNews = {
                    name: "Magazines",
                    parentId: 0,
                    position: magazinePosition,
                    type: "article",
                    submenu: currentMagazine,
                    state: 'root.mainSidebar.articleByMagazine'
                }
                vm.getMenuList.splice(magazinePosition, 0, magazineNews); // Add static menu item for Magazine News

                vm.getMenuList.forEach(function(value) {
                    if (value.name == "City News") {
                        /*Cities will be static, its have rare chance to change so, No need to call API for this*/
                        var cityArray = [{"_id":"5993f7195b03ab694185b008","name":"Ahmedabad","position":1,"slug":"ahmedabad","Id":4},{"_id":"5993f7355b03ab694185b01a","name":"Baroda","position":2,"slug":"baroda","Id":7},{"_id":"5993f7415b03ab694185b022","name":"Surat","position":3,"slug":"surat","Id":8},{"_id":"5993f70f5b03ab694185b000","name":"Rajkot","position":4,"slug":"rajkot","Id":3},{"_id":"5993f7255b03ab694185b010","name":"Bhavnagar","position":5,"slug":"bhavnagar","Id":5},{"_id":"5993f6d95b03ab694185afdf","name":"Bhuj","position":6,"slug":"bhuj","Id":1},{"_id":"5993f72e5b03ab694185b014","name":"Kheda-Anand","position":7,"slug":"kheda-anand","Id":6},{"_id":"59b23fd351851cfd2c4d339a","name":"Gandhinagar","position":8,"slug":"gandhinagar","Id":9},{"_id":"5993f7095b03ab694185affa","name":"North Gujarat","position":9,"slug":"north-gujarat","Id":2}];
                        gujaratCitites = cityArray;
                        value.submenu = cityArray;
                        vm.loadMenu = true;
                    }
                });
            }
        });
    });

    function goToDetail(categorySlug, newsId, articleUrl) {
        $state.go('root.mainSidebar.articleDetails', { categorySlug: categorySlug, articleId: newsId, articleUrl: articleUrl })
    }

    /* Change Logo image based on Selected page type : magaine / city / list */
    $transitions.onSuccess({}, function($transitions) {
        vm.currentState = $state.current.name;
        if (vm.currentState == 'root.mainSidebar.articleByMagazine') {
            vm.activeTab = 'Magazines';
            if (magazines && magazines.length > 0) {
                let currentMagazine = magazines.filter(function(magazine) {
                    return magazine.slug == $transitions.params().slug;
                });
                if (currentMagazine[0].name !== 'Gujarat Samachar Plus')
                    vm.logo = 'assets/images/magazine-logo/' + currentMagazine[0].name + '.png';
                else
                    vm.logo = 'assets/images/logo.png';
            }
        } else if ($state.current.name == 'root.mainSidebar.articleList' && $transitions.params().listType == 'city') {
            if (gujaratCitites && gujaratCitites.length > 0) {
                vm.currentState = 'city';
                if (vm.currentState == 'city') {
                    let currentCity = gujaratCitites.filter(function(city) {
                        return city.slug == $transitions.params().slug ;
                    });
                    vm.activeTab = 'City News';
                    vm.logo = 'assets/images/city-logo/' + currentCity[0].name + '.png';
                }
            }
        } else if($state.current.name == 'root.mainSidebar.articleDetails'){
            let currentMagazine = magazines.filter(function(magazine) {
                return magazine.slug == $transitions.params().categorySlug;
            });
            if(vm.magazine.includes($transitions.params().categorySlug) == true && currentMagazine[0].name !== 'Gujarat Samachar Plus'){
                vm.logo = 'assets/images/magazine-logo/' + currentMagazine[0].name + '.png';
                vm.activeTab = 'Magazines';
            }else{
                vm.activeTab = $transitions.params().categorySlug;
                vm.logo = 'assets/images/logo.png';
            }
        }else {
            vm.activeTab = $transitions.params().slug;
            vm.logo = 'assets/images/logo.png'
        }
        angular.forEach(vm.moreCategories, function(menuItem, index) {
            if($transitions.params().slug == menuItem.slug || $transitions.params().categorySlug == menuItem.slug)
                vm.activeTab = 'More';
        });
        angular.forEach(vm.menuList, function(menuItem, index) {
            if(menuItem.submenu){
                angular.forEach(menuItem.submenu, function(subMenuItem, index) {
                    if($transitions.params().slug == subMenuItem.slug || $transitions.params().categorySlug == subMenuItem.slug)
                        vm.activeTab = menuItem.slug;
                });
            }
        });
    });

    function closeMenu() {
        vm.isNavCollapsed = true;
    }

    /*=============== NavSearch ===============*/

  // flag : says "remove class when click reaches background"

}