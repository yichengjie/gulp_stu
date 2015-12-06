define(function (require, exports, module) {
	  var controllers = require('./controllers') ;
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