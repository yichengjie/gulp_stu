/*
 功能描述:采用tab页的方法，创建窗口，分割窗口，tab可以移动。
  该文件为eico设计的核心交互 
 *@Copyright: Copyright (c) 2012
 *@Company: 中国民航信息网络股份有限公司
 *@author:  党会建  
 *@version 0.1 2012/4/5
  @version 0.8 2012/7/5  终于完成js
  @version 1.0 2012/7/24 开始与css整合，进行大量的优化等修改。tab页的排列改完absolute形式。
  @version 1.1 2012/9/6  实现功能了，开始与桌面整合
  @version 1.2 2012/12/6 开始与widget整合
  @version 1.5 2013/1/18 加入用户点击次数记录，存储在用户本地存储中
  @version 1.6    2013/2/6  tab读取从数据库传入的isReduplicate=false值是做判断
  @version 1.6.1  2013/2/19  发现bug单全部关闭tab时，dropdown下拉，没有删除。字数最多支持4个，如果超过这显示...
  @version 1.7    2013-2-21 dock和全部应用支持isReduplicate，2个地方需要同时加上标示。dock存储的appid,就是全部应用上存储的id
  @version 1.7.1  2013-2-21 dropdow的顺序有时不对，title截取有时不对
  @version 1.9    2013-2-22 新tab创建在当前选中的tab后
  @version 1.9.3  2013-2-26 在isReduplicate情况下，如果tab隐藏，这显示不出来.修改一系列bug
  @version 1.9.4  bugfix drowdown的高度打开时，重新计算
  @version 1.9.5  bugfix 单一tab切换时，下面内容没有变
  @version 2.0.0  2013-6-13 增加功能，1，传入打开tab的原来tab的id；2，如果不是叶子节点，更改？添加逻辑
  @version 2.1.0  20130715 dock上如有isOpen属性，删除isOpen,如果dock上有，需要一并
  @version 2.1.1  20131025 machi, 修正了在IE89下，打开任何一个应用时，应用框都出现滚动条的bug
				  20131029 machi, 去掉了遗漏的console.	
 */
