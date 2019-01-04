'use strict';
angular.module('gujaratSamachar')  
  .component('newsBox', {
    bindings: {
    categoryBlockData : '@',
    detailArticleUrl : '<',
    articlesLoaded : '<',
    key: '@'
  },
  templateUrl: 'component/news-box/news-box.html',
  controller: newsBoxController,
  controllerAs: 'vm'
  
});