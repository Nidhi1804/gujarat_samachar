'use strict';
angular.module('gujaratSamachar')
    .factory('AdService', AdService);

AdService.$inject = ['$resource', '$http', 'GENERAL_CONFIG', '$q'];

function AdService($resource, $http, GENERAL_CONFIG, $q) {
    var service = {
        getHeaderAd: getHeaderAd,
        getMiddleAd: getMiddleAd,
        getRightPanelAd: getRightPanelAd,
        getLeftPanelAd: getLeftPanelAd,
        getMainSectionBottomAd: getMainSectionBottomAd,
        getMainSectionMobileAd: getMainSectionMobileAd
    };

    function getHeaderAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-header');
    }

    function getMiddleAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-middle');
    }

    function getRightPanelAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-right-panel');
    }

    function getLeftPanelAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-left-panel');
    }

    function getMainSectionBottomAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-bottom');
    }

    function getMainSectionMobileAd() {
        return $resource(GENERAL_CONFIG.app_base_url + '/api/ad-mobile');
    }

    return service;
}