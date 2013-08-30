/*
 * jQuery FlexSlider v2.2.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
(function(e) {
    e.flexslider = function(t, n) {
        var r = e(t);
        r.vars = e.extend({}, e.flexslider.defaults, n);
        var i = r.vars.namespace, s = window.navigator && window.navigator.msPointerEnabled && window.MSGesture, o = ("ontouchstart" in window || s || window.DocumentTouch && document instanceof DocumentTouch) && r.vars.touch, u = "click touchend MSPointerUp", a = "", f, l = r.vars.direction === "vertical", c = r.vars.reverse, h = r.vars.itemWidth > 0, p = r.vars.animation === "fade", d = r.vars.asNavFor !== "", v = {}, m = !0;
        e.data(t, "flexslider", r);
        v = {
            init: function() {
                r.animating = !1;
                r.currentSlide = parseInt(r.vars.startAt ? r.vars.startAt : 0);
                isNaN(r.currentSlide) && (r.currentSlide = 0);
                r.animatingTo = r.currentSlide;
                r.atEnd = r.currentSlide === 0 || r.currentSlide === r.last;
                r.containerSelector = r.vars.selector.substr(0, r.vars.selector.search(" "));
                r.slides = e(r.vars.selector, r);
                r.container = e(r.containerSelector, r);
                r.count = r.slides.length;
                r.syncExists = e(r.vars.sync).length > 0;
                r.vars.animation === "slide" && (r.vars.animation = "swing");
                r.prop = l ? "top" : "marginLeft";
                r.args = {};
                r.manualPause = !1;
                r.stopped = !1;
                r.started = !1;
                r.startTimeout = null;
                r.transitions = !r.vars.video && !p && r.vars.useCSS && function() {
                    var e = document.createElement("div"), t = [ "perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective" ];
                    for (var n in t) if (e.style[t[n]] !== undefined) {
                        r.pfx = t[n].replace("Perspective", "").toLowerCase();
                        r.prop = "-" + r.pfx + "-transform";
                        return !0;
                    }
                    return !1;
                }();
                r.vars.controlsContainer !== "" && (r.controlsContainer = e(r.vars.controlsContainer).length > 0 && e(r.vars.controlsContainer));
                r.vars.manualControls !== "" && (r.manualControls = e(r.vars.manualControls).length > 0 && e(r.vars.manualControls));
                if (r.vars.randomize) {
                    r.slides.sort(function() {
                        return Math.round(Math.random()) - .5;
                    });
                    r.container.empty().append(r.slides);
                }
                r.doMath();
                r.setup("init");
                r.vars.controlNav && v.controlNav.setup();
                r.vars.directionNav && v.directionNav.setup();
                r.vars.keyboard && (e(r.containerSelector).length === 1 || r.vars.multipleKeyboard) && e(document).bind("keyup", function(e) {
                    var t = e.keyCode;
                    if (!r.animating && (t === 39 || t === 37)) {
                        var n = t === 39 ? r.getTarget("next") : t === 37 ? r.getTarget("prev") : !1;
                        r.flexAnimate(n, r.vars.pauseOnAction);
                    }
                });
                r.vars.mousewheel && r.bind("mousewheel", function(e, t, n, i) {
                    e.preventDefault();
                    var s = t < 0 ? r.getTarget("next") : r.getTarget("prev");
                    r.flexAnimate(s, r.vars.pauseOnAction);
                });
                r.vars.pausePlay && v.pausePlay.setup();
                r.vars.slideshow && r.vars.pauseInvisible && v.pauseInvisible.init();
                if (r.vars.slideshow) {
                    r.vars.pauseOnHover && r.hover(function() {
                        !r.manualPlay && !r.manualPause && r.pause();
                    }, function() {
                        !r.manualPause && !r.manualPlay && !r.stopped && r.play();
                    });
                    if (!r.vars.pauseInvisible || !v.pauseInvisible.isHidden()) r.vars.initDelay > 0 ? r.startTimeout = setTimeout(r.play, r.vars.initDelay) : r.play();
                }
                d && v.asNav.setup();
                o && r.vars.touch && v.touch();
                (!p || p && r.vars.smoothHeight) && e(window).bind("resize orientationchange focus", v.resize);
                r.find("img").attr("draggable", "false");
                setTimeout(function() {
                    r.vars.start(r);
                }, 200);
            },
            asNav: {
                setup: function() {
                    r.asNav = !0;
                    r.animatingTo = Math.floor(r.currentSlide / r.move);
                    r.currentItem = r.currentSlide;
                    r.slides.removeClass(i + "active-slide").eq(r.currentItem).addClass(i + "active-slide");
                    if (!s) r.slides.click(function(t) {
                        t.preventDefault();
                        var n = e(this), s = n.index(), o = n.offset().left - e(r).scrollLeft();
                        if (o <= 0 && n.hasClass(i + "active-slide")) r.flexAnimate(r.getTarget("prev"), !0); else if (!e(r.vars.asNavFor).data("flexslider").animating && !n.hasClass(i + "active-slide")) {
                            r.direction = r.currentItem < s ? "next" : "prev";
                            r.flexAnimate(s, r.vars.pauseOnAction, !1, !0, !0);
                        }
                    }); else {
                        t._slider = r;
                        r.slides.each(function() {
                            var t = this;
                            t._gesture = new MSGesture();
                            t._gesture.target = t;
                            t.addEventListener("MSPointerDown", function(e) {
                                e.preventDefault();
                                e.currentTarget._gesture && e.currentTarget._gesture.addPointer(e.pointerId);
                            }, !1);
                            t.addEventListener("MSGestureTap", function(t) {
                                t.preventDefault();
                                var n = e(this), i = n.index();
                                if (!e(r.vars.asNavFor).data("flexslider").animating && !n.hasClass("active")) {
                                    r.direction = r.currentItem < i ? "next" : "prev";
                                    r.flexAnimate(i, r.vars.pauseOnAction, !1, !0, !0);
                                }
                            });
                        });
                    }
                }
            },
            controlNav: {
                setup: function() {
                    r.manualControls ? v.controlNav.setupManual() : v.controlNav.setupPaging();
                },
                setupPaging: function() {
                    var t = r.vars.controlNav === "thumbnails" ? "control-thumbs" : "control-paging", n = 1, s, o;
                    r.controlNavScaffold = e('<ol class="' + i + "control-nav " + i + t + '"></ol>');
                    if (r.pagingCount > 1) for (var f = 0; f < r.pagingCount; f++) {
                        o = r.slides.eq(f);
                        s = r.vars.controlNav === "thumbnails" ? '<img src="' + o.attr("data-thumb") + '"/>' : "<a>" + n + "</a>";
                        if ("thumbnails" === r.vars.controlNav && !0 === r.vars.thumbCaptions) {
                            var l = o.attr("data-thumbcaption");
                            "" != l && undefined != l && (s += '<span class="' + i + 'caption">' + l + "</span>");
                        }
                        r.controlNavScaffold.append("<li>" + s + "</li>");
                        n++;
                    }
                    r.controlsContainer ? e(r.controlsContainer).append(r.controlNavScaffold) : r.append(r.controlNavScaffold);
                    v.controlNav.set();
                    v.controlNav.active();
                    r.controlNavScaffold.delegate("a, img", u, function(t) {
                        t.preventDefault();
                        if (a === "" || a === t.type) {
                            var n = e(this), s = r.controlNav.index(n);
                            if (!n.hasClass(i + "active")) {
                                r.direction = s > r.currentSlide ? "next" : "prev";
                                r.flexAnimate(s, r.vars.pauseOnAction);
                            }
                        }
                        a === "" && (a = t.type);
                        v.setToClearWatchedEvent();
                    });
                },
                setupManual: function() {
                    r.controlNav = r.manualControls;
                    v.controlNav.active();
                    r.controlNav.bind(u, function(t) {
                        t.preventDefault();
                        if (a === "" || a === t.type) {
                            var n = e(this), s = r.controlNav.index(n);
                            if (!n.hasClass(i + "active")) {
                                s > r.currentSlide ? r.direction = "next" : r.direction = "prev";
                                r.flexAnimate(s, r.vars.pauseOnAction);
                            }
                        }
                        a === "" && (a = t.type);
                        v.setToClearWatchedEvent();
                    });
                },
                set: function() {
                    var t = r.vars.controlNav === "thumbnails" ? "img" : "a";
                    r.controlNav = e("." + i + "control-nav li " + t, r.controlsContainer ? r.controlsContainer : r);
                },
                active: function() {
                    r.controlNav.removeClass(i + "active").eq(r.animatingTo).addClass(i + "active");
                },
                update: function(t, n) {
                    r.pagingCount > 1 && t === "add" ? r.controlNavScaffold.append(e("<li><a>" + r.count + "</a></li>")) : r.pagingCount === 1 ? r.controlNavScaffold.find("li").remove() : r.controlNav.eq(n).closest("li").remove();
                    v.controlNav.set();
                    r.pagingCount > 1 && r.pagingCount !== r.controlNav.length ? r.update(n, t) : v.controlNav.active();
                }
            },
            directionNav: {
                setup: function() {
                    var t = e('<ul class="' + i + 'direction-nav"><li><a class="' + i + 'prev" href="#">' + r.vars.prevText + '</a></li><li><a class="' + i + 'next" href="#">' + r.vars.nextText + "</a></li></ul>");
                    if (r.controlsContainer) {
                        e(r.controlsContainer).append(t);
                        r.directionNav = e("." + i + "direction-nav li a", r.controlsContainer);
                    } else {
                        r.append(t);
                        r.directionNav = e("." + i + "direction-nav li a", r);
                    }
                    v.directionNav.update();
                    r.directionNav.bind(u, function(t) {
                        t.preventDefault();
                        var n;
                        if (a === "" || a === t.type) {
                            n = e(this).hasClass(i + "next") ? r.getTarget("next") : r.getTarget("prev");
                            r.flexAnimate(n, r.vars.pauseOnAction);
                        }
                        a === "" && (a = t.type);
                        v.setToClearWatchedEvent();
                    });
                },
                update: function() {
                    var e = i + "disabled";
                    r.pagingCount === 1 ? r.directionNav.addClass(e).attr("tabindex", "-1") : r.vars.animationLoop ? r.directionNav.removeClass(e).removeAttr("tabindex") : r.animatingTo === 0 ? r.directionNav.removeClass(e).filter("." + i + "prev").addClass(e).attr("tabindex", "-1") : r.animatingTo === r.last ? r.directionNav.removeClass(e).filter("." + i + "next").addClass(e).attr("tabindex", "-1") : r.directionNav.removeClass(e).removeAttr("tabindex");
                }
            },
            pausePlay: {
                setup: function() {
                    var t = e('<div class="' + i + 'pauseplay"><a></a></div>');
                    if (r.controlsContainer) {
                        r.controlsContainer.append(t);
                        r.pausePlay = e("." + i + "pauseplay a", r.controlsContainer);
                    } else {
                        r.append(t);
                        r.pausePlay = e("." + i + "pauseplay a", r);
                    }
                    v.pausePlay.update(r.vars.slideshow ? i + "pause" : i + "play");
                    r.pausePlay.bind(u, function(t) {
                        t.preventDefault();
                        if (a === "" || a === t.type) if (e(this).hasClass(i + "pause")) {
                            r.manualPause = !0;
                            r.manualPlay = !1;
                            r.pause();
                        } else {
                            r.manualPause = !1;
                            r.manualPlay = !0;
                            r.play();
                        }
                        a === "" && (a = t.type);
                        v.setToClearWatchedEvent();
                    });
                },
                update: function(e) {
                    e === "play" ? r.pausePlay.removeClass(i + "pause").addClass(i + "play").html(r.vars.playText) : r.pausePlay.removeClass(i + "play").addClass(i + "pause").html(r.vars.pauseText);
                }
            },
            touch: function() {
                var e, n, i, o, u, a, f = !1, d = 0, v = 0, m = 0;
                if (!s) {
                    t.addEventListener("touchstart", g, !1);
                    function g(s) {
                        if (r.animating) s.preventDefault(); else if (window.navigator.msPointerEnabled || s.touches.length === 1) {
                            r.pause();
                            o = l ? r.h : r.w;
                            a = Number(new Date());
                            d = s.touches[0].pageX;
                            v = s.touches[0].pageY;
                            i = h && c && r.animatingTo === r.last ? 0 : h && c ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : h && r.currentSlide === r.last ? r.limit : h ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide : c ? (r.last - r.currentSlide + r.cloneOffset) * o : (r.currentSlide + r.cloneOffset) * o;
                            e = l ? v : d;
                            n = l ? d : v;
                            t.addEventListener("touchmove", y, !1);
                            t.addEventListener("touchend", b, !1);
                        }
                    }
                    function y(t) {
                        d = t.touches[0].pageX;
                        v = t.touches[0].pageY;
                        u = l ? e - v : e - d;
                        f = l ? Math.abs(u) < Math.abs(d - n) : Math.abs(u) < Math.abs(v - n);
                        var s = 500;
                        if (!f || Number(new Date()) - a > s) {
                            t.preventDefault();
                            if (!p && r.transitions) {
                                r.vars.animationLoop || (u /= r.currentSlide === 0 && u < 0 || r.currentSlide === r.last && u > 0 ? Math.abs(u) / o + 2 : 1);
                                r.setProps(i + u, "setTouch");
                            }
                        }
                    }
                    function b(s) {
                        t.removeEventListener("touchmove", y, !1);
                        if (r.animatingTo === r.currentSlide && !f && u !== null) {
                            var l = c ? -u : u, h = l > 0 ? r.getTarget("next") : r.getTarget("prev");
                            r.canAdvance(h) && (Number(new Date()) - a < 550 && Math.abs(l) > 50 || Math.abs(l) > o / 2) ? r.flexAnimate(h, r.vars.pauseOnAction) : p || r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, !0);
                        }
                        t.removeEventListener("touchend", b, !1);
                        e = null;
                        n = null;
                        u = null;
                        i = null;
                    }
                } else {
                    t.style.msTouchAction = "none";
                    t._gesture = new MSGesture();
                    t._gesture.target = t;
                    t.addEventListener("MSPointerDown", w, !1);
                    t._slider = r;
                    t.addEventListener("MSGestureChange", E, !1);
                    t.addEventListener("MSGestureEnd", S, !1);
                    function w(e) {
                        e.stopPropagation();
                        if (r.animating) e.preventDefault(); else {
                            r.pause();
                            t._gesture.addPointer(e.pointerId);
                            m = 0;
                            o = l ? r.h : r.w;
                            a = Number(new Date());
                            i = h && c && r.animatingTo === r.last ? 0 : h && c ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : h && r.currentSlide === r.last ? r.limit : h ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide : c ? (r.last - r.currentSlide + r.cloneOffset) * o : (r.currentSlide + r.cloneOffset) * o;
                        }
                    }
                    function E(e) {
                        e.stopPropagation();
                        var n = e.target._slider;
                        if (!n) return;
                        var r = -e.translationX, s = -e.translationY;
                        m += l ? s : r;
                        u = m;
                        f = l ? Math.abs(m) < Math.abs(-r) : Math.abs(m) < Math.abs(-s);
                        if (e.detail === e.MSGESTURE_FLAG_INERTIA) {
                            setImmediate(function() {
                                t._gesture.stop();
                            });
                            return;
                        }
                        if (!f || Number(new Date()) - a > 500) {
                            e.preventDefault();
                            if (!p && n.transitions) {
                                n.vars.animationLoop || (u = m / (n.currentSlide === 0 && m < 0 || n.currentSlide === n.last && m > 0 ? Math.abs(m) / o + 2 : 1));
                                n.setProps(i + u, "setTouch");
                            }
                        }
                    }
                    function S(t) {
                        t.stopPropagation();
                        var r = t.target._slider;
                        if (!r) return;
                        if (r.animatingTo === r.currentSlide && !f && u !== null) {
                            var s = c ? -u : u, l = s > 0 ? r.getTarget("next") : r.getTarget("prev");
                            r.canAdvance(l) && (Number(new Date()) - a < 550 && Math.abs(s) > 50 || Math.abs(s) > o / 2) ? r.flexAnimate(l, r.vars.pauseOnAction) : p || r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, !0);
                        }
                        e = null;
                        n = null;
                        u = null;
                        i = null;
                        m = 0;
                    }
                }
            },
            resize: function() {
                if (!r.animating && r.is(":visible")) {
                    h || r.doMath();
                    if (p) v.smoothHeight(); else if (h) {
                        r.slides.width(r.computedW);
                        r.update(r.pagingCount);
                        r.setProps();
                    } else if (l) {
                        r.viewport.height(r.h);
                        r.setProps(r.h, "setTotal");
                    } else {
                        r.vars.smoothHeight && v.smoothHeight();
                        r.newSlides.width(r.computedW);
                        r.setProps(r.computedW, "setTotal");
                    }
                }
            },
            smoothHeight: function(e) {
                if (!l || p) {
                    var t = p ? r : r.viewport;
                    e ? t.animate({
                        height: r.slides.eq(r.animatingTo).height()
                    }, e) : t.height(r.slides.eq(r.animatingTo).height());
                }
            },
            sync: function(t) {
                var n = e(r.vars.sync).data("flexslider"), i = r.animatingTo;
                switch (t) {
                  case "animate":
                    n.flexAnimate(i, r.vars.pauseOnAction, !1, !0);
                    break;

                  case "play":
                    !n.playing && !n.asNav && n.play();
                    break;

                  case "pause":
                    n.pause();
                }
            },
            pauseInvisible: {
                visProp: null,
                init: function() {
                    var e = [ "webkit", "moz", "ms", "o" ];
                    if ("hidden" in document) return "hidden";
                    for (var t = 0; t < e.length; t++) e[t] + "Hidden" in document && (v.pauseInvisible.visProp = e[t] + "Hidden");
                    if (v.pauseInvisible.visProp) {
                        var n = v.pauseInvisible.visProp.replace(/[H|h]idden/, "") + "visibilitychange";
                        document.addEventListener(n, function() {
                            v.pauseInvisible.isHidden() ? r.startTimeout ? clearTimeout(r.startTimeout) : r.pause() : r.started ? r.play() : r.vars.initDelay > 0 ? setTimeout(r.play, r.vars.initDelay) : r.play();
                        });
                    }
                },
                isHidden: function() {
                    return document[v.pauseInvisible.visProp] || !1;
                }
            },
            setToClearWatchedEvent: function() {
                clearTimeout(f);
                f = setTimeout(function() {
                    a = "";
                }, 3e3);
            }
        };
        r.flexAnimate = function(t, n, s, u, a) {
            !r.vars.animationLoop && t !== r.currentSlide && (r.direction = t > r.currentSlide ? "next" : "prev");
            d && r.pagingCount === 1 && (r.direction = r.currentItem < t ? "next" : "prev");
            if (!r.animating && (r.canAdvance(t, a) || s) && r.is(":visible")) {
                if (d && u) {
                    var f = e(r.vars.asNavFor).data("flexslider");
                    r.atEnd = t === 0 || t === r.count - 1;
                    f.flexAnimate(t, !0, !1, !0, a);
                    r.direction = r.currentItem < t ? "next" : "prev";
                    f.direction = r.direction;
                    if (Math.ceil((t + 1) / r.visible) - 1 === r.currentSlide || t === 0) {
                        r.currentItem = t;
                        r.slides.removeClass(i + "active-slide").eq(t).addClass(i + "active-slide");
                        return !1;
                    }
                    r.currentItem = t;
                    r.slides.removeClass(i + "active-slide").eq(t).addClass(i + "active-slide");
                    t = Math.floor(t / r.visible);
                }
                r.animating = !0;
                r.animatingTo = t;
                n && r.pause();
                r.vars.before(r);
                r.syncExists && !a && v.sync("animate");
                r.vars.controlNav && v.controlNav.active();
                h || r.slides.removeClass(i + "active-slide").eq(t).addClass(i + "active-slide");
                r.atEnd = t === 0 || t === r.last;
                r.vars.directionNav && v.directionNav.update();
                if (t === r.last) {
                    r.vars.end(r);
                    r.vars.animationLoop || r.pause();
                }
                if (!p) {
                    var m = l ? r.slides.filter(":first").height() : r.computedW, g, y, b;
                    if (h) {
                        g = r.vars.itemMargin;
                        b = (r.itemW + g) * r.move * r.animatingTo;
                        y = b > r.limit && r.visible !== 1 ? r.limit : b;
                    } else r.currentSlide === 0 && t === r.count - 1 && r.vars.animationLoop && r.direction !== "next" ? y = c ? (r.count + r.cloneOffset) * m : 0 : r.currentSlide === r.last && t === 0 && r.vars.animationLoop && r.direction !== "prev" ? y = c ? 0 : (r.count + 1) * m : y = c ? (r.count - 1 - t + r.cloneOffset) * m : (t + r.cloneOffset) * m;
                    r.setProps(y, "", r.vars.animationSpeed);
                    if (r.transitions) {
                        if (!r.vars.animationLoop || !r.atEnd) {
                            r.animating = !1;
                            r.currentSlide = r.animatingTo;
                        }
                        r.container.unbind("webkitTransitionEnd transitionend");
                        r.container.bind("webkitTransitionEnd transitionend", function() {
                            r.wrapup(m);
                        });
                    } else r.container.animate(r.args, r.vars.animationSpeed, r.vars.easing, function() {
                        r.wrapup(m);
                    });
                } else if (!o) {
                    r.slides.eq(r.currentSlide).css({
                        zIndex: 1
                    }).animate({
                        opacity: 0
                    }, r.vars.animationSpeed, r.vars.easing);
                    r.slides.eq(t).css({
                        zIndex: 2
                    }).animate({
                        opacity: 1
                    }, r.vars.animationSpeed, r.vars.easing, r.wrapup);
                } else {
                    r.slides.eq(r.currentSlide).css({
                        opacity: 0,
                        zIndex: 1
                    });
                    r.slides.eq(t).css({
                        opacity: 1,
                        zIndex: 2
                    });
                    r.wrapup(m);
                }
                r.vars.smoothHeight && v.smoothHeight(r.vars.animationSpeed);
            }
        };
        r.wrapup = function(e) {
            !p && !h && (r.currentSlide === 0 && r.animatingTo === r.last && r.vars.animationLoop ? r.setProps(e, "jumpEnd") : r.currentSlide === r.last && r.animatingTo === 0 && r.vars.animationLoop && r.setProps(e, "jumpStart"));
            r.animating = !1;
            r.currentSlide = r.animatingTo;
            r.vars.after(r);
        };
        r.animateSlides = function() {
            !r.animating && m && r.flexAnimate(r.getTarget("next"));
        };
        r.pause = function() {
            clearInterval(r.animatedSlides);
            r.animatedSlides = null;
            r.playing = !1;
            r.vars.pausePlay && v.pausePlay.update("play");
            r.syncExists && v.sync("pause");
        };
        r.play = function() {
            r.playing && clearInterval(r.animatedSlides);
            r.animatedSlides = r.animatedSlides || setInterval(r.animateSlides, r.vars.slideshowSpeed);
            r.started = r.playing = !0;
            r.vars.pausePlay && v.pausePlay.update("pause");
            r.syncExists && v.sync("play");
        };
        r.stop = function() {
            r.pause();
            r.stopped = !0;
        };
        r.canAdvance = function(e, t) {
            var n = d ? r.pagingCount - 1 : r.last;
            return t ? !0 : d && r.currentItem === r.count - 1 && e === 0 && r.direction === "prev" ? !0 : d && r.currentItem === 0 && e === r.pagingCount - 1 && r.direction !== "next" ? !1 : e === r.currentSlide && !d ? !1 : r.vars.animationLoop ? !0 : r.atEnd && r.currentSlide === 0 && e === n && r.direction !== "next" ? !1 : r.atEnd && r.currentSlide === n && e === 0 && r.direction === "next" ? !1 : !0;
        };
        r.getTarget = function(e) {
            r.direction = e;
            return e === "next" ? r.currentSlide === r.last ? 0 : r.currentSlide + 1 : r.currentSlide === 0 ? r.last : r.currentSlide - 1;
        };
        r.setProps = function(e, t, n) {
            var i = function() {
                var n = e ? e : (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo, i = function() {
                    if (h) return t === "setTouch" ? e : c && r.animatingTo === r.last ? 0 : c ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : r.animatingTo === r.last ? r.limit : n;
                    switch (t) {
                      case "setTotal":
                        return c ? (r.count - 1 - r.currentSlide + r.cloneOffset) * e : (r.currentSlide + r.cloneOffset) * e;

                      case "setTouch":
                        return c ? e : e;

                      case "jumpEnd":
                        return c ? e : r.count * e;

                      case "jumpStart":
                        return c ? r.count * e : e;

                      default:
                        return e;
                    }
                }();
                return i * -1 + "px";
            }();
            if (r.transitions) {
                i = l ? "translate3d(0," + i + ",0)" : "translate3d(" + i + ",0,0)";
                n = n !== undefined ? n / 1e3 + "s" : "0s";
                r.container.css("-" + r.pfx + "-transition-duration", n);
            }
            r.args[r.prop] = i;
            (r.transitions || n === undefined) && r.container.css(r.args);
        };
        r.setup = function(t) {
            if (!p) {
                var n, s;
                if (t === "init") {
                    r.viewport = e('<div class="' + i + 'viewport"></div>').css({
                        overflow: "hidden",
                        position: "relative"
                    }).appendTo(r).append(r.container);
                    r.cloneCount = 0;
                    r.cloneOffset = 0;
                    if (c) {
                        s = e.makeArray(r.slides).reverse();
                        r.slides = e(s);
                        r.container.empty().append(r.slides);
                    }
                }
                if (r.vars.animationLoop && !h) {
                    r.cloneCount = 2;
                    r.cloneOffset = 1;
                    t !== "init" && r.container.find(".clone").remove();
                    r.container.append(r.slides.first().clone().addClass("clone").attr("aria-hidden", "true")).prepend(r.slides.last().clone().addClass("clone").attr("aria-hidden", "true"));
                }
                r.newSlides = e(r.vars.selector, r);
                n = c ? r.count - 1 - r.currentSlide + r.cloneOffset : r.currentSlide + r.cloneOffset;
                if (l && !h) {
                    r.container.height((r.count + r.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
                    setTimeout(function() {
                        r.newSlides.css({
                            display: "block"
                        });
                        r.doMath();
                        r.viewport.height(r.h);
                        r.setProps(n * r.h, "init");
                    }, t === "init" ? 100 : 0);
                } else {
                    r.container.width((r.count + r.cloneCount) * 200 + "%");
                    r.setProps(n * r.computedW, "init");
                    setTimeout(function() {
                        r.doMath();
                        r.newSlides.css({
                            width: r.computedW,
                            "float": "left",
                            display: "block"
                        });
                        r.vars.smoothHeight && v.smoothHeight();
                    }, t === "init" ? 100 : 0);
                }
            } else {
                r.slides.css({
                    width: "100%",
                    "float": "left",
                    marginRight: "-100%",
                    position: "relative"
                });
                t === "init" && (o ? r.slides.css({
                    opacity: 0,
                    display: "block",
                    webkitTransition: "opacity " + r.vars.animationSpeed / 1e3 + "s ease",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    opacity: 1,
                    zIndex: 2
                }) : r.slides.css({
                    opacity: 0,
                    display: "block",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    zIndex: 2
                }).animate({
                    opacity: 1
                }, r.vars.animationSpeed, r.vars.easing));
                r.vars.smoothHeight && v.smoothHeight();
            }
            h || r.slides.removeClass(i + "active-slide").eq(r.currentSlide).addClass(i + "active-slide");
        };
        r.doMath = function() {
            var e = r.slides.first(), t = r.vars.itemMargin, n = r.vars.minItems, i = r.vars.maxItems;
            r.w = r.viewport === undefined ? r.width() : r.viewport.width();
            r.h = e.height();
            r.boxPadding = e.outerWidth() - e.width();
            if (h) {
                r.itemT = r.vars.itemWidth + t;
                r.minW = n ? n * r.itemT : r.w;
                r.maxW = i ? i * r.itemT - t : r.w;
                r.itemW = r.minW > r.w ? (r.w - t * (n - 1)) / n : r.maxW < r.w ? (r.w - t * (i - 1)) / i : r.vars.itemWidth > r.w ? r.w : r.vars.itemWidth;
                r.visible = Math.floor(r.w / r.itemW);
                r.move = r.vars.move > 0 && r.vars.move < r.visible ? r.vars.move : r.visible;
                r.pagingCount = Math.ceil((r.count - r.visible) / r.move + 1);
                r.last = r.pagingCount - 1;
                r.limit = r.pagingCount === 1 ? 0 : r.vars.itemWidth > r.w ? r.itemW * (r.count - 1) + t * (r.count - 1) : (r.itemW + t) * r.count - r.w - t;
            } else {
                r.itemW = r.w;
                r.pagingCount = r.count;
                r.last = r.count - 1;
            }
            r.computedW = r.itemW - r.boxPadding;
        };
        r.update = function(e, t) {
            r.doMath();
            if (!h) {
                e < r.currentSlide ? r.currentSlide += 1 : e <= r.currentSlide && e !== 0 && (r.currentSlide -= 1);
                r.animatingTo = r.currentSlide;
            }
            if (r.vars.controlNav && !r.manualControls) if (t === "add" && !h || r.pagingCount > r.controlNav.length) v.controlNav.update("add"); else if (t === "remove" && !h || r.pagingCount < r.controlNav.length) {
                if (h && r.currentSlide > r.last) {
                    r.currentSlide -= 1;
                    r.animatingTo -= 1;
                }
                v.controlNav.update("remove", r.last);
            }
            r.vars.directionNav && v.directionNav.update();
        };
        r.addSlide = function(t, n) {
            var i = e(t);
            r.count += 1;
            r.last = r.count - 1;
            l && c ? n !== undefined ? r.slides.eq(r.count - n).after(i) : r.container.prepend(i) : n !== undefined ? r.slides.eq(n).before(i) : r.container.append(i);
            r.update(n, "add");
            r.slides = e(r.vars.selector + ":not(.clone)", r);
            r.setup();
            r.vars.added(r);
        };
        r.removeSlide = function(t) {
            var n = isNaN(t) ? r.slides.index(e(t)) : t;
            r.count -= 1;
            r.last = r.count - 1;
            isNaN(t) ? e(t, r.slides).remove() : l && c ? r.slides.eq(r.last).remove() : r.slides.eq(t).remove();
            r.doMath();
            r.update(n, "remove");
            r.slides = e(r.vars.selector + ":not(.clone)", r);
            r.setup();
            r.vars.removed(r);
        };
        v.init();
    };
    e(window).blur(function(e) {
        focused = !1;
    }).focus(function(e) {
        focused = !0;
    });
    e.flexslider.defaults = {
        namespace: "flex-",
        selector: ".slides > li",
        animation: "fade",
        easing: "swing",
        direction: "horizontal",
        reverse: !1,
        animationLoop: !0,
        smoothHeight: !1,
        startAt: 0,
        slideshow: !0,
        slideshowSpeed: 7e3,
        animationSpeed: 600,
        initDelay: 0,
        randomize: !1,
        thumbCaptions: !1,
        pauseOnAction: !0,
        pauseOnHover: !1,
        pauseInvisible: !0,
        useCSS: !0,
        touch: !0,
        video: !1,
        controlNav: !0,
        directionNav: !0,
        prevText: "Previous",
        nextText: "Next",
        keyboard: !0,
        multipleKeyboard: !1,
        mousewheel: !1,
        pausePlay: !1,
        pauseText: "Pause",
        playText: "Play",
        controlsContainer: "",
        manualControls: "",
        sync: "",
        asNavFor: "",
        itemWidth: 0,
        itemMargin: 0,
        minItems: 1,
        maxItems: 0,
        move: 0,
        allowOneSlide: !0,
        start: function() {},
        before: function() {},
        after: function() {},
        end: function() {},
        added: function() {},
        removed: function() {}
    };
    e.fn.flexslider = function(t) {
        t === undefined && (t = {});
        if (typeof t == "object") return this.each(function() {
            var n = e(this), r = t.selector ? t.selector : ".slides > li", i = n.find(r);
            if (i.length === 1 && t.allowOneSlide === !0 || i.length === 0) {
                i.fadeIn(400);
                t.start && t.start(n);
            } else n.data("flexslider") === undefined && new e.flexslider(this, t);
        });
        var n = e(this).data("flexslider");
        switch (t) {
          case "play":
            n.play();
            break;

          case "pause":
            n.pause();
            break;

          case "stop":
            n.stop();
            break;

          case "next":
            n.flexAnimate(n.getTarget("next"), !0);
            break;

          case "prev":
          case "previous":
            n.flexAnimate(n.getTarget("prev"), !0);
            break;

          default:
            typeof t == "number" && n.flexAnimate(t, !0);
        }
    };
})(jQuery);

/**
 * Isotope v1.5.19
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2012 David DeSandro / Metafizzy
 */
