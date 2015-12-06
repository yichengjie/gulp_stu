/**                                                    
 * tuiSingleSelect是GUI基本框架。它负责模拟下拉单选框的实现。
 * 该方法必须依赖jquery和tuiSuggest，因此，在使用该方法时，必须引入以上两个文件才能使用。
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.10.6                 
 * @see                                                
 *	HISTORY                                            
 * 2012-12-05上午09:18:08 创建文件
 *  新版本说明：
 *	  1，新版本中，取消valueId参数，只保留id参数。该参数为真正的用于提交表单的input框的id。程序将自动生成一个假的input（proxy）
 *    2，新版本中，将不再使用参数来指定input的name和class，proxy输入框将克隆出真正的input框。因此，所有的属性可以直接写在input上。
 *    3，onChange和onSelect回调函数中，将this指向点击该选项的那个li上，用法同suggest中的checkItemCallback回调。
 *    4，onSelect的回调会优于onChange执行，因此，在改变选项时，将先回调onSelect，再回调onChange
 * 2013-01-29 版本更新，添加了height参数，用于指定高度。
 * 2013-01-30 版本更新，修正了选项选完之后焦点丢失的bug
 * 2013-01-31 版本更新，修正了onChange必须在onSelect下才能触发的bug
 * 2013-02-20 版本更新，修改了内部方法的参数
 * 2013-02-27 版本更新，修正了在可输入查询条件的下拉框中，输入特殊字符出现的正则匹配错误了。
 *    功能增加，如果用户再可输入的下拉框中将内容删除至空，那么选项会选中默认项
 * 2013-03-08 版本更新，修正了在可输入查询条件的下拉框中，删除内容为空时选中默认选项时proxy不为空的bug
 * 2013-04-16 版本更新，现在可以通过在参数中设置class来对一类的input绑定下拉框了。
 *    注：如果设置了classes，则在通过参数中绑定id之后，再对class进行初始化，因此，请保证id与classes不冲突。
 * 2013-05-08 版本更新，修正了因为传值为数字导致的无法选择某一数据的情况。data传入的值必须是字符串。
 *    修正了在选项的dom结构中，assist和others出现undefind的情况。
 * 2013-06-04 版本更新，针对第一次打开下拉框的情况下，不做已选文字的筛选，显示全部的选项
 * 2013-07-05 版本更新，修正了同tuiValidator组件的冲突问题，现在下拉框不会因为验证框架在选择之后重新focus了。
 * 2013-10-23 版本更新，修正了在键盘操作时，没有触发change事件的bug
 * 2013-11-04 版本更新，对下拉框增加了多列显示的功能。
 */
