/*!
 * jQuery Validation Plugin v1.14.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2015 Jörn Zaefferer
 * Released under the MIT license
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "./jquery.validate"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {
	(function() {
		function stripHtml(value) {
			// remove html tags and space chars
			return value.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
			// remove punctuation
			.replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
		}
		$.validator.addMethod("maxWords", function(value, element, params) {
			return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
		}, $.validator.format("请输入最多 {0} 个字."));
		$.validator.addMethod("minWords", function(value, element, params) {
			return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
		}, $.validator.format("请输入最少 {0} 个字."));
		$.validator.addMethod("rangeWords", function(value, element, params) {
			var valueStripped = stripHtml(value),
				regex = /\b\w+\b/g;
			return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
		}, $.validator.format("请输入 {0} 到 {1} 个字."));
	}());


	var getDate = function (str) {
		var strs = str.split('-');
		var year = strs[0];
		var month = strs[1];
		var day = strs[2];
		return new Date(year, month-1, day);
	};
	// TODO check if value starts with <, otherwise don't try stripping anything
	$.validator.addMethod("strippedminlength", function(value, element, param) {
		return $(value).text().length >= param;
	}, $.validator.format("请输入至少 {0} 个字符"));

	$.validator.addMethod("integer", function(value, element) {
		return this.optional(element) || /^-?\d+$/.test(value);
	}, "只能输入整数");

	$.validator.addMethod("positiveInteger", function(value, element) {
		return this.optional(element) || /^[1-9]{1}[0-9]{0,}$/.test(value);
	}, "只能输入正整数");

	$.validator.addMethod("alphanumeric", function(value, element) {
		return this.optional(element) || /^\w+$/i.test(value);
	}, "请输入字母、数字、下划线");

	$.validator.addMethod("letter", function(value, element) {
		return this.optional(element) || /^[a-zA-Z]+$/i.test(value);
	}, "只能输入字母");

	$.validator.addMethod("lettersOrNumber", function(value, element) {
		return this.optional(element) || /^[A-Za-z0-9]{0,}$/i.test(value);
	}, "只能输入字母、数字");
	//
	$.validator.addMethod("letterswithbasicpunc", function(value, element) {
		return this.optional(element) || /^[a-z\-.,()'"\s]+$/i.test(value);
	}, "只能输入字母或标点符号");

	$.validator.addMethod("dateNL", function(value, element) {
		return this.optional(element) || /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(value);
	}, $.validator.messages.date);
	$.validator.addMethod("nowhitespace", function(value, element) {
		return this.optional(element) || /^\S+$/i.test(value);
	}, "不能输入空格");
	jQuery.validator.addMethod( "notEqualTo", function( value, element, param ) {
		return this.optional(element) || !$.validator.methods.equalTo.call( this, value, element, param );
	}, "请输入不同的值." );

	$.validator.addMethod("time", function(value, element) {
		return this.optional(element) || /^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test(value);
	}, "请输入合法时间, 从00:00 到 23:59");

	$.validator.addMethod("time12h", function(value, element) {
		return this.optional(element) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(value);
	}, "请输入合法时间 0到12之间 am/pm");

	/**
	 * Dutch phone numbers have 10 digits (or 11 and start with +31).
	 */
	$.validator.addMethod("phoneNL", function(value, element) {
		return this.optional(element) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9]){8}$/.test(value);
	}, "请输入有效的电话号码.");
	$.validator.addMethod("mobileNL", function(value, element) {
		return this.optional(element) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)6((\s|\s?\-\s?)?[0-9]){8}$/.test(value);
	}, "请输入有效的手机号");
	$.validator.addMethod("ipv4", function(value, element) {
		return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
	}, "请输入合法的ipv4地址.");

	$.validator.addMethod("ipv6", function(value, element) {
		return this.optional(element) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(value);
	}, "请输入合法的ipv6地址.");

	// same as url, but TLD is optional
	$.validator.addMethod("url2", function(value, element) {
		return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
	}, $.validator.messages.url);


	/**下部分是oc特有定制的校验 start**/
	$.validator.addMethod("areacode", function(value, element) {
		return this.optional(element) || /^[1-3]{1}$/i.test(value);
	}, "请输入正确的大区代码");

	$.validator.addMethod("citycode", function(value, element) {
		return this.optional(element) || /^[A-Z]{3}$/i.test(value);
	}, "请输入正确的城市三字码");

	$.validator.addMethod("airportcode", function(value, element) {
		return this.optional(element) || /^[A-Z]{3}$/i.test(value);
	}, $.validator.messages.url);

	$.validator.addMethod("countrycode", function(value, element) {
		return this.optional(element) || /^[A-Z]{2}$/i.test(value);
	}, "请输入正确的国家二字码");

	$.validator.addMethod("statecode", function(value, element) {
		return this.optional(element) || /^[A-Z]{2}$/i.test(value);
	}, "请输入正确的州二字码");

	$.validator.addMethod("zonecode", function(value, element) {
		return this.optional(element) || /^[0-9]{3}$/i.test(value);
	}, "请输入正确的区域代码");

	$.validator.addMethod("office", function(value, element) {
		return this.optional(element) || /^[A-Za-z]{3}[0-9]{3}$/g.test(value);
	}, "前面3位字母后面3位数字(半角)");


	$.validator.addMethod("iatanum", function(value, element) {
		return this.optional(element) || /^[0-9]{7}$/i.test(value);
	}, "请输入正确的iata号");
	
	$.validator.addMethod("air", function(value, element) {
		return this.optional(element) || /^[a-zA-Z]{2}$|^[a-zA-Z]{1}[0-9]{1}$|^[0-9]{1}[a-zA-Z]{1}$/.test(value);
	}, "请输入正确的航空公司二字码");

	$.validator.addMethod("seatcode", function(value, element) {
		return this.optional(element) || /^[A-Z]{1}$/i.test(value);
	}, "请输入正确的座位属性");


	//当是否收费选择为D、O时子代码只能为ODF
	$.validator.addMethod("chargeDO", function(value, element) {
		return this.optional(element) || /^0DF$/i.test(value);
	}, "子代码只能为[ 0DF ]");


	$.validator.addMethod("bigger", function(value, element,param) {
		var target = $( param );
		var startStr = target.val() ;
		var flag = true ;
		if(!isNaN(startStr)&&!isNaN(value)){//都为数值时
			var start = parseFloat(target.val()) ;
			var end = parseFloat(value) ;
			flag = end >= start ;
		}
		return this.optional(element) || flag;
	}, "结束值不能小于起始值");

	$.validator.addMethod("smaller", function(value, element,param) {
		var target = $( param );
		var endStr = target.val() ;
		var flag = true ;
		if(!isNaN(endStr)&&!isNaN(value)){//都为数值时
			var start = parseFloat(value) ;
			var end = parseFloat(endStr) ;
			flag = (start <= end) ;
		}
		return this.optional(element) || flag;
	}, "起始值不能大于结束值");


	$.validator.addMethod("biggerDate", function(value, element,param) {
		var target = $(param);
		var startStr = target.val() ;
		var flag = true ;
		var startDate = getDate(startStr) ;
		var endDate = getDate(value) ;
		if(startDate>endDate){
			flag = false;
		}
		return this.optional(element) || flag;
	}, "结束日期要大于终止日期");


	$.validator.addMethod("biggerThanCurrent", function(value, element) {
		var currDate = new Date();
		currDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
		var valueDate = getDate(value) ;
		return this.optional(element) || valueDate>=currDate;
	}, "必须大于当前日期");



	$.validator.addMethod("biggerTime", function(value, element) {
		var target = $(param);
		var startStr = target.val() ;
		var endStr = value ;
		var flag = true ;
		if(!isNaN(startStr)&&!isNaN(endStr)){
			var n1 = parseInt(startStr) ;
			var n2 = parseInt(endStr) ;
			if(n1>n2){
				flag = false;
			}
		}
		return this.optional(element) || flag;
	}, "结束时刻大于开始时刻");




	/**下部分是oc特有定制的校验 end**/

	/**
	* Return true if the field value matches the given format RegExp
	*
	* @example $.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
	* @result true
	*
	* @example $.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
	* @result false
	*
	* @name $.validator.methods.pattern
	* @type Boolean
	* @cat Plugins/Validate/Methods
	*/
	$.validator.addMethod("pattern", function(value, element, param) {
		if (this.optional(element)) {
			return true;
		}
		if (typeof param === "string") {
			param = new RegExp("^(?:" + param + ")$");
		}
		return param.test(value);
	}, "输入不合法.");

	/*$.validator.addMethod("zipcodeUS", function(value, element) {
		return this.optional(element) || /^\d{5}(-\d{4})?$/.test(value);
	}, "The specified US ZIP Code is invalid");*/


}));







