'use strict';

//Directive used to highlight search results
angular.module('gujaratSamachar')
    .filter('highlight', function($sce) {
        return function(text, phrase) {
          if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
            '<span class="highlighted">$1</span>')

          return $sce.trustAsHtml(text)
        }
      })
    .filter('secondsToDateTime', function() {
	    return function(seconds) {
	        var d = new Date(0,0,0,0,0,0,0);
	        d.setSeconds(seconds);
	        return d;
	    };
	});