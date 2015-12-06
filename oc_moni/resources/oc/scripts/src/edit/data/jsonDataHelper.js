define(function (require, exports, module) {

	module.exports = {
		getNoChargeNotAvailableList:function(servcieType){
			var tmp = servcieType || '' ;
			var retArr = [] ;
			var defaultArr = [{"name":"收费","value":""},{"name":"不适用","value":"X"},
		        {"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
		        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"},
		        {"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}] ;
			if(tmp=='A'){
				retArr = [{"name":"免费，不出EMD单","value":"F"},{"name":"免费，行李规则遵循市场方航空公司规则","value":"D"}] ;
			} else if (tmp=='B'){
				retArr = [{"name":"免费，不出EMD单","value":"F"}] ;
			}else if (tmp=='E'){
				retArr = [{"name":"不适用","value":"X"}] ;
			}else{
				retArr = defaultArr ;
			}
			return retArr ;
		},
		getSpecifiedServiceFeeAppList:function(serviceType){/**适用于**/
			var tmp = serviceType || '' ;
			var arr = [{"name":"每一个票价组成部分算一次服务费用","value":"1"},
  				{"name":"每一个票价组成部分算一半的服务费用","value":"2"},{"name":"每用一次服务算一次服务费用","value":"3"},
  				{"name":"匹配的部分航程算一次服务费用","value":"4"},{"name":"服务收费对应每张售票","value":"5"}] ;
			switch(tmp){
			case 'F':
			  arr = [{"name":"每一个票价组成部分算一次服务费用","value":"1"},
  				{"name":"每一个票价组成部分算一半的服务费用","value":"2"},{"name":"每用一次服务算一次服务费用","value":"3"},
  				{"name":"匹配的部分航程算一次服务费用","value":"4"},{"name":"服务收费对应每张售票","value":"5"}] ;
			  break;
			case 'M':
			  arr = [{"name":"每用一次服务算一次服务费用","value":"3"}] ;
			  break;
		    case 'R':
			   arr = [{"name":"服务收费对应每张售票","value":"5"}] ;
			  break;
			case 'T':
			   arr = [{"name":"每用一次服务算一次服务费用","value":"3"},{"name":"服务收费对应每张售票","value":"5"}] ;
			  break;
			case 'A':
			  arr=[] ;
			  break;
			case 'B':
			  arr=[] ;
			  break;
			case 'C':
			  arr=[
			  {"name":"按托运点收费","value":"3"},{"name":"按全行程收费","value":"4"},
  				{"name":"每公斤按公布运价的0.5%收费","value":"H"},{"name":"每公斤按公布运价的1%收费","value":"C"},
  				{"name":"每公斤按公布运价的1.5%收费","value":"P"},{"name":"按每公斤收费","value":"K"},
  				{"name":"按每5公斤收费","value":"F"}] ;
			  break;
			case 'E':
			  arr=[] ;
			  break;
			case 'P':
			  arr=[
			  {"name":"按托运点收费","value":"3"},{"name":"按全行程收费","value":"4"},
  				{"name":"每公斤按公布运价的0.5%收费","value":"H"},{"name":"每公斤按公布运价的1%收费","value":"C"},
  				{"name":"每公斤按公布运价的1.5%收费","value":"P"},{"name":"按每公斤收费","value":"K"},
  				{"name":"按每5公斤收费","value":"F"}] ;
			  break;
			default:
			  console.info('传入的serviceType有问题') ;
			}	
			return arr ;
		}
	} ;

}) ;