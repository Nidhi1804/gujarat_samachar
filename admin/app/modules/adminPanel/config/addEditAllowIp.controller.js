'use strict';
angular.module('gujaratSamachar.adminPanel')
    .controller('AddEditAllowIpController', AddEditAllowIpController);

AddEditAllowIpController.$inject = ['$log', 'toastr', 'AdminService', '$state', '$stateParams', '$q'];
function AddEditAllowIpController($log, toastr, AdminService, $state, $stateParams, $q) {

    var vm = this;
    vm.validIp = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/
    vm.allowIpId = $stateParams.allowIpId;
    vm.saveAllowIp = saveAllowIp;
    vm.getAllowIp = getAllowIp;
    vm.updateAllowIp = updateAllowIp;
    if (vm.allowIpId && vm.allowIpId !== '' && vm.allowIpId !== null) {
        vm.typeTitle = "Edit";
        getAllowIp();
    } else {
        vm.typeTitle = "Add New";
        // vm.isSectionLoaded = true; // Flag to load html only after retieving Section Info to initialize bootstrap-switch and other js plugins based on data
    }

    function reset() {
        vm.allowIp = {};
        vm.addAllowIpForm.$setPristine();
    }
    function saveAllowIp(isValid, redirectFlag) {
        var insertObj = vm.allowIp;
        if (isValid) {
            AdminService.allowIp().save(insertObj, function (response) {
                if (response.code == 200) {
                    toastr.success(response.message, "", {
                        closeButton: true,
                        timeOut: 3000,
                        preventOpenDuplicates: true
                    });
                    if (redirectFlag === false) {
                        $state.go('root.allowIpList', { pageIndex: 1 });
                    }
                    else {
                        if (response.data !== undefined && response.data.length > 0) {
                            reset();
                        }
                        $state.go('root.addAllowIp');
                    }
                }
            });
        }
    }

    function getAllowIp() {
        var findObj = {};
        if (vm.allowIpId !== undefined && vm.allowIpId !== null && vm.allowIpId !== "") {
            findObj['allowIpId'] = vm.allowIpId;
        }
        AdminService.allowIp().get(findObj, function (response) {
            if (response.data.length > 0) {
                vm.allowIp = response.data[0];
            }
        });
    }

    function updateAllowIp(isValid, redirectFlag) {
        var updatedObj = vm.allowIp;
        if (isValid) {
            AdminService.allowIp().update(updatedObj, function (response) {
                if (response.code == 200) {
                    toastr.success(response.message, "", {
                        closeButton: true,
                        timeOut: 3000,
                        preventOpenDuplicates: true
                    });
                }
                if (response.data !== undefined && response.data.length > 0) {
                    if (redirectFlag === false) {
                        $state.go('root.allowIpList', { pageIndex: 1 });
                    } else {
                        reset();
                        $state.go('root.addAllowIp');
                    }

                }
                else {
                    $state.go($state.current, {});
                }
            });
        }

    }


}