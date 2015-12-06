define(function (require, exports, module) {
	var controllers = require('./controllers') ;
	var jsonDate = require('../data/editJsonData') ;
	var commonUtil = require('../util/commonUtil') ;
	var jsonDataHelper = require('../data/jsonDataHelper') ;
	var _ = require('underscore') ;
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
			
			$scope.chargeCanClickFlag = function(){
				var flag = true;
				if($scope.data.serviceType=='A'||$scope.data.serviceType=='C'||
					$scope.data.serviceType=='P'||$scope.data.statusDes=='3'){
					flag = false ;
				}
				return flag ;
			};

			//当点击后//这个flag管理页面上的金额、适用于、里程 这个三个字段(这三个字段显示隐藏一直)
			$scope.noChargeNotAvailableFlag = true ;
			//这个flag管理页面上的行李适用范围
			$scope.noChargeNotAvailableFlag2 = true ;
			//当是否收费改变时触发的函数
			$scope.changeNoChargeNotAvailable = function  () {
				var servcieType = $scope.data.serviceType ;
				var noChargeNotAvailable = $scope.data.noChargeNotAvailable ;
				//console.info('servcieType : ' + servcieType) ;
				//服务类型是不是行李附加服务
				var isBaggageFlag = commonUtil.checkBaggageServcie(servcieType) ;
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
				//一般服务时//当收费字段为D/X/F/E时适用于才可能存在空
				/*var dxefFlag = false ;
				if(!isBaggageFlag){//,'X','E','F'因为这些时使用于已经是空了
					if(_.contains(['D'], noChargeNotAvailable)){
						dxefFlag = true ;
					}
				}
				if(dxefFlag){

				}else{

				}*/

				$scope.$parent.$broadcast('singleChangeByFlagNotice','list170VOAndlist201VO',in_flag+'','false') ;//费用//in_fname,in_flag,needDigest
				$scope.$parent.$broadcast('singleChangeByFlagNotice','specifiedServiceFeeMileage',in_flag+'','false') ;//里程
				$scope.$parent.$broadcast('singleChangeByFlagNotice','specifiedServiceFeeApp',in_flag+'','false') ;//适用于
				//当是否收费为D时  --行李适用范围必须为空
				if(noChargeNotAvailable=='D'){
					$scope.data.baggageTravelApplication = '' ;
					FormEditStatusServcie.baggageTravelApplication = false;
				}else{
					FormEditStatusServcie.baggageTravelApplication = true;
				}

			} ;

			//适用于改变时
			$scope.changeSpecifiedServiceFeeApp = function(){
				var serviceType = $scope.data.serviceType ;
				var ssfa = $scope.data.specifiedServiceFeeApp ;
				var in_flag = true ;
				if(serviceType=='C'||serviceType=='P'){
					if(ssfa=='H'||ssfa=='C'||ssfa=='P'){
						//收费字段必须为空，并且170或201必须为空
						//$scope.data.noChargeNotAvailable = '' ;//因为 当servcieType为cp是收费字段一定为空
						in_flag = false;
					}
				}
				//console.info('serviceType : ['+serviceType+'] , ssfa : ['+ssfa+']  , in_flag : ['+in_flag+']' ) ;
				//$scope.FormEditStatusServcie.noChargeNotAvailable =in_flag;
				//170，201显示或隐藏
				$scope.$parent.$broadcast('singleChangeByFlagNotice','list170VOAndlist201VO',in_flag+'','false') ;
			};

			//170表的显示隐藏函数
			$scope.t170FlagFunc = function(type){
				var flag = false;
				var ssfa = $scope.data.specifiedServiceFeeApp ;
				if($scope.flagData.t170.flag){//如果应该显示
					if(type=='t170'){
						if($scope.data.discountOrNot=='1'){
							flag = true ;
						}
					}else if(type=='t201'){
						if($scope.data.discountOrNot=='0'){
							flag = true ;
						}
					}
				}
				if(flag){
					if($scope.data.serviceType=='C'||$scope.data.serviceType=='P'){
						if(ssfa=='H'||ssfa=='C'||ssfa=='P'){
							flag = false;
						}
					}
				}
				return flag ;
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