(function(a, b, c) {
    "use strict";
    var d = a.document, e = a.Modernizr, f = function(a) {
        return a.charAt(0).toUpperCase() + a.slice(1);
    }, g = "Moz Webkit O Ms".split(" "), h = function(a) {
        var b = d.documentElement.style, c;
        if (typeof b[a] == "string") return a;
        a = f(a);
        for (var e = 0, h = g.length; e < h; e++) {
            c = g[e] + a;
            if (typeof b[c] == "string") return c;
        }
    }, i = h("transform"), j = h("transitionProperty"), k = {
        csstransforms: function() {
            return !!i;
        },
        csstransforms3d: function() {
            var a = !!h("perspective");
            if (a) {
                var c = " -o- -moz- -ms- -webkit- -khtml- ".split(" "), d = "@media (" + c.join("transform-3d),(") + "modernizr)", e = b("<style>" + d + "{#modernizr{height:3px}}" + "</style>").appendTo("head"), f = b('<div id="modernizr" />').appendTo("html");
                a = f.height() === 3, f.remove(), e.remove();
            }
            return a;
        },
        csstransitions: function() {
            return !!j;
        }
    }, l;
    if (e) for (l in k) e.hasOwnProperty(l) || e.addTest(l, k[l]); else {
        e = a.Modernizr = {
            _version: "1.6ish: miniModernizr for Isotope"
        };
        var m = " ", n;
        for (l in k) n = k[l](), e[l] = n, m += " " + (n ? "" : "no-") + l;
        b("html").addClass(m);
    }
    if (e.csstransforms) {
        var o = e.csstransforms3d ? {
            translate: function(a) {
                return "translate3d(" + a[0] + "px, " + a[1] + "px, 0) ";
            },
            scale: function(a) {
                return "scale3d(" + a + ", " + a + ", 1) ";
            }
        } : {
            translate: function(a) {
                return "translate(" + a[0] + "px, " + a[1] + "px) ";
            },
            scale: function(a) {
                return "scale(" + a + ") ";
            }
        }, p = function(a, c, d) {
            var e = b.data(a, "isoTransform") || {}, f = {}, g, h = {}, j;
            f[c] = d, b.extend(e, f);
            for (g in e) j = e[g], h[g] = o[g](j);
            var k = h.translate || "", l = h.scale || "", m = k + l;
            b.data(a, "isoTransform", e), a.style[i] = m;
        };
        b.cssNumber.scale = !0, b.cssHooks.scale = {
            set: function(a, b) {
                p(a, "scale", b);
            },
            get: function(a, c) {
                var d = b.data(a, "isoTransform");
                return d && d.scale ? d.scale : 1;
            }
        }, b.fx.step.scale = function(a) {
            b.cssHooks.scale.set(a.elem, a.now + a.unit);
        }, b.cssNumber.translate = !0, b.cssHooks.translate = {
            set: function(a, b) {
                p(a, "translate", b);
            },
            get: function(a, c) {
                var d = b.data(a, "isoTransform");
                return d && d.translate ? d.translate : [ 0, 0 ];
            }
        };
    }
    var q, r;
    e.csstransitions && (q = {
        WebkitTransitionProperty: "webkitTransitionEnd",
        MozTransitionProperty: "transitionend",
        OTransitionProperty: "oTransitionEnd",
        transitionProperty: "transitionEnd"
    }[j], r = h("transitionDuration"));
    var s = b.event, t;
    s.special.smartresize = {
        setup: function() {
            b(this).bind("resize", s.special.smartresize.handler);
        },
        teardown: function() {
            b(this).unbind("resize", s.special.smartresize.handler);
        },
        handler: function(a, b) {
            var c = this, d = arguments;
            a.type = "smartresize", t && clearTimeout(t), t = setTimeout(function() {
                jQuery.event.handle.apply(c, d);
            }, b === "execAsap" ? 0 : 100);
        }
    }, b.fn.smartresize = function(a) {
        return a ? this.bind("smartresize", a) : this.trigger("smartresize", [ "execAsap" ]);
    }, b.Isotope = function(a, c, d) {
        this.element = b(c), this._create(a), this._init(d);
    };
    var u = [ "width", "height" ], v = b(a);
    b.Isotope.settings = {
        resizable: !0,
        layoutMode: "masonry",
        containerClass: "isotope",
        itemClass: "isotope-item",
        hiddenClass: "isotope-hidden",
        hiddenStyle: {
            opacity: 0,
            scale: .001
        },
        visibleStyle: {
            opacity: 1,
            scale: 1
        },
        containerStyle: {
            position: "relative",
            overflow: "hidden"
        },
        animationEngine: "best-available",
        animationOptions: {
            queue: !1,
            duration: 800
        },
        sortBy: "original-order",
        sortAscending: !0,
        resizesContainer: !0,
        transformsEnabled: !b.browser.opera,
        itemPositionDataEnabled: !1
    }, b.Isotope.prototype = {
        _create: function(a) {
            this.options = b.extend({}, b.Isotope.settings, a), this.styleQueue = [], this.elemCount = 0;
            var c = this.element[0].style;
            this.originalStyle = {};
            var d = u.slice(0);
            for (var e in this.options.containerStyle) d.push(e);
            for (var f = 0, g = d.length; f < g; f++) e = d[f], this.originalStyle[e] = c[e] || "";
            this.element.css(this.options.containerStyle), this._updateAnimationEngine(), this._updateUsingTransforms();
            var h = {
                "original-order": function(a, b) {
                    return b.elemCount++, b.elemCount;
                },
                random: function() {
                    return Math.random();
                }
            };
            this.options.getSortData = b.extend(this.options.getSortData, h), this.reloadItems(), 
            this.offset = {
                left: parseInt(this.element.css("padding-left") || 0, 10),
                top: parseInt(this.element.css("padding-top") || 0, 10)
            };
            var i = this;
            setTimeout(function() {
                i.element.addClass(i.options.containerClass);
            }, 0), this.options.resizable && v.bind("smartresize.isotope", function() {
                i.resize();
            }), this.element.delegate("." + this.options.hiddenClass, "click", function() {
                return !1;
            });
        },
        _getAtoms: function(a) {
            var b = this.options.itemSelector, c = b ? a.filter(b).add(a.find(b)) : a, d = {
                position: "absolute"
            };
            return this.usingTransforms && (d.left = 0, d.top = 0), c.css(d).addClass(this.options.itemClass), 
            this.updateSortData(c, !0), c;
        },
        _init: function(a) {
            this.$filteredAtoms = this._filter(this.$allAtoms), this._sort(), this.reLayout(a);
        },
        option: function(a) {
            if (b.isPlainObject(a)) {
                this.options = b.extend(!0, this.options, a);
                var c;
                for (var d in a) c = "_update" + f(d), this[c] && this[c]();
            }
        },
        _updateAnimationEngine: function() {
            var a = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, ""), b;
            switch (a) {
              case "css":
              case "none":
                b = !1;
                break;

              case "jquery":
                b = !0;
                break;

              default:
                b = !e.csstransitions;
            }
            this.isUsingJQueryAnimation = b, this._updateUsingTransforms();
        },
        _updateTransformsEnabled: function() {
            this._updateUsingTransforms();
        },
        _updateUsingTransforms: function() {
            var a = this.usingTransforms = this.options.transformsEnabled && e.csstransforms && e.csstransitions && !this.isUsingJQueryAnimation;
            a || (delete this.options.hiddenStyle.scale, delete this.options.visibleStyle.scale), 
            this.getPositionStyles = a ? this._translate : this._positionAbs;
        },
        _filter: function(a) {
            var b = this.options.filter === "" ? "*" : this.options.filter;
            if (!b) return a;
            var c = this.options.hiddenClass, d = "." + c, e = a.filter(d), f = e;
            if (b !== "*") {
                f = e.filter(b);
                var g = a.not(d).not(b).addClass(c);
                this.styleQueue.push({
                    $el: g,
                    style: this.options.hiddenStyle
                });
            }
            return this.styleQueue.push({
                $el: f,
                style: this.options.visibleStyle
            }), f.removeClass(c), a.filter(b);
        },
        updateSortData: function(a, c) {
            var d = this, e = this.options.getSortData, f, g;
            a.each(function() {
                f = b(this), g = {};
                for (var a in e) !c && a === "original-order" ? g[a] = b.data(this, "isotope-sort-data")[a] : g[a] = e[a](f, d);
                b.data(this, "isotope-sort-data", g);
            });
        },
        _sort: function() {
            var a = this.options.sortBy, b = this._getSorter, c = this.options.sortAscending ? 1 : -1, d = function(d, e) {
                var f = b(d, a), g = b(e, a);
                return f === g && a !== "original-order" && (f = b(d, "original-order"), g = b(e, "original-order")), 
                (f > g ? 1 : f < g ? -1 : 0) * c;
            };
            this.$filteredAtoms.sort(d);
        },
        _getSorter: function(a, c) {
            return b.data(a, "isotope-sort-data")[c];
        },
        _translate: function(a, b) {
            return {
                translate: [ a, b ]
            };
        },
        _positionAbs: function(a, b) {
            return {
                left: a,
                top: b
            };
        },
        _pushPosition: function(a, b, c) {
            b = Math.round(b + this.offset.left), c = Math.round(c + this.offset.top);
            var d = this.getPositionStyles(b, c);
            this.styleQueue.push({
                $el: a,
                style: d
            }), this.options.itemPositionDataEnabled && a.data("isotope-item-position", {
                x: b,
                y: c
            });
        },
        layout: function(a, b) {
            var c = this.options.layoutMode;
            this["_" + c + "Layout"](a);
            if (this.options.resizesContainer) {
                var d = this["_" + c + "GetContainerSize"]();
                this.styleQueue.push({
                    $el: this.element,
                    style: d
                });
            }
            this._processStyleQueue(a, b), this.isLaidOut = !0;
        },
        _processStyleQueue: function(a, c) {
            var d = this.isLaidOut ? this.isUsingJQueryAnimation ? "animate" : "css" : "css", f = this.options.animationOptions, g = this.options.onLayout, h, i, j, k;
            i = function(a, b) {
                b.$el[d](b.style, f);
            };
            if (this._isInserting && this.isUsingJQueryAnimation) i = function(a, b) {
                h = b.$el.hasClass("no-transition") ? "css" : d, b.$el[h](b.style, f);
            }; else if (c || g || f.complete) {
                var l = !1, m = [ c, g, f.complete ], n = this;
                j = !0, k = function() {
                    if (l) return;
                    var b;
                    for (var c = 0, d = m.length; c < d; c++) b = m[c], typeof b == "function" && b.call(n.element, a, n);
                    l = !0;
                };
                if (this.isUsingJQueryAnimation && d === "animate") f.complete = k, j = !1; else if (e.csstransitions) {
                    var o = 0, p = this.styleQueue[0], s = p && p.$el, t;
                    while (!s || !s.length) {
                        t = this.styleQueue[o++];
                        if (!t) return;
                        s = t.$el;
                    }
                    var u = parseFloat(getComputedStyle(s[0])[r]);
                    u > 0 && (i = function(a, b) {
                        b.$el[d](b.style, f).one(q, k);
                    }, j = !1);
                }
            }
            b.each(this.styleQueue, i), j && k(), this.styleQueue = [];
        },
        resize: function() {
            this["_" + this.options.layoutMode + "ResizeChanged"]() && this.reLayout();
        },
        reLayout: function(a) {
            this["_" + this.options.layoutMode + "Reset"](), this.layout(this.$filteredAtoms, a);
        },
        addItems: function(a, b) {
            var c = this._getAtoms(a);
            this.$allAtoms = this.$allAtoms.add(c), b && b(c);
        },
        insert: function(a, b) {
            this.element.append(a);
            var c = this;
            this.addItems(a, function(a) {
                var d = c._filter(a);
                c._addHideAppended(d), c._sort(), c.reLayout(), c._revealAppended(d, b);
            });
        },
        appended: function(a, b) {
            var c = this;
            this.addItems(a, function(a) {
                c._addHideAppended(a), c.layout(a), c._revealAppended(a, b);
            });
        },
        _addHideAppended: function(a) {
            this.$filteredAtoms = this.$filteredAtoms.add(a), a.addClass("no-transition"), this._isInserting = !0, 
            this.styleQueue.push({
                $el: a,
                style: this.options.hiddenStyle
            });
        },
        _revealAppended: function(a, b) {
            var c = this;
            setTimeout(function() {
                a.removeClass("no-transition"), c.styleQueue.push({
                    $el: a,
                    style: c.options.visibleStyle
                }), c._isInserting = !1, c._processStyleQueue(a, b);
            }, 10);
        },
        reloadItems: function() {
            this.$allAtoms = this._getAtoms(this.element.children());
        },
        remove: function(a, b) {
            var c = this, d = function() {
                c.$allAtoms = c.$allAtoms.not(a), a.remove(), b && b.call(c.element);
            };
            a.filter(":not(." + this.options.hiddenClass + ")").length ? (this.styleQueue.push({
                $el: a,
                style: this.options.hiddenStyle
            }), this.$filteredAtoms = this.$filteredAtoms.not(a), this._sort(), this.reLayout(d)) : d();
        },
        shuffle: function(a) {
            this.updateSortData(this.$allAtoms), this.options.sortBy = "random", this._sort(), 
            this.reLayout(a);
        },
        destroy: function() {
            var a = this.usingTransforms, b = this.options;
            this.$allAtoms.removeClass(b.hiddenClass + " " + b.itemClass).each(function() {
                var b = this.style;
                b.position = "", b.top = "", b.left = "", b.opacity = "", a && (b[i] = "");
            });
            var c = this.element[0].style;
            for (var d in this.originalStyle) c[d] = this.originalStyle[d];
            this.element.unbind(".isotope").undelegate("." + b.hiddenClass, "click").removeClass(b.containerClass).removeData("isotope"), 
            v.unbind(".isotope");
        },
        _getSegments: function(a) {
            var b = this.options.layoutMode, c = a ? "rowHeight" : "columnWidth", d = a ? "height" : "width", e = a ? "rows" : "cols", g = this.element[d](), h, i = this.options[b] && this.options[b][c] || this.$filteredAtoms["outer" + f(d)](!0) || g;
            h = Math.floor(g / i), h = Math.max(h, 1), this[b][e] = h, this[b][c] = i;
        },
        _checkIfSegmentsChanged: function(a) {
            var b = this.options.layoutMode, c = a ? "rows" : "cols", d = this[b][c];
            return this._getSegments(a), this[b][c] !== d;
        },
        _masonryReset: function() {
            this.masonry = {}, this._getSegments();
            var a = this.masonry.cols;
            this.masonry.colYs = [];
            while (a--) this.masonry.colYs.push(0);
        },
        _masonryLayout: function(a) {
            var c = this, d = c.masonry;
            a.each(function() {
                var a = b(this), e = Math.ceil(a.outerWidth(!0) / d.columnWidth);
                e = Math.min(e, d.cols);
                if (e === 1) c._masonryPlaceBrick(a, d.colYs); else {
                    var f = d.cols + 1 - e, g = [], h, i;
                    for (i = 0; i < f; i++) h = d.colYs.slice(i, i + e), g[i] = Math.max.apply(Math, h);
                    c._masonryPlaceBrick(a, g);
                }
            });
        },
        _masonryPlaceBrick: function(a, b) {
            var c = Math.min.apply(Math, b), d = 0;
            for (var e = 0, f = b.length; e < f; e++) if (b[e] === c) {
                d = e;
                break;
            }
            var g = this.masonry.columnWidth * d, h = c;
            this._pushPosition(a, g, h);
            var i = c + a.outerHeight(!0), j = this.masonry.cols + 1 - f;
            for (e = 0; e < j; e++) this.masonry.colYs[d + e] = i;
        },
        _masonryGetContainerSize: function() {
            var a = Math.max.apply(Math, this.masonry.colYs);
            return {
                height: a
            };
        },
        _masonryResizeChanged: function() {
            return this._checkIfSegmentsChanged();
        },
        _fitRowsReset: function() {
            this.fitRows = {
                x: 0,
                y: 0,
                height: 0
            };
        },
        _fitRowsLayout: function(a) {
            var c = this, d = this.element.width(), e = this.fitRows;
            a.each(function() {
                var a = b(this), f = a.outerWidth(!0), g = a.outerHeight(!0);
                e.x !== 0 && f + e.x > d && (e.x = 0, e.y = e.height), c._pushPosition(a, e.x, e.y), 
                e.height = Math.max(e.y + g, e.height), e.x += f;
            });
        },
        _fitRowsGetContainerSize: function() {
            return {
                height: this.fitRows.height
            };
        },
        _fitRowsResizeChanged: function() {
            return !0;
        },
        _cellsByRowReset: function() {
            this.cellsByRow = {
                index: 0
            }, this._getSegments(), this._getSegments(!0);
        },
        _cellsByRowLayout: function(a) {
            var c = this, d = this.cellsByRow;
            a.each(function() {
                var a = b(this), e = d.index % d.cols, f = Math.floor(d.index / d.cols), g = (e + .5) * d.columnWidth - a.outerWidth(!0) / 2, h = (f + .5) * d.rowHeight - a.outerHeight(!0) / 2;
                c._pushPosition(a, g, h), d.index++;
            });
        },
        _cellsByRowGetContainerSize: function() {
            return {
                height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) * this.cellsByRow.rowHeight + this.offset.top
            };
        },
        _cellsByRowResizeChanged: function() {
            return this._checkIfSegmentsChanged();
        },
        _straightDownReset: function() {
            this.straightDown = {
                y: 0
            };
        },
        _straightDownLayout: function(a) {
            var c = this;
            a.each(function(a) {
                var d = b(this);
                c._pushPosition(d, 0, c.straightDown.y), c.straightDown.y += d.outerHeight(!0);
            });
        },
        _straightDownGetContainerSize: function() {
            return {
                height: this.straightDown.y
            };
        },
        _straightDownResizeChanged: function() {
            return !0;
        },
        _masonryHorizontalReset: function() {
            this.masonryHorizontal = {}, this._getSegments(!0);
            var a = this.masonryHorizontal.rows;
            this.masonryHorizontal.rowXs = [];
            while (a--) this.masonryHorizontal.rowXs.push(0);
        },
        _masonryHorizontalLayout: function(a) {
            var c = this, d = c.masonryHorizontal;
            a.each(function() {
                var a = b(this), e = Math.ceil(a.outerHeight(!0) / d.rowHeight);
                e = Math.min(e, d.rows);
                if (e === 1) c._masonryHorizontalPlaceBrick(a, d.rowXs); else {
                    var f = d.rows + 1 - e, g = [], h, i;
                    for (i = 0; i < f; i++) h = d.rowXs.slice(i, i + e), g[i] = Math.max.apply(Math, h);
                    c._masonryHorizontalPlaceBrick(a, g);
                }
            });
        },
        _masonryHorizontalPlaceBrick: function(a, b) {
            var c = Math.min.apply(Math, b), d = 0;
            for (var e = 0, f = b.length; e < f; e++) if (b[e] === c) {
                d = e;
                break;
            }
            var g = c, h = this.masonryHorizontal.rowHeight * d;
            this._pushPosition(a, g, h);
            var i = c + a.outerWidth(!0), j = this.masonryHorizontal.rows + 1 - f;
            for (e = 0; e < j; e++) this.masonryHorizontal.rowXs[d + e] = i;
        },
        _masonryHorizontalGetContainerSize: function() {
            var a = Math.max.apply(Math, this.masonryHorizontal.rowXs);
            return {
                width: a
            };
        },
        _masonryHorizontalResizeChanged: function() {
            return this._checkIfSegmentsChanged(!0);
        },
        _fitColumnsReset: function() {
            this.fitColumns = {
                x: 0,
                y: 0,
                width: 0
            };
        },
        _fitColumnsLayout: function(a) {
            var c = this, d = this.element.height(), e = this.fitColumns;
            a.each(function() {
                var a = b(this), f = a.outerWidth(!0), g = a.outerHeight(!0);
                e.y !== 0 && g + e.y > d && (e.x = e.width, e.y = 0), c._pushPosition(a, e.x, e.y), 
                e.width = Math.max(e.x + f, e.width), e.y += g;
            });
        },
        _fitColumnsGetContainerSize: function() {
            return {
                width: this.fitColumns.width
            };
        },
        _fitColumnsResizeChanged: function() {
            return !0;
        },
        _cellsByColumnReset: function() {
            this.cellsByColumn = {
                index: 0
            }, this._getSegments(), this._getSegments(!0);
        },
        _cellsByColumnLayout: function(a) {
            var c = this, d = this.cellsByColumn;
            a.each(function() {
                var a = b(this), e = Math.floor(d.index / d.rows), f = d.index % d.rows, g = (e + .5) * d.columnWidth - a.outerWidth(!0) / 2, h = (f + .5) * d.rowHeight - a.outerHeight(!0) / 2;
                c._pushPosition(a, g, h), d.index++;
            });
        },
        _cellsByColumnGetContainerSize: function() {
            return {
                width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) * this.cellsByColumn.columnWidth
            };
        },
        _cellsByColumnResizeChanged: function() {
            return this._checkIfSegmentsChanged(!0);
        },
        _straightAcrossReset: function() {
            this.straightAcross = {
                x: 0
            };
        },
        _straightAcrossLayout: function(a) {
            var c = this;
            a.each(function(a) {
                var d = b(this);
                c._pushPosition(d, c.straightAcross.x, 0), c.straightAcross.x += d.outerWidth(!0);
            });
        },
        _straightAcrossGetContainerSize: function() {
            return {
                width: this.straightAcross.x
            };
        },
        _straightAcrossResizeChanged: function() {
            return !0;
        }
    }, b.fn.imagesLoaded = function(a) {
        function h() {
            a.call(c, d);
        }
        function i(a) {
            var c = a.target;
            c.src !== f && b.inArray(c, g) === -1 && (g.push(c), --e <= 0 && (setTimeout(h), 
            d.unbind(".imagesLoaded", i)));
        }
        var c = this, d = c.find("img").add(c.filter("img")), e = d.length, f = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", g = [];
        return e || h(), d.bind("load.imagesLoaded error.imagesLoaded", i).each(function() {
            var a = this.src;
            this.src = f, this.src = a;
        }), c;
    };
    var w = function(b) {
        a.console && a.console.error(b);
    };
    b.fn.isotope = function(a, c) {
        if (typeof a == "string") {
            var d = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var c = b.data(this, "isotope");
                if (!c) {
                    w("cannot call methods on isotope prior to initialization; attempted to call method '" + a + "'");
                    return;
                }
                if (!b.isFunction(c[a]) || a.charAt(0) === "_") {
                    w("no such method '" + a + "' for isotope instance");
                    return;
                }
                c[a].apply(c, d);
            });
        } else this.each(function() {
            var d = b.data(this, "isotope");
            d ? (d.option(a), d._init(c)) : b.data(this, "isotope", new b.Isotope(a, this, c));
        });
        return this;
    };
})(window, jQuery);

