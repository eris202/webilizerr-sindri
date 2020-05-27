window.Element && !Element.prototype.closest && (Element.prototype.closest = function (t) {
        var e, n = (this.document || this.ownerDocument).querySelectorAll(t),
            i = this;
        do {
            for (e = n.length; 0 <= --e && n.item(e) !== i;);
        } while (e < 0 && (i = i.parentElement));
        return i
    }),
    function () {
        function t(t, e) {
            e = e || {
                bubbles: !1,
                cancelable: !1,
                detail: void 0
            };
            var n = document.createEvent("CustomEvent");
            return n.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), n
        }
        "function" != typeof window.CustomEvent && (t.prototype = window.Event.prototype, window.CustomEvent = t)
    }(),
    function () {
        for (var t = 0, e = ["ms", "moz", "webkit", "o"], n = 0; n < e.length && !window.requestAnimationFrame; ++n) window.requestAnimationFrame = window[e[n] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[n] + "CancelAnimationFrame"] || window[e[n] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function (e, n) {
            var i = (new Date).getTime(),
                o = Math.max(0, 16 - (i - t)),
                r = window.setTimeout(function () {
                    e(i + o)
                }, o);
            return t = i + o, r
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (t) {
            clearTimeout(t)
        })
    }(),
    function (t, e) {
        "function" == typeof define && define.amd ? define([], function () {
            return e(t)
        }) : "object" == typeof exports ? module.exports = e(t) : t.SmoothScroll = e(t)
    }("undefined" != typeof global ? global : "undefined" != typeof window ? window : this, function (t) {
        "use strict";
        var e = {
                ignore: "[data-scroll-ignore]",
                header: null,
                topOnEmptyHash: !0,
                speed: 500,
                speedAsDuration: !1,
                durationMax: null,
                durationMin: null,
                clip: !0,
                offset: 0,
                easing: "easeInOutCubic",
                customEasing: null,
                updateURL: !0,
                popstate: !0,
                emitEvents: !0
            },
            n = function () {
                var t = {};
                return Array.prototype.forEach.call(arguments, function (e) {
                    for (var n in e) {
                        if (!e.hasOwnProperty(n)) return;
                        t[n] = e[n]
                    }
                }), t
            },
            i = function (t) {
                "#" === t.charAt(0) && (t = t.substr(1));
                for (var e, n = String(t), i = n.length, o = -1, r = "", a = n.charCodeAt(0); ++o < i;) {
                    if (0 === (e = n.charCodeAt(o))) throw new InvalidCharacterError("Invalid character: the input contains U+0000.");
                    r += 1 <= e && e <= 31 || 127 == e || 0 === o && 48 <= e && e <= 57 || 1 === o && 48 <= e && e <= 57 && 45 === a ? "\\" + e.toString(16) + " " : 128 <= e || 45 === e || 95 === e || 48 <= e && e <= 57 || 65 <= e && e <= 90 || 97 <= e && e <= 122 ? n.charAt(o) : "\\" + n.charAt(o)
                }
                return "#" + r
            },
            o = function () {
                return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight)
            },
            r = function (e, n, i, o) {
                if (n.emitEvents && "function" == typeof t.CustomEvent) {
                    var r = new CustomEvent(e, {
                        bubbles: !0,
                        detail: {
                            anchor: i,
                            toggle: o
                        }
                    });
                    document.dispatchEvent(r)
                }
            };
        return function (a, s) {
            var u, l, d, c, h = {
                cancelScroll: function (t) {
                    cancelAnimationFrame(c), c = null, t || r("scrollCancel", u)
                }
            };
            h.animateScroll = function (i, a, s) {
                h.cancelScroll();
                var l = n(u || e, s || {}),
                    m = "[object Number]" === Object.prototype.toString.call(i),
                    p = m || !i.tagName ? null : i;
                if (m || p) {
                    var f = t.pageYOffset;
                    l.header && !d && (d = document.querySelector(l.header));
                    var g, v, w, y, M, b, E, S, A = function (e) {
                            return e ? (n = e, parseInt(t.getComputedStyle(n).height, 10) + e.offsetTop) : 0;
                            var n
                        }(d),
                        T = m ? i : function (e, n, i, r) {
                            var a = 0;
                            if (e.offsetParent)
                                for (; a += e.offsetTop, e = e.offsetParent;);
                            return a = Math.max(a - n - i, 0), r && (a = Math.min(a, o() - t.innerHeight)), a
                        }(p, A, parseInt("function" == typeof l.offset ? l.offset(i, a) : l.offset, 10), l.clip),
                        x = T - f,
                        C = o(),
                        L = 0,
                        O = (g = x, w = (v = l).speedAsDuration ? v.speed : Math.abs(g / 1e3 * v.speed), v.durationMax && w > v.durationMax ? v.durationMax : v.durationMin && w < v.durationMin ? v.durationMin : parseInt(w, 10)),
                        F = function (e) {
                            var n, o, s;
                            y || (y = e), L += e - y, b = f + x * (o = M = 1 < (M = 0 === O ? 0 : L / O) ? 1 : M, "easeInQuad" === (n = l).easing && (s = o * o), "easeOutQuad" === n.easing && (s = o * (2 - o)), "easeInOutQuad" === n.easing && (s = o < .5 ? 2 * o * o : (4 - 2 * o) * o - 1), "easeInCubic" === n.easing && (s = o * o * o), "easeOutCubic" === n.easing && (s = --o * o * o + 1), "easeInOutCubic" === n.easing && (s = o < .5 ? 4 * o * o * o : (o - 1) * (2 * o - 2) * (2 * o - 2) + 1), "easeInQuart" === n.easing && (s = o * o * o * o), "easeOutQuart" === n.easing && (s = 1 - --o * o * o * o), "easeInOutQuart" === n.easing && (s = o < .5 ? 8 * o * o * o * o : 1 - 8 * --o * o * o * o), "easeInQuint" === n.easing && (s = o * o * o * o * o), "easeOutQuint" === n.easing && (s = 1 + --o * o * o * o * o), "easeInOutQuint" === n.easing && (s = o < .5 ? 16 * o * o * o * o * o : 1 + 16 * --o * o * o * o * o), n.customEasing && (s = n.customEasing(o)), s || o), t.scrollTo(0, Math.floor(b)),
                                function (e, n) {
                                    var o, s, u, d = t.pageYOffset;
                                    if (e == n || d == n || (f < n && t.innerHeight + d) >= C) return h.cancelScroll(!0), s = n, u = m, 0 === (o = i) && document.body.focus(), u || (o.focus(), document.activeElement !== o && (o.setAttribute("tabindex", "-1"), o.focus(), o.style.outline = "none"), t.scrollTo(0, s)), r("scrollStop", l, i, a), !(c = y = null)
                                }(b, T) || (c = t.requestAnimationFrame(F), y = e)
                        };
                    0 === t.pageYOffset && t.scrollTo(0, 0), E = i, S = l, m || history.pushState && S.updateURL && history.pushState({
                        smoothScroll: JSON.stringify(S),
                        anchor: E.id
                    }, document.title, E === document.documentElement ? "#top" : "#" + E.id), "matchMedia" in t && t.matchMedia("(prefers-reduced-motion)").matches ? t.scrollTo(0, Math.floor(T)) : (r("scrollStart", l, i, a), h.cancelScroll(!0), t.requestAnimationFrame(F))
                }
            };
            var m = function (e) {
                    if (!e.defaultPrevented && !(0 !== e.button || e.metaKey || e.ctrlKey || e.shiftKey) && "closest" in e.target && (l = e.target.closest(a)) && "a" === l.tagName.toLowerCase() && !e.target.closest(u.ignore) && l.hostname === t.location.hostname && l.pathname === t.location.pathname && /#/.test(l.href)) {
                        var n, o;
                        try {
                            n = i(decodeURIComponent(l.hash))
                        } catch (e) {
                            n = i(l.hash)
                        }
                        if ("#" === n) {
                            if (!u.topOnEmptyHash) return;
                            o = document.documentElement
                        } else o = document.querySelector(n);
                        (o = o || "#top" !== n ? o : document.documentElement) && (e.preventDefault(), function (e) {
                            if (history.replaceState && e.updateURL && !history.state) {
                                var n = t.location.hash;
                                n = n || "", history.replaceState({
                                    smoothScroll: JSON.stringify(e),
                                    anchor: n || t.pageYOffset
                                }, document.title, n || t.location.href)
                            }
                        }(u), h.animateScroll(o, l))
                    }
                },
                p = function (t) {
                    if (null !== history.state && history.state.smoothScroll && history.state.smoothScroll === JSON.stringify(u)) {
                        var e = history.state.anchor;
                        "string" == typeof e && e && !(e = document.querySelector(i(history.state.anchor))) || h.animateScroll(e, null, {
                            updateURL: !1
                        })
                    }
                };
            return h.destroy = function () {
                    u && (document.removeEventListener("click", m, !1), t.removeEventListener("popstate", p, !1), h.cancelScroll(), c = d = l = u = null)
                },
                function () {
                    if (!("querySelector" in document && "addEventListener" in t && "requestAnimationFrame" in t && "closest" in t.Element.prototype)) throw "Smooth Scroll: This browser does not support the required JavaScript methods and browser APIs.";
                    h.destroy(), u = n(e, s || {}), d = u.header ? document.querySelector(u.header) : null, document.addEventListener("click", m, !1), u.updateURL && u.popstate && t.addEventListener("popstate", p, !1)
                }(), h
        }
    }),
    function () {
        var t, e, n, i, o, r, a, s, u, l, d, c, h, m, p, f, g, v, w, y, M, b, E = [].slice;
        e = /^\(?([^)]*)\)?(?:(.)(d+))?$/, t = 2e3, n = 2, i = 1e3 / 30, p = document.createElement("div").style, a = null != p.transition || null != p.webkitTransition || null != p.mozTransition || null != p.oTransition, h = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, o = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver, u = function (t) {
            var e;
            return (e = document.createElement("div")).innerHTML = t, e.children[0]
        }, c = function (t, e) {
            return t.className = t.className.replace(new RegExp("(^| )" + e.split(" ").join("|") + "( |$)", "gi"), " ")
        }, s = function (t, e) {
            return c(t, e), t.className += " " + e
        }, f = function (t, e) {
            var n;
            return null != document.createEvent ? ((n = document.createEvent("HTMLEvents")).initEvent(e, !0, !0), t.dispatchEvent(n)) : void 0
        }, d = function () {
            var t, e;
            return null != (t = null != (e = window.performance) && "function" == typeof e.now ? e.now() : void 0) ? t : +new Date
        }, m = function (t, e) {
            return null == e && (e = 0), e ? (t *= Math.pow(10, e), t += .5, t = Math.floor(t), t /= Math.pow(10, e)) : Math.round(t)
        }, g = function (t) {
            return 0 > t ? Math.ceil(t) : Math.floor(t)
        }, l = function (t) {
            return t - m(t)
        }, w = !1, (v = function () {
            var t, e, n, i, o;
            if (!w && null != window.jQuery) {
                for (w = !0, o = [], e = 0, n = (i = ["html", "text"]).length; n > e; e++) t = i[e], o.push(function (t) {
                    var e;
                    return e = window.jQuery.fn[t], window.jQuery.fn[t] = function (t) {
                        var n;
                        return null == t || null == (null != (n = this[0]) ? n.odometer : void 0) ? e.apply(this, arguments) : this[0].odometer.update(t)
                    }
                }(t));
                return o
            }
        })(), setTimeout(v, 0), (r = function () {
            function r(e) {
                var o, a, s, u, l, d, c, h, m, p = this;
                if (this.options = e, this.el = this.options.el, null != this.el.odometer) return this.el.odometer;
                for (o in this.el.odometer = this, c = r.options) s = c[o], null == this.options[o] && (this.options[o] = s);
                null == (u = this.options).duration && (u.duration = t), this.MAX_VALUES = this.options.duration / i / n | 0, this.resetFormat(), this.value = this.cleanValue(null != (h = this.options.value) ? h : ""), this.renderInside(), this.render();
                try {
                    for (l = 0, d = (m = ["innerHTML", "innerText", "textContent"]).length; d > l; l++) a = m[l], null != this.el[a] && function (t) {
                        Object.defineProperty(p.el, t, {
                            get: function () {
                                var e;
                                return "innerHTML" === t ? p.inside.outerHTML : null != (e = p.inside.innerText) ? e : p.inside.textContent
                            },
                            set: function (t) {
                                return p.update(t)
                            }
                        })
                    }(a)
                } catch (t) {
                    t,
                    this.watchForMutations()
                }
            }
            return r.prototype.renderInside = function () {
                return this.inside = document.createElement("div"), this.inside.className = "odometer-inside", this.el.innerHTML = "", this.el.appendChild(this.inside)
            }, r.prototype.watchForMutations = function () {
                var t = this;
                if (null != o) try {
                    return null == this.observer && (this.observer = new o(function () {
                        var e;
                        return e = t.el.innerText, t.renderInside(), t.render(t.value), t.update(e)
                    })), this.watchMutations = !0, this.startWatchingMutations()
                } catch (t) {
                    t
                }
            }, r.prototype.startWatchingMutations = function () {
                return this.watchMutations ? this.observer.observe(this.el, {
                    childList: !0
                }) : void 0
            }, r.prototype.stopWatchingMutations = function () {
                var t;
                return null != (t = this.observer) ? t.disconnect() : void 0
            }, r.prototype.cleanValue = function (t) {
                var e;
                return "string" == typeof t && (t = (t = (t = t.replace(null != (e = this.format.radix) ? e : ".", "<radix>")).replace(/[.,]/g, "")).replace("<radix>", "."), t = parseFloat(t, 10) || 0), m(t, this.format.precision)
            }, r.prototype.bindTransitionEnd = function () {
                var t, e, n, i, o, r, a = this;
                if (!this.transitionEndBound) {
                    for (this.transitionEndBound = !0, e = !1, r = [], n = 0, i = (o = "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd".split(" ")).length; i > n; n++) t = o[n], r.push(this.el.addEventListener(t, function () {
                        return !!e || (e = !0, setTimeout(function () {
                            return a.render(), e = !1, f(a.el, "odometerdone")
                        }, 0), !0)
                    }, !1));
                    return r
                }
            }, r.prototype.resetFormat = function () {
                var t, n, i, o, r, a, s, u;
                if ((t = null != (s = this.options.format) ? s : "(,ddd).dd") || (t = "d"), !(i = e.exec(t))) throw new Error("Odometer: Unparsable digit format");
                return a = (u = i.slice(1, 4))[0], r = u[1], o = (null != (n = u[2]) ? n.length : void 0) || 0, this.format = {
                    repeating: a,
                    radix: r,
                    precision: o
                }
            }, r.prototype.render = function (t) {
                var e, n, i, o, r, s, u, d, c, h, m, p;
                for (null == t && (t = this.value), this.stopWatchingMutations(), this.resetFormat(), this.inside.innerHTML = "", s = this.options.theme, r = [], d = 0, h = (e = this.el.className.split(" ")).length; h > d; d++)(n = e[d]).length && ((o = /^odometer-theme-(.+)$/.exec(n)) ? s = o[1] : /^odometer(-|$)/.test(n) || r.push(n));
                for (r.push("odometer"), a || r.push("odometer-no-transitions"), r.push(s ? "odometer-theme-" + s : "odometer-auto-theme"), this.el.className = r.join(" "), this.ribbons = {}, this.digits = [], u = !this.format.precision || !l(t) || !1, c = 0, m = (p = t.toString().split("").reverse()).length; m > c; c++) "." === (i = p[c]) && (u = !0), this.addDigit(i, u);
                return this.startWatchingMutations()
            }, r.prototype.update = function (t) {
                var e, n = this;
                return (e = (t = this.cleanValue(t)) - this.value) ? (c(this.el, "odometer-animating-up odometer-animating-down odometer-animating"), s(this.el, e > 0 ? "odometer-animating-up" : "odometer-animating-down"), this.stopWatchingMutations(), this.animate(t), this.startWatchingMutations(), setTimeout(function () {
                    return n.el.offsetHeight, s(n.el, "odometer-animating")
                }, 0), this.value = t) : void 0
            }, r.prototype.renderDigit = function () {
                return u('<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner"><span class="odometer-ribbon"><span class="odometer-ribbon-inner"><span class="odometer-value"></span></span></span></span></span>')
            }, r.prototype.insertDigit = function (t, e) {
                return null != e ? this.inside.insertBefore(t, e) : this.inside.children.length ? this.inside.insertBefore(t, this.inside.children[0]) : this.inside.appendChild(t)
            }, r.prototype.addSpacer = function (t, e, n) {
                var i;
                return (i = u('<span class="odometer-formatting-mark"></span>')).innerHTML = t, n && s(i, n), this.insertDigit(i, e)
            }, r.prototype.addDigit = function (t, e) {
                var n, i, o, r;
                if (null == e && (e = !0), "-" === t) return this.addSpacer(t, null, "odometer-negation-mark");
                if ("." === t) return this.addSpacer(null != (r = this.format.radix) ? r : ".", null, "odometer-radix-mark");
                if (e)
                    for (o = !1;;) {
                        if (!this.format.repeating.length) {
                            if (o) throw new Error("Bad odometer format without digits");
                            this.resetFormat(), o = !0
                        }
                        if (n = this.format.repeating[this.format.repeating.length - 1], this.format.repeating = this.format.repeating.substring(0, this.format.repeating.length - 1), "d" === n) break;
                        this.addSpacer(n)
                    }
                return (i = this.renderDigit()).querySelector(".odometer-value").innerHTML = t, this.digits.push(i), this.insertDigit(i)
            }, r.prototype.animate = function (t) {
                return a && "count" !== this.options.animation ? this.animateSlide(t) : this.animateCount(t)
            }, r.prototype.animateCount = function (t) {
                var e, n, i, o, r, a = this;
                if (n = +t - this.value) return o = i = d(), e = this.value, (r = function () {
                    var s, u;
                    return d() - o > a.options.duration ? (a.value = t, a.render(), void f(a.el, "odometerdone")) : ((s = d() - i) > 50 && (i = d(), u = s / a.options.duration, e += n * u, a.render(Math.round(e))), null != h ? h(r) : setTimeout(r, 50))
                })()
            }, r.prototype.getDigitCount = function () {
                var t, e, n, i, o, r;
                for (t = o = 0, r = (i = 1 <= arguments.length ? E.call(arguments, 0) : []).length; r > o; t = ++o) n = i[t], i[t] = Math.abs(n);
                return e = Math.max.apply(Math, i), Math.ceil(Math.log(e + 1) / Math.log(10))
            }, r.prototype.getFractionalDigitCount = function () {
                var t, e, n, i, o, r, a;
                for (e = /^\-?\d*\.(\d*?)0*$/, t = r = 0, a = (o = 1 <= arguments.length ? E.call(arguments, 0) : []).length; a > r; t = ++r) i = o[t], o[t] = i.toString(), n = e.exec(o[t]), o[t] = null == n ? 0 : n[1].length;
                return Math.max.apply(Math, o)
            }, r.prototype.resetDigits = function () {
                return this.digits = [], this.ribbons = [], this.inside.innerHTML = "", this.resetFormat()
            }, r.prototype.animateSlide = function (t) {
                var e, n, i, o, r, a, u, l, d, c, h, m, p, f, v, w, y, M, b, E, S, A, T, x, C, L, O;
                if (w = this.value, (l = this.getFractionalDigitCount(w, t)) && (t *= Math.pow(10, l), w *= Math.pow(10, l)), i = t - w) {
                    for (this.bindTransitionEnd(), o = this.getDigitCount(w, t), r = [], e = 0, h = b = 0; o >= 0 ? o > b : b > o; h = o >= 0 ? ++b : --b) {
                        if (y = g(w / Math.pow(10, o - h - 1)), a = (u = g(t / Math.pow(10, o - h - 1))) - y, Math.abs(a) > this.MAX_VALUES) {
                            for (c = [], m = a / (this.MAX_VALUES + this.MAX_VALUES * e * .5), n = y; a > 0 && u > n || 0 > a && n > u;) c.push(Math.round(n)), n += m;
                            c[c.length - 1] !== u && c.push(u), e++
                        } else c = function () {
                            O = [];
                            for (var t = y; u >= y ? u >= t : t >= u; u >= y ? t++ : t--) O.push(t);
                            return O
                        }.apply(this);
                        for (h = E = 0, A = c.length; A > E; h = ++E) d = c[h], c[h] = Math.abs(d % 10);
                        r.push(c)
                    }
                    for (this.resetDigits(), h = S = 0, T = (L = r.reverse()).length; T > S; h = ++S)
                        for (c = L[h], this.digits[h] || this.addDigit(" ", h >= l), null == (M = this.ribbons)[h] && (M[h] = this.digits[h].querySelector(".odometer-ribbon-inner")), this.ribbons[h].innerHTML = "", 0 > i && (c = c.reverse()), p = C = 0, x = c.length; x > C; p = ++C) d = c[p], (v = document.createElement("div")).className = "odometer-value", v.innerHTML = d, this.ribbons[h].appendChild(v), p === c.length - 1 && s(v, "odometer-last-value"), 0 === p && s(v, "odometer-first-value");
                    return 0 > y && this.addDigit("-"), null != (f = this.inside.querySelector(".odometer-radix-mark")) && f.parent.removeChild(f), l ? this.addSpacer(this.format.radix, this.digits[l - 1], "odometer-radix-mark") : void 0
                }
            }, r
        }()).options = null != (M = window.odometerOptions) ? M : {}, setTimeout(function () {
            var t, e, n, i, o;
            if (window.odometerOptions) {
                for (t in o = [], i = window.odometerOptions) e = i[t], o.push(null != (n = r.options)[t] ? (n = r.options)[t] : n[t] = e);
                return o
            }
        }, 0), r.init = function () {
            var t, e, n, i, o, a;
            if (null != document.querySelectorAll) {
                for (a = [], n = 0, i = (e = document.querySelectorAll(r.options.selector || ".odometer")).length; i > n; n++) t = e[n], a.push(t.odometer = new r({
                    el: t,
                    value: null != (o = t.innerText) ? o : t.textContent
                }));
                return a
            }
        }, null != (null != (b = document.documentElement) ? b.doScroll : void 0) && null != document.createEventObject ? (y = document.onreadystatechange, document.onreadystatechange = function () {
            return "complete" === document.readyState && !1 !== r.options.auto && r.init(), null != y ? y.apply(this, arguments) : void 0
        }) : document.addEventListener("DOMContentLoaded", function () {
            return !1 !== r.options.auto ? r.init() : void 0
        }, !1), "function" == typeof define && define.amd ? define(["jquery"], function () {
            return r
        }) : !1 === typeof exports ? module.exports = r : window.Odometer = r
    }.call(this);