;(function ($){
	$.tui = $.tui || {};
	$.tui.tuiSingleSelect = function (){
		//参数------------------------------
		var _default = {
			id:null,//生效目标，可以为jquery对象，可以为字符串，但是字符串必须是id名
			width:'auto',
			height:'auto',
			options:[],//格式：{label:"标题名",val:"值"}
			optionDefault:0,//默认选项，第1项
			onSelect:null,//回调函数，回调(hidvalue,value,value输入框的jquery对象,label输入框的jquery对象,event对象)
			/*
			 * 注：在onSelect回调函数执行前，已经进行了默认的check操作。
			 */
			onChange:null,//回调函数，回调(新hidvalue,新value,旧hidvalue,旧value,value输入框的jquery对象,label输入框的jquery对象,event对象)，只有在选项改变时触发
			autoSelect:false,//是否添加自动选择功能，如果为false，则显示在页面上的input写保护。
			isInput:false,//在autoSelect下，input框用户仅仅输入插入，但是不取值。默认是标准的select下拉框，只能从下拉表中取值
			classes:null//按照类进行初始化
			},
			settings=$.extend({}, _default);//合并参数
		for (var i=0; i<arguments.length; i++){
			settings = $.extend(settings, arguments[i]);
		}
		//准备data
		var data = new Array(),
			sdata = settings.options,
			count = sdata.length;
		for (var i=0; i < count; i++){
			data[i] = {
				name:sdata[i]['label'].toString(),
				val:sdata[i]['val'].toString(),
				assist:'',
				others:''
			};
		}
		//处理关键字的方法
		var keywordFun = function (){
			if (settings.autoSelect){
				return function($input, $proxy){
					//如果用户输入的是*()等字符，必须加上\\，否则会成为正则的一部分而报错
					if ($proxy.attr('data-tuiOpen') != 'false'){//第一次打开的时候，显示全部的选项
						$proxy.attr('data-tuiOpen', 'false');
						return '';
					}
					if ($proxy.val() == ""){
						$.tui.checkTuiSuggestItem(settings.id, settings.optionDefault);
						//在用户删除文字为空时，虽然选中了默认项，但是不能在proxy上直接显示默认项，因为proxy这时应该是空的。
						$proxy.val('');
						return '';
					} else {
						return $proxy.val().replace(/[^a-zA-Z0-9]/g, function (str){return '\\'+str;});
					}
				}
			} else {
				return function (){return '';}
			}
		}
		//
		var option = {
			target:settings.id,
			width:settings.width,
			height:settings.height,
			mode:'select',
			readOnly:!settings.isInput,
			data:data,
			optionNameOnly:true,
			keywordProcess:keywordFun(),
			checkItemCallback:function ($input, $proxy, event){
				
				var oldInputVal = $input.val(),//保存选择之前的数据，用于onchange的判断
					oldProxyVal = $proxy.val(),//
					newInputVal = this.attr('val'),
					newProxyVal = this.attr('name');
				//进行默认的操作，由于存在回调函数，因此suggest中的默认处理就不进行了
				$input.val(this.attr('val'));
				$proxy.val(this.attr('name')).trigger('blur.tuiSuggest').trigger('tuiValidator');
				$proxy.attr('data-tuiOpen','true');
				//说明：为什么trigger blur事件。因为在选择完某个选项之后，触发了focus，会使下拉框继续显示，而不是关闭
				if (typeof(settings.onSelect) === 'function'){
					settings.onSelect.call(this, $input.val(), $proxy.val(), $input, $proxy, event);
				}
				var newInputVal = $input.val(),//保存新的数据
					newProxyVal = $proxy.val();
				if ((oldProxyVal != newProxyVal) || (oldInputVal != newInputVal)){
					if (typeof(settings.onChange) === 'function'){
						settings.onChange.call(this, newInputVal, newProxyVal, oldInputVal, oldProxyVal, $input, $proxy, event);
					}
				}
				//由于增加了滚动条，因此在suggest的滚动条事件中绑定了去除焦点关闭下拉框的timeout，在焦点事件重新触发后，需要再次关闭这个下拉框
				setTimeout(function (){$.tui.hideTuiSuggest()}, 100);
			},
			onAfterHide:function ($input, $proxy){
				$proxy.attr('data-tuiOpen', 'true');
			},
			cols:settings.cols
		}
		if (settings.id){
			//执行主方法
			$.tui.tuiSuggest(option);
			//默认选项
			$.tui.checkTuiSuggestItem(settings.id, settings.optionDefault);
		}
		//如果设置了class，则再对class进行初始化
		var classes = settings.classes;
		if (classes){//如果设置了
			var cls;
			if ($.isArray(classes)){
				cls = classes.join(',.');
			} else {
				cls = classes;
			}
			$('.' + cls).each(function (){
				var $this = $(this);
				option.target = $this;
				//执行主方法
				$.tui.tuiSuggest(option);
				//默认选项
				$.tui.checkTuiSuggestItem($this, settings.optionDefault);
			});
		}
	};
	//修改某个选项
	$.tui.changeTuiSelectItem = function (target, itm, callback){
		$.tui.checkTuiSuggestItem(target, itm, callback);
	}
	//获得数据
	$.tui.getTuiSelectData = function (target){
		return $.tui.getTuiSuggestData(target) || null;
	}
	//设置数据
	$.tui.setTuiSelectData = function (target, data){
		var ndata = [];
		for(var i = 0; i < data.length; i++){
			ndata[i] = {name:data[i]['label'], val:data[i]['val']};
		}
		$.tui.setTuiSuggestData(target, ndata);
	}
})(jQuery)