/*
 * tsDrag是GUI项目中的拖拽插件，该插件基于jquery开发，在jquery原始方法中添加拖拽功能。可以通过参数进行实时修改。
 * 该拖拽插件支持一般的拖拽和特殊拖拽，用于各类拖拽的情况。
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 1.0                     
 * @see                                                
 *	HISTORY                                            
 * 2012-4-13 创建文件
 * 2012-4-16 版本更新，添加了proxy参数，允许设定拖动的模式，如果为clone，则拖动clone的元素，如果为function，则拖动函数返回的jquery对象
 * 2012-4-20 修改了程序结构，由调用者的jquery对象保存参数，并可以根据参数实时对部分属性进行修改。
 * 2012-5-15 版本更新，将拖拽层在初始化中设置position的操作放置在鼠标按下事件中。添加了onFinshed回调函数
 * 2012-6-13 版本更新，修改了定位细节和点击未拖动时坐标错误的bug
 * 2012-9-21 版本更新,onBeforeDrag改名为onReadyDrag,tsDragMask改为tuiDragMask
 * 2012-9-26 版本更新,by 党会建，针对代理proxy的方式进行修改。默认情况clone,创建在当前元素的同级下，不再是body下。
                     加上proxy:{$appendTo:"body",cssText:{}}//允许传如创建的对象，和代理的样式
 * 2012-10-30 版本更新，修正了错误的事件命名空间。修改了事件的绑定方式。
 * 2013-01-25 版本更新，添加了解除绑定拖拽的方法。
 * 2013-07-23 版本更新，修正了proxy参数中回调函数的$drag上下文
 * 2013-10-10 1.0，删除$.browser方法
 *
 */