! function (t, o) {
    "function" == typeof define && define.amd ? define(o) : "object" == typeof exports ? module.exports = o() : t.tingle = o()
}(this, function () {
    var o = !1;

    function t(t) {
        this.opts = function () {
            for (var t = 1; t < arguments.length; t++)
                for (var o in arguments[t]) arguments[t].hasOwnProperty(o) && (arguments[0][o] = arguments[t][o]);
            return arguments[0]
        }({}, {
            onClose: null,
            onOpen: null,
            beforeOpen: null,
            beforeClose: null,
            stickyFooter: !1,
            footer: !1,
            cssClass: [],
            closeLabel: "Close",
            closeMethods: ["overlay", "button", "escape"]
        }, t), this.init()
    }

    function e() {
        this.modalBoxFooter && (this.modalBoxFooter.style.width = this.modalBox.clientWidth + "px", this.modalBoxFooter.style.left = this.modalBox.offsetLeft + "px")
    }
    return t.prototype.init = function () {
        if (!this.modal) return function () {
                this.modal = document.createElement("div"), this.modal.classList.add("tingle-modal"), 0 !== this.opts.closeMethods.length && -1 !== this.opts.closeMethods.indexOf("overlay") || this.modal.classList.add("tingle-modal--noOverlayClose");
                this.modal.style.display = "none", this.opts.cssClass.forEach(function (t) {
                    "string" == typeof t && this.modal.classList.add(t)
                }, this), -1 !== this.opts.closeMethods.indexOf("button") && (this.modalCloseBtn = document.createElement("button"), this.modalCloseBtn.type = "button", this.modalCloseBtn.classList.add("tingle-modal__close"), this.modalCloseBtnIcon = document.createElement("span"), this.modalCloseBtnIcon.classList.add("tingle-modal__closeIcon"), this.modalCloseBtnIcon.innerHTML = '<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.3 9.7c.2.2.4.3.7.3.3 0 .5-.1.7-.3L5 6.4l3.3 3.3c.2.2.5.3.7.3.2 0 .5-.1.7-.3.4-.4.4-1 0-1.4L6.4 5l3.3-3.3c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L5 3.6 1.7.3C1.3-.1.7-.1.3.3c-.4.4-.4 1 0 1.4L3.6 5 .3 8.3c-.4.4-.4 1 0 1.4z" fill="#000" fill-rule="nonzero"/></svg>', this.modalCloseBtnLabel = document.createElement("span"), this.modalCloseBtnLabel.classList.add("tingle-modal__closeLabel"), this.modalCloseBtnLabel.innerHTML = this.opts.closeLabel, this.modalCloseBtn.appendChild(this.modalCloseBtnIcon), this.modalCloseBtn.appendChild(this.modalCloseBtnLabel));
                this.modalBox = document.createElement("div"), this.modalBox.classList.add("tingle-modal-box"), this.modalBoxContent = document.createElement("div"), this.modalBoxContent.classList.add("tingle-modal-box__content"), this.modalBox.appendChild(this.modalBoxContent), -1 !== this.opts.closeMethods.indexOf("button") && this.modal.appendChild(this.modalCloseBtn);
                this.modal.appendChild(this.modalBox)
            }.call(this),
            function () {
                this._events = {
                    clickCloseBtn: this.close.bind(this),
                    clickOverlay: function (t) {
                        var o = this.modal.offsetWidth - this.modal.clientWidth,
                            e = t.clientX >= this.modal.offsetWidth - 15,
                            s = this.modal.scrollHeight !== this.modal.offsetHeight;
                        if ("MacIntel" === navigator.platform && 0 == o && e && s) return; - 1 !== this.opts.closeMethods.indexOf("overlay") && ! function (t, o) {
                            for (;
                                (t = t.parentElement) && !t.classList.contains(o););
                            return t
                        }(t.target, "tingle-modal") && t.clientX < this.modal.clientWidth && this.close()
                    }.bind(this),
                    resize: this.checkOverflow.bind(this),
                    keyboardNav: function (t) {
                        -1 !== this.opts.closeMethods.indexOf("escape") && 27 === t.which && this.isOpen() && this.close()
                    }.bind(this)
                }, -1 !== this.opts.closeMethods.indexOf("button") && this.modalCloseBtn.addEventListener("click", this._events.clickCloseBtn);
                this.modal.addEventListener("mousedown", this._events.clickOverlay), window.addEventListener("resize", this._events.resize), document.addEventListener("keydown", this._events.keyboardNav)
            }.call(this), document.body.appendChild(this.modal, document.body.firstChild), this.opts.footer && this.addFooter(), this
    }, t.prototype._busy = function (t) {
        o = t
    }, t.prototype._isBusy = function () {
        return o
    }, t.prototype.destroy = function () {
        null !== this.modal && (this.isOpen() && this.close(!0), function () {
            -1 !== this.opts.closeMethods.indexOf("button") && this.modalCloseBtn.removeEventListener("click", this._events.clickCloseBtn);
            this.modal.removeEventListener("mousedown", this._events.clickOverlay), window.removeEventListener("resize", this._events.resize), document.removeEventListener("keydown", this._events.keyboardNav)
        }.call(this), this.modal.parentNode.removeChild(this.modal), this.modal = null)
    }, t.prototype.isOpen = function () {
        return !!this.modal.classList.contains("tingle-modal--visible")
    }, t.prototype.open = function () {
        if (!this._isBusy()) {
            this._busy(!0);
            var t = this;
            return "function" == typeof t.opts.beforeOpen && t.opts.beforeOpen(), this.modal.style.removeProperty ? this.modal.style.removeProperty("display") : this.modal.style.removeAttribute("display"), this._scrollPosition = window.pageYOffset, document.body.classList.add("tingle-enabled"), document.body.style.top = -this._scrollPosition + "px", this.setStickyFooter(this.opts.stickyFooter), this.modal.classList.add("tingle-modal--visible"), "function" == typeof t.opts.onOpen && t.opts.onOpen.call(t), t._busy(!1), this.checkOverflow(), this
        }
    }, t.prototype.close = function (t) {
        if (!this._isBusy()) {
            if (this._busy(!0), !1, "function" == typeof this.opts.beforeClose)
                if (!this.opts.beforeClose.call(this)) return void this._busy(!1);
            document.body.classList.remove("tingle-enabled"), document.body.style.top = null, window.scrollTo({
                top: this._scrollPosition,
                behavior: "instant"
            }), this.modal.classList.remove("tingle-modal--visible");
            var o = this;
            o.modal.style.display = "none", "function" == typeof o.opts.onClose && o.opts.onClose.call(this), o._busy(!1)
        }
    }, t.prototype.setContent = function (t) {
        return "string" == typeof t ? this.modalBoxContent.innerHTML = t : (this.modalBoxContent.innerHTML = "", this.modalBoxContent.appendChild(t)), this.isOpen() && this.checkOverflow(), this
    }, t.prototype.getContent = function () {
        return this.modalBoxContent
    }, t.prototype.addFooter = function () {
        return function () {
            this.modalBoxFooter = document.createElement("div"), this.modalBoxFooter.classList.add("tingle-modal-box__footer"), this.modalBox.appendChild(this.modalBoxFooter)
        }.call(this), this
    }, t.prototype.setFooterContent = function (t) {
        return this.modalBoxFooter.innerHTML = t, this
    }, t.prototype.getFooterContent = function () {
        return this.modalBoxFooter
    }, t.prototype.setStickyFooter = function (t) {
        return this.isOverflow() || (t = !1), t ? this.modalBox.contains(this.modalBoxFooter) && (this.modalBox.removeChild(this.modalBoxFooter), this.modal.appendChild(this.modalBoxFooter), this.modalBoxFooter.classList.add("tingle-modal-box__footer--sticky"), e.call(this), this.modalBoxContent.style["padding-bottom"] = this.modalBoxFooter.clientHeight + 20 + "px") : this.modalBoxFooter && (this.modalBox.contains(this.modalBoxFooter) || (this.modal.removeChild(this.modalBoxFooter), this.modalBox.appendChild(this.modalBoxFooter), this.modalBoxFooter.style.width = "auto", this.modalBoxFooter.style.left = "", this.modalBoxContent.style["padding-bottom"] = "", this.modalBoxFooter.classList.remove("tingle-modal-box__footer--sticky"))), this
    }, t.prototype.addFooterBtn = function (t, o, e) {
        var s = document.createElement("button");
        return s.innerHTML = t, s.addEventListener("click", e), "string" == typeof o && o.length && o.split(" ").forEach(function (t) {
            s.classList.add(t)
        }), this.modalBoxFooter.appendChild(s), s
    }, t.prototype.resize = function () {
        console.warn("Resize is deprecated and will be removed in version 1.0")
    }, t.prototype.isOverflow = function () {
        return window.innerHeight <= this.modalBox.clientHeight
    }, t.prototype.checkOverflow = function () {
        this.modal.classList.contains("tingle-modal--visible") && (this.isOverflow() ? this.modal.classList.add("tingle-modal--overflow") : this.modal.classList.remove("tingle-modal--overflow"), !this.isOverflow() && this.opts.stickyFooter ? this.setStickyFooter(!1) : this.isOverflow() && this.opts.stickyFooter && (e.call(this), this.setStickyFooter(!0)))
    }, {
        modal: t
    }
});

