angular.module('gujaratSamachar.main')
    .directive('imageLoading', [function () {
        return {
            restrict: 'A',
            link: function (scope, ele) {
                var divEle = ele.find('.row');
                var img = ele.find('.poster-image');
                img.bind('load', function () {
                    divEle.removeClass('hidden');
                });
            }
        };
    }]);