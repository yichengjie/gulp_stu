// JavaScript Document
/**
 * tuiTipSelect同tuiSingleSelect一样，为下拉框选项组件，但是该组件不是仿照系统下拉框，而是按钮下拉选择的功能。
 * 该组件数据部分与tuiSingleSelect一样，并带有回调参数。
 * 注意：该组件与tuiSingleSelect的不同在于该组件没有input表单标签，按照一个按钮进行设计，在input上绑定该方法可能会出现问题。
 *  该组件不包含input，因此，数据内容仅保存在data-value的值中。
 * Copyright: Copyright (c) 2013                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.9.1           
 * @see                                                
 *	HISTORY 
 *   2013-10-15 创建文件
 */
;(function ($, window){
	//添加下拉框，注：该下拉框是临时生成的，每次执行时，都会将上次内容清空
	var addTip = function ($target){
		var $tip = $('#tuiTipSelectBox'),
			settings = $target._getTuiTipSelectData(),
			option = settings.option,
			count = option.length,
			html = '<div id="tuiTipSelectBox" class="table_th_select_panel" style="display:none;overflow:auto;"><ul>';
		var i;
		var curOption,label,val;
		
		if ($tip.length != 0){
			$tip.remove();
		}
		if (!count){
			return;
		}
		for (var i = 0; i < count; i++){
			curOption = option[i];
			label = curOption['label'];
			val = curOption['val'];
			html += '<li data-label="' + label + '" data-val="' + val + '"><span>' + label + '</span></li>';
		}
		html += '</ul></div>';
		$tip = $(html).insertAfter($target).show().css({left:0,top:0});
		$(document).off('click.tuiTipSelect').on('click.tuiTipSelect', function (event){
			//如果不是点击到：浮动框，按钮，则关闭浮动框
			if (!($target.get(0) == event.target || 
					$tip.get(0) == event.target || 
					$.contains($target.get(0), event.target) || 
					$.contains($tip.get(0), event.target)
				)){
				closeTip();
			}
		});
		return $tip;
	}
	//处理下拉框的位置和宽高，注：必须在执行addTip之后进行
	var dealtTip = function ($target, $tip){
		var settings = $target._getTuiTipSelectData(),
			width = settings.width,
			height = settings.height;
			
		var targetLeft = $target.position().left,
			targetTop = $target.position().top,
			tipLeft = $tip.position().left,
			tipTop = $tip.position().top,
			targetWidth = $target.width(),
			targetHeight = $target.height(),
			tipWidth, tipHeight;
			
		var dWidth = $(document).width(),
			dHeight = $(document).height(),
			wWidth = $(window).width(),
			wHeight = $(window).height();
			
		var maxH, left, top;
		
		var offsetLeft = $target.offset().left - targetLeft,
			offsetTop = $target.offset().top - targetTop;
			
		//设置宽度和高度
		if ($.isNumeric(width)){
			$tip.css({
				width:width
			});
		}
		if ($.isNumeric(height)){
			$tip.css({
				height:height
			});
		}
		tipWidth = $tip.width() + 6;//padding 2px, border 1px
		tipHeight = $tip.height() + 6;//padding 2px, border 1pxs
		//计算位置
		maxH = targetTop + targetHeight + tipHeight + offsetTop;
		if ((maxH > Math.max(dHeight, wHeight)) && (targetTop > tipHeight)){
			top = targetTop - tipHeight;
		} else {//向下展开
			top = targetTop + targetHeight;
		}
		left = targetLeft - (tipWidth - targetWidth) / 2;
		
		if (left < (-offsetLeft)){//弹出的位置小于左边界了
			left = (-offsetLeft);
		}
		if ((left + offsetLeft + tipWidth) > Math.max(wWidth, dWidth)){//弹出的位置大于右边界了
			left = Math.max(wWidth, dWidth) - offsetLeft - tipWidth;
		}
		$tip.css({
			left:left,
			top:top
		});
	}
	//处理tip的事件，注：settings中的target是完整的jquery选择器，而不是默认的id
	var bindTip = function (_$target, _$tip){
		var settings = _$target._getTuiTipSelectData(),
			target = settings.target,
			$lis = $('li', _$tip),
			$t;
		//判断target的有效性
		if (target instanceof jQuery){
			$t = target;
		} else if (target == '' || null == target){
			$t = $('.btn_content', _$target);
		} else {
			$t = $(target, _$target);
		}
		
		$lis.off('click.tuiTipSelect').on('click.tuiTipSelect', function (){
			var $this = $(this),
				$target = _$target,
				$tip = _$tip,
				$label = $t,
				oldLabel = $target.attr('data-label') || '',
				oldVal = $target.attr('data-val') || '',
				newLabel = $this.attr('data-label'),
				_settings = settings,
				newVal = $this.attr('data-val');
			checkTip($target, $label, newLabel, newVal);
			if (typeof(_settings.onSelect) === 'function'){
				_settings.onSelect.call($target, newLabel, newVal, oldLabel, oldVal);
			}
			if ((oldLabel != newLabel) || (oldVal != newVal)){//changed
				if (typeof(_settings.onChange) === 'function'){
					_settings.onChange.call($target, newLabel, newVal, oldLabel, oldVal);
				}
			}
			//关闭
			closeTip();
		});
	}
	var checkTip = function ($target, $label, label, val){
		$target.attr('data-label', label).attr('data-val', val);
		$label.html(label);
	}
	//关闭tip
	var closeTip = function (){
		var $tip = $('#tuiTipSelectBox');
		$tip.hide();
		$(document).off('click.tuiTipSelect');
	}
	
	$.fn.tuiTipSelect = function (){
		var _default = {
			width:'auto',//宽度
			height:'auto',//高度
			target:null,//数据的内容的位置
			option:[],//{label:'标题名',val:'值'}
			optionDefault:0,//默认选择哪项
			onClick:null,//点击时的回调函数，在鼠标点击按钮时的回调，该方法会执行在下拉框出现之前。
			//上下文this为点击的按钮的jQuery对象。该方法如果return值不为false，则会继续执行下拉框。如果为false，则不出现下拉框
			onSelect:null,//选择之后的回调函数。上下文this为按钮的jQuery对象，参数：newLabel, newVal, oldLabel, oldVal
			onChange:null//改变选项值后的回调函数。上下文this为按钮的jQuery对象，参数：newLabel, newVal, oldLabel, oldVal
		};
		//合并参数
		var settings = $.extend({}, _default);
		for (var i = 0; i < arguments.length; i++){
			settings = $.extend(settings, arguments[i]);
		}
		//将参数写入data
		var $this = $(this);
		return $this.each(function () {
            var $this = $(this);
			$this._setTuiTipSelectData(settings);
			$this.off('click.tuiTipSelect').on('click.tuiTipSelect', function (){
				var $this = $(this),
					$tip,
					condition;
				if (typeof(settings.onClick) === 'function'){
					condition = settings.onClick.call($this);
					if (!condition){
						return;
					}
				}
				//添加下拉框
				$tip = addTip($this);
				//计算下拉框位置
				dealtTip($this, $tip);
				bindTip($this, $tip);
			});
			$this.changeTuiTipSelectItem(settings.optionDefault, false);
        });
		
		
		
	}
	//获取数据
	$.fn._getTuiTipSelectData = function (){
		return $(this).data('tuiTipSelectSettings');
	}
	//设置数据
	$.fn._setTuiTipSelectData = function (data){
		$(this).data('tuiTipSelectSettings', data);
	}
	//设置选中哪一个
	$.fn.changeTuiTipSelectItem = function (itm, isTriggerCallback){
		var num;
		var $this = $(this),
			settings = $this._getTuiTipSelectData(),
			option = settings.option,
			count = option.length,
			target = option.target,
			$t;
			
		var condition = false,
			cur;
			
		var oldLabel = $this.attr('data-label'),
			oldVal = $this.attr('data-val'),
			newLable, newVal;
		if (count < 1){
			return;
		}
		//判断target的有效性
		if (target instanceof jQuery){
			$t = target;
		} else if (target == '' || null == target){
			$t = $('.btn_content', $this);
		} else {
			$t = $(target, $this);
		}
		if (typeof(itm) === 'number'){
			if (itm < 0){
				num = 0;
			}
			num = itm;
			condition = true;
		} else {//进行查找匹配
			for (var i = 0; i < count; i++){
				cur = option[i];
				newLabel = cur['label'];
				newVal = cur['val'];
				if ((newLabel && newLabel.indexOf(itm) >= 0) || (newVal && newVal.indexOf(itm) >= 0)){
					num = i;
					condition = true;
					break;
				}
			}
		}
		if (num >= count){//num大于count了
			num = count - 1;
		}
		if (condition){//找到了
			newLabel = option[num]['label'];
			newVal = option[num]['val'];
			$this.attr('data-label', newLabel);
			$this.attr('data-val', newVal);
			$t.html(newLabel);
			if (isTriggerCallback && typeof(settings.onSelect) === 'function'){
				settings.onSelect.call($this, newLabel, newVal, oldLabel, oldVal);
			}
			if (isTriggerCallback && ((oldLabel != newLabel) || (oldVal != newVal))){
				if(typeof(settings.onChange) === 'function'){
					settings.onChange.call($this, newLabel, newVal, oldLabel, oldVal);
				}
			}
		}
	}
})($, window);