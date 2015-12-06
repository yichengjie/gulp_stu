/**                                                    
 * tuiTipBox是TUI中显示浮动提示框等浮动显示信息的常用插件。该插件包含原始方法和封装后的方法。
 * 原始方法包含多种参数，核心功能是将一个数据进行浮动显示，计算显示位置。
 * 目前封装的方法有以下几类：
 *  显示在表格或列表等结构中的tip提示。数据来自列表或表格中的指定的attr数据
 *  显示一个隐藏的容器，容器中的内容已经存在
 *  通过ajax请求一个内容，并将内容显示在某个位置                    
 * Copyright: Copyright (c) 2013                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.9.14          
 * @see                                                
 *	HISTORY                                            
 * 2013-1-25下午04:00:08 创建文件
 * 2013-1-31 版本更新，修正了按钮的事件冒泡未正确处理的问题。现在兼容了可以冒泡事件的按钮
 * 2013-2-04 版本更新，修正了在popUpPanel未指定高度时，无法正确显示高度的问题
 * 2013-2-05 版本更新，添加了在popUpPanel未指定高度时，无法正确显示宽度的问题
 *   修正了存在多个showContent时鼠标点击事件无法让其他浮动框关闭的bug
 * 2013-2-25 版本更新，修正了在同一页面，多个使用popUpPanel时出现多target全部显示的问题
 * 2013-3-04 版本更新，修正了在非popUpPanel下，如果内容高度超过配置高度，容器高度不会被顶开的bug
 * 2013-3-05 版本更新，在pos为b的情况下，不会再计算位置是否超出document高度了。
 * 2013-4-09 版本更新，修正了计算位置时，因为通过position计算坐标而出现的错误，现在可以自动调节offset和position了。
 *   修正了在下拉框为auto的情况下，无法正确计算拉出的方向的bug
 * 2013-5-27 版本更新，增加了onBeforeShow的回调，该回调函数如果返回false，则不进行show的操作。回调的上下文this为按钮，参数settings
 * 2013-5-28 版本更新，修正了主语选择器为多个项目时的错误。
 *   修正了宽度错误处理错误的bug
 * 2013-9-16 版本更新，修正了target和btn因为属于不同position:relative下，而出现的定位错误。
 * 2013-9-29 版本更新，在popUp的模式下，将会自动根据btn的位置设置箭头的位置。
 * 2013-10-30 版本更新，增加了偏移量offLeft和offTop，注意：这两个参数将在坐标自动计算完毕之后增加
 * 2013-12-24 版本更新，重新修改了tip关闭的方式
 */