/*
 * Shadowbox.js, version 3.0.3
 * http://shadowbox-js.com/
 *
 * Copyright 2007-2010, Michael J. I. Jackson
 * Date: 2011-05-14 07:57:32 +0000
 */
(function(window, undefined) {
    var S = {
        version: "3.0.3"
    };
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("windows") > -1 || ua.indexOf("win32") > -1) {
        S.isWindows = true;
    } else {
        if (ua.indexOf("macintosh") > -1 || ua.indexOf("mac os x") > -1) {
            S.isMac = true;
        } else {
            if (ua.indexOf("linux") > -1) {
                S.isLinux = true;
            }
        }
    }
    S.isIE = ua.indexOf("msie") > -1;
    S.isIE6 = ua.indexOf("msie 6") > -1;
    S.isIE7 = ua.indexOf("msie 7") > -1;
    S.isGecko = ua.indexOf("gecko") > -1 && ua.indexOf("safari") == -1;
    S.isWebKit = ua.indexOf("applewebkit/") > -1;
    var inlineId = /#(.+)$/, galleryName = /^(light|shadow)box\[(.*?)\]/i, inlineParam = /\s*([a-z_]*?)\s*=\s*(.+)\s*/, fileExtension = /[0-9a-z]+$/i, scriptPath = /(.+\/)shadowbox\.js/i;
    var open = false, initialized = false, lastOptions = {}, slideDelay = 0, slideStart, slideTimer;
    S.current = -1;
    S.dimensions = null;
    S.ease = function(state) {
        return 1 + Math.pow(state - 1, 3);
    };
    S.errorInfo = {
        fla: {
            name: "Flash",
            url: "http://www.adobe.com/products/flashplayer/"
        },
        qt: {
            name: "QuickTime",
            url: "http://www.apple.com/quicktime/download/"
        },
        wmp: {
            name: "Windows Media Player",
            url: "http://www.microsoft.com/windows/windowsmedia/"
        },
        f4m: {
            name: "Flip4Mac",
            url: "http://www.flip4mac.com/wmv_download.htm"
        }
    };
    S.gallery = [];
    S.onReady = noop;
    S.path = null;
    S.player = null;
    S.playerId = "sb-player";
    S.options = {
        animate: true,
        animateFade: true,
        autoplayMovies: true,
        continuous: false,
        enableKeys: true,
        flashParams: {
            bgcolor: "#000000",
            allowfullscreen: true
        },
        flashVars: {},
        flashVersion: "9.0.115",
        handleOversize: "resize",
        handleUnsupported: "link",
        onChange: noop,
        onClose: noop,
        onFinish: noop,
        onOpen: noop,
        showMovieControls: true,
        skipSetup: false,
        slideshowDelay: 0,
        viewportPadding: 20
    };
    S.getCurrent = function() {
        return S.current > -1 ? S.gallery[S.current] : null;
    };
    S.hasNext = function() {
        return S.gallery.length > 1 && (S.current != S.gallery.length - 1 || S.options.continuous);
    };
    S.isOpen = function() {
        return open;
    };
    S.isPaused = function() {
        return slideTimer == "pause";
    };
    S.applyOptions = function(options) {
        lastOptions = apply({}, S.options);
        apply(S.options, options);
    };
    S.revertOptions = function() {
        apply(S.options, lastOptions);
    };
    S.init = function(options, callback) {
        if (initialized) {
            return;
        }
        initialized = true;
        if (S.skin.options) {
            apply(S.options, S.skin.options);
        }
        if (options) {
            apply(S.options, options);
        }
        if (!S.path) {
            var path, scripts = document.getElementsByTagName("script");
            for (var i = 0, len = scripts.length; i < len; ++i) {
                path = scriptPath.exec(scripts[i].src);
                if (path) {
                    S.path = path[1];
                    break;
                }
            }
        }
        if (callback) {
            S.onReady = callback;
        }
        bindLoad();
    };
    S.open = function(obj) {
        if (open) {
            return;
        }
        var gc = S.makeGallery(obj);
        S.gallery = gc[0];
        S.current = gc[1];
        obj = S.getCurrent();
        if (obj == null) {
            return;
        }
        S.applyOptions(obj.options || {});
        filterGallery();
        if (S.gallery.length) {
            obj = S.getCurrent();
            if (S.options.onOpen(obj) === false) {
                return;
            }
            open = true;
            S.skin.onOpen(obj, load);
        }
    };
    S.close = function() {
        if (!open) {
            return;
        }
        open = false;
        if (S.player) {
            S.player.remove();
            S.player = null;
        }
        if (typeof slideTimer == "number") {
            clearTimeout(slideTimer);
            slideTimer = null;
        }
        slideDelay = 0;
        listenKeys(false);
        S.options.onClose(S.getCurrent());
        S.skin.onClose();
        S.revertOptions();
    };
    S.play = function() {
        if (!S.hasNext()) {
            return;
        }
        if (!slideDelay) {
            slideDelay = S.options.slideshowDelay * 1e3;
        }
        if (slideDelay) {
            slideStart = now();
            slideTimer = setTimeout(function() {
                slideDelay = slideStart = 0;
                S.next();
            }, slideDelay);
            if (S.skin.onPlay) {
                S.skin.onPlay();
            }
        }
    };
    S.pause = function() {
        if (typeof slideTimer != "number") {
            return;
        }
        slideDelay = Math.max(0, slideDelay - (now() - slideStart));
        if (slideDelay) {
            clearTimeout(slideTimer);
            slideTimer = "pause";
            if (S.skin.onPause) {
                S.skin.onPause();
            }
        }
    };
    S.change = function(index) {
        if (!(index in S.gallery)) {
            if (S.options.continuous) {
                index = index < 0 ? S.gallery.length + index : 0;
                if (!(index in S.gallery)) {
                    return;
                }
            } else {
                return;
            }
        }
        S.current = index;
        if (typeof slideTimer == "number") {
            clearTimeout(slideTimer);
            slideTimer = null;
            slideDelay = slideStart = 0;
        }
        S.options.onChange(S.getCurrent());
        load(true);
    };
    S.next = function() {
        S.change(S.current + 1);
    };
    S.previous = function() {
        S.change(S.current - 1);
    };
    S.setDimensions = function(height, width, maxHeight, maxWidth, topBottom, leftRight, padding, preserveAspect) {
        var originalHeight = height, originalWidth = width;
        var extraHeight = 2 * padding + topBottom;
        if (height + extraHeight > maxHeight) {
            height = maxHeight - extraHeight;
        }
        var extraWidth = 2 * padding + leftRight;
        if (width + extraWidth > maxWidth) {
            width = maxWidth - extraWidth;
        }
        var changeHeight = (originalHeight - height) / originalHeight, changeWidth = (originalWidth - width) / originalWidth, oversized = changeHeight > 0 || changeWidth > 0;
        if (preserveAspect && oversized) {
            if (changeHeight > changeWidth) {
                width = Math.round(originalWidth / originalHeight * height);
            } else {
                if (changeWidth > changeHeight) {
                    height = Math.round(originalHeight / originalWidth * width);
                }
            }
        }
        S.dimensions = {
            height: height + topBottom,
            width: width + leftRight,
            innerHeight: height,
            innerWidth: width,
            top: Math.floor((maxHeight - (height + extraHeight)) / 2 + padding),
            left: Math.floor((maxWidth - (width + extraWidth)) / 2 + padding),
            oversized: oversized
        };
        return S.dimensions;
    };
    S.makeGallery = function(obj) {
        var gallery = [], current = -1;
        if (typeof obj == "string") {
            obj = [ obj ];
        }
        if (typeof obj.length == "number") {
            each(obj, function(i, o) {
                if (o.content) {
                    gallery[i] = o;
                } else {
                    gallery[i] = {
                        content: o
                    };
                }
            });
            current = 0;
        } else {
            if (obj.tagName) {
                var cacheObj = S.getCache(obj);
                obj = cacheObj ? cacheObj : S.makeObject(obj);
            }
            if (obj.gallery) {
                gallery = [];
                var o;
                for (var key in S.cache) {
                    o = S.cache[key];
                    if (o.gallery && o.gallery == obj.gallery) {
                        if (current == -1 && o.content == obj.content) {
                            current = gallery.length;
                        }
                        gallery.push(o);
                    }
                }
                if (current == -1) {
                    gallery.unshift(obj);
                    current = 0;
                }
            } else {
                gallery = [ obj ];
                current = 0;
            }
        }
        each(gallery, function(i, o) {
            gallery[i] = apply({}, o);
        });
        return [ gallery, current ];
    };
    S.makeObject = function(link, options) {
        var obj = {
            content: link.href,
            title: link.getAttribute("title") || "",
            link: link
        };
        if (options) {
            options = apply({}, options);
            each([ "player", "title", "height", "width", "gallery" ], function(i, o) {
                if (typeof options[o] != "undefined") {
                    obj[o] = options[o];
                    delete options[o];
                }
            });
            obj.options = options;
        } else {
            obj.options = {};
        }
        if (!obj.player) {
            obj.player = S.getPlayer(obj.content);
        }
        var rel = link.getAttribute("rel");
        if (rel) {
            var match = rel.match(galleryName);
            if (match) {
                obj.gallery = escape(match[2]);
            }
            each(rel.split(";"), function(i, p) {
                match = p.match(inlineParam);
                if (match) {
                    obj[match[1]] = match[2];
                }
            });
        }
        return obj;
    };
    S.getPlayer = function(content) {
        if (content.indexOf("#") > -1 && content.indexOf(document.location.href) == 0) {
            return "inline";
        }
        var q = content.indexOf("?");
        if (q > -1) {
            content = content.substring(0, q);
        }
        var ext, m = content.match(fileExtension);
        if (m) {
            ext = m[0].toLowerCase();
        }
        if (ext) {
            if (S.img && S.img.ext.indexOf(ext) > -1) {
                return "img";
            }
            if (S.swf && S.swf.ext.indexOf(ext) > -1) {
                return "swf";
            }
            if (S.flv && S.flv.ext.indexOf(ext) > -1) {
                return "flv";
            }
            if (S.qt && S.qt.ext.indexOf(ext) > -1) {
                if (S.wmp && S.wmp.ext.indexOf(ext) > -1) {
                    return "qtwmp";
                } else {
                    return "qt";
                }
            }
            if (S.wmp && S.wmp.ext.indexOf(ext) > -1) {
                return "wmp";
            }
        }
        return "iframe";
    };
    function filterGallery() {
        var err = S.errorInfo, plugins = S.plugins, obj, remove, needed, m, format, replace, inlineEl, flashVersion;
        for (var i = 0; i < S.gallery.length; ++i) {
            obj = S.gallery[i];
            remove = false;
            needed = null;
            switch (obj.player) {
              case "flv":
              case "swf":
                if (!plugins.fla) {
                    needed = "fla";
                }
                break;

              case "qt":
                if (!plugins.qt) {
                    needed = "qt";
                }
                break;

              case "wmp":
                if (S.isMac) {
                    if (plugins.qt && plugins.f4m) {
                        obj.player = "qt";
                    } else {
                        needed = "qtf4m";
                    }
                } else {
                    if (!plugins.wmp) {
                        needed = "wmp";
                    }
                }
                break;

              case "qtwmp":
                if (plugins.qt) {
                    obj.player = "qt";
                } else {
                    if (plugins.wmp) {
                        obj.player = "wmp";
                    } else {
                        needed = "qtwmp";
                    }
                }
                break;
            }
            if (needed) {
                if (S.options.handleUnsupported == "link") {
                    switch (needed) {
                      case "qtf4m":
                        format = "shared";
                        replace = [ err.qt.url, err.qt.name, err.f4m.url, err.f4m.name ];
                        break;

                      case "qtwmp":
                        format = "either";
                        replace = [ err.qt.url, err.qt.name, err.wmp.url, err.wmp.name ];
                        break;

                      default:
                        format = "single";
                        replace = [ err[needed].url, err[needed].name ];
                    }
                    obj.player = "html";
                    obj.content = '<div class="sb-message">' + sprintf(S.lang.errors[format], replace) + "</div>";
                } else {
                    remove = true;
                }
            } else {
                if (obj.player == "inline") {
                    m = inlineId.exec(obj.content);
                    if (m) {
                        inlineEl = get(m[1]);
                        if (inlineEl) {
                            obj.content = inlineEl.innerHTML;
                        } else {
                            remove = true;
                        }
                    } else {
                        remove = true;
                    }
                } else {
                    if (obj.player == "swf" || obj.player == "flv") {
                        flashVersion = obj.options && obj.options.flashVersion || S.options.flashVersion;
                        if (S.flash && !S.flash.hasFlashPlayerVersion(flashVersion)) {
                            obj.width = 310;
                            obj.height = 177;
                        }
                    }
                }
            }
            if (remove) {
                S.gallery.splice(i, 1);
                if (i < S.current) {
                    --S.current;
                } else {
                    if (i == S.current) {
                        S.current = i > 0 ? i - 1 : i;
                    }
                }
                --i;
            }
        }
    }
    function listenKeys(on) {
        if (!S.options.enableKeys) {
            return;
        }
        (on ? addEvent : removeEvent)(document, "keydown", handleKey);
    }
    function handleKey(e) {
        if (e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) {
            return;
        }
        var code = keyCode(e), handler;
        switch (code) {
          case 81:
          case 88:
          case 27:
            handler = S.close;
            break;

          case 37:
            handler = S.previous;
            break;

          case 39:
            handler = S.next;
            break;

          case 32:
            handler = typeof slideTimer == "number" ? S.pause : S.play;
            break;
        }
        if (handler) {
            preventDefault(e);
            handler();
        }
    }
    function load(changing) {
        listenKeys(false);
        var obj = S.getCurrent();
        var player = obj.player == "inline" ? "html" : obj.player;
        if (typeof S[player] != "function") {
            throw "unknown player " + player;
        }
        if (changing) {
            S.player.remove();
            S.revertOptions();
            S.applyOptions(obj.options || {});
        }
        S.player = new S[player](obj, S.playerId);
        if (S.gallery.length > 1) {
            var next = S.gallery[S.current + 1] || S.gallery[0];
            if (next.player == "img") {
                var a = new Image();
                a.src = next.content;
            }
            var prev = S.gallery[S.current - 1] || S.gallery[S.gallery.length - 1];
            if (prev.player == "img") {
                var b = new Image();
                b.src = prev.content;
            }
        }
        S.skin.onLoad(changing, waitReady);
    }
    function waitReady() {
        if (!open) {
            return;
        }
        if (typeof S.player.ready != "undefined") {
            var timer = setInterval(function() {
                if (open) {
                    if (S.player.ready) {
                        clearInterval(timer);
                        timer = null;
                        S.skin.onReady(show);
                    }
                } else {
                    clearInterval(timer);
                    timer = null;
                }
            }, 10);
        } else {
            S.skin.onReady(show);
        }
    }
    function show() {
        if (!open) {
            return;
        }
        S.player.append(S.skin.body, S.dimensions);
        S.skin.onShow(finish);
    }
    function finish() {
        if (!open) {
            return;
        }
        if (S.player.onLoad) {
            S.player.onLoad();
        }
        S.options.onFinish(S.getCurrent());
        if (!S.isPaused()) {
            S.play();
        }
        listenKeys(true);
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, from) {
            var len = this.length >>> 0;
            from = from || 0;
            if (from < 0) {
                from += len;
            }
            for (;from < len; ++from) {
                if (from in this && this[from] === obj) {
                    return from;
                }
            }
            return -1;
        };
    }
    function now() {
        return new Date().getTime();
    }
    function apply(original, extension) {
        for (var property in extension) {
            original[property] = extension[property];
        }
        return original;
    }
    function each(obj, callback) {
        var i = 0, len = obj.length;
        for (var value = obj[0]; i < len && callback.call(value, i, value) !== false; value = obj[++i]) {}
    }
    function sprintf(str, replace) {
        return str.replace(/\{(\w+?)\}/g, function(match, i) {
            return replace[i];
        });
    }
    function noop() {}
    function get(id) {
        return document.getElementById(id);
    }
    function remove(el) {
        el.parentNode.removeChild(el);
    }
    var supportsOpacity = true, supportsFixed = true;
    function checkSupport() {
        var body = document.body, div = document.createElement("div");
        supportsOpacity = typeof div.style.opacity === "string";
        div.style.position = "fixed";
        div.style.margin = 0;
        div.style.top = "20px";
        body.appendChild(div, body.firstChild);
        supportsFixed = div.offsetTop == 20;
        body.removeChild(div);
    }
    S.getStyle = function() {
        var opacity = /opacity=([^)]*)/, getComputedStyle = document.defaultView && document.defaultView.getComputedStyle;
        return function(el, style) {
            var ret;
            if (!supportsOpacity && style == "opacity" && el.currentStyle) {
                ret = opacity.test(el.currentStyle.filter || "") ? parseFloat(RegExp.$1) / 100 + "" : "";
                return ret === "" ? "1" : ret;
            }
            if (getComputedStyle) {
                var computedStyle = getComputedStyle(el, null);
                if (computedStyle) {
                    ret = computedStyle[style];
                }
                if (style == "opacity" && ret == "") {
                    ret = "1";
                }
            } else {
                ret = el.currentStyle[style];
            }
            return ret;
        };
    }();
    S.appendHTML = function(el, html) {
        if (el.insertAdjacentHTML) {
            el.insertAdjacentHTML("BeforeEnd", html);
        } else {
            if (el.lastChild) {
                var range = el.ownerDocument.createRange();
                range.setStartAfter(el.lastChild);
                var frag = range.createContextualFragment(html);
                el.appendChild(frag);
            } else {
                el.innerHTML = html;
            }
        }
    };
    S.getWindowSize = function(dimension) {
        if (document.compatMode === "CSS1Compat") {
            return document.documentElement["client" + dimension];
        }
        return document.body["client" + dimension];
    };
    S.setOpacity = function(el, opacity) {
        var style = el.style;
        if (supportsOpacity) {
            style.opacity = opacity == 1 ? "" : opacity;
        } else {
            style.zoom = 1;
            if (opacity == 1) {
                if (typeof style.filter == "string" && /alpha/i.test(style.filter)) {
                    style.filter = style.filter.replace(/\s*[\w\.]*alpha\([^\)]*\);?/gi, "");
                }
            } else {
                style.filter = (style.filter || "").replace(/\s*[\w\.]*alpha\([^\)]*\)/gi, "") + " alpha(opacity=" + opacity * 100 + ")";
            }
        }
    };
    S.clearOpacity = function(el) {
        S.setOpacity(el, 1);
    };
    function getTarget(e) {
        return e.target;
    }
    function getPageXY(e) {
        return [ e.pageX, e.pageY ];
    }
    function preventDefault(e) {
        e.preventDefault();
    }
    function keyCode(e) {
        return e.keyCode;
    }
    function addEvent(el, type, handler) {
        jQuery(el).bind(type, handler);
    }
    function removeEvent(el, type, handler) {
        jQuery(el).unbind(type, handler);
    }
    jQuery.fn.shadowbox = function(options) {
        return this.each(function() {
            var el = jQuery(this);
            var opts = jQuery.extend({}, options || {}, jQuery.metadata ? el.metadata() : jQuery.meta ? el.data() : {});
            var cls = this.className || "";
            opts.width = parseInt((cls.match(/w:(\d+)/) || [])[1]) || opts.width;
            opts.height = parseInt((cls.match(/h:(\d+)/) || [])[1]) || opts.height;
            Shadowbox.setup(el, opts);
        });
    };
    var loaded = false, DOMContentLoaded;
    if (document.addEventListener) {
        DOMContentLoaded = function() {
            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            S.load();
        };
    } else {
        if (document.attachEvent) {
            DOMContentLoaded = function() {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", DOMContentLoaded);
                    S.load();
                }
            };
        }
    }
    function doScrollCheck() {
        if (loaded) {
            return;
        }
        try {
            document.documentElement.doScroll("left");
        } catch (e) {
            setTimeout(doScrollCheck, 1);
            return;
        }
        S.load();
    }
    function bindLoad() {
        if (document.readyState === "complete") {
            return S.load();
        }
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
            window.addEventListener("load", S.load, false);
        } else {
            if (document.attachEvent) {
                document.attachEvent("onreadystatechange", DOMContentLoaded);
                window.attachEvent("onload", S.load);
                var topLevel = false;
                try {
                    topLevel = window.frameElement === null;
                } catch (e) {}
                if (document.documentElement.doScroll && topLevel) {
                    doScrollCheck();
                }
            }
        }
    }
    S.load = function() {
        if (loaded) {
            return;
        }
        if (!document.body) {
            return setTimeout(S.load, 13);
        }
        loaded = true;
        checkSupport();
        S.onReady();
        if (!S.options.skipSetup) {
            S.setup();
        }
        S.skin.init();
    };
    S.plugins = {};
    if (navigator.plugins && navigator.plugins.length) {
        var names = [];
        each(navigator.plugins, function(i, p) {
            names.push(p.name);
        });
        names = names.join(",");
        var f4m = names.indexOf("Flip4Mac") > -1;
        S.plugins = {
            fla: names.indexOf("Shockwave Flash") > -1,
            qt: names.indexOf("QuickTime") > -1,
            wmp: !f4m && names.indexOf("Windows Media") > -1,
            f4m: f4m
        };
    } else {
        var detectPlugin = function(name) {
            var axo;
            try {
                axo = new ActiveXObject(name);
            } catch (e) {}
            return !!axo;
        };
        S.plugins = {
            fla: detectPlugin("ShockwaveFlash.ShockwaveFlash"),
            qt: detectPlugin("QuickTime.QuickTime"),
            wmp: detectPlugin("wmplayer.ocx"),
            f4m: false
        };
    }
    var relAttr = /^(light|shadow)box/i, expando = "shadowboxCacheKey", cacheKey = 1;
    S.cache = {};
    S.select = function(selector) {
        var links = [];
        if (!selector) {
            var rel;
            each(document.getElementsByTagName("a"), function(i, el) {
                rel = el.getAttribute("rel");
                if (rel && relAttr.test(rel)) {
                    links.push(el);
                }
            });
        } else {
            var length = selector.length;
            if (length) {
                if (typeof selector == "string") {
                    if (S.find) {
                        links = S.find(selector);
                    }
                } else {
                    if (length == 2 && typeof selector[0] == "string" && selector[1].nodeType) {
                        if (S.find) {
                            links = S.find(selector[0], selector[1]);
                        }
                    } else {
                        for (var i = 0; i < length; ++i) {
                            links[i] = selector[i];
                        }
                    }
                }
            } else {
                links.push(selector);
            }
        }
        return links;
    };
    S.setup = function(selector, options) {
        each(S.select(selector), function(i, link) {
            S.addCache(link, options);
        });
    };
    S.teardown = function(selector) {
        each(S.select(selector), function(i, link) {
            S.removeCache(link);
        });
    };
    S.addCache = function(link, options) {
        var key = link[expando];
        if (key == undefined) {
            key = cacheKey++;
            link[expando] = key;
            addEvent(link, "click", handleClick);
        }
        S.cache[key] = S.makeObject(link, options);
    };
    S.removeCache = function(link) {
        removeEvent(link, "click", handleClick);
        delete S.cache[link[expando]];
        link[expando] = null;
    };
    S.getCache = function(link) {
        var key = link[expando];
        return key in S.cache && S.cache[key];
    };
    S.clearCache = function() {
        for (var key in S.cache) {
            S.removeCache(S.cache[key].link);
        }
        S.cache = {};
    };
    function handleClick(e) {
        S.open(this);
        if (S.gallery.length) {
            preventDefault(e);
        }
    }
    /*
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 *
 * Modified for inclusion in Shadowbox.js
 */
    S.find = function() {
        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, done = 0, toString = Object.prototype.toString, hasDuplicate = false, baseHasDuplicate = true;
        [ 0, 0 ].sort(function() {
            baseHasDuplicate = false;
            return 0;
        });
        var Sizzle = function(selector, context, results, seed) {
            results = results || [];
            var origContext = context = context || document;
            if (context.nodeType !== 1 && context.nodeType !== 9) {
                return [];
            }
            if (!selector || typeof selector !== "string") {
                return results;
            }
            var parts = [], m, set, checkSet, extra, prune = true, contextXML = isXML(context), soFar = selector;
            while ((chunker.exec(""), m = chunker.exec(soFar)) !== null) {
                soFar = m[3];
                parts.push(m[1]);
                if (m[2]) {
                    extra = m[3];
                    break;
                }
            }
            if (parts.length > 1 && origPOS.exec(selector)) {
                if (parts.length === 2 && Expr.relative[parts[0]]) {
                    set = posProcess(parts[0] + parts[1], context);
                } else {
                    set = Expr.relative[parts[0]] ? [ context ] : Sizzle(parts.shift(), context);
                    while (parts.length) {
                        selector = parts.shift();
                        if (Expr.relative[selector]) {
                            selector += parts.shift();
                        }
                        set = posProcess(selector, set);
                    }
                }
            } else {
                if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
                    var ret = Sizzle.find(parts.shift(), context, contextXML);
                    context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
                }
                if (context) {
                    var ret = seed ? {
                        expr: parts.pop(),
                        set: makeArray(seed)
                    } : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
                    set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
                    if (parts.length > 0) {
                        checkSet = makeArray(set);
                    } else {
                        prune = false;
                    }
                    while (parts.length) {
                        var cur = parts.pop(), pop = cur;
                        if (!Expr.relative[cur]) {
                            cur = "";
                        } else {
                            pop = parts.pop();
                        }
                        if (pop == null) {
                            pop = context;
                        }
                        Expr.relative[cur](checkSet, pop, contextXML);
                    }
                } else {
                    checkSet = parts = [];
                }
            }
            if (!checkSet) {
                checkSet = set;
            }
            if (!checkSet) {
                throw "Syntax error, unrecognized expression: " + (cur || selector);
            }
            if (toString.call(checkSet) === "[object Array]") {
                if (!prune) {
                    results.push.apply(results, checkSet);
                } else {
                    if (context && context.nodeType === 1) {
                        for (var i = 0; checkSet[i] != null; i++) {
                            if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i]))) {
                                results.push(set[i]);
                            }
                        }
                    } else {
                        for (var i = 0; checkSet[i] != null; i++) {
                            if (checkSet[i] && checkSet[i].nodeType === 1) {
                                results.push(set[i]);
                            }
                        }
                    }
                }
            } else {
                makeArray(checkSet, results);
            }
            if (extra) {
                Sizzle(extra, origContext, results, seed);
                Sizzle.uniqueSort(results);
            }
            return results;
        };
        Sizzle.uniqueSort = function(results) {
            if (sortOrder) {
                hasDuplicate = baseHasDuplicate;
                results.sort(sortOrder);
                if (hasDuplicate) {
                    for (var i = 1; i < results.length; i++) {
                        if (results[i] === results[i - 1]) {
                            results.splice(i--, 1);
                        }
                    }
                }
            }
            return results;
        };
        Sizzle.matches = function(expr, set) {
            return Sizzle(expr, null, null, set);
        };
        Sizzle.find = function(expr, context, isXML) {
            var set, match;
            if (!expr) {
                return [];
            }
            for (var i = 0, l = Expr.order.length; i < l; i++) {
                var type = Expr.order[i], match;
                if (match = Expr.leftMatch[type].exec(expr)) {
                    var left = match[1];
                    match.splice(1, 1);
                    if (left.substr(left.length - 1) !== "\\") {
                        match[1] = (match[1] || "").replace(/\\/g, "");
                        set = Expr.find[type](match, context, isXML);
                        if (set != null) {
                            expr = expr.replace(Expr.match[type], "");
                            break;
                        }
                    }
                }
            }
            if (!set) {
                set = context.getElementsByTagName("*");
            }
            return {
                set: set,
                expr: expr
            };
        };
        Sizzle.filter = function(expr, set, inplace, not) {
            var old = expr, result = [], curLoop = set, match, anyFound, isXMLFilter = set && set[0] && isXML(set[0]);
            while (expr && set.length) {
                for (var type in Expr.filter) {
                    if ((match = Expr.match[type].exec(expr)) != null) {
                        var filter = Expr.filter[type], found, item;
                        anyFound = false;
                        if (curLoop === result) {
                            result = [];
                        }
                        if (Expr.preFilter[type]) {
                            match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
                            if (!match) {
                                anyFound = found = true;
                            } else {
                                if (match === true) {
                                    continue;
                                }
                            }
                        }
                        if (match) {
                            for (var i = 0; (item = curLoop[i]) != null; i++) {
                                if (item) {
                                    found = filter(item, match, i, curLoop);
                                    var pass = not ^ !!found;
                                    if (inplace && found != null) {
                                        if (pass) {
                                            anyFound = true;
                                        } else {
                                            curLoop[i] = false;
                                        }
                                    } else {
                                        if (pass) {
                                            result.push(item);
                                            anyFound = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (found !== undefined) {
                            if (!inplace) {
                                curLoop = result;
                            }
                            expr = expr.replace(Expr.match[type], "");
                            if (!anyFound) {
                                return [];
                            }
                            break;
                        }
                    }
                }
                if (expr === old) {
                    if (anyFound == null) {
                        throw "Syntax error, unrecognized expression: " + expr;
                    } else {
                        break;
                    }
                }
                old = expr;
            }
            return curLoop;
        };
        var Expr = Sizzle.selectors = {
            order: [ "ID", "NAME", "TAG" ],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
            },
            leftMatch: {},
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },
            attrHandle: {
                href: function(elem) {
                    return elem.getAttribute("href");
                }
            },
            relative: {
                "+": function(checkSet, part) {
                    var isPartStr = typeof part === "string", isTag = isPartStr && !/\W/.test(part), isPartStrNotTag = isPartStr && !isTag;
                    if (isTag) {
                        part = part.toLowerCase();
                    }
                    for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                        if (elem = checkSet[i]) {
                            while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}
                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part;
                        }
                    }
                    if (isPartStrNotTag) {
                        Sizzle.filter(part, checkSet, true);
                    }
                },
                ">": function(checkSet, part) {
                    var isPartStr = typeof part === "string";
                    if (isPartStr && !/\W/.test(part)) {
                        part = part.toLowerCase();
                        for (var i = 0, l = checkSet.length; i < l; i++) {
                            var elem = checkSet[i];
                            if (elem) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                            }
                        }
                    } else {
                        for (var i = 0, l = checkSet.length; i < l; i++) {
                            var elem = checkSet[i];
                            if (elem) {
                                checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
                            }
                        }
                        if (isPartStr) {
                            Sizzle.filter(part, checkSet, true);
                        }
                    }
                },
                "": function(checkSet, part, isXML) {
                    var doneName = done++, checkFn = dirCheck;
                    if (typeof part === "string" && !/\W/.test(part)) {
                        var nodeCheck = part = part.toLowerCase();
                        checkFn = dirNodeCheck;
                    }
                    checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
                },
                "~": function(checkSet, part, isXML) {
                    var doneName = done++, checkFn = dirCheck;
                    if (typeof part === "string" && !/\W/.test(part)) {
                        var nodeCheck = part = part.toLowerCase();
                        checkFn = dirNodeCheck;
                    }
                    checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
                }
            },
            find: {
                ID: function(match, context, isXML) {
                    if (typeof context.getElementById !== "undefined" && !isXML) {
                        var m = context.getElementById(match[1]);
                        return m ? [ m ] : [];
                    }
                },
                NAME: function(match, context) {
                    if (typeof context.getElementsByName !== "undefined") {
                        var ret = [], results = context.getElementsByName(match[1]);
                        for (var i = 0, l = results.length; i < l; i++) {
                            if (results[i].getAttribute("name") === match[1]) {
                                ret.push(results[i]);
                            }
                        }
                        return ret.length === 0 ? null : ret;
                    }
                },
                TAG: function(match, context) {
                    return context.getElementsByTagName(match[1]);
                }
            },
            preFilter: {
                CLASS: function(match, curLoop, inplace, result, not, isXML) {
                    match = " " + match[1].replace(/\\/g, "") + " ";
                    if (isXML) {
                        return match;
                    }
                    for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
                        if (elem) {
                            if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0)) {
                                if (!inplace) {
                                    result.push(elem);
                                }
                            } else {
                                if (inplace) {
                                    curLoop[i] = false;
                                }
                            }
                        }
                    }
                    return false;
                },
                ID: function(match) {
                    return match[1].replace(/\\/g, "");
                },
                TAG: function(match, curLoop) {
                    return match[1].toLowerCase();
                },
                CHILD: function(match) {
                    if (match[1] === "nth") {
                        var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
                        match[2] = test[1] + (test[2] || 1) - 0;
                        match[3] = test[3] - 0;
                    }
                    match[0] = done++;
                    return match;
                },
                ATTR: function(match, curLoop, inplace, result, not, isXML) {
                    var name = match[1].replace(/\\/g, "");
                    if (!isXML && Expr.attrMap[name]) {
                        match[1] = Expr.attrMap[name];
                    }
                    if (match[2] === "~=") {
                        match[4] = " " + match[4] + " ";
                    }
                    return match;
                },
                PSEUDO: function(match, curLoop, inplace, result, not) {
                    if (match[1] === "not") {
                        if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                            match[3] = Sizzle(match[3], null, null, curLoop);
                        } else {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                            if (!inplace) {
                                result.push.apply(result, ret);
                            }
                            return false;
                        }
                    } else {
                        if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                            return true;
                        }
                    }
                    return match;
                },
                POS: function(match) {
                    match.unshift(true);
                    return match;
                }
            },
            filters: {
                enabled: function(elem) {
                    return elem.disabled === false && elem.type !== "hidden";
                },
                disabled: function(elem) {
                    return elem.disabled === true;
                },
                checked: function(elem) {
                    return elem.checked === true;
                },
                selected: function(elem) {
                    elem.parentNode.selectedIndex;
                    return elem.selected === true;
                },
                parent: function(elem) {
                    return !!elem.firstChild;
                },
                empty: function(elem) {
                    return !elem.firstChild;
                },
                has: function(elem, i, match) {
                    return !!Sizzle(match[3], elem).length;
                },
                header: function(elem) {
                    return /h\d/i.test(elem.nodeName);
                },
                text: function(elem) {
                    return "text" === elem.type;
                },
                radio: function(elem) {
                    return "radio" === elem.type;
                },
                checkbox: function(elem) {
                    return "checkbox" === elem.type;
                },
                file: function(elem) {
                    return "file" === elem.type;
                },
                password: function(elem) {
                    return "password" === elem.type;
                },
                submit: function(elem) {
                    return "submit" === elem.type;
                },
                image: function(elem) {
                    return "image" === elem.type;
                },
                reset: function(elem) {
                    return "reset" === elem.type;
                },
                button: function(elem) {
                    return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
                },
                input: function(elem) {
                    return /input|select|textarea|button/i.test(elem.nodeName);
                }
            },
            setFilters: {
                first: function(elem, i) {
                    return i === 0;
                },
                last: function(elem, i, match, array) {
                    return i === array.length - 1;
                },
                even: function(elem, i) {
                    return i % 2 === 0;
                },
                odd: function(elem, i) {
                    return i % 2 === 1;
                },
                lt: function(elem, i, match) {
                    return i < match[3] - 0;
                },
                gt: function(elem, i, match) {
                    return i > match[3] - 0;
                },
                nth: function(elem, i, match) {
                    return match[3] - 0 === i;
                },
                eq: function(elem, i, match) {
                    return match[3] - 0 === i;
                }
            },
            filter: {
                PSEUDO: function(elem, match, i, array) {
                    var name = match[1], filter = Expr.filters[name];
                    if (filter) {
                        return filter(elem, i, match, array);
                    } else {
                        if (name === "contains") {
                            return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
                        } else {
                            if (name === "not") {
                                var not = match[3];
                                for (var i = 0, l = not.length; i < l; i++) {
                                    if (not[i] === elem) {
                                        return false;
                                    }
                                }
                                return true;
                            } else {
                                throw "Syntax error, unrecognized expression: " + name;
                            }
                        }
                    }
                },
                CHILD: function(elem, match) {
                    var type = match[1], node = elem;
                    switch (type) {
                      case "only":
                      case "first":
                        while (node = node.previousSibling) {
                            if (node.nodeType === 1) {
                                return false;
                            }
                        }
                        if (type === "first") {
                            return true;
                        }
                        node = elem;

                      case "last":
                        while (node = node.nextSibling) {
                            if (node.nodeType === 1) {
                                return false;
                            }
                        }
                        return true;

                      case "nth":
                        var first = match[2], last = match[3];
                        if (first === 1 && last === 0) {
                            return true;
                        }
                        var doneName = match[0], parent = elem.parentNode;
                        if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                            var count = 0;
                            for (node = parent.firstChild; node; node = node.nextSibling) {
                                if (node.nodeType === 1) {
                                    node.nodeIndex = ++count;
                                }
                            }
                            parent.sizcache = doneName;
                        }
                        var diff = elem.nodeIndex - last;
                        if (first === 0) {
                            return diff === 0;
                        } else {
                            return diff % first === 0 && diff / first >= 0;
                        }
                    }
                },
                ID: function(elem, match) {
                    return elem.nodeType === 1 && elem.getAttribute("id") === match;
                },
                TAG: function(elem, match) {
                    return match === "*" && elem.nodeType === 1 || elem.nodeName.toLowerCase() === match;
                },
                CLASS: function(elem, match) {
                    return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
                },
                ATTR: function(elem, match) {
                    var name = match[1], result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name), value = result + "", type = match[2], check = match[4];
                    return result == null ? type === "!=" : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
                },
                POS: function(elem, match, i, array) {
                    var name = match[2], filter = Expr.setFilters[name];
                    if (filter) {
                        return filter(elem, i, match, array);
                    }
                }
            }
        };
        var origPOS = Expr.match.POS;
        for (var type in Expr.match) {
            Expr.match[type] = new RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source);
            Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source);
        }
        var makeArray = function(array, results) {
            array = Array.prototype.slice.call(array, 0);
            if (results) {
                results.push.apply(results, array);
                return results;
            }
            return array;
        };
        try {
            Array.prototype.slice.call(document.documentElement.childNodes, 0);
        } catch (e) {
            makeArray = function(array, results) {
                var ret = results || [];
                if (toString.call(array) === "[object Array]") {
                    Array.prototype.push.apply(ret, array);
                } else {
                    if (typeof array.length === "number") {
                        for (var i = 0, l = array.length; i < l; i++) {
                            ret.push(array[i]);
                        }
                    } else {
                        for (var i = 0; array[i]; i++) {
                            ret.push(array[i]);
                        }
                    }
                }
                return ret;
            };
        }
        var sortOrder;
        if (document.documentElement.compareDocumentPosition) {
            sortOrder = function(a, b) {
                if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                    if (a == b) {
                        hasDuplicate = true;
                    }
                    return a.compareDocumentPosition ? -1 : 1;
                }
                var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
                if (ret === 0) {
                    hasDuplicate = true;
                }
                return ret;
            };
        } else {
            if ("sourceIndex" in document.documentElement) {
                sortOrder = function(a, b) {
                    if (!a.sourceIndex || !b.sourceIndex) {
                        if (a == b) {
                            hasDuplicate = true;
                        }
                        return a.sourceIndex ? -1 : 1;
                    }
                    var ret = a.sourceIndex - b.sourceIndex;
                    if (ret === 0) {
                        hasDuplicate = true;
                    }
                    return ret;
                };
            } else {
                if (document.createRange) {
                    sortOrder = function(a, b) {
                        if (!a.ownerDocument || !b.ownerDocument) {
                            if (a == b) {
                                hasDuplicate = true;
                            }
                            return a.ownerDocument ? -1 : 1;
                        }
                        var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
                        aRange.setStart(a, 0);
                        aRange.setEnd(a, 0);
                        bRange.setStart(b, 0);
                        bRange.setEnd(b, 0);
                        var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
                        if (ret === 0) {
                            hasDuplicate = true;
                        }
                        return ret;
                    };
                }
            }
        }
        function getText(elems) {
            var ret = "", elem;
            for (var i = 0; elems[i]; i++) {
                elem = elems[i];
                if (elem.nodeType === 3 || elem.nodeType === 4) {
                    ret += elem.nodeValue;
                } else {
                    if (elem.nodeType !== 8) {
                        ret += getText(elem.childNodes);
                    }
                }
            }
            return ret;
        }
        (function() {
            var form = document.createElement("div"), id = "script" + new Date().getTime();
            form.innerHTML = "<a name='" + id + "'/>";
            var root = document.documentElement;
            root.insertBefore(form, root.firstChild);
            if (document.getElementById(id)) {
                Expr.find.ID = function(match, context, isXML) {
                    if (typeof context.getElementById !== "undefined" && !isXML) {
                        var m = context.getElementById(match[1]);
                        return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [ m ] : undefined : [];
                    }
                };
                Expr.filter.ID = function(elem, match) {
                    var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                    return elem.nodeType === 1 && node && node.nodeValue === match;
                };
            }
            root.removeChild(form);
            root = form = null;
        })();
        (function() {
            var div = document.createElement("div");
            div.appendChild(document.createComment(""));
            if (div.getElementsByTagName("*").length > 0) {
                Expr.find.TAG = function(match, context) {
                    var results = context.getElementsByTagName(match[1]);
                    if (match[1] === "*") {
                        var tmp = [];
                        for (var i = 0; results[i]; i++) {
                            if (results[i].nodeType === 1) {
                                tmp.push(results[i]);
                            }
                        }
                        results = tmp;
                    }
                    return results;
                };
            }
            div.innerHTML = "<a href='#'></a>";
            if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
                Expr.attrHandle.href = function(elem) {
                    return elem.getAttribute("href", 2);
                };
            }
            div = null;
        })();
        if (document.querySelectorAll) {
            (function() {
                var oldSizzle = Sizzle, div = document.createElement("div");
                div.innerHTML = "<p class='TEST'></p>";
                if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
                    return;
                }
                Sizzle = function(query, context, extra, seed) {
                    context = context || document;
                    if (!seed && context.nodeType === 9 && !isXML(context)) {
                        try {
                            return makeArray(context.querySelectorAll(query), extra);
                        } catch (e) {}
                    }
                    return oldSizzle(query, context, extra, seed);
                };
                for (var prop in oldSizzle) {
                    Sizzle[prop] = oldSizzle[prop];
                }
                div = null;
            })();
        }
        (function() {
            var div = document.createElement("div");
            div.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
                return;
            }
            div.lastChild.className = "e";
            if (div.getElementsByClassName("e").length === 1) {
                return;
            }
            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function(match, context, isXML) {
                if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                    return context.getElementsByClassName(match[1]);
                }
            };
            div = null;
        })();
        function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; i < l; i++) {
                var elem = checkSet[i];
                if (elem) {
                    elem = elem[dir];
                    var match = false;
                    while (elem) {
                        if (elem.sizcache === doneName) {
                            match = checkSet[elem.sizset];
                            break;
                        }
                        if (elem.nodeType === 1 && !isXML) {
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }
                        if (elem.nodeName.toLowerCase() === cur) {
                            match = elem;
                            break;
                        }
                        elem = elem[dir];
                    }
                    checkSet[i] = match;
                }
            }
        }
        function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; i < l; i++) {
                var elem = checkSet[i];
                if (elem) {
                    elem = elem[dir];
                    var match = false;
                    while (elem) {
                        if (elem.sizcache === doneName) {
                            match = checkSet[elem.sizset];
                            break;
                        }
                        if (elem.nodeType === 1) {
                            if (!isXML) {
                                elem.sizcache = doneName;
                                elem.sizset = i;
                            }
                            if (typeof cur !== "string") {
                                if (elem === cur) {
                                    match = true;
                                    break;
                                }
                            } else {
                                if (Sizzle.filter(cur, [ elem ]).length > 0) {
                                    match = elem;
                                    break;
                                }
                            }
                        }
                        elem = elem[dir];
                    }
                    checkSet[i] = match;
                }
            }
        }
        var contains = document.compareDocumentPosition ? function(a, b) {
            return a.compareDocumentPosition(b) & 16;
        } : function(a, b) {
            return a !== b && (a.contains ? a.contains(b) : true);
        };
        var isXML = function(elem) {
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };
        var posProcess = function(selector, context) {
            var tmpSet = [], later = "", match, root = context.nodeType ? [ context ] : context;
            while (match = Expr.match.PSEUDO.exec(selector)) {
                later += match[0];
                selector = selector.replace(Expr.match.PSEUDO, "");
            }
            selector = Expr.relative[selector] ? selector + "*" : selector;
            for (var i = 0, l = root.length; i < l; i++) {
                Sizzle(selector, root[i], tmpSet);
            }
            return Sizzle.filter(later, tmpSet);
        };
        return Sizzle;
    }();
    /*
 * SWFObject v2.1 <http://code.google.com/p/swfobject/>
 * Copyright (c) 2007-2008 Geoff Stearns, Michael Williams, and Bobby van der Sluis
 * This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 *
 * Modified for inclusion in Shadowbox.js
 */
    S.flash = function() {
        var swfobject = function() {
            var UNDEF = "undefined", OBJECT = "object", SHOCKWAVE_FLASH = "Shockwave Flash", SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash", FLASH_MIME_TYPE = "application/x-shockwave-flash", EXPRESS_INSTALL_ID = "SWFObjectExprInst", win = window, doc = document, nav = navigator, domLoadFnArr = [], regObjArr = [], objIdArr = [], listenersArr = [], script, timer = null, storedAltContent = null, storedAltContentId = null, isDomLoaded = false, isExpressInstallActive = false;
            var ua = function() {
                var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF, playerVersion = [ 0, 0, 0 ], d = null;
                if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
                    d = nav.plugins[SHOCKWAVE_FLASH].description;
                    if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) {
                        d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                        playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                        playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                        playerVersion[2] = /r/.test(d) ? parseInt(d.replace(/^.*r(.*)$/, "$1"), 10) : 0;
                    }
                } else {
                    if (typeof win.ActiveXObject != UNDEF) {
                        var a = null, fp6Crash = false;
                        try {
                            a = new ActiveXObject(SHOCKWAVE_FLASH_AX + ".7");
                        } catch (e) {
                            try {
                                a = new ActiveXObject(SHOCKWAVE_FLASH_AX + ".6");
                                playerVersion = [ 6, 0, 21 ];
                                a.AllowScriptAccess = "always";
                            } catch (e) {
                                if (playerVersion[0] == 6) {
                                    fp6Crash = true;
                                }
                            }
                            if (!fp6Crash) {
                                try {
                                    a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                                } catch (e) {}
                            }
                        }
                        if (!fp6Crash && a) {
                            try {
                                d = a.GetVariable("$version");
                                if (d) {
                                    d = d.split(" ")[1].split(",");
                                    playerVersion = [ parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10) ];
                                }
                            } catch (e) {}
                        }
                    }
                }
                var u = nav.userAgent.toLowerCase(), p = nav.platform.toLowerCase(), webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, ie = false, windows = p ? /win/.test(p) : /win/.test(u), mac = p ? /mac/.test(p) : /mac/.test(u);
                /*@cc_on
			ie = true;
			@if (@_win32)
				windows = true;
			@elif (@_mac)
				mac = true;
			@end
		@*/
                return {
                    w3cdom: w3cdom,
                    pv: playerVersion,
                    webkit: webkit,
                    ie: ie,
                    win: windows,
                    mac: mac
                };
            }();
            var onDomLoad = function() {
                if (!ua.w3cdom) {
                    return;
                }
                addDomLoadEvent(main);
                if (ua.ie && ua.win) {
                    try {
                        doc.write("<script id=__ie_ondomload defer=true src=//:></script>");
                        script = getElementById("__ie_ondomload");
                        if (script) {
                            addListener(script, "onreadystatechange", checkReadyState);
                        }
                    } catch (e) {}
                }
                if (ua.webkit && typeof doc.readyState != UNDEF) {
                    timer = setInterval(function() {
                        if (/loaded|complete/.test(doc.readyState)) {
                            callDomLoadFunctions();
                        }
                    }, 10);
                }
                if (typeof doc.addEventListener != UNDEF) {
                    doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, null);
                }
                addLoadEvent(callDomLoadFunctions);
            }();
            function checkReadyState() {
                if (script.readyState == "complete") {
                    script.parentNode.removeChild(script);
                    callDomLoadFunctions();
                }
            }
            function callDomLoadFunctions() {
                if (isDomLoaded) {
                    return;
                }
                if (ua.ie && ua.win) {
                    var s = createElement("span");
                    try {
                        var t = doc.getElementsByTagName("body")[0].appendChild(s);
                        t.parentNode.removeChild(t);
                    } catch (e) {
                        return;
                    }
                }
                isDomLoaded = true;
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
                var dl = domLoadFnArr.length;
                for (var i = 0; i < dl; i++) {
                    domLoadFnArr[i]();
                }
            }
            function addDomLoadEvent(fn) {
                if (isDomLoaded) {
                    fn();
                } else {
                    domLoadFnArr[domLoadFnArr.length] = fn;
                }
            }
            function addLoadEvent(fn) {
                if (typeof win.addEventListener != UNDEF) {
                    win.addEventListener("load", fn, false);
                } else {
                    if (typeof doc.addEventListener != UNDEF) {
                        doc.addEventListener("load", fn, false);
                    } else {
                        if (typeof win.attachEvent != UNDEF) {
                            addListener(win, "onload", fn);
                        } else {
                            if (typeof win.onload == "function") {
                                var fnOld = win.onload;
                                win.onload = function() {
                                    fnOld();
                                    fn();
                                };
                            } else {
                                win.onload = fn;
                            }
                        }
                    }
                }
            }
            function main() {
                var rl = regObjArr.length;
                for (var i = 0; i < rl; i++) {
                    var id = regObjArr[i].id;
                    if (ua.pv[0] > 0) {
                        var obj = getElementById(id);
                        if (obj) {
                            regObjArr[i].width = obj.getAttribute("width") ? obj.getAttribute("width") : "0";
                            regObjArr[i].height = obj.getAttribute("height") ? obj.getAttribute("height") : "0";
                            if (hasPlayerVersion(regObjArr[i].swfVersion)) {
                                if (ua.webkit && ua.webkit < 312) {
                                    fixParams(obj);
                                }
                                setVisibility(id, true);
                            } else {
                                if (regObjArr[i].expressInstall && !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac)) {
                                    showExpressInstall(regObjArr[i]);
                                } else {
                                    displayAltContent(obj);
                                }
                            }
                        }
                    } else {
                        setVisibility(id, true);
                    }
                }
            }
            function fixParams(obj) {
                var nestedObj = obj.getElementsByTagName(OBJECT)[0];
                if (nestedObj) {
                    var e = createElement("embed"), a = nestedObj.attributes;
                    if (a) {
                        var al = a.length;
                        for (var i = 0; i < al; i++) {
                            if (a[i].nodeName == "DATA") {
                                e.setAttribute("src", a[i].nodeValue);
                            } else {
                                e.setAttribute(a[i].nodeName, a[i].nodeValue);
                            }
                        }
                    }
                    var c = nestedObj.childNodes;
                    if (c) {
                        var cl = c.length;
                        for (var j = 0; j < cl; j++) {
                            if (c[j].nodeType == 1 && c[j].nodeName == "PARAM") {
                                e.setAttribute(c[j].getAttribute("name"), c[j].getAttribute("value"));
                            }
                        }
                    }
                    obj.parentNode.replaceChild(e, obj);
                }
            }
            function showExpressInstall(regObj) {
                isExpressInstallActive = true;
                var obj = getElementById(regObj.id);
                if (obj) {
                    if (regObj.altContentId) {
                        var ac = getElementById(regObj.altContentId);
                        if (ac) {
                            storedAltContent = ac;
                            storedAltContentId = regObj.altContentId;
                        }
                    } else {
                        storedAltContent = abstractAltContent(obj);
                    }
                    if (!/%$/.test(regObj.width) && parseInt(regObj.width, 10) < 310) {
                        regObj.width = "310";
                    }
                    if (!/%$/.test(regObj.height) && parseInt(regObj.height, 10) < 137) {
                        regObj.height = "137";
                    }
                    doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
                    var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn", dt = doc.title, fv = "MMredirectURL=" + win.location + "&MMplayerType=" + pt + "&MMdoctitle=" + dt, replaceId = regObj.id;
                    if (ua.ie && ua.win && obj.readyState != 4) {
                        var newObj = createElement("div");
                        replaceId += "SWFObjectNew";
                        newObj.setAttribute("id", replaceId);
                        obj.parentNode.insertBefore(newObj, obj);
                        obj.style.display = "none";
                        var fn = function() {
                            obj.parentNode.removeChild(obj);
                        };
                        addListener(win, "onload", fn);
                    }
                    createSWF({
                        data: regObj.expressInstall,
                        id: EXPRESS_INSTALL_ID,
                        width: regObj.width,
                        height: regObj.height
                    }, {
                        flashvars: fv
                    }, replaceId);
                }
            }
            function displayAltContent(obj) {
                if (ua.ie && ua.win && obj.readyState != 4) {
                    var el = createElement("div");
                    obj.parentNode.insertBefore(el, obj);
                    el.parentNode.replaceChild(abstractAltContent(obj), el);
                    obj.style.display = "none";
                    var fn = function() {
                        obj.parentNode.removeChild(obj);
                    };
                    addListener(win, "onload", fn);
                } else {
                    obj.parentNode.replaceChild(abstractAltContent(obj), obj);
                }
            }
            function abstractAltContent(obj) {
                var ac = createElement("div");
                if (ua.win && ua.ie) {
                    ac.innerHTML = obj.innerHTML;
                } else {
                    var nestedObj = obj.getElementsByTagName(OBJECT)[0];
                    if (nestedObj) {
                        var c = nestedObj.childNodes;
                        if (c) {
                            var cl = c.length;
                            for (var i = 0; i < cl; i++) {
                                if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
                                    ac.appendChild(c[i].cloneNode(true));
                                }
                            }
                        }
                    }
                }
                return ac;
            }
            function createSWF(attObj, parObj, id) {
                var r, el = getElementById(id);
                if (el) {
                    if (typeof attObj.id == UNDEF) {
                        attObj.id = id;
                    }
                    if (ua.ie && ua.win) {
                        var att = "";
                        for (var i in attObj) {
                            if (attObj[i] != Object.prototype[i]) {
                                if (i.toLowerCase() == "data") {
                                    parObj.movie = attObj[i];
                                } else {
                                    if (i.toLowerCase() == "styleclass") {
                                        att += ' class="' + attObj[i] + '"';
                                    } else {
                                        if (i.toLowerCase() != "classid") {
                                            att += " " + i + '="' + attObj[i] + '"';
                                        }
                                    }
                                }
                            }
                        }
                        var par = "";
                        for (var j in parObj) {
                            if (parObj[j] != Object.prototype[j]) {
                                par += '<param name="' + j + '" value="' + parObj[j] + '" />';
                            }
                        }
                        el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + ">" + par + "</object>";
                        objIdArr[objIdArr.length] = attObj.id;
                        r = getElementById(attObj.id);
                    } else {
                        if (ua.webkit && ua.webkit < 312) {
                            var e = createElement("embed");
                            e.setAttribute("type", FLASH_MIME_TYPE);
                            for (var k in attObj) {
                                if (attObj[k] != Object.prototype[k]) {
                                    if (k.toLowerCase() == "data") {
                                        e.setAttribute("src", attObj[k]);
                                    } else {
                                        if (k.toLowerCase() == "styleclass") {
                                            e.setAttribute("class", attObj[k]);
                                        } else {
                                            if (k.toLowerCase() != "classid") {
                                                e.setAttribute(k, attObj[k]);
                                            }
                                        }
                                    }
                                }
                            }
                            for (var l in parObj) {
                                if (parObj[l] != Object.prototype[l]) {
                                    if (l.toLowerCase() != "movie") {
                                        e.setAttribute(l, parObj[l]);
                                    }
                                }
                            }
                            el.parentNode.replaceChild(e, el);
                            r = e;
                        } else {
                            var o = createElement(OBJECT);
                            o.setAttribute("type", FLASH_MIME_TYPE);
                            for (var m in attObj) {
                                if (attObj[m] != Object.prototype[m]) {
                                    if (m.toLowerCase() == "styleclass") {
                                        o.setAttribute("class", attObj[m]);
                                    } else {
                                        if (m.toLowerCase() != "classid") {
                                            o.setAttribute(m, attObj[m]);
                                        }
                                    }
                                }
                            }
                            for (var n in parObj) {
                                if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") {
                                    createObjParam(o, n, parObj[n]);
                                }
                            }
                            el.parentNode.replaceChild(o, el);
                            r = o;
                        }
                    }
                }
                return r;
            }
            function createObjParam(el, pName, pValue) {
                var p = createElement("param");
                p.setAttribute("name", pName);
                p.setAttribute("value", pValue);
                el.appendChild(p);
            }
            function removeSWF(id) {
                var obj = getElementById(id);
                if (obj && (obj.nodeName == "OBJECT" || obj.nodeName == "EMBED")) {
                    if (ua.ie && ua.win) {
                        if (obj.readyState == 4) {
                            removeObjectInIE(id);
                        } else {
                            win.attachEvent("onload", function() {
                                removeObjectInIE(id);
                            });
                        }
                    } else {
                        obj.parentNode.removeChild(obj);
                    }
                }
            }
            function removeObjectInIE(id) {
                var obj = getElementById(id);
                if (obj) {
                    for (var i in obj) {
                        if (typeof obj[i] == "function") {
                            obj[i] = null;
                        }
                    }
                    obj.parentNode.removeChild(obj);
                }
            }
            function getElementById(id) {
                var el = null;
                try {
                    el = doc.getElementById(id);
                } catch (e) {}
                return el;
            }
            function createElement(el) {
                return doc.createElement(el);
            }
            function addListener(target, eventType, fn) {
                target.attachEvent(eventType, fn);
                listenersArr[listenersArr.length] = [ target, eventType, fn ];
            }
            function hasPlayerVersion(rv) {
                var pv = ua.pv, v = rv.split(".");
                v[0] = parseInt(v[0], 10);
                v[1] = parseInt(v[1], 10) || 0;
                v[2] = parseInt(v[2], 10) || 0;
                return pv[0] > v[0] || pv[0] == v[0] && pv[1] > v[1] || pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2] ? true : false;
            }
            function createCSS(sel, decl) {
                if (ua.ie && ua.mac) {
                    return;
                }
                var h = doc.getElementsByTagName("head")[0], s = createElement("style");
                s.setAttribute("type", "text/css");
                s.setAttribute("media", "screen");
                if (!(ua.ie && ua.win) && typeof doc.createTextNode != UNDEF) {
                    s.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
                }
                h.appendChild(s);
                if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
                    var ls = doc.styleSheets[doc.styleSheets.length - 1];
                    if (typeof ls.addRule == OBJECT) {
                        ls.addRule(sel, decl);
                    }
                }
            }
            function setVisibility(id, isVisible) {
                var v = isVisible ? "visible" : "hidden";
                if (isDomLoaded && getElementById(id)) {
                    getElementById(id).style.visibility = v;
                } else {
                    createCSS("#" + id, "visibility:" + v);
                }
            }
            function urlEncodeIfNecessary(s) {
                var regex = /[\\\"<>\.;]/;
                var hasBadChars = regex.exec(s) != null;
                return hasBadChars ? encodeURIComponent(s) : s;
            }
            var cleanup = function() {
                if (ua.ie && ua.win) {
                    window.attachEvent("onunload", function() {
                        var ll = listenersArr.length;
                        for (var i = 0; i < ll; i++) {
                            listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
                        }
                        var il = objIdArr.length;
                        for (var j = 0; j < il; j++) {
                            removeSWF(objIdArr[j]);
                        }
                        for (var k in ua) {
                            ua[k] = null;
                        }
                        ua = null;
                        for (var l in swfobject) {
                            swfobject[l] = null;
                        }
                        swfobject = null;
                    });
                }
            }();
            return {
                registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr) {
                    if (!ua.w3cdom || !objectIdStr || !swfVersionStr) {
                        return;
                    }
                    var regObj = {};
                    regObj.id = objectIdStr;
                    regObj.swfVersion = swfVersionStr;
                    regObj.expressInstall = xiSwfUrlStr ? xiSwfUrlStr : false;
                    regObjArr[regObjArr.length] = regObj;
                    setVisibility(objectIdStr, false);
                },
                getObjectById: function(objectIdStr) {
                    var r = null;
                    if (ua.w3cdom) {
                        var o = getElementById(objectIdStr);
                        if (o) {
                            var n = o.getElementsByTagName(OBJECT)[0];
                            if (!n || n && typeof o.SetVariable != UNDEF) {
                                r = o;
                            } else {
                                if (typeof n.SetVariable != UNDEF) {
                                    r = n;
                                }
                            }
                        }
                    }
                    return r;
                },
                embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj) {
                    if (!ua.w3cdom || !swfUrlStr || !replaceElemIdStr || !widthStr || !heightStr || !swfVersionStr) {
                        return;
                    }
                    widthStr += "";
                    heightStr += "";
                    if (hasPlayerVersion(swfVersionStr)) {
                        setVisibility(replaceElemIdStr, false);
                        var att = {};
                        if (attObj && typeof attObj === OBJECT) {
                            for (var i in attObj) {
                                if (attObj[i] != Object.prototype[i]) {
                                    att[i] = attObj[i];
                                }
                            }
                        }
                        att.data = swfUrlStr;
                        att.width = widthStr;
                        att.height = heightStr;
                        var par = {};
                        if (parObj && typeof parObj === OBJECT) {
                            for (var j in parObj) {
                                if (parObj[j] != Object.prototype[j]) {
                                    par[j] = parObj[j];
                                }
                            }
                        }
                        if (flashvarsObj && typeof flashvarsObj === OBJECT) {
                            for (var k in flashvarsObj) {
                                if (flashvarsObj[k] != Object.prototype[k]) {
                                    if (typeof par.flashvars != UNDEF) {
                                        par.flashvars += "&" + k + "=" + flashvarsObj[k];
                                    } else {
                                        par.flashvars = k + "=" + flashvarsObj[k];
                                    }
                                }
                            }
                        }
                        addDomLoadEvent(function() {
                            createSWF(att, par, replaceElemIdStr);
                            if (att.id == replaceElemIdStr) {
                                setVisibility(replaceElemIdStr, true);
                            }
                        });
                    } else {
                        if (xiSwfUrlStr && !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac)) {
                            isExpressInstallActive = true;
                            setVisibility(replaceElemIdStr, false);
                            addDomLoadEvent(function() {
                                var regObj = {};
                                regObj.id = regObj.altContentId = replaceElemIdStr;
                                regObj.width = widthStr;
                                regObj.height = heightStr;
                                regObj.expressInstall = xiSwfUrlStr;
                                showExpressInstall(regObj);
                            });
                        }
                    }
                },
                getFlashPlayerVersion: function() {
                    return {
                        major: ua.pv[0],
                        minor: ua.pv[1],
                        release: ua.pv[2]
                    };
                },
                hasFlashPlayerVersion: hasPlayerVersion,
                createSWF: function(attObj, parObj, replaceElemIdStr) {
                    if (ua.w3cdom) {
                        return createSWF(attObj, parObj, replaceElemIdStr);
                    } else {
                        return undefined;
                    }
                },
                removeSWF: function(objElemIdStr) {
                    if (ua.w3cdom) {
                        removeSWF(objElemIdStr);
                    }
                },
                createCSS: function(sel, decl) {
                    if (ua.w3cdom) {
                        createCSS(sel, decl);
                    }
                },
                addDomLoadEvent: addDomLoadEvent,
                addLoadEvent: addLoadEvent,
                getQueryParamValue: function(param) {
                    var q = doc.location.search || doc.location.hash;
                    if (param == null) {
                        return urlEncodeIfNecessary(q);
                    }
                    if (q) {
                        var pairs = q.substring(1).split("&");
                        for (var i = 0; i < pairs.length; i++) {
                            if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                                return urlEncodeIfNecessary(pairs[i].substring(pairs[i].indexOf("=") + 1));
                            }
                        }
                    }
                    return "";
                },
                expressInstallCallback: function() {
                    if (isExpressInstallActive && storedAltContent) {
                        var obj = getElementById(EXPRESS_INSTALL_ID);
                        if (obj) {
                            obj.parentNode.replaceChild(storedAltContent, obj);
                            if (storedAltContentId) {
                                setVisibility(storedAltContentId, true);
                                if (ua.ie && ua.win) {
                                    storedAltContent.style.display = "block";
                                }
                            }
                            storedAltContent = null;
                            storedAltContentId = null;
                            isExpressInstallActive = false;
                        }
                    }
                }
            };
        }();
        return swfobject;
    }();
    S.lang = {
        code: "en",
        of: "of",
        loading: "loading",
        cancel: "Cancel",
        next: "Next",
        previous: "Previous",
        play: "Play",
        pause: "Pause",
        close: "Close",
        errors: {
            single: 'You must install the <a href="{0}">{1}</a> browser plugin to view this content.',
            shared: 'You must install both the <a href="{0}">{1}</a> and <a href="{2}">{3}</a> browser plugins to view this content.',
            either: 'You must install either the <a href="{0}">{1}</a> or the <a href="{2}">{3}</a> browser plugin to view this content.'
        }
    };
    var pre, proxyId = "sb-drag-proxy", dragData, dragProxy, dragTarget;
    function resetDrag() {
        dragData = {
            x: 0,
            y: 0,
            startX: null,
            startY: null
        };
    }
    function updateProxy() {
        var dims = S.dimensions;
        apply(dragProxy.style, {
            height: dims.innerHeight + "px",
            width: dims.innerWidth + "px"
        });
    }
    function enableDrag() {
        resetDrag();
        var style = [ "position:absolute", "cursor:" + (S.isGecko ? "-moz-grab" : "move"), "background-color:" + (S.isIE ? "#fff;filter:alpha(opacity=0)" : "transparent") ].join(";");
        S.appendHTML(S.skin.body, '<div id="' + proxyId + '" style="' + style + '"></div>');
        dragProxy = get(proxyId);
        updateProxy();
        addEvent(dragProxy, "mousedown", startDrag);
    }
    function disableDrag() {
        if (dragProxy) {
            removeEvent(dragProxy, "mousedown", startDrag);
            remove(dragProxy);
            dragProxy = null;
        }
        dragTarget = null;
    }
    function startDrag(e) {
        preventDefault(e);
        var xy = getPageXY(e);
        dragData.startX = xy[0];
        dragData.startY = xy[1];
        dragTarget = get(S.player.id);
        addEvent(document, "mousemove", positionDrag);
        addEvent(document, "mouseup", endDrag);
        if (S.isGecko) {
            dragProxy.style.cursor = "-moz-grabbing";
        }
    }
    function positionDrag(e) {
        var player = S.player, dims = S.dimensions, xy = getPageXY(e);
        var moveX = xy[0] - dragData.startX;
        dragData.startX += moveX;
        dragData.x = Math.max(Math.min(0, dragData.x + moveX), dims.innerWidth - player.width);
        var moveY = xy[1] - dragData.startY;
        dragData.startY += moveY;
        dragData.y = Math.max(Math.min(0, dragData.y + moveY), dims.innerHeight - player.height);
        apply(dragTarget.style, {
            left: dragData.x + "px",
            top: dragData.y + "px"
        });
    }
    function endDrag() {
        removeEvent(document, "mousemove", positionDrag);
        removeEvent(document, "mouseup", endDrag);
        if (S.isGecko) {
            dragProxy.style.cursor = "-moz-grab";
        }
    }
    S.img = function(obj, id) {
        this.obj = obj;
        this.id = id;
        this.ready = false;
        var self = this;
        pre = new Image();
        pre.onload = function() {
            self.height = obj.height ? parseInt(obj.height, 10) : pre.height;
            self.width = obj.width ? parseInt(obj.width, 10) : pre.width;
            self.ready = true;
            pre.onload = null;
            pre = null;
        };
        pre.src = obj.content;
    };
    S.img.ext = [ "bmp", "gif", "jpg", "jpeg", "png" ];
    S.img.prototype = {
        append: function(body, dims) {
            var img = document.createElement("img");
            img.id = this.id;
            img.src = this.obj.content;
            img.style.position = "absolute";
            var height, width;
            if (dims.oversized && S.options.handleOversize == "resize") {
                height = dims.innerHeight;
                width = dims.innerWidth;
            } else {
                height = this.height;
                width = this.width;
            }
            img.setAttribute("height", height);
            img.setAttribute("width", width);
            body.appendChild(img);
        },
        remove: function() {
            var el = get(this.id);
            if (el) {
                remove(el);
            }
            disableDrag();
            if (pre) {
                pre.onload = null;
                pre = null;
            }
        },
        onLoad: function() {
            var dims = S.dimensions;
            if (dims.oversized && S.options.handleOversize == "drag") {
                enableDrag();
            }
        },
        onWindowResize: function() {
            var dims = S.dimensions;
            switch (S.options.handleOversize) {
              case "resize":
                var el = get(this.id);
                el.height = dims.innerHeight;
                el.width = dims.innerWidth;
                break;

              case "drag":
                if (dragTarget) {
                    var top = parseInt(S.getStyle(dragTarget, "top")), left = parseInt(S.getStyle(dragTarget, "left"));
                    if (top + this.height < dims.innerHeight) {
                        dragTarget.style.top = dims.innerHeight - this.height + "px";
                    }
                    if (left + this.width < dims.innerWidth) {
                        dragTarget.style.left = dims.innerWidth - this.width + "px";
                    }
                    updateProxy();
                }
                break;
            }
        }
    };
    S.iframe = function(obj, id) {
        this.obj = obj;
        this.id = id;
        var overlay = get("sb-overlay");
        this.height = obj.height ? parseInt(obj.height, 10) : overlay.offsetHeight;
        this.width = obj.width ? parseInt(obj.width, 10) : overlay.offsetWidth;
    };
    S.iframe.prototype = {
        append: function(body, dims) {
            var html = '<iframe id="' + this.id + '" name="' + this.id + '" height="100%" width="100%" frameborder="0" marginwidth="0" marginheight="0" style="visibility:hidden" onload="this.style.visibility=\'visible\'" scrolling="auto"';
            if (S.isIE) {
                html += ' allowtransparency="true"';
                if (S.isIE6) {
                    html += " src=\"javascript:false;document.write('');\"";
                }
            }
            html += "></iframe>";
            body.innerHTML = html;
        },
        remove: function() {
            var el = get(this.id);
            if (el) {
                remove(el);
                if (S.isGecko) {
                    delete window.frames[this.id];
                }
            }
        },
        onLoad: function() {
            var win = S.isIE ? get(this.id).contentWindow : window.frames[this.id];
            win.location.href = this.obj.content;
        }
    };
    S.html = function(obj, id) {
        this.obj = obj;
        this.id = id;
        this.height = obj.height ? parseInt(obj.height, 10) : 300;
        this.width = obj.width ? parseInt(obj.width, 10) : 500;
    };
    S.html.prototype = {
        append: function(body, dims) {
            var div = document.createElement("div");
            div.id = this.id;
            div.className = "html";
            div.innerHTML = this.obj.content;
            body.appendChild(div);
        },
        remove: function() {
            var el = get(this.id);
            if (el) {
                remove(el);
            }
        }
    };
    S.swf = function(obj, id) {
        this.obj = obj;
        this.id = id;
        this.height = obj.height ? parseInt(obj.height, 10) : 300;
        this.width = obj.width ? parseInt(obj.width, 10) : 300;
    };
    S.swf.ext = [ "swf" ];
    S.swf.prototype = {
        append: function(body, dims) {
            var tmp = document.createElement("div");
            tmp.id = this.id;
            body.appendChild(tmp);
            var height = dims.innerHeight, width = dims.innerWidth, swf = this.obj.content, version = S.options.flashVersion, express = S.path + "expressInstall.swf", flashvars = S.options.flashVars, params = S.options.flashParams;
            S.flash.embedSWF(swf, this.id, width, height, version, express, flashvars, params);
        },
        remove: function() {
            S.flash.expressInstallCallback();
            S.flash.removeSWF(this.id);
        },
        onWindowResize: function() {
            var dims = S.dimensions, el = get(this.id);
            el.height = dims.innerHeight;
            el.width = dims.innerWidth;
        }
    };
    var jwControllerHeight = 20;
    S.flv = function(obj, id) {
        this.obj = obj;
        this.id = id;
        this.height = obj.height ? parseInt(obj.height, 10) : 300;
        if (S.options.showMovieControls) {
            this.height += jwControllerHeight;
        }
        this.width = obj.width ? parseInt(obj.width, 10) : 300;
    };
    S.flv.ext = [ "flv", "m4v" ];
    S.flv.prototype = {
        append: function(body, dims) {
            var tmp = document.createElement("div");
            tmp.id = this.id;
            body.appendChild(tmp);
            var height = dims.innerHeight, width = dims.innerWidth, swf = S.path + "player.swf", version = S.options.flashVersion, express = S.path + "expressInstall.swf", flashvars = apply({
                file: this.obj.content,
                height: height,
                width: width,
                autostart: S.options.autoplayMovies ? "true" : "false",
                controlbar: S.options.showMovieControls ? "bottom" : "none",
                backcolor: "0x000000",
                frontcolor: "0xCCCCCC",
                lightcolor: "0x557722"
            }, S.options.flashVars), params = S.options.flashParams;
            S.flash.embedSWF(swf, this.id, width, height, version, express, flashvars, params);
        },
        remove: function() {
            S.flash.expressInstallCallback();
            S.flash.removeSWF(this.id);
        },
        onWindowResize: function() {
            var dims = S.dimensions, el = get(this.id);
            el.height = dims.innerHeight;
            el.width = dims.innerWidth;
        }
    };
    var qtControllerHeight = 16;
    S.qt = function(obj, id) {
        this.obj = obj;
        this.id = id;
        this.height = obj.height ? parseInt(obj.height, 10) : 300;
        if (S.options.showMovieControls) {
            this.height += qtControllerHeight;
        }
        this.width = obj.width ? parseInt(obj.width, 10) : 300;
    };
    S.qt.ext = [ "dv", "mov", "moov", "movie", "mp4", "avi", "mpg", "mpeg" ];
    S.qt.prototype = {
        append: function(body, dims) {
            var opt = S.options, autoplay = String(opt.autoplayMovies), controls = String(opt.showMovieControls);
            var html = "<object", movie = {
                id: this.id,
                name: this.id,
                height: this.height,
                width: this.width,
                kioskmode: "true"
            };
            if (S.isIE) {
                movie.classid = "clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B";
                movie.codebase = "http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0";
            } else {
                movie.type = "video/quicktime";
                movie.data = this.obj.content;
            }
            for (var m in movie) {
                html += " " + m + '="' + movie[m] + '"';
            }
            html += ">";
            var params = {
                src: this.obj.content,
                scale: "aspect",
                controller: controls,
                autoplay: autoplay
            };
            for (var p in params) {
                html += '<param name="' + p + '" value="' + params[p] + '">';
            }
            html += "</object>";
            body.innerHTML = html;
        },
        remove: function() {
            try {
                document[this.id].Stop();
            } catch (e) {}
            var el = get(this.id);
            if (el) {
                remove(el);
            }
        }
    };
    var wmpControllerHeight = S.isIE ? 70 : 45;
    S.wmp = function(obj, id) {
        this.obj = obj;
        this.id = id;
        this.height = obj.height ? parseInt(obj.height, 10) : 300;
        if (S.options.showMovieControls) {
            this.height += wmpControllerHeight;
        }
        this.width = obj.width ? parseInt(obj.width, 10) : 300;
    };
    S.wmp.ext = [ "asf", "avi", "mpg", "mpeg", "wm", "wmv" ];
    S.wmp.prototype = {
        append: function(body, dims) {
            var opt = S.options, autoplay = opt.autoplayMovies ? 1 : 0;
            var movie = '<object id="' + this.id + '" name="' + this.id + '" height="' + this.height + '" width="' + this.width + '"', params = {
                autostart: opt.autoplayMovies ? 1 : 0
            };
            if (S.isIE) {
                movie += ' classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6"';
                params.url = this.obj.content;
                params.uimode = opt.showMovieControls ? "full" : "none";
            } else {
                movie += ' type="video/x-ms-wmv"';
                movie += ' data="' + this.obj.content + '"';
                params.showcontrols = opt.showMovieControls ? 1 : 0;
            }
            movie += ">";
            for (var p in params) {
                movie += '<param name="' + p + '" value="' + params[p] + '">';
            }
            movie += "</object>";
            body.innerHTML = movie;
        },
        remove: function() {
            if (S.isIE) {
                try {
                    window[this.id].controls.stop();
                    window[this.id].URL = "movie" + now() + ".wmv";
                    window[this.id] = function() {};
                } catch (e) {}
            }
            var el = get(this.id);
            if (el) {
                setTimeout(function() {
                    remove(el);
                }, 10);
            }
        }
    };
    var overlayOn = false, visibilityCache = [], pngIds = [ "sb-nav-close", "sb-nav-next", "sb-nav-play", "sb-nav-pause", "sb-nav-previous" ], container, overlay, wrapper, doWindowResize = true;
    function animate(el, property, to, duration, callback) {
        var isOpacity = property == "opacity", anim = isOpacity ? S.setOpacity : function(el, value) {
            el.style[property] = "" + value + "px";
        };
        if (duration == 0 || !isOpacity && !S.options.animate || isOpacity && !S.options.animateFade) {
            anim(el, to);
            if (callback) {
                callback();
            }
            return;
        }
        var from = parseFloat(S.getStyle(el, property)) || 0;
        var delta = to - from;
        if (delta == 0) {
            if (callback) {
                callback();
            }
            return;
        }
        duration *= 1e3;
        var begin = now(), ease = S.ease, end = begin + duration, time;
        var interval = setInterval(function() {
            time = now();
            if (time >= end) {
                clearInterval(interval);
                interval = null;
                anim(el, to);
                if (callback) {
                    callback();
                }
            } else {
                anim(el, from + ease((time - begin) / duration) * delta);
            }
        }, 10);
    }
    function setSize() {
        container.style.height = S.getWindowSize("Height") + "px";
        container.style.width = S.getWindowSize("Width") + "px";
    }
    function setPosition() {
        container.style.top = document.documentElement.scrollTop + "px";
        container.style.left = document.documentElement.scrollLeft + "px";
    }
    function toggleTroubleElements(on) {
        if (on) {
            each(visibilityCache, function(i, el) {
                el[0].style.visibility = el[1] || "";
            });
        } else {
            visibilityCache = [];
            each(S.options.troubleElements, function(i, tag) {
                each(document.getElementsByTagName(tag), function(j, el) {
                    visibilityCache.push([ el, el.style.visibility ]);
                    el.style.visibility = "hidden";
                });
            });
        }
    }
    function toggleNav(id, on) {
        var el = get("sb-nav-" + id);
        if (el) {
            el.style.display = on ? "" : "none";
        }
    }
    function toggleLoading(on, callback) {
        var loading = get("sb-loading"), playerName = S.getCurrent().player, anim = playerName == "img" || playerName == "html";
        if (on) {
            S.setOpacity(loading, 0);
            loading.style.display = "block";
            var wrapped = function() {
                S.clearOpacity(loading);
                if (callback) {
                    callback();
                }
            };
            if (anim) {
                animate(loading, "opacity", 1, S.options.fadeDuration, wrapped);
            } else {
                wrapped();
            }
        } else {
            var wrapped = function() {
                loading.style.display = "none";
                S.clearOpacity(loading);
                if (callback) {
                    callback();
                }
            };
            if (anim) {
                animate(loading, "opacity", 0, S.options.fadeDuration, wrapped);
            } else {
                wrapped();
            }
        }
    }
    function buildBars(callback) {
        var obj = S.getCurrent();
        get("sb-title-inner").innerHTML = obj.title || "";
        var close, next, play, pause, previous;
        if (S.options.displayNav) {
            close = true;
            var len = S.gallery.length;
            if (len > 1) {
                if (S.options.continuous) {
                    next = previous = true;
                } else {
                    next = len - 1 > S.current;
                    previous = S.current > 0;
                }
            }
            if (S.options.slideshowDelay > 0 && S.hasNext()) {
                pause = !S.isPaused();
                play = !pause;
            }
        } else {
            close = next = play = pause = previous = false;
        }
        toggleNav("close", close);
        toggleNav("next", next);
        toggleNav("play", play);
        toggleNav("pause", pause);
        toggleNav("previous", previous);
        var counter = "";
        if (S.options.displayCounter && S.gallery.length > 1) {
            var len = S.gallery.length;
            if (S.options.counterType == "skip") {
                var i = 0, end = len, limit = parseInt(S.options.counterLimit) || 0;
                if (limit < len && limit > 2) {
                    var h = Math.floor(limit / 2);
                    i = S.current - h;
                    if (i < 0) {
                        i += len;
                    }
                    end = S.current + (limit - h);
                    if (end > len) {
                        end -= len;
                    }
                }
                while (i != end) {
                    if (i == len) {
                        i = 0;
                    }
                    counter += '<a onclick="Shadowbox.change(' + i + ');"';
                    if (i == S.current) {
                        counter += ' class="sb-counter-current"';
                    }
                    counter += ">" + ++i + "</a>";
                }
            } else {
                counter = [ S.current + 1, S.lang.of, len ].join(" ");
            }
        }
        get("sb-counter").innerHTML = counter;
        callback();
    }
    function showBars(callback) {
        var titleInner = get("sb-title-inner"), infoInner = get("sb-info-inner"), duration = .35;
        titleInner.style.visibility = infoInner.style.visibility = "";
        if (titleInner.innerHTML != "") {
            animate(titleInner, "marginTop", 0, duration);
        }
        animate(infoInner, "marginTop", 0, duration, callback);
    }
    function hideBars(anim, callback) {
        var title = get("sb-title"), info = get("sb-info"), titleHeight = title.offsetHeight, infoHeight = info.offsetHeight, titleInner = get("sb-title-inner"), infoInner = get("sb-info-inner"), duration = anim ? .35 : 0;
        animate(titleInner, "marginTop", titleHeight, duration);
        animate(infoInner, "marginTop", infoHeight * -1, duration, function() {
            titleInner.style.visibility = infoInner.style.visibility = "hidden";
            callback();
        });
    }
    function adjustHeight(height, top, anim, callback) {
        var wrapperInner = get("sb-wrapper-inner"), duration = anim ? S.options.resizeDuration : 0;
        animate(wrapper, "top", top, duration);
        animate(wrapperInner, "height", height, duration, callback);
    }
    function adjustWidth(width, left, anim, callback) {
        var duration = anim ? S.options.resizeDuration : 0;
        animate(wrapper, "left", left, duration);
        animate(wrapper, "width", width, duration, callback);
    }
    function setDimensions(height, width) {
        var bodyInner = get("sb-body-inner"), height = parseInt(height), width = parseInt(width), topBottom = wrapper.offsetHeight - bodyInner.offsetHeight, leftRight = wrapper.offsetWidth - bodyInner.offsetWidth, maxHeight = overlay.offsetHeight, maxWidth = overlay.offsetWidth, padding = parseInt(S.options.viewportPadding) || 20, preserveAspect = S.player && S.options.handleOversize != "drag";
        return S.setDimensions(height, width, maxHeight, maxWidth, topBottom, leftRight, padding, preserveAspect);
    }
    var K = {};
    K.markup = '<div id="sb-container"><div id="sb-overlay"></div><div id="sb-wrapper"><div id="sb-title"><div id="sb-title-inner"></div></div><div id="sb-wrapper-inner"><div id="sb-body"><div id="sb-body-inner"></div><div id="sb-loading"><div id="sb-loading-inner"><span>{loading}</span></div></div></div></div><div id="sb-info"><div id="sb-info-inner"><div id="sb-counter"></div><div id="sb-nav"><a id="sb-nav-close" title="{close}" onclick="Shadowbox.close()"></a><a id="sb-nav-next" title="{next}" onclick="Shadowbox.next()"></a><a id="sb-nav-play" title="{play}" onclick="Shadowbox.play()"></a><a id="sb-nav-pause" title="{pause}" onclick="Shadowbox.pause()"></a><a id="sb-nav-previous" title="{previous}" onclick="Shadowbox.previous()"></a></div></div></div></div></div>';
    K.options = {
        animSequence: "sync",
        counterLimit: 10,
        counterType: "default",
        displayCounter: true,
        displayNav: true,
        fadeDuration: .35,
        initialHeight: 160,
        initialWidth: 320,
        modal: false,
        overlayColor: "#000",
        overlayOpacity: .5,
        resizeDuration: .35,
        showOverlay: true,
        troubleElements: [ "select", "object", "embed", "canvas" ]
    };
    K.init = function() {
        S.appendHTML(document.body, sprintf(K.markup, S.lang));
        K.body = get("sb-body-inner");
        container = get("sb-container");
        overlay = get("sb-overlay");
        wrapper = get("sb-wrapper");
        if (!supportsFixed) {
            container.style.position = "absolute";
        }
        if (!supportsOpacity) {
            var el, m, re = /url\("(.*\.png)"\)/;
            each(pngIds, function(i, id) {
                el = get(id);
                if (el) {
                    m = S.getStyle(el, "backgroundImage").match(re);
                    if (m) {
                        el.style.backgroundImage = "none";
                        el.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src=" + m[1] + ",sizingMethod=scale);";
                    }
                }
            });
        }
        var timer;
        addEvent(window, "resize", function() {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            if (open) {
                timer = setTimeout(K.onWindowResize, 10);
            }
        });
    };
    K.onOpen = function(obj, callback) {
        doWindowResize = false;
        container.style.display = "block";
        setSize();
        var dims = setDimensions(S.options.initialHeight, S.options.initialWidth);
        adjustHeight(dims.innerHeight, dims.top);
        adjustWidth(dims.width, dims.left);
        if (S.options.showOverlay) {
            overlay.style.backgroundColor = S.options.overlayColor;
            S.setOpacity(overlay, 0);
            if (!S.options.modal) {
                addEvent(overlay, "click", S.close);
            }
            overlayOn = true;
        }
        if (!supportsFixed) {
            setPosition();
            addEvent(window, "scroll", setPosition);
        }
        toggleTroubleElements();
        container.style.visibility = "visible";
        if (overlayOn) {
            animate(overlay, "opacity", S.options.overlayOpacity, S.options.fadeDuration, callback);
        } else {
            callback();
        }
    };
    K.onLoad = function(changing, callback) {
        toggleLoading(true);
        while (K.body.firstChild) {
            remove(K.body.firstChild);
        }
        hideBars(changing, function() {
            if (!open) {
                return;
            }
            if (!changing) {
                wrapper.style.visibility = "visible";
            }
            buildBars(callback);
        });
    };
    K.onReady = function(callback) {
        if (!open) {
            return;
        }
        var player = S.player, dims = setDimensions(player.height, player.width);
        var wrapped = function() {
            showBars(callback);
        };
        switch (S.options.animSequence) {
          case "hw":
            adjustHeight(dims.innerHeight, dims.top, true, function() {
                adjustWidth(dims.width, dims.left, true, wrapped);
            });
            break;

          case "wh":
            adjustWidth(dims.width, dims.left, true, function() {
                adjustHeight(dims.innerHeight, dims.top, true, wrapped);
            });
            break;

          default:
            adjustWidth(dims.width, dims.left, true);
            adjustHeight(dims.innerHeight, dims.top, true, wrapped);
        }
    };
    K.onShow = function(callback) {
        toggleLoading(false, callback);
        doWindowResize = true;
    };
    K.onClose = function() {
        if (!supportsFixed) {
            removeEvent(window, "scroll", setPosition);
        }
        removeEvent(overlay, "click", S.close);
        wrapper.style.visibility = "hidden";
        var callback = function() {
            container.style.visibility = "hidden";
            container.style.display = "none";
            toggleTroubleElements(true);
        };
        if (overlayOn) {
            animate(overlay, "opacity", 0, S.options.fadeDuration, callback);
        } else {
            callback();
        }
    };
    K.onPlay = function() {
        toggleNav("play", false);
        toggleNav("pause", true);
    };
    K.onPause = function() {
        toggleNav("pause", false);
        toggleNav("play", true);
    };
    K.onWindowResize = function() {
        if (!doWindowResize) {
            return;
        }
        setSize();
        var player = S.player, dims = setDimensions(player.height, player.width);
        adjustWidth(dims.width, dims.left);
        adjustHeight(dims.innerHeight, dims.top);
        if (player.onWindowResize) {
            player.onWindowResize();
        }
    };
    S.skin = K;
    window.Shadowbox = S;
})(window);

