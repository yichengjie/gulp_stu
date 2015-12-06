define(function(require, exports, module) {
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
		var action = formData.action ;
		var serviceType = formData['serviceType'] ;
		if(orgFormData.action == NEW_ADD_STR && orgFormData.sel3.showStr==''){//如果第三个选择框没有选择
			$.showTuiErrorDialog('必须选择到最后一级！');
			return false;
		}
		//第一个校验
		//其他校验
		//1.表格数据校验[删除表格中的非法数据:eg:第一个字段为空的假数据]
		util.delInValidList(formData) ;
		util.dealOtherData(formData) ;
		//2.一般字段校验

		//如果为 【和】那么金额必填
		if(formData['specSevFeeAndOrIndicator']=='A'||(formData['noChargeNotAvailable']==''&&formData['specifiedServiceFeeMileage']=='')){
			if(formData['list201VO'].length==0&&formData['list170VO'].length==0){
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