/**
 * tui文件是处理页面显示效果的主文件，用于生成按钮，输入框等必要的预处理的方法。
 * 该方法依赖于jquery以及各个GUI项目js组件，因此，改文件应该在所有系统组件加载之后进行引入
 * 该方法在所有组件加载执行完毕之后执行。在document准备就绪只后执行。
 * 该方法中的所有事件均需要使用tuiInt命名空间
 * @author  cma@travelsky.com 马驰                  
 * @version 0.10.19.2
 * @see   
 * HISTORY                                            
 * 2012-10-11下午02:08:08 创建文件
 *  1，input_normal的初始化。input框的基本事件
 * 2012-10-18 增加了对IE67系列对页面最小宽度的要求。
 * 2012-10-19 修正了input_normal因为冒泡无法实现blue事件的bug
 *  增加了tab_data_section的打开和收起的事件，由not_close来标记不进行收起绑定
 * 2012-10-22 版本更新。增加了catch输出控制台功能。
 *  增加了main_box的class参数，no_min_width
 * 2012-10-23 修改了事件的绑定方法，将输入框等换成live模式
 * 2012-11-13 版本更新，增加了竖排表格的初始化的方法
 * 2012-12-26 修改了IE678下表格斑马线的起始颜色
 * 2013-02-04 版本更新，增加了mainbox的min-width的支持，现在在IE老版本浏览器中，在mainbox下添加minwidth属性就可实现min-width功能
 * 2013-02-18 版本更新，增加了在IE下对textarea中maxlength属性的支持
 * 2013-03-29 加上禁止刷新，回退代码
 * 2013-03-29 添加了页签的自动事件处理。
 * 2013-05-06 版本更新，去掉了针对IE67的minwidth的js支持。由于放弃支持IE6，IE7对min-width有效，因此去掉该方法
 * 2013-05-17 版本更新，对于input_advance类型的输入框初始化方法，如果为disabled，则不触发事件
 * 2013-05-24 版本更新，修正了在IE下的textarea的maxlength fix引起的粘贴文字丢失的问题。
 * 2013-06-06 版本更新，增加了页签栏的js默认事件
 * 2013-07-15 版本更新，增加了toggle_btn默认事件的处理
 * 2013-08-12 版本更新，修改了toggle_btn的核心功能，现在更改了toggle的动画方案，增加了一个灰色样式，灰色样式请在toggle_panel上增加一个switch的class即可。
 * 2013-08-20 版本更新，增加了toggle_panel中input的值如果为data-right-value的值，则也会将toggle设置为right的功能。
 * 2013-09-10 版本更新，修改了页面中出现多个btn_group按钮组时，只能选中一个的bug。
 * 2013-09-24 版本更新，增加了input_plus的事件的支持
 * 2013-10-12 版本更新，去掉了live，die等方法以适应jquery 1.10.2版本
 * 2013-11-01 版本更新，修改了input_advance相关的操作，现在点击按钮之后input会默认全选。
 * 2013-11-28 版本更新，增加了页面backspace的屏蔽支持
 * 2013-12-18 版本更新，修正了tui_toggle在ajax引入时不执行init时的样式错误。
 * 2014-01-02 版本更新，修正了input_advance情况下，连续出发两次focus的bug。
 * 2014-01-20 修改了标准中不推荐的代码书写格式。
 */
