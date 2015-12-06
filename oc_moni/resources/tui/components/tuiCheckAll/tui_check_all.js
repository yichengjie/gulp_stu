/**                                                    
 * tuiCheckAll是TUI组件中的工具组件，用于处理全选操作。
 * 指定的全选功能，可以是按钮，也可以是checkbox。
 * 该方法依赖在jQuery原型上绑定。
 * 注意：每个复选框必须存在name，否则，该复选框将不会被该组件方法覆盖
 * Copyright: Copyright (c) 2013                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.10.2                 
 * @see                                                
 *	HISTORY                                            
 * 2013-01-10 10:02:08 创建文件
 * 2013-01-24 版本更新，修正了取消全选时的条件判断，针对复合式全选提供了支持
 * 2013-01-31 版本更新，修正了因为分页而引起的部分复选框隐藏出现的问题。全选只对不隐藏的复选框有效。
 *  增加了getAllCheckedValue方法，用于获得当前页面中选中的复选框中的value
 * 2013-03-14 版本更新，修改了checkbox的触发方式，并修正了因为触发方式的错误导致的onCheckAll回调函数的调用错误
 *  修正了onCancelCheckAll回调函数的调用错误，现在只有在点击取消全选或者从全选checkbox减少一个选中checkbox时，才会触发。
 * 2013-04-10 版本更新，live绑定的事件中，增加了自定义事件tuiClick
 *  由于通过trigger触发click事件与实际的鼠标点击click事件在执行顺序上不同，因此增加了tuiClick自定事件用于处理全选等操作。
 *  注：自定义事件tuiClick不对checkbox或radio的选中状态做修改，因此，在trigger之前，必须手动设置选中状态。
 * 2013-04-25 版本更新，修正了在级联全选时，去掉取消勾选某个checkbox时，最高级全选checkbox没有取消勾选的bug
 * 2013-07-01 版本更新，onCheckAll和onCancelCheckAll回调函数增加一个参数，参数为点击事件
 * 2013-10-14 版本更新，删除了live的方法，以适应jquery1.10.2
 * 2013-10-28 版本更新，修正了无法触发tuiClick自定事件的bug
 */