;(function($){
var tabsNum=0;//定义有多少个tabs
$.tui=$.tui||{};
$.extend($.tui,{
  	tuiTabsCreat:function(option){
		 var _defaults={//创建新的tab页
			title:"新建选项",
			openInNewTab:true,//是否打开新的选项卡
			obj:this,//传入的按钮的对象
			boxContainer:'box_container',//打开tab后的html
			tabContainer:'tabs_container',//打开tab放的位置
			dropDownContainer:'tabs_dropdown_container',//下拉tab的容器，存放所有的tab,隐藏和打开的使用不同的样式
			dropDownList:'tabs_dropdown_list',
			tabRightOffset:147,//右侧留得偏移量，放置增加 等其他按钮用
			headerHeight:30,
			tabWidth:147,
			titleMaxLength:4,//title最多多少个字
			tabName:'tuiNavTab',//tab id名字的开头,
			tabClass:'tab_normal',//单个tab的样式
			tabCurrentClass:'tab_current',
			tabIconClass:'tab_icon',
			tabCloseClass:'tab_current_close',
			boxName:'boxContent',//box id名字的开头
			boxContentName:'boxContent_div',
			boxIframeName:'boxContent_iframe',
			addTabBtn:'tabs_add_btn',
			isDragAndDrop:true,
			divideContentClass:"divide",//为分屏的content加的class,以便和其他的content做区分
			isReduplicate:true,//是否允许重复打开一个
			menuId:"",//20130428增加，如果是值父菜单会传入该值
			isLeaf:"",
			originTabId:null//20130613，原始的tabid,这个新的tab是页面中重新创建的
		 };
		//定义变量
		 var settings=$.extend({},_defaults,option);//读取默认参数参数
		 if(!settings.url) return false;
		 var $win=$(window), $doc=$(document),$tabs=$("#tabs"),$apps=$("#apps"),$desktop=$("#desktop"),
		 	 $dock=$("#dock"),windowWidth=$win.width(),$widget=$("#widget");
		 var tabContainerId=settings.tabContainer,tabName=settings.tabName;
		 var title=settings.title,titleMaxLength=settings.titleMaxLength,
			 winTab=tabName+(++tabsNum),
			 winTabClose="close"+winTab,
			 winTabDropDown=tabName+"DropDown"+tabsNum,
			 winBox=settings.boxName+tabsNum,
			 //winBox_content=settings.boxContentName+tabsNum,
			 winBox_iframe=settings.boxIframeName+tabsNum,
			 tabCloseClass=settings.tabCloseClass,
			 tabCurrentClass=settings.tabCurrentClass;
			 tabIcon=settings.tabIconClass;
		var $dropDownList=$("#"+settings.dropDownList), $tabsContainer=$("#"+tabContainerId);
		var isReduplicate=settings.isReduplicate,obj=settings.obj;
		if(tabIcon&&tabIcon.match(/[a-z0-9\/]{0,}.[a-z]{0,3}$/ig)){
			tabIcon="tab_icon";
		}else if(!tabIcon){
			tabIcon="tab_icon";
		}
		var $obj=null;
		if(obj instanceof jQuery){
			$obj=obj;
			obj=obj.get(0);
		}else {$obj=$(obj);}
		if(obj&&$obj.length>0){
			if(typeof isReduplicate==="string"&&isReduplicate!==""){
				try{
					var repeatArray=isReduplicate.split(",")[0].split("=");
					//需要用户传入repeat=false
					if(repeatArray[0]==="repeat"&&repeatArray[1]==="false"){
						if($obj.attr("isOpen")){
							var $toCurrentTab=$("#"+$obj.attr("isOpen"));
							if($tabs.css("display")==="none"){
								$.tui.tuiCloseOrShowTabs({isShow:true});
							}
							$.tui.tuiTabsShowOrRemove({isToCurrent:true,$tab:$toCurrentTab});
							$toCurrentTab.trigger("mousedown");
							$toCurrentTab.trigger("mouseup");
							return;
						}
						$obj.attr("isOpen",winTab);
						var appid=$obj.attr("appid");
						var objId=obj.id;
						var isDockOpen=false;//使用dock打开
						var isDockHas=false;//使用全部应用中具体应用打开时，dock上是否已有该应用
						var dockid=null;
						if(appid!==objId){//dock时，给对应应用加上
							$("#"+appid).attr("isOpen",winTab);
							isDockOpen=true;
						}else {//在全部应用，使用具体应用打开
							var dockAttrList=$dock.data("dockAttrList");
							var dockObject=dockAttrList[appid];
							if(dockObject&&dockObject.dockid){
								dockid=dockObject.dockid;
								var $dockApp=$("#"+dockid);
								isDockHas=true;
								$dockApp.attr("isOpen",winTab);
								
							}	
						}
						//将$obj的id存储到数组中
						var isOpenAppIds=$doc.data("isOpenAppIds");
						if(!isOpenAppIds){
							isOpenAppIds=[objId];
							if(isDockOpen&&appid){
								isOpenAppIds.push(appid);
							}else if(isDockHas&&dockid){
								isOpenAppIds.push(dockid);
							}
							
						}else if(isOpenAppIds.length&&isOpenAppIds.length>0){
							var isHasId=false;
							for(var i=0;i<isOpenAppIds.length;i++){
								if(objId==isOpenAppIds[i]){
									isHasId=true;
									break;
								}
							}
							if(!isHasId){
								isOpenAppIds.push(objId);
							}
							if(isDockOpen&&appid){
								isOpenAppIds.push(appid);
							}else if(isDockHas&&dockid){
								isOpenAppIds.push(dockid);
							}
						}
						$doc.data("isOpenAppIds",isOpenAppIds);
					}
				}catch(e){
					console&&console.log(e);
				}
			}
		}
		//控制显示和隐藏开始
		if($tabs.css("display")==="none"){
			$tabs.show();
			$doc.data("isShowTabs",true);
			if($apps.css("display")==="block"){//初始化时apps是否打开，为返回设置
				$doc.data("isShowApps",true);
				//如果apps隐藏，会导致滚动的位置丢失，所以需要记录下滚动的位置
				var $appsScrollContent=$("#apps_category_list");
				$doc.data("appsScrollTop",$appsScrollContent.scrollTop());
				$apps.hide();
			}else {
				$doc.data("isShowApps",false);
			}
			$desktop.hide();
			$("#tabs_switch").hide();
			$.tui.tuiSetDockFixed(false,null,null,null,true);//设置dock可以呼出
			$.tui.tuiWidgetBarShowOrHide({isHide:true});//隐藏widgetBar
			$.tui.tuiAddOrRemoveDesktopBg({isAdd:false});
			$.tui.tuiDesktopPushNotice({isHide:true});
		}
		//控制显示和隐藏结束
		//内部函数开始*************
		//利用return将函数绑定到事件
		var bindEventFunction=function(isRemove,isShow,isDrowDown){
			return function(event){ 
				event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡
				event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue   
				if(isRemove){
					$.tui.tuiTabsShowOrRemove({isRemove:true,isShow:false,$tab:$newTab,$box:$newBox,isEventBind:true,$obj:$obj});
				}else if(isShow){
					$.tui.tuiTabsShowOrRemove({isShow:true,isRemove:false,$tab:$newTab,$box:$newBox,isEventBind:true});
				}else if(isDrowDown){
					$.tui.tuiTabsShowOrRemove({isShow:true,$tab:$newTab,$box:$newBox,isDrowDown:true,isEventBind:true});
				}
			};
		};
		//计算title字的多少，对第titleMaxFont+1个字做渐变处理
		var getTitle=function(titleAll,isDrowDown){
			titleAll=$.trim(titleAll);
			var titleHtml=titleAll;
			var length=titleAll.length;
			if(length>titleMaxLength){
				var titleSub=titleAll.substr(0,titleMaxLength);
				var lastChar;
				if(!isDrowDown){
					if($.tui.isChrome()){
					   lastChar="<span class='tab_title_more'>"+titleAll.substr(titleMaxLength,1)+"</span>";
					  }else {lastChar="<span class='tab_title_more_forIE'>...</span>";}
				}else {
					lastChar="...";
				}
				titleHtml=titleSub+lastChar;
				}
			return titleHtml;
		};	
		//创建新的tab,需要判断当前打开的窗口，在当前打开窗体后面创建
		var creatNewTab=function(){
			var appUrl=settings.url,menuId=settings.menuId,isLeaf=settings.isLeaf;//20130428 传递父菜单信息
			var originTabId=settings.originTabId;//20130613,传入原始的tabid
			if(appUrl&&appUrl.indexOf("?") >= 0){
				appUrl=appUrl+"&selfTabId="+winTab;
			}else{
				appUrl=appUrl+"?selfTabId="+winTab;
			}
			if(menuId&&isLeaf&&isLeaf==="false"){
				//20130613,因为外面的url可能带？所有需要判断下？逻辑
				appUrl=appUrl+"&menuId="+menuId+"&isParent=1";
			}
			if(originTabId){//20130613,改变appUrl，用户在子页面通过controller获得2个id
			   appUrl=appUrl+"&originTabId="+originTabId;
			}
			var widgetWidth=0;
			var widgetRight=parseInt($widget.css("right").replace("px",""));
			if(widgetRight>=0){
				widgetWidth=147;
			}
			if($doc.data("isLR")){
			  $tabsContainer.css({width:parseFloat(windowWidth/2-widgetWidth)+"px"});	
			}else {$tabsContainer.css({width:parseFloat(windowWidth-widgetWidth)+"px"});}
			//关闭下拉框
			var $dropDownContainer=$("#"+settings.dropDownContainer);
			if($dropDownContainer.css("display")!=="none"){
				$dropDownContainer.fadeOut("fast");
				$("#tabs_dropdown_btn").addClass("tabs_dropdown").removeClass("tabs_dropdown_active");
				$("#dropDownMask").remove();
			}
			//新的tab
			var headerHeight=settings.headerHeight;
			var tabsMainHeight = $("#tabs").height();;
			var	tabsMainWidth = $("#tabs").width();
			var initHeight=settings.boxHeight ||tabsMainHeight-headerHeight;
			$tabsContainer.append("<div id='"+winTab+"' title='"+title+"' class='tab'><span class='"+tabIcon+"'></span>\
				"+getTitle(title)+"<span class=\""+tabCloseClass+"\" id=\""+winTabClose+"\"></span></div>");
			var $currentTab=$tabsContainer.find("."+tabCurrentClass);
			if($currentTab&&$currentTab.get(0)&&window.tabsList){
				var currentIndex=window.tabsList.findData($currentTab.get(0).id);
				var insertIndex=currentIndex+1;
				if(insertIndex>=window.tabsList.count){
					window.tabsList.add(new TUINode(winTab));
				}else {
					window.tabsList.addAt(insertIndex,new TUINode(winTab)); 
				}
			}else {
				(!window.tabsList)&&(window.tabsList=new TUIList());//如果不存在tabs列表，则创建。这个列表用id存储每个tab的位置
				 window.tabsList.add(new TUINode(winTab));
			}
			//存储所有的tab下拉开始	
			$dropDownList.children().last().find(".icon_right").remove();//删除上一个对号标志					 
			$dropDownList.append("<li  title='"+title+"' id='"+winTabDropDown+"'><span>"+getTitle(title,true)+"</span><div class=\"icon_right\"></div></li>");
			//存储所有的tab下拉结束，高度只给容器赋值，不再给具体的里面赋值
			var boxHtml='<div id=\"'+winBox+'\"  class="main_content" >\
						<iframe frameborder="0" name="'+winBox_iframe+'" id="'+winBox_iframe+'"src="'+appUrl+'"scrolling="auto" allowtransparency="true" style="width:100%; height: 100%;"></iframe></div>'; 
		//$("#"+settings.appendBox).css({width:$win.width()});//设定宽度，将来得调整，
			var $boxContainer= $("#"+settings.boxContainer);
			$boxContainer.append(boxHtml);
			if(!$doc.data("isLR")&&!$doc.data("isTB")){ 
				$boxContainer.css({height:initHeight+"px",width:tabsMainWidth+"px"});
			}
		};//创建结束
		//记录应用打开的次数
		var recordOpenTimes=function(){
			var timesStorageName="appOpenTimes";
			var $obj=$(obj);
			var appid=$obj.attr("appid");
			var openTimesObj=$.tui.tuiLocalStorage({storageName:timesStorageName,handle:"get"});
			if(openTimesObj&&openTimesObj[appid]&&appid){
				var times=openTimesObj[appid];
				times++;
				openTimesObj[appid]=times;
				$.tui.tuiLocalStorage({id:appid,storageName:timesStorageName,storageObject:times,handle:"update"});
			}else if(appid){//没存改app
				var addTimesObj=new Object;
				addTimesObj[appid]=1;
				$.tui.tuiLocalStorage({storageName:timesStorageName,storageObject:addTimesObj,handle:"add"});	
			}
			//$.tui.tuiLocalStorage({storageName:timesStorageName,handle:"clear"});
			//var timesObj=$.tui.tuiLocalStorage({storageName:timesStorageName,handle:"get"});
			//console.log(JSON.stringify(timesObj));
			
		};//recordOpenTimes
		//内部函数结束*************
		 //主体开始
		 creatNewTab();
		 recordOpenTimes();
		 var $newBox=$("#"+winBox);
		 var $newTab=$("#"+winTab);//新的tab对象
		 $newTab.data("boxId",winBox);
		 $newTab.data("dropDownId",winTabDropDown);
		 $newTab.data("tabIcon",tabIcon);
		 var $closeTab=$("#"+winTabClose);//新的tab关闭对象
		 var $dorpDownTab=$("#"+winTabDropDown);//单个dropdown的对象
		 //集中加事件的和显示开始*************************
		 // $newTab.unbind("dblclick.tuiNavTabs").bind("dblclick.tuiNavTabs",removeTabAndBox(winBox,winTab));//给tab绑定关闭事件
		 $closeTab.off("mousedown.tuiNavTabs").on("mousedown.tuiNavTabs",bindEventFunction(true,false,false));//给tab绑定关闭事件 mousedown会覆盖click
		 $newTab.off("mousedown.tuiNavTabs").on("mousedown.tuiNavTabs",bindEventFunction(false,true,false));//给tab绑定显示事件
		 $dorpDownTab.off("mousedown.tuiNavTabs").on("mousedown.tuiNavTabs",bindEventFunction(false,false,true));//给dropDown绑定事件
		 try{
			 if(settings.openInNewTab){
				 $.tui.tuiTabsShowOrRemove({isShow:true,$tab:$newTab,$box:$newBox});
			 }
		 }catch(e){console&&console.log(e);}
		  //添加拖拽事件，拖拽是单独的控件，需要判断是否引入
		 if(settings.isDragAndDrop&&typeof $newTab.tuiTabsDrag==="function"){
			$newTab.tuiTabsDrag({title:title});
		 }
		//拖拽事件结束
  	},//tuiNavTabCreat结束
	//删除一个tab
	tuiTabsShowOrRemove:function(option){
		var _defaults={//创建新的tab页
			obj:this,//传入的按钮的对象
			divideContentClass:"divide",//为分屏的content加的class,以便和其他的content做区分
			isEventBind:false,
			tabCurrentClass:'tab_current', 
			dropDownContainer:'tabs_dropdown_container',//下拉tab的容器，存放所有的tab,隐藏和打开的使用不同的样式
			dropDownList:'tabs_dropdown_list',
			boxContainer:'box_container',//打开tab后的html
			tabContainer:'tabs_container',//打开tab放的位置
			tabClass:'tab_normal',//单个tab的样式
			isRemove:false,
			isShow:false,
			isDrowDown:false,
			isToCurrent:false,
			$tab:"",
			$box:"",
			$obj:""//传递过来打开这个tab的对象，可能是dock
		 };
		//定义变量
		var settings=$.extend({},_defaults,option);//读取默认参数参数
		var $doc=$(document),tabNormalClass=settings.tabClass;
		var tabCurrentClass=settings.tabCurrentClass,$dropDownList=$("#"+settings.dropDownList);
		var divideContentClass=settings.divideContentClass;
		var isEventBind=settings.isEventBind,isRemove=settings.isRemove,isShow=settings.isShow,isToCurrent=settings.isToCurrent,isDrowDown=settings.isDrowDown;
		var $tab=settings.$tab,$box=settings.$box,tabContainerId=settings.tabContainer;
		var $tabsContainer=$("#"+tabContainerId);
		var isInTabContainer=function($item){//判断是否在主tab容器里
			if($item.parent().get(0)&&$item.parent().get(0).id===tabContainerId){
				return true;
			}return false;
		};
		//给tab加上left=0时的class
		var addCurrentLeftClass=function($item){
			var $hasCurTab=$item.siblings().filter("."+tabCurrentClass);
			if($hasCurTab&&$hasCurTab.get(0)&&$hasCurTab.css("left")=="0px"){
				$hasCurTab.addClass("tab_current tab_current_left").removeClass("tab_normal");		
			}
		};
			//是否显示
	 	var isDispaly=function($item){
			if($item.css("display")=="none"){
					return false;
			}
			return true;
		};
			//查找当前在tablist中显示的tab
		var getDisplayFirstAndLastTab=function(){
				 var showIndex={firstTab:0,lastTab:0};
				 var isShow=false;
				 var count=window.tabsList.count;
				 for(var i=0;i<count;i++){
					var $curTab=$("#"+window.tabsList.get(i).data);
					if(!isShow&&isDispaly($curTab)){
						showIndex.firstTab=i;
						isShow=true;
						continue;
					 }else if(isShow&&!isDispaly($curTab)) {
						 var lastTab=i-1;
						 showIndex.lastTab=lastTab>0?lastTab:0;
						 break;
					 }else if(isDispaly($curTab)&&i==count-1){
						  showIndex.lastTab=i;
						   break;
					 }
				 }
				return showIndex;
			 };
		 var resetDisplayTabZIndex=function(){
			 var tabsIndex=getDisplayFirstAndLastTab();
			 var firstIndex=tabsIndex.firstTab;
			 var lastIndex=tabsIndex.lastTab;
			 for(var i=firstIndex,j=0;i<=lastIndex;i++,j++){
			   var tabId=window.tabsList.get(i).data;
			   var $tab=$tabsContainer.find($("#"+tabId));
			   var zIndex=1000;
			   $tab.show();
			   zIndex=1000-j*10;
			   $tab.css({'z-index':zIndex});//此处不能使用 animate,没有执行结束，就会调用下一个函数，导致不能取得争取的left值
			  }//for循环结束
			};	 
		//这个也需要给对应的dropdown加上对号,重新改变zindex
		//这个也需要给对应的dropdown加上对号,重新改变zindex
		var toCurrent=function($item,normalCloseClass,currentCloseClass,isReZIndex){//增加关闭按钮的span,增加图标
			var $hasCurTab=$item.siblings().filter("."+tabCurrentClass);
			$hasCurTab.removeClass("tab_current tab_current_left").addClass(tabNormalClass);
			$hasCurTab.find("."+currentCloseClass).removeClass(currentCloseClass).addClass(normalCloseClass);
			$hasCurTab.find("."+$hasCurTab.data("tabIcon")).remove();
			if(isReZIndex&&$hasCurTab.get(0)){//切换的时候，如果绑定事件，不执行resetPosion方法，需要对有curClass的tab计算zindex
			   //var newIndex=1000-window.tabsList.findData($hasCurTab.get(0).id)*10;
			   //$hasCurTab.css({'z-index':newIndex});
			   resetDisplayTabZIndex();
			}
			if($item.css("left")=="0px"){
			   $item.addClass("tab_current tab_current_left").removeClass("tab_normal");		
			}else { $item.addClass(tabCurrentClass).removeClass("tab_normal tab_current_left");}
			$item.css({'z-index':1100});
			$item.find("."+normalCloseClass).removeClass(normalCloseClass).addClass(currentCloseClass);
			var icon=$item.data("tabIcon");
			try{
				if(icon&&!$item.find("."+icon).get(0)){
				   $item.prepend("<span class='"+icon+"'></span>");
				}
			}catch(e){console&&console.log(e);}
			//移动dropdown对号
			$dropDownList.children().find(".icon_right").remove();//删除上一个对号标志
			var html="<div class=\"icon_right\"></div>";			
			var dropDownId=$item.data("dropDownId");
			var $dropDownApp=$("#"+dropDownId);
			$dropDownApp.show();
			$dropDownApp.append(html);  
		};
		//删除的主函数
		function removeTabAndBox($tab,$box,isEventBind){//关闭tab和box,dropdown下拉的也需要删掉
			var $currentTab=null;//!$doc.data("isLR")&&!$doc.data("isTB")
			var $obj=settings.$obj;
			if ($obj instanceof jQuery){
				$obj.removeAttr("isOpen");
			}
			//20130715 删除isOpen,如果dock上有，需要一并删除
			var appid=$obj.attr("appid");
			if(appid){
				var $dock=$("#dock");
				var dockAttrList=$dock.data("dockAttrList");
				var dockObject=dockAttrList[appid];
				if(dockObject&&dockObject.dockid){
					var dockid=dockObject.dockid;
					var $dockApp=$("#"+dockid);
					if ($dockApp instanceof jQuery){
						$dockApp.removeAttr("isOpen");
					}
				}
			}
			//20130715  删除结束
			if(isInTabContainer($tab)){//在主屏里
				if($tab.hasClass(tabCurrentClass)){//如果是当前选中的tab,才进行找到下一个当前tab操作
					if( $tab.next().get(0)&&$box.next().get(0)){
						var $next=$tab.next();
						$currentTab=$next;
						$box.siblings().not("."+divideContentClass).hide();
						$box.next().show();
					}else if($tab.prev().get(0)&&$box.prev().get(0)){
						var $prev=$tab.prev();
						$currentTab=$prev;
						$box.siblings().not("."+divideContentClass).hide();
						$box.prev().show();
					}//if结束
				}
				if(window.tabsList){
					window.tabsList.deleteNode($tab.get(0).id);
				}
				if($currentTab){
					$.tui.tuiRsetTabsPosion({$showTab:$currentTab});//需要在toCurrent之前，因为要去掉left的值
					toCurrent($currentTab,"tab_normal_close","tab_current_close");
				}else{//没有找到,则当前不是选中的 //如果当前选中的在dropdown下面隐藏，就不能把当前选中的显示出来了
					addCurrentLeftClass($tab);//给left=0的tab加上class
					$currentTab=$tab.siblings().filter("."+tabCurrentClass);
					if($currentTab){
						$.tui.tuiRsetTabsPosion({$showTab:$currentTab});//重新移动和计算	
					}else {$.tui.tuiRsetTabsPosion({$showTab:$tab});}	
				}
				if($tabsContainer.find(".tab").length==1){//只有一个
					if(!$doc.data("isLR")&&!$doc.data("isTB")){
						$.tui.tuiCloseOrShowTabs({isClose:true});
					}else if($doc.data("isLR")||$doc.data("isTB")){
						var tools=$.tui.tuiTabsDivideTools;//分屏函数
						if(!tools){
							console&&console.log("$.tuiTabsDivideTools 没有引入，不能执行分屏等操作");
							return false;
						}
						tools({dragObject:null,isCancelDivide:true});	
					}
				}
				$("#"+$tab.data("dropDownId")).remove();
				$tab.remove();
				$box.remove();
			}else{//已经分屏的情况
				var tools=$.tui.tuiTabsDivideTools;//分屏函数
				if(!tools){
					console&&console.log("$.tuiTabsDivideTools 没有引入，不能执行分屏等操作");
					return false;
				}
				$("#"+$tab.data("dropDownId")).remove();
				$tab.remove();
				$box.remove();
				tools({dragObject:null,isCancelDivide:true});	
			}
		};//function(event)结束
		function showTabAndBox($tab,$box,isEventBind,isDropDown){//显示tab和box
			if(isEventBind){
				if(!isInTabContainer($tab)){return false;}//不在主屏里，不执行
				if($tab.css("display")=='none'||isDropDown){
					$.tui.tuiRsetTabsPosion({$showTab:$tab});
					toCurrent($tab,"tab_normal_close","tab_current_close");
					//if(isDropDown){
						//$tab.trigger("mousedown.tuiTabDrag");//触发drag的准备操作，
					//}
				}else{
					toCurrent($tab,"tab_normal_close","tab_current_close",true);
				}
				$box.siblings().not("."+divideContentClass).hide();
				$box.show();
				//showHiddenTabAndBox($tab,$box);
			}else {
				$.tui.tuiRsetTabsPosion({$showTab:$tab});//重排tabs的left 和z-index
				toCurrent($tab,"tab_normal_close","tab_current_close");
				$box.siblings().not("."+divideContentClass).hide();
				$box.show();
			}
		};
		//---执行开始----------------
		if(isRemove){
			removeTabAndBox($tab,$box,isEventBind);
		}else if(isShow){
			showTabAndBox($tab,$box,isEventBind,isDrowDown);
		}else if(isToCurrent){
			if($tab.css("display")==="none"){
				$.tui.tuiRsetTabsPosion({$showTab:$tab});//重新移动和计算
			}
			toCurrent($tab,"tab_normal_close","tab_current_close",true);
		}	
	},
  //控制下拉tab显示和隐藏
 	tuiTabsShowDropDown:function(option){//显示的时候，需要判断tab的位置，是不是隐藏。
		var _defaults={
		   dropDownBtn:'tabs_dropdown_btn',
		   addTabBtn:'tabs_add_btn',
		   dropDownContainer:'tabs_dropdown_container'//下拉tab的容器
		};
		var settings=$.extend({},_defaults,option);//读取默认参数参数
		var dropDownContainerId=settings.dropDownContainer, $dropDownContainer=$("#"+dropDownContainerId);
		var $dropDownBtn=$("#"+settings.dropDownBtn),$doc=$(document),$win=$(window);
		var $mask="";
		 //计算dropdown的高度开始
		var  getDropDownHeight=function(){
			 var newHeight;
			 var height=$win.height();
			 if($doc.data("isTB")){
				 height=$win.height()/2;
			 }
			 var maxHeight=height-40;
			 var innerHeight=window.tabsList.count*30;
			 newHeight =innerHeight+10>=maxHeight?maxHeight:innerHeight+10;
			 return  newHeight;
		};//计算dropdown的高度结束
		//按照window.tabsList对dropdown的顺序重新排序
		var resetDropDownPosion=function(){
			if(!window.tabsList) return;
			var cur=window.tabsList.head;
			var tabid="";
			var dropDowid="";
			for(var i=0;i<window.tabsList.count;i++){
				cur=cur.next;
				tabid=cur.data.replace("tuiNavTab","");
				dropDowid="tuiNavTabDropDown"+tabid;
				$("#tabs_dropdown_list").append($("#"+dropDowid));
			}
		};
		if($dropDownContainer.css('display')==="none"){
			 resetDropDownPosion();
			 $dropDownContainer.show();
			 $dropDownContainer.height(getDropDownHeight());
			 $dropDownBtn.addClass("tabs_dropdown_active").removeClass("tabs_dropdown");
			 $mask=$.tui.showMask("dropDownMask",2900,0,0,$("#tabs"),"mousedown.tuiTabsDropDown", 
					function(event) {  
						event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡
						event.preventDefault?event.preventDefault():event.returnValue = false;//防止浏览器默认行为，在IE下，为returnValue
						if(event.target.id==="dropDownMask"){
							$dropDownContainer.fadeOut("fast");
							$dropDownBtn.addClass("tabs_dropdown").removeClass("tabs_dropdown_active");
							$mask.remove();
						}
					},"opacity_bg_forIE678"
			);
		}else {
			$dropDownContainer.hide();
			$dropDownBtn.addClass("tabs_dropdown").removeClass("tabs_dropdown_active");
			if($mask){$mask.remove();}
		}
 	 },// tsNavTabShowDropDown结束
 	 //显示分屏的下拉选择开始
	tuiTabsShowDivide:function(option){
		var _defaults={
			divideTipContainer:'tabs_divideTip_container',//下拉tab的容器
			tabsDivideBtn:'tabs_divide_btn',
			tabContainer:'tabs_container',//打开tab放的位置
			tabCurrentClass:'tab_current'//当前tab的class
		};
		var $doc=$(document);
		var settings=$.extend({},_defaults,option);//读取默认参数参
		var $divideTipContainer = $("#"+settings.divideTipContainer);
		var $tabsDivideBtn = $("#"+settings.tabsDivideBtn);
		var tabContainerId=settings.tabContainer;
		var $tabsContainer=$("#"+tabContainerId);
		var $mask="";
		//如果仅有一个tab不进行分屏操作
		if(!$doc.data("isTB")&&!$doc.data("isLR")&&$tabsContainer.find(".tab").length<=1){
			return false;
		}
		var btnClickChangeClass=function(){//btn按下时改变class
			var divideAllClass=$tabsDivideBtn.attr("class");
			var divideRemoveClass=divideAllClass.match(/(tabs_divide[\w]*)/g)[0];
			var isHasActive=/_active/g.test(divideRemoveClass);
			var divideAddClass;
			if(isHasActive){
				divideAddClass=divideRemoveClass.replace(/_active/g,"");
			}else {divideAddClass=divideRemoveClass+"_active";};
			$tabsDivideBtn.removeClass(divideRemoveClass).addClass(divideAddClass);
		};
		var hideContainer=function(){
			$divideTipContainer.hide();
			btnClickChangeClass();
			if($mask){$mask.remove();}
		}
		if($divideTipContainer.css('display')==="none"){
			$divideTipContainer.show();
			btnClickChangeClass();
			$mask=$.tui.showMask("divideTipMask",2900,0,0,$("#tabs"),"mousedown.tuiTabsDivideTip", 
						   function(event) {  
							 event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡
							 event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue
							 if(event.target.id==="divideTipMask"){
								 hideContainer();
							   }
							},"opacity_bg_forIE678"
				);
		}else{	
			hideContainer();
		}
		
		//为下拉各个分屏切换的绑定事件开始
		var tools=$.tui.tuiTabsDivideTools;//分屏函数
		if(!tools){
			console&&console.log("$.tuiTabsDivideTools 没有引入，不能执行分屏等操作");
			return false;
		}
		//移动对号,和上面的图标
		var changeIcon=function(divideId,divideClass){
			var $divideList=$("#tabs_divide_list");
			$divideList.children().find(".icon_right").remove();//删除上一个对号标志
			var html="<div class=\"icon_right\"></div>";			
			$("#"+divideId).append(html);
			$tabsDivideBtn.removeClass().addClass(divideClass);
		};	
		var divide=function(type){
			return function(event){
				switch(type){
					case(0):
						if(!$doc.data("isTB")&&!$doc.data("isLR")){ break;}
						tools({dragObject:null,isCancelDivide:true});
						changeIcon("tabs_divide_normal_btn","tabs_function tabs_divide_active");
						hideContainer();
						break;
					case(1)://左右分屏
						if($doc.data("isLR")){ break;}
						tools({dragObject:null,isLRDivide:true});
						changeIcon("tabs_divide_lr_btn","tabs_function tabs_divide_lr_active");
						hideContainer();
						break;
					case(2)://上下分屏
						if($doc.data("isTB")){ break;}
						tools({dragObject:null,isTBDivide:true});
						changeIcon("tabs_divide_tb_btn","tabs_function tabs_divide_tb_active");
						hideContainer();
						break;
				}
			};
		};
		//函数主体开始
		//重新设置图标
		if($doc.data("isLR")){
			changeIcon("tabs_divide_lr_btn","tabs_function tabs_divide_lr_active");
		}else if($doc.data("isTB")){
			changeIcon("tabs_divide_tb_btn","tabs_function tabs_divide_tb_active");
		}else {
			changeIcon("tabs_divide_normal_btn","tabs_function tabs_divide_active");
		}
		$("#tabs_divide_normal_btn").off("mousedown.tuiTabsDropDown").on("mousedown.tuiTabsDropDown",divide(0));
		$("#tabs_divide_lr_btn").off("mousedown.tuiTabsDropDown").on("mousedown.tuiTabsDropDown",divide(1)); 
		$("#tabs_divide_tb_btn").off("mousedown.tuiTabsDropDown").on("mousedown.tuiTabsDropDown",divide(2));  
		//为下拉各个分屏切换的绑定事件结束
	},
  //显示分屏的下拉选择结束
	tuiCloseOrShowTabs:function(option){
		var _defaults={
		   tabs:'tabs',//打开tab放的位置
		   isMin:false,//是否最小化
		   isShow:false,
		   dropDownList:'tabs_dropdown_list',
		   isClose:false,//关闭,需要把设置isOpen的那些对象全部属性都删除
		   tabsSwitchId:"tabs_switch"
		};
		var settings=$.extend({},_defaults,option);//读取默认参数参数
		var $tabs=$("#"+settings.tabs),$tabsSwitch=$("#"+settings.tabsSwitchId),$dropDownList=$("#"+settings.dropDownList);
		var $apps=$("#apps"),$desktop=$("#desktop"),$dock=$("#dock"),$doc=$(document);
		var showTabs=function(){
			if($tabs.css("display")==="none"){
				$tabs.show();
				$doc.data("isShowTabs",true);
				if($apps.css("display")==="block"){//初始化时apps是否打开，为返回设置
					$doc.data("isShowApps",true);
					$apps.hide();
				}else {$doc.data("isShowApps",false);}
				$desktop.hide();
				$tabsSwitch.hide();
				$.tui.tuiSetDockFixed(false,null,null,false,true);//设置dock隐藏
				$.tui.tuiAddOrRemoveDesktopBg({isAdd:false});
			}	
		};
		var showAppOrDesktop=function(){
			$tabs.hide();
			$dock.show();
			$.tui.tuiSetDockFixed(true,null,null,true);//设置dock显示
			if($doc.data("isShowApps")){
				$apps.show();
				var $appsScrollContent=$("#apps_category_list");
				var top=$doc.data("appsScrollTop");
				if(top){//如果apps隐藏了，会导致top值丢失，所以需要从新设置下
					$appsScrollContent.scrollTop(top);
				}
				$desktop.hide();
			}else{
				$desktop.show();
				$.tui.tuiDesktopPushNotice({isShow:true});
				$apps.hide();
			}
			$doc.removeData("isShowApps");
			$doc.removeData("isShowTabs");
			$doc.removeData("appsScrollTop");
			$.tui.tuiAddOrRemoveDesktopBg({isAdd:true});
			$.tui.tuiWidgetBarShowOrHide({isHide:true});//隐藏widgetBar
		};
		if(settings.isMin){
			$tabs.hide();
			$tabsSwitch.show();
			$tabsSwitch.off("click.tuiTabs").on("click.tuiTabs",function(){
				$.tui.tuiCloseOrShowTabs({isShow:true});	
			});
			showAppOrDesktop();
		}else if(settings.isShow){
			showTabs();
			$tabsSwitch.off("click.tuiTabs");	
		}else if(settings.isClose){
			var isOpenAppIds=$doc.data("isOpenAppIds");
			if(isOpenAppIds&&isOpenAppIds.length&&isOpenAppIds.length>0){
				for(var i=0;i<isOpenAppIds.length;i++){
					var $objApp=$("#"+isOpenAppIds[i]);
					if ($objApp instanceof jQuery){
						$objApp.removeAttr("isOpen");
					}
				}
				$doc.removeData("isOpenAppIds");
			}
			$dropDownList.html("");
			$("#tabs_dropdown_container").hide();
			window.tabsList=null;
			$("#tabs_container_left").html("");
			$("#box_container_left").html("");
			$(".tab", "#tabs_container").remove();
			$("#tabs_container").css({top:0,left:0});
			$("#box_container").css({top:0,left:0});
			$("#box_container").html("");
			$("#tabs_container_top").html("");
			$("#box_container_top").html("");
			$("#tabs_top").hide();
			$("#box_container_left").hide();
			$("#tabs_container_left").hide();
			$("#tabs_divide_LRLine").hide();
			$("#tabs_divide_TBLine").hide();
			$("#tabs_divide_btn").removeClass().addClass("tabs_function tabs_divide");
			$("#divideTipMask").remove();
			$("#tabs_divideTip_container").hide();
			$doc.removeData("isTB");
			$doc.removeData("isLR");
			$doc.removeData("lastMouseX");
			$doc.removeData("lastMouseY");
			$doc.removeData("isTabToRight");
			$doc.removeData("isTabToMain");
			$doc.removeData("tipType");
			$doc.off(".tuiTabDivide");
			showAppOrDesktop();
		} 
	},//tuiCloseOrShowTabs结束
  	//排列tab的位置开始
	tuiRsetTabsPosion:function(option){
		var _defaults={
		   tabContainer:'tabs_container',//打开tab放的位置
		   dropDownContainer:'tabs_dropdown_container',//下拉tab的容器
		   tabRightOffset:147,//右侧留得偏移量，放置增加 等其他按钮用
		   tabWidth:147,
		   duration:100,
		   $showTab:""
		};
		var settings=$.extend({},_defaults,option);//读取默认参数参数
		var $tabsContainer=$("#"+settings.tabContainer);
		var tabRightOffset=settings.tabRightOffset;
		var duration=settings.duration;
		var $showTab=settings.$showTab;
		var $dropDownContainer=$("#"+settings.dropDownContainer);
		var tabWidth=settings.tabWidth;
		var $win=$(window);
		var $doc=$(document);
		   //计算dropdown的高度开始
		var  getDropDownHeight=function(){
			 var newHeight;
			 var height=$win.height();
			 if($doc.data("isTB")){
				 height=$win.height()/2;
			 }
			 var maxHeight=height-40;
			 var innerHeight=window.tabsList.count*30;
			 newHeight =innerHeight+10>=maxHeight?maxHeight:innerHeight+10;
			 return  newHeight;
		};//计算dropdown的高度结束
		   //重新排列tab的位置开始
		var getFirstAndLastTab=function($showTab,containerWidth){//根据传入的$showTab,来判断显示位置
			var result={firstTab:0,lastTab:0};
			var tabCount = window.tabsList.count;
			var tabId=$showTab.get(0).id;
			var tabSeq=window.tabsList.findData(tabId);
			//对应隐藏的tab显示的逻辑是,最后转成代码的算法：
			//1，查看选中tab的位置，看其离第一个近，还是最后一个tab近，比较完差值后，
			//2，检查这个差值是否在浏览器宽口宽度范围内，
			//3，如果在范围内，哪个近，哪个靠边，第一个近，第一个tab靠左，最后一个近，最后一个靠右
			//4，如果不在，则把当前选中的tab显示在浏览器宽度
			var lastTabDiff=tabCount-(tabSeq+1);
			if((lastTabDiff-tabSeq)<=0&&Math.abs(lastTabDiff+1)*134<=containerWidth){//靠右显示,
				result.lastTab=tabCount-1;
				var beforeCount=Math.floor((containerWidth-(lastTabDiff+1)*134)/134);
				var firstTab=tabSeq-beforeCount;
				result.firstTab=firstTab<0||firstTab>tabSeq?0:firstTab;
				return result;
			 }else if((lastTabDiff-tabSeq)>0&&Math.abs(tabSeq+1)*134<=containerWidth){//靠左显示
				 result.firstTab=0;
				 var afterCount=Math.floor((containerWidth-(tabSeq+1)*134)/134);
				 var lastTab=tabSeq+afterCount;
				 var endTab=tabCount-1;
				 result.lastTab=lastTab>endTab?endTab:lastTab;
				 return result;	
			 }else {//最后居中
				  var otherCount=Math.floor((containerWidth)/134)-1;
				  var after= Math.abs(otherCount/2);
				  var before=otherCount-after;
				  result.firstTab=tabSeq-before;
				  result.lastTab=tabSeq+after;
				  return result;
			}
		};
		var resetTabsPosion=function(duration,$container,$showTab){
		//第一个动画事件，第二个是除去当前的重排,$showTab需要显示的tab
		/*设计思路：左移134，是因为2个tab有叠加，所以小于tabwidth
		  1，判断showTab的位置，调用getFirstAndLastTab函数，取得需要在屏幕显示的第一个 和最后一个tab,在列表中，循环显示将他们显示出来，其他的隐藏
		  2，如果showTab显示，不是删除，只是切换到当前，不需要调用。
		  3，如果showTab显示，是删除操作，删除需要判断是否把隐藏的显示出来。removeTabAndBox函数会调用本函数，传递出showTab，按照1的思路
		*/
			if(!window.tabsList){//验证dockAppList是否存在
			 	console&&console.log("tabsList没有创建，不能从新排序");
			}
			duration=duration||0;
			var tabCount = 0;
			if(window.tabsList){
				 tabCount = window.tabsList.count;
			}
			//判断屏幕是否可以显示完，如果显示不全，则调用getFirstAndLastTab，找到显示的范围
			var firstTab=0;
			var lastTab=tabCount-1;
			var dropDownContainerTop=30;
			if($doc.data("isTB")){
				tabRightOffset=0;
				dropDownContainerTop=30+$("#tabs_top").height()+6;
			}
			var containerWidth=0;
			containerWidth=$container.width()-tabRightOffset;
			var $tabsDropDownBtn=$("#tabs_dropdown_btn");
			var tabsDropDownBtnShow=false;
			if(tabCount*134>=containerWidth){
				$tabsDropDownBtn.show();//显示更多
				tabsDropDownBtnShow=true;
				var tabPosion=getFirstAndLastTab($showTab,containerWidth);
				firstTab = tabPosion.firstTab;
				lastTab  = tabPosion.lastTab;
			}else{$tabsDropDownBtn.hide();}
			$container.find(".tab").hide();
			for(var i=firstTab,j=0;i<=lastTab;i++,j++){
			   var tabId=window.tabsList.get(i).data;
			   var $tab=$container.find($("#"+tabId));
			   var left=j*134;
			   var zIndex=1000;
			   $tab.show();
			   if(tabsDropDownBtnShow&&i==lastTab){
				 var btnRight=containerWidth-(left+tabWidth)-17+tabRightOffset;
				 $tabsDropDownBtn.css({right:btnRight+"px"});
				 var dropDownHeight=getDropDownHeight();
				 $dropDownContainer.css({right:(btnRight-17)+"px",height:dropDownHeight+"px",top:dropDownContainerTop+"px"});
			   }
			   zIndex=1000-j*10;
			   $tab.css({left:left+'px','z-index':zIndex,top:'0px'});//此处不能使用 animate,没有执行结束，就会调用下一个函数，导致不能取得争取的left值
			}//for循环结束
			$showTab.css({'z-index':1100});//上面循环会把当前的那个z-index重置。
		};//resetTabsPosion函数结束	
	  	resetTabsPosion(duration,$tabsContainer,$showTab);
    //重新排列tab的位置结束
	},//排列tab的位置结束
	//调整高度和宽度，在resize时使用
	tuiResizeTabs:function(option){
		var _defaults={
			tabsId:"tabs",
			widgetId:"widget",
			isShowWidget:false,
			tabsHeight:30,
			eventBind:false,
			headerHeight:30,
			divideLineWidth:6,
			tabContainer:"tabs_container",//分屏左侧的id
			leftTabContainer:"tabs_container_left",//分屏左侧的id
			contentContainer:"box_container",//内容的容器
			contentRigntContainerClass:"box_container_right",
			tabCurrentClass:'tab_current',
			LRLineId:"tabs_divide_LRLine",/*分屏的分割线*/
			TBLineId:"tabs_divide_TBLine",
			topDivId:"tabs_top",//分屏后上面
			topTabContainer:"tabs_container_top",
			//LRLineId:"tabs_divide_LRLine",/*分屏的分割线*/
			//TBLineId:"tabs_divide_TBLine",
			divideContentClass:"divide"//为分屏的content加的class,以便和其他的content做
		};
		var settings=$.extend({},_defaults,option);//读取默认参数参数
		var $tabsContainer=$("#"+settings.tabContainer),$boxContainer=$("#"+settings.contentContainer);
		var $tabs=$("#"+settings.tabsId),$widget=$("#"+settings.widgetId),tabsHeight=settings.tabsHeight;
		var $win=$(window),$doc=$(document);
		var windowWidth=$win.width(),windowHeight=$win.height(),isShowWidget=settings.isShowWidget;//显示widget时调用
		var event=settings.eventBind;
		//针对分屏情况下参数开始
		var leftTabContainerId=settings.leftTabContainer,$leftTabContainer=$("#"+leftTabContainerId),$topContainer= $("#"+settings.topDivId);
		var headerHeight=settings.headerHeight,divideLineWidth=settings.divideLineWidth,divideContentClass=settings.divideContentClass;
		var $LRLine=$("#"+settings.LRLineId),$TBLine=$("#"+settings.TBLineId);
		var winHeightMiddle=windowHeight/2,divideLineWidthMiddle=divideLineWidth/2,winWidthMiddle=windowWidth/2;
		//左右分屏情况下调整高度和宽度
		var LRDivideResize=function(isShow){//widget是否显示
			var winWidthMiddleRight=winWidthMiddle+divideLineWidthMiddle;
			var divideWidth = winWidthMiddle-divideLineWidthMiddle;//左右分屏后使用，分屏后的宽度
			var widgetWidth=147;
			var $leftBoxContainer=$boxContainer.find("."+divideContentClass).eq(0);
			if(isShow){
				var widgetWidthMiddle=widgetWidth/2;
				winWidthMiddleRight=winWidthMiddleRight-widgetWidthMiddle;
				divideWidth=divideWidth-widgetWidthMiddle;
			}
			var boxContentLeft=divideWidth+divideLineWidth;
			$tabsContainer.css({left:winWidthMiddleRight+"px",width:divideWidth+"px"});//将右侧的tab的left改为一半 
			$leftTabContainer.css({width:divideWidth+"px"}); 
			$boxContainer.css({left:winWidthMiddleRight+"px",width:divideWidth+"px",height:windowHeight+"px"});
			$leftBoxContainer.css({left:"-"+boxContentLeft+"px",height:windowHeight+"px"});
			$LRLine.css({left:divideWidth+"px",height:windowHeight+"px"});
			$LRLine.find(".middle").css({top:winHeightMiddle+"px"});	
		};
		var resizeTabsHeightAndWidth=function(){
			var widgetRight=parseInt($widget.css("right").replace("px",""));
			var isResize=event?event.type==="resize":false;
			if((widgetRight<0||$widget.css("display")==="none")&&!isShowWidget){//widget隐藏
				$tabs.css({height:windowHeight+"px",width:windowWidth+"px"});
				if(!$doc.data("isLR")){
					$tabsContainer.css({width:windowWidth+"px"});
					$boxContainer.css({width:windowWidth+"px"});
				}else {//已经左右分屏
					LRDivideResize(false);
				}
			}else{//widget显示情况下
				var widgetWidth=147;
				var willWidth=parseInt(windowWidth-widgetWidth);
				$tabs.css({height:windowHeight+"px",width:willWidth+"px"});
				if(!$doc.data("isLR")){
					$tabsContainer.css({width:willWidth+"px"});
					$boxContainer.css({width:willWidth+"px"});
				}else {//已经左右分屏
					LRDivideResize(true);
				}
			}
			if(isResize&&!$doc.data("isTB")){//没有上下分屏
				$boxContainer.css({height:parseInt(windowHeight-tabsHeight)+"px"});
			}else if(isResize) {//已经上下分屏
				var $topBoxContainer=$boxContainer.find("."+divideContentClass).eq(0);
				var divideHeight= winHeightMiddle-divideLineWidthMiddle;
				var contentHeight=divideHeight-headerHeight;
				var boxContentTop=divideHeight+divideLineWidth;
				$topContainer.css({height:divideHeight+"px",width:windowWidth+"px"});
				$topBoxContainer.css({top:"-"+boxContentTop+"px",width:windowWidth+"px"});
				$boxContainer.css({height:contentHeight+"px",width:windowWidth+"px"}); 
				$TBLine.css({width:windowWidth+"px"});
				$TBLine.find(".middle").css({left:winWidthMiddle+"px"});
			}
		};
		resizeTabsHeightAndWidth();
	}//tuiResizeTabs结束
});//extend结束
})(jQuery);