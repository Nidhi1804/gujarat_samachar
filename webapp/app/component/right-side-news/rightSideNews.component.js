'use strict';
angular.module('gujaratSamachar')  
  .component('rightSideNews', {
    bindings: {
    title : '@',
    data : '<',
    articleUrl : '<',
    articlesLoaded : '@'
  },
  templateUrl: 'component/right-side-news/right-side-news.html',
  controller: rightSideNewsController,
  controllerAs: 'vm'
  
});