$(function(){
	var printErr = function (str, err){
		console && console.warn(str + ' have some problem. Err = ' + (err&&err.toString()));
	};
	var $document = $(document),
		$window = $(window);
	
	/*
	 * input_normal需要绑定focus和blur事件
	 */
	(function (){
		try{
			$(document).off('focus.tuiInit blur.tuiInit', '.input_normal').on('focus.tuiInit', '.input_normal', function (){
			//$('.input_normal').die('focus.tuiInit blur.tuiInit').live('focus.tuiInit',function(){
				var $this = $(this),
					$outer = $this.parent();
				$this.addClass('input_normal_focus').get(0).select();
				$outer.addClass('input_outer_focus');
			//}).live('blur.tuiInit',function(){
			}).on('blur.tuiInit', '.input_normal', function (){
				var $this = $(this),
					$outer = $this.parent();
				$this.removeClass('input_normal_focus');
				$outer.removeClass('input_outer_focus');
			});
		} catch (e){printErr('input_normal', e)}
	})();
	/*
	 * input_advance需要绑定focus和blur事件
	 */
	(function (){
		try{
			$(document).off('focus.tuiInit blur.tuiInit', '.input_advance').on('focus.tuiInit', '.input_advance', function (event){
			//$('.input_advance').die('focus.tuiInit blur.tuiInit').live('focus.tuiInit',function(){
				var $this = $(this),
					$btn = $this.next(),
					$outer = $this.parent();
				$this.addClass('input_advance_focus').get(0).select();
				$outer.addClass('input_outer_focus');
			}).on('blur.tuiInit', '.input_advance', function (){
			//}).live('blur.tuiInit',function(){
				var $this = $(this),
					$outer = $this.parent();
				$this.removeClass('input_advance_focus');
				$outer.removeClass('input_outer_focus');
			});
			
			$(document).off('click.tuiInit', '.input_advance+div').on('click.tuiInit', '.input_advance+div', function (){
			//$('.input_advance+div').die('click.tuiInit').live('click.tuiInit',function(){
				var $this = $(this);
				if ($this.attr('class').indexOf("disable") >= 0) return;//针对已经disable的按钮则不响应
				//console.log($this.prev('.input_advance').get(0).focus() + '1');
				$this.prev('.input_advance').get(0).focus();
			});
			
		}catch (e){printErr('input advance', e)}
	})();
	/**
	 * input_plus需要绑定focus和blue事件
	 */
	(function (){
		try{
			$(document).off('focus.tuiInit blur.tuiInit', '.input_plus').on('focus.tuiInit', '.input_plus', function (){
			//$('.input_plus').die('focus.tuiInit blur.tuiInit').live('focus.tuiInit', function (){
				var $this = $(this),
					$btn = $this.next(),
					$outer = $this.parent();
				$this.addClass('input_plus_focus').get(0).select();
				$outer.addClass('input_outer_focus');
			}).on('blur.tuiInit', '.input_plus', function (){
			//}).live('blur.tuiInit', function (){
				var $this = $(this),
					$outer = $this.parent();
				$this.removeClass('input_plus_focus');
				$outer.removeClass('input_outer_focus');
			});
			$(document).off('click.tuiInit', '.input_plus_btn').on('click.tuiInit', '.input_plus_btn', function (){
			//$('.input_plus_btn').die('click.tuiInit').live('click.tuiInit', function (){
				var $this = $(this);
				if ($this.attr('class').indexOf("disable") >= 0) return;//针对已经disable的按钮则不响应
				$('.input_plus', $this.parent()).focus().get(0).select();
			});
		} catch (e){printErr('input plus', e)}
	})();
	/*
	 * 处理IE678的table斑马线
	 * 由于斑马线是通过CSS3实现的，因此需要对IE678进行单独的处理
	 */
	(function (){
		try{
			if ($.tui.isIE6() || $.tui.isIE7() || $.tui.isIE8()){
				//标准表格
				$('.table_normal tbody tr').removeClass('tr_single').removeClass('tr_double');
				$('.table_normal tbody tr:even').addClass('tr_single');
				$('.table_normal tbody tr:odd').addClass('tr_double');
				//纵向表格
				$('.table_normal_vertical tbody tr:odd').addClass('tr_single');
				$('.table_normal_vertical tbody tr:even').addClass('tr_double');
				$('.table_normal_vertical tbody th:odd').addClass('th_single');
				$('.table_normal_vertical tbody th:even').addClass('th_double');
			}
		} catch (e){printErr('ie6,7 table odd and even', e)}
	})();
	
	/*
	 * 页面必须要大于980px
	 */
	/*(function(){
		try{
			var MINWIDTH=980,
				$mainbox=$('.main_box'),
				exW;
			if($mainbox.length&&!$mainbox.hasClass('no_min_width')){
				if($.tui.isIE6()||$.tui.isIE7()){
					exW=$mainbox.attr('minwidth');
					MINWIDTH=($.isNumeric(exW))?exW:MINWIDTH;
					$window.off('resize.tuiInit').on('resize.tuiInit',function(){
						if($window.width()<MINWIDTH){
							$mainbox.width(MINWIDTH);
						}else{
							$mainbox.css({width:'auto'});
						}
					});
				}
			}
		}catch(e){printErr('min width of older ie',e)}
	})();*/
	
	/*
	 * 处理tab_data_section
	 * 参数class:not_close,不进行处理，一直打开
	 */
	(function (){
		try{
			var ANIMATE_TIME = 300;//动画时间
			//IE67bug,针对postion:relative的显示错误，需要在body上写入：postion:relative
			if ($.tui.isIE6() || $.tui.isIE7()){
				$('.main_box').css({position:'relative'});
			}
			//$('.tab_data_section .tab_label').die('click.tuiInit').live('click.tuiInit',function(){
			$(document).off('click.tuiInit', '.tab_data_section .tab_label').on('click.tuiInit', '.tab_data_section .tab_label', function (){
				var $this = $(this),
					$tabBlock = $this.parent(),
					$parent = $tabBlock.parent(),//tab_data_section
					$data = $parent.children().not($tabBlock);//除了tab标签之外的其他元素
				if ($parent.hasClass('not_close')){//不需要收起事件
					return;
				}
				if ($data.is(':animated')){//执行动画中，不进行任何操作
					return;
				}
				if ($data.is(':visible')){//执行close
					$data.stop().fadeOut(ANIMATE_TIME, function (){
						if ($tabBlock.hasClass('tab_block')){
							$tabBlock.removeClass('tab_block').addClass('tab_block_close');
						} else if ($tabBlock.hasClass('tab_block_no_line')){
							$tabBlock.removeClass('tab_block_no_line').addClass('tab_block_no_line_close');
						}
					});
				} else {//执行open
					$data.stop().fadeIn(ANIMATE_TIME, function (){
						if ($tabBlock.hasClass('tab_block_close')){
							$tabBlock.removeClass('tab_block_close').addClass('tab_block');
						} else if($tabBlock.hasClass('tab_block_no_line_close')){
							$tabBlock.removeClass('tab_block_no_line_close').addClass('tab_block_no_line');
						}
					});
				}
			});
		} catch (e){printErr('tab data section animate', e)}
	})();
	/*
	 * 处理btn_group下的btn_group_select的点击样式
	 */
	(function (){
		try{
			var removeBtnClass = function ($range){
				$('li[class*="select"]', $range).each(function (){
                    var $this = $(this),
						className = $this.attr('class');
					$this.attr('class', className.replace("btn_group_select", "btn_group"));
                });
			}
			//$('.btn_group li').die('click.tuiInit').live('click.tuiInit',function(){
			$(document).off('click.tuiInit', '.btn_group li').on('click', '.btn_group li', function (){
				var $this = $(this),
					className = $this.attr('class'),
					index = className.indexOf('select');
				if (index < 0){//没有被选中
					removeBtnClass($this.parent());
					className = className.replace("btn_group", "btn_group_select");
				} else {//已经被选中，这时说明当前按钮就是已经选中的，因此点击无效
					return;
					//className=className.replace("btn_group_select","btn_group");
				}
				$this.attr('class', className);
			});
			
		} catch (e){printErr('grouped button select', e)}
	})();
	/*
	 * IE系列中textarea中的maxlength属性的支持
	 */
	(function (){
		try{
			if ($.tui.isIE()){//针对IE的fix
				$('textarea[maxlength]').off('keypress.tuiInit paste.tuiInit').on('keypress.tuiInit paste.tuiInit', function (e){
					var $this = $(this),
						len = parseInt($this.attr('maxlength'));
					if (e.type === "paste"){//针对粘贴的情况
						/*event.preventDefault?event.preventDefault():event.returnValue=false;//去掉默认事件
						if(window.clipboardData.getData){
							var text=window.clipboardData.getData('Text');
							$this.html(text.substr(0,len));
						}*/
						setTimeout(function (){$this.html($this.html().substr(0, len));}, 30);
					} else if (!isNaN(len) && ($this.html().length > len - 1)){//常规输入
						return false;
					}
				})
			}
		} catch (e){printErr('IE textarea maxlength attribute fixed', e);}
	})();
	/*
	 * 2012-12-27,将原来util里面加入进来
	 */
	(function (){
		//禁止浏览器回退按钮	
		window.history.forward(1);
		// 禁止刷新，回退
		try{
			$(document).off("keydown.tuiInit").on("keydown.tuiInit", function (e){
				var e = e || window.event;
				var evs = e.srcElement ? e.srcElement : e.target;
				if (evs.type != "password" && evs.type != "text" && evs.type != "textarea" && evs.type != "file"){
			 		if (e.keyCode == 8){
				 		if (window.event){
					 		e.keyCode = 0; 
					 		e.returnValue = false;
				 		}else{
					 		e.preventDefault();
				 		}
			 		} else if (e.altKey && ((e.keyCode==37) || (e.keyCode==39))){
				 		if(window.event){
					 		e.returnValue = false;
				 		} else {
					 		e.preventDefault();
				 		}
			 		}
				} else if(evs.readOnly || evs.readOnly == true || evs.readOnly == 'readonly'){
			 		if (e.keyCode == 8){
				 		if (window.event){
					 		e.keyCode = 0; 
					 		e.returnValue = false;
						} else {
							e.preventDefault();
						}
					} else if(e.altKey && ((e.keyCode == 37) || (e.keyCode == 39))){
						if (window.event){
							e.returnValue = false;
						} else {
							e.preventDefault();
						}
					}
				} else {
			 		evs.focus();
				}
			});
		}catch (e){printErr('keydown', e)}
	})();
	/*
	 * 自动处理tab页按钮组的事件。包括：位置，点击高亮，z-index
	 * tab页的ul必须有tui_auto_init的class才会进行初始化。
	 * 位置根据前一个页签的宽度-10进行计算。
	 * z-index的顺序为：在选中的页签之前的页签是升序的，在选中的页签之后的页签是降序的。选中的页签z-index最高
	 */
	(function (){
		try{
			var autoCal = function ($this, $totalLi, highZ){
				var flag = false,
					zIndex = 1,
					$ptLi;
				//重新计算z-index
				$this.css({zIndex:highZ + 1});//选中的最高
				for (var i = 0; i < highZ; i++){
					$ptLi = $totalLi.eq(i);
					if ($this.get(0) === $ptLi.get(0)){
						flag = true;
						zIndex = highZ;
					}
					$ptLi.css({zIndex:zIndex});
					if (!flag){
						zIndex++;
					} else {
						zIndex--;
					}
				}
			}
			window.tuiTabItemGroup = function (){
				var $uls = $('.tab_item_group.tui_auto_init');
				$uls.each(function (){
					var $thisUl = $(this),
						$lis = $('.tab_item,.tab_item_select', $thisUl),
						count = $lis.length,
						tabLeft = 0,
						$thisLi;
						
					//计算z-index
					autoCal($('.tab_item_select', $thisUl), $lis, count);
					//计算位置
					for (var i = 0; i < count; i++){
						$thisLi = $lis.eq(i);
						$thisLi.css({left:tabLeft});
						tabLeft += $thisLi.width() - 10;
					}
				});
			}
			tuiTabItemGroup();
			//绑定li事件，高亮和z-index
			$(document).off('click.tuiInit', '.tab_item_group.tui_auto_init li').on('click.tuiInit', '.tab_item_group.tui_auto_init li', function (){
			//$('.tab_item_group.tui_auto_init li').off('click.tuiInit').on('click.tuiInit', function (){
				var $this = $(this),
					$totalLi = $this.siblings().andSelf(),
					highZ = $totalLi.length;
				//选中高亮
				$totalLi.filter('.tab_item_select').removeClass('tab_item_select').addClass('tab_item');
				$this.addClass('tab_item_select');
				autoCal($this, $totalLi, highZ);
			});
		} catch (e){printErr('tab_item_group dealt', e);}
	})();
	
	/**
	 * Page block 分块的初始化程序
	 */
	(function (){
		try{
			var $blocks = $('.page_block');
			$blocks.each(function (){//循环每一个block，将默认关闭的关闭
				var $this = $(this),
					$dataSec = $this.parent(),
					$pageCont;
				if ($dataSec && $dataSec.hasClass('tab_data_section')){
					$pageCont = $('.page_content', $dataSec);
				} else {
					return;
				}
				//如果一开始就设定的关闭
				if ($this.hasClass('closed')){
					$pageCont.hide();
				}
			});
			$(document).on('click', '.page_block', function (){
				var $this = $(this),
					$dataSec = $this.parent(),
					$pageCont;
				if ($dataSec && $dataSec.hasClass('tab_data_section')){
					$pageCont = $('.page_content', $dataSec);
				} else {
					return;
				}
				if ($pageCont.is(':animated')) return;//针对正在进行动画的，则什么也不做，等动画完成之后
				if ($this.hasClass('closed')){//打开
					$pageCont.slideDown(300, function (){
						$pageCont.children().show();
						$this.removeClass('closed');
					});
				} else {//关闭
					$pageCont.children().hide();
					$pageCont.slideUp(300, function (){
						$this.addClass('closed');
					});
				}
			});
		}catch (e){printErr('page_block dealt', e);}
	})();
	/*
	 * 对页面中的toggle做的默认处理
	 */
	(function (){
		try {
			$('.toggle_panel').each(function () {
                var $this = $(this),
					isDefault = !$this.hasClass('right'),
					leftVal = $this.attr('data-left-value'),
					rightVal = $this.attr('data-right-value'),
					$btn = $('.toggle_btn', $this),
					$hidden = $('input:hidden', $this),
					$panel = $('.toggle_inner', $this),
					$left = $('.toggle_side.left', $this),
					$right = $('.toggle_side.right', $this),
					value = $('.toggle_hidden_input', $this).val() || 0,
					leftSideW = $this.width();
				leftVal = leftVal ? leftVal : 'on';
				rightVal = rightVal ?　rightVal : 'off';
				if ((!isDefault) || (value == rightVal)){
					$this.addClass('right');
					if ($hidden.length){
						 $hidden.val(rightVal);
					}
					$this.attr('value', rightVal);
					$left.hide();
					$right.show();
					leftSideW = $this.width();
					$btn.css({right : (leftSideW - $btn.width() - 2)});
				}
            });
			$(document).off('tuiToggleToLeft.tuiInit').on('tuiToggleToLeft.tuiInit', '.toggle_panel', function (){
				var $this = $(this),
					isAnother = $this.hasClass('right'),
					leftVal = $this.attr('data-left-value'),
					rightVal = $this.attr('data-right-value'),
					$btn = $('.toggle_btn', $this),
					$hidden = $('input:hidden', $this),
					$panel = $('.toggle_inner', $this),
					$left = $('.toggle_side.left', $this),
					$right = $('.toggle_side.right', $this),
					leftSideW;
				
				$left.hide().animate({opacity:0}, 0);
				$right.show().animate({opacity:1}, 300);
				leftSideW = $this.width();
				$panel.animate({left : -leftSideW}, 300, function (){
					$this.addClass('right');
				});
				$btn.animate({right : (leftSideW - $btn.width() - 2)}, 300);
				$this.attr('value', rightVal);
				$hidden.length ? $hidden.val(rightVal) : '';
			});
			$(document).off('tuiToggleToRight.tuiInit').on('tuiToggleToRight.tuiInit', '.toggle_panel', function (){
				var $this = $(this),
					isAnother = $this.hasClass('right'),
					leftVal = $this.attr('data-left-value'),
					rightVal = $this.attr('data-right-value'),
					$btn = $('.toggle_btn', $this),
					$hidden = $('input:hidden', $this),
					$panel = $('.toggle_inner', $this),
					$left = $('.toggle_side.left', $this),
					$right = $('.toggle_side.right', $this),
					leftSideW;
				
				$right.hide().animate({opacity:0}, 0);
				$left.show().animate({opacity:1}, 300);
				$panel.animate({left : 0}, 300, function (){
					$this.removeClass('right');
				});
				$btn.css('left', 'auto').animate({right : 0}, 300);
				$this.attr('value', leftVal);
				$hidden.length ? $hidden.val(leftVal) : '';
			});
			$(document).off('click.tuiInit', '.toggle_panel').on('click.tuiInit', '.toggle_panel', function (){
				var $this = $(this),
					isAnother = $this.hasClass('right');
				if (isAnother){//向右
					$this.trigger('tuiToggleToRight');
				} else {//向左
					$this.trigger('tuiToggleToLeft');
				}
			});
		} catch (e){printErr('toggle switch init', e);}
	})();
	(function (){
		try{
			tuiCancelBackspace();
		} catch (e){}
	})();
});