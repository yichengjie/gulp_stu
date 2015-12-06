define(function(require, exports, module) {
	var Common = require('./common');
	var common = new Common();
	
	function Equipment() {
		
	};
	
	module.exports = Equipment;
	
	/**
	 * 查询机型
	 */
	Equipment.prototype.query = function(type) {
		
		if (type === 'F') {
			var url = $('#s7_F_equipment').attr('url');
			var param = {};
			
			common.baseOptions['url'] = url;
			common.baseOptions['data'] = param;
			common.baseOptions['success'] = function(datas) {
				$('#s7_F_equipment').append('<option/>');
				for(var i = 0; i < datas.length; i++) {
					var equipment = '<option>'  + datas[i].code + '-' + datas[i].description +'</option>';
					$('#s7_F_equipment').append(equipment);
				}
			};
			$.ajax(common.baseOptions);
		}
		
		if (type === 'M') {
			var url = $('#s7_M_equipment').attr('url');
			var param = {};
			
			common.baseOptions['url'] = url;
			common.baseOptions['data'] = param;
			common.baseOptions['success'] = function(datas) {
				$('#s7_M_equipment').append('<option/>');
				for(var i = 0; i < datas.length; i++) {
					var equipment = '<option>'  + datas[i].code + '-' + datas[i].description +'</option>';
					$('#s7_M_equipment').append(equipment);
				}
			};
			$.ajax(common.baseOptions);
		}
	};
	
});