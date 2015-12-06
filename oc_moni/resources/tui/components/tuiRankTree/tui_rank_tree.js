/*
 * tuiRankTree是页面中的一个样式辅助js组件，该组件用于协助页面CSS实现页面横向多叉树的视觉效果。
 * Copyright: Copyright (c) 2013                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.9.2             
 * @see                                                
 *	HISTORY                                            
 * 2013-8-27下午02:02:08 创建文件
 * 2013-9-23 版本更新，修正了二次执行该方法时没有去掉last属性的bug
 */
;(function ($, window){
	$.fn.tuiRankTree = function (){
		var _defaults = {//默认参数
			marginTop:0,//level的margin-top
			marginBottom:10,//level的margin-bottom
			marginLeft:7,//node的margin-left
			marginRight:7,//node的margin-right
			resetTop:-14//每个node相对于线来说的上偏移
		};
		//参数准备
		var settings = $.extend({}, _defaults);
		for (var i = 0; i < arguments.length; i++){
			settings = $.extend(settings, arguments[i]);
		}
		//内部方法----------------------------------------------
		/*
		 * 递归函数体，用于将当前一个node节点的高度计算出来，并且递归子节点的高度
		 * 注意，该方法只适用于每个level中含有一个节点node的情况
		 * 添加last
		 * 设置每一个节点的宽度
		 */
		var resetLevel = function (_$level){
			var $level = _$level,
				$node = $level.removeClass('last').children('.node');
				
			if ((!$level.length) || (!$node.length)){
				return 0;
			}
			//参数准备
			var nodeHeight = $node.height(),
				levelHeight = nodeHeight;
				
			var $childLevel = $level.children('.level'),
				childLength = $childLevel.length;
			if (childLength != 0){//如果存在子节点
				levelHeight = 0;
				for (var i = 0; i < childLength; i++){
					levelHeight += resetLevel($childLevel.eq(i));
				}
			}
			levelHeight += settings.marginBottom + settings.marginTop;
			$level.css({
				height:levelHeight
			});
			//为了显示需要，要将每一个level的最后一个子level添加一个last
			$childLevel.eq(childLength - 1).addClass('last');
			//设置该level中的node的宽度
			resetNodeWidth($level);
			//针对IE7下margin-top无效的问题
			if ($.tui.isIE7()){
				$node.after('<div></div>');
			}
			return levelHeight;
		}
		/*
		 * 设置每一个节点的位置，包括marginleft和top
		 * 针对第一个节点，不需要设置marginLeft
		 */
		var resetNode = function (_$level){
			var $level = _$level,
				$node = $('.node', $level);
				
			$node.each(function (){
				var $node = $(this);
				if ($node.hasClass('n1')){//逻辑，针对第一个节点，不需要设置margin-left
					$node.css({
						marginTop:settings.resetTop
					});
				} else {
					$node.css({
						marginTop:settings.resetTop,
						marginLeft:settings.marginLeft
					});
				}
			});
		};
		/*
		 * 设置节点的宽度。针对参数，设置节点需要多宽，参数一attr:width设定，可以为数字，auto。如果不写参数，则默认为auto
		 * 规则：针对非叶子节点，宽度是margin的宽度。叶子节点宽度是最后的宽度。
		 */
		var resetNodeWidth = function (_$level){
			var $level = _$level,
				$node = $level.children('.node'),
				$childLevel = $level.children('.level'),
				isLeaf = ($childLevel.length == 0),
				width = $node.attr('width');
				
			var _w;
			if (width){
				_w = parseInt(width);
				if (isLeaf){ // 如果是叶子节点，则需要将后面的线条隐藏起来
					$level.css({
						width:_w + settings.marginLeft - 2
					});
				}
			} else if (isLeaf){
				_w = $level.width() - settings.marginLeft ;
			} else {
				_w = parseInt($childLevel.eq(0).css('margin-left')) - (settings.marginLeft + settings.marginRight);
			}
			_w -= 2;
			$node.css({width:_w});
		};
		//内部方法结束------------------
		//主方法
		var $this = $(this);
		$('.l1', $this).each(function (){
			var $this = $(this);
			resetLevel($this);
			resetNode($this);
		});
		//resetLevel($('.l1', $this));
		//resetNode($('.l1', $this));
		return $this;
	};
	
})($, window);