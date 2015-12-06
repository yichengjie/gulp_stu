/*
 功能描述:桌面初始化函数，包括功能
 1，设置tabs_main的高度 
 *@Copyright: Copyright (c) 2012
 *@Company: 中国民航信息网络股份有限公司
 *@author:  党会建  
 *@version 0.1 2012/9/6
 *@version 0.5 2012/9/27，完成拖到，自动排列图标，滚动等操作，开始抽屉框切换的代码编写
 *@version 1.2 2012/12/26，整合完成，开始大规模测试
 *@version 1.5 2013/1/18，apps加上按点击次数读取的app
 *@version 1.5.1 2013/2/17，增加桌面上右键菜单
 *@version 1.5.2 2013/2/19，app drag时，范围在10之内算上点击
 *@version 1.5.3 2013/2/19,解决resize时，app全部显示是，上面的栏目标题滚动，不跟随变化
 *@version 1.5.4 2013/2/27,ie7背景路径不对有问题
 *@version 1.5.5 2013/5/9,当dockList返回为null时，不报错，允许dock添加新的app 
 *@version 1.5.6 2013/7/3,改bug,全部应用时点击某个应用，如果只是想打开，dock上也会跳到该应用,应该为移
 *@version 1.6.7 2013/7/30,改bug,在IE678下讲remove背景图片改为hide
 *@version 1.6.8 2013/8/20，修正了在IE8下因为背景图导致右键无法使用，马驰修改
 *@version 1.6.9 2014/1/7 app过多少，横向会超过些
 *
 */
