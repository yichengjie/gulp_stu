/**                                                    
 * tuiWidget为GUI项目中桌面右侧的快捷启动          
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  hjdang@travelsky.com 党会建               
 * @version 1.6                    
 * @see                                                
 *	HISTORY                                            
 * 2012-11-27下午04:08:08 创建文件
 * 2012-12-17下午09:08:08 将本地存储独立出来，加resize事件
 * 2013-1-23 开始与数据库结合 
 * 2013-2-16 与页面联合调试 
 * 2013-2-26 1.5.1   widget显示隐藏时，计算宽度，showUrl传入一个数组
 * 2013-2-28 1.5.2 点击关闭widget也会关闭widget管理的状态 
 * 2013-4-15 1.6   当多tab情况下，改造窗口大小，widget 摆放挤到一起 
 * 2013-5-27 1.7   当widget大小不一时，自动使用大小
 * 2013-6-17 1.8   用户widget显示可以设置没有边框，主要是天气时使用
 **************************************************/
 ;(function($){
	$.tui=$.tui||{};//命名空间
	$.extend($.tui,{
		tuiWidgetInit:function(option){//系统刚登陆时初始化
			var _defaults={//系统的默认参数
				dockId:"dock",
				appsId:"apps",
				widgetId:"widget",
				desktopWidgetApps:{},//默认桌面显示的widget
				animateTime:300,//隐藏和显示的动画时间。
				appBtnBorder:90,//应用程序按钮之间的边界
				widgetBarWidth:147
			};
			//进行参数的准备------------------------
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $widget=$("#"+settings.widgetId);
			var appHeight=140;
			//内部方法开始——————————————————————————————
			var displayWidget=function(){
				var $widgetList=$widget.find(".widget_app");
				var allWidgetCount=$widgetList.length;
				if(allWidgetCount>0&&!window.widgetList){//在第一次初始化的时候执行
					window.widgetList=new TUIList();//如果不存在则创建
					$widgetList.each(function(index){
						var $widgetApp=$(this);
						window.widgetList.add(new TUINode($widgetApp.get(0).id,null));//将id数据保存在链表中，用于位置的重新计算
						//initWidgetEvent($widgetApp);//绑定drag事件
					});
				}
				$widget.data('hideTopWidgetCount',0);
				var $widgetDownBtn=$('#widget_down_container');
				var $widgetUpBtn=$('#widget_up_container');
				$widgetDownBtn.hide();
				$widgetUpBtn.hide();
				if(allWidgetCount<=0) {return false;};
	
				$.tui.tuiResetWidgetBar(0,null);
			};//displayWidget结束
			//给上下的按钮绑定事件
			var initBindBtnEvent=function(){
				//处理应用框上下按钮
				$("#widget_down_container").off("click.tuiWidget").on("click.tuiWidget",function(){//向下按钮的方法
					var $widgetList=$widget.find(".widget_app");//需要获得list
					var allWidgetCount=$widgetList.length;
					var curTopAppsCount=$widget.data('hideTopWidgetCount')||0;//得到当前的偏移量
					var remCount=allWidgetCount-curTopAppsCount;//除去偏移量，剩余的按钮个数
					var remHeight=appHeight*remCount;//得到剩余的按钮的总高度
					if(remHeight>=$widget.height()){//如果当前显示的按钮还有没显示完的
						curTopAppsCount++;//偏移量增1
						$widget.data('hideTopWidgetCount',curTopAppsCount);//写入偏移量
						$.tui.tuiResetWidgetBar(150,null);//重绘按钮位置
					}
				});
				$("#widget_up_container").off("click.tuiWidget").on("click.tuiWidget",function(){//向下按钮的方法
					var curTopAppsCount=$widget.data('hideTopWidgetCount')||0;//得到当前的偏移量
					if(curTopAppsCount>0){//如果当前显示的按钮还有没显示完的
						curTopAppsCount--;//偏移量增1
						$widget.data('hideTopWidgetCount',curTopAppsCount);//写入偏移量
						$.tui.tuiResetWidgetBar(150,null);//重绘按钮位置
					}
				});
			};//绑定事件结束
			displayWidget();
			initBindBtnEvent();
			$.tui.tuiWidgetDesktopShowOrAdd({desktopWidgetApps:settings.desktopWidgetApps});
		},//tuiWidgetInit结束
		//设置各个widget的位置
		tuiResetWidgetBar:function(duration,except,event){
			var _defaults={//系统的默认参数
				dockId:"dock",
				appsId:"apps",
				widgetId:"widget",
				animateTime:300,//隐藏和显示的动画时间。
				appBtnBorder:90,//应用程序按钮之间的边界
				widgetBarWidth:147
			};
			//进行参数的准备------------------------
			var settings=$.extend({},_defaults);//读取默认参数参数
			var $widget=$("#"+settings.widgetId);
			var widgetHeight=$widget.height()-40;
			var duration=duration||0;
			var appHeight=140;
			var listCount=0;
			if(window.widgetList&&window.widgetList.count){
				listCount=window.widgetList.count;
			}
			var hideTopWidgetCount=$widget.data('hideTopWidgetCount')||0;//获得图标的偏移量
			var $widgetDownBtn=$('#widget_down_container');
			var $widgetUpBtn=$('#widget_up_container');
			//获取当前一共有多少app显示
			var getShowCount=function(){
				var $apps=$widget.find(".widget_app");
				var result=0;
				$apps.each(function(index){
					if($(this).css("display")!=="none"){
					 result++;	
					}
				});
				return result;
			};	
			var toShow=function(top,$app){//闭包，对于动画结束后的操作中，由于用到了top和$app，因此这两个变量不会被销毁。但是，由于该变量在链式作用域中，都引用同一个变量，因此，在动画结束后，循环可能已经过去很多，里面的变量引用极可能已经改变，因此，要通过闭包函数，将参数单独存入函数中。
				return function(){
					if(!(top<0||(top+$app.height())>widgetHeight)){//如果不是隐藏的条件
						$app.show();//显示
					}
				};
			};
			var showAllList=function(){
				//动画设置，每一个在链表中保存的元素id，都会被遍历，在遍历的每一个元素中计算应该存在的位置
				for(var i=0;i<listCount;i++){
					if(i==except){//对于except的元素，不进行处理
						continue;
					}
					var $app=$widget.find('#'+window.widgetList.get(i).data);//获得链表中data值，从而得到链表所记录的元素
					$app.stop();//停掉当前正在进行的所有的动画，便于重新设置动画
					var top=(i-hideTopWidgetCount)*appHeight;//（i-hideTopAppsCount）的意思是要根据当前的偏移个数来计算哪个应用在第一个位置显示
					if(window.widgetList.get(i).simple){//是否参与排序，推拽的不参与排序，推拽中的，不进行重绘
						if(top<0){//如果该按钮在容器的上边界之上或者该按钮不能全部显示在容器中，则隐藏
							$app.hide();
							$widgetUpBtn.show();	
						}else if((top+appHeight)>widgetHeight){
							$app.hide();
							$widgetDownBtn.show();
						}
						$app.animate({top:(top+24)+'px',left:"24px"},duration,toShow(top,$app));//思路：要隐藏的按钮要在动画开始前隐藏，而要显示的按钮要在动画之后显示。
					}
				}
				if(hideTopWidgetCount==0){//在resize的时候，如原来upbtn按钮显示，没有关闭的判断
					$widgetUpBtn.hide();	
				}
			};
			//执行主函数
			if(event&&event.type==="resize"){//提高事件的效率，提前判断移动距离
				if($widget.css("display")=="none"){
					return false;	
				}
				var widgetHeight=$widget.height()-40;
				if(hideTopWidgetCount!=0){
					$widgetUpBtn.show();	
				}
				if(listCount&&(listCount-hideTopWidgetCount)*appHeight>widgetHeight){
					$widgetDownBtn.show();
				}
				var appsCanShowCount=Math.floor(widgetHeight/appHeight);
				var appsCurShowCount=getShowCount();
				var hideTopWidgetCount=$widget.data('hideTopWidgetCount')||0;//得到当前的偏移量
				if(appsCurShowCount&&appsCanShowCount<appsCurShowCount){//隐藏
					var diff=appsCurShowCount-appsCanShowCount;
					for(var i=1;i<=diff;i++){
						var posion=hideTopWidgetCount+appsCurShowCount-i;//list中是从0开始计数的,原来的那个隐藏
						var node=window.widgetList.get(posion);
						if(!node) break;
						var $hiddernApp=$widget.find('#'+node.data);
						$hiddernApp.hide();
					}
				}else if(appsCurShowCount&&appsCanShowCount>appsCurShowCount){
					var diff=appsCanShowCount-appsCurShowCount;//差值
					if(hideTopWidgetCount+appsCanShowCount<=window.widgetList.count){//不能全部放下,同时可能上面有隐藏的
					//下面的app一个个出现
						for(var i=1;i<=diff;i++){//此处有bug,11-16回来时更改
							var posion=hideTopWidgetCount+appsCurShowCount+i-1;//list中是从0开始计数的
							var node=window.widgetList.get(posion);
							if(!node) break;
							var $showApp=$widget.find('#'+node.data);
							var top=(appsCurShowCount+i-1)*appHeight;
							$showApp.animate({top:(top+24)+'px',left:"24px"},duration,toShow(top,$showApp));
						}
					}else {//如果都能放下,需要把hideTopAppsCount置为0从新计算
						$widget.data('hideTopWidgetCount',0);
						showAllList();
					}
				}
			}else {
				showAllList();
			}
		},//tuiResetWidgetBar结束
		//向桌面上或者tabs上添加widget，widget可以添加多个
		//如果tab打开状态，widget栏打开，widget单击，如果桌面上已有，该widget,则显示，如果没有则是添加，但是不保存。添加完后，widget栏消失。在tab上显示的widget,处于编辑状态，可以关闭。
		//桌面情况下，widget栏打开，桌面上显示的widget处于编辑状态，可以删除修改等。将widget单击是添加widget。
		tuiWidgetDesktopShowOrAdd:function(option){
			var _defaults={//系统的默认参数
				deaktopId:"desktop",
				widgetAppsCloneId:"widget_apps_clone",
				storageName:"desktopWidgetApps",
				widthAndHeight:"",//要显示的应用在桌面上的长高
				isAdd:false,
				isResize:false,//当窗口变化时，需要重新计算
				widgetDesktopAppIdPre:"widget_desktop_app_",
				url:"",//需要打开显示的页面，因为可以添加多个，该url仅是添加新的功能
				animateTime:300,//隐藏和显示的动画时间。
				widgetBarWidth:147,
				maxCount:15,//最大的应用数，用于表示快捷栏上的应用图标最多有多少个
				desktopWidgetApps:{}//初始化时，默认桌面有用户自己存储的widget,从数据库读取数据，然后传入
			};
			//进行参数的准备------------------------
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $desktop=$("#"+settings.deaktopId);
			var $widgetAppsClone=$("#"+settings.widgetAppsCloneId);
			var storageName=settings.storageName;
			var isAdd=settings.isAdd;
			var widgetDesktopAppIdPre=settings.widgetDesktopAppIdPre;
			var desktopWidgetApps=settings.desktopWidgetApps;
			var isConsistent=false;
			//查看取得最大的appid的值
			var $widgetDesktopApps=$desktop.find(".widget_desktop_app");
			if($widgetDesktopApps.size()>=settings.maxCount){
				alert("仅能"+settings.maxCount+"个widget");
				return false;	
			}
			//取得当前最大的appid
			var getWidgetDesktopMaxId=function(){
				var idArray=[];
				var $widgetDesktopApps;
				if($widgetAppsClone.get(0)&&$widgetAppsClone.css("diplay")!=="none"){//tabs情况下添加
					$widgetDesktopApps=$widgetAppsClone.find(".widget_desktop_app");
				}else {//桌面上添加
					$widgetDesktopApps=$desktop.find(".widget_desktop_app");
				}
				$widgetDesktopApps.each(function(index){
					idArray.push(parseInt($(this).attr("appid")));
				});
				idArray.sort( function(a,b){return a-b;});
				return idArray[parseInt(idArray.length-1)];
			};
			//向桌面上添加应用，刷新和初始化时使用，如果resize,调用其他接口
			var addWidgetDesktop=function(databaseId,desktopWidgetApps){
				var perfixUrl="";
				try{
					perfixUrl=window.GlobalURL.replace(/\/$/g,"");
				}catch(e){console.log(e);}
				var showUrl=perfixUrl+desktopWidgetApps[databaseId].showUrl;
				var configUrl=perfixUrl+desktopWidgetApps[databaseId].configUrl;
				var urlParam=desktopWidgetApps[databaseId].urlParam;
				var width=desktopWidgetApps[databaseId].width;
				var height=desktopWidgetApps[databaseId].height;
				var widgetType=desktopWidgetApps[databaseId].widgetType;
				var isNoBorder=desktopWidgetApps[databaseId].isNoBorder;
				var noBorderStyle="";
				if(isNoBorder&&isNoBorder==="true"){
					noBorderStyle="border:none;box-shadow:none;";
				}
		        if(!width){width=200;}
				if(!height){height=200;}
				var iframeUrl=encodeURI(encodeURI(showUrl+"?"+urlParam+"&appid="+databaseId));
				var appId=widgetDesktopAppIdPre+databaseId;
				var dragId="widget_desktop_app_drag"+databaseId;
				var iframeBoxId="widget_iframe_box_"+databaseId;
				var iframeContent="widget_iframe_content_"+databaseId;
				//20130617,如果用户设置不显示边框 widget_desktop_app 需要加上style
				var html=
				'<div id="'+appId+'" apptype="'+widgetType+'" class="widget_desktop_app" appid="'+databaseId+'" style="width:'+width+'px;height:'+height+'px;'+noBorderStyle+'">\
					<div id="'+dragId+'" class="widget_desktop_app_drag">\
					</div>\
					<div class="desktop_app_config">\
						<div class="config_btn close" title="删除" onclick="$.tui.tuiWidgetManage({isDel:true,object:this,eventObj:event})"></div>\
						<div class="config_btn refresh" title="刷新" onclick="$.tui.tuiWidgetManage({isRefresh:true,object:this,eventObj:event})"></div>\
						<div class="config_btn config" title="设置"\
							 onclick="$.tui.tuiWidgetManage({isConfig:true,eventObj:event,object:this,urlParam:\''+urlParam+'\',configUrl:\''+configUrl+'\',showUrl:\''+showUrl+'\'})">\
						</div>\
					</div>\
					<div class="widget_app_iframe" id="'+iframeBoxId+'">\
						<iframe frameborder="0" name="'+iframeContent+'" class="widget_iframe" id="'+iframeContent+'"src="'+iframeUrl+'"scrolling="auto" allowtransparency="true" style="background-color:transparent;width:'+width+'px;height:'+height+'px"></iframe>\
					</div>\
				</div>';
				if($widgetAppsClone.get(0)&&$widgetAppsClone.css("diplay")!=="none"){//tabs情况下添加
					$widgetAppsClone.append(html);
					//var minLeft=118+parseInt($widgetAppsClone.css("right").replace("px",""));
				}else {//桌面上添加
					$desktop.append(html);//如果最后添加，拿不到iframe里面的高度
					//var minLeft=118+parseInt($desktop.css("right").replace("px",""));
				}
				var $app=$("#"+appId);
				var appObject=new Object;
				appObject[databaseId]=new Object;
				appObject[databaseId]=desktopWidgetApps[databaseId];
				if(!isConsistent||isAdd){//不一致或者新增left top zindex重新算
					$.tui.tuiResetWidgetDesktop({isPosionInit:true,isAdd:isAdd,$widgetApp:$app,appObject:appObject});
				}else {//从本地存储中取值
					appObject[databaseId].left=desktopWidgetApps[databaseId].left;
					appObject[databaseId].top=desktopWidgetApps[databaseId].top;
					appObject[databaseId].zIndex=desktopWidgetApps[databaseId].zIndex;
					$.tui.tuiResetWidgetDesktop({isPosionInit:false,$widgetApp:$app,appObject:appObject});
				}
			};//addWidgetDesktop结束
			//显示所有
			var showAllWidgetDesktop=function(){
				/*引入本地存储，本地和数据库同步策略。以数据库为主，如果不一致，清空本地存储，从新计算。数据库存id，从数据库中删除按照这个id删。*/
				isConsistent=$.tui.tuiLocalStorage({storageName:storageName,verifyObject:desktopWidgetApps,verifyAttr:["showUrl","urlParam"],handle:"consistent"});
				if(isConsistent){
					desktopWidgetApps=$.tui.tuiLocalStorage({storageName:storageName,handle:"get"});
				}else {
					$.tui.tuiLocalStorage({storageName:storageName,handle:"clear"});	
				}
				if(desktopWidgetApps){
					for(var databaseId in desktopWidgetApps){
						addWidgetDesktop(databaseId,desktopWidgetApps);
					}//for循环结束
				}//if结束
			};//showAllWidgetDesktop结束
			//执行函数开始
			if(isAdd){
				var configUrl="";
				var showUrl="";
				var isNoBorder="false";//20130618,是否有边框
				var urlArray=settings.showUrl.split(",");
				if(urlArray&&urlArray.length&&urlArray.length==2){
					showUrl=urlArray[0];
					configUrl=urlArray[1];
				}else if(urlArray&&urlArray.length&&urlArray.length==1){
					showUrl=urlArray[0];
				}else if(urlArray&&urlArray.length&&urlArray.length==3){
					showUrl=urlArray[0];
					configUrl=urlArray[1];
					isNoBorder=urlArray[2];
				}
				var urlParam=settings.urlParam;
				var widgetType=settings.widgetType;
				//向数据库中写入,返回databaseId,如果失败,则设置databaseId为-1
				var databaseId=getWidgetDesktopMaxId()+1;
				if(isNaN(databaseId)){
					databaseId=1;	
				}
				var addObject=new Object;
				addObject[databaseId]=new Object;
				addObject[databaseId].showUrl=showUrl;
				addObject[databaseId].configUrl=configUrl;
				addObject[databaseId].widgetType=widgetType;
				addObject[databaseId].urlParam=urlParam;
				addObject[databaseId].isNoBorder=isNoBorder;
				var widthAndHeight=settings.widthAndHeight.split(",");
				if(widthAndHeight&&widthAndHeight.length==2){
					addObject[databaseId].width=widthAndHeight[0];
					addObject[databaseId].height=widthAndHeight[1];
				}				
				addWidgetDesktop(databaseId,addObject);
				//为ajax传给后台做准备,将新增传递回数据库
				//UrlParam已经拼接，由下面3部分组成 "configParam=""&widgetConfigName=""&widgetOtherConfig=";
				$.postJSON(window.GlobalURL+"abframe/dockWidget/insertWidget","id="+databaseId+"&"+urlParam+"&widgetType="+widgetType);
			}else {
				showAllWidgetDesktop();
			}
		},//tuiWidgetDesktopShowOrAdd结束
		tuiWidgetManage:function(option){
			var _defaults={//系统的默认参数
				isDel:false,
				isRefresh:false,
				isConfig:false,
				eventObj:null,
				configUrl:"",
				showUrl:"",
				urlParam:"",
				object:null,
				storageName:"desktopWidgetApps"
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var isDel=settings.isDel,isRefresh=settings.isRefresh,isConfig=settings.isConfig,storageName=settings.storageName;
			var object=settings.object, event=settings.eventObj;
			if(event){
				event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡
				event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue 			
			}
			var $widgetDesktopApp=$(object).parent().parent(".widget_desktop_app");
			var delWidgetApp=function(){
				var databaseId=$widgetDesktopApp.attr("appid");
				$.tui.tuiLocalStorage({id:databaseId,handle:"remove",storageName:storageName});
				$widgetDesktopApp.remove();
				//从数据库中删除
				//为ajax传给后台做准备,将新增传递回数据库
				var widgetType=$widgetDesktopApp.attr("apptype");
				$.postJSON(window.GlobalURL+"abframe/dockWidget/deleteWidget","id="+databaseId+"&widgetType="+widgetType);
			};
			//刷新内部
			var refWidgetApp=function(){
				var iframeObject=$widgetDesktopApp.find(".widget_iframe").get(0);
				if(iframeObject){
					var src=iframeObject.src;
					iframeObject.src=src;
				}
			};
			//跳转到设置
			var configWidgetApp=function(){
				var configUrl=settings.configUrl;
				var urlParam=settings.urlParam;
				var showUrl=settings.showUrl;
				var databaseId=$widgetDesktopApp.attr("appid");
				//从内部的页面取得urlParam,内部显示页面存储id是urlParam,如果静态页面有跨域问题，取得不到值
				var iframeObject=$widgetDesktopApp.find(".widget_iframe").get(0);
				if(iframeObject&&iframeObject.contentWindow.document.getElementById("urlParam")){
					urlParam="showUrl="+showUrl+"&id="+databaseId+"&"+iframeObject.contentWindow.document.getElementById("urlParam").value;
				}else {urlParam="showUrl="+showUrl+"&id="+databaseId;}
				var iframeUrl=encodeURI(encodeURI(configUrl+"?"+urlParam));
				//var iframeObject=$widgetDesktopApp.find(".widget_iframe").get(0);
				//$widgetDesktopApp.addClass("widget_desktop_app_transform");
				$widgetDesktopApp.find(".config").hide();
				if(iframeObject){
					iframeObject.src=iframeUrl;
					$widgetDesktopApp.find(".widget_desktop_app_drag").trigger("mousedown");//主要是为了把z-index提高
					$widgetDesktopApp.find(".widget_desktop_app_drag").trigger("mouseup");
				}
				/*
				setTimeout(function(){
					$widgetDesktopApp.removeClass("widget_desktop_app_transform");	
				},300);
				*/
			};
			//跳转回页面
			var showWidgetApp=function(){
				var urlParam=settings.urlParam;
				var showUrl=settings.showUrl;
				var iframeUrl=showUrl+"?"+urlParam;
				var iframeObject=$widgetDesktopApp.find(".widget_iframe").get(0);
				//$widgetDesktopApp.addClass("widget_desktop_app_transform");
				if(iframeObject){
					iframeObject.src=iframeUrl;
				}
				/*
				setTimeout(function(){
					$widgetDesktopApp.removeClass("widget_desktop_app_transform");	
				},300);
				*/
			};
			if(isDel){
				delWidgetApp();
			}else if(isRefresh){
				refWidgetApp();
			}else if(isConfig){
				configWidgetApp();
			}else if(isShow){
				showWidgetApp();
			}
		},//tuiWidgetManage结束
		//桌面上图标的位置重排开始,在resize时使用
		tuiResetWidgetDesktop:function(option){
			var _defaults={//系统的默认参数
				appsId:"apps",
				deaktopId:"desktop",
				widgetId:"widget",
				widgetAppsCloneId:"widget_apps_clone",
				isResize:false,//当窗口变化时，需要重新计算
				isPosionInit:false, //初始化
				isAdd:false,
				animateTime:300,//隐藏和显示的动画时间。
				widgetBarWidth:147,
				$widgetApp:"",//如果仅调整一个传入这个值
				appObject:"",//如果一个值，这是传入的json对象
				storageName:"desktopWidgetApps"
			};
			//进行参数的准备------------------------
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $desktop=$("#"+settings.deaktopId);
			var $widgetAppsClone=$("#"+settings.widgetAppsCloneId);
			var isResize=settings.isResize;
			var isPosionInit=settings.isPosionInit;
			var isAdd=settings.isAdd;
			var storageName=settings.storageName;
			var $widgetApp=settings.$widgetApp;
			var appObject=settings.appObject;
			var $win=$(window);
			var appClass="widget_desktop_app";
			var configClass="desktop_app_config";
			var winHeight=$win.height();
			var winWidth=$win.width();
			var widgetAppTop=70;
			var dockWidth=118;
			//查看取得最大的appid的值
	
			var minLeft=0;
				//取得当前最大的z-index
			var getWidgetDesktopMaxZIndex=function(){
				var zIndexArray=[];
				var $widgetDesktopApps;
				if($widgetAppsClone&&$widgetAppsClone.get(0)&&$widgetAppsClone.css("diplay")!=="none"){//tabs情况下添加
					$widgetDesktopApps=$widgetAppsClone.find(".widget_desktop_app");
				}else {//桌面上添加
					$widgetDesktopApps=$desktop.find(".widget_desktop_app");
				}
				$widgetDesktopApps.each(function(index){
					var zIndex=$(this).css("z-index");
					if(isNaN(zIndex)){
					   zIndex=1;	
					}
					zIndexArray.push(parseInt(zIndex));
				});
				zIndexArray.sort( function(a,b){return a-b;});
				return zIndexArray[parseInt(zIndexArray.length-1)];
			};
			//设置一个,取值是从外面传入
			var resetOneWidgetDesktop=function($app,resetObject){
				if(!$app){
					return;
				}
				var zIndex=1;
				var top=0;
				var left=0;
				var contentWidth=$app.width();
				var contentHeight=$app.height();
				var maxLeft=winWidth-contentWidth-60-dockWidth;
				var $prevApp=$app.prev("."+appClass);
				if(isAdd){//显示编辑按钮
					$app.find("."+configClass).show();
				}
				var lastTop;
				var lastLeft;
				if(isPosionInit||isAdd||isResize||!resetObject){
					//如果很多,放不下了，就层叠显示
					if($prevApp.get(0)){//20130527还需要是同一大小
						var prevHeight=$prevApp.height();
						var prevWidth=$prevApp.width();
						var prevOffset=$prevApp.offset();
						top=prevOffset.top+prevHeight+15;//15是上下间隔
						var prevLeft=parseInt($prevApp.css("left").replace("px",""));
						left=prevLeft;
						if(contentWidth>prevWidth){
							left=left-parseInt(contentWidth-prevWidth);
						}
						if(top+contentHeight>winHeight){
							top=widgetAppTop;
							left=prevLeft-contentWidth-50;//50是左右间隔 2013-5-27修改
							if(left<minLeft){
								left=parseInt(prevLeft+30);
							}
						}
					}else {//第一个
						top=widgetAppTop;
						left=maxLeft;//60是距离右侧的间隔，否则那个关闭等按钮会遮住
					}
					zIndex=parseInt(getWidgetDesktopMaxZIndex()+1);
					lastTop=parseInt($app.css("top").replace("px",""));
					lastLeft=parseInt($app.css("left").replace("px",""));
					if(resetObject&&(lastTop!=top||lastLeft!=left)){
						for(var i in resetObject){//这只是一个外围的对象
							resetObject[i].left=left;
							resetObject[i].top=top;
							resetObject[i].zIndex=zIndex;
						}
						//向本地存储中设置
						$.tui.tuiLocalStorage({storageName:storageName,storageObject:resetObject,handle:"add"});
					}
				}else {//从缓存中读取
					for(var i in resetObject){
						left=resetObject[i].left;
						top=resetObject[i].top;
						zIndex=resetObject[i].zIndex;
					}
				}
				if((lastTop!=top||lastLeft!=left)){
					$app.css({top:top+"px","z-index":zIndex,left:left+"px"});
				}
			};//setOneWidgetDesktop结束
			var bindEvent=function($app){
				if(!$app){
					return;
				}
				var dragClass="widget_desktop_app_drag";
				var $drag=$app.find("."+dragClass).eq(0);
				var contentWidth=$app.width();
				//这的移动范围都是基于桌面模式考虑的，如果考虑的话，切换时需要再调整。以桌面为主了。
				var minLeft=0;
				var maxTop=winHeight-30;//50不至于全都下去
				var maxLeft=winWidth-contentWidth-60-dockWidth;//桌面上宽度已经减去dock宽度，然后居右
				$app.tuiDrag({
					onReadyDrag:function(event){//在点击之前所做的操作
						$(this).css({"z-index":20000});
					},
					onFinshed:function(x,y){
						$(this).css({"z-index":1});
						var maxZIndex=parseInt(getWidgetDesktopMaxZIndex()+1);
						$(this).css({"z-index":maxZIndex});
						var databaseId=$(this).attr("appid");
						var updateObject={left:x,top:y,zIndex:maxZIndex};
						$.tui.tuiLocalStorage({storageName:storageName,id:databaseId,storageObject:updateObject,handle:"update"});
					},
					handle:$drag,dragableRangeX:[minLeft,maxLeft],dragableRangeY:[0,maxTop],dragRange:''
				});//绑定事件结束	
			};
			//---------执行函数开始
			if(!isResize){
				resetOneWidgetDesktop($widgetApp,appObject);
				bindEvent($widgetApp);
			}else {//窗口resize时使用
				//当多tabs时改变窗口大小，因为offset仅对可见元素起作用，导致widget位置有问题
				//所以如果不是桌面情况下时，改变窗口大小，不再重新排列widget
				if($desktop.css("display")==="none"){
					return false;
				}
				var $widgetDesktopApps;
				if($widgetAppsClone&&$widgetAppsClone.get(0)&&$widgetAppsClone.css("diplay")!=="none"){//tabs情况下添加
					 $widgetDesktopApps=$widgetAppsClone.find("."+appClass);
				}else {//桌面上添加
					 $widgetDesktopApps=$desktop.find("."+appClass);
				}
				$widgetDesktopApps.each(function(){
					var $widgetApp=$(this);
					var appid=$widgetApp.attr("appid");
					var appObject;
					if(appid){
						appObject=$.tui.tuiLocalStorage({storageName:storageName,handle:"getById",id:appid});
					}
					resetOneWidgetDesktop($widgetApp,appObject);
					bindEvent($widgetApp);
				});
				
			}
		},//tuiResetWidgetDesktop
		//显示或者隐藏widget
		tuiWidgetBarShowOrHide:function(option){
			var _defaults={//系统的默认参数
				tabsId:"tabs",
				deaktopId:"desktop",
				widgetId:"widget",
				widgetAppsCloneId:"widget_apps_clone",
				pushNoticeId:"push_notice",
				widgetBarWidth:147,
				opacityBgClass:"opacity_bg",
				isHide:false,//通过其他隐藏widget,不是通过按钮
				appConfigClass:"desktop_app_config"
			};
			//进行参数的准备------------------------
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $widget=$("#"+settings.widgetId),$tabs=$("#"+settings.tabsId), $desktop=$("#"+settings.deaktopId);
			var $pushNotice=$("#"+settings.pushNoticeId),widgetAppsCloneId=settings.widgetAppsCloneId,$widgetAppsClone=$("#"+widgetAppsCloneId);
			var widgetBarWidth=settings.widgetBarWidth,appConfigClass=settings.appConfigClass, isHide=settings.isHide;
			var opacityBgClass=settings.opacityBgClass,$widgetSwitch=$("#widget_switch"),$win=$(window);
			var widgetAppsCloneMaskId=widgetAppsCloneId+"_mask",$widgetAppsCloneMask=$("#"+widgetAppsCloneMaskId);
			//隐藏widget
			var hideWidgetBar=function(){
				var widgetRight=parseInt($widget.css("right").replace("px",""));
				if(widgetRight<0||$widget.css("display")=="none"){
					return false;
				}
				$widget.animate({right:"-200px"},150,function(){
						$widget.hide();
						var $widgetDesktopApps=$widgetAppsClone.find(".widget_desktop_app");
						$desktop.append($widgetDesktopApps);
						$widgetAppsClone.remove();
						$widgetAppsCloneMask.remove();
						$widgetSwitch.removeClass("widget_switch_active").addClass("widget_switch");
						$desktop.css({right:0});
						
						$pushNotice.css({right:0});
						var $widgetDesktopApps=$desktop.find(".widget_desktop_app");
						$widgetDesktopApps.each(function(index){
							$(this).find("."+appConfigClass).hide();
						});
						var curTabsWidth=$tabs.width();
						var winWidth=$win.width();
						var modifyTabs=function(){
							var $widgetBtn=$("#tabs_widget_btn");
							$widgetBtn.removeClass("tabs_widget_active").addClass("tabs_widget");
							//修改tabsContainer
							var $tabsContainer=$("#tabs_container");
							var curTabsContainerWidth=$tabsContainer.width();
							$tabsContainer.width(parseInt(curTabsContainerWidth+widgetBarWidth));
							$.tui.tuiResizeTabs({isShowWidget:false});
							var $curTab=$tabsContainer.find(".tab_current").eq(0);
							//调整当前显示的tab
							if(window.tabsList&&$curTab.get()){
								$.tui.tuiRsetTabsPosion({$showTab:$curTab});
							}
						};
						if(curTabsWidth<winWidth){//隐藏的时候
							modifyTabs();
						}
				});
			};
			//显示widget
			var showWidgetBar=function(){
				var widgetRight=parseInt($widget.css("right").replace("px",""));
				if(widgetRight>=0&&$widget.css("display")=="block"){
					return false;
				}
				if($tabs.css("display")=="none"){//桌面修改
					$desktop.animate({right:widgetBarWidth+'px'},150,function(){
							$widget.show();
							$widget.css({right:0});
							$widgetSwitch.addClass("widget_switch_active").removeClass("widget_switch");
							$pushNotice.css({right:widgetBarWidth+'px'});
							var $widgetDesktopApps=$desktop.find(".widget_desktop_app");
							$widgetDesktopApps.each(function(index){
								$(this).find("."+appConfigClass).show();
							});
					});
				}else {//tabs状态下修改
					//鼠标点击空白处删除遮罩和克隆
					var eventDelClone=function(event){
						event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡
			            event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue 
						 if($widgetAppsClone&&event.target.id==widgetAppsCloneId){
							hideWidgetBar();
						 }
					};
					//将desktop上的widget复制到一个新的容器里显示
					var widgetAppsClone=function(){
						$widgetAppsCloneMask=$.tui.showMask(widgetAppsCloneMaskId,2001,30,null,$("body"));
						$widgetAppsCloneMask.addClass(opacityBgClass);
						$widgetAppsCloneMask.css({right:widgetBarWidth+'px'});
						$widgetAppsClone=$.tui.showMask(widgetAppsCloneId,2002,30,null,$("body"),"mousedown.tuiWidget",eventDelClone);
						$widgetAppsClone.css({right:widgetBarWidth+'px'});
						var $widgetDesktopApps=$desktop.find(".widget_desktop_app");
						$widgetDesktopApps.hide();//不让他重排和重绘ie78下出不来
						$widgetAppsClone.append($widgetDesktopApps);
						$widgetDesktopApps.show();
					};//widgetAppsClone结束
					$widget.animate({right:0},150,function(){
						$widget.show();
						$pushNotice.css({right:widgetBarWidth+'px'});
						var $widgetBtn=$("#tabs_widget_btn");
						$widgetBtn.addClass("tabs_widget_active").removeClass("tabs_widget");
						var $widgetDesktopApps=$desktop.find(".widget_desktop_app");
						$widgetDesktopApps.each(function(index){
							$(this).find("."+appConfigClass).show();
						});
						widgetAppsClone();
						//修改tabsContainer
						var $tabsContainer=$("#tabs_container");
						var curTabsContainerWidth=$tabsContainer.width();
						$tabsContainer.width(parseInt(curTabsContainerWidth-widgetBarWidth));
						var $curTab=$tabsContainer.find(".tab_current").eq(0);
						$.tui.tuiResizeTabs({isShowWidget:true});
						//调整当前显示的tab
						if(window.tabsList&&$curTab.get()){
							$.tui.tuiRsetTabsPosion({$showTab:$curTab});
						}
					});
				}
			};
			//通过按钮来切换
			var btnHideOrShow=function(){
				var widgetRight=parseInt($widget.css("right").replace("px",""));
				if(widgetRight<0||$widget.css("display")=="none"){
					showWidgetBar();
				}else{
					hideWidgetBar();
				}
			};
			//主函数开始
			if(isHide){
				hideWidgetBar();
			}else {
				btnHideOrShow();
			}
		},//tuiShowOrHideWidget结束
		//窗口变化时调整遮罩层的大小
		tuiResizeWidgetMask:function(option){
			var _defaults={//系统的默认参数
				widgetId:"widget",
				widgetAppsCloneId:"widget_apps_clone"
			};
			//进行参数的准备------------------------
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var widgetAppsCloneId=settings.widgetAppsCloneId,$widgetAppsClone=$("#"+widgetAppsCloneId);
			var widgetAppsCloneMaskId=widgetAppsCloneId+"_mask",$widgetAppsCloneMask=$("#"+widgetAppsCloneMaskId);
			if($widgetAppsCloneMask.get(0)){

				var $win=$(window);
				var winWidth=$win.width();
				var winHeight=$win.height();
				$widgetAppsClone.css({height:winHeight+"px",width:winWidth+"px"});
				$widgetAppsCloneMask.css({height:winHeight+"px",width:winWidth+"px"});
			}else {return false;}
		}
	});//extend结束
})(jQuery);