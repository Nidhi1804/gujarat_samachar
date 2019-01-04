/* Directive to get window wisth on window resize */
angular.module('gujaratSamachar')
    .directive('windowResize', ['$window', function($window) {
        return {
            link: link,
            restrict: 'A'
        };

        function link(scope, element, attrs) {
            scope.width = $window.innerWidth;

            function onResize() {
                // uncomment for only fire when $window.innerWidth change   
                if (scope.width !== $window.innerWidth) {
                    scope.width = $window.innerWidth;
                    scope.$digest();
                }
            };

            function cleanUp() {
                angular.element($window).off('resize', onResize);
            }

            angular.element($window).on('resize', onResize);
            scope.$on('$destroy', cleanUp);
        }
    }]);