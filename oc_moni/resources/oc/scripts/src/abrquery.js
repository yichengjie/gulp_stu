define(function(require, exports, module) {
	var $ = require('jquery');
  	require('tuiValidator');
	require('datepicker');
	require('tuiDialog');
  	var Common = require('./common');
  	var common = new Common();
	
	function abrQuery() {
 		this._init();
    }
	module.exports = abrQuery;
	abrQuery.prototype._init = function() {
    	var that = this;
    	//注册日期插件
    	$('#effectMaxDate').datepicker({showButtonPanel : true, clearBtn : true, yearSuffix : "", changeMonth : true, changeYear : true});
		$('#effectMinDate').datepicker({showButtonPanel : true, clearBtn : true, yearSuffix : "", changeMonth : true, changeYear : true});
		$(document).ready(function() {
			/* 实现大写的转换，在document的节点中，若有mode='upper'的属性，则将输入值都转换成大写 */
			$('[mode=upper]').each(function() {
				$(this).bind('keyup', function() {
					$(this).val($(this).val().toUpperCase());
				});
			});
			
			$('#abrQueryBtn').click(function() {
				that.query();
			});
			//页面第一次加载
			$('#abrQueryBtn').trigger('click') ;
			
		});
    };
    
    abrQuery.prototype.query = function() {
    	var url = $('#abrQueryBtn').attr('url');
  		var that = this;
    	var param = this.getData();
		common.baseOptions['url'] = url;
		common.baseOptions['dataType'] ='json';
		common.baseOptions['data'] = param;
		common.baseOptions['success'] = function(datas){
			if (datas === null) {
				window.location.reload();
				return;
			}
			if(datas.length === 0) {
				$('#abrcontent').empty();
        		$.showTuiMessageDialog('没有相应搜索条件下的结果！');
        		return;
            }
			that._resultData(datas);
		};
		$.ajax(common.baseOptions);
    };

  //获取查询条件数据
    abrQuery.prototype.getData = function() {
		var paramTemp = {};
		paramTemp['serviceType'] = this.getServiceTypeData('serviceType');//发布状态
		paramTemp['carrier']=$('#carrier').val();//航空公司
		paramTemp['subCode']=$('#subCode').val();//子代码
		paramTemp['effectMaxDate'] = $('#effectMaxDate').val();//生效日期上限
		paramTemp['effectMinDate'] = $('#effectMinDate').val();//生效日期下限
		paramTemp['dataSource'] = $('#dataSource').val();//数据源
		paramTemp['internationalTag'] = $('#internationalTag').val();//行程种类
		paramTemp['departmentCode'] = $('#departmentCode').val();//部门代码
		return paramTemp;
	};
	
	abrQuery.prototype.getServiceTypeData = function(name) {
		var result = '';
		var array = document.getElementsByName(name);
      	for(var i = 0; i < array.length; i++)
      	{
		    if(array[i].checked === true)
		    {         
		        result += array[i].value;
		    } 
        }
        return result;
	};
	abrQuery.prototype._resultData = function(datas) {
		$('#abrcontent').empty();
		var abrContent = $('#abrcontent');
		var that = this;
		abrContent.html('');
		//var contentContainer = $('<div name="contentContainer" class="data_section markDiv"></div>');
		//var container = $('<div class="helper_float_right ocprice"></div>');
		var div = $('<div class="data_section markDiv tableLayout"></div>');
		var table = $('<table cellspacing="0" cellpadding="0" border="1"></table>');
		var th = $('<tr><th>序列号</th><th>服务类型</th><th>子代码</th>'+
		'<th>部门代码</th><th>行程种类</th>'+
		'<th>生效日期</th><th>截止日期</th><th>数据源</th><th>操作</th></tr>');
		/*<tr><th>序列号</th><th>组</th><th>子组</th><th>服务类型</th><th>子代码</th>'+
		'<th>旅行社代码</th><th>IATA旅行社序号</th><th>部门标识</th><th>部门代码</th><th>行程种类</th>'+
		'<th>生效日期</th><th>截止日期</th><th>数据源</th><th>操作</th></tr>*/
		var tbody = $('<tbody></tbody>');
		th.appendTo(tbody);
		for	(var i = 0; i < datas.length; i++) {
			var abrConfig = datas[i];
			var id = abrConfig.id;
			var tr_head = '<tr class="border_bottom">';
			var td1 = '<td><input name="abrid" value="'+ id +'"type="hidden"></input>'+abrConfig.sequcenceNumber+'</td>' ;
			//var td2 = '<td>'+abrConfig.attributesGroup+'</td>' ;
			//var td3 = '<td>'+abrConfig.attributesSubGroup+'</td>' ;
			var td4 = '<td>'+_transeServiceType(abrConfig.serviceType)+'</td>' ;
			var td5 = '<td>'+abrConfig.subCode+'</td>' ;
			//var td6 = '<td>'+abrConfig.travelAgencyCode+'</td>' ;
			//var td7 = '<td>'+abrConfig.iataTravelAgencyCode+'</td>' ;
			//var td8 = '<td>'+abrConfig.departmentIdentifier+'</td>' ;
			var td9 = '<td>'+abrConfig.departmentCode+'</td>' ;
			var td10 = '<td>'+_transeInternationalTag(abrConfig.internationalTag)+'</td>' ;
			var td11 = '<td>'+abrConfig.effDate+'</td>' ;
			var td12 = '<td>'+abrConfig.discDate+'</td>' ;
			var td13 = '<td>'+_transeDataSource(abrConfig.dataSource)+'</td>' ;
			var td14 = '<td><div class="helper_float_left operate_btn">'+
			_showConfigDetail(id)+ _getDeleteButton(abrConfig.effDate)+'</div></td>';
			 var tr_tail = '</tr>';
			 $(tr_head + td1 + td4 + td5 + td9 + td10 + td11 + td12+ td13 + td14 + tr_tail).appendTo(tbody);
		}
		tbody.appendTo(table);
		//table.appendTo(container);
		//container.appendTo(contentContainer);
		//$('<div class="clearfix"></div>').appendTo(contentContainer);
		//contentContainer.appendTo(abrContent);
		table.appendTo(div);
		div.appendTo(abrContent);
	};
	var _showConfigDetail = function(id) {
		var tag_ctx = $('#tag_ctx').val();
		var editDiv = '<a href="' + tag_ctx + '/abr/toAbrDatasourceUpdate?id=' + id
			+ '" title="修改编辑" class="modify helper_float_left"></a>';		
		return editDiv;
	};
	var _transeInternationalTag = function(str){
		if(str=='D'){
			str='国内';
		}else if(str=='I'){
			str='国际';
		}
		return str;
	}
	var _transeDataSource = function(str){
		if(str=='OPTSVC'){
			str='ATPCO数据';
		}else if(str=='TSKOC'){
			str='航信数据';
		}
		return str;
	}
	var _transeServiceType = function(str){
		if(str=='A'){
			str='免费行李';
		}else if(str=='B'){
			str='随携行李';
		}else if(str=='C'){
			str='付费行李';
		}else if(str=='P'){
			str='预付费行李';
		}else if(str=='E'){
			str='禁运行李';
		}else if(str=='F'){
			str='运价相关';
		}else if(str=='T'){
			str='客票相关';
		}else if(str=='M'){
			str='商品相关';
		}else if(str=='R'){
			str='规则相关';
		}
		return str;
	}
	var _getDate = function (str) {
		var strs = str.split('-');
		var year = strs[0];
		var month = strs[1];
		var day = strs[2];
		return new Date(year, month-1, day);
	};
	var _getDeleteButton = function(str){
		var effDate =  _getDate(str);
		var currentDate = new Date();
		if(currentDate>=effDate){
			return '<div title="删除" class="deleteOK helper_float_left marginLeft5"></div>';
		}
		return '<div title="删除" name="abrdelete" class="delete helper_float_left marginLeft5"></div>';
	}
});