define(function(require, exports, module){ 
	var app = require('./services') ;
	app.factory('FormData',['DEFAULT_SERVICETYPE',function(DEFAULT_SERVICETYPE) {
		var contextPath = $.trim($("#contextPath").val()) ;
		var carrCode = $.trim($("#carrCode").val()) ;
		var action = $.trim($("#action").val()) ;
		console.log("[contextPath : "+contextPath+"],[carrCode : "+carrCode+"],[action:"+action+"]") ;
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