// JavaScript Document
/*
 * tuiTabDrag是GUI项目中的仅仅针对navTabs的拖拽插件，该插件基于jquery开发，在jquery原始方法中添加功能。可以通过参数进行实时修改。
   拖拽过程中，需要进行分屏比较，需要引入分屏比较的js。tui_tabDivide.js
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  hjdang@travelsky.com 党会建                 
 * @version 0.1BETA 2012-5-16 
   @version 1.2  2012-12-26开始大规模测试      
   @version 1.5  2013-2-22 测试过程修改    
   @version 1.5.1  2013-2-22 格式修改
   @version 1.5.3  2013-3-4 解决一个遗留bug,上下分屏后，辅助屏上最左侧的第2tab和第1个无法交换
 * @see                                                
 *	HISTORY                                            
 * 2012-5-16 创建文件
 */
 ;(function( $, undefined ) {
	$.tui = $.tui || {}; 
	$.fn.extend({
		tuiTabsDrag:function(){
		    var _defaults = {//默认参数
			  cursor:"default",//移动时，鼠标的指针样式
			  disabled:false,//如果为true，则不可使用
			  tabWidth:134,//tab的宽度,因为彼此有遮盖实际的宽度小
			  maskZIndex:10000,
			  dragZIndex:1100,//拖动过程中的zindex
			  tabRightOffset:147,//右侧留得偏移量，放置增加 等其他按钮用
			  dragCloneZIndex:11005,//拖动过程中的zindex
			  dragBeforeZIndex:2,//原始的zindex
			  headerHeight:30,//鼠标下移多少，tab页面不变
			  triggerDivideMin:450,//触动分屏的最小高度
			  dropDownContainer:"",//dropDown的容器，从外面传入
			  title:""
		     };
			var settings=$.extend({},_defaults);//读取默认参数参数
			for(var i=0;i<arguments.length;i++){//读取多个参数
			 settings=$.extend(settings,arguments[i]);
		    }
			var isIE6=$.tui.isIE6();//是否是IE6
			var $drag=$(this);//拖动的要放下对象，在鼠标按下的时候绑定事件
			var $doc=$(document), $win=$(window),winWidth=$win.width();
			var dragZIndex=settings.dragZIndex, tabWidth=settings.tabWidth, tabWidthMiddle=tabWidth/2;
			var tabRightOffset=settings.tabRightOffset,headerHeight=settings.headerHeight, tabDivideHeight=headerHeight+10;
			var title=settings.title,moveDiffX =0,moveDiffY =0,tabOffset={};//tab的位移
			var source={};//用于记录在鼠标拖动之前鼠标的位置，用于在拖动过程中，得到鼠标移动的位移差，从而使窗口移动，这个方法避免了无法获得鼠标距离窗口的相对距离
			var $dragMask=null;//用于拖拽的遮罩层对象
			var minDragableX=0;//拖拽的边界横向最小值
			var minDragableY=0;//拖拽的边界增项最小值
			var maxDragableX=1000;//拖拽的边界横向最大值
			var maxDragableY=1000;//拖拽的边界增项最大值
			var finalX=0;//移动后的最终x坐标
			var finalY=0;//移动后的最终y坐标
			var lastMouseX=0;//分屏后鼠标的位置点
			var lastMouseY=0;//分屏后鼠标的位置点
			var tuiTabDragMaskid="tui_tab_drag_mask";
			var tabDivideDragLeftDiff=0;//初始是与上面tab的差值，因为drag是放到body上了
			var tabDivideDragTopDiff=0;//2012-12-18修改,与上面一样存储差值
			var mouseDiffLeft=0;//鼠标按下时离拖拽左侧的距离
			var mouseDiffTop=0;//鼠标按下时离拖拽左侧的距离
		    var $dragNext=null;//拖动的下一个元素
		    var $dragPrev=null;//拖动的上一个元素
			var isTabInterchange=false;//tab左右交互的条件
			var isTB=false;//是否上下分屏
			var isInList=true;//drag是否在tabList中
			var $tabDivideDrag=null;//拖拽后分屏的那个drag
			if(settings.disabled){ return;}//如果不能拖拽则直接返回
			$drag.off('.tuiTabDrag').on('mousedown.tuiTabDrag',function(event){
			    dragReady(event);
				 //计算各个在页面上显示的tab的位置
			  });//绑定事件结束
		  //内部方法开始***************/
		  //查找当前拖动元素的下一个，如果就自己一个则返回null,从window.tabList中找
			var findNextItem=function($item,isFindPrev){//isFindprev是否找他的
				var itemIndex=window.tabsList.findData($item.get(0).id);
			  	var nextIndex;
			  	if(itemIndex==-1){//没有找到索引
				  	return null;
				}
				if(itemIndex<window.tabsList.count-1){
					  nextIndex=itemIndex+1;
					  return $("#"+window.tabsList.get(nextIndex).data);
				}else if(isFindPrev&&itemIndex>0){//如果自己是最后一个则返回他的上个.isFindprev是否找他的上一个
					  nextIndex=itemIndex-1;
					  return $("#"+window.tabsList.get(nextIndex).data);
				}else return null;
			};
			//是否显示
			var isDisplay=function($item){
				if($item.css("display")=="none"){
					return false;
				}
				return true;
			};
			//查找本元素前面有多少隐藏的元素，计算本元素的left用
		    var getNotDisplayBeforeCount=function(index){//index本元素在tabList的位置,hiddrenIndex把这个隐藏的index计算上去，因为tabToMain情况下，tab是隐藏的。如果他在index前面，需要加上这个
			    var count=0;
				for(var i=0;i<index;i++){
					if(!isDisplay($("#"+window.tabsList.get(i).data))){
						count++;
					  }else break;
					}
				return count;
			};
			/*2013-2-22dropdown的位置最后由 tuiTabsShowDropDown计算，不在跟着移动了
	    	var moveDropDown=function($current){
			//移动dropdwon下拉开始
				var $next=findNextItem($current,false);
				if($next){
				   $("#"+$next.data("dropDownId")).before($("#"+$current.data("dropDownId")));
				}else if($next==null){//最后一个
				   $("#tabs_dropdown_list").append($("#"+$current.data("dropDownId")));
				}
				//移动dropdwon下拉结束
			};
			*/
			//重新设置交换完为止的值
		   var setInterchangeValue=function($dragItem){
			    var dragId=$dragItem.get(0).id;
		        var dragNode=window.tabsList.findNodeByData(dragId);
				if(dragNode==null){
					isInList=false;
				}else {isInList=true;}
				if(dragNode&&dragNode.next){//分屏后，独立的tab会从list中删除
				  $dragNext=$("#"+dragNode.next.data);
				}else {$dragNext=null;}
				if(dragNode&&dragNode.prev){
			       $dragPrev=$("#"+dragNode.prev.data);
				}else {$dragPrev=null;}
				if($dragNext&&$dragNext.get(0)){
				   tabOffset.nextCenter=$dragNext.offset().left+tabWidthMiddle;
				}
				if($dragPrev&&$dragPrev.get(0)){
				    tabOffset.prevCenter=$dragPrev.offset().left+tabWidthMiddle;
				}
		   };	
		   var initValue=function(event){//初始化参数
		        setInterchangeValue($drag);
				//$dragPrev=$drag.prev();
				$drag.css({'z-index':dragZIndex});
				//离开tab交换需要变得样式开始
				if($("#tab_divide_drag").length>0){
				   $("#tab_divide_drag").hide();
				   $tabDivideDrag=$("#tab_divide_drag");
				 }else {
		            var dragHtml='<div class="tab_divide_drag" id="tab_divide_drag">\
                                     <div class="content">'+title+'</div>\
                                  </div>';
				    //$drag.parent().append(dragHtml);//2012-12-18修改，提示改完在body上
					//需要把初始化的left的值加上
					var $dragOffset=$drag.offset();
					var $dragPosition=$drag.position();
					tabDivideDragLeftDiff=$dragOffset.left-$dragPosition.left;//2012-12-18修改
					tabDivideDragTopDiff=$dragOffset.top-$dragPosition.top;//2012-12-18修改
					$("body").append(dragHtml);//2012-12-18修改
					$tabDivideDrag=$("#tab_divide_drag");
				    $tabDivideDrag.hide();
				 }//结束
				var dragOffset=$drag.offset(),dragLeft=dragOffset.left;
				tabOffset.currentRight=dragLeft+tabWidth,tabOffset.currentLeft=dragLeft;
				mouseDiffLeft= event.pageX-dragLeft;//鼠标离左侧的距离
				mouseDiffTop=event.pageY-dragOffset.top;
				//拖动准备函数，在鼠标按下时，做拖动的准备
				source.dragTop=parseInt($drag.css("top"));//记录下需要移动的窗口的原始top
				source.dragLeft=parseInt($drag.css("left"));//记录下需要移动的窗口的原始left
			};
			//内部方法结束***************/
			function dragReady(event){//其他的mouseover和mouseup的方法绑在这个方法的最后。当鼠标按下对象时就执行这个方法
				//$drag.css({cursor:settings.cursor});
				source.ox=event.pageX,source.oy=event.pageY;
				winWidth=$win.width(),winHeight=$win.height(),minDragableX=0, minDragableY=0,isTB=$doc.data("isTB");
				if(isTB){
					tabRightOffset=0;
					minDragableY=-winHeight/2;
					minDragableX=-196;
		        }
			    if($doc.data("isLR")){
					minDragableX=-winWidth/2;
		        }
				maxDragableX=winWidth-tabRightOffset-tabWidth;//可拖拽的右边界,左边界为0
			    maxDragableY=$doc.height()-$drag.height()-4;//可拖拽的下边界，上边界为0
				event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡
				event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue
				initValue(event);//初始化参数
				if($('#'+tuiTabDragMaskid).length<1){//如果没有遮罩层,鼠标可以移开到其他地方
				   var dragMaskHTML='<div id="'+tuiTabDragMaskid+'" class="tui_tab_drag_mask"></div>';//为防止在拖拽的时候，鼠标移动到iframe中，因此在最上层添加一层mask，用于拖拽
				   $dragMask=$(dragMaskHTML).appendTo('body');
				}else{
					$dragMask=$('#'+tuiTabDragMaskid);	
				}
				$dragMask.css({width:$doc.width()+'px',height:$doc.height()+'px'});
				$dragMask.show();//显示遮罩层，由于可能是已经存在并且隐藏了。
				$doc.on('mousemove.tuiTabDrag',dragMove);
			    $doc.on('mouseup.tuiTabDrag',dragUp);//drag方法里 是鼠标拖动的时候当时才绑定事件，所以不会unbind掉里面的事件，只能增加事件。
			};
			//鼠标移动过程中函数
			function dragMove(event){
				event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue	
				if(!findNextItem($drag,true)&&!$doc.data("isTB")&&!$doc.data("isLR")){return false;}//如果只有一个tab不能拖动
				//看移动的距离同原始距离比较
				var pageX=event.pageX;
				var pageY=event.pageY;
				var isTabToMain = $doc.data("isTabToMain");
				var isTabToRight  = $doc.data("isTabToRight");
				moveDiffX = pageX-source.ox;//交换后鼠标移动的距离
				moveDiffY = pageY-source.oy;//当鼠标位移到tab下面的时候，不交换位置
				finalX    = moveDiffX+source.dragLeft;//移动的差值，加上原始位置
				finalY    = moveDiffY+source.dragTop;
				//判断移动是否出界了
				finalX = (finalX<minDragableX?minDragableX:finalX);
				finalX = (finalX>maxDragableX?maxDragableX:finalX);
				finalY = (finalY<minDragableY?minDragableY:finalY);
				finalY = (finalY>maxDragableY?maxDragableY:finalY);
				var moveDiffYABS=Math.abs(moveDiffY);
				//下面的73是147/2，147是$tabDivideDrag的高度
				var mainTabPositon=0;
				if(isTabToMain){
				  	 mainTabPositon=lastMouseY+tabDivideHeight+73;
				}else {
					mainTabPositon =lastMouseY+tabDivideHeight;
				}
			    isTabInterchange =isInList&&moveDiffYABS>=lastMouseY&&moveDiffYABS<mainTabPositon;
				if(isTabInterchange){//tab交换开始,上下\左右分屏时都用
					var tabRight = tabOffset.currentRight+moveDiffX; 
					var tabLeft  = tabOffset.currentLeft+moveDiffX;
					if(isTabToRight){
						if(isDisplay($drag)){
							tabRight = tabRight-lastMouseX;
							tabLeft  = tabLeft-lastMouseX;
						}else{
							tabLeft  =$tabDivideDrag.offset().left;
							tabRight =tabLeft+tabWidth;
						}
					}
			        if(tabRight>=tabOffset.nextCenter&&$dragNext&&$dragNext.get(0)&&isDisplay($dragNext)){
					    var indexs=window.tabsList.changePosition($dragNext.get(0).id,$drag.get(0).id);
						var nextIndex=indexs.index1;
						var beforeCount=getNotDisplayBeforeCount(nextIndex);//在tabToMain的那个tab是隐藏的
					    $dragNext.css({"left":(nextIndex-beforeCount)*134+"px"});
						setInterchangeValue($drag);
					}else if(tabLeft<=tabOffset.prevCenter&&$dragPrev&&$dragPrev.get(0)&&isDisplay($dragPrev)){
						var indexs=window.tabsList.changePosition($dragPrev.get(0).id,$drag.get(0).id);
						var prevIndex=indexs.index1;
						var beforeHideCount=getNotDisplayBeforeCount(prevIndex);//有几个隐藏的
						var leftCount=prevIndex-beforeHideCount;
						if((isTabToRight||isTabToMain||$doc.data("isTB"))&&leftCount===0){//20130304加isTB，因为原来的tab隐藏，导致计算beforeHideCount错误
						    
							leftCount=1;
						}
					    $dragPrev.css({"left":leftCount*134+"px"});
						setInterchangeValue($drag);
				    }
				    if(!isTabToMain){finalY=0;}//延迟向下移动使用
				}//tab交换结束 调用分屏的函数 
				if($drag.tuiTabsDivide&& typeof $drag.tuiTabsDivide==='function'){
					$drag.tuiTabsDivide({title:title,moveDiffY:moveDiffY,finalY:finalY,finalX:finalX, $dragDivide:$tabDivideDrag});
					$tabDivideDrag.show();
					$drag.hide();//如果不隐藏会跟着一起显示
					$tabDivideDrag.css({left:parseInt(finalX+tabDivideDragLeftDiff)+'px',top:parseInt(finalY+tabDivideDragTopDiff)+'px'});
				}
				if(!$doc.data("isTB")&&(isTabInterchange||finalY<tabDivideHeight)){ //因为在finalY这个值＜tabDivideHeight时，仍tuiTabsDivide，
			    //已经分屏了需要判断
					$tabDivideDrag.hide();
					$drag.show();
				}
			    //判断分屏后操作开始
				if($doc.data("isLR")){ 
					if($doc.data("lastMouseX")){
						lastMouseX=$doc.data("lastMouseX");
					} 
					if($doc.data("isTabToRight")){//必须得一直验证和执行,不能使用上面定义的isTabToRight，因为在tools 设置后，这里没有变化。移到右侧，重新设置tab finalX的值
						if($doc.data("isDivideDragToRight")){//下面推拽的提示显示过了，上面的tab就不显示，位置否则不对
							$tabDivideDrag.show();
							$drag.hide();//如果不隐藏会跟着一起显示
						}
						finalX=finalX-lastMouseX-mouseDiffLeft;
						//因为交换了位置，所以需要再减去。mouseDiffLeft 鼠标按下时离拖拽左侧的距离，只有这里使用
					}
				}else if($doc.data("isTB")){ 
					if($doc.data("lastMouseY")){
						lastMouseY=$doc.data("lastMouseY");
					} 
					if($doc.data("isTabToMain")){//必须得一直验证和执行
						finalY=finalY-lastMouseY-mouseDiffTop;
					}
				}
			  //设定位置，移动的窗口跟随鼠标走换后的坐标
				$drag.css({left:finalX+'px',top:finalY+'px'});
			  //分屏后需要重置值开始
				if($doc.data("lastMouseX")||$doc.data("lastMouseY")){
					if($doc.data("isLR")){
					   var dragLeft=$drag.offset().left;
					   tabOffset.currentRight=dragLeft+tabWidth;
					   tabOffset.currentLeft=dragLeft;
					}
					setInterchangeValue($drag);
					$doc.removeData("lastMouseX");
					$doc.removeData("lastMouseY");
			   }
			 //分屏后需要重置值结束
			}; //function结束
		    function dragUp(event){
				//moveDropDown($drag);
				var currentIndex=window.tabsList.findData($drag.get(0).id);
				var beforeNoDisCount=getNotDisplayBeforeCount(currentIndex);
				$drag.show();
				if(currentIndex>-1){
			      $drag.css({"left":(currentIndex-beforeNoDisCount)*134+"px",top:0});}
				else{$drag.css({left:0,top:0});}
				if($drag.css("left")=="0px"){
			       $drag.addClass("tab_current tab_current_left").removeClass("tab_normal");		
		     	}else{$drag.addClass("tab_current").removeClass("tab_normal tab_current_left");}
				lastMouseY=0;
				lastMouseX=0;
				$dragMask.remove();
				$tabDivideDrag.remove();
			    $doc.off(".tuiTabDrag");
		 };			
	   }//tuiDrop function结束
	 });//extend结束 
 })( jQuery );