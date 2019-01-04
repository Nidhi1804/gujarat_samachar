"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 AngularJS v1.6.9
 (c) 2010-2018 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (U, a) {
  'use strict';
  function L(m, f) {
    f = f || {};a.forEach(f, function (a, d) {
      delete f[d];
    });for (var d in m) {
      !m.hasOwnProperty(d) || "$" === d.charAt(0) && "$" === d.charAt(1) || (f[d] = m[d]);
    }return f;
  }var B = a.$$minErr("$resource"),
      Q = /^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;a.module("ngResource", ["ng"]).info({ angularVersion: "1.6.9" }).provider("$resource", function () {
    var m = /^https?:\/\/\[[^\]]*][^/]*/,
        f = this;this.defaults = { stripTrailingSlashes: !0, cancellable: !1, actions: { get: { method: "GET" }, save: { method: "POST" }, query: { method: "GET",
          isArray: !0 }, remove: { method: "DELETE" }, "delete": { method: "DELETE" } } };this.$get = ["$http", "$log", "$q", "$timeout", function (d, P, F, M) {
      function C(a, d) {
        this.template = a;this.defaults = n({}, f.defaults, d);this.urlParams = {};
      }var D = a.noop,
          r = a.forEach,
          n = a.extend,
          R = a.copy,
          N = a.isArray,
          w = a.isDefined,
          x = a.isFunction,
          S = a.isNumber,
          y = a.$$encodeUriQuery,
          T = a.$$encodeUriSegment;C.prototype = { setUrlParams: function setUrlParams(a, d, f) {
          var g = this,
              c = f || g.template,
              s,
              h,
              n = "",
              b = g.urlParams = Object.create(null);r(c.split(/\W/), function (a) {
            if ("hasOwnProperty" === a) throw B("badname");!/^\d+$/.test(a) && a && new RegExp("(^|[^\\\\]):" + a + "(\\W|$)").test(c) && (b[a] = { isQueryParamValue: new RegExp("\\?.*=:" + a + "(?:\\W|$)").test(c) });
          });c = c.replace(/\\:/g, ":");c = c.replace(m, function (b) {
            n = b;return "";
          });d = d || {};r(g.urlParams, function (b, a) {
            s = d.hasOwnProperty(a) ? d[a] : g.defaults[a];w(s) && null !== s ? (h = b.isQueryParamValue ? y(s, !0) : T(s), c = c.replace(new RegExp(":" + a + "(\\W|$)", "g"), function (b, a) {
              return h + a;
            })) : c = c.replace(new RegExp("(/?):" + a + "(\\W|$)", "g"), function (a, b, e) {
              return "/" === e.charAt(0) ? e : b + e;
            });
          });g.defaults.stripTrailingSlashes && (c = c.replace(/\/+$/, "") || "/");c = c.replace(/\/\.(?=\w+($|\?))/, ".");a.url = n + c.replace(/\/(\\|%5C)\./, "/.");r(d, function (b, c) {
            g.urlParams[c] || (a.params = a.params || {}, a.params[c] = b);
          });
        } };return function (m, y, z, g) {
        function c(b, c) {
          var d = {};c = n({}, y, c);r(c, function (c, f) {
            x(c) && (c = c(b));var e;if (c && c.charAt && "@" === c.charAt(0)) {
              e = b;var k = c.substr(1);if (null == k || "" === k || "hasOwnProperty" === k || !Q.test("." + k)) throw B("badmember", k);for (var k = k.split("."), h = 0, n = k.length; h < n && a.isDefined(e); h++) {
                var g = k[h];e = null !== e ? e[g] : void 0;
              }
            } else e = c;d[f] = e;
          });return d;
        }function s(b) {
          return b.resource;
        }function h(b) {
          L(b || {}, this);
        }var O = new C(m, g);z = n({}, f.defaults.actions, z);h.prototype.toJSON = function () {
          var b = n({}, this);delete b.$promise;delete b.$resolved;delete b.$cancelRequest;return b;
        };r(z, function (b, a) {
          var f = !0 === b.hasBody || !1 !== b.hasBody && /^(POST|PUT|PATCH)$/i.test(b.method),
              g = b.timeout,
              m = w(b.cancellable) ? b.cancellable : O.defaults.cancellable;g && !S(g) && (P.debug("ngResource:\n  Only numeric values are allowed as `timeout`.\n  Promises are not supported in $resource, because the same value would be used for multiple requests. If you are looking for a way to cancel requests, you should use the `cancellable` option."), delete b.timeout, g = null);h[a] = function (e, k, G, y) {
            function z(a) {
              p.catch(D);null !== t && t.resolve(a);
            }var H = {},
                u,
                v,
                A;switch (arguments.length) {case 4:
                A = y, v = G;case 3:case 2:
                if (x(k)) {
                  if (x(e)) {
                    v = e;A = k;break;
                  }v = k;A = G;
                } else {
                  H = e;u = k;v = G;break;
                }case 1:
                x(e) ? v = e : f ? u = e : H = e;break;case 0:
                break;default:
                throw B("badargs", arguments.length);}var E = this instanceof h,
                l = E ? u : b.isArray ? [] : new h(u),
                q = {},
                C = b.interceptor && b.interceptor.response || s,
                w = b.interceptor && b.interceptor.responseError || void 0,
                I = !!A,
                J = !!w,
                t,
                K;r(b, function (a, b) {
              switch (b) {default:
                  q[b] = R(a);case "params":case "isArray":case "interceptor":case "cancellable":}
            });!E && m && (t = F.defer(), q.timeout = t.promise, g && (K = M(t.resolve, g)));f && (q.data = u);O.setUrlParams(q, n({}, c(u, b.params || {}), H), b.url);var p = d(q).then(function (c) {
              var e = c.data;if (e) {
                if (N(e) !== !!b.isArray) throw B("badcfg", a, b.isArray ? "array" : "object", N(e) ? "array" : "object", q.method, q.url);if (b.isArray) l.length = 0, r(e, function (a) {
                  "object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) ? l.push(new h(a)) : l.push(a);
                });else {
                  var d = l.$promise;L(e, l);l.$promise = d;
                }
              }c.resource = l;return c;
            }, function (a) {
              a.resource = l;return F.reject(a);
            }),
                p = p["finally"](function () {
              l.$resolved = !0;!E && m && (l.$cancelRequest = D, M.cancel(K), t = K = q.timeout = null);
            }),
                p = p.then(function (a) {
              var b = C(a);(v || D)(b, a.headers, a.status, a.statusText);return b;
            }, I || J ? function (a) {
              I && !J && p.catch(D);I && A(a);return J ? w(a) : F.reject(a);
            } : void 0);return E ? p : (l.$promise = p, l.$resolved = !1, m && (l.$cancelRequest = z), l);
          };h.prototype["$" + a] = function (b, c, d) {
            x(b) && (d = c, c = b, b = {});b = h[a].call(this, b, this, c, d);return b.$promise || b;
          };
        });return h;
      };
    }];
  });
})(window, window.angular);
//# sourceMappingURL=angular-resource.min.js.map;"use strict";

/*
 AngularJS v1.6.9
 (c) 2010-2018 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (S, q) {
  'use strict';
  function Ea(a, b, c) {
    if (!a) throw Pa("areq", b || "?", c || "required");return a;
  }function Fa(a, b) {
    if (!a && !b) return "";if (!a) return b;if (!b) return a;V(a) && (a = a.join(" "));V(b) && (b = b.join(" "));return a + " " + b;
  }function Qa(a) {
    var b = {};a && (a.to || a.from) && (b.to = a.to, b.from = a.from);return b;
  }function W(a, b, c) {
    var d = "";a = V(a) ? a : a && C(a) && a.length ? a.split(/\s+/) : [];t(a, function (a, f) {
      a && 0 < a.length && (d += 0 < f ? " " : "", d += c ? b + a : a + b);
    });return d;
  }function Ga(a) {
    if (a instanceof A) switch (a.length) {case 0:
        return a;
      case 1:
        if (1 === a[0].nodeType) return a;break;default:
        return A(ua(a));}if (1 === a.nodeType) return A(a);
  }function ua(a) {
    if (!a[0]) return a;for (var b = 0; b < a.length; b++) {
      var c = a[b];if (1 === c.nodeType) return c;
    }
  }function Ra(a, b, c) {
    t(b, function (b) {
      a.addClass(b, c);
    });
  }function Sa(a, b, c) {
    t(b, function (b) {
      a.removeClass(b, c);
    });
  }function X(a) {
    return function (b, c) {
      c.addClass && (Ra(a, b, c.addClass), c.addClass = null);c.removeClass && (Sa(a, b, c.removeClass), c.removeClass = null);
    };
  }function oa(a) {
    a = a || {};if (!a.$$prepared) {
      var b = a.domOperation || O;a.domOperation = function () {
        a.$$domOperationFired = !0;b();b = O;
      };a.$$prepared = !0;
    }return a;
  }function ha(a, b) {
    Ha(a, b);Ia(a, b);
  }function Ha(a, b) {
    b.from && (a.css(b.from), b.from = null);
  }function Ia(a, b) {
    b.to && (a.css(b.to), b.to = null);
  }function T(a, b, c) {
    var d = b.options || {};c = c.options || {};var e = (d.addClass || "") + " " + (c.addClass || ""),
        f = (d.removeClass || "") + " " + (c.removeClass || "");a = Ta(a.attr("class"), e, f);c.preparationClasses && (d.preparationClasses = ca(c.preparationClasses, d.preparationClasses), delete c.preparationClasses);
    e = d.domOperation !== O ? d.domOperation : null;va(d, c);e && (d.domOperation = e);d.addClass = a.addClass ? a.addClass : null;d.removeClass = a.removeClass ? a.removeClass : null;b.addClass = d.addClass;b.removeClass = d.removeClass;return d;
  }function Ta(a, b, c) {
    function d(a) {
      C(a) && (a = a.split(" "));var b = {};t(a, function (a) {
        a.length && (b[a] = !0);
      });return b;
    }var e = {};a = d(a);b = d(b);t(b, function (a, b) {
      e[b] = 1;
    });c = d(c);t(c, function (a, b) {
      e[b] = 1 === e[b] ? null : -1;
    });var f = { addClass: "", removeClass: "" };t(e, function (b, c) {
      var d, e;1 === b ? (d = "addClass", e = !a[c] || a[c + "-remove"]) : -1 === b && (d = "removeClass", e = a[c] || a[c + "-add"]);e && (f[d].length && (f[d] += " "), f[d] += c);
    });return f;
  }function J(a) {
    return a instanceof A ? a[0] : a;
  }function Ua(a, b, c) {
    var d = "";b && (d = W(b, "ng-", !0));c.addClass && (d = ca(d, W(c.addClass, "-add")));c.removeClass && (d = ca(d, W(c.removeClass, "-remove")));d.length && (c.preparationClasses = d, a.addClass(d));
  }function pa(a, b) {
    var c = b ? "-" + b + "s" : "";ka(a, [la, c]);return [la, c];
  }function wa(a, b) {
    var c = b ? "paused" : "",
        d = Y + "PlayState";ka(a, [d, c]);return [d, c];
  }function ka(a, b) {
    a.style[b[0]] = b[1];
  }function ca(a, b) {
    return a ? b ? a + " " + b : a : b;
  }function Ja(a, b, c) {
    var d = Object.create(null),
        e = a.getComputedStyle(b) || {};t(c, function (a, b) {
      var c = e[a];if (c) {
        var l = c.charAt(0);if ("-" === l || "+" === l || 0 <= l) c = Va(c);0 === c && (c = null);d[b] = c;
      }
    });return d;
  }function Va(a) {
    var b = 0;a = a.split(/\s*,\s*/);t(a, function (a) {
      "s" === a.charAt(a.length - 1) && (a = a.substring(0, a.length - 1));a = parseFloat(a) || 0;b = b ? Math.max(a, b) : a;
    });return b;
  }function xa(a) {
    return 0 === a || null != a;
  }function Ka(a, b) {
    var c = Q,
        d = a + "s";b ? c += "Duration" : d += " linear all";return [c, d];
  }function La() {
    var a = Object.create(null);return { flush: function flush() {
        a = Object.create(null);
      }, count: function count(b) {
        return (b = a[b]) ? b.total : 0;
      }, get: function get(b) {
        return (b = a[b]) && b.value;
      }, put: function put(b, c) {
        a[b] ? a[b].total++ : a[b] = { total: 1, value: c };
      } };
  }function Ma(a, b, c) {
    t(c, function (c) {
      a[c] = ya(a[c]) ? a[c] : b.style.getPropertyValue(c);
    });
  }var Q, za, Y, Aa;void 0 === S.ontransitionend && void 0 !== S.onwebkittransitionend ? (Q = "WebkitTransition", za = "webkitTransitionEnd transitionend") : (Q = "transition", za = "transitionend");void 0 === S.onanimationend && void 0 !== S.onwebkitanimationend ? (Y = "WebkitAnimation", Aa = "webkitAnimationEnd animationend") : (Y = "animation", Aa = "animationend");var qa = Y + "Delay",
      Ba = Y + "Duration",
      la = Q + "Delay",
      Na = Q + "Duration",
      Pa = q.$$minErr("ng"),
      Wa = { transitionDuration: Na, transitionDelay: la, transitionProperty: Q + "Property", animationDuration: Ba, animationDelay: qa, animationIterationCount: Y + "IterationCount" },
      Xa = { transitionDuration: Na, transitionDelay: la, animationDuration: Ba, animationDelay: qa },
      Ca,
      va,
      t,
      V,
      ya,
      Z,
      Da,
      ra,
      C,
      P,
      A,
      O;q.module("ngAnimate", [], function () {
    O = q.noop;Ca = q.copy;va = q.extend;A = q.element;t = q.forEach;V = q.isArray;C = q.isString;ra = q.isObject;P = q.isUndefined;ya = q.isDefined;Da = q.isFunction;Z = q.isElement;
  }).info({ angularVersion: "1.6.9" }).directive("ngAnimateSwap", ["$animate", "$rootScope", function (a, b) {
    return { restrict: "A", transclude: "element", terminal: !0, priority: 600, link: function link(b, d, e, f, n) {
        var G, l;b.$watchCollection(e.ngAnimateSwap || e["for"], function (e) {
          G && a.leave(G);l && (l.$destroy(), l = null);
          if (e || 0 === e) l = b.$new(), n(l, function (b) {
            G = b;a.enter(b, null, d);
          });
        });
      } };
  }]).directive("ngAnimateChildren", ["$interpolate", function (a) {
    return { link: function link(b, c, d) {
        function e(a) {
          c.data("$$ngAnimateChildren", "on" === a || "true" === a);
        }var f = d.ngAnimateChildren;C(f) && 0 === f.length ? c.data("$$ngAnimateChildren", !0) : (e(a(f)(b)), d.$observe("ngAnimateChildren", e));
      } };
  }]).factory("$$rAFScheduler", ["$$rAF", function (a) {
    function b(a) {
      d = d.concat(a);c();
    }function c() {
      if (d.length) {
        for (var b = d.shift(), n = 0; n < b.length; n++) {
          b[n]();
        }e || a(function () {
          e || c();
        });
      }
    }var d, e;d = b.queue = [];b.waitUntilQuiet = function (b) {
      e && e();e = a(function () {
        e = null;b();c();
      });
    };return b;
  }]).provider("$$animateQueue", ["$animateProvider", function (a) {
    function b(a) {
      if (!a) return null;a = a.split(" ");var b = Object.create(null);t(a, function (a) {
        b[a] = !0;
      });return b;
    }function c(a, c) {
      if (a && c) {
        var d = b(c);return a.split(" ").some(function (a) {
          return d[a];
        });
      }
    }function d(a, b, c) {
      return f[a].some(function (a) {
        return a(b, c);
      });
    }function e(a, b) {
      var c = 0 < (a.addClass || "").length,
          d = 0 < (a.removeClass || "").length;return b ? c && d : c || d;
    }var f = this.rules = { skip: [], cancel: [], join: [] };f.join.push(function (a, b) {
      return !a.structural && e(a);
    });f.skip.push(function (a, b) {
      return !a.structural && !e(a);
    });f.skip.push(function (a, b) {
      return "leave" === b.event && a.structural;
    });f.skip.push(function (a, b) {
      return b.structural && 2 === b.state && !a.structural;
    });f.cancel.push(function (a, b) {
      return b.structural && a.structural;
    });f.cancel.push(function (a, b) {
      return 2 === b.state && a.structural;
    });f.cancel.push(function (a, b) {
      if (b.structural) return !1;
      var d = a.addClass,
          e = a.removeClass,
          f = b.addClass,
          sa = b.removeClass;return P(d) && P(e) || P(f) && P(sa) ? !1 : c(d, sa) || c(e, f);
    });this.$get = ["$$rAF", "$rootScope", "$rootElement", "$document", "$$Map", "$$animation", "$$AnimateRunner", "$templateRequest", "$$jqLite", "$$forceReflow", "$$isDocumentHidden", function (b, c, f, s, y, sa, da, v, E, g, M) {
      function x() {
        var a = !1;return function (b) {
          a ? b() : c.$$postDigest(function () {
            a = !0;b();
          });
        };
      }function H(a, b, c) {
        var h = [],
            d = k[c];d && t(d, function (d) {
          u.call(d.node, b) ? h.push(d.callback) : "leave" === c && u.call(d.node, a) && h.push(d.callback);
        });return h;
      }function I(a, b, c) {
        var h = ua(b);return a.filter(function (a) {
          return !(a.node === h && (!c || a.callback === c));
        });
      }function K(a, k, w) {
        function K(a, c, h, k) {
          s(function () {
            var a = H(na, p, c);a.length ? b(function () {
              t(a, function (a) {
                a(f, h, k);
              });"close" !== h || p.parentNode || ba.off(p);
            }) : "close" !== h || p.parentNode || ba.off(p);
          });a.progress(c, h, k);
        }function I(a) {
          var b = f,
              c = g;c.preparationClasses && (b.removeClass(c.preparationClasses), c.preparationClasses = null);c.activeClasses && (b.removeClass(c.activeClasses), c.activeClasses = null);Oa(f, g);ha(f, g);g.domOperation();l.complete(!a);
        }var g = Ca(w),
            f = Ga(a),
            p = J(f),
            na = p && p.parentNode,
            g = oa(g),
            l = new da(),
            s = x();V(g.addClass) && (g.addClass = g.addClass.join(" "));g.addClass && !C(g.addClass) && (g.addClass = null);V(g.removeClass) && (g.removeClass = g.removeClass.join(" "));g.removeClass && !C(g.removeClass) && (g.removeClass = null);g.from && !ra(g.from) && (g.from = null);g.to && !ra(g.to) && (g.to = null);if (!(h && p && Ya(p, k, w) && D(p, g))) return I(), l;var v = 0 <= ["enter", "move", "leave"].indexOf(k),
            u = M(),
            y = u || ga.get(p);w = !y && z.get(p) || {};var E = !!w.state;y || E && 1 === w.state || (y = !L(p, na, k));if (y) return u && K(l, k, "start"), I(), u && K(l, k, "close"), l;v && ta(p);u = { structural: v, element: f, event: k, addClass: g.addClass, removeClass: g.removeClass, close: I, options: g, runner: l };if (E) {
          if (d("skip", u, w)) {
            if (2 === w.state) return I(), l;T(f, w, u);return w.runner;
          }if (d("cancel", u, w)) {
            if (2 === w.state) w.runner.end();else if (w.structural) w.close();else return T(f, w, u), w.runner;
          } else if (d("join", u, w)) if (2 === w.state) T(f, u, {});else return Ua(f, v ? k : null, g), k = u.event = w.event, g = T(f, w, u), w.runner;
        } else T(f, u, {});(E = u.structural) || (E = "animate" === u.event && 0 < Object.keys(u.options.to || {}).length || e(u));if (!E) return I(), m(p), l;var q = (w.counter || 0) + 1;u.counter = q;F(p, 1, u);c.$$postDigest(function () {
          f = Ga(a);var b = z.get(p),
              c = !b,
              b = b || {},
              h = 0 < (f.parent() || []).length && ("animate" === b.event || b.structural || e(b));if (c || b.counter !== q || !h) {
            c && (Oa(f, g), ha(f, g));if (c || v && b.event !== k) g.domOperation(), l.end();h || m(p);
          } else k = !b.structural && e(b, !0) ? "setClass" : b.event, F(p, 2), b = sa(f, k, b.options), l.setHost(b), K(l, k, "start", {}), b.done(function (a) {
            I(!a);(a = z.get(p)) && a.counter === q && m(p);K(l, k, "close", {});
          });
        });return l;
      }function ta(a) {
        a = a.querySelectorAll("[data-ng-animate]");t(a, function (a) {
          var b = parseInt(a.getAttribute("data-ng-animate"), 10),
              c = z.get(a);if (c) switch (b) {case 2:
              c.runner.end();case 1:
              z.delete(a);}
        });
      }function m(a) {
        a.removeAttribute("data-ng-animate");z.delete(a);
      }function L(a, b, c) {
        c = s[0].body;var h = J(f),
            k = a === c || "HTML" === a.nodeName,
            d = a === h,
            g = !1,
            e = ga.get(a),
            p;for ((a = A.data(a, "$ngAnimatePin")) && (b = J(a)); b;) {
          d || (d = b === h);if (1 !== b.nodeType) break;a = z.get(b) || {};if (!g) {
            var H = ga.get(b);if (!0 === H && !1 !== e) {
              e = !0;break;
            } else !1 === H && (e = !1);g = a.structural;
          }if (P(p) || !0 === p) a = A.data(b, "$$ngAnimateChildren"), ya(a) && (p = a);if (g && !1 === p) break;k || (k = b === c);if (k && d) break;if (!d && (a = A.data(b, "$ngAnimatePin"))) {
            b = J(a);continue;
          }b = b.parentNode;
        }return (!g || p) && !0 !== e && d && k;
      }function F(a, b, c) {
        c = c || {};c.state = b;a.setAttribute("data-ng-animate", b);c = (b = z.get(a)) ? va(b, c) : c;z.set(a, c);
      }
      var z = new y(),
          ga = new y(),
          h = null,
          p = c.$watch(function () {
        return 0 === v.totalPendingRequests;
      }, function (a) {
        a && (p(), c.$$postDigest(function () {
          c.$$postDigest(function () {
            null === h && (h = !0);
          });
        }));
      }),
          k = Object.create(null);y = a.customFilter();var na = a.classNameFilter();g = function g() {
        return !0;
      };var Ya = y || g,
          D = na ? function (a, b) {
        var c = [a.getAttribute("class"), b.addClass, b.removeClass].join(" ");return na.test(c);
      } : g,
          Oa = X(E),
          u = S.Node.prototype.contains || function (a) {
        return this === a || !!(this.compareDocumentPosition(a) & 16);
      },
          ba = { on: function on(a, b, c) {
          var h = ua(b);k[a] = k[a] || [];k[a].push({ node: h, callback: c });A(b).on("$destroy", function () {
            z.get(h) || ba.off(a, b, c);
          });
        }, off: function off(a, b, c) {
          if (1 !== arguments.length || C(arguments[0])) {
            var h = k[a];h && (k[a] = 1 === arguments.length ? null : I(h, b, c));
          } else for (h in b = arguments[0], k) {
            k[h] = I(k[h], b);
          }
        }, pin: function pin(a, b) {
          Ea(Z(a), "element", "not an element");Ea(Z(b), "parentElement", "not an element");a.data("$ngAnimatePin", b);
        }, push: function push(a, b, c, h) {
          c = c || {};c.domOperation = h;return K(a, b, c);
        }, enabled: function enabled(a, b) {
          var c = arguments.length;
          if (0 === c) b = !!h;else if (Z(a)) {
            var k = J(a);1 === c ? b = !ga.get(k) : ga.set(k, !b);
          } else b = h = !!a;return b;
        } };return ba;
    }];
  }]).provider("$$animation", ["$animateProvider", function (a) {
    var b = this.drivers = [];this.$get = ["$$jqLite", "$rootScope", "$injector", "$$AnimateRunner", "$$Map", "$$rAFScheduler", function (a, d, e, f, n, G) {
      function l(a) {
        function b(a) {
          if (a.processed) return a;a.processed = !0;var d = a.domNode,
              e = d.parentNode;g.set(d, a);for (var f; e;) {
            if (f = g.get(e)) {
              f.processed || (f = b(f));break;
            }e = e.parentNode;
          }(f || c).children.push(a);
          return a;
        }var c = { children: [] },
            d,
            g = new n();for (d = 0; d < a.length; d++) {
          var e = a[d];g.set(e.domNode, a[d] = { domNode: e.domNode, fn: e.fn, children: [] });
        }for (d = 0; d < a.length; d++) {
          b(a[d]);
        }return function (a) {
          var b = [],
              c = [],
              d;for (d = 0; d < a.children.length; d++) {
            c.push(a.children[d]);
          }a = c.length;var g = 0,
              e = [];for (d = 0; d < c.length; d++) {
            var f = c[d];0 >= a && (a = g, g = 0, b.push(e), e = []);e.push(f.fn);f.children.forEach(function (a) {
              g++;c.push(a);
            });a--;
          }e.length && b.push(e);return b;
        }(c);
      }var s = [],
          y = X(a);return function (n, q, v) {
        function E(a) {
          a = a.hasAttribute("ng-animate-ref") ? [a] : a.querySelectorAll("[ng-animate-ref]");var b = [];t(a, function (a) {
            var c = a.getAttribute("ng-animate-ref");c && c.length && b.push(a);
          });return b;
        }function g(a) {
          var b = [],
              c = {};t(a, function (a, d) {
            var k = J(a.element),
                g = 0 <= ["enter", "move"].indexOf(a.event),
                k = a.structural ? E(k) : [];if (k.length) {
              var e = g ? "to" : "from";t(k, function (a) {
                var b = a.getAttribute("ng-animate-ref");c[b] = c[b] || {};c[b][e] = { animationID: d, element: A(a) };
              });
            } else b.push(a);
          });var d = {},
              g = {};t(c, function (c, e) {
            var f = c.from,
                p = c.to;if (f && p) {
              var H = a[f.animationID],
                  z = a[p.animationID],
                  m = f.animationID.toString();if (!g[m]) {
                var l = g[m] = { structural: !0, beforeStart: function beforeStart() {
                    H.beforeStart();z.beforeStart();
                  }, close: function close() {
                    H.close();z.close();
                  }, classes: M(H.classes, z.classes), from: H, to: z, anchors: [] };l.classes.length ? b.push(l) : (b.push(H), b.push(z));
              }g[m].anchors.push({ out: f.element, "in": p.element });
            } else f = f ? f.animationID : p.animationID, p = f.toString(), d[p] || (d[p] = !0, b.push(a[f]));
          });return b;
        }function M(a, b) {
          a = a.split(" ");b = b.split(" ");for (var c = [], d = 0; d < a.length; d++) {
            var g = a[d];if ("ng-" !== g.substring(0, 3)) for (var e = 0; e < b.length; e++) {
              if (g === b[e]) {
                c.push(g);break;
              }
            }
          }return c.join(" ");
        }function x(a) {
          for (var c = b.length - 1; 0 <= c; c--) {
            var d = e.get(b[c])(a);if (d) return d;
          }
        }function H(a, b) {
          function c(a) {
            (a = a.data("$$animationRunner")) && a.setHost(b);
          }a.from && a.to ? (c(a.from.element), c(a.to.element)) : c(a.element);
        }function I() {
          var a = n.data("$$animationRunner");!a || "leave" === q && v.$$domOperationFired || a.end();
        }function K(b) {
          n.off("$destroy", I);n.removeData("$$animationRunner");y(n, v);ha(n, v);v.domOperation();F && a.removeClass(n, F);n.removeClass("ng-animate");m.complete(!b);
        }v = oa(v);var ta = 0 <= ["enter", "move", "leave"].indexOf(q),
            m = new f({ end: function end() {
            K();
          }, cancel: function cancel() {
            K(!0);
          } });if (!b.length) return K(), m;n.data("$$animationRunner", m);var L = Fa(n.attr("class"), Fa(v.addClass, v.removeClass)),
            F = v.tempClasses;F && (L += " " + F, v.tempClasses = null);var z;ta && (z = "ng-" + q + "-prepare", a.addClass(n, z));s.push({ element: n, classes: L, event: q, structural: ta, options: v, beforeStart: function beforeStart() {
            n.addClass("ng-animate");
            F && a.addClass(n, F);z && (a.removeClass(n, z), z = null);
          }, close: K });n.on("$destroy", I);if (1 < s.length) return m;d.$$postDigest(function () {
          var a = [];t(s, function (b) {
            b.element.data("$$animationRunner") ? a.push(b) : b.close();
          });s.length = 0;var b = g(a),
              c = [];t(b, function (a) {
            c.push({ domNode: J(a.from ? a.from.element : a.element), fn: function fn() {
                a.beforeStart();var b,
                    c = a.close;if ((a.anchors ? a.from.element || a.to.element : a.element).data("$$animationRunner")) {
                  var d = x(a);d && (b = d.start);
                }b ? (b = b(), b.done(function (a) {
                  c(!a);
                }), H(a, b)) : c();
              } });
          });G(l(c));
        });return m;
      };
    }];
  }]).provider("$animateCss", ["$animateProvider", function (a) {
    var b = La(),
        c = La();this.$get = ["$window", "$$jqLite", "$$AnimateRunner", "$timeout", "$$forceReflow", "$sniffer", "$$rAFScheduler", "$$animateQueue", function (a, e, f, n, G, l, s, y) {
      function q(a, b) {
        var c = a.parentNode;return (c.$$ngAnimateParentKey || (c.$$ngAnimateParentKey = ++M)) + "-" + a.getAttribute("class") + "-" + b;
      }function da(g, f, l, n) {
        var m;0 < b.count(l) && (m = c.get(l), m || (f = W(f, "-stagger"), e.addClass(g, f), m = Ja(a, g, n), m.animationDuration = Math.max(m.animationDuration, 0), m.transitionDuration = Math.max(m.transitionDuration, 0), e.removeClass(g, f), c.put(l, m)));return m || {};
      }function v(a) {
        x.push(a);s.waitUntilQuiet(function () {
          b.flush();c.flush();for (var a = G(), d = 0; d < x.length; d++) {
            x[d](a);
          }x.length = 0;
        });
      }function E(c, g, e) {
        g = b.get(e);g || (g = Ja(a, c, Wa), "infinite" === g.animationIterationCount && (g.animationIterationCount = 1));b.put(e, g);c = g;e = c.animationDelay;g = c.transitionDelay;c.maxDelay = e && g ? Math.max(e, g) : e || g;c.maxDuration = Math.max(c.animationDuration * c.animationIterationCount, c.transitionDuration);return c;
      }var g = X(e),
          M = 0,
          x = [];return function (a, c) {
        function d() {
          m();
        }function s() {
          m(!0);
        }function m(b) {
          if (!(M || ba && u)) {
            M = !0;u = !1;h.$$skipPreparationClasses || e.removeClass(a, fa);e.removeClass(a, ca);wa(k, !1);pa(k, !1);t(x, function (a) {
              k.style[a[0]] = "";
            });g(a, h);ha(a, h);Object.keys(p).length && t(p, function (a, b) {
              a ? k.style.setProperty(b, a) : k.style.removeProperty(b);
            });if (h.onDone) h.onDone();ea && ea.length && a.off(ea.join(" "), z);var c = a.data("$$animateCss");c && (n.cancel(c[0].timer), a.removeData("$$animateCss"));A && A.complete(!b);
          }
        }function L(a) {
          r.blockTransition && pa(k, a);r.blockKeyframeAnimation && wa(k, !!a);
        }function F() {
          A = new f({ end: d, cancel: s });v(O);m();return { $$willAnimate: !1, start: function start() {
              return A;
            }, end: d };
        }function z(a) {
          a.stopPropagation();var b = a.originalEvent || a;b.target === k && (a = b.$manualTimeStamp || Date.now(), b = parseFloat(b.elapsedTime.toFixed(3)), Math.max(a - T, 0) >= P && b >= N && (ba = !0, m()));
        }function ga() {
          function b() {
            if (!M) {
              L(!1);t(x, function (a) {
                k.style[a[0]] = a[1];
              });g(a, h);
              e.addClass(a, ca);if (r.recalculateTimingStyles) {
                ma = k.getAttribute("class") + " " + fa;ja = q(k, ma);B = E(k, ma, ja);$ = B.maxDelay;w = Math.max($, 0);N = B.maxDuration;if (0 === N) {
                  m();return;
                }r.hasTransitions = 0 < B.transitionDuration;r.hasAnimations = 0 < B.animationDuration;
              }r.applyAnimationDelay && ($ = "boolean" !== typeof h.delay && xa(h.delay) ? parseFloat(h.delay) : $, w = Math.max($, 0), B.animationDelay = $, aa = [qa, $ + "s"], x.push(aa), k.style[aa[0]] = aa[1]);P = 1E3 * w;S = 1E3 * N;if (h.easing) {
                var d,
                    f = h.easing;r.hasTransitions && (d = Q + "TimingFunction", x.push([d, f]), k.style[d] = f);r.hasAnimations && (d = Y + "TimingFunction", x.push([d, f]), k.style[d] = f);
              }B.transitionDuration && ea.push(za);B.animationDuration && ea.push(Aa);T = Date.now();var l = P + 1.5 * S;d = T + l;var f = a.data("$$animateCss") || [],
                  F = !0;if (f.length) {
                var s = f[0];(F = d > s.expectedEndTime) ? n.cancel(s.timer) : f.push(m);
              }F && (l = n(c, l, !1), f[0] = { timer: l, expectedEndTime: d }, f.push(m), a.data("$$animateCss", f));if (ea.length) a.on(ea.join(" "), z);h.to && (h.cleanupStyles && Ma(p, k, Object.keys(h.to)), Ia(a, h));
            }
          }function c() {
            var b = a.data("$$animateCss");if (b) {
              for (var d = 1; d < b.length; d++) {
                b[d]();
              }a.removeData("$$animateCss");
            }
          }if (!M) if (k.parentNode) {
            var d = function d(a) {
              if (ba) u && a && (u = !1, m());else if (u = !a, B.animationDuration) if (a = wa(k, u), u) x.push(a);else {
                var b = x,
                    c = b.indexOf(a);0 <= a && b.splice(c, 1);
              }
            },
                f = 0 < Z && (B.transitionDuration && 0 === U.transitionDuration || B.animationDuration && 0 === U.animationDuration) && Math.max(U.animationDelay, U.transitionDelay);f ? n(b, Math.floor(f * Z * 1E3), !1) : b();C.resume = function () {
              d(!0);
            };C.pause = function () {
              d(!1);
            };
          } else m();
        }
        var h = c || {};h.$$prepared || (h = oa(Ca(h)));var p = {},
            k = J(a);if (!k || !k.parentNode || !y.enabled()) return F();var x = [],
            G = a.attr("class"),
            D = Qa(h),
            M,
            u,
            ba,
            A,
            C,
            w,
            P,
            N,
            S,
            T,
            ea = [];if (0 === h.duration || !l.animations && !l.transitions) return F();var ia = h.event && V(h.event) ? h.event.join(" ") : h.event,
            X = "",
            R = "";ia && h.structural ? X = W(ia, "ng-", !0) : ia && (X = ia);h.addClass && (R += W(h.addClass, "-add"));h.removeClass && (R.length && (R += " "), R += W(h.removeClass, "-remove"));h.applyClassesEarly && R.length && g(a, h);var fa = [X, R].join(" ").trim(),
            ma = G + " " + fa,
            ca = W(fa, "-active"),
            G = D.to && 0 < Object.keys(D.to).length;if (!(0 < (h.keyframeStyle || "").length || G || fa)) return F();var ja, U;0 < h.stagger ? (D = parseFloat(h.stagger), U = { transitionDelay: D, animationDelay: D, transitionDuration: 0, animationDuration: 0 }) : (ja = q(k, ma), U = da(k, fa, ja, Xa));h.$$skipPreparationClasses || e.addClass(a, fa);h.transitionStyle && (D = [Q, h.transitionStyle], ka(k, D), x.push(D));0 <= h.duration && (D = 0 < k.style[Q].length, D = Ka(h.duration, D), ka(k, D), x.push(D));h.keyframeStyle && (D = [Y, h.keyframeStyle], ka(k, D), x.push(D));var Z = U ? 0 <= h.staggerIndex ? h.staggerIndex : b.count(ja) : 0;(ia = 0 === Z) && !h.skipBlocking && pa(k, 9999);var B = E(k, ma, ja),
            $ = B.maxDelay;w = Math.max($, 0);N = B.maxDuration;var r = {};r.hasTransitions = 0 < B.transitionDuration;r.hasAnimations = 0 < B.animationDuration;r.hasTransitionAll = r.hasTransitions && "all" === B.transitionProperty;r.applyTransitionDuration = G && (r.hasTransitions && !r.hasTransitionAll || r.hasAnimations && !r.hasTransitions);r.applyAnimationDuration = h.duration && r.hasAnimations;r.applyTransitionDelay = xa(h.delay) && (r.applyTransitionDuration || r.hasTransitions);r.applyAnimationDelay = xa(h.delay) && r.hasAnimations;r.recalculateTimingStyles = 0 < R.length;if (r.applyTransitionDuration || r.applyAnimationDuration) N = h.duration ? parseFloat(h.duration) : N, r.applyTransitionDuration && (r.hasTransitions = !0, B.transitionDuration = N, D = 0 < k.style[Q + "Property"].length, x.push(Ka(N, D))), r.applyAnimationDuration && (r.hasAnimations = !0, B.animationDuration = N, x.push([Ba, N + "s"]));if (0 === N && !r.recalculateTimingStyles) return F();if (null != h.delay) {
          var aa;"boolean" !== typeof h.delay && (aa = parseFloat(h.delay), w = Math.max(aa, 0));r.applyTransitionDelay && x.push([la, aa + "s"]);r.applyAnimationDelay && x.push([qa, aa + "s"]);
        }null == h.duration && 0 < B.transitionDuration && (r.recalculateTimingStyles = r.recalculateTimingStyles || ia);P = 1E3 * w;S = 1E3 * N;h.skipBlocking || (r.blockTransition = 0 < B.transitionDuration, r.blockKeyframeAnimation = 0 < B.animationDuration && 0 < U.animationDelay && 0 === U.animationDuration);h.from && (h.cleanupStyles && Ma(p, k, Object.keys(h.from)), Ha(a, h));
        r.blockTransition || r.blockKeyframeAnimation ? L(N) : h.skipBlocking || pa(k, !1);return { $$willAnimate: !0, end: d, start: function start() {
            if (!M) return C = { end: d, cancel: s, resume: null, pause: null }, A = new f(C), v(ga), A;
          } };
      };
    }];
  }]).provider("$$animateCssDriver", ["$$animationProvider", function (a) {
    a.drivers.push("$$animateCssDriver");this.$get = ["$animateCss", "$rootScope", "$$AnimateRunner", "$rootElement", "$sniffer", "$$jqLite", "$document", function (a, c, d, e, f, n, G) {
      function l(a) {
        return a.replace(/\bng-\S+\b/g, "");
      }function s(a, b) {
        C(a) && (a = a.split(" "));C(b) && (b = b.split(" "));return a.filter(function (a) {
          return -1 === b.indexOf(a);
        }).join(" ");
      }function y(c, f, e) {
        function n(a) {
          var b = {},
              c = J(a).getBoundingClientRect();t(["width", "height", "top", "left"], function (a) {
            var d = c[a];switch (a) {case "top":
                d += v.scrollTop;break;case "left":
                d += v.scrollLeft;}b[a] = Math.floor(d) + "px";
          });return b;
        }function G() {
          var c = l(e.attr("class") || ""),
              d = s(c, m),
              c = s(m, c),
              d = a(y, { to: n(e), addClass: "ng-anchor-in " + d, removeClass: "ng-anchor-out " + c, delay: !0 });return d.$$willAnimate ? d : null;
        }function q() {
          y.remove();f.removeClass("ng-animate-shim");e.removeClass("ng-animate-shim");
        }var y = A(J(f).cloneNode(!0)),
            m = l(y.attr("class") || "");f.addClass("ng-animate-shim");e.addClass("ng-animate-shim");y.addClass("ng-anchor");E.append(y);var L;c = function () {
          var c = a(y, { addClass: "ng-anchor-out", delay: !0, from: n(f) });return c.$$willAnimate ? c : null;
        }();if (!c && (L = G(), !L)) return q();var F = c || L;return { start: function start() {
            function a() {
              c && c.end();
            }var b,
                c = F.start();c.done(function () {
              c = null;if (!L && (L = G())) return c = L.start(), c.done(function () {
                c = null;q();b.complete();
              }), c;q();b.complete();
            });return b = new d({ end: a, cancel: a });
          } };
      }function q(a, b, c, f) {
        var e = da(a, O),
            l = da(b, O),
            n = [];t(f, function (a) {
          (a = y(c, a.out, a["in"])) && n.push(a);
        });if (e || l || 0 !== n.length) return { start: function start() {
            function a() {
              t(b, function (a) {
                a.end();
              });
            }var b = [];e && b.push(e.start());l && b.push(l.start());t(n, function (a) {
              b.push(a.start());
            });var c = new d({ end: a, cancel: a });d.all(b, function (a) {
              c.complete(a);
            });return c;
          } };
      }function da(c) {
        var d = c.element,
            e = c.options || {};c.structural && (e.event = c.event, e.structural = !0, e.applyClassesEarly = !0, "leave" === c.event && (e.onDone = e.domOperation));e.preparationClasses && (e.event = ca(e.event, e.preparationClasses));c = a(d, e);return c.$$willAnimate ? c : null;
      }if (!f.animations && !f.transitions) return O;var v = G[0].body;c = J(e);var E = A(c.parentNode && 11 === c.parentNode.nodeType || v.contains(c) ? c : v);return function (a) {
        return a.from && a.to ? q(a.from, a.to, a.classes, a.anchors) : da(a);
      };
    }];
  }]).provider("$$animateJs", ["$animateProvider", function (a) {
    this.$get = ["$injector", "$$AnimateRunner", "$$jqLite", function (b, c, d) {
      function e(c) {
        c = V(c) ? c : c.split(" ");for (var d = [], e = {}, f = 0; f < c.length; f++) {
          var y = c[f],
              q = a.$$registeredAnimations[y];q && !e[y] && (d.push(b.get(q)), e[y] = !0);
        }return d;
      }var f = X(d);return function (a, b, d, s) {
        function q() {
          s.domOperation();f(a, s);
        }function A(a, b, d, e, f) {
          switch (d) {case "animate":
              b = [b, e.from, e.to, f];break;case "setClass":
              b = [b, g, M, f];break;case "addClass":
              b = [b, g, f];break;case "removeClass":
              b = [b, M, f];break;default:
              b = [b, f];}b.push(e);if (a = a.apply(a, b)) if (Da(a.start) && (a = a.start()), a instanceof c) a.done(f);else if (Da(a)) return a;return O;
        }function C(a, b, d, e, f) {
          var g = [];t(e, function (e) {
            var l = e[f];l && g.push(function () {
              var e,
                  f,
                  h = !1,
                  g = function g(a) {
                h || (h = !0, (f || O)(a), e.complete(!a));
              };e = new c({ end: function end() {
                  g();
                }, cancel: function cancel() {
                  g(!0);
                } });f = A(l, a, b, d, function (a) {
                g(!1 === a);
              });return e;
            });
          });return g;
        }function v(a, b, d, e, f) {
          var g = C(a, b, d, e, f);if (0 === g.length) {
            var k, l;"beforeSetClass" === f ? (k = C(a, "removeClass", d, e, "beforeRemoveClass"), l = C(a, "addClass", d, e, "beforeAddClass")) : "setClass" === f && (k = C(a, "removeClass", d, e, "removeClass"), l = C(a, "addClass", d, e, "addClass"));k && (g = g.concat(k));l && (g = g.concat(l));
          }if (0 !== g.length) return function (a) {
            var b = [];g.length && t(g, function (a) {
              b.push(a());
            });b.length ? c.all(b, a) : a();return function (a) {
              t(b, function (b) {
                a ? b.cancel() : b.end();
              });
            };
          };
        }var E = !1;3 === arguments.length && ra(d) && (s = d, d = null);s = oa(s);d || (d = a.attr("class") || "", s.addClass && (d += " " + s.addClass), s.removeClass && (d += " " + s.removeClass));var g = s.addClass,
            M = s.removeClass,
            x = e(d),
            H,
            I;if (x.length) {
          var K, J;"leave" === b ? (J = "leave", K = "afterLeave") : (J = "before" + b.charAt(0).toUpperCase() + b.substr(1), K = b);"enter" !== b && "move" !== b && (H = v(a, b, s, x, J));I = v(a, b, s, x, K);
        }if (H || I) {
          var m;return { $$willAnimate: !0, end: function end() {
              m ? m.end() : (E = !0, q(), ha(a, s), m = new c(), m.complete(!0));return m;
            }, start: function start() {
              function b(c) {
                E = !0;q();ha(a, s);m.complete(c);
              }if (m) return m;m = new c();var d,
                  e = [];H && e.push(function (a) {
                d = H(a);
              });e.length ? e.push(function (a) {
                q();a(!0);
              }) : q();I && e.push(function (a) {
                d = I(a);
              });m.setHost({ end: function end() {
                  E || ((d || O)(void 0), b(void 0));
                }, cancel: function cancel() {
                  E || ((d || O)(!0), b(!0));
                } });c.chain(e, b);return m;
            } };
        }
      };
    }];
  }]).provider("$$animateJsDriver", ["$$animationProvider", function (a) {
    a.drivers.push("$$animateJsDriver");this.$get = ["$$animateJs", "$$AnimateRunner", function (a, c) {
      function d(c) {
        return a(c.element, c.event, c.classes, c.options);
      }return function (a) {
        if (a.from && a.to) {
          var b = d(a.from),
              n = d(a.to);if (b || n) return { start: function start() {
              function a() {
                return function () {
                  t(d, function (a) {
                    a.end();
                  });
                };
              }var d = [];b && d.push(b.start());n && d.push(n.start());c.all(d, function (a) {
                e.complete(a);
              });var e = new c({ end: a(), cancel: a() });return e;
            } };
        } else return d(a);
      };
    }];
  }]);
})(window, window.angular);
//# sourceMappingURL=angular-animate.min.js.map;"use strict";

/*
 AngularJS v1.6.9
 (c) 2010-2018 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (s, d) {
  'use strict';
  function J(d) {
    var k = [];w(k, B).chars(d);return k.join("");
  }var x = d.$$minErr("$sanitize"),
      C,
      k,
      D,
      E,
      p,
      B,
      F,
      G,
      w;d.module("ngSanitize", []).provider("$sanitize", function () {
    function g(a, e) {
      var c = {},
          b = a.split(","),
          f;for (f = 0; f < b.length; f++) {
        c[e ? p(b[f]) : b[f]] = !0;
      }return c;
    }function K(a) {
      for (var e = {}, c = 0, b = a.length; c < b; c++) {
        var f = a[c];e[f.name] = f.value;
      }return e;
    }function H(a) {
      return a.replace(/&/g, "&amp;").replace(L, function (a) {
        var c = a.charCodeAt(0);a = a.charCodeAt(1);return "&#" + (1024 * (c - 55296) + (a - 56320) + 65536) + ";";
      }).replace(M, function (a) {
        return "&#" + a.charCodeAt(0) + ";";
      }).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }function I(a) {
      for (; a;) {
        if (a.nodeType === s.Node.ELEMENT_NODE) for (var e = a.attributes, c = 0, b = e.length; c < b; c++) {
          var f = e[c],
              h = f.name.toLowerCase();if ("xmlns:ns1" === h || 0 === h.lastIndexOf("ns1:", 0)) a.removeAttributeNode(f), c--, b--;
        }(e = a.firstChild) && I(e);a = t("nextSibling", a);
      }
    }function t(a, e) {
      var c = e[a];if (c && F.call(e, c)) throw x("elclob", e.outerHTML || e.outerText);return c;
    }var y = !1;this.$get = ["$$sanitizeUri", function (a) {
      y && k(n, z);return function (e) {
        var c = [];G(e, w(c, function (b, c) {
          return !/^unsafe:/.test(a(b, c));
        }));return c.join("");
      };
    }];this.enableSvg = function (a) {
      return E(a) ? (y = a, this) : y;
    };C = d.bind;k = d.extend;D = d.forEach;E = d.isDefined;p = d.lowercase;B = d.noop;G = function G(a, e) {
      null === a || void 0 === a ? a = "" : "string" !== typeof a && (a = "" + a);var c = u(a);if (!c) return "";var b = 5;do {
        if (0 === b) throw x("uinput");b--;a = c.innerHTML;c = u(a);
      } while (a !== c.innerHTML);for (b = c.firstChild; b;) {
        switch (b.nodeType) {case 1:
            e.start(b.nodeName.toLowerCase(), K(b.attributes));break;case 3:
            e.chars(b.textContent);}var f;if (!(f = b.firstChild) && (1 === b.nodeType && e.end(b.nodeName.toLowerCase()), f = t("nextSibling", b), !f)) for (; null == f;) {
          b = t("parentNode", b);if (b === c) break;f = t("nextSibling", b);1 === b.nodeType && e.end(b.nodeName.toLowerCase());
        }b = f;
      }for (; b = c.firstChild;) {
        c.removeChild(b);
      }
    };w = function w(a, e) {
      var c = !1,
          b = C(a, a.push);return { start: function start(a, h) {
          a = p(a);!c && A[a] && (c = a);c || !0 !== n[a] || (b("<"), b(a), D(h, function (c, h) {
            var d = p(h),
                g = "img" === a && "src" === d || "background" === d;!0 !== v[d] || !0 === m[d] && !e(c, g) || (b(" "), b(h), b('="'), b(H(c)), b('"'));
          }), b(">"));
        }, end: function end(a) {
          a = p(a);c || !0 !== n[a] || !0 === h[a] || (b("</"), b(a), b(">"));a == c && (c = !1);
        }, chars: function chars(a) {
          c || b(H(a));
        } };
    };F = s.Node.prototype.contains || function (a) {
      return !!(this.compareDocumentPosition(a) & 16);
    };var L = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
        M = /([^#-~ |!])/g,
        h = g("area,br,col,hr,img,wbr"),
        q = g("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        l = g("rp,rt"),
        r = k({}, l, q),
        q = k({}, q, g("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,section,table,ul")),
        l = k({}, l, g("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),
        z = g("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,stop,svg,switch,text,title,tspan"),
        A = g("script,style"),
        n = k({}, h, q, l, r),
        m = g("background,cite,href,longdesc,src,xlink:href,xml:base"),
        r = g("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,tabindex,target,title,type,valign,value,vspace,width"),
        l = g("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan", !0),
        v = k({}, m, l, r),
        u = function (a, e) {
      function c(b) {
        b = "<remove></remove>" + b;try {
          var c = new a.DOMParser().parseFromString(b, "text/html").body;c.firstChild.remove();return c;
        } catch (e) {}
      }function b(a) {
        d.innerHTML = a;e.documentMode && I(d);return d;
      }var h;if (e && e.implementation) h = e.implementation.createHTMLDocument("inert");else throw x("noinert");var d = (h.documentElement || h.getDocumentElement()).querySelector("body");d.innerHTML = '<svg><g onload="this.parentNode.remove()"></g></svg>';return d.querySelector("svg") ? (d.innerHTML = '<svg><p><style><img src="</style><img src=x onerror=alert(1)//">', d.querySelector("svg img") ? c : b) : function (b) {
        b = "<remove></remove>" + b;try {
          b = encodeURI(b);
        } catch (c) {
          return;
        }var e = new a.XMLHttpRequest();e.responseType = "document";e.open("GET", "data:text/html;charset=utf-8," + b, !1);e.send(null);b = e.response.body;b.firstChild.remove();return b;
      };
    }(s, s.document);
  }).info({ angularVersion: "1.6.9" });d.module("ngSanitize").filter("linky", ["$sanitize", function (g) {
    var k = /((s?ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i,
        p = /^mailto:/i,
        s = d.$$minErr("linky"),
        t = d.isDefined,
        y = d.isFunction,
        w = d.isObject,
        x = d.isString;return function (d, q, l) {
      function r(a) {
        a && m.push(J(a));
      }function z(a, d) {
        var c,
            b = A(a);m.push("<a ");for (c in b) {
          m.push(c + '="' + b[c] + '" ');
        }!t(q) || "target" in b || m.push('target="', q, '" ');m.push('href="', a.replace(/"/g, "&quot;"), '">');r(d);m.push("</a>");
      }if (null == d || "" === d) return d;if (!x(d)) throw s("notstring", d);for (var A = y(l) ? l : w(l) ? function () {
        return l;
      } : function () {
        return {};
      }, n = d, m = [], v, u; d = n.match(k);) {
        v = d[0], d[2] || d[4] || (v = (d[3] ? "http://" : "mailto:") + v), u = d.index, r(n.substr(0, u)), z(v, d[0].replace(p, "")), n = n.substring(u + d[0].length);
      }r(n);return g(m.join(""));
    };
  }]);
})(window, window.angular);
//# sourceMappingURL=angular-sanitize.min.js.map;"use strict";

/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 2.5.0 - 2017-01-28
 * License: MIT
 */angular.module("ui.bootstrap", ["ui.bootstrap.collapse", "ui.bootstrap.tabindex", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.isClass", "ui.bootstrap.datepicker", "ui.bootstrap.position", "ui.bootstrap.datepickerPopup", "ui.bootstrap.debounce", "ui.bootstrap.multiMap", "ui.bootstrap.dropdown", "ui.bootstrap.stackedMap", "ui.bootstrap.modal", "ui.bootstrap.paging", "ui.bootstrap.pager", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.typeahead"]), angular.module("ui.bootstrap.collapse", []).directive("uibCollapse", ["$animate", "$q", "$parse", "$injector", function (a, b, c, d) {
  var e = d.has("$animateCss") ? d.get("$animateCss") : null;return { link: function link(d, f, g) {
      function h() {
        r = !!("horizontal" in g), r ? (s = { width: "" }, t = { width: "0" }) : (s = { height: "" }, t = { height: "0" }), d.$eval(g.uibCollapse) || f.addClass("in").addClass("collapse").attr("aria-expanded", !0).attr("aria-hidden", !1).css(s);
      }function i(a) {
        return r ? { width: a.scrollWidth + "px" } : { height: a.scrollHeight + "px" };
      }function j() {
        f.hasClass("collapse") && f.hasClass("in") || b.resolve(n(d)).then(function () {
          f.removeClass("collapse").addClass("collapsing").attr("aria-expanded", !0).attr("aria-hidden", !1), e ? e(f, { addClass: "in", easing: "ease", css: { overflow: "hidden" }, to: i(f[0]) }).start()["finally"](k) : a.addClass(f, "in", { css: { overflow: "hidden" }, to: i(f[0]) }).then(k);
        }, angular.noop);
      }function k() {
        f.removeClass("collapsing").addClass("collapse").css(s), o(d);
      }function l() {
        return f.hasClass("collapse") || f.hasClass("in") ? void b.resolve(p(d)).then(function () {
          f.css(i(f[0])).removeClass("collapse").addClass("collapsing").attr("aria-expanded", !1).attr("aria-hidden", !0), e ? e(f, { removeClass: "in", to: t }).start()["finally"](m) : a.removeClass(f, "in", { to: t }).then(m);
        }, angular.noop) : m();
      }function m() {
        f.css(t), f.removeClass("collapsing").addClass("collapse"), q(d);
      }var n = c(g.expanding),
          o = c(g.expanded),
          p = c(g.collapsing),
          q = c(g.collapsed),
          r = !1,
          s = {},
          t = {};h(), d.$watch(g.uibCollapse, function (a) {
        a ? l() : j();
      });
    } };
}]), angular.module("ui.bootstrap.tabindex", []).directive("uibTabindexToggle", function () {
  return { restrict: "A", link: function link(a, b, c) {
      c.$observe("disabled", function (a) {
        c.$set("tabindex", a ? -1 : null);
      });
    } };
}), angular.module("ui.bootstrap.accordion", ["ui.bootstrap.collapse", "ui.bootstrap.tabindex"]).constant("uibAccordionConfig", { closeOthers: !0 }).controller("UibAccordionController", ["$scope", "$attrs", "uibAccordionConfig", function (a, b, c) {
  this.groups = [], this.closeOthers = function (d) {
    var e = angular.isDefined(b.closeOthers) ? a.$eval(b.closeOthers) : c.closeOthers;e && angular.forEach(this.groups, function (a) {
      a !== d && (a.isOpen = !1);
    });
  }, this.addGroup = function (a) {
    var b = this;this.groups.push(a), a.$on("$destroy", function (c) {
      b.removeGroup(a);
    });
  }, this.removeGroup = function (a) {
    var b = this.groups.indexOf(a);-1 !== b && this.groups.splice(b, 1);
  };
}]).directive("uibAccordion", function () {
  return { controller: "UibAccordionController", controllerAs: "accordion", transclude: !0, templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/accordion/accordion.html";
    } };
}).directive("uibAccordionGroup", function () {
  return { require: "^uibAccordion", transclude: !0, restrict: "A", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/accordion/accordion-group.html";
    }, scope: { heading: "@", panelClass: "@?", isOpen: "=?", isDisabled: "=?" }, controller: function controller() {
      this.setHeading = function (a) {
        this.heading = a;
      };
    }, link: function link(a, b, c, d) {
      b.addClass("panel"), d.addGroup(a), a.openClass = c.openClass || "panel-open", a.panelClass = c.panelClass || "panel-default", a.$watch("isOpen", function (c) {
        b.toggleClass(a.openClass, !!c), c && d.closeOthers(a);
      }), a.toggleOpen = function (b) {
        a.isDisabled || b && 32 !== b.which || (a.isOpen = !a.isOpen);
      };var e = "accordiongroup-" + a.$id + "-" + Math.floor(1e4 * Math.random());a.headingId = e + "-tab", a.panelId = e + "-panel";
    } };
}).directive("uibAccordionHeading", function () {
  return { transclude: !0, template: "", replace: !0, require: "^uibAccordionGroup", link: function link(a, b, c, d, e) {
      d.setHeading(e(a, angular.noop));
    } };
}).directive("uibAccordionTransclude", function () {
  function a() {
    return "uib-accordion-header,data-uib-accordion-header,x-uib-accordion-header,uib\\:accordion-header,[uib-accordion-header],[data-uib-accordion-header],[x-uib-accordion-header]";
  }return { require: "^uibAccordionGroup", link: function link(b, c, d, e) {
      b.$watch(function () {
        return e[d.uibAccordionTransclude];
      }, function (b) {
        if (b) {
          var d = angular.element(c[0].querySelector(a()));d.html(""), d.append(b);
        }
      });
    } };
}), angular.module("ui.bootstrap.alert", []).controller("UibAlertController", ["$scope", "$element", "$attrs", "$interpolate", "$timeout", function (a, b, c, d, e) {
  a.closeable = !!c.close, b.addClass("alert"), c.$set("role", "alert"), a.closeable && b.addClass("alert-dismissible");var f = angular.isDefined(c.dismissOnTimeout) ? d(c.dismissOnTimeout)(a.$parent) : null;f && e(function () {
    a.close();
  }, parseInt(f, 10));
}]).directive("uibAlert", function () {
  return { controller: "UibAlertController", controllerAs: "alert", restrict: "A", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/alert/alert.html";
    }, transclude: !0, scope: { close: "&" } };
}), angular.module("ui.bootstrap.buttons", []).constant("uibButtonConfig", { activeClass: "active", toggleEvent: "click" }).controller("UibButtonsController", ["uibButtonConfig", function (a) {
  this.activeClass = a.activeClass || "active", this.toggleEvent = a.toggleEvent || "click";
}]).directive("uibBtnRadio", ["$parse", function (a) {
  return { require: ["uibBtnRadio", "ngModel"], controller: "UibButtonsController", controllerAs: "buttons", link: function link(b, c, d, e) {
      var f = e[0],
          g = e[1],
          h = a(d.uibUncheckable);c.find("input").css({ display: "none" }), g.$render = function () {
        c.toggleClass(f.activeClass, angular.equals(g.$modelValue, b.$eval(d.uibBtnRadio)));
      }, c.on(f.toggleEvent, function () {
        if (!d.disabled) {
          var a = c.hasClass(f.activeClass);a && !angular.isDefined(d.uncheckable) || b.$apply(function () {
            g.$setViewValue(a ? null : b.$eval(d.uibBtnRadio)), g.$render();
          });
        }
      }), d.uibUncheckable && b.$watch(h, function (a) {
        d.$set("uncheckable", a ? "" : void 0);
      });
    } };
}]).directive("uibBtnCheckbox", function () {
  return { require: ["uibBtnCheckbox", "ngModel"], controller: "UibButtonsController", controllerAs: "button", link: function link(a, b, c, d) {
      function e() {
        return g(c.btnCheckboxTrue, !0);
      }function f() {
        return g(c.btnCheckboxFalse, !1);
      }function g(b, c) {
        return angular.isDefined(b) ? a.$eval(b) : c;
      }var h = d[0],
          i = d[1];b.find("input").css({ display: "none" }), i.$render = function () {
        b.toggleClass(h.activeClass, angular.equals(i.$modelValue, e()));
      }, b.on(h.toggleEvent, function () {
        c.disabled || a.$apply(function () {
          i.$setViewValue(b.hasClass(h.activeClass) ? f() : e()), i.$render();
        });
      });
    } };
}), angular.module("ui.bootstrap.carousel", []).controller("UibCarouselController", ["$scope", "$element", "$interval", "$timeout", "$animate", function (a, b, c, d, e) {
  function f(a) {
    for (var b = 0; b < p.length; b++) {
      p[b].slide.active = b === a;
    }
  }function g(c, d, g) {
    if (!s) {
      if (angular.extend(c, { direction: g }), angular.extend(p[r].slide || {}, { direction: g }), e.enabled(b) && !a.$currentTransition && p[d].element && o.slides.length > 1) {
        p[d].element.data(q, c.direction);var h = o.getCurrentIndex();angular.isNumber(h) && p[h].element && p[h].element.data(q, c.direction), a.$currentTransition = !0, e.on("addClass", p[d].element, function (b, c) {
          "close" === c && (a.$currentTransition = null, e.off("addClass", b));
        });
      }a.active = c.index, r = c.index, f(d), k();
    }
  }function h(a) {
    for (var b = 0; b < p.length; b++) {
      if (p[b].slide === a) return b;
    }
  }function i() {
    m && (c.cancel(m), m = null);
  }function j(b) {
    b.length || (a.$currentTransition = null);
  }function k() {
    i();var b = +a.interval;!isNaN(b) && b > 0 && (m = c(l, b));
  }function l() {
    var b = +a.interval;n && !isNaN(b) && b > 0 && p.length ? a.next() : a.pause();
  }var m,
      n,
      o = this,
      p = o.slides = a.slides = [],
      q = "uib-slideDirection",
      r = a.active,
      s = !1;b.addClass("carousel"), o.addSlide = function (b, c) {
    p.push({ slide: b, element: c }), p.sort(function (a, b) {
      return +a.slide.index - +b.slide.index;
    }), (b.index === a.active || 1 === p.length && !angular.isNumber(a.active)) && (a.$currentTransition && (a.$currentTransition = null), r = b.index, a.active = b.index, f(r), o.select(p[h(b)]), 1 === p.length && a.play());
  }, o.getCurrentIndex = function () {
    for (var a = 0; a < p.length; a++) {
      if (p[a].slide.index === r) return a;
    }
  }, o.next = a.next = function () {
    var b = (o.getCurrentIndex() + 1) % p.length;return 0 === b && a.noWrap() ? void a.pause() : o.select(p[b], "next");
  }, o.prev = a.prev = function () {
    var b = o.getCurrentIndex() - 1 < 0 ? p.length - 1 : o.getCurrentIndex() - 1;return a.noWrap() && b === p.length - 1 ? void a.pause() : o.select(p[b], "prev");
  }, o.removeSlide = function (b) {
    var c = h(b);p.splice(c, 1), p.length > 0 && r === c ? c >= p.length ? (r = p.length - 1, a.active = r, f(r), o.select(p[p.length - 1])) : (r = c, a.active = r, f(r), o.select(p[c])) : r > c && (r--, a.active = r), 0 === p.length && (r = null, a.active = null);
  }, o.select = a.select = function (b, c) {
    var d = h(b.slide);void 0 === c && (c = d > o.getCurrentIndex() ? "next" : "prev"), b.slide.index === r || a.$currentTransition || g(b.slide, d, c);
  }, a.indexOfSlide = function (a) {
    return +a.slide.index;
  }, a.isActive = function (b) {
    return a.active === b.slide.index;
  }, a.isPrevDisabled = function () {
    return 0 === a.active && a.noWrap();
  }, a.isNextDisabled = function () {
    return a.active === p.length - 1 && a.noWrap();
  }, a.pause = function () {
    a.noPause || (n = !1, i());
  }, a.play = function () {
    n || (n = !0, k());
  }, b.on("mouseenter", a.pause), b.on("mouseleave", a.play), a.$on("$destroy", function () {
    s = !0, i();
  }), a.$watch("noTransition", function (a) {
    e.enabled(b, !a);
  }), a.$watch("interval", k), a.$watchCollection("slides", j), a.$watch("active", function (a) {
    if (angular.isNumber(a) && r !== a) {
      for (var b = 0; b < p.length; b++) {
        if (p[b].slide.index === a) {
          a = b;break;
        }
      }var c = p[a];c && (f(a), o.select(p[a]), r = a);
    }
  });
}]).directive("uibCarousel", function () {
  return { transclude: !0, controller: "UibCarouselController", controllerAs: "carousel", restrict: "A", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/carousel/carousel.html";
    }, scope: { active: "=", interval: "=", noTransition: "=", noPause: "=", noWrap: "&" } };
}).directive("uibSlide", ["$animate", function (a) {
  return { require: "^uibCarousel", restrict: "A", transclude: !0, templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/carousel/slide.html";
    }, scope: { actual: "=?", index: "=?" }, link: function link(b, c, d, e) {
      c.addClass("item"), e.addSlide(b, c), b.$on("$destroy", function () {
        e.removeSlide(b);
      }), b.$watch("active", function (b) {
        a[b ? "addClass" : "removeClass"](c, "active");
      });
    } };
}]).animation(".item", ["$animateCss", function (a) {
  function b(a, b, c) {
    a.removeClass(b), c && c();
  }var c = "uib-slideDirection";return { beforeAddClass: function beforeAddClass(d, e, f) {
      if ("active" === e) {
        var g = !1,
            h = d.data(c),
            i = "next" === h ? "left" : "right",
            j = b.bind(this, d, i + " " + h, f);return d.addClass(h), a(d, { addClass: i }).start().done(j), function () {
          g = !0;
        };
      }f();
    }, beforeRemoveClass: function beforeRemoveClass(d, e, f) {
      if ("active" === e) {
        var g = !1,
            h = d.data(c),
            i = "next" === h ? "left" : "right",
            j = b.bind(this, d, i, f);return a(d, { addClass: i }).start().done(j), function () {
          g = !0;
        };
      }f();
    } };
}]), angular.module("ui.bootstrap.dateparser", []).service("uibDateParser", ["$log", "$locale", "dateFilter", "orderByFilter", "filterFilter", function (a, b, c, d, e) {
  function f(a) {
    return e(s, { key: a }, !0)[0];
  }function g(a) {
    var b = [],
        c = a.split(""),
        e = a.indexOf("'");if (e > -1) {
      var f = !1;a = a.split("");for (var g = e; g < a.length; g++) {
        f ? ("'" === a[g] && (g + 1 < a.length && "'" === a[g + 1] ? (a[g + 1] = "$", c[g + 1] = "") : (c[g] = "", f = !1)), a[g] = "$") : "'" === a[g] && (a[g] = "$", c[g] = "", f = !0);
      }a = a.join("");
    }return angular.forEach(s, function (d) {
      var e = a.indexOf(d.key);if (e > -1) {
        a = a.split(""), c[e] = "(" + d.regex + ")", a[e] = "$";for (var f = e + 1, g = e + d.key.length; g > f; f++) {
          c[f] = "", a[f] = "$";
        }a = a.join(""), b.push({ index: e, key: d.key, apply: d.apply, matcher: d.regex });
      }
    }), { regex: new RegExp("^" + c.join("") + "$"), map: d(b, "index") };
  }function h(a) {
    for (var b, c, d = [], e = 0; e < a.length;) {
      if (angular.isNumber(c)) {
        if ("'" === a.charAt(e)) (e + 1 >= a.length || "'" !== a.charAt(e + 1)) && (d.push(i(a, c, e)), c = null);else if (e === a.length) for (; c < a.length;) {
          b = j(a, c), d.push(b), c = b.endIdx;
        }e++;
      } else "'" !== a.charAt(e) ? (b = j(a, e), d.push(b.parser), e = b.endIdx) : (c = e, e++);
    }return d;
  }function i(a, b, c) {
    return function () {
      return a.substr(b + 1, c - b - 1);
    };
  }function j(a, b) {
    for (var c = a.substr(b), d = 0; d < s.length; d++) {
      if (new RegExp("^" + s[d].key).test(c)) {
        var e = s[d];return { endIdx: b + e.key.length, parser: e.formatter };
      }
    }return { endIdx: b + 1, parser: function parser() {
        return c.charAt(0);
      } };
  }function k(a, b, c) {
    return 1 > c ? !1 : 1 === b && c > 28 ? 29 === c && (a % 4 === 0 && a % 100 !== 0 || a % 400 === 0) : 3 === b || 5 === b || 8 === b || 10 === b ? 31 > c : !0;
  }function l(a) {
    return parseInt(a, 10);
  }function m(a, b) {
    return a && b ? q(a, b) : a;
  }function n(a, b) {
    return a && b ? q(a, b, !0) : a;
  }function o(a, b) {
    a = a.replace(/:/g, "");var c = Date.parse("Jan 01, 1970 00:00:00 " + a) / 6e4;return isNaN(c) ? b : c;
  }function p(a, b) {
    return a = new Date(a.getTime()), a.setMinutes(a.getMinutes() + b), a;
  }function q(a, b, c) {
    c = c ? -1 : 1;var d = a.getTimezoneOffset(),
        e = o(b, d);return p(a, c * (e - d));
  }var r,
      s,
      t = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;this.init = function () {
    r = b.id, this.parsers = {}, this.formatters = {}, s = [{ key: "yyyy", regex: "\\d{4}", apply: function apply(a) {
        this.year = +a;
      }, formatter: function formatter(a) {
        var b = new Date();return b.setFullYear(Math.abs(a.getFullYear())), c(b, "yyyy");
      } }, { key: "yy", regex: "\\d{2}", apply: function apply(a) {
        a = +a, this.year = 69 > a ? a + 2e3 : a + 1900;
      }, formatter: function formatter(a) {
        var b = new Date();return b.setFullYear(Math.abs(a.getFullYear())), c(b, "yy");
      } }, { key: "y", regex: "\\d{1,4}", apply: function apply(a) {
        this.year = +a;
      }, formatter: function formatter(a) {
        var b = new Date();return b.setFullYear(Math.abs(a.getFullYear())), c(b, "y");
      } }, { key: "M!", regex: "0?[1-9]|1[0-2]", apply: function apply(a) {
        this.month = a - 1;
      }, formatter: function formatter(a) {
        var b = a.getMonth();return (/^[0-9]$/.test(b) ? c(a, "MM") : c(a, "M")
        );
      } }, { key: "MMMM", regex: b.DATETIME_FORMATS.MONTH.join("|"), apply: function apply(a) {
        this.month = b.DATETIME_FORMATS.MONTH.indexOf(a);
      }, formatter: function formatter(a) {
        return c(a, "MMMM");
      } }, { key: "MMM", regex: b.DATETIME_FORMATS.SHORTMONTH.join("|"), apply: function apply(a) {
        this.month = b.DATETIME_FORMATS.SHORTMONTH.indexOf(a);
      }, formatter: function formatter(a) {
        return c(a, "MMM");
      } }, { key: "MM", regex: "0[1-9]|1[0-2]", apply: function apply(a) {
        this.month = a - 1;
      }, formatter: function formatter(a) {
        return c(a, "MM");
      } }, { key: "M", regex: "[1-9]|1[0-2]", apply: function apply(a) {
        this.month = a - 1;
      }, formatter: function formatter(a) {
        return c(a, "M");
      } }, { key: "d!", regex: "[0-2]?[0-9]{1}|3[0-1]{1}", apply: function apply(a) {
        this.date = +a;
      }, formatter: function formatter(a) {
        var b = a.getDate();return (/^[1-9]$/.test(b) ? c(a, "dd") : c(a, "d")
        );
      } }, { key: "dd", regex: "[0-2][0-9]{1}|3[0-1]{1}", apply: function apply(a) {
        this.date = +a;
      }, formatter: function formatter(a) {
        return c(a, "dd");
      } }, { key: "d", regex: "[1-2]?[0-9]{1}|3[0-1]{1}", apply: function apply(a) {
        this.date = +a;
      }, formatter: function formatter(a) {
        return c(a, "d");
      } }, { key: "EEEE", regex: b.DATETIME_FORMATS.DAY.join("|"), formatter: function formatter(a) {
        return c(a, "EEEE");
      } }, { key: "EEE", regex: b.DATETIME_FORMATS.SHORTDAY.join("|"), formatter: function formatter(a) {
        return c(a, "EEE");
      } }, { key: "HH", regex: "(?:0|1)[0-9]|2[0-3]", apply: function apply(a) {
        this.hours = +a;
      }, formatter: function formatter(a) {
        return c(a, "HH");
      } }, { key: "hh", regex: "0[0-9]|1[0-2]", apply: function apply(a) {
        this.hours = +a;
      }, formatter: function formatter(a) {
        return c(a, "hh");
      } }, { key: "H", regex: "1?[0-9]|2[0-3]", apply: function apply(a) {
        this.hours = +a;
      }, formatter: function formatter(a) {
        return c(a, "H");
      } }, { key: "h", regex: "[0-9]|1[0-2]", apply: function apply(a) {
        this.hours = +a;
      }, formatter: function formatter(a) {
        return c(a, "h");
      } }, { key: "mm", regex: "[0-5][0-9]", apply: function apply(a) {
        this.minutes = +a;
      }, formatter: function formatter(a) {
        return c(a, "mm");
      } }, { key: "m", regex: "[0-9]|[1-5][0-9]", apply: function apply(a) {
        this.minutes = +a;
      }, formatter: function formatter(a) {
        return c(a, "m");
      } }, { key: "sss", regex: "[0-9][0-9][0-9]", apply: function apply(a) {
        this.milliseconds = +a;
      }, formatter: function formatter(a) {
        return c(a, "sss");
      } }, { key: "ss", regex: "[0-5][0-9]", apply: function apply(a) {
        this.seconds = +a;
      }, formatter: function formatter(a) {
        return c(a, "ss");
      } }, { key: "s", regex: "[0-9]|[1-5][0-9]", apply: function apply(a) {
        this.seconds = +a;
      }, formatter: function formatter(a) {
        return c(a, "s");
      } }, { key: "a", regex: b.DATETIME_FORMATS.AMPMS.join("|"), apply: function apply(a) {
        12 === this.hours && (this.hours = 0), "PM" === a && (this.hours += 12);
      }, formatter: function formatter(a) {
        return c(a, "a");
      } }, { key: "Z", regex: "[+-]\\d{4}", apply: function apply(a) {
        var b = a.match(/([+-])(\d{2})(\d{2})/),
            c = b[1],
            d = b[2],
            e = b[3];this.hours += l(c + d), this.minutes += l(c + e);
      }, formatter: function formatter(a) {
        return c(a, "Z");
      } }, { key: "ww", regex: "[0-4][0-9]|5[0-3]", formatter: function formatter(a) {
        return c(a, "ww");
      } }, { key: "w", regex: "[0-9]|[1-4][0-9]|5[0-3]", formatter: function formatter(a) {
        return c(a, "w");
      } }, { key: "GGGG", regex: b.DATETIME_FORMATS.ERANAMES.join("|").replace(/\s/g, "\\s"), formatter: function formatter(a) {
        return c(a, "GGGG");
      } }, { key: "GGG", regex: b.DATETIME_FORMATS.ERAS.join("|"), formatter: function formatter(a) {
        return c(a, "GGG");
      } }, { key: "GG", regex: b.DATETIME_FORMATS.ERAS.join("|"), formatter: function formatter(a) {
        return c(a, "GG");
      } }, { key: "G", regex: b.DATETIME_FORMATS.ERAS.join("|"), formatter: function formatter(a) {
        return c(a, "G");
      } }], angular.version.major >= 1 && angular.version.minor > 4 && s.push({ key: "LLLL", regex: b.DATETIME_FORMATS.STANDALONEMONTH.join("|"), apply: function apply(a) {
        this.month = b.DATETIME_FORMATS.STANDALONEMONTH.indexOf(a);
      }, formatter: function formatter(a) {
        return c(a, "LLLL");
      } });
  }, this.init(), this.getParser = function (a) {
    var b = f(a);return b && b.apply || null;
  }, this.overrideParser = function (a, b) {
    var c = f(a);c && angular.isFunction(b) && (this.parsers = {}, c.apply = b);
  }.bind(this), this.filter = function (a, c) {
    if (!angular.isDate(a) || isNaN(a) || !c) return "";c = b.DATETIME_FORMATS[c] || c, b.id !== r && this.init(), this.formatters[c] || (this.formatters[c] = h(c));var d = this.formatters[c];return d.reduce(function (b, c) {
      return b + c(a);
    }, "");
  }, this.parse = function (c, d, e) {
    if (!angular.isString(c) || !d) return c;d = b.DATETIME_FORMATS[d] || d, d = d.replace(t, "\\$&"), b.id !== r && this.init(), this.parsers[d] || (this.parsers[d] = g(d, "apply"));var f = this.parsers[d],
        h = f.regex,
        i = f.map,
        j = c.match(h),
        l = !1;if (j && j.length) {
      var m, n;angular.isDate(e) && !isNaN(e.getTime()) ? m = { year: e.getFullYear(), month: e.getMonth(), date: e.getDate(), hours: e.getHours(), minutes: e.getMinutes(), seconds: e.getSeconds(), milliseconds: e.getMilliseconds() } : (e && a.warn("dateparser:", "baseDate is not a valid date"), m = { year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });for (var o = 1, p = j.length; p > o; o++) {
        var q = i[o - 1];"Z" === q.matcher && (l = !0), q.apply && q.apply.call(m, j[o]);
      }var s = l ? Date.prototype.setUTCFullYear : Date.prototype.setFullYear,
          u = l ? Date.prototype.setUTCHours : Date.prototype.setHours;return k(m.year, m.month, m.date) && (!angular.isDate(e) || isNaN(e.getTime()) || l ? (n = new Date(0), s.call(n, m.year, m.month, m.date), u.call(n, m.hours || 0, m.minutes || 0, m.seconds || 0, m.milliseconds || 0)) : (n = new Date(e), s.call(n, m.year, m.month, m.date), u.call(n, m.hours, m.minutes, m.seconds, m.milliseconds))), n;
    }
  }, this.toTimezone = m, this.fromTimezone = n, this.timezoneToOffset = o, this.addDateMinutes = p, this.convertTimezoneToLocal = q;
}]), angular.module("ui.bootstrap.isClass", []).directive("uibIsClass", ["$animate", function (a) {
  var b = /^\s*([\s\S]+?)\s+on\s+([\s\S]+?)\s*$/,
      c = /^\s*([\s\S]+?)\s+for\s+([\s\S]+?)\s*$/;return { restrict: "A", compile: function compile(d, e) {
      function f(a, b, c) {
        i.push(a), j.push({ scope: a, element: b }), o.forEach(function (b, c) {
          g(b, a);
        }), a.$on("$destroy", h);
      }function g(b, d) {
        var e = b.match(c),
            f = d.$eval(e[1]),
            g = e[2],
            h = k[b];if (!h) {
          var i = function i(b) {
            var c = null;j.some(function (a) {
              var d = a.scope.$eval(m);return d === b ? (c = a, !0) : void 0;
            }), h.lastActivated !== c && (h.lastActivated && a.removeClass(h.lastActivated.element, f), c && a.addClass(c.element, f), h.lastActivated = c);
          };k[b] = h = { lastActivated: null, scope: d, watchFn: i, compareWithExp: g, watcher: d.$watch(g, i) };
        }h.watchFn(d.$eval(g));
      }function h(a) {
        var b = a.targetScope,
            c = i.indexOf(b);if (i.splice(c, 1), j.splice(c, 1), i.length) {
          var d = i[0];angular.forEach(k, function (a) {
            a.scope === b && (a.watcher = d.$watch(a.compareWithExp, a.watchFn), a.scope = d);
          });
        } else k = {};
      }var i = [],
          j = [],
          k = {},
          l = e.uibIsClass.match(b),
          m = l[2],
          n = l[1],
          o = n.split(",");return f;
    } };
}]), angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.isClass"]).value("$datepickerSuppressError", !1).value("$datepickerLiteralWarning", !0).constant("uibDatepickerConfig", { datepickerMode: "day", formatDay: "dd", formatMonth: "MMMM", formatYear: "yyyy", formatDayHeader: "EEE", formatDayTitle: "MMMM yyyy", formatMonthTitle: "yyyy", maxDate: null, maxMode: "year", minDate: null, minMode: "day", monthColumns: 3, ngModelOptions: {}, shortcutPropagation: !1, showWeeks: !0, yearColumns: 5, yearRows: 4 }).controller("UibDatepickerController", ["$scope", "$element", "$attrs", "$parse", "$interpolate", "$locale", "$log", "dateFilter", "uibDatepickerConfig", "$datepickerLiteralWarning", "$datepickerSuppressError", "uibDateParser", function (a, b, c, d, e, f, g, h, i, j, k, l) {
  function m(b) {
    a.datepickerMode = b, a.datepickerOptions.datepickerMode = b;
  }function n(b) {
    var c;if (angular.version.minor < 6) c = b.$options || a.datepickerOptions.ngModelOptions || i.ngModelOptions || {}, c.getOption = function (a) {
      return c[a];
    };else {
      var d = b.$options.getOption("timezone") || (a.datepickerOptions.ngModelOptions ? a.datepickerOptions.ngModelOptions.timezone : null) || (i.ngModelOptions ? i.ngModelOptions.timezone : null);c = b.$options.createChild(i.ngModelOptions).createChild(a.datepickerOptions.ngModelOptions).createChild(b.$options).createChild({ timezone: d });
    }return c;
  }var o = this,
      p = { $setViewValue: angular.noop },
      q = {},
      r = [];b.addClass("uib-datepicker"), c.$set("role", "application"), a.datepickerOptions || (a.datepickerOptions = {}), this.modes = ["day", "month", "year"], ["customClass", "dateDisabled", "datepickerMode", "formatDay", "formatDayHeader", "formatDayTitle", "formatMonth", "formatMonthTitle", "formatYear", "maxDate", "maxMode", "minDate", "minMode", "monthColumns", "showWeeks", "shortcutPropagation", "startingDay", "yearColumns", "yearRows"].forEach(function (b) {
    switch (b) {case "customClass":case "dateDisabled":
        a[b] = a.datepickerOptions[b] || angular.noop;break;case "datepickerMode":
        a.datepickerMode = angular.isDefined(a.datepickerOptions.datepickerMode) ? a.datepickerOptions.datepickerMode : i.datepickerMode;break;case "formatDay":case "formatDayHeader":case "formatDayTitle":case "formatMonth":case "formatMonthTitle":case "formatYear":
        o[b] = angular.isDefined(a.datepickerOptions[b]) ? e(a.datepickerOptions[b])(a.$parent) : i[b];break;case "monthColumns":case "showWeeks":case "shortcutPropagation":case "yearColumns":case "yearRows":
        o[b] = angular.isDefined(a.datepickerOptions[b]) ? a.datepickerOptions[b] : i[b];break;case "startingDay":
        angular.isDefined(a.datepickerOptions.startingDay) ? o.startingDay = a.datepickerOptions.startingDay : angular.isNumber(i.startingDay) ? o.startingDay = i.startingDay : o.startingDay = (f.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;break;case "maxDate":case "minDate":
        a.$watch("datepickerOptions." + b, function (a) {
          a ? angular.isDate(a) ? o[b] = l.fromTimezone(new Date(a), q.getOption("timezone")) : (j && g.warn("Literal date support has been deprecated, please switch to date object usage"), o[b] = new Date(h(a, "medium"))) : o[b] = i[b] ? l.fromTimezone(new Date(i[b]), q.getOption("timezone")) : null, o.refreshView();
        });break;case "maxMode":case "minMode":
        a.datepickerOptions[b] ? a.$watch(function () {
          return a.datepickerOptions[b];
        }, function (c) {
          o[b] = a[b] = angular.isDefined(c) ? c : a.datepickerOptions[b], ("minMode" === b && o.modes.indexOf(a.datepickerOptions.datepickerMode) < o.modes.indexOf(o[b]) || "maxMode" === b && o.modes.indexOf(a.datepickerOptions.datepickerMode) > o.modes.indexOf(o[b])) && (a.datepickerMode = o[b], a.datepickerOptions.datepickerMode = o[b]);
        }) : o[b] = a[b] = i[b] || null;}
  }), a.uniqueId = "datepicker-" + a.$id + "-" + Math.floor(1e4 * Math.random()), a.disabled = angular.isDefined(c.disabled) || !1, angular.isDefined(c.ngDisabled) && r.push(a.$parent.$watch(c.ngDisabled, function (b) {
    a.disabled = b, o.refreshView();
  })), a.isActive = function (b) {
    return 0 === o.compare(b.date, o.activeDate) ? (a.activeDateId = b.uid, !0) : !1;
  }, this.init = function (b) {
    p = b, q = n(p), a.datepickerOptions.initDate ? (o.activeDate = l.fromTimezone(a.datepickerOptions.initDate, q.getOption("timezone")) || new Date(), a.$watch("datepickerOptions.initDate", function (a) {
      a && (p.$isEmpty(p.$modelValue) || p.$invalid) && (o.activeDate = l.fromTimezone(a, q.getOption("timezone")), o.refreshView());
    })) : o.activeDate = new Date();var c = p.$modelValue ? new Date(p.$modelValue) : new Date();this.activeDate = isNaN(c) ? l.fromTimezone(new Date(), q.getOption("timezone")) : l.fromTimezone(c, q.getOption("timezone")), p.$render = function () {
      o.render();
    };
  }, this.render = function () {
    if (p.$viewValue) {
      var a = new Date(p.$viewValue),
          b = !isNaN(a);b ? this.activeDate = l.fromTimezone(a, q.getOption("timezone")) : k || g.error('Datepicker directive: "ng-model" value must be a Date object');
    }this.refreshView();
  }, this.refreshView = function () {
    if (this.element) {
      a.selectedDt = null, this._refreshView(), a.activeDt && (a.activeDateId = a.activeDt.uid);var b = p.$viewValue ? new Date(p.$viewValue) : null;b = l.fromTimezone(b, q.getOption("timezone")), p.$setValidity("dateDisabled", !b || this.element && !this.isDisabled(b));
    }
  }, this.createDateObject = function (b, c) {
    var d = p.$viewValue ? new Date(p.$viewValue) : null;d = l.fromTimezone(d, q.getOption("timezone"));var e = new Date();e = l.fromTimezone(e, q.getOption("timezone"));var f = this.compare(b, e),
        g = { date: b, label: l.filter(b, c), selected: d && 0 === this.compare(b, d), disabled: this.isDisabled(b), past: 0 > f, current: 0 === f, future: f > 0, customClass: this.customClass(b) || null };return d && 0 === this.compare(b, d) && (a.selectedDt = g), o.activeDate && 0 === this.compare(g.date, o.activeDate) && (a.activeDt = g), g;
  }, this.isDisabled = function (b) {
    return a.disabled || this.minDate && this.compare(b, this.minDate) < 0 || this.maxDate && this.compare(b, this.maxDate) > 0 || a.dateDisabled && a.dateDisabled({ date: b, mode: a.datepickerMode });
  }, this.customClass = function (b) {
    return a.customClass({ date: b, mode: a.datepickerMode });
  }, this.split = function (a, b) {
    for (var c = []; a.length > 0;) {
      c.push(a.splice(0, b));
    }return c;
  }, a.select = function (b) {
    if (a.datepickerMode === o.minMode) {
      var c = p.$viewValue ? l.fromTimezone(new Date(p.$viewValue), q.getOption("timezone")) : new Date(0, 0, 0, 0, 0, 0, 0);c.setFullYear(b.getFullYear(), b.getMonth(), b.getDate()), c = l.toTimezone(c, q.getOption("timezone")), p.$setViewValue(c), p.$render();
    } else o.activeDate = b, m(o.modes[o.modes.indexOf(a.datepickerMode) - 1]), a.$emit("uib:datepicker.mode");a.$broadcast("uib:datepicker.focus");
  }, a.move = function (a) {
    var b = o.activeDate.getFullYear() + a * (o.step.years || 0),
        c = o.activeDate.getMonth() + a * (o.step.months || 0);o.activeDate.setFullYear(b, c, 1), o.refreshView();
  }, a.toggleMode = function (b) {
    b = b || 1, a.datepickerMode === o.maxMode && 1 === b || a.datepickerMode === o.minMode && -1 === b || (m(o.modes[o.modes.indexOf(a.datepickerMode) + b]), a.$emit("uib:datepicker.mode"));
  }, a.keys = { 13: "enter", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down" };var s = function s() {
    o.element[0].focus();
  };a.$on("uib:datepicker.focus", s), a.keydown = function (b) {
    var c = a.keys[b.which];if (c && !b.shiftKey && !b.altKey && !a.disabled) if (b.preventDefault(), o.shortcutPropagation || b.stopPropagation(), "enter" === c || "space" === c) {
      if (o.isDisabled(o.activeDate)) return;a.select(o.activeDate);
    } else !b.ctrlKey || "up" !== c && "down" !== c ? (o.handleKeyDown(c, b), o.refreshView()) : a.toggleMode("up" === c ? 1 : -1);
  }, b.on("keydown", function (b) {
    a.$apply(function () {
      a.keydown(b);
    });
  }), a.$on("$destroy", function () {
    for (; r.length;) {
      r.shift()();
    }
  });
}]).controller("UibDaypickerController", ["$scope", "$element", "dateFilter", function (a, b, c) {
  function d(a, b) {
    return 1 !== b || a % 4 !== 0 || a % 100 === 0 && a % 400 !== 0 ? f[b] : 29;
  }function e(a) {
    var b = new Date(a);b.setDate(b.getDate() + 4 - (b.getDay() || 7));var c = b.getTime();return b.setMonth(0), b.setDate(1), Math.floor(Math.round((c - b) / 864e5) / 7) + 1;
  }var f = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];this.step = { months: 1 }, this.element = b, this.init = function (b) {
    angular.extend(b, this), a.showWeeks = b.showWeeks, b.refreshView();
  }, this.getDates = function (a, b) {
    for (var c, d = new Array(b), e = new Date(a), f = 0; b > f;) {
      c = new Date(e), d[f++] = c, e.setDate(e.getDate() + 1);
    }return d;
  }, this._refreshView = function () {
    var b = this.activeDate.getFullYear(),
        d = this.activeDate.getMonth(),
        f = new Date(this.activeDate);f.setFullYear(b, d, 1);var g = this.startingDay - f.getDay(),
        h = g > 0 ? 7 - g : -g,
        i = new Date(f);h > 0 && i.setDate(-h + 1);for (var j = this.getDates(i, 42), k = 0; 42 > k; k++) {
      j[k] = angular.extend(this.createDateObject(j[k], this.formatDay), { secondary: j[k].getMonth() !== d, uid: a.uniqueId + "-" + k });
    }a.labels = new Array(7);for (var l = 0; 7 > l; l++) {
      a.labels[l] = { abbr: c(j[l].date, this.formatDayHeader), full: c(j[l].date, "EEEE") };
    }if (a.title = c(this.activeDate, this.formatDayTitle), a.rows = this.split(j, 7), a.showWeeks) {
      a.weekNumbers = [];for (var m = (11 - this.startingDay) % 7, n = a.rows.length, o = 0; n > o; o++) {
        a.weekNumbers.push(e(a.rows[o][m].date));
      }
    }
  }, this.compare = function (a, b) {
    var c = new Date(a.getFullYear(), a.getMonth(), a.getDate()),
        d = new Date(b.getFullYear(), b.getMonth(), b.getDate());return c.setFullYear(a.getFullYear()), d.setFullYear(b.getFullYear()), c - d;
  }, this.handleKeyDown = function (a, b) {
    var c = this.activeDate.getDate();if ("left" === a) c -= 1;else if ("up" === a) c -= 7;else if ("right" === a) c += 1;else if ("down" === a) c += 7;else if ("pageup" === a || "pagedown" === a) {
      var e = this.activeDate.getMonth() + ("pageup" === a ? -1 : 1);this.activeDate.setMonth(e, 1), c = Math.min(d(this.activeDate.getFullYear(), this.activeDate.getMonth()), c);
    } else "home" === a ? c = 1 : "end" === a && (c = d(this.activeDate.getFullYear(), this.activeDate.getMonth()));this.activeDate.setDate(c);
  };
}]).controller("UibMonthpickerController", ["$scope", "$element", "dateFilter", function (a, b, c) {
  this.step = { years: 1 }, this.element = b, this.init = function (a) {
    angular.extend(a, this), a.refreshView();
  }, this._refreshView = function () {
    for (var b, d = new Array(12), e = this.activeDate.getFullYear(), f = 0; 12 > f; f++) {
      b = new Date(this.activeDate), b.setFullYear(e, f, 1), d[f] = angular.extend(this.createDateObject(b, this.formatMonth), { uid: a.uniqueId + "-" + f });
    }a.title = c(this.activeDate, this.formatMonthTitle), a.rows = this.split(d, this.monthColumns), a.yearHeaderColspan = this.monthColumns > 3 ? this.monthColumns - 2 : 1;
  }, this.compare = function (a, b) {
    var c = new Date(a.getFullYear(), a.getMonth()),
        d = new Date(b.getFullYear(), b.getMonth());return c.setFullYear(a.getFullYear()), d.setFullYear(b.getFullYear()), c - d;
  }, this.handleKeyDown = function (a, b) {
    var c = this.activeDate.getMonth();if ("left" === a) c -= 1;else if ("up" === a) c -= this.monthColumns;else if ("right" === a) c += 1;else if ("down" === a) c += this.monthColumns;else if ("pageup" === a || "pagedown" === a) {
      var d = this.activeDate.getFullYear() + ("pageup" === a ? -1 : 1);this.activeDate.setFullYear(d);
    } else "home" === a ? c = 0 : "end" === a && (c = 11);this.activeDate.setMonth(c);
  };
}]).controller("UibYearpickerController", ["$scope", "$element", "dateFilter", function (a, b, c) {
  function d(a) {
    return parseInt((a - 1) / f, 10) * f + 1;
  }var e, f;this.element = b, this.yearpickerInit = function () {
    e = this.yearColumns, f = this.yearRows * e, this.step = { years: f };
  }, this._refreshView = function () {
    for (var b, c = new Array(f), g = 0, h = d(this.activeDate.getFullYear()); f > g; g++) {
      b = new Date(this.activeDate), b.setFullYear(h + g, 0, 1), c[g] = angular.extend(this.createDateObject(b, this.formatYear), { uid: a.uniqueId + "-" + g });
    }a.title = [c[0].label, c[f - 1].label].join(" - "), a.rows = this.split(c, e), a.columns = e;
  }, this.compare = function (a, b) {
    return a.getFullYear() - b.getFullYear();
  }, this.handleKeyDown = function (a, b) {
    var c = this.activeDate.getFullYear();"left" === a ? c -= 1 : "up" === a ? c -= e : "right" === a ? c += 1 : "down" === a ? c += e : "pageup" === a || "pagedown" === a ? c += ("pageup" === a ? -1 : 1) * f : "home" === a ? c = d(this.activeDate.getFullYear()) : "end" === a && (c = d(this.activeDate.getFullYear()) + f - 1), this.activeDate.setFullYear(c);
  };
}]).directive("uibDatepicker", function () {
  return { templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/datepicker/datepicker.html";
    }, scope: { datepickerOptions: "=?" }, require: ["uibDatepicker", "^ngModel"], restrict: "A", controller: "UibDatepickerController", controllerAs: "datepicker", link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];e.init(f);
    } };
}).directive("uibDaypicker", function () {
  return { templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/datepicker/day.html";
    }, require: ["^uibDatepicker", "uibDaypicker"], restrict: "A", controller: "UibDaypickerController", link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];f.init(e);
    } };
}).directive("uibMonthpicker", function () {
  return { templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/datepicker/month.html";
    }, require: ["^uibDatepicker", "uibMonthpicker"], restrict: "A", controller: "UibMonthpickerController", link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];f.init(e);
    } };
}).directive("uibYearpicker", function () {
  return { templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/datepicker/year.html";
    }, require: ["^uibDatepicker", "uibYearpicker"], restrict: "A", controller: "UibYearpickerController", link: function link(a, b, c, d) {
      var e = d[0];angular.extend(e, d[1]), e.yearpickerInit(), e.refreshView();
    } };
}), angular.module("ui.bootstrap.position", []).factory("$uibPosition", ["$document", "$window", function (a, b) {
  var c,
      d,
      e = { normal: /(auto|scroll)/, hidden: /(auto|scroll|hidden)/ },
      f = { auto: /\s?auto?\s?/i, primary: /^(top|bottom|left|right)$/, secondary: /^(top|bottom|left|right|center)$/, vertical: /^(top|bottom)$/ },
      g = /(HTML|BODY)/;return { getRawNode: function getRawNode(a) {
      return a.nodeName ? a : a[0] || a;
    }, parseStyle: function parseStyle(a) {
      return a = parseFloat(a), isFinite(a) ? a : 0;
    }, offsetParent: function offsetParent(c) {
      function d(a) {
        return "static" === (b.getComputedStyle(a).position || "static");
      }c = this.getRawNode(c);for (var e = c.offsetParent || a[0].documentElement; e && e !== a[0].documentElement && d(e);) {
        e = e.offsetParent;
      }return e || a[0].documentElement;
    }, scrollbarWidth: function scrollbarWidth(e) {
      if (e) {
        if (angular.isUndefined(d)) {
          var f = a.find("body");f.addClass("uib-position-body-scrollbar-measure"), d = b.innerWidth - f[0].clientWidth, d = isFinite(d) ? d : 0, f.removeClass("uib-position-body-scrollbar-measure");
        }return d;
      }if (angular.isUndefined(c)) {
        var g = angular.element('<div class="uib-position-scrollbar-measure"></div>');a.find("body").append(g), c = g[0].offsetWidth - g[0].clientWidth, c = isFinite(c) ? c : 0, g.remove();
      }return c;
    }, scrollbarPadding: function scrollbarPadding(a) {
      a = this.getRawNode(a);var c = b.getComputedStyle(a),
          d = this.parseStyle(c.paddingRight),
          e = this.parseStyle(c.paddingBottom),
          f = this.scrollParent(a, !1, !0),
          h = this.scrollbarWidth(g.test(f.tagName));return { scrollbarWidth: h, widthOverflow: f.scrollWidth > f.clientWidth, right: d + h, originalRight: d, heightOverflow: f.scrollHeight > f.clientHeight, bottom: e + h, originalBottom: e };
    }, isScrollable: function isScrollable(a, c) {
      a = this.getRawNode(a);var d = c ? e.hidden : e.normal,
          f = b.getComputedStyle(a);return d.test(f.overflow + f.overflowY + f.overflowX);
    }, scrollParent: function scrollParent(c, d, f) {
      c = this.getRawNode(c);var g = d ? e.hidden : e.normal,
          h = a[0].documentElement,
          i = b.getComputedStyle(c);if (f && g.test(i.overflow + i.overflowY + i.overflowX)) return c;var j = "absolute" === i.position,
          k = c.parentElement || h;if (k === h || "fixed" === i.position) return h;for (; k.parentElement && k !== h;) {
        var l = b.getComputedStyle(k);if (j && "static" !== l.position && (j = !1), !j && g.test(l.overflow + l.overflowY + l.overflowX)) break;k = k.parentElement;
      }return k;
    }, position: function position(c, d) {
      c = this.getRawNode(c);var e = this.offset(c);if (d) {
        var f = b.getComputedStyle(c);e.top -= this.parseStyle(f.marginTop), e.left -= this.parseStyle(f.marginLeft);
      }var g = this.offsetParent(c),
          h = { top: 0, left: 0 };return g !== a[0].documentElement && (h = this.offset(g), h.top += g.clientTop - g.scrollTop, h.left += g.clientLeft - g.scrollLeft), { width: Math.round(angular.isNumber(e.width) ? e.width : c.offsetWidth), height: Math.round(angular.isNumber(e.height) ? e.height : c.offsetHeight), top: Math.round(e.top - h.top), left: Math.round(e.left - h.left) };
    }, offset: function offset(c) {
      c = this.getRawNode(c);var d = c.getBoundingClientRect();return { width: Math.round(angular.isNumber(d.width) ? d.width : c.offsetWidth), height: Math.round(angular.isNumber(d.height) ? d.height : c.offsetHeight), top: Math.round(d.top + (b.pageYOffset || a[0].documentElement.scrollTop)), left: Math.round(d.left + (b.pageXOffset || a[0].documentElement.scrollLeft)) };
    }, viewportOffset: function viewportOffset(c, d, e) {
      c = this.getRawNode(c), e = e !== !1;var f = c.getBoundingClientRect(),
          g = { top: 0, left: 0, bottom: 0, right: 0 },
          h = d ? a[0].documentElement : this.scrollParent(c),
          i = h.getBoundingClientRect();if (g.top = i.top + h.clientTop, g.left = i.left + h.clientLeft, h === a[0].documentElement && (g.top += b.pageYOffset, g.left += b.pageXOffset), g.bottom = g.top + h.clientHeight, g.right = g.left + h.clientWidth, e) {
        var j = b.getComputedStyle(h);g.top += this.parseStyle(j.paddingTop), g.bottom -= this.parseStyle(j.paddingBottom), g.left += this.parseStyle(j.paddingLeft), g.right -= this.parseStyle(j.paddingRight);
      }return { top: Math.round(f.top - g.top), bottom: Math.round(g.bottom - f.bottom), left: Math.round(f.left - g.left), right: Math.round(g.right - f.right) };
    }, parsePlacement: function parsePlacement(a) {
      var b = f.auto.test(a);return b && (a = a.replace(f.auto, "")), a = a.split("-"), a[0] = a[0] || "top", f.primary.test(a[0]) || (a[0] = "top"), a[1] = a[1] || "center", f.secondary.test(a[1]) || (a[1] = "center"), b ? a[2] = !0 : a[2] = !1, a;
    }, positionElements: function positionElements(a, c, d, e) {
      a = this.getRawNode(a), c = this.getRawNode(c);var g = angular.isDefined(c.offsetWidth) ? c.offsetWidth : c.prop("offsetWidth"),
          h = angular.isDefined(c.offsetHeight) ? c.offsetHeight : c.prop("offsetHeight");d = this.parsePlacement(d);var i = e ? this.offset(a) : this.position(a),
          j = { top: 0, left: 0, placement: "" };if (d[2]) {
        var k = this.viewportOffset(a, e),
            l = b.getComputedStyle(c),
            m = { width: g + Math.round(Math.abs(this.parseStyle(l.marginLeft) + this.parseStyle(l.marginRight))), height: h + Math.round(Math.abs(this.parseStyle(l.marginTop) + this.parseStyle(l.marginBottom))) };if (d[0] = "top" === d[0] && m.height > k.top && m.height <= k.bottom ? "bottom" : "bottom" === d[0] && m.height > k.bottom && m.height <= k.top ? "top" : "left" === d[0] && m.width > k.left && m.width <= k.right ? "right" : "right" === d[0] && m.width > k.right && m.width <= k.left ? "left" : d[0], d[1] = "top" === d[1] && m.height - i.height > k.bottom && m.height - i.height <= k.top ? "bottom" : "bottom" === d[1] && m.height - i.height > k.top && m.height - i.height <= k.bottom ? "top" : "left" === d[1] && m.width - i.width > k.right && m.width - i.width <= k.left ? "right" : "right" === d[1] && m.width - i.width > k.left && m.width - i.width <= k.right ? "left" : d[1], "center" === d[1]) if (f.vertical.test(d[0])) {
          var n = i.width / 2 - g / 2;k.left + n < 0 && m.width - i.width <= k.right ? d[1] = "left" : k.right + n < 0 && m.width - i.width <= k.left && (d[1] = "right");
        } else {
          var o = i.height / 2 - m.height / 2;k.top + o < 0 && m.height - i.height <= k.bottom ? d[1] = "top" : k.bottom + o < 0 && m.height - i.height <= k.top && (d[1] = "bottom");
        }
      }switch (d[0]) {case "top":
          j.top = i.top - h;break;case "bottom":
          j.top = i.top + i.height;break;case "left":
          j.left = i.left - g;break;case "right":
          j.left = i.left + i.width;}switch (d[1]) {case "top":
          j.top = i.top;break;case "bottom":
          j.top = i.top + i.height - h;break;case "left":
          j.left = i.left;break;case "right":
          j.left = i.left + i.width - g;break;case "center":
          f.vertical.test(d[0]) ? j.left = i.left + i.width / 2 - g / 2 : j.top = i.top + i.height / 2 - h / 2;}return j.top = Math.round(j.top), j.left = Math.round(j.left), j.placement = "center" === d[1] ? d[0] : d[0] + "-" + d[1], j;
    }, adjustTop: function adjustTop(a, b, c, d) {
      return -1 !== a.indexOf("top") && c !== d ? { top: b.top - d + "px" } : void 0;
    }, positionArrow: function positionArrow(a, c) {
      a = this.getRawNode(a);var d = a.querySelector(".tooltip-inner, .popover-inner");if (d) {
        var e = angular.element(d).hasClass("tooltip-inner"),
            g = e ? a.querySelector(".tooltip-arrow") : a.querySelector(".arrow");if (g) {
          var h = { top: "", bottom: "", left: "", right: "" };if (c = this.parsePlacement(c), "center" === c[1]) return void angular.element(g).css(h);var i = "border-" + c[0] + "-width",
              j = b.getComputedStyle(g)[i],
              k = "border-";k += f.vertical.test(c[0]) ? c[0] + "-" + c[1] : c[1] + "-" + c[0], k += "-radius";var l = b.getComputedStyle(e ? d : a)[k];switch (c[0]) {case "top":
              h.bottom = e ? "0" : "-" + j;break;case "bottom":
              h.top = e ? "0" : "-" + j;break;case "left":
              h.right = e ? "0" : "-" + j;break;case "right":
              h.left = e ? "0" : "-" + j;}h[c[1]] = l, angular.element(g).css(h);
        }
      }
    } };
}]), angular.module("ui.bootstrap.datepickerPopup", ["ui.bootstrap.datepicker", "ui.bootstrap.position"]).value("$datepickerPopupLiteralWarning", !0).constant("uibDatepickerPopupConfig", { altInputFormats: [], appendToBody: !1, clearText: "Clear", closeOnDateSelection: !0, closeText: "Done", currentText: "Today", datepickerPopup: "yyyy-MM-dd", datepickerPopupTemplateUrl: "uib/template/datepickerPopup/popup.html", datepickerTemplateUrl: "uib/template/datepicker/datepicker.html", html5Types: { date: "yyyy-MM-dd", "datetime-local": "yyyy-MM-ddTHH:mm:ss.sss", month: "yyyy-MM" }, onOpenFocus: !0, showButtonBar: !0, placement: "auto bottom-left" }).controller("UibDatepickerPopupController", ["$scope", "$element", "$attrs", "$compile", "$log", "$parse", "$window", "$document", "$rootScope", "$uibPosition", "dateFilter", "uibDateParser", "uibDatepickerPopupConfig", "$timeout", "uibDatepickerConfig", "$datepickerPopupLiteralWarning", function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
  function q(b) {
    var c = l.parse(b, x, a.date);if (isNaN(c)) for (var d = 0; d < J.length; d++) {
      if (c = l.parse(b, J[d], a.date), !isNaN(c)) return c;
    }return c;
  }function r(a) {
    if (angular.isNumber(a) && (a = new Date(a)), !a) return null;if (angular.isDate(a) && !isNaN(a)) return a;if (angular.isString(a)) {
      var b = q(a);if (!isNaN(b)) return l.toTimezone(b, H.getOption("timezone"));
    }return H.getOption("allowInvalid") ? a : void 0;
  }function s(a, b) {
    var d = a || b;return c.ngRequired || d ? (angular.isNumber(d) && (d = new Date(d)), d ? angular.isDate(d) && !isNaN(d) ? !0 : angular.isString(d) ? !isNaN(q(d)) : !1 : !0) : !0;
  }function t(c) {
    if (a.isOpen || !a.disabled) {
      var d = I[0],
          e = b[0].contains(c.target),
          f = void 0 !== d.contains && d.contains(c.target);!a.isOpen || e || f || a.$apply(function () {
        a.isOpen = !1;
      });
    }
  }function u(c) {
    27 === c.which && a.isOpen ? (c.preventDefault(), c.stopPropagation(), a.$apply(function () {
      a.isOpen = !1;
    }), b[0].focus()) : 40 !== c.which || a.isOpen || (c.preventDefault(), c.stopPropagation(), a.$apply(function () {
      a.isOpen = !0;
    }));
  }function v() {
    if (a.isOpen) {
      var d = angular.element(I[0].querySelector(".uib-datepicker-popup")),
          e = c.popupPlacement ? c.popupPlacement : m.placement,
          f = j.positionElements(b, d, e, z);d.css({ top: f.top + "px", left: f.left + "px" }), d.hasClass("uib-position-measure") && d.removeClass("uib-position-measure");
    }
  }function w(a) {
    var b;return angular.version.minor < 6 ? (b = angular.isObject(a.$options) ? a.$options : { timezone: null }, b.getOption = function (a) {
      return b[a];
    }) : b = a.$options, b;
  }var x,
      y,
      z,
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K = !1,
      L = [];this.init = function (e) {
    if (G = e, H = w(G), y = angular.isDefined(c.closeOnDateSelection) ? a.$parent.$eval(c.closeOnDateSelection) : m.closeOnDateSelection, z = angular.isDefined(c.datepickerAppendToBody) ? a.$parent.$eval(c.datepickerAppendToBody) : m.appendToBody, A = angular.isDefined(c.onOpenFocus) ? a.$parent.$eval(c.onOpenFocus) : m.onOpenFocus, B = angular.isDefined(c.datepickerPopupTemplateUrl) ? c.datepickerPopupTemplateUrl : m.datepickerPopupTemplateUrl, C = angular.isDefined(c.datepickerTemplateUrl) ? c.datepickerTemplateUrl : m.datepickerTemplateUrl, J = angular.isDefined(c.altInputFormats) ? a.$parent.$eval(c.altInputFormats) : m.altInputFormats, a.showButtonBar = angular.isDefined(c.showButtonBar) ? a.$parent.$eval(c.showButtonBar) : m.showButtonBar, m.html5Types[c.type] ? (x = m.html5Types[c.type], K = !0) : (x = c.uibDatepickerPopup || m.datepickerPopup, c.$observe("uibDatepickerPopup", function (a, b) {
      var c = a || m.datepickerPopup;if (c !== x && (x = c, G.$modelValue = null, !x)) throw new Error("uibDatepickerPopup must have a date format specified.");
    })), !x) throw new Error("uibDatepickerPopup must have a date format specified.");if (K && c.uibDatepickerPopup) throw new Error("HTML5 date input types do not support custom formats.");D = angular.element("<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>"), D.attr({ "ng-model": "date", "ng-change": "dateSelection(date)", "template-url": B }), E = angular.element(D.children()[0]), E.attr("template-url", C), a.datepickerOptions || (a.datepickerOptions = {}), K && "month" === c.type && (a.datepickerOptions.datepickerMode = "month", a.datepickerOptions.minMode = "month"), E.attr("datepicker-options", "datepickerOptions"), K ? G.$formatters.push(function (b) {
      return a.date = l.fromTimezone(b, H.getOption("timezone")), b;
    }) : (G.$$parserName = "date", G.$validators.date = s, G.$parsers.unshift(r), G.$formatters.push(function (b) {
      return G.$isEmpty(b) ? (a.date = b, b) : (angular.isNumber(b) && (b = new Date(b)), a.date = l.fromTimezone(b, H.getOption("timezone")), l.filter(a.date, x));
    })), G.$viewChangeListeners.push(function () {
      a.date = q(G.$viewValue);
    }), b.on("keydown", u), I = d(D)(a), D.remove(), z ? h.find("body").append(I) : b.after(I), a.$on("$destroy", function () {
      for (a.isOpen === !0 && (i.$$phase || a.$apply(function () {
        a.isOpen = !1;
      })), I.remove(), b.off("keydown", u), h.off("click", t), F && F.off("scroll", v), angular.element(g).off("resize", v); L.length;) {
        L.shift()();
      }
    });
  }, a.getText = function (b) {
    return a[b + "Text"] || m[b + "Text"];
  }, a.isDisabled = function (b) {
    "today" === b && (b = l.fromTimezone(new Date(), H.getOption("timezone")));var c = {};return angular.forEach(["minDate", "maxDate"], function (b) {
      a.datepickerOptions[b] ? angular.isDate(a.datepickerOptions[b]) ? c[b] = new Date(a.datepickerOptions[b]) : (p && e.warn("Literal date support has been deprecated, please switch to date object usage"), c[b] = new Date(k(a.datepickerOptions[b], "medium"))) : c[b] = null;
    }), a.datepickerOptions && c.minDate && a.compare(b, c.minDate) < 0 || c.maxDate && a.compare(b, c.maxDate) > 0;
  }, a.compare = function (a, b) {
    return new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate());
  }, a.dateSelection = function (c) {
    a.date = c;var d = a.date ? l.filter(a.date, x) : null;b.val(d), G.$setViewValue(d), y && (a.isOpen = !1, b[0].focus());
  }, a.keydown = function (c) {
    27 === c.which && (c.stopPropagation(), a.isOpen = !1, b[0].focus());
  }, a.select = function (b, c) {
    if (c.stopPropagation(), "today" === b) {
      var d = new Date();angular.isDate(a.date) ? (b = new Date(a.date), b.setFullYear(d.getFullYear(), d.getMonth(), d.getDate())) : (b = l.fromTimezone(d, H.getOption("timezone")), b.setHours(0, 0, 0, 0));
    }a.dateSelection(b);
  }, a.close = function (c) {
    c.stopPropagation(), a.isOpen = !1, b[0].focus();
  }, a.disabled = angular.isDefined(c.disabled) || !1, c.ngDisabled && L.push(a.$parent.$watch(f(c.ngDisabled), function (b) {
    a.disabled = b;
  })), a.$watch("isOpen", function (d) {
    d ? a.disabled ? a.isOpen = !1 : n(function () {
      v(), A && a.$broadcast("uib:datepicker.focus"), h.on("click", t);var d = c.popupPlacement ? c.popupPlacement : m.placement;z || j.parsePlacement(d)[2] ? (F = F || angular.element(j.scrollParent(b)), F && F.on("scroll", v)) : F = null, angular.element(g).on("resize", v);
    }, 0, !1) : (h.off("click", t), F && F.off("scroll", v), angular.element(g).off("resize", v));
  }), a.$on("uib:datepicker.mode", function () {
    n(v, 0, !1);
  });
}]).directive("uibDatepickerPopup", function () {
  return { require: ["ngModel", "uibDatepickerPopup"], controller: "UibDatepickerPopupController", scope: { datepickerOptions: "=?", isOpen: "=?", currentText: "@", clearText: "@", closeText: "@" }, link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];f.init(e);
    } };
}).directive("uibDatepickerPopupWrap", function () {
  return { restrict: "A", transclude: !0, templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/datepickerPopup/popup.html";
    } };
}), angular.module("ui.bootstrap.debounce", []).factory("$$debounce", ["$timeout", function (a) {
  return function (b, c) {
    var d;return function () {
      var e = this,
          f = Array.prototype.slice.call(arguments);d && a.cancel(d), d = a(function () {
        b.apply(e, f);
      }, c);
    };
  };
}]), angular.module("ui.bootstrap.multiMap", []).factory("$$multiMap", function () {
  return { createNew: function createNew() {
      var a = {};return { entries: function entries() {
          return Object.keys(a).map(function (b) {
            return { key: b, value: a[b] };
          });
        }, get: function get(b) {
          return a[b];
        }, hasKey: function hasKey(b) {
          return !!a[b];
        }, keys: function keys() {
          return Object.keys(a);
        }, put: function put(b, c) {
          a[b] || (a[b] = []), a[b].push(c);
        }, remove: function remove(b, c) {
          var d = a[b];if (d) {
            var e = d.indexOf(c);-1 !== e && d.splice(e, 1), d.length || delete a[b];
          }
        } };
    } };
}), angular.module("ui.bootstrap.dropdown", ["ui.bootstrap.multiMap", "ui.bootstrap.position"]).constant("uibDropdownConfig", { appendToOpenClass: "uib-dropdown-open", openClass: "open" }).service("uibDropdownService", ["$document", "$rootScope", "$$multiMap", function (a, b, c) {
  var d = null,
      e = c.createNew();this.isOnlyOpen = function (a, b) {
    var c = e.get(b);if (c) {
      var d = c.reduce(function (b, c) {
        return c.scope === a ? c : b;
      }, {});if (d) return 1 === c.length;
    }return !1;
  }, this.open = function (b, c, g) {
    if (d || a.on("click", f), d && d !== b && (d.isOpen = !1), d = b, g) {
      var h = e.get(g);if (h) {
        var i = h.map(function (a) {
          return a.scope;
        });-1 === i.indexOf(b) && e.put(g, { scope: b });
      } else e.put(g, { scope: b });
    }
  }, this.close = function (b, c, g) {
    if (d === b && (a.off("click", f), a.off("keydown", this.keybindFilter), d = null), g) {
      var h = e.get(g);if (h) {
        var i = h.reduce(function (a, c) {
          return c.scope === b ? c : a;
        }, {});i && e.remove(g, i);
      }
    }
  };var f = function f(a) {
    if (d && d.isOpen && !(a && "disabled" === d.getAutoClose() || a && 3 === a.which)) {
      var c = d.getToggleElement();if (!(a && c && c[0].contains(a.target))) {
        var e = d.getDropdownElement();a && "outsideClick" === d.getAutoClose() && e && e[0].contains(a.target) || (d.focusToggleElement(), d.isOpen = !1, b.$$phase || d.$apply());
      }
    }
  };this.keybindFilter = function (a) {
    if (d) {
      var b = d.getDropdownElement(),
          c = d.getToggleElement(),
          e = b && b[0].contains(a.target),
          g = c && c[0].contains(a.target);27 === a.which ? (a.stopPropagation(), d.focusToggleElement(), f()) : d.isKeynavEnabled() && -1 !== [38, 40].indexOf(a.which) && d.isOpen && (e || g) && (a.preventDefault(), a.stopPropagation(), d.focusDropdownEntry(a.which));
    }
  };
}]).controller("UibDropdownController", ["$scope", "$element", "$attrs", "$parse", "uibDropdownConfig", "uibDropdownService", "$animate", "$uibPosition", "$document", "$compile", "$templateRequest", function (a, b, c, d, e, f, g, h, i, j, k) {
  function l() {
    b.append(o.dropdownMenu);
  }var m,
      n,
      o = this,
      p = a.$new(),
      q = e.appendToOpenClass,
      r = e.openClass,
      s = angular.noop,
      t = c.onToggle ? d(c.onToggle) : angular.noop,
      u = !1,
      v = i.find("body");b.addClass("dropdown"), this.init = function () {
    c.isOpen && (n = d(c.isOpen), s = n.assign, a.$watch(n, function (a) {
      p.isOpen = !!a;
    })), u = angular.isDefined(c.keyboardNav);
  }, this.toggle = function (a) {
    return p.isOpen = arguments.length ? !!a : !p.isOpen, angular.isFunction(s) && s(p, p.isOpen), p.isOpen;
  }, this.isOpen = function () {
    return p.isOpen;
  }, p.getToggleElement = function () {
    return o.toggleElement;
  }, p.getAutoClose = function () {
    return c.autoClose || "always";
  }, p.getElement = function () {
    return b;
  }, p.isKeynavEnabled = function () {
    return u;
  }, p.focusDropdownEntry = function (a) {
    var c = o.dropdownMenu ? angular.element(o.dropdownMenu).find("a") : b.find("ul").eq(0).find("a");switch (a) {case 40:
        angular.isNumber(o.selectedOption) ? o.selectedOption = o.selectedOption === c.length - 1 ? o.selectedOption : o.selectedOption + 1 : o.selectedOption = 0;break;case 38:
        angular.isNumber(o.selectedOption) ? o.selectedOption = 0 === o.selectedOption ? 0 : o.selectedOption - 1 : o.selectedOption = c.length - 1;}c[o.selectedOption].focus();
  }, p.getDropdownElement = function () {
    return o.dropdownMenu;
  }, p.focusToggleElement = function () {
    o.toggleElement && o.toggleElement[0].focus();
  }, p.$watch("isOpen", function (e, n) {
    var u = null,
        w = !1;if (angular.isDefined(c.dropdownAppendTo)) {
      var x = d(c.dropdownAppendTo)(p);x && (u = angular.element(x));
    }if (angular.isDefined(c.dropdownAppendToBody)) {
      var y = d(c.dropdownAppendToBody)(p);y !== !1 && (w = !0);
    }if (w && !u && (u = v), u && o.dropdownMenu && (e ? (u.append(o.dropdownMenu), b.on("$destroy", l)) : (b.off("$destroy", l), l())), u && o.dropdownMenu) {
      var z,
          A,
          B,
          C = h.positionElements(b, o.dropdownMenu, "bottom-left", !0),
          D = 0;if (z = { top: C.top + "px", display: e ? "block" : "none" }, A = o.dropdownMenu.hasClass("dropdown-menu-right"), A ? (z.left = "auto", B = h.scrollbarPadding(u), B.heightOverflow && B.scrollbarWidth && (D = B.scrollbarWidth), z.right = window.innerWidth - D - (C.left + b.prop("offsetWidth")) + "px") : (z.left = C.left + "px", z.right = "auto"), !w) {
        var E = h.offset(u);z.top = C.top - E.top + "px", A ? z.right = window.innerWidth - (C.left - E.left + b.prop("offsetWidth")) + "px" : z.left = C.left - E.left + "px";
      }o.dropdownMenu.css(z);
    }var F = u ? u : b,
        G = u ? q : r,
        H = F.hasClass(G),
        I = f.isOnlyOpen(a, u);if (H === !e) {
      var J;J = u ? I ? "removeClass" : "addClass" : e ? "addClass" : "removeClass", g[J](F, G).then(function () {
        angular.isDefined(e) && e !== n && t(a, { open: !!e });
      });
    }if (e) o.dropdownMenuTemplateUrl ? k(o.dropdownMenuTemplateUrl).then(function (a) {
      m = p.$new(), j(a.trim())(m, function (a) {
        var b = a;o.dropdownMenu.replaceWith(b), o.dropdownMenu = b, i.on("keydown", f.keybindFilter);
      });
    }) : i.on("keydown", f.keybindFilter), p.focusToggleElement(), f.open(p, b, u);else {
      if (f.close(p, b, u), o.dropdownMenuTemplateUrl) {
        m && m.$destroy();var K = angular.element('<ul class="dropdown-menu"></ul>');o.dropdownMenu.replaceWith(K), o.dropdownMenu = K;
      }o.selectedOption = null;
    }angular.isFunction(s) && s(a, e);
  });
}]).directive("uibDropdown", function () {
  return { controller: "UibDropdownController", link: function link(a, b, c, d) {
      d.init();
    } };
}).directive("uibDropdownMenu", function () {
  return { restrict: "A", require: "?^uibDropdown", link: function link(a, b, c, d) {
      if (d && !angular.isDefined(c.dropdownNested)) {
        b.addClass("dropdown-menu");var e = c.templateUrl;e && (d.dropdownMenuTemplateUrl = e), d.dropdownMenu || (d.dropdownMenu = b);
      }
    } };
}).directive("uibDropdownToggle", function () {
  return { require: "?^uibDropdown", link: function link(a, b, c, d) {
      if (d) {
        b.addClass("dropdown-toggle"), d.toggleElement = b;var e = function e(_e) {
          _e.preventDefault(), b.hasClass("disabled") || c.disabled || a.$apply(function () {
            d.toggle();
          });
        };b.on("click", e), b.attr({ "aria-haspopup": !0, "aria-expanded": !1 }), a.$watch(d.isOpen, function (a) {
          b.attr("aria-expanded", !!a);
        }), a.$on("$destroy", function () {
          b.off("click", e);
        });
      }
    } };
}), angular.module("ui.bootstrap.stackedMap", []).factory("$$stackedMap", function () {
  return { createNew: function createNew() {
      var a = [];return { add: function add(b, c) {
          a.push({ key: b, value: c });
        }, get: function get(b) {
          for (var c = 0; c < a.length; c++) {
            if (b === a[c].key) return a[c];
          }
        }, keys: function keys() {
          for (var b = [], c = 0; c < a.length; c++) {
            b.push(a[c].key);
          }return b;
        }, top: function top() {
          return a[a.length - 1];
        }, remove: function remove(b) {
          for (var c = -1, d = 0; d < a.length; d++) {
            if (b === a[d].key) {
              c = d;break;
            }
          }return a.splice(c, 1)[0];
        }, removeTop: function removeTop() {
          return a.pop();
        }, length: function length() {
          return a.length;
        } };
    } };
}), angular.module("ui.bootstrap.modal", ["ui.bootstrap.multiMap", "ui.bootstrap.stackedMap", "ui.bootstrap.position"]).provider("$uibResolve", function () {
  var a = this;this.resolver = null, this.setResolver = function (a) {
    this.resolver = a;
  }, this.$get = ["$injector", "$q", function (b, c) {
    var d = a.resolver ? b.get(a.resolver) : null;return { resolve: function resolve(a, e, f, g) {
        if (d) return d.resolve(a, e, f, g);var h = [];return angular.forEach(a, function (a) {
          angular.isFunction(a) || angular.isArray(a) ? h.push(c.resolve(b.invoke(a))) : angular.isString(a) ? h.push(c.resolve(b.get(a))) : h.push(c.resolve(a));
        }), c.all(h).then(function (b) {
          var c = {},
              d = 0;return angular.forEach(a, function (a, e) {
            c[e] = b[d++];
          }), c;
        });
      } };
  }];
}).directive("uibModalBackdrop", ["$animate", "$injector", "$uibModalStack", function (a, b, c) {
  function d(b, d, e) {
    e.modalInClass && (a.addClass(d, e.modalInClass), b.$on(c.NOW_CLOSING_EVENT, function (c, f) {
      var g = f();b.modalOptions.animation ? a.removeClass(d, e.modalInClass).then(g) : g();
    }));
  }return { restrict: "A", compile: function compile(a, b) {
      return a.addClass(b.backdropClass), d;
    } };
}]).directive("uibModalWindow", ["$uibModalStack", "$q", "$animateCss", "$document", function (a, b, c, d) {
  return { scope: { index: "@" }, restrict: "A", transclude: !0, templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/modal/window.html";
    }, link: function link(e, f, g) {
      f.addClass(g.windowTopClass || ""), e.size = g.size, e.close = function (b) {
        var c = a.getTop();c && c.value.backdrop && "static" !== c.value.backdrop && b.target === b.currentTarget && (b.preventDefault(), b.stopPropagation(), a.dismiss(c.key, "backdrop click"));
      }, f.on("click", e.close), e.$isRendered = !0;var h = b.defer();e.$$postDigest(function () {
        h.resolve();
      }), h.promise.then(function () {
        var h = null;g.modalInClass && (h = c(f, { addClass: g.modalInClass }).start(), e.$on(a.NOW_CLOSING_EVENT, function (a, b) {
          var d = b();c(f, { removeClass: g.modalInClass }).start().then(d);
        })), b.when(h).then(function () {
          var b = a.getTop();if (b && a.modalRendered(b.key), !d[0].activeElement || !f[0].contains(d[0].activeElement)) {
            var c = f[0].querySelector("[autofocus]");c ? c.focus() : f[0].focus();
          }
        });
      });
    } };
}]).directive("uibModalAnimationClass", function () {
  return { compile: function compile(a, b) {
      b.modalAnimation && a.addClass(b.uibModalAnimationClass);
    } };
}).directive("uibModalTransclude", ["$animate", function (a) {
  return { link: function link(b, c, d, e, f) {
      f(b.$parent, function (b) {
        c.empty(), a.enter(b, c);
      });
    } };
}]).factory("$uibModalStack", ["$animate", "$animateCss", "$document", "$compile", "$rootScope", "$q", "$$multiMap", "$$stackedMap", "$uibPosition", function (a, b, c, d, e, f, g, h, i) {
  function j(a) {
    var b = "-";return a.replace(E, function (a, c) {
      return (c ? b : "") + a.toLowerCase();
    });
  }function k(a) {
    return !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length);
  }function l() {
    for (var a = -1, b = x.keys(), c = 0; c < b.length; c++) {
      x.get(b[c]).value.backdrop && (a = c);
    }return a > -1 && A > a && (a = A), a;
  }function m(a, b) {
    var c = x.get(a).value,
        d = c.appendTo;x.remove(a), B = x.top(), B && (A = parseInt(B.value.modalDomEl.attr("index"), 10)), p(c.modalDomEl, c.modalScope, function () {
      var b = c.openedClass || w;y.remove(b, a);var e = y.hasKey(b);d.toggleClass(b, e), !e && v && v.heightOverflow && v.scrollbarWidth && (v.originalRight ? d.css({ paddingRight: v.originalRight + "px" }) : d.css({ paddingRight: "" }), v = null), n(!0);
    }, c.closedDeferred), o(), b && b.focus ? b.focus() : d.focus && d.focus();
  }function n(a) {
    var b;x.length() > 0 && (b = x.top().value, b.modalDomEl.toggleClass(b.windowTopClass || "", a));
  }function o() {
    if (t && -1 === l()) {
      var a = u;p(t, u, function () {
        a = null;
      }), t = void 0, u = void 0;
    }
  }function p(b, c, d, e) {
    function g() {
      g.done || (g.done = !0, a.leave(b).then(function () {
        d && d(), b.remove(), e && e.resolve();
      }), c.$destroy());
    }var h,
        i = null,
        j = function j() {
      return h || (h = f.defer(), i = h.promise), function () {
        h.resolve();
      };
    };return c.$broadcast(z.NOW_CLOSING_EVENT, j), f.when(i).then(g);
  }function q(a) {
    if (a.isDefaultPrevented()) return a;var b = x.top();if (b) switch (a.which) {case 27:
        b.value.keyboard && (a.preventDefault(), e.$apply(function () {
          z.dismiss(b.key, "escape key press");
        }));break;case 9:
        var c = z.loadFocusElementList(b),
            d = !1;a.shiftKey ? (z.isFocusInFirstItem(a, c) || z.isModalFocused(a, b)) && (d = z.focusLastFocusableElement(c)) : z.isFocusInLastItem(a, c) && (d = z.focusFirstFocusableElement(c)), d && (a.preventDefault(), a.stopPropagation());}
  }function r(a, b, c) {
    return !a.value.modalScope.$broadcast("modal.closing", b, c).defaultPrevented;
  }function s() {
    Array.prototype.forEach.call(document.querySelectorAll("[" + C + "]"), function (a) {
      var b = parseInt(a.getAttribute(C), 10),
          c = b - 1;a.setAttribute(C, c), c || (a.removeAttribute(C), a.removeAttribute("aria-hidden"));
    });
  }var t,
      u,
      v,
      w = "modal-open",
      x = h.createNew(),
      y = g.createNew(),
      z = { NOW_CLOSING_EVENT: "modal.stack.now-closing" },
      A = 0,
      B = null,
      C = "data-bootstrap-modal-aria-hidden-count",
      D = "a[href], area[href], input:not([disabled]):not([tabindex='-1']), button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']), textarea:not([disabled]):not([tabindex='-1']), iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true]",
      E = /[A-Z]/g;return e.$watch(l, function (a) {
    u && (u.index = a);
  }), c.on("keydown", q), e.$on("$destroy", function () {
    c.off("keydown", q);
  }), z.open = function (b, f) {
    function g(a) {
      function b(a) {
        var b = a.parent() ? a.parent().children() : [];return Array.prototype.filter.call(b, function (b) {
          return b !== a[0];
        });
      }if (a && "BODY" !== a[0].tagName) return b(a).forEach(function (a) {
        var b = "true" === a.getAttribute("aria-hidden"),
            c = parseInt(a.getAttribute(C), 10);c || (c = b ? 1 : 0), a.setAttribute(C, c + 1), a.setAttribute("aria-hidden", "true");
      }), g(a.parent());
    }var h = c[0].activeElement,
        k = f.openedClass || w;n(!1), B = x.top(), x.add(b, { deferred: f.deferred, renderDeferred: f.renderDeferred, closedDeferred: f.closedDeferred, modalScope: f.scope, backdrop: f.backdrop, keyboard: f.keyboard, openedClass: f.openedClass, windowTopClass: f.windowTopClass, animation: f.animation, appendTo: f.appendTo }), y.put(k, b);var m = f.appendTo,
        o = l();o >= 0 && !t && (u = e.$new(!0), u.modalOptions = f, u.index = o, t = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>'), t.attr({ "class": "modal-backdrop", "ng-style": "{'z-index': 1040 + (index && 1 || 0) + index*10}", "uib-modal-animation-class": "fade", "modal-in-class": "in" }), f.backdropClass && t.addClass(f.backdropClass), f.animation && t.attr("modal-animation", "true"), d(t)(u), a.enter(t, m), i.isScrollable(m) && (v = i.scrollbarPadding(m), v.heightOverflow && v.scrollbarWidth && m.css({ paddingRight: v.right + "px" })));var p;f.component ? (p = document.createElement(j(f.component.name)), p = angular.element(p), p.attr({ resolve: "$resolve", "modal-instance": "$uibModalInstance", close: "$close($value)", dismiss: "$dismiss($value)" })) : p = f.content, A = B ? parseInt(B.value.modalDomEl.attr("index"), 10) + 1 : 0;var q = angular.element('<div uib-modal-window="modal-window"></div>');q.attr({ "class": "modal", "template-url": f.windowTemplateUrl, "window-top-class": f.windowTopClass, role: "dialog", "aria-labelledby": f.ariaLabelledBy, "aria-describedby": f.ariaDescribedBy, size: f.size, index: A, animate: "animate", "ng-style": "{'z-index': 1050 + $$topModalIndex*10, display: 'block'}", tabindex: -1, "uib-modal-animation-class": "fade", "modal-in-class": "in" }).append(p), f.windowClass && q.addClass(f.windowClass), f.animation && q.attr("modal-animation", "true"), m.addClass(k), f.scope && (f.scope.$$topModalIndex = A), a.enter(d(q)(f.scope), m), x.top().value.modalDomEl = q, x.top().value.modalOpener = h, g(q);
  }, z.close = function (a, b) {
    var c = x.get(a);return s(), c && r(c, b, !0) ? (c.value.modalScope.$$uibDestructionScheduled = !0, c.value.deferred.resolve(b), m(a, c.value.modalOpener), !0) : !c;
  }, z.dismiss = function (a, b) {
    var c = x.get(a);return s(), c && r(c, b, !1) ? (c.value.modalScope.$$uibDestructionScheduled = !0, c.value.deferred.reject(b), m(a, c.value.modalOpener), !0) : !c;
  }, z.dismissAll = function (a) {
    for (var b = this.getTop(); b && this.dismiss(b.key, a);) {
      b = this.getTop();
    }
  }, z.getTop = function () {
    return x.top();
  }, z.modalRendered = function (a) {
    var b = x.get(a);b && b.value.renderDeferred.resolve();
  }, z.focusFirstFocusableElement = function (a) {
    return a.length > 0 ? (a[0].focus(), !0) : !1;
  }, z.focusLastFocusableElement = function (a) {
    return a.length > 0 ? (a[a.length - 1].focus(), !0) : !1;
  }, z.isModalFocused = function (a, b) {
    if (a && b) {
      var c = b.value.modalDomEl;if (c && c.length) return (a.target || a.srcElement) === c[0];
    }return !1;
  }, z.isFocusInFirstItem = function (a, b) {
    return b.length > 0 ? (a.target || a.srcElement) === b[0] : !1;
  }, z.isFocusInLastItem = function (a, b) {
    return b.length > 0 ? (a.target || a.srcElement) === b[b.length - 1] : !1;
  }, z.loadFocusElementList = function (a) {
    if (a) {
      var b = a.value.modalDomEl;if (b && b.length) {
        var c = b[0].querySelectorAll(D);return c ? Array.prototype.filter.call(c, function (a) {
          return k(a);
        }) : c;
      }
    }
  }, z;
}]).provider("$uibModal", function () {
  var a = { options: { animation: !0, backdrop: !0, keyboard: !0 }, $get: ["$rootScope", "$q", "$document", "$templateRequest", "$controller", "$uibResolve", "$uibModalStack", function (b, c, d, e, f, g, h) {
      function i(a) {
        return a.template ? c.when(a.template) : e(angular.isFunction(a.templateUrl) ? a.templateUrl() : a.templateUrl);
      }var j = {},
          k = null;return j.getPromiseChain = function () {
        return k;
      }, j.open = function (e) {
        function j() {
          return q;
        }var l = c.defer(),
            m = c.defer(),
            n = c.defer(),
            o = c.defer(),
            p = { result: l.promise, opened: m.promise, closed: n.promise, rendered: o.promise, close: function close(a) {
            return h.close(p, a);
          }, dismiss: function dismiss(a) {
            return h.dismiss(p, a);
          } };if (e = angular.extend({}, a.options, e), e.resolve = e.resolve || {}, e.appendTo = e.appendTo || d.find("body").eq(0), !e.appendTo.length) throw new Error("appendTo element not found. Make sure that the element passed is in DOM.");if (!e.component && !e.template && !e.templateUrl) throw new Error("One of component or template or templateUrl options is required.");var q;q = e.component ? c.when(g.resolve(e.resolve, {}, null, null)) : c.all([i(e), g.resolve(e.resolve, {}, null, null)]);var r;return r = k = c.all([k]).then(j, j).then(function (a) {
          function c(b, c, d, e) {
            b.$scope = g, b.$scope.$resolve = {}, d ? b.$scope.$uibModalInstance = p : b.$uibModalInstance = p;var f = c ? a[1] : a;angular.forEach(f, function (a, c) {
              e && (b[c] = a), b.$scope.$resolve[c] = a;
            });
          }var d = e.scope || b,
              g = d.$new();g.$close = p.close, g.$dismiss = p.dismiss, g.$on("$destroy", function () {
            g.$$uibDestructionScheduled || g.$dismiss("$uibUnscheduledDestruction");
          });var i,
              j,
              k = { scope: g, deferred: l, renderDeferred: o, closedDeferred: n, animation: e.animation, backdrop: e.backdrop, keyboard: e.keyboard, backdropClass: e.backdropClass, windowTopClass: e.windowTopClass, windowClass: e.windowClass, windowTemplateUrl: e.windowTemplateUrl, ariaLabelledBy: e.ariaLabelledBy, ariaDescribedBy: e.ariaDescribedBy, size: e.size, openedClass: e.openedClass, appendTo: e.appendTo },
              q = {},
              r = {};e.component ? (c(q, !1, !0, !1), q.name = e.component, k.component = q) : e.controller && (c(r, !0, !1, !0), j = f(e.controller, r, !0, e.controllerAs), e.controllerAs && e.bindToController && (i = j.instance, i.$close = g.$close, i.$dismiss = g.$dismiss, angular.extend(i, { $resolve: r.$scope.$resolve }, d)), i = j(), angular.isFunction(i.$onInit) && i.$onInit()), e.component || (k.content = a[0]), h.open(p, k), m.resolve(!0);
        }, function (a) {
          m.reject(a), l.reject(a);
        })["finally"](function () {
          k === r && (k = null);
        }), p;
      }, j;
    }] };return a;
}), angular.module("ui.bootstrap.paging", []).factory("uibPaging", ["$parse", function (a) {
  return { create: function create(b, c, d) {
      b.setNumPages = d.numPages ? a(d.numPages).assign : angular.noop, b.ngModelCtrl = { $setViewValue: angular.noop }, b._watchers = [], b.init = function (a, e) {
        b.ngModelCtrl = a, b.config = e, a.$render = function () {
          b.render();
        }, d.itemsPerPage ? b._watchers.push(c.$parent.$watch(d.itemsPerPage, function (a) {
          b.itemsPerPage = parseInt(a, 10), c.totalPages = b.calculateTotalPages(), b.updatePage();
        })) : b.itemsPerPage = e.itemsPerPage, c.$watch("totalItems", function (a, d) {
          (angular.isDefined(a) || a !== d) && (c.totalPages = b.calculateTotalPages(), b.updatePage());
        });
      }, b.calculateTotalPages = function () {
        var a = b.itemsPerPage < 1 ? 1 : Math.ceil(c.totalItems / b.itemsPerPage);return Math.max(a || 0, 1);
      }, b.render = function () {
        c.page = parseInt(b.ngModelCtrl.$viewValue, 10) || 1;
      }, c.selectPage = function (a, d) {
        d && d.preventDefault();var e = !c.ngDisabled || !d;e && c.page !== a && a > 0 && a <= c.totalPages && (d && d.target && d.target.blur(), b.ngModelCtrl.$setViewValue(a), b.ngModelCtrl.$render());
      }, c.getText = function (a) {
        return c[a + "Text"] || b.config[a + "Text"];
      }, c.noPrevious = function () {
        return 1 === c.page;
      }, c.noNext = function () {
        return c.page === c.totalPages;
      }, b.updatePage = function () {
        b.setNumPages(c.$parent, c.totalPages), c.page > c.totalPages ? c.selectPage(c.totalPages) : b.ngModelCtrl.$render();
      }, c.$on("$destroy", function () {
        for (; b._watchers.length;) {
          b._watchers.shift()();
        }
      });
    } };
}]), angular.module("ui.bootstrap.pager", ["ui.bootstrap.paging", "ui.bootstrap.tabindex"]).controller("UibPagerController", ["$scope", "$attrs", "uibPaging", "uibPagerConfig", function (a, b, c, d) {
  a.align = angular.isDefined(b.align) ? a.$parent.$eval(b.align) : d.align, c.create(this, a, b);
}]).constant("uibPagerConfig", { itemsPerPage: 10, previousText: "« Previous", nextText: "Next »", align: !0 }).directive("uibPager", ["uibPagerConfig", function (a) {
  return { scope: { totalItems: "=", previousText: "@", nextText: "@", ngDisabled: "=" }, require: ["uibPager", "?ngModel"], restrict: "A", controller: "UibPagerController", controllerAs: "pager", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/pager/pager.html";
    }, link: function link(b, c, d, e) {
      c.addClass("pager");var f = e[0],
          g = e[1];g && f.init(g, a);
    } };
}]), angular.module("ui.bootstrap.pagination", ["ui.bootstrap.paging", "ui.bootstrap.tabindex"]).controller("UibPaginationController", ["$scope", "$attrs", "$parse", "uibPaging", "uibPaginationConfig", function (a, b, c, d, e) {
  function f(a, b, c) {
    return { number: a, text: b, active: c };
  }function g(a, b) {
    var c = [],
        d = 1,
        e = b,
        g = angular.isDefined(i) && b > i;g && (j ? (d = Math.max(a - Math.floor(i / 2), 1), e = d + i - 1, e > b && (e = b, d = e - i + 1)) : (d = (Math.ceil(a / i) - 1) * i + 1, e = Math.min(d + i - 1, b)));for (var h = d; e >= h; h++) {
      var n = f(h, m(h), h === a);c.push(n);
    }if (g && i > 0 && (!j || k || l)) {
      if (d > 1) {
        if (!l || d > 3) {
          var o = f(d - 1, "...", !1);c.unshift(o);
        }if (l) {
          if (3 === d) {
            var p = f(2, "2", !1);c.unshift(p);
          }var q = f(1, "1", !1);c.unshift(q);
        }
      }if (b > e) {
        if (!l || b - 2 > e) {
          var r = f(e + 1, "...", !1);c.push(r);
        }if (l) {
          if (e === b - 2) {
            var s = f(b - 1, b - 1, !1);c.push(s);
          }var t = f(b, b, !1);c.push(t);
        }
      }
    }return c;
  }var h = this,
      i = angular.isDefined(b.maxSize) ? a.$parent.$eval(b.maxSize) : e.maxSize,
      j = angular.isDefined(b.rotate) ? a.$parent.$eval(b.rotate) : e.rotate,
      k = angular.isDefined(b.forceEllipses) ? a.$parent.$eval(b.forceEllipses) : e.forceEllipses,
      l = angular.isDefined(b.boundaryLinkNumbers) ? a.$parent.$eval(b.boundaryLinkNumbers) : e.boundaryLinkNumbers,
      m = angular.isDefined(b.pageLabel) ? function (c) {
    return a.$parent.$eval(b.pageLabel, { $page: c });
  } : angular.identity;a.boundaryLinks = angular.isDefined(b.boundaryLinks) ? a.$parent.$eval(b.boundaryLinks) : e.boundaryLinks, a.directionLinks = angular.isDefined(b.directionLinks) ? a.$parent.$eval(b.directionLinks) : e.directionLinks, b.$set("role", "menu"), d.create(this, a, b), b.maxSize && h._watchers.push(a.$parent.$watch(c(b.maxSize), function (a) {
    i = parseInt(a, 10), h.render();
  }));var n = this.render;this.render = function () {
    n(), a.page > 0 && a.page <= a.totalPages && (a.pages = g(a.page, a.totalPages));
  };
}]).constant("uibPaginationConfig", { itemsPerPage: 10, boundaryLinks: !1, boundaryLinkNumbers: !1, directionLinks: !0, firstText: "First", previousText: "Previous", nextText: "Next", lastText: "Last", rotate: !0, forceEllipses: !1 }).directive("uibPagination", ["$parse", "uibPaginationConfig", function (a, b) {
  return { scope: { totalItems: "=", firstText: "@", previousText: "@", nextText: "@", lastText: "@", ngDisabled: "=" }, require: ["uibPagination", "?ngModel"], restrict: "A", controller: "UibPaginationController", controllerAs: "pagination", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/pagination/pagination.html";
    }, link: function link(a, c, d, e) {
      c.addClass("pagination");var f = e[0],
          g = e[1];g && f.init(g, b);
    } };
}]), angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.stackedMap"]).provider("$uibTooltip", function () {
  function a(a) {
    var b = /[A-Z]/g,
        c = "-";return a.replace(b, function (a, b) {
      return (b ? c : "") + a.toLowerCase();
    });
  }var b = { placement: "top", placementClassPrefix: "", animation: !0, popupDelay: 0, popupCloseDelay: 0, useContentExp: !1 },
      c = { mouseenter: "mouseleave", click: "click", outsideClick: "outsideClick", focus: "blur", none: "" },
      d = {};this.options = function (a) {
    angular.extend(d, a);
  }, this.setTriggers = function (a) {
    angular.extend(c, a);
  }, this.$get = ["$window", "$compile", "$timeout", "$document", "$uibPosition", "$interpolate", "$rootScope", "$parse", "$$stackedMap", function (e, f, g, h, i, j, k, l, m) {
    function n(a) {
      if (27 === a.which) {
        var b = o.top();b && (b.value.close(), b = null);
      }
    }var o = m.createNew();return h.on("keyup", n), k.$on("$destroy", function () {
      h.off("keyup", n);
    }), function (e, k, m, n) {
      function p(a) {
        var b = (a || n.trigger || m).split(" "),
            d = b.map(function (a) {
          return c[a] || a;
        });return { show: b, hide: d };
      }n = angular.extend({}, b, d, n);var q = a(e),
          r = j.startSymbol(),
          s = j.endSymbol(),
          t = "<div " + q + '-popup uib-title="' + r + "title" + s + '" ' + (n.useContentExp ? 'content-exp="contentExp()" ' : 'content="' + r + "content" + s + '" ') + 'origin-scope="origScope" class="uib-position-measure ' + k + '" tooltip-animation-class="fade"uib-tooltip-classes ng-class="{ in: isOpen }" ></div>';return { compile: function compile(a, b) {
          var c = f(t);return function (a, b, d, f) {
            function j() {
              P.isOpen ? q() : m();
            }function m() {
              O && !a.$eval(d[k + "Enable"]) || (u(), x(), P.popupDelay ? H || (H = g(r, P.popupDelay, !1)) : r());
            }function q() {
              s(), P.popupCloseDelay ? I || (I = g(t, P.popupCloseDelay, !1)) : t();
            }function r() {
              return s(), u(), P.content ? (v(), void P.$evalAsync(function () {
                P.isOpen = !0, y(!0), U();
              })) : angular.noop;
            }function s() {
              H && (g.cancel(H), H = null), J && (g.cancel(J), J = null);
            }function t() {
              P && P.$evalAsync(function () {
                P && (P.isOpen = !1, y(!1), P.animation ? G || (G = g(w, 150, !1)) : w());
              });
            }function u() {
              I && (g.cancel(I), I = null), G && (g.cancel(G), G = null);
            }function v() {
              E || (F = P.$new(), E = c(F, function (a) {
                M ? h.find("body").append(a) : b.after(a);
              }), o.add(P, { close: t }), z());
            }function w() {
              s(), u(), A(), E && (E.remove(), E = null, K && g.cancel(K)), o.remove(P), F && (F.$destroy(), F = null);
            }function x() {
              P.title = d[k + "Title"], S ? P.content = S(a) : P.content = d[e], P.popupClass = d[k + "Class"], P.placement = angular.isDefined(d[k + "Placement"]) ? d[k + "Placement"] : n.placement;var b = i.parsePlacement(P.placement);L = b[1] ? b[0] + "-" + b[1] : b[0];var c = parseInt(d[k + "PopupDelay"], 10),
                  f = parseInt(d[k + "PopupCloseDelay"], 10);P.popupDelay = isNaN(c) ? n.popupDelay : c, P.popupCloseDelay = isNaN(f) ? n.popupCloseDelay : f;
            }function y(b) {
              R && angular.isFunction(R.assign) && R.assign(a, b);
            }function z() {
              T.length = 0, S ? (T.push(a.$watch(S, function (a) {
                P.content = a, !a && P.isOpen && t();
              })), T.push(F.$watch(function () {
                Q || (Q = !0, F.$$postDigest(function () {
                  Q = !1, P && P.isOpen && U();
                }));
              }))) : T.push(d.$observe(e, function (a) {
                P.content = a, !a && P.isOpen ? t() : U();
              })), T.push(d.$observe(k + "Title", function (a) {
                P.title = a, P.isOpen && U();
              })), T.push(d.$observe(k + "Placement", function (a) {
                P.placement = a ? a : n.placement, P.isOpen && U();
              }));
            }function A() {
              T.length && (angular.forEach(T, function (a) {
                a();
              }), T.length = 0);
            }function B(a) {
              P && P.isOpen && E && (b[0].contains(a.target) || E[0].contains(a.target) || q());
            }function C(a) {
              27 === a.which && q();
            }function D() {
              var c = [],
                  e = [],
                  f = a.$eval(d[k + "Trigger"]);V(), angular.isObject(f) ? (Object.keys(f).forEach(function (a) {
                c.push(a), e.push(f[a]);
              }), N = { show: c, hide: e }) : N = p(f), "none" !== N.show && N.show.forEach(function (a, c) {
                "outsideClick" === a ? (b.on("click", j), h.on("click", B)) : a === N.hide[c] ? b.on(a, j) : a && (b.on(a, m), b.on(N.hide[c], q)), b.on("keypress", C);
              });
            }var E,
                F,
                G,
                H,
                I,
                J,
                K,
                L,
                M = angular.isDefined(n.appendToBody) ? n.appendToBody : !1,
                N = p(void 0),
                O = angular.isDefined(d[k + "Enable"]),
                P = a.$new(!0),
                Q = !1,
                R = angular.isDefined(d[k + "IsOpen"]) ? l(d[k + "IsOpen"]) : !1,
                S = n.useContentExp ? l(d[e]) : !1,
                T = [],
                U = function U() {
              E && E.html() && (J || (J = g(function () {
                var a = i.positionElements(b, E, P.placement, M),
                    c = angular.isDefined(E.offsetHeight) ? E.offsetHeight : E.prop("offsetHeight"),
                    d = M ? i.offset(b) : i.position(b);E.css({ top: a.top + "px", left: a.left + "px" });var e = a.placement.split("-");E.hasClass(e[0]) || (E.removeClass(L.split("-")[0]), E.addClass(e[0])), E.hasClass(n.placementClassPrefix + a.placement) || (E.removeClass(n.placementClassPrefix + L), E.addClass(n.placementClassPrefix + a.placement)), K = g(function () {
                  var a = angular.isDefined(E.offsetHeight) ? E.offsetHeight : E.prop("offsetHeight"),
                      b = i.adjustTop(e, d, c, a);b && E.css(b), K = null;
                }, 0, !1), E.hasClass("uib-position-measure") ? (i.positionArrow(E, a.placement), E.removeClass("uib-position-measure")) : L !== a.placement && i.positionArrow(E, a.placement), L = a.placement, J = null;
              }, 0, !1)));
            };P.origScope = a, P.isOpen = !1, P.contentExp = function () {
              return P.content;
            }, d.$observe("disabled", function (a) {
              a && s(), a && P.isOpen && t();
            }), R && a.$watch(R, function (a) {
              P && !a === P.isOpen && j();
            });var V = function V() {
              N.show.forEach(function (a) {
                "outsideClick" === a ? b.off("click", j) : (b.off(a, m), b.off(a, j)), b.off("keypress", C);
              }), N.hide.forEach(function (a) {
                "outsideClick" === a ? h.off("click", B) : b.off(a, q);
              });
            };D();var W = a.$eval(d[k + "Animation"]);P.animation = angular.isDefined(W) ? !!W : n.animation;var X,
                Y = k + "AppendToBody";X = Y in d && void 0 === d[Y] ? !0 : a.$eval(d[Y]), M = angular.isDefined(X) ? X : M, a.$on("$destroy", function () {
              V(), w(), P = null;
            });
          };
        } };
    };
  }];
}).directive("uibTooltipTemplateTransclude", ["$animate", "$sce", "$compile", "$templateRequest", function (a, b, c, d) {
  return { link: function link(e, f, g) {
      var h,
          i,
          j,
          k = e.$eval(g.tooltipTemplateTranscludeScope),
          l = 0,
          m = function m() {
        i && (i.remove(), i = null), h && (h.$destroy(), h = null), j && (a.leave(j).then(function () {
          i = null;
        }), i = j, j = null);
      };e.$watch(b.parseAsResourceUrl(g.uibTooltipTemplateTransclude), function (b) {
        var g = ++l;b ? (d(b, !0).then(function (d) {
          if (g === l) {
            var e = k.$new(),
                i = d,
                n = c(i)(e, function (b) {
              m(), a.enter(b, f);
            });h = e, j = n, h.$emit("$includeContentLoaded", b);
          }
        }, function () {
          g === l && (m(), e.$emit("$includeContentError", b));
        }), e.$emit("$includeContentRequested", b)) : m();
      }), e.$on("$destroy", m);
    } };
}]).directive("uibTooltipClasses", ["$uibPosition", function (a) {
  return { restrict: "A", link: function link(b, c, d) {
      if (b.placement) {
        var e = a.parsePlacement(b.placement);c.addClass(e[0]);
      }b.popupClass && c.addClass(b.popupClass), b.animation && c.addClass(d.tooltipAnimationClass);
    } };
}]).directive("uibTooltipPopup", function () {
  return { restrict: "A", scope: { content: "@" }, templateUrl: "uib/template/tooltip/tooltip-popup.html" };
}).directive("uibTooltip", ["$uibTooltip", function (a) {
  return a("uibTooltip", "tooltip", "mouseenter");
}]).directive("uibTooltipTemplatePopup", function () {
  return { restrict: "A", scope: { contentExp: "&", originScope: "&" }, templateUrl: "uib/template/tooltip/tooltip-template-popup.html" };
}).directive("uibTooltipTemplate", ["$uibTooltip", function (a) {
  return a("uibTooltipTemplate", "tooltip", "mouseenter", { useContentExp: !0 });
}]).directive("uibTooltipHtmlPopup", function () {
  return { restrict: "A", scope: { contentExp: "&" }, templateUrl: "uib/template/tooltip/tooltip-html-popup.html" };
}).directive("uibTooltipHtml", ["$uibTooltip", function (a) {
  return a("uibTooltipHtml", "tooltip", "mouseenter", { useContentExp: !0 });
}]), angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"]).directive("uibPopoverTemplatePopup", function () {
  return { restrict: "A", scope: { uibTitle: "@", contentExp: "&", originScope: "&" }, templateUrl: "uib/template/popover/popover-template.html" };
}).directive("uibPopoverTemplate", ["$uibTooltip", function (a) {
  return a("uibPopoverTemplate", "popover", "click", { useContentExp: !0 });
}]).directive("uibPopoverHtmlPopup", function () {
  return { restrict: "A", scope: { contentExp: "&", uibTitle: "@" }, templateUrl: "uib/template/popover/popover-html.html" };
}).directive("uibPopoverHtml", ["$uibTooltip", function (a) {
  return a("uibPopoverHtml", "popover", "click", { useContentExp: !0 });
}]).directive("uibPopoverPopup", function () {
  return { restrict: "A", scope: { uibTitle: "@", content: "@" }, templateUrl: "uib/template/popover/popover.html" };
}).directive("uibPopover", ["$uibTooltip", function (a) {
  return a("uibPopover", "popover", "click");
}]), angular.module("ui.bootstrap.progressbar", []).constant("uibProgressConfig", { animate: !0, max: 100 }).controller("UibProgressController", ["$scope", "$attrs", "uibProgressConfig", function (a, b, c) {
  function d() {
    return angular.isDefined(a.maxParam) ? a.maxParam : c.max;
  }var e = this,
      f = angular.isDefined(b.animate) ? a.$parent.$eval(b.animate) : c.animate;this.bars = [], a.max = d(), this.addBar = function (a, b, c) {
    f || b.css({ transition: "none" }), this.bars.push(a), a.max = d(), a.title = c && angular.isDefined(c.title) ? c.title : "progressbar", a.$watch("value", function (b) {
      a.recalculatePercentage();
    }), a.recalculatePercentage = function () {
      var b = e.bars.reduce(function (a, b) {
        return b.percent = +(100 * b.value / b.max).toFixed(2), a + b.percent;
      }, 0);b > 100 && (a.percent -= b - 100);
    }, a.$on("$destroy", function () {
      b = null, e.removeBar(a);
    });
  }, this.removeBar = function (a) {
    this.bars.splice(this.bars.indexOf(a), 1), this.bars.forEach(function (a) {
      a.recalculatePercentage();
    });
  }, a.$watch("maxParam", function (a) {
    e.bars.forEach(function (a) {
      a.max = d(), a.recalculatePercentage();
    });
  });
}]).directive("uibProgress", function () {
  return { replace: !0, transclude: !0, controller: "UibProgressController", require: "uibProgress", scope: { maxParam: "=?max" }, templateUrl: "uib/template/progressbar/progress.html" };
}).directive("uibBar", function () {
  return { replace: !0, transclude: !0, require: "^uibProgress", scope: { value: "=", type: "@" }, templateUrl: "uib/template/progressbar/bar.html", link: function link(a, b, c, d) {
      d.addBar(a, b, c);
    } };
}).directive("uibProgressbar", function () {
  return { replace: !0, transclude: !0, controller: "UibProgressController", scope: { value: "=", maxParam: "=?max", type: "@" }, templateUrl: "uib/template/progressbar/progressbar.html", link: function link(a, b, c, d) {
      d.addBar(a, angular.element(b.children()[0]), { title: c.title });
    } };
}), angular.module("ui.bootstrap.rating", []).constant("uibRatingConfig", { max: 5, stateOn: null, stateOff: null, enableReset: !0, titles: ["one", "two", "three", "four", "five"] }).controller("UibRatingController", ["$scope", "$attrs", "uibRatingConfig", function (a, b, c) {
  var d = { $setViewValue: angular.noop },
      e = this;this.init = function (e) {
    d = e, d.$render = this.render, d.$formatters.push(function (a) {
      return angular.isNumber(a) && a << 0 !== a && (a = Math.round(a)), a;
    }), this.stateOn = angular.isDefined(b.stateOn) ? a.$parent.$eval(b.stateOn) : c.stateOn, this.stateOff = angular.isDefined(b.stateOff) ? a.$parent.$eval(b.stateOff) : c.stateOff, this.enableReset = angular.isDefined(b.enableReset) ? a.$parent.$eval(b.enableReset) : c.enableReset;var f = angular.isDefined(b.titles) ? a.$parent.$eval(b.titles) : c.titles;this.titles = angular.isArray(f) && f.length > 0 ? f : c.titles;var g = angular.isDefined(b.ratingStates) ? a.$parent.$eval(b.ratingStates) : new Array(angular.isDefined(b.max) ? a.$parent.$eval(b.max) : c.max);a.range = this.buildTemplateObjects(g);
  }, this.buildTemplateObjects = function (a) {
    for (var b = 0, c = a.length; c > b; b++) {
      a[b] = angular.extend({ index: b }, { stateOn: this.stateOn, stateOff: this.stateOff, title: this.getTitle(b) }, a[b]);
    }return a;
  }, this.getTitle = function (a) {
    return a >= this.titles.length ? a + 1 : this.titles[a];
  }, a.rate = function (b) {
    if (!a.readonly && b >= 0 && b <= a.range.length) {
      var c = e.enableReset && d.$viewValue === b ? 0 : b;d.$setViewValue(c), d.$render();
    }
  }, a.enter = function (b) {
    a.readonly || (a.value = b), a.onHover({ value: b });
  }, a.reset = function () {
    a.value = d.$viewValue, a.onLeave();
  }, a.onKeydown = function (b) {
    /(37|38|39|40)/.test(b.which) && (b.preventDefault(), b.stopPropagation(), a.rate(a.value + (38 === b.which || 39 === b.which ? 1 : -1)));
  }, this.render = function () {
    a.value = d.$viewValue, a.title = e.getTitle(a.value - 1);
  };
}]).directive("uibRating", function () {
  return { require: ["uibRating", "ngModel"], restrict: "A", scope: { readonly: "=?readOnly", onHover: "&", onLeave: "&" }, controller: "UibRatingController", templateUrl: "uib/template/rating/rating.html", link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];e.init(f);
    } };
}), angular.module("ui.bootstrap.tabs", []).controller("UibTabsetController", ["$scope", function (a) {
  function b(a) {
    for (var b = 0; b < d.tabs.length; b++) {
      if (d.tabs[b].index === a) return b;
    }
  }var c,
      d = this;d.tabs = [], d.select = function (a, f) {
    if (!e) {
      var g = b(c),
          h = d.tabs[g];if (h) {
        if (h.tab.onDeselect({ $event: f, $selectedIndex: a }), f && f.isDefaultPrevented()) return;h.tab.active = !1;
      }var i = d.tabs[a];i ? (i.tab.onSelect({ $event: f }), i.tab.active = !0, d.active = i.index, c = i.index) : !i && angular.isDefined(c) && (d.active = null, c = null);
    }
  }, d.addTab = function (a) {
    if (d.tabs.push({ tab: a, index: a.index }), d.tabs.sort(function (a, b) {
      return a.index > b.index ? 1 : a.index < b.index ? -1 : 0;
    }), a.index === d.active || !angular.isDefined(d.active) && 1 === d.tabs.length) {
      var c = b(a.index);d.select(c);
    }
  }, d.removeTab = function (a) {
    for (var b, c = 0; c < d.tabs.length; c++) {
      if (d.tabs[c].tab === a) {
        b = c;break;
      }
    }if (d.tabs[b].index === d.active) {
      var e = b === d.tabs.length - 1 ? b - 1 : b + 1 % d.tabs.length;d.select(e);
    }d.tabs.splice(b, 1);
  }, a.$watch("tabset.active", function (a) {
    angular.isDefined(a) && a !== c && d.select(b(a));
  });var e;a.$on("$destroy", function () {
    e = !0;
  });
}]).directive("uibTabset", function () {
  return { transclude: !0, replace: !0, scope: {}, bindToController: { active: "=?", type: "@" }, controller: "UibTabsetController", controllerAs: "tabset", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/tabs/tabset.html";
    }, link: function link(a, b, c) {
      a.vertical = angular.isDefined(c.vertical) ? a.$parent.$eval(c.vertical) : !1, a.justified = angular.isDefined(c.justified) ? a.$parent.$eval(c.justified) : !1;
    } };
}).directive("uibTab", ["$parse", function (a) {
  return { require: "^uibTabset", replace: !0, templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/tabs/tab.html";
    }, transclude: !0, scope: { heading: "@", index: "=?", classes: "@?", onSelect: "&select", onDeselect: "&deselect" }, controller: function controller() {}, controllerAs: "tab", link: function link(b, c, d, e, f) {
      b.disabled = !1, d.disable && b.$parent.$watch(a(d.disable), function (a) {
        b.disabled = !!a;
      }), angular.isUndefined(d.index) && (e.tabs && e.tabs.length ? b.index = Math.max.apply(null, e.tabs.map(function (a) {
        return a.index;
      })) + 1 : b.index = 0), angular.isUndefined(d.classes) && (b.classes = ""), b.select = function (a) {
        if (!b.disabled) {
          for (var c, d = 0; d < e.tabs.length; d++) {
            if (e.tabs[d].tab === b) {
              c = d;break;
            }
          }e.select(c, a);
        }
      }, e.addTab(b), b.$on("$destroy", function () {
        e.removeTab(b);
      }), b.$transcludeFn = f;
    } };
}]).directive("uibTabHeadingTransclude", function () {
  return { restrict: "A", require: "^uibTab", link: function link(a, b) {
      a.$watch("headingElement", function (a) {
        a && (b.html(""), b.append(a));
      });
    } };
}).directive("uibTabContentTransclude", function () {
  function a(a) {
    return a.tagName && (a.hasAttribute("uib-tab-heading") || a.hasAttribute("data-uib-tab-heading") || a.hasAttribute("x-uib-tab-heading") || "uib-tab-heading" === a.tagName.toLowerCase() || "data-uib-tab-heading" === a.tagName.toLowerCase() || "x-uib-tab-heading" === a.tagName.toLowerCase() || "uib:tab-heading" === a.tagName.toLowerCase());
  }return { restrict: "A", require: "^uibTabset", link: function link(b, c, d) {
      var e = b.$eval(d.uibTabContentTransclude).tab;e.$transcludeFn(e.$parent, function (b) {
        angular.forEach(b, function (b) {
          a(b) ? e.headingElement = b : c.append(b);
        });
      });
    } };
}), angular.module("ui.bootstrap.timepicker", []).constant("uibTimepickerConfig", { hourStep: 1, minuteStep: 1, secondStep: 1, showMeridian: !0, showSeconds: !1, meridians: null, readonlyInput: !1, mousewheel: !0, arrowkeys: !0, showSpinners: !0, templateUrl: "uib/template/timepicker/timepicker.html" }).controller("UibTimepickerController", ["$scope", "$element", "$attrs", "$parse", "$log", "$locale", "uibTimepickerConfig", function (a, b, c, d, e, f, g) {
  function h() {
    var b = +a.hours,
        c = a.showMeridian ? b > 0 && 13 > b : b >= 0 && 24 > b;return c && "" !== a.hours ? (a.showMeridian && (12 === b && (b = 0), a.meridian === y[1] && (b += 12)), b) : void 0;
  }function i() {
    var b = +a.minutes,
        c = b >= 0 && 60 > b;return c && "" !== a.minutes ? b : void 0;
  }function j() {
    var b = +a.seconds;return b >= 0 && 60 > b ? b : void 0;
  }function k(a, b) {
    return null === a ? "" : angular.isDefined(a) && a.toString().length < 2 && !b ? "0" + a : a.toString();
  }function l(a) {
    m(), x.$setViewValue(new Date(v)), n(a);
  }function m() {
    s && s.$setValidity("hours", !0), t && t.$setValidity("minutes", !0), u && u.$setValidity("seconds", !0), x.$setValidity("time", !0), a.invalidHours = !1, a.invalidMinutes = !1, a.invalidSeconds = !1;
  }function n(b) {
    if (x.$modelValue) {
      var c = v.getHours(),
          d = v.getMinutes(),
          e = v.getSeconds();a.showMeridian && (c = 0 === c || 12 === c ? 12 : c % 12), a.hours = "h" === b ? c : k(c, !z), "m" !== b && (a.minutes = k(d)), a.meridian = v.getHours() < 12 ? y[0] : y[1], "s" !== b && (a.seconds = k(e)), a.meridian = v.getHours() < 12 ? y[0] : y[1];
    } else a.hours = null, a.minutes = null, a.seconds = null, a.meridian = y[0];
  }function o(a) {
    v = q(v, a), l();
  }function p(a, b) {
    return q(a, 60 * b);
  }function q(a, b) {
    var c = new Date(a.getTime() + 1e3 * b),
        d = new Date(a);return d.setHours(c.getHours(), c.getMinutes(), c.getSeconds()), d;
  }function r() {
    return (null === a.hours || "" === a.hours) && (null === a.minutes || "" === a.minutes) && (!a.showSeconds || a.showSeconds && (null === a.seconds || "" === a.seconds));
  }var s,
      t,
      u,
      v = new Date(),
      w = [],
      x = { $setViewValue: angular.noop },
      y = angular.isDefined(c.meridians) ? a.$parent.$eval(c.meridians) : g.meridians || f.DATETIME_FORMATS.AMPMS,
      z = angular.isDefined(c.padHours) ? a.$parent.$eval(c.padHours) : !0;a.tabindex = angular.isDefined(c.tabindex) ? c.tabindex : 0, b.removeAttr("tabindex"), this.init = function (b, d) {
    x = b, x.$render = this.render, x.$formatters.unshift(function (a) {
      return a ? new Date(a) : null;
    });var e = d.eq(0),
        f = d.eq(1),
        h = d.eq(2);s = e.controller("ngModel"), t = f.controller("ngModel"), u = h.controller("ngModel");var i = angular.isDefined(c.mousewheel) ? a.$parent.$eval(c.mousewheel) : g.mousewheel;i && this.setupMousewheelEvents(e, f, h);var j = angular.isDefined(c.arrowkeys) ? a.$parent.$eval(c.arrowkeys) : g.arrowkeys;j && this.setupArrowkeyEvents(e, f, h), a.readonlyInput = angular.isDefined(c.readonlyInput) ? a.$parent.$eval(c.readonlyInput) : g.readonlyInput, this.setupInputEvents(e, f, h);
  };var A = g.hourStep;c.hourStep && w.push(a.$parent.$watch(d(c.hourStep), function (a) {
    A = +a;
  }));var B = g.minuteStep;c.minuteStep && w.push(a.$parent.$watch(d(c.minuteStep), function (a) {
    B = +a;
  }));var C;w.push(a.$parent.$watch(d(c.min), function (a) {
    var b = new Date(a);C = isNaN(b) ? void 0 : b;
  }));var D;w.push(a.$parent.$watch(d(c.max), function (a) {
    var b = new Date(a);D = isNaN(b) ? void 0 : b;
  }));var E = !1;c.ngDisabled && w.push(a.$parent.$watch(d(c.ngDisabled), function (a) {
    E = a;
  })), a.noIncrementHours = function () {
    var a = p(v, 60 * A);return E || a > D || v > a && C > a;
  }, a.noDecrementHours = function () {
    var a = p(v, 60 * -A);return E || C > a || a > v && a > D;
  }, a.noIncrementMinutes = function () {
    var a = p(v, B);return E || a > D || v > a && C > a;
  }, a.noDecrementMinutes = function () {
    var a = p(v, -B);return E || C > a || a > v && a > D;
  }, a.noIncrementSeconds = function () {
    var a = q(v, F);return E || a > D || v > a && C > a;
  }, a.noDecrementSeconds = function () {
    var a = q(v, -F);return E || C > a || a > v && a > D;
  }, a.noToggleMeridian = function () {
    return v.getHours() < 12 ? E || p(v, 720) > D : E || p(v, -720) < C;
  };var F = g.secondStep;c.secondStep && w.push(a.$parent.$watch(d(c.secondStep), function (a) {
    F = +a;
  })), a.showSeconds = g.showSeconds, c.showSeconds && w.push(a.$parent.$watch(d(c.showSeconds), function (b) {
    a.showSeconds = !!b;
  })), a.showMeridian = g.showMeridian, c.showMeridian && w.push(a.$parent.$watch(d(c.showMeridian), function (b) {
    if (a.showMeridian = !!b, x.$error.time) {
      var c = h(),
          d = i();angular.isDefined(c) && angular.isDefined(d) && (v.setHours(c), l());
    } else n();
  })), this.setupMousewheelEvents = function (b, c, d) {
    var e = function e(a) {
      a.originalEvent && (a = a.originalEvent);var b = a.wheelDelta ? a.wheelDelta : -a.deltaY;return a.detail || b > 0;
    };b.on("mousewheel wheel", function (b) {
      E || a.$apply(e(b) ? a.incrementHours() : a.decrementHours()), b.preventDefault();
    }), c.on("mousewheel wheel", function (b) {
      E || a.$apply(e(b) ? a.incrementMinutes() : a.decrementMinutes()), b.preventDefault();
    }), d.on("mousewheel wheel", function (b) {
      E || a.$apply(e(b) ? a.incrementSeconds() : a.decrementSeconds()), b.preventDefault();
    });
  }, this.setupArrowkeyEvents = function (b, c, d) {
    b.on("keydown", function (b) {
      E || (38 === b.which ? (b.preventDefault(), a.incrementHours(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementHours(), a.$apply()));
    }), c.on("keydown", function (b) {
      E || (38 === b.which ? (b.preventDefault(), a.incrementMinutes(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementMinutes(), a.$apply()));
    }), d.on("keydown", function (b) {
      E || (38 === b.which ? (b.preventDefault(), a.incrementSeconds(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementSeconds(), a.$apply()));
    });
  }, this.setupInputEvents = function (b, c, d) {
    if (a.readonlyInput) return a.updateHours = angular.noop, a.updateMinutes = angular.noop, void (a.updateSeconds = angular.noop);var e = function e(b, c, d) {
      x.$setViewValue(null), x.$setValidity("time", !1), angular.isDefined(b) && (a.invalidHours = b, s && s.$setValidity("hours", !1)), angular.isDefined(c) && (a.invalidMinutes = c, t && t.$setValidity("minutes", !1)), angular.isDefined(d) && (a.invalidSeconds = d, u && u.$setValidity("seconds", !1));
    };a.updateHours = function () {
      var a = h(),
          b = i();x.$setDirty(), angular.isDefined(a) && angular.isDefined(b) ? (v.setHours(a), v.setMinutes(b), C > v || v > D ? e(!0) : l("h")) : e(!0);
    }, b.on("blur", function (b) {
      x.$setTouched(), r() ? m() : null === a.hours || "" === a.hours ? e(!0) : !a.invalidHours && a.hours < 10 && a.$apply(function () {
        a.hours = k(a.hours, !z);
      });
    }), a.updateMinutes = function () {
      var a = i(),
          b = h();x.$setDirty(), angular.isDefined(a) && angular.isDefined(b) ? (v.setHours(b), v.setMinutes(a), C > v || v > D ? e(void 0, !0) : l("m")) : e(void 0, !0);
    }, c.on("blur", function (b) {
      x.$setTouched(), r() ? m() : null === a.minutes ? e(void 0, !0) : !a.invalidMinutes && a.minutes < 10 && a.$apply(function () {
        a.minutes = k(a.minutes);
      });
    }), a.updateSeconds = function () {
      var a = j();x.$setDirty(), angular.isDefined(a) ? (v.setSeconds(a), l("s")) : e(void 0, void 0, !0);
    }, d.on("blur", function (b) {
      r() ? m() : !a.invalidSeconds && a.seconds < 10 && a.$apply(function () {
        a.seconds = k(a.seconds);
      });
    });
  }, this.render = function () {
    var b = x.$viewValue;isNaN(b) ? (x.$setValidity("time", !1), e.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (b && (v = b), C > v || v > D ? (x.$setValidity("time", !1), a.invalidHours = !0, a.invalidMinutes = !0) : m(), n());
  }, a.showSpinners = angular.isDefined(c.showSpinners) ? a.$parent.$eval(c.showSpinners) : g.showSpinners, a.incrementHours = function () {
    a.noIncrementHours() || o(60 * A * 60);
  }, a.decrementHours = function () {
    a.noDecrementHours() || o(60 * -A * 60);
  }, a.incrementMinutes = function () {
    a.noIncrementMinutes() || o(60 * B);
  }, a.decrementMinutes = function () {
    a.noDecrementMinutes() || o(60 * -B);
  }, a.incrementSeconds = function () {
    a.noIncrementSeconds() || o(F);
  }, a.decrementSeconds = function () {
    a.noDecrementSeconds() || o(-F);
  }, a.toggleMeridian = function () {
    var b = i(),
        c = h();a.noToggleMeridian() || (angular.isDefined(b) && angular.isDefined(c) ? o(720 * (v.getHours() < 12 ? 60 : -60)) : a.meridian = a.meridian === y[0] ? y[1] : y[0]);
  }, a.blur = function () {
    x.$setTouched();
  }, a.$on("$destroy", function () {
    for (; w.length;) {
      w.shift()();
    }
  });
}]).directive("uibTimepicker", ["uibTimepickerConfig", function (a) {
  return { require: ["uibTimepicker", "?^ngModel"], restrict: "A", controller: "UibTimepickerController", controllerAs: "timepicker", scope: {}, templateUrl: function templateUrl(b, c) {
      return c.templateUrl || a.templateUrl;
    }, link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];f && e.init(f, b.find("input"));
    } };
}]), angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.debounce", "ui.bootstrap.position"]).factory("uibTypeaheadParser", ["$parse", function (a) {
  var b = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;return { parse: function parse(c) {
      var d = c.match(b);if (!d) throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + c + '".');return { itemName: d[3], source: a(d[4]), viewMapper: a(d[2] || d[1]), modelMapper: a(d[1]) };
    } };
}]).controller("UibTypeaheadController", ["$scope", "$element", "$attrs", "$compile", "$parse", "$q", "$timeout", "$document", "$window", "$rootScope", "$$debounce", "$uibPosition", "uibTypeaheadParser", function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
  function n() {
    P.moveInProgress || (P.moveInProgress = !0, P.$digest()), $();
  }function o() {
    P.position = F ? l.offset(b) : l.position(b), P.position.top += b.prop("offsetHeight");
  }function p(a) {
    var b;return angular.version.minor < 6 ? (b = a.$options || {}, b.getOption = function (a) {
      return b[a];
    }) : b = a.$options, b;
  }var q,
      r,
      s = [9, 13, 27, 38, 40],
      t = 200,
      u = a.$eval(c.typeaheadMinLength);u || 0 === u || (u = 1), a.$watch(c.typeaheadMinLength, function (a) {
    u = a || 0 === a ? a : 1;
  });var v = a.$eval(c.typeaheadWaitMs) || 0,
      w = a.$eval(c.typeaheadEditable) !== !1;a.$watch(c.typeaheadEditable, function (a) {
    w = a !== !1;
  });var x,
      y,
      z = e(c.typeaheadLoading).assign || angular.noop,
      A = c.typeaheadShouldSelect ? e(c.typeaheadShouldSelect) : function (a, b) {
    var c = b.$event;return 13 === c.which || 9 === c.which;
  },
      B = e(c.typeaheadOnSelect),
      C = angular.isDefined(c.typeaheadSelectOnBlur) ? a.$eval(c.typeaheadSelectOnBlur) : !1,
      D = e(c.typeaheadNoResults).assign || angular.noop,
      E = c.typeaheadInputFormatter ? e(c.typeaheadInputFormatter) : void 0,
      F = c.typeaheadAppendToBody ? a.$eval(c.typeaheadAppendToBody) : !1,
      G = c.typeaheadAppendTo ? a.$eval(c.typeaheadAppendTo) : null,
      H = a.$eval(c.typeaheadFocusFirst) !== !1,
      I = c.typeaheadSelectOnExact ? a.$eval(c.typeaheadSelectOnExact) : !1,
      J = e(c.typeaheadIsOpen).assign || angular.noop,
      K = a.$eval(c.typeaheadShowHint) || !1,
      L = e(c.ngModel),
      M = e(c.ngModel + "($$$p)"),
      N = function N(b, c) {
    return angular.isFunction(L(a)) && r.getOption("getterSetter") ? M(b, { $$$p: c }) : L.assign(b, c);
  },
      O = m.parse(c.uibTypeahead),
      P = a.$new(),
      Q = a.$on("$destroy", function () {
    P.$destroy();
  });P.$on("$destroy", Q);var R = "typeahead-" + P.$id + "-" + Math.floor(1e4 * Math.random());b.attr({ "aria-autocomplete": "list", "aria-expanded": !1, "aria-owns": R });var S, T;K && (S = angular.element("<div></div>"), S.css("position", "relative"), b.after(S), T = b.clone(), T.attr("placeholder", ""), T.attr("tabindex", "-1"), T.val(""), T.css({ position: "absolute", top: "0px", left: "0px", "border-color": "transparent", "box-shadow": "none", opacity: 1, background: "none 0% 0% / auto repeat scroll padding-box border-box rgb(255, 255, 255)", color: "#999" }), b.css({ position: "relative", "vertical-align": "top", "background-color": "transparent" }), T.attr("id") && T.removeAttr("id"), S.append(T), T.after(b));var U = angular.element("<div uib-typeahead-popup></div>");U.attr({ id: R, matches: "matches", active: "activeIdx", select: "select(activeIdx, evt)", "move-in-progress": "moveInProgress", query: "query", position: "position", "assign-is-open": "assignIsOpen(isOpen)", debounce: "debounceUpdate" }), angular.isDefined(c.typeaheadTemplateUrl) && U.attr("template-url", c.typeaheadTemplateUrl), angular.isDefined(c.typeaheadPopupTemplateUrl) && U.attr("popup-template-url", c.typeaheadPopupTemplateUrl);var V = function V() {
    K && T.val("");
  },
      W = function W() {
    P.matches = [], P.activeIdx = -1, b.attr("aria-expanded", !1), V();
  },
      X = function X(a) {
    return R + "-option-" + a;
  };P.$watch("activeIdx", function (a) {
    0 > a ? b.removeAttr("aria-activedescendant") : b.attr("aria-activedescendant", X(a));
  });var Y = function Y(a, b) {
    return P.matches.length > b && a ? a.toUpperCase() === P.matches[b].label.toUpperCase() : !1;
  },
      Z = function Z(c, d) {
    var e = { $viewValue: c };z(a, !0), D(a, !1), f.when(O.source(a, e)).then(function (f) {
      var g = c === q.$viewValue;if (g && x) if (f && f.length > 0) {
        P.activeIdx = H ? 0 : -1, D(a, !1), P.matches.length = 0;for (var h = 0; h < f.length; h++) {
          e[O.itemName] = f[h], P.matches.push({ id: X(h), label: O.viewMapper(P, e), model: f[h] });
        }if (P.query = c, o(), b.attr("aria-expanded", !0), I && 1 === P.matches.length && Y(c, 0) && (angular.isNumber(P.debounceUpdate) || angular.isObject(P.debounceUpdate) ? k(function () {
          P.select(0, d);
        }, angular.isNumber(P.debounceUpdate) ? P.debounceUpdate : P.debounceUpdate["default"]) : P.select(0, d)), K) {
          var i = P.matches[0].label;angular.isString(c) && c.length > 0 && i.slice(0, c.length).toUpperCase() === c.toUpperCase() ? T.val(c + i.slice(c.length)) : T.val("");
        }
      } else W(), D(a, !0);g && z(a, !1);
    }, function () {
      W(), z(a, !1), D(a, !0);
    });
  };F && (angular.element(i).on("resize", n), h.find("body").on("scroll", n));var $ = k(function () {
    P.matches.length && o(), P.moveInProgress = !1;
  }, t);P.moveInProgress = !1, P.query = void 0;var _,
      aa = function aa(a) {
    _ = g(function () {
      Z(a);
    }, v);
  },
      ba = function ba() {
    _ && g.cancel(_);
  };W(), P.assignIsOpen = function (b) {
    J(a, b);
  }, P.select = function (d, e) {
    var f,
        h,
        i = {};y = !0, i[O.itemName] = h = P.matches[d].model, f = O.modelMapper(a, i), N(a, f), q.$setValidity("editable", !0), q.$setValidity("parse", !0), B(a, { $item: h, $model: f, $label: O.viewMapper(a, i), $event: e }), W(), P.$eval(c.typeaheadFocusOnSelect) !== !1 && g(function () {
      b[0].focus();
    }, 0, !1);
  }, b.on("keydown", function (b) {
    if (0 !== P.matches.length && -1 !== s.indexOf(b.which)) {
      var c = A(a, { $event: b });if (-1 === P.activeIdx && c || 9 === b.which && b.shiftKey) return W(), void P.$digest();b.preventDefault();var d;switch (b.which) {case 27:
          b.stopPropagation(), W(), a.$digest();break;case 38:
          P.activeIdx = (P.activeIdx > 0 ? P.activeIdx : P.matches.length) - 1, P.$digest(), d = U[0].querySelectorAll(".uib-typeahead-match")[P.activeIdx], d.parentNode.scrollTop = d.offsetTop;break;case 40:
          P.activeIdx = (P.activeIdx + 1) % P.matches.length, P.$digest(), d = U[0].querySelectorAll(".uib-typeahead-match")[P.activeIdx], d.parentNode.scrollTop = d.offsetTop;break;default:
          c && P.$apply(function () {
            angular.isNumber(P.debounceUpdate) || angular.isObject(P.debounceUpdate) ? k(function () {
              P.select(P.activeIdx, b);
            }, angular.isNumber(P.debounceUpdate) ? P.debounceUpdate : P.debounceUpdate["default"]) : P.select(P.activeIdx, b);
          });}
    }
  }), b.on("focus", function (a) {
    x = !0, 0 !== u || q.$viewValue || g(function () {
      Z(q.$viewValue, a);
    }, 0);
  }), b.on("blur", function (a) {
    C && P.matches.length && -1 !== P.activeIdx && !y && (y = !0, P.$apply(function () {
      angular.isObject(P.debounceUpdate) && angular.isNumber(P.debounceUpdate.blur) ? k(function () {
        P.select(P.activeIdx, a);
      }, P.debounceUpdate.blur) : P.select(P.activeIdx, a);
    })), !w && q.$error.editable && (q.$setViewValue(), P.$apply(function () {
      q.$setValidity("editable", !0), q.$setValidity("parse", !0);
    }), b.val("")), x = !1, y = !1;
  });var ca = function ca(c) {
    b[0] !== c.target && 3 !== c.which && 0 !== P.matches.length && (W(), j.$$phase || a.$digest());
  };h.on("click", ca), a.$on("$destroy", function () {
    h.off("click", ca), (F || G) && da.remove(), F && (angular.element(i).off("resize", n), h.find("body").off("scroll", n)), U.remove(), K && S.remove();
  });var da = d(U)(P);F ? h.find("body").append(da) : G ? angular.element(G).eq(0).append(da) : b.after(da), this.init = function (b) {
    q = b, r = p(q), P.debounceUpdate = e(r.getOption("debounce"))(a), q.$parsers.unshift(function (b) {
      return x = !0, 0 === u || b && b.length >= u ? v > 0 ? (ba(), aa(b)) : Z(b) : (z(a, !1), ba(), W()), w ? b : b ? void q.$setValidity("editable", !1) : (q.$setValidity("editable", !0), null);
    }), q.$formatters.push(function (b) {
      var c,
          d,
          e = {};return w || q.$setValidity("editable", !0), E ? (e.$model = b, E(a, e)) : (e[O.itemName] = b, c = O.viewMapper(a, e), e[O.itemName] = void 0, d = O.viewMapper(a, e), c !== d ? c : b);
    });
  };
}]).directive("uibTypeahead", function () {
  return { controller: "UibTypeaheadController", require: ["ngModel", "uibTypeahead"], link: function link(a, b, c, d) {
      d[1].init(d[0]);
    } };
}).directive("uibTypeaheadPopup", ["$$debounce", function (a) {
  return { scope: { matches: "=", query: "=", active: "=", position: "&", moveInProgress: "=", select: "&", assignIsOpen: "&", debounce: "&" }, replace: !0, templateUrl: function templateUrl(a, b) {
      return b.popupTemplateUrl || "uib/template/typeahead/typeahead-popup.html";
    }, link: function link(b, c, d) {
      b.templateUrl = d.templateUrl, b.isOpen = function () {
        var a = b.matches.length > 0;return b.assignIsOpen({ isOpen: a }), a;
      }, b.isActive = function (a) {
        return b.active === a;
      }, b.selectActive = function (a) {
        b.active = a;
      }, b.selectMatch = function (c, d) {
        var e = b.debounce();angular.isNumber(e) || angular.isObject(e) ? a(function () {
          b.select({ activeIdx: c, evt: d });
        }, angular.isNumber(e) ? e : e["default"]) : b.select({ activeIdx: c, evt: d });
      };
    } };
}]).directive("uibTypeaheadMatch", ["$templateRequest", "$compile", "$parse", function (a, b, c) {
  return { scope: { index: "=", match: "=", query: "=" }, link: function link(d, e, f) {
      var g = c(f.templateUrl)(d.$parent) || "uib/template/typeahead/typeahead-match.html";a(g).then(function (a) {
        var c = angular.element(a.trim());e.replaceWith(c), b(c)(d);
      });
    } };
}]).filter("uibTypeaheadHighlight", ["$sce", "$injector", "$log", function (a, b, c) {
  function d(a) {
    return a.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }function e(a) {
    return (/<.*>/g.test(a)
    );
  }var f;return f = b.has("$sanitize"), function (b, g) {
    return !f && e(b) && c.warn("Unsafe use of typeahead please use ngSanitize"), b = g ? ("" + b).replace(new RegExp(d(g), "gi"), "<strong>$&</strong>") : b, f || (b = a.trustAsHtml(b)), b;
  };
}]), angular.module("ui.bootstrap.carousel").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibCarouselCss && angular.element(document).find("head").prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>'), angular.$$uibCarouselCss = !0;
}), angular.module("ui.bootstrap.datepicker").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibDatepickerCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-left,.uib-right{width:100%}</style>'), angular.$$uibDatepickerCss = !0;
}), angular.module("ui.bootstrap.position").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>'), angular.$$uibPositionCss = !0;
}), angular.module("ui.bootstrap.datepickerPopup").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibDatepickerpopupCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-datepicker-popup.dropdown-menu{display:block;float:none;margin:0;}.uib-button-bar{padding:10px 9px 2px;}</style>'), angular.$$uibDatepickerpopupCss = !0;
}), angular.module("ui.bootstrap.tooltip").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibTooltipCss && angular.element(document).find("head").prepend('<style type="text/css">[uib-tooltip-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-bottom > .tooltip-arrow,[uib-popover-popup].popover.top-left > .arrow,[uib-popover-popup].popover.top-right > .arrow,[uib-popover-popup].popover.bottom-left > .arrow,[uib-popover-popup].popover.bottom-right > .arrow,[uib-popover-popup].popover.left-top > .arrow,[uib-popover-popup].popover.left-bottom > .arrow,[uib-popover-popup].popover.right-top > .arrow,[uib-popover-popup].popover.right-bottom > .arrow,[uib-popover-html-popup].popover.top-left > .arrow,[uib-popover-html-popup].popover.top-right > .arrow,[uib-popover-html-popup].popover.bottom-left > .arrow,[uib-popover-html-popup].popover.bottom-right > .arrow,[uib-popover-html-popup].popover.left-top > .arrow,[uib-popover-html-popup].popover.left-bottom > .arrow,[uib-popover-html-popup].popover.right-top > .arrow,[uib-popover-html-popup].popover.right-bottom > .arrow,[uib-popover-template-popup].popover.top-left > .arrow,[uib-popover-template-popup].popover.top-right > .arrow,[uib-popover-template-popup].popover.bottom-left > .arrow,[uib-popover-template-popup].popover.bottom-right > .arrow,[uib-popover-template-popup].popover.left-top > .arrow,[uib-popover-template-popup].popover.left-bottom > .arrow,[uib-popover-template-popup].popover.right-top > .arrow,[uib-popover-template-popup].popover.right-bottom > .arrow{top:auto;bottom:auto;left:auto;right:auto;margin:0;}[uib-popover-popup].popover,[uib-popover-html-popup].popover,[uib-popover-template-popup].popover{display:block !important;}</style>'), angular.$$uibTooltipCss = !0;
}), angular.module("ui.bootstrap.timepicker").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibTimepickerCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-time input{width:50px;}</style>'), angular.$$uibTimepickerCss = !0;
}), angular.module("ui.bootstrap.typeahead").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibTypeaheadCss && angular.element(document).find("head").prepend('<style type="text/css">[uib-typeahead-popup].dropdown-menu{display:block;}</style>'), angular.$$uibTypeaheadCss = !0;
});;"use strict";

/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 2.5.0 - 2017-01-28
 * License: MIT
 */angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.collapse", "ui.bootstrap.tabindex", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.isClass", "ui.bootstrap.datepicker", "ui.bootstrap.position", "ui.bootstrap.datepickerPopup", "ui.bootstrap.debounce", "ui.bootstrap.multiMap", "ui.bootstrap.dropdown", "ui.bootstrap.stackedMap", "ui.bootstrap.modal", "ui.bootstrap.paging", "ui.bootstrap.pager", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.typeahead"]), angular.module("ui.bootstrap.tpls", ["uib/template/accordion/accordion-group.html", "uib/template/accordion/accordion.html", "uib/template/alert/alert.html", "uib/template/carousel/carousel.html", "uib/template/carousel/slide.html", "uib/template/datepicker/datepicker.html", "uib/template/datepicker/day.html", "uib/template/datepicker/month.html", "uib/template/datepicker/year.html", "uib/template/datepickerPopup/popup.html", "uib/template/modal/window.html", "uib/template/pager/pager.html", "uib/template/pagination/pagination.html", "uib/template/tooltip/tooltip-html-popup.html", "uib/template/tooltip/tooltip-popup.html", "uib/template/tooltip/tooltip-template-popup.html", "uib/template/popover/popover-html.html", "uib/template/popover/popover-template.html", "uib/template/popover/popover.html", "uib/template/progressbar/bar.html", "uib/template/progressbar/progress.html", "uib/template/progressbar/progressbar.html", "uib/template/rating/rating.html", "uib/template/tabs/tab.html", "uib/template/tabs/tabset.html", "uib/template/timepicker/timepicker.html", "uib/template/typeahead/typeahead-match.html", "uib/template/typeahead/typeahead-popup.html"]), angular.module("ui.bootstrap.collapse", []).directive("uibCollapse", ["$animate", "$q", "$parse", "$injector", function (a, b, c, d) {
  var e = d.has("$animateCss") ? d.get("$animateCss") : null;return { link: function link(d, f, g) {
      function h() {
        r = !!("horizontal" in g), r ? (s = { width: "" }, t = { width: "0" }) : (s = { height: "" }, t = { height: "0" }), d.$eval(g.uibCollapse) || f.addClass("in").addClass("collapse").attr("aria-expanded", !0).attr("aria-hidden", !1).css(s);
      }function i(a) {
        return r ? { width: a.scrollWidth + "px" } : { height: a.scrollHeight + "px" };
      }function j() {
        f.hasClass("collapse") && f.hasClass("in") || b.resolve(n(d)).then(function () {
          f.removeClass("collapse").addClass("collapsing").attr("aria-expanded", !0).attr("aria-hidden", !1), e ? e(f, { addClass: "in", easing: "ease", css: { overflow: "hidden" }, to: i(f[0]) }).start()["finally"](k) : a.addClass(f, "in", { css: { overflow: "hidden" }, to: i(f[0]) }).then(k);
        }, angular.noop);
      }function k() {
        f.removeClass("collapsing").addClass("collapse").css(s), o(d);
      }function l() {
        return f.hasClass("collapse") || f.hasClass("in") ? void b.resolve(p(d)).then(function () {
          f.css(i(f[0])).removeClass("collapse").addClass("collapsing").attr("aria-expanded", !1).attr("aria-hidden", !0), e ? e(f, { removeClass: "in", to: t }).start()["finally"](m) : a.removeClass(f, "in", { to: t }).then(m);
        }, angular.noop) : m();
      }function m() {
        f.css(t), f.removeClass("collapsing").addClass("collapse"), q(d);
      }var n = c(g.expanding),
          o = c(g.expanded),
          p = c(g.collapsing),
          q = c(g.collapsed),
          r = !1,
          s = {},
          t = {};h(), d.$watch(g.uibCollapse, function (a) {
        a ? l() : j();
      });
    } };
}]), angular.module("ui.bootstrap.tabindex", []).directive("uibTabindexToggle", function () {
  return { restrict: "A", link: function link(a, b, c) {
      c.$observe("disabled", function (a) {
        c.$set("tabindex", a ? -1 : null);
      });
    } };
}), angular.module("ui.bootstrap.accordion", ["ui.bootstrap.collapse", "ui.bootstrap.tabindex"]).constant("uibAccordionConfig", { closeOthers: !0 }).controller("UibAccordionController", ["$scope", "$attrs", "uibAccordionConfig", function (a, b, c) {
  this.groups = [], this.closeOthers = function (d) {
    var e = angular.isDefined(b.closeOthers) ? a.$eval(b.closeOthers) : c.closeOthers;e && angular.forEach(this.groups, function (a) {
      a !== d && (a.isOpen = !1);
    });
  }, this.addGroup = function (a) {
    var b = this;this.groups.push(a), a.$on("$destroy", function (c) {
      b.removeGroup(a);
    });
  }, this.removeGroup = function (a) {
    var b = this.groups.indexOf(a);-1 !== b && this.groups.splice(b, 1);
  };
}]).directive("uibAccordion", function () {
  return { controller: "UibAccordionController", controllerAs: "accordion", transclude: !0, templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/accordion/accordion.html";
    } };
}).directive("uibAccordionGroup", function () {
  return { require: "^uibAccordion", transclude: !0, restrict: "A", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/accordion/accordion-group.html";
    }, scope: { heading: "@", panelClass: "@?", isOpen: "=?", isDisabled: "=?" }, controller: function controller() {
      this.setHeading = function (a) {
        this.heading = a;
      };
    }, link: function link(a, b, c, d) {
      b.addClass("panel"), d.addGroup(a), a.openClass = c.openClass || "panel-open", a.panelClass = c.panelClass || "panel-default", a.$watch("isOpen", function (c) {
        b.toggleClass(a.openClass, !!c), c && d.closeOthers(a);
      }), a.toggleOpen = function (b) {
        a.isDisabled || b && 32 !== b.which || (a.isOpen = !a.isOpen);
      };var e = "accordiongroup-" + a.$id + "-" + Math.floor(1e4 * Math.random());a.headingId = e + "-tab", a.panelId = e + "-panel";
    } };
}).directive("uibAccordionHeading", function () {
  return { transclude: !0, template: "", replace: !0, require: "^uibAccordionGroup", link: function link(a, b, c, d, e) {
      d.setHeading(e(a, angular.noop));
    } };
}).directive("uibAccordionTransclude", function () {
  function a() {
    return "uib-accordion-header,data-uib-accordion-header,x-uib-accordion-header,uib\\:accordion-header,[uib-accordion-header],[data-uib-accordion-header],[x-uib-accordion-header]";
  }return { require: "^uibAccordionGroup", link: function link(b, c, d, e) {
      b.$watch(function () {
        return e[d.uibAccordionTransclude];
      }, function (b) {
        if (b) {
          var d = angular.element(c[0].querySelector(a()));d.html(""), d.append(b);
        }
      });
    } };
}), angular.module("ui.bootstrap.alert", []).controller("UibAlertController", ["$scope", "$element", "$attrs", "$interpolate", "$timeout", function (a, b, c, d, e) {
  a.closeable = !!c.close, b.addClass("alert"), c.$set("role", "alert"), a.closeable && b.addClass("alert-dismissible");var f = angular.isDefined(c.dismissOnTimeout) ? d(c.dismissOnTimeout)(a.$parent) : null;f && e(function () {
    a.close();
  }, parseInt(f, 10));
}]).directive("uibAlert", function () {
  return { controller: "UibAlertController", controllerAs: "alert", restrict: "A", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/alert/alert.html";
    }, transclude: !0, scope: { close: "&" } };
}), angular.module("ui.bootstrap.buttons", []).constant("uibButtonConfig", { activeClass: "active", toggleEvent: "click" }).controller("UibButtonsController", ["uibButtonConfig", function (a) {
  this.activeClass = a.activeClass || "active", this.toggleEvent = a.toggleEvent || "click";
}]).directive("uibBtnRadio", ["$parse", function (a) {
  return { require: ["uibBtnRadio", "ngModel"], controller: "UibButtonsController", controllerAs: "buttons", link: function link(b, c, d, e) {
      var f = e[0],
          g = e[1],
          h = a(d.uibUncheckable);c.find("input").css({ display: "none" }), g.$render = function () {
        c.toggleClass(f.activeClass, angular.equals(g.$modelValue, b.$eval(d.uibBtnRadio)));
      }, c.on(f.toggleEvent, function () {
        if (!d.disabled) {
          var a = c.hasClass(f.activeClass);a && !angular.isDefined(d.uncheckable) || b.$apply(function () {
            g.$setViewValue(a ? null : b.$eval(d.uibBtnRadio)), g.$render();
          });
        }
      }), d.uibUncheckable && b.$watch(h, function (a) {
        d.$set("uncheckable", a ? "" : void 0);
      });
    } };
}]).directive("uibBtnCheckbox", function () {
  return { require: ["uibBtnCheckbox", "ngModel"], controller: "UibButtonsController", controllerAs: "button", link: function link(a, b, c, d) {
      function e() {
        return g(c.btnCheckboxTrue, !0);
      }function f() {
        return g(c.btnCheckboxFalse, !1);
      }function g(b, c) {
        return angular.isDefined(b) ? a.$eval(b) : c;
      }var h = d[0],
          i = d[1];b.find("input").css({ display: "none" }), i.$render = function () {
        b.toggleClass(h.activeClass, angular.equals(i.$modelValue, e()));
      }, b.on(h.toggleEvent, function () {
        c.disabled || a.$apply(function () {
          i.$setViewValue(b.hasClass(h.activeClass) ? f() : e()), i.$render();
        });
      });
    } };
}), angular.module("ui.bootstrap.carousel", []).controller("UibCarouselController", ["$scope", "$element", "$interval", "$timeout", "$animate", function (a, b, c, d, e) {
  function f(a) {
    for (var b = 0; b < p.length; b++) {
      p[b].slide.active = b === a;
    }
  }function g(c, d, g) {
    if (!s) {
      if (angular.extend(c, { direction: g }), angular.extend(p[r].slide || {}, { direction: g }), e.enabled(b) && !a.$currentTransition && p[d].element && o.slides.length > 1) {
        p[d].element.data(q, c.direction);var h = o.getCurrentIndex();angular.isNumber(h) && p[h].element && p[h].element.data(q, c.direction), a.$currentTransition = !0, e.on("addClass", p[d].element, function (b, c) {
          "close" === c && (a.$currentTransition = null, e.off("addClass", b));
        });
      }a.active = c.index, r = c.index, f(d), k();
    }
  }function h(a) {
    for (var b = 0; b < p.length; b++) {
      if (p[b].slide === a) return b;
    }
  }function i() {
    m && (c.cancel(m), m = null);
  }function j(b) {
    b.length || (a.$currentTransition = null);
  }function k() {
    i();var b = +a.interval;!isNaN(b) && b > 0 && (m = c(l, b));
  }function l() {
    var b = +a.interval;n && !isNaN(b) && b > 0 && p.length ? a.next() : a.pause();
  }var m,
      n,
      o = this,
      p = o.slides = a.slides = [],
      q = "uib-slideDirection",
      r = a.active,
      s = !1;b.addClass("carousel"), o.addSlide = function (b, c) {
    p.push({ slide: b, element: c }), p.sort(function (a, b) {
      return +a.slide.index - +b.slide.index;
    }), (b.index === a.active || 1 === p.length && !angular.isNumber(a.active)) && (a.$currentTransition && (a.$currentTransition = null), r = b.index, a.active = b.index, f(r), o.select(p[h(b)]), 1 === p.length && a.play());
  }, o.getCurrentIndex = function () {
    for (var a = 0; a < p.length; a++) {
      if (p[a].slide.index === r) return a;
    }
  }, o.next = a.next = function () {
    var b = (o.getCurrentIndex() + 1) % p.length;return 0 === b && a.noWrap() ? void a.pause() : o.select(p[b], "next");
  }, o.prev = a.prev = function () {
    var b = o.getCurrentIndex() - 1 < 0 ? p.length - 1 : o.getCurrentIndex() - 1;return a.noWrap() && b === p.length - 1 ? void a.pause() : o.select(p[b], "prev");
  }, o.removeSlide = function (b) {
    var c = h(b);p.splice(c, 1), p.length > 0 && r === c ? c >= p.length ? (r = p.length - 1, a.active = r, f(r), o.select(p[p.length - 1])) : (r = c, a.active = r, f(r), o.select(p[c])) : r > c && (r--, a.active = r), 0 === p.length && (r = null, a.active = null);
  }, o.select = a.select = function (b, c) {
    var d = h(b.slide);void 0 === c && (c = d > o.getCurrentIndex() ? "next" : "prev"), b.slide.index === r || a.$currentTransition || g(b.slide, d, c);
  }, a.indexOfSlide = function (a) {
    return +a.slide.index;
  }, a.isActive = function (b) {
    return a.active === b.slide.index;
  }, a.isPrevDisabled = function () {
    return 0 === a.active && a.noWrap();
  }, a.isNextDisabled = function () {
    return a.active === p.length - 1 && a.noWrap();
  }, a.pause = function () {
    a.noPause || (n = !1, i());
  }, a.play = function () {
    n || (n = !0, k());
  }, b.on("mouseenter", a.pause), b.on("mouseleave", a.play), a.$on("$destroy", function () {
    s = !0, i();
  }), a.$watch("noTransition", function (a) {
    e.enabled(b, !a);
  }), a.$watch("interval", k), a.$watchCollection("slides", j), a.$watch("active", function (a) {
    if (angular.isNumber(a) && r !== a) {
      for (var b = 0; b < p.length; b++) {
        if (p[b].slide.index === a) {
          a = b;break;
        }
      }var c = p[a];c && (f(a), o.select(p[a]), r = a);
    }
  });
}]).directive("uibCarousel", function () {
  return { transclude: !0, controller: "UibCarouselController", controllerAs: "carousel", restrict: "A", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/carousel/carousel.html";
    }, scope: { active: "=", interval: "=", noTransition: "=", noPause: "=", noWrap: "&" } };
}).directive("uibSlide", ["$animate", function (a) {
  return { require: "^uibCarousel", restrict: "A", transclude: !0, templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/carousel/slide.html";
    }, scope: { actual: "=?", index: "=?" }, link: function link(b, c, d, e) {
      c.addClass("item"), e.addSlide(b, c), b.$on("$destroy", function () {
        e.removeSlide(b);
      }), b.$watch("active", function (b) {
        a[b ? "addClass" : "removeClass"](c, "active");
      });
    } };
}]).animation(".item", ["$animateCss", function (a) {
  function b(a, b, c) {
    a.removeClass(b), c && c();
  }var c = "uib-slideDirection";return { beforeAddClass: function beforeAddClass(d, e, f) {
      if ("active" === e) {
        var g = !1,
            h = d.data(c),
            i = "next" === h ? "left" : "right",
            j = b.bind(this, d, i + " " + h, f);return d.addClass(h), a(d, { addClass: i }).start().done(j), function () {
          g = !0;
        };
      }f();
    }, beforeRemoveClass: function beforeRemoveClass(d, e, f) {
      if ("active" === e) {
        var g = !1,
            h = d.data(c),
            i = "next" === h ? "left" : "right",
            j = b.bind(this, d, i, f);return a(d, { addClass: i }).start().done(j), function () {
          g = !0;
        };
      }f();
    } };
}]), angular.module("ui.bootstrap.dateparser", []).service("uibDateParser", ["$log", "$locale", "dateFilter", "orderByFilter", "filterFilter", function (a, b, c, d, e) {
  function f(a) {
    return e(s, { key: a }, !0)[0];
  }function g(a) {
    var b = [],
        c = a.split(""),
        e = a.indexOf("'");if (e > -1) {
      var f = !1;a = a.split("");for (var g = e; g < a.length; g++) {
        f ? ("'" === a[g] && (g + 1 < a.length && "'" === a[g + 1] ? (a[g + 1] = "$", c[g + 1] = "") : (c[g] = "", f = !1)), a[g] = "$") : "'" === a[g] && (a[g] = "$", c[g] = "", f = !0);
      }a = a.join("");
    }return angular.forEach(s, function (d) {
      var e = a.indexOf(d.key);if (e > -1) {
        a = a.split(""), c[e] = "(" + d.regex + ")", a[e] = "$";for (var f = e + 1, g = e + d.key.length; g > f; f++) {
          c[f] = "", a[f] = "$";
        }a = a.join(""), b.push({ index: e, key: d.key, apply: d.apply, matcher: d.regex });
      }
    }), { regex: new RegExp("^" + c.join("") + "$"), map: d(b, "index") };
  }function h(a) {
    for (var b, c, d = [], e = 0; e < a.length;) {
      if (angular.isNumber(c)) {
        if ("'" === a.charAt(e)) (e + 1 >= a.length || "'" !== a.charAt(e + 1)) && (d.push(i(a, c, e)), c = null);else if (e === a.length) for (; c < a.length;) {
          b = j(a, c), d.push(b), c = b.endIdx;
        }e++;
      } else "'" !== a.charAt(e) ? (b = j(a, e), d.push(b.parser), e = b.endIdx) : (c = e, e++);
    }return d;
  }function i(a, b, c) {
    return function () {
      return a.substr(b + 1, c - b - 1);
    };
  }function j(a, b) {
    for (var c = a.substr(b), d = 0; d < s.length; d++) {
      if (new RegExp("^" + s[d].key).test(c)) {
        var e = s[d];return { endIdx: b + e.key.length, parser: e.formatter };
      }
    }return { endIdx: b + 1, parser: function parser() {
        return c.charAt(0);
      } };
  }function k(a, b, c) {
    return 1 > c ? !1 : 1 === b && c > 28 ? 29 === c && (a % 4 === 0 && a % 100 !== 0 || a % 400 === 0) : 3 === b || 5 === b || 8 === b || 10 === b ? 31 > c : !0;
  }function l(a) {
    return parseInt(a, 10);
  }function m(a, b) {
    return a && b ? q(a, b) : a;
  }function n(a, b) {
    return a && b ? q(a, b, !0) : a;
  }function o(a, b) {
    a = a.replace(/:/g, "");var c = Date.parse("Jan 01, 1970 00:00:00 " + a) / 6e4;return isNaN(c) ? b : c;
  }function p(a, b) {
    return a = new Date(a.getTime()), a.setMinutes(a.getMinutes() + b), a;
  }function q(a, b, c) {
    c = c ? -1 : 1;var d = a.getTimezoneOffset(),
        e = o(b, d);return p(a, c * (e - d));
  }var r,
      s,
      t = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;this.init = function () {
    r = b.id, this.parsers = {}, this.formatters = {}, s = [{ key: "yyyy", regex: "\\d{4}", apply: function apply(a) {
        this.year = +a;
      }, formatter: function formatter(a) {
        var b = new Date();return b.setFullYear(Math.abs(a.getFullYear())), c(b, "yyyy");
      } }, { key: "yy", regex: "\\d{2}", apply: function apply(a) {
        a = +a, this.year = 69 > a ? a + 2e3 : a + 1900;
      }, formatter: function formatter(a) {
        var b = new Date();return b.setFullYear(Math.abs(a.getFullYear())), c(b, "yy");
      } }, { key: "y", regex: "\\d{1,4}", apply: function apply(a) {
        this.year = +a;
      }, formatter: function formatter(a) {
        var b = new Date();return b.setFullYear(Math.abs(a.getFullYear())), c(b, "y");
      } }, { key: "M!", regex: "0?[1-9]|1[0-2]", apply: function apply(a) {
        this.month = a - 1;
      }, formatter: function formatter(a) {
        var b = a.getMonth();return (/^[0-9]$/.test(b) ? c(a, "MM") : c(a, "M")
        );
      } }, { key: "MMMM", regex: b.DATETIME_FORMATS.MONTH.join("|"), apply: function apply(a) {
        this.month = b.DATETIME_FORMATS.MONTH.indexOf(a);
      }, formatter: function formatter(a) {
        return c(a, "MMMM");
      } }, { key: "MMM", regex: b.DATETIME_FORMATS.SHORTMONTH.join("|"), apply: function apply(a) {
        this.month = b.DATETIME_FORMATS.SHORTMONTH.indexOf(a);
      }, formatter: function formatter(a) {
        return c(a, "MMM");
      } }, { key: "MM", regex: "0[1-9]|1[0-2]", apply: function apply(a) {
        this.month = a - 1;
      }, formatter: function formatter(a) {
        return c(a, "MM");
      } }, { key: "M", regex: "[1-9]|1[0-2]", apply: function apply(a) {
        this.month = a - 1;
      }, formatter: function formatter(a) {
        return c(a, "M");
      } }, { key: "d!", regex: "[0-2]?[0-9]{1}|3[0-1]{1}", apply: function apply(a) {
        this.date = +a;
      }, formatter: function formatter(a) {
        var b = a.getDate();return (/^[1-9]$/.test(b) ? c(a, "dd") : c(a, "d")
        );
      } }, { key: "dd", regex: "[0-2][0-9]{1}|3[0-1]{1}", apply: function apply(a) {
        this.date = +a;
      }, formatter: function formatter(a) {
        return c(a, "dd");
      } }, { key: "d", regex: "[1-2]?[0-9]{1}|3[0-1]{1}", apply: function apply(a) {
        this.date = +a;
      }, formatter: function formatter(a) {
        return c(a, "d");
      } }, { key: "EEEE", regex: b.DATETIME_FORMATS.DAY.join("|"), formatter: function formatter(a) {
        return c(a, "EEEE");
      } }, { key: "EEE", regex: b.DATETIME_FORMATS.SHORTDAY.join("|"), formatter: function formatter(a) {
        return c(a, "EEE");
      } }, { key: "HH", regex: "(?:0|1)[0-9]|2[0-3]", apply: function apply(a) {
        this.hours = +a;
      }, formatter: function formatter(a) {
        return c(a, "HH");
      } }, { key: "hh", regex: "0[0-9]|1[0-2]", apply: function apply(a) {
        this.hours = +a;
      }, formatter: function formatter(a) {
        return c(a, "hh");
      } }, { key: "H", regex: "1?[0-9]|2[0-3]", apply: function apply(a) {
        this.hours = +a;
      }, formatter: function formatter(a) {
        return c(a, "H");
      } }, { key: "h", regex: "[0-9]|1[0-2]", apply: function apply(a) {
        this.hours = +a;
      }, formatter: function formatter(a) {
        return c(a, "h");
      } }, { key: "mm", regex: "[0-5][0-9]", apply: function apply(a) {
        this.minutes = +a;
      }, formatter: function formatter(a) {
        return c(a, "mm");
      } }, { key: "m", regex: "[0-9]|[1-5][0-9]", apply: function apply(a) {
        this.minutes = +a;
      }, formatter: function formatter(a) {
        return c(a, "m");
      } }, { key: "sss", regex: "[0-9][0-9][0-9]", apply: function apply(a) {
        this.milliseconds = +a;
      }, formatter: function formatter(a) {
        return c(a, "sss");
      } }, { key: "ss", regex: "[0-5][0-9]", apply: function apply(a) {
        this.seconds = +a;
      }, formatter: function formatter(a) {
        return c(a, "ss");
      } }, { key: "s", regex: "[0-9]|[1-5][0-9]", apply: function apply(a) {
        this.seconds = +a;
      }, formatter: function formatter(a) {
        return c(a, "s");
      } }, { key: "a", regex: b.DATETIME_FORMATS.AMPMS.join("|"), apply: function apply(a) {
        12 === this.hours && (this.hours = 0), "PM" === a && (this.hours += 12);
      }, formatter: function formatter(a) {
        return c(a, "a");
      } }, { key: "Z", regex: "[+-]\\d{4}", apply: function apply(a) {
        var b = a.match(/([+-])(\d{2})(\d{2})/),
            c = b[1],
            d = b[2],
            e = b[3];this.hours += l(c + d), this.minutes += l(c + e);
      }, formatter: function formatter(a) {
        return c(a, "Z");
      } }, { key: "ww", regex: "[0-4][0-9]|5[0-3]", formatter: function formatter(a) {
        return c(a, "ww");
      } }, { key: "w", regex: "[0-9]|[1-4][0-9]|5[0-3]", formatter: function formatter(a) {
        return c(a, "w");
      } }, { key: "GGGG", regex: b.DATETIME_FORMATS.ERANAMES.join("|").replace(/\s/g, "\\s"), formatter: function formatter(a) {
        return c(a, "GGGG");
      } }, { key: "GGG", regex: b.DATETIME_FORMATS.ERAS.join("|"), formatter: function formatter(a) {
        return c(a, "GGG");
      } }, { key: "GG", regex: b.DATETIME_FORMATS.ERAS.join("|"), formatter: function formatter(a) {
        return c(a, "GG");
      } }, { key: "G", regex: b.DATETIME_FORMATS.ERAS.join("|"), formatter: function formatter(a) {
        return c(a, "G");
      } }], angular.version.major >= 1 && angular.version.minor > 4 && s.push({ key: "LLLL", regex: b.DATETIME_FORMATS.STANDALONEMONTH.join("|"), apply: function apply(a) {
        this.month = b.DATETIME_FORMATS.STANDALONEMONTH.indexOf(a);
      }, formatter: function formatter(a) {
        return c(a, "LLLL");
      } });
  }, this.init(), this.getParser = function (a) {
    var b = f(a);return b && b.apply || null;
  }, this.overrideParser = function (a, b) {
    var c = f(a);c && angular.isFunction(b) && (this.parsers = {}, c.apply = b);
  }.bind(this), this.filter = function (a, c) {
    if (!angular.isDate(a) || isNaN(a) || !c) return "";c = b.DATETIME_FORMATS[c] || c, b.id !== r && this.init(), this.formatters[c] || (this.formatters[c] = h(c));var d = this.formatters[c];return d.reduce(function (b, c) {
      return b + c(a);
    }, "");
  }, this.parse = function (c, d, e) {
    if (!angular.isString(c) || !d) return c;d = b.DATETIME_FORMATS[d] || d, d = d.replace(t, "\\$&"), b.id !== r && this.init(), this.parsers[d] || (this.parsers[d] = g(d, "apply"));var f = this.parsers[d],
        h = f.regex,
        i = f.map,
        j = c.match(h),
        l = !1;if (j && j.length) {
      var m, n;angular.isDate(e) && !isNaN(e.getTime()) ? m = { year: e.getFullYear(), month: e.getMonth(), date: e.getDate(), hours: e.getHours(), minutes: e.getMinutes(), seconds: e.getSeconds(), milliseconds: e.getMilliseconds() } : (e && a.warn("dateparser:", "baseDate is not a valid date"), m = { year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });for (var o = 1, p = j.length; p > o; o++) {
        var q = i[o - 1];"Z" === q.matcher && (l = !0), q.apply && q.apply.call(m, j[o]);
      }var s = l ? Date.prototype.setUTCFullYear : Date.prototype.setFullYear,
          u = l ? Date.prototype.setUTCHours : Date.prototype.setHours;return k(m.year, m.month, m.date) && (!angular.isDate(e) || isNaN(e.getTime()) || l ? (n = new Date(0), s.call(n, m.year, m.month, m.date), u.call(n, m.hours || 0, m.minutes || 0, m.seconds || 0, m.milliseconds || 0)) : (n = new Date(e), s.call(n, m.year, m.month, m.date), u.call(n, m.hours, m.minutes, m.seconds, m.milliseconds))), n;
    }
  }, this.toTimezone = m, this.fromTimezone = n, this.timezoneToOffset = o, this.addDateMinutes = p, this.convertTimezoneToLocal = q;
}]), angular.module("ui.bootstrap.isClass", []).directive("uibIsClass", ["$animate", function (a) {
  var b = /^\s*([\s\S]+?)\s+on\s+([\s\S]+?)\s*$/,
      c = /^\s*([\s\S]+?)\s+for\s+([\s\S]+?)\s*$/;return { restrict: "A", compile: function compile(d, e) {
      function f(a, b, c) {
        i.push(a), j.push({ scope: a, element: b }), o.forEach(function (b, c) {
          g(b, a);
        }), a.$on("$destroy", h);
      }function g(b, d) {
        var e = b.match(c),
            f = d.$eval(e[1]),
            g = e[2],
            h = k[b];if (!h) {
          var i = function i(b) {
            var c = null;j.some(function (a) {
              var d = a.scope.$eval(m);return d === b ? (c = a, !0) : void 0;
            }), h.lastActivated !== c && (h.lastActivated && a.removeClass(h.lastActivated.element, f), c && a.addClass(c.element, f), h.lastActivated = c);
          };k[b] = h = { lastActivated: null, scope: d, watchFn: i, compareWithExp: g, watcher: d.$watch(g, i) };
        }h.watchFn(d.$eval(g));
      }function h(a) {
        var b = a.targetScope,
            c = i.indexOf(b);if (i.splice(c, 1), j.splice(c, 1), i.length) {
          var d = i[0];angular.forEach(k, function (a) {
            a.scope === b && (a.watcher = d.$watch(a.compareWithExp, a.watchFn), a.scope = d);
          });
        } else k = {};
      }var i = [],
          j = [],
          k = {},
          l = e.uibIsClass.match(b),
          m = l[2],
          n = l[1],
          o = n.split(",");return f;
    } };
}]), angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.isClass"]).value("$datepickerSuppressError", !1).value("$datepickerLiteralWarning", !0).constant("uibDatepickerConfig", { datepickerMode: "day", formatDay: "dd", formatMonth: "MMMM", formatYear: "yyyy", formatDayHeader: "EEE", formatDayTitle: "MMMM yyyy", formatMonthTitle: "yyyy", maxDate: null, maxMode: "year", minDate: null, minMode: "day", monthColumns: 3, ngModelOptions: {}, shortcutPropagation: !1, showWeeks: !0, yearColumns: 5, yearRows: 4 }).controller("UibDatepickerController", ["$scope", "$element", "$attrs", "$parse", "$interpolate", "$locale", "$log", "dateFilter", "uibDatepickerConfig", "$datepickerLiteralWarning", "$datepickerSuppressError", "uibDateParser", function (a, b, c, d, e, f, g, h, i, j, k, l) {
  function m(b) {
    a.datepickerMode = b, a.datepickerOptions.datepickerMode = b;
  }function n(b) {
    var c;if (angular.version.minor < 6) c = b.$options || a.datepickerOptions.ngModelOptions || i.ngModelOptions || {}, c.getOption = function (a) {
      return c[a];
    };else {
      var d = b.$options.getOption("timezone") || (a.datepickerOptions.ngModelOptions ? a.datepickerOptions.ngModelOptions.timezone : null) || (i.ngModelOptions ? i.ngModelOptions.timezone : null);c = b.$options.createChild(i.ngModelOptions).createChild(a.datepickerOptions.ngModelOptions).createChild(b.$options).createChild({ timezone: d });
    }return c;
  }var o = this,
      p = { $setViewValue: angular.noop },
      q = {},
      r = [];b.addClass("uib-datepicker"), c.$set("role", "application"), a.datepickerOptions || (a.datepickerOptions = {}), this.modes = ["day", "month", "year"], ["customClass", "dateDisabled", "datepickerMode", "formatDay", "formatDayHeader", "formatDayTitle", "formatMonth", "formatMonthTitle", "formatYear", "maxDate", "maxMode", "minDate", "minMode", "monthColumns", "showWeeks", "shortcutPropagation", "startingDay", "yearColumns", "yearRows"].forEach(function (b) {
    switch (b) {case "customClass":case "dateDisabled":
        a[b] = a.datepickerOptions[b] || angular.noop;break;case "datepickerMode":
        a.datepickerMode = angular.isDefined(a.datepickerOptions.datepickerMode) ? a.datepickerOptions.datepickerMode : i.datepickerMode;break;case "formatDay":case "formatDayHeader":case "formatDayTitle":case "formatMonth":case "formatMonthTitle":case "formatYear":
        o[b] = angular.isDefined(a.datepickerOptions[b]) ? e(a.datepickerOptions[b])(a.$parent) : i[b];break;case "monthColumns":case "showWeeks":case "shortcutPropagation":case "yearColumns":case "yearRows":
        o[b] = angular.isDefined(a.datepickerOptions[b]) ? a.datepickerOptions[b] : i[b];break;case "startingDay":
        angular.isDefined(a.datepickerOptions.startingDay) ? o.startingDay = a.datepickerOptions.startingDay : angular.isNumber(i.startingDay) ? o.startingDay = i.startingDay : o.startingDay = (f.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;break;case "maxDate":case "minDate":
        a.$watch("datepickerOptions." + b, function (a) {
          a ? angular.isDate(a) ? o[b] = l.fromTimezone(new Date(a), q.getOption("timezone")) : (j && g.warn("Literal date support has been deprecated, please switch to date object usage"), o[b] = new Date(h(a, "medium"))) : o[b] = i[b] ? l.fromTimezone(new Date(i[b]), q.getOption("timezone")) : null, o.refreshView();
        });break;case "maxMode":case "minMode":
        a.datepickerOptions[b] ? a.$watch(function () {
          return a.datepickerOptions[b];
        }, function (c) {
          o[b] = a[b] = angular.isDefined(c) ? c : a.datepickerOptions[b], ("minMode" === b && o.modes.indexOf(a.datepickerOptions.datepickerMode) < o.modes.indexOf(o[b]) || "maxMode" === b && o.modes.indexOf(a.datepickerOptions.datepickerMode) > o.modes.indexOf(o[b])) && (a.datepickerMode = o[b], a.datepickerOptions.datepickerMode = o[b]);
        }) : o[b] = a[b] = i[b] || null;}
  }), a.uniqueId = "datepicker-" + a.$id + "-" + Math.floor(1e4 * Math.random()), a.disabled = angular.isDefined(c.disabled) || !1, angular.isDefined(c.ngDisabled) && r.push(a.$parent.$watch(c.ngDisabled, function (b) {
    a.disabled = b, o.refreshView();
  })), a.isActive = function (b) {
    return 0 === o.compare(b.date, o.activeDate) ? (a.activeDateId = b.uid, !0) : !1;
  }, this.init = function (b) {
    p = b, q = n(p), a.datepickerOptions.initDate ? (o.activeDate = l.fromTimezone(a.datepickerOptions.initDate, q.getOption("timezone")) || new Date(), a.$watch("datepickerOptions.initDate", function (a) {
      a && (p.$isEmpty(p.$modelValue) || p.$invalid) && (o.activeDate = l.fromTimezone(a, q.getOption("timezone")), o.refreshView());
    })) : o.activeDate = new Date();var c = p.$modelValue ? new Date(p.$modelValue) : new Date();this.activeDate = isNaN(c) ? l.fromTimezone(new Date(), q.getOption("timezone")) : l.fromTimezone(c, q.getOption("timezone")), p.$render = function () {
      o.render();
    };
  }, this.render = function () {
    if (p.$viewValue) {
      var a = new Date(p.$viewValue),
          b = !isNaN(a);b ? this.activeDate = l.fromTimezone(a, q.getOption("timezone")) : k || g.error('Datepicker directive: "ng-model" value must be a Date object');
    }this.refreshView();
  }, this.refreshView = function () {
    if (this.element) {
      a.selectedDt = null, this._refreshView(), a.activeDt && (a.activeDateId = a.activeDt.uid);var b = p.$viewValue ? new Date(p.$viewValue) : null;b = l.fromTimezone(b, q.getOption("timezone")), p.$setValidity("dateDisabled", !b || this.element && !this.isDisabled(b));
    }
  }, this.createDateObject = function (b, c) {
    var d = p.$viewValue ? new Date(p.$viewValue) : null;d = l.fromTimezone(d, q.getOption("timezone"));var e = new Date();e = l.fromTimezone(e, q.getOption("timezone"));var f = this.compare(b, e),
        g = { date: b, label: l.filter(b, c), selected: d && 0 === this.compare(b, d), disabled: this.isDisabled(b), past: 0 > f, current: 0 === f, future: f > 0, customClass: this.customClass(b) || null };return d && 0 === this.compare(b, d) && (a.selectedDt = g), o.activeDate && 0 === this.compare(g.date, o.activeDate) && (a.activeDt = g), g;
  }, this.isDisabled = function (b) {
    return a.disabled || this.minDate && this.compare(b, this.minDate) < 0 || this.maxDate && this.compare(b, this.maxDate) > 0 || a.dateDisabled && a.dateDisabled({ date: b, mode: a.datepickerMode });
  }, this.customClass = function (b) {
    return a.customClass({ date: b, mode: a.datepickerMode });
  }, this.split = function (a, b) {
    for (var c = []; a.length > 0;) {
      c.push(a.splice(0, b));
    }return c;
  }, a.select = function (b) {
    if (a.datepickerMode === o.minMode) {
      var c = p.$viewValue ? l.fromTimezone(new Date(p.$viewValue), q.getOption("timezone")) : new Date(0, 0, 0, 0, 0, 0, 0);c.setFullYear(b.getFullYear(), b.getMonth(), b.getDate()), c = l.toTimezone(c, q.getOption("timezone")), p.$setViewValue(c), p.$render();
    } else o.activeDate = b, m(o.modes[o.modes.indexOf(a.datepickerMode) - 1]), a.$emit("uib:datepicker.mode");a.$broadcast("uib:datepicker.focus");
  }, a.move = function (a) {
    var b = o.activeDate.getFullYear() + a * (o.step.years || 0),
        c = o.activeDate.getMonth() + a * (o.step.months || 0);o.activeDate.setFullYear(b, c, 1), o.refreshView();
  }, a.toggleMode = function (b) {
    b = b || 1, a.datepickerMode === o.maxMode && 1 === b || a.datepickerMode === o.minMode && -1 === b || (m(o.modes[o.modes.indexOf(a.datepickerMode) + b]), a.$emit("uib:datepicker.mode"));
  }, a.keys = { 13: "enter", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down" };var s = function s() {
    o.element[0].focus();
  };a.$on("uib:datepicker.focus", s), a.keydown = function (b) {
    var c = a.keys[b.which];if (c && !b.shiftKey && !b.altKey && !a.disabled) if (b.preventDefault(), o.shortcutPropagation || b.stopPropagation(), "enter" === c || "space" === c) {
      if (o.isDisabled(o.activeDate)) return;a.select(o.activeDate);
    } else !b.ctrlKey || "up" !== c && "down" !== c ? (o.handleKeyDown(c, b), o.refreshView()) : a.toggleMode("up" === c ? 1 : -1);
  }, b.on("keydown", function (b) {
    a.$apply(function () {
      a.keydown(b);
    });
  }), a.$on("$destroy", function () {
    for (; r.length;) {
      r.shift()();
    }
  });
}]).controller("UibDaypickerController", ["$scope", "$element", "dateFilter", function (a, b, c) {
  function d(a, b) {
    return 1 !== b || a % 4 !== 0 || a % 100 === 0 && a % 400 !== 0 ? f[b] : 29;
  }function e(a) {
    var b = new Date(a);b.setDate(b.getDate() + 4 - (b.getDay() || 7));var c = b.getTime();return b.setMonth(0), b.setDate(1), Math.floor(Math.round((c - b) / 864e5) / 7) + 1;
  }var f = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];this.step = { months: 1 }, this.element = b, this.init = function (b) {
    angular.extend(b, this), a.showWeeks = b.showWeeks, b.refreshView();
  }, this.getDates = function (a, b) {
    for (var c, d = new Array(b), e = new Date(a), f = 0; b > f;) {
      c = new Date(e), d[f++] = c, e.setDate(e.getDate() + 1);
    }return d;
  }, this._refreshView = function () {
    var b = this.activeDate.getFullYear(),
        d = this.activeDate.getMonth(),
        f = new Date(this.activeDate);f.setFullYear(b, d, 1);var g = this.startingDay - f.getDay(),
        h = g > 0 ? 7 - g : -g,
        i = new Date(f);h > 0 && i.setDate(-h + 1);for (var j = this.getDates(i, 42), k = 0; 42 > k; k++) {
      j[k] = angular.extend(this.createDateObject(j[k], this.formatDay), { secondary: j[k].getMonth() !== d, uid: a.uniqueId + "-" + k });
    }a.labels = new Array(7);for (var l = 0; 7 > l; l++) {
      a.labels[l] = { abbr: c(j[l].date, this.formatDayHeader), full: c(j[l].date, "EEEE") };
    }if (a.title = c(this.activeDate, this.formatDayTitle), a.rows = this.split(j, 7), a.showWeeks) {
      a.weekNumbers = [];for (var m = (11 - this.startingDay) % 7, n = a.rows.length, o = 0; n > o; o++) {
        a.weekNumbers.push(e(a.rows[o][m].date));
      }
    }
  }, this.compare = function (a, b) {
    var c = new Date(a.getFullYear(), a.getMonth(), a.getDate()),
        d = new Date(b.getFullYear(), b.getMonth(), b.getDate());return c.setFullYear(a.getFullYear()), d.setFullYear(b.getFullYear()), c - d;
  }, this.handleKeyDown = function (a, b) {
    var c = this.activeDate.getDate();if ("left" === a) c -= 1;else if ("up" === a) c -= 7;else if ("right" === a) c += 1;else if ("down" === a) c += 7;else if ("pageup" === a || "pagedown" === a) {
      var e = this.activeDate.getMonth() + ("pageup" === a ? -1 : 1);this.activeDate.setMonth(e, 1), c = Math.min(d(this.activeDate.getFullYear(), this.activeDate.getMonth()), c);
    } else "home" === a ? c = 1 : "end" === a && (c = d(this.activeDate.getFullYear(), this.activeDate.getMonth()));this.activeDate.setDate(c);
  };
}]).controller("UibMonthpickerController", ["$scope", "$element", "dateFilter", function (a, b, c) {
  this.step = { years: 1 }, this.element = b, this.init = function (a) {
    angular.extend(a, this), a.refreshView();
  }, this._refreshView = function () {
    for (var b, d = new Array(12), e = this.activeDate.getFullYear(), f = 0; 12 > f; f++) {
      b = new Date(this.activeDate), b.setFullYear(e, f, 1), d[f] = angular.extend(this.createDateObject(b, this.formatMonth), { uid: a.uniqueId + "-" + f });
    }a.title = c(this.activeDate, this.formatMonthTitle), a.rows = this.split(d, this.monthColumns), a.yearHeaderColspan = this.monthColumns > 3 ? this.monthColumns - 2 : 1;
  }, this.compare = function (a, b) {
    var c = new Date(a.getFullYear(), a.getMonth()),
        d = new Date(b.getFullYear(), b.getMonth());return c.setFullYear(a.getFullYear()), d.setFullYear(b.getFullYear()), c - d;
  }, this.handleKeyDown = function (a, b) {
    var c = this.activeDate.getMonth();if ("left" === a) c -= 1;else if ("up" === a) c -= this.monthColumns;else if ("right" === a) c += 1;else if ("down" === a) c += this.monthColumns;else if ("pageup" === a || "pagedown" === a) {
      var d = this.activeDate.getFullYear() + ("pageup" === a ? -1 : 1);this.activeDate.setFullYear(d);
    } else "home" === a ? c = 0 : "end" === a && (c = 11);this.activeDate.setMonth(c);
  };
}]).controller("UibYearpickerController", ["$scope", "$element", "dateFilter", function (a, b, c) {
  function d(a) {
    return parseInt((a - 1) / f, 10) * f + 1;
  }var e, f;this.element = b, this.yearpickerInit = function () {
    e = this.yearColumns, f = this.yearRows * e, this.step = { years: f };
  }, this._refreshView = function () {
    for (var b, c = new Array(f), g = 0, h = d(this.activeDate.getFullYear()); f > g; g++) {
      b = new Date(this.activeDate), b.setFullYear(h + g, 0, 1), c[g] = angular.extend(this.createDateObject(b, this.formatYear), { uid: a.uniqueId + "-" + g });
    }a.title = [c[0].label, c[f - 1].label].join(" - "), a.rows = this.split(c, e), a.columns = e;
  }, this.compare = function (a, b) {
    return a.getFullYear() - b.getFullYear();
  }, this.handleKeyDown = function (a, b) {
    var c = this.activeDate.getFullYear();"left" === a ? c -= 1 : "up" === a ? c -= e : "right" === a ? c += 1 : "down" === a ? c += e : "pageup" === a || "pagedown" === a ? c += ("pageup" === a ? -1 : 1) * f : "home" === a ? c = d(this.activeDate.getFullYear()) : "end" === a && (c = d(this.activeDate.getFullYear()) + f - 1), this.activeDate.setFullYear(c);
  };
}]).directive("uibDatepicker", function () {
  return { templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/datepicker/datepicker.html";
    }, scope: { datepickerOptions: "=?" }, require: ["uibDatepicker", "^ngModel"], restrict: "A", controller: "UibDatepickerController", controllerAs: "datepicker", link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];e.init(f);
    } };
}).directive("uibDaypicker", function () {
  return { templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/datepicker/day.html";
    },
    require: ["^uibDatepicker", "uibDaypicker"], restrict: "A", controller: "UibDaypickerController", link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];f.init(e);
    } };
}).directive("uibMonthpicker", function () {
  return { templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/datepicker/month.html";
    }, require: ["^uibDatepicker", "uibMonthpicker"], restrict: "A", controller: "UibMonthpickerController", link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];f.init(e);
    } };
}).directive("uibYearpicker", function () {
  return { templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/datepicker/year.html";
    }, require: ["^uibDatepicker", "uibYearpicker"], restrict: "A", controller: "UibYearpickerController", link: function link(a, b, c, d) {
      var e = d[0];angular.extend(e, d[1]), e.yearpickerInit(), e.refreshView();
    } };
}), angular.module("ui.bootstrap.position", []).factory("$uibPosition", ["$document", "$window", function (a, b) {
  var c,
      d,
      e = { normal: /(auto|scroll)/, hidden: /(auto|scroll|hidden)/ },
      f = { auto: /\s?auto?\s?/i, primary: /^(top|bottom|left|right)$/, secondary: /^(top|bottom|left|right|center)$/, vertical: /^(top|bottom)$/ },
      g = /(HTML|BODY)/;return { getRawNode: function getRawNode(a) {
      return a.nodeName ? a : a[0] || a;
    }, parseStyle: function parseStyle(a) {
      return a = parseFloat(a), isFinite(a) ? a : 0;
    }, offsetParent: function offsetParent(c) {
      function d(a) {
        return "static" === (b.getComputedStyle(a).position || "static");
      }c = this.getRawNode(c);for (var e = c.offsetParent || a[0].documentElement; e && e !== a[0].documentElement && d(e);) {
        e = e.offsetParent;
      }return e || a[0].documentElement;
    }, scrollbarWidth: function scrollbarWidth(e) {
      if (e) {
        if (angular.isUndefined(d)) {
          var f = a.find("body");f.addClass("uib-position-body-scrollbar-measure"), d = b.innerWidth - f[0].clientWidth, d = isFinite(d) ? d : 0, f.removeClass("uib-position-body-scrollbar-measure");
        }return d;
      }if (angular.isUndefined(c)) {
        var g = angular.element('<div class="uib-position-scrollbar-measure"></div>');a.find("body").append(g), c = g[0].offsetWidth - g[0].clientWidth, c = isFinite(c) ? c : 0, g.remove();
      }return c;
    }, scrollbarPadding: function scrollbarPadding(a) {
      a = this.getRawNode(a);var c = b.getComputedStyle(a),
          d = this.parseStyle(c.paddingRight),
          e = this.parseStyle(c.paddingBottom),
          f = this.scrollParent(a, !1, !0),
          h = this.scrollbarWidth(g.test(f.tagName));return { scrollbarWidth: h, widthOverflow: f.scrollWidth > f.clientWidth, right: d + h, originalRight: d, heightOverflow: f.scrollHeight > f.clientHeight, bottom: e + h, originalBottom: e };
    }, isScrollable: function isScrollable(a, c) {
      a = this.getRawNode(a);var d = c ? e.hidden : e.normal,
          f = b.getComputedStyle(a);return d.test(f.overflow + f.overflowY + f.overflowX);
    }, scrollParent: function scrollParent(c, d, f) {
      c = this.getRawNode(c);var g = d ? e.hidden : e.normal,
          h = a[0].documentElement,
          i = b.getComputedStyle(c);if (f && g.test(i.overflow + i.overflowY + i.overflowX)) return c;var j = "absolute" === i.position,
          k = c.parentElement || h;if (k === h || "fixed" === i.position) return h;for (; k.parentElement && k !== h;) {
        var l = b.getComputedStyle(k);if (j && "static" !== l.position && (j = !1), !j && g.test(l.overflow + l.overflowY + l.overflowX)) break;k = k.parentElement;
      }return k;
    }, position: function position(c, d) {
      c = this.getRawNode(c);var e = this.offset(c);if (d) {
        var f = b.getComputedStyle(c);e.top -= this.parseStyle(f.marginTop), e.left -= this.parseStyle(f.marginLeft);
      }var g = this.offsetParent(c),
          h = { top: 0, left: 0 };return g !== a[0].documentElement && (h = this.offset(g), h.top += g.clientTop - g.scrollTop, h.left += g.clientLeft - g.scrollLeft), { width: Math.round(angular.isNumber(e.width) ? e.width : c.offsetWidth), height: Math.round(angular.isNumber(e.height) ? e.height : c.offsetHeight), top: Math.round(e.top - h.top), left: Math.round(e.left - h.left) };
    }, offset: function offset(c) {
      c = this.getRawNode(c);var d = c.getBoundingClientRect();return { width: Math.round(angular.isNumber(d.width) ? d.width : c.offsetWidth), height: Math.round(angular.isNumber(d.height) ? d.height : c.offsetHeight), top: Math.round(d.top + (b.pageYOffset || a[0].documentElement.scrollTop)), left: Math.round(d.left + (b.pageXOffset || a[0].documentElement.scrollLeft)) };
    }, viewportOffset: function viewportOffset(c, d, e) {
      c = this.getRawNode(c), e = e !== !1;var f = c.getBoundingClientRect(),
          g = { top: 0, left: 0, bottom: 0, right: 0 },
          h = d ? a[0].documentElement : this.scrollParent(c),
          i = h.getBoundingClientRect();if (g.top = i.top + h.clientTop, g.left = i.left + h.clientLeft, h === a[0].documentElement && (g.top += b.pageYOffset, g.left += b.pageXOffset), g.bottom = g.top + h.clientHeight, g.right = g.left + h.clientWidth, e) {
        var j = b.getComputedStyle(h);g.top += this.parseStyle(j.paddingTop), g.bottom -= this.parseStyle(j.paddingBottom), g.left += this.parseStyle(j.paddingLeft), g.right -= this.parseStyle(j.paddingRight);
      }return { top: Math.round(f.top - g.top), bottom: Math.round(g.bottom - f.bottom), left: Math.round(f.left - g.left), right: Math.round(g.right - f.right) };
    }, parsePlacement: function parsePlacement(a) {
      var b = f.auto.test(a);return b && (a = a.replace(f.auto, "")), a = a.split("-"), a[0] = a[0] || "top", f.primary.test(a[0]) || (a[0] = "top"), a[1] = a[1] || "center", f.secondary.test(a[1]) || (a[1] = "center"), b ? a[2] = !0 : a[2] = !1, a;
    }, positionElements: function positionElements(a, c, d, e) {
      a = this.getRawNode(a), c = this.getRawNode(c);var g = angular.isDefined(c.offsetWidth) ? c.offsetWidth : c.prop("offsetWidth"),
          h = angular.isDefined(c.offsetHeight) ? c.offsetHeight : c.prop("offsetHeight");d = this.parsePlacement(d);var i = e ? this.offset(a) : this.position(a),
          j = { top: 0, left: 0, placement: "" };if (d[2]) {
        var k = this.viewportOffset(a, e),
            l = b.getComputedStyle(c),
            m = { width: g + Math.round(Math.abs(this.parseStyle(l.marginLeft) + this.parseStyle(l.marginRight))), height: h + Math.round(Math.abs(this.parseStyle(l.marginTop) + this.parseStyle(l.marginBottom))) };if (d[0] = "top" === d[0] && m.height > k.top && m.height <= k.bottom ? "bottom" : "bottom" === d[0] && m.height > k.bottom && m.height <= k.top ? "top" : "left" === d[0] && m.width > k.left && m.width <= k.right ? "right" : "right" === d[0] && m.width > k.right && m.width <= k.left ? "left" : d[0], d[1] = "top" === d[1] && m.height - i.height > k.bottom && m.height - i.height <= k.top ? "bottom" : "bottom" === d[1] && m.height - i.height > k.top && m.height - i.height <= k.bottom ? "top" : "left" === d[1] && m.width - i.width > k.right && m.width - i.width <= k.left ? "right" : "right" === d[1] && m.width - i.width > k.left && m.width - i.width <= k.right ? "left" : d[1], "center" === d[1]) if (f.vertical.test(d[0])) {
          var n = i.width / 2 - g / 2;k.left + n < 0 && m.width - i.width <= k.right ? d[1] = "left" : k.right + n < 0 && m.width - i.width <= k.left && (d[1] = "right");
        } else {
          var o = i.height / 2 - m.height / 2;k.top + o < 0 && m.height - i.height <= k.bottom ? d[1] = "top" : k.bottom + o < 0 && m.height - i.height <= k.top && (d[1] = "bottom");
        }
      }switch (d[0]) {case "top":
          j.top = i.top - h;break;case "bottom":
          j.top = i.top + i.height;break;case "left":
          j.left = i.left - g;break;case "right":
          j.left = i.left + i.width;}switch (d[1]) {case "top":
          j.top = i.top;break;case "bottom":
          j.top = i.top + i.height - h;break;case "left":
          j.left = i.left;break;case "right":
          j.left = i.left + i.width - g;break;case "center":
          f.vertical.test(d[0]) ? j.left = i.left + i.width / 2 - g / 2 : j.top = i.top + i.height / 2 - h / 2;}return j.top = Math.round(j.top), j.left = Math.round(j.left), j.placement = "center" === d[1] ? d[0] : d[0] + "-" + d[1], j;
    }, adjustTop: function adjustTop(a, b, c, d) {
      return -1 !== a.indexOf("top") && c !== d ? { top: b.top - d + "px" } : void 0;
    }, positionArrow: function positionArrow(a, c) {
      a = this.getRawNode(a);var d = a.querySelector(".tooltip-inner, .popover-inner");if (d) {
        var e = angular.element(d).hasClass("tooltip-inner"),
            g = e ? a.querySelector(".tooltip-arrow") : a.querySelector(".arrow");if (g) {
          var h = { top: "", bottom: "", left: "", right: "" };if (c = this.parsePlacement(c), "center" === c[1]) return void angular.element(g).css(h);var i = "border-" + c[0] + "-width",
              j = b.getComputedStyle(g)[i],
              k = "border-";k += f.vertical.test(c[0]) ? c[0] + "-" + c[1] : c[1] + "-" + c[0], k += "-radius";var l = b.getComputedStyle(e ? d : a)[k];switch (c[0]) {case "top":
              h.bottom = e ? "0" : "-" + j;break;case "bottom":
              h.top = e ? "0" : "-" + j;break;case "left":
              h.right = e ? "0" : "-" + j;break;case "right":
              h.left = e ? "0" : "-" + j;}h[c[1]] = l, angular.element(g).css(h);
        }
      }
    } };
}]), angular.module("ui.bootstrap.datepickerPopup", ["ui.bootstrap.datepicker", "ui.bootstrap.position"]).value("$datepickerPopupLiteralWarning", !0).constant("uibDatepickerPopupConfig", { altInputFormats: [], appendToBody: !1, clearText: "Clear", closeOnDateSelection: !0, closeText: "Done", currentText: "Today", datepickerPopup: "yyyy-MM-dd", datepickerPopupTemplateUrl: "uib/template/datepickerPopup/popup.html", datepickerTemplateUrl: "uib/template/datepicker/datepicker.html", html5Types: { date: "yyyy-MM-dd", "datetime-local": "yyyy-MM-ddTHH:mm:ss.sss", month: "yyyy-MM" }, onOpenFocus: !0, showButtonBar: !0, placement: "auto bottom-left" }).controller("UibDatepickerPopupController", ["$scope", "$element", "$attrs", "$compile", "$log", "$parse", "$window", "$document", "$rootScope", "$uibPosition", "dateFilter", "uibDateParser", "uibDatepickerPopupConfig", "$timeout", "uibDatepickerConfig", "$datepickerPopupLiteralWarning", function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
  function q(b) {
    var c = l.parse(b, x, a.date);if (isNaN(c)) for (var d = 0; d < J.length; d++) {
      if (c = l.parse(b, J[d], a.date), !isNaN(c)) return c;
    }return c;
  }function r(a) {
    if (angular.isNumber(a) && (a = new Date(a)), !a) return null;if (angular.isDate(a) && !isNaN(a)) return a;if (angular.isString(a)) {
      var b = q(a);if (!isNaN(b)) return l.toTimezone(b, H.getOption("timezone"));
    }return H.getOption("allowInvalid") ? a : void 0;
  }function s(a, b) {
    var d = a || b;return c.ngRequired || d ? (angular.isNumber(d) && (d = new Date(d)), d ? angular.isDate(d) && !isNaN(d) ? !0 : angular.isString(d) ? !isNaN(q(d)) : !1 : !0) : !0;
  }function t(c) {
    if (a.isOpen || !a.disabled) {
      var d = I[0],
          e = b[0].contains(c.target),
          f = void 0 !== d.contains && d.contains(c.target);!a.isOpen || e || f || a.$apply(function () {
        a.isOpen = !1;
      });
    }
  }function u(c) {
    27 === c.which && a.isOpen ? (c.preventDefault(), c.stopPropagation(), a.$apply(function () {
      a.isOpen = !1;
    }), b[0].focus()) : 40 !== c.which || a.isOpen || (c.preventDefault(), c.stopPropagation(), a.$apply(function () {
      a.isOpen = !0;
    }));
  }function v() {
    if (a.isOpen) {
      var d = angular.element(I[0].querySelector(".uib-datepicker-popup")),
          e = c.popupPlacement ? c.popupPlacement : m.placement,
          f = j.positionElements(b, d, e, z);d.css({ top: f.top + "px", left: f.left + "px" }), d.hasClass("uib-position-measure") && d.removeClass("uib-position-measure");
    }
  }function w(a) {
    var b;return angular.version.minor < 6 ? (b = angular.isObject(a.$options) ? a.$options : { timezone: null }, b.getOption = function (a) {
      return b[a];
    }) : b = a.$options, b;
  }var x,
      y,
      z,
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      I,
      J,
      K = !1,
      L = [];this.init = function (e) {
    if (G = e, H = w(G), y = angular.isDefined(c.closeOnDateSelection) ? a.$parent.$eval(c.closeOnDateSelection) : m.closeOnDateSelection, z = angular.isDefined(c.datepickerAppendToBody) ? a.$parent.$eval(c.datepickerAppendToBody) : m.appendToBody, A = angular.isDefined(c.onOpenFocus) ? a.$parent.$eval(c.onOpenFocus) : m.onOpenFocus, B = angular.isDefined(c.datepickerPopupTemplateUrl) ? c.datepickerPopupTemplateUrl : m.datepickerPopupTemplateUrl, C = angular.isDefined(c.datepickerTemplateUrl) ? c.datepickerTemplateUrl : m.datepickerTemplateUrl, J = angular.isDefined(c.altInputFormats) ? a.$parent.$eval(c.altInputFormats) : m.altInputFormats, a.showButtonBar = angular.isDefined(c.showButtonBar) ? a.$parent.$eval(c.showButtonBar) : m.showButtonBar, m.html5Types[c.type] ? (x = m.html5Types[c.type], K = !0) : (x = c.uibDatepickerPopup || m.datepickerPopup, c.$observe("uibDatepickerPopup", function (a, b) {
      var c = a || m.datepickerPopup;if (c !== x && (x = c, G.$modelValue = null, !x)) throw new Error("uibDatepickerPopup must have a date format specified.");
    })), !x) throw new Error("uibDatepickerPopup must have a date format specified.");if (K && c.uibDatepickerPopup) throw new Error("HTML5 date input types do not support custom formats.");D = angular.element("<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>"), D.attr({ "ng-model": "date", "ng-change": "dateSelection(date)", "template-url": B }), E = angular.element(D.children()[0]), E.attr("template-url", C), a.datepickerOptions || (a.datepickerOptions = {}), K && "month" === c.type && (a.datepickerOptions.datepickerMode = "month", a.datepickerOptions.minMode = "month"), E.attr("datepicker-options", "datepickerOptions"), K ? G.$formatters.push(function (b) {
      return a.date = l.fromTimezone(b, H.getOption("timezone")), b;
    }) : (G.$$parserName = "date", G.$validators.date = s, G.$parsers.unshift(r), G.$formatters.push(function (b) {
      return G.$isEmpty(b) ? (a.date = b, b) : (angular.isNumber(b) && (b = new Date(b)), a.date = l.fromTimezone(b, H.getOption("timezone")), l.filter(a.date, x));
    })), G.$viewChangeListeners.push(function () {
      a.date = q(G.$viewValue);
    }), b.on("keydown", u), I = d(D)(a), D.remove(), z ? h.find("body").append(I) : b.after(I), a.$on("$destroy", function () {
      for (a.isOpen === !0 && (i.$$phase || a.$apply(function () {
        a.isOpen = !1;
      })), I.remove(), b.off("keydown", u), h.off("click", t), F && F.off("scroll", v), angular.element(g).off("resize", v); L.length;) {
        L.shift()();
      }
    });
  }, a.getText = function (b) {
    return a[b + "Text"] || m[b + "Text"];
  }, a.isDisabled = function (b) {
    "today" === b && (b = l.fromTimezone(new Date(), H.getOption("timezone")));var c = {};return angular.forEach(["minDate", "maxDate"], function (b) {
      a.datepickerOptions[b] ? angular.isDate(a.datepickerOptions[b]) ? c[b] = new Date(a.datepickerOptions[b]) : (p && e.warn("Literal date support has been deprecated, please switch to date object usage"), c[b] = new Date(k(a.datepickerOptions[b], "medium"))) : c[b] = null;
    }), a.datepickerOptions && c.minDate && a.compare(b, c.minDate) < 0 || c.maxDate && a.compare(b, c.maxDate) > 0;
  }, a.compare = function (a, b) {
    return new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate());
  }, a.dateSelection = function (c) {
    a.date = c;var d = a.date ? l.filter(a.date, x) : null;b.val(d), G.$setViewValue(d), y && (a.isOpen = !1, b[0].focus());
  }, a.keydown = function (c) {
    27 === c.which && (c.stopPropagation(), a.isOpen = !1, b[0].focus());
  }, a.select = function (b, c) {
    if (c.stopPropagation(), "today" === b) {
      var d = new Date();angular.isDate(a.date) ? (b = new Date(a.date), b.setFullYear(d.getFullYear(), d.getMonth(), d.getDate())) : (b = l.fromTimezone(d, H.getOption("timezone")), b.setHours(0, 0, 0, 0));
    }a.dateSelection(b);
  }, a.close = function (c) {
    c.stopPropagation(), a.isOpen = !1, b[0].focus();
  }, a.disabled = angular.isDefined(c.disabled) || !1, c.ngDisabled && L.push(a.$parent.$watch(f(c.ngDisabled), function (b) {
    a.disabled = b;
  })), a.$watch("isOpen", function (d) {
    d ? a.disabled ? a.isOpen = !1 : n(function () {
      v(), A && a.$broadcast("uib:datepicker.focus"), h.on("click", t);var d = c.popupPlacement ? c.popupPlacement : m.placement;z || j.parsePlacement(d)[2] ? (F = F || angular.element(j.scrollParent(b)), F && F.on("scroll", v)) : F = null, angular.element(g).on("resize", v);
    }, 0, !1) : (h.off("click", t), F && F.off("scroll", v), angular.element(g).off("resize", v));
  }), a.$on("uib:datepicker.mode", function () {
    n(v, 0, !1);
  });
}]).directive("uibDatepickerPopup", function () {
  return { require: ["ngModel", "uibDatepickerPopup"], controller: "UibDatepickerPopupController", scope: { datepickerOptions: "=?", isOpen: "=?", currentText: "@", clearText: "@", closeText: "@" }, link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];f.init(e);
    } };
}).directive("uibDatepickerPopupWrap", function () {
  return { restrict: "A", transclude: !0, templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/datepickerPopup/popup.html";
    } };
}), angular.module("ui.bootstrap.debounce", []).factory("$$debounce", ["$timeout", function (a) {
  return function (b, c) {
    var d;return function () {
      var e = this,
          f = Array.prototype.slice.call(arguments);d && a.cancel(d), d = a(function () {
        b.apply(e, f);
      }, c);
    };
  };
}]), angular.module("ui.bootstrap.multiMap", []).factory("$$multiMap", function () {
  return { createNew: function createNew() {
      var a = {};return { entries: function entries() {
          return Object.keys(a).map(function (b) {
            return { key: b, value: a[b] };
          });
        }, get: function get(b) {
          return a[b];
        }, hasKey: function hasKey(b) {
          return !!a[b];
        }, keys: function keys() {
          return Object.keys(a);
        }, put: function put(b, c) {
          a[b] || (a[b] = []), a[b].push(c);
        }, remove: function remove(b, c) {
          var d = a[b];if (d) {
            var e = d.indexOf(c);-1 !== e && d.splice(e, 1), d.length || delete a[b];
          }
        } };
    } };
}), angular.module("ui.bootstrap.dropdown", ["ui.bootstrap.multiMap", "ui.bootstrap.position"]).constant("uibDropdownConfig", { appendToOpenClass: "uib-dropdown-open", openClass: "open" }).service("uibDropdownService", ["$document", "$rootScope", "$$multiMap", function (a, b, c) {
  var d = null,
      e = c.createNew();this.isOnlyOpen = function (a, b) {
    var c = e.get(b);if (c) {
      var d = c.reduce(function (b, c) {
        return c.scope === a ? c : b;
      }, {});if (d) return 1 === c.length;
    }return !1;
  }, this.open = function (b, c, g) {
    if (d || a.on("click", f), d && d !== b && (d.isOpen = !1), d = b, g) {
      var h = e.get(g);if (h) {
        var i = h.map(function (a) {
          return a.scope;
        });-1 === i.indexOf(b) && e.put(g, { scope: b });
      } else e.put(g, { scope: b });
    }
  }, this.close = function (b, c, g) {
    if (d === b && (a.off("click", f), a.off("keydown", this.keybindFilter), d = null), g) {
      var h = e.get(g);if (h) {
        var i = h.reduce(function (a, c) {
          return c.scope === b ? c : a;
        }, {});i && e.remove(g, i);
      }
    }
  };var f = function f(a) {
    if (d && d.isOpen && !(a && "disabled" === d.getAutoClose() || a && 3 === a.which)) {
      var c = d.getToggleElement();if (!(a && c && c[0].contains(a.target))) {
        var e = d.getDropdownElement();a && "outsideClick" === d.getAutoClose() && e && e[0].contains(a.target) || (d.focusToggleElement(), d.isOpen = !1, b.$$phase || d.$apply());
      }
    }
  };this.keybindFilter = function (a) {
    if (d) {
      var b = d.getDropdownElement(),
          c = d.getToggleElement(),
          e = b && b[0].contains(a.target),
          g = c && c[0].contains(a.target);27 === a.which ? (a.stopPropagation(), d.focusToggleElement(), f()) : d.isKeynavEnabled() && -1 !== [38, 40].indexOf(a.which) && d.isOpen && (e || g) && (a.preventDefault(), a.stopPropagation(), d.focusDropdownEntry(a.which));
    }
  };
}]).controller("UibDropdownController", ["$scope", "$element", "$attrs", "$parse", "uibDropdownConfig", "uibDropdownService", "$animate", "$uibPosition", "$document", "$compile", "$templateRequest", function (a, b, c, d, e, f, g, h, i, j, k) {
  function l() {
    b.append(o.dropdownMenu);
  }var m,
      n,
      o = this,
      p = a.$new(),
      q = e.appendToOpenClass,
      r = e.openClass,
      s = angular.noop,
      t = c.onToggle ? d(c.onToggle) : angular.noop,
      u = !1,
      v = i.find("body");b.addClass("dropdown"), this.init = function () {
    c.isOpen && (n = d(c.isOpen), s = n.assign, a.$watch(n, function (a) {
      p.isOpen = !!a;
    })), u = angular.isDefined(c.keyboardNav);
  }, this.toggle = function (a) {
    return p.isOpen = arguments.length ? !!a : !p.isOpen, angular.isFunction(s) && s(p, p.isOpen), p.isOpen;
  }, this.isOpen = function () {
    return p.isOpen;
  }, p.getToggleElement = function () {
    return o.toggleElement;
  }, p.getAutoClose = function () {
    return c.autoClose || "always";
  }, p.getElement = function () {
    return b;
  }, p.isKeynavEnabled = function () {
    return u;
  }, p.focusDropdownEntry = function (a) {
    var c = o.dropdownMenu ? angular.element(o.dropdownMenu).find("a") : b.find("ul").eq(0).find("a");switch (a) {case 40:
        angular.isNumber(o.selectedOption) ? o.selectedOption = o.selectedOption === c.length - 1 ? o.selectedOption : o.selectedOption + 1 : o.selectedOption = 0;break;case 38:
        angular.isNumber(o.selectedOption) ? o.selectedOption = 0 === o.selectedOption ? 0 : o.selectedOption - 1 : o.selectedOption = c.length - 1;}c[o.selectedOption].focus();
  }, p.getDropdownElement = function () {
    return o.dropdownMenu;
  }, p.focusToggleElement = function () {
    o.toggleElement && o.toggleElement[0].focus();
  }, p.$watch("isOpen", function (e, n) {
    var u = null,
        w = !1;if (angular.isDefined(c.dropdownAppendTo)) {
      var x = d(c.dropdownAppendTo)(p);x && (u = angular.element(x));
    }if (angular.isDefined(c.dropdownAppendToBody)) {
      var y = d(c.dropdownAppendToBody)(p);y !== !1 && (w = !0);
    }if (w && !u && (u = v), u && o.dropdownMenu && (e ? (u.append(o.dropdownMenu), b.on("$destroy", l)) : (b.off("$destroy", l), l())), u && o.dropdownMenu) {
      var z,
          A,
          B,
          C = h.positionElements(b, o.dropdownMenu, "bottom-left", !0),
          D = 0;if (z = { top: C.top + "px", display: e ? "block" : "none" }, A = o.dropdownMenu.hasClass("dropdown-menu-right"), A ? (z.left = "auto", B = h.scrollbarPadding(u), B.heightOverflow && B.scrollbarWidth && (D = B.scrollbarWidth), z.right = window.innerWidth - D - (C.left + b.prop("offsetWidth")) + "px") : (z.left = C.left + "px", z.right = "auto"), !w) {
        var E = h.offset(u);z.top = C.top - E.top + "px", A ? z.right = window.innerWidth - (C.left - E.left + b.prop("offsetWidth")) + "px" : z.left = C.left - E.left + "px";
      }o.dropdownMenu.css(z);
    }var F = u ? u : b,
        G = u ? q : r,
        H = F.hasClass(G),
        I = f.isOnlyOpen(a, u);if (H === !e) {
      var J;J = u ? I ? "removeClass" : "addClass" : e ? "addClass" : "removeClass", g[J](F, G).then(function () {
        angular.isDefined(e) && e !== n && t(a, { open: !!e });
      });
    }if (e) o.dropdownMenuTemplateUrl ? k(o.dropdownMenuTemplateUrl).then(function (a) {
      m = p.$new(), j(a.trim())(m, function (a) {
        var b = a;o.dropdownMenu.replaceWith(b), o.dropdownMenu = b, i.on("keydown", f.keybindFilter);
      });
    }) : i.on("keydown", f.keybindFilter), p.focusToggleElement(), f.open(p, b, u);else {
      if (f.close(p, b, u), o.dropdownMenuTemplateUrl) {
        m && m.$destroy();var K = angular.element('<ul class="dropdown-menu"></ul>');o.dropdownMenu.replaceWith(K), o.dropdownMenu = K;
      }o.selectedOption = null;
    }angular.isFunction(s) && s(a, e);
  });
}]).directive("uibDropdown", function () {
  return { controller: "UibDropdownController", link: function link(a, b, c, d) {
      d.init();
    } };
}).directive("uibDropdownMenu", function () {
  return { restrict: "A", require: "?^uibDropdown", link: function link(a, b, c, d) {
      if (d && !angular.isDefined(c.dropdownNested)) {
        b.addClass("dropdown-menu");var e = c.templateUrl;e && (d.dropdownMenuTemplateUrl = e), d.dropdownMenu || (d.dropdownMenu = b);
      }
    } };
}).directive("uibDropdownToggle", function () {
  return { require: "?^uibDropdown", link: function link(a, b, c, d) {
      if (d) {
        b.addClass("dropdown-toggle"), d.toggleElement = b;var e = function e(_e) {
          _e.preventDefault(), b.hasClass("disabled") || c.disabled || a.$apply(function () {
            d.toggle();
          });
        };b.on("click", e), b.attr({ "aria-haspopup": !0, "aria-expanded": !1 }), a.$watch(d.isOpen, function (a) {
          b.attr("aria-expanded", !!a);
        }), a.$on("$destroy", function () {
          b.off("click", e);
        });
      }
    } };
}), angular.module("ui.bootstrap.stackedMap", []).factory("$$stackedMap", function () {
  return { createNew: function createNew() {
      var a = [];return { add: function add(b, c) {
          a.push({ key: b, value: c });
        }, get: function get(b) {
          for (var c = 0; c < a.length; c++) {
            if (b === a[c].key) return a[c];
          }
        }, keys: function keys() {
          for (var b = [], c = 0; c < a.length; c++) {
            b.push(a[c].key);
          }return b;
        }, top: function top() {
          return a[a.length - 1];
        }, remove: function remove(b) {
          for (var c = -1, d = 0; d < a.length; d++) {
            if (b === a[d].key) {
              c = d;break;
            }
          }return a.splice(c, 1)[0];
        }, removeTop: function removeTop() {
          return a.pop();
        }, length: function length() {
          return a.length;
        } };
    } };
}), angular.module("ui.bootstrap.modal", ["ui.bootstrap.multiMap", "ui.bootstrap.stackedMap", "ui.bootstrap.position"]).provider("$uibResolve", function () {
  var a = this;this.resolver = null, this.setResolver = function (a) {
    this.resolver = a;
  }, this.$get = ["$injector", "$q", function (b, c) {
    var d = a.resolver ? b.get(a.resolver) : null;return { resolve: function resolve(a, e, f, g) {
        if (d) return d.resolve(a, e, f, g);var h = [];return angular.forEach(a, function (a) {
          angular.isFunction(a) || angular.isArray(a) ? h.push(c.resolve(b.invoke(a))) : angular.isString(a) ? h.push(c.resolve(b.get(a))) : h.push(c.resolve(a));
        }), c.all(h).then(function (b) {
          var c = {},
              d = 0;return angular.forEach(a, function (a, e) {
            c[e] = b[d++];
          }), c;
        });
      } };
  }];
}).directive("uibModalBackdrop", ["$animate", "$injector", "$uibModalStack", function (a, b, c) {
  function d(b, d, e) {
    e.modalInClass && (a.addClass(d, e.modalInClass), b.$on(c.NOW_CLOSING_EVENT, function (c, f) {
      var g = f();b.modalOptions.animation ? a.removeClass(d, e.modalInClass).then(g) : g();
    }));
  }return { restrict: "A", compile: function compile(a, b) {
      return a.addClass(b.backdropClass), d;
    } };
}]).directive("uibModalWindow", ["$uibModalStack", "$q", "$animateCss", "$document", function (a, b, c, d) {
  return { scope: { index: "@" }, restrict: "A", transclude: !0, templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/modal/window.html";
    }, link: function link(e, f, g) {
      f.addClass(g.windowTopClass || ""), e.size = g.size, e.close = function (b) {
        var c = a.getTop();c && c.value.backdrop && "static" !== c.value.backdrop && b.target === b.currentTarget && (b.preventDefault(), b.stopPropagation(), a.dismiss(c.key, "backdrop click"));
      }, f.on("click", e.close), e.$isRendered = !0;var h = b.defer();e.$$postDigest(function () {
        h.resolve();
      }), h.promise.then(function () {
        var h = null;g.modalInClass && (h = c(f, { addClass: g.modalInClass }).start(), e.$on(a.NOW_CLOSING_EVENT, function (a, b) {
          var d = b();c(f, { removeClass: g.modalInClass }).start().then(d);
        })), b.when(h).then(function () {
          var b = a.getTop();if (b && a.modalRendered(b.key), !d[0].activeElement || !f[0].contains(d[0].activeElement)) {
            var c = f[0].querySelector("[autofocus]");c ? c.focus() : f[0].focus();
          }
        });
      });
    } };
}]).directive("uibModalAnimationClass", function () {
  return { compile: function compile(a, b) {
      b.modalAnimation && a.addClass(b.uibModalAnimationClass);
    } };
}).directive("uibModalTransclude", ["$animate", function (a) {
  return { link: function link(b, c, d, e, f) {
      f(b.$parent, function (b) {
        c.empty(), a.enter(b, c);
      });
    } };
}]).factory("$uibModalStack", ["$animate", "$animateCss", "$document", "$compile", "$rootScope", "$q", "$$multiMap", "$$stackedMap", "$uibPosition", function (a, b, c, d, e, f, g, h, i) {
  function j(a) {
    var b = "-";return a.replace(E, function (a, c) {
      return (c ? b : "") + a.toLowerCase();
    });
  }function k(a) {
    return !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length);
  }function l() {
    for (var a = -1, b = x.keys(), c = 0; c < b.length; c++) {
      x.get(b[c]).value.backdrop && (a = c);
    }return a > -1 && A > a && (a = A), a;
  }function m(a, b) {
    var c = x.get(a).value,
        d = c.appendTo;x.remove(a), B = x.top(), B && (A = parseInt(B.value.modalDomEl.attr("index"), 10)), p(c.modalDomEl, c.modalScope, function () {
      var b = c.openedClass || w;y.remove(b, a);var e = y.hasKey(b);d.toggleClass(b, e), !e && v && v.heightOverflow && v.scrollbarWidth && (v.originalRight ? d.css({ paddingRight: v.originalRight + "px" }) : d.css({ paddingRight: "" }), v = null), n(!0);
    }, c.closedDeferred), o(), b && b.focus ? b.focus() : d.focus && d.focus();
  }function n(a) {
    var b;x.length() > 0 && (b = x.top().value, b.modalDomEl.toggleClass(b.windowTopClass || "", a));
  }function o() {
    if (t && -1 === l()) {
      var a = u;p(t, u, function () {
        a = null;
      }), t = void 0, u = void 0;
    }
  }function p(b, c, d, e) {
    function g() {
      g.done || (g.done = !0, a.leave(b).then(function () {
        d && d(), b.remove(), e && e.resolve();
      }), c.$destroy());
    }var h,
        i = null,
        j = function j() {
      return h || (h = f.defer(), i = h.promise), function () {
        h.resolve();
      };
    };return c.$broadcast(z.NOW_CLOSING_EVENT, j), f.when(i).then(g);
  }function q(a) {
    if (a.isDefaultPrevented()) return a;var b = x.top();if (b) switch (a.which) {case 27:
        b.value.keyboard && (a.preventDefault(), e.$apply(function () {
          z.dismiss(b.key, "escape key press");
        }));break;case 9:
        var c = z.loadFocusElementList(b),
            d = !1;a.shiftKey ? (z.isFocusInFirstItem(a, c) || z.isModalFocused(a, b)) && (d = z.focusLastFocusableElement(c)) : z.isFocusInLastItem(a, c) && (d = z.focusFirstFocusableElement(c)), d && (a.preventDefault(), a.stopPropagation());}
  }function r(a, b, c) {
    return !a.value.modalScope.$broadcast("modal.closing", b, c).defaultPrevented;
  }function s() {
    Array.prototype.forEach.call(document.querySelectorAll("[" + C + "]"), function (a) {
      var b = parseInt(a.getAttribute(C), 10),
          c = b - 1;a.setAttribute(C, c), c || (a.removeAttribute(C), a.removeAttribute("aria-hidden"));
    });
  }var t,
      u,
      v,
      w = "modal-open",
      x = h.createNew(),
      y = g.createNew(),
      z = { NOW_CLOSING_EVENT: "modal.stack.now-closing" },
      A = 0,
      B = null,
      C = "data-bootstrap-modal-aria-hidden-count",
      D = "a[href], area[href], input:not([disabled]):not([tabindex='-1']), button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']), textarea:not([disabled]):not([tabindex='-1']), iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true]",
      E = /[A-Z]/g;return e.$watch(l, function (a) {
    u && (u.index = a);
  }), c.on("keydown", q), e.$on("$destroy", function () {
    c.off("keydown", q);
  }), z.open = function (b, f) {
    function g(a) {
      function b(a) {
        var b = a.parent() ? a.parent().children() : [];return Array.prototype.filter.call(b, function (b) {
          return b !== a[0];
        });
      }if (a && "BODY" !== a[0].tagName) return b(a).forEach(function (a) {
        var b = "true" === a.getAttribute("aria-hidden"),
            c = parseInt(a.getAttribute(C), 10);c || (c = b ? 1 : 0), a.setAttribute(C, c + 1), a.setAttribute("aria-hidden", "true");
      }), g(a.parent());
    }var h = c[0].activeElement,
        k = f.openedClass || w;n(!1), B = x.top(), x.add(b, { deferred: f.deferred, renderDeferred: f.renderDeferred, closedDeferred: f.closedDeferred, modalScope: f.scope, backdrop: f.backdrop, keyboard: f.keyboard, openedClass: f.openedClass, windowTopClass: f.windowTopClass, animation: f.animation, appendTo: f.appendTo }), y.put(k, b);var m = f.appendTo,
        o = l();o >= 0 && !t && (u = e.$new(!0), u.modalOptions = f, u.index = o, t = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>'), t.attr({ "class": "modal-backdrop", "ng-style": "{'z-index': 1040 + (index && 1 || 0) + index*10}", "uib-modal-animation-class": "fade", "modal-in-class": "in" }), f.backdropClass && t.addClass(f.backdropClass), f.animation && t.attr("modal-animation", "true"), d(t)(u), a.enter(t, m), i.isScrollable(m) && (v = i.scrollbarPadding(m), v.heightOverflow && v.scrollbarWidth && m.css({ paddingRight: v.right + "px" })));var p;f.component ? (p = document.createElement(j(f.component.name)), p = angular.element(p), p.attr({ resolve: "$resolve", "modal-instance": "$uibModalInstance", close: "$close($value)", dismiss: "$dismiss($value)" })) : p = f.content, A = B ? parseInt(B.value.modalDomEl.attr("index"), 10) + 1 : 0;var q = angular.element('<div uib-modal-window="modal-window"></div>');q.attr({ "class": "modal", "template-url": f.windowTemplateUrl, "window-top-class": f.windowTopClass, role: "dialog", "aria-labelledby": f.ariaLabelledBy, "aria-describedby": f.ariaDescribedBy, size: f.size, index: A, animate: "animate", "ng-style": "{'z-index': 1050 + $$topModalIndex*10, display: 'block'}", tabindex: -1, "uib-modal-animation-class": "fade", "modal-in-class": "in" }).append(p), f.windowClass && q.addClass(f.windowClass), f.animation && q.attr("modal-animation", "true"), m.addClass(k), f.scope && (f.scope.$$topModalIndex = A), a.enter(d(q)(f.scope), m), x.top().value.modalDomEl = q, x.top().value.modalOpener = h, g(q);
  }, z.close = function (a, b) {
    var c = x.get(a);return s(), c && r(c, b, !0) ? (c.value.modalScope.$$uibDestructionScheduled = !0, c.value.deferred.resolve(b), m(a, c.value.modalOpener), !0) : !c;
  }, z.dismiss = function (a, b) {
    var c = x.get(a);return s(), c && r(c, b, !1) ? (c.value.modalScope.$$uibDestructionScheduled = !0, c.value.deferred.reject(b), m(a, c.value.modalOpener), !0) : !c;
  }, z.dismissAll = function (a) {
    for (var b = this.getTop(); b && this.dismiss(b.key, a);) {
      b = this.getTop();
    }
  }, z.getTop = function () {
    return x.top();
  }, z.modalRendered = function (a) {
    var b = x.get(a);b && b.value.renderDeferred.resolve();
  }, z.focusFirstFocusableElement = function (a) {
    return a.length > 0 ? (a[0].focus(), !0) : !1;
  }, z.focusLastFocusableElement = function (a) {
    return a.length > 0 ? (a[a.length - 1].focus(), !0) : !1;
  }, z.isModalFocused = function (a, b) {
    if (a && b) {
      var c = b.value.modalDomEl;if (c && c.length) return (a.target || a.srcElement) === c[0];
    }return !1;
  }, z.isFocusInFirstItem = function (a, b) {
    return b.length > 0 ? (a.target || a.srcElement) === b[0] : !1;
  }, z.isFocusInLastItem = function (a, b) {
    return b.length > 0 ? (a.target || a.srcElement) === b[b.length - 1] : !1;
  }, z.loadFocusElementList = function (a) {
    if (a) {
      var b = a.value.modalDomEl;if (b && b.length) {
        var c = b[0].querySelectorAll(D);return c ? Array.prototype.filter.call(c, function (a) {
          return k(a);
        }) : c;
      }
    }
  }, z;
}]).provider("$uibModal", function () {
  var a = { options: { animation: !0, backdrop: !0, keyboard: !0 }, $get: ["$rootScope", "$q", "$document", "$templateRequest", "$controller", "$uibResolve", "$uibModalStack", function (b, c, d, e, f, g, h) {
      function i(a) {
        return a.template ? c.when(a.template) : e(angular.isFunction(a.templateUrl) ? a.templateUrl() : a.templateUrl);
      }var j = {},
          k = null;return j.getPromiseChain = function () {
        return k;
      }, j.open = function (e) {
        function j() {
          return q;
        }var l = c.defer(),
            m = c.defer(),
            n = c.defer(),
            o = c.defer(),
            p = { result: l.promise, opened: m.promise, closed: n.promise, rendered: o.promise, close: function close(a) {
            return h.close(p, a);
          }, dismiss: function dismiss(a) {
            return h.dismiss(p, a);
          } };if (e = angular.extend({}, a.options, e), e.resolve = e.resolve || {}, e.appendTo = e.appendTo || d.find("body").eq(0), !e.appendTo.length) throw new Error("appendTo element not found. Make sure that the element passed is in DOM.");if (!e.component && !e.template && !e.templateUrl) throw new Error("One of component or template or templateUrl options is required.");var q;q = e.component ? c.when(g.resolve(e.resolve, {}, null, null)) : c.all([i(e), g.resolve(e.resolve, {}, null, null)]);var r;return r = k = c.all([k]).then(j, j).then(function (a) {
          function c(b, c, d, e) {
            b.$scope = g, b.$scope.$resolve = {}, d ? b.$scope.$uibModalInstance = p : b.$uibModalInstance = p;var f = c ? a[1] : a;angular.forEach(f, function (a, c) {
              e && (b[c] = a), b.$scope.$resolve[c] = a;
            });
          }var d = e.scope || b,
              g = d.$new();g.$close = p.close, g.$dismiss = p.dismiss, g.$on("$destroy", function () {
            g.$$uibDestructionScheduled || g.$dismiss("$uibUnscheduledDestruction");
          });var i,
              j,
              k = { scope: g, deferred: l, renderDeferred: o, closedDeferred: n, animation: e.animation, backdrop: e.backdrop, keyboard: e.keyboard, backdropClass: e.backdropClass, windowTopClass: e.windowTopClass, windowClass: e.windowClass, windowTemplateUrl: e.windowTemplateUrl, ariaLabelledBy: e.ariaLabelledBy, ariaDescribedBy: e.ariaDescribedBy, size: e.size, openedClass: e.openedClass, appendTo: e.appendTo },
              q = {},
              r = {};e.component ? (c(q, !1, !0, !1), q.name = e.component, k.component = q) : e.controller && (c(r, !0, !1, !0), j = f(e.controller, r, !0, e.controllerAs), e.controllerAs && e.bindToController && (i = j.instance, i.$close = g.$close, i.$dismiss = g.$dismiss, angular.extend(i, { $resolve: r.$scope.$resolve }, d)), i = j(), angular.isFunction(i.$onInit) && i.$onInit()), e.component || (k.content = a[0]), h.open(p, k), m.resolve(!0);
        }, function (a) {
          m.reject(a), l.reject(a);
        })["finally"](function () {
          k === r && (k = null);
        }), p;
      }, j;
    }] };return a;
}), angular.module("ui.bootstrap.paging", []).factory("uibPaging", ["$parse", function (a) {
  return { create: function create(b, c, d) {
      b.setNumPages = d.numPages ? a(d.numPages).assign : angular.noop, b.ngModelCtrl = { $setViewValue: angular.noop }, b._watchers = [], b.init = function (a, e) {
        b.ngModelCtrl = a, b.config = e, a.$render = function () {
          b.render();
        }, d.itemsPerPage ? b._watchers.push(c.$parent.$watch(d.itemsPerPage, function (a) {
          b.itemsPerPage = parseInt(a, 10), c.totalPages = b.calculateTotalPages(), b.updatePage();
        })) : b.itemsPerPage = e.itemsPerPage, c.$watch("totalItems", function (a, d) {
          (angular.isDefined(a) || a !== d) && (c.totalPages = b.calculateTotalPages(), b.updatePage());
        });
      }, b.calculateTotalPages = function () {
        var a = b.itemsPerPage < 1 ? 1 : Math.ceil(c.totalItems / b.itemsPerPage);return Math.max(a || 0, 1);
      }, b.render = function () {
        c.page = parseInt(b.ngModelCtrl.$viewValue, 10) || 1;
      }, c.selectPage = function (a, d) {
        d && d.preventDefault();var e = !c.ngDisabled || !d;e && c.page !== a && a > 0 && a <= c.totalPages && (d && d.target && d.target.blur(), b.ngModelCtrl.$setViewValue(a), b.ngModelCtrl.$render());
      }, c.getText = function (a) {
        return c[a + "Text"] || b.config[a + "Text"];
      }, c.noPrevious = function () {
        return 1 === c.page;
      }, c.noNext = function () {
        return c.page === c.totalPages;
      }, b.updatePage = function () {
        b.setNumPages(c.$parent, c.totalPages), c.page > c.totalPages ? c.selectPage(c.totalPages) : b.ngModelCtrl.$render();
      }, c.$on("$destroy", function () {
        for (; b._watchers.length;) {
          b._watchers.shift()();
        }
      });
    } };
}]), angular.module("ui.bootstrap.pager", ["ui.bootstrap.paging", "ui.bootstrap.tabindex"]).controller("UibPagerController", ["$scope", "$attrs", "uibPaging", "uibPagerConfig", function (a, b, c, d) {
  a.align = angular.isDefined(b.align) ? a.$parent.$eval(b.align) : d.align, c.create(this, a, b);
}]).constant("uibPagerConfig", { itemsPerPage: 10, previousText: "« Previous", nextText: "Next »", align: !0 }).directive("uibPager", ["uibPagerConfig", function (a) {
  return { scope: { totalItems: "=", previousText: "@", nextText: "@", ngDisabled: "=" }, require: ["uibPager", "?ngModel"], restrict: "A", controller: "UibPagerController", controllerAs: "pager", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/pager/pager.html";
    }, link: function link(b, c, d, e) {
      c.addClass("pager");var f = e[0],
          g = e[1];g && f.init(g, a);
    } };
}]), angular.module("ui.bootstrap.pagination", ["ui.bootstrap.paging", "ui.bootstrap.tabindex"]).controller("UibPaginationController", ["$scope", "$attrs", "$parse", "uibPaging", "uibPaginationConfig", function (a, b, c, d, e) {
  function f(a, b, c) {
    return { number: a, text: b, active: c };
  }function g(a, b) {
    var c = [],
        d = 1,
        e = b,
        g = angular.isDefined(i) && b > i;g && (j ? (d = Math.max(a - Math.floor(i / 2), 1), e = d + i - 1, e > b && (e = b, d = e - i + 1)) : (d = (Math.ceil(a / i) - 1) * i + 1, e = Math.min(d + i - 1, b)));for (var h = d; e >= h; h++) {
      var n = f(h, m(h), h === a);c.push(n);
    }if (g && i > 0 && (!j || k || l)) {
      if (d > 1) {
        if (!l || d > 3) {
          var o = f(d - 1, "...", !1);c.unshift(o);
        }if (l) {
          if (3 === d) {
            var p = f(2, "2", !1);c.unshift(p);
          }var q = f(1, "1", !1);c.unshift(q);
        }
      }if (b > e) {
        if (!l || b - 2 > e) {
          var r = f(e + 1, "...", !1);c.push(r);
        }if (l) {
          if (e === b - 2) {
            var s = f(b - 1, b - 1, !1);c.push(s);
          }var t = f(b, b, !1);c.push(t);
        }
      }
    }return c;
  }var h = this,
      i = angular.isDefined(b.maxSize) ? a.$parent.$eval(b.maxSize) : e.maxSize,
      j = angular.isDefined(b.rotate) ? a.$parent.$eval(b.rotate) : e.rotate,
      k = angular.isDefined(b.forceEllipses) ? a.$parent.$eval(b.forceEllipses) : e.forceEllipses,
      l = angular.isDefined(b.boundaryLinkNumbers) ? a.$parent.$eval(b.boundaryLinkNumbers) : e.boundaryLinkNumbers,
      m = angular.isDefined(b.pageLabel) ? function (c) {
    return a.$parent.$eval(b.pageLabel, { $page: c });
  } : angular.identity;a.boundaryLinks = angular.isDefined(b.boundaryLinks) ? a.$parent.$eval(b.boundaryLinks) : e.boundaryLinks, a.directionLinks = angular.isDefined(b.directionLinks) ? a.$parent.$eval(b.directionLinks) : e.directionLinks, b.$set("role", "menu"), d.create(this, a, b), b.maxSize && h._watchers.push(a.$parent.$watch(c(b.maxSize), function (a) {
    i = parseInt(a, 10), h.render();
  }));var n = this.render;this.render = function () {
    n(), a.page > 0 && a.page <= a.totalPages && (a.pages = g(a.page, a.totalPages));
  };
}]).constant("uibPaginationConfig", { itemsPerPage: 10, boundaryLinks: !1, boundaryLinkNumbers: !1, directionLinks: !0, firstText: "First", previousText: "Previous", nextText: "Next", lastText: "Last", rotate: !0, forceEllipses: !1 }).directive("uibPagination", ["$parse", "uibPaginationConfig", function (a, b) {
  return { scope: { totalItems: "=", firstText: "@", previousText: "@", nextText: "@", lastText: "@", ngDisabled: "=" }, require: ["uibPagination", "?ngModel"], restrict: "A", controller: "UibPaginationController", controllerAs: "pagination", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/pagination/pagination.html";
    }, link: function link(a, c, d, e) {
      c.addClass("pagination");var f = e[0],
          g = e[1];g && f.init(g, b);
    } };
}]), angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.stackedMap"]).provider("$uibTooltip", function () {
  function a(a) {
    var b = /[A-Z]/g,
        c = "-";return a.replace(b, function (a, b) {
      return (b ? c : "") + a.toLowerCase();
    });
  }var b = { placement: "top", placementClassPrefix: "", animation: !0, popupDelay: 0, popupCloseDelay: 0, useContentExp: !1 },
      c = { mouseenter: "mouseleave", click: "click", outsideClick: "outsideClick", focus: "blur", none: "" },
      d = {};this.options = function (a) {
    angular.extend(d, a);
  }, this.setTriggers = function (a) {
    angular.extend(c, a);
  }, this.$get = ["$window", "$compile", "$timeout", "$document", "$uibPosition", "$interpolate", "$rootScope", "$parse", "$$stackedMap", function (e, f, g, h, i, j, k, l, m) {
    function n(a) {
      if (27 === a.which) {
        var b = o.top();b && (b.value.close(), b = null);
      }
    }var o = m.createNew();return h.on("keyup", n), k.$on("$destroy", function () {
      h.off("keyup", n);
    }), function (e, k, m, n) {
      function p(a) {
        var b = (a || n.trigger || m).split(" "),
            d = b.map(function (a) {
          return c[a] || a;
        });return { show: b, hide: d };
      }n = angular.extend({}, b, d, n);var q = a(e),
          r = j.startSymbol(),
          s = j.endSymbol(),
          t = "<div " + q + '-popup uib-title="' + r + "title" + s + '" ' + (n.useContentExp ? 'content-exp="contentExp()" ' : 'content="' + r + "content" + s + '" ') + 'origin-scope="origScope" class="uib-position-measure ' + k + '" tooltip-animation-class="fade"uib-tooltip-classes ng-class="{ in: isOpen }" ></div>';return { compile: function compile(a, b) {
          var c = f(t);return function (a, b, d, f) {
            function j() {
              P.isOpen ? q() : m();
            }function m() {
              O && !a.$eval(d[k + "Enable"]) || (u(), x(), P.popupDelay ? H || (H = g(r, P.popupDelay, !1)) : r());
            }function q() {
              s(), P.popupCloseDelay ? I || (I = g(t, P.popupCloseDelay, !1)) : t();
            }function r() {
              return s(), u(), P.content ? (v(), void P.$evalAsync(function () {
                P.isOpen = !0, y(!0), U();
              })) : angular.noop;
            }function s() {
              H && (g.cancel(H), H = null), J && (g.cancel(J), J = null);
            }function t() {
              P && P.$evalAsync(function () {
                P && (P.isOpen = !1, y(!1), P.animation ? G || (G = g(w, 150, !1)) : w());
              });
            }function u() {
              I && (g.cancel(I), I = null), G && (g.cancel(G), G = null);
            }function v() {
              E || (F = P.$new(), E = c(F, function (a) {
                M ? h.find("body").append(a) : b.after(a);
              }), o.add(P, { close: t }), z());
            }function w() {
              s(), u(), A(), E && (E.remove(), E = null, K && g.cancel(K)), o.remove(P), F && (F.$destroy(), F = null);
            }function x() {
              P.title = d[k + "Title"], S ? P.content = S(a) : P.content = d[e], P.popupClass = d[k + "Class"], P.placement = angular.isDefined(d[k + "Placement"]) ? d[k + "Placement"] : n.placement;var b = i.parsePlacement(P.placement);L = b[1] ? b[0] + "-" + b[1] : b[0];var c = parseInt(d[k + "PopupDelay"], 10),
                  f = parseInt(d[k + "PopupCloseDelay"], 10);P.popupDelay = isNaN(c) ? n.popupDelay : c, P.popupCloseDelay = isNaN(f) ? n.popupCloseDelay : f;
            }function y(b) {
              R && angular.isFunction(R.assign) && R.assign(a, b);
            }function z() {
              T.length = 0, S ? (T.push(a.$watch(S, function (a) {
                P.content = a, !a && P.isOpen && t();
              })), T.push(F.$watch(function () {
                Q || (Q = !0, F.$$postDigest(function () {
                  Q = !1, P && P.isOpen && U();
                }));
              }))) : T.push(d.$observe(e, function (a) {
                P.content = a, !a && P.isOpen ? t() : U();
              })), T.push(d.$observe(k + "Title", function (a) {
                P.title = a, P.isOpen && U();
              })), T.push(d.$observe(k + "Placement", function (a) {
                P.placement = a ? a : n.placement, P.isOpen && U();
              }));
            }function A() {
              T.length && (angular.forEach(T, function (a) {
                a();
              }), T.length = 0);
            }function B(a) {
              P && P.isOpen && E && (b[0].contains(a.target) || E[0].contains(a.target) || q());
            }function C(a) {
              27 === a.which && q();
            }function D() {
              var c = [],
                  e = [],
                  f = a.$eval(d[k + "Trigger"]);V(), angular.isObject(f) ? (Object.keys(f).forEach(function (a) {
                c.push(a), e.push(f[a]);
              }), N = { show: c, hide: e }) : N = p(f), "none" !== N.show && N.show.forEach(function (a, c) {
                "outsideClick" === a ? (b.on("click", j), h.on("click", B)) : a === N.hide[c] ? b.on(a, j) : a && (b.on(a, m), b.on(N.hide[c], q)), b.on("keypress", C);
              });
            }var E,
                F,
                G,
                H,
                I,
                J,
                K,
                L,
                M = angular.isDefined(n.appendToBody) ? n.appendToBody : !1,
                N = p(void 0),
                O = angular.isDefined(d[k + "Enable"]),
                P = a.$new(!0),
                Q = !1,
                R = angular.isDefined(d[k + "IsOpen"]) ? l(d[k + "IsOpen"]) : !1,
                S = n.useContentExp ? l(d[e]) : !1,
                T = [],
                U = function U() {
              E && E.html() && (J || (J = g(function () {
                var a = i.positionElements(b, E, P.placement, M),
                    c = angular.isDefined(E.offsetHeight) ? E.offsetHeight : E.prop("offsetHeight"),
                    d = M ? i.offset(b) : i.position(b);E.css({ top: a.top + "px", left: a.left + "px" });var e = a.placement.split("-");E.hasClass(e[0]) || (E.removeClass(L.split("-")[0]), E.addClass(e[0])), E.hasClass(n.placementClassPrefix + a.placement) || (E.removeClass(n.placementClassPrefix + L), E.addClass(n.placementClassPrefix + a.placement)), K = g(function () {
                  var a = angular.isDefined(E.offsetHeight) ? E.offsetHeight : E.prop("offsetHeight"),
                      b = i.adjustTop(e, d, c, a);b && E.css(b), K = null;
                }, 0, !1), E.hasClass("uib-position-measure") ? (i.positionArrow(E, a.placement), E.removeClass("uib-position-measure")) : L !== a.placement && i.positionArrow(E, a.placement), L = a.placement, J = null;
              }, 0, !1)));
            };P.origScope = a, P.isOpen = !1, P.contentExp = function () {
              return P.content;
            }, d.$observe("disabled", function (a) {
              a && s(), a && P.isOpen && t();
            }), R && a.$watch(R, function (a) {
              P && !a === P.isOpen && j();
            });var V = function V() {
              N.show.forEach(function (a) {
                "outsideClick" === a ? b.off("click", j) : (b.off(a, m), b.off(a, j)), b.off("keypress", C);
              }), N.hide.forEach(function (a) {
                "outsideClick" === a ? h.off("click", B) : b.off(a, q);
              });
            };D();var W = a.$eval(d[k + "Animation"]);P.animation = angular.isDefined(W) ? !!W : n.animation;var X,
                Y = k + "AppendToBody";X = Y in d && void 0 === d[Y] ? !0 : a.$eval(d[Y]), M = angular.isDefined(X) ? X : M, a.$on("$destroy", function () {
              V(), w(), P = null;
            });
          };
        } };
    };
  }];
}).directive("uibTooltipTemplateTransclude", ["$animate", "$sce", "$compile", "$templateRequest", function (a, b, c, d) {
  return { link: function link(e, f, g) {
      var h,
          i,
          j,
          k = e.$eval(g.tooltipTemplateTranscludeScope),
          l = 0,
          m = function m() {
        i && (i.remove(), i = null), h && (h.$destroy(), h = null), j && (a.leave(j).then(function () {
          i = null;
        }), i = j, j = null);
      };e.$watch(b.parseAsResourceUrl(g.uibTooltipTemplateTransclude), function (b) {
        var g = ++l;b ? (d(b, !0).then(function (d) {
          if (g === l) {
            var e = k.$new(),
                i = d,
                n = c(i)(e, function (b) {
              m(), a.enter(b, f);
            });h = e, j = n, h.$emit("$includeContentLoaded", b);
          }
        }, function () {
          g === l && (m(), e.$emit("$includeContentError", b));
        }), e.$emit("$includeContentRequested", b)) : m();
      }), e.$on("$destroy", m);
    } };
}]).directive("uibTooltipClasses", ["$uibPosition", function (a) {
  return { restrict: "A", link: function link(b, c, d) {
      if (b.placement) {
        var e = a.parsePlacement(b.placement);c.addClass(e[0]);
      }b.popupClass && c.addClass(b.popupClass), b.animation && c.addClass(d.tooltipAnimationClass);
    } };
}]).directive("uibTooltipPopup", function () {
  return { restrict: "A", scope: { content: "@" }, templateUrl: "uib/template/tooltip/tooltip-popup.html" };
}).directive("uibTooltip", ["$uibTooltip", function (a) {
  return a("uibTooltip", "tooltip", "mouseenter");
}]).directive("uibTooltipTemplatePopup", function () {
  return { restrict: "A", scope: { contentExp: "&", originScope: "&" }, templateUrl: "uib/template/tooltip/tooltip-template-popup.html" };
}).directive("uibTooltipTemplate", ["$uibTooltip", function (a) {
  return a("uibTooltipTemplate", "tooltip", "mouseenter", { useContentExp: !0 });
}]).directive("uibTooltipHtmlPopup", function () {
  return { restrict: "A", scope: { contentExp: "&" }, templateUrl: "uib/template/tooltip/tooltip-html-popup.html" };
}).directive("uibTooltipHtml", ["$uibTooltip", function (a) {
  return a("uibTooltipHtml", "tooltip", "mouseenter", { useContentExp: !0 });
}]), angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"]).directive("uibPopoverTemplatePopup", function () {
  return { restrict: "A", scope: { uibTitle: "@", contentExp: "&", originScope: "&" }, templateUrl: "uib/template/popover/popover-template.html" };
}).directive("uibPopoverTemplate", ["$uibTooltip", function (a) {
  return a("uibPopoverTemplate", "popover", "click", { useContentExp: !0 });
}]).directive("uibPopoverHtmlPopup", function () {
  return { restrict: "A", scope: { contentExp: "&", uibTitle: "@" }, templateUrl: "uib/template/popover/popover-html.html" };
}).directive("uibPopoverHtml", ["$uibTooltip", function (a) {
  return a("uibPopoverHtml", "popover", "click", { useContentExp: !0 });
}]).directive("uibPopoverPopup", function () {
  return { restrict: "A", scope: { uibTitle: "@", content: "@" }, templateUrl: "uib/template/popover/popover.html" };
}).directive("uibPopover", ["$uibTooltip", function (a) {
  return a("uibPopover", "popover", "click");
}]), angular.module("ui.bootstrap.progressbar", []).constant("uibProgressConfig", { animate: !0, max: 100 }).controller("UibProgressController", ["$scope", "$attrs", "uibProgressConfig", function (a, b, c) {
  function d() {
    return angular.isDefined(a.maxParam) ? a.maxParam : c.max;
  }var e = this,
      f = angular.isDefined(b.animate) ? a.$parent.$eval(b.animate) : c.animate;this.bars = [], a.max = d(), this.addBar = function (a, b, c) {
    f || b.css({ transition: "none" }), this.bars.push(a), a.max = d(), a.title = c && angular.isDefined(c.title) ? c.title : "progressbar", a.$watch("value", function (b) {
      a.recalculatePercentage();
    }), a.recalculatePercentage = function () {
      var b = e.bars.reduce(function (a, b) {
        return b.percent = +(100 * b.value / b.max).toFixed(2), a + b.percent;
      }, 0);b > 100 && (a.percent -= b - 100);
    }, a.$on("$destroy", function () {
      b = null, e.removeBar(a);
    });
  }, this.removeBar = function (a) {
    this.bars.splice(this.bars.indexOf(a), 1), this.bars.forEach(function (a) {
      a.recalculatePercentage();
    });
  }, a.$watch("maxParam", function (a) {
    e.bars.forEach(function (a) {
      a.max = d(), a.recalculatePercentage();
    });
  });
}]).directive("uibProgress", function () {
  return { replace: !0, transclude: !0, controller: "UibProgressController", require: "uibProgress", scope: { maxParam: "=?max" }, templateUrl: "uib/template/progressbar/progress.html" };
}).directive("uibBar", function () {
  return { replace: !0, transclude: !0, require: "^uibProgress", scope: { value: "=", type: "@" }, templateUrl: "uib/template/progressbar/bar.html", link: function link(a, b, c, d) {
      d.addBar(a, b, c);
    } };
}).directive("uibProgressbar", function () {
  return { replace: !0, transclude: !0, controller: "UibProgressController", scope: { value: "=", maxParam: "=?max", type: "@" }, templateUrl: "uib/template/progressbar/progressbar.html", link: function link(a, b, c, d) {
      d.addBar(a, angular.element(b.children()[0]), { title: c.title });
    } };
}), angular.module("ui.bootstrap.rating", []).constant("uibRatingConfig", { max: 5, stateOn: null, stateOff: null, enableReset: !0, titles: ["one", "two", "three", "four", "five"] }).controller("UibRatingController", ["$scope", "$attrs", "uibRatingConfig", function (a, b, c) {
  var d = { $setViewValue: angular.noop },
      e = this;this.init = function (e) {
    d = e, d.$render = this.render, d.$formatters.push(function (a) {
      return angular.isNumber(a) && a << 0 !== a && (a = Math.round(a)), a;
    }), this.stateOn = angular.isDefined(b.stateOn) ? a.$parent.$eval(b.stateOn) : c.stateOn, this.stateOff = angular.isDefined(b.stateOff) ? a.$parent.$eval(b.stateOff) : c.stateOff, this.enableReset = angular.isDefined(b.enableReset) ? a.$parent.$eval(b.enableReset) : c.enableReset;var f = angular.isDefined(b.titles) ? a.$parent.$eval(b.titles) : c.titles;this.titles = angular.isArray(f) && f.length > 0 ? f : c.titles;var g = angular.isDefined(b.ratingStates) ? a.$parent.$eval(b.ratingStates) : new Array(angular.isDefined(b.max) ? a.$parent.$eval(b.max) : c.max);a.range = this.buildTemplateObjects(g);
  }, this.buildTemplateObjects = function (a) {
    for (var b = 0, c = a.length; c > b; b++) {
      a[b] = angular.extend({ index: b }, { stateOn: this.stateOn, stateOff: this.stateOff, title: this.getTitle(b) }, a[b]);
    }return a;
  }, this.getTitle = function (a) {
    return a >= this.titles.length ? a + 1 : this.titles[a];
  }, a.rate = function (b) {
    if (!a.readonly && b >= 0 && b <= a.range.length) {
      var c = e.enableReset && d.$viewValue === b ? 0 : b;d.$setViewValue(c), d.$render();
    }
  }, a.enter = function (b) {
    a.readonly || (a.value = b), a.onHover({ value: b });
  }, a.reset = function () {
    a.value = d.$viewValue, a.onLeave();
  }, a.onKeydown = function (b) {
    /(37|38|39|40)/.test(b.which) && (b.preventDefault(), b.stopPropagation(), a.rate(a.value + (38 === b.which || 39 === b.which ? 1 : -1)));
  }, this.render = function () {
    a.value = d.$viewValue, a.title = e.getTitle(a.value - 1);
  };
}]).directive("uibRating", function () {
  return { require: ["uibRating", "ngModel"], restrict: "A", scope: { readonly: "=?readOnly", onHover: "&", onLeave: "&" }, controller: "UibRatingController", templateUrl: "uib/template/rating/rating.html", link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];e.init(f);
    } };
}), angular.module("ui.bootstrap.tabs", []).controller("UibTabsetController", ["$scope", function (a) {
  function b(a) {
    for (var b = 0; b < d.tabs.length; b++) {
      if (d.tabs[b].index === a) return b;
    }
  }var c,
      d = this;d.tabs = [], d.select = function (a, f) {
    if (!e) {
      var g = b(c),
          h = d.tabs[g];if (h) {
        if (h.tab.onDeselect({ $event: f, $selectedIndex: a }), f && f.isDefaultPrevented()) return;h.tab.active = !1;
      }var i = d.tabs[a];i ? (i.tab.onSelect({ $event: f }), i.tab.active = !0, d.active = i.index, c = i.index) : !i && angular.isDefined(c) && (d.active = null, c = null);
    }
  }, d.addTab = function (a) {
    if (d.tabs.push({ tab: a, index: a.index }), d.tabs.sort(function (a, b) {
      return a.index > b.index ? 1 : a.index < b.index ? -1 : 0;
    }), a.index === d.active || !angular.isDefined(d.active) && 1 === d.tabs.length) {
      var c = b(a.index);d.select(c);
    }
  }, d.removeTab = function (a) {
    for (var b, c = 0; c < d.tabs.length; c++) {
      if (d.tabs[c].tab === a) {
        b = c;break;
      }
    }if (d.tabs[b].index === d.active) {
      var e = b === d.tabs.length - 1 ? b - 1 : b + 1 % d.tabs.length;d.select(e);
    }d.tabs.splice(b, 1);
  }, a.$watch("tabset.active", function (a) {
    angular.isDefined(a) && a !== c && d.select(b(a));
  });var e;a.$on("$destroy", function () {
    e = !0;
  });
}]).directive("uibTabset", function () {
  return { transclude: !0, replace: !0, scope: {}, bindToController: { active: "=?", type: "@" }, controller: "UibTabsetController", controllerAs: "tabset", templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/tabs/tabset.html";
    }, link: function link(a, b, c) {
      a.vertical = angular.isDefined(c.vertical) ? a.$parent.$eval(c.vertical) : !1, a.justified = angular.isDefined(c.justified) ? a.$parent.$eval(c.justified) : !1;
    } };
}).directive("uibTab", ["$parse", function (a) {
  return { require: "^uibTabset", replace: !0, templateUrl: function templateUrl(a, b) {
      return b.templateUrl || "uib/template/tabs/tab.html";
    }, transclude: !0, scope: { heading: "@", index: "=?", classes: "@?", onSelect: "&select", onDeselect: "&deselect" }, controller: function controller() {}, controllerAs: "tab", link: function link(b, c, d, e, f) {
      b.disabled = !1, d.disable && b.$parent.$watch(a(d.disable), function (a) {
        b.disabled = !!a;
      }), angular.isUndefined(d.index) && (e.tabs && e.tabs.length ? b.index = Math.max.apply(null, e.tabs.map(function (a) {
        return a.index;
      })) + 1 : b.index = 0), angular.isUndefined(d.classes) && (b.classes = ""), b.select = function (a) {
        if (!b.disabled) {
          for (var c, d = 0; d < e.tabs.length; d++) {
            if (e.tabs[d].tab === b) {
              c = d;break;
            }
          }e.select(c, a);
        }
      }, e.addTab(b), b.$on("$destroy", function () {
        e.removeTab(b);
      }), b.$transcludeFn = f;
    } };
}]).directive("uibTabHeadingTransclude", function () {
  return { restrict: "A", require: "^uibTab", link: function link(a, b) {
      a.$watch("headingElement", function (a) {
        a && (b.html(""), b.append(a));
      });
    } };
}).directive("uibTabContentTransclude", function () {
  function a(a) {
    return a.tagName && (a.hasAttribute("uib-tab-heading") || a.hasAttribute("data-uib-tab-heading") || a.hasAttribute("x-uib-tab-heading") || "uib-tab-heading" === a.tagName.toLowerCase() || "data-uib-tab-heading" === a.tagName.toLowerCase() || "x-uib-tab-heading" === a.tagName.toLowerCase() || "uib:tab-heading" === a.tagName.toLowerCase());
  }return { restrict: "A", require: "^uibTabset", link: function link(b, c, d) {
      var e = b.$eval(d.uibTabContentTransclude).tab;e.$transcludeFn(e.$parent, function (b) {
        angular.forEach(b, function (b) {
          a(b) ? e.headingElement = b : c.append(b);
        });
      });
    } };
}), angular.module("ui.bootstrap.timepicker", []).constant("uibTimepickerConfig", { hourStep: 1, minuteStep: 1, secondStep: 1, showMeridian: !0, showSeconds: !1, meridians: null, readonlyInput: !1, mousewheel: !0, arrowkeys: !0, showSpinners: !0, templateUrl: "uib/template/timepicker/timepicker.html" }).controller("UibTimepickerController", ["$scope", "$element", "$attrs", "$parse", "$log", "$locale", "uibTimepickerConfig", function (a, b, c, d, e, f, g) {
  function h() {
    var b = +a.hours,
        c = a.showMeridian ? b > 0 && 13 > b : b >= 0 && 24 > b;return c && "" !== a.hours ? (a.showMeridian && (12 === b && (b = 0), a.meridian === y[1] && (b += 12)), b) : void 0;
  }function i() {
    var b = +a.minutes,
        c = b >= 0 && 60 > b;return c && "" !== a.minutes ? b : void 0;
  }function j() {
    var b = +a.seconds;return b >= 0 && 60 > b ? b : void 0;
  }function k(a, b) {
    return null === a ? "" : angular.isDefined(a) && a.toString().length < 2 && !b ? "0" + a : a.toString();
  }function l(a) {
    m(), x.$setViewValue(new Date(v)), n(a);
  }function m() {
    s && s.$setValidity("hours", !0), t && t.$setValidity("minutes", !0), u && u.$setValidity("seconds", !0), x.$setValidity("time", !0), a.invalidHours = !1, a.invalidMinutes = !1, a.invalidSeconds = !1;
  }function n(b) {
    if (x.$modelValue) {
      var c = v.getHours(),
          d = v.getMinutes(),
          e = v.getSeconds();a.showMeridian && (c = 0 === c || 12 === c ? 12 : c % 12), a.hours = "h" === b ? c : k(c, !z), "m" !== b && (a.minutes = k(d)), a.meridian = v.getHours() < 12 ? y[0] : y[1], "s" !== b && (a.seconds = k(e)), a.meridian = v.getHours() < 12 ? y[0] : y[1];
    } else a.hours = null, a.minutes = null, a.seconds = null, a.meridian = y[0];
  }function o(a) {
    v = q(v, a), l();
  }function p(a, b) {
    return q(a, 60 * b);
  }function q(a, b) {
    var c = new Date(a.getTime() + 1e3 * b),
        d = new Date(a);return d.setHours(c.getHours(), c.getMinutes(), c.getSeconds()), d;
  }function r() {
    return (null === a.hours || "" === a.hours) && (null === a.minutes || "" === a.minutes) && (!a.showSeconds || a.showSeconds && (null === a.seconds || "" === a.seconds));
  }var s,
      t,
      u,
      v = new Date(),
      w = [],
      x = { $setViewValue: angular.noop },
      y = angular.isDefined(c.meridians) ? a.$parent.$eval(c.meridians) : g.meridians || f.DATETIME_FORMATS.AMPMS,
      z = angular.isDefined(c.padHours) ? a.$parent.$eval(c.padHours) : !0;a.tabindex = angular.isDefined(c.tabindex) ? c.tabindex : 0, b.removeAttr("tabindex"), this.init = function (b, d) {
    x = b, x.$render = this.render, x.$formatters.unshift(function (a) {
      return a ? new Date(a) : null;
    });var e = d.eq(0),
        f = d.eq(1),
        h = d.eq(2);s = e.controller("ngModel"), t = f.controller("ngModel"), u = h.controller("ngModel");var i = angular.isDefined(c.mousewheel) ? a.$parent.$eval(c.mousewheel) : g.mousewheel;i && this.setupMousewheelEvents(e, f, h);var j = angular.isDefined(c.arrowkeys) ? a.$parent.$eval(c.arrowkeys) : g.arrowkeys;j && this.setupArrowkeyEvents(e, f, h), a.readonlyInput = angular.isDefined(c.readonlyInput) ? a.$parent.$eval(c.readonlyInput) : g.readonlyInput, this.setupInputEvents(e, f, h);
  };var A = g.hourStep;c.hourStep && w.push(a.$parent.$watch(d(c.hourStep), function (a) {
    A = +a;
  }));var B = g.minuteStep;c.minuteStep && w.push(a.$parent.$watch(d(c.minuteStep), function (a) {
    B = +a;
  }));var C;w.push(a.$parent.$watch(d(c.min), function (a) {
    var b = new Date(a);C = isNaN(b) ? void 0 : b;
  }));var D;w.push(a.$parent.$watch(d(c.max), function (a) {
    var b = new Date(a);D = isNaN(b) ? void 0 : b;
  }));var E = !1;c.ngDisabled && w.push(a.$parent.$watch(d(c.ngDisabled), function (a) {
    E = a;
  })), a.noIncrementHours = function () {
    var a = p(v, 60 * A);return E || a > D || v > a && C > a;
  }, a.noDecrementHours = function () {
    var a = p(v, 60 * -A);return E || C > a || a > v && a > D;
  }, a.noIncrementMinutes = function () {
    var a = p(v, B);return E || a > D || v > a && C > a;
  }, a.noDecrementMinutes = function () {
    var a = p(v, -B);return E || C > a || a > v && a > D;
  }, a.noIncrementSeconds = function () {
    var a = q(v, F);return E || a > D || v > a && C > a;
  }, a.noDecrementSeconds = function () {
    var a = q(v, -F);return E || C > a || a > v && a > D;
  }, a.noToggleMeridian = function () {
    return v.getHours() < 12 ? E || p(v, 720) > D : E || p(v, -720) < C;
  };var F = g.secondStep;c.secondStep && w.push(a.$parent.$watch(d(c.secondStep), function (a) {
    F = +a;
  })), a.showSeconds = g.showSeconds, c.showSeconds && w.push(a.$parent.$watch(d(c.showSeconds), function (b) {
    a.showSeconds = !!b;
  })), a.showMeridian = g.showMeridian, c.showMeridian && w.push(a.$parent.$watch(d(c.showMeridian), function (b) {
    if (a.showMeridian = !!b, x.$error.time) {
      var c = h(),
          d = i();angular.isDefined(c) && angular.isDefined(d) && (v.setHours(c), l());
    } else n();
  })), this.setupMousewheelEvents = function (b, c, d) {
    var e = function e(a) {
      a.originalEvent && (a = a.originalEvent);var b = a.wheelDelta ? a.wheelDelta : -a.deltaY;return a.detail || b > 0;
    };b.on("mousewheel wheel", function (b) {
      E || a.$apply(e(b) ? a.incrementHours() : a.decrementHours()), b.preventDefault();
    }), c.on("mousewheel wheel", function (b) {
      E || a.$apply(e(b) ? a.incrementMinutes() : a.decrementMinutes()), b.preventDefault();
    }), d.on("mousewheel wheel", function (b) {
      E || a.$apply(e(b) ? a.incrementSeconds() : a.decrementSeconds()), b.preventDefault();
    });
  }, this.setupArrowkeyEvents = function (b, c, d) {
    b.on("keydown", function (b) {
      E || (38 === b.which ? (b.preventDefault(), a.incrementHours(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementHours(), a.$apply()));
    }), c.on("keydown", function (b) {
      E || (38 === b.which ? (b.preventDefault(), a.incrementMinutes(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementMinutes(), a.$apply()));
    }), d.on("keydown", function (b) {
      E || (38 === b.which ? (b.preventDefault(), a.incrementSeconds(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementSeconds(), a.$apply()));
    });
  }, this.setupInputEvents = function (b, c, d) {
    if (a.readonlyInput) return a.updateHours = angular.noop, a.updateMinutes = angular.noop, void (a.updateSeconds = angular.noop);var e = function e(b, c, d) {
      x.$setViewValue(null), x.$setValidity("time", !1), angular.isDefined(b) && (a.invalidHours = b, s && s.$setValidity("hours", !1)), angular.isDefined(c) && (a.invalidMinutes = c, t && t.$setValidity("minutes", !1)), angular.isDefined(d) && (a.invalidSeconds = d, u && u.$setValidity("seconds", !1));
    };a.updateHours = function () {
      var a = h(),
          b = i();x.$setDirty(), angular.isDefined(a) && angular.isDefined(b) ? (v.setHours(a), v.setMinutes(b), C > v || v > D ? e(!0) : l("h")) : e(!0);
    }, b.on("blur", function (b) {
      x.$setTouched(), r() ? m() : null === a.hours || "" === a.hours ? e(!0) : !a.invalidHours && a.hours < 10 && a.$apply(function () {
        a.hours = k(a.hours, !z);
      });
    }), a.updateMinutes = function () {
      var a = i(),
          b = h();x.$setDirty(), angular.isDefined(a) && angular.isDefined(b) ? (v.setHours(b), v.setMinutes(a), C > v || v > D ? e(void 0, !0) : l("m")) : e(void 0, !0);
    }, c.on("blur", function (b) {
      x.$setTouched(), r() ? m() : null === a.minutes ? e(void 0, !0) : !a.invalidMinutes && a.minutes < 10 && a.$apply(function () {
        a.minutes = k(a.minutes);
      });
    }), a.updateSeconds = function () {
      var a = j();x.$setDirty(), angular.isDefined(a) ? (v.setSeconds(a), l("s")) : e(void 0, void 0, !0);
    }, d.on("blur", function (b) {
      r() ? m() : !a.invalidSeconds && a.seconds < 10 && a.$apply(function () {
        a.seconds = k(a.seconds);
      });
    });
  }, this.render = function () {
    var b = x.$viewValue;isNaN(b) ? (x.$setValidity("time", !1), e.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (b && (v = b), C > v || v > D ? (x.$setValidity("time", !1), a.invalidHours = !0, a.invalidMinutes = !0) : m(), n());
  }, a.showSpinners = angular.isDefined(c.showSpinners) ? a.$parent.$eval(c.showSpinners) : g.showSpinners, a.incrementHours = function () {
    a.noIncrementHours() || o(60 * A * 60);
  }, a.decrementHours = function () {
    a.noDecrementHours() || o(60 * -A * 60);
  }, a.incrementMinutes = function () {
    a.noIncrementMinutes() || o(60 * B);
  }, a.decrementMinutes = function () {
    a.noDecrementMinutes() || o(60 * -B);
  }, a.incrementSeconds = function () {
    a.noIncrementSeconds() || o(F);
  }, a.decrementSeconds = function () {
    a.noDecrementSeconds() || o(-F);
  }, a.toggleMeridian = function () {
    var b = i(),
        c = h();a.noToggleMeridian() || (angular.isDefined(b) && angular.isDefined(c) ? o(720 * (v.getHours() < 12 ? 60 : -60)) : a.meridian = a.meridian === y[0] ? y[1] : y[0]);
  }, a.blur = function () {
    x.$setTouched();
  }, a.$on("$destroy", function () {
    for (; w.length;) {
      w.shift()();
    }
  });
}]).directive("uibTimepicker", ["uibTimepickerConfig", function (a) {
  return { require: ["uibTimepicker", "?^ngModel"], restrict: "A", controller: "UibTimepickerController", controllerAs: "timepicker", scope: {}, templateUrl: function templateUrl(b, c) {
      return c.templateUrl || a.templateUrl;
    }, link: function link(a, b, c, d) {
      var e = d[0],
          f = d[1];f && e.init(f, b.find("input"));
    } };
}]), angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.debounce", "ui.bootstrap.position"]).factory("uibTypeaheadParser", ["$parse", function (a) {
  var b = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;return { parse: function parse(c) {
      var d = c.match(b);if (!d) throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + c + '".');return { itemName: d[3], source: a(d[4]), viewMapper: a(d[2] || d[1]), modelMapper: a(d[1]) };
    } };
}]).controller("UibTypeaheadController", ["$scope", "$element", "$attrs", "$compile", "$parse", "$q", "$timeout", "$document", "$window", "$rootScope", "$$debounce", "$uibPosition", "uibTypeaheadParser", function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
  function n() {
    P.moveInProgress || (P.moveInProgress = !0, P.$digest()), $();
  }function o() {
    P.position = F ? l.offset(b) : l.position(b), P.position.top += b.prop("offsetHeight");
  }function p(a) {
    var b;return angular.version.minor < 6 ? (b = a.$options || {}, b.getOption = function (a) {
      return b[a];
    }) : b = a.$options, b;
  }var q,
      r,
      s = [9, 13, 27, 38, 40],
      t = 200,
      u = a.$eval(c.typeaheadMinLength);u || 0 === u || (u = 1), a.$watch(c.typeaheadMinLength, function (a) {
    u = a || 0 === a ? a : 1;
  });var v = a.$eval(c.typeaheadWaitMs) || 0,
      w = a.$eval(c.typeaheadEditable) !== !1;a.$watch(c.typeaheadEditable, function (a) {
    w = a !== !1;
  });var x,
      y,
      z = e(c.typeaheadLoading).assign || angular.noop,
      A = c.typeaheadShouldSelect ? e(c.typeaheadShouldSelect) : function (a, b) {
    var c = b.$event;return 13 === c.which || 9 === c.which;
  },
      B = e(c.typeaheadOnSelect),
      C = angular.isDefined(c.typeaheadSelectOnBlur) ? a.$eval(c.typeaheadSelectOnBlur) : !1,
      D = e(c.typeaheadNoResults).assign || angular.noop,
      E = c.typeaheadInputFormatter ? e(c.typeaheadInputFormatter) : void 0,
      F = c.typeaheadAppendToBody ? a.$eval(c.typeaheadAppendToBody) : !1,
      G = c.typeaheadAppendTo ? a.$eval(c.typeaheadAppendTo) : null,
      H = a.$eval(c.typeaheadFocusFirst) !== !1,
      I = c.typeaheadSelectOnExact ? a.$eval(c.typeaheadSelectOnExact) : !1,
      J = e(c.typeaheadIsOpen).assign || angular.noop,
      K = a.$eval(c.typeaheadShowHint) || !1,
      L = e(c.ngModel),
      M = e(c.ngModel + "($$$p)"),
      N = function N(b, c) {
    return angular.isFunction(L(a)) && r.getOption("getterSetter") ? M(b, { $$$p: c }) : L.assign(b, c);
  },
      O = m.parse(c.uibTypeahead),
      P = a.$new(),
      Q = a.$on("$destroy", function () {
    P.$destroy();
  });P.$on("$destroy", Q);var R = "typeahead-" + P.$id + "-" + Math.floor(1e4 * Math.random());b.attr({ "aria-autocomplete": "list", "aria-expanded": !1, "aria-owns": R });var S, T;K && (S = angular.element("<div></div>"), S.css("position", "relative"), b.after(S), T = b.clone(), T.attr("placeholder", ""), T.attr("tabindex", "-1"), T.val(""), T.css({ position: "absolute", top: "0px", left: "0px", "border-color": "transparent", "box-shadow": "none", opacity: 1, background: "none 0% 0% / auto repeat scroll padding-box border-box rgb(255, 255, 255)", color: "#999" }), b.css({ position: "relative", "vertical-align": "top", "background-color": "transparent" }), T.attr("id") && T.removeAttr("id"), S.append(T), T.after(b));var U = angular.element("<div uib-typeahead-popup></div>");U.attr({ id: R, matches: "matches", active: "activeIdx", select: "select(activeIdx, evt)", "move-in-progress": "moveInProgress", query: "query", position: "position", "assign-is-open": "assignIsOpen(isOpen)", debounce: "debounceUpdate" }), angular.isDefined(c.typeaheadTemplateUrl) && U.attr("template-url", c.typeaheadTemplateUrl), angular.isDefined(c.typeaheadPopupTemplateUrl) && U.attr("popup-template-url", c.typeaheadPopupTemplateUrl);var V = function V() {
    K && T.val("");
  },
      W = function W() {
    P.matches = [], P.activeIdx = -1, b.attr("aria-expanded", !1), V();
  },
      X = function X(a) {
    return R + "-option-" + a;
  };P.$watch("activeIdx", function (a) {
    0 > a ? b.removeAttr("aria-activedescendant") : b.attr("aria-activedescendant", X(a));
  });var Y = function Y(a, b) {
    return P.matches.length > b && a ? a.toUpperCase() === P.matches[b].label.toUpperCase() : !1;
  },
      Z = function Z(c, d) {
    var e = { $viewValue: c };z(a, !0), D(a, !1), f.when(O.source(a, e)).then(function (f) {
      var g = c === q.$viewValue;if (g && x) if (f && f.length > 0) {
        P.activeIdx = H ? 0 : -1, D(a, !1), P.matches.length = 0;for (var h = 0; h < f.length; h++) {
          e[O.itemName] = f[h], P.matches.push({ id: X(h), label: O.viewMapper(P, e), model: f[h] });
        }if (P.query = c, o(), b.attr("aria-expanded", !0), I && 1 === P.matches.length && Y(c, 0) && (angular.isNumber(P.debounceUpdate) || angular.isObject(P.debounceUpdate) ? k(function () {
          P.select(0, d);
        }, angular.isNumber(P.debounceUpdate) ? P.debounceUpdate : P.debounceUpdate["default"]) : P.select(0, d)), K) {
          var i = P.matches[0].label;angular.isString(c) && c.length > 0 && i.slice(0, c.length).toUpperCase() === c.toUpperCase() ? T.val(c + i.slice(c.length)) : T.val("");
        }
      } else W(), D(a, !0);g && z(a, !1);
    }, function () {
      W(), z(a, !1), D(a, !0);
    });
  };F && (angular.element(i).on("resize", n), h.find("body").on("scroll", n));var $ = k(function () {
    P.matches.length && o(), P.moveInProgress = !1;
  }, t);P.moveInProgress = !1, P.query = void 0;var _,
      aa = function aa(a) {
    _ = g(function () {
      Z(a);
    }, v);
  },
      ba = function ba() {
    _ && g.cancel(_);
  };W(), P.assignIsOpen = function (b) {
    J(a, b);
  }, P.select = function (d, e) {
    var f,
        h,
        i = {};y = !0, i[O.itemName] = h = P.matches[d].model, f = O.modelMapper(a, i), N(a, f), q.$setValidity("editable", !0), q.$setValidity("parse", !0), B(a, { $item: h, $model: f, $label: O.viewMapper(a, i), $event: e }), W(), P.$eval(c.typeaheadFocusOnSelect) !== !1 && g(function () {
      b[0].focus();
    }, 0, !1);
  }, b.on("keydown", function (b) {
    if (0 !== P.matches.length && -1 !== s.indexOf(b.which)) {
      var c = A(a, { $event: b });if (-1 === P.activeIdx && c || 9 === b.which && b.shiftKey) return W(), void P.$digest();b.preventDefault();var d;switch (b.which) {case 27:
          b.stopPropagation(), W(), a.$digest();break;case 38:
          P.activeIdx = (P.activeIdx > 0 ? P.activeIdx : P.matches.length) - 1, P.$digest(), d = U[0].querySelectorAll(".uib-typeahead-match")[P.activeIdx], d.parentNode.scrollTop = d.offsetTop;break;case 40:
          P.activeIdx = (P.activeIdx + 1) % P.matches.length, P.$digest(), d = U[0].querySelectorAll(".uib-typeahead-match")[P.activeIdx], d.parentNode.scrollTop = d.offsetTop;break;default:
          c && P.$apply(function () {
            angular.isNumber(P.debounceUpdate) || angular.isObject(P.debounceUpdate) ? k(function () {
              P.select(P.activeIdx, b);
            }, angular.isNumber(P.debounceUpdate) ? P.debounceUpdate : P.debounceUpdate["default"]) : P.select(P.activeIdx, b);
          });}
    }
  }), b.on("focus", function (a) {
    x = !0, 0 !== u || q.$viewValue || g(function () {
      Z(q.$viewValue, a);
    }, 0);
  }), b.on("blur", function (a) {
    C && P.matches.length && -1 !== P.activeIdx && !y && (y = !0, P.$apply(function () {
      angular.isObject(P.debounceUpdate) && angular.isNumber(P.debounceUpdate.blur) ? k(function () {
        P.select(P.activeIdx, a);
      }, P.debounceUpdate.blur) : P.select(P.activeIdx, a);
    })), !w && q.$error.editable && (q.$setViewValue(), P.$apply(function () {
      q.$setValidity("editable", !0), q.$setValidity("parse", !0);
    }), b.val("")), x = !1, y = !1;
  });var ca = function ca(c) {
    b[0] !== c.target && 3 !== c.which && 0 !== P.matches.length && (W(), j.$$phase || a.$digest());
  };h.on("click", ca), a.$on("$destroy", function () {
    h.off("click", ca), (F || G) && da.remove(), F && (angular.element(i).off("resize", n), h.find("body").off("scroll", n)), U.remove(), K && S.remove();
  });var da = d(U)(P);F ? h.find("body").append(da) : G ? angular.element(G).eq(0).append(da) : b.after(da), this.init = function (b) {
    q = b, r = p(q), P.debounceUpdate = e(r.getOption("debounce"))(a), q.$parsers.unshift(function (b) {
      return x = !0, 0 === u || b && b.length >= u ? v > 0 ? (ba(), aa(b)) : Z(b) : (z(a, !1), ba(), W()), w ? b : b ? void q.$setValidity("editable", !1) : (q.$setValidity("editable", !0), null);
    }), q.$formatters.push(function (b) {
      var c,
          d,
          e = {};return w || q.$setValidity("editable", !0), E ? (e.$model = b, E(a, e)) : (e[O.itemName] = b, c = O.viewMapper(a, e), e[O.itemName] = void 0, d = O.viewMapper(a, e), c !== d ? c : b);
    });
  };
}]).directive("uibTypeahead", function () {
  return { controller: "UibTypeaheadController", require: ["ngModel", "uibTypeahead"], link: function link(a, b, c, d) {
      d[1].init(d[0]);
    } };
}).directive("uibTypeaheadPopup", ["$$debounce", function (a) {
  return { scope: { matches: "=", query: "=", active: "=", position: "&", moveInProgress: "=", select: "&", assignIsOpen: "&", debounce: "&" }, replace: !0, templateUrl: function templateUrl(a, b) {
      return b.popupTemplateUrl || "uib/template/typeahead/typeahead-popup.html";
    }, link: function link(b, c, d) {
      b.templateUrl = d.templateUrl, b.isOpen = function () {
        var a = b.matches.length > 0;return b.assignIsOpen({ isOpen: a }), a;
      }, b.isActive = function (a) {
        return b.active === a;
      }, b.selectActive = function (a) {
        b.active = a;
      }, b.selectMatch = function (c, d) {
        var e = b.debounce();angular.isNumber(e) || angular.isObject(e) ? a(function () {
          b.select({ activeIdx: c, evt: d });
        }, angular.isNumber(e) ? e : e["default"]) : b.select({ activeIdx: c, evt: d });
      };
    } };
}]).directive("uibTypeaheadMatch", ["$templateRequest", "$compile", "$parse", function (a, b, c) {
  return { scope: { index: "=", match: "=", query: "=" }, link: function link(d, e, f) {
      var g = c(f.templateUrl)(d.$parent) || "uib/template/typeahead/typeahead-match.html";a(g).then(function (a) {
        var c = angular.element(a.trim());e.replaceWith(c), b(c)(d);
      });
    } };
}]).filter("uibTypeaheadHighlight", ["$sce", "$injector", "$log", function (a, b, c) {
  function d(a) {
    return a.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }function e(a) {
    return (/<.*>/g.test(a)
    );
  }var f;return f = b.has("$sanitize"), function (b, g) {
    return !f && e(b) && c.warn("Unsafe use of typeahead please use ngSanitize"), b = g ? ("" + b).replace(new RegExp(d(g), "gi"), "<strong>$&</strong>") : b, f || (b = a.trustAsHtml(b)), b;
  };
}]), angular.module("uib/template/accordion/accordion-group.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/accordion/accordion-group.html", '<div role="tab" id="{{::headingId}}" aria-selected="{{isOpen}}" class="panel-heading" ng-keypress="toggleOpen($event)">\n  <h4 class="panel-title">\n    <a role="button" data-toggle="collapse" href aria-expanded="{{isOpen}}" aria-controls="{{::panelId}}" tabindex="0" class="accordion-toggle" ng-click="toggleOpen()" uib-accordion-transclude="heading" ng-disabled="isDisabled" uib-tabindex-toggle><span uib-accordion-header ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n  </h4>\n</div>\n<div id="{{::panelId}}" aria-labelledby="{{::headingId}}" aria-hidden="{{!isOpen}}" role="tabpanel" class="panel-collapse collapse" uib-collapse="!isOpen">\n  <div class="panel-body" ng-transclude></div>\n</div>\n');
}]), angular.module("uib/template/accordion/accordion.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/accordion/accordion.html", '<div role="tablist" class="panel-group" ng-transclude></div>');
}]), angular.module("uib/template/alert/alert.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/alert/alert.html", '<button ng-show="closeable" type="button" class="close" ng-click="close({$event: $event})">\n  <span aria-hidden="true">&times;</span>\n  <span class="sr-only">Close</span>\n</button>\n<div ng-transclude></div>\n');
}]), angular.module("uib/template/carousel/carousel.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/carousel/carousel.html", '<div class="carousel-inner" ng-transclude></div>\n<a role="button" href class="left carousel-control" ng-click="prev()" ng-class="{ disabled: isPrevDisabled() }" ng-show="slides.length > 1">\n  <span aria-hidden="true" class="glyphicon glyphicon-chevron-left"></span>\n  <span class="sr-only">previous</span>\n</a>\n<a role="button" href class="right carousel-control" ng-click="next()" ng-class="{ disabled: isNextDisabled() }" ng-show="slides.length > 1">\n  <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>\n  <span class="sr-only">next</span>\n</a>\n<ol class="carousel-indicators" ng-show="slides.length > 1">\n  <li ng-repeat="slide in slides | orderBy:indexOfSlide track by $index" ng-class="{ active: isActive(slide) }" ng-click="select(slide)">\n    <span class="sr-only">slide {{ $index + 1 }} of {{ slides.length }}<span ng-if="isActive(slide)">, currently active</span></span>\n  </li>\n</ol>\n');
}]), angular.module("uib/template/carousel/slide.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/carousel/slide.html", '<div class="text-center" ng-transclude></div>\n');
}]), angular.module("uib/template/datepicker/datepicker.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/datepicker/datepicker.html", '<div ng-switch="datepickerMode">\n  <div uib-daypicker ng-switch-when="day" tabindex="0" class="uib-daypicker"></div>\n  <div uib-monthpicker ng-switch-when="month" tabindex="0" class="uib-monthpicker"></div>\n  <div uib-yearpicker ng-switch-when="year" tabindex="0" class="uib-yearpicker"></div>\n</div>\n');
}]), angular.module("uib/template/datepicker/day.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/datepicker/day.html", '<table role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left uib-left" ng-click="move(-1)" tabindex="-1"><i aria-hidden="true" class="glyphicon glyphicon-chevron-left"></i><span class="sr-only">previous</span></button></th>\n      <th colspan="{{::5 + showWeeks}}"><button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm uib-title" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right uib-right" ng-click="move(1)" tabindex="-1"><i aria-hidden="true" class="glyphicon glyphicon-chevron-right"></i><span class="sr-only">next</span></button></th>\n    </tr>\n    <tr>\n      <th ng-if="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in ::labels track by $index" class="text-center"><small aria-label="{{::label.full}}">{{::label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="uib-weeks" ng-repeat="row in rows track by $index" role="row">\n      <td ng-if="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row" class="uib-day text-center" role="gridcell"\n        id="{{::dt.uid}}"\n        ng-class="::dt.customClass">\n        <button type="button" class="btn btn-default btn-sm"\n          uib-is-class="\n            \'btn-info\' for selectedDt,\n            \'active\' for activeDt\n            on dt"\n          ng-click="select(dt.date)"\n          ng-disabled="::dt.disabled"\n          tabindex="-1"><span ng-class="::{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n');
}]), angular.module("uib/template/datepicker/month.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/datepicker/month.html", '<table role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left uib-left" ng-click="move(-1)" tabindex="-1"><i aria-hidden="true" class="glyphicon glyphicon-chevron-left"></i><span class="sr-only">previous</span></button></th>\n      <th colspan="{{::yearHeaderColspan}}"><button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm uib-title" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right uib-right" ng-click="move(1)" tabindex="-1"><i aria-hidden="true" class="glyphicon glyphicon-chevron-right"></i><span class="sr-only">next</span></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="uib-months" ng-repeat="row in rows track by $index" role="row">\n      <td ng-repeat="dt in row" class="uib-month text-center" role="gridcell"\n        id="{{::dt.uid}}"\n        ng-class="::dt.customClass">\n        <button type="button" class="btn btn-default"\n          uib-is-class="\n            \'btn-info\' for selectedDt,\n            \'active\' for activeDt\n            on dt"\n          ng-click="select(dt.date)"\n          ng-disabled="::dt.disabled"\n          tabindex="-1"><span ng-class="::{\'text-info\': dt.current}">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n');
}]), angular.module("uib/template/datepicker/year.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/datepicker/year.html", '<table role="grid" aria-labelledby="{{::uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left uib-left" ng-click="move(-1)" tabindex="-1"><i aria-hidden="true" class="glyphicon glyphicon-chevron-left"></i><span class="sr-only">previous</span></button></th>\n      <th colspan="{{::columns - 2}}"><button id="{{::uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm uib-title" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right uib-right" ng-click="move(1)" tabindex="-1"><i aria-hidden="true" class="glyphicon glyphicon-chevron-right"></i><span class="sr-only">next</span></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="uib-years" ng-repeat="row in rows track by $index" role="row">\n      <td ng-repeat="dt in row" class="uib-year text-center" role="gridcell"\n        id="{{::dt.uid}}"\n        ng-class="::dt.customClass">\n        <button type="button" class="btn btn-default"\n          uib-is-class="\n            \'btn-info\' for selectedDt,\n            \'active\' for activeDt\n            on dt"\n          ng-click="select(dt.date)"\n          ng-disabled="::dt.disabled"\n          tabindex="-1"><span ng-class="::{\'text-info\': dt.current}">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n');
}]), angular.module("uib/template/datepickerPopup/popup.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/datepickerPopup/popup.html", '<ul role="presentation" class="uib-datepicker-popup dropdown-menu uib-position-measure" dropdown-nested ng-if="isOpen" ng-keydown="keydown($event)" ng-click="$event.stopPropagation()">\n  <li ng-transclude></li>\n  <li ng-if="showButtonBar" class="uib-button-bar">\n    <span class="btn-group pull-left">\n      <button type="button" class="btn btn-sm btn-info uib-datepicker-current" ng-click="select(\'today\', $event)" ng-disabled="isDisabled(\'today\')">{{ getText(\'current\') }}</button>\n      <button type="button" class="btn btn-sm btn-danger uib-clear" ng-click="select(null, $event)">{{ getText(\'clear\') }}</button>\n    </span>\n    <button type="button" class="btn btn-sm btn-success pull-right uib-close" ng-click="close($event)">{{ getText(\'close\') }}</button>\n  </li>\n</ul>\n');
}]), angular.module("uib/template/modal/window.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/modal/window.html", "<div class=\"modal-dialog {{size ? 'modal-' + size : ''}}\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n");
}]), angular.module("uib/template/pager/pager.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/pager/pager.html", '<li ng-class="{disabled: noPrevious()||ngDisabled, previous: align}"><a href ng-click="selectPage(page - 1, $event)" ng-disabled="noPrevious()||ngDisabled" uib-tabindex-toggle>{{::getText(\'previous\')}}</a></li>\n<li ng-class="{disabled: noNext()||ngDisabled, next: align}"><a href ng-click="selectPage(page + 1, $event)" ng-disabled="noNext()||ngDisabled" uib-tabindex-toggle>{{::getText(\'next\')}}</a></li>\n');
}]), angular.module("uib/template/pagination/pagination.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/pagination/pagination.html", '<li role="menuitem" ng-if="::boundaryLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-first"><a href ng-click="selectPage(1, $event)" ng-disabled="noPrevious()||ngDisabled" uib-tabindex-toggle>{{::getText(\'first\')}}</a></li>\n<li role="menuitem" ng-if="::directionLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-prev"><a href ng-click="selectPage(page - 1, $event)" ng-disabled="noPrevious()||ngDisabled" uib-tabindex-toggle>{{::getText(\'previous\')}}</a></li>\n<li role="menuitem" ng-repeat="page in pages track by $index" ng-class="{active: page.active,disabled: ngDisabled&&!page.active}" class="pagination-page"><a href ng-click="selectPage(page.number, $event)" ng-disabled="ngDisabled&&!page.active" uib-tabindex-toggle>{{page.text}}</a></li>\n<li role="menuitem" ng-if="::directionLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-next"><a href ng-click="selectPage(page + 1, $event)" ng-disabled="noNext()||ngDisabled" uib-tabindex-toggle>{{::getText(\'next\')}}</a></li>\n<li role="menuitem" ng-if="::boundaryLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-last"><a href ng-click="selectPage(totalPages, $event)" ng-disabled="noNext()||ngDisabled" uib-tabindex-toggle>{{::getText(\'last\')}}</a></li>\n');
}]), angular.module("uib/template/tooltip/tooltip-html-popup.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/tooltip/tooltip-html-popup.html", '<div class="tooltip-arrow"></div>\n<div class="tooltip-inner" ng-bind-html="contentExp()"></div>\n');
}]), angular.module("uib/template/tooltip/tooltip-popup.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/tooltip/tooltip-popup.html", '<div class="tooltip-arrow"></div>\n<div class="tooltip-inner" ng-bind="content"></div>\n');
}]), angular.module("uib/template/tooltip/tooltip-template-popup.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/tooltip/tooltip-template-popup.html", '<div class="tooltip-arrow"></div>\n<div class="tooltip-inner"\n  uib-tooltip-template-transclude="contentExp()"\n  tooltip-template-transclude-scope="originScope()"></div>\n');
}]), angular.module("uib/template/popover/popover-html.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/popover/popover-html.html", '<div class="arrow"></div>\n\n<div class="popover-inner">\n    <h3 class="popover-title" ng-bind="uibTitle" ng-if="uibTitle"></h3>\n    <div class="popover-content" ng-bind-html="contentExp()"></div>\n</div>\n');
}]), angular.module("uib/template/popover/popover-template.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/popover/popover-template.html", '<div class="arrow"></div>\n\n<div class="popover-inner">\n    <h3 class="popover-title" ng-bind="uibTitle" ng-if="uibTitle"></h3>\n    <div class="popover-content"\n      uib-tooltip-template-transclude="contentExp()"\n      tooltip-template-transclude-scope="originScope()"></div>\n</div>\n');
}]), angular.module("uib/template/popover/popover.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/popover/popover.html", '<div class="arrow"></div>\n\n<div class="popover-inner">\n    <h3 class="popover-title" ng-bind="uibTitle" ng-if="uibTitle"></h3>\n    <div class="popover-content" ng-bind="content"></div>\n</div>\n');
}]), angular.module("uib/template/progressbar/bar.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/progressbar/bar.html", '<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: (percent < 100 ? percent : 100) + \'%\'}" aria-valuetext="{{percent | number:0}}%" aria-labelledby="{{::title}}" ng-transclude></div>\n');
}]), angular.module("uib/template/progressbar/progress.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/progressbar/progress.html", '<div class="progress" ng-transclude aria-labelledby="{{::title}}"></div>');
}]), angular.module("uib/template/progressbar/progressbar.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/progressbar/progressbar.html", '<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: (percent < 100 ? percent : 100) + \'%\'}" aria-valuetext="{{percent | number:0}}%" aria-labelledby="{{::title}}" ng-transclude></div>\n</div>\n');
}]), angular.module("uib/template/rating/rating.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/rating/rating.html", '<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}" aria-valuetext="{{title}}">\n    <span ng-repeat-start="r in range track by $index" class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    <i ng-repeat-end ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')" ng-attr-title="{{r.title}}"></i>\n</span>\n');
}]), angular.module("uib/template/tabs/tab.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/tabs/tab.html", '<li ng-class="[{active: active, disabled: disabled}, classes]" class="uib-tab nav-item">\n  <a href ng-click="select($event)" class="nav-link" uib-tab-heading-transclude>{{heading}}</a>\n</li>\n');
}]), angular.module("uib/template/tabs/tabset.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/tabs/tabset.html", '<div>\n  <ul class="nav nav-{{tabset.type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane"\n         ng-repeat="tab in tabset.tabs"\n         ng-class="{active: tabset.active === tab.index}"\n         uib-tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n');
}]), angular.module("uib/template/timepicker/timepicker.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/timepicker/timepicker.html", '<table class="uib-timepicker">\n  <tbody>\n    <tr class="text-center" ng-show="::showSpinners">\n      <td class="uib-increment hours"><a ng-click="incrementHours()" ng-class="{disabled: noIncrementHours()}" class="btn btn-link" ng-disabled="noIncrementHours()" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td>&nbsp;</td>\n      <td class="uib-increment minutes"><a ng-click="incrementMinutes()" ng-class="{disabled: noIncrementMinutes()}" class="btn btn-link" ng-disabled="noIncrementMinutes()" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td ng-show="showSeconds">&nbsp;</td>\n      <td ng-show="showSeconds" class="uib-increment seconds"><a ng-click="incrementSeconds()" ng-class="{disabled: noIncrementSeconds()}" class="btn btn-link" ng-disabled="noIncrementSeconds()" tabindex="-1"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n      <td ng-show="showMeridian"></td>\n    </tr>\n    <tr>\n      <td class="form-group uib-time hours" ng-class="{\'has-error\': invalidHours}">\n        <input type="text" placeholder="HH" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-readonly="::readonlyInput" maxlength="2" tabindex="{{::tabindex}}" ng-disabled="noIncrementHours()" ng-blur="blur()">\n      </td>\n      <td class="uib-separator">:</td>\n      <td class="form-group uib-time minutes" ng-class="{\'has-error\': invalidMinutes}">\n        <input type="text" placeholder="MM" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="::readonlyInput" maxlength="2" tabindex="{{::tabindex}}" ng-disabled="noIncrementMinutes()" ng-blur="blur()">\n      </td>\n      <td ng-show="showSeconds" class="uib-separator">:</td>\n      <td class="form-group uib-time seconds" ng-class="{\'has-error\': invalidSeconds}" ng-show="showSeconds">\n        <input type="text" placeholder="SS" ng-model="seconds" ng-change="updateSeconds()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2" tabindex="{{::tabindex}}" ng-disabled="noIncrementSeconds()" ng-blur="blur()">\n      </td>\n      <td ng-show="showMeridian" class="uib-time am-pm"><button type="button" ng-class="{disabled: noToggleMeridian()}" class="btn btn-default text-center" ng-click="toggleMeridian()" ng-disabled="noToggleMeridian()" tabindex="{{::tabindex}}">{{meridian}}</button></td>\n    </tr>\n    <tr class="text-center" ng-show="::showSpinners">\n      <td class="uib-decrement hours"><a ng-click="decrementHours()" ng-class="{disabled: noDecrementHours()}" class="btn btn-link" ng-disabled="noDecrementHours()" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td>&nbsp;</td>\n      <td class="uib-decrement minutes"><a ng-click="decrementMinutes()" ng-class="{disabled: noDecrementMinutes()}" class="btn btn-link" ng-disabled="noDecrementMinutes()" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td ng-show="showSeconds">&nbsp;</td>\n      <td ng-show="showSeconds" class="uib-decrement seconds"><a ng-click="decrementSeconds()" ng-class="{disabled: noDecrementSeconds()}" class="btn btn-link" ng-disabled="noDecrementSeconds()" tabindex="-1"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n      <td ng-show="showMeridian"></td>\n    </tr>\n  </tbody>\n</table>\n');
}]), angular.module("uib/template/typeahead/typeahead-match.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/typeahead/typeahead-match.html", '<a href\n   tabindex="-1"\n   ng-bind-html="match.label | uibTypeaheadHighlight:query"\n   ng-attr-title="{{match.label}}"></a>\n');
}]), angular.module("uib/template/typeahead/typeahead-popup.html", []).run(["$templateCache", function (a) {
  a.put("uib/template/typeahead/typeahead-popup.html", '<ul class="dropdown-menu" ng-show="isOpen() && !moveInProgress" ng-style="{top: position().top+\'px\', left: position().left+\'px\'}" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li class="uib-typeahead-match" ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index, $event)" role="option" id="{{::match.id}}">\n        <div uib-typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n');
}]), angular.module("ui.bootstrap.carousel").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibCarouselCss && angular.element(document).find("head").prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>'), angular.$$uibCarouselCss = !0;
}), angular.module("ui.bootstrap.datepicker").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibDatepickerCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-left,.uib-right{width:100%}</style>'), angular.$$uibDatepickerCss = !0;
}), angular.module("ui.bootstrap.position").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>'), angular.$$uibPositionCss = !0;
}), angular.module("ui.bootstrap.datepickerPopup").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibDatepickerpopupCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-datepicker-popup.dropdown-menu{display:block;float:none;margin:0;}.uib-button-bar{padding:10px 9px 2px;}</style>'), angular.$$uibDatepickerpopupCss = !0;
}), angular.module("ui.bootstrap.tooltip").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibTooltipCss && angular.element(document).find("head").prepend('<style type="text/css">[uib-tooltip-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-bottom > .tooltip-arrow,[uib-popover-popup].popover.top-left > .arrow,[uib-popover-popup].popover.top-right > .arrow,[uib-popover-popup].popover.bottom-left > .arrow,[uib-popover-popup].popover.bottom-right > .arrow,[uib-popover-popup].popover.left-top > .arrow,[uib-popover-popup].popover.left-bottom > .arrow,[uib-popover-popup].popover.right-top > .arrow,[uib-popover-popup].popover.right-bottom > .arrow,[uib-popover-html-popup].popover.top-left > .arrow,[uib-popover-html-popup].popover.top-right > .arrow,[uib-popover-html-popup].popover.bottom-left > .arrow,[uib-popover-html-popup].popover.bottom-right > .arrow,[uib-popover-html-popup].popover.left-top > .arrow,[uib-popover-html-popup].popover.left-bottom > .arrow,[uib-popover-html-popup].popover.right-top > .arrow,[uib-popover-html-popup].popover.right-bottom > .arrow,[uib-popover-template-popup].popover.top-left > .arrow,[uib-popover-template-popup].popover.top-right > .arrow,[uib-popover-template-popup].popover.bottom-left > .arrow,[uib-popover-template-popup].popover.bottom-right > .arrow,[uib-popover-template-popup].popover.left-top > .arrow,[uib-popover-template-popup].popover.left-bottom > .arrow,[uib-popover-template-popup].popover.right-top > .arrow,[uib-popover-template-popup].popover.right-bottom > .arrow{top:auto;bottom:auto;left:auto;right:auto;margin:0;}[uib-popover-popup].popover,[uib-popover-html-popup].popover,[uib-popover-template-popup].popover{display:block !important;}</style>'), angular.$$uibTooltipCss = !0;
}), angular.module("ui.bootstrap.timepicker").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibTimepickerCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-time input{width:50px;}</style>'), angular.$$uibTimepickerCss = !0;
}), angular.module("ui.bootstrap.typeahead").run(function () {
  !angular.$$csp().noInlineStyle && !angular.$$uibTypeaheadCss && angular.element(document).find("head").prepend('<style type="text/css">[uib-typeahead-popup].dropdown-menu{display:block;}</style>'), angular.$$uibTypeaheadCss = !0;
});;"use strict";

/**
 * oclazyload - Load modules on demand (lazy load) with angularJS
 * @version v1.0.10
 * @link https://github.com/ocombe/ocLazyLoad
 * @license MIT
 * @author Olivier Combe <olivier.combe@gmail.com>
 */
!function (e, n) {
  "use strict";
  var r = ["ng", "oc.lazyLoad"],
      o = {},
      t = [],
      i = [],
      a = [],
      s = [],
      u = e.noop,
      c = {},
      d = [],
      l = e.module("oc.lazyLoad", ["ng"]);l.provider("$ocLazyLoad", ["$controllerProvider", "$provide", "$compileProvider", "$filterProvider", "$injector", "$animateProvider", function (l, f, p, m, v, y) {
    function L(n, o, t) {
      if (o) {
        var i,
            s,
            l,
            f = [];for (i = o.length - 1; i >= 0; i--) {
          if (s = o[i], e.isString(s) || (s = E(s)), s && -1 === d.indexOf(s) && (!w[s] || -1 !== a.indexOf(s))) {
            var h = -1 === r.indexOf(s);if (l = g(s), h && (r.push(s), L(n, l.requires, t)), l._runBlocks.length > 0) for (c[s] = []; l._runBlocks.length > 0;) {
              c[s].push(l._runBlocks.shift());
            }e.isDefined(c[s]) && (h || t.rerun) && (f = f.concat(c[s])), j(n, l._invokeQueue, s, t.reconfig), j(n, l._configBlocks, s, t.reconfig), u(h ? "ocLazyLoad.moduleLoaded" : "ocLazyLoad.moduleReloaded", s), o.pop(), d.push(s);
          }
        }var p = n.getInstanceInjector();e.forEach(f, function (e) {
          p.invoke(e);
        });
      }
    }function $(n, r) {
      function t(n, r) {
        var o,
            t = !0;return r.length && (o = i(n), e.forEach(r, function (e) {
          t = t && i(e) !== o;
        })), t;
      }function i(n) {
        return e.isArray(n) ? M(n.toString()) : e.isObject(n) ? M(S(n)) : e.isDefined(n) && null !== n ? M(n.toString()) : n;
      }var a = n[2][0],
          s = n[1],
          c = !1;e.isUndefined(o[r]) && (o[r] = {}), e.isUndefined(o[r][s]) && (o[r][s] = {});var d = function d(e, n) {
        o[r][s].hasOwnProperty(e) || (o[r][s][e] = []), t(n, o[r][s][e]) && (c = !0, o[r][s][e].push(n), u("ocLazyLoad.componentLoaded", [r, s, e]));
      };if (e.isString(a)) d(a, n[2][1]);else {
        if (!e.isObject(a)) return !1;e.forEach(a, function (n, r) {
          e.isString(n) ? d(n, a[1]) : d(r, n);
        });
      }return c;
    }function j(n, r, o, i) {
      if (r) {
        var a, s, u, c;for (a = 0, s = r.length; s > a; a++) {
          if (u = r[a], e.isArray(u)) {
            if (null !== n) {
              if (!n.hasOwnProperty(u[0])) throw new Error("unsupported provider " + u[0]);c = n[u[0]];
            }var d = $(u, o);if ("invoke" !== u[1]) d && e.isDefined(c) && c[u[1]].apply(c, u[2]);else {
              var l = function l(n) {
                var r = t.indexOf(o + "-" + n);(-1 === r || i) && (-1 === r && t.push(o + "-" + n), e.isDefined(c) && c[u[1]].apply(c, u[2]));
              };if (e.isFunction(u[2][0])) l(u[2][0]);else if (e.isArray(u[2][0])) for (var f = 0, h = u[2][0].length; h > f; f++) {
                e.isFunction(u[2][0][f]) && l(u[2][0][f]);
              }
            }
          }
        }
      }
    }function E(n) {
      var r = null;return e.isString(n) ? r = n : e.isObject(n) && n.hasOwnProperty("name") && e.isString(n.name) && (r = n.name), r;
    }function _(n) {
      if (!e.isString(n)) return !1;try {
        return g(n);
      } catch (r) {
        if (/No module/.test(r) || r.message.indexOf("$injector:nomod") > -1) return !1;
      }
    }var w = {},
        O = { $controllerProvider: l, $compileProvider: p, $filterProvider: m, $provide: f, $injector: v, $animateProvider: y },
        x = !1,
        b = !1,
        z = [],
        D = {};z.push = function (e) {
      -1 === this.indexOf(e) && Array.prototype.push.apply(this, arguments);
    }, this.config = function (n) {
      e.isDefined(n.modules) && (e.isArray(n.modules) ? e.forEach(n.modules, function (e) {
        w[e.name] = e;
      }) : w[n.modules.name] = n.modules), e.isDefined(n.debug) && (x = n.debug), e.isDefined(n.events) && (b = n.events);
    }, this._init = function (o) {
      if (0 === i.length) {
        var t = [o],
            a = ["ng:app", "ng-app", "x-ng-app", "data-ng-app"],
            u = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/,
            c = function c(e) {
          return e && t.push(e);
        };e.forEach(a, function (n) {
          a[n] = !0, c(document.getElementById(n)), n = n.replace(":", "\\:"), "undefined" != typeof o[0] && o[0].querySelectorAll && (e.forEach(o[0].querySelectorAll("." + n), c), e.forEach(o[0].querySelectorAll("." + n + "\\:"), c), e.forEach(o[0].querySelectorAll("[" + n + "]"), c));
        }), e.forEach(t, function (n) {
          if (0 === i.length) {
            var r = " " + o.className + " ",
                t = u.exec(r);t ? i.push((t[2] || "").replace(/\s+/g, ",")) : e.forEach(n.attributes, function (e) {
              0 === i.length && a[e.name] && i.push(e.value);
            });
          }
        });
      }0 !== i.length || (n.jasmine || n.mocha) && e.isDefined(e.mock) || console.error("No module found during bootstrap, unable to init ocLazyLoad. You should always use the ng-app directive or angular.boostrap when you use ocLazyLoad.");var d = function l(n) {
        if (-1 === r.indexOf(n)) {
          r.push(n);var o = e.module(n);j(null, o._invokeQueue, n), j(null, o._configBlocks, n), e.forEach(o.requires, l);
        }
      };e.forEach(i, function (e) {
        d(e);
      }), i = [], s.pop();
    };var S = function S(n) {
      try {
        return JSON.stringify(n);
      } catch (r) {
        var o = [];return JSON.stringify(n, function (n, r) {
          if (e.isObject(r) && null !== r) {
            if (-1 !== o.indexOf(r)) return;o.push(r);
          }return r;
        });
      }
    },
        M = function M(e) {
      var n,
          r,
          o,
          t = 0;if (0 == e.length) return t;for (n = 0, o = e.length; o > n; n++) {
        r = e.charCodeAt(n), t = (t << 5) - t + r, t |= 0;
      }return t;
    };this.$get = ["$log", "$rootElement", "$rootScope", "$cacheFactory", "$q", function (n, t, a, c, l) {
      function f(e) {
        var r = l.defer();return n.error(e.message), r.reject(e), r.promise;
      }var p,
          m = c("ocLazyLoad");return x || (n = {}, n.error = e.noop, n.warn = e.noop, n.info = e.noop), O.getInstanceInjector = function () {
        return p ? p : p = t.data("$injector") || e.injector();
      }, u = function u(e, r) {
        b && a.$broadcast(e, r), x && n.info(e, r);
      }, { _broadcast: u, _$log: n, _getFilesCache: function _getFilesCache() {
          return m;
        }, toggleWatch: function toggleWatch(e) {
          e ? s.push(!0) : s.pop();
        }, getModuleConfig: function getModuleConfig(n) {
          if (!e.isString(n)) throw new Error("You need to give the name of the module to get");return w[n] ? e.copy(w[n]) : null;
        }, setModuleConfig: function setModuleConfig(n) {
          if (!e.isObject(n)) throw new Error("You need to give the module config object to set");return w[n.name] = n, n;
        }, getModules: function getModules() {
          return r;
        }, isLoaded: function isLoaded(n) {
          var o = function o(e) {
            var n = r.indexOf(e) > -1;return n || (n = !!_(e)), n;
          };if (e.isString(n) && (n = [n]), e.isArray(n)) {
            var t, i;for (t = 0, i = n.length; i > t; t++) {
              if (!o(n[t])) return !1;
            }return !0;
          }throw new Error("You need to define the module(s) name(s)");
        }, _getModuleName: E, _getModule: function _getModule(e) {
          try {
            return g(e);
          } catch (n) {
            throw (/No module/.test(n) || n.message.indexOf("$injector:nomod") > -1) && (n.message = 'The module "' + S(e) + '" that you are trying to load does not exist. ' + n.message), n;
          }
        }, moduleExists: _, _loadDependencies: function _loadDependencies(n, r) {
          var o,
              t,
              i,
              a = [],
              s = this;if (n = s._getModuleName(n), null === n) return l.when();try {
            o = s._getModule(n);
          } catch (u) {
            return f(u);
          }return t = s.getRequires(o), e.forEach(t, function (o) {
            if (e.isString(o)) {
              var t = s.getModuleConfig(o);if (null === t) return void z.push(o);o = t, t.name = void 0;
            }if (s.moduleExists(o.name)) return i = o.files.filter(function (e) {
              return s.getModuleConfig(o.name).files.indexOf(e) < 0;
            }), 0 !== i.length && s._$log.warn('Module "', n, '" attempted to redefine configuration for dependency. "', o.name, '"\n Additional Files Loaded:', i), e.isDefined(s.filesLoader) ? void a.push(s.filesLoader(o, r).then(function () {
              return s._loadDependencies(o);
            })) : f(new Error("Error: New dependencies need to be loaded from external files (" + o.files + "), but no loader has been defined."));if (e.isArray(o)) {
              var u = [];e.forEach(o, function (e) {
                var n = s.getModuleConfig(e);null === n ? u.push(e) : n.files && (u = u.concat(n.files));
              }), u.length > 0 && (o = { files: u });
            } else e.isObject(o) && o.hasOwnProperty("name") && o.name && (s.setModuleConfig(o), z.push(o.name));if (e.isDefined(o.files) && 0 !== o.files.length) {
              if (!e.isDefined(s.filesLoader)) return f(new Error('Error: the module "' + o.name + '" is defined in external files (' + o.files + "), but no loader has been defined."));a.push(s.filesLoader(o, r).then(function () {
                return s._loadDependencies(o);
              }));
            }
          }), l.all(a);
        }, inject: function inject(n) {
          var r = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
              o = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
              t = this,
              a = l.defer();if (e.isDefined(n) && null !== n) {
            if (e.isArray(n)) {
              var s = [];return e.forEach(n, function (e) {
                s.push(t.inject(e, r, o));
              }), l.all(s);
            }t._addToLoadList(t._getModuleName(n), !0, o);
          }if (i.length > 0) {
            var u = i.slice(),
                c = function f(e) {
              z.push(e), D[e] = a.promise, t._loadDependencies(e, r).then(function () {
                try {
                  d = [], L(O, z, r);
                } catch (e) {
                  return t._$log.error(e.message), void a.reject(e);
                }i.length > 0 ? f(i.shift()) : a.resolve(u);
              }, function (e) {
                a.reject(e);
              });
            };c(i.shift());
          } else {
            if (r && r.name && D[r.name]) return D[r.name];a.resolve();
          }return a.promise;
        }, getRequires: function getRequires(n) {
          var o = [];return e.forEach(n.requires, function (e) {
            -1 === r.indexOf(e) && o.push(e);
          }), o;
        }, _invokeQueue: j, _registerInvokeList: $, _register: L, _addToLoadList: h, _unregister: function _unregister(n) {
          e.isDefined(n) && e.isArray(n) && e.forEach(n, function (e) {
            o[e] = void 0;
          });
        } };
    }], this._init(e.element(n.document));
  }]);var f = e.bootstrap;e.bootstrap = function (n, l, g) {
    return r = ["ng", "oc.lazyLoad"], o = {}, t = [], i = [], a = [], s = [], u = e.noop, c = {}, d = [], e.forEach(l.slice(), function (e) {
      h(e, !0, !0);
    }), f(n, l, g);
  };var h = function h(n, r, o) {
    (s.length > 0 || r) && e.isString(n) && -1 === i.indexOf(n) && (i.push(n), o && a.push(n));
  },
      g = e.module;e.module = function (e, n, r) {
    return h(e, !1, !0), g(e, n, r);
  }, "undefined" != typeof module && "undefined" != typeof exports && module.exports === exports && (module.exports = "oc.lazyLoad");
}(angular, window), function (e) {
  "use strict";
  e.module("oc.lazyLoad").directive("ocLazyLoad", ["$ocLazyLoad", "$compile", "$animate", "$parse", "$timeout", function (n, r, o, t, i) {
    return { restrict: "A", terminal: !0, priority: 1e3, compile: function compile(i, a) {
        var s = i[0].innerHTML;return i.html(""), function (i, a, u) {
          var c = t(u.ocLazyLoad);i.$watch(function () {
            return c(i) || u.ocLazyLoad;
          }, function (t) {
            e.isDefined(t) && n.load(t).then(function () {
              o.enter(s, a), r(a.contents())(i);
            });
          }, !0);
        };
      } };
  }]);
}(angular), function (e) {
  "use strict";
  e.module("oc.lazyLoad").config(["$provide", function (n) {
    n.decorator("$ocLazyLoad", ["$delegate", "$q", "$window", "$interval", function (n, r, o, t) {
      var i = !1,
          a = !1,
          s = o.document.getElementsByTagName("head")[0] || o.document.getElementsByTagName("body")[0];return n.buildElement = function (u, c, d) {
        var l,
            f,
            h = r.defer(),
            g = n._getFilesCache(),
            p = function p(e) {
          var n = new Date().getTime();return e.indexOf("?") >= 0 ? "&" === e.substring(0, e.length - 1) ? e + "_dc=" + n : e + "&_dc=" + n : e + "?_dc=" + n;
        };switch (e.isUndefined(g.get(c)) && g.put(c, h.promise), u) {case "css":
            l = o.document.createElement("link"), l.type = "text/css", l.rel = "stylesheet", l.href = d.cache === !1 ? p(c) : c;break;case "js":
            l = o.document.createElement("script"), l.src = d.cache === !1 ? p(c) : c;break;default:
            g.remove(c), h.reject(new Error('Requested type "' + u + '" is not known. Could not inject "' + c + '"'));}l.onload = l.onreadystatechange = function (e) {
          l.readyState && !/^c|loade/.test(l.readyState) || f || (l.onload = l.onreadystatechange = null, f = 1, n._broadcast("ocLazyLoad.fileLoaded", c), h.resolve(l));
        }, l.onerror = function () {
          g.remove(c), h.reject(new Error("Unable to load " + c));
        }, l.async = d.serie ? 0 : 1;var m = s.lastChild;if (d.insertBefore) {
          var v = e.element(e.isDefined(window.jQuery) ? d.insertBefore : document.querySelector(d.insertBefore));v && v.length > 0 && (m = v[0]);
        }if (m.parentNode.insertBefore(l, m), "css" == u) {
          if (!i) {
            var y = o.navigator.userAgent.toLowerCase();if (y.indexOf("phantomjs/1.9") > -1) a = !0;else if (/iP(hone|od|ad)/.test(o.navigator.platform)) {
              var L = o.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
                  $ = parseFloat([parseInt(L[1], 10), parseInt(L[2], 10), parseInt(L[3] || 0, 10)].join("."));a = 6 > $;
            } else if (y.indexOf("android") > -1) {
              var j = parseFloat(y.slice(y.indexOf("android") + 8));a = 4.4 > j;
            } else if (y.indexOf("safari") > -1) {
              var E = y.match(/version\/([\.\d]+)/i);a = E && E[1] && parseFloat(E[1]) < 6;
            }
          }if (a) var _ = 1e3,
              w = t(function () {
            try {
              l.sheet.cssRules, t.cancel(w), l.onload();
            } catch (e) {
              --_ <= 0 && l.onerror();
            }
          }, 20);
        }return h.promise;
      }, n;
    }]);
  }]);
}(angular), function (e) {
  "use strict";
  e.module("oc.lazyLoad").config(["$provide", function (n) {
    n.decorator("$ocLazyLoad", ["$delegate", "$q", function (n, r) {
      return n.filesLoader = function (o) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
            i = [],
            a = [],
            s = [],
            u = [],
            c = null,
            d = n._getFilesCache();n.toggleWatch(!0), e.extend(t, o);var l = function l(r) {
          var o,
              l = null;if (e.isObject(r) && (l = r.type, r = r.path), c = d.get(r), e.isUndefined(c) || t.cache === !1) {
            if (null !== (o = /^(css|less|html|htm|js)?(?=!)/.exec(r)) && (l = o[1], r = r.substr(o[1].length + 1, r.length)), !l) if (null !== (o = /[.](css|less|html|htm|js)?((\?|#).*)?$/.exec(r))) l = o[1];else {
              if (n.jsLoader.hasOwnProperty("ocLazyLoadLoader") || !n.jsLoader.hasOwnProperty("requirejs")) return void n._$log.error("File type could not be determined. " + r);l = "js";
            }"css" !== l && "less" !== l || -1 !== i.indexOf(r) ? "html" !== l && "htm" !== l || -1 !== a.indexOf(r) ? "js" === l || -1 === s.indexOf(r) ? s.push(r) : n._$log.error("File type is not valid. " + r) : a.push(r) : i.push(r);
          } else c && u.push(c);
        };if (t.serie ? l(t.files.shift()) : e.forEach(t.files, function (e) {
          l(e);
        }), i.length > 0) {
          var f = r.defer();n.cssLoader(i, function (r) {
            e.isDefined(r) && n.cssLoader.hasOwnProperty("ocLazyLoadLoader") ? (n._$log.error(r), f.reject(r)) : f.resolve();
          }, t), u.push(f.promise);
        }if (a.length > 0) {
          var h = r.defer();n.templatesLoader(a, function (r) {
            e.isDefined(r) && n.templatesLoader.hasOwnProperty("ocLazyLoadLoader") ? (n._$log.error(r), h.reject(r)) : h.resolve();
          }, t), u.push(h.promise);
        }if (s.length > 0) {
          var g = r.defer();n.jsLoader(s, function (r) {
            e.isDefined(r) && (n.jsLoader.hasOwnProperty("ocLazyLoadLoader") || n.jsLoader.hasOwnProperty("requirejs")) ? (n._$log.error(r), g.reject(r)) : g.resolve();
          }, t), u.push(g.promise);
        }if (0 === u.length) {
          var p = r.defer(),
              m = "Error: no file to load has been found, if you're trying to load an existing module you should use the 'inject' method instead of 'load'.";return n._$log.error(m), p.reject(m), p.promise;
        }return t.serie && t.files.length > 0 ? r.all(u).then(function () {
          return n.filesLoader(o, t);
        }) : r.all(u)["finally"](function (e) {
          return n.toggleWatch(!1), e;
        });
      }, n.load = function (o) {
        var t,
            i = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
            a = this,
            s = null,
            u = [],
            c = r.defer(),
            d = e.copy(o),
            l = e.copy(i);if (e.isArray(d)) return e.forEach(d, function (e) {
          u.push(a.load(e, l));
        }), r.all(u).then(function (e) {
          c.resolve(e);
        }, function (e) {
          c.reject(e);
        }), c.promise;if (e.isString(d) ? (s = a.getModuleConfig(d), s || (s = { files: [d] })) : e.isObject(d) && (s = e.isDefined(d.path) && e.isDefined(d.type) ? { files: [d] } : a.setModuleConfig(d)), null === s) {
          var f = a._getModuleName(d);return t = 'Module "' + (f || "unknown") + '" is not configured, cannot load.', n._$log.error(t), c.reject(new Error(t)), c.promise;
        }e.isDefined(s.template) && (e.isUndefined(s.files) && (s.files = []), e.isString(s.template) ? s.files.push(s.template) : e.isArray(s.template) && s.files.concat(s.template));var h = e.extend({}, l, s);return e.isUndefined(s.files) && e.isDefined(s.name) && n.moduleExists(s.name) ? n.inject(s.name, h, !0) : (n.filesLoader(s, h).then(function () {
          n.inject(null, h).then(function (e) {
            c.resolve(e);
          }, function (e) {
            c.reject(e);
          });
        }, function (e) {
          c.reject(e);
        }), c.promise);
      }, n;
    }]);
  }]);
}(angular), function (e) {
  "use strict";
  e.module("oc.lazyLoad").config(["$provide", function (n) {
    n.decorator("$ocLazyLoad", ["$delegate", "$q", function (n, r) {
      return n.cssLoader = function (o, t, i) {
        var a = [];e.forEach(o, function (e) {
          a.push(n.buildElement("css", e, i));
        }), r.all(a).then(function () {
          t();
        }, function (e) {
          t(e);
        });
      }, n.cssLoader.ocLazyLoadLoader = !0, n;
    }]);
  }]);
}(angular), function (e) {
  "use strict";
  e.module("oc.lazyLoad").config(["$provide", function (n) {
    n.decorator("$ocLazyLoad", ["$delegate", "$q", function (n, r) {
      return n.jsLoader = function (o, t, i) {
        var a = [];e.forEach(o, function (e) {
          a.push(n.buildElement("js", e, i));
        }), r.all(a).then(function () {
          t();
        }, function (e) {
          t(e);
        });
      }, n.jsLoader.ocLazyLoadLoader = !0, n;
    }]);
  }]);
}(angular), function (e) {
  "use strict";
  e.module("oc.lazyLoad").config(["$provide", function (n) {
    n.decorator("$ocLazyLoad", ["$delegate", "$templateCache", "$q", "$http", function (n, r, o, t) {
      return n.templatesLoader = function (i, a, s) {
        var u = [],
            c = n._getFilesCache();return e.forEach(i, function (n) {
          var i = o.defer();u.push(i.promise), t.get(n, s).then(function (o) {
            var t = o.data;e.isString(t) && t.length > 0 && e.forEach(e.element(t), function (e) {
              "SCRIPT" === e.nodeName && "text/ng-template" === e.type && r.put(e.id, e.innerHTML);
            }), e.isUndefined(c.get(n)) && c.put(n, !0), i.resolve();
          })["catch"](function (e) {
            i.reject(new Error('Unable to load template file "' + n + '": ' + e.data));
          });
        }), o.all(u).then(function () {
          a();
        }, function (e) {
          a(e);
        });
      }, n.templatesLoader.ocLazyLoadLoader = !0, n;
    }]);
  }]);
}(angular), Array.prototype.indexOf || (Array.prototype.indexOf = function (e, n) {
  var r;if (null == this) throw new TypeError('"this" is null or not defined');var o = Object(this),
      t = o.length >>> 0;if (0 === t) return -1;var i = +n || 0;if (Math.abs(i) === 1 / 0 && (i = 0), i >= t) return -1;for (r = Math.max(i >= 0 ? i : t - Math.abs(i), 0); t > r;) {
    if (r in o && o[r] === e) return r;r++;
  }return -1;
});;'use strict';

/*=============== Header Fixed Start ===============*/

$(window).scroll(function () {
  if ($(window).scrollTop() >= 150) {
    $('.main-navigation').addClass('fixed-header');
  } else {
    $('.main-navigation').removeClass('fixed-header');
  }
  if ($(window).scrollTop() >= 150) {
    $('#header').addClass('fixed-header');
  } else {
    $('#header').removeClass('fixed-header');
  }
});

/*=============== Header Fixed End ===============*/

$(document).ready(function () {
  $(document).on('click', '.main-navigation a', function () {
    $(".navbar-collapse").removeClass("in");
  });
  $(document).on('click', '.dropdownTitle', function () {
    $(".navbar-collapse").addClass("in");
  });
});

$(document).ready(function () {
  $(document).on('click', '.navbar-toggle', function () {
    $(".navbar-collapse").toggleClass("in");
    $('.subMenu.main-more').removeClass("subMenuMoreOpen");
  });
});

/*=============== NavSearch ===============*/
var removeClass = true;

$(document).on('click', '.navSearch a', function () {
  $(".search-input").toggleClass('open');
  removeClass = false;
});

// when clicking the div : never remove the class
$(".search-input").click(function () {
  removeClass = false;
});

// when click event reaches "html" : remove class if needed, and reset flag
$("html").click(function () {
  if (removeClass) {
    $(".search-input").removeClass('open');
  }
  removeClass = true;
});

/*=============== Responsive submenu ===============*/

$(document).ready(function () {
  if ($(window).width() <= 991) {
    $(document).on('click', '.subMenu', function () {
      $(this).toggleClass("subMenuOpen");
    });
    $(document).on('click', '.subMenu.main-more', function () {
      $(this).removeClass("subMenuOpen");
    });
    $(document).on('click', '.subMenu.main-more', function () {
      $(this).toggleClass("subMenuMoreOpen");
    });
    $(document).on('click', '.subMenu-more.subMenu', function () {
      $('.main-more').toggleClass("moreOpen");
    });

    $(document).on('click', '.city-sport0, .city-sport1', function () {
      $('.more_sub_category .subMenu-more').toggleClass("more_first");
    });
  }
});
/*=============== Responsive submenu ===============*/;'use strict';

/**
 * @license AngularJS v1.7.1
 * (c) 2010-2018 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function (window, angular) {
  'use strict';

  /**
   * @ngdoc module
   * @name ngCookies
   * @description
   *
   * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
   *
   * See {@link ngCookies.$cookies `$cookies`} for usage.
   */

  angular.module('ngCookies', ['ng']).info({ angularVersion: '1.7.1' }).
  /**
   * @ngdoc provider
   * @name $cookiesProvider
   * @description
   * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
   * */
  provider('$cookies', [/** @this */function $CookiesProvider() {
    /**
     * @ngdoc property
     * @name $cookiesProvider#defaults
     * @description
     *
     * Object containing default options to pass when setting cookies.
     *
     * The object may have following properties:
     *
     * - **path** - `{string}` - The cookie will be available only for this path and its
     *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
     * - **domain** - `{string}` - The cookie will be available only for this domain and
     *   its sub-domains. For security reasons the user agent will not accept the cookie
     *   if the current domain is not a sub-domain of this domain or equal to it.
     * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
     *   or a Date object indicating the exact date/time this cookie will expire.
     * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
     *   secured connection.
     * - **samesite** - `{string}` - prevents the browser from sending the cookie along with cross-site requests.
     *   Accepts the values `lax` and `strict`. See the [OWASP Wiki](https://www.owasp.org/index.php/SameSite)
     *   for more info. Note that as of May 2018, not all browsers support `SameSite`,
     *   so it cannot be used as a single measure against Cross-Site-Request-Forgery (CSRF) attacks.
     *
     * Note: By default, the address that appears in your `<base>` tag will be used as the path.
     * This is important so that cookies will be visible for all routes when html5mode is enabled.
     *
     * @example
     *
     * ```js
     * angular.module('cookiesProviderExample', ['ngCookies'])
     *   .config(['$cookiesProvider', function($cookiesProvider) {
     *     // Setting default options
     *     $cookiesProvider.defaults.domain = 'foo.com';
     *     $cookiesProvider.defaults.secure = true;
     *   }]);
     * ```
     **/
    var defaults = this.defaults = {};

    function calcOptions(options) {
      return options ? angular.extend({}, defaults, options) : defaults;
    }

    /**
     * @ngdoc service
     * @name $cookies
     *
     * @description
     * Provides read/write access to browser's cookies.
     *
     * <div class="alert alert-info">
     * Up until AngularJS 1.3, `$cookies` exposed properties that represented the
     * current browser cookie values. In version 1.4, this behavior has changed, and
     * `$cookies` now provides a standard api of getters, setters etc.
     * </div>
     *
     * Requires the {@link ngCookies `ngCookies`} module to be installed.
     *
     * @example
     *
     * ```js
     * angular.module('cookiesExample', ['ngCookies'])
     *   .controller('ExampleController', ['$cookies', function($cookies) {
     *     // Retrieving a cookie
     *     var favoriteCookie = $cookies.get('myFavorite');
     *     // Setting a cookie
     *     $cookies.put('myFavorite', 'oatmeal');
     *   }]);
     * ```
     */
    this.$get = ['$$cookieReader', '$$cookieWriter', function ($$cookieReader, $$cookieWriter) {
      return {
        /**
         * @ngdoc method
         * @name $cookies#get
         *
         * @description
         * Returns the value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {string} Raw cookie value.
         */
        get: function get(key) {
          return $$cookieReader()[key];
        },

        /**
         * @ngdoc method
         * @name $cookies#getObject
         *
         * @description
         * Returns the deserialized value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {Object} Deserialized cookie value.
         */
        getObject: function getObject(key) {
          var value = this.get(key);
          return value ? angular.fromJson(value) : value;
        },

        /**
         * @ngdoc method
         * @name $cookies#getAll
         *
         * @description
         * Returns a key value object with all the cookies
         *
         * @returns {Object} All cookies
         */
        getAll: function getAll() {
          return $$cookieReader();
        },

        /**
         * @ngdoc method
         * @name $cookies#put
         *
         * @description
         * Sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {string} value Raw value to be stored.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        put: function put(key, value, options) {
          $$cookieWriter(key, value, calcOptions(options));
        },

        /**
         * @ngdoc method
         * @name $cookies#putObject
         *
         * @description
         * Serializes and sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        putObject: function putObject(key, value, options) {
          this.put(key, angular.toJson(value), options);
        },

        /**
         * @ngdoc method
         * @name $cookies#remove
         *
         * @description
         * Remove given cookie
         *
         * @param {string} key Id of the key-value pair to delete.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        remove: function remove(key, options) {
          $$cookieWriter(key, undefined, calcOptions(options));
        }
      };
    }];
  }]);

  /**
   * @name $$cookieWriter
   * @requires $document
   *
   * @description
   * This is a private service for writing cookies
   *
   * @param {string} name Cookie name
   * @param {string=} value Cookie value (if undefined, cookie will be deleted)
   * @param {Object=} options Object with options that need to be stored for the cookie.
   */
  function $$CookieWriter($document, $log, $browser) {
    var cookiePath = $browser.baseHref();
    var rawDocument = $document[0];

    function buildCookieString(name, value, options) {
      var path, expires;
      options = options || {};
      expires = options.expires;
      path = angular.isDefined(options.path) ? options.path : cookiePath;
      if (angular.isUndefined(value)) {
        expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
        value = '';
      }
      if (angular.isString(expires)) {
        expires = new Date(expires);
      }

      var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
      str += path ? ';path=' + path : '';
      str += options.domain ? ';domain=' + options.domain : '';
      str += expires ? ';expires=' + expires.toUTCString() : '';
      str += options.secure ? ';secure' : '';
      str += options.samesite ? ';samesite=' + options.samesite : '';

      // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
      // - 300 cookies
      // - 20 cookies per unique domain
      // - 4096 bytes per cookie
      var cookieLength = str.length + 1;
      if (cookieLength > 4096) {
        $log.warn('Cookie \'' + name + '\' possibly not set or overflowed because it was too large (' + cookieLength + ' > 4096 bytes)!');
      }

      return str;
    }

    return function (name, value, options) {
      rawDocument.cookie = buildCookieString(name, value, options);
    };
  }

  $$CookieWriter.$inject = ['$document', '$log', '$browser'];

  angular.module('ngCookies').provider('$$cookieWriter', /** @this */function $$CookieWriterProvider() {
    this.$get = $$CookieWriter;
  });
})(window, window.angular);;"use strict";

(function () {
  var $,
      AbstractChosen,
      Chosen,
      SelectParser,
      bind = function bind(fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  },
      extend = function extend(child, parent) {
    for (var key in parent) {
      if (hasProp.call(parent, key)) child[key] = parent[key];
    }function ctor() {
      this.constructor = child;
    }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
  },
      hasProp = {}.hasOwnProperty;

  SelectParser = function () {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function (child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function (group) {
      var group_position, i, len, option, ref, results1;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        title: group.title ? group.title : void 0,
        children: 0,
        disabled: group.disabled,
        classes: group.className
      });
      ref = group.childNodes;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        results1.push(this.add_option(option, group_position, group.disabled));
      }
      return results1;
    };

    SelectParser.prototype.add_option = function (option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            title: option.title ? option.title : void 0,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            group_label: group_position != null ? this.parsed[group_position].label : null,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    return SelectParser;
  }();

  SelectParser.select_to_array = function (select) {
    var child, i, len, parser, ref;
    parser = new SelectParser();
    ref = select.childNodes;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = function () {
    function AbstractChosen(form_field, options1) {
      this.form_field = form_field;
      this.options = options1 != null ? options1 : {};
      this.label_click_handler = bind(this.label_click_handler, this);
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.on_ready();
    }

    AbstractChosen.prototype.set_default_values = function () {
      this.click_test_action = function (_this) {
        return function (evt) {
          return _this.test_active_click(evt);
        };
      }(this);
      this.activate_action = function (_this) {
        return function (evt) {
          return _this.activate_field(evt);
        };
      }(this);
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.is_rtl = this.options.rtl || /\bchosen-rtl\b/.test(this.form_field.className);
      this.allow_single_deselect = this.options.allow_single_deselect != null && this.form_field.options[0] != null && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
      this.include_group_label_in_selected = this.options.include_group_label_in_selected || false;
      this.max_shown_results = this.options.max_shown_results || Number.POSITIVE_INFINITY;
      this.case_sensitive_search = this.options.case_sensitive_search || false;
      return this.hide_results_on_select = this.options.hide_results_on_select != null ? this.options.hide_results_on_select : true;
    };

    AbstractChosen.prototype.set_default_text = function () {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      this.default_text = this.escape_html(this.default_text);
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.choice_label = function (item) {
      if (this.include_group_label_in_selected && item.group_label != null) {
        return "<b class='group-name'>" + item.group_label + "</b>" + item.html;
      } else {
        return item.html;
      }
    };

    AbstractChosen.prototype.mouse_enter = function () {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function () {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function (evt) {
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout(function (_this) {
            return function () {
              return _this.container_mousedown();
            };
          }(this), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function (evt) {
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout(function (_this) {
          return function () {
            return _this.blur_test();
          };
        }(this), 100);
      }
    };

    AbstractChosen.prototype.label_click_handler = function (evt) {
      if (this.is_multiple) {
        return this.container_mousedown(evt);
      } else {
        return this.activate_field();
      }
    };

    AbstractChosen.prototype.results_option_build = function (options) {
      var content, data, data_content, i, len, ref, shown_results;
      content = '';
      shown_results = 0;
      ref = this.results_data;
      for (i = 0, len = ref.length; i < len; i++) {
        data = ref[i];
        data_content = '';
        if (data.group) {
          data_content = this.result_add_group(data);
        } else {
          data_content = this.result_add_option(data);
        }
        if (data_content !== '') {
          shown_results++;
          content += data_content;
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(this.choice_label(data));
          }
        }
        if (shown_results >= this.max_shown_results) {
          break;
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function (option) {
      var classes, option_el;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      option_el.style.cssText = option.style;
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.highlighted_html || option.html;
      if (option.title) {
        option_el.title = option.title;
      }
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function (group) {
      var classes, group_el;
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      classes = [];
      classes.push("group-result");
      if (group.classes) {
        classes.push(group.classes);
      }
      group_el = document.createElement("li");
      group_el.className = classes.join(" ");
      group_el.innerHTML = group.highlighted_html || this.escape_html(group.label);
      if (group.title) {
        group_el.title = group.title;
      }
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function () {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function () {
      var i, len, ref, result, results1;
      ref = this.results_data;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        result = ref[i];
        if (result.selected) {
          results1.push(result.selected = false);
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    };

    AbstractChosen.prototype.results_toggle = function () {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function (evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function () {
      var escapedQuery, fix, i, len, option, prefix, query, ref, regex, results, results_group, search_match, startpos, suffix, text;
      this.no_results_clear();
      results = 0;
      query = this.get_search_text();
      escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      regex = this.get_search_regex(escapedQuery);
      ref = this.results_data;
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        option.search_match = false;
        results_group = null;
        search_match = null;
        option.highlighted_html = '';
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if (option.group_array_index != null && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          text = option.group ? option.label : option.text;
          if (!(option.group && !this.group_search)) {
            search_match = this.search_string_match(text, regex);
            option.search_match = search_match != null;
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (query.length) {
                startpos = search_match.index;
                prefix = text.slice(0, startpos);
                fix = text.slice(startpos, startpos + query.length);
                suffix = text.slice(startpos + query.length);
                option.highlighted_html = this.escape_html(prefix) + "<em>" + this.escape_html(fix) + "</em>" + this.escape_html(suffix);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if (option.group_array_index != null && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && query.length) {
        this.update_results_content("");
        return this.no_results(query);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };

    AbstractChosen.prototype.get_search_regex = function (escaped_search_string) {
      var regex_flag, regex_string;
      regex_string = this.search_contains ? escaped_search_string : "(^|\\s|\\b)" + escaped_search_string + "[^\\s]*";
      if (!(this.enable_split_word_search || this.search_contains)) {
        regex_string = "^" + regex_string;
      }
      regex_flag = this.case_sensitive_search ? "" : "i";
      return new RegExp(regex_string, regex_flag);
    };

    AbstractChosen.prototype.search_string_match = function (search_string, regex) {
      var match;
      match = regex.exec(search_string);
      if (!this.search_contains && (match != null ? match[1] : void 0)) {
        match.index += 1;
      }
      return match;
    };

    AbstractChosen.prototype.choices_count = function () {
      var i, len, option, ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      ref = this.form_field.options;
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function (evt) {
      evt.preventDefault();
      this.activate_field();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keydown_checker = function (evt) {
      var ref, stroke;
      stroke = (ref = evt.which) != null ? ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.get_search_field_value().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 27:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 32:
          if (this.disable_search) {
            evt.preventDefault();
          }
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    AbstractChosen.prototype.keyup_checker = function (evt) {
      var ref, stroke;
      stroke = (ref = evt.which) != null ? ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          break;
        case 9:
        case 16:
        case 17:
        case 18:
        case 38:
        case 40:
        case 91:
          break;
        default:
          this.results_search();
          break;
      }
    };

    AbstractChosen.prototype.clipboard_event_checker = function (evt) {
      if (this.is_disabled) {
        return;
      }
      return setTimeout(function (_this) {
        return function () {
          return _this.results_search();
        };
      }(this), 50);
    };

    AbstractChosen.prototype.container_width = function () {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function (option) {
      if (this.is_multiple && !this.display_selected_options && option.selected) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function (evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function (evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function (evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function (element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.prototype.get_single_html = function () {
      return "<a class=\"chosen-single chosen-default\">\n  <input class=\"chosen-search-input\" type=\"text\" autocomplete=\"off\" />\n  <span>" + this.default_text + "</span>\n  <div><b></b></div>\n</a>\n<div class=\"chosen-drop\">\n  <div class=\"chosen-search\">\n  </div>\n  <ul class=\"chosen-results\"></ul>\n</div>";
    };

    AbstractChosen.prototype.get_multi_html = function () {
      return "<ul class=\"chosen-choices\">\n  <li class=\"search-field\">\n    <input class=\"chosen-search-input\" type=\"text\" autocomplete=\"off\" value=\"" + this.default_text + "\" />\n  </li>\n</ul>\n<div class=\"chosen-drop\">\n  <ul class=\"chosen-results\"></ul>\n</div>";
    };

    AbstractChosen.prototype.get_no_results_html = function (terms) {
      return "<li class=\"no-results\">\n  " + this.results_none_found + " <span>" + this.escape_html(terms) + "</span>\n</li>";
    };

    AbstractChosen.browser_is_supported = function () {
      if ("Microsoft Internet Explorer" === window.navigator.appName) {
        return document.documentMode >= 8;
      }
      if (/iP(od|hone)/i.test(window.navigator.userAgent) || /IEMobile/i.test(window.navigator.userAgent) || /Windows Phone/i.test(window.navigator.userAgent) || /BlackBerry/i.test(window.navigator.userAgent) || /BB10/i.test(window.navigator.userAgent) || /Android.*Mobile/i.test(window.navigator.userAgent)) {
        return false;
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";

    return AbstractChosen;
  }();

  $ = jQuery;

  $.fn.extend({
    chosen: function chosen(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function (input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy') {
          if (chosen instanceof Chosen) {
            chosen.destroy();
          }
          return;
        }
        if (!(chosen instanceof Chosen)) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = function (superClass) {
    extend(Chosen, superClass);

    function Chosen() {
      return Chosen.__super__.constructor.apply(this, arguments);
    }

    Chosen.prototype.setup = function () {
      this.form_field_jq = $(this.form_field);
      return this.current_selectedIndex = this.form_field.selectedIndex;
    };

    Chosen.prototype.set_up_html = function () {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      this.container.width(this.container_width());
      if (this.is_multiple) {
        this.container.html(this.get_multi_html());
      } else {
        this.container.html(this.get_single_html());
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      return this.set_label_behavior();
    };

    Chosen.prototype.on_ready = function () {
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function () {
      this.container.on('touchstart.chosen', function (_this) {
        return function (evt) {
          _this.container_mousedown(evt);
        };
      }(this));
      this.container.on('touchend.chosen', function (_this) {
        return function (evt) {
          _this.container_mouseup(evt);
        };
      }(this));
      this.container.on('mousedown.chosen', function (_this) {
        return function (evt) {
          _this.container_mousedown(evt);
        };
      }(this));
      this.container.on('mouseup.chosen', function (_this) {
        return function (evt) {
          _this.container_mouseup(evt);
        };
      }(this));
      this.container.on('mouseenter.chosen', function (_this) {
        return function (evt) {
          _this.mouse_enter(evt);
        };
      }(this));
      this.container.on('mouseleave.chosen', function (_this) {
        return function (evt) {
          _this.mouse_leave(evt);
        };
      }(this));
      this.search_results.on('mouseup.chosen', function (_this) {
        return function (evt) {
          _this.search_results_mouseup(evt);
        };
      }(this));
      this.search_results.on('mouseover.chosen', function (_this) {
        return function (evt) {
          _this.search_results_mouseover(evt);
        };
      }(this));
      this.search_results.on('mouseout.chosen', function (_this) {
        return function (evt) {
          _this.search_results_mouseout(evt);
        };
      }(this));
      this.search_results.on('mousewheel.chosen DOMMouseScroll.chosen', function (_this) {
        return function (evt) {
          _this.search_results_mousewheel(evt);
        };
      }(this));
      this.search_results.on('touchstart.chosen', function (_this) {
        return function (evt) {
          _this.search_results_touchstart(evt);
        };
      }(this));
      this.search_results.on('touchmove.chosen', function (_this) {
        return function (evt) {
          _this.search_results_touchmove(evt);
        };
      }(this));
      this.search_results.on('touchend.chosen', function (_this) {
        return function (evt) {
          _this.search_results_touchend(evt);
        };
      }(this));
      this.form_field_jq.on("chosen:updated.chosen", function (_this) {
        return function (evt) {
          _this.results_update_field(evt);
        };
      }(this));
      this.form_field_jq.on("chosen:activate.chosen", function (_this) {
        return function (evt) {
          _this.activate_field(evt);
        };
      }(this));
      this.form_field_jq.on("chosen:open.chosen", function (_this) {
        return function (evt) {
          _this.container_mousedown(evt);
        };
      }(this));
      this.form_field_jq.on("chosen:close.chosen", function (_this) {
        return function (evt) {
          _this.close_field(evt);
        };
      }(this));
      this.search_field.on('blur.chosen', function (_this) {
        return function (evt) {
          _this.input_blur(evt);
        };
      }(this));
      this.search_field.on('keyup.chosen', function (_this) {
        return function (evt) {
          _this.keyup_checker(evt);
        };
      }(this));
      this.search_field.on('keydown.chosen', function (_this) {
        return function (evt) {
          _this.keydown_checker(evt);
        };
      }(this));
      this.search_field.on('focus.chosen', function (_this) {
        return function (evt) {
          _this.input_focus(evt);
        };
      }(this));
      this.search_field.on('cut.chosen', function (_this) {
        return function (evt) {
          _this.clipboard_event_checker(evt);
        };
      }(this));
      this.search_field.on('paste.chosen', function (_this) {
        return function (evt) {
          _this.clipboard_event_checker(evt);
        };
      }(this));
      if (this.is_multiple) {
        return this.search_choices.on('click.chosen', function (_this) {
          return function (evt) {
            _this.choices_click(evt);
          };
        }(this));
      } else {
        return this.container.on('click.chosen', function (evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function () {
      $(this.container[0].ownerDocument).off('click.chosen', this.click_test_action);
      if (this.form_field_label.length > 0) {
        this.form_field_label.off('click.chosen');
      }
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function () {
      this.is_disabled = this.form_field.disabled || this.form_field_jq.parents('fieldset').is(':disabled');
      this.container.toggleClass('chosen-disabled', this.is_disabled);
      this.search_field[0].disabled = this.is_disabled;
      if (!this.is_multiple) {
        this.selected_item.off('focus.chosen', this.activate_field);
      }
      if (this.is_disabled) {
        return this.close_field();
      } else if (!this.is_multiple) {
        return this.selected_item.on('focus.chosen', this.activate_field);
      }
    };

    Chosen.prototype.container_mousedown = function (evt) {
      var ref;
      if (this.is_disabled) {
        return;
      }
      if (evt && ((ref = evt.type) === 'mousedown' || ref === 'touchstart') && !this.results_showing) {
        evt.preventDefault();
      }
      if (!(evt != null && $(evt.target).hasClass("search-choice-close"))) {
        if (!this.active_field) {
          if (this.is_multiple) {
            this.search_field.val("");
          }
          $(this.container[0].ownerDocument).on('click.chosen', this.click_test_action);
          this.results_show();
        } else if (!this.is_multiple && evt && ($(evt.target)[0] === this.selected_item[0] || $(evt.target).parents("a.chosen-single").length)) {
          evt.preventDefault();
          this.results_toggle();
        }
        return this.activate_field();
      }
    };

    Chosen.prototype.container_mouseup = function (evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function (evt) {
      var delta;
      if (evt.originalEvent) {
        delta = evt.originalEvent.deltaY || -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function (evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function () {
      $(this.container[0].ownerDocument).off("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      this.search_field_scale();
      return this.search_field.blur();
    };

    Chosen.prototype.activate_field = function () {
      if (this.is_disabled) {
        return;
      }
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function (evt) {
      var active_container;
      active_container = $(evt.target).closest('.chosen-container');
      if (active_container.length && this.container[0] === active_container[0]) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function () {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function (el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop(high_bottom - maxHeight > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function () {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function () {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      if (!this.is_multiple) {
        this.search_container.append(this.search_field);
      }
      this.container.addClass("chosen-with-drop");
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.get_search_field_value());
      this.winnow_results();
      return this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
    };

    Chosen.prototype.update_results_content = function (content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function () {
      if (this.results_showing) {
        this.result_clear_highlight();
        if (!this.is_multiple) {
          this.selected_item.prepend(this.search_field);
          this.search_field.focus();
        }
        this.container.removeClass("chosen-with-drop");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function (el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function () {
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.on('click.chosen', this.label_click_handler);
      }
    };

    Chosen.prototype.show_search_field_default = function () {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function (evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function (evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function (evt) {
      if ($(evt.target).hasClass("active-result") || $(evt.target).parents('.active-result').first()) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function (item) {
      var choice, close_link;
      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + this.choice_label(item) + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.on('click.chosen', function (_this) {
          return function (evt) {
            return _this.choice_destroy_link_click(evt);
          };
        }(this));
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };

    Chosen.prototype.choice_destroy = function (link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        if (this.active_field) {
          this.search_field.focus();
        } else {
          this.show_search_field_default();
        }
        if (this.is_multiple && this.choices_count() > 0 && this.get_search_field_value().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function () {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.trigger_form_field_change();
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function () {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function (evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.reset_single_select_options();
        }
        high.addClass("result-selected");
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        this.search_field.val("");
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(this.choice_label(item));
        }
        if (this.is_multiple && (!this.hide_results_on_select || evt.metaKey || evt.ctrlKey)) {
          this.winnow_results();
        } else {
          this.results_hide();
          this.show_search_field_default();
        }
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.trigger_form_field_change({
            selected: this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        evt.preventDefault();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function (text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").html(text);
    };

    Chosen.prototype.result_deselect = function (pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.trigger_form_field_change({
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function () {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_field_value = function () {
      return this.search_field.val();
    };

    Chosen.prototype.get_search_text = function () {
      return $.trim(this.get_search_field_value());
    };

    Chosen.prototype.escape_html = function (text) {
      return $('<div/>').text(text).html();
    };

    Chosen.prototype.winnow_results_set_highlight = function () {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function (terms) {
      var no_results_html;
      no_results_html = this.get_no_results_html(terms);
      this.search_results.append(no_results_html);
      return this.form_field_jq.trigger("chosen:no_results", {
        chosen: this
      });
    };

    Chosen.prototype.no_results_clear = function () {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function () {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function () {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function () {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function () {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.search_field_scale = function () {
      var div, i, len, style, style_block, styles, width;
      if (!this.is_multiple) {
        return;
      }
      style_block = {
        position: 'absolute',
        left: '-1000px',
        top: '-1000px',
        display: 'none',
        whiteSpace: 'pre'
      };
      styles = ['fontSize', 'fontStyle', 'fontWeight', 'fontFamily', 'lineHeight', 'textTransform', 'letterSpacing'];
      for (i = 0, len = styles.length; i < len; i++) {
        style = styles[i];
        style_block[style] = this.search_field.css(style);
      }
      div = $('<div />').css(style_block);
      div.text(this.get_search_field_value());
      $('body').append(div);
      width = div.width() + 25;
      div.remove();
      if (this.container.is(':visible')) {
        width = Math.min(this.container.outerWidth() - 10, width);
      }
      return this.search_field.width(width);
    };

    Chosen.prototype.trigger_form_field_change = function (extra) {
      this.form_field_jq.trigger("input", extra);
      return this.form_field_jq.trigger("change", extra);
    };

    return Chosen;
  }(AbstractChosen);
}).call(undefined);;"use strict";

/**
 * angular-chosen-localytics - Angular Chosen directive is an AngularJS Directive that brings the Chosen jQuery in a Angular way
 * @version v1.8.0
 * @link http://github.com/leocaseiro/angular-chosen
 * @license MIT
 */
(function () {
  var e,
      t = [].indexOf || function (e) {
    for (var t = 0, n = this.length; t < n; t++) {
      if (t in this && this[t] === e) return t;
    }return -1;
  };angular.module("localytics.directives", []), e = angular.module("localytics.directives"), e.provider("chosen", function () {
    var e;return e = {}, { setOption: function setOption(t) {
        angular.extend(e, t);
      }, $get: function $get() {
        return e;
      } };
  }), e.directive("chosen", ["chosen", "$timeout", function (e, n) {
    var r, i, a, s;return i = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/, r = ["persistentCreateOption", "createOptionText", "createOption", "skipNoResults", "noResultsText", "allowSingleDeselect", "disableSearchThreshold", "disableSearch", "enableSplitWordSearch", "inheritSelectClasses", "maxSelectedOptions", "placeholderTextMultiple", "placeholderTextSingle", "searchContains", "singleBackstrokeDelete", "displayDisabledOptions", "displaySelectedOptions", "width", "includeGroupLabelInSelected", "maxShownResults"], s = function s(e) {
      return e.replace(/[A-Z]/g, function (e) {
        return "_" + e.toLowerCase();
      });
    }, a = function a(e) {
      var t;if (angular.isArray(e)) return 0 === e.length;if (angular.isObject(e)) for (t in e) {
        if (e.hasOwnProperty(t)) return !1;
      }return !0;
    }, { restrict: "A", require: "?ngModel", priority: 1, link: function link(o, l, u, c) {
        var d, f, h, g, p, b, v, y, S, w, O, m;if (o.disabledValuesHistory = o.disabledValuesHistory ? o.disabledValuesHistory : [], l = $(l), l.addClass("localytics-chosen"), f = o.$eval(u.chosen) || {}, b = angular.copy(e), angular.extend(b, f), angular.forEach(u, function (e, n) {
          if (t.call(r, n) >= 0) return u.$observe(n, function (e) {
            var t;return t = String(l.attr(u.$attr[n])).slice(0, 2), b[s(n)] = "{{" === t ? e : o.$eval(e), w();
          });
        }), y = function y() {
          return l.addClass("loading").attr("disabled", !0).trigger("chosen:updated");
        }, S = function S() {
          return l.removeClass("loading"), angular.isDefined(u.disabled) ? l.attr("disabled", u.disabled) : l.attr("disabled", !1), l.trigger("chosen:updated");
        }, d = null, h = !1, g = function g() {
          var e, t;if (d) {
            if (t = $(l.next(".chosen-with-drop")), t && t.length > 0) return;return l.trigger("chosen:updated");
          }if (o.$evalAsync(function () {
            d = l.chosen(b).data("chosen");
          }), angular.isObject(d)) return e = d.default_text;
        }, w = function w() {
          return d && h ? l.attr("data-placeholder", d.results_none_found).attr("disabled", !0) : l.removeAttr("data-placeholder"), l.trigger("chosen:updated");
        }, c ? (v = c.$render, c.$render = function () {
          return v(), g();
        }, l.on("chosen:hiding_dropdown", function () {
          return o.$apply(function () {
            return c.$setTouched();
          });
        }), u.multiple && (m = function m() {
          return c.$viewValue;
        }, o.$watch(m, c.$render, !0))) : g(), u.$observe("disabled", function () {
          return l.trigger("chosen:updated");
        }), u.ngOptions && c) return p = u.ngOptions.match(i), O = p[7], o.$watchCollection(O, function (e, t) {
          var r;return r = n(function () {
            return angular.isUndefined(e) ? y() : (h = a(e), S(), w());
          });
        }), o.$on("$destroy", function (e) {
          if ("undefined" != typeof timer && null !== timer) return n.cancel(timer);
        });
      } };
  }]);
}).call(undefined);;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {
    'use strict';

    var Slick = window.Slick || {};

    Slick = function () {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this,
                dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function customPaging(slider, i) {
                    return $('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

            _.registerBreakpoints();
            _.init(true);
        }

        return Slick;
    }();

    Slick.prototype.activateADA = function () {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });
    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {

        var _ = this;

        if (typeof index === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || index >= _.slideCount) {
            return false;
        }

        _.unload();

        if (typeof index === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function (index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();
    };

    Slick.prototype.animateHeight = function () {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function (targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }
        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -_.currentLeft;
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function step(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' + now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' + now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function complete() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });
            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function () {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }
            }
        }
    };

    Slick.prototype.getNavTarget = function () {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if (asNavFor && asNavFor !== null) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;
    };

    Slick.prototype.asNavFor = function (index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if (asNavFor !== null && (typeof asNavFor === 'undefined' ? 'undefined' : _typeof(asNavFor)) === 'object') {
            asNavFor.each(function () {
                var target = $(this).slick('getSlick');
                if (!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }
    };

    Slick.prototype.applyTransition = function (slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }
    };

    Slick.prototype.autoPlay = function () {

        var _ = this;

        _.autoPlayClear();

        if (_.slideCount > _.options.slidesToShow) {
            _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
        }
    };

    Slick.prototype.autoPlayClear = function () {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }
    };

    Slick.prototype.autoPlayIterator = function () {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if (!_.paused && !_.interrupted && !_.focussed) {

            if (_.options.infinite === false) {

                if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
                    _.direction = 0;
                } else if (_.direction === 0) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if (_.currentSlide - 1 === 0) {
                        _.direction = 1;
                    }
                }
            }

            _.slideHandler(slideTo);
        }
    };

    Slick.prototype.buildArrows = function () {

        var _ = this;

        if (_.options.arrows === true) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if (_.slideCount > _.options.slidesToShow) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                }
            } else {

                _.$prevArrow.add(_.$nextArrow).addClass('slick-hidden').attr({
                    'aria-disabled': 'true',
                    'tabindex': '-1'
                });
            }
        }
    };

    Slick.prototype.buildDots = function () {

        var _ = this,
            i,
            dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');
        }
    };

    Slick.prototype.buildOut = function () {

        var _ = this;

        _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function (index, element) {
            $(element).attr('data-slick-index', index).data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = _.slideCount === 0 ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }
    };

    Slick.prototype.buildRows = function () {

        var _ = this,
            a,
            b,
            c,
            newSlides,
            numOfSlides,
            originalSlides,
            slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if (_.options.rows > 1) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

            for (a = 0; a < numOfSlides; a++) {
                var slide = document.createElement('div');
                for (b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for (c = 0; c < _.options.slidesPerRow; c++) {
                        var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children().css({
                'width': 100 / _.options.slidesPerRow + '%',
                'display': 'inline-block'
            });
        }
    };

    Slick.prototype.checkResponsive = function (initial, forceUpdate) {

        var _ = this,
            breakpoint,
            targetBreakpoint,
            respondToWidth,
            triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint = targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if (!initial && triggerBreakpoint !== false) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }
    };

    Slick.prototype.changeSlide = function (event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset,
            slideOffset,
            unevenOffset;

        // If target is a link, prevent default action.
        if ($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if (!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }
    };

    Slick.prototype.checkNavigable = function (index) {

        var _ = this,
            navigables,
            prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function () {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots).off('click.slick', _.changeSlide).off('mouseenter.slick', $.proxy(_.interrupt, _, true)).off('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).off('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.cleanUpSlideEvents = function () {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
    };

    Slick.prototype.cleanUpRows = function () {

        var _ = this,
            originalSlides;

        if (_.options.rows > 1) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }
    };

    Slick.prototype.clickHandler = function (event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }
    };

    Slick.prototype.destroy = function (refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.$prevArrow.length) {

            _.$prevArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

            if (_.htmlExpr.test(_.options.prevArrow)) {
                _.$prevArrow.remove();
            }
        }

        if (_.$nextArrow && _.$nextArrow.length) {

            _.$nextArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

            if (_.htmlExpr.test(_.options.nextArrow)) {
                _.$nextArrow.remove();
            }
        }

        if (_.$slides) {

            _.$slides.removeClass('slick-slide slick-active slick-center slick-visible slick-current').removeAttr('aria-hidden').removeAttr('data-slick-index').each(function () {
                $(this).attr('style', $(this).data('originalStyling'));
            });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if (!refresh) {
            _.$slider.trigger('destroy', [_]);
        }
    };

    Slick.prototype.disableTransition = function (slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }
    };

    Slick.prototype.fadeSlide = function (slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);
        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function () {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }
        }
    };

    Slick.prototype.fadeSlideOut = function (slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);
        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });
        }
    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();
        }
    };

    Slick.prototype.focusHandler = function () {

        var _ = this;

        _.$slider.off('focus.slick blur.slick').on('focus.slick blur.slick', '*:not(.slick-arrow)', function (event) {

            event.stopImmediatePropagation();
            var $sf = $(this);

            setTimeout(function () {

                if (_.options.pauseOnFocus) {
                    _.focussed = $sf.is(':focus');
                    _.autoPlay();
                }
            }, 0);
        });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {

        var _ = this;
        return _.currentSlide;
    };

    Slick.prototype.getDotCount = function () {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if (!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        } else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;
    };

    Slick.prototype.getLeft = function (slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
                verticalOffset = verticalHeight * _.options.slidesToShow * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1;
                        verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
                    } else {
                        _.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1;
                        verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
                verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
        } else {
            targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft = 0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft = 0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;
    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {

        var _ = this;

        return _.options[option];
    };

    Slick.prototype.getNavigableIndexes = function () {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;
    };

    Slick.prototype.getSlick = function () {

        return this;
    };

    Slick.prototype.getSlideCount = function () {

        var _ = this,
            slidesTraversed,
            swipedSlide,
            centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function (index, slide) {
                if (slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 > _.swipeLeft * -1) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;
        } else {
            return _.options.slidesToScroll;
        }
    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);
    };

    Slick.prototype.init = function (creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();
        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if (_.options.autoplay) {

            _.paused = false;
            _.autoPlay();
        }
    };

    Slick.prototype.initADA = function () {
        var _ = this;
        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        _.$slideTrack.attr('role', 'listbox');

        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
            $(this).attr({
                'role': 'option',
                'aria-describedby': 'slick-slide' + _.instanceUid + i + ''
            });
        });

        if (_.$dots !== null) {
            _.$dots.attr('role', 'tablist').find('li').each(function (i) {
                $(this).attr({
                    'role': 'presentation',
                    'aria-selected': 'false',
                    'aria-controls': 'navigation' + _.instanceUid + i + '',
                    'id': 'slick-slide' + _.instanceUid + i + ''
                });
            }).first().attr('aria-selected', 'true').end().find('button').attr('role', 'button').end().closest('div').attr('role', 'toolbar');
        }
        _.activateADA();
    };

    Slick.prototype.initArrowEvents = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.off('click.slick').on('click.slick', {
                message: 'previous'
            }, _.changeSlide);
            _.$nextArrow.off('click.slick').on('click.slick', {
                message: 'next'
            }, _.changeSlide);
        }
    };

    Slick.prototype.initDotEvents = function () {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true) {

            $('li', _.$dots).on('mouseenter.slick', $.proxy(_.interrupt, _, true)).on('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }
    };

    Slick.prototype.initSlideEvents = function () {

        var _ = this;

        if (_.options.pauseOnHover) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }
    };

    Slick.prototype.initializeEvents = function () {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.initUI = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();
        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();
        }
    };

    Slick.prototype.keyHandler = function (event) {

        var _ = this;
        //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' : 'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }
    };

    Slick.prototype.lazyLoad = function () {

        var _ = this,
            loadRange,
            cloneRange,
            rangeStart,
            rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function () {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function () {

                    image.animate({ opacity: 0 }, 100, function () {
                        image.attr('src', imageSource).animate({ opacity: 1 }, 200, function () {
                            image.removeAttr('data-lazy').removeClass('slick-loading');
                        });
                        _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                    });
                };

                imageToLoad.onerror = function () {

                    image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
                };

                imageToLoad.src = imageSource;
            });
        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }
    };

    Slick.prototype.loadSlider = function () {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }
    };

    Slick.prototype.next = Slick.prototype.slickNext = function () {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });
    };

    Slick.prototype.orientationChange = function () {

        var _ = this;

        _.checkResponsive();
        _.setPosition();
    };

    Slick.prototype.pause = Slick.prototype.slickPause = function () {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;
    };

    Slick.prototype.play = Slick.prototype.slickPlay = function () {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;
    };

    Slick.prototype.postSlide = function (index) {

        var _ = this;

        if (!_.unslicked) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            _.setPosition();

            _.swipeLeft = null;

            if (_.options.autoplay) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();
            }
        }
    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function () {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });
    };

    Slick.prototype.preventDefault = function (event) {

        event.preventDefault();
    };

    Slick.prototype.progressiveLazyLoad = function (tryCount) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $('img[data-lazy]', _.$slider),
            image,
            imageSource,
            imageToLoad;

        if ($imgsToLoad.length) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function () {

                image.attr('src', imageSource).removeAttr('data-lazy').removeClass('slick-loading');

                if (_.options.adaptiveHeight === true) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                _.progressiveLazyLoad();
            };

            imageToLoad.onerror = function () {

                if (tryCount < 3) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout(function () {
                        _.progressiveLazyLoad(tryCount + 1);
                    }, 500);
                } else {

                    image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

                    _.progressiveLazyLoad();
                }
            };

            imageToLoad.src = imageSource;
        } else {

            _.$slider.trigger('allImagesLoaded', [_]);
        }
    };

    Slick.prototype.refresh = function (initializing) {

        var _ = this,
            currentSlide,
            lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if (!initializing) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);
        }
    };

    Slick.prototype.registerBreakpoints = function () {

        var _ = this,
            breakpoint,
            currentBreakpoint,
            l,
            responsiveSettings = _.options.responsive || null;

        if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {

            _.respondTo = _.options.respondTo || 'window';

            for (breakpoint in responsiveSettings) {

                l = _.breakpoints.length - 1;
                currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while (l >= 0) {
                        if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
                            _.breakpoints.splice(l, 1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
                }
            }

            _.breakpoints.sort(function (a, b) {
                return _.options.mobileFirst ? a - b : b - a;
            });
        }
    };

    Slick.prototype.reinit = function () {

        var _ = this;

        _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);
    };

    Slick.prototype.resize = function () {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function () {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if (!_.unslicked) {
                    _.setPosition();
                }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {

        var _ = this;

        if (typeof index === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();
    };

    Slick.prototype.setCSS = function (position) {

        var _ = this,
            positionProps = {},
            x,
            y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }
    };

    Slick.prototype.setDimensions = function () {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: '0px ' + _.options.centerPadding
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: _.options.centerPadding + ' 0px'
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();

        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length));
        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
    };

    Slick.prototype.setFade = function () {

        var _ = this,
            targetLeft;

        _.$slides.each(function (index, element) {
            targetLeft = _.slideWidth * index * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });
    };

    Slick.prototype.setHeight = function () {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }
    };

    Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {

        /**
         * accepts arguments in format of:
         *
         *  - for changing a single option's value:
         *     .slick("setOption", option, value, refresh )
         *
         *  - for changing a set of responsive options:
         *     .slick("setOption", 'responsive', [{}, ...], refresh )
         *
         *  - for updating multiple values at once (not responsive)
         *     .slick("setOption", { 'option': value, ... }, refresh )
         */

        var _ = this,
            l,
            item,
            option,
            value,
            refresh = false,
            type;

        if ($.type(arguments[0]) === 'object') {

            option = arguments[0];
            refresh = arguments[1];
            type = 'multiple';
        } else if ($.type(arguments[0]) === 'string') {

            option = arguments[0];
            value = arguments[1];
            refresh = arguments[2];

            if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {

                type = 'responsive';
            } else if (typeof arguments[1] !== 'undefined') {

                type = 'single';
            }
        }

        if (type === 'single') {

            _.options[option] = value;
        } else if (type === 'multiple') {

            $.each(option, function (opt, val) {

                _.options[opt] = val;
            });
        } else if (type === 'responsive') {

            for (item in value) {

                if ($.type(_.options.responsive) !== 'array') {

                    _.options.responsive = [value[item]];
                } else {

                    l = _.options.responsive.length - 1;

                    // loop through the responsive object and splice out duplicates.
                    while (l >= 0) {

                        if (_.options.responsive[l].breakpoint === value[item].breakpoint) {

                            _.options.responsive.splice(l, 1);
                        }

                        l--;
                    }

                    _.options.responsive.push(value[item]);
                }
            }
        }

        if (refresh) {

            _.unload();
            _.reinit();
        }
    };

    Slick.prototype.setPosition = function () {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);
    };

    Slick.prototype.setProps = function () {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if (_.options.fade) {
            if (typeof _.options.zIndex === 'number') {
                if (_.options.zIndex < 3) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false;
    };

    Slick.prototype.setSlideClasses = function (index) {

        var _ = this,
            centerOffset,
            allSlides,
            indexOffset,
            remainder;

        allSlides = _.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden', 'true');

        _.$slides.eq(index).addClass('slick-current');

        if (_.options.centerMode === true) {

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {

                    _.$slides.slice(index - centerOffset, index + centerOffset + 1).addClass('slick-active').attr('aria-hidden', 'false');
                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides.slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2).addClass('slick-active').attr('aria-hidden', 'false');
                }

                if (index === 0) {

                    allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
                } else if (index === _.slideCount - 1) {

                    allSlides.eq(_.options.slidesToShow).addClass('slick-center');
                }
            }

            _.$slides.eq(index).addClass('slick-center');
        } else {

            if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {

                _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides.addClass('slick-active').attr('aria-hidden', 'false');
            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow) {

                    allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass('slick-active').attr('aria-hidden', 'false');
                } else {

                    allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
                }
            }
        }

        if (_.options.lazyLoad === 'ondemand') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function () {

        var _ = this,
            i,
            slideIndex,
            infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function () {
                    $(this).attr('id', '');
                });
            }
        }
    };

    Slick.prototype.interrupt = function (toggle) {

        var _ = this;

        if (!toggle) {
            _.autoPlay();
        }
        _.interrupted = toggle;
    };

    Slick.prototype.selectHandler = function (event) {

        var _ = this;

        var targetElement = $(event.target).is('.slick-slide') ? $(event.target) : $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.setSlideClasses(index);
            _.asNavFor(index);
            return;
        }

        _.slideHandler(index);
    };

    Slick.prototype.slideHandler = function (index, sync, dontAnimate) {

        var targetSlide,
            animSlide,
            oldSlide,
            slideLeft,
            targetLeft = null,
            _ = this,
            navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function () {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > _.slideCount - _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function () {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if (_.options.autoplay) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - _.slideCount % _.options.slidesToScroll;
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if (_.options.asNavFor) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if (navTarget.slideCount <= navTarget.options.slidesToShow) {
                navTarget.setSlideClasses(_.currentSlide);
            }
        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function () {
                    _.postSlide(animSlide);
                });
            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true) {
            _.animateSlide(targetLeft, function () {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }
    };

    Slick.prototype.startLoad = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();
        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();
        }

        _.$slider.addClass('slick-loading');
    };

    Slick.prototype.swipeDirection = function () {

        var xDist,
            yDist,
            r,
            swipeAngle,
            _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if (swipeAngle <= 45 && swipeAngle >= 0) {
            return _.options.rtl === false ? 'left' : 'right';
        }
        if (swipeAngle <= 360 && swipeAngle >= 315) {
            return _.options.rtl === false ? 'left' : 'right';
        }
        if (swipeAngle >= 135 && swipeAngle <= 225) {
            return _.options.rtl === false ? 'right' : 'left';
        }
        if (_.options.verticalSwiping === true) {
            if (swipeAngle >= 35 && swipeAngle <= 135) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';
    };

    Slick.prototype.swipeEnd = function (event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.interrupted = false;
        _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

        if (_.touchObject.curX === undefined) {
            return false;
        }

        if (_.touchObject.edgeHit === true) {
            _.$slider.trigger('edge', [_, _.swipeDirection()]);
        }

        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {

            direction = _.swipeDirection();

            switch (direction) {

                case 'left':
                case 'down':

                    slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:

            }

            if (direction != 'vertical') {

                _.slideHandler(slideCount);
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction]);
            }
        } else {

            if (_.touchObject.startX !== _.touchObject.curX) {

                _.slideHandler(_.currentSlide);
                _.touchObject = {};
            }
        }
    };

    Slick.prototype.swipeHandler = function (event) {

        var _ = this;

        if (_.options.swipe === false || 'ontouchend' in document && _.options.swipe === false) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }
    };

    Slick.prototype.swipeMove = function (event) {

        var _ = this,
            edgeWasHit = false,
            curLeft,
            swipeDirection,
            swipeLength,
            positionOffset,
            touches;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
        }

        swipeDirection = _.swipeDirection();

        if (swipeDirection === 'vertical') {
            return;
        }

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }

        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if (_.currentSlide === 0 && swipeDirection === 'right' || _.currentSlide >= _.getDotCount() && swipeDirection === 'left') {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);
    };

    Slick.prototype.swipeStart = function (event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;
    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();
        }
    };

    Slick.prototype.unload = function () {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden', 'true').css('width', '');
    };

    Slick.prototype.unslick = function (fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();
    };

    Slick.prototype.updateArrows = function () {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            }
        }
    };

    Slick.prototype.updateDots = function () {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots.find('li').removeClass('slick-active').attr('aria-hidden', 'true');

            _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active').attr('aria-hidden', 'false');
        }
    };

    Slick.prototype.visibility = function () {

        var _ = this;

        if (_.options.autoplay) {

            if (document[_.hidden]) {

                _.interrupted = true;
            } else {

                _.interrupted = false;
            }
        }
    };

    $.fn.slick = function () {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object' || typeof opt == 'undefined') _[i].slick = new Slick(_[i], opt);else ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };
});;/*!
 * angular-slick-carousel
 * DevMark <hc.devmark@gmail.com>
 * https://github.com/devmark/angular-slick-carousel
 * Version: 3.1.7 - 2016-08-04T06:17:55.528Z
 * License: MIT
 */
"use strict";
angular.module("slickCarousel", []).constant("slickCarouselConfig", { method: {}, event: {} }).directive("slick", ["$timeout", "slickCarouselConfig", function (e, n) {
  var i, t;return i = ["slickGoTo", "slickNext", "slickPrev", "slickPause", "slickPlay", "slickAdd", "slickRemove", "slickFilter", "slickUnfilter", "unslick"], t = ["afterChange", "beforeChange", "breakpoint", "destroy", "edge", "init", "reInit", "setPosition", "swipe", "lazyLoaded", "lazyLoadError"], { scope: { settings: "=", enabled: "@", accessibility: "@", adaptiveHeight: "@", autoplay: "@", autoplaySpeed: "@", arrows: "@", asNavFor: "@", appendArrows: "@", prevArrow: "@", nextArrow: "@", centerMode: "@", centerPadding: "@", cssEase: "@", customPaging: "&", dots: "@", draggable: "@", fade: "@", focusOnSelect: "@", easing: "@", edgeFriction: "@", infinite: "@", initialSlide: "@", lazyLoad: "@", mobileFirst: "@", pauseOnHover: "@", pauseOnDotsHover: "@", respondTo: "@", responsive: "=?", rows: "@", slide: "@", slidesPerRow: "@", slidesToShow: "@", slidesToScroll: "@", speed: "@", swipe: "@", swipeToSlide: "@", touchMove: "@", touchThreshold: "@", useCSS: "@", variableWidth: "@", vertical: "@", verticalSwiping: "@", rtl: "@" }, restrict: "AE", link: function link(t, o, a) {
      angular.element(o).css("display", "none");var r, s, l, d, u, c;return s = function s() {
        r = angular.extend(angular.copy(n), { enabled: "false" !== t.enabled, accessibility: "false" !== t.accessibility, adaptiveHeight: "true" === t.adaptiveHeight, autoplay: "true" === t.autoplay, autoplaySpeed: null != t.autoplaySpeed ? parseInt(t.autoplaySpeed, 10) : 3e3, arrows: "false" !== t.arrows, asNavFor: t.asNavFor ? t.asNavFor : void 0, appendArrows: angular.element(t.appendArrows ? t.appendArrows : o), prevArrow: t.prevArrow ? angular.element(t.prevArrow) : void 0, nextArrow: t.nextArrow ? angular.element(t.nextArrow) : void 0, centerMode: "true" === t.centerMode, centerPadding: t.centerPadding || "50px", cssEase: t.cssEase || "ease", customPaging: a.customPaging ? function (e, n) {
            return t.customPaging({ slick: e, index: n });
          } : void 0, dots: "true" === t.dots, draggable: "false" !== t.draggable, fade: "true" === t.fade, focusOnSelect: "true" === t.focusOnSelect, easing: t.easing || "linear", edgeFriction: t.edgeFriction || .15, infinite: "false" !== t.infinite, initialSlide: parseInt(t.initialSlide) || 0, lazyLoad: t.lazyLoad || "ondemand", mobileFirst: "true" === t.mobileFirst, pauseOnHover: "false" !== t.pauseOnHover, pauseOnDotsHover: "true" === t.pauseOnDotsHover, respondTo: null != t.respondTo ? t.respondTo : "window", responsive: t.responsive || void 0, rows: null != t.rows ? parseInt(t.rows, 10) : 1, slide: t.slide || "", slidesPerRow: null != t.slidesPerRow ? parseInt(t.slidesPerRow, 10) : 1, slidesToShow: null != t.slidesToShow ? parseInt(t.slidesToShow, 10) : 1, slidesToScroll: null != t.slidesToScroll ? parseInt(t.slidesToScroll, 10) : 1, speed: null != t.speed ? parseInt(t.speed, 10) : 300, swipe: "false" !== t.swipe, swipeToSlide: "true" === t.swipeToSlide, touchMove: "false" !== t.touchMove, touchThreshold: t.touchThreshold ? parseInt(t.touchThreshold, 10) : 5, useCSS: "false" !== t.useCSS, variableWidth: "true" === t.variableWidth, vertical: "true" === t.vertical, verticalSwiping: "true" === t.verticalSwiping, rtl: "true" === t.rtl }, t.settings);
      }, l = function l() {
        var e = angular.element(o);return e.hasClass("slick-initialized") && (e.remove("slick-list"), e.slick("unslick")), e;
      }, d = function d() {
        s();var n = angular.element(o);if (angular.element(o).hasClass("slick-initialized")) {
          if (r.enabled) return n.slick("getSlick");l();
        } else {
          if (!r.enabled) return;n.on("init", function (e, n) {
            return "undefined" != typeof r.event.init && r.event.init(e, n), "undefined" != typeof c ? n.slideHandler(c) : void 0;
          }), e(function () {
            angular.element(o).css("display", "block"), n.not(".slick-initialized").slick(r);
          });
        }t.internalControl = r.method || {}, i.forEach(function (e) {
          t.internalControl[e] = function () {
            var i;i = Array.prototype.slice.call(arguments), i.unshift(e), n.slick.apply(o, i);
          };
        }), n.on("afterChange", function (n, i, o) {
          c = o, "undefined" != typeof r.event.afterChange && e(function () {
            t.$apply(function () {
              r.event.afterChange(n, i, o);
            });
          });
        }), n.on("beforeChange", function (n, i, o, a) {
          "undefined" != typeof r.event.beforeChange && e(function () {
            e(function () {
              t.$apply(function () {
                r.event.beforeChange(n, i, o, a);
              });
            });
          });
        }), n.on("reInit", function (n, i) {
          "undefined" != typeof r.event.reInit && e(function () {
            t.$apply(function () {
              r.event.reInit(n, i);
            });
          });
        }), "undefined" != typeof r.event.breakpoint && n.on("breakpoint", function (n, i, o) {
          e(function () {
            t.$apply(function () {
              r.event.breakpoint(n, i, o);
            });
          });
        }), "undefined" != typeof r.event.destroy && n.on("destroy", function (n, i) {
          e(function () {
            t.$apply(function () {
              r.event.destroy(n, i);
            });
          });
        }), "undefined" != typeof r.event.edge && n.on("edge", function (n, i, o) {
          e(function () {
            t.$apply(function () {
              r.event.edge(n, i, o);
            });
          });
        }), "undefined" != typeof r.event.setPosition && n.on("setPosition", function (n, i) {
          e(function () {
            t.$apply(function () {
              r.event.setPosition(n, i);
            });
          });
        }), "undefined" != typeof r.event.swipe && n.on("swipe", function (n, i, o) {
          e(function () {
            t.$apply(function () {
              r.event.swipe(n, i, o);
            });
          });
        }), "undefined" != typeof r.event.lazyLoaded && n.on("lazyLoaded", function (n, i, o, a) {
          e(function () {
            t.$apply(function () {
              r.event.lazyLoaded(n, i, o, a);
            });
          });
        }), "undefined" != typeof r.event.lazyLoadError && n.on("lazyLoadError", function (n, i, o, a) {
          e(function () {
            t.$apply(function () {
              r.event.lazyLoadError(n, i, o, a);
            });
          });
        });
      }, u = function u() {
        l(), d();
      }, o.one("$destroy", function () {
        l();
      }), t.$watch("settings", function (e, n) {
        return null !== e ? u() : void 0;
      }, !0);
    } };
}]);;'use strict';

/**
 * dirPagination - AngularJS module for paginating (almost) anything.
 *
 *
 * Credits
 * =======
 *
 * Daniel Tabuenca: https://groups.google.com/d/msg/angular/an9QpzqIYiM/r8v-3W1X5vcJ
 * for the idea on how to dynamically invoke the ng-repeat directive.
 *
 * I borrowed a couple of lines and a few attribute names from the AngularUI Bootstrap project:
 * https://github.com/angular-ui/bootstrap/blob/master/src/pagination/pagination.js
 *
 * Copyright 2014 Michael Bromley <michael@michaelbromley.co.uk>
 */

(function () {

    /**
     * Config
     */
    var moduleName = 'angularUtils.directives.dirPagination';
    var DEFAULT_ID = '__default';

    /**
     * Module
     */
    angular.module(moduleName, []).directive('dirPaginate', ['$compile', '$parse', 'paginationService', dirPaginateDirective]).directive('dirPaginateNoCompile', noCompileDirective).directive('dirPaginationControls', ['paginationService', 'paginationTemplate', dirPaginationControlsDirective]).filter('itemsPerPage', ['paginationService', itemsPerPageFilter]).service('paginationService', paginationService).provider('paginationTemplate', paginationTemplateProvider).run(['$templateCache', dirPaginationControlsTemplateInstaller]);

    function dirPaginateDirective($compile, $parse, paginationService) {

        return {
            terminal: true,
            multiElement: true,
            priority: 100,
            compile: dirPaginationCompileFn
        };

        function dirPaginationCompileFn(tElement, tAttrs) {

            var expression = tAttrs.dirPaginate;
            // regex taken directly from https://github.com/angular/angular.js/blob/v1.4.x/src/ng/directive/ngRepeat.js#L339
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

            var filterPattern = /\|\s*itemsPerPage\s*:\s*(.*\(\s*\w*\)|([^\)]*?(?=\s+as\s+))|[^\)]*)/;
            if (match[2].match(filterPattern) === null) {
                throw 'pagination directive: the \'itemsPerPage\' filter must be set.';
            }
            var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
            var collectionGetter = $parse(itemsPerPageFilterRemoved);

            addNoCompileAttributes(tElement);

            // If any value is specified for paginationId, we register the un-evaluated expression at this stage for the benefit of any
            // dir-pagination-controls directives that may be looking for this ID.
            var rawId = tAttrs.paginationId || DEFAULT_ID;
            paginationService.registerInstance(rawId);

            return function dirPaginationLinkFn(scope, element, attrs) {

                // Now that we have access to the `scope` we can interpolate any expression given in the paginationId attribute and
                // potentially register a new ID if it evaluates to a different value than the rawId.
                var paginationId = $parse(attrs.paginationId)(scope) || attrs.paginationId || DEFAULT_ID;

                // (TODO: this seems sound, but I'm reverting as many bug reports followed it's introduction in 0.11.0.
                // Needs more investigation.)
                // In case rawId != paginationId we deregister using rawId for the sake of general cleanliness
                // before registering using paginationId
                // paginationService.deregisterInstance(rawId);
                paginationService.registerInstance(paginationId);

                var repeatExpression = getRepeatExpression(expression, paginationId);
                addNgRepeatToElement(element, attrs, repeatExpression);

                removeTemporaryAttributes(element);
                var compiled = $compile(element);

                var currentPageGetter = makeCurrentPageGetterFn(scope, attrs, paginationId);
                paginationService.setCurrentPageParser(paginationId, currentPageGetter, scope);

                if (typeof attrs.totalItems !== 'undefined') {
                    paginationService.setAsyncModeTrue(paginationId);
                    scope.$watch(function () {
                        return $parse(attrs.totalItems)(scope);
                    }, function (result) {
                        if (0 <= result) {
                            paginationService.setCollectionLength(paginationId, result);
                        }
                    });
                } else {
                    paginationService.setAsyncModeFalse(paginationId);
                    scope.$watchCollection(function () {
                        return collectionGetter(scope);
                    }, function (collection) {
                        if (collection) {
                            var collectionLength = collection instanceof Array ? collection.length : Object.keys(collection).length;
                            paginationService.setCollectionLength(paginationId, collectionLength);
                        }
                    });
                }

                // Delegate to the link function returned by the new compilation of the ng-repeat
                compiled(scope);

                // (TODO: Reverting this due to many bug reports in v 0.11.0. Needs investigation as the
                // principle is sound)
                // When the scope is destroyed, we make sure to remove the reference to it in paginationService
                // so that it can be properly garbage collected
                // scope.$on('$destroy', function destroyDirPagination() {
                //     paginationService.deregisterInstance(paginationId);
                // });
            };
        }

        /**
         * If a pagination id has been specified, we need to check that it is present as the second argument passed to
         * the itemsPerPage filter. If it is not there, we add it and return the modified expression.
         *
         * @param expression
         * @param paginationId
         * @returns {*}
         */
        function getRepeatExpression(expression, paginationId) {
            var repeatExpression,
                idDefinedInFilter = !!expression.match(/(\|\s*itemsPerPage\s*:[^|]*:[^|]*)/);

            if (paginationId !== DEFAULT_ID && !idDefinedInFilter) {
                repeatExpression = expression.replace(/(\|\s*itemsPerPage\s*:\s*[^|\s]*)/, "$1 : '" + paginationId + "'");
            } else {
                repeatExpression = expression;
            }

            return repeatExpression;
        }

        /**
         * Adds the ng-repeat directive to the element. In the case of multi-element (-start, -end) it adds the
         * appropriate multi-element ng-repeat to the first and last element in the range.
         * @param element
         * @param attrs
         * @param repeatExpression
         */
        function addNgRepeatToElement(element, attrs, repeatExpression) {
            if (element[0].hasAttribute('dir-paginate-start') || element[0].hasAttribute('data-dir-paginate-start')) {
                // using multiElement mode (dir-paginate-start, dir-paginate-end)
                attrs.$set('ngRepeatStart', repeatExpression);
                element.eq(element.length - 1).attr('ng-repeat-end', true);
            } else {
                attrs.$set('ngRepeat', repeatExpression);
            }
        }

        /**
         * Adds the dir-paginate-no-compile directive to each element in the tElement range.
         * @param tElement
         */
        function addNoCompileAttributes(tElement) {
            angular.forEach(tElement, function (el) {
                if (el.nodeType === 1) {
                    angular.element(el).attr('dir-paginate-no-compile', true);
                }
            });
        }

        /**
         * Removes the variations on dir-paginate (data-, -start, -end) and the dir-paginate-no-compile directives.
         * @param element
         */
        function removeTemporaryAttributes(element) {
            angular.forEach(element, function (el) {
                if (el.nodeType === 1) {
                    angular.element(el).removeAttr('dir-paginate-no-compile');
                }
            });
            element.eq(0).removeAttr('dir-paginate-start').removeAttr('dir-paginate').removeAttr('data-dir-paginate-start').removeAttr('data-dir-paginate');
            element.eq(element.length - 1).removeAttr('dir-paginate-end').removeAttr('data-dir-paginate-end');
        }

        /**
         * Creates a getter function for the current-page attribute, using the expression provided or a default value if
         * no current-page expression was specified.
         *
         * @param scope
         * @param attrs
         * @param paginationId
         * @returns {*}
         */
        function makeCurrentPageGetterFn(scope, attrs, paginationId) {
            var currentPageGetter;
            if (attrs.currentPage) {
                currentPageGetter = $parse(attrs.currentPage);
            } else {
                // If the current-page attribute was not set, we'll make our own.
                // Replace any non-alphanumeric characters which might confuse
                // the $parse service and give unexpected results.
                // See https://github.com/michaelbromley/angularUtils/issues/233
                var defaultCurrentPage = (paginationId + '__currentPage').replace(/\W/g, '_');
                scope[defaultCurrentPage] = 1;
                currentPageGetter = $parse(defaultCurrentPage);
            }
            return currentPageGetter;
        }
    }

    /**
     * This is a helper directive that allows correct compilation when in multi-element mode (ie dir-paginate-start, dir-paginate-end).
     * It is dynamically added to all elements in the dir-paginate compile function, and it prevents further compilation of
     * any inner directives. It is then removed in the link function, and all inner directives are then manually compiled.
     */
    function noCompileDirective() {
        return {
            priority: 5000,
            terminal: true
        };
    }

    function dirPaginationControlsTemplateInstaller($templateCache) {
        $templateCache.put('angularUtils.directives.dirPagination.template', '<ul class="pagination" ng-if="1 < pages.length || !autoHide"><li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(1)">&laquo;</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a></li><li ng-repeat="pageNumber in pages track by tracker(pageNumber, $index)" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' || ( ! autoHide && pages.length === 1 ) }"><a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a></li><li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.last)">&raquo;</a></li></ul>');
    }

    function dirPaginationControlsDirective(paginationService, paginationTemplate) {

        var numberRegex = /^\d+$/;

        var DDO = {
            restrict: 'AE',
            scope: {
                maxSize: '=?',
                onPageChange: '&?',
                paginationId: '=?',
                autoHide: '=?'
            },
            link: dirPaginationControlsLinkFn
        };

        // We need to check the paginationTemplate service to see whether a template path or
        // string has been specified, and add the `template` or `templateUrl` property to
        // the DDO as appropriate. The order of priority to decide which template to use is
        // (highest priority first):
        // 1. paginationTemplate.getString()
        // 2. attrs.templateUrl
        // 3. paginationTemplate.getPath()
        var templateString = paginationTemplate.getString();
        if (templateString !== undefined) {
            DDO.template = templateString;
        } else {
            DDO.templateUrl = function (elem, attrs) {
                return attrs.templateUrl || paginationTemplate.getPath();
            };
        }
        return DDO;

        function dirPaginationControlsLinkFn(scope, element, attrs) {

            // rawId is the un-interpolated value of the pagination-id attribute. This is only important when the corresponding dir-paginate directive has
            // not yet been linked (e.g. if it is inside an ng-if block), and in that case it prevents this controls directive from assuming that there is
            // no corresponding dir-paginate directive and wrongly throwing an exception.
            var rawId = attrs.paginationId || DEFAULT_ID;
            var paginationId = scope.paginationId || attrs.paginationId || DEFAULT_ID;

            if (!paginationService.isRegistered(paginationId) && !paginationService.isRegistered(rawId)) {
                var idMessage = paginationId !== DEFAULT_ID ? ' (id: ' + paginationId + ') ' : ' ';
                if (window.console) {
                    console.warn('Pagination directive: the pagination controls' + idMessage + 'cannot be used without the corresponding pagination directive, which was not found at link time.');
                }
            }

            if (!scope.maxSize) {
                scope.maxSize = 9;
            }
            scope.autoHide = scope.autoHide === undefined ? true : scope.autoHide;
            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : true;
            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : false;

            var paginationRange = Math.max(scope.maxSize, 5);
            scope.pages = [];
            scope.pagination = {
                last: 1,
                current: 1
            };
            scope.range = {
                lower: 1,
                upper: 1,
                total: 1
            };

            scope.$watch('maxSize', function (val) {
                if (val) {
                    paginationRange = Math.max(scope.maxSize, 5);
                    generatePagination();
                }
            });

            scope.$watch(function () {
                if (paginationService.isRegistered(paginationId)) {
                    return (paginationService.getCollectionLength(paginationId) + 1) * paginationService.getItemsPerPage(paginationId);
                }
            }, function (length) {
                if (0 < length) {
                    generatePagination();
                }
            });

            scope.$watch(function () {
                if (paginationService.isRegistered(paginationId)) {
                    return paginationService.getItemsPerPage(paginationId);
                }
            }, function (current, previous) {
                if (current != previous && typeof previous !== 'undefined') {
                    goToPage(scope.pagination.current);
                }
            });

            scope.$watch(function () {
                if (paginationService.isRegistered(paginationId)) {
                    return paginationService.getCurrentPage(paginationId);
                }
            }, function (currentPage, previousPage) {
                if (currentPage != previousPage) {
                    goToPage(currentPage);
                }
            });

            scope.setCurrent = function (num) {
                if (paginationService.isRegistered(paginationId) && isValidPageNumber(num)) {
                    num = parseInt(num, 10);
                    paginationService.setCurrentPage(paginationId, num);
                }
            };

            /**
             * Custom "track by" function which allows for duplicate "..." entries on long lists,
             * yet fixes the problem of wrongly-highlighted links which happens when using
             * "track by $index" - see https://github.com/michaelbromley/angularUtils/issues/153
             * @param id
             * @param index
             * @returns {string}
             */
            scope.tracker = function (id, index) {
                return id + '_' + index;
            };

            function goToPage(num) {
                if (paginationService.isRegistered(paginationId) && isValidPageNumber(num)) {
                    var oldPageNumber = scope.pagination.current;

                    scope.pages = generatePagesArray(num, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
                    scope.pagination.current = num;
                    updateRangeValues();

                    // if a callback has been set, then call it with the page number as the first argument
                    // and the previous page number as a second argument
                    if (scope.onPageChange) {
                        scope.onPageChange({
                            newPageNumber: num,
                            oldPageNumber: oldPageNumber
                        });
                    }
                }
            }

            function generatePagination() {
                if (paginationService.isRegistered(paginationId)) {
                    var page = parseInt(paginationService.getCurrentPage(paginationId)) || 1;
                    scope.pages = generatePagesArray(page, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
                    scope.pagination.current = page;
                    scope.pagination.last = scope.pages[scope.pages.length - 1];
                    if (scope.pagination.last < scope.pagination.current) {
                        scope.setCurrent(scope.pagination.last);
                    } else {
                        updateRangeValues();
                    }
                }
            }

            /**
             * This function updates the values (lower, upper, total) of the `scope.range` object, which can be used in the pagination
             * template to display the current page range, e.g. "showing 21 - 40 of 144 results";
             */
            function updateRangeValues() {
                if (paginationService.isRegistered(paginationId)) {
                    var currentPage = paginationService.getCurrentPage(paginationId),
                        itemsPerPage = paginationService.getItemsPerPage(paginationId),
                        totalItems = paginationService.getCollectionLength(paginationId);

                    scope.range.lower = (currentPage - 1) * itemsPerPage + 1;
                    scope.range.upper = Math.min(currentPage * itemsPerPage, totalItems);
                    scope.range.total = totalItems;
                }
            }
            function isValidPageNumber(num) {
                return numberRegex.test(num) && 0 < num && num <= scope.pagination.last;
            }
        }

        /**
         * Generate an array of page numbers (or the '...' string) which is used in an ng-repeat to generate the
         * links used in pagination
         *
         * @param currentPage
         * @param rowsPerPage
         * @param paginationRange
         * @param collectionLength
         * @returns {Array}
         */
        function generatePagesArray(currentPage, collectionLength, rowsPerPage, paginationRange) {
            var pages = [];
            var totalPages = Math.ceil(collectionLength / rowsPerPage);
            var halfWay = Math.ceil(paginationRange / 2);
            var position;

            if (currentPage <= halfWay) {
                position = 'start';
            } else if (totalPages - halfWay < currentPage) {
                position = 'end';
            } else {
                position = 'middle';
            }

            var ellipsesNeeded = paginationRange < totalPages;
            var i = 1;
            while (i <= totalPages && i <= paginationRange) {
                var pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);

                var openingEllipsesNeeded = i === 2 && (position === 'middle' || position === 'end');
                var closingEllipsesNeeded = i === paginationRange - 1 && (position === 'middle' || position === 'start');
                if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                    pages.push('...');
                } else {
                    pages.push(pageNumber);
                }
                i++;
            }
            return pages;
        }

        /**
         * Given the position in the sequence of pagination links [i], figure out what page number corresponds to that position.
         *
         * @param i
         * @param currentPage
         * @param paginationRange
         * @param totalPages
         * @returns {*}
         */
        function calculatePageNumber(i, currentPage, paginationRange, totalPages) {
            var halfWay = Math.ceil(paginationRange / 2);
            if (i === paginationRange) {
                return totalPages;
            } else if (i === 1) {
                return i;
            } else if (paginationRange < totalPages) {
                if (totalPages - halfWay < currentPage) {
                    return totalPages - paginationRange + i;
                } else if (halfWay < currentPage) {
                    return currentPage - halfWay + i;
                } else {
                    return i;
                }
            } else {
                return i;
            }
        }
    }

    /**
     * This filter slices the collection into pages based on the current page number and number of items per page.
     * @param paginationService
     * @returns {Function}
     */
    function itemsPerPageFilter(paginationService) {

        return function (collection, itemsPerPage, paginationId) {
            if (typeof paginationId === 'undefined') {
                paginationId = DEFAULT_ID;
            }
            if (!paginationService.isRegistered(paginationId)) {
                throw 'pagination directive: the itemsPerPage id argument (id: ' + paginationId + ') does not match a registered pagination-id.';
            }
            var end;
            var start;
            if (angular.isObject(collection)) {
                itemsPerPage = parseInt(itemsPerPage) || 9999999999;
                if (paginationService.isAsyncMode(paginationId)) {
                    start = 0;
                } else {
                    start = (paginationService.getCurrentPage(paginationId) - 1) * itemsPerPage;
                }
                end = start + itemsPerPage;
                paginationService.setItemsPerPage(paginationId, itemsPerPage);

                if (collection instanceof Array) {
                    // the array just needs to be sliced
                    return collection.slice(start, end);
                } else {
                    // in the case of an object, we need to get an array of keys, slice that, then map back to
                    // the original object.
                    var slicedObject = {};
                    angular.forEach(keys(collection).slice(start, end), function (key) {
                        slicedObject[key] = collection[key];
                    });
                    return slicedObject;
                }
            } else {
                return collection;
            }
        };
    }

    /**
     * Shim for the Object.keys() method which does not exist in IE < 9
     * @param obj
     * @returns {Array}
     */
    function keys(obj) {
        if (!Object.keys) {
            var objKeys = [];
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    objKeys.push(i);
                }
            }
            return objKeys;
        } else {
            return Object.keys(obj);
        }
    }

    /**
     * This service allows the various parts of the module to communicate and stay in sync.
     */
    function paginationService() {

        var instances = {};
        var lastRegisteredInstance;

        this.registerInstance = function (instanceId) {
            if (typeof instances[instanceId] === 'undefined') {
                instances[instanceId] = {
                    asyncMode: false
                };
                lastRegisteredInstance = instanceId;
            }
        };

        this.deregisterInstance = function (instanceId) {
            delete instances[instanceId];
        };

        this.isRegistered = function (instanceId) {
            return typeof instances[instanceId] !== 'undefined';
        };

        this.getLastInstanceId = function () {
            return lastRegisteredInstance;
        };

        this.setCurrentPageParser = function (instanceId, val, scope) {
            instances[instanceId].currentPageParser = val;
            instances[instanceId].context = scope;
        };
        this.setCurrentPage = function (instanceId, val) {
            instances[instanceId].currentPageParser.assign(instances[instanceId].context, val);
        };
        this.getCurrentPage = function (instanceId) {
            var parser = instances[instanceId].currentPageParser;
            return parser ? parser(instances[instanceId].context) : 1;
        };

        this.setItemsPerPage = function (instanceId, val) {
            instances[instanceId].itemsPerPage = val;
        };
        this.getItemsPerPage = function (instanceId) {
            return instances[instanceId].itemsPerPage;
        };

        this.setCollectionLength = function (instanceId, val) {
            instances[instanceId].collectionLength = val;
        };
        this.getCollectionLength = function (instanceId) {
            return instances[instanceId].collectionLength;
        };

        this.setAsyncModeTrue = function (instanceId) {
            instances[instanceId].asyncMode = true;
        };

        this.setAsyncModeFalse = function (instanceId) {
            instances[instanceId].asyncMode = false;
        };

        this.isAsyncMode = function (instanceId) {
            return instances[instanceId].asyncMode;
        };
    }

    /**
     * This provider allows global configuration of the template path used by the dir-pagination-controls directive.
     */
    function paginationTemplateProvider() {

        var templatePath = 'angularUtils.directives.dirPagination.template';
        var templateString;

        /**
         * Set a templateUrl to be used by all instances of <dir-pagination-controls>
         * @param {String} path
         */
        this.setPath = function (path) {
            templatePath = path;
        };

        /**
         * Set a string of HTML to be used as a template by all instances
         * of <dir-pagination-controls>. If both a path *and* a string have been set,
         * the string takes precedence.
         * @param {String} str
         */
        this.setString = function (str) {
            templateString = str;
        };

        this.$get = function () {
            return {
                getPath: function getPath() {
                    return templatePath;
                },
                getString: function getString() {
                    return templateString;
                }
            };
        };
    }
})();;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
  if (typeof define === 'function' && define.amd) {
    define("deeplink", factory(root));
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory(root);
  } else {
    root["deeplink"] = factory(root);
  }
})(window || undefined, function (root) {
  "use strict";

  var deepone = function deepone(options) {
    var fallback = options.fallback || '';
    var url = options.url || '';
    var iosStoreLink = options.ios_store_link;
    var androidPackageName = options.android_package_name;
    var playStoreLink = 'https://market.android.com/details?id=' + androidPackageName;
    var ua = window.navigator.userAgent;

    // split the first :// from the url string
    var split = url.split(/:\/\/(.+)/);
    var scheme = split[0];
    var path = split[1] || '';

    var urls = {
      deepLink: url,
      iosStoreLink: iosStoreLink,
      android_intent: 'intent://' + path + '#Intent;scheme=' + scheme + ';package=' + androidPackageName + ';end;',
      playStoreLink: playStoreLink,
      fallback: fallback
    };

    var isMobile = {
      android: function android() {
        return (/Android/i.test(ua)
        );
      },
      ios: function ios() {
        return (/iPhone|iPad|iPod/i.test(ua)
        );
      }

      // fallback to the application store on mobile devices
    };if (isMobile.ios() && urls.deepLink && urls.iosStoreLink) {
      iosLaunch();
    } else if (isMobile.android() && androidPackageName) {
      androidLaunch();
    } else {
      window.location = urls.fallback;
    }

    function launchWekitApproach(url, fallback) {
      document.location = url;
      setTimeout(function () {
        document.location = fallback;
      }, 2000);
    }

    function launchIframeApproach(url, fallback) {
      var iframe = document.createElement('iframe');
      iframe.style.border = 'none';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.onload = function () {
        document.location = url;
      };
      iframe.src = url;

      window.onload = function () {
        document.body.appendChild(iframe);

        setTimeout(function () {
          window.location = fallback;
        }, 25);
      };
    }

    function iosLaunch() {
      // chrome and safari on ios >= 9 don't allow the iframe approach
      if (ua.match(/CriOS/) || ua.match(/Safari/) && ua.match(/Version\/(9|10|11)/)) {
        launchWekitApproach(urls.deepLink, urls.iosStoreLink || urls.fallback);
      } else {
        launchIframeApproach(urls.deepLink, urls.iosStoreLink || urls.fallback);
      }
    }

    function androidLaunch() {
      if (ua.match(/Chrome/)) {
        document.location = urls.android_intent;
      } else if (ua.match(/Firefox/)) {
        launchWekitApproach(urls.deepLink, urls.playStoreLink || urls.fallback);
      } else {
        launchIframeApproach(url, urls.playStoreLink || urls.fallback);
      }
    }
  };

  // Public API
  return {
    deepone: deepone
  };
});;'use strict';

(function () {
    'use strict';

    angular.module('fancyboxplus', []).service('fancyboxService', fancyboxService).directive('fancyboxable', fancyboxableDirective).directive('fancybox', fancyboxDirective);

    function fancyboxService() {

        //Fancybox-Plus JavaScript API reference:
        // http://igorlino.github.io/fancybox-plus/api.htm

        var service = {
            fancyboxPlus: fancyboxPlus, //returns the fancyboxplus jquery plugin

            showActivity: showActivity, //Shows loading animation
            hideActivity: hideActivity, //Hides loading animation
            next: next, //Displays the next gallery item
            prev: prev, //Displays the previous gallery item
            pos: pos, //Displays item by index from gallery
            cancel: cancel, //Cancels loading content
            close: close, //Hides FancyBox. Within an iframe use - parent.close();
            resize: resize, //Auto-resizes FancyBox height to match height of content
            center: center //Centers FancyBox in viewport
        };
        return service;

        ////////////


        function fancyboxPlus() {
            return $.fancyboxPlus;
        }

        function showActivity() {
            fancyboxPlus().showActivity();
        }

        function hideActivity() {
            fancyboxPlus().hideActivity();
        }

        function pos() {
            fancyboxPlus().pos();
        }

        function cancel() {
            fancyboxPlus().cancel();
        }

        function center() {
            fancyboxPlus().center();
        }

        function next() {
            fancyboxPlus().next();
        }

        function prev() {
            fancyboxPlus().prev();
        }

        function close() {
            fancyboxPlus().close();
        }

        function resize() {
            fancyboxPlus().resize();
        }
    }

    fancyboxableDirective.$inject = ['$compile', '$rootScope', '$http', '$parse', '$timeout', 'fancyboxService'];
    function fancyboxableDirective($compile, $rootScope, $http, $parse, $timeout, fancyboxService) {
        var service = {
            restrict: 'A',
            link: fancyboxableLink,
            priority: 100 // must lower priority than ngSrc (99)
        };
        return service;

        ////////////////////////////


        fancyboxableLink.$inject = ['$scope', '$element', '$attributes'];
        function fancyboxableLink($scope, $element, $attributes, controller) {
            var fbp = null;

            $scope.$on('$destroy', function () {
                $element.remove();
            });

            init();

            function init(open) {
                var options = {
                    href: $attributes.src ? $attributes.src : $attributes.href,
                    onComplete: function onComplete() {
                        _onComplete();
                    }
                };

                //generic way that sets all (non-function) parameters of fancybox-plus.
                if ($attributes.fancyboxable && $attributes.fancyboxable.length > 0) {
                    var fbpOptionsFunc = $parse($attributes.fancyboxable);
                    var fbpOptions = fbpOptionsFunc($scope);
                    angular.extend(options, fbpOptions);
                }

                //clean undefined
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        if (typeof options[key] === 'undefined') {
                            delete options[key];
                        }
                    }
                }

                if (typeof open !== 'undefined') {
                    options.open = open;
                }

                //wait for the DOM view to be ready
                $timeout(function () {

                    if (!$attributes.ngSrc) {
                        //opens the fancybox using an href.
                        fbp = $($element).fancyboxPlus(options);
                    } else {
                        //$element.bind('load', function() {
                        /*$scope.$apply(function () {
                         options.href = $attributes.src ? $attributes.src : $attributes.href;
                         cb = $.colorbox(options);
                         });*/
                        //wait for the DOM view to be ready
                        $timeout(function () {
                            options.href = $attributes.src ? $attributes.src : $attributes.href;
                            fbp = $($element).fancyboxPlus(options);
                        }, 300);
                        //});
                    }
                }, 0);
            }

            function _onComplete() {
                $rootScope.$apply(function () {
                    var content = $('#fbplus-content');
                    $compile(content)($rootScope);
                });
            }
        }
    }

    fancyboxDirective.$inject = ['$compile', '$rootScope', '$http', '$parse', '$timeout', 'fancyboxService'];
    function fancyboxDirective($compile, $rootScope, $http, $parse, $timeout, fancyboxService) {
        var service = {
            restrict: 'E',
            scope: {
                open: '=',
                options: '=',
                templateUrl: '&',

                onStart: '&', //Will be called right before attempting to load the content
                onCancel: '&', //Will be called after loading is canceled
                onComplete: '&', //Will be called once the content is displayed
                onCleanup: '&', //Will be called just before closing
                onClosed: '&' //Will be called once FancyBox is closed

            },
            require: 'fancybox',
            link: link,
            controller: controller,
            controllerAs: 'vm'
        };
        return service;

        ////////////////////////////

        controller.$inject = ['$scope'];
        function controller($scope) {}

        link.$inject = ['$scope', '$element', '$attributes'];
        function link($scope, $element, $attributes, controller) {
            var fbp = null;

            $scope.$watch('open', function (newValue, oldValue) {
                //console.log("watch $scope.open(" + $scope.open + ") " + oldValue + "->" + newValue);
                if (oldValue !== newValue) {
                    updateOpen(newValue);
                }
            });

            $scope.$on('$destroy', function () {
                $element.remove();
            });

            init();

            function updateOpen(newValue) {
                if (newValue) {
                    init(newValue);
                } else {
                    fancyboxService.close();
                }
            }

            function init(open) {
                var options = {
                    href: $attributes.src,
                    boxFor: $attributes.boxFor,
                    onOpen: function onOpen() {
                        if ($scope.onOpen && $scope.onOpen()) {
                            $scope.onOpen()();
                        }
                    },
                    onCancel: function onCancel() {
                        if ($scope.onCancel && $scope.onCancel()) {
                            $scope.onCancel()();
                        }
                    },
                    onComplete: function onComplete() {
                        _onComplete2();
                        if ($scope.onComplete && $scope.onComplete()) {
                            $scope.onComplete()();
                        }
                    },
                    onCleanup: function onCleanup() {
                        if ($scope.onCleanup && $scope.onCleanup()) {
                            $scope.onCleanup()();
                        }
                    },
                    onClosed: function onClosed() {
                        $scope.$apply(function () {
                            $scope.open = false;
                        });
                        if ($scope.onClosed && $scope.onClosed()) {
                            $scope.onClosed()();
                        }
                    }
                };

                //generic way that sets all (non-function) parameters of fancybox-plus.
                if ($scope.options) {
                    angular.extend(options, $scope.options);
                }

                //clean undefined
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        if (typeof options[key] === 'undefined') {
                            delete options[key];
                        }
                    }
                }

                if (typeof open !== 'undefined') {
                    options.open = open;
                }

                //wait for the DOM view to be ready
                $timeout(function () {
                    if (options.boxFor) {
                        //opens the element by id boxFor
                        fbp = $(options.boxFor).fancyboxPlus(options);
                    } else if (options.href) {
                        //opens the fancybox-plus using an href.
                        fbp = $.fancyboxPlus(options);
                    }
                }, 0);
            }

            function _onComplete2() {
                $rootScope.$apply(function () {
                    var content = $('#fbplus-content');
                    $compile(content)($rootScope);
                });
            }
        }
    }
})();

//
//(function (angular, $) {
//    'use strict';
//
//    var module = angular.module('ngx.ui.lightbox', ['ngx.config', 'ngx.loader']);
//
//    /**
//     * Lightbox directive
//     */
//    module.directive('ngxLightbox', ['ngxConfig', 'ngxLoader', function (ngxConfig, ngxLoader) {
//        var deps = [
//            ngxConfig.libsPath + 'jquery.fancybox/jquery.fancybox.js',
//            ngxConfig.libsPath + 'jquery.fancybox/css/fancybox.css'
//        ];
//
//        return {
//            link: function (scope, element, attrs) {
//                // group tag
//                if (attrs.ngxLightbox) {
//                    element.attr('rel', attrs.ngxLightbox);
//                }
//
//                ngxLoader(deps, function () {
//                    $(element).fancybox({
//                        onStart: function (items, index, options) {
//                            var arrowStyle = {
//                                height: '100%',
//                                bottom: 0
//                            };
//
//                            angular.extend(options, {
//                                href: (attrs.href || attrs.src),
//                                title: attrs.title,
//                                titlePosition: 'inside',
//                                speedIn: 150,
//                                speedOut: 150
//                            });
//
//                            // autoset options by attributes
//                            if (options.href.match(/youtube\.com/)) {
//                                // youtube video
//                                angular.extend(options, {
//                                    type: 'swf',
//                                    href: attrs.href + '?autoplay=1&fs=1',        // AS3 + autoplay + fullscreen
//                                    width: 661,
//                                    height: 481,
//                                    swf: {
//                                        wmode: 'transparent',
//                                        allowfullscreen: true
//                                    }
//                                });
//                                angular.extend(arrowStyle, {
//                                    height: '40%',
//                                    bottom: '30%'
//                                });
//
//                            } else if (options.href.match(/(jpg|png|gif|bmp)$/) || options.href.match(/^data:image\//)) {
//                                // image
//                                options.type = 'image';
//
//                            } else {
//                                // iframe
//                                angular.extend(options, {
//                                    type: 'iframe',
//                                    width: '90%',
//                                    height: '95%'
//                                });
//                            }
//
//                            // override default options from attributes
//                            angular.forEach(['width', 'height', 'title', 'type'], function (attr) {
//                                if (attrs[attr]) {
//                                    options[attr] = attrs[attr];
//                                }
//                            });
//
//                            $('#fancybox-left').css(arrowStyle);
//                            $('#fancybox-right').css(arrowStyle);
//
//                            return options;
//                        }
//                    });
//                });
//            }
//        };
//    }]);
//
//})(window.angular, window.jQuery);;"use strict";
!function (e) {
  var t = {},
      i = { direction: "prev", mode: "horizontal", speed: 1, delay: 30, onCarouselTickerLoad: function onCarouselTickerLoad() {} };e.fn.carouselTicker = function (n) {
    function s() {
      l.itemsWidth = 0, l.$items.each(function () {
        var t = e(this),
            i = this.currentStyle || window.getComputedStyle(this),
            n = parseFloat(i.marginLeft) + parseFloat(i.marginRight);t.hasClass(l.cloneCls) || (l.itemsWidth += this.getBoundingClientRect().width + n);
      });
    }function o() {
      l.itemsHeight = 0, l.$items.each(function () {
        var t = e(this);t.hasClass(l.cloneCls) || (l.itemsHeight += t.outerHeight(!0));
      });
    }function r() {
      u.on("mouseover", function () {
        var e = "horizontal" === l.settings.mode ? l.itemsWidth > l.$parent.width() : l.itemsHeight > l.$parent.height();e && (clearInterval(l.intervalPointer), l.intervalPointer = !1);
      });
    }function c() {
      u.on("mouseleave", function () {
        var e = "horizontal" === l.settings.mode ? l.itemsWidth > l.$parent.width() : l.itemsHeight > l.$parent.height();if (l.isMousemove && (l.$list.off(l.eventTypes.mousemove), l.$list.trigger(l.eventTypes.mouseup)), e) {
          if (l.intervalPointer) return;l.intervalPointer = setInterval(function () {
            m();
          }, l.settings.delay);
        }
      });
    }function a() {
      var t = !1;l.$list.on(l.eventTypes.mousedown, function (i) {
        var n = i.clientX || event.touches[0].pageX,
            s = i.clientY || event.touches[0].pageY,
            o = e(this),
            r = parseFloat(e(this).css("left")),
            c = parseFloat(e(this).css("top"));e(i.target).off("click"), clearInterval(l.intervalPointer), l.intervalPointer = !1, t = !0, o.on(l.eventTypes.mousemove, function (i) {
          var a = i.clientX || event.touches[0].pageX,
              h = i.clientY || event.touches[0].pageY,
              u = n - a,
              d = s - h;l.touch && e(document).on("touchmove", function (e) {
            e.preventDefault();
          }), "horizontal" === l.settings.mode ? l.directionSwitcher = u >= 0 ? -1 : 1 : "vertical" === l.settings.mode && (l.directionSwitcher = d >= 0 ? -1 : 1), l.isMousemove = !0, t && ("horizontal" === l.settings.mode ? (r - u >= 0 && 1 === l.directionSwitcher && (o.css("left", "-=" + l.itemsWidth), r = -l.itemsWidth, n = i.clientX || event.touches[0].pageX, u = 0), r - u <= -l.itemsWidth && -1 === l.directionSwitcher && (o.css("left", 0), r = 0, u = 0, n = i.clientX || event.touches[0].pageX), o.css("left", r - u + "px")) : "vertical" === l.settings.mode && (c - d >= 0 && 1 === l.directionSwitcher && (o.css("top", "-=" + l.itemsHeight), c = -l.itemsHeight, s = i.clientY || event.touches[0].pageY, d = 0), c - d <= -l.itemsHeight && -1 === l.directionSwitcher && (o.css("top", 0), c = 0, d = 0, s = i.clientY || event.touches[0].pageY), o.css("top", c - d + "px")));
        });
      }), l.$list.on(l.eventTypes.mouseup, function (i) {
        var n = e(i.target);i.preventDefault(), (n.attr("href") || n.parents().attr("href") && l.isMousemove) && n.on("click", function (e) {
          e.preventDefault();
        }), t = !1, l.isMousemove = !1, l.settings.direction = 1 === l.directionSwitcher ? "next" : "prev", e(this).off(l.eventTypes.mousemove), l.touch && e(document).off("touchmove"), l.intervalPointer && clearInterval(l.intervalPointer), l.touch && (l.intervalPointer = setInterval(function () {
          m();
        }, l.settings.delay));
      });
    }if (0 == this.length) return this;if (this.length > 1) return this.each(function () {
      e(this).carouselTicker(n);
    }), this;var l = {},
        h = this,
        u = e(this);t.el = this, t.$el = e(this);var d = function d() {
      l.settings = e.extend({}, i, n), l.intervalPointer = null, l.directionSwitcher = "prev" === l.settings.direction ? -1 : 1, l.itemsWidth = 0, l.childsWidth = 0, l.itemsHeight = 0, l.childsHeight = 0, l.$list = u.children("ul"), l.$items = l.$list.children("li"), l.isInitialize = !1, l.isMousemove = !1, l.$parent = u.parent(), l.wrapCls = "carouselTicker__wrap", l.loaderCls = "carouselTicker__loader", l.cloneCls = "carouselTicker__clone", l.touch = "ontouchstart" in document.documentElement ? !0 : !1, l.eventTypes = { mousedown: l.touch ? "touchstart" : "mousedown", mousemove: l.touch ? "touchmove" : "mousemove", mouseup: l.touch ? "touchend" : "mouseup" }, v();
    },
        v = function v() {
      function t() {
        u.children().hasClass(l.wrapCls) || (e("<div class='" + l.loaderCls + "'></div>").appendTo(u), u.find("." + l.wrapCls).css({ position: "relative" }), l.$list.wrap("<div class='carouselTicker__wrap' style='position: relative; overflow: hidden; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none;'></div>"), l.$items.clone().addClass(l.cloneCls).appendTo(l.$list), l.$list.css({ position: "relative" }), l.isInitialize = !0, l.settings.onCarouselTickerLoad(), p());
      }"horizontal" === l.settings.mode ? (s(), l.itemsWidth > l.$parent.width() && (u.find("." + l.wrapCls).css({ width: l.$parent.width() + "px" }), l.$list.css({ width: 2 * l.itemsWidth, left: 0 }), t())) : "vertical" === l.settings.mode && (o(), l.itemsHeight > l.$parent.height() && (u.find("." + l.wrapCls).css({ height: l.$parent.height() + "px" }), l.$list.css({ height: 2 * l.itemsHeight, top: 0 }), t())), l.isInitialize && u.on("dragstart", function (e) {
        return "IMG" == e.target.nodeName.toUpperCase() || "A" == e.target.nodeName.toUpperCase() ? !1 : void 0;
      });
    },
        p = function p() {
      u.find("." + l.loaderCls).length && u.find("." + l.loaderCls).remove(), l.intervalPointer = setInterval(function () {
        m();
      }, l.settings.delay), r(), c(), a();
    },
        m = function m() {
      var e = "horizontal" === l.settings.mode ? "left" : "top",
          t = "horizontal" === l.settings.mode ? l.itemsWidth : l.itemsHeight;l.$list.css(e, "+=" + l.directionSwitcher * l.settings.speed + "px"), "prev" === l.settings.direction && Math.abs(parseInt(l.$list.css(e))) >= t && l.$list.css(e, 0), "next" === l.settings.direction && parseInt(l.$list.css(e)) >= 0 && l.$list.css(e, -t + "px");
    };return h.resizeTicker = function () {
      s(), l.itemsWidth > l.$parent.width() ? l.isInitialize || d() : l.isInitialize && h.destructor();
    }, h.stop = function () {
      clearInterval(l.intervalPointer), l.intervalPointer = !1;
    }, h.run = function () {
      p();
    }, h.destructor = function () {
      u.find("." + l.cloneCls).remove(), u.find("." + l.wrapCls).length && (l.$list.unwrap(), l.$list.css({ left: "auto", position: "static", width: "auto" }), u.css({ width: "auto", position: "static" })), clearInterval(l.intervalPointer), l.isInitialize = !1, l.intervalPointer = !1;
    }, h.reloadCarouselTicker = function (e) {
      void 0 != e && (n = e), h.destructor(), d();
    }, "loading" === document.readyState ? e(window).on("load", function () {
      d();
    }) : d(), this;
  };
}(jQuery);