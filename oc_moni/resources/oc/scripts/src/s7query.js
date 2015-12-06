define(function(require, exports, module) {

    //通过require引入依赖
  	var $ = require('jquery');
  	require('tuiValidator');
	require('datepicker');
	require('tuiDialog');
  	var Common = require('./common');
  	var common = new Common();
  	var Equipment = require('./equipment');
	var equipment = new Equipment();
	var util = require('./util') ;
	var _ = require('underscore') ;
	
	
	
 	function S7Query() {
 		this._init();
    }

    module.exports = S7Query;
    
    //初始化界面
    S7Query.prototype._init = function() {
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
			//查询机型列表
			equipment.query('F');
			$('#s7QueryBtn').click(function() {
				that.query();
			});
		});
		// s5子组按钮的监听
		$(document).delegate(':checkbox[name=s5check]', 'change', function() {
			if ($(this).is(':checked')) {
				$(this).parents('.data_section').find('table').find(':checkbox[name=s7check]').attr('checked','checked');
			} else {
				$(this).parents('.data_section').find('table').find(':checkbox[name=s7check]').removeAttr('checked');
			}
		});
    };

    //执行s7查询方法
    S7Query.prototype.query = function() {
    	var url = $('#s7QueryBtn').attr('url');
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
				$('#s7content').empty();
        		$.showTuiMessageDialog('没有相应搜索条件下的结果！');
        		return;
            }
			that._resultData(datas);
		};
		$.ajax(common.baseOptions);
    };

    //获取查询条件数据
    S7Query.prototype.getData = function() {
		var paramTemp = {};
		//基础信息
		paramTemp['status'] = this.getStatusData('status');//发布状态
		paramTemp['effStatus'] = this.getStatusData('effStatus');//生效状态
		var server=$('#server').val();
		if(server ==='商务名称'){
			paramTemp['commercialName'] = $('#service').val();
		}else{
			paramTemp['subCode'] = $('#service').val();
		}
		paramTemp['effectMaxDate'] = $('#effectMaxDate').val();//生效日期上限
		paramTemp['effectMinDate'] = $('#effectMinDate').val();//生效日期下限
		// 机型
		paramTemp['equipment'] = this._getEquipment();
		//服务等级
		paramTemp['cabin'] = this.getCabinData('cabin');//服务等级
		console.log(paramTemp['cabin'] );
		//地理位置
		paramTemp['geoSpecLoc1Type'] = $('#geoSpecLoc1Type').attr('checked') ? $('#geoSpecLoc1Type').val() : '';//机场标识1
		paramTemp['geoSpecLoc1'] = $('#geoSpecLoc1').val();//区域1
		paramTemp['geoSpecLoc2Type'] = $('#geoSpecLoc2Type').attr('checked') ? $('#geoSpecLoc2Type').val() : '';//机场标识2
		paramTemp['geoSpecLoc2'] = $('#geoSpecLoc2').val();//区域2
		paramTemp['geoSpecLoc3Type'] = $('#geoSpecLoc3Type').attr('checked') ? $('#geoSpecLoc3Type').val() : '';//机场标识3
		paramTemp['geoSpecLoc3'] = $('#geoSpecLoc3').val();//经过区域
		paramTemp['carrCode'] = $('#carrCode').val();//航空公司
		return paramTemp;
	};
    
 	// 机型
    S7Query.prototype._getEquipment = function() {
    	var eqment = $('#s7_F_equipment').val();
    	if(eqment !== '' && eqment !== null && typeof(eqment) !== 'undefined'){
    		return (eqment.split('-'))[0];
    	}else{
    		return '';
    	}
	};
	
	//从界面获取发布状态和生效状态
	S7Query.prototype.getStatusData = function(name) {
		var result = '';
		var tag = '';
		var array = document.getElementsByName(name);
      	for(var i = 0; i < array.length; i++)
      	{
		    if(array[i].checked === true)
		    {         
		        result += '1';
		    } else {
		    	result += '0';
		    }
        }
        for(var j = 0; j < array.length; j++)
      	{
		    tag += '0';
        }
        //如果状态代码result的值都是0组成的字符串，则将result置为空字符串
        if(result === tag) {
        	result = '';
        }
        return result;
	};
	
	//从界面获取服务等级
	S7Query.prototype.getCabinData = function(name) {
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
	
	//将后台返回结果放到前台显示
	S7Query.prototype._resultData = function(datas) {
		var tag_ctx = $('#tag_ctx').val();
		$('#s7content').empty();
		var s7Content = $('#s7content');
		var that = this;
		s7Content.html('');
		for	(var i = 0; i < datas.length; i++) {
			var s5 = datas[i];
			var s7list = s5.s7VoList;
			var contentContainer = $('<div name="contentContainer" class="data_section markDiv"></div>');
			var s5Container = $('<div class="helper_float_left route_layout"></div>');
			var s7Container = $('<div class="helper_float_right ocprice"></div>');
			var service = $('<div class="typelist"><span>' + s5.basicInfoVo.serviceGroupDescription + '</span>&nbsp;&gt;&nbsp;<span>' + s5.basicInfoVo.subGroupDescription + '</span>&nbsp;&gt;&nbsp;</div>' +
					'<div class="commo_name"><label for="chooseAll"><input name="s5check" type="checkbox"/><span class="gray">[</span>&nbsp;<span class="txt_subcode bold">' + s5.serviceSubCode + '</span>&nbsp;<span class="gray">]</span>' +
							'&nbsp;<span class="bold">' + s5.commercialName + '</span>' +
					'</label></div>');
			service.appendTo(s5Container);
			var table = $('<table cellspacing="0" cellpadding="0" border="0"></table>');
			var tbody = $('<tbody></tbody>');
			for (var j = 0; j < s7list.length; j++) {
				var s7 = s7list[j];
				var flystatus=' ';
				var freqFlyStatus=s7.frequentFlyerStatus;
				if(freqFlyStatus!==null){
					flystatus=freqFlyStatus;
				}
				
				var s7Id = s7.id;
				var sequenceNumber=s7.sequenceNumber;
				var availability = (s7.noChargeNotAvailable === '') ? (that._getMoney(s7)) : that._getFeeAvailability(s7.noChargeNotAvailable);
				var tr_head = '<tr class="border_bottom">';
				var td1 = '<td><input name="s7check" type="checkbox"></input><input name="s7id" value="'+ s7Id +'"type="hidden"></input></td> ';
				var td2 = '<td><div class="imginfo"><img alt="" src="' + tag_ctx + '/resources/oc/images/products/' + that._getPicture(s7.serviceAndSubCode) + '"/></div></td>';
				var td3 = '<td><p class="desinfo" id="ocPriceDescription">'+ _formatDescription(s7.description) + '</p></td>';
				var td0 = '<td><span name="sequenceNumber">'+sequenceNumber+'</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td> ';
				
				var td4 = '<td><div class="price_time"><span name="firstMaintenanceDate">' + s7.firstMaintenanceDate + '</span>&nbsp;&mdash;&nbsp;<span name="lastMaintenanceDate">' + s7.lastMaintenanceDate + '</span><br>' +
						    '<span class="odcity">' + s7.geoSpecLoc1 + _showGeoSpecLocType(s7.geoSpecLoc1Type) + '</span>&nbsp;-&nbsp;<span class="odcity">' + s7.geoSpecLoc2 + _showGeoSpecLocType(s7.geoSpecLoc2Type) + '</span>' +
						    '<span class="helper_float_right ' + that._getColor(s7) + '">' + that._generateStatus(s7) + '</span><div class="clearfix"></div></div></td>';
				
				var td5 = '<td><div class="city_passenger"><div>' + that._getPassengerTypeCode(s7) + '</div><div class="bold">' + flystatus + '</div></div></td>';
				var td6 = '<td><div class="release_status"><span class="pricetag">' + availability + '</span></div></td>';
				var td7 = '<td><div class="helper_float_right operate_btn">' +
						     '<a href="#" title="查看详细" class="detail"></a>' +
						     _showS7Detail(s7Id) +
						     '<div title="删除" name="s7delete" class="delete"></div></div></td>';
			    var tr_tail = '</tr>';
		   	    $(tr_head + td1 + td2 + td3 + td0+td4 + td5 + td6 + td7 + tr_tail).appendTo(tbody);
			};
			tbody.appendTo(table);
			table.appendTo(s7Container);
			s5Container.appendTo(contentContainer);
			s7Container.appendTo(contentContainer);
			contentContainer.appendTo(s7Content);
			$('<div class="clearfix"></div>').appendTo(contentContainer);
		}
		// 根据发布状态和生效状态控制编辑和删除按钮
   	    _editDeleteControl();
   	    
	};
	
	_showS7Detail = function(id) {
		var tag_ctx = $('#tag_ctx').val();
		//var editDiv = '<a href="' + tag_ctx + '/oc/showS7Detail?id=' + id
		//		+ '" title="修改编辑" class="modify"></a>';
		var editDiv = '<a href="' + tag_ctx + '/toUpdateS7UI?s7Id=' + id
			+ '" title="修改编辑" class="modify"></a>';		
		return editDiv;
	};
	
	/**
	 * 根据发布状态和生效状态控制编辑和删除按钮
	 */
	_editDeleteControl = function() {
		$('table tbody tr').each(function() {
			var trText = $(this).text();
			
			// 未发布、已发布未生效、已发布已生效三种状态的可以编辑
			if(trText.indexOf('未发布') < 0 && trText.indexOf('未生效') < 0 && trText.indexOf('已生效') < 0) {
				$(this).find('[title=修改编辑]').removeAttr('href');
				$(this).find('[title=修改编辑]').removeClass('modify');
				$(this).find('[title=修改编辑]').addClass('modifyOK');
			}
			// 未发布的可以删除
			if(trText.indexOf('未发布') < 0) {
				$(this).find('[title=删除]').removeClass('delete');
				$(this).find('[title=删除]').addClass('deleteOK');
			}
		});
	};
	
	//格式化显示可用状态
	S7Query.prototype._getFeeAvailability = function(noChargeNotAvailable) {
		var result = '';
		if (noChargeNotAvailable === 'E') {
			result = '免费';
		} else if (noChargeNotAvailable === 'X') {
			result = '不可用';
		}  
		return result;
	};
	
	//为发布状态字体添加颜色
	S7Query.prototype._getColor = function(s7) {
		var color = '';
		if (s7.statusDes === '1') {
			color = 'red';
		} else if (s7.statusDes === '2') {
			color = 'orange';
		} else if (s7.statusDes === '3') {
			color = '';
		} else if (s7.statusDes === '4' || s7.statusDes === '5') {
			color = 'gray';
		} 
		return color;
	};
	
	//格式化显示发布状态  
	//1 未发布  2 未生效（生效日期>当前日期）  3 已生效（生效日期<=当前日期）  4  已过期(截止日期<当前日期)  5  已取消(生效日期>截止日期)
	S7Query.prototype._generateStatus = function(s7) {
		var result = '';
		if (s7.statusDes === '1') {
			result = '未发布';
		} else if (s7.statusDes === '2') {
			result = '未生效';
		} else if (s7.statusDes === '3') {
			result = '已生效';
		}else if (s7.statusDes === '4') {
			result = '已过期';
		}else if (s7.statusDes === '5') {
			result = '已取消';
		}
		return result;
	};
	
	//格式化显示钱数
	S7Query.prototype._getMoney = function(s7) {
		var list170VO=s7.list170VO;
		//201表、
		var list201VO = s7.list201VO ;
		var money = '';
		var specFeeCurrency = '' ;
		if(list170VO.length>0){
			money = list170VO[0].specFeeAmount;
			specFeeCurrency = list170VO[0].specFeeCurrency ;// 
		}else if(list201VO.length>0){
			var t = list201VO[0].discountType ;
			if(t=="1"){//全额
				money = list201VO[0].onePriceNum ;
				specFeeCurrency = "CNY" ;
			}else{//折扣
				money = list201VO[0].discountNum ;
				specFeeCurrency = "%" ;
			}
		}else{
			money = '';
		}
		
		//这里单位不能写死为‘CNY’了，直接从数据库读取2015/08/13
		if(money !== ''){
			money += specFeeCurrency;
		}
		return money;
	};
	
	//格式化显示
	S7Query.prototype._getPassengerTypeCode = function(s7) {
		var passengerTypeCode=' ';
		var typeCode=s7.passengerTypeCode;
		if(typeCode!==null){
			passengerTypeCode=typeCode;
		}		
		return passengerTypeCode;
	};
	
	//图片显示
	S7Query.prototype._getPicture = function(subCode) {
		/*var tag_ctx = $('#tag_ctx').val();
		var picName = '1E.jpg';
		var url =tag_ctx+ '/s7/isExitPic';
		var param = {};
		param['subCode'] = subCode;
		common.baseOptions['url'] = url;
		common.baseOptions['dataType'] ='json';
		common.baseOptions['data'] = param;
		common.baseOptions['success'] = function(datas){
			picName = datas;
		};
		$.ajax(common.baseOptions);
		return picName;*/
		var  picName = "1E.jpg";
		var imgArr = util.getCommonImgArr() ;
		var flag = _.contains(imgArr, subCode);
        if(flag) {
            picName = subCode + ".jpg";
        }
		return picName ;
	};
	
	
	
	
	
	
	_formatDescription = function(description) {
		var displayLength = 170;  
        var text = description;  
        var result = ''; 
        if (text === '' || typeof(text) === 'undefined') {
        	return result;  
        }
        
        var count = 0;  
        for (var i = 0; i < displayLength; i++) {  
            var _char = text.charAt(i);  
            if ( /[^x00-xff]/.test(_char)) {
                count ++;  //双字节字符，//[u4e00-u9fa5]中文  
            }
            if (count >= displayLength) {
            	break;
            }
            result += _char;  
            count++;
        }  
        if (result.length < text.length) {  
            result += '......';  
        }  
        return result;  
	};
	
	_showGeoSpecLocType = function(geoSpecLocType) {
		if (geoSpecLocType !== '') {
			return '<b class="gray">(' + geoSpecLocType + ')</b>';
		} else {
			return '';
		}
	};
});
