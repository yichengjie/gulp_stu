define('S7ValidateHelper',['commonUtil','underscore_gulp-seajs-cmobo_41','jsonDataHelper'],function (require, exports, module) {
	var commonUtil = require('commonUtil') ;
	var _ = require('underscore_gulp-seajs-cmobo_41') ;
	var jsonDataHelper = require('jsonDataHelper') ;

	module.exports = {
		changeServiceType:function(editScope,data,globalEditStatus){
			var serviceType = data.serviceType ;//serviceType
			//如果是免费则将下面的费用变为不可选择
			if(serviceType=='A'){
				data.noChargeNotAvailable = 'F' ;//设置为免费
			}else if (serviceType=='B'){
				data.noChargeNotAvailable = 'F' ;//设置为免费
			}else if (serviceType=='C'||serviceType=='P'){
				data.noChargeNotAvailable = '' ;//设置为收费
			}else if (serviceType=='E'){
				data.noChargeNotAvailable = 'X' ;//设置为收费
			}
			if(serviceType=='C'||serviceType=='P'){//收费一定为收费且不可编辑
				globalEditStatus.noChargeNotAvailable= false;
			}else{//可编辑
				globalEditStatus.noChargeNotAvailable= true;
			}
			//将是否检查库存设置为 ‘否’
			if(serviceType=='A'||serviceType=='B'||serviceType=='E'){
				data.availability = 'N' ;
				globalEditStatus.availability= false;
			}else{
				globalEditStatus.availability= true;
			}
			//免费/收费
			editScope.noChargeNotAvailableList.list= jsonDataHelper.getNoChargeNotAvailableList(serviceType) ;
			//适用于
			editScope.specifiedServiceFeeAppList.list = jsonDataHelper.getSpecifiedServiceFeeAppList(serviceType) ;
			//发送广播隐藏或显示组件
			editScope.$broadcast('serviceTypeChangeNotice','false') ;//scope.$broadcast('serviceTypeChangeNotice') ;	
		},
		changeNoChargeNotAvailable:function(editScope,data,globalEditStatus){/**当改变是否收费的时候*/
			var serviceType = data.serviceType ;
			var noChargeNotAvailable = data.noChargeNotAvailable ;
			//console.info('serviceType : ' + serviceType) ;
			//服务类型是不是行李附加服务
			var isBaggageFlag = commonUtil.checkBaggageServcie(serviceType) ;
			var in_flag = true ;
			if(isBaggageFlag){//如果为空表收费
				if(noChargeNotAvailable==''){//如果不为收费这下面的置空
					in_flag = true ;
				}else{//免费的时候需要清空填写的信息
					in_flag = false;//隐藏 适用于，里程，金额
				}
			}else{//一般附加服务
				var arr = ['X','E','F','G','H'] ;//dxef
				var flag2 = _.contains(arr, noChargeNotAvailable) ;	
				if(flag2){
					in_flag = false ;//隐藏
				}else{//如果为空表收费
					in_flag = true ;
				}
			}
			
			//var specifiedServiceFeeApp_specialFlag = true;
			//当收费类型为D/X/F/E时暂时不做区分是否为行李或则一般附加服务，这里全部都将适用于置为空
			//这个地方可能还存在一店暂时先把为d时适用于全部置空
			//specifiedServiceFeeApp_specialFlag = false ;//如果不为d，则进入其他的校验，按照其他的进行

			//当是否收费为D时  --行李适用范围必须为空
			if(noChargeNotAvailable=='D'){
				data.baggageTravelApplication = '' ;
				globalEditStatus.baggageTravelApplication = false;
			}else{
				globalEditStatus.baggageTravelApplication = true;
			}
			var freeBaggageAllowancePiecesFlag = true ;
			//当是否收费为D/O时行李件数必修为空,行李类型必须为A,行李子代码必须为0DF
			if(serviceType=='A'){
				if(noChargeNotAvailable=='D'||noChargeNotAvailable=='O'){
					freeBaggageAllowancePiecesFlag = false ;
				}
			}
			editScope.$broadcast('singleChangeByFlagNotice','freeBaggageAllowancePieces',freeBaggageAllowancePiecesFlag+'','false') ;//行李件数置为空
			editScope.$broadcast('singleChangeByFlagNotice','list170VOAndlist201VO',in_flag+'','false') ;//费用//in_fname,in_flag,needDigest
			editScope.$broadcast('singleChangeByFlagNotice','specifiedServiceFeeMileage',in_flag+'','false') ;//里程
			editScope.$broadcast('singleChangeByFlagNotice','specifiedServiceFeeApp',in_flag+'','false') ;//适用于
		},
		changeSpecifiedServiceFeeApp:function(editScope,data){/**当改变适用于的时候*/
			var ssfa = data.specifiedServiceFeeApp ;
			var in_flag = true ;
			//因为只有行李服务适用于才会有[H,C,P]，所以这里不需要判断serviceType是否为C，P
			if(ssfa=='H'||ssfa=='C'||ssfa=='P'){
				//收费字段必须为空，并且170或201必须为空
				//$scope.data.noChargeNotAvailable = '' ;//因为 当serviceType为cp是收费字段一定为空
				in_flag = false;
			}
			//console.info('serviceType : ['+serviceType+'] , ssfa : ['+ssfa+']  , in_flag : ['+in_flag+']' ) ;
			//$scope.FormEditStatusServcie.noChargeNotAvailable =in_flag;
			//170，201显示或隐藏
			editScope.$broadcast('singleChangeByFlagNotice','list170VOAndlist201VO',in_flag+'','false') ;
		}
	} ;

}) ;
define('commonUtil',['underscore_gulp-seajs-cmobo_41'],function (require, exports, module) {
	var _ = require('underscore_gulp-seajs-cmobo_41') ;
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
define('jsonDataHelper',function (require, exports, module) {

	module.exports = {
		getNoChargeNotAvailableList:function(serviceType){
			var tmp = serviceType || '' ;
			var retArr = [] ;//{"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}
			var defaultArr = [{"name":"收费","value":""},{"name":"不适用","value":"X"},
		        {"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
		        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"}] ;
			if(tmp=='A'){
				retArr = [{"name":"不适用","value":"X"},{"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
		        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"},
		        {"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}] ;
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
define('S7EditUtil',['S7ValidateHelper'],function (require, exports, module) {
	var validateHelper = require('S7ValidateHelper') ;
	/**
	 * 处理表单特殊数据
	 * @param {Object} formData
	 */
	var initOtherData = function (formData){
		//处理旅行起始日期
		if(formData.firstTravelYear!=''&&formData.firstTravelMonth!=''&&formData.firstTravelDay!=''){
			formData.travelStartDate = formData.firstTravelYear+'-' +formData.firstTravelMonth +'-' +formData.firstTravelDay ;
		}
		//处理旅行结束日期
		if(formData.firstTravelYear!=''&&formData.firstTravelMonth!=''&&formData.firstTravelDay!=''){
			formData.travelEndDate = formData.lastTravelYear+'-' +formData.lastTravelMonth +'-' +formData.lastTravelDay ;
		}
		//星期
		var dayofWake = formData.dayOfWeek ;
		var len = dayofWake.length ;
		for(var i = 0 ; i < len ; i++){
			 var s = dayofWake.charAt(i);
			 var tmpStr = 'w'+s ;
			 formData.dayOfWeekShow[tmpStr] = true ;//选中checkbox
		}
	};


	//这是一个私有的辅助方法
	var initTbData = function (list,curItem){
		if(list.length>0){
			curItem.showFlag = true ;
		}else{
			curItem.showFlag = false ;
		}
	};

	var initListData = function (s7VO,flagData){
		
		if(s7VO.list170VO.length>0){
			//170表格
			initTbData(s7VO.list170VO,flagData.tb170) ;
		}
		if(s7VO.list201VO.length>0){
			//201表格
			initTbData(s7VO.list201VO,flagData.tb170) ;//----11
		}
		//198
		initTbData(s7VO.list198VO,flagData.tb198) ;//----9
		//198_2
		initTbData(s7VO.list198UpgradeVO,flagData.tb198UpGrade) ;//----10

		//list183VO
		initTbData(s7VO.list183VO,flagData.tb183) ;  //-----1
		//list186VO
		initTbData(s7VO.list186VO,flagData.tb186) ; //-----7
		//geo1 //list178Loc1
		initTbData(s7VO.list178Loc1,flagData.tb178geo1) ;//--12
		//geo2 //list178Loc2
		initTbData(s7VO.list178Loc2,flagData.tb178geo2) ;//---13
		//geo3 //list178Loc3
		initTbData(s7VO.list178Loc3,flagData.tb178geo3) ;//----14
		//196//备注例外行李
		initTbData(s7VO.list196VO,flagData.tb196) ; //----8
		//165
		initTbData(s7VO.list165VO,flagData.tb165) ;//------6
		//171
		initTbData(s7VO.list171VO,flagData.tb171) ; //-----2
		initTbData(s7VO.list172VO,flagData.tb172) ; //-----3
		initTbData(s7VO.list173TicketVO,flagData.tb173Ticket) ;//------4
		initTbData(s7VO.list173TktVO,flagData.tb173Tkt) ;//-----5
		
	};


	var init4Validate = function(editScope,data,globalEditStatus){/**这里需要重置数据的原因是因为有些value会影响到别的控件的显示*/
		var statusDes = data.statusDes ;
		//当状态为3的时候，页面不可编辑
		if(statusDes=='3'){
			for(var cname in globalEditStatus){
				globalEditStatus[cname] = false;
			}
		}
		validateHelper.changeServiceType(editScope,data,globalEditStatus) ;
		validateHelper.changeNoChargeNotAvailable(editScope,data,globalEditStatus) ;
		validateHelper.changeSpecifiedServiceFeeApp(editScope,data) ;
	};


	//这边是要返回的方法的集合处
	var EditUtil = {
		initData:{/*初始化*/		
			initOtherData:initOtherData,
			initListData:initListData,
			init4Validate:init4Validate
		}

	} ;	

	return EditUtil ;
}) ;
define('editJsonData',function (require, exports, module) {
    var jsonDate = {
      advancedPurchasePeriodList:[//提前购票时间单位
        {"name":"分","value":"Nb"}, {"name":"小时","value":"Hb"},
        {"name":"天","value":"Db"}, {"name":"月","value":"Mb"}
      ],//advancedPurchasePeriodList end
      flagData:{
        "t170": {"flag": true,"title": "收起表格"},
  			/*"t201": {"flag": false,"title": "填写表格"},*/
  			"t198": {"flag": false,"title":"填写表格"},
  			"t198Upgrade": {"flag": false,"title":"填写表格"},
  			"t183": {"flag": false,"title":"填写表格"},
  			"t186": {"flag": false,"title":"填写表格"},
  			"t196":{"flag":false,"title":"填写表格"},
  			"t165":{"flag":false,"title":"自定义区域"},
  			"t171":{"flag":false,"title":"填写表格"},
  			"t172":{"flag":false,"title":"填写表格"},
  			"t173Ticket":{"flag":false,"title":"填写表格"},
  			"t173Tkt":{"flag":false,"title":"填写表格"},//list173TktVO
  			"geo1":{"flag":false,"title":"自定义区域"},
  			"geo2":{"flag":false,"title":"自定义区域"},
  			"geo3":{"flag":false,"title":"自定义区域"}
      },//flagData end
      tableData:{
        "t170":{
  				"titieList":[{"title":"销售地类型"},{"title":"销售地代码"},{"title":"金额"},{"title":"货币类型"}],
  				"addObj":{"saleGeographicPointType":"","saleGeographicPoint":"","specFeeAmount":"","specFeeCurrency":"CNY","selected":true}
  			},
  			"t198":{
  				"titieList":[{"title":"市场方/承运方"},{"title":"航空公司"},{"title":"订座舱位1"},
  				             {"title":"订座舱位2"},{"title":"订座舱位3"},{"title":"订座舱位4"},
  				             {"title":"订座舱位5"}],
  				"addObj":{"mktOp":"","cxr":"","rbd1":"","rbd2":"","rbd3":"","rbd4":"","rbd5":"","selected":true}
  			},
        "t198UpGrade":{
          "titieList":[],
          "addObj":{"cxr":"","rbd1":"","rbd2":"","rbd3":"","rbd4":"","rbd5":"","selected":true} 
        },
  			"t196":{
  				"titieList":[{"title":"行李件数"},{"title":"行李子代码"}],
  				"addObj":{"count":"","code":"","selected":true}
  			},
  			"t186":{
  				"titieList":[{"title":"市场方"},{"title":"承运方"},{"title":"航班号"}],
  				"addObj":{"mktCarrier":"","optCarrier":"","fltNo1":"","fltNo2":"","selected":true}
  			},
  			"t183":{
  				"titieList":[{"title":"旅行社"},{"title":"航空公司/分销商"},{"title":"职责/功能码"},
  				             {"title":"区域类型"},{"title":"区域代码"},{"title":"发布对象类型"},
  				             {"title":"发布对象代码"},{"title":"权限"}],
  				"addObj":{"travelAgency":"","carrierGds":"","dutyFunctionCode":"","geographicSpecificationType":"","geographicSpecification":"","codeType":"","code":"","viewBookTkt":"","selected":true}
  			},
  			"t165":{
  				"titieList":[{"title":"机型代码"}],
  				"addObj":{"equipmentCode":"","selected":true}
  			},
  			"t171":{
  				"titieList":[{"title":"航空公司"},{"title":"票价类别"},{"title":"运价类型"}],
  				"addObj":{"count":"","code":"","selected":true}
  			},
  			"t172":{
  				"titieList":[{"title":"大客户编码"}],
  				"addObj":{"accountCode":"","selected":true}
  			},
  			"t173Ticket":{
  				"titieList":[{"title":"指定客票"}],
  				"addObj":{"ticketDesignator":"","selected":true}
  			},
  			"t173Tkt":{
  				"titieList":[{"title":"指定客票"}],
  				"addObj":{"ticketDesignator":"","selected":true}
  			},
  			"t178Loc1":{
  				"titieList":[{"title":"类型"},{"title":"代码"},{"title":"是否适用"}],
  				"addObj":{"geoLocType":"","geoLocSpec":"","appl":"","selected":true}
  			},
  			"t178Loc2":{
  				"titieList":[{"title":"类型"},{"title":"代码"},{"title":"是否适用"}],
  				"addObj":{"geoLocType":"","geoLocSpec":"","appl":"","selected":true}
  			},
  			"t178Loc3":{
  				"titieList":[{"title":"类型"},{"title":"代码"},{"title":"是否适用"}],
  				"addObj":{"geoLocType":"","geoLocSpec":"","appl":"","selected":true}
  			}
      },//table end
      weightUnitList:[//行李重量单位集合
        {"name":"选择","value":""},{"name":"千克","value":"K"},{"name":"磅","value":"P"}
      ],
      specServiceFeeColSubList:[	//SPEC_SERVICE_FEE_COL_SUB//包含/扣除
	       {"name":"包含在票价中","value":"I"},{"name":"单独收费","value":""}
      ],
      noChargeNotAvailableList:[//免费/收费
        {"name":"收费","value":""},{"name":"不适用","value":"X"},
        {"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"},
        {"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}
      ],
      specServiceFeeNetSellList:[//净价/销售价
        {"name":"销售价","value":""},{"name":"净价","value":"N"}
      ],
      baggageTravelApplicationList:[
        {"name":"必须匹配所有的航段","value":"A"},{"name":"至少匹配一个航段","value":"S"},
        {"name":"必须匹配旅行航段中的主航段","value":"M"},{"name":"必须匹配整个行程的每一段","value":"J"},
        {"name":"不限制","value":""}
      ],
      noCharge_notAvailableList:[
        {"name":"收费","value":""},{"name":"不适用","value":"X"},
        {"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"},
        {"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}
      ],
      cabinList:[//舱位list集合
        {"name":"R-豪华头等舱","value":"R"},{"name":"F-头等舱","value":"F"},
        {"name":"J-豪华商务舱","value":"J"},{"name":"C-商务舱","value":"C"},
        {"name":"P-豪华经济舱","value":"P"},{"name":"Y-经济舱","value":"Y"}
      ],
      geoLocTypeList:[//区域集合
        {"name":"选择","value":""},
				{"name":"A-大区","value":"A"},{"name":"C-城市","value":"C"},
				{"name":"N-国家","value":"N"},{"name":"P-机场","value":"P"},
				{"name":"S-州","value":"S"},{"name":"Z-区域","value":"Z"}
      ],
      formOfRefundList:[//退款形式
        {"name":"选择","value":""},{"name":"按原付款渠道退款","value":"1"},
				{"name":"按电子凭证退款","value":"2"}
      ],
      geoSpecSectPortJourneyList:[
        {"name":"选择","value":""},{"name":"区域","value":"S"},
				{"name":"部分","value":"P"},{"name":"全程","value":"J"}
      ],
      geoSpecExceptionStopUnitList:[
        {"name":"选择","value":""},{"name":"分","value":"N"},
        {"name":"小时","value":"H"},{"name":"天","value":"D"},
        {"name":"周","value":"W"},{"name":"月","value":"M"}
      ],
      timeApplicationList:[
        {"name":"选择","value":""},{"name":"分别","value":"D"},
				{"name":"之间","value":"R"}
      ]
    } ;
   return jsonDate ;
}) ;

define('S7FormDataUtil',function(require, exports, module) {
	var util = {};
	//将查询的s7数据转换为‘FormData’
	util.convertS7ToFormData = function(s7,formData){
		for(var p in formData) {
			var flag =  s7.hasOwnProperty(p);
			if(flag){
				var tmpStr = s7[p]  ;
				formData[p] =  tmpStr ;
			}
		}
		//2.填充部分特殊数据
		formData.sel1.showStr = s7.basicInfoVo.serviceGroupDescription ;
		formData.sel2.showStr = s7.basicInfoVo.subGroupDescription ;
		formData.sel3.showStr = s7.basicInfoVo.commercialName ;
		formData.sel1.value = s7.basicInfoVo.serviceGroup ;
		formData.sel2.value = s7.basicInfoVo.subGroup ;
		formData.sel3.value = s7.basicInfoVo.subCode ;
		
	}
	
	//提交表单时将formData转换为s7
	util.convertFormDataToS7 = function(formData){
		var s7 = {} ;
		angular.extend(s7,formData) ;
		util.initTravelDate(s7) ;
		util.initDayOfWeek(s7) ;
		//处理部分特殊数据
		//删除后台不存在的属性字段
		delete s7.sel1 ;
		delete s7.sel2 ;
		delete s7.sel3 ;
		delete s7.travelStartDate ;
		delete s7.travelEndDate ;
		delete s7.dayOfWeekShow ;
		return s7 ;
	}
	
	
	util.initTravelDate =function (s7){
		var arr1 = util.getDateArr(s7.travelStartDate) ;
		var arr2 = util.getDateArr(s7.travelEndDate) ;
		s7.firstTravelYear = arr1[0] ;
		s7.firstTravelMonth = arr1[1] ;
		s7.firstTravelDay = arr1[2] ;
		//
		s7.lastTravelYear = arr2[0] ;
		s7.lastTravelMonth = arr2[1] ;
		s7.lastTravelDay= arr2[2] ;
	}
	
	util.initDayOfWeek =function (s7){
		var dayOfWeekShow = s7.dayOfWeekShow ;
		var str = ""  ;
		var index = 1 ;
		for(var t in dayOfWeekShow){
      	var value = dayOfWeekShow[t] ;
			if(value){
				str+= index;
			}
			index ++ ;
		}
		s7.dayOfWeek = str ;
	}
	
	//校验交单数据是否可以提交
	util.validFormData = function(formData ,orgFormData,NEW_ADD_STR){
		var serviceType = formData['serviceType'] ;
		//第一个校验
		//其他校验
		//1.表格数据校验[删除表格中的非法数据:eg:第一个字段为空的假数据]
		util.delInValidList(formData) ;
		util.dealOtherData(formData) ;
		//如果适用于为h，c，p
		var hcpFlag = _.contains(['H','C','P'], formData['specSevFeeAndOrIndicator']) ;
		/**1.当收费为收费时，金额字段必填。2.当收费类型为‘和’,如果适用于不为H,C,P时，金额字段必填*/
		if((formData['noChargeNotAvailable']==''||formData['specSevFeeAndOrIndicator']=='A')&&!hcpFlag){
			if(formData['list201VO'].length==0&&formData['list170VO'].length==0){
				$.showTuiErrorDialog('当收费或则收费类型为和并且适用于不为【H,C,P】时金额必填') ;
				return false;
			}
		}
		
		if(formData['startTime']==''){//起始时刻为空
			if(formData['stopTime']!=''){
				$.showTuiErrorDialog('开始时间和结束时间必须同时为空或不为空。');
				return false;
			}
		}else{//起始不为空
			if(formData['stopTime']==''){
				$.showTuiErrorDialog('开始时间和结束时间必须同时为空或不为空。');
				return false;
			}
		}
		if(formData['geoSpecFromToWithin']!=''){//如果不为不限区域则区域必填
			if(formData['geoSpecLoc1']==''&&formData['list178Loc1'].length==0){
				$.showTuiErrorDialog('当区域限制不为不限区域时，区域1的代码必须有值。');
				return false;
			}
		}
		if (formData['geoSpecFromToWithin'] == 'W') {
			if((formData['geoSpecLoc2'] !== ''||formData['list178Loc2'].length!=0 
				|| formData['geoSpecLoc3'] !== ''||formData['list178Loc3'].length!=0)){
				$.showTuiErrorDialog('当区域限制为区域1内部时，区域2和经过区域的代码必须为空。');
				return false;
			}
		}
		return true ;
	}
	
	//处理表单其他数据
	util.dealOtherData = function(formData){
		var serviceType = formData.serviceType ;
		if(serviceType=='A'){
			formData.firstExcessOccurrence = "" ;
			formData.lastExcessOccurrence = "" ;
		}
		if(serviceType=='C'||serviceType=='P'){
			if(formData.firstExcessOccurrence.length>0){
				if(formData.lastExcessOccurrence == ""){//若后者不填写，则后者默认等于前者
					formData.lastExcessOccurrence = formData.firstExcessOccurrence ;
				}
			}
		}
	}
	
	util.strNotNull = function(str){
		var tmp = str || "" ;
		tmp = $.trim(tmp+"") ;
		var flag = false;
		if(tmp.length>0){
			flag = true ;
		}
		return flag ;
	}
	
	
	/**
	 * <pre>
	 * 	删除表格中无效数据
	 * </pre>
	 * @param {Object} formData
	 */
	util.delInValidList = function(formData){
		//170表格
		var t170 = [] ;
		angular.forEach(formData.list170VO,function(m){
			if(util.strNotNull(m.specFeeAmount)){//如果存在的话
				t170.push(m) ;
			}
		}) ;
		//list198VO
		var t198 = [] ;
		angular.forEach(formData.list198VO,function(m){
			if(util.strNotNull(m.mktOp)){
				t198.push(m) ;
			}
		}) ;
		formData.list198VO = t198 ;
		//list198UpgradeVO
		var t198up = [] ;
		angular.forEach(formData.list198UpgradeVO,function(m){
			if(util.strNotNull(m.rbd1)){
				t198up.push(m) ;
			}
		}) ;
		formData.list198UpgradeVO = t198up ;
		//list183VO
		var t183 = [] ;
		angular.forEach(formData.list183VO,function(m){
			var flag = false;
			for(var p in m){
				var v = m[p] ;
				if(util.strNotNull(v)){
					flag = true ;
					break ;
				}
			}
			if(flag){
				t183.push(m) ;	
			}
		}) ;
		formData.list183VO = t183 ;
		//list186VO
		var t186 = [] ;
		angular.forEach(formData.list186VO,function(m){
			if(util.strNotNull(m.fltNo1)){
				t186.push(m) ;
			}
		}) ;
		formData.list186VO = t186 ;
		//list178Loc1
		var tloc1 = [] ;
		angular.forEach(formData.list178Loc1,function(m){
			if(util.strNotNull(m.geoLocType)){
				tloc1.push(m) ;
			}
		}) ;
		formData.list178Loc1 = tloc1 ;
		//list178Loc2
		var tloc2 = [] ;
		angular.forEach(formData.list178Loc2,function(m){
			if(util.strNotNull(m.geoLocType)){
				tloc2.push(m) ;
			}
		}) ;
		formData.list178Loc2 = tloc2 ;
		//list178Loc3
		var tloc3 = [] ;
		angular.forEach(formData.list178Loc3,function(m){
			if(util.strNotNull(m.geoLocType.length)){
				tloc3.push(m) ;
			}
		}) ;
		formData.list178Loc3 = tloc3 ;
		//行李件数表格处理
		var t196 = [] ;
		angular.forEach(formData.list196VO,function(m){
			if(util.strNotNull(m.count)&&util.strNotNull(m.code)){
				t196.push(m) ;
			}
		}) ;
		formData.list196VO = t196 ;
		//171表格无效数据删除
		var t171 = [] ;
		angular.forEach(formData.list171VO,function(m){
			if(util.strNotNull(m.carrier)){
				t171.push(m) ;
			}
		}) ;
		formData.list171VO = t171 ;
		//172表格删除无效数据
		var t172 = [] ;
		angular.forEach(formData.list172VO,function(m){
			if(util.strNotNull(m.accountCode)){
				t172.push(m) ;
			}
		}) ;
		formData.list172VO = t172 ;
		//173-1表格删除无效数据
		var t173_1 = [] ;
		angular.forEach(formData.list173TicketVO,function(m){
			if(util.strNotNull(m.ticketDesignator)){
				t173_1.push(m) ;
			}
		}) ;
		formData.list173TicketVO = t173_1 ;
		//173-2表格删除无效数据
		var t173_2 = [] ;
		angular.forEach(formData.list173TktVO,function(m){
			if(m.ticketDesignator.length>0 ){
				t173_2.push(m) ;
			}
		}) ;
		formData.list173TktVO = t173_2 ;
		//165
		var t165 = [] ;
		angular.forEach(formData.list165VO,function(m){
			if(m.equipmentCode.length>0){//如果存在的话
				t165.push(m) ;
			}
		}) ;
		formData.list165VO = t165 ;
	}
	
	util.getDate = function (str) {
		var strs = str.split('-');
		var year = strs[0];
		var month = strs[1];
		var day = strs[2];
		return new Date(year, month-1, day);
	};
	
	util.getDateArr = function (str) {
		var arr = [] ;
		var year = '' ;
		var month = '' ;
		var day  = '' ;
		if(str.length>0){
			var infos = str.split('-');
			if(infos.length==3){
				arr.push(infos[0]) ;
				arr.push(infos[1]) ;
				arr.push(infos[2]) ;
			}
		}
		return arr ;
	};
	
	module.exports = util ;
});
define('controllers',function (require, exports, module) {
	
	var controllers = angular.module("app.controllers",[]) ;
	return controllers ;
}) ;
define('directives',function(require, exports, module){ 
	 var directives = angular.module('app.directives',[]); 
	 return directives ;
 }) ;



define('services',function(require, exports, module){ 
	var app = angular.module('app.factory',[]); 
	//require('angular-resource') ;
 	return app ;
 }) ;

define('ruleDetailController',['controllers','editJsonData'],function (require, exports, module) {
	    var controllers = require('controllers') ;
		  var jsonDate = require('editJsonData') ;
	    //页面第三部分/////////规则详细部分/////////////////////////////////////////////////////////
	    controllers.controller('RuleDetailCtrl',['$scope','FormData','NEW_ADD_STR','$http',function($scope,FormData,NEW_ADD_STR,$http){
			$scope.data = FormData ;
			$scope.NEW_ADD_STR = NEW_ADD_STR ;
			$scope.noCharge_notAvailableList = jsonDate.noCharge_notAvailableList ;
			//舱位list集合
			$scope.cabinList = jsonDate.cabinList ;
			//区域集合
		    $scope.geoLocTypeList = jsonDate.geoLocTypeList ;
			//退/改
			$scope.indicatorReissueRefundList = jsonDate.geoLocTypeList ;
			//退款形式
			$scope.formOfRefundList = jsonDate.formOfRefundList ;
			$scope.geoSpecSectPortJourneyList = jsonDate.geoSpecSectPortJourneyList ;
			$scope.geoSpecExceptionStopUnitList = jsonDate.geoSpecExceptionStopUnitList ;
			$scope.timeApplicationList = jsonDate.timeApplicationList ;
			
			
			$scope.getUpGradeTableTile = function(){
				var sel1Value = FormData.sel1.value ;
				var tmpStr = "" ;
				if(sel1Value=="SA"||sel1Value=="BDSA"){
					tmpStr = "座位属性表" ;
				}else if (sel1Value=="UP"||sel1Value=="BDUP"){
					tmpStr = "升舱属性表" ;
				}
				return tmpStr ;
			}
			
			var list = ["SA","BDSA","UP","BDUP"] ;
			$scope.showUpGradeTableFlag = function(){
				var flag = false;
				var index = list.indexOf(FormData.sel1.value) ;
				if(index!=-1){
					flag = true ;
				}
				if(flag){//如果为true，并且serviceType为M，或F时显示
					if($scope.data.serviceType=='M'||$scope.data.serviceType=='F'){
						flag = true ;
					}else{
						flag = false;
					}
				}
				return flag ;
			}
			
			var list2 = ['UP','BDUP'] ;
			$scope.showUpGradeServiceFlag = function(){//升舱到的服务等级
				var flag = false;
				var index = list2.indexOf(FormData.sel1.value) ;
				if(index!=-1){
					flag = true ;
				}
				if(flag){//如果为true，并且serviceType为M，或F时显示
					if($scope.data.serviceType=='M'||$scope.data.serviceType=='F'){
						flag = true ;
					}else{
						flag = false;
					}
				}
				return flag ;
			}
			
			
			//upGradeTable td input size //如果是座位属性表长度为10，订座属性表长度为3
			$scope.getUpGradeInputSize = function(){
				var sel1Value = FormData.sel1.value ;
				var len = 5 ;
				if(sel1Value=="SA"||sel1Value=="BDSA"){
					len = 10 ;
				}else if (sel1Value=="UP"||sel1Value=="BDUP"){
					len = 5 ;
				}
				return len ;
			}
			//改变机型的select框
			$scope.selectChangeEquipment = function(){
				$scope.flagData.t165.title = '自定义区域' ;
				$scope.flagData.t165.flag = false ;
			}
			//data.list178Loc1开始
			//区域1 select改变
			$scope.selectChangeGeoSpecLoc1 = function (){
				$scope.data.geoSpecLoc1 = "" ;
				$scope.flagData.geo1.title = '自定义区域' ;
				$scope.flagData.geo1.flag = false ;
			}
			//区域2 select改变
			$scope.selectChangeGeoSpecLoc2 = function (){
				$scope.data.geoSpecLoc2 = "" ;
				$scope.flagData.geo2.title = '自定义区域' ;
				$scope.flagData.geo2.flag = false ;
			}
			//区域3 select改变
			$scope.selectChangeGeoSpecLoc3 = function (){
				$scope.data.geoSpecLoc3 = "" ;
				$scope.flagData.geo3.title = '自定义区域' ;
				$scope.flagData.geo3.flag = false ;
			}
			//-------------区域对应的表格显示隐藏结束--------//
	  }]) ;
}) ;

define('chargeConfirmController',['controllers','editJsonData','commonUtil','jsonDataHelper','underscore_gulp-seajs-cmobo_41','S7ValidateHelper'],function (require, exports, module) {
	var controllers = require('controllers') ;
	var jsonDate = require('editJsonData') ;
	var commonUtil = require('commonUtil') ;
	var jsonDataHelper = require('jsonDataHelper') ;
	var _ = require('underscore_gulp-seajs-cmobo_41') ;
	var validHelper = require('S7ValidateHelper') ;

   //页面第二个部分///////费用确定部分////////////////////////////////////////////////////////
   controllers.controller('ChargeConfirmCtrl',['$scope','FormData','FormEditStatusServcie',function($scope,FormData,FormEditStatusServcie){
   			$scope.data  = FormData ;
			//当选择免费或则收费时触发的事件
			//行李重量单位集合
			$scope.weightUnitList = jsonDate.weightUnitList ;
			//SPEC_SERVICE_FEE_COL_SUB//包含/扣除
			$scope.specServiceFeeColSubList = jsonDate.specServiceFeeColSubList ;
			//净价/销售价
			$scope.specServiceFeeNetSellList = jsonDate.specServiceFeeNetSellList ;
			$scope.baggageTravelApplicationList = jsonDate.baggageTravelApplicationList ;
			

			//当是否收费改变时触发的函数
			$scope.changeNoChargeNotAvailable = function  () {
				var editScope = $scope.$parent ;
				var data = $scope.data;
				var globalEditStatus = FormEditStatusServcie ;
				validHelper.changeNoChargeNotAvailable(editScope,data,globalEditStatus) ;
			} ;

			//适用于改变时
			$scope.changeSpecifiedServiceFeeApp = function(){
				var editScope = $scope.$parent ;
				var data = $scope.data ;
				validHelper.changeSpecifiedServiceFeeApp(editScope,data) ;
			};


			$scope.clickDiscount2 = function(l){
				var type = l.discountType ;
				if(type=='1'){//全额
					l.discountNum = '' ;
				}else{
					l.onePriceNum = '' ;
				}
			};
			//金额选择全额或则折扣时
			$scope.clickDiscount = function(dt){
				//当点击时可以触发展开表格
				$scope.flagData.t170.flag = true;
				$scope.flagData.t170.title = "收起表格" ;

				$scope.data.discountOrNot = dt ;
				if(dt=='1'){//全额
					$scope.data.list201VO = [] ;
				}else{//折扣
					//第三列一定要已选中
					$scope.data.list170VO = [] ;
					var sel3value = $scope.data.sel3.value ;
					if(sel3value.length>0){
						$scope.data.list201VO = [] ;//数据初始化
						//1.判断套餐/非套餐
						//2.套餐:显示每一条,非套餐的话总的显示一条
						var serviceGroup = $scope.data.sel1.value;    //BD
						if(serviceGroup!=null&&serviceGroup.length>2&&serviceGroup.indexOf('BD')===0){
							//说明是套餐
							var tmpArr = [] ;//[1]页面显示的字符串,[2]折扣类型,[3]一口价,[4]一口价单位,[5]折扣数
							for(var i = 0 ; i < $scope.data.sel4.length;i++){
								var l = $scope.data.sel4[i] ;
								var obj = {"subCode":l.subCode,"commercialName":l.commercialName,"discountType":'1',"onePriceNum":'',"discountNum":''};
								tmpArr.push(obj) ;
							}
							$scope.data.list201VO = tmpArr ;
						}else{//说明是非套餐
							$scope.data.list201VO = [] ;//数据初始化
							//显示str $scope.data.sel3.showStr
							var subCode = $scope.data.sel3.value ;
							var index = 2+subCode.length ;//'['+subCode+']'
							var sel3ShowStr = $scope.data.sel3.showStr ;
							var commercialName = sel3ShowStr.substring(index);
							//[1]页面显示的字符串,[2]折扣类型,[3]一口价,[4]一口价单位,[5]折扣数
							var obj = {"subCode":subCode,"commercialName":commercialName,"discountType":'1',"onePriceNum":'',"discountNum":''};
							$scope.data.list201VO = [obj] ;
						}
					}else{
						$scope.data.list201VO = [] ;//数据初始化
						alert('服务必须选择到最后一级!') ;
					}
				}
			};
   }]) ;
}) ;

define('basicInfoController',['controllers','jsonDataHelper','commonUtil','underscore_gulp-seajs-cmobo_41','S7ValidateHelper'],function (require, exports, module) {
	  var controllers = require('controllers') ;
	  var jsonDataHelper = require('jsonDataHelper') ;
	  var commonUtil = require('commonUtil') ;
	  var _ = require('underscore_gulp-seajs-cmobo_41') ;
	  var validateHelper = require('S7ValidateHelper') ;
	  //页面第一个部分/////////选择附加服务部分/////////////////////////////////////////
	  //select级联controller
	   controllers.controller('BasicInfoCtrl',['$scope','$http','FormData','DEFAULT_SERVICETYPE','FormEditStatusServcie',function($scope,$http,FormData,DEFAULT_SERVICETYPE,FormEditStatusServcie){
			//chooseInput的输入数据
			$scope.chooseInputData = {
				"choose1":"",
				"choose2":"",
				"choose3":""
			} ;
	   		$scope.data = FormData ;
			$scope.showChooseFunc = function(){
				var str = "" ;
				var str1 = FormData.sel1.showStr || "" ;
				var str2 = FormData.sel2.showStr || "" ;
				var str3 = FormData.sel3.showStr || "" ;
				if(str1.length>0){
					str = str1 ;
				}
				if(str2.length>0){
					str += " > "+str2 ;
				}
				if(str3.length>0){
					str += " > "+str3 ;
				}
				return str ;
			};

			//choose第一个框中li点击事件
			$scope.subGroupQuery = function(showStr,serviceGroup){
				var contextPath = $scope.contextPath ;
				FormData.sel1.showStr = showStr ;
				FormData.sel1.value = serviceGroup ;
				//把第二个选项框以前保留的信息清空
				FormData.sel2.showStr = "" ;
				FormData.sel2.value = "" ;
				//把第三个选项框以前保留的信息清空
				FormData.sel3.showStr = "" ;
				FormData.sel3.value = "" ;
				$scope.lastGroupList = [] ;
				$scope.lastGroupList2 = [] ;
				//清空formData信息
				FormData.serviceAndSubCode = "" ;
				FormData.serviceType = DEFAULT_SERVICETYPE ;//
				FormData.noChargeNotAvailable = "" ;//设置为默认
				var url = contextPath+"/basicInfo/queryBasicInfoByGroup" ;
				var carrier = $scope.data.carrCode  ;
				var jqeryData = {} ;//post方式提交
				var jueryParam = {params: {carrier: carrier,serviceGroup:serviceGroup}};//地址问号形式
				$http.post(url, jqeryData, jueryParam)
				.success(function(data, status, headers, config) {
				  	$scope.subGroupList = data ;
				}).error(function(data, status, headers, config) {//处理错误
					alert("查询出错!") ;
				});
				$scope.data.basicInfoVo.serviceGroup= "";
				$scope.data.basicInfoVo.subGroup= "" ;
				$scope.data.basicInfoVo.subCode= "" ;
				$scope.data.sel4 = [];
			};

			//第二个li点击事件
			$scope.s5Query = function(showStr,subGroup){
				var contextPath = $scope.contextPath ;
				FormData.sel2.showStr = showStr ;
				FormData.sel2.value = subGroup ;
				//清空第三个选项框
				FormData.sel3.showStr = "" ;
				FormData.sel3.value = "" ;
				$scope.lastGroupList = [] ;
				FormData.serviceAndSubCode = "" ;
				FormData.serviceType = DEFAULT_SERVICETYPE ;//
				$scope.lastGroupList2 = [] ;

				FormData.noChargeNotAvailable = "" ;//设置为默认
				var url = contextPath+"/s5/queryS5BySubGroup" ;
				var carrier = $scope.data.carrCode  ;
				var serviceGroup = FormData.sel1.value ;
				var jqeryData = {} ;//post方式提交
				var jueryParam = {params: {carrier: carrier,serviceGroup:serviceGroup,subGroup:subGroup}};//地址问号形式
				$http.post(url, jqeryData, jueryParam)
				.success(function(data, status, headers, config) {
				  	$scope.lastGroupList = data ;
				}).error(function(data, status, headers, config) {//处理错误
					alert("查询出错!") ;
				});
				
				$scope.data.basicInfoVo.serviceGroup= "" ;
				$scope.data.basicInfoVo.subGroup= "" ;
				$scope.data.basicInfoVo.subCode= "" ;
				$scope.data.sel4 = [];
			};
			//第三个li点击事件
			$scope.lastChooseClick = function(l){
				//第一步:重置表单数据
				//当点击的饿时候把整个表单重置//除了serviceType外的其他字段
				for(var pname in $scope.data){
					if(!_.contains(['sel1','sel2','sel3','sel4'], pname)){
						$scope.data[pname] = angular.copy($scope.orgData[pname]) ;
					}
				}
				validator.resetForm();
				//第二步：填充当前选中的数据
				var carrCode = l.carrCode ;
				var serviceSubCode = l.serviceSubCode ;
				var commercialName = l.commercialName ;
				var serviceType = l.serviceType ;
				FormData.carrCode = carrCode ;
				FormData.serviceAndSubCode = serviceSubCode ;
				FormData.serviceType = serviceType ;
				//填充basicInfo信息start
				$scope.data.basicInfoVo.serviceGroup= l.attributesGroup ;
				$scope.data.basicInfoVo.subGroup= l.attributesSubgroup ;
				$scope.data.basicInfoVo.subCode= serviceSubCode ;
				//填充basicInfo信息end
				FormData.sel3.showStr = '['+serviceSubCode+']'+commercialName ;
				FormData.sel3.value = serviceSubCode ;
				//第三步:校验相关的操作
				validateHelper.changeServiceType($scope.$parent,FormData,FormEditStatusServcie) ;
				//第四步:查询数据为后面显示准备
				var textTableNo163 = l.subCodeTableNo163||'' ;
				textTableNo163 = textTableNo163*1 ;
				var url = FormData.contextPath+"/s7/query4ClickService" ;
				var queryParam = {"subCodeTableNo163":textTableNo163+"",
								  "carrCode":l.carrCode,
								  "serviceType":l.serviceType,
								  "serviceAndSubCode":l.serviceSubCode} ;
				$http.post(url,queryParam)
				.success(function(data, status, headers, config) {
				  	$scope.lastGroupList2 = data.tb163List ;
				  	$scope.data.sel4 = data.tb163List;
				  	$scope.data.sequenceNumber = data.maxSequenceNumber*1+10 ;
				}).error(function(data, status, headers, config) {//处理错误
					console.info("查询出错!") ;
				});
				//清空金额缓存数据
				$scope.data.discountOrNot = '1' ;
				$scope.data.list201VO = [] ;//数据初始化
			};
	   }]) ;
	   // ng-show = "lastGroupList2.length>0"

}) ;

define('headController',['controllers'],function (require, exports, module) {
	  var controllers = require('controllers') ;
      //headerController
	  controllers.controller('HeaderCtrl',['$scope','FormData','NEW_ADD_STR',function($scope,FormData,NEW_ADD_STR){
	  	  $scope.NEW_ADD_STR = NEW_ADD_STR ;
	  	  $scope.contextPath = FormData.contextPath ;
		  $scope.backPage = function (){
			  window.location.href= $scope.contextPath+'/oc/ocView' ;
		  }
		  var action = FormData.action||"" ;
		  if(action==$scope.NEW_ADD_STR){
			 $scope.headerTipStr = "新建服务费用" ;
		  }else{//表示为修改页面跳转过来的
		  	   $scope.headerTipStr = "更新服务费用" ;
		  }
	  }])  ;
}) ;
define('eidtController',['controllers','S7FormDataUtil','editJsonData','S7EditUtil','jsonDataHelper','commonUtil'],function (require, exports, module) {
	var controllers = require('controllers') ;
	var util = require('S7FormDataUtil') ;
	var jsonDate = require('editJsonData') ;
	var EditUtil = require('S7EditUtil') ;
	var jsonDataHelper = require('jsonDataHelper') ;
	var commonUtil = require('commonUtil') ;



	//最外层controller
	controllers.controller('EditController',['$scope','FormData','NEW_ADD_STR','UPDATE_STR','$http','S7EditService','TableStatusServcie','FormEditStatusServcie','FormStatusService',function($scope,FormData,NEW_ADD_STR,UPDATE_STR,$http,S7EditService,TableStatusServcie,FormEditStatusServcie,FormStatusService){
	    $scope.NEW_ADD_STR = NEW_ADD_STR ;//新增action字符串标记
		$scope.UPDATE_STR = UPDATE_STR ;//更新action字符串标记
		$scope.contextPath = FormData.contextPath ;
		//保留一份原始数据，方便数据初始化时使用
		$scope.orgData = angular.copy(FormData) ;
		//页面上的form数据
		$scope.data = FormData ;
		//页面上所有表格的显示或隐藏的的状态数据
		$scope.tableStatus = TableStatusServcie ;
		//页面上所有控件的状态数据
		$scope.editStatus = FormEditStatusServcie ;
		$scope.showStatus = FormStatusService ;
		
		var s7Id = $("#s7Id").val() ;
		$scope.data.id = s7Id ;
		//第一次进入页面时需要加载的数据
		console.info('准备初始化页面数据..........') ;
		var url = '';
		var promise = null;
		if(FormData.action==NEW_ADD_STR){//1.新增
			url = $scope.contextPath+'/initPage4Add';
			promise = S7EditService.getDataByUrl(url) ;
			dealResultData4Add(promise) ;
		}else if (FormData.action==UPDATE_STR){
			url = $scope.contextPath+'/initPage4Upate?s7Id='+$scope.data.id;
			promise = S7EditService.getDataByUrl(url) ;
			dealResult4Update(promise) ;
		}
		console.info('页面部分数据其他处理.......') ;
		$scope.canNotModifyFlag = function(){
			var flag = false;
			if($scope.data.statusDes=='3'){
				flag = true ;
			}
			return flag ;
		};
		//日期问题
		var currDate = new Date();
		var curMonthStr = commonUtil.getFullDayOrMonthStr(currDate.getMonth()+1)  ;
		var curDateStr = commonUtil.getFullDayOrMonthStr(currDate.getDate()) ;
		var nextDateStr= commonUtil.getFullDayOrMonthStr(currDate.getDate() +1) ;


		//当前日期
		$scope.currentDateStr = currDate.getFullYear() +'-'+curMonthStr+ '-'+curDateStr;
		//下一天日期
		$scope.nextDateStr = currDate.getFullYear() +'-'+curMonthStr+ '-'+nextDateStr ;
		//select数据开始//
		//提前购票时间单位
		$scope.advancedPurchasePeriodList = jsonDate.advancedPurchasePeriodList ;
		//免费/收费
		$scope.noChargeNotAvailableList = {
			list:jsonDataHelper.getNoChargeNotAvailableList($scope.data.serviceType) 
		} ;
		//适用于
		$scope.specifiedServiceFeeAppList = {
			list:jsonDataHelper.getSpecifiedServiceFeeAppList($scope.data.serviceType)
		} ;
		//select数据结束
		//前面几个一般表格的显示隐藏
		$scope.flagData = jsonDate.flagData ;
		//所有的表格定义信息都在这里
		$scope.tableData = jsonDate.tableData ;
		//-------------区域对应的表格显示隐藏开始--------//
	
		
		//工具方法
		//(1):初始化新增页面数据
		function dealResultData4Add (promise){
			promise.then(function(data) {  // 调用承诺API获取数据 .resolve  
				console.info('获取初始化数据完成....') ;
		        $scope.serviceGroupList = data.serviceGroupList ;
				$scope.passengerTypeCodeList = data.passengerList ;
				$scope.frequentFlyerStatusList = data.ffpList ;
				$scope.equipmentList = data.equipmentList ;
				//初始化数据、测试新增的时候才有意义，上线时此行代码没有意义
				EditUtil.initData.initListData($scope.data,$scope.tableStatus) ;
		    }, function(data) {  // 处理错误 .reject  
		        console.error('初始化页面数据出错!') ;
		    }); 
		}
		//(2):初始化更新页面数据
		function dealResult4Update (promise){
			promise.then(function(data) {  // 调用承诺API获取数据 .resolve  
				console.info('获取初始化数据完成....') ;
		        $scope.serviceGroupList = data.serviceGroupList ;
				$scope.passengerTypeCodeList = data.passengerList ;
				$scope.frequentFlyerStatusList = data.ffpList ;
				$scope.equipmentList = data.equipmentList ;
				//s7record的信息
				util.convertS7ToFormData(data.s7VO,$scope.data) ;//将查询的s7数据填充到formData中
				EditUtil.initData.initListData(data.s7VO,$scope.tableStatus) ;
				//其他特殊数据处理
				EditUtil.initData.initOtherData($scope.data) ;
				//list163
				$scope.data.sel4 = data.list163 ;
				var editScope = $scope ;
				var globalEditStatus = FormEditStatusServcie ;
				//初始化校验页面数据
				EditUtil.initData.init4Validate(editScope,$scope.data,globalEditStatus) ;
		    }, function(data) {  // 处理错误 .reject  
		        console.error('初始化页面数据出错!') ;
		    }); 
		}


		//保存表格数据到后台
		/**
		 * <pre>
		 * 	功能描述:保存表单数据
		 * </pre>
		 * @param {Object} operType  ['save','saveAndPublish']  点击‘保存’,‘保存并发布’
		 */
		$scope.saveFormData = function(operType){
			var flag = false ;
			var s7 = util.convertFormDataToS7($scope.data) ;
			flag = util.validFormData(s7,$scope.data,NEW_ADD_STR) ;
			console.info('手动js校验结果为 : ' + flag) ;

			//console.info(s7) ;
			if(flag){//如果校验通过的话则提交表单数据到后台
				$.showTuiConfirmDialog('保存?', function() {
					var url = "" ;
					if(operType=='save'){
						if(FormData.action == $scope.NEW_ADD_STR){//新增数据的话
							url = $scope.contextPath + "/addS7"
						}else if(FormData.action==$scope.UPDATE_STR){//更新数据的话
							url = $scope.contextPath + "/updateS7" ;
						}
					}else if (operType=='saveAndPublish'){
						url = $scope.contextPath + "/saveAndPublishS7" ;
					}
					var promise = S7EditService.postDate(url,s7) ;
					promise.then(function (data) {
						if (data.flag == 'true' ) {
							$.showTuiSuccessDialog('保存成功！', function() {
								$.showTuiWaitingDialog('即将返回查询界面!', 200, 60);
								setTimeout(function() {
									$.closeTuiWindow();
								}, 5000);
								window.location.href= $scope.contextPath+'/oc/ocView' ;
							});
						} else {
							$.showTuiErrorDialog('保存数据出错！');
						}
					},function(error){
						$.showTuiErrorDialog('保存数据出错！');
					}) ;
				});
			}
		}
    }]) ;

}) ;

define('tableDirective',['directives','table.html','tr.html','thead.html','underscore_gulp-seajs-cmobo_41'],function(require, exports, module){ 
	 var directives = require('directives') ;
	 var tableHtml = require('table.html') ;
	 var trHtml = require('tr.html') ;
	 var theadHtml = require('thead.html') ;
	 var _ = require('underscore_gulp-seajs-cmobo_41') ;

	 directives.directive('tableInfo', function(){
		  return {
	        restrict: 'AE',
	        replace: true,
			template:tableHtml,
			scope:{
				tableData:'=',
				list:'=',
				tableWidth:'@',
				data:"="
			},
			controller:['$scope',function($scope){
				$scope.column = $scope.tableData.titieList.length ;
				//$scope.list = $scope.tableData.list ;//这个list如果是在tableData中传递过来的话，如果是更新视图，则不会刷新视图，不知道为什么
				$scope.status = $scope.data.statusDes ;
				$scope.titleList = $scope.tableData.titieList ;
				$scope.canNotModifyFlag = function(){
					var flag = false;
					if($scope.status=='3'){
						flag = true ;
					}
					return flag ;
				}
				//新增一行记录
				$scope.tbAddLine = function(){
					if($scope.status!='3'){
						outAllSelect() ;
						//var obj = $.extend({},$scope.tableData.addObj)//也就是将"{}"作为dest参数。 ;
						var obj = angular.copy($scope.tableData.addObj) ;
						$scope.list.push(obj) ;
					}
				}
				//删除一行记录
				$scope.tbDelLine = function (){
					var len = $scope.list.length ;
					if(len>=1){
						var num = len-1 ;
						angular.forEach($scope.list,function(l,index){
							if(l.selected){
								num = index ;
							}
						}) ;
						$scope.$apply(function(){
							outAllSelect() ;
							$scope.list.splice(num,1) ;
						}) ;
						//这一个一定要触发，要不然无法消除页面之前校验的表格错误信息
						//$('#'+$scope.hiddenInputId).trigger('click') ;
					}
				}
				function outAllSelect(){//将所有tr全部置为非选中状态
					angular.forEach($scope.list,function(l){
						l.selected = false ;
					}) ;
				}
				$scope.clickTr = function(l){
					outAllSelect() ;
					l.selected = true ;
				}
				//下面是特殊的部分，select可能会存在//如果你的表格比较特殊的话可能需要修改修改下面的部分代码
				/**这一部分算是半工作能够部分(因为有的表格会使用这部分数据，但是有的表格不使用这部分数据)**/
				$scope.geoSpecTypeList = [
					{"name":"选择","value":""},
					{"name":"A-大区","value":"A"},{"name":"C-城市","value":"C"},
					{"name":"N-国家","value":"N"},{"name":"P-机场","value":"P"},
					{"name":"S-州","value":"S"},{"name":"Z-区域","value":"Z"}
				] ;
				$scope.codeTypeList = [
					{"name":"选择","value":""},{"name":"T-代理人office号","value":"T"},
					{"name":"I-IATA号","value":"I"},{"name":"Department/Identifier","value":"X"},
					{"name":"CRS/CXR Department Code","value":"V"},{"name":"ERSP No","value":"E"},
					{"name":"LNIATA Number (CRT Address)","value":"L"},{"name":"Airline specific codes","value":"A"}
				] ;
				//市场方/承运方
				$scope.marketingOpreratingList = [
					{"name":"选择","value":""},
					{"name":"M-市场方","value":"M"},{"name":"O-承运方","value":"O"},
					{"name":"E-市场方/承运方","value":"E"}
				] ;
				/*********183特殊部分开始*******************/
				$scope.selectChange183Tb1 = function(l183){
					l183.geographicSpecification = "" ;
				}
				$scope.selectChange183Tb2 = function(l183){
					l183.code = "" ;
				}
				$scope.viewBookTktList = [// 权限list
					{"name":"选择","value":""},{"name":"查看/订票/出票","value":1},
					{"name":"仅查看","value":2}
				] ;
				/*********183特殊部分结束*******************/
				
				/*********198特殊部分开始*******************/
				$scope.selectChange198Tb = function(l198){
					reseat198VO(l198) ;
				}
				//重置数据
				function reseat198VO (l198){
					if(l198){
						l198.cxr = "" ;
						l198.rbd1 = "" ;
						l198.rbd2 = "" ;
						l198.rbd3 = "" ;
						l198.rbd4 = "" ;
						l198.rbd5 = "" ;
					}
				}
				/*********198特殊部分结束*******************/
				/*********170特殊部分开始*******************/
				$scope.selectChange170Tb = function(l170){
					reseat170VO(l170) ;
				}
				function reseat170VO (l170){
					if(l170){
						l170.saleGeographicPoint = "" ;
						//l170.specFeeAmount = "" ;
					}
				}
			    /*********170特殊部分结束*******************/
				//178表格的区域select框发生变化时触发的函数
				$scope.selectChange178Tb = function(l178){
					l178.geoLocSpec = "" ;
				}
			}],
			compile: function compile(tElement, tAttrs, transclude){
				var urlStr = tAttrs['htmlUrl'] ;
				var headerTeplate = _.template(theadHtml) ; 
				var bodyTemplate = _.template(trHtml);
				var headStr = headerTeplate({value: urlStr}) ;
				var bodyStr = bodyTemplate({value: urlStr});
				var tableElement =  angular.element(tElement) ;
				tableElement.find('thead').append(headStr) ;
				tableElement.find('tbody').append(bodyStr) ;
				return {
					pre: function(scope, element, attrs){
						
					},
					post: function(scope, element, attrs){
						element.find("div.delete_line").bind('click',function(){
							if (scope.status != '3') {
								scope.tbDelLine() ;
							}
						}) ;

					}
				};
			}
	      };
      });
	  
}) ;
define('ruleDetailDirective',['directives','geoSpecLoc.html'],function(require, exports, module){ 
	 var directives = require('directives') ;
	 var geoSpecInputHtml =  '<div class="helper_float_left single_edit_div">'+
							'   <label class="nostyle" ng-transclude="">'+
							'   </label>'+
							'</div>' ; 
	var geoSpecLocHtml = require('geoSpecLoc.html') ;
	 
	 //区域部分input套一层壳
	 directives.directive('geoSpecInput', function() {
	    return {
	        restrict: 'E',
	        replace: true,
			scope:true,
	        template: geoSpecInputHtml,
			transclude:true
	    };
	 });
	 
}) ;
define('basicInfoDirective',['underscore_gulp-seajs-cmobo_41','directives','header.html','choose_div.html','choose-ul.html'],function(require, exports, module){
	 var _ = require('underscore_gulp-seajs-cmobo_41') ;
	 var directives = require('directives') ;
	 var headerHtml = require('header.html') ;
	 var chooseDivHtml = require('choose_div.html') ;
	 var chooseUlHtml = require('choose-ul.html') ;

	 directives.directive('headerDrct', function() {
	    return {
	        restrict: 'AE',
	        replace: true,
			scope:true,
	        template: headerHtml,
			link: function(scope, elem, attrs) {
				
        	}
	    };
	 });

	 directives.directive('chooseDiv', function() {
	    return {
	        restrict: 'AE',
	        replace: true,
			scope:true,
			transclude:true,
	        template: chooseDivHtml,
			compile: function compile(tElement, tAttrs, transclude){
				var urlStr = tAttrs['htmlUrl'] ;
				var template = _.template(chooseUlHtml);
				var htmlStr = template({value: urlStr});
				var tmpDiv = angular.element(tElement).find('div.service_list') ;
				tmpDiv.append(htmlStr) ;
			}
	    };
	 });

 }) ;

define('commonDirective',['directives','underscore_gulp-seajs-cmobo_41'],function(require, exports, module){
	 var directives = require('directives') ;
	 var _ = require('underscore_gulp-seajs-cmobo_41') ;
	 //var forceHtml = require('../../tpls/edit/force.html') ;

	 //显示隐藏表格
	 directives.directive('showHideTable',['TableStatusServcie',function(TableStatusServcie){
	    return {
	        restrict: 'E',
	        replace: true,
	        scope: {},
	        controller:['$scope','$element','$attrs',function($scope,$element,$attrs){
	        	$scope.tableStatus = TableStatusServcie ;
	        }],
	        template:function(elem,attrs){
	        	var tname = attrs['tname'] ;
	        	var tmpStr = "tableStatus."+tname+".showFlag" ;
	        	var html = '<a  href = "javascript:void(0)"><span ng-if="'+tmpStr+'" >收起表格</span><span ng-if="!'+tmpStr+'">填写表格</span></a>' ;
	        	return html ;
	        }, 
	        transclude:true,
	        link: function(scope, element, attrs){
	        	element.bind('click',function(){
	        		var tname = attrs['tname'] ;
	        		scope.$apply(function(){
						TableStatusServcie[tname]['showFlag'] = !TableStatusServcie[tname]['showFlag'] ;
	        		}) ;
	        	}) ;
	        }
	    };
	}]) ;


	 //刚添加的一行表格td需要触发focus函数,否则如果直接点击页头部分的保存按钮将无法进行tui的require等校验//不知道为什么
	 directives.directive('setFocus', function(){
		  return {
	        restrict: 'AE',
	        replace: true,
			scope:true,
			link: function(scope, elem, attrs) {
	             elem.trigger('click') ;
	        }
	      };
      });

	 //区域长度限制
	 directives.directive('geoMaxLength',function(){
	    return {
	        restrict: 'AE',
	        replace: true,
	        scope:true,
	        controller:['$scope', '$element', '$attrs',function($scope, $element, $attrs){
				$scope.getGeoLengthByType = function(type){
					type = type || "" ;
				  	var obj = {'A':'1','C':'3','N':'2','P':'3','S':'2','Z':'3'} ;
				    var len = eval("obj['"+type+"']") || 0;
					return len ;
				}
			}],
	        link: function(scope, element, attrs){
	            scope.$watch(attrs['geoMaxLength'], myWatchCallbackFunc);
	            function myWatchCallbackFunc (){
	                var geoMaxLength = attrs['geoMaxLength'] ;
	                var value  = scope.$eval(geoMaxLength) ;
					var len = scope.getGeoLengthByType(value) ;
					element.attr('maxLength',len) ;//设置长度
	            }
	        }
	    }
	  }) ;


	 //tui长度限制属性
	 directives.directive('tuiMaxLength',function(){
	    return {
	        restrict: 'AE',
	        replace: true,
	        scope: true, // 这个必须加上要不然会造成混乱
	        controller:['$scope', '$element', '$attrs',function($scope, $element, $attrs){
				//下面两个是内部工具函数
				$scope.strToJson = function(str){
	                var json = eval('(' + str + ')');
	                return json;
				}

				$scope.splitMaxLengtAttr =  function (tuiMaxLengthStr){
	                var obj = {} ;
	                var start1 = tuiMaxLengthStr.indexOf('{');
	                var end1 = tuiMaxLengthStr.indexOf('}');
	                var str1 = tuiMaxLengthStr.substr(start1,end1+1) ;
	                var start2 = tuiMaxLengthStr.indexOf('[') ;
	                var end2 = tuiMaxLengthStr.indexOf(']') ;
	                var str2 = tuiMaxLengthStr.substring(start2+1,end2) ;
	                obj.str1 = $scope.strToJson(str1);
	                obj.str2 = str2 ;
	                return obj ;
	            }
			}],
	        link: function(scope, element, attrs){
	            scope.$watch(attrs['tuiMaxLength'], myWatchCallbackFunc);
	            function myWatchCallbackFunc (){
	                var tuiMaxLength = attrs['tuiMaxLength'] ;
	                var info =  scope.splitMaxLengtAttr(tuiMaxLength) ;
	                var value2  = scope.$eval(info.str2) ;
	                var valueAttrStr = "info.str1['"+value2+"'] ";
	                var valueAtrr = eval(valueAttrStr) ;
					element.attr('maxLength',valueAtrr) ;//设置长度
	            }
	        }
	    }
	  }) ;



	directives.directive("upperInput",function(){
	    return{
	        restrict:'A',
	        require:'ngModel',
	        link:function(scope,element,attrs,ngModel){
	            if (!ngModel)
	                return; // do nothing if no ng-model
	            // Specify how UI should be updated
	            ngModel.$render = function() {
	                var tmp = ngModel.$viewValue || '' ;
	                tmp = tmp.toUpperCase() ;
	                element.val(tmp);
	                ngModel.$setViewValue(tmp);
	            };
	            // Listen for change events to enable binding
	            element.bind('blur', function() {
	                scope.$apply(read);
	            });
	            //read(); // initialize
	            /// Write data to the model
	            function read() {
	                var tmp = ngModel.$viewValue || '';
	                tmp = tmp.toUpperCase() ;
	                ngModel.$setViewValue(tmp);
	                element.val(tmp);
	            }
	        }
	    }
	}) ;
	 //178表格显示隐藏的链接指令
	 directives.directive('linkTable', function(){
          return {
	        restrict: 'AE',
	        replace: true,
			scope:{
				list:'=',
				geo:'=',
				status:'='
			},
			controller:['$scope',function($scope){
				//点击显示隐藏表格事件处理
				$scope.myClick = function(){
					$scope.geo.showFlag = !$scope.geo.showFlag ;
					if(!$scope.geo.showFlag){////点击取消自定义区域
						var len = $scope.list.length ;
						if($scope.status!='3'){
							//把数据清空
							outAllSelect() ;
							$scope.list.splice(0,len) ;
						}
					}
				}
				function outAllSelect(){//将所有tr全部置为非选中状态
					angular.forEach($scope.list,function(l){
						l.selected = false ;
					}) ;
				}
			}],
	        template: '<a href="javascript:void(0)"><span ng-show="!geo.showFlag">自定义区域</span><span ng-show="geo.showFlag">取消自定义</span></a>',
			link: function(scope, elem, attrs,ctrl) {
	            elem.bind('click', function() {
					scope.$apply(function(){
						scope.myClick() ;
					}) ;
					//var hideId = scope.hiddenInputId ;
					//$('#'+hideId).trigger('click') ;
	            });
	        }
	      };
      }) ;

	
		
	  //日期插件
	 directives.directive('datepicker',function(){
		return{
			restrict: 'A',
			scope: {},
			require:'ngModel',
			link: function (scope,elem,attr,ctrl) {
				if(!ctrl) return ;
				var minDateStr = attr['datepicker'] ;
				var minDate = new Date(minDateStr) ;
				//配置日期控件
		        var optionObj = {} ;
		        optionObj.dateFormat = "yy-mm-dd" ;
		        var updateModel = function(dateText){
		            scope.$apply(function  () {
		                //调用angular内部的工具更新双向绑定关系
		                ctrl.$setViewValue(dateText) ;
		            }) ;
		        }
	            optionObj.onSelect = function(dateText,picker){
	                updateModel(dateText) ;
	               // elem.focus() ;
	                validator.element(elem) ;
	                if(scope.select){
	                    scope.$apply(function  () {
	                        scope.select({date:dateText}) ;
	                    }) ;
	                }
	            }
	            optionObj.minDate = minDate ;
	            optionObj.showButtonPanel = true ;

	            ctrl.$render = function(){
	                //使用angular内部的 binding-specific 变量
	                elem.datepicker('setDate',ctrl.$viewValue || '') ;
	            }
				$(elem).datepicker(optionObj);
			}
		  };
		}) ;
		//时间插件
		directives.directive('timepicker',function(){
			return{
				restrict: 'A',
				scope: {},
				link: function (scope,elem,attr) {
					var timeVar = {
						controlType:'select',
						timeFormat: 'HHmm',
						timeOnly:  true,
						timeOnlyTitle: '选择时间',//Choose Time
						timeText: '时间',//Time
						hourText: '小时',//Hou
						minuteText: '分钟',//Minute
						currentText: '当前',//Current
						closeText: '关闭'//Close
					};
					$(elem).datetimepicker(timeVar);
				}
			};
		}) ;

		
		//重置数据
		var resetDataByFlag = function(nameList,flag,data,orgData){
		    if(!flag){//如果隐藏这需要重置数据
		        for(var i = 0 ; i < nameList.length ;i++){
		        	var curName = nameList[i] ;
		        	var orgValue = angular.copy(orgData[curName]) ;
		        	data[curName] = orgValue ;
		        }
		    }
		};

		var getFlagByServiceTypeAndServiceGroup = function (typeList, groupList,serviceType,serviceGroup) {
		    var flag = _.contains(typeList,serviceType) ;
		    if(flag&&groupList&&groupList.length>0){
		    	flag = _.contains(groupList, serviceGroup) ;
		    }
		    return flag ;
		};

		directives.directive('force',['FormStatusService','FormData',function(FormStatusService,FormData){
			return  {
				restrict:'A',
				scope:{orgData:'='},
				link: function (scope,elem,attrs) {//
					//@param : event 事件本身
					//@param ：needDigest ： 是否需要手动进行脏数据检查
					scope.$on('serviceTypeChangeNotice',function(event,needDigest){
						for(var fname in FormStatusService){
							var typeList = FormStatusService[fname]['typeList'] ;
							var groupList = FormStatusService[fname]['groupList'] ;
							var serviceType = FormData.serviceType;
							var serviceGroup = FormData.sel1.value ;
							var oldFlag = FormStatusService[fname]['showFlag'] ;
							var flag = getFlagByServiceTypeAndServiceGroup(typeList, groupList,serviceType,serviceGroup) ;
							//console.info(fname + ' -- ' + flag + '   , serviceType : ['+serviceType+'] , typeList ['+typeList+'] , groupList :['+groupList+']  , servcieGroup : ['+serviceGroup+'] ') ;
							if(oldFlag==!flag){//如果不同
								var nameList = FormStatusService[fname]['nameList'] ;
								resetDataByFlag(nameList,flag,FormData,scope.orgData) ;
								FormStatusService[fname]['showFlag']= flag;
								if(needDigest&&needDigest=='true'){
									scope.$digest() ;
								}
							}
						}
					}) ;
					// @param :event :自带的事件本身
					// @param :in_fname : 传入的forceName
					// @param :in_flag :传入的隐藏显示的falg----第一要传递字符串
					// @param :needDigest ：是否需要手动脏数据检查  第一要传递字符串
					scope.$on('singleChangeByFlagNotice', function (event,in_fname,in_flag,needDigest) {
						var fname = in_fname ;
						var newFlag = in_flag=='true'?true:false;
						var oldFlag = FormStatusService[fname]['showFlag'] ;
						console.info("fname : ["+fname+"] , newFlag : ["+newFlag+"] , oldFlag : ["+oldFlag+"] ") ;
						if(newFlag==!oldFlag){//当前显隐与将要的显隐相反时
							var nameList = FormStatusService[fname]['nameList'] ;
							resetDataByFlag(nameList,newFlag,FormData,scope.orgData) ;
							FormStatusService[fname]['showFlag']= newFlag;
							if(needDigest&&needDigest=='true'){
								scope.$digest() ;
							}
						}
					}) ;
				}
			} ;
		}]) ;


		//增强指令
		/*directives.directive('force',['FormStatusService','FormData',function(FormStatusService,FormData){
		    return  {
		        restrict:'E',//restrict
		        scope:{
					orgData:'='
		        },
				replace:true,
		        template:function(elem,attrs){
		        	var fname = attrs['fname'] ;
		        	var tmpStr = "showStatus."+fname+".showFlag" ;
		        	var html = '<div class="row row_from" ng-show= "'+tmpStr+'" ng-transclude=""></div>' ;
		        	return html ;
		        },
		        transclude:true,
		        controller:['$scope', '$element', '$attrs',function($scope, $element, $attrs){
		        	$scope.showStatus = FormStatusService ;
		        }] ,
		        link: function (scope,elem,attrs) {//
		        	//@param : event 事件本身
		        	//@param ：needDigest ： 是否需要手动进行脏数据检查
					scope.$on('serviceTypeChangeNotice',function(event,needDigest){
						var fname = attrs['fname'] ;
						var typeList = FormStatusService[fname]['typeList'] ;
						var groupList = FormStatusService[fname]['groupList'] ;
						var serviceType = FormData.serviceType;
						var serviceGroup = FormData.sel1.value ;
						var oldFlag = FormStatusService[fname]['showFlag'] ;
						var flag = getFlagByServiceTypeAndServiceGroup(typeList, groupList,serviceType,serviceGroup) ;
						//console.info(fname + ' -- ' + flag + '   , serviceType : ['+serviceType+'] , typeList ['+typeList+'] , groupList :['+groupList+']  , servcieGroup : ['+serviceGroup+'] ') ;
						if(oldFlag==!flag){//如果不同
							var nameList = FormStatusService[fname]['nameList'] ;
							resetDataByFlag(nameList,flag,FormData,scope.orgData) ;
						    FormStatusService[fname]['showFlag']= flag;
						    if(needDigest&&needDigest=='true'){
						    	scope.$digest() ;
						    }
						}
						
					}) ;
					 // @param :event :自带的事件本身
					 // @param :in_fname : 传入的forceName  
					 //@param :in_flag :传入的隐藏显示的falg----第一要传递字符串
					 // @param :needDigest ：是否需要手动脏数据检查  第一要传递字符串
					scope.$on('singleChangeByFlagNotice', function (event,in_fname,in_flag,needDigest) {
		                var fname = attrs['fname'] ;
		                var tmpFlag = in_flag=='true'?true:false;
		                if(fname==in_fname){//判断接受者是否为自己，如果为自己则需要相应的处理
		                   var oldFlag = FormStatusService[fname]['showFlag'] ;
		                   //console.info("fname : ["+fname+"] , tmpFlag : ["+tmpFlag+"] , oldFlag : ["+oldFlag+"] ") ;
		                   if(tmpFlag==!oldFlag){
		                   		var nameList = FormStatusService[fname]['nameList'] ;			
								resetDataByFlag(nameList,tmpFlag,FormData,scope.orgData) ;
							    FormStatusService[fname]['showFlag']= tmpFlag;
							    if(needDigest&&needDigest=='true'){
							    	scope.$digest() ;
							    }
		                   }
		                }
		            }) ;

		        }
		    } ;
		}]) ;*/
		

 }) ;

define('globalFlagService',['services'],function(require, exports, module){ 
	var services = require('services') ;

	services.factory('TableStatusServcie', function(){
	    return {
	        "tb183":{
	        	"showFlag":false,
	        },
	        "tb171":{
	        	"showFlag":false,
	        },
	        "tb172":{
	        	"showFlag":false,
	        },
	        "tb173Ticket":{
	        	"showFlag":false,
	        },
	        "tb173Tkt":{
	        	"showFlag":false,
	        },
	        "tb165":{
	        	"showFlag":false,
	        },
	        "tb186":{
	        	"showFlag":false,
	        },
	        "tb196":{
	        	"showFlag":false,
	        },
	        "tb198":{
	        	"showFlag":false,
	        },
	        "tb198UpGrade":{
	        	"showFlag":false,
	        },
	        "tb170":{
	        	"showFlag":true,
	        },
	        "tb178geo1":{
	        	"showFlag":false,
	        },
	        "tb178geo2":{
	        	"showFlag":false,
	        },
	        "tb178geo3":{
	        	"showFlag":false,
	        }
	    };
	}) ;


	services.factory('FormEditStatusServcie', function(){
	    return {
	        "firstMaintenanceDate":true,
	        "lastMaintenanceDate":true,
	        "description":true,
	        "fareBasis":true,
	        "availability":true,
	        "freeBaggageAllowancePieces":true,
	        "firstExcessOccurrence":true,
	        "lastExcessOccurrence":true,
	        "freeBaggageAllowanceWeight":true,
	        "freeBaggageAllowanceUnit":true,
	        "baggageTravelApplication":true,
	        "list196VO":true,
	        "noChargeNotAvailable":true,
	        "list170VO":true,
	        "list201VO":true,
	        "specSevFeeAndOrIndicator":true,
	        "specifiedServiceFeeMileage":true,
	        "specifiedServiceFeeApp":true,
	        "specServiceFeeColSub":true,
	        "specServiceFeeNetSell":true,
	        "indicatorComission":true,
	        "taxApplication":true,
	        "sequenceNumber":true,
	        "passengerTypeCode":true,
	        "minPassengerAge":true,
	        "maxPassengerAge":true,
	        "firstPassengerOccurrence":true,
	        "lastPassengerOccurrence":true,
	        "frequentFlyerStatus":true,
	        "mileageMinimum":true,
	        "mileageMaximum":true,
	        "customerIndexScoreMinimum":true,
	        "customerIndexScoreMaxmum":true,
	        "list172VO":true,
	        "list183VO":true,
	        "publicPrivateIndicator":true,
	        "geoSpecFromToWithin":true,
	        "geoSpecSectPortJourney":true,
	        "geoSpecTravelIndicator":true,
	        "geoSpecExceptionStopTime":true,
	        "geoSpecExceptionStopUnit":true,
	        "geoSpecStopConnDes":true,
	        "geoSpecLoc1Type":true,
	        "geoSpecLoc1":true,
	        "list178Loc1":true,
	        "geoSpecLoc2Type":true,
	        "geoSpecLoc2":true,
	        "geoSpecLoc3Type":true,
	        "geoSpecLoc3":true,
	        "list178Loc3":true,
	        "travelStartDate":true,
	        "travelEndDate":true,
	        "startTime":true,
	        "stopTime":true,
	        "timeApplication":true,
	        "dayOfWeek":true,
	        "equipment":true,
	        "list165VO":true,
	        "list186VO":true,
	        "cabin":true,
	        "list198VO":true,
	        "upgradeToCabin":true,
	        "list198UpgradeVO":true,
	        "advancedPurchasePeriod":true,
	        "advancedPurchaseUnit":true,
	        "tourCode":true,
	        "list173TicketVO":true,
	        "tariff":true,
	        "rule":true,
	        "list173TktVO":true,
	        "list171VO":true,
	        "advancedPurchaseTktIssue":true,
	        "indicatorReissueRefund":true,
	        "formOfRefund":true,
	        "indicatorInterline":true
	    };
	}) ;


	//整个页面的组件在serviceType为xxx时应该显示到页面上
	services.factory('FormStatusService', function(){
	    return {
	        "firstMaintenanceDate":{
	        	"typeList":['F','M','R','T','A','B','C','E','P'],
	        	"groupList":[],
	        	"nameList":['firstMaintenanceDate'],
	        	"showFlag":true,
	        	"editFlag":true
	        },
	        "lastMaintenanceDate":{
	        	"typeList":['F','M','R','T','A','B','C','E','P'],
	        	"groupList":[],
	        	"nameList":['lastMaintenanceDate'],
	        	"showFlag":true,
	        	"editFlag":true
	        },
	        "description":{
	        	"typeList":['F','M','R','T','B','E'],
	        	"groupList":[],
	        	"nameList":['description'],
	        	"showFlag":true,
	        	"editFlag":true
	        },
	        "fareBasis":{
	        	"typeList":['F','M','R','T','A','B','C','E','P'],
	        	"groupList":[],
	        	"nameList":['fareBasis'],
	        	"showFlag":true,
	        	"editFlag":true
	        },
	        "availability":{
	        	"typeList":['F','M','R','T','A','B','C','E','P'],
	        	"groupList":[],
	        	"nameList":['availability'],
	        	"showFlag":true,
	        	"editFlag":true
	        },
	        "freeBaggageAllowancePieces":{
	        	"typeList":['A'],
	        	"groupList":[],
	        	"nameList":['freeBaggageAllowancePieces'],
	        	"showFlag":true,
	        	"editFlag":true
	        },
	        "firstAndLastExcessOccurrence":{
	        	"typeList":['C','P'],
	        	"groupList":[],
	        	"nameList":['firstExcessOccurrence','lastExcessOccurrence'],
	        	"showFlag":true,
	        	"editFlag":true
	        },
	        "freeBaggageAllowanceWeight":{
	        	"typeList":['A','C','P'],
	        	"groupList":[],
	        	"nameList":['freeBaggageAllowanceWeight','freeBaggageAllowanceUnit'],
	        	"showFlag":true,
	        	"editFlag":true
	        },
	        "baggageTravelApplication":{
	        	"typeList":['A','C','P'],
	        	"groupList":[],
	        	"nameList":['baggageTravelApplication'],
	        	"showFlag":true,
	        	"editFlag":true
	        },
			"list196VO":{
				"typeList":['A','C','P'],
				"groupList":[],
				"nameList":['list196VO'],
				"showFlag":true,
				"editFlag":true
			},
			"noChargeNotAvailable":{
				"typeList":['F','M','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['noChargeNotAvailable'],
				"showFlag":true,
				"editFlag":true
			},
			"list170VOAndlist201VO":{
				"typeList":['F','M','R','T','C','P'],
				"groupList":[],
				"nameList":['list170VO','list201VO'],
				"showFlag":true,
				"editFlag":true
			},
			"specSevFeeAndOrIndicator":{
				"typeList":['F','M','R','T','C','P'],
				"groupList":[],
				"nameList":['specSevFeeAndOrIndicator'],
				"showFlag":true,
				"editFlag":true
			},
			"specifiedServiceFeeMileage":{
				"typeList":['F','M','R','T','C','P'],
				"groupList":[],
				"nameList":['specifiedServiceFeeMileage'],
				"showFlag":true,
				"editFlag":true
			},
			"specifiedServiceFeeApp":{
				"typeList":['F','M','R','T','C','P'],
				"groupList":[],
				"nameList":['specifiedServiceFeeApp'],
				"showFlag":true,
				"editFlag":true
			},
			"specServiceFeeColSub":{
				"typeList":['F','M','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['specServiceFeeColSub'],
				"showFlag":true,
				"editFlag":true
			},
			"specServiceFeeNetSell":{
				"typeList":['F','M','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['specServiceFeeNetSell'],
				"showFlag":true,
				"editFlag":true
			},
			"indicatorComission":{
				"typeList":['F','M','R','T','C','P'],
				"groupList":[],
				"nameList":['indicatorComission'],
				"showFlag":true,
				"editFlag":true
			},
			"taxApplication":{
				"typeList":['F','M','R','T','C','P'],
				"groupList":[],
				"nameList":['taxApplication'],
				"showFlag":true,
				"editFlag":true
			},
			"sequenceNumber":{
				"typeList":['F','M','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['sequenceNumber'],
				"showFlag":true,
				"editFlag":true
			},
			"passengerTypeCode":{
				"typeList":['F','M','R','T','A','B','C','P'],
				"groupList":[],
				"nameList":['passengerTypeCode'],
				"showFlag":true,
				"editFlag":true
			},
			"minAndMaxPassengerAge":{
				"typeList":['F','M','R','T','A','B','C','P'],
				"groupList":[],
				"nameList":['minPassengerAge','maxPassengerAge'],
				"showFlag":true,
				"editFlag":true
			},
			"firstAndLastPassengerOccurrence":{
				"typeList":['F','M','R','T'],
				"groupList":[],
				"nameList":['firstPassengerOccurrence','lastPassengerOccurrence'],
				"showFlag":true,
				"editFlag":true
			},
			"frequentFlyerStatus":{
				"typeList":['F','M','R','T','A','B','C','P'],
				"groupList":[],
				"nameList":['frequentFlyerStatus'],
				"showFlag":true,
				"editFlag":true
			},
			"mileageMinAndMaximum":{
				"typeList":['F','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['mileageMinimum','mileageMaximum'],
				"showFlag":true,
				"editFlag":true
			},
			"customerIndexScoreMinAndMaximum":{
				"typeList":['F','M','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['customerIndexScoreMinimum','customerIndexScoreMaxmum'],
				"showFlag":true,
				"editFlag":true
			},
			"list172VO":{
				"typeList":['F','M','R','T','A','B','C','P'],
				"groupList":[],
				"nameList":['list172VO'],
				"showFlag":true,
				"editFlag":true
			},
			"list183VO":{
				"typeList":['F','M','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['list183VO'],
				"showFlag":true,
				"editFlag":true
			},
			"publicPrivateIndicator":{
				"typeList":['F','M','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['publicPrivateIndicator'],
				"showFlag":true,
				"editFlag":true
			},
			"geoSpecFromToWithin":{
				"typeList":['F','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['geoSpecFromToWithin'],
				"showFlag":true,
				"editFlag":true
			},
			"geoSpecSectPortJourney":{
				"typeList":['F','R','A','B','C','E','P'],
				"groupList":[],
				"nameList":['geoSpecSectPortJourney'],
				"showFlag":true,
				"editFlag":true
			},
			"geoSpecTravelIndicator":{
				"typeList":['F','R','A','B','C','E','P'],
				"groupList":[],
				"nameList":['geoSpecTravelIndicator'],
				"showFlag":true,
				"editFlag":true
			},
			"geoSpecExceptionStopTimeAndUnit":{
				"typeList":['F','R','A','C','P'],
				"groupList":[],
				"nameList":['geoSpecExceptionStopTime','geoSpecExceptionStopUnit'],
				"showFlag":true,
				"editFlag":true
			},
			"geoSpecStopConnDes":{
				"typeList":['F','R','A','B','C','E','P'],
				"groupList":[],
				"nameList":['geoSpecStopConnDes'],
				"showFlag":true,
				"editFlag":true
			},
			"geoSpecLoc1AndType":{
				"typeList":['F','M','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['geoSpecLoc1Type','geoSpecLoc1'],
				"showFlag":true,
				"editFlag":true
			},
			"list178Loc1":{
				"typeList":['F','M','A','C','P','T'],
				"groupList":[],
				"nameList":['list178Loc1'],
				"showFlag":true,
				"editFlag":true
			},
			"geoSpecLoc2AndType":{
				"typeList":['F','R','A','B','C','E','P'],
				"groupList":[],
				"nameList":['geoSpecLoc2Type','geoSpecLoc2'],
				"showFlag":true,
				"editFlag":true
			},
			"list178Loc2":{
				"typeList":['F','M','A','C','P','T'],
				"groupList":[],
				"nameList":['list178Loc2'],
				"showFlag":true,
				"editFlag":true
			},
			"geoSpecLoc3AndType":{
				"typeList":['F','R','A','B','C','E','P'],
				"groupList":[],
				"nameList":['geoSpecLoc3Type','geoSpecLoc3'],
				"showFlag":true,
				"editFlag":true
			},
			"list178Loc3":{
				"typeList":['F','M','A','C','P','T'],
				"groupList":[],
				"nameList":['list178Loc3'],
				"showFlag":true,
				"editFlag":true
			},
			"travelStartDate":{
				"typeList":['F','M','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['travelStartDate'],
				"showFlag":true,
				"editFlag":true
			},
			"travelEndDate":{
				"typeList":['F','M','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['travelEndDate'],
				"showFlag":true,
				"editFlag":true
			},
			"startTime":{
				"typeList":['F','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['startTime'],
				"showFlag":true,
				"editFlag":true
			},
			"stopTime":{
				"typeList":['F','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['stopTime'],
				"showFlag":true,
				"editFlag":true
			},
			"timeApplication":{
				"typeList":['hidden'],
				"groupList":[],
				"nameList":['timeApplication'],
				"showFlag":true,
				"editFlag":true
			},
			"dayOfWeek":{
				"typeList":['F','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['dayOfWeek'],
				"showFlag":true,
				"editFlag":true
			},
			"equipmentAndlist165":{
				"typeList":['F','A','B','C','E','P'],
				"groupList":[],
				"nameList":['equipment','list165VO'],
				"showFlag":true,
				"editFlag":true
			},
			"list186VO":{
				"typeList":['F','R','T','A','B','C','E','P'],
				"groupList":[],
				"nameList":['list186VO'],
				"showFlag":true,
				"editFlag":true
			},
			"cabin":{
				"typeList":['F','A','B','C','P'],
				"groupList":[],
				"nameList":['cabin'],
				"showFlag":true,
				"editFlag":true
			},
			"list198VO":{
				"typeList":['F','A','B','C','P'],
				"groupList":[],
				"nameList":['list198VO'],
				"showFlag":true,
				"editFlag":true
			},
			"upgradeToCabin":{
				"typeList":['F','M'],
				"groupList":['UP','BDUP'],
				"nameList":['upgradeToCabin'],
				"showFlag":true,
				"editFlag":true
			},
			"list198UpgradeVO":{
				"typeList":['F','M'],
				"groupList":['UP','BDUP','SA','BDSA'],
				"nameList":['list198UpgradeVO'],
				"showFlag":true,
				"editFlag":true
			},
			"advancedPurchasePeriodAndUnit":{
				"typeList":['F','M','R','T','C','P'],
				"groupList":[],
				"nameList":['advancedPurchasePeriod','advancedPurchaseUnit'],
				"showFlag":true,
				"editFlag":true
			},
			"tourCode":{
				"typeList":['F','M','R','T','A','B','C','P'],
				"groupList":[],
				"nameList":['tourCode'],
				"showFlag":true,
				"editFlag":true
			},
			"list173TicketVO":{
				"typeList":['F','M','R','T','A','B','C','P'],
				"groupList":[],
				"nameList":['list173TicketVO'],
				"showFlag":true,
				"editFlag":true
			},
			"tariff":{
				"typeList":['F','R','A','B','C','P'],
				"groupList":[],
				"nameList":['tariff'],
				"showFlag":true,
				"editFlag":true
			},
			"rule":{
				"typeList":['F','R','A','B','C','P'],
				"groupList":[],
				"nameList":['rule'],
				"showFlag":true,
				"editFlag":true
			},
			"list173TktVO":{
				"typeList":['F','R','A','B','C','P'],
				"groupList":[],
				"nameList":['list173TktVO'],
				"showFlag":true,
				"editFlag":true
			},
			"list171VO":{
				"typeList":['F','R','A','B','C','P'],
				"groupList":[],
				"nameList":['list171VO'],
				"showFlag":true,
				"editFlag":true
			},
			"advancedPurchaseTktIssue":{
				"typeList":['F','R','T','P'],
				"groupList":[],
				"nameList":['advancedPurchaseTktIssue'],
				"showFlag":true,
				"editFlag":true
			},
			"indicatorReissueRefund":{
				"typeList":['F','M','A','C','P','T'],
				"groupList":[],
				"nameList":['indicatorReissueRefund'],
				"showFlag":true,
				"editFlag":true
			},
			"formOfRefund":{
				"typeList":['F','M','R','T','C','P'],
				"groupList":[],
				"nameList":['formOfRefund'],
				"showFlag":true,
				"editFlag":true
			},
			"indicatorInterline":{
				"typeList":['F','M','R','T','C','P'],
				"groupList":[],
				"nameList":['indicatorInterline'],
				"showFlag":true,
				"editFlag":true
			}
	    };
	}) ;

	

	

 }) ;

define('s7EditService',['services'],function(require, exports, module){ 
	var app = require('services') ;
	// $q 是内置服务，所以可以直接使用  
	app.factory('S7EditService', ['$http', '$q', function ($http, $q) {  
	  return {  
		    getDataByUrl : function(url) {  
		      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
		      $http({method: 'GET', url: url}).  
		      success(function(data, status, headers, config) {  
		        deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了  
		      }).  
		      error(function(data, status, headers, config) {  
		        deferred.reject(data);   // 声明执行失败，即服务器返回错误  
		      });  
		      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
		    },
		    postDate:function(url,queryParam){
		    	var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
		        $http({method: 'POST', url: url,data:queryParam}).  
		        success(function(data, status, headers, config) {  
		           deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了  
		        }).  
		        error(function(data, status, headers, config) {  
		           deferred.reject(data);   // 声明执行失败，即服务器返回错误  
		        });  
		      	return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
		    }
		}
	}]);  

}) ;
define('s7DataService',['services'],function(require, exports, module){ 
	var app = require('services') ;
	app.factory('FormData',['DEFAULT_SERVICETYPE',function(DEFAULT_SERVICETYPE) {
		var contextPath = $.trim($("#contextPath").val()) ;
		var carrCode = $.trim($("#carrCode").val()) ;
		var action = $.trim($("#action").val()) ;
		//console.log("[contextPath : "+contextPath+"],[carrCode : "+carrCode+"],[action:"+action+"]") ;
		return {
		   id:'',
		   status:'',
		   statusDes:'',
		   contextPath:contextPath,
		   carrCode:carrCode,
		   serviceAndSubCode:'',
		   serviceType:DEFAULT_SERVICETYPE,/*s7中包含信息//默认值为'F'//根据选择的s5决定是'F'/'M'*/
		   action:action,
		   sel1:{"showStr":"","value":""},
		   sel2:{"showStr":"","value":""},
		   sel3:{"showStr":"","value":"","textTableNo163":""},
		   sel4:[],
		   basicInfoVo:{
		   		id:"",
				subCode:"",
				indCxr:"",
				subDescription:"",
				ftmCode:"",
				carrCode:"",
				ftmDescription:"",
				serviceGroup:"",
				serviceGroupDescription:"",
				subGroup:"",
				subGroupDescription:"",
				serveceType:"",
				commercialName:""//商务名称
		   },
		   firstMaintenanceDate:'',//-----------页面第二部分开始--------------//
		   lastMaintenanceDate:'',
		   description:'',/*描述*/
		   fareBasis:'',/*运价基础*/
		   freeBaggageAllowancePieces:'',/*免费行李件数*/
		   firstExcessOccurrence:'1',/*收费行李件数起点*/
		   lastExcessOccurrence:'',/*收费行李件数结束*/
		   freeBaggageAllowanceWeight:'',/*免费重量*/
		   freeBaggageAllowanceUnit:'',/*免费单位*/
		   noChargeNotAvailable:"",/*'E'的时候'免费'//s7中包含信息*/
		   baggageTravelApplication:'',
		   list196VO:[/*备注例外行李*/],
		   discountOrNot:'1',/*是否打折，这个字段不会保存到数据库*/
		   discountRuleTableNo201:'',
		   list201VO:[],
		   serviceFeeCurTableNo170:'',
		   list170VO:[],
			/*-------------页面第二部分结束---------------------------*/
			mileageMinimum:'',/*里程//新增字段*/
			mileageMaximum:'',/*里程//新增字段*/
			specifiedServiceFeeApp:'',/*适用于//新增字段*/
			specServiceFeeColSub:'',/*包含，扣除//新增字段*/
			specServiceFeeNetSell:'',/*净价/销售价//新增字段*/
			specSevFeeAndOrIndicator:'',/*或、和//新增字段*/
			specifiedServiceFeeMileage:'',/*里程//新增字段*/
			availability:'N',/*必须检查可用性（查库存）*/
		 	sequenceNumber:'',/*优先级序号//--------------------页面第三部分开始---------------------------*/
		 	passengerTypeCode:'',/*旅客类型*/
		 	minPassengerAge:'',/*最小年龄--新增字段*/
			maxPassengerAge:'',/*最大年龄--新增字段*/
		 	firstPassengerOccurrence:'',/*个数范围    第几个到第几个【数字】//新增字段*/
		 	lastPassengerOccurrence:'',/*个数范围    第几个到第几个【数字】//新增字段*/
		 	customerIndexScoreMinimum:'',/*客户积分范围【数字】//新增*/
		 	customerIndexScoreMaxmum:'',/*客户积分范围【数字】//新增*/
		 	frequentFlyerStatus:'',/*常旅客状态*/
		 	accountCodeTableNo172:'',/*大客户/特殊客户表（T172）--子表//新增*/
		 	list172VO:[],
		 	ticketDesignatorTableNo173:'',/*指定客票表（T173）--子表//新增*/
		 	list173TicketVO:[],
			tktDesignatorTableNo173:"",/*173*/
			list173TktVO:[],
		 	tourCode:'',/*旅行编码（关联客票）【字母或数字】--新增*/
		 	cabin:'',/*服务等级*/
		 	upgradeToCabin:'',
		 	rbdTableNo198:'',/*暂时没啥用,后台也不使用这个字段*/
			list198VO:[],/*订座属性表*/
			upgradeToRbdTableNo198:'',/*暂时没啥用，后台也不是该字段*/
			list198UpgradeVO:[],/*座位属性表，或则升舱属性表*/
			securityTableNo183:'',//发布安全表//暂时没啥用，后台也不是该字段*/
			list183VO:[],//安全发布表*/
			publicPrivateIndicator:'',/*公有、私有//新增字段*/
			carrierFlightTableNo186:'',/*航班信息表//暂时没啥用，后台也不是该字段*/
			list186VO:[],
			taxApplication:'Y',/*是否含税费//新增字段*/
			tariff:'',/*税费*/
			rule:'',/*规则*/
			cxrResFareTableNo171:"",/*客票舱位等级表*/
			list171VO:[],/*客票舱位等级表*/
			equipment:'',/*机型*/
			equipmentTypeTableNo165:'',
			list165VO:[] ,
			startTime:'',/*开始时刻*/
			stopTime:'',/*结束时刻*/
			timeApplication:'D',/*应用范围//新增字段*/
			dayOfWeek:'',/*星期 -- 新增字段*/
			dayOfWeekShow:{"w1":false,"w2":false,"w3":false,"w4":false,"w5":false,"w6":false,"w7":false},//前台数据，后台无对应的属性
			advancedPurchasePeriod:'',/*提前购票时间--新增字段*/
			advancedPurchaseUnit:'',/*时间单位 -- 新增字段*/
			advancedPurchaseTktIssue:'',/*是否与机票同时出票 -- 新增字段*/
			indicatorReissueRefund:'',/*退、改 -- 新增字段*/
			formOfRefund:'',/*退款形式--新增字段*/
			indicatorComission:'Y',/*(是否有)代理费--新增字段*/
			indicatorInterline:'Y',/*是*/
			firstTravelYear:'',
			firstTravelMonth:'',
			firstTravelDay:'',
			lastTravelYear:'',
			lastTravelMonth:'',
			lastTravelDay:'',
			travelStartDate:'',/*这个是中间数据，后台不存在对应的属性*/
			travelEndDate:'',/*这个是中间数据，后台不存在对应的属性*/
			list178Loc1Id:'',/*区域1表格id*/
			list178Loc1:[],/*区域1对应的表格*/
			list178Loc2Id:'',/*区域2表格id*/
			list178Loc2:[],/*区域2对应的表格*/
			list178Loc3Id:'',/*区域3表格id*/
			list178Loc3:[],/*区域2对应的表格*/
			geoSpecFromToWithin:'',/*区域限制*/
			geoSpecSectPortJourney:'P',//航段限制-目前返回的是定死的字符串‘P’*/
			geoSpecLoc1Type:'',/*区域1类型*/
			geoSpecLoc1:'',/*区域1代码*/
			geoSpecLoc2Type:'',/*区域2类型*/
			geoSpecLoc2:'',/*区域2代码*/
			geoSpecLoc3Type:'',/*区域3类型*/
			geoSpecLoc3:'',/*区域3代码 下面的都是新增 的字段*/
			geoSpecTravelIndicator:'',/*指定区域*/
			geoSpecExceptionStopTime:'',/*经停时间//新增字段*/
			geoSpecExceptionStopUnit:'',/*经停单位*/
			geoSpecStopConnDes:''/*经停类型(限输入1位字母)*/
		}
	}]);
	
}) ;
define('filters',function(require, exports, module){ 
	var app = angular.module('app.filter',[]); 
	//过滤choose1
	app.filter("serviceGroupFilter", function() {
	    var myFunc = function(data,inputStr){
			inputStr = inputStr || "" ;
	        var retData = [] ;
	        if(inputStr.length>0){
				inputStr = inputStr.toLowerCase() ;
	            angular.forEach(data,function(e){
	                if(e.serviceGroupDescription.toLowerCase().indexOf(inputStr)!=-1){
	                    retData.push(e) ;
	                }
	            }) ;
	        }else{
	            retData = data ;
	        }
	        return retData ;
	    }
	    return myFunc ;
	});
	
	//subGroupDescription
	app.filter("subGroupFilter", function() {
	    var myFunc = function(data,inputStr){
			inputStr = inputStr || "" ;
	        var retData = [] ;
	        if(inputStr.length>0){
				inputStr = inputStr.toLowerCase() ;
	            angular.forEach(data,function(e){
	                if(e.subGroupDescription.toLowerCase().indexOf(inputStr)!=-1){
	                    retData.push(e) ;
	                }
	            }) ;
	        }else{
	            retData = data ;
	        }
	        return retData ;
	    }
	    return myFunc ;
	});
	//lastGroupList
	app.filter("lastGroupFilter", function() {
	    var myFunc = function(data,inputStr){
			inputStr = inputStr || "" ;
	        var retData = [] ;
	        if(inputStr.length>0){
				inputStr = inputStr.toLowerCase() ;
	            angular.forEach(data,function(e){
					var tmpStr = "["+e.serviceSubCode+"]"+e.commercialName ;
	                if(tmpStr.toLowerCase().indexOf(inputStr)!=-1){
	                    retData.push(e) ;
	                }
	            }) ;
	        }else{
	            retData = data ;
	        }
	        return retData ;
	    }
	    return myFunc ;
	});
	
}) ;
//主要用来加载各个控制器（所有的控制器都将在这个文件中被加载）,除此之外再不用做其他，
//因为我们可以有很多个控制器文件，按照具体需要进行添加。
define('index_gulp-seajs-cmobo_6',['jqueryuitimepickeraddon','eidtController','headController','basicInfoController','chargeConfirmController','ruleDetailController'],function(require, exports, module) {
	 //需要的插件
	 require('jqueryuitimepickeraddon') ;
	 require('eidtController') ;
	 //头部
	 require('headController') ;
	 //基本信息部分
	 require('basicInfoController') ;
	 //第一块信息
	 require('chargeConfirmController') ;
	 //第二块信息
	 require('ruleDetailController') ;
});

define('index_gulp-seajs-cmobo_5',['commonDirective','basicInfoDirective','ruleDetailDirective','tableDirective'],function(require, exports, module){ 
	require('commonDirective') ;//公共指令
	require('basicInfoDirective') ;//基本信息指令
	//require("./tb198UpGradeDirective") ;//[座位属性表/升舱属性]table198指令
	require('ruleDetailDirective') ;//规则明细指令
	require('tableDirective') ;//规则明细指令
 }) ;



define('index',['s7DataService','s7EditService','globalFlagService'],function(require, exports, module){ 
	require('s7DataService') ;
	require('s7EditService') ;
	require('globalFlagService') ;
}) ;
define('router',['index','index_gulp-seajs-cmobo_5','index_gulp-seajs-cmobo_6','filters'],function(require, exports, module) {
	//require("ui-router") ;
	require('index') ;
	require('index_gulp-seajs-cmobo_5') ;
	require('index_gulp-seajs-cmobo_6') ;
	require('filters') ;
	//把需要的模块全部加载到testApp中
	var app = angular.module('app',['pasvaz.bindonce','app.factory','app.controllers','app.directives','app.filter']);
	app.constant('NEW_ADD_STR', 'add');    //方法3定义全局变量
	app.constant('UPDATE_STR', 'update');    //方法3定义全局变量
	app.constant('DEFAULT_SERVICETYPE','F') ;//默认的serviceType
}) ;

define('main',['tuiDialog','datepicker','router'],function(require, exports, module) {
	//var pathStr = require.resolve('src/main') ;
	//console.info("path : " + pathStr) ;
	//require('tuiValidator');
	require('tuiDialog') ;
	require('datepicker') ;
	//把整个app的路由加载进来
	require('router') ;
	module.exports = {
 		init: function(){
			angular.element(document).ready(function() {
			    angular.bootstrap(document, ['app']);
				  //angular加载完毕以后注册tui插件的校验
				  registPageValidate() ;
			});
 		}
 	};
	
	function registPageValidate(){
		//对表单注册校验
		var validator = $("#s7_form").validate({meta : ""});
		window.validator = validator ;
		//s7_save//提交按钮
		$("#s7_save").bind("click",function (e) {
		   //直接用来校验表单 同 下面的  validator.form()函数
		   //var flag = $("#signupForm").valid() ;
		   var element  = angular.element($("#EditControllerDiv"));
		   var scope = element.scope();
		   var action = scope.data.action ;
		   var sel3ShowStr = scope.data.sel3.showStr ;
		   if(action=='add'&&sel3ShowStr==''){
		   		$.showTuiErrorDialog('必须选择到最后一级！');
		   }else{
		   	   var flag = validator.form() ;
			   console.info('jquery validate form return flag : ' + flag) ;
			   if(flag){
			   		//获取指定id元素上的controller
					scope.saveFormData('save') ;
			   }
		   }
		  // console.info("校验是否通过flag : " + flag) ;
		}) ;
		
		//点击保存并发布按钮
		$("#s7_saveAndPublish").bind("click",function (e) {
		   var element  = angular.element($("#EditControllerDiv"));
		   var scope = element.scope();
		   var action = scope.data.action ;
		   var sel3ShowStr = scope.data.sel3.showStr ;
		   if(action=='add'&&sel3ShowStr==''){
		   	   $.showTuiErrorDialog('必须选择到最后一级！');
		   }else{
		   		//直接用来校验表单 同 下面的  validator.form()函数
			   var flag = validator.form() ;
			    console.info('jquery validate form return  flag : ' + flag) ;
			   if(flag){
					//获取指定id元素上的controller
					scope.saveFormData('saveAndPublish') ;
			   }
		   }
		}) ;
		//当整个页面加载完毕后发送一次serviceTypeChange的通知，因为有时候serviceType会有默认值
		/*setTimeout(function(){
			scope.$broadcast('serviceTypeChangeNotice','true') ;
		},1000) ;*/
	}

});

