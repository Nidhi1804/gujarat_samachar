'use strict';
angular.module('gujaratSamachar.adminPanel')
	.controller('AddEditUserController', AddEditUserController);

AddEditUserController.$inject = ['$log', '$state', 'toastr', 'GENERAL_CONFIG', 'localStorageService', 'AuthService', '$scope', 'AdminService', 'FileUploader', '$filter', 'uibDateParser', '$stateParams', '$rootScope'];
function AddEditUserController($log, $state, toastr, GENERAL_CONFIG, localStorageService, AuthService, $scope, AdminService, FileUploader, $filter, uibDateParser, $stateParams, $rootScope) {
	var vm = this;
	vm.user = {}
	vm.addUser = addUser;
	vm.updateUser = updateUser;
	vm.openDate = openDate;
	vm.checkEmailAvailablity = checkEmailAvailablity;
	vm.checkEmail = false;
	vm.baseUrl = GENERAL_CONFIG.app_base_url;
	var loggedInUserInfo = JSON.parse(localStorageService.getLoggedInUserInfo());
	vm.userId = $stateParams.userId;
	var url, method;
	if (vm.userId && vm.userId !== '' && vm.userId !== null) {
		method = 'PUT';
		url = GENERAL_CONFIG.app_base_url + '/api/users/' + vm.userId;
		getUserInfo(vm.userId);
	} else {
		method = 'POST';
		url = GENERAL_CONFIG.app_base_url + '/api/users/add';
	}
	vm.userGroup = [
		{ id: 1, name: 'Administrator' },
		{ id: 1, name: 'Editor' },
		{ id: 1, name: 'Operator' },
		{ id: 1, name: 'Manager' }
	]
	vm.dateOption = {
		maxDate: new Date(),
		startingDay: 1,
		showWeeks: false
	};
	function openDate() {
		vm.openDate.opened = true;
	}

	/* File upload config */
	vm.uploader = new FileUploader({
		url: url,// Based on add/edit operation
		alias: 'profileImage',
		method: method,
		headers: {
			Authorization: 'Bearer ' + loggedInUserInfo.token
		}
	});

	/* Show error message for require image file */
	vm.uploader.filters.push({
		name: 'clearQueueFilter',
		fn: function (item /*{File|FileLikeObject}*/, options) {
			vm.uploader.clearQueue();
			return true;
		}
	});
	// Image type filter
	vm.uploader.filters.push({
		name: 'imageFilter',
		fn: function (item /*{File|FileLikeObject}*/, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			if ('|jpg|png|jpeg|gif|'.indexOf(type) == -1) {
				vm.imageTypeErr = true;
			} else {
				vm.imageTypeErr = false;
				vm.requireFileError = false;
			}

			return '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
		}
	}, {
			/* Prevent file upload greater than 3.0mb size*/
			name: 'imageSizeFilter',
			fn: function (item /*{File|FileLikeObject}*/, options) {
				if (item.size > 3145728) {
					vm.imageSizerr = true;
				} else {
					vm.imageSizerr = false;
				}
				return item.size <= 3145728; // 3.5 MiB to bytes
			}
		});

	/* isHTML5 {Boolean}: true if uploader is html5-uploader. Read only. */
	if (vm.uploader.isHTML5) {
		vm.uploader.image = false;
	}

	vm.uploader.onBeforeUploadItem = function (item) {
		/* Push form data in queue before file upload */
		vm.user.dateOfBirth = $filter('date')(vm.DOB, 'yyyy-MM-dd')
		item.formData.push(vm.user);
	};

	/* Add new user */
	function addUser(isValid, redirectFlag) {
		vm.user.dateOfBirth = $filter('date')(vm.DOB, 'yyyy-MM-dd')
		if (isValid) {
			if (vm.uploader.queue.length == 0) {
				addUserWithoutProfile(isValid, redirectFlag);
			}
			vm.uploader.uploadAll();

		}
	}

	vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
		if (response.code == 200) {
			toastr.success(response.message, "", {
				closeButton: true,
				timeOut: 3000,
				preventOpenDuplicates: true
			});
			vm.user = {};
			getUserInfo(vm.userId, true)
			$state.go('root.userList.id', { pageId: 1 });
		}
	};

	/* Submit form if profile image not uploaded */
	function addUserWithoutProfile(isValid, redirectFlag) {
		if (isValid) {
			vm.invalidForm = false; // Flag used to show error only after form submission
			AdminService.addUser().save(vm.user, function (response) {
				if (response.code == 200) {
					toastr.success(response.message, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					if (redirectFlag === false) {
						$state.go('root.userList.id', { pageId: 1 })
					}
					else {
						reset();
						$state.go('root.addUser');
					}
				}
			})
		} else {
			vm.invalidForm = true;
		}
	}

	/* Check if email already in use or not */
	function checkEmailAvailablity(isError) {
		if (!isError && vm.user.email) {
			vm.checkEmail = true

			AdminService.checkEmailAvailablity().save({ email: vm.user.email }, function (response) {
				if (response.code == 200) {
					vm.isEmailAvailable = true;
				} else {
					vm.isEmailAvailable = false
				}
			})
		}
	}

	/* Get user info to edit user */
	function getUserInfo(userId, isGetInfoAfterUpdate) {
		AdminService.user().get({ userId: userId }, function (response) {
			if (response) {
				if (isGetInfoAfterUpdate) {
					if (loggedInUserInfo.userId == response.data._id) {
						// This flag is used to update user logo image and name in header after profile update.
						loggedInUserInfo.profileImage = response.data.profileImage;
						loggedInUserInfo.firstName = response.data.firstName;
						loggedInUserInfo.lastName = response.data.lastName;
						loggedInUserInfo.role = response.data.role;
						localStorageService.removeLoggedInUserInfo();
						localStorageService.setLoggedInUserInfo(JSON.stringify(loggedInUserInfo));
						$rootScope.$broadcast('refreshUserHeaderDetail', loggedInUserInfo);
					}
				}
				vm.user = response.data;
				vm.user.password = '******';
				vm.user.mobileNo = parseInt(vm.user.mobileNo);
				vm.user.phoneNo = parseInt(vm.user.phoneNo);
				vm.DOB = new Date(vm.user.dateOfBirth)
			}
		});
	}

	/* Update user if page in edit mode */
	function updateUser(isValid, redirectFlag) {
		if (isValid) {
			vm.user.dateOfBirth = $filter('date')(vm.DOB, 'yyyy-MM-dd')
			if (vm.uploader.queue.length == 0) {
				updateUserWithoutProfile(isValid, redirectFlag);
			}
			vm.uploader.uploadAll();
		}
	}
	function updateUserWithoutProfile(isValid, redirectFlag) {
		if (isValid) {
			AdminService.user().update({ userId: vm.userId }, vm.user, function (response) {
				if (response.code == 200) {
					toastr.success(response.message, "", {
						closeButton: true,
						timeOut: 3000,
						preventOpenDuplicates: true
					});
					getUserInfo(vm.userId, true)
					if (redirectFlag === false) {
						$state.go('root.userList.id', { pageId: 1 })
					}
					else {

						$state.go('root.addUser');
					}
				}
			});
		}
	}

	function reset() {
		vm.user = {};
		vm.addUserForm.$setPristine();
	}
}