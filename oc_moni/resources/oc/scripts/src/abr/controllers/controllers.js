define(function(require, exports, module) {
	var app = angular.module("app.controller",[]) ;
	var FormDataUtil = require("../util/FormDataUtil") ;
	app.controller('EditController', ['$scope','FormData','$http','ErrorData','$q', function($scope,FormData,$http,ErrorData,$q){
		$scope.error= ErrorData ;
		$scope.headerTipStr = "新建数据源配置" ;
		$scope.data = FormData ;
		var id =  $.trim($("#id").val()) ;
		var action = $.trim($("#action").val()) ;
		var carrCode = $.trim($("#carrCode").val()) ;
		var contextPath = $.trim($("#contextPath").val()) ;
		//这个字段是判断当前登陆用户的信息//属于航空公司或则航信用户
		FormData.id = id ;
		FormData.action = action ;
		FormData.carrCode = carrCode ;
		FormData.contextPath = contextPath ;
		//前面几个一般表格的显示隐藏
		$scope.tbFlagData = {
			"publishObject": {"flag": false,"title": "填写表格"}
		} ;
		if(action=='add'){
			$scope.headerTipStr = "新建数据源配置" ;
			initPage4Add() ;
		}else if (action=='update'){
			$scope.headerTipStr = "更新数据源配置" ;
			initPage4Update() ;
		}
		
		//init add page
		function initPage4Add(){
			initListData($scope.data,$scope.tbFlagData) ;
		}
		
		//init update page
		function initPage4Update(){
			var id = $scope.data.id ;
			var url = $scope.data.contextPath +"/abr/findAbrDataSourceCfgById?id="+id ; 
			$http.get(url)
			.success(function(data){
				if (data.flag == 'true' ) {
					FormDataUtil.convertVo2FormData(data.vo,$scope.data) ;
					initListData($scope.data,$scope.tbFlagData) ;
				} else {
					$.showTuiErrorDialog('获取数据出错！');
				}
			});
		}
		
		$scope.backPage = function(){
			 window.location.href= $scope.data.contextPath+'/abr/toCfgAbrDatasource' ;
		}
		
		/******************这一部分是select提供数据开始*************************************/
		/*{"name":"运价相关","value":"F"},{"name":"客票相关","value":"T"},
		 * {"name":"商品相关","value":"M"},{"name":"规则相关","value":"R"}
		 */
		$scope.selectList = {
			"serviceTypeList":[
				{"name":"选择","value":"*"},{"name":"免费行李","value":"A"},
				{"name":"随携行李","value":"B"},{"name":"付费行李","value":"C"},
				{"name":"预付费行李","value":"P"},{"name":"禁运行李","value":"E"}		
			]
		} ;
		/******************这一部分是select提供数据结束*************************************/
		$scope.tbTitleList = {
			"pbObj":[{"title":"发布对象类型"},{"title":"部门代码"}]
		}
		//提交表单数据
		$scope.saveFormData = function(){
			var action = $scope.data.action ;
			var url = $scope.data.contextPath+"/abr/saveFormData" ;
			var vo = FormDataUtil.convertFormData2Vo($scope.data) ;
			var flag = false; 
			$scope.$apply(function(){
				flag = FormDataUtil.validFormData(vo,$scope.error,vo.status) ;
			}) ;
			var promise = FormDataUtil.validSequcenceNumber(vo.sequcenceNumber, $scope.error,$http,$scope.data.contextPath,vo.id,$q) ;
		    promise.then(function (result) {
	    		if(flag){
	    			//提示是否保存数据
	    			$.showTuiConfirmDialog('保存?', function() {
		    			$http.post(url,vo,{params:{"action":action}})
						.success(function(data){
							if (data.flag == 'true' ) {
								$.showTuiSuccessDialog('保存成功！', function() {
									$.showTuiWaitingDialog('即将返回查询界面!', 200, 60);
									setTimeout(function() {
										$.closeTuiWindow();
									}, 5000);
									window.location.href= $scope.data.contextPath+'/abr/toCfgAbrDatasource' ;
								});
							} else {
								$.showTuiErrorDialog('保存数据出错！');
							}
						});
	    			}) ;
				}
            }, function (error) {
            	console.info("error : " + error) ;
            });
		}
		//初始化数据
		function initListData(dataSourceCfgVo, tbFlagData){
			//publish object
			initTbData(dataSourceCfgVo.publishObjectList, tbFlagData.publishObject);
		}
		function  initTbData (list,flagData){
			if(list){
				if(list.length>0){
					flagData.flag = true ;
					flagData.title = "收起表格" ;
				}
			}
		}
		
		
		
		//数据校验部分
		$scope.validEffDate = function(){
			var effDate = $scope.data.effDate ;
			FormDataUtil.validEffDate(effDate,$scope.error,$scope.data.status) ;
		}
		
		$scope.validDiscDate = function(){
			var effDate = $scope.data.effDate ;
			var discDate = $scope.data.discDate ;
			FormDataUtil.validDiscDate(effDate,discDate,$scope.error) ;
		}
		
		$scope.validSequcenceNumber = function(){
			var sequcenceNumber = $scope.data.sequcenceNumber ;
			FormDataUtil.validSequcenceNumber(sequcenceNumber,$scope.error,$http,$scope.data.contextPath,$scope.data.id,$q) ;
		}
		
	
		$scope.validInternationalTag = function(){
			var internationalTag = $scope.data.internationalTag ;
			FormDataUtil.validInternationalTag(internationalTag,$scope.error) ;
		}
		
		$scope.validDataSource = function(){
			var dataSource = $scope.data.dataSource ;
			FormDataUtil.validDataSource(dataSource,$scope.error) ;
		}
		
	}]) ;
}) ;