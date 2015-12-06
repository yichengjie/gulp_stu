/*!
 * tui核心基础组件
 * 2013-12-03 增加了isMobile方法，用于判断浏览器是否在ios的移动端
 */

define(function(require, exports, module) {
(function(a, d) {
	a.tui = a.tui || {};
	if (a.tui.version) {
		return "1.5.0"
	}
	if (!window.console) {
		window.console = {
			log : function(f) {
				return
			},
			warn : function(f) {
				return
			}
		}
	}
	a.extend(a.tui, {
		version : "1.5.0",
		keyCode : {
			ALT : 18,
			BACKSPACE : 8,
			CAPS_LOCK : 20,
			COMMA : 188,
			COMMAND : 91,
			COMMAND_LEFT : 91,
			COMMAND_RIGHT : 93,
			CONTROL : 17,
			DELETE : 46,
			DOWN : 40,
			END : 35,
			ENTER : 13,
			ESCAPE : 27,
			HOME : 36,
			INSERT : 45,
			LEFT : 37,
			MENU : 93,
			NUMPAD_ADD : 107,
			NUMPAD_DECIMAL : 110,
			NUMPAD_DIVIDE : 111,
			NUMPAD_ENTER : 108,
			NUMPAD_MULTIPLY : 106,
			NUMPAD_SUBTRACT : 109,
			PAGE_DOWN : 34,
			PAGE_UP : 33,
			PERIOD : 190,
			RIGHT : 39,
			SHIFT : 16,
			SPACE : 32,
			TAB : 9,
			UP : 38,
			WINDOWS : 91
		}
	});
	a.fn
			.extend({
				_tuifocus : a.fn.focus,
				tuiFocus : function(e, f) {
					return typeof e === "number" ? this.each(function() {
						var g = this;
						setTimeout(function() {
							a(g).focus();
							if (f) {
								f.call(g)
							}
						}, e)
					}) : this._tuifocus.apply(this, arguments)
				},
				tuiScrollParent : function() {
					var e;
					if ((a.browser.msie && (/(static|relative)/).test(this
							.css("position")))
							|| (/absolute/).test(this.css("position"))) {
						e = this.parents().filter(
								function() {
									return (/(relative|absolute|fixed)/).test(a
											.curCSS(this, "position", 1))
											&& (/(auto|scroll)/).test(a.curCSS(
													this, "overflow", 1)
													+ a.curCSS(this,
															"overflow-y", 1)
													+ a.curCSS(this,
															"overflow-x", 1))
								}).eq(0)
					} else {
						e = this.parents().filter(
								function() {
									return (/(auto|scroll)/).test(a.curCSS(
											this, "overflow", 1)
											+ a.curCSS(this, "overflow-y", 1)
											+ a.curCSS(this, "overflow-x", 1))
								}).eq(0)
					}
					return (/fixed/).test(this.css("position")) || !e.length ? a(document)
							: e
				},
				tuiZIndex : function(h) {
					if (h !== d) {
						return this.css("zIndex", h)
					}
					if (this.length) {
						var f = a(this[0]), e, g;
						while (f.length && f[0] !== document) {
							e = f.css("position");
							if (e === "absolute" || e === "relative"
									|| e === "fixed") {
								g = parseInt(f.css("zIndex"), 10);
								if (!isNaN(g) && g !== 0) {
									return g
								}
							}
							f = f.parent()
						}
					}
					return 0
				},
				tuiDisableSelection : function() {
					return this.bind((a.support.selectstart ? "selectstart"
							: "mousedown")
							+ ".tui-disableSelection", function(e) {
						e.preventDefault()
					})
				},
				tuiEnableSelection : function() {
					return this.unbind(".tui-disableSelection")
				}
			});
	a.each([ "Width", "Height" ],
			function(g, e) {
				var f = e === "Width" ? [ "Left", "Right" ]
						: [ "Top", "Bottom" ], h = e.toLowerCase(), k = {
					innerWidth : a.fn.innerWidth,
					innerHeight : a.fn.innerHeight,
					outerWidth : a.fn.outerWidth,
					outerHeight : a.fn.outerHeight
				};
				function j(m, l, i, n) {
					a.each(f,
							function() {
								l -= parseFloat(a.curCSS(m, "padding" + this,
										true)) || 0;
								if (i) {
									l -= parseFloat(a.curCSS(m, "border" + this
											+ "Width", true)) || 0
								}
								if (n) {
									l -= parseFloat(a.curCSS(m,
											"margin" + this, true)) || 0
								}
							});
					return l
				}
				a.fn["tuiInner" + e] = function(i) {
					if (i === d) {
						return k["inner" + e].call(this)
					}
					return this.each(function() {
						a(this).css(h, j(this, i) + "px")
					})
				};
				a.fn["tuiOuter" + e] = function(i, l) {
					if (typeof i !== "number") {
						return k["outer" + e].call(this, i)
					}
					return this.each(function() {
						a(this).css(h, j(this, i, true, l) + "px")
					})
				}
			});
	function c(g, e) {
		var j = g.nodeName.toLowerCase();
		if ("area" === j) {
			var i = g.parentNode, h = i.name, f;
			if (!g.href || !h || i.nodeName.toLowerCase() !== "map") {
				return false
			}
			f = a("img[usemap=#" + h + "]")[0];
			return !!f && b(f)
		}
		return (/input|select|textarea|button|object/.test(j) ? !g.disabled
				: "a" == j ? g.href || e : e)
				&& b(g)
	}
	function b(e) {
		return !a(e).parents().andSelf().filter(
				function() {
					return a.curCSS(this, "visibility") === "hidden"
							|| a.expr.filters.hidden(this)
				}).length
	}
	a.extend(a.expr[":"], {
		data : function(g, f, e) {
			return !!a.data(g, e[3])
		},
		focusable : function(e) {
			return c(e, !isNaN(a.attr(e, "tabindex")))
		},
		tabbable : function(g) {
			var e = a.attr(g, "tabindex"), f = isNaN(e);
			return (f || e >= 0) && c(g, !f)
		}
	});
	a(function() {
		var e = document.body, f = e.appendChild(f = document
				.createElement("div"));
		f.offsetHeight;
		a.extend(f.style, {
			minHeight : "100px",
			height : "auto",
			padding : 0,
			borderWidth : 0
		});
		a.support.minHeight = f.offsetHeight === 100;
		a.support.selectstart = "onselectstart" in f;
		e.removeChild(f).style.display = "none"
	});
	a.extend(a.tui, {
		isIE : function() {
			return /MSIE (\d)\./i.test(navigator.userAgent)
		},
		isIE6 : function() {
			return /MSIE (\d)\./i.test(navigator.userAgent)
					&& parseInt(RegExp.$1) == 6
		},
		isIE7 : function() {
			return /MSIE (\d)\./i.test(navigator.userAgent)
					&& parseInt(RegExp.$1) == 7
		},
		isIE8 : function() {
			return /MSIE (\d)\./i.test(navigator.userAgent)
					&& parseInt(RegExp.$1) == 8
		},
		isIE9 : function() {
			return /MSIE (\d)\./i.test(navigator.userAgent)
					&& parseInt(RegExp.$1) == 9
		},
		isIE678 : function() {
			return /MSIE (\d)\./i.test(navigator.userAgent)
					&& parseInt(RegExp.$1) < 9
		},
		isFirefox : function() {
			return /firefox\/([\d.]+)/i.test(navigator.userAgent)
		},
		isChrome : function() {
			return /chrome\/([\d.]+)/i.test(navigator.userAgent)
		},
		isSafari : function() {
			return /safari\/([\d.]+)/i.test(navigator.userAgent)
		},
		isMobile : function() {
			return /ipad|ipod|itouch|iphone/i.test(navigator.userAgent
					.toLowerCase()) ? true : false
		},
		showMask : function(k, m, n, f, h, e, g, l) {
			var i = a(document);
			var o;
			if (a("#" + k).length < 1) {
				var j = '<div id="' + k + '"style="position:absolute;z-index:'
						+ m + ";top:" + n + "px;left:" + f + 'px;"></div>';
				o = a(j).appendTo(h);
				if (l) {
					o.addClass(l)
				}
			} else {
				o = a("#" + k)
			}
			o.css({
				width : i.width() + "px",
				height : i.height() + "px"
			});
			o.show();
			a("#" + k).off(e).on(e, g);
			return o
		}
	})
})(jQuery);

});