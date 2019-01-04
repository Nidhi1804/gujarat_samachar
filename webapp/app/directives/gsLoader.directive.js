'use strict';
angular.module('gujaratSamachar')
  .directive('gsLoading', function () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'directives/gsLoader.view.html',
      scope: {
        showLoader: '=?'
      },
      controller: function($scope, $rootScope){        
        $rootScope.loading = false;
      }
    };
  });


angular.module('gujaratSamachar').directive('ngSpinnerBar', ['$rootScope','$transitions', '$timeout',
    function($rootScope, $transitions, $timeout) {
        return {
            link: function(scope, element, attrs) {

                // display the spinner bar whenever the route changes(the content part started loading)
                $transitions.onStart({}, function() {
                    window.scrollTo(0, 0);
                    $rootScope.loading = true;
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $transitions.onSuccess({}, function() {
                    // auto scorll to page top
                    $timeout(function () {
                      $rootScope.loading = false;
                      $('html,body').animate({
                            scrollTop: 0
                      }, 'slow');
                    }, 500);  
                });
                  $timeout(function() {
                      $rootScope.hideLoader = true;
                  }, 1000);   

                // handle errors
                $transitions.onError({}, function() {
                    element.addClass('hide'); // hide spinner bar
                });

                $(element).ready(function() {
                    //$rootScope.hideLoader = true;
                })
            }
        };
    }
])