;(function($){
	$.tui=$.tui||{};
	$.extend($.tui,{
		tuiDesktopInit:function(option){
			var _defaults={//创建新的tab页
	            tabsId:"tabs",
				desktopId:"desktop",
				appsScrollContentId:"apps_category_list",//滚动的内容
				appsId:"apps",
				dockId:"dock",
				widgetId:"widget",
				desktopBackgroundId:"desktop_background",
				appsCloseId:"apps_close",
				widgetSwitchId:"widget_switch",
				dockAppsId:"dock_apps_container",
				minWidth:950,
				minHeight:550
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $desktop=$("#"+settings.desktopId), $apps=$("#"+settings.appsId),$appsClose=$("#"+settings.appsCloseId),$widget=$("#"+settings.widgetId),$dock=$("#"+settings.dockId);
			var $widgetSwitch=$("#"+settings.widgetSwitchId),leftAppsWidth=118, topAppsHeight=115,$win=$(window);
			var $appsScrollContent=$("#"+settings.appsScrollContentId),windowWidth,windowHeight, dockWidth=118;
			//内部函数开始
			//初始化高度和宽度，dock app等
			var initHeightAndWidth=function(eventBind){
				windowWidth=$win.width();
				//windowWidth=windowWidth>minWidth?windowWidth:minWidth;
				windowHeight=$win.height();
				//windowHeight=windowHeight>minHeight?windowHeight:minHeight;
				//var widgetRight=parseInt($widget.css("right").replace("px",""));
				//if($widget.css("display")==="none"||widgetRight<0){
				//$tabs.css({height:windowHeight+"px",width:windowWidth+"px"});
				//}
				$desktop.css({width:parseInt(windowWidth-dockWidth)+"px"});//把dock让开，widget能够点击
				$.tui.tuiResizeTabs({eventBind:eventBind});//改变tab里面的高度和宽带
				//console.log(windowHeight);
				$apps.css({height:windowHeight+"px",width:windowWidth+"px"});//$desktopBg.css({height:windowHeight+"px",width:windowWidth+"px"});
				//117左边的距离，115是上边的距离
				$appsScrollContent.css({height:(windowHeight-topAppsHeight)+"px",width:(windowWidth-leftAppsWidth)+"px"});
			};
			//给按钮绑定事件开始
			var initBindEvent=function(){
				//apps关闭
				$appsClose.off("click.tuiDesktop").on("click.tuiDesktop",function(){
					$.tui.tuiDesktopCloseApps();
				});
				$desktop.off("click.tuiDesktop").on("click.tuiDesktop",function(){
					var widgetRight=parseInt($widget.css("right").replace("px",""));
					if(widgetRight>=0){
						$.tui.tuiWidgetBarShowOrHide({isHide:true});
					}
					
				});
				$dock.off("click.tuiDesktop").on("click.tuiDesktop",function(){
					var widgetRight=parseInt($widget.css("right").replace("px",""));
					if(widgetRight>=0){
						$.tui.tuiWidgetBarShowOrHide({isHide:true});
					}
					
				});
				//widget显示和隐藏
				$widgetSwitch.off("click.tuiDesktop").on("click.tuiDesktop",function(){
					$.tui.tuiWidgetBarShowOrHide({isResize:true});
				});
			};
			//给按钮绑定事件结束
			$.tui.tuiAddOrRemoveDesktopBg({isAdd:true});
			initHeightAndWidth();
			$.tui.tuiDesktopAppsAutoSort({isNotResize:true});
			initBindEvent();
			//调整大小，需要重新定义高度和宽度。
			//tab的变化窗口调整也放在这
			$win.off("resize.tuiDesktop").on("resize.tuiDesktop",function(event){
				initHeightAndWidth(event);
				$.tui.tuiDesktopAppsAutoSort({isNotResize:false});
				$.tui.tuiResizeWidgetMask();//widget tab情况下显示
				$.tui.tuiResetWidgetBar(0,null,event);//widgetbar
				$.tui.tuiResetWidgetDesktop({isResize:true});
				//绑定tabs自动调整的事件,tab的位置变化
				var $curTab=$("#tabs_container").find(".tab_current").eq(0);
				if(window.tabsList&&$curTab.get()){
					$.tui.tuiRsetTabsPosion({$showTab:$curTab});
				}
			});
			try{
				$(document).rightClick({rightmenuId:"desktop_rightmenu",xOffset:-118});
			}catch(e){console&&console.log(e);}
			
		},//tuiDesktopInit结束
		tuiDesktopAppsAutoSort:function(option){
			var _defaults={//创建新的tab页
				dockId:"dock",
				appsScrollContentId:"apps_category_list",//滚动的内容,可以传入，默认是按种类分传入其他的
				appsCategoryClass:"apps_category",
				appClass:"app_icon",
				appsHeaderContainerId:"apps_header_container",
				dockAppsId:"dock_apps_container",
				isHasUsasInfo:false,//图标下是否有主机的说明
				isNotResize:true,
				isHasHeader:true//是否有头，如果是按照点击排行的，就没有头
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $appsScrollContent=$("#"+settings.appsScrollContentId),$dock=$("#"+settings.dockId);
			var $appsHeaderContainer=$("#"+settings.appsHeaderContainerId), appsCategoryClass=settings.appsCategoryClass, appClass=settings.appClass;
			var leftAppsWidth=118,appActiveClass="app_icon_active",$win=$(window);
			var windowWidth;
			var isDrag=false,readyPageX=0,readyPageY=0,dragValue=10;//是拖拽还是点击
			var isDockHas=false,isDockMove=false,dockMoveId="";//dock是否已经存在
			var isNotResize=settings.isNotResize,isHasHeader=settings.isHasHeader;
			//内部函数开始
			var draging=function($item){
				return function(finalX,finalY,event){
					var dragingPageX=event.pageX;
					var dragingPageY=event.pageY;
					if(Math.abs(dragingPageX-readyPageX)>dragValue||Math.abs(dragingPageY-readyPageY)>dragValue){
						isDrag=true;
						//查看向dock上添加app
						if(!isDockHas){
							var position=$.tui.tuiGetInsertDockAppPosition(finalX,finalY,$(this));
							$item.data("insertDockPosition",position);
						}else if(isDockHas&&!isDockMove&&dockMoveId){
							//20130703 保证只调用一次
							isDockMove=true;
							$.tui.tuiResetDockApps(150,null,null,null,$("#"+dockMoveId));	
						}
					}
					
				};
			};
			var dragReady=function(event){
				readyPageX=event.pageX;
				readyPageY=event.pageY;
				$(this).removeClass(appClass).addClass(appActiveClass).addClass("app_opacity");
			};
			var dragStart=function($item){
				return function(finalX,finalY,event){
					isDrag=false;
					isDockHas=false;
					$item.hide();
					//判断是否dock上有重复的app，如果有，就不再添加
					var appid=$item.attr("appid");
					if(appid&&appid!="undefined"&&appid!=""){
						var dockAttrList=$dock.data("dockAttrList");
						//20130509修改
						if(!dockAttrList){
							dockAttrList={};
						}
						var dockObject=dockAttrList[appid];
						if(dockObject&&$(dockObject).size()>0){
							isDockHas=true;
							dockMoveId=dockObject.dockid;
							//20130703删除，防止正常打开，造成dock上的图标移动
							//$.tui.tuiResetDockApps(150,null,null,null,$("#"+dockObject.dockid));
						}
					}
					//判断结束	
				};
			};
			var dragFinshed=function($item){
				return function(finalX,finalY,event){
					if(!isDrag){
						$item.trigger("click");	//没有拖到，打开应用。
					}
					var posion=$item.data("insertDockPosition");
					if(posion>=0){
						var imgUrl=$item.find("img").attr("src");
						var title=$item.attr("title");
						if(window.dockTempAppId){
							window.dockTempAppId++;
						}else {
							window.dockTempAppId=1;}
						var toTabs=$item.attr("onclick");
						var id=	"dock_app_insert_"+window.dockTempAppId;
						var appid=$item.attr("appid");
						var appObject={id:id,title:title,imgUrl:imgUrl,toTabs:toTabs,appid:appid};
						$.tui.tuiAddDockApp(appObject,posion,true);
						$("#dock_apps_container").find(".dock_app").removeClass("dock_app_active");//去掉dock上所有的active样式
						$item.removeData("insertDockPosition");
					}
					$item.addClass(appClass).removeClass(appActiveClass).removeClass("app_opacity");
					$item.show();
					//20130703增加
					isDockMove=false;
				};
			};
			//resize时重置上面的header
			var resizeSetAppsHeader=function(){
				var $headerApp=$appsHeaderContainer.children().eq(0);
				if($headerApp&&$headerApp.get(0)&&$headerApp.get(0).id==="app_1"){
						return false;	
				}
				var $firstApp=$appsScrollContent.children().eq(0);
				$appsHeaderContainer.html("");
				$appsHeaderContainer.append($firstApp.clone().show().css({top:0}));
			};
			//全部应用的图标排序,主要是设置left top,不设置id。横排
			var appsAutoSort=function(isNotResize){//isBindDrag,是否绑定drag事件，resize时不需要绑定
				windowWidth=$win.width();
				var appsWidth=windowWidth-leftAppsWidth-20;//20140107 党会建修改增加-20,防止图标出来
				windowHeight=$win.height();
				var $appsList=$appsScrollContent.children();
				var x=0,y=0,categoryCount=0,appCount=0,topGap=0,leftGap=0,categoryFlag=false,categoryTop=0;
				var appLeftWidth=200,leftDistance=150,appWidth=100,//app间的距离
					appTopDistance=120,//app上面的距离
					categoryTopDistance=140,//分组栏和上个app
					appCategoryGap=40,//app和分组栏的距离
					appsCategoryLineWidth=appsWidth-appLeftWidth;
				if(!settings.isHasUsasInfo){
					appTopDistance=100,categoryTopDistance=110;
				}
				if(isHasHeader){
					$appsHeaderContainer.find(".apps_category_line").width(appsCategoryLineWidth);
					var $firstApp=$appsScrollContent.children().eq(0);
					$appsHeaderContainer.html("");
					$appsHeaderContainer.append($firstApp.clone().show().css({top:0}));
				}
				$appsList.each(function(index,value){
					var $app = $(this);
					if(isHasHeader&&$app.hasClass(appsCategoryClass)){//组
						categoryCount++;//有多少组
						//设置线的宽度
						$app.find(".apps_category_line").width(appsCategoryLineWidth);
						$appsHeaderContainer.find(".apps_category_line").width(appsCategoryLineWidth);//需要同时变
						if(index==0){
							$app.hide();	
						}else if(categoryCount>1){
							topGap=topGap+categoryTopDistance;
							$app.css({top:topGap+"px",left:0+"px"});
							categoryFlag=true;
						}
						appCount=0,x=0,y=0;	
					}else if($app.hasClass(appClass)){//具体的app
						appCount++;
						if(!categoryFlag){//上一个不是分组
							leftGap=x*leftDistance;
							topGap=categoryTop+y*appTopDistance;
							x++;
							if(leftGap+appLeftWidth+appWidth>appsWidth){
								y++;
								x=0;
							}
						}else{
							leftGap=0;
							topGap=topGap+appCategoryGap;
							categoryTop=topGap;
							categoryFlag=false;
							x=1;
						}
						$app.css({top:topGap+"px",left:leftGap+"px"});
							//为应用绑定拖拽开始dragableRangeX:[-leftAppsWidth,appsWidth],dragableRangeY:[-topAppsHeight,appsHeight],
						if(isNotResize&&typeof $app.tuiDrag==="function"){
							$app.tuiDrag({cursor:"point",onDraging:draging($app),onReadyDrag:dragReady,onStartDrag:dragStart($app),onFinshed:dragFinshed($app),revert:true,revertTime:50,proxy:{$appendTo:$("body"),cssText:{'z-index':12000}}});
							//绑定拖拽结束
						}
					}
				});//each结束	
			};
			//主函数开始
			if(isNotResize){
				appsAutoSort(true);
			}else {
				resizeSetAppsHeader();
				appsAutoSort(false);
			}
		},//tuiDesktopAppsAutoSort结束
		//tuiDesktopCloseApps开始
		tuiDesktopCloseApps:function(option){
			var _defaults={//创建新的tab页
	            tabsId:"tabs",
				desktopId:"desktop",
				appsId:"apps",
				appsGroupId:"apps_group"
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $tabs=$("#"+settings.tabsId),$desktop=$("#"+settings.desktopId), $apps=$("#"+settings.appsId),$dock=$("#dock"), $doc=$(document);
			if($doc.data("isShowTabs")){
				$tabs.show();
				$desktop.hide();
				$apps.hide();
				$.tui.tuiAddOrRemoveDesktopBg({isAdd:false});
				$.tui.tuiSetDockFixed(false,null,null,false,true);//设置dock不固定
			}else {
				$desktop.show();
				$dock.show();
				$apps.hide();
				$tabs.hide();
				$.tui.tuiAddOrRemoveDesktopBg({isAdd:true});
				var $dockBtnApps=$("#dock_btn_apps");
				$dockBtnApps.removeClass("dock_icon_apps_active").addClass("dock_icon_apps");
				$.tui.tuiDesktopPushNotice({isShow:true});
			}
		},//tuiDesktopClosApps结束
		//更改桌面整个背景开始，添加显示桌面背景，因为tab显示的时候，需要删除背景
		tuiAddOrRemoveDesktopBg:function(option){
			var _defaults={//创建新的tab页
				desktopBackgroundId:"desktop_background",
				bodyClass:"desktop_background",
				imgBgUrl:"bg_a.jpg",
				bgForIE678Id:"desktop_background_forIE678",
				isAdd:true,
				dockBgId:"dock_bg"
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var isAdd=settings.isAdd;
			var dockBgId=settings.dockBgId;
			var bgForIE678Id=settings.bgForIE678Id;
			var bodyClass=settings.bodyClass;
			var $body=$("#"+settings.desktopBackgroundId);
			if(!window.GlobalURL){
				window.GlobalURL="";			
			}
			var imgBgUrl=window.GlobalURL+"resources/tui/images/tui_desktop_bg/"+settings.imgBgUrl;
			var $bgForIE678;
			var addIE678Bg=function(){
				if($('#'+bgForIE678Id).length<1){//如果没有遮罩
					var ie678BgHTML="<img src="+imgBgUrl+" style='width:100%;height:100%;z-index:-5;position: absolute;' id="+bgForIE678Id+" />";
					$bgForIE678= $(ie678BgHTML).prependTo($body);
				}else {
					$bgForIE678=$('#'+bgForIE678Id);
					$bgForIE678.show();
				}
			};
			//内部函数结束
			if(isAdd){
				if($.tui.isIE678()){//使用img的形式设置背景图
					addIE678Bg();
				}else {$body.addClass(bodyClass);}
				$("#"+dockBgId).hide();//桌面背景显示的时候，dock不需要背景
			}else {
				if($.tui.isIE678()){
					$bgForIE678=$('#'+bgForIE678Id);
					$bgForIE678.hide();
				}else {$body.removeClass(bodyClass);}
				$("#"+dockBgId).show();
			}	
		},
		//更改整个背景结束
		//tuiDesktopShowApps开始，包含绑定滚动条等函数
		tuiDesktopShowApps:function(option){
			var _defaults={//创建新的tab页
	            tabsId:"tabs",
				desktopId:"desktop",
				appsId:"apps",
				appsContainerByCategoryId:"apps_container_byCategory",
				appsContainerByUseId:"apps_container_byUse",
				appsContainerByPinyinId:"apps_container_byPinyin",
				appsScrollbarId:"apps_scroller",
				appsScrollbarActiveClass:"thumb_white_active",
				appsScrollContentId:"apps_category_list",//滚动的内容
				appsCategoryClass:"apps_category",
				appClass:"app_icon",
				appsHeaderContainerId:"apps_header_container",
				appsGroupId:"apps_group",
				showAppsType:null//1代表是show种类的，2是按照时间排序，3是按照a-z排序
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $tabs=$("#"+settings.tabsId),$desktop=$("#"+settings.desktopId),$apps=$("#"+settings.appsId),$dock=$("#dock"),appsCategoryClass=settings.appsCategoryClass;
			var $doc=$(document),$win=$(window);
			var $appsByCategory=$("#"+settings.appsContainerByCategoryId);
			var $appsByUse=$("#"+settings.appsContainerByUseId);
			var $appsByPinyin=$("#"+settings.appsContainerByPinyinId);
			var categoryArray=[];//存放所有的分组
			var currentCategory=1;//当前抽屉栏上的分组,从第二个开始判断
			var lastFinalY=0;//上一个组的序号
			var lastIsDown=true;
			var $cur=null;
			$apps.show();
			$dock.show();
			$desktop.hide();
			$tabs.hide();
			$.tui.tuiWidgetBarShowOrHide({isHide:true});//隐藏widgetBar
			$.tui.tuiAddOrRemoveDesktopBg({isAdd:true});
			$.tui.tuiDesktopPushNotice({isHide:true});
			if(typeof $.tui.tuiSetDockFixed==="function"){
				$.tui.tuiSetDockFixed(true,null,null,true);//设置dock固定
			}
			var showAppsType=settings.showAppsType;	
			if($doc.data("showAppsType")&&!showAppsType){//如果没有传入从data里面取值
				showAppsType=$doc.data("showAppsType");
			}else if(!$doc.data("showAppsType")&&!showAppsType){//如果都没有值，这默认是1
				showAppsType=1;
			}
			var setAppsHeaderAndScrollbar=function($appsHeaderContainer,$appsScrollbar,$appsScrollContent,appsScrollContentId){
				$appsHeaderContainer.html("");
				var $firstApp=$appsScrollContent.children().eq(0);
				$appsHeaderContainer.append($firstApp.clone().show().css({top:0}));
				$firstApp.hide();
				/****滚动条设置开始********/
				//滚动过程中的函数，抽屉栏更换开始
				var getCategoryArray=function(){
					var array=[];
					var $appsList=$appsScrollContent.children();
					$appsList.each(function(index,value){
						var $app = $(this);
						if($app.hasClass(appsCategoryClass)){//组
							array.push($app);
						}
					});
					return array;
				};
				//滚动时函数，用于抽屉框替换
				var headerTitleChange=function(finalX,finalY,scrollDistance,event){
					var length=categoryArray.length;//一共多少分组
					var isDown;//向下
					var changePosion=-13;
					if(length<=1||currentCategory<0||currentCategory>length){//如果只有一个需要滚动替换
						return false;
					}
					if(finalY>=lastFinalY){
						isDown=true;
					} else {
						isDown=false;
					}
					if(lastIsDown!=isDown){//上下滚动变化时
						if(isDown){
							currentCategory=currentCategory+1;
							$cur=categoryArray[currentCategory];
						}else {
							currentCategory=currentCategory-1;
							$cur=categoryArray[currentCategory];
						}
					}
					lastFinalY=finalY;
					lastIsDown=isDown;
					if($cur){
						/*if(!isDown&&currentCategory==0){
							$cur.show();
						}*/
						var $curTop=$cur.position().top;
						if(isDown&&$curTop<=changePosion){//向下滚动
							$appsHeaderContainer.html("");
							$appsHeaderContainer.append($cur.clone().css({top:0}));
							currentCategory++;
							$cur=categoryArray[currentCategory];
						}else if(!isDown&&$curTop>changePosion){//向上滚动
							currentCategory--;//显示上一个的内容，所以先减
							$cur=categoryArray[currentCategory];
							if($cur){
								$appsHeaderContainer.html("");
								$appsHeaderContainer.append($cur.clone().show().css({top:0}));
							}else if(currentCategory<=0){//针对等于0时的异常处理
								if(categoryArray[0]){categoryArray[0].hide();}
								currentCategory=0;
							}
						}
					}
				};
				//滚动过程中的函数，抽屉栏更换结束
				//绑定滚动条方法
				var initAppsScrollbar=function(isResize){
					if(!isResize){
						if(categoryArray.length==0){//如果没有值，初始化，取得值.headerTitleChange时使用
							categoryArray=getCategoryArray();
							$cur=categoryArray[currentCategory];
						}
						if($appsScrollbar.get(0)&&typeof $appsScrollbar.tuiScrollbar==="function"){
							$appsScrollbar.tuiScrollbar({scrollContentId:appsScrollContentId,activeClass:settings.appsScrollbarActiveClass,onScrolling:headerTitleChange});	
						}
					}else {
						if($appsScrollbar.get(0)&&typeof $appsScrollbar.tuiScrollbar==="function"){
//2013-2-19,这个不执行	headerTitleChange方法					//$appsScrollbar.tuiScrollbar({scrollContentId:appsScrollContentId,isOnlyResizeBarHeight:true});
							$appsScrollbar.tuiScrollbar({scrollContentId:appsScrollContentId,activeClass:settings.appsScrollbarActiveClass,onScrolling:headerTitleChange});	
						}
					}
				};
				initAppsScrollbar(false);
				$win.off("resize.tuiApps").on("resize.tuiApps",function(){
					initAppsScrollbar(true);
				});
			    /*********设置滚动条结束****/
			};//showAppsWidthHeader结束
			//主函数开始
			//设置表头
			if(showAppsType==1){//按照种类显示开始
				$doc.data("showAppsType",1);
				var $scrollbar=$("#"+settings.appsScrollbarId),$scrollContent=$("#"+settings.appsScrollContentId),$headerContainer=$("#"+settings.appsHeaderContainerId);
				setAppsHeaderAndScrollbar($headerContainer,$scrollbar,$scrollContent,settings.appsScrollContentId);
				$appsByUse.hide();
				$appsByPinyin.hide();
				$appsByCategory.show();
				$("#apps_category_title").addClass("btn_app_group_select_left").removeClass("btn_app_group_left");
				//$("#apps_pinyin_title").removeClass("btn_app_group_select_left").addClass("btn_app_group_left");
				$("#apps_use_title").removeClass("btn_app_group_select_right").addClass("btn_app_group_right");
			}else if(showAppsType==2){//按照种类显示结束,按照使用次数显示开始
				$doc.data("showAppsType",2);
			    $.tui.tuiDesktopAppsManage({showAppsType:2});
				$appsByUse.show();
				$appsByPinyin.hide();
				$appsByCategory.hide();
				$("#apps_category_title").removeClass("btn_app_group_select_left").addClass("btn_app_group_left");			//$("#apps_pinyin_title").removeClass("btn_app_group_select_left").addClass("btn_app_group_left");
				$("#apps_use_title").addClass("btn_app_group_select_right").removeClass("btn_app_group_right");
			}else if(showAppsType==3){//按照次数显示结束,按照a-z显示开始
				$doc.data("showAppsType",3);
				$appsByUse.hide();
				$appsByPinyin.show();
				$appsByCategory.hide();
				$("#apps_category_title").removeClass("btn_app_group_select_mid").addClass("btn_app_group_mid");
				$("#apps_pinyin_title").addClass("btn_app_group_select_left").removeClass("btn_app_group_left");
				$("#apps_use_title").removeClass("btn_app_group_select_right").addClass("btn_app_group_right");
			}
		},//tuiDesktopShowApps结束
		//桌面提示消息的管理
		tuiDesktopPushNotice:function(option){
			var _defaults={//系统的默认参数
				pushNoticeId:"push_notice",
				isHide:false,//
				isShow:true,
				isTempShow:false,//临时显示，然后消失
				showTime:1000,//毫秒，临时显示时间
				notice:[]//通知的内容数字
			};
			//进行参数的准备------------------------
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $pushNotice=$("#"+settings.pushNoticeId);
			var noticeArray=settings.notice;
			//setNotice内容
			var setContent=function(){
				if(noticeArray&&noticeArray[0]&&!isNaN(noticeArray[0])){
					$("#left_notice").text(noticeArray[0]);
				}
				if(noticeArray[1]&&!isNaN(noticeArray[1])){
					$("#right_notice").text(noticeArray[1]);
				}
			};
			var showNotice=function(){
				$pushNotice.show();
				setContent();
			};
			if(settings.isHide){
				$pushNotice.hide();
			}else if(settings.isShow){
				showNotice();
			}
			if(settings.isTempShow){
				showNotice();
				setTimeout(function(){
					$pushNotice.hide();
				},settings.showTime);
			}
			
		},//tuiDesktopPushNotice
		//按照使用次数显示app,记录点击次数，显示到容器内，主要是管理byUse和buPinyin的
		tuiDesktopAppsManage:function(option){
			var _defaults={//系统的默认参数
				appsId:"apps",
				isSort:true,//重新排序显示
				appsContainerByCategoryId:"apps_container_byCategory",
				appsContainerByUseId:"apps_container_byUse",
				appsContainerByPinyinId:"apps_container_byPinyin",
				maxUseAppsCount:20,//by use里面最多显示的app个数
				showAppsType:2//1代表是show种类的，2是按照使用次数排序，最多20个；3是按照a-z排序
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $appsByCategory=$("#"+settings.appsContainerByCategoryId);
			var $appsByUse=$("#"+settings.appsContainerByUseId);
			var showAppsType=settings.showAppsType;
			var maxUseAppsCount=settings.maxUseAppsCount;
			//list中存储的只是appid和顺序，需要根据这些appid的顺序，调整.在按种类排序里，存储是全部的apps,通过id取得值，然后放在
			//根据使用次数排序
			var setAppsToContainerByUse=function(){
				var timesStorageName="appOpenTimes";
				var openTimesObj=$.tui.tuiLocalStorage({storageName:timesStorageName,handle:"get"});
				var timesArray=new Array;
				var appsArray=new Array;
				if(openTimesObj){
					for(var appid in openTimesObj){
						var $app=$appsByCategory.find("#"+appid).clone();
						$app.attr("id","byUse_"+appid);
					 	timesArray.push(openTimesObj[appid]);
						appsArray.push($app);
					}
					//冒泡排序
					var sortFlag=true;
					var n=timesArray.length;
					for(var i=0;i<n&&sortFlag;i++){
						sortFlag=false;
						for(var j=0;j<n-i;j++){
							if(timesArray[j]>timesArray[j+1]){
								sortFlag=true;
								tempTimes=timesArray[j];
								timesArray[j]=timesArray[j+1];
								timesArray[j+1]=tempTimes;
								tempApps=appsArray[j];
								appsArray[j]=appsArray[j+1];
								appsArray[j+1]=tempApps;
							}
						}
					}
					if(appsArray&&appsArray.length>0){
						$appsByUse.html("");
						for(var i=0;i<appsArray.length;i++){
							if(i>=maxUseAppsCount) break;//最多20个 
							$appsByUse.prepend(appsArray[i]);
						}
					}
				}//if openTimesObj结束
				
			};//setAppsToContainerByUse结束
			//$appsByUse容器里
			if(showAppsType==2){
				setAppsToContainerByUse();
				$.tui.tuiDesktopAppsAutoSort({appsScrollContentId:"apps_container_byUse",isHasHeader:false,isNotResize:true});
			}
		}
	});//extend结束
})(jQuery);