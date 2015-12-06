// JavaScript Document
/*上下和左右分屏的工具类
	需要传入的值：
	1，拖拽本身
	2，是否左右分屏
	3，是否上下分屏
	4，拖动中是否进行tab页面切换
	5，取消分屏
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  hjdang@travelsky.com 党会建                 
 * @version 0.1BETA  
   @version 1.2  2012-12-26开始大规模测试
   @version 1.3  2013-7-10 safari浏览器下，分屏后 iframe如果不加height和width具体的px,不能够变化。                    
 * @see                                                
 *	HISTORY                                            
 * 2012-6-1 创建文件
 */
 ;(function( $, undefined ) {
	$.tui = $.tui || {}; 
	$.extend($.tui,{
	   tuiTabsDivideTools:function(){
		  var _defaults = {//默认参数
			  disabled:false,//如果为true，则不可使用
			  dragObject:"",//传入拖拽的对象
			  isLRDivide:false,
			  isTBDivide:false,
			  isCancelDivide:false,
			  isContentToRight:false,
			  isTabToRight:false,
			  isContentToMain:false,
			  isTabToMain:false,
			  triggerDivideMin:150,//触发上下分屏的移动最小距离
			  headerHeight:30,
			  tabWidth:134,
			  tabContainer:"tabs_container",//分屏左侧的id
			  leftTabContainer:"tabs_container_left",//分屏左侧的id
			  contentContainer:"box_container",//内容的容器
			  contentRigntContainerClass:"box_container_right",
			  tabCurrentClass:'tab_current',
			  tuiTabDragMaskId:"tui_tab_drag_mask",
			  topDivId:"tabs_top",//分屏后上面
			  topTabContainer:"tabs_container_top",
			  dropDownContainer:"tabs_dropdown_list",
			  LRLineId:"tabs_divide_LRLine",/*分屏的分割线*/
			  TBLineId:"tabs_divide_TBLine",
			  divideLineWidth:6,
			  $dragDivide:"",
			  divideContentClass:"divide"//为分屏的content加的class,以便和其他的content做区分 
		     };
		  var settings=$.extend({},_defaults);//读取默认参数参数
		  for(var i=0;i<arguments.length;i++){//读取多个参数
			 settings=$.extend(settings,arguments[i]);
		   }
		  if(settings.disabled){return;}
		  var headerHeight=settings.headerHeight,tabWidth=settings.tabWidth, $dragDivide=settings.$dragDivide,tabCurrentClass=settings.tabCurrentClass,tabContainerId=settings.tabContainer,leftTabContainerId=settings.leftTabContainer,$tabContainer= $("#"+tabContainerId),$leftTabContainer=$("#"+leftTabContainerId),$contentContainer= $("#"+settings.contentContainer), $topContainer= $("#"+settings.topDivId), topTabContainerId=settings.topTabContainer ,$topTabContainer= $("#"+topTabContainerId);
		  var $LRLine=$("#"+settings.LRLineId),$TBLine=$("#"+settings.TBLineId),divideLineWidth=settings.divideLineWidth, isIE6=$.tui.isIE6();//是否是IE6
		  //说明：在IE6下，遮罩层不能使用div，必须使用iframe才能将下拉菜单等盖住
		  var $drag=settings.dragObject;
		  var isBtnDivide=false;
		  if(!$drag){//如果drag没有传入，则赋值
			$drag=$tabContainer.find("."+tabCurrentClass);
			isBtnDivide=true;
		  }
		  var $dragContent=$("#"+$drag.data("boxId")),$doc=$(document),$win=$(window), $tabs=$("#tabs"),tabsHeight=$tabs.height(),tabsWidth=$tabs.width(),winHeight=$win.height();
		  winHeight=tabsHeight>winHeight?tabsHeight:winHeight;
		  var boxHeight=winHeight-headerHeight,winHeightMiddle=winHeight/2;
		  var divideLineWidthMiddle=divideLineWidth/2;
		  var winWidth=$win.width(),winWidthMiddle=winWidth/2;
		  winWidth=tabsWidth>winWidth?tabsWidth:winWidth;
		  var winWidthMiddleRightPx=(winWidthMiddle+divideLineWidthMiddle)+"px";
		  var divideWidth = winWidthMiddle-divideLineWidthMiddle, divideHeight= winHeightMiddle-divideLineWidthMiddle,contentRigntContainerClass=settings.contentRigntContainerClass;
		/*--------------------内部方法开始-------------------*/
		//显示分割栏
		var showDivideLine=function(isLR){
			if(isLR){
				$LRLine.show();
				$TBLine.hide();
				$LRLine.css({left:divideWidth+"px",height:winHeight+"px"});
				$LRLine.find(".middle").css({top:winHeightMiddle+"px"});
			}else{//需要占位
			   $LRLine.hide();
			   $TBLine.show();	
			   $TBLine.css({width:winWidth+"px"});
			   $TBLine.find(".middle").css({left:winWidthMiddle+"px"});
			}
		};
		var hideDivideLine=function(){
			$LRLine.hide();
			$TBLine.hide();
		};
		//找到分屏的下一个对象
		var findNextItem=function($item,isFindPrev){//isFindprev是否找他的上一个
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
		//分屏后，tab移动 需要知道主屏幕,在屏幕显示范围内位于左侧tab的元素，主要是左右分屏后使用
		var findContainerFirstTab=function(){
			var $item=null;
			$tabContainer.find(".tab").each(function() {
				var $this=$(this);
                if(isDisplay($this)&&$this.css("left")=="0px"){
					$item=$this;
					return false;
				}
            });
			return $item;
		};
		var getDisplayTabCount=function(){
			var i=0;
			$tabContainer.find(".tab").each(function() {
				var $this=$(this);
                if(isDisplay($this)){
					i++;
				  } 
            });
			return i;
		};
	   //分屏后，tab移动 需要知道主屏幕,在屏幕显示范围内位于右侧tab的元素，需要把这个隐藏
		var findContainerLastTab=function($firstTab){
			var $item=null;
			if($firstTab==null) return  null;
			var count=getDisplayTabCount();
			var lastIndex=window.tabsList.findData($firstTab.get(0).id)+count-1;
			if(lastIndex>-1){
				$item=$("#"+window.tabsList.get(lastIndex).data);}
			return $item;
		};
		//分屏后，tab移动 ，需要把显示的tab的left zindex重新计算，一个往左侧移动，其他的都跟着动
		var resetDisplayTabPosion=function($firstTab,$lastTab){
			var firstIndex=window.tabsList.findData($firstTab.get(0).id); 
			var lastIndex = window.tabsList.findData($lastTab.get(0).id);
			var factor =  parseInt($firstTab.css("left"))/tabWidth+1;
			//factor left移动的唯一，如果为
			for(var i=firstIndex,j=factor;i<=lastIndex;i++,j++){
				 var tabId=window.tabsList.get(i).data;
		         var $tab=$("#"+tabId); 
		         var left=j*tabWidth;
		         var zIndex=1000;
		         zIndex=1000-j*10;
		         $tab.css({left:left+'px','z-index':zIndex,top:'0px'});//此处不能使用 animate,没有执行结束，就会调用下一个函数，导致不能取得争取的left值
			}
		};
		//上下分屏后使用，找到主屏幕，被上面下来tab盖住的tab。12-19加上左右分屏识别
		var findMainContainerMaskTabIndex=function($dragItem,isToRight){
			var resultIndex=0;
			try{
				if(!isToRight){
					var dragLeft=null;
					if($dragDivide&&$dragDivide.css("display")!=="none"){//offset()仅对可视元素有效
						dragLeft=$dragDivide.offset().left;
					}else {
						dragLeft=$drag.offset().left;
					}
					var $currentTab=$tabContainer.find("."+tabCurrentClass);
					var currentTabLeft=$currentTab.offset().left;
					var tabNum=Math.round((currentTabLeft-dragLeft)/tabWidth);
					var currentIndex=window.tabsList.findData($currentTab.get(0).id); 
					resultIndex=Math.abs(currentIndex-tabNum);
				}else {
					var $firstTab=findContainerFirstTab();
					resultIndex=window.tabsList.findData($firstTab.get(0).id); 
				}
			}catch(e){
				return null;
			}
			if(resultIndex>window.tabsList.count-1){
				resultIndex=window.tabsList.count-1;
			}
		    return  resultIndex;
		};
		//分屏后，tab移到tab栏上后可以交换,更换完list位置后，通过resetDisplayTabPosion更改实际位置
		var tabSlide=function($tab,isToRight){
			var $firstTab=findContainerFirstTab();//查找当前在可视范围内的左边第一个tab
			var $lastTab=findContainerLastTab($firstTab);
			$tabContainer.append($tab);
			var tabNode=new TUINode($tab.get(0).id,null);
			var insertIndex=findMainContainerMaskTabIndex($tab,isToRight);
			if(insertIndex!==null){
				resetDisplayTabPosion($("#"+window.tabsList.get(insertIndex).data),$lastTab);
				window.tabsList.addAt(insertIndex,tabNode);
			}else{  
			    resetDisplayTabPosion($firstTab,$lastTab);
				window.tabsList.add(tabNode);
			}
			if ($lastTab&&$("#tabs_dropdown_btn").css("display")!=="none"){
				$lastTab.hide(); 
			}
		};
		/*
		var moveDropDown=function($current){
			//移动dropdwon下拉开始
			var $nextItem=findNextItem($current,false);	
			if($nextItem){
				$("#"+$nextItem.data("dropDownId")).before($("#"+$current.data("dropDownId")));
			   }else if($nextItem==null){//最后一个
				   $("#"+settings.dropDownContainer).append($("#"+$current.data("dropDownId")));
			   }
			$("#"+$current.data("dropDownId")).show();//显示dropDown
				//移动dropdwon下拉结束
		};
		*/
		//$dragContent取得iframe实际body里面的值。如果直接把iframe append到一个div中，iframe会刷新
		    //分屏时转移下面的具体内容，不是tab
			//因为iframe append到一个新的div后会刷新，不在使用iframe操作,对content直接absolute操作，然后设置left\top
		var moveContent=function($content,type,left,top){
			var divideContentClass=settings.divideContentClass;
			switch(type){
				case 0://往左,向上
					$content.css({position:"absolute",left:left+"px",top:top+"px"});
					$content.addClass(divideContentClass);
					break;
				case 1://取消分屏
					$content.css({position:"static",left:"0px",top:"0px"});
					$content.removeClass(divideContentClass);
					break;
			}
		};
		//20130710添加，改变iframe的height和width
		var setContentIframeHeightWidth=function($content,height,width){
			var $iframe=$content.find("iframe");
			if($iframe&&$iframe.get(0)&&height){
				$iframe.css({height:height+"px"});
			}
			if($iframe&&$iframe.get(0)&&width){
				$iframe.css({width:width+"px"});
			}
		};
		//20130710添加，将iframe的height和width复原为100%
		var resetAllContentIframe=function(){
			var $allIframes=$contentContainer.find("iframe");
			$allIframes.each(function(){
				$(this).css({height:"100%",width:"100%"});	
			});
		}
		//移动分屏tab栏上的图标
		var changeDivideIcon=function(divideClass){
			var $tabsDivideBtn = $("#tabs_divide_btn");
			$tabsDivideBtn.removeClass().addClass(divideClass);
		};	
		//进行左右分屏开始
		//isOnlyTab表示左边已有tab,进行左右位置交换
	   var tabToLeft=function($toLeftTab){
			 //if(isInTabContainer($toLeftTab)){
			$leftTabContainer.append($toLeftTab);
			$tabContainer.css({left:winWidthMiddleRightPx,width:divideWidth+"px"});//将右侧的tab的left改为一半 
			$leftTabContainer.css({width:divideWidth+"px"}); 
			$toLeftTab.addClass("tab_current_left");
			$toLeftTab.css({left:0});
			$leftTabContainer.show();
			if(window.tabsList){
				window.tabsList.deleteNode($toLeftTab.get(0).id);
			}
		};
		var contentToLeft=function($toLeftContent,$contentContainer){
			//$dragContent取得iframe实际body里面的值。如果直接把iframe append到一个div中，iframe会刷新
		    //分屏时转移下面的具体内容，不是tab
			//因为iframe append到一个新的div后会刷新，不在使用iframe操作,对content直接absolute操作，然后设置left\top
			var contentLeft=divideWidth+divideLineWidth;
			moveContent($toLeftContent,0,"-"+contentLeft,0);
			$contentContainer.css({left:winWidthMiddleRightPx,width:divideWidth+"px",height:boxHeight+"px"});
			$contentContainer.addClass(contentRigntContainerClass);
			setContentIframeHeightWidth($toLeftContent,boxHeight,divideWidth); 
		};
	    var tabToRight=function($toRightTab,isOnlyTab){
		   if(!isOnlyTab){
			  var $current=$tabContainer.find("."+tabCurrentClass);
			  var $nextItemNotPrev=findNextItem($current,false);
			 	 //把左侧的tab移到右侧
			  $tabContainer.append($toRightTab);
			  var leftNode=new TUINode($toRightTab.get(0).id,null);
			  if($nextItemNotPrev){
				 var insertIndex=window.tabsList.findData($nextItemNotPrev.get(0).id);
				 window.tabsList.addAt(insertIndex,leftNode);
			  }else{
				  window.tabsList.add(leftNode);
			  }
		   	}else if(isOnlyTab){//只有tab移动,找到主container里面，在一个位置上显示的tab
			  tabSlide($toRightTab,true);
			}
			// $.tui.tuiRsetTabsPosion({$showTab:$toRightTab});
		};
		var contentToRight=function($toRightContent){
			//tab移动时，content不马上变化,
			 $tabContainer.css({left:"0",width:winWidth}); 
			 $leftTabContainer.hide();
			 moveContent($toRightContent,1);
			 $toRightContent.show();
			 $toRightContent.siblings().hide();
			 $contentContainer.css({left:"0",width:winWidth+"px",height:boxHeight+"px"});
			 $contentContainer.removeClass(contentRigntContainerClass);
		};
		//左右分屏主方法
		var LRDivide=function($dragItem,$nextItem){
			  if($leftTabContainer.children().get(0)){//左边已经有一个，左右交换位置
				 var $leftTab=$leftTabContainer.children().eq(0);
				 var $leftBox=$("#"+$leftTab.data("boxId"));
				 var $nextItemNotPrev=findNextItem($dragItem,false);
				 //把左侧的tab和box移到右侧开始
				 $tabContainer.append($leftTab);
				 var leftNode=new TUINode($leftTab.get(0).id,null);
				 if($nextItemNotPrev){//如果有下一个tab
					 $("#"+$nextItemNotPrev.data("boxId")).before($leftBox);
					 var insertIndex=window.tabsList.findData($nextItemNotPrev.get(0).id);
					 window.tabsList.addAt(insertIndex,leftNode);
				 }else{//如果没有
				     window.tabsList.add(leftNode); 
				 }
				 moveContent($leftBox,1);
				 //把左侧的tab和box移到右侧结束
				 tabToLeft($dragItem);//左侧已有的交换
				 contentToLeft($dragContent,$contentContainer);
				 //moveDropDown($leftTab);
				 $doc.data("isLR",true);//左右分屏
				 $doc.data("isTB",false);
				 $.tui.tuiRsetTabsPosion({$showTab:$leftTab});
				 $leftTab.trigger("mousedown.tuiNavTabs");//会调用tuiTabsShowOrRemove里 showTabAndBox的方法
				 $leftTab.trigger("mouseup.tuiNavTabs");
				 var contentLeft=divideWidth+divideLineWidth;
				 setContentIframeHeightWidth($dragContent,boxHeight,contentLeft);
			  }else if($nextItem!==null&&!$doc.data("isLR")){//第一次初始化，左边没有，同时右侧不止一个。
			  //0911增加，直接从上下分屏转为左右分屏
			     $topContainer.hide();
			     hideDivideLine();
				 hideDivideLine();
				 showDivideLine(true);
			     tabToLeft($dragItem);
				 contentToLeft($dragContent,$contentContainer);
				 $doc.data("isLR",true);//左右分屏
				 $doc.data("isTB",false);
				 $.tui.tuiRsetTabsPosion({$showTab:$nextItem});
				 $nextItem.trigger("mousedown.tuiNavTabs");//会调用 showTabAndBox的方法
				 $nextItem.trigger("mouseup.tuiNavTabs");
			  }else if($nextItem!==null&&$doc.data("isLR")){//已经分屏了，是tab移到右边后，他又拖回左边
				   tabToLeft($dragItem);
				   var $show=$tabContainer.find(".tab_current").eq(0);
				   $doc.data("isLR",true);
				   $doc.data("isTB",false);
				   $.tui.tuiRsetTabsPosion({$showTab:$show});
			 }
			 //改变上的分屏的图标
			 changeDivideIcon("tabs_function tabs_divide_lr");
			 //隐藏下拉
			 $("#"+$dragItem.data("dropDownId")).hide();
			 $dragContent.show();// showTabAndBox的方法 会隐藏 $dragContent
		};
		//控制上下分屏开始
		var contentToMain=function($content){//取消分屏的操作，内容回到主框里
		     $topContainer.hide();
			 moveContent($content,1);
			 $content.siblings().hide();
			 $content.show();
		     $contentContainer.css({height:boxHeight+"px",width:winWidth+"px"});
		};
		var tabToMain=function($toMainTab,isSlide){//取消分屏的操作，tab在上面的tab栏中切换
			if(!isSlide){//不在上面tab页上滑动， 
			   var $current = $tabContainer.find("."+tabCurrentClass);
			   var $nextItemNotPrev=findNextItem($current,false);
			 	 //把左侧的tab移到右侧
			   $tabContainer.append($toMainTab);
			   var toMainNode=new TUINode($toMainTab.get(0).id,null);
			   if($nextItemNotPrev){
				 var insertIndex=window.tabsList.findData($nextItemNotPrev.get(0).id);
				 window.tabsList.addAt(insertIndex,toMainNode);
			   }else{
				  window.tabsList.add(toMainNode); 
			   }
			   //重排
			   $.tui.tuiRsetTabsPosion({$showTab:$toMainTab});
			   $toMainTab.trigger("mousedown.tuiNavTabs");//会调用 showTabAndBox的方法
			   $toMainTab.trigger("mouseup.tuiNavTabs");
			 }else{//在tab页上滑动
			    tabSlide($toMainTab,false);
			 }
		};
		var tabAndContentToTop=function($toTopTab,isOnlyTabToTop){
			 $leftTabContainer.hide();
			 hideDivideLine();
			 showDivideLine(false);
			 var contentHeight=divideHeight-headerHeight;
			 //如果不设置z-index会遮住下面的内容
			 $topContainer.css({height:divideHeight,display:"block",'z-index':0,width:tabsWidth+"px"});
			 $topTabContainer.append($toTopTab);
			 $tabContainer.css({width:tabsWidth+"px",left:0});
			 $toTopTab.removeClass("tab_normal").addClass("tab_current tab_current_left");
		     $toTopTab.css({left:0});
			 $topTabContainer.show();
			 if(window.tabsList){
				window.tabsList.deleteNode($toTopTab.get(0).id);
			 }
			if(!isOnlyTabToTop){//移动contend
			    $dragContent.show();
				//$topContentContainer.append($dragContent);
			    //$topContentContainer.css({height:contentHeight});
				var contentTop=divideHeight+divideLineWidth;
				moveContent($dragContent,0,0,"-"+contentTop);
				$contentContainer.css({left:"0",width:winWidth+"px",height:contentHeight+"px"});
			    $contentContainer.removeClass(contentRigntContainerClass);
				//20130710
				setContentIframeHeightWidth($dragContent,contentHeight,winWidth);
			}
			$doc.data("isTB",true);
			$doc.data("isLR",false);
		};
		//上下分屏主方法
		var TBDivide=function($dragItem,$nextItem){
		  if(!$doc.data("isTB")){//外面按钮直接调用，由左右分屏直接转为上下分屏的情况。
		  //如果已经上下分屏，$dragItem是左边的，$nextItem是主的
			 tabAndContentToTop($dragItem,false);
			 //隐藏下拉
			 $("#"+$dragItem.data("dropDownId")).hide();
			 $.tui.tuiRsetTabsPosion({$showTab:$nextItem});
			 $dragItem.trigger("mousedown.tuiNavTabs");//会调用 showTabAndBox的方法
			 $dragItem.trigger("mouseup.tuiNavTabs");
			 if($nextItem!==null){
				$nextItem.trigger("mousedown.tuiNavTabs");
				$nextItem.trigger("mouseup.tuiNavTabs");
			 }
			 $dragContent.show();
		  }else if(!$doc.data("isTabToMain")&&$doc.data("isTB")){//上面已有，把下面的往上面拖动，上下交换
		      var $topTab=$topTabContainer.children().eq(0);
			  var $topBox=$("#"+$topTab.data("boxId"));
			  //下移
			  var $nextItemNotPrev=findNextItem($dragItem,false);
			  //moveDropDown($topTab);
			  $tabContainer.append($topTab);
              var topNode=new TUINode($topTab.get(0).id,null);
			  if($nextItemNotPrev){
				 $("#"+$nextItemNotPrev.data("boxId")).before($topBox);
				 var insertIndex=window.tabsList.findData($nextItemNotPrev.get(0).id);
				 window.tabsList.addAt(insertIndex,topNode);
			  }else{
				 window.tabsList.add(topNode); 
			  }
			  moveContent($topBox,1);
			  $topTab.removeClass("tab_current_left");
			  //上移
			  $topTabContainer.append($dragItem);
			  var contentTop=divideHeight+divideLineWidth;
			  moveContent($dragContent,0,0,"-"+contentTop);
			  window.tabsList.deleteNode($dragItem.get(0).id);
			  $dragItem.addClass("tab_current_left");
			  $dragItem.css({left:0});
			  $("#"+$dragItem.data("dropDownId")).hide();
			  //重排
			  $.tui.tuiRsetTabsPosion({$showTab:$topTab});
			  $topTab.trigger("mousedown.tuiNavTabs");//会调用 showTabAndBox的方法
			  $topTab.trigger("mouseup.tuiNavTabs");
			  $dragContent.show();
			  var contentHeight=divideHeight-headerHeight;
			  setContentIframeHeightWidth($dragContent,contentHeight,winWidth);
			}else if($doc.data("isTabToMain")&&$doc.data("isTB")){//已经分屏了，是tab移到下边后，他又拖回上面
				  tabAndContentToTop($dragItem,true);
				  var $show=$tabContainer.find(".tab_current").eq(0);
				  $doc.data("isTB",true);
				  $doc.data("isLR",false);
				  $.tui.tuiRsetTabsPosion({$showTab:$show});
		   }
		   //改变上的分屏的图标
			changeDivideIcon("tabs_function tabs_divide_tb");
		};
		//取消分屏
		var cancelDivide=function(){
			if($doc.data("isLR")&&$drag.parent().get(0).id==leftTabContainerId){//向右移
			     tabToRight($drag,false);
			     contentToRight($dragContent);
				 //moveDropDown($drag);
				 $doc.data("isLR",false);
			  }else if($doc.data("isTB")&&$drag.parent().get(0).id==topTabContainerId){//向下移动，取消分屏
			     $topContainer.hide();
			     tabToMain($drag,false);
				 contentToMain($dragContent);
				 //moveDropDown($drag);
				 $doc.data("isTB",false);
			  }else if($drag.parent().get(0).id==tabContainerId){//右侧或者上面的直接删除
			  	 $leftTabContainer.hide();
				 $topContainer.hide();
				 $tabContainer.css({left:"0",width:winWidth}); 
			 	 $contentContainer.css({left:"0",width:winWidth+"px",height:boxHeight+"px"});
			     $contentContainer.removeClass(contentRigntContainerClass);
				 $doc.data("isLR",false);
				 $doc.data("isTB",false);
			  }
			  $.tui.tuiRsetTabsPosion({$showTab:$drag});
			  $drag.trigger("mousedown.tuiNavTabs");//会调用 showTabAndBox的方法
			  $drag.trigger("mouseup.tuiNavTabs");
			  hideDivideLine();
			  resetAllContentIframe();
			   //改变上的分屏的图标
			  changeDivideIcon("tabs_function tabs_divide");
		    };
	    /*--------------------内部方法结束-------------------*/
		/*--------------------主体方法开始-------------------*/
		var $next=findNextItem($drag,true);
		if(settings.isLRDivide){
			if($doc.data("isTB")){//从上下分屏直接转为左右
				$drag=$topTabContainer.find("."+tabCurrentClass);
				$next=$tabContainer.find("."+tabCurrentClass);
				$dragContent=$("#"+$drag.data("boxId"));
			}
			LRDivide($drag,$next);
		}else if(settings.isTBDivide){
			if($doc.data("isLR")){
				$drag=$leftTabContainer.find("."+tabCurrentClass);
				$next=$tabContainer.find("."+tabCurrentClass);
				$dragContent=$("#"+$drag.data("boxId"));
			}
			TBDivide($drag,$next);
		}else if(settings.isCancelDivide){
			if(isBtnDivide){
				if($doc.data("isLR")){$drag=$leftTabContainer.find("."+tabCurrentClass);}
				if($doc.data("isTB")){$drag=$topTabContainer.find("."+tabCurrentClass);}
				if(!$drag.get(0)){$drag=$tabContainer.find("."+tabCurrentClass);}
				$dragContent=$("#"+$drag.data("boxId"));
			}
			cancelDivide($drag);
		}else if(settings.isContentToRight){//左右分离后，tab已经到右边了，需要内容在鼠标离开的时候往右移动
			contentToRight($dragContent);
			hideDivideLine();
			$("#"+$drag.data("dropDownId")).show();
			$doc.data("isLR",false);
			$.tui.tuiRsetTabsPosion({$showTab:$drag});//tab已经到右边了，最后需要重置
			$drag.trigger("mousedown.tuiNavTabs");//会调用 showTabAndBox的方法
			$drag.trigger("mouseup.tuiNavTabs");
			changeDivideIcon("tabs_function tabs_divide");
			resetAllContentIframe();
		}else if(settings.isTabToRight){//左右分离后，将tab往右侧移动
			tabToRight($drag,true);
		}else if(settings.isTabToMain){
		    tabToMain($drag,true);  
		}else if(settings.isContentToMain){
			contentToMain($dragContent);
			hideDivideLine();
			$("#"+$drag.data("dropDownId")).show();
			$doc.data("isTB",false);
			$doc.data("isLR",false);
			$.tui.tuiRsetTabsPosion({$showTab:$drag});//tab已经到右边了，最后需要重置
			$drag.trigger("mousedown.tuiNavTabs");//会调用 showTabAndBox的方法
			$drag.trigger("mouseup.tuiNavTabs"); 
			changeDivideIcon("tabs_function tabs_divide");
			resetAllContentIframe();
		   }
		/*--------------------主体方法结束-------------------*/
	   }//tuiNavTabsDivideTools  function结束
	 });//extend结束  
 })( jQuery );