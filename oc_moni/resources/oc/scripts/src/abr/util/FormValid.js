define(function(require, exports, module) {
	//var $ = require('jquery') ;
	var valid = {} ;
	//校验字符串不为空，如果为空:false,否则：true
	valid.strNotNull = function(str){
		var flag = false;
		str = valid.dealStr(str) ;
		if(str.length>0){
			flag = true ;
		}
		return flag; 
	}
	
	//字母或数字校验
	valid.strIsAlphanumeric = function(str){
		return /^[A-Za-z0-9]{0,}$/.test(str) ;
	}
	
	//短日期校验
	valid.strIsShortDate = function(str){
		var flag = false;
		flag = valid.strNotNull(str) ;
		if(flag){
			flag = G(str) ;
		}
		return flag ;
	}
	
	//数字校验
	valid.strIsDigital = function(str){
		return /^[0-9]{0,}$/.test(str)
	}
	
	
	valid.dealStr = function(str){
		if(str==null){
			return "" ;
		}else{
			return $.trim(str) ;
		}
	}
	
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
	
	return valid ;
}) ;