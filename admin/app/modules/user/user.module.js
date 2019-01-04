angular
	.module('gujaratSamachar.user', [
		'ui.router',
		'ngResource'
	])
	.config(config)
	.run(run)
	config.$inject = ['$urlRouterProvider','$locationProvider','$httpProvider','$stateProvider', '$ocLazyLoadProvider'];
	function config($urlRouterProvider,$locationProvider,$httpProvider,$stateProvider, $ocLazyLoadProvider) {
		//$locationProvider.html5Mode(true).hashPrefix('!');
    	$locationProvider.hashPrefix('');
		$urlRouterProvider.otherwise('/login');

		$stateProvider			
			.state('login', {
				url:'/login',
				controller: 'LoginController as vm',
				templateUrl: 'modules/user/login/login.view.html',
				data:{
					pageTitle:'Login'
				},
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad){
						return $ocLazyLoad.load('modules/user/login/login.controller.js');
					}],
					isLoggedIn : function(AuthService){						
						/* Redirect page to dashboard if user loggedIn */
						return AuthService.isLoggedIn();
					}
				}
			})
			.state('forgot-password', {
				url:'/forgot-password',
				controller: 'ForgotPwdController as vm',
				templateUrl: 'modules/user/forgotPassword/forgotPassword.view.html',
				data:{
					pageTitle:'Forgot Password'
				},
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad){
						return $ocLazyLoad.load('modules/user/forgotPassword/forgotPassword.controller.js');
					}]
				}
			})
			.state('reset-password', {
				url:'/reset-password',   
				controller: 'ResetPwdController as vm',
				templateUrl: 'modules/user/resetPassword/resetPassword.view.html',
				data:{
					pageTitle:'Reset Password'
				},
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad){
						return $ocLazyLoad.load('modules/user/resetPassword/resetPassword.controller.js');
					}],
					data: function (AuthService) {
						return AuthService.isResetPwdLinkExpired();
					}
				}
			})			
			.state('display-information-message', {
				templateUrl: '../../partial-views/displayMessage/displayMessage.view.html',
				controller:'DisplayMessageController as vm',
				params:{
					'msg':null
				},
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad){
						return $ocLazyLoad.load('../../partial-views/displayMessage/displayMessage.controller.js');
					}]					
				}				
			})			
	}

	run.$inject = ['$rootScope', '$location', '$http', '$state', '$q', '$transitions', '$timeout'];
	function run($rootScope, $location, $http, $state, $q, $transitions, $timeout) {		
	};