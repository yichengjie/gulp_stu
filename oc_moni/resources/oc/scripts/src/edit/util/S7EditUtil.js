define(function (require, exports, module) {
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

	//这边是要返回的方法的集合处
	var EditUtil = {
		initData:{/*初始化*/		
			initOtherData:initOtherData,
			initListData:initListData
		}

	} ;	

	return EditUtil ;
}) ;