define(function(require, exports, module) {
(function() {
	$.fn.tuiOffDrag = function() {
		var a = $(this);
		return a.off(".tuiDrag").css({
			cursor : "default"
		})
	};
	$.fn.tuiDrag = function() {
		var j = this;
		var g = {
			handle : null,
			cursor : "move",
			isFixed : false,
			dragRange : "auto",
			dragableRangeX : [ 0, 1000 ],
			dragableRangeY : [ 0, 1000 ],
			onReadyDrag : null,
			onStartDrag : null,
			onDrop : null,
			onDraging : null,
			onFinshed : null,
			zIndex : 11005,
			proxy : null,
			revert : false,
			revertTime : 300,
			disabled : false
		};
		var d = $.browser.msie ? true : false;
		var e = (parseInt($.browser.version) <= 6 && d) ? true : false;
		if (arguments.length >= 1 && typeof (arguments[0]) === "string"
				&& this.length == 1) {
			if (arguments.length == 2) {
				var l = arguments[1];
				var k = arguments[0];
				var h = this.data("dragOption");
				switch (k) {
				case "dragableRangeX":
					if (!h) {
						return
					}
					var n = l[0] || 0;
					var c = l[1] || 0;
					c = (c >= n) ? c : n;
					h.dragableRangeX = [ n, c ];
					h.dragRange = "default";
					$(this).data("dragOption", h);
					return this;
				case "dragableRangeY":
					if (!h) {
						return
					}
					var m = l[0] || 0;
					var b = l[1] || 0;
					b = (b >= m) ? b : m;
					h.dragableRangeY = [ m, b ];
					h.dragRange = "default";
					$(this).data("dragOption", h);
					return this;
				case "dragRange":
					if (!h) {
						return
					}
					if (l == "auto") {
						h.dragRange = "auto";
						$(this).data("dragOption", h);
						return this
					}
					return this;
				case "disabled":
					if (!h) {
						return
					}
					var a = (h.handle instanceof jQuery) ? h.handle
							: $(h.handle);
					if (l) {
						a.css({
							cursor : "auto"
						});
						h.disabled = true;
						$(this).data("dragOption", h)
					} else {
						a.css({
							cursor : h.cursor
						});
						h.disabled = false;
						$(this).data("dragOption", h)
					}
					return this;
				case "revert":
					if (!h) {
						return
					}
					var h = this.data("dragOption");
					h.revert = l;
					$(this).data("dragOption", h);
					return this
				}
			}
		}
		var h = $.extend({}, g);
		for ( var f = 0; f < arguments.length; f++) {
			h = $.extend(h, arguments[f])
		}
		this.data("dragOption", h);
		return this
				.each(function() {
					var u = $(this);
					var q;
					var i = {};
					var y;
					var B;
					var A;
					var t;
					var r;
					var s = 0;
					var p = 0;
					var o;
					if (h.handle == null) {
						q = u
					} else {
						q = (h.handle instanceof jQuery) ? h.handle
								: $(h.handle)
					}
					var v = $(document);
					q.off("mousedown.tuiDrag").on("mousedown.tuiDrag",
							function(D) {
								D.stopPropagation();
								h = u.data("dragOption");
								var C = h.disabled;
								if (C) {
									return
								}
								z(D);
								if (typeof (h.onStartDrag) === "function") {
									h.onStartDrag.call(u)
								}
							});
					h.disabled ? "" : q.css({
						cursor : h.cursor
					});
					function z(H) {
						if (typeof (h.onReadyDrag) === "function") {
							h.onReadyDrag.call(u, H)
						}
						if (u.css("position") != "fixed"
								&& u.css("position") != "absolute"
								&& u.css("position") != "relative") {
							u.css({
								position : "absolute"
							})
						}
						h = u.data("dragOption");
						if (h.dragRange == "auto") {
							if (u.css("position") == "fixed") {
								t = $(window).width() - u.width() - 4;
								r = $(window).height() - u.height() - 4
							} else {
								if (h.isFixed && e) {
									t = $(window).width()
											+ $(document).scrollLeft()
											- u.width() - 4;
									r = $(window).height()
											+ $(document).scrollTop()
											- u.height() - 4
								} else {
									t = $(document).width() - u.width();
									r = $(document).height() - u.height()
								}
							}
							B = 0;
							A = 0
						} else {
							B = h.dragableRangeX[0] || 0;
							A = h.dragableRangeY[0] || 0;
							t = h.dragableRangeX[1] || 0;
							r = h.dragableRangeY[1] || 0;
							t = (t >= B) ? t : B;
							r = (r >= A) ? r : A
						}
						H.preventDefault ? H.preventDefault()
								: H.returnValue = false;
						i.ox = H.pageX;
						i.oy = H.pageY;
						i.dragTop = parseInt(u.position().top);
						i.dragLeft = parseInt(u.position().left);
						s = i.dragLeft;
						p = i.dragTop;
						if ($("#tuiDragMask").length < 1) {
							var C = '<div id="tuiDragMask" style="position:absolute;z-index:'
									+ h.zIndex + ';top:0px;left:0px;"><div>';
							y = $(C).appendTo("body")
						} else {
							y = $("#tuiDragMask")
						}
						y.css({
							width : $(document).width() + "px",
							height : $(document).height() + "px",
							cursor : h.cursor
						});
						y.show();
						if (typeof (h.proxy) === "function") {
							o = h.proxy.call(u);
							if (!(o instanceof jQuery)) {
								window.console
										&& console
												.warn("proxy is a function but not return a jquery instance");
								return false
							}
							if (o.css("position") != "fixed"
									&& o.css("position") != "absolute"
									&& o.css("position") != "relative") {
								o.css({
									position : "absolute"
								})
							}
							var F = u.offset().left;
							var E = u.offset().top;
							o.css({
								left : F + "px",
								top : E + "px"
							})
						} else {
							if (h.proxy === "clone") {
								o = u.clone();
								o.appendTo(u.parent())
							} else {
								if (h.proxy && typeof (h.proxy) === "object") {
									var D = h.proxy["$appendTo"];
									o = u.clone();
									o.appendTo(D);
									o.css(h.proxy.cssText);
									var I = u.parent().offset();
									var G = D.offset().top - I.top;
									var J = D.offset().left - I.left;
									i.dragTop = parseInt(u.position().top - G);
									i.dragLeft = parseInt(u.position().left - J);
									s = i.dragLeft;
									p = i.dragTop;
									o.css({
										left : s + "px",
										top : p + "px"
									})
								} else {
									o = u
								}
							}
						}
						v.off("mousemove.tuiDrag").on("mousemove.tuiDrag", x);
						v.off("mouseup.tuiDrag").on("mouseup.tuiDrag", w)
					}
					function x(C) {
						h = u.data("dragOption");
						C.preventDefault ? C.preventDefault()
								: C.returnValue = false;
						if (o.css("position") == "fixed") {
							s = (C.pageX - $(document).scrollLeft() - i.ox)
									+ i.dragLeft;
							p = (C.pageY - $(document).scrollTop() - i.oy)
									+ i.dragTop
						} else {
							s = (C.pageX - i.ox) + i.dragLeft;
							p = (C.pageY - i.oy) + i.dragTop
						}
						s = (s < B ? B : s);
						s = (s > t ? t : s);
						p = (p < A ? A : p);
						p = (p > r ? r : p);
						o.css({
							left : s + "px",
							top : p + "px"
						});
						if (typeof (h.onDraging) === "function") {
							h.onDraging.call(o, s, p, C)
						}
					}
					function w(C) {
						if (typeof (h.onDrop) === "function") {
							h.onDrop.call(o, s, p)
						}
						h = u.data("dragOption");
						y.remove();
						if (h.revert) {
							o.animate({
								top : i.dragTop,
								left : i.dragLeft
							}, h.revertTime)
						} else {
							o.css({
								left : s + "px",
								top : p + "px"
							})
						}
						if (u == o) {
						} else {
							o.animate({
								left : 0
							}, 0, function() {
								$(this).remove()
							})
						}
						v.off("mousemove.tuiDrag", x).off("mouseup.tuiDrag", w);
						if (typeof (h.onFinshed) === "function") {
							h.onFinshed.call(o, s, p, C)
						}
					}
				})
	}
})($);

});