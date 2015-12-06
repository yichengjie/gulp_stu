/**                                                    
 * tuiSelector控件是基于tuiSuggest拓展的下拉框组件。
 * 该组件负责在页面中显示一个下拉框，下拉框中的内容通过ajax访问后台，获得机场三字码信息。
 * 该组件需要在页面引入jquery.js和tuiSuggest.js后引入。
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.10.4                  
 * @see                                                
 *	HISTORY                                            
 * 2012-11-26下午02:10:18 创建文件
 * 2012-11-27 修改，由于技术问题，修改了target参数类型
 * 2012-12-06 修改版本和文件名。使得该选项适用于其他类型的下拉选框，例如：城市选框，国家选框等等。
 *    去掉了热点城市的功能，该部分功能转移至后端进行，而不再在前端做排序.
 * 2013-08-26 版本更新，修改了城市下拉框的加载方式，每一次输入都在300毫秒之后进行ajax查询。
 * 2013-09-12 版本更新，修正了extend参数无法生效的bug
 * 2013-11-27 版本更新，增加了对-\;三个符号联程城市选择框的支持。目前还不支持中间选择。以后的版本中会更新
 * 2013-12-12 版本更新，修正了因为ajax返回较慢导致的返回结果将已经关闭的下拉框重新打开。
 */
;(function($){
	$.tui=$.tui||{};
	/*
	 * 参数说明：url为ajax的请求路径，targets为有效的input集合，String数组，或jquery对象
	 * 注：则每个数组元素必须是合法的id
	 * extend是其他参数的设置，该方法允许使用extend对其他的suggest默认参数进行修改，说明请见suggest
	 */
	$.tui.tuiSelector = function(url, targets, extend, advReg){
		//内部方法
		//获得关键字的方法，找出"PEK;SHA-CAN"中的CAN
		var getKey = function (str){
			var reg = /([a-zA-Z]{1,})$/g,
				result = reg.exec(str);
			result = (result && result[1]) || '';
			return result;
		};
		//由Ajax得来的结构进行data处理
		var getData = function (result){
			var odata = result.data,
				count = odata.length,
				data = [];
			for (var i = 0; i < count; i++){
				var cur = odata[i];
				var dataItem = {//生成的节点数据
						name:cur['dictName'],
						val:cur['dictCode'],
						assist:cur['py'],
						others:cur['py4Short']
					};
				data[i] = dataItem;
			}
			return data;
		};
		//在多城市选择下，自动将之前的城市和当前选中的城市匹配
		var checkVal = function ($input, $proxy, advReg){
			var val = $(this).attr('val'),
				source = $proxy.val();
			var reg = new RegExp('([a-zA-Z]{1,}[' + advReg.join('|') + ']{1})+', 'g'),
			//var reg = /([a-zA-Z]{1,}[-|;|\/]{1})+/g,
				result = reg.exec(source);
			if (result && result[0] && result[0] != null){
				result = result[0];
			} else {
				result = '';
			}
			$proxy.val(result + val);
		};
		//数据部分
		var _url = url,//ajax的url
			cities = new Array(),//所有的城市列表，经过转化的data结果
			$targets;//用于实现suggest的jquery对象
		//处理target对象
		if (targets instanceof jQuery){
			$targets = targets;
		} else {
			if(!targets.length){//数据错误
				return;
			}
			var query = "";
			for (var i = 0; i < targets.length; i++){//循环每一个target
				var thisTarget = targets[i];
				if (i == 0){
					query = "#" + thisTarget;
				} else {
					query += ",#" + thisTarget;
				}
			}
			$targets = $(query);
		}
		
		return $targets.each(function (){
			var $this = $(this),
				timeoutFlag,
				timeout,
				xmlReq;
           	var option = {
				target:$this,
				style:'big',
				data:{},
				keywordProcess:function ($input, $proxy, event){
					var keywords = $proxy.val(),
						queryStr = _url;
					clearTimeout(timeout);
					var uid = +new Date();
					if(event.keyCode && event.keyCode == 9){//针对tab键切换来的事件，在开始时，应该显示全部的。
						keywords = '';
					} else if(!event.keyCode) {
						return '';
					}
					//高级城市下拉框
					if (advReg && advReg != null){
						keywords = getKey(keywords);
					}
					if (_url.indexOf('?') > 0){
						queryStr += '&searchKey=' + keywords + '&_=' + uid;
					} else {
						queryStr += '?searchKey=' + keywords + '&_=' + uid;
					}
					$.tui.setTuiSuggestData($this, []);//清空当前的数据
					xmlReq ? xmlReq.abort() : '';//废除之前的ajax请求
					
					timeout = setTimeout(function (){
						xmlReq = $.ajax({
							url:queryStr,
							type:"GET",
							dataType:"json",
							success:function (result){
								var count, odata, data = [];
								
								if (!result){
									return;
								}
								//处理接收数据
								odata = result.data;
								count = odata.length;
								data = getData(result);
								if (data.length == 0){
									$.tui.hideTuiSuggestItems($this, $this);
								}
								//设置数据
								//$.tui.hideTuiSuggestItems($this, $this);//尝试关闭之前的下拉框	
								$.tui.setTuiSuggestData($this, data);
								$.tui.showTuiSuggestItems('', $this, $this, false);
							}
						});
					}, 300);
					
					return '';
				},
				checkItemCallback:function ($input, $proxy){
					//高级城市下拉框
					if (advReg && advReg != null){
						checkVal.call(this, $input, $proxy, advReg);
					} else {
						$proxy.val($(this).attr('val'));
					}
					$proxy.trigger('tuiValidator');
				},
				hoverItemCallback:function ($input, $proxy){
					if (advReg && advReg != null){
						checkVal.call(this, $input, $proxy, advReg);
					} else {
						$proxy.val($(this).attr('val'));
					}
				}
			};
			option = $.extend(option, (extend || {}));
			$.tui.tuiSuggest(option);
           	$.ajax({
           		url:_url,
				type:"GET",
				dataType:"json",
				success:function (result){
					if (!result){
						return;
					}
					var data = [];
					//处理接收数据
					data = getData(result);
					if (data.length > 0){
						$.tui.setTuiSuggestData($this, data);
					}
				}
           	});
        });
	};
})($);