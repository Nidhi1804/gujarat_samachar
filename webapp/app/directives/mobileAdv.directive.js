angular.module('gujaratSamachar')
.directive('mobileAdv',function (AdService, GENERAL_CONFIG, $stateParams,$q){
	return{
		restrict: 'E',
		scope:{
			pageType:'@?',
			sort: '@?',
			mobileAdData:'='
		},
		templateUrl: 'directives/mobileAdv.html',
		controller:function($scope, $state, $rootScope){
			var vm = this;
		},
		controllerAs:'vm'
	};
});