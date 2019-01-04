'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('UserListController', UserListController);

UserListController.$inject = ['$log', '$scope', 'AdminService', 'toastr', '$uibModal', '$state', '$stateParams', 'localStorageService', '$location'];
function UserListController($log, $scope, AdminService, toastr, $uibModal, $state, $stateParams, localStorageService, $location) {
	var vm = this;
	vm.userList = [];
	vm.pageChanged = pageChanged;
	vm.totalItem = 0;
	vm.changeStatus = changeStatus;
	vm.deleteUser = deleteUser;
	vm.pageId = $stateParams.pageId;
	var loggedInUserInfo = JSON.parse(localStorageService.getLoggedInUserInfo());
	vm.loggedInUserId = loggedInUserInfo.userId;
	vm.pagination = {
		current: vm.pageId
	};
	vm.deleteIdList = [];
	vm.checkAllBox = checkAllBox;
	vm.toggleCheckBox = toggleCheckBox;
	vm.deleteSelectedUsers = deleteSelectedUsers;
	vm.deleteSingleUser = deleteSingleUser;
	vm.singleUserChangeStatus = singleUserChangeStatus;
	vm.searchUser = searchUser;
	vm.searchText = $location.search().searchText;
	vm.group = $location.search().group;
	vm.changePassword = changePassword;
	vm.resetFilter = resetFilter;

	/* Get user list */
	getUsers(vm.pageId);

	vm.userGroup = [
		{ id: 1, name: 'All' },
		{ id: 1, name: 'Administrator' },
		{ id: 1, name: 'Editor' },
		{ id: 1, name: 'Operator' },
		{ id: 1, name: 'Manager' }
	]
	function getUsers(pageNumber) {
		vm.isUsersLoaded = false;
		App.startPageLoading({ animate: true });
		var findObj = {
			pageId: pageNumber
		};
		if (vm.searchText !== undefined && vm.searchText !== null && vm.searchText !== "") {
			findObj.searchText = vm.searchText;
		}
		if (vm.group !== undefined && vm.group !== null && vm.group !== "") {
			findObj.group = vm.group;
		}
		AdminService.user().get(findObj, function (response) {
			vm.isUsersLoaded = true;
			if (response.code == 200) {
				vm.itemPerPage = response.data.perPage;
				vm.totalItem = response.data.totalItem;
				vm.userList = response.data.userList;
			}
			App.stopPageLoading();
		})
	}
	/* Get users based on selected page number */
	function pageChanged(newPage) {
		$state.go("root.userList.id", { pageId: newPage });
	}

	function toggleCheckBox(id, isChecked) {
		if (isChecked) {
			vm.deleteIdList.push(id);
		} else {
			var index = vm.deleteIdList.indexOf(id)
			vm.deleteIdList.splice(index, 1);
		}
		if (vm.deleteIdList.length == vm.userList.length) {
			vm.selectAll = true;
		}
		else {
			vm.selectAll = false
		}
	}

	function checkAllBox() {
		vm.deleteIdList = [];
		if (vm.deleteIdList.length == vm.userList.length || !vm.selectAll) {
			vm.userList = vm.userList.map(function (user) {
				user.isChecked = false;
				return user;
			});
		}
		else {
			if (vm.selectAll) {
				vm.userList = vm.userList.map(function (user) {
					user.isChecked = true;
					vm.deleteIdList.push(user._id);
					return user;
				});
			}
		}
	}

	function deleteSingleUser(userId) {
		vm.deleteIdList = [];
		vm.deleteIdList.push(userId);
		deleteUser()
	}

	function deleteSelectedUsers(userIds) {
		vm.deleteIdList = [];
		vm.userList.map(function (user) {
			if (user.isChecked)
				vm.deleteIdList.push(user._id);
			return user;
		});
		deleteUser()
	}

	function deleteUser() {
		if (vm.deleteIdList.indexOf(vm.loggedInUserId) === -1) {
			AdminService.user().delete({ userId: JSON.stringify(vm.deleteIdList) }, function (response) {
				if (response.code == 200) {
					toastr.success(response.message, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					pageChanged(vm.pagination.current)
					getUsers(vm.pageId);
				}
			})
		}
	}
	function searchUser() {
		let group;
		if(vm.group !== 'All') {
			group = vm.group;
		} else {
			group = '';
		}
		$state.go("root.userList.id", { pageId: 1, searchText: vm.searchText, group: group });
	}

	function resetFilter() {
		vm.searchText = "";
		if(vm.group) {
			vm.group = 'All';
		}
		searchUser();
	}

	function changeStatus(status) {
		if (vm.deleteIdList.indexOf(vm.loggedInUserId) === -1) {
			AdminService.changeUserStatus().update({ userIds: JSON.stringify(vm.deleteIdList) }, { userStatus: status }, function (response) {
				if (response.code == 200) {
					toastr.success(response.message, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					getUsers(vm.pageId);
				}
			})
		}
	}

	function singleUserChangeStatus(ids, status) {
		if (ids !== undefined && ids !== null && ids !== "" && !Array.isArray(ids)) {
			vm.deleteIdList = [];
			vm.deleteIdList.push(ids);
		}
		changeStatus(status);
	}

	function changePassword(userId) {
		$scope.userId = userId;
		const changePasswordInstance = $uibModal.open({
			templateUrl: 'modules/adminPanel/userManagement/changePassword/changePassword.view.html',
			controller: 'ChangePwdModelController as vm',
			scope:$scope
		});
		changePasswordInstance.result.then(function (result) {
			
		},
		function (err) {
			console.info('Modal dismissed at: ' + new Date());
		});
	}
}
