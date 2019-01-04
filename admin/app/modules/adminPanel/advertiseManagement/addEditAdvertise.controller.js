'use strict';
angular.module('gujaratSamachar.adminPanel')
    .controller('AddEditAdvertiseController', AddEditAdvertiseController);

AddEditAdvertiseController.$inject = ['$log', 'AdminService', '$state', '$stateParams', '$q', 'commonService', 'localStorageService', 'GENERAL_CONFIG', 'moment', '$scope', 'Upload'];
function AddEditAdvertiseController($log, AdminService, $state, $stateParams, $q, commonService, localStorageService, GENERAL_CONFIG, moment, $scope, Upload) {
    var vm = this;
    var url;
    var method;
    vm.advertise = {};
    vm.disable = false;
    vm.advertise.isActive = true;
    vm.advertise.isArticle = false;
    vm.advertise.userAgent = 'web';
    vm.checkOption = checkOption;
    vm.advertiseId = $stateParams.advertiseId;
    vm.models = [];/* List selected sub-categories IDs */
    if(vm.advertise.userAgent == 'web')
        vm.position = angular.copy(GENERAL_CONFIG.avertisePositions);
    else
        vm.position = angular.copy(GENERAL_CONFIG.avertiseMobilePositions);
    vm.pageType = GENERAL_CONFIG.pageType;
    vm.fileType = GENERAL_CONFIG.adevrtisefileType;
    vm.getAdPositions = getAdPositions;
    vm.advertise.image = vm.fileType[0];
    // vm.editAdvertise      = editAdvertise;
  //  vm.saveAdvertise = saveAdvertise;
    vm.openStartDate = openStartDate;
    vm.openEndDate = openEndDate;
    vm.updateStartDateConfig = updateStartDateConfig;
    vm.updateEndDateConfig = updateEndDateConfig;
    vm.checkDateRangForBottomAd = checkDateRangForBottomAd;
    vm.removethisImage = removethisImage;
    var loggedInUserInfo = JSON.parse(localStorageService.getLoggedInUserInfo());

    vm.indexList = [...Array(10).keys()];
    
    vm.dateOption = {
        startingDay: 1,
        showWeeks: false
    };
    vm.dateOptionsStartDate = {
        minDate: new Date(),
        maxDate: vm.advertise.endDate,
        startingDay: 1,
        showWeeks: false
    }
    vm.dateOptionsEndDate = {
        minDate: (vm.advertise.startDate) ? moment(vm.advertise.startDate) : new Date(),
        startingDay: 1,
        showWeeks: false
    }


    function getAdPositions() {
        vm.position = [];
        vm.parentId = [];
        vm.magazineSlug = [];
        vm.citySlug = [];
        vm.subCatIds = [];

        if(vm.advertise.userAgent == 'web'){
            if(vm.advertise.pageType == 'home') {
                GENERAL_CONFIG.avertisePositions.forEach(function(position){
                    if(position.value !== 'List' && position.value !== 'Header2' && position.value !== 'Article-Header3' && position.value !== 'Article-Header4')
                    vm.position.push(position);
                });
            } else {
                if((vm.advertise.pageType == 'category' || vm.advertise.pageType == 'magazine') && vm.advertise.isArticle == true){
                    GENERAL_CONFIG.avertisePositions.forEach(function(position){
                        if(position.value !== 'Middle1' && position.value !== 'Middle2' && position.value !== 'List' && position.value !== 'Middle3' && position.value !== 'Middle4'){
                            vm.position.push(position);
                        }
                    });
                }else{    
                    GENERAL_CONFIG.avertisePositions.forEach(function(position){
                        if(position.value !== 'Middle1' && position.value !== 'Article-Header3' && position.value !== 'Article-Header4' && position.value !== 'Middle2' && position.value !== 'Middle3' && position.value !== 'Middle4'){
                            vm.position.push(position);
                        }
                    });
                }
            }
        }else{
            if(vm.advertise.pageType == 'home') {
                GENERAL_CONFIG.avertiseMobilePositions.forEach(function(position){
                    if(position.value !== 'Above List Box' && position.value !== 'Above Releted News Box' && position.value !== 'Above Article Box' && position.value !== 'Above Slide Show List Box' && position.value !== 'Above Video Gallery Box' && position.value !== 'Above Photo Gallery List Box'){
                        vm.position.push(position);
                    }
                })
            }else if(vm.advertise.pageType == 'category' || vm.advertise.pageType == 'magazine' || vm.advertise.pageType == 'city'){
                GENERAL_CONFIG.avertiseMobilePositions.forEach(function(position){    
                    if(vm.advertise.isArticle == false || vm.advertise.pageType == 'city'){
                        if(position.value !== 'Above Story Box' && position.value !== 'Above Releted News Box' && position.value !== 'Above City News Box' && position.value !== 'Above Category Box1' && position.value !== 'Above Category Box2' && position.value !== 'Above Category Box3' && position.value !== 'Above Category Box4' && position.value !== 'Above Gallery Box' && position.value !== 'Above Article Box' && position.value !== 'Above Slide Show List Box' && position.value !== 'Above Video Gallery Box' && position.value !== 'Above Photo Gallery List Box' && position.value !== 'Middle4'){
                            vm.position.push(position);
                        }
                    }else{
                        if(position.value !== 'Above Story Box' && position.value !== 'Above Top Read News Box' && position.value !== 'Above Gallery Box' && position.value !== 'Above List Box' && position.value !== 'Above Slide Show List Box' && position.value !== 'Above Video Gallery Box' && position.value !== 'Above Photo Gallery List Box'){
                           vm.position.push(position); 
                        }
                    }
                })
            }else if(vm.advertise.pageType == 'slide-show'){
                GENERAL_CONFIG.avertiseMobilePositions.forEach(function(position){
                    if(position.value !== 'Above Story Box' && position.value !== 'Above Releted News Box' && position.value !== 'Above City News Box' && position.value !== 'Above Category Box1' && position.value !== 'Above Category Box2' && position.value !== 'Above Category Box3' && position.value !== 'Above Category Box4' && position.value !== 'Above Gallery Box' && position.value !== 'Above Article Box' && position.value !== 'Above List Box' && position.value !== 'Above Video Gallery Box' && position.value !== 'Above Photo Gallery List Box' && position.value !== 'Middle4'){
                            vm.position.push(position);
                    }else if(vm.advertise.pageType == 'photo-gallery'){
                        if(position.value !== 'Above Story Box' && position.value !== 'Above Releted News Box' && position.value !== 'Above City News Box' && position.value !== 'Above Category Box1' && position.value !== 'Above Category Box2' && position.value !== 'Above Category Box3' && position.value !== 'Above Category Box4' && position.value !== 'Above Gallery Box' && position.value !== 'Above Article Box' && position.value !== 'Above List Box' && position.value !== 'Above Video Gallery Box' && position.value !== 'Above Slide Show List Box' && position.value !== 'Middle4'){
                            vm.position.push(position);
                        }
                    }else if(vm.advertise.pageType == 'video-gallery'){
                        if(position.value !== 'Above Story Box' && position.value !== 'Above Releted News Box' && position.value !== 'Above City News Box' && position.value !== 'Above Category Box1' && position.value !== 'Above Category Box2' && position.value !== 'Above Category Box3' && position.value !== 'Above Category Box4' && position.value !== 'Above Gallery Box' && position.value !== 'Above Article Box' && position.value !== 'Above List Box' && position.value !== 'Above Slide Show List Box' && position.value !== 'Above Photo Gallery List Box' && position.value !== 'Middle4'){
                            vm.position.push(position);
                        }
                    }
                });
            }else{
                vm.position = angular.copy(GENERAL_CONFIG.avertiseMobilePositions);
            }
        }
    }

    function openStartDate() {
        vm.openStartDate.opened = true;
    }
    function openEndDate() {
        vm.openEndDate.opened = true;
    }

    /* Update max-date of From date on selection of To Date */
    function updateStartDateConfig() {
        vm.dateOptionsStartDate.maxDate = vm.advertise.endDate;
    }

    /* Update min-date of To date on selection of From Date */
    function updateEndDateConfig() {
        vm.dateOptionsEndDate.minDate = vm.advertise.startDate;
    }

    function reset() {
        vm.advertise = {};
        vm.parentId = [];
        vm.subCatIds = [];
        vm.advertise.isActive = true;
        vm.advertise.isArticle = false;
        vm.advertise.userAgent = 'web';
        vm.addAdvertiseForm.$setPristine();
    }

    function checkOption(idArr){
        if(idArr.indexOf('catIdArr') != -1){
            vm.parentId = catIdArr;
        }else if(idArr.indexOf('magazineIdArr') != -1){
            vm.magazineSlug = magazineIdArr;
        }else if(idArr.indexOf('cityIdArr') != -1){
            vm.citySlug = cityIdArr;
        }else if(idArr.indexOf('subCatArr') != -1){
            vm.subCatIds = subCatArr;
        }
    }
    vm.minDate = new Date(vm.advertise.startDate);

    if (vm.advertiseId && vm.advertiseId !== '' && vm.advertiseId !== null) {
        vm.typeTitle = "Edit";
        getAdvertiseInfo();
        method = 'PUT';
        url = GENERAL_CONFIG.app_base_url + '/api/adv/' + vm.advertiseId;
    } else {
        vm.typeTitle = "Add New";
        vm.isAdvertiseLoaded = true;
        method = 'POST';
        url = GENERAL_CONFIG.app_base_url + '/api/adv';
    }

    function getAdvertiseInfo() {
        AdminService.advertise().get({ advertiseId: vm.advertiseId }, function (advertiseDoc) {
            if (advertiseDoc.data.length > 0) {
                vm.advertise = advertiseDoc.data;
                vm.advertise.map(function (advertise) {
                    advertise.startDate = new Date(advertise.startDate);
                    advertise.endDate = new Date(advertise.endDate);
                    if(advertise.description) advertise.description1 = advertise.description;
                    if(advertise.adLink) advertise.adLink1 = advertise.adLink;
                    return advertise;
                })
                vm.advertise = vm.advertise[0];
                getAdPositions();
                vm.dateOptionsStartDate.maxDate = vm.advertise.endDate;
                vm.dateOptionsEndDate['minDate'] = moment(vm.advertise.startDate);
                vm.advertise.listIndex = parseInt(vm.advertise.listIndex);
            }
            if(vm.advertise.position !== 'Header')
                vm.advertise.image1 = vm.advertise.image;
            vm.parentId = vm.advertise.categories;
            vm.magazineSlug = vm.advertise.magazines;
            vm.citySlug = vm.advertise.city;
            vm.subCatIds = vm.advertise.subCategories;
            vm.isAdvertiseLoaded = true;
        })
    }

    /* Get Reporter list, sections and Main Categories (Only active), Cities, Magazines */
    var catIdArr = [];
    var magazineIdArr = [];
    var cityIdArr = [];
    var subCatArr = [];
    var promises = {
        mainCategoriesPromise: AdminService.categories().get({ sort: 'name', type: 'article', isActive: true }).$promise,
        magazinesPromise: AdminService.magazines().get().$promise,
        citiesPromise: AdminService.cities().get().$promise,
        subCategoriesPromise: AdminService.subCategories().get({ sort: 'name', type: 'article', isActive: true }).$promise
    }
    $q.all(promises).then(function (responses) {
        if (responses.mainCategoriesPromise.data) {
            vm.mainCategoryList = responses.mainCategoriesPromise.data;
            angular.forEach(vm.mainCategoryList, function(value, key) {
              catIdArr.push(value._id);  
            });
            vm.mainCategoryList.unshift({'name': 'All',"_id": 'catIdArr'});
        }
        if (responses.magazinesPromise.data) {
            vm.magazineList = responses.magazinesPromise.data;
            angular.forEach(vm.magazineList, function(value, key) {
              magazineIdArr.push(value._id);  
            });
            vm.magazineList.unshift({'name': 'All',"_id": 'magazineIdArr'});
        }
        if (responses.citiesPromise.data) {
            vm.citiesList = responses.citiesPromise.data;
            angular.forEach(vm.citiesList, function(value, key) {
              cityIdArr.push(value._id);  
            });
            vm.citiesList.unshift({'name': 'All',"_id": 'cityIdArr'});
        }
        if (responses.subCategoriesPromise.data) {
            vm.subCategoryList = responses.subCategoriesPromise.data;
            angular.forEach(vm.subCategoryList, function(value, key) {
              subCatArr.push(value._id);  
            });
            vm.subCategoryList.unshift({'name': 'All',"_id": 'subCatArr'});
        }
    }, function (error) {
        $log.log(error);
    });


    function saveAdvertise(isValid, redirectFlag) {
        vm.redirectFlag = redirectFlag;
        if(vm.advertise.pageType == 'category'){
            vm.advertise.categories = [] /* Save all category Ids as an array */
            vm.advertise.categories = vm.parentId;
        }else if(vm.advertise.pageType == 'magazine'){
            vm.advertise.magazines = [] /* Save all category Ids as an array */
            vm.advertise.magazines = vm.magazineSlug;
        }else if(vm.advertise.pageType == 'city'){
            vm.advertise.city = [] /* Save all category Ids as an array */
            vm.advertise.city = vm.citySlug;
        }else{
            vm.advertise.categories = [];
            vm.advertise.magazines = [];
            vm.advertise.city = [];
            vm.advertise.subCategories = [];
        }
        if(!vm.advertise.position == 'List'){
            vm.advertise.listIndex = '';
        }
        vm.advertise.subCategories = [] /* Save all category Ids as an array */
        vm.advertise.subCategories = vm.subCatIds;
        /* Push form data in queue before file upload */
        vm.advertise.categories = JSON.stringify(vm.advertise.categories);
        vm.advertise.magazines = JSON.stringify(vm.advertise.magazines);
        vm.advertise.city = JSON.stringify(vm.advertise.city);
        vm.advertise.subCategories = JSON.stringify(vm.advertise.subCategories);

        if(isValid) {
            vm.disable = true;
            saveAdvertiseWithoutImage(redirectFlag);           
        }   
    }

    function saveAdvertiseWithoutImage(redirectFlag) {
        Upload.upload({
            url: url,// Based on add/edit operation
            method: method,
            headers: {
                'Authorization': 'Bearer ' + loggedInUserInfo.token
            },
            data: vm.advertise
        }).then(function (response) {
            commonService.successToastr(response.data.message)
            reset();
            if (redirectFlag === false) {
                $state.go('root.getAdvertiseList', { pageIndex: 1 })
            }
            else {
                reset();
                $state.go('root.addAdvertise')
            }            
        }, function (response) {
            console.log('Error status: ' + response);
        });
    }

    function updateAdvertiseWithoutImage(redirectFlag) {
        AdminService.advertise().update({ advertiseId: vm.advertiseId }, vm.advertise, function (response) {
            commonService.successToastr(response.message)
            if (vm.advertiseId) {
                if (redirectFlag === false) {
                    $state.go('root.getAdvertiseList', { pageIndex: 1 })
                }
                else {
                    reset();
                    $state.go('root.addAdvertise')
                }
            }
        })
    }

    function removethisImage(imageType){
        if(imageType == 1)
            vm.advertise.image1 = '';
        else
            vm.advertise.image2 = '';
    }

    function checkDateRangForBottomAd(isValid, redirectFlag){
        if(isValid){
            var adArray = [];
            var sDate = new Date(vm.advertise.startDate);
            var startDate = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), 0, 0, 0);
            var eDate = new Date(vm.advertise.endDate);
            var endDate = new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate(), 0, 0, 0);
            if(vm.advertise.position == 'Bottom 1 + Bottom 2'){
                adArray.push('Bottom 1');
                adArray.push('Bottom 2');
                adArray.push(vm.advertise.position);
            }else if(vm.advertise.position == 'Bottom 1' || vm.advertise.position == 'Bottom 2'){
                adArray.push('Bottom 1 + Bottom 2');
                adArray.push(vm.advertise.position);
            }else{
                adArray.push(vm.advertise.position);
            }
            AdminService.getAdvertiseByPosition().get({ position: adArray, pageType: vm.advertise.pageType, categories:vm.parentId, subCategories:vm.subCatIds, skipId: vm.advertiseId, startDate:startDate, endDate:endDate, listIndex: vm.advertise.listIndex}, vm.advertise, function (response) {
                if(response.data && response.data.length > 0){
                    vm.bottomAds = response.data;
                    commonService.errorToastr('You can not select this date')
                }else{
                    saveAdvertise(isValid, redirectFlag);
                }
            })
        }
    }
}