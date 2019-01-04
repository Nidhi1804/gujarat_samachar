/**
 * node-deeplink v0.1
 *
 * Author: mderazon/node-deeplink
 * GitHub: https://github.com/mderazon/node-deeplink/tree/master/lib/public
 * GitHub: https://github.com/mderazon/node-deeplink/tree/master/lib/public/index.html
 * GitHub: https://github.com/mderazon/node-deeplink/blob/master/lib/public/script.js
 *
 * MIT License
 */
 
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define("deeplink", factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root["deeplink"] = factory(root);
    }
})(window || this, function(root) {
    "use strict";
    var deepone = function(options) {
      var fallback = options.fallback || ''
      var url = options.url || ''
      var iosStoreLink = options.ios_store_link
      var androidPackageName = options.android_package_name
      var playStoreLink = 'https://market.android.com/details?id=' + androidPackageName
      var ua = window.navigator.userAgent

      // split the first :// from the url string
      var split = url.split(/:\/\/(.+)/)
      var scheme = split[0]
      var path = split[1] || ''

      var urls = {
        deepLink: url,
        iosStoreLink: iosStoreLink,
        android_intent: 'intent://' + path + '#Intent;scheme=' + scheme + ';package=' + androidPackageName + ';end;',
        playStoreLink: playStoreLink,
        fallback: fallback
      }

      var isMobile = {
        android: function () {
          return /Android/i.test(ua)
        },
        ios: function () {
          return /iPhone|iPad|iPod/i.test(ua)
        }
      }

      // fallback to the application store on mobile devices
      if (isMobile.ios() && urls.deepLink && urls.iosStoreLink) {
        iosLaunch()
      } else if (isMobile.android() && androidPackageName) {
        androidLaunch()
      } else {
        window.location = urls.fallback
      }

      function launchWekitApproach (url, fallback) {
        document.location = url
        setTimeout(function () {
          document.location = fallback
        }, 2000);
      }

      function launchIframeApproach (url, fallback) {
        var iframe = document.createElement('iframe')
        iframe.style.border = 'none'
        iframe.style.width = '1px'
        iframe.style.height = '1px'
        iframe.onload = function () {
          document.location = url
        }
        iframe.src = url

        window.onload = function () {
          document.body.appendChild(iframe)

          setTimeout(function () {
            window.location = fallback
          }, 25)
        }
      }

      function iosLaunch () {
        // chrome and safari on ios >= 9 don't allow the iframe approach
        if (ua.match(/CriOS/) || (ua.match(/Safari/) && ua.match(/Version\/(9|10|11)/))) {
          launchWekitApproach(urls.deepLink, urls.iosStoreLink || urls.fallback)
        } else {
          launchIframeApproach(urls.deepLink, urls.iosStoreLink || urls.fallback)
        }
      }

      function androidLaunch () {
        if (ua.match(/Chrome/)) {
          document.location = urls.android_intent
        } else if (ua.match(/Firefox/)) {
          launchWekitApproach(urls.deepLink, urls.playStoreLink || urls.fallback)
        } else {
          launchIframeApproach(url, urls.playStoreLink || urls.fallback)
        }
      }
    };

    // Public API
    return {
        deepone:deepone
    };

});