;(function ($){
	$.fn.tuiBindCheckAll = function (){
		var _default = {
			names:[],//checkbox中name的值，为数组，可以是多个
			onCheckAll:null,//回调函数，所有复选框都被选中后，触发该函数，上下文为按钮或全选的复选框本身
			onCancelCheckAll:null,//回调函数，所有复选框有一个没被选中，触发该函数，上下文为按钮或全选的复选框本身
			checkCls:'check_all'//针对全选按钮时，该参数有效。全选与取消全选的判断依据是判断是否有该class样式。
			},
			settings = $.extend({}, _default),
			$checkAll = this,
			isCheckbox = false;//用于记录全选按钮是否是复选框
		//判断是否是checkbox
		if ($checkAll.is(':checkbox')){
			isCheckbox = true;
		}
		//参数合并
		for (var i = 0; i < arguments.length; i++){
			settings = $.extend(settings, arguments[i]);
		}
		//选择全部符合条件的复选框
		var selectStr = "",
			names = settings.names,
			count = names.length;
		for (var i = 0; i < count; i++){
			if (i > 0){
				selectStr += ",";
			}
			selectStr += "input[name='" + names[i] + "']";
		}
		//--------------------
		//内部方法，全选所有checkbox
		var checkAll = function (){
			var $checkbox = $(selectStr).filter(':visible');
			if (!$checkbox.length){
				return;
			}
			$checkbox.each(function (){
				var $this = $(this);
				if (!$this.is(':checked')){
					$this.attr('data-checked', 'true');
					$this.prop('checked', true);
				}
			});
		}//checkAll结束
		var cancelAll = function (){
			var $checkbox = $(selectStr).filter(':visible');
			if (!$checkbox.length){
				return;
			}
			$checkbox.each(function (){
				var $this = $(this);
				if ($this.is(':checked')){
					$this.attr('data-checked', 'false')
					$this.prop('checked', false);
				}
			});
		}
		//将全选按钮或复选框勾选
		var setCheckAllChecked = function(e){
			$checkAll.attr('data-checked', 'true');
			if (isCheckbox){
				$checkAll.prop('checked', true);
				if (typeof(settings.onCheckAll) === "function"){
					settings.onCheckAll.call($checkAll, e);
				}
			} else {
				$checkAll.addClass(settings.checkCls);
				if (typeof(settings.onCheckAll) === "function"){
					settings.onCheckAll.call($checkAll, e);
				} else {
					$checkAll.html('取消全选');
				}
			}
		}
		//将全选按钮或复选框取消勾选
		var setCheckAllCanceled = function (e){
			$checkAll.attr('data-checked', 'false');//设置已经取消全选的标记
			if (isCheckbox){
				$checkAll.prop('checked', false);
				if (typeof(settings.onCancelCheckAll) === "function"){
					settings.onCancelCheckAll.call($checkAll, e);
				}
			} else {
				$checkAll.removeClass(settings.checkCls);
				if (typeof(settings.onCancelCheckAll) === "function"){
					settings.onCancelCheckAll.call($checkAll, e);
				} else {
					$checkAll.html('全选');
				}
			}
		}
		//方法开始
		//给每一个checkbox绑定事件，采用事件代理
		//$(selectStr).live('click.tuiCheckAll tuiClick',function(e){
		$(document).off('click.tuiCheckAll tuiClick', selectStr).on('click.tuiCheckAll tuiClick', selectStr, function (e){
			var $this = $(this),
				$allCheckbox = $(selectStr).filter(':visible'),
				$checked = $allCheckbox.filter(':checked'),//已经选择的所有复选框
				$unchecked;//没有选择的所有复选框
			if ($this.is(':checked')){
				//判断是否已经全选
				$this.attr('data-checked', 'true');
				if ($checked.length == $allCheckbox.length && $checkAll.attr('data-checked') == 'false'){//设置全选按钮
					setCheckAllChecked(e);
				}
			} else {
				$this.attr('data-checked', 'false');
				if ($checked.length < $allCheckbox.length && $checkAll.attr('data-checked') == 'true'){
					setCheckAllCanceled(e);
				}
			}
		});
		//最后绑定全选按钮或复选框事件
		return $checkAll.each(function (){
			var $this = $(this),
				checkCls = settings.checkCls;
			//初始化是否选中的操作
			$this.attr('data-checked', $this.is(':checked') ? 'true' : 'false');
			$this.off('click.tuiCheckAll tuiClick').on('click.tuiCheckAll tuiClick', function (e){
				//对于checkbox
				if (isCheckbox){
					if ($this.is(':checked')){
						$this.attr('data-checked', 'true');//设置自己已经被全选了
						checkAll();
						if (typeof(settings.onCheckAll) === "function"){
							settings.onCheckAll.call($checkAll, e);
						}
					} else {
						$this.attr('data-checked', 'false');//设置自己取消全选了
						cancelAll();
						if (typeof(settings.onCancelCheckAll) === "function"){
							settings.onCancelCheckAll.call($checkAll, e);
						}
					}
				} else {
					if ($this.hasClass(checkCls)){//取消全选
						$this.attr('data-checked', 'false');
						$this.removeClass(checkCls);
						cancelAll();
						//响应回调，如果没有回调函数，则使用默认操作
						if (typeof(settings.onCancelCheckAll) === "function"){
							settings.onCancelCheckAll.call($checkAll, e);
						} else {//默认操作
							$this.html('全选');
						}
					} else {
						$this.attr('data-checked', 'true');
						$this.addClass(checkCls);
						checkAll();
						if (typeof(settings.onCheckAll) === "function"){
							settings.onCheckAll.call($checkAll, e);
						} else {
							$this.html('取消全选');
						}
					}
				}
			})
		});
	}
	//提供一个获得已经选中的checkbox的值。复选框中的值按照顺序放入数组中。
	//name为checkbox的name
	//注：参数isFromAll为是否需要对隐藏的checkbox进行取值。true为取值，false则不对不显示的复选框取值
	$.tui = $.tui || {};
	$.tui.getAllCheckedValue = function (name, isFromAll){
		var str = "input[name='" + name + "']",
			$checkbox = $(str),
			values = new Array();
		if (!isFromAll){
			$checkbox = $checkbox.filter(':visible');
		}
		$checkbox.each(function (){
            var $this = $(this);
			if ($this.is(":checked")){
				values.push($this.val());
			}
        });
		return values;
	}
})(jQuery)