// JavaScript Document
;(function(){
	//取消绑定拖拽。
	$.fn.tuiOffDrag=function(){
		var $this=$(this);
		return $this.off('.tuiDrag').css({cursor:'default'});
	}
	$.fn.tuiDrag=function(){
		var _self=this;//调用者
		var _defaults = {//默认参数
			handle:null,//默认为null，如果为null，则代表拖动自己，如果不为空，则可以指定jQuery对象拖动
			cursor:"move",//移动时，鼠标的指针样式
			isFixed:false,//是否是fixed
			dragRange:'auto',//可拖拽的范围设置，如果为auto，则说明可拖拽的区域由系统默认的全屏范围来定，如果为其他值，则由dragableRangeX和dragableRangeY来确定。使用 dragableRangeX dragableRangeY，置成空吧
			dragableRangeX:[0,1000],//可拖拽的范围X值
			dragableRangeY:[0,1000],//可拖拽的方位y值
			onReadyDrag:null,//回调函数，是在开始拖拽之前的时候，执行的方法
			onStartDrag:null,//回调函数，点击开始拖拽的时候，执行的方法
			onDrop:null,//回调函数，当释放拖拽的时候，执行的方法，两个参数，finalX和finalY，分别为移动后的左上角坐标
			onDraging:null,//回调函数，执行拖拽时的方法，两个参数，finalX和finalY，分别为移动后的左上角坐标
			onFinshed:null,//回调函数，在所有拖拽事件完成后调用的方法，两个参数，finalX和finalY，分别为移动后左上角坐标
			zIndex:11005,//要拖拽的遮罩层的z-index
			proxy:null,//string,function类型，如果为'clone',则创建一个拖动元素的副本进行拖动，如果为function，则function必须要返回一个jquery对象来进行拖拽代理对象
			revert:false,//是否还原，如果为true，则在鼠标松开的时候，返回之前拖动的位置
			revertTime:300,//如果revert=true,则会出现一个过渡的移动动画
			disabled:false//是否可以拖拽，如果为true，则不可拖拽
		};
		var isIE=$.tui.isIE; //IE浏览器
		var isIE6=$.tui.isIE6;//是否是IE6
		//判断参数类型,可以进行修改-------------------------------------------------------------
		//在拖拽过程中进行修改使用（,,）传递
		if(arguments.length>=1&&typeof(arguments[0])==='string'&&this.length==1){//如果该方法参数是修改，则进行修改
			if(arguments.length==2){//修改参数
				var value=arguments[1];//修改的值
				var label=arguments[0];
				var dragOption=this.data('dragOption');
				switch(label){
					case 'dragableRangeX':
						if(!dragOption) return;
						var minDragableX=value[0]||0;
						var maxDragableX=value[1]||0;
						maxDragableX=(maxDragableX>=minDragableX)?maxDragableX:minDragableX;
						dragOption.dragableRangeX=[minDragableX,maxDragableX];
						dragOption.dragRange='default';
						$(this).data('dragOption',dragOption);
						return this;
					case 'dragableRangeY':
						if(!dragOption) return;
						var minDragableY=value[0]||0;
						var maxDragableY=value[1]||0;
						maxDragableY=(maxDragableY>=minDragableY)?maxDragableY:minDragableY;
						dragOption.dragableRangeY=[minDragableY,maxDragableY];
						dragOption.dragRange='default';
						$(this).data('dragOption',dragOption);
						return this;
					case 'dragRange':
						if(!dragOption) return;
						if(value=='auto'){
							dragOption.dragRange='auto';
							$(this).data('dragOption',dragOption);
							return this;
						}
						return this;
					case 'disabled':
						if(!dragOption) return;
						var $handle=(dragOption.handle instanceof jQuery)?dragOption.handle:$(dragOption.handle);//如果handle不是jquery对象，则尝试创建jquery对象
						if(value){//关闭拖拽
							$handle.css({cursor:'auto'});
							dragOption.disabled=true;
							$(this).data('dragOption',dragOption);
						}else{
							$handle.css({cursor:dragOption.cursor});
							dragOption.disabled=false;
							$(this).data('dragOption',dragOption);
						}
						return this;
					case 'revert':
						if(!dragOption) return;
						var dragOption=this.data('dragOption');
						dragOption.revert=value;
						$(this).data('dragOption',dragOption);
						return this;
				}
			}
		}
		//----------------------------------------------------------
		var dragOption = $.extend({},_defaults);
		for(var i=0;i<arguments.length;i++){//读取多个参数
			dragOption=$.extend(dragOption,arguments[i]);
		}
		this.data('dragOption',dragOption);//将配置参数放置在
		return this.each(function(){
			var $drag=$(this);//要拖动的对象
			var $handle;//要拖动对象的载体
			var source={};//用于记录在鼠标拖动之前鼠标的位置，用于在拖动过程中，得到鼠标移动的位移差，从而使窗口移动，这个方法避免了无法获得鼠标距离窗口的相对距离
			var $dragMask;//用于拖拽的遮罩层对象
			var minDragableX;//拖拽的边界横向最小值
			var minDragableY;//拖拽的边界增项最小值
			var maxDragableX;//拖拽的边界横向最大值
			var maxDragableY;//拖拽的边界增项最大值
			var finalX=0;//移动后的最终x坐标
			var finalY=0;//移动后的最终y坐标
			
			var $proxyDrag;//要拖拽的代理拖拽容器
			
			if(dragOption.handle==null){//默认为本身拖拽
				$handle=$drag;
			}else{
				$handle=(dragOption.handle instanceof jQuery)?dragOption.handle:$(dragOption.handle);//如果handle不是jquery对象，则尝试创建jquery对象
			}
			var $doc=$(document);
				
			$handle.off('mousedown.tuiDrag').on('mousedown.tuiDrag',function(event){
				event.stopPropagation();
				dragOption=$drag.data('dragOption');
				var disabled=dragOption.disabled;
				if(disabled){return;}//如果不能拖拽，那么直接
				moveReady(event);//拖动的准备
				if(typeof(dragOption.onStartDrag)==='function'){//执行回调函数
					dragOption.onStartDrag.call($drag);
				}
			});
			dragOption.disabled?'':$handle.css({cursor:dragOption.cursor});//如果可以拖拽，则修改鼠标图标
			//准备拖动函数
			function moveReady(event){
				//计算拖拽范围
				if(typeof(dragOption.onReadyDrag)==='function'){//执行回调函数
					dragOption.onReadyDrag.call($drag,event);
				}
				if($drag.css('position')!='fixed'&&$drag.css('position')!='absolute'&&$drag.css('position')!='relative'){//如果这个容器不是fixed或者absolute，则需要置成absolute才能移动
					$drag.css({position:'absolute'});
				}
				dragOption=$drag.data('dragOption');
				if(dragOption.dragRange=='auto'){//如果拖拽的范围是自动的
					if($drag.css('position')=='fixed'){//fixed的边界和absolute的边界不同,这是一般情况下的fixed
						maxDragableX=$(window).width()-$drag.width()-4;//可拖拽的右边界,左边界为0
						maxDragableY=$(window).height()-$drag.height()-4;//可拖拽的下边界，上边界为0
					}else if(dragOption.isFixed&&isIE6){
						maxDragableX=$(window).width()+$(document).scrollLeft()-$drag.width()-4;//可拖拽的右边界,算上滚动条的位置,左边界为0
						maxDragableY=$(window).height()+$(document).scrollTop()-$drag.height()-4;//可拖拽的下边界，算上滚动条的位置，上边界为0
					}else{
						maxDragableX=$(document).width()-$drag.width();//可拖拽的右边界,左边界为0
						maxDragableY=$(document).height()-$drag.height();//可拖拽的下边界，上边界为0
					}
					minDragableX=0;
					minDragableY=0;
				}else{//如果拖动的范围是指定的
					minDragableX=dragOption.dragableRangeX[0]||0;
					minDragableY=dragOption.dragableRangeY[0]||0;
					maxDragableX=dragOption.dragableRangeX[1]||0;
					maxDragableY=dragOption.dragableRangeY[1]||0;
					maxDragableX=(maxDragableX>=minDragableX)?maxDragableX:minDragableX;
					maxDragableY=(maxDragableY>=minDragableY)?maxDragableY:minDragableY;
				}
				
				//alert(minDragableX)
				event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue
				//if($drag.css('position')=='fixed'){alert($(document).scrollTop())}
				source.ox=event.pageX;
				source.oy=event.pageY;
				//拖动准备函数，在鼠标按下时，做拖动的准备
				source.dragTop=parseInt($drag.position().top);//记录下需要移动的窗口的原始top
				source.dragLeft=parseInt($drag.position().left);//记录下需要移动的窗口的原始left
				finalX=source.dragLeft;
				finalY=source.dragTop;
				//首先将初始的位置设置好，避免造成在用户点击之后没有拖动就释放了。这样目标会移动到0,0位置。因此要避免这个问题
				if($('#tuiDragMask').length<1){//如果没有遮罩层
					var dragMaskHTML='<div id="tuiDragMask" style="position:absolute;z-index:'+dragOption.zIndex+';top:0px;left:0px;"><div>';//为防止在拖拽的时候，鼠标移动到iframe中，因此在最上层添加一层mask，用于拖拽
					$dragMask=$(dragMaskHTML).appendTo('body');
				}else{
					$dragMask=$('#tuiDragMask');
				}
				$dragMask.css({width:$(document).width()+'px',height:$(document).height()+'px',cursor:dragOption.cursor});
				$dragMask.show();//显示遮罩层，由于可能是已经存在并且隐藏了。
				//$('body').append('<div style="position:absolute;width:1000px;height:500px;top:0px;left:0px;z-index:11001;border:1px solid blue;"></div>')
				//对拖拽的代理进行设定
				if(typeof(dragOption.proxy)==='function'){//通过自定函数创建代理拖拽容器
					$proxyDrag=dragOption.proxy.call($drag);
					if(!($proxyDrag instanceof jQuery)){
						window.console&&console.warn("proxy is a function but not return a jquery instance");
						return false;
					}
					if($proxyDrag.css('position')!='fixed'&&$proxyDrag.css('position')!='absolute'&&$proxyDrag.css('position')!='relative'){//如果这个容器不是fixed或者absolute，则需要置成absolute才能移动
						$proxyDrag.css({position:'absolute'});
					}
					var pX=$drag.offset().left;
					var pY=$drag.offset().top;
					$proxyDrag.css({//将代理拖拽容器的坐标设定为当前的坐标
						left:pX+'px',
						top:pY+'px'
					});
				}else if(dragOption.proxy==='clone'){
					$proxyDrag=$drag.clone();
					$proxyDrag.appendTo($drag.parent());//默认创建在同级
				}else if(dragOption.proxy&&typeof(dragOption.proxy)==='object'){
					var $appendTo=dragOption.proxy["$appendTo"];
					$proxyDrag=$drag.clone();
					$proxyDrag.appendTo($appendTo);
					$proxyDrag.css(dragOption.proxy["cssText"]);
					//更改位置的值
					var $dragParentOffset=$drag.parent().offset();
					var topDiff=$appendTo.offset().top-$dragParentOffset.top;
					var leftDiff=$appendTo.offset().left-$dragParentOffset.left;
					source.dragTop=parseInt($drag.position().top-topDiff);//记录下需要移动的窗口的原始top
				    source.dragLeft=parseInt($drag.position().left-leftDiff);//记录下需要移动的窗口的原始left
					finalX=source.dragLeft;
					finalY=source.dragTop;
					$proxyDrag.css({//设定位置
						left:finalX+'px',
						top:finalY+'px'
					});
				}else {
					$proxyDrag=$drag;
				}
				$doc.off('mousemove.tuiDrag').on('mousemove.tuiDrag',moveLayer);//鼠标移动时的事件
				$doc.off('mouseup.tuiDrag').on('mouseup.tuiDrag',moveUp);//鼠标抬起时的事件
			}
			//移动函数
			function moveLayer(event){
				dragOption=$drag.data('dragOption');
				event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue
				if($proxyDrag.css('position')=='fixed'){//如果是fixed，则需要将滚动条的位置去掉
					finalX=(event.pageX-$(document).scrollLeft()-source.ox)+source.dragLeft;
					finalY=(event.pageY-$(document).scrollTop()-source.oy)+source.dragTop;
				}else{//其他情况
					finalX=(event.pageX-source.ox)+source.dragLeft;
					finalY=(event.pageY-source.oy)+source.dragTop;
				}
				//判断移动是否出界了
				finalX=(finalX<minDragableX?minDragableX:finalX);
				finalX=(finalX>maxDragableX?maxDragableX:finalX);
				finalY=(finalY<minDragableY?minDragableY:finalY);
				finalY=(finalY>maxDragableY?maxDragableY:finalY);
				$proxyDrag.css({//设定位置
					left:finalX+'px',
					top:finalY+'px'
				});
				//$('#info').html(maxDragableX)
				if(typeof(dragOption.onDraging)==='function'){//执行回调函数
					dragOption.onDraging.call($proxyDrag,finalX,finalY,event);
				}
			}
			//移动结束
			function moveUp(event){
				if(typeof(dragOption.onDrop)==='function'){//执行回调函数
					dragOption.onDrop.call($proxyDrag,finalX,finalY);
				}
				dragOption=$drag.data('dragOption');
				$dragMask.remove();//清空拖拽的遮罩层
				if(dragOption.revert){
					$proxyDrag.animate({
						top:source.dragTop,//记录下需要移动的窗口的原始top
						left:source.dragLeft
					},dragOption.revertTime);
				}else{
					$proxyDrag.css({
						left:finalX+'px',
						top:finalY+'px'
					});
				}
				if($drag==$proxyDrag){}
				else{
					$proxyDrag.animate({left:0},0,function(){$(this).remove()});//在移动后销毁该对象
				}
				$doc.off('mousemove.tuiDrag',moveLayer).off('mouseup.tuiDrag',moveUp);//解除绑定
				if(typeof(dragOption.onFinshed)==='function'){//执行拖拽结束的回调函数
					dragOption.onFinshed.call($proxyDrag,finalX,finalY,event);
				}
			}
		});
	};
})($);