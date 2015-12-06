define(function(require, exports, module) {

	// 通过require引入依赖
	var $ = require('jquery');
	var Common = require('./common');
	var common = new Common();

	function S7Delete() {

	};

	module.exports = S7Delete;

	/**
	 * 发布按钮绑定事件
	 */
	S7Delete.prototype.init = function() {
		
		$(document).delegate('.delete[name=s7delete]', 'click', function() {
			//删除s7id
			var s7id = $(this).parents('tr').find(':input[name=s7id]').attr('value');
			var deletedS7 = $(this);
			var param = {};
			var url = $('#s7_delete').attr('url');
			param['s7Id'] = s7id;
			
			common.baseOptions['url'] = url;
			common.baseOptions['data'] = param;
			common.baseOptions['success'] = function(datas) {
				if (datas === null) {
					window.location.reload();
					return;
				}
				if (datas === 'SUCCESS' ) {
					$.showTuiSuccessDialog('删除成功！', function() {
						if (deletedS7.parents('table').find('tr').length === 1) {
							deletedS7.parents('div[name=contentContainer]').remove();
						}
						deletedS7.parents('tr').remove();
					});
				} else {
					$.showTuiErrorDialog('系统异常，删除失败！');
				}
			};
			$.ajax(common.baseOptions);	
		});
	};
});
