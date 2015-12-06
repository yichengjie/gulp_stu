define(function(require, exports, module) {
	
	 var $ = require('jquery');
	
	 $.fn.validationEngineLanguage=function() {
		
	 };
	
	 $.validationEngineLanguage={
		newLang : function() {
			$.validationEngineLanguage.allRules = {
				"required" : { // Add your regex rules here, you can take
					// telephone as an example
					"regex" : "none",
					"alertText" : "* 此处不可空白",
					"alertTextCheckboxMultiple" : "* 请选择一个项目",
					"alertTextCheckboxe" : "* 您必须钩选此栏",
					"alertTextDateRange" : "* 日期范围不可空白"
				},
				"requiredInFunction" : {
					"func" : function(field, rules, i, options) {
						return (field.val() == "test") ? true : false;
					},
					"alertText" : "* Field must equal test"
				},
				"dateRange" : {
					"regex" : "none",
					"alertText" : "* 无效的 ",
					"alertText2" : " 日期范围"
				},
				"dateTimeRange" : {
					"regex" : "none",
					"alertText" : "* 无效的 ",
					"alertText2" : " 时间范围"
				},
				"minSize" : {
					"regex" : "none",
					"alertText" : "* 最少 ",
					"alertText2" : " 个字符"
				},
				"maxSize" : {
					"regex" : "none",
					"alertText" : "* 最多 ",
					"alertText2" : " 个字符"
				},
				"groupRequired" : {
					"regex" : "none",
					"alertText" : "* 你必需选填其中一个栏位"
				},
				"min" : {
					"regex" : "none",
					"alertText" : "* 最小值為 "
				},
				"max" : {
					"regex" : "none",
					"alertText" : "* 最大值为 "
				},
				"past" : {
					"regex" : "none",
					"alertText" : "* 日期必需早于 "
				},
				"future" : {
					"regex" : "none",
					"alertText" : "* 日期必需晚于 "
				},
				"maxCheckbox" : {
					"regex" : "none",
					"alertText" : "* 最多选取 ",
					"alertText2" : " 个项目"
				},
				"minCheckbox" : {
					"regex" : "none",
					"alertText" : "* 请选择 ",
					"alertText2" : " 个项目"
				},
				"equals" : {
					"regex" : "none",
					"alertText" : "* 请输入与上面相同的密码"
				},
				"creditCard" : {
					"regex" : "none",
					"alertText" : "* 无效的信用卡号码"
				},
				"phone" : {
					// credit: jquery.h5validate.js / orefalo
					"regex" : /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
					"alertText" : "* 无效的电话号码"
				},
				"email" : {
					// Shamelessly lifted from Scott Gonzalez via the
					// Bassistance Validation plugin
					// http://projects.scottsplayground.com/email_address_validation/
					"regex" : /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
					"alertText" : "* 邮件地址无效"
				},
				"integer" : {
					"regex" : /^[\-\+]?\d+$/,
					"alertText" : "* 不是有效的整数"
				},
				"number" : {
					// Number, including positive, negative, and floating
					// decimal. credit: orefalo
					"regex" : /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
					"alertText" : "* 无效的数字"
				},
				"date" : {
					"regex" : /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
					"alertText" : "* 无效的日期，格式必需为 YYYY-MM-DD"
				},
				"ipv4" : {
					"regex" : /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
					"alertText" : "* 无效的 IP 地址"
				},
				"url" : {
					"regex" : /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
					"alertText" : "* Invalid URL"
				},
				"onlyNumberSp" : {
					"regex" : /^[0-9\ ]+$/,
					"alertText" : "* 只能填数字"
				},
				"onlyLetterSp" : {
					"regex" : /^[a-zA-Z\ \']+$/,
					"alertText" : "* 只接受英文字母大小写"
				},
				"onlyLetterNumber" : {
					"regex" : /^[0-9a-zA-Z]+$/,
					"alertText" : "* 不接受特殊字符"
				},
				// --- CUSTOM RULES -- Those are specific to the demos, they can
				// be removed or changed to your likings
				"ajaxUserCall" : {
					"url" : "ajaxValidateFieldUser",
					// you may want to pass extra data on the ajax call
					"extraData" : "name=eric",
					"alertText" : "* 此名称已被其他人使用",
					"alertTextLoad" : "* 正在确认名称是否有其他人使用，请稍等。"
				},
				"ajaxUserCallPhp" : {
					"url" : "phpajax/ajaxValidateFieldUser.php",
					// you may want to pass extra data on the ajax call
					"extraData" : "name=eric",
					// if you provide an "alertTextOk", it will show as a green
					// prompt when the field validates
					"alertTextOk" : "* 此帐号名称可以使用",
					"alertText" : "* 此名称已被其他人使用",
					"alertTextLoad" : "* 正在确认帐号名称是否有其他人使用，请稍等。"
				},
				"ajaxNameCall" : {
					// remote json service location
					"url" : "ajaxValidateFieldName",
					// error
					"alertText" : "* 此名称可以使用",
					// if you provide an "alertTextOk", it will show as a green
					// prompt when the field validates
					"alertTextOk" : "* 此名称已被其他人使用",
					// speaks by itself
					"alertTextLoad" : "* 正在确认名称是否有其他人使用，请稍等。"
				},
				"ajaxNameCallPhp" : {
					// remote json service location
					"url" : "phpajax/ajaxValidateFieldName.php",
					// error
					"alertText" : "* 此名称已被其他人使用",
					// speaks by itself
					"alertTextLoad" : "* 正在确认名称是否有其他人使用，请稍等。"
				},
				"validate2fields" : {
					"alertText" : "* 请输入 HELLO"
				},
				// tls warning:homegrown not fielded
				"dateFormat" : {
					"regex" : /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
					"alertText" : "* 无效的日期格式"
				},
				// tls warning:homegrown not fielded
				"dateTimeFormat" : {
					"regex" : /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
					"alertText" : "* 无效的日期或时间格式",
					"alertText2" : "可接受的格式： ",
					"alertText3" : "mm/dd/yyyy hh:mm:ss AM|PM 或 ",
					"alertText4" : "yyyy-mm-dd hh:mm:ss AM|PM"
				},
				"schemaError" : {
					"regex" : "[A-Z0-9]{2}$",
					"alertText" : "* 航空公司代码"
				},
				"userNameError" : {
					"regex" : "[a-zA-Z0-9_]{2,15}$",
					"alertText" : "* 2到15位字母数字组合"
				},
				"passwordError" : {
					"regex" : "none"

				},
				"only6Number" : {
					"regex" : /^[0-9\ ]{6}$/,
					"alertText" : "* 只能填6位数字"
				},
				"batch_comments" : {
					"regex" : /^.{0,50}$/,// /^[a-zA-Z0-9\u4E00-\u9FA5\uf900-\ufa2d\w]{1,
					// 50}$/,
					"alertText" : "* 不能超过50个字符"
				},
				"s5_commercialName" : {
					"regex" : /^.{0,30}$/,// /^[a-zA-Z0-9\u4E00-\u9FA5\uf900-\ufa2d\w]{0,
					// 30}$/,
					"alertText" : "* 不能超过30个字符"
				},
				"s5_ssrCode" : {
					"regex" : /^.{0,4}$/,
					"alertText" : "* 不能超过4个字符"
				},
				"s7_minPassengerAge" : {
					"regex" : /^[0-9]{0,2}$/,
					"alertText" : "* 不能超过2位数字"
				},
				"s7_tourCode" : {
					"regex" : /^.{0,15}$/,
					"alertText" : "* 不能超过15个字符"
				},
				"s7_specifiedServiceFeeMileage" : {
					"regex" : /^[0-9]{0,8}$/,
					"alertText" : "* 里程是数字且不能超过8位数字"
				},
				"s7_firstTravelYear" : {
					"regex" : /^[0-9]{2}$/,
					"alertText" : "* 2位数字"
				},
				"s7_firstTravelMonth" : {
					"regex" : /^(0[1-9]|1[0-2])$/,
					"alertText" : "* 01 - 12"
				},
				"s7_firstTravelDay" : {
					"regex" : /^((0[1-9])|((1|2)[0-9])|30|31)$/,
					"alertText" : "* 01 - 31"
				},
				"s7_geoSpecFromToWithin" : {
					"regex" : /^[1,2,W]{0,1}$/,
					"alertText" : "* 1,2,W or blank"
				},
				"s7_mileageMinimum" : {
					"regex" : /^[0-9]{0,6}$/,
					"alertText" : "* 不能超过6位数字"
				},
				"s7_198_cxr" : {
					"regex" : /^.{0,3}$/,
					"alertText" : "* 不能超过3个字符"
				},
				"s7_198_rbd" : {
					"regex" : /^[A-Z]{1}$/,
					"alertText" : "* 一位大写字母"
				},
				"s7_186_mktCarrier" : {
					"regex" : /^[A-Z0-9]{2}$/,
					"alertText" : "* 两位大写字母数字"
				},
				"s7_186_optCarrier" : {
					"regex" : /^[A-Z0-9]{2}$/,
					"alertText" : "* 两位大写字母数字"
				},
				"s7_186_fltNo" : {
					"regex" : /^([0-9]{4}|\*\*\*\*)$/,
					"alertText" : "* 4位数字或****"
				},
				"s7_170_saleGeographicPoint" : {
					"regex" : /^.{0,5}$/,
					"alertText" : "* 不能超过5个字符"
				},
				"s7_170_specFeeAmount" : {
					"regex" : /^((\d+.?\d+)|(\d+)){0,8}$/,
					"alertText" : "* 只能为整数或小数"
				},
				"s7_170_lessthan8" : {
					"regex" : /^.{0,8}$/,
					"alertText" : "* 不能超过8个字符"
				},
				"s7_170_specFeeCurrency" : {
					"regex" : /^.{0,3}$/,
					"alertText" : "* 不能超过3个字符"
				},
				"s7_183_carrierGds" : {
					"regex" : /^[A-Z0-9]{2}$/,
					"alertText" : "* 两位大写字母数字"
				},
				"s7_183_dutyFunctionCode" : {
					"regex" : /^.{0,2}$/,
					"alertText" : "* 不能超过2个字符"
				},
				"s7_183_geographicSpecification" : {
					"regex" : /^.{0,5}$/,
					"alertText" : "* 不能超过5个字符"
				},
				"s7_183_code" : {
					"regex" : /^.{0,8}$/,
					"alertText" : "* 不能超过8个字符"
				},
				"twoC" : {
					"regex" : /^([A-Z0-9*]{2}|\*)$/,
					"alertText" : "* 两位大写字母或数字"
				},
				"threeC" : {
					"regex" : /^([A-Z0-9*]{3}|\*)$/,
					"alertText" : "* 三位大写字母数字"
				},
				"subCode" : {
					"regex" : /^([A-Z0-9*]{3}|\*{0,3}|[A-Z0-9]{1}\*|\*[A-Z0-9]{1})$/,
					"alertText" : "* 三位字母数字或'*'"
				},
				"onlyNum" : {
					"regex" : /^[0-9]{0,6}$/,
					"alertText" : "* 只能为6位数字"
				},
				"s7_passengerOccurrence" : {
					"regex" : /^[0-9]{0,3}$/,
					"alertText" : "* 不超过3位数字"
				},
				"s7_tariff" : {
					"regex" : /^([0-9]{3}|PUB|PRI)$/,
					"alertText" : "* 001-999, PUB, PRI"
				},
				"s7_tariff_exclude000" : {
					"regex" : /^(?!000)$/,
					"alertText" : "* 001-999, PUB, PRI"
				},
				"s7_advancedPurchasePeriod" : {
					"regex" : /^([0-9]{0,3}|MON|TUE|WED|THU|FRI|SAT|SUN)$/,
					"alertText" : "* 三位数字或MON,</br>TUE,WED,THU,</br>FRI,SAT,SUN"
				},
				"s7_ruleBusterRuleMatchClass" : {
					"regex" : /^([A-Z0-9*]{8}|\*{0,8})$/,
					"alertText" : "* 8位大写字母数字"
				},
				"s7_172_accountCode" : {
					"regex" : /^[A-Z0-9*]{0,20}$/,
					"alertText" : "* 不超过20位字符"
				},
				"s7_173_ticketDesignator" : {
					"regex" : /^[A-Z0-9*]{0,10}$/,
					"alertText" : "* 不超过10位字符"
				},
				"s7_171_resFareClassCode" : {
					"regex" : /^.{0,16}$/,
					"alertText" : "* 不超过16个字符"
				},
				"s7_171_fareTypeCode" : {
					"regex" : /^.{0,3}$/,
					"alertText" : "* 不超过3个字符"
				},
				"s7_passengerTypeCode" : {
					"regex" : /^.{0,5}$/,
					"alertText" : "* 不超过5个字符"
				}
			};
		}
	};
	$.validationEngineLanguage.newLang();

});
