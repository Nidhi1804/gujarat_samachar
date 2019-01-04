'use strict';
angular.module('gujaratSamachar')
	.factory('AuthService', AuthService);

AuthService.$inject = ['$resource', '$http', 'GENERAL_CONFIG', '$q', '$location', '$state', 'localStorageService'];

function AuthService($resource, $http, GENERAL_CONFIG, $q, $location, $state, localStorageService) {
	var service = {
		login: login,
		logout: logout,
		forgotPassword: forgotPassword,
		resetPassword: resetPassword,
		getToken: getToken,
		getLoggedInUserInfo: getLoggedInUserInfo,
		verifyResetPwdLink: verifyResetPwdLink,
		isTokenExist: isTokenExist,
		checkResourceAccessibilityToUser: checkResourceAccessibilityToUser,
		isResetPwdLinkExpired: isResetPwdLinkExpired,
		isLoggedIn: isLoggedIn,
		isAdminUserExist: isAdminUserExist,
		isAdminAndManagerUserExist: isAdminAndManagerUserExist
	};
	return service;
	function login(loginCredentials) {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/login');
	}
	function logout() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/logout');
	}
	function forgotPassword(loginCredentials) {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/forgot-password');
	}
	function resetPassword() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/reset-password');
	}
	function getToken(clientToken) {
		return $http.get(GENERAL_CONFIG.app_base_url + "/api/users/getToken");
	}
	function getLoggedInUserInfo() {
		return $http.get(GENERAL_CONFIG.app_base_url + "/api/users/get-userinfo");
	}
	function verifyResetPwdLink(company) {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/verify-reset-pwd-link');
	}
	function checkResourceAccessibilityToUser() {
		return $resource(GENERAL_CONFIG.app_base_url + '/api/users/resources/is-authorized');
	}
	function isTokenExist() {
		if ($http.defaults.headers.common['Authorization'] != undefined)
			return true;

		var deferred = $q.defer();
		getToken().then(function (response) {
			var token = response.data;
			if (token != null && token != "") {
				$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
				return deferred.resolve(true);
			}
			else {
				return deferred.reject('Unauthenticated User');
			}
		},
			function (error) {
				return deferred.reject('Unauthenticated User');
			});

		return deferred.promise;
	}
	function isAdminUserExist() {
		var deferred = $q.defer();
		let getUserDetails = localStorageService.getLoggedInUserInfo();
		let userDetails = JSON.parse(getUserDetails);
		let loginUserGroup = userDetails.userGroup;
		if (loginUserGroup === 'Administrator') {
			return deferred.resolve(true);
		} else {
			$state.go('root');
		}
		return deferred.promise;
	}
	function isAdminAndManagerUserExist() {
		var deferred = $q.defer();
		let getUserDetails = localStorageService.getLoggedInUserInfo();
		let userDetails = JSON.parse(getUserDetails);
		let loginUserGroup = userDetails.userGroup;
		if (loginUserGroup === 'Administrator' || loginUserGroup === 'Manager') {
			return deferred.resolve(true);
		} else {
			$state.go('root');
		}
		return deferred.promise;
	}
	function isResetPwdLinkExpired() {
		var deferred = $q.defer();
		var queryStrings = {
			"email": $location.search().email,
		};
		verifyResetPwdLink().get({ email: queryStrings.email }, function (verifiedResponse) {
			if (verifiedResponse.data.isExpired) {
				return $state.go('display-information-message', { 'msg': 'Reset password link has been expired' });
			} else {
				return deferred.resolve(true);
			}
		});
		return deferred.promise;
	}

	function isLoggedIn() {
		var deferred = $q.defer();
		getToken().then(function (response) {
			var token = response.data;
			//console.log(response);
			if (token != null && token != "") {
				return $state.go('root.dashboard');
			}
			else {
				return deferred.resolve(true);
			}
		},
			function (error) {
				return deferred.resolve(true);
			});
		return deferred.promise;
	}
}