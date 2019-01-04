'use strict';
angular.module('gujaratSamachar')
    .controller('FooterController', FooterController);

FooterController.$inject = ['$log', '$state', 'toastr', 'GENERAL_CONFIG', 'localStorageService', 'AuthService', '$http', '$rootScope'];

function FooterController($log, $state, toastr, GENERAL_CONFIG, localStorageService, AuthService, $http, $rootScope) {
    var vm = this;
    getCurrentDateYear();

    function getCurrentDateYear() {
        vm.currentDateYear = new Date().getFullYear();
    }
}