$(document).ready(function() {
    $("body").removeClass("no-js");
    $("body").addClass("js-enabled");
    fancyForms();
    footerFixes();
    jQuery(".hori-nav").superfish({
        speed: "fast"
    });
});

/*
	Clear default form values
*/
function fancyForms() {
    // add remove default form values
    $("form input[type=text], form textarea").each(function() {
        var val = $(this).val();
        $(this).focus(function() {
            if ($(this).val() == val) {
                $(this).val("");
            }
        });
        $(this).blur(function() {
            if ($(this).val() == "") {
                $(this).val(val);
            }
        });
    });
}

/*
	various fixes for the footer section
*/
function footerFixes() {
    // allow static text added in WP menu to be treated as such
    $("#footer-nav a").each(function(e) {
        if ($(this).attr("href") == undefined) {
            $(this).addClass("no-decoration");
        }
    });
    // hide the footer nav last pipe ( | ) for ie
    $("#footer-nav li:last-child span").hide();
}

// Content Toggle
jQuery(function($) {
    // Initial state of toggle (hide)
    $(".slide_toggle_content").hide();
    // Process Toggle click (http://api.jquery.com/toggle/)
    $(".slide_toggle").toggle(function() {
        $(this).addClass("clicked");
    }, function() {
        $(this).removeClass("clicked");
    });
    // Toggle animation (http://api.jquery.com/slideToggle/)
    $(".slide_toggle").click(function() {
        $(this).prev(".slide_toggle_content").slideToggle();
    });
});

// Tabs code
jQuery(function($) {
    $("ul.tabs > li > a").click(function(e) {
        //Get Location of tab's content
        var contentLocation = $(this).attr("href");
        //Let go if not a hashed one
        if (contentLocation.charAt(0) == "#") {
            e.preventDefault();
            //Make Tab Active
            $(this).parent().siblings().children("a").removeClass("active");
            $(this).addClass("active");
            //Show Tab Content & add active class
            $(contentLocation).show().addClass("active").siblings().hide().removeClass("active");
        }
    });
});