let isscrollingsmooth = false;

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', init);

function init() {
    const widthPremium = document.querySelector('.premium').clientWidth;
    const widthSideNav = document.querySelector('.section-nav').clientWidth;
    const mainBody = document.querySelector('.inner-body');
    mainBody.style.marginLeft = widthPremium + 'px';
    mainBody.style.marginRight = widthSideNav + 'px';
    let height;
    if (window.innerWidth < 1000) {
        height = document.querySelector('#mobile-nav').clientHeight;
    } else {
        height = document.querySelector('#desk-nav').clientHeight
    };
    document.querySelector('.inner-body').style.marginTop = height + 'px';
};

const isInViewport = function (elem) {
    const bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};


function partInViewport(elem) {
    let x = elem.getBoundingClientRect().left;
    let y = elem.getBoundingClientRect().top;
    let ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let hw = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    let w = elem.clientWidth;
    let h = elem.clientHeight;
    return (
        (y < hw &&
            y + h > 0) &&
        (x < ww &&
            x + w > 0)
    );
};

window.addEventListener('scroll', updates);
updates();

function updates() {
    Array.from(document.querySelectorAll('.circle')).forEach(elem => {
        if (isInViewport(elem) && !isscrollingsmooth) {
            setTimeout(() => {
                elem.classList.add('inViewPort');
            }, 200);
        };
    });
    Array.from(document.querySelectorAll('.odometer')).forEach(elem => {
        if (!isscrollingsmooth) {
            if (isInViewport(elem)) {
                elem.textContent = elem.getAttribute('data-count')
            } else {
                elem.textContent = ''
            };
        };
    });
};

