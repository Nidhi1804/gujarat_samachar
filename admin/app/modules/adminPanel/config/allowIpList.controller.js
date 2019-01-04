'use strict';
angular.module('gujaratSamachar.adminPanel')
    .controller('AllowIpListController', AllowIpListController);

AllowIpListController.$inject = ['$log', '$scope', '$state', 'toastr', 'AdminService', '$uibModal', '$stateParams'];
function AllowIpListController($log, $scope, $state, toastr, AdminService, $uibModal, $stateParams) {
    var vm = this;
    vm.deleteIp = deleteIp;
    vm.pageChanged = pageChanged;
    vm.pageIndex = $stateParams.pageIndex;
    vm.pagination = {
        current: vm.pageIndex
    };
    vm.toggleCheckBox = toggleCheckBox;
    vm.checkAllBox = checkAllBox;
    vm.deleteSingleAllowIp = deleteSingleAllowIp;
    vm.deleteSelectedAllowIp = deleteSelectedAllowIp;
    vm.deleteIdList = [];
    vm.allowAll = allowAll;
    vm.changeStatus = changeStatus;



    /* Get sections based on selected page number */
    function pageChanged(newPage) {
        $state.go("root.allowIpList", { pageIndex: newPage });
    }
    function allowAll(ip) {
        var findObj = {};
        vm.allowAllIp = ip;
        if (vm.allowAllIp !== undefined && vm.allowAllIp !== null && vm.allowAllIp !== "") {
            findObj['isAllowAll'] = vm.allowAllIp;
            AdminService.allowAll().update(findObj, function (status) {
                if (status.code == 200) {
                    allowAllStatus();
                    toastr.success(status.message, "", {
                        closeButton: true,
                        timeOut: 3000,
                        preventOpenDuplicates: true
                    });
                }
            })
        }
    }
    allowAllStatus();
    function allowAllStatus() {
        AdminService.allowAllStatus().get({}, function (status) {
            if (status.code == 200) {
                vm.allowAllIp = status.data[0].ipConfig;
            } else {
                vm.allowAllIp = false;
            }
        });
    }
    function getAllowIpList() {
        var findObj = {};
        if (vm.pageIndex !== undefined && vm.pageIndex !== null && vm.pageIndex !== "") {
            findObj['pageIndex'] = vm.pageIndex;
        } else {
            findObj['pageIndex'] = 0;
        }
        vm.allowIpListLoaded = false;
        AdminService.allowIpList().get(findObj, function (ipList) {
            if (ipList.data.document.length > 0) {
                vm.ipList = ipList.data.document;
                vm.ipsPerPage = ipList.data.documentPerPage;
                vm.totalIp = ipList.data.totalCount;
            } else if (ipList.data.document.length == 0 && vm.pageIndex !== 1) {
                vm.pageIndex = 1;
                getAllowIpList();
            } else {
                vm.ipList = [];
                vm.totalIp = 0;
                vm.pageIndex = 1;
            }
            vm.allowIpListLoaded = true;

        })
    }
    getAllowIpList();


    function toggleCheckBox(id, isChecked) {
        if (isChecked) {
            vm.deleteIdList.push(id);
        } else {
            var index = vm.deleteIdList.indexOf(id)
            vm.deleteIdList.splice(index, 1);
        }
        if (vm.deleteIdList.length == vm.ipList.length) {
            vm.selectAll = true;
        }
        else {
            vm.selectAll = false
        }
    }

    function checkAllBox() {
        vm.deleteIdList = [];
        if (vm.deleteIdList.length == vm.ipList.length || !vm.selectAll) {
            vm.ipList = vm.ipList.map(function (slideShow) {
                slideShow.isChecked = false;
                return slideShow;
            });
        }
        else {
            if (vm.selectAll) {
                vm.ipList = vm.ipList.map(function (slideShow) {
                    slideShow.isChecked = true;
                    vm.deleteIdList.push(slideShow._id);
                    return slideShow;
                });
            }
        }
    }

    function deleteSingleAllowIp(allowIpId) {
        vm.deleteIdList = [];
        vm.deleteIdList.push(allowIpId);
        deleteIp()
    }

    function deleteSelectedAllowIp(allowIpIds) {
        vm.deleteIdList = [];
        vm.ipList.map(function (allowIp) {
            if (allowIp.isChecked)
                vm.deleteIdList.push(allowIp._id);
            return allowIp;
        });
        deleteIp()
    }
    function deleteIp() {
        AdminService.allowIp().delete({ allowIpId: JSON.stringify(vm.deleteIdList) }, function (status) {
            if (status.code == 200) {
                toastr.success(status.message, "", {
                    closeButton: true,
                    timeOut: 3000,
                    preventOpenDuplicates: true
                });
            }
            getAllowIpList();
        });
    }

    function changeStatus(id, status) {
        AdminService.allowIpChangeStatus().update({ allowIpId: id }, { isActive: status }, function (status) {
            if (status.code == 200) {
                toastr.success(status.message, "", {
                    closeButton: true,
                    timeOut: 3000,
                    preventOpenDuplicates: true
                });
            }
            getAllowIpList();
        });
    }

}