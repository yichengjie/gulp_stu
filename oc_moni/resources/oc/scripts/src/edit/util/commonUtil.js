define(function (require, exports, module) {
	var _ = require('underscore') ;
	module.exports = {
		checkCommonServcie:function(serviceType){//判断服务类型是不是一般附加服务
			var arr = ['F','M','R','T'] ;	
			var flag = _.contains(arr, serviceType) ;
			return flag ;
		},
		checkBaggageServcie:function(serviceType){//判断服务类型是不是行李附加服务
			var arr = ['A','B','C','E','P'] ;
			var flag = _.contains(arr, serviceType) ;
			return flag ;
		},
		getFullDayOrMonthStr:function(dateOrMonthNum){//获得日或月的字符串
			if(dateOrMonthNum<10){
				return "0"+dateOrMonthNum ;
			}
			return dateOrMonthNum+"";
		}

	} ;
}) ;