define(function (require, exports, module) {
	  var controllers = require('./controllers') ;
	  var jsonDataHelper = require('../data/jsonDataHelper') ;
	  var commonUtil = require('../util/commonUtil') ;
	  var _ = require('underscore') ;
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
				//当点击的饿时候把整个表单重置//除了serviceType外的其他字段
				for(var pname in $scope.data){
					if(!_.contains(['sel1','sel2','sel3','sel4'], pname)){
						$scope.data[pname] = angular.copy($scope.orgData[pname]) ;
					}
				}
				validator.resetForm();
				//$scope.data.discountOrNot = '1' ;
				//$scope.data.list201VO = [] ;//数据初始化

				var carrCode = l.carrCode ;
				var serviceSubCode = l.serviceSubCode ;
				var commercialName = l.commercialName ;
				var serviceType = l.serviceType ;
				//发送通知
				
				FormData.carrCode = carrCode ;
				FormData.serviceAndSubCode = serviceSubCode ;
				FormData.serviceType = serviceType ;
				//如果是免费则将下面的费用变为不可选择
				if(serviceType=='A'){
					FormData.noChargeNotAvailable = 'F' ;//设置为免费
				}else if (serviceType=='B'){
					FormData.noChargeNotAvailable = 'F' ;//设置为免费
				}else if (serviceType=='C'||serviceType=='P'){
					FormData.noChargeNotAvailable = '' ;//设置为收费
				}else if (serviceType=='E'){
					FormData.noChargeNotAvailable = 'X' ;//设置为收费
				}

				if(serviceType=='C'||serviceType=='P'){//收费一定为收费且不可编辑
					FormEditStatusServcie.noChargeNotAvailable= false;
				}else{//可编辑
					FormEditStatusServcie.noChargeNotAvailable= true;
				}

				//将是否检查库存设置为 ‘否’
				if(serviceType=='A'||serviceType=='B'||serviceType=='E'){
					FormData.availability = 'N' ;
					FormEditStatusServcie.availability= false;
				}else{
					FormEditStatusServcie.availability= true;
				}

				//免费/收费
				$scope.noChargeNotAvailableList.list= jsonDataHelper.getNoChargeNotAvailableList(serviceType) ;
				//适用于
				$scope.specifiedServiceFeeAppList.list = jsonDataHelper.getSpecifiedServiceFeeAppList(serviceType) ;

				//填充basicInfo信息start
				$scope.data.basicInfoVo.serviceGroup= l.attributesGroup ;
				$scope.data.basicInfoVo.subGroup= l.attributesSubgroup ;
				$scope.data.basicInfoVo.subCode= serviceSubCode ;
				//填充basicInfo信息end
				FormData.sel3.showStr = '['+serviceSubCode+']'+commercialName ;
				FormData.sel3.value = serviceSubCode ;
				//这个一定要放在比较靠下的地方，以等待servcieType等书库已经填充到FormData中
				$scope.$parent.$broadcast('serviceTypeChangeNotice') ;//scope.$broadcast('serviceTypeChangeNotice') ;	

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
