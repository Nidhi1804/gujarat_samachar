(function () {
	'use strict';
	angular.module('gujaratSamachar')
	.factory('localStorageService', localStorageService);

	localStorageService.$inject = [];

	function localStorageService() {
		var service = {
			getLoggedInUserInfo:getLoggedInUserInfo,
			setLoggedInUserInfo:setLoggedInUserInfo,
			removeLoggedInUserInfo:removeLoggedInUserInfo,
			setRememberMe:setRememberMe,
			getRememberMe:getRememberMe,
			removeRememberMe:removeRememberMe,
			getPreviousState: getPreviousState,
			setPreviousState: setPreviousState,
			clearPreviousState: clearPreviousState
		}
		return service;

		function getLoggedInUserInfo(){
			return localStorage.getItem('loggedInUserInfo');
		}

		function setLoggedInUserInfo(user){
			localStorage.setItem('loggedInUserInfo',user);
		}
		function removeLoggedInUserInfo(){
			localStorage.removeItem('loggedInUserInfo');
		}
		function setRememberMe(userInfo){
			localStorage.setItem('rememberMe',userInfo);
		}
		function getRememberMe(){
			return localStorage.getItem('rememberMe');
		}
		function removeRememberMe(){
		    localStorage.removeItem('rememberMe');
		}

		/* Saving previous state for modules */
		function getPreviousState() {
		    return localStorage.getItem('previousStates');
		}
		function setPreviousState(previousStatesForAllModules) {
		    return localStorage.setItem('previousStates', previousStatesForAllModules);   
		}
		function clearPreviousState() {
		    localStorage.removeItem('previousStates');   
		}
	}
})();
