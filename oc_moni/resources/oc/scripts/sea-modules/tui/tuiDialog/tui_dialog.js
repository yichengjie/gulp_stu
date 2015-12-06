define(function(require, exports, module) {
	require('../tui_core');
	require('../tuiDrag/tui_drag');
(function(a) {
	a.tui = a.tui || {};
	a.closeTuiWindow = function() {
		a.tui.closeTuiWindow()
	};
	a.showTuiModalDialog = function(b, c) {
		a.tui.tuiDialog({
			url : b.url || "",
			width : b.width || 500,
			height : b.height || 400,
			title : b.title || "",
			mode : "window",
			style : "window"
		}, c)
	};
	a.showTuiDialog = function(b, c) {
		a.tui.tuiDialog({
			url : b.url || "",
			width : b.width || 500,
			height : b.height || 400,
			title : b.title || "",
			mode : "window",
			style : "window",
			isShowMask : false
		}, c)
	};
	a.showTuiHTMLDialog = function(e, c, b, f, d) {
		a.tui.tuiDialog({
			mode : "window",
			style : "text",
			width : c || 300,
			height : b || 200,
			message : e,
			showTitle : true,
			title : f
		}, d)
	};
	a.showTuiErrorDialog = function(g, c, f, b, e) {
		var d = {
			title : "错误",
			width : f || 300,
			height : b || 150,
			message : g,
			mode : "no_title_window",
			style : "error",
			onConfirm : c,
			confirmBtn : true
		};
		d = a.extend(d, e);
		a.tui.tuiDialog(d)
	};
	a.showTuiWaitingDialog = function(k, j, b, g) {
		var c = j || null, f = b || null, e = k, d;
		if (e || c || f) {
			d = {
				width : c || 150,
				height : f || 56,
				message : k,
				mode : "no_title_window",
				style : "waiting"
			}
		} else {
			d = {
				width : j || 150,
				height : b || 80,
				mode : "waiting"
			}
		}
		d = a.extend(d, g);
		a.tui.tuiDialog(d)
	};
	a.showTuiSmallWaitingDialog = function(e, b, d) {
		var c = {
			width : e || 68,
			height : b || 70,
			mode : "no_title_window",
			style : "waiting"
		};
		c = a.extend(c, d);
		a.tui.tuiDialog(c)
	};
	a.showTuiMessageDialog = function(f, g, e, b, d) {
		var c = {
			title : "信息",
			width : e || 300,
			height : b || 150,
			message : f,
			mode : "no_title_window",
			style : "info",
			onConfirm : g,
			confirmBtn : true
		};
		c = a.extend(c, d);
		a.tui.tuiDialog(c)
	};
	a.showTuiConfirmDialog = function(f, g, e, b, d) {
		var c = {
			title : "确认",
			width : e || 300,
			height : b || 150,
			message : f,
			mode : "no_title_window",
			style : "confirm",
			onConfirm : g,
			cancelBtn : true,
			confirmBtn : true
		};
		a.extend(c, d);
		c = a.extend(c, d);
		a.tui.tuiDialog(c)
	};
	a.showTuiSuccessDialog = function(g, f, e, b, d) {
		var c = {
			title : "成功",
			width : e || 300,
			height : b || 150,
			message : g,
			mode : "no_title_window",
			style : "success",
			onConfirm : f,
			confirmBtn : true
		};
		c = a.extend(c, d);
		a.tui.tuiDialog(c)
	};
	a.showTuiNoImgDialog = function(f, g, e, b, d) {
		var c = {
			title : "",
			width : e || 300,
			height : b || 200,
			message : f,
			mode : "no_title_window",
			style : "text",
			onConfirm : g,
			confirmBtn : true
		};
		c = a.extend(c, d);
		a.tui.tuiDialog(c)
	};
	a.showTuiMessageAlert = function(f, g, e, b, d) {
		var c = {
			mode : "alert",
			style : "error",
			width : e || 360,
			height : b || 100,
			message : f,
			showTitle : true,
			showDefaultBtn : true,
			onConfirm : g
		};
		c = a.extend(c, d);
		a.tui.tuiDialog(c)
	};
	a.showTuiSmallEditWindow = function(c, e, b, h, g, f) {
		var d = {
			url : c,
			mode : "narrow_window",
			style : "window",
			width : e || 200,
			height : b || 100,
			showPos : "ex",
			top : h || 0,
			left : g || 0,
			isShowMask : false,
			isDrag : false
		};
		d = a.extend(d, f);
		a.tui.tuiDialog(d)
	};
	a.showTuiSmallEditDialog = function(f, i, d, b, h, g, e) {
		var c = {
			message : f,
			confirmBtn : true,
			cancelBtn : true,
			mode : "narrow_window",
			style : "text",
			width : d || 200,
			height : b || 150,
			showPos : "ex",
			top : h || 0,
			left : g || 0,
			isShowMask : false,
			isDrag : false,
			onConfirm : i
		};
		c = a.extend(c, e);
		a.tui.tuiDialog(c)
	};
	a.showTuiTipDialog = function(f, d, b, h, g, e) {
		var i = "c";
		if (h != null && g != null) {
			i = "ex"
		}
		var c = {
			mode : "narrow_window",
			style : "text",
			width : d || 300,
			height : b || 100,
			message : f,
			showPos : i,
			top : g || 0,
			left : h || 0,
			showTitle : false,
			showDefaultBtn : false,
			confirmBtn : false
		};
		c = a.extend(c, e);
		a.tui.tuiDialog(c)
	};
	a.showTuiModifyDialog = function(f, d, b, h, g, e) {
		var i = "c";
		if (h != null && g != null) {
			i = "ex"
		}
		var c = {
			mode : "no_title_window",
			style : "text",
			width : d || 300,
			height : b || 100,
			message : f,
			showPos : i,
			top : g || 0,
			left : h || 0,
			showTitle : false,
			showDefaultBtn : false,
			confirmBtn : false
		};
		c = a.extend(c, e);
		a.tui.tuiDialog(c)
	};
	a.isTuiWindowVisible = function() {
		return a.tui.isVisible()
	};
	a.tui.tuiDialogDefault = {
		width : 300,
		height : 200,
		message : "",
		url : "",
		title : "tui dialog",
		maskAlphaColor : "#000",
		maskAlpha : 0.1,
		isFixed : false,
		showTitle : true,
		showDefaultBtn : true,
		confirmBtn : false,
		cancelBtn : false,
		closeBtn : false,
		autoClose : true,
		onConfirm : null,
		onCancel : null,
		onClose : null,
		onTitleClose : null,
		isDrag : true,
		isShowMask : true,
		showPos : "c",
		top : 0,
		left : 0,
		btnContext : {
			w_confirm : "确定",
			w_cancel : "取消",
			w_close : "关闭"
		},
		mode : "window",
		style : "info"
	};
	a
			.extend(
					a.tui,
					{
						tuiDialog : function() {
							var e = a.extend({}, a.tui.tuiDialogDefault);
							for ( var k = 0; k < arguments.length; k++) {
								e = a.extend(e, arguments[k])
							}
							var b = a.tui.isIE(), o = (document.compatMode == "CSS1Compat"), f = a.tui
									.isIE7(), d = a.tui.isIE8(), h = a.tui
									.isIE6();
							var n = function(x, w) {
								var u = a(document), y = u.width(), r = u
										.height(), z, s = '<div id="tui_dialog_mask" class="dialog_mask"></div>', v;
								if (a("#tui_dialog_mask").length > 0) {
									z = a("#tui_dialog_mask")
								} else {
									z = a(s);
									a("body").append(z)
								}
								if (window.innerHeight) {
									v = document.body.offsetHeight > innerHeight
								} else {
									v = (document.documentElement.scrollHeight > document.documentElement.offsetHeight || document.body.scrollHeight > document.body.offsetHeight)
								}
								if (b) {
									if (v) {
									}
								}
								if (h) {
									z
											.append('<iframe border="0" frameborder="0" style="width:100%;height:100%;filter:alpha(opacity='
													+ (100 * w)
													+ ');" src="about:blank"></iframe>')
								}
								z.css({
									width : y + "px",
									height : r + "px",
									opacity : w,
									background : x
								}).show();
								var A = y, t = r;
								var i = function(D, B, C) {
									return function() {
										var G = a(window), F = G.width() > B ? G
												.width()
												: B, E = G.height() > C ? G
												.height() : C;
										D.css({
											width : F + "px",
											height : E + "px"
										})
									}
								};
								a(window).bind("resize.tuiDialog", i(z, A, t))
							};
							var j = function() {
								a("#tui_dialog_mask").html("").hide();
								a(window).unbind("resize.tuiDialog")
							};
							var g = function() {
								var i = a("#tui_dialog_window"), t = a(document), s = parseInt(i
										.css("left")), r = parseInt(i
										.css("top"));
								i
										.css({
											left : s
													+ (t.scrollLeft() - window.tuiDialogForIE6ScrollX)
													+ "px",
											top : r
													+ (t.scrollTop() - window.tuiDialogForIE6ScrollY)
													+ "px"
										});
								window.tuiDialogForIE6ScrollX = t.scrollLeft();
								window.tuiDialogForIE6ScrollY = t.scrollTop()
							};
							var l = function(i) {
								var D, F = a(window), O = a(document);
								if (a("#tui_dialog_window").length < 1) {
									var L = '<div id="tui_dialog_window" class="dialog_panel"></div>';
									D = a(L);
									a("body").append(D)
								} else {
									D = a("#tui_dialog_window")
								}
								D.empty().show().css({
									position : i.isFixed ? "fixed" : "absolute"
								});
								var I = i.width, t = i.height, s, x;
								if (!isNaN(I)) {
									s = i.width
								} else {
									if (I == "auto") {
										s = F.width()
									} else {
										var w = /^(\d{1,3})%$/;
										var P = w.exec(I);
										if (P && P.length == 2) {
											s = F.width()
													* (parseInt(P[1]) || 100)
													/ 100
										} else {
											s = i.width
										}
									}
								}
								if (!isNaN(t)) {
									x = i.height
								} else {
									if (t == "auto") {
										x = F.height()
									} else {
										var w = /^(\d{1,3})%$/;
										var P = w.exec(t);
										if (P && P.length == 2) {
											x = F.height()
													* (parseInt(P[1]) || 100)
													/ 100
										} else {
											x = i.height
										}
									}
								}
								i.height = x;
								var E = 0, u = 0;
								switch (i.showPos) {
								case "lt":
									break;
								case "lb":
									E = F.height() - x - 2;
									break;
								case "rt":
									u = F.width() - s - 2;
									break;
								case "rb":
									E = F.height() - x - 2;
									u = F.width() - s - 2;
									break;
								case "c":
									E = (F.height() - x) / 2;
									u = (F.width() - s) / 2;
									break;
								default:
									E = i.top;
									u = i.left
								}
								E = E >= 0 ? E : 0;
								if (h && i.isFixed) {
									D.css({
										position : "absolute",
										left : O.scrollLeft() + u + "px",
										top : O.scrollTop() + E + "px"
									});
									window.tuiDialogForIE6ScrollX = O
											.scrollLeft();
									window.tuiDialogForIE6ScrollY = O
											.scrollTop();
									F.bind("scroll.tuiDialog", g)
								} else {
									if (!i.isFixed && i.showPos != "ex") {
										u += (F.scrollLeft() || 0);
										E += (F.scrollTop() || 0)
									}
									D.css({
										left : u + "px",
										top : E + "px"
									})
								}
								D.css({
									width : s + "px",
									height : x + "px"
								});
								var z = i.mode, v = "", C = "", M = '<div id="tui_dialog_close_button" class="dialog_head_close"></div>', G;
								switch (z) {
								case "window":
									v = '<div id="tui_dialog_title" class="dialog_head_left">									<div class="dialog_head_right">										<div class="dialog_head_content" id="tui_dialog_title_center"></div>									</div>								</div>								<div class="dialog_body_left">									<div class="dialog_body_right">										<div class="dialog_body_content" id="dialog_content"></div>									</div>								</div>';
									C = '<div id="tui_dialog_bottom" class="dialog_foot_left">									<div class="dialog_foot_right">										<div class="dialog_foot_content"></div>									</div>								</div>';
									break;
								case "no_title_window":
									v = '<div id="tui_dialog_title" class="dialog_head_no_title_left">									<div class="dialog_head_no_title_right">										<div class="dialog_head_no_title_content" id="tui_dialog_title_center"></div>									</div>								</div>								<div class="dialog_body_left">									<div class="dialog_body_right">										<div class="dialog_body_content" id="dialog_content"></div>									</div>								</div>';
									C = '<div id="tui_dialog_bottom" class="dialog_foot_left">									<div class="dialog_foot_right">										<div class="dialog_foot_content"></div>									</div>								</div>';
									break;
								case "narrow_window":
									v = '<div id="tui_dialog_title" class="dialog_head_narrow_left">									<div class="dialog_head_narrow_right">										<div class="dialog_head_narrow_content" id="tui_dialog_title_center"></div>									</div>								</div>								<div class="dialog_body_narrow_left">									<div class="dialog_body_narrow_right">										<div class="dialog_body_narrow_content" id="dialog_content"></div>									</div>								</div>								';
									C = '<div id="tui_dialog_bottom" class="dialog_foot_narrow_left">									<div class="dialog_foot_narrow_right">										<div class="dialog_foot_narrow_content"></div>									</div>								</div>';
									break;
								default:
									v = "";
									C = ""
								}
								if (v != "" && C != "") {
									a(v).appendTo(D);
									var N = a("#tui_dialog_title"), H = a("#tui_dialog_title_center");
									if (i.showTitle && z == "window") {
										var B = '<div class="dialog_head_title" id="tui_dialog_title_content">'
												+ i.title + "</div>", y = a(B)
												.appendTo(H);
										if (i.showDefaultBtn) {
											G = a(M).appendTo(H)
										}
									}
									var r = a(C).appendTo(D)
								} else {
									if (z == "waiting") {
										var v = '<div class="dialog_waiting">										<div class="dialog_waiting_msg">											<div class="icon"></div><span class="content">'
												+ (i.message || "请稍候...")
												+ "</span>										</div>									</div>", A = a(
												v).appendTo(D);
										D.css({
											width : 150,
											height : 72
										})
									} else {
										if (z == "alert") {
											var v = '<div class="dialog_alert" id="dialog_alert">										<div class="dialog_alert_msg" id="dialog_content"></div>									</div>', K = a(
													v).appendTo(D);
											if (i.showDefaultBtn) {
												var J = '<div class="dialog_close_icon" id="tui_dialog_close_button"></div>', G = a(J);
												a("#dialog_alert").before(G)
											}
										}
									}
								}
								G
										&& G.length
										&& G
												.bind("mousedown.tuiDialog",
														function(Q) {
															Q.stopPropagation()
														})
												.bind(
														"click.tuiDialog",
														function(Q) {
															Q.stopPropagation();
															q();
															if (typeof (i.onTitleClose) === "function") {
																i.onTitleClose
																		.call(
																				this,
																				Q,
																				D)
															}
														});
								if (i.isDrag) {
									D.tuiOffDrag().tuiDrag({
										handle : (N && N.length) ? N : D,
										isFixed : i.isFixed,
										dragRange : "auto"
									})
								} else {
									D.tuiOffDrag().tuiDrag("disabled", true)
								}
							};
							var m = function() {
								a("#tui_dialog_window").hide();
								a(window).unbind("scroll.tuiDialog", g)
							};
							var q = function() {
								m();
								j();
								a(document).unbind("keydown.tuiDialog");
								if (window.tuiDialogCache.length > 0) {
									var i = window.tuiDialogCache.shift();
									a.tui.tuiDialog(i)
								}
							};
							var c = function(C) {
								var v = function(D) {
									return D
								};
								var A = {
									info : "dialog_icon_info",
									success : "dialog_icon_success",
									error : "dialog_icon_error",
									confirm : "dialog_icon_confirm",
									waiting : "dialog_icon_waiting"
								}, y, w = C.mode, s = C.style, B;
								if (a("#dialog_content").length != 1
										&& w != "waiting") {
									window.console
											&& window.console
													.warn("not found #dialog_content!");
									return
								}
								y = a("#dialog_content");
								y.empty();
								switch (s) {
								case "window":
									if ((w != "alert") && (w != "waiting")) {
										var t = '<iframe border="0" id="dialog_iframe" frameborder="0" class="dialog_iframe" src="'
												+ C.url + '"></iframe>';
										B = a(t).appendTo(y);
										break
									}
								case "text":
									if (w != "waiting") {
										y
												.html('<div id="dialog_info_panel" style="overflow:auto;">'
														+ v(C.message)
														+ "</div>")
									}
									break;
								case "info":
								case "success":
								case "error":
								case "confirm":
								case "waiting":
									var t = '<div class="dialog_info" id="dialog_info_panel">                        				<div id="dialog_icon"></div>                       					<div class="dialog_info_content" id="dialog_info_content"></div>                    				   </div>';
									var u = a(t).appendTo(y);
									var z = a("#dialog_icon"), x = a("#dialog_info_content");
									z.addClass(A[s]);
									x.html(v(C.message));
									x
											.off("mousedown.tuiDialog")
											.on(
													"mousedown.tuiDialog",
													function(D) {
														(D && D.stopPropagation) ? D
																.stopPropagation()
																: window.event.cancelBubble = true
													});
									if (s == "waiting") {
										z.parent().css({
											paddingLeft : 56
										});
										if (C.message == "") {
											z.parent().css({
												paddingTop : 0
											})
										}
									}
									break
								}
								var r = 0, B = a("#dialog_iframe"), i = a("#dialog_info_panel");
								if (C.confirmBtn || C.cancelBtn || C.closeBtn) {
									r += 30
								}
								if (w == "window") {
									r += 43
								} else {
									if (w == "alert") {
										r += 20
									} else {
										if (w == "no_title_window") {
											r += 15
										} else {
											if (w == "narrow_window") {
												r += 13
											}
										}
									}
								}
								i.length && i.css({
									height : (C.height - r) + "px"
								});
								B.length && B.css({
									height : (C.height - r) + "px"
								})
							};
							var p = function(A) {
								var s = a("#tui_dialog_window"), t = a("#dialog_btn_panel"), w = A.mode, i = a("#dialog_content"), r = "", u = A.btnContext;
								if (s.length != 1 || i.length != 1) {
									return
								}
								if (w == "waiting") {
									return
								}
								if (t.length != 0) {
									t.empty().remove()
								}
								if (A.confirmBtn) {
									r += '<div class="btn_page btn_save dialog_btn" id="dialog_btn_confirm">								<div class="btn_left"></div>								<div class="btn_content" id="tt">&nbsp;'
											+ u.w_confirm
											+ '&nbsp;</div>								<div class="btn_right"></div>							</div>'
								}
								if (A.cancelBtn) {
									r += '<div class="btn_page btn_cancel dialog_btn" id="dialog_btn_cancel">								<div class="btn_left"></div>								<div class="btn_content">&nbsp;'
											+ u.w_cancel
											+ '&nbsp;</div>								<div class="btn_right"></div>							</div>'
								}
								if (A.closeBtn) {
									r += '<div class="btn_page btn_cancel dialog_btn" id="dialog_btn_close">								<div class="btn_left"></div>								<div class="btn_content">&nbsp;'
											+ u.w_close
											+ '&nbsp;</div>								<div class="btn_right"></div>							</div>'
								}
								if (r != "") {
									t = a(
											'<div class="dialog_btn_panel" id="dialog_btn_panel"></div>')
											.appendTo(i);
									t.html(r)
								} else {
									return
								}
								var x = a("#dialog_btn_confirm"), v = a("#dialog_btn_cancel"), z = a("#dialog_btn_close"), y = A.autoClose;
								x.length
										&& x
												.bind("mousedown", function(B) {
													B.stopPropagation()
												})
												.bind(
														"click.tuiDialog",
														function(B) {
															y ? q() : "";
															typeof (A.onConfirm) == "function" ? A.onConfirm
																	.call(this,
																			B,
																			s)
																	: ""
														});
								v.length
										&& v
												.bind("mousedown", function(B) {
													B.stopPropagation()
												})
												.bind(
														"click.tuiDialog",
														function(B) {
															y ? q() : "";
															typeof (A.onCancel) == "function" ? A.onCancel
																	.call(this,
																			B,
																			s)
																	: ""
														});
								z.length
										&& z
												.bind("mousedown", function(B) {
													B.stopPropagation()
												})
												.bind(
														"click.tuiDialog",
														function(B) {
															y ? q() : "";
															typeof (A.onClose) == "function" ? A.onClose
																	.call(this,
																			B,
																			s)
																	: ""
														});
								a(document)
										.bind(
												"keydown.tuiDialog",
												function(D) {
													var B = a("#dialog_btn_confirm");
													var E = a("#dialog_btn_cancel");
													var C = a("#tui_dialog_close_button");
													if (D.keyCode == 13) {
														B.length
																&& B
																		.trigger("click")
													} else {
														if (D.keyCode == 27) {
															E.length ? E
																	.trigger("click")
																	: C.length
																			&& C
																					.trigger("click")
														}
													}
												})
							};
							window.tuiDialogCache ? ""
									: window.tuiDialogCache = new Array();
							if (a("#tui_dialog_window:visible").length > 0) {
								window.tuiDialogCache.push(e);
								return
							}
							l(e);
							c(e);
							p(e);
							e.isShowMask ? n(e.maskAlphaColor, e.maskAlpha)
									: ""
						},
						closeTuiWindow : function() {
							var b = function() {
								a(document).unbind("keydown.tuiDialog");
								a("#tui_dialog_mask").html("").hide();
								a(window).unbind("resize.tuiDialog")
							};
							var d = function() {
								a("#tui_dialog_window").hide();
								a(window).unbind("scroll.tuiDialog")
							};
							var c = function() {
								d();
								b();
								if (window.tuiDialogCache
										&& window.tuiDialogCache.length > 0) {
									var e = window.tuiDialogCache.shift();
									a.tui.tuiDialog(e)
								}
							};
							c()
						},
						isVisible : function() {
							var b = a("#tui_dialog_window");
							if (b.length && b.is(":visible")) {
								return true
							} else {
								return false
							}
						}
					})
})(jQuery);

});