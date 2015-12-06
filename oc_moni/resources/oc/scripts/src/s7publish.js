define(function(require, exports, module) {

	// 通过require引入依赖
	var $ = require('jquery');
	var Common = require('./common');
	var common = new Common();

	function S7Publish() {

	};

	module.exports = S7Publish;

	/**
	 * 发布按钮绑定事件
	 */
	S7Publish.prototype.init = function() {
		
		$('#s7_publish').click(function() {
			// 数组存放符合条件的s7id
			var idArray = [];
			// 勾选的所有s7
			var checkedS7 = $('table').find(':checkbox[name=s7check][checked=checked]');
			if(checkedS7.length === 0) {
				$.showTuiErrorDialog('请至少选择一条记录！');
				return;
			}
			// 验证
			if (S7Publish._validate(idArray, checkedS7)) {
				var param = {};
				var url = $('#s7_publish').attr('url');
				for (var i = 0; i < idArray.length; i++) {
					param['s7IdList['+i+']'] = idArray[i];
				}
				common.baseOptions['url'] = url;
				common.baseOptions['data'] = param;
				common.baseOptions['success'] = function(datas) {
					if (datas === 'PUBISHSUCCESS' ) {
						$.showTuiSuccessDialog('发布成功！', function() {
							$("#s7QueryBtn").trigger('click') ;
						});
					} else {
						$.showTuiErrorDialog('系统异常，发布失败！');
					}
				};
				$.ajax(common.baseOptions);	
			}
		});
	};
	
	/**
	 * 对勾选的s7进行验证
	 */
	S7Publish._validate = function(idArray, checkedS7) {
		var allValidate = true;
		checkedS7.each(function() {
			var status = $(this).parents('tr').text();
			var effDateText = $(this).parents('tr').find('[name=firstMaintenanceDate]').text();
			var discDateText = $(this).parents('tr').find('[name=lastMaintenanceDate]').text();
			var s7id = $(this).parents('tr').find(':input[name=s7id]').attr('value');
			
			// 日期比较
			var sysDate = new Date();
			var effDate = new Date($.trim(effDateText));
			var discDate = new Date($.trim(discDateText));
			if (status.indexOf('未发布') >= 0) {
				if (effDate > sysDate && discDate >= effDate) {
					idArray.push(s7id);
				} else {
					$.showTuiErrorDialog('未发布数据中包含已生效/已过期数据！');
					allValidate = false;
					return false;
				}
			}
		});
		return allValidate;
	};
});
