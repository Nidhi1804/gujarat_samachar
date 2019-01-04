'use strict';
angular.module('gujaratSamachar')
    .factory('categoryDataService', categoryDataService)
    .factory('megazineDataService', megazineDataService)
    .factory('cityDataService', cityDataService)
    .factory('sectionFlagDataService', sectionFlagDataService);

function categoryDataService($q, mainService) {
    let promise;
    let deferred = $q.defer();
    let service = {
        getMainCategories: getMainCategories
    }
    return service;

    function getMainCategories() {
        /* Make category API call only once */
        if (!promise) {
            promise = mainService.categories();
            promise.get({ parentId: 0, type: 'article' }, function(response) {
                deferred.resolve(response.data);
            })
            return deferred.promise;
        }
        return deferred.promise;
    }

    function getMagazineData() {
        if (!megazinePromise) {
            megazinePromise = mainService.magazines();
            megazinePromise.get({ collectionName: 'Magazines' }, function(response) {
                deferred.resolve(response.data);
            })
            return deferred.promise;
        }
        return deferred.promise;
    }
}

function megazineDataService($q, mainService) {
    let promise;
    let deferred = $q.defer();
    let service = {
        getMagazineData: getMagazineData
    }
    return service;

    function getMagazineData() {
        if (!promise) {
            promise = mainService.magazines();
            promise.get({ collectionName: 'Magazines' }, function(response) {
                deferred.resolve(response.data);
            })
            return deferred.promise;
        }
        return deferred.promise;
    }
}

function cityDataService($q, mainService) {
    let promise;
    let deferred = $q.defer();
    let service = {
        getCityData: getCityData
    }
    return service;

    function getCityData() {
        if (!promise) {
            promise = mainService.cities();
            promise.get({ collectionName: 'Cities', sortBy: 'position' }, function(response) {
                deferred.resolve(response.data);
            })
            return deferred.promise;
        }
        return deferred.promise;
    }
}

function sectionFlagDataService($q, mainService) {
    let promise;
    let deferred = $q.defer();
    let service = {
        sectionFlags: sectionFlags
    }
    return service;

    function sectionFlags() {
        if (!promise) {
            var sectionIds = {
                topStories: {},
                topSubStories: {},
                topReadNews: {},
                recentNews: {}
            }
            promise = mainService.sectionFlags();
            promise.get(function(response) {
                response.data.forEach(function(section) {
                    if (section.value == "top-stories") {
                        sectionIds.topStories._id = section._id;
                        sectionIds.topStories.value = section.value;
                    } else if (section.value == "top-sub-stories") {
                        sectionIds.topSubStories._id = section._id;
                        sectionIds.topSubStories.value = section.value;
                    } else if (section.value == "top-read-news") {
                        sectionIds.topReadNews._id = section._id;
                        sectionIds.topReadNews.value = section.value;
                    } else if (section.value == "recent-news") {
                        sectionIds.recentNews._id = section._id;
                        sectionIds.recentNews.value = section.value;
                    }
                });
                deferred.resolve(sectionIds);
            })
            return deferred.promise;
        }
        return deferred.promise;
    }
}