const bodyElem = document.querySelector('body');

document.querySelector('.hamburger').addEventListener('click', () => {
    if (bodyElem.classList.contains('nav-active')) {
        bodyElem.classList.remove('nav-active');
        document.querySelector('.inner-body').style.transform = 'translateX(0px)';
    } else {
        bodyElem.classList.add('nav-active');
        const width = document.querySelector('#mobile-links').clientWidth;
        document.querySelector('.inner-body').style.transform = `translateX(-${width}px)`;
    };
});

Array.from(document.querySelectorAll('.nav-links a')).forEach(elem => {
    elem.addEventListener('click', () => {
        bodyElem.classList.remove('nav-active');
        document.querySelector('.inner-body').style.transform = 'translateX(0px)';
    });
});


Array.from(document.querySelectorAll('.question')).forEach(elem => {

    const modal = new tingle.modal({
        footer: false,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        beforeClose: function () {
            return true; // close the modal
        }
    });

    // set content
    modal.setContent(`
        <h2>${elem.getAttribute('data-title')}</h2>
        <p class="myt-1">
            ${elem.getAttribute('data-info')}
        </p>
    `);

    elem.addEventListener('click', () => {
        modal.open();
    });

});


const navBarUpdates = () => {
    Array.from(document.querySelectorAll('.section-wrapper')).forEach(elem => {
        const attr = elem.getAttribute('data-section');
        if (partInViewport(elem) && attr) {
            const activeNav = Array.from(document.querySelectorAll('.nav-links > li.active'));
            const attrActiveNav = activeNav[0].getAttribute('data-nav').split('-')[1];
            const navElem = document.querySelector(`[data-section="${attrActiveNav}"]`);
            if (!isInViewport(navElem)) {
                activeNav.forEach(p => {
                    p.classList.remove('active');
                })
                Array.from(document.querySelectorAll(`.nav-links > li[data-nav="nav-${attr}"]`)).forEach(p => {
                    p.classList.add('active');
                })
            }
        }
    })
    Array.from(document.querySelectorAll('.item')).forEach(elem => {
        const attr = elem.id;
        if (partInViewport(elem) && attr) {
            const activeNav = document.querySelector('.nav-links .sub-nav li.active');
            const attrActiveNav = activeNav.querySelector('a').getAttribute('href').split('#')[1].toString();
            const navElem = document.querySelector(`.item#${attrActiveNav}`);
            if (!isInViewport(navElem)) {
                activeNav.classList.remove('active');
                const itemActive = document.querySelector(`.nav-links .sub-nav li a[href="#${attr}"]`);
                itemActive.parentElement.classList.add('active');
            };
        };
    });
};

navBarUpdates();
window.addEventListener('scroll', navBarUpdates);

new SmoothScroll('a[href*="#"]', {
    speed: 1500,
    speedAsDuration: true,
    offset: function (anchor, toggle) {

        let l = 0;

        Array.from(document.querySelectorAll('nav')).forEach(elem => {
            if (elem.clientHeight > l) {
                l = elem.clientHeight;
            };
        });

        let p = anchor.previousElementSibling;

        if(p) {
            p = p.clientHeight
        } else {
            p = 0;
        };

        return l + p + 50

    }
});

document.addEventListener('scrollStart', () => {
    isscrollingsmooth = true;
}, false);

document.addEventListener('scrollStop', () => {
    isscrollingsmooth = false;
}, false);