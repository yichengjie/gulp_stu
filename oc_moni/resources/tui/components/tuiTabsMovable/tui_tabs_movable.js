/**
 * tuiTabsMovable是用于处理表格上方tab页过多造成的页面溢出的方法。
 * 该方法包含对页签的zIndex排序，简单的点击事件，计算left值等。
 * Copyright: Copyright (c) 2013                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.9.1                  
 * @see                                                
 *	HISTORY 
 * 2013-05-22 创建文件                       
 */
;(function($){
	$.fn.tuiTabsMovable=function(){
		//参数准备
		var $this=$(this),
			$ul=$this,
			$lis=$('.tab_item,.tab_item_select',$ul),
			$tempCurLi=$('.tab_item_select',$ul).eq(0);
		//接口
		//自动计算zindex，$this为当前的选中的那个li，$totalLis是全部的li，highZ是允许的最大的zindex，一般是count
		var autoCal=function($this,$totalLi,highZ){
			var flag=false,
				zIndex=1,
				$ptLi;
			//重新计算z-index
			$this.css({zIndex:highZ});//选中的最高
			for(var i=0;i<highZ;i++){
				$ptLi=$totalLi.eq(i);
				if($this.get(0)===$ptLi.get(0)){
					flag=true;
					zIndex=highZ;
				}
				$ptLi.css({zIndex:zIndex});
				if(!flag){
					zIndex++;
				}else{
					zIndex--;
				}
			}
		}
		//自动计算位置，参数为全部的li
		var autoPosition=function($lis){
			var left=0,
				$curLi,//循环体li引用
				count=$lis.length,
				i;//计数
			for(i=0;i<count;i++){
				$curLi=$lis.eq(i);
				$curLi.css({left:left});
				left+=$curLi.width()-10;
			}
		}
		//计算移动位置,$cur为需要移动到位置的第一个li。
		var move=function($cur,$lis,$ul){
			var $lastLi=$lis.eq($lis.length-1),
				tWidth=($lastLi.css('left').replace('px','')-0)+$lastLi.width(),
				curLeft=$cur.length?$cur.css('left').replace('px','')-0:0,
				ulWidth=$ul.width(),
				moveto=0,
				rightBtn=$('.tui_move_btn_right',$ul.parent()),
				leftBtn=$('.tui_move_btn_left',$ul.parent());
			if($ul.is(':animated'))return;
			if(curLeft+ulWidth>tWidth){//移动到最后的几个了，不能再往右移动了
				if(tWidth<ulWidth){//本身选项就很少的情况，就不能移动了
					moveto=0;
				}else{
					moveto=tWidth-ulWidth;
					rightBtn.addClass('disable');
				}
			}else{
				moveto=curLeft;
				rightBtn.removeClass('disable');
			}
			if(moveto==0){//移动到最左边了，左侧的按钮不能响应
				leftBtn.addClass('disable');
			}else{//否则左边的按钮响应
				leftBtn.removeClass('disable');
			}
			$ul.stop().animate({left:-(moveto)},300);
		}
		//向前移
		var prev=function($lis,$ul){
			var offsetLeft=Math.abs($ul.css('left').replace('px','')-0),
				$curLi=$lis.eq(0);
			for(var i=0;$curLi.length&&i<count;i++){
				if(($curLi.css('left').replace('px','')-0)<offsetLeft){
					$curLi=$curLi.next();
				}else{
					break;
				}
			}
			$curLi=$curLi.prev();
			move($curLi,$lis,$ul);
		}
		//向后移
		var next=function($lis,$ul){
			var offsetLeft=Math.abs($ul.css('left').replace('px','')-0),
				$curLi=$lis.eq(0),
				count=$lis.length;
			for(var i=0;$curLi.length&&i<count;i++){
				if(($curLi.css('left').replace('px','')-0)<offsetLeft){
					$curLi=$curLi.next();
				}else{
					break;
				}
			}
			$curLi=$curLi.next();
			move($curLi,$lis,$ul);
		}
		//主程序
		autoCal($tempCurLi,$lis,$lis.length);//计算index值
		autoPosition($lis);//计算tab页的位置
		//绑定事件
		$lis.off('click.tuiTabsMovable').on('click.tuiTabsMovable',function(){
			var $this=$(this),
				$lis=$this.siblings().add($this),
				count=$lis.length;
			$lis.filter('.tab_item_select').removeClass('tab_item_select').addClass('tab_item');
			$this.addClass('tab_item_select');
			autoCal($this,$lis,count);
		});
		//---------------------------------------------------------
		//处理因为li过多出现的滚动条
		var count=$lis.length,
			$lastLi=$lis.eq(count-1);
		$ul.removeClass('tui_tab_item_extra');//如果之前曾经有很多li，但是再次执行该方法时，没有那么多li了，就需要把这个class删掉
		//li过多的判断条件
		if($ul.width()<(($lastLi.css('left').replace('px','')-0)+$lastLi.width())){
			$ul.wrap('<div class="tui_tabs_movable"></div>').addClass('tui_tab_item_extra');
			var $leftBtn=$('<div class="tui_move_btn_left"></div>').insertAfter($ul),
				$rightBtn=$('<div class="tui_move_btn_right"></div>').insertAfter($ul);
			move($tempCurLi,$lis,$ul);//初始化时移动的位置
			$leftBtn.off('click.tuiTabsMovable').on('click.tuiTabsMovable',function(){
				prev($lis,$ul);
			});
			$rightBtn.off('click.tuiTabsMovable').on('click.tuiTabsMovable',function(){
				next($lis,$ul);
			});
		}else{//尝试清理外部的内容。
			var $outer=$ul.parent();
			if($outer.hasClass('tui_tabs_movable')){
				$ul=$ul.css({left:0}).clone(true);//如果之前是被处理的move，需要还原
				$outer.after($ul).remove();
			}
		}
		
		
	}
})(jQuery)