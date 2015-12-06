define(function(require, exports, module) {

	// 通过require引入依赖
	var $ = require('jquery');
	var Common = require('./common');
	var common = new Common();

	function abrDelete() {

	};

	module.exports = abrDelete;

	/**
	 * 发布按钮绑定事件
	 */
	abrDelete.prototype.init = function() {
		
		$(document).delegate('.delete[name=abrdelete]', 'click', function() {
			//删除s7id
			var abrid = $(this).parents('tr').find(':input[name=abrid]').attr('value');
			var deletedabr = $(this);
			var param = {};
			var tag_ctx = $('#tag_ctx').val();
			var url = tag_ctx+'/abr/abrDatasourceDelete';
			param['id'] = abrid;
			$.showTuiConfirmDialog('确认删除?', function() {
				common.baseOptions['url'] = url;
				common.baseOptions['data'] = param;
				common.baseOptions['success'] = function(datas) {
					if (datas === null) {
						window.location.reload();
						return;
					}
					if (datas === 'SUCCESS' ) {
						$.showTuiSuccessDialog('删除成功！', function() {
							deletedabr.parents('tr').remove();
						});
					} else {
						$.showTuiErrorDialog('系统异常，删除失败！');
					}
				};
				$.ajax(common.baseOptions);	
			});
		});
	};
});