'use strict';

angular.module('gujaratSamachar')
.factory('httpInterceptorService', httpInterceptorService);

// Dependency injection
httpInterceptorService.$inject = ['$q', '$rootScope'];

function httpInterceptorService($q, $rootScope) {
	// Active request count
		var requestCount = 0;

		function startRequest(config) {
		// If no request ongoing, then broadcast start event
		if( !requestCount ) {
			$rootScope.$broadcast('httpLoaderStart');
			$rootScope.showLoader = true;
			NProgress.start();
		}

		requestCount++;
		return config;
	}

	function endRequest(arg) {
		// No request ongoing, so make sure we don’t go to negative count
		if( !requestCount )
			return;

		requestCount--;
		// If it was last ongoing request, broadcast event
		if( !requestCount ) {
			$rootScope.$broadcast('httpLoaderEnd');
			$rootScope.showLoader = false;
			NProgress.done();
		}

		return arg;
	}

	// Return interceptor configuration object
	return {
		'request': startRequest,
		'requestError': endRequest,
		'response': endRequest,
		'responseError': endRequest
	};
}