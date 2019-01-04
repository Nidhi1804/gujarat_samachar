'use strict';
angular.module('gujaratSamachar')  
  .directive('googleAd', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      scope:{
        html:'='
      },
      link: function(scope, element, attr) {
        //console.log("scope.html --- : ", scope.html);        
        if(scope.html){
          return $timeout(function() {
            var adsbygoogle, html, rand;
            rand = Math.random(); //In "rand" var it will generate the random value to google "data-ad-region" which will make sure page got refereshed.
            html = scope.html;
            //html = '<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-9759829929599812" data-ad-slot="2904456688" data-ad-region="page-' + rand + '"></ins>';
            $(element).append(html);
            return (adsbygoogle = window.adsbygoogle || []).push({});
          });
        }
      
      }
    };
  }
]);
// http://www.w3tweaks.com/angularjs/google-ads-in-angular-js-app.html  