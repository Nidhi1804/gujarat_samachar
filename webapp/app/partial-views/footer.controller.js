'use strict';
angular.module('gujaratSamachar')
    .controller('FooterController', FooterController);

FooterController.$inject = ['$timeout', '$cookies', '$state', 'GENERAL_CONFIG', 'categoryDataService', 'megazineDataService', 'cityDataService', 'mainService','StaticPageService'];

function FooterController($timeout, $cookies, $state, GENERAL_CONFIG, categoryDataService, megazineDataService, cityDataService, mainService,StaticPageService) {
    var vm = this;
    if (navigator.userAgent.toString().search('Android') >= 0 || navigator.userAgent.toString().search('iPhone') >= 0 || navigator.userAgent.toString().search('iPad') >= 0 || navigator.userAgent.toString().search('webOS') >= 0 || navigator.userAgent.toString().search('iPod') >= 0) {
        var downloadApplink = $cookies.get('downloadApplink');
        if (downloadApplink && downloadApplink != '') {
            vm.showLink = false;
        } else {
            vm.showLink = true;
        }
    } else {
        vm.showLink = false;
    }
    vm.openDeepLink = openDeepLink;
    vm.closeDeeplink = closeDeeplink;
    vm.doSubscribe = doSubscribe;
    getMagazineData();
    getMainCategories();
    getCityData();
    getVaividhyaLinks();
    getCurrentDateYear();

    function getCurrentDateYear() {
        vm.currentDateYear = new Date().getFullYear();
    }

    function getMainCategories() {
        categoryDataService.getMainCategories().then(function (response) {
            vm.mainCategories = response;
        })
    }

    function getMagazineData() {
        megazineDataService.getMagazineData().then(function (response) {
            vm.magazines = response.documents;
        })
    }

    function getCityData() {
        cityDataService.getCityData().then(function (response) {
            vm.cities = response.documents;
        })
    }

    function getVaividhyaLinks() {
        mainService.getSubCategories().get({
            name: "Editorial",
            type: 'article'
        }, function (response) {
            vm.vaividhyaLinks = response.data;
        })
    }

    function openDeepLink() {
        vm.magazineSlug = ['ravi-purti','business-plus','sahiyar','shatdal','dharmlok','chitralok','zagmag','gujarat-samachar-plus'];
        vm.citySlug = ['bhuj','north-gujarat','rajkot','ahmedabad','bhavnagar','kheda-anand','baroda','surat','gandhinagar'];
        var url = '';
        var slug = '';
        var isMagazine = '';
        var type = '';
        if ($state.params && $state.params.articleUrl && $state.params.categorySlug) {
            url = $state.params.articleUrl;
            slug = $state.params.categorySlug;
            if(vm.magazineSlug.includes(slug) == true){
                isMagazine = true;
            }else if(vm.citySlug.includes(slug) == true){
                type = 'city';
               isMagazine = false; 
            }else{
               isMagazine = false; 
               type = 'category';
            }
        }
        console.log(slug)
        console.log(isMagazine)
        var options = {
            fallback: GENERAL_CONFIG.app_base_url,
            url: 'mygujaratsamachar://categorySlug=' + slug + '&articleUrl=' + url + '&isMagazine=' + isMagazine + '&type=' + type,
            ios_store_link: 'https://itunes.apple.com/in/app/gujarat-samachar-news/id623725053?mt=8',
            android_package_name: 'com.gujaratsamachar'
        };
        /*set cookie for show only one time deeplink/download app model*/
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        $cookies.put('downloadApplink', 'true', {
            'expires': expireDate
        });
        vm.showLink = false;
        deeplink.deepone(options);
    }

    function closeDeeplink() {
        /*set cookie for show only one time deeplink/download app model*/
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        $cookies.put('downloadApplink', 'true', {
            'expires': expireDate
        });
        vm.showLink = false;
    }

    function doSubscribe(isValid){
        if(isValid){    
            StaticPageService.addSubscribeEmail().get({ emailId: vm.emailId }, function(response) {
                if(response.code == 400) {
                    $('#errorMsg').fadeIn('slow');
                    $timeout(function() {
                        $('#errorMsg').fadeOut('slow');
                    }, 2500);
                }else{
                    $('#successMsg').fadeIn('slow');
                    $timeout(function() {
                        $('#successMsg').fadeOut('slow');
                    }, 2500);
                    vm.emailId = '';
                }
            });     
        }
    }
}