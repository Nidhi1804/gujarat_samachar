/*** Disqus Comment Module ***/
'use strict';
angular.module('gujaratSamachar')
  .directive('disqusComments',function($timeout,$rootScope,GENERAL_CONFIG) {
    return {
       restrict: 'EA',
       templateUrl: 'directives/disqusComments.view.html',
       scope:{
          identifier:'=',
          newTitle:'=',
          newUrl:'@',          
       },
       link: function(scope, elm, attrs) {
          scope.isLoadedJS = $rootScope.isLoadedJS;
          if(!$rootScope.isLoadedJS){
            scope.isFirst = true;
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = 'https://gujaratsamachar-1.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);    
            $rootScope.isLoadedJS = true
          }else{
              scope.isFirst = false;
              scope.reset = function (newIdentifier, newUrl, newTitle) {
              DISQUS.reset({
                  reload: true,
                  config: function () {
                      this.page.identifier = newIdentifier;
                      this.page.url = newUrl;
                      this.page.title = newTitle;
                  }
              });
            }  
            scope.reset(scope.identifier,scope.newUrl,scope.newTitle,'en');          
          }
       }
    }; 
});