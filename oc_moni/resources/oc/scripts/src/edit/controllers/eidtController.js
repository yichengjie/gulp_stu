define(function (require, exports, module) {
	var controllers = require('./controllers') ;
	var util = require('../util/S7FormDataUtil') ;
	var jsonDate = require('../data/editJsonData') ;
	var EditUtil = require('../util/S7EditUtil') ;
	var jsonDataHelper = require('../data/jsonDataHelper') ;
	var commonUtil = require('../util/commonUtil') ;



	//最外层controller
	controllers.controller('EditController',['$scope','FormData','NEW_ADD_STR','UPDATE_STR','$http','S7EditService','TableStatusServcie','FormEditStatusServcie',function($scope,FormData,NEW_ADD_STR,UPDATE_STR,$http,S7EditService,TableStatusServcie,FormEditStatusServcie){
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
