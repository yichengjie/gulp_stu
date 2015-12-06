// JavaScript Document
/* 鼠标来触发上下和左右分屏
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  hjdang@travelsky.com 党会建                 
 * @version 0.3BETA
 @version 1.2  2012-12-26开始大规模测试
  @version 1.5  2013-2-22测试修改点中重复的变量    
 * @see                                                
 *	HISTORY                                            
 * 2012-6-1 创建文件
   2012-6-8 左右、上下已经分开时拖拽物体过去一半开始交换，同时背景色变色。
   
 */
 ;(function( $, undefined ) {
	$.extend($.fn,{
	   tuiTabsDivide:function(){
		  var _defaults = {//默认参数
			  disabled:false,//如果为true，则不可使用
			  triggerDivideMin:150,//触发上下分屏的移动最小距离
			  maskId:'tui_tabsDivide_mask',
			  maskClass:'tab_divide_mask',
			  maskColorNormal:'#325894',
			  maskColorLight:'#5e8fd9',
			  maskAlpha:0.75,//背景透明度，
			  tabContainer:"tabs_container",//主id
			  leftTabContainer:"tabs_container_left",//分屏左侧的id
			  topTabContainer:"tabs_container_top",
			  tabWidth:147,//tab的宽度
			  headerHeight:30,//大的tab的高度
			  tabHeight:26,//具体里面tab的高度
			  title:"",
			  tipId:"tabsDivideTip",
			  $dragDivide:""//拖拽到下面的tab
		     };
		  var settings=$.extend({},_defaults);//读取默认参数参数
		  for(var i=0;i<arguments.length;i++){//读取多个参数
			 settings=$.extend(settings,arguments[i]);
		   }
		  if(settings.disabled){return;}
		  var isIE6=$.tui.isIE6();//是否是IE6
		  //说明：在IE6下，遮罩层不能使用div，必须使用iframe才能将下拉菜单等盖住
		  var $drag=$(this);
		  var $doc=$(document);//提高读取速度,使用局部变量
		  var $win=$(window);
		  var tabContainerId=settings.tabContainer;
		  var dragContainerId=$drag.parent().get(0).id;
		  var leftTabContainerId=settings.leftTabContainer;
		  var tipId=settings.tipId;
		  var mouseY=settings.finalY;//鼠标移动的距离，不是鼠标位置
		  var mouseX=settings.finalX;
		  var maskId=settings.maskId;
		  var maskClass=settings.maskClass;
		  var maskColorExit=settings.maskColorNormal;
		  var maskColorEnter=settings.maskColorLight;
		  var maskAlpha=settings.maskAlpha;
		  var headerHeight=settings.headerHeight;
		  var winWidth=$win.width();
		  var winWidthMiddle = winWidth/2;
		  var $dragDivide =settings.$dragDivide;
		  var dragLeft;
		  var dragWidthMiddle;
		  if($dragDivide.css("display")!=="none"){//offset()仅对可视元素有效
			    dragLeft=$dragDivide.offset().left;//拖动左侧位置
				dragWidthMiddle=dragLeft+196/2;
		  }else {
			  dragLeft=$drag.offset().left;
		      dragWidthMiddle=dragLeft+settings.tabWidth/2;
			  }
		  var dragTop;
		  var dragHeightMiddle;
		   if($dragDivide.css("display")!=="none"){//offset()仅对可视元素有效
			    dragTop=$dragDivide.offset().top;//拖动左侧位置
				dragHeightMiddle=dragTop+147/2;
		  }else {
			  dragTop=$drag.offset().top;
		      dragHeightMiddle=dragTop+settings.tabHeight/2;
			  }
		  var tabDivideHeight=headerHeight+10;
		  var isToLeft=false;//是否左右分屏
		  var isToRight=false;//向右拖动解除分屏条件
		  var isToTop=false;//是否上下分屏
		  var isToBottom=false;//向下拖动解除分屏条件
		  var tools=$.tui.tuiTabsDivideTools;//工具函数
		  var winHeight=$win.height();
		  var winHeightMiddle=winHeight/2;
		  var winHeightMiddleMin=settings.triggerDivideMin;//触发上下分屏的移动最小距离
		  var contentHeight=winHeight-headerHeight;
		  var contentHeightMiddle=contentHeight/2;
         //如果高度很小，就不再分屏
		  if(contentHeightMiddle<=winHeightMiddleMin){
			 return false;
		  }
		/*--------------------内部方法开始-------------------*/
			//显示遮罩层，参数为遮罩的颜色和遮罩的透明度
			// showMask(maskAlpha,maskColorExit,null,null,$win.width()/2,headerHeight);
		  var showMask=function (maskAlpha,maskColor,maskWidth,maskHeight,maskLeft,maskTop,tipMsg){
				var maskWidth= maskWidth?maskWidth:winWidth;//遮罩层的宽度
				var maskHeight=maskHeight?maskHeight:winHeight;//遮罩层的高度
				var maskLeft=maskLeft?maskLeft:0;
				var maskTop=maskTop?maskTop:0;
				var tipMsg=tipMsg?tipMsg:"";
				var $mask;
				var maskSrc='<div id="'+maskId+'" class="'+maskClass+'"></div>';//左右比较
				if($('#'+maskId).length>0){//已经存在了遮罩层，则不进行新建遮罩层的操作
					$mask=$('#'+maskId);
				}else{//新建遮罩层
					$mask=$(maskSrc);
					$("#tabs").append($mask);//将新的遮罩层放入body中。
				}
				if(isIE6){//如果是IE6，则需要在遮罩层中添加一个iframe
					$mask.append('<iframe border="0" frameborder="0" style="width:100%;height:100%;filter:alpha(opacity='+(100*maskAlpha)+');" src="about:blank"></iframe>');//添加iframe，用于遮盖下拉菜单等
				}
				$mask.css({width:maskWidth+'px',height:maskHeight+'px',opacity:maskAlpha,background:maskColor,top:maskTop,left:maskLeft});//设置样式
				$mask.show();//显示遮罩层，注：如果是新建遮罩层，在执行该句之前就已经显示了
			};
			//关闭遮罩层
		var closeMask=function(){
			  $('#'+maskId).remove();
			};
			//改变遮罩层的颜色
		var changeMask=function(maskAlpha,maskBackground){
			if($('#'+maskId).length>0){//已经存在了遮罩层，则不进行新建遮罩层的操作
				 var $mask=$('#'+maskId);
				 $mask.css({opacity:maskAlpha,background:maskBackground});
				}
		};
		//鼠标弹起时操作
		var mouseUp=function(){
			if(isToLeft){
			   tools({dragObject:$drag,isLRDivide:true});
			 }else if($doc.data("isTabToRight")){
			   tools({dragObject:$drag,isContentToRight:true});
			 }else if(isToTop){
			   tools({dragObject:$drag,isTBDivide:true});
		     }else if($doc.data("isTabToMain")){
			   tools({dragObject:$drag,isContentToMain:true});//必须在canceldivide判断前面，isToTop 之下否则会执行那个  	
			 }else if(isToRight||isToBottom){
			   tools({dragObject:$drag,isCancelDivide:true});
			 }
			closeAllMask();
			$doc.removeData("lastMouseX");
			$doc.removeData("lastMouseY");
			$doc.removeData("isTabToRight");
			$doc.removeData("isTabToMain");
			$doc.removeData("tipType");
			$doc.removeData("isDivideDragToRight");
			$doc.off(".tuiTabDivide");
			//$doc.unbind(".tuiTabDrag");//drag函数里 dragUp方法，先于这个执行，因为他是先注册的。导致的后果是 因为这个mouseUp没有执行，被引用，mouseMove的方法等不能被解除绑定，只能在这最后统一解除了。
		};
		var closeAllMask=function(){
	 	    closeMask();
			$('#'+tipId).remove();
			$("#"+settings.tuiTabDragMaskId).remove();//$next的 mousedown触发在 divide mouseup时触发，导致其没有执行自己的mouseup的方法，产生遮罩层，没有被取消
		};	
		var getTipHtml=function(isHasbg,tipType,tipPosition){//isHasbg 是否有自己黑色的背景
		    //tipType类型，0代表是左右，1代表上下，2代表返回主屏,3代表分屏替换，右屏替换左屏,4代表分屏替换，下屏替换
			//tipPosiont,放的位置。0，上；1，下；2，左；3，右；
			var info=["左右分屏","上下分屏","返回单屏","分屏交换","分屏交换"];
			var icon=["tab_divide_LR_icon","tab_divide_TB_icon","tab_divide_icon","tab_divide_LR_icon","tab_divide_TB_icon"];		  
			var middleTop=contentHeightMiddle-60+headerHeight;
			var upTop=contentHeightMiddle/2-60+headerHeight;
			var bottomTop=contentHeightMiddle+contentHeightMiddle/2-60+headerHeight;
			var middleLeft=winWidth/2-100;
			var toLeft=winWidth/4-100;
			var toRight=winWidth/4*3-100;
			var posionClass="";
			switch(tipPosition){
				case 0:
				   posionClass="top:"+upTop+"px;left:"+middleLeft+"px";
				   break;
	            case 1:
				   posionClass="top:"+bottomTop+"px;left:"+middleLeft+"px";
				   break;
				case 2:
				   posionClass="top:"+middleTop+"px;left:"+toLeft+"px";
				   break;
				case 3:
				   posionClass="top:"+middleTop +"px;left:"+toRight+"px";
				   break;
				}
			var tipHtml="";
			if(isHasbg){
			    tipHtml='<div class="tab_divide_tip_hasbg" style="'+posionClass+'">\
                             <span class="helper_inline_block '+icon[tipType]+'"></span>\
                             <span class="helper_inline_block tab_divide_info">'+info[tipType]+'</span>\
                          </div>';
			  }else{
		        tipHtml='<div class="tab_divide_tip_nobg" style="'+posionClass+'">\
                           <span class="helper_inline_block '+icon[tipType]+'"></span>\
                           <span class="helper_inline_block tab_divide_info">'+info[tipType]+'</span>\
                         </div>';
			  }
			  return tipHtml;		   
	     };
		 //对tip的情况再次整合
		 var showTip=function(type){
			 //type 0,上面无背景左右，下面有背景上下；1，上面有背景左右，下面无背景上下。
			 if($doc.data("tipType")==type&&$('#'+tipId).length>0)
			    {return false;}//如果上下一样则不操作，直接返回
			 $doc.data("tipType",type);
			 var tipSrc='<div class="tab_divide_tip_mask" id="'+tipId+'"></div>';
			 if($('#'+tipId).length>0){
				$tip=$('#'+tipId);
			 }else {$tip=$(tipSrc);
			   $('body').append($tip);
			 }
			 $tip.css({width:winWidth,height:winHeight});
			 $tip.empty();
			 var html="";
			 switch(type){
				 case 0:
				   html=getTipHtml(false,0,0)+getTipHtml(true,1,1);
				   break;
				 case 1:
				   html=getTipHtml(true,0,0)+getTipHtml(false,1,1);
				   break; 
				  case 2://左屏往右拖动
				   html=getTipHtml(false,2,3);
				   break;
				  case 3://右屏往左拖动
				   html=getTipHtml(false,3,2);
				   break;
				  case 4://下屏往上拖动，交换
				   html=getTipHtml(false,4,0);
				   break;
				  case 5://上屏往下拖动，恢复
				   html=getTipHtml(false,2,1);
				   break;
				 }  
			 $tip.append(html);
			};
		  
	    /*--------------------内部方法结束-------------------*/
		 //分屏主方法开始
		 //初始化开始
		 if(!$doc.data("isLR")&&!$doc.data("isTB")){
			if(mouseY>=tabDivideHeight&&mouseY<contentHeightMiddle){
			   showMask(maskAlpha,maskColorExit,null,contentHeightMiddle,null,headerHeight);
		       showTip(0);
			   isToLeft=true;
			   isToRight=false;
			   isToTop=false;
			   isToBottom=false;
			}else if(mouseY>contentHeightMiddle){
				showMask(maskAlpha,maskColorExit,null,contentHeightMiddle,null,headerHeight+contentHeightMiddle);
			    showTip(1);
			    isToLeft=false;
			    isToRight=false;
			    isToTop=true;
			    isToBottom=false;
			  }else{
				  closeAllMask();
				  isToLeft=false;
			      isToRight=false;
			      isToTop=false;
			      isToBottom=false;
				  } 
			 }
		 //初始化结束
	     //左右分屏开始
		if($doc.data("isLR")){
			//左屏往右屏拖动，取消分屏操作
			if(dragContainerId===leftTabContainerId){
		        showMask(maskAlpha,maskColorExit,null,null,winWidthMiddle,headerHeight);
			    showTip(2);
				if(dragWidthMiddle>winWidthMiddle&&mouseY>tabDivideHeight){
					changeMask(maskAlpha,maskColorEnter);
					isToRight=true;
					isToLeft=false;
				}else if(!$doc.data("isTabToRight")&&dragWidthMiddle>winWidthMiddle&&mouseY<tabDivideHeight){//tab向右移动,这个仅执行一次，如果用isTabToRight变量，导致再移动的时候不能继续赋值
					var $tabDivideDrag=$("#tab_divide_drag");
					if($tabDivideDrag.css("display")!=="none"){
						$doc.data("isDivideDragToRight",true);
					}
					changeMask(maskAlpha,maskColorEnter);	 
					tools({dragObject:$drag,isTabToRight:true,$dragDivide:$tabDivideDrag});
					$doc.data("lastMouseX",mouseX);//记录下鼠标移动的位置，用于拖拽的位移
					$doc.data("isTabToRight",true);
				}
			}else if(!$doc.data("isTabToRight")&&dragContainerId===tabContainerId){
		    //已经分屏的情况下，右屏往左拖，会产生替换操作
		        showMask(maskAlpha,maskColorExit,$win.width()/2,null,0,headerHeight);
			    showTip(3);
				if(dragWidthMiddle<winWidthMiddle){
					 changeMask(maskAlpha,maskColorEnter); 
					 isToLeft=true;
					 isToRight=false;
				}
			}else if($doc.data("isTabToRight")){//tab页到已经到右边了，取消分屏
				if(dragWidthMiddle>winWidthMiddle){ 
				 	changeMask(maskAlpha,maskColorEnter);
			        isToLeft=false;
			        isToRight=true;
				}else if(dragWidthMiddle<winWidthMiddle){
					changeMask(maskAlpha,maskColorExit);
			        isToLeft=true;
			        isToRight=false; 
				}  
			}
		}
		 //左右分屏结束
		 //上下分屏开始
		if($doc.data("isTB")){
			if(dragContainerId==settings.topTabContainer){//向下移动
			    $("#tabs_top").css({'z-index':3});
				showMask(maskAlpha,maskColorExit,null,winHeightMiddle-3-headerHeight,null,winHeightMiddle+3+headerHeight);
				showTip(5);
			    if(dragHeightMiddle>winHeightMiddle&&Math.abs(mouseY)>tabDivideHeight){
					changeMask(maskAlpha,maskColorEnter);
					isToTop=false;
			        isToBottom=true;
					if(!$doc.data("isTabToMain")){//保证只执行一次	
						tools({dragObject:$drag,isTabToMain:true,$dragDivide:$dragDivide});	
						$doc.data("lastMouseY",mouseY);//记录下鼠标移动的位置，用于拖拽的位移
						$doc.data("isTabToMain",true);
			        } 	
				}
			}else if(!$doc.data("isTabToMain")&&dragContainerId===tabContainerId&&Math.abs(mouseY)>tabDivideHeight){//向上移动
			   $("#tabs_top").css({'z-index':1});//为了显示拖拽的标示 $dragDivide
			    showMask(maskAlpha,maskColorExit,null,winHeightMiddle-3-headerHeight,null,headerHeight);
				showTip(4);
				if(dragHeightMiddle<winHeightMiddle){//mouseY是负数了
					changeMask(maskAlpha,maskColorEnter);
					isToTop=true;
			        isToBottom=false;	
				}
			}else if($doc.data("isTabToMain")){//tab页到已经到下边了，取消分屏
				if(dragHeightMiddle>winHeightMiddle){ 
				 	changeMask(maskAlpha,maskColorEnter);
			        isToTop=false;
			        isToBottom=true;
				}else if(dragHeightMiddle<winHeightMiddle){
					changeMask(maskAlpha,maskColorExit);
			        isToTop=true;
			        isToBottom=false;	
				}  
		   }
		}//上下分屏结束
	    //不能放在if中绑定，是因为有的分屏后，点击主屏，拖动一点后放手，需要取消遮罩等。
		$doc.off('mouseup.tuiTabDivide').on('mouseup.tuiTabDivide',mouseUp);
		//分屏主方法结束
	   }//tuiNavTabsDivide  function结束
	 });//extend结束  
 })( jQuery );