define(function (require, exports, module) {
	    var controllers = require('./controllers') ;
		  var jsonDate = require('../data/editJsonData') ;
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
