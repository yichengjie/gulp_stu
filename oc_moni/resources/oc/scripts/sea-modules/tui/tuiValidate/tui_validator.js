define(function(require, exports, module) {

(function(a) {
	a.fn = a.fn || {};
	a.extend(a.fn, {
		tuiValidator : function(T) {
			if (!this.length) {
				window.console
						&& console
								.warn("nothing selected, can't validate, returning nothing");
				return
			}
			var e = {
				isDialog : false,
				isLabel : true,
				isTip : false,
				tipMsg : "请检查红框提示的错误",
				$tipArea : null,
				isClearError : false,
				isLabelDown : false,
				isLabelError : true,
				isErrorDown : null,
				$dialogArea : null,
				excludeIds : null,
				includeIds : null,
				isClick : false,
				errorClass : "tui_input_error",
				errorIcon : "icon_error",
				infoClass : "tui_input_info",
				arrowIcon : "tui_icon_arrowTipUp",
				errorElement : "label",
				ignore : ":hidden",
				onsubmit : true,
				submitId : "submitButton",
				dialogTip : "title",
				dialogMethod : "",
				greaterEqual : "",
				greater : "",
				equal : "",
				notEqual : "",
				extend : "",
				extendSubmit : "",
				extendRequired : "",
				disabledAttr : "data-disabled"
			};
			if (T.isDialog === true && typeof T.isLabel === "undefined") {
				T.isLabel = false
			}
			var ag = a.extend({}, e, T);
			var X = this[0], E = ag.dialogTip, aa = ag.isDialog, h = ag.isLabel, D = ag.extendRequired, d = "";
			var K = ag.isLabelDown, C = ag.isErrorDown, q = ag.excludeIds, ab = ag.includeIds, b = ag.isClick;
			var z = ag.errorIcon, t = ag.arrowIcon, J = ag.errorClass;
			var P = ag.$dialogArea, p = ag.isTip, I = ag.tipMsg, g = ag.$tipArea;
			C = C == null ? K : C;
			var B = {};
			if (q !== null) {
				for (var ad = 0; ad < q.length; ad++) {
					B[q[ad]] = true
				}
			}
			var m = {};
			if (ab != null) {
				for (var ad = 0; ad < ab.length; ad++) {
					m[ab[ad]] = true
				}
			}
			var V = {
				tuiRequired : {
					required : true
				},
				tuiTrim : {
					trim : true
				},
				tuiTrim0 : {
					trim0 : true
				},
				tuiTrimAll : {
					trimAll : true
				},
				tuiUpper : {
					upper : true
				},
				tuiDate : {
					date : true
				},
				tuiAllDate : {
					allDate : true
				},
				tuiTime : {
					time : true
				},
				tuiAlphanumericspace : {
					alphanumericspace : true
				},
				tuiAlphanumeric : {
					alphanumeric : true
				},
				tuiAlphanumericOrStart : {
					alphanumericOrStart : true
				},
				tuiDigital : {
					digital : true
				},
				tuiMathDigital : {
					mathDigital : true
				},
				tuiPositiveInteger : {
					positiveInteger : true
				},
				tuiLetter : {
					letter : true
				},
				tuiAir : {
					air : true
				},
				tuiStrictFltnum : {
					strictFltnum : true
				},
				tuiFltNum : {
					fltnum : true
				},
				tuiAreaCode : {
					areacode : true
				},
				tuiCityCode : {
					citycode : true
				},
				tuiCountryCode : {
					countrycode : true
				},
				tuiAirportCode : {
					airportcode : true
				},
				tuiStateCode : {
					statecode : true
				},
				tuiZoneCode : {
					zonecode : true
				},
				tuiIataNum : {
					iatanum: true
				},
				tuiSeatCode : {
					seatcode: true
				},
				tuiSeatCode2 : {
					seatcode2: true
				},
				tuiSegment : {
					segment : true
				},
				tuiClass : {
					subclass : true
				},
				tuiClass2 : {
					subclass2 : true
				},
				tuiEmail : {
					email : true
				},
				tuiIp : {
					ip : true
				},
				tuiPort : {
					port : true
				},
				tuiBasicInput : {
					basicInput : true
				},
				tuiBasicContent : {
					basicContent : true
				},
				tuiOffice : {
					office : true
				},
				tuiEQT : {
					EQT : true
				},
				tuiPNRNbr : {
					PNRNbr : true
				},
				tuiETermUser : {
					eTermUser : true
				},
				tuiETermPwd : {
					eTermPwd : true
				},
				tuiPersonName : {
					personName : true
				},
				tuiGroupName : {
					groupName : true
				},
				tuiSSRRmk : {
					SSRRmk : true
				},
				tuiContact : {
					contact : true
				},
				tuiSSROsi : {
					SSROsi : true
				},
				tuiSSROths : {
					SSROths : true
				},
				tuiFareBasis : {
					fareBasis : true
				},
				tuiBaggageCode : {
					baggageCode : true
				},
				tuiPaxName : {
					paxName : true
				},
				tuiChildAge : {
					childAge : true
				},
				tuiIsModify : {
					isModify : true
				},
				tuiToRequired : {
					toRequired : true
				}
			};
			if (ag.extendRules
					&& typeof ag.extendRules.classRuleSettings !== "undefined") {
				a.extend(true, V, ag.extendRules.classRuleSettings)
			}
			var ae = {
				required : function(ai, i, ak) {
					switch (i.nodeName.toLowerCase()) {
						case "select" :
							var aj = a(i).val();
							return aj && aj.length > 0;
						case "input" :
							if (H(i)) {
								return ah(ai, i) > 0
							}
						default :
							return a.trim(ai).length > 0
					}
				},
				date : function(ai, i) {
					return G(ai)
				},
				allDate : function(ai, i) {
					return G(ai, true)
				},
				time : function(ai, i) {
					return /^[0-9]{2}[:]{0,1}[0-9]{2}$/.test(ai)
				},
				alphanumeric : function(ai, i) {
					return /^[A-Za-z0-9]{0,}$/.test(ai)
				},
				alphanumericOrStart : function(ai,i){
					return /^[A-Za-z0-9]{0,}$|^[\*]{1}$/.test(ai)
				},
				alphanumericspace : function(ai, i) {
					return /^[A-Za-z0-9\s]{0,}$/.test(ai)
				},
				digital : function(ai, i) {
					return /^[0-9]{0,}$/.test(ai)
				},
				mathDigital : function(ai, i) {
					return /^[+-]{0,1}[0-9]{1,}[\.]{0,1}[0-9]{0,}$/.test(ai)
				},
				positiveInteger : function(ai, i) {
					return /^[1-9]{1}[0-9]{0,}$/.test(ai)
				},
				letter : function(ai, i) {
					return /^[a-zA-Z]{0,}$/.test(ai)
				},
				air : function(ai, i) {
					return /^[a-zA-Z]{2}$|^[a-zA-Z]{1}[0-9]{1}$|^[0-9]{1}[a-zA-Z]{1}$/
							.test(ai)
				},
				airKeyUp : function(ai, i) {
					return /^[0-9a-zA-Z]{0,}$/.test(ai)
				},
				strictFltnum : function(ai, i) {
					return /^([A-Za-z]{1}[0-9]{1}|[0-9]{1}[A-Za-z]{1}|[A-Za-z]{2})[0-9]{3,4}[A-Za-z]?$/
							.test(ai)
				},
				fltnum : function(ai, i) {
					return /^([A-Za-z0-9]{0}|[A-Za-z]{1}[0-9]{1}|[0-9]{1}[A-Za-z]{1}|[A-Za-z]{2})[0-9]{3,4}[A-Za-z]?$/
							.test(ai)
				},
				fltnumKeyUp : function(ai, i) {
					return /^[0-9A-Za-z]{0,2}[0-9]{1,4}[A-Za-z]?$/.test(ai)
				},
				areacode : function(ai, i) {
					return /^[1-3]{1}$/i.test(ai)
				},
				citycode : function(ai, i) {
					return /^[A-Z]{3}$/i.test(ai)
				},
				citycodeKeyUp : function(ai, i) {
					return /^[A-Z]{0,}$/i.test(ai)
				},
				countrycode : function(ai, i) {
					return /^[A-Z]{2}$/i.test(ai)
				},
				airportcode : function(ai, i) {
					return /^[A-Z]{3}$/i.test(ai)
				},
				statecode : function(ai, i) {
					return /^[A-Z]{2}$/i.test(ai)
				},
				zonecode : function(ai, i) {
					return /^[0-9]{3}$/i.test(ai)
				},
				iatanum : function(ai, i) {
					return /^[0-9]{7}$/i.test(ai)
				},
				seatcode : function(ai, i) {
					return /^[A-Z]{1}$/i.test(ai)
				},
				seatcode2 : function(ai, i) {
					return /^[A-Z0-9]{1,5}$/i.test(ai)
				},
				
				segment : function(ai, i) {
					return /^[A-Z]{6}$/i.test(ai)
				},
				subclass : function(ai, i) {
					return /^[A-Z]{1}$/i.test(ai)
				},
				subclass2 : function(ai, i) {
					return /^[A-Z0-9]{1,5}$/i.test(ai)
				},
				email : function(ai, i) {
					return /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/.test(ai)
				},
				ip : function(ai, i) {
					return /^(25[0-5]|2[0-4][0-9]|1{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|1{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|1{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|1{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/
							.test(ai)
				},
				port : function(ai, i) {
					return /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/
							.test(ai)
				},
				basicInput : function(ai, i) {
					return /^[0-9a-zA-Z\u4E00-\u9FA5\s\-_:#@\?\*,\.\/]{0,}$/g
							.test(ai)
				},
				office : function(ai, i) {
					return /^[A-Za-z]{3}[0-9]{3}$/g.test(ai)
				},
				EQT : function(ai, i) {
					return /^[A-Za-z0-9]{3}$/g.test(ai)
				},
				PNRNbr : function(ai, i) {
					return /^[A-Za-z0-9]{6}$/g.test(ai)
				},
				eTermUser : function(ai, i) {
					return /^[A-Za-z0-9_\$]{2,15}$/g.test(ai)
				},
				eTermPwd : function(ai, i) {
					return /^.{1,20}$/g.test(ai)
				},
				personName : function(ai, i) {
					return /^[a-zA-Z\u4E00-\u9FA5]{1,}[a-zA-Z\u4E00-\u9FA5\\/]{0,}[a-zA-Z\u4E00-\u9FA5]{1,}$/ig
							.test(ai)
				},
				groupName : function(ai, i) {
					return /^[a-zA-Z]{1,}[\/]{0,1}[a-zA-Z]{1,}$/.test(ai)
				},
				SSRRmk : function(ai, i) {
					return /^[0-9a-zA-Z \u4E00-\u9FA5]{0,}$/.test(ai)
				},
				contact : function(ai, i) {
					return /^[0-9a-zA-Z \/\-]{0,}$/.test(ai)
				},
				SSROsi : function(ai, i) {
					return /^[a-zA-Z]{1,}[0-9a-zA-Z ]{0,}$/.test(ai)
				},
				SSROths : function(ai, i) {
					return /^[0-9a-zA-Z ]{0,}$/.test(ai)
				},
				fareBasis : function(ai, i) {
					return /^[0-9a-zA-Z\/]{0,}$/.test(ai)
				},
				baggageCode : function(ai, i) {
					return  /^[A-Za-z0-9]{3}$/g.test(ai)
				},
				paxName : function(ai, i) {
					return /^[a-zA-Z\u4E00-\u9FA5]{1,}[a-zA-Z\u4E00-\u9FA5\/]{0,}[a-zA-Z\u4E00-\u9FA5]{1,}$/
							.test(ai)
				},
				childAge : function(ai, i) {
					if (/^[0-9]{1,2}$/.test(ai)) {
						if (ai > 12 || ai < 2) {
							return false
						} else {
							return true
						}
					} else {
						return false
					}
				},
				basicContent : function(ai, i) {
					return /^[0-9a-zA-Z\u4E00-\u9FA5\s\-:\+=;_#@\?\*,&\\\.\/]{0,}$/g
							.test(ai)
				},
				isModify : function(ak, ai) {
					var aj = a(ai).next("input:hidden");
					var i = "";
					if (aj && aj.get(0)) {
						i = aj.val()
					}
					if (ak === i) {
						return false
					} else {
						return true
					}
				}
			};
			if (ag.extendRules
					&& typeof ag.extendRules.validateMetheds !== "undefined") {
				a.extend(true, ae, ag.extendRules.validateMetheds)
			}
			if (ag.extendRules
					&& typeof ag.extendRules.validateMethods !== "undefined") {
				a.extend(true, ae, ag.extendRules.validateMethods)
			}
			if (h) {
				var L = {
					required : "必填",
					date : "请输入合法的日期yyyy-mm-dd(在当前年份前后20年之内)",
					allDate : "请输入合法的日期yyyy-mm-dd",
					time : "请输入有效的时间",
					alphanumericspace : "请输入字母、数字和空格的组合(半角)",
					alphanumeric : "请输入字母和数字的组合(半角)",
					alphanumericOrStart : "请输入字母和数字的组合(半角)或仅输入*",
					digital : "只能输入正整数及0(半角)",
					mathDigital : "允许输入数字小数点和+-号(半角)",
					positiveInteger : "只能输入正整数(半角)",
					number : "请输入合法的数字(半角)",
					letter : "只能输入字母(半角)",
					air : "请输入正确的航空公司二字码",
					strictFltnum : "请输入正确航班号，必须含航空公司代码",
					fltnum : "请输入正确的航班号，可不含航空公司代码",
					areacode : "请输入正确的大区代码",
					citycode : "请输入正确的城市三字码",
					countrycode : "请输入正确的国家二字码",
					airportcode : "请输入正确的机场三字码",
					statecode : "请输入正确的州二字码",
					zonecode : "请输入正确的区域代码",		
					iatanum : "请输入正确的iata号",	
					seatcode: "请输入正确的座位属性",
					seatcode2: "请输入正确的座位属性",
					segment : "请输入正确的航段或城市对",
					subclass : "请输入正确的舱位",
					subclass2 : "请输入正确的舱位",
					email : "请输入正确格式的电子邮件",
					ip : "请输入正确的IP,如某段两位及以上则该段不能以0开头(半角)",
					url : "请输入合法的网址",
					port : "端口为1-65535的数字(半角)",
					greaterEqual : '"{0}"应该大于等于"{1}"',
					greater : '"{0}"应该大于"{1}"',
					equal : '"{0}"应该等于"{1}"',
					notEqual : '"{0}"应该不等于"{1}"',
					basicInput : "允许值为,.?#@*-_:/中英数字空格(半角)",
					office : "前面3位字母后面3位数字(半角)",
					EQT : "机型要求3位字母和数字组合(半角)",
					PNRNbr : "PNR编码要求6位字母和数字组合(半角)",
					eTermUser : "需2-15位，允许输入英(大小写)&nbsp;_$&nbsp;和数字(半角)",
					eTermPwd : "需1-20位",
					personName : "长度大于1且不能以/开始和结束,允许输入值为/中&nbsp;&nbsp;英(大小写)和/(半角)",
					groupName : "团队名称必须是英文字母或/，大于等于两位，且不能以/开始和结束(半角)",
					SSRRmk : " 自由文本为数字、英文字母、汉字或空格",
					contact : "联系信息为英文字母、数字、空格、/或-",
					SSROsi : "自由文本为数字、英文字母或空格，并且不可以数字开头",
					SSROths : "自由文本为数字、英文字母或空格",
					fareBasis : "运价基础为数字、英文字母或/",
					baggageCode:"3位数字或字母",
					paxName : "姓名为汉字、英文字母、/，长度不少于2位并且不能以/开始和结束(半角)",
					childAge : "儿童年龄必须是2-12之间(包含2和12)的自然数(半角)",
					basicContent : "允许值为,.?&#*+-_=:;@/中英数字空格(半角)",
					isModify : "没有任何修改"
				};
				if (ag.extendRules
						&& typeof ag.extendRules.labelMessages !== "undefined") {
					a.extend(true, L, ag.extendRules.labelMessages)
				}
			}
			if (aa) {
				var U = {
					required : '"{0}" 为必填项。',
					date : '"{0}"请输入合法的日期yyyy-mm-dd(在当前年份前后20年之内)。',
					time : '"{0}"请输入有效的时间。',
					digital : '"{0}"只能输入正整数及0(半角)。',
					mathDigital : '"{0}"允许输入数字小数点和+-号(半角)。',
					positiveInteger : '"{0}"只能输入正整数(半角)。',
					letter : '"{0}" 只能输入字母(半角)。',
					alphanumeric : '"{0}" 请输入字母和数字的组合(半角)。',
					alphanumericOrStart : '"{0}" 请输入字母和数字的组合(半角)或仅输入*。',
					alphanumericspace : '"{0}"请输入字母、数字和空格的组合(半角)。',
					air : '"{0}"请输入正确的航空公司二字码。',
					strictFltnum : '"{0}"请输入正确航班号，必须含航空公司代码。',
					fltnum : '"{0}"请输入正确的航班号，可不含航空公司代码。',
					citycode : '"{0}"请输入正确的三字码。',
					segment : '"{0}"请输入正确的航段或城市对。',
					subclass : '"{0}"请输入正确的舱位。',
					subclass2 : '"{0}"请输入正确的舱位。',
					email : '"{0}"请输入正确的格式。',
					ip : '"{0}"请输入正确的IP,如某段两位及以上则该段不能以0开头(半角)。',
					url : '"{0}"请输入合法的网址。',
					port : '"{0}"端口为1-65535的数字(半角)',
					greaterEqual : '"{0}"应该大于等于"{1}"。',
					greater : '"{0}"应该大于"{1}"',
					equal : '"{0}"应该等于"{1}"。',
					notEqual : '"{0}"应该不等于"{1}"。',
					basicInput : '"{0}"允许值为,.?#@*-:/中英数字空格(半角)。',
					office : '"{0}"前面3位字母后面3位数字(半角)。',
					EQT : '"{0}"机型要求3位字母和数字组合(半角)。',
					PNRNbr : '"{0}"PNR编码要求6位字母和数字组合(半角)。',
					eTermUser : '"{0}"需2-15位，允许输入英(大小写)&nbsp;_$&nbsp;和数字(半角)。',
					eTermPwd : '"{0}"需1-20位。',
					personName : '"{0}"长度大于2且不能以/开始和结束,允许输入值为/中&nbsp;&nbsp;英(大小写)和/(半角)。',
					groupName : '"{0}"必须是英文字母或/，大于等于两位，且不能以/开始和结束(半角)。',
					SSRRmk : '"{0}"自由文本为数字、英文字母、汉字或空格。',
					contact : '"{0}"联系信息为英文字母、数字、空格、/或-。',
					SSROsi : '"{0}"自由文本为数字、英文字母或空格，并且不可以数字开头。',
					SSROths : '"{0}"自由文本为数字、英文字母或空格。',
					fareBasis : '"{0}"运价基础为数字、英文字母或/。',
					baggageCode : '"{0}"机型要求3位字母和数字组合(半角)。',
					paxName : '"{0}"姓名为汉字、英文字母、/，长度不少于2位并且不能以/开始和结束。',
					childAge : '"{0}"儿童年龄必须是2-12之间(包含2和12)的自然数(半角)。',
					basicContent : '"{0}"允许值为,.?&#*+-_=:;@/中英数字空格(半角)',
					isModify : '"{0}"没有任何修改'
				};
				if (ag.extendRules
						&& typeof ag.extendRules.dialogMessages !== "undefined") {
					a.extend(true, U, ag.extendRules.dialogMessages)
				}
			}
			var f = function() {
				return a(X).find("input, select, textarea")
						.not(":submit, :reset, :image,:button").not(ag.ignore)
			};
			var R = function(ai) {
				var aj = {};
				var i = a(ai).attr("class");
				i && a.each(i.split(" "), function() {
							if (this in V) {
								a.extend(aj, V[this])
							}
						});
				return aj
			};
			var G = function(ak, al) {
				var aj = ak;
				if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(aj)) {
					return false
				}
				var ar = true;
				var ap = (new Date().getFullYear() - 0);
				var i = aj.split(/-/);
				var an = i[0] - 0;
				var am = i[1] - 0;
				var ao = i[2] - 0;
				var aq = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				var ai = function() {
					return (an % 400 == 0)
							|| ((an % 4 == 0) && (an % 100 != 0))
				};
				if (!al && (an < ap - 20 || an > ap + 20)) {
					ar = false
				}
				if (am > 12 || am < 1) {
					ar = false
				}
				if (aq[am] < ao || ao < 1 || ao > 31) {
					ar = false
				}
				if (am == 2 && !ai() && ao > 28) {
					ar = false
				}
				return ar
			};
			var ac = function(am, i, ai, ak) {
				var al = a(ai).val();
				if (typeof i[am] != undefined) {
					i[am] = true;
					if (ak) {
						var aj = ak.type;
						if (am === "trimAll" && ak && aj === "keyup") {
							al = al.replace(/\s{1,}/g, "");
							a(ai).val(al)
						} else {
							if (am === "trim" && ak
									&& (aj === "change" || aj === "focusout")) {
								al = a.trim(al);
								a(ai).val(al)
							} else {
								if (am === "upper"
										&& ak
										&& (aj === "change" || aj === "focusout")) {
									a(ai).val(al.toUpperCase())
								} else {
									if (am === "trim0" && ak && aj === "keyup") {
										al = al.replace(/^0{1,}/g, "");
										a(ai).val(al)
									} else {
										if (am === "toRequired" && ak
												&& aj === "focusin") {
											if (al !== "") {
												i.required = true;
												a(ai).addClass("tuiRequired")
											}
										}
									}
								}
							}
						}
					} else {
						if (typeof ak === "undefined") {
							if (am === "trimAll") {
								al = al.replace(/\s{1,}/g, "");
								a(ai).val(al)
							} else {
								if (am === "trim") {
									al = a.trim(al);
									a(ai).val(al)
								} else {
									if (am === "upper") {
										a(ai).val(al.toUpperCase())
									} else {
										if (am === "trim0") {
											al = al.replace(/^0{1,}/g, "");
											a(ai).val(al)
										}
									}
								}
							}
						}
					}
				}
				return i
			};
			var N = function(al, ai, aj) {
				var ak = a(ai).val();
				var i = null;
				if (al === "citycode" && aj && aj.type === "keyup") {
					i = ae.citycodeKeyUp(ak, ai)
				} else if (al === "citycode" && aj && aj.type === "keyup") {
					i = ae.citycodeKeyUp(ak, ai)
				} else {
					if (al === "air" && aj && aj.type === "keyup") {
						i = ae.airKeyUp(ak, ai)
					} else {
						if (al === "fltnum" && aj && aj.type === "keyup") {
							i = ae.fltnumKeyUp(ak, ai);
							if (ak.length > 7) {
								i = false
							}
						}
					}
				}
				return i
			};
			var l = function(i) {
				if (typeof a(i).siblings().filter("input." + J)[0] !== "object") {
					a(i).siblings().filter(ag.errorElement).remove();
					a(i).siblings().filter("." + t).remove()
				}
			};
			var r = function(i, ai) {
				a(i).removeClass(J).removeClass(ag.infoClass);
				if (ai) {
					a(i).siblings().filter(ag.errorElement).remove();
					if (a(i).parent().filter("span").length) {
						var aj = Z(i.name);
						if (aj) {
							aj.unwrap()
						}
					}
				}
				if (p && h && g.get(0)) {
					g.hide()
				}
			};
			var v = function(al, at, ap, i) {
				var ak = ag.errorElement;
				var am = ag.errorClass;
				var ai = ag.infoClass;
				var ar = ag.isLabelError;
				var ao = false;
				if (am && z && am === ap) {
					ao = true
				}
				if (!ar && am === ap) {
					l(al);
					return
				}
				var aq = a(al).parent().find(ak);
				var aj = function() {
					var ax = a(al).position();
					var au = ax.left;
					var aw = ax.top + a(al).innerHeight() + 9;
					var av = a(al).parent().find("." + t);
					if (!av || !av.length) {
						av = a("<div class='"
								+ t
								+ "' style='position:absolute;z-index:11;'></div>");
						a(al).parent().append(av)
					}
					av.css({
								left : parseInt(au + 15) + "px",
								top : parseInt(aw - 6) + "px",
								margin : 0
							});
					aq.removeClass(am).addClass(ai);
					aq.css({
								left : au + "px",
								top : aw + "px",
								margin : 0
							})
				};
				var an = function() {
					a(al).parent().find("." + t).remove();
					aq.css({
								left : "",
								top : "",
								margin : ""
							})
				};
				if (aq.length) {
					aq.removeClass().addClass(ap);
					aq.html("");
					aq.attr("generated") && aq.append(at);
					if (ao) {
						aq.prepend('<span class="' + z
								+ '" style="margin:-1px 6px 0 0;"></span>')
					}
				} else {
					aq = a("<"
							+ ak
							+ " style='position:absolute;z-index:10;width:auto;height:auto;'/>")
							.attr({
										"for" : j(al),
										generated : true
									}).addClass(ap).html(at || "");
					if (ao) {
						aq.prepend('<span class="' + z
								+ '" style="margin:-1px 6px 0 0;"></span>')
					}
					a(al).parent().append(aq)
				}
				if (!ao && K) {
					aj()
				} else {
					if (ao && C) {
						aj()
					} else {
						if (!K || !C) {
							an()
						}
					}
				}
			};
			var j = function(i) {
				return (H(i) ? i.name : i.id || i.name)
			};
			var H = function(i) {
				return /radio|checkbox/i.test(i.type)
			};
			var Z = function(i) {
				if (!i) {
					return null
				}
				return a(document.getElementsByName(i)).map(function(ai, aj) {
							return aj.name == i && aj || null
						})
			};
			var M = function() {
				a(X).find("input, select, textarea")
						.not(":submit, :reset, :image, [disabled],:button")
						.removeClass(ag.errorClass)
			};
			var Q = function(i) {
				i.each(function(ai) {
							l(this);
							r(this, H(this))
						})
			};
			var ah = function(ak, ai) {
				switch (ai.nodeName.toLowerCase()) {
					case "select" :
						return a("option:selected", ai).length;
					case "input" :
						if (H(ai)) {
							var aj = Z(ai.name);
							if (!aj) {
								return -1
							}
							var i = aj.filter(":checked").length;
							return i
						}
				}
				return ak.length
			};
			var W = function() {
				if (arguments.length == 0) {
					return ""
				}
				var ak = arguments[0];
				var ai = ak.match(/\{[0-9]{1,}\}/g);
				for (var aj = 0, al = ai.length; aj < al; aj++) {
					ak = ak.replace(ai[aj], arguments[aj + 1])
				}
				return ak
			};
			var F = function(aw, am, aq, ap, al, an) {
				var au = a("#" + aw), ao = a("#" + am), ax = "", ai = au.val(), ak = ao
						.val();
				if (au.hasClass("tuiRequired") && ao.hasClass("tuiRequired")) {
					if (ak == "" && ai == "") {
						return ""
					}
				} else {
					if (!ak || !ai) {
						return ""
					}
				}
				var ar = function() {
					var aA = "";
					var az = a("#" + am).attr(E);
					var ay = a("#" + aw).attr(E);
					if (aa) {
						aA = W(U[ap] + "</br>", az, ay)
					} else {
						aA = W(L[ap], az, ay)
					}
					return aA
				};
				ao.removeClass(aq);
				au.removeClass(aq);
				if (ap === "greaterEqual") {
					var aj = ak.replace(/[-: ]/g, "");
					aj = aj.replace(/[a-zA-Z]/g, "");
					var av = ai.replace(/[-: ]/g, "");
					av = av.replace(/[a-zA-Z]/g, "");
					if (aj - av < 0) {
						ax = ar()
					}
				} else {
					if (ap === "equal") {
						if (ak !== ai) {
							ax = ar()
						}
					} else {
						if (ap === "notEqual") {
							if (ak === ai) {
								ax = ar()
							}
						} else {
							if (ap === "greater") {
								var aj = ak.replace(/[-: ]/g, "");
								aj = aj.replace(/[a-zA-Z]/g, "");
								var av = ai.replace(/[-: ]/g, "");
								av = av.replace(/[a-zA-Z]/g, "");
								if (aj - av <= 0) {
									ax = ar()
								}
							}
						}
					}
				}
				if (!an) {
					an = null
				}
				if (ax === "") {
					if (al && al.id !== au.get(0).id) {
						var at = au.get(0);
						r(at, false);
						l(at);
						A(at, J, an, true)
					} else {
						if (al && al.id !== ao.get(0).id) {
							var i = ao.get(0);
							r(i, false);
							l(i);
							A(i, J, an, true)
						}
					}
				}
				return ax
			};
			var O = function(ak, al) {
				var ai = D;
				var ar = ae.required;
				var an = "";
				var au = function(i, aG) {
					var aD = aG.length, az = "", aC = false, aE = "";
					for (var aB = 0; aB < aD; aB++) {
						var aF = aG[aB];
						var aA = a("#" + aF);
						if (aB == aD - 1) {
							az += '"' + aA.attr(E) + '"必须同时填写。'
						} else {
							az += '"' + aA.attr(E) + '"、'
						}
						if (!aC) {
							ax = ar(aA.val(), aA.get(0));
							if (aB == 0) {
								aE = ax
							}
						}
						if (aE != ax) {
							aC = true
						}
						aE = ax
					}
					if (!aC) {
						az = ""
					}
					return az
				};
				for (var aq = 0; aq < ai.length; aq++) {
					var ay = ai[aq];
					var ax = "";
					var av = "";
					var ap = false;
					var aj = "";
					var at = ay.length;
					for (var ao = 0; ao < at; ao++) {
						var aw = ay[ao];
						var am = a("#" + aw);
						if (!al && ak && ak == aw) {
							aj = au(ak, ay);
							return aj;
							break
						} else {
							if (al) {
								if (ao == at - 1) {
									aj += '"' + am.attr(E) + '"必须同时填写。'
								} else {
									aj += '"' + am.attr(E) + '"、'
								}
								if (!ap) {
									ax = ar(am.val(), am.get(0));
									if (ao == 0) {
										av = ax
									}
								}
								if (av != ax) {
									ap = true
								}
								av = ax
							}
						}
					}
					if (al && ap) {
						aj += "</br>"
					} else {
						if (al && !ap) {
							aj = ""
						}
					}
					an += aj
				}
				return an
			};
			var s = function(i) {
				if (!i) {
					return null
				}
				return a(X).find("[name=" + i + "]")
			};
			var S = function(ai, i) {
				var aj = s(ai.name);
				aj.wrapAll("<span class=" + i + "></span>")
			};
			var n = function(i) {
				if (q === null) {
					return false
				}
				if (B && B[i.id]) {
					return true
				} else {
					return false
				}
			};
			var c = function(i) {
				if (ab != null && m && m[i.id]) {
					return true
				} else {
					return false
				}
			};
			var k = function(aj, i, ak) {
				var ai = {
					trimAll : false,
					trim : false,
					upper : false,
					trim0 : false,
					toRequired : false
				};
				var am = R(aj);
				for (var al in am) {
					ai = ac(al, ai, aj, ak)
				}
			};
			var A = function(ak, aC, aF, au, aA) {
				if (n(ak)) {
					return true
				}
				if (ab != null && !c(ak)) {
					return true
				}
				var at = false;
				if (H(ak)) {
					at = true
				}
				var ar = {
					required : false,
					trimAll : false,
					trim : false,
					upper : false,
					trim0 : false,
					toRequired : false
				};
				var aw = true;
				var av = R(ak);
				var az = "";
				var ap = "";
				for (var aq in av) {
					ar = ac(aq, ar, ak, aF);
					if (aq === "toRequired" && ar.toRequired && ar.required) {
						aq = "required";
						av.required = true
					}
					var aD = a(ak).val();
					var ai = a(ak).attr(E);
					var aB = N(aq, ak, aF);
					if (aB !== null) {
						aw = aB;
						if (aw === false && h) {
							az += L[aq] + "，"
						}
						if (aw === false && aa) {
							ap += W(U[aq], ai) + "</br>"
						}
					} else {
						if (av[aq] === true && typeof ae[aq] == "function") {
							aw = ae[aq](aD, ak);
							if (aw === false && h) {
								az += L[aq] + "，"
							}
							if (aw === false && aa) {
								ap += W(U[aq], ai) + "</br>"
							}
						}
					}
					if (aw === false && ar.required) {
						break
					}
				}
				if (h && aA && D && typeof O === "function") {
					var aG = O(ak.id, false);
					az += aG
				}
				if (ar.required === false && !at) {
					var ay = a(ak).val();
					if (!ae.required(ay, ak)) {
						az = "";
						ap = "";
						if (aG) {
							az = aG
						}
					}
				}
				if (!au) {
					var aj = ag.greaterEqual, aJ = ag.equal, ao = ag.notEqual, an = ag.greater;
					var am = function(aK) {
						var aL = F(i, aH, aC, aK, ak, aF);
						if (h && aL != "") {
							az += aL + "，"
						}
						if (aa && aL != "") {
							ap += aL + "</br>"
						}
					};
					if (aj != "" && typeof aj === "object") {
						for (var aH in aj) {
							var ax = false;
							var i = aj[aH];
							if (h && i == a(ak).get(0).id) {
								ax = true
							}
							if (aH == a(ak).get(0).id || ax) {
								am("greaterEqual")
							}
						}
					}
					if (an && an != "" && typeof an === "object") {
						for (var aH in an) {
							var ax = false;
							var i = an[aH];
							if (h && i == a(ak).get(0).id) {
								ax = true
							}
							if (aH == a(ak).get(0).id || ax) {
								am("greater")
							}
						}
					}
					if (ao != "" && typeof ao === "object") {
						for (var aH in ao) {
							var i = ao[aH];
							if (aH === a(ak).get(0).id || i === a(ak).get(0).id) {
								am("notEqual")
							}
						}
					}
					if (aJ != "" && typeof aJ === "object") {
						for (var aH in aJ) {
							var i = aJ[aH];
							if (aH === a(ak).get(0).id || i === a(ak).get(0).id) {
								am("equal")
							}
						}
					}
				}
				if (h && ag.extend && typeof ag.extend == "object") {
					var aI = ag.extend;
					for (var aE in aI) {
						if (a(ak).get(0).id == aE) {
							var al = aI[aE].call();
							if (al && al.labelMessages
									&& al.labelMessages != "") {
								az += al.labelMessages + "，"
							}
						}
					}
				}
				d += ap;
				r(ak, at);
				if (h && az != "") {
					az = az.replace(/，$/, "");
					if (at) {
						S(ak, aC)
					} else {
						a(ak).addClass(aC)
					}
					v(ak, az, aC, aF);
					az = "";
					ap = "";
					return false
				} else {
					if (aa && ap != "") {
						if (at) {
							S(ak, aC)
						}
						a(ak).addClass(aC);
						ap = "";
						return false
					} else {
						l(ak);
						return true
					}
				}
			};
			var y = function() {
				var aj = [];
				var i = ag.extend;
				for (var ai in i) {
					aj.push(i[ai].call())
				}
				if (aj.length > 0) {
					return aj
				} else {
					return ""
				}
			};
			var x = f(), af = ag.infoClass, J = ag.errorClass, Y = ag.submitId;
			M();
			if (ag.isClearError) {
				Q(x);
				return
			}
			if (h) {
				x.each(function(i) {
							o(":text,:password,:file,textarea",
									"keyup.tuiValidator focusin.tuiValidator",
									A, this, af);
							o(
									":text,:password,:file,select,textarea",
									"focusout.tuiValidator change.tuiValidator",
									A, this, J);
							o(":radio,:checkbox", "click.tuiValidator", A,
									this, J)
						})
			}
			if (aa && !h) {
				x.each(function(i) {
							o(
									":text, :password, :file, select, textarea",
									"focusout.tuiValidator change.tuiValidator",
									k, this, J)
						})
			}
			function o(ak, al, aj, ai, i) {
				a(ai).off(al).on(al + " tuiValidator", function(am) {
							var an = a(am.target);
							if (an.is(ak)) {
								aj.call(an, ai, i, am)
							}
						})
			}
			var u = ag.submitHandler;
			if (ag.onsubmit && u) {
				if (b) {
					if (w(x)) {
						u.call(X, a(X))
					}
				} else {
					if (document.getElementById(Y) && typeof document.getElementById(Y) === "object") {
						a("#" + Y).off("click.tuiValidator").on("click.tuiValidator", function(i) {
							i.preventDefault ? i.preventDefault() : i.returnValue = false;
							if (w(x)) {
								u.call(X, a(X))
							}
						});
					} else {
						this.find("input, button").filter(":submit").
						   off("click.tuiValidator").on("click.tuiValidator", function(i) {
								i.preventDefault ? i.preventDefault() : i.returnValue = false;
								if (w(x)) {
									u.call(X, a(X))
								}
							})
					}
				}
			}
			
			//支持动态的添加table表单
		    a(document).delegate("table tr", "click", function() {
		    	x = f();
				M();
				if (ag.isClearError) {
					Q(x);
					return
				}
				if (h) {
					x.each(function(i) {
						o(":text,:password,:file,textarea",
								"keyup.tuiValidator focusin.tuiValidator",
								A, this, af);
						o(
								":text,:password,:file,select,textarea",
								"focusout.tuiValidator change.tuiValidator",
								A, this, J);
						o(":radio,:checkbox", "click.tuiValidator", A,
								this, J)
					});
				}
				if (aa && !h) {
					x.each(function(i) {
						o(":text, :password, :file, select, textarea",
						  "focusout.tuiValidator change.tuiValidator",
						   k, this, J)
					});
				}
		    });
			
			function w(aq) {
				var am = ag.disabledAttr;
				var ak = a("#" + Y).attr(am);
				if (ak && ak === "true") {
					return false
				}
				var ar = true;
				d = "";
				aq.each(function(i) {
							if (!A(this, ag.errorClass, null, null, true)) {
								ar = false
							}
						});
				var ap = ag.extend;
				if (aa && ap && ap !== "" && typeof ap === "object") {
					var ao = y();
					for (var al = 0; al < ao.length; al++) {
						if (ao[al] && ao[al].dialogMessages
								&& ao[al].dialogMessages != "") {
							ar = false;
							d += ao[al].dialogMessages + "<br>"
						}
					}
				}
				if (aa && D && typeof O === "function") {
					d += O(null, true);
					if (d != "") {
						ar = false
					}
				}
				var an = ag.extendSubmit;
				if (an
						&& an != ""
						&& Object.prototype.toString.call(an) === "[object Array]") {
					for (var al = 0; al < an.length; al++) {
						var ai = an[al].call();
						if (Object.prototype.toString.call(ai) === "[object Boolean]"
								&& !ai) {
							ar = false
						}
					}
				}
				if (aa && !P && d != "") {
					if (typeof ag.dialogMethod === "function") {
						ag.dialogMethod.call(null, d)
					} else {
						if (ag.dialogMethod == ""
								&& typeof a.showTuiMessageAlert === "function") {
							a.showTuiMessageAlert(d, null, 470, 200)
						} else {
							if (ag.dialogMethod == ""
									&& typeof a.showTsInfoDialog === "function") {
								top.window.$.showTsInfoDialog(d, 470, 200)
							} else {
								alert(d)
							}
						}
					}
					d = ""
				} else {
					if (aa && P && d != "") {
						d = d.replace(/。/g, "；");
						d = d.replace(/<br>/g, "");
						d = d.replace(/；$/g, "。");
						P.empty();
						P.append(d);
						d = ""
					}
				}
				if (p && !ar && h && g && g.get(0)) {
					var aj = a(window).width() / 2 - 110;
					g.css({
								left : aj + "px"
							});
					g.html("");
					g.append(I);
					g.show()
				}
				return ar
			}
		}
	})
})((jQuery));


});