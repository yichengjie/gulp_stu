define(function(require, exports, module) {
	var app = angular.module("app.service",[]) ;
	app.factory('FormData', [ function(){
		return {
			id:'',
			action:'',
			carrCode:'',//航空公司
			contextPath:'',
			status:'1',//1:未生效的记录
			sequcenceNumber:'',//序列号
			serviceType:'*',//服务类型//  这个从哪里获取呢？
			subCode:'',//子代码，服务三字代码，【*】则为不做任何限制，ALL
			internationalTag:'',//行程种类,由行程判断得到   I=国际   D=国内（默认值）
			effDate:'',//生效日期
			discDate:'',//截止日期
			dataSource:'',//访问数据源,OPTSVC=ATPCO数据（默认值） TSKOC=航信数据
			publishObjectList:[
				//{"type":'V',"code":"001","selected":false},
				//{"type":'V',"code":"001","selected":true}
			]
		};
	}]) ;
	
	
	app.factory('ErrorData', [ function(){
		return {
			"internationalTag":{
				"tip":"必填",
				"flag":false
			},
			"dataSource":{
				"tip":"必填",
				"flag":false
			},
			"effDate":{
				"tip":"",
				"flag":false
			},
			"discDate":{
				"tip":"",
				"flag": false
			},
			"sequcenceNumber":{
				"tip":"",
				"flag":false
			},
			"subCode":{
				"tip":"",
				"flag":false
			}
		};
	}]) ;
	
}) ;