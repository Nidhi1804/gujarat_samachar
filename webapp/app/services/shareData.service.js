'use strict';

/*
 * ShareData : factory created to share data account info between two controller
 */
angular.module('gujaratSamachar')
    .factory('shareData', function() {
        var data = {
            accountInfo: ''
        };
        return {
            get: function(key) {
                return data[key];
            },
            set: function(key, value) {
                data[key] = value;
            },
            clear: function(key) {
                delete data[key];
            }
        };
    });