(function() {

    'use strict'

    var app = angular.module("gApp", ['ui.router', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'slickCarousel', 'fancyboxplus']);

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'modules/home/home.view.html',
                controller: 'home.controller'
            })
            .state('article-detail', {
                url: '/article-detail',
                templateUrl: 'modules/article-detail/article-detail.html',
                controller: 'article-detail.controller'
            })
            .state('category-home', {
                url: '/category-home',
                templateUrl: 'modules/category-home/category-home.html',
                controller: 'category-home.controller'
            })
            .state('magazines-home', {
                url: '/magazines-home',
                templateUrl: 'modules/magazines-home/magazines-home.html',
                controller: 'magazines-home.controller'
            })
            .state('magazine-article-detail-page', {
                url: '/magazine-article-detail-page',
                templateUrl: 'modules/magazine-article-detail-page/magazine-article-detail-page.html',
                controller: 'magazine-article-detail-page.controller'
            })
            .state('gujarat-city-home', {
                url: '/gujarat-city-home',
                templateUrl: 'modules/gujarat-city-home/gujarat-city-home.html',
                controller: 'gujarat-city-home.controller'
            })
            .state('gujarat-exclusive-home', {
                url: '/gujarat-exclusive-home',
                templateUrl: 'modules/gujarat-exclusive-home/gujarat-exclusive-home.html',
                controller: 'gujarat-exclusive-home.controller'
            })
            .state('gujarat-exclusive-article-detail', {
                url: '/gujarat-exclusive-article-detail',
                templateUrl: 'modules/gujarat-exclusive-article-detail/gujarat-exclusive-article-detail.html',
                controller: 'gujarat-exclusive-article-detail.controller'
            })
            .state('vaividhya', {
                url: '/vaividhya',
                templateUrl: 'modules/vaividhya/vaividhya.html',
                controller: 'vaividhya.controller'
            })
            .state('more-poll', {
                url: '/more-poll',
                templateUrl: 'modules/more-poll/more-poll.html',
                controller: 'more-poll.controller'
            })
            .state('usa-ads', {
                url: '/usa-ads',
                templateUrl: 'modules/usa-ads/usa-ads.html',
                controller: 'usa-ads.controller'
            })
            .state('photo-gallery', {
                url: '/photo-gallery',
                templateUrl: 'modules/photo-gallery/photo-gallery.html',
                controller: 'photo-gallery.controller'
            })
            .state('slide-show', {
                url: '/slide-show',
                templateUrl: 'modules/slide-show/slide-show.html',
                controller: 'slide-show.controller'
            })
            .state('slide-show-detail', {
            url: '/slide-show-detail',
            templateUrl: 'modules/slide-show-detail/slide-show-detail.html',
            controller: 'slide-show-detail.controller'
            });

        $urlRouterProvider.otherwise('/');
    }])
})();

angular.module('gApp').controller('CollapseDemoCtrl', function($scope) {
    $scope.isNavCollapsed = true;
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;
});
