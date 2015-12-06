/*
 功能描述:自定义滚动条
 思路：先把滚动条隐去，使用scroll top模拟真正的滚动条
 *@Copyright: Copyright (c) 2012
 *@Company: 中国民航信息网络股份有限公司
 *@author:  党会建  
 *@version 0.1 2012/9/10
 *@version 0.9 2012/9/29,完成基本功能
 */
;(function($){
	$.fn.extend({
		tuiScrollbar:function(option){
			if (!this.length) {//this只传递进来的那个form对象
		    	window.console&&console.warn( "nothing selected, can't scroll, returning nothing" );
				return false;
			}
			var _defaults={//创建新的tab页
	        	scrollContentId:"",//滚动的范围
				activeClass:"",//滚动条active状态的class
				isHorizontal:false,//不是横向滚，默认是纵向滚
				onScrolling:null,//滚动过程的方法
				scrollSpeed:30,
				isOnlyResizeEvent:false//resize时重置滚动条
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var onScrolling=settings.onScrolling;
			var scrollSpeed=settings.scrollSpeed;
			var scrollBar=this[0];
			var $scrollBar=$(scrollBar);
			var lastAppDistance=40;//最后一个app需要多滚动距离,保证都露出了
			var scrollBarMinHeight=42;
			var activeClass=settings.activeClass;
			var $scrollContent=$("#"+settings.scrollContentId);
			var contentHeight=$scrollContent.height();
			var contentRealHeight=$scrollContent.get(0).scrollHeight;
			if(contentRealHeight<=contentHeight){
				$scrollBar.hide();
				return false;
			}else {$scrollBar.show();}
			var scrollBarHeight=contentHeight*(contentHeight/contentRealHeight);
			scrollBarHeight=scrollBarHeight>scrollBarMinHeight?scrollBarHeight:scrollBarMinHeight;
			if(settings.isOnlyResizeEvent){
				$scrollBar.height(scrollBarHeight);
				$scrollContent.scrollTop(0);
				$scrollBar.css({top:0});
				return false;
			}
			$scrollBar.height(scrollBarHeight);
			var scrollMoveHeight=contentHeight-scrollBarHeight;
			var contentMoveHeight=contentRealHeight-contentHeight;
			var heightRate=contentMoveHeight/scrollMoveHeight;
			
			//拖拽过程的函数
			/*finalY和scrolltop的关系：finalY是滚动条的位移，需要保证，滚动条到底部后，需要滚动的内容也到底部
	         */
			 //鼠标滚动时
			var scrolling=function(finalX,finalY,scrollDistance,event){
				if(onScrolling&&typeof onScrolling==="function"){
					onScrolling.call($scrollBar,finalX,finalY,scrollDistance,event);
				}else {return false}
			};	
			var draging=function(finalX,finalY,event){
				var scrollDistance=finalY*heightRate;
				if(finalY>=scrollMoveHeight){
					scrollDistance=contentMoveHeight+lastAppDistance;
				}
				$scrollContent.scrollTop(scrollDistance);
				scrolling(finalX,finalY,scrollDistance,event);
			};
			//鼠标按下，更改样式
			var dragReady=function(){
				$scrollBar.addClass(activeClass);
			};
			//鼠标抬起，更改样式
			var dragFinshed=function(){
				$scrollBar.removeClass(activeClass);
			};
			//绑定拖拽开始
			if(typeof $scrollBar.tuiDrag==="function"){
				$scrollBar.tuiDrag({cursor:"point",dragRange:'',dragableRangeX:[0,0],dragableRangeY:[0,scrollMoveHeight],onDraging:draging,onReadyDrag:dragReady,onFinshed:dragFinshed});
			}
		    //绑定拖拽结束
			/*********支持鼠标滚轮开始************/
			var scrollFunc=function(){
				var scrollRange=0;
				//初始化坐标，如果不初始化，刷新等操作，仍然保持原来的scrollTop的值
				$scrollContent.scrollTop(0);
				$scrollBar.css({top:0});
				var speedChromeRate=120/scrollSpeed;
				var speedFireFoxRate=scrollSpeed/15;
				return function(event){
					//ie7 8的event是在window.event下
		            event=event?event:window.event;
					event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue    
					if(event.wheelDelta){//IE/Opera/Chrome,滚轮方向与firefox是反的，向下是负值。每滚动一次是120
 						var delta=(-event.wheelDelta)/speedChromeRate;
        				scrollRange+=delta;
     				}else if(event.detail){//Firefox，每滚动一次是15
						 /**Mozilla,detail是3的倍数*/
         				scrollRange+=event.detail*speedFireFoxRate;
     				}
					scrollRange=Math.floor(scrollRange);
					scrollRange=scrollRange<0?0:scrollRange;
					scrollRange=scrollRange>scrollMoveHeight?scrollMoveHeight:scrollRange;
					$scrollBar.css({top:scrollRange});
					if(scrollRange<scrollMoveHeight){
						$scrollContent.scrollTop(scrollRange*heightRate);
					}else {
						$scrollContent.scrollTop(contentMoveHeight+lastAppDistance);
					}
					scrolling(null,scrollRange,null,event);
				}//retrun结束
			};
			/*注册事件开始*/
			if($scrollContent.get(0).addEventListener){
   		 		$scrollContent.get(0).addEventListener('DOMMouseScroll',scrollFunc(),false);
			}//W3C
			$scrollContent.get(0).onmousewheel=scrollFunc();//IE/Opera/Chrome
			/*注册事件结束*/
			/*********支持鼠标滚轮结束************/
		}//tuiDesktopInit结束
		
	});//fn.extend结束
})(jQuery);