define(function(require, exports, module) {
  	require('tuiValidator');
	require('tuiDialog');
	require('./services/services') ;
	require('./controllers/controllers') ;
	require('./directives/directives') ;
	var app = angular.module('app',['app.service','app.controller','app.directive']); 
	/**页面加载完毕之后启动angualr**/
	module.exports = { 
 		init: function(){ 
			angular.element(document).ready(function() {
			     angular.bootstrap(document, ['app']);
			     initTuiForm() ;
			});
 		} 
 	} 
	
	function initTuiForm(){
		// // 注册验证插件
		$('#abrDataSourceCfgForm').tuiValidator({
			ignore : '',
			submitId : 'abrDataSourceCfgSaveBtn',
			isDialog : false,
			isLabel : true,
			isTip : false,
			isLabelDown : true,
			isErrorDown : false,
			dialogMethod : function(messages) {
				$.showTuiMessageAlert(messages, null, 370, 120);
			},
			dialogTip : 'label',
			submitHandler : function(form) {
				//获取指定id元素上的controller
				var element  = angular.element($("#EditControllerDiv"));
				var scope = element.scope();
				scope.saveFormData() ;
			}
		});
	}
	
}) ;