;(function ($){
	$.fn.tuiShowContentWithPopup = function (id, extraOption){
		return $(this).each(function (){
			var $this = $(this),
			opt = {
				target:$('#' + id),
				height:null,
				width:null,
				isPopUpPanel:true
			};
			opt = $.extend(opt, extraOption);
			$this.tuiTipBox(opt);
		});
	};
	//显示一个隐藏的浮动框，参数为需要显示的浮动框id
	$.fn.tuiShowContent = function (id, extraOption){
		return $(this).each(function (){
			var $this = $(this),
				opt = {
					target:$('#' + id),
					width:null,
					height:null
				};
			opt = $.extend(opt, extraOption);
			$this.tuiTipBox(opt);
		});
	}
	//鼠标滑过显示的浮动框.
	/*
	 * 参数说明：
	 *  panelId为浮动框的id，一般浮动框是隐藏的，这个浮动框的id需要当做panelId传入，这样显示时，将内容放入容器
	 *  contentAttr为需要显示内容的属性，需要显示的数据需要在标签的任意一个属性中，该属性名座位该参数
	 */
	$.fn.tuiFloatBox = function (panelId, contentAttr, extraOption){
		return $(this).each(function (){
            var $this = $(this),
				opt = {
					target:function (){
						return $('#' + panelId).html($this.attr(contentAttr));
					},
					events:'hover',
					pos:'r'
				};
			opt = $.extend(opt, extraOption);
			$this.tuiTipBox(opt);
        });
	}
	$.fn.tuiTipBox = function (){
		var _defaults = {
			target:'',//需要进行处理和显示的数据部分，所有的tip内容都必须在target中。类型可以为：String,jQuery,function。
			             //function必须返回一个有效的String或者jQuery对象，参数为this
			isPopUpPanel:false,//是否采用popup作为容器。popup是eico设计的一个样式。注：如果为true，则target外必存在popup
			events:'click',//事件类型，目前支持click，hover
			width:100,//提示框宽度。
			height:100,//提示框高度。
			left:0,//提示框显示位置，可以为null
			top:0,//提示框显示位置，可以为null
			onBeforeShow:null,//在显示之前进行的回调，如果返回false，则不显示。
			onShow:null,//在tip显示时的回调，上下文为该浮动框，第一个参数是按钮。注：该回调在显示结束之后调用
			onHide:null,//在tip隐藏是的回调，上下文为该浮动框，第一个参数是按钮。注：该回调在隐藏结束之后调用
			pos:'auto',//提示框显示位置，参数有：auto,l,r,t,b,none,set。分别为：自动，左侧，右侧，上，下，不计算位置直接显示
			//auto说明，如果参数为auto，则位置规则为，自动尝试向下显示，如果下侧无法显示且上侧可以显示，则向上显示。
			//左侧位置小于0，位置设置为0，右侧位置大于屏幕宽度，位置设置为屏幕宽度。
			//注意:pos为set时，如果isPopUpPanel为true，也不会显示箭头具体的位置
			offLeft:null,//偏移量坐标
			offTop:null,//偏移量坐标
			arrowPos:'auto'//该参数用于设定箭头的位置的，auto将会按照btn的具体位置，设置箭头。
			//如果自定义设置，则支持right，left，top，bottom。例如：left:50,就是left:50px的样式。
			//注意：如果箭头在左右，则right和left无效。如果箭头在上下，则top和bottom无效。无效的情况，将按照auto进行计算。
			},
			$tipBtn = $(this)
		//参数准备-------------------------
		var settings = $.extend({}, _defaults);
		for (var i = 0; i < arguments.length; i++){
			settings = $.extend(settings, arguments[i]);
		}
		//--------------------------------
		//显示浮动Tip
		var showPanel = function (target, $tipBtn, settings){
			if (!$tipBtn) return;
			var $target,
				$tipBox = $('#tuiTipBox'),
				tipId;
			if (typeof(target) === "function"){//针对function类型的
				target = target.call($tipBtn);
			}
			//尝试关闭之前没有关闭的tipBox
			$('[id^=tuiTipBox]').hide();
			//-----------
			if (!settings.isPopUpPanel){
				if (target instanceof jQuery){//针对jQuery类型的
					$target = target;
				} else {
					if (!$tipBox.length){//没有生成过tipId
						tipId = "tuiTipBox";
						$target = $('<div class="float_panel" id="' + tipId + '"><div class="content"></div></div>').insertAfter($tipBtn);
					} else {
						$target = $tipBox;
					}
					$target.find('.content').html(target);
				}
			} else {
				if (!$tipBox.length){//没有生成过tipId
					tipId = "tuiTipBox";
					var popupHtml = '<div class="popup_tip" id="' + tipId + '">\
										 <div class="popup_top">\
											<div class="top_left"></div>\
											<div class="top_right"></div>\
										 </div>\
										 <div class="popup_content">\
											<div class="content_left"></div>\
											<div class="content"></div>\
											<div class="content_right"></div>\
										 </div>\
										 <div class="popup_bottom">\
											<div class="bottom_left"></div>\
											<div class="bottom_right"></div>\
										 </div>\
									  </div>';
					if (target instanceof jQuery){
						$target = $(popupHtml).appendTo(target.parent());
					} else {
						$target = $(popupHtml).insertAfter($tipBtn);
					}
					$tipBtn.data('tipId',tipId);
				} else {
					$target = $tipBox;
				}
				//此处为了修正在同一个页面中，有多个target使用了该方法，这时，所有的target都会被放到同一个popupPanel中，因此，必须要隐藏其他的target才能显示正常。
				$target.find('.content').children().hide();
				//-------------
				if (target instanceof jQuery){
					$target.find('.content').append(target.show());//target有可能是隐藏的
				} else {
					$target.find('.content').html(target);
				}
			}
			
			$target.css({left:0, top:0}).show();//设置成0，0的原因是，先做show，再算position，如果不为0，则页面就会被顶开，
												//导致在auto下，不能正确的计算是向上拉，还是向下拉
			//暂时不添加height，因为有可能里面文字的内容超过了容器的高度，如果直接设置高度，文字就无法顶开容器了。
			if ($.isNumeric(settings.width) && $.isNumeric(settings.height)){
				$target.css({width:settings.width, height:'auto'});//设置为auto的原因是在后面还会根据内容重新计算高度，如果定死，内容高度无法获得
			} else {
				if (target instanceof jQuery && settings.isPopUpPanel){
					$target.css({height:target.outerHeight() + 18, width:target.outerWidth() + 6});//padding 4+2
				}
			}
			//不在这里进行onShow回调的原因是，在执行到该位置时，位置还没有进行计算
			return $target;
			
		}
		//设置浮动框的位置,$target必须为jQuery
		var setPosition = function ($target, $tipBtn, settings){
			if (!$target || !$tipBtn) return;
			var pos = settings.pos,
				isPopUp = settings.isPopUpPanel,
				dWidth = $(document).width(),//document的width
				dHeight = $(document).height(),//document的height
				wWidth = $(window).width(),//window的width
				wHeight = $(window).height(),//window的height
				tWidth = $target.width() + (isPopUp ? 14 : 0),//需要显示的tip宽度，样式中左侧4px右侧9px的absolute的边框，因此加上这个误差
				tHeight = $target.height() + (isPopUp ? 14 : 0),//需要显示的tip高度，样式中上边4px下边10px的absolute的边框，因此加上这个误差
				bWidth = $tipBtn.width(),//按钮的宽度
				bHeight = $tipBtn.height(),//按钮的高度
				left = 0,//最终算出的left
				top = 0,//最终算出的top
				bPosition,
				configHeight,//用于计算配置中的高度
				offLeft = settings.offLeft,//最终的偏移量
				offTop = settings.offTop,//最终的偏移量
				sHeight = settings.height;//配置的高度
				
			var tO = $target.offset(),
				tP = $target.position(),
				bO = $tipBtn.offset(),
				bP = $tipBtn.position();
				
			var toff = $target.offsetParent().offset(),
				boff = $tipBtn.offsetParent().offset();
				
			var hcom = boff.left - toff.left,//计算btn和target之间的偏移位置。
				vcom = boff.top - toff.top;
				
			
			if (pos == "none") return;//针对不设置位置的不进行坐标计算
			
			bPosition = bP;//上面已经考虑target与btn的position了，因此，在此全部用position()方法进行计算
			
			if (isPopUp){//针对已经存在的浮动框，如果之前已经存在了popup的小三角，则必须要在添加新小三角之前删除。
				$('.content_right_middle,.content_left_middle,.top_middle,.bottom_middle').remove();
			}
			
			switch (pos){
				case 'auto':
					left = bPosition.left - (tWidth-bWidth) / 2;//默认是向下显示的
					top = bPosition.top + bHeight;
					if (isPopUp){
						$target.find('.popup_top .top_left').after('<div class="top_middle"></div>');
						top += 8;//上侧8px箭头
					}
					if ((top + vcom + toff.top + tHeight) > dHeight && (bPosition.top + boff.top) > tHeight){//如果下面显示不下了，且上面可以放下，则向上显示
						top = bPosition.top - tHeight;
						if (isPopUp){
							$('.top_middle').remove();
							$target.find('.popup_bottom .bottom_left').after('<div class="bottom_middle"></div>');
							top -= 8;//下侧8px箭头
						}
					}
					break;
				case 'l':
					left = bPosition.left - tWidth;
					top = bPosition.top - (tHeight-bHeight) / 2;s
					if (isPopUp){
						$target.find('.popup_content .content_right').after('<div class="content_right_middle"></div>');
						left -= 8;//右侧8px的箭头
					}
					break;
				case 'r':
					left = bPosition.left + bWidth;
					top = bPosition.top - (tHeight-bHeight) / 2;
					if (isPopUp){
						$target.find('.popup_content .content_left').after('<div class="content_left_middle"></div>');
						left += 8//左侧8px箭头
					}
					break;
				case 't':
					left = bPosition.left - (tWidth-bWidth) / 2;
					top = bPosition.top - tHeight;
					if (isPopUp){
						$target.find('.popup_bottom .bottom_left').after('<div class="bottom_middle"></div>');
						top -= 8;//上侧8px箭头
					}
					break;
				case 'b':
					left = bPosition.left - (tWidth-bWidth) / 2;
					top = bPosition.top + bHeight;
					if (isPopUp){
						$target.find('.popup_top .top_left').after('<div class="top_middle"></div>');
						top += 8;//下侧8px箭头
					}
					break;
			}
			
			left += hcom;//增加偏移的位置
			top += vcom;//增加偏移的位置
			
			if ((left + toff.left + tWidth) > dWidth){//窗口的右侧超出文档的右侧
				left = dWidth - tWidth - toff.left;
			}
			if (left + toff.left < 0){//窗口的左侧超出文档左侧
				left = 0 - toff.left;
			}
			if ((top + toff.top + tHeight) > dHeight && (top + toff.top + tHeight) > wHeight && pos != "b"){//如果弹出窗口在页面最下面，则按照最下边界显示
				top = dHeight - tHeight - toff.top;
			}
			if ((top + toff.top) < 0){
				top = 0 - toff.top;
			}
			if (pos == 'set'){//自动设置位置，通过参数设置位置。注：这种设置方法不会对位置进行操作
				left = settings.left;
				top = settings.top;
			}
			if ($.isNumeric(offLeft)){
				left += offLeft;
			}
			if ($.isNumeric(offTop)){
				top += offTop;
			}
			$target.css({left:left, top:top});
			//要修正容器高度在被顶开的情况下，重新计算高度
			if (!settings.isPopUpPanel && $.isNumeric(sHeight)){
				finalHeight = $target.outerHeight();
				if (finalHeight > sHeight){
					$target.css({height:finalHeight});
				} else {
					$target.css({height:sHeight});
				}
			}
		}
		//隐藏显示的窗口
		var hidePanel = function ($target, $tipBtn, settings){
			$target.fadeOut(200);
			if (typeof(settings.onHide) === "function"){
				settings.onHide.call($target, $tipBtn);
			}
		}
		//设置箭头的位置，必须在显示和计算位置之后才能执行该方法
		var setArrow = function ($target, $tipBtn, settings){
			if (!settings.isPopUpPanel){
				return false;
			}
			var arrowPos = settings.arrowPos,
				reg = /([right|left|top|bottom]{0,}):([0-9]{0,})/g,
				result,
				pos,
				px,
				autoed = true;//用于记录arrow的自定义位置是否是正确的
				$arrow = $('.content_right_middle,.content_left_middle,.top_middle,.bottom_middle');
				
			var bO, tO;
			var x, y;
			if ($arrow.length != 1){
				return;
			}
			if (arrowPos != 'auto'){
				result = reg.exec(arrowPos);
				if (result.length == 3){
					pos = result[1];
					px = result[2];
					if (pos == 'top' || pos == 'bottom'){
						if ($arrow.hasClass('content_right_middle') || $arrow.hasClass('content_left_middle')){
							$arrow.css('left', 'auto');
							$arrow.css(pos, px);
							autoed = false;
						}
					} else if (pos == 'left' || pos == 'right'){
						if ($arrow.hasClass('top_middle') || $arrow.hasClass('bottom_middle')){
							$arrow.css('left', 'auto');
							$arrow.css(pos, px - 0);
							autoed = false;
						}
					}
				}
			}
			if (autoed){
				bO = $tipBtn.offset();
				tO = $target.offset();
				if ($arrow.hasClass('content_right_middle') || $arrow.hasClass('content_left_middle')){
					y = bO.top - tO.top + ($tipBtn.height() - $arrow.height()) / 2;
					$arrow.css('top', y);
				}else if ($arrow.hasClass('top_middle') || $arrow.hasClass('bottom_middle')){
					x = bO.left - tO.left + ($tipBtn.width() - $arrow.width()) / 2;
					$arrow.css('left', x);
				}
			}
		}
		//主方法------------
		//绑定事件
		if (settings.events == "click"){//点击事件
			$tipBtn.off('click.tuiTipBox').on('click.tuiTipBox', function (){
				var $this = $(this),
					thisId = $this.get(0).id,
					$document = $(document);
				if (typeof(settings.onBeforeShow) == 'function'){
					if (settings.onBeforeShow.call($this,settings) === false){
						return;
					}
				}
				var $target = showPanel(settings.target, $this,settings),//在beforeShow回调执行之后，才进行后面的处理target操作
					targetId = $target.get(0).id;
				setPosition($target, $this, settings);
				setArrow($target, $this, settings);
				$document.off('click.tuiTipBox').on('click.tuiTipBox', function (event){
					//如果不是点击到：浮动框，按钮，则关闭浮动框
					if (!($this.get(0) == event.target || $target.get(0) == event.target || $.contains($target.get(0), event.target) || $.contains($this.get(0), event.target))){
						hidePanel($target, $this, settings);
						$document.off('click.tuiTipBox');
					}
				});
				if (typeof(settings.onShow) === "function"){//onshow回调函数
					settings.onShow.call($target, $this);
				}
			})
		} else if (settings.events == "hover"){//hover事件
			var $target, tCondition;//tCondition是beforeShow的执行结果，如果tCondition为false，则说明没有显示浮动框，因此在mouseout事件中就不用hilde了。
			$tipBtn.off('mouseover.tuiTipBox mouseout.tuiTipBox').on('mouseover.tuiTipBox', function (){
				var $this = $(this);
				if (typeof(settings.onBeforeShow) == 'function'){
					if ((tCondition = settings.onBeforeShow.call($this,settings)) === false){
						return;
					}
				}
				$target = showPanel(settings.target, $this, settings);
				setPosition($target, $this, settings);
				setArrow($target, $this, settings);
				if (typeof(settings.onShow) === "function"){//onshow回调函数
					settings.onShow.call($target, $this);
				}
			}).on('mouseout.tuiTipBox', function (){
				if (tCondition === false){return;}//onBeforeShow如果返回了false，则不用hide了
				var $this = $(this);
				hidePanel($target, $this, settings);
			});
		}
		return $tipBtn;
		//-----------------
	}
})(jQuery);