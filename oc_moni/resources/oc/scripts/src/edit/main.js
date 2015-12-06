define(function(require, exports, module) {
	//var pathStr = require.resolve('src/main') ;
	//console.info("path : " + pathStr) ;
	//require('tuiValidator');
	require('tuiDialog') ;
	require('datepicker') ;
	//把整个app的路由加载进来
	require("./router") ;
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
		   var flag = validator.form() ;
		   console.info('手动校验表单flag : ' + flag) ;
		   if(flag){
		   		//获取指定id元素上的controller
				var element  = angular.element($("#EditControllerDiv"));
				var scope = element.scope();
				scope.saveFormData('save') ;
		   }
		  // console.info("校验是否通过flag : " + flag) ;
		}) ;
		var element  = angular.element($("#EditControllerDiv"));
		var scope = element.scope();
		//点击保存并发布按钮
		$("#s7_saveAndPublish").bind("click",function (e) {
		   //直接用来校验表单 同 下面的  validator.form()函数
		   var flag = validator.form() ;
		    console.info('手动校验表单 flag : ' + flag) ;
		   if(flag){
				//获取指定id元素上的controller
				scope.saveFormData('saveAndPublish') ;
		   }
		}) ;
		//当整个页面加载完毕后发送一次serviceTypeChange的通知，因为有时候servcieType会有默认值
		setTimeout(function(){
			scope.$broadcast('serviceTypeChangeNotice','true') ;
		},1000) ;
	}

});
