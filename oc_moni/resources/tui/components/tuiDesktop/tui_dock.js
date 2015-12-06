/**                                                    
 * tuiDock为GUI项目中桌面左侧的快捷启动栏，类似windows7中的任务栏，它竖直显示在浏览器左侧，用于快速启动常用应用的功能。                      
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  hjdang@travelsky.com 党会建               
 * @version 1.3                     
 * @see                                                
 *	HISTORY                                            
 * 2012-5-29下午04:08:08 创建文件 
 * 2012-10-30下午04:08:08 党会建开始修改增加样式
 * 2012-11-26完成工作， 
 * 2012-12-18 开始测试ie678
 * 2013-1-7  增加可以接受json数据
 * @version 1.2  2013-2-17 dock隐藏后增加一层，使用这层感知鼠标的位置，触发显示操作。
 * @version 1.3  2013-2-19 鼠标灵敏度，dock drag时，范围在10之内算上点击 
 * @version 1.3.1  2013-2-26 dock上的标题trim一下
 * @version 1.4  2013/3/6,dock上主机相关功能弹出
 * @version 1.6  2013/4/24,dock弹出和收起方式重新调整
 * @version 1.6.1  2013/4/25,修改dock弹出和收起方式bug
 * @version 1.7 2013/5/9,当dockList返回为null时，不报错，允许dock添加新的app 
 * @version 1.7.1 2013/8/13,改变切换office、退出系统等弹框的位置
 **************************************************/
// JavaScript Document
;(function($){
	$.tui=$.tui||{};//命名空间
	$.extend($.tui,{
		tuiDockInit:function(option){
			var _defaults={//系统的默认参数
				width:110,//快捷栏的宽度
				appHeight:96,
				dockAppsId:"dock_apps_container",
				dockId:"dock",
				appsId:"apps",
				isFixed:true,//快捷栏是否是固定在页面上的，如果为false，则快捷栏在鼠标离开时滑动到屏幕外测。如果为true，则固定在界面上。
				beforeHide:null,//回调函数，在隐藏的开始时执行方法，isFixed为false时有效
				afterHide:null,//回调函数，在隐藏动画结束后执行的方法，isFixed为false时有效
				beforeShow:null,//回调函数，在显示开始时执行的方法，isFixed为false时有效
				afterShow:null,//回调函数，在显示动画结束后执行的方法，isFixed为false时有效
				animateTime:300,//隐藏和显示的动画时间。
				appBtnBorder:90,//应用程序按钮之间的边界
				maxAppCount:20,//最大的应用数，用于表示快捷栏上的应用图标最多有多少个
				dockAppIdAttr:"appid",
				dockApps:[]
			};
				//进行参数的准备------------------------
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $dockApps=$("#"+settings.dockAppsId);
			var $dock=$("#"+settings.dockId);
			var $apps=$("#"+settings.appsId);
			var appHeight=settings.appHeight;
			var isFixed=settings.isFixed;
			var dockAppIdAttr=settings.dockAppIdAttr;
			var $win=$(window);
			var windowHeight;
			var dockAppsHeight;
				//-----------------------------------
				//内部方法---------------------------
			var initHeight=function(){
				windowHeight=$win.height();
				//177=8+8（top down 的按钮）+95（4个）+60（时间）+1+1（2个分割线）+调节
				dockAppsHeight=windowHeight-173;
				dockAppsHeight=dockAppsHeight<300?300:dockAppsHeight;
				$dockApps.css({height:dockAppsHeight+"px"});
			};//设置高度结束
			//将得到的json数据放置到页面上
			var addDockApps=function(){
				var dockApps=settings.dockApps;
				if(dockApps==null) return;
				try{
					var confTypeId=0;
					for(var i=0 ;i<dockApps.length;i++){
						var dockApp=dockApps[i];
						if(dockApp!=null){
							var tabIconClass=dockApp.tabIconClass;
							if(!tabIconClass){
								tabIconClass="tab_icon";
							}
							confTypeId=dockApp.confTypeId;
							var dockAppsHtml='<div class="dock_app" id="dock_app_'+i+'" \
								 toTabs="$.tui.tuiTabsCreat({title:\''+dockApp.title+'\',\
								 tabIconClass:\''+tabIconClass+'\',isReduplicate:\''+dockApp.options+'\',\
								 url:\''+dockApp.url+'\',obj:this,menuId:\''+dockApp.menuId+'\',isLeaf:\''+dockApp.isLeaf+'\'})" \
								 appid="'+dockApp.appid+'" title="'+dockApp.title+'"> \
								 <img alt="'+dockApp.title+'"\ src="'+dockApp.imgSrc+'"/>\
								 <div class="app_title" >'+dockApp.title+'</div>\
							</div>';
							$dockApps.append(dockAppsHtml);
						}
					}
					if(confTypeId){
						$dockApps.append("<input  type='hidden' value='"+confTypeId+"' id='confTypeId' />");
					}
				}catch(e){
					console.log("dock放置存在问题"+e);
					if(dockApps){
						console.log(ockApps.toString());
					}
				}
			};
			//排列dock上的app，默认数据库中读取使用jsp在页面上排列，此函数是显示和隐藏一些app和上线滚动箭头
			//排列的规则,从上往下排列。
			var displayDockApps=function(){
				//$('#dock_itemlist').data('hideTopAppsCount',0);//给dock_itemlist添加偏移量，该值用于处理应用按钮相对偏移量，用于容器过多放不下时，向上偏移。
				$dock.data('isShowDock',isFixed);//默认是固定不动的,设置这个为拖拽时回复使用
				$dock.data('tuiMaxDockAppCount',(settings.maxAppCount||6));//将最大的应用数保存在window全局上
				//如果isFixed为false，说明快捷栏需要在鼠标离开的时候进行隐藏
				var $dockAppsList=$dockApps.find(".dock_app");
				var allAppsCount=$dockAppsList.length;
				if(allAppsCount>0&&!window.dockAppsList){//在第一次初始化的时候执行
					window.dockAppsList=new TUIList();//如果不存在dockAppList，则创建
					var dockAttrList={};
					$dockAppsList.each(function(index){
						var $app=$(this);
						var dockid=$app.get(0).id;
						window.dockAppsList.add(new TUINode(dockid,null));//将id数据保存在链表中，用于位置的重新计算
						$.tui.tuiAddDockApp(null,null,false,$app);//为dock上的应用绑定drag事件,加上会让原来绑定的click事件和:active失效。因为moursedown事件会覆盖click事件
						//dock上有appid是与全部应用中的appid一一对应的，目的是为了判断全部应该往dock 上拖动是否重合，如果有就不允许他拖动。如果有，dock上已有的就增加选中背景
						var appid=$app.attr(dockAppIdAttr);
						if(appid&&appid!="undefined"&&appid!=""){
							dockAttrList[appid]=new Object;	
							dockAttrList[appid].dockid=dockid;
							dockAttrList[appid].toTabsFunc=$app.attr("toTabs");
						}
					});//each结束
					$dock.data("dockAttrList",dockAttrList);
				}
				$dockApps.data('hideTopAppsCount',0);
				var $dockDownBtn=$('#dock_down_btn');
				var $dockUpBtn=$('#dock_up_btn');
				$dockDownBtn.hide();
				$dockUpBtn.hide();
				$.tui.tuiResetDockApps(0,null);
				$.tui.tuiSetDockFixed(isFixed,null,null);
				//显示时间
				var $dockTime=$('#dock_calendar .dock_time');
				var $dockDate=$('#dock_calendar .dock_date');
				var dealTime=function(){//时钟时间更新方法
					var nowTime=new Date();
					//时间处理字符串，格式：HH:MM
					var minutes=nowTime.getMinutes();
					var timeStr=nowTime.getHours()+':'+(minutes<10?'0':'')+minutes;
					var step=1000;//步长1分钟
					$dockTime.html(timeStr);
					setTimeout(dealTime,step);
				};
				var dealDate=function(){
					var getChinaDay=function(day){
						var result="";
						switch(day){
							case 0:
								result="日";
								break;
							case 1:
								result="一";
								break;
							case 2:
								result="二";
								break;
							case 3:
								result="三";
								break;
							case 4:
								result="四";
								break;
							case 5:
								result="五";
								break;
							case 6:
								result="六";
								break;	
						}
						return result;
					};
					var nowTime=new Date();
					var dateStr=nowTime.getFullYear()+'-'+(nowTime.getMonth()+1)+'-'+nowTime.getDate()+'&nbsp;&nbsp;周'+getChinaDay(nowTime.getDay());
					$dockDate.html(dateStr);
				};//dealDate结束------------
				dealTime();
				dealDate();
			};//displayDockApps结束
		//给dock上的那几个按钮绑定事件
			var initBindBtnEvent=function(){
				var $dockBtnApps=$("#dock_btn_apps");//下面那个 打开全部应用 的按钮
				$dockBtnApps.off("click.tuiDock").on("click.tuiDock",function(){
					if($apps.css("display")=="none"){
						$.tui.tuiDesktopShowApps();
						$dockBtnApps.removeClass("dock_icon_apps").addClass("dock_icon_apps_active");
					}else {
						$.tui.tuiDesktopCloseApps();
						$dockBtnApps.removeClass("dock_icon_apps_active").addClass("dock_icon_apps");
					}
				});	
				var $dockBtnOffice=$("#dock_btn_office");
				$dockBtnOffice.off("click.tuiDock").on("click.tuiDock",function(){
					$.tui.tuiDockShowUsasFunc();
				});
				//处理应用框上下按钮
				$("#dock_down").off("click.tuiDock").on("click.tuiDock",function(){//向下按钮的方法
					var $dockAppsList=$dockApps.find(".dock_app");//需要获得list
					var allAppsCount=$dockAppsList.length;
					var curTopAppsCount=$dockApps.data('hideTopAppsCount')||0;//得到当前的偏移量
					var remCount=allAppsCount-curTopAppsCount;//除去偏移量，剩余的按钮个数
					var remHeight=appHeight*remCount;//得到剩余的按钮的总高度
					if(remHeight>=$dockApps.height()){//如果当前显示的按钮还有没显示完的
						curTopAppsCount++;//偏移量增1
						$dockApps.data('hideTopAppsCount',curTopAppsCount);//写入偏移量
						$.tui.tuiResetDockApps(150,null,null,true);//重绘按钮位置
					}
				});
				$("#dock_up").off("click.tuiDock").on("click.tuiDock",function(){//向下按钮的方法
					var curTopAppsCount=$dockApps.data('hideTopAppsCount');//得到当前的偏移量
					if(curTopAppsCount>0){//如果当前显示的按钮还有没显示完的
						curTopAppsCount--;//偏移量增1
						$dockApps.data('hideTopAppsCount',curTopAppsCount);//写入偏移量
						$.tui.tuiResetDockApps(150,null,null,true);//重绘按钮位置
					}
				});
			};//绑定事件结束
				//函数主体部分--------------------------
			initHeight();//初始化高度
			addDockApps();//通过json把dock添加上
			displayDockApps();//显示快捷栏的应用
			initBindBtnEvent();//为下面4个按钮应用绑定事件
			$win.resize(function(event){//窗口变化时，自动调整高度
				initHeight();//初始化高度
				$.tui.tuiResetDockApps(0,null,event);
			});
		},//tuiDockInit结束
		//重新设置btn上的显示class
		tuiResetDockBtnClass:function(){
			var $dockBtnApps=$("#dock_btn_apps");
			var $apps=$("#apps");
			if($apps.css("display")=="none"){
				$dockBtnApps.removeClass("dock_icon_apps_active").addClass("dock_icon_apps");
			}else {
				$dockBtnApps.removeClass("dock_icon_apps").addClass("dock_icon_apps_active");
			}
		},
		//用于重新绘制dock中应用的按钮，参数来决定设置后移动动画的时间
		tuiResetDockApps:function(duration,except,event,isBtnMove,$willShowDockApp){//duration是移动的值,$willShowDockApp传入当前要显示的app把这个app移动显示的位置,isBtnMove是按钮来控制移动
			if(!window.dockAppsList){//验证dockAppList是否存在
				console.warn('tuiResetDockApps  window.dockAppsList is null!');
				return;
			}
			var $dock=$('#dock');
			var $dockDownBtn=$('#dock_down_btn');
			var $dockUpBtn=$('#dock_up_btn');
			var dockAppHoverClass="dock_app_hover";
			$dockDownBtn.hide();
			$dockUpBtn.hide();
			var appHeight=96;
			var $dockApps=$('#dock_apps_container');
			if($dock.length!=1||$dockApps.length!=1){//容器必须存在
				console.warn('tuiResetDockApps  #dock_bar or #dock_itemlist is not exist!');
				return;
			}
			var hideTopAppsCount=$dockApps.data('hideTopAppsCount')||0;//获得图标的偏移量
			var dockAppsContainerHeight=$dockApps.height();
			duration=duration||0;
			var dockAppsCount=window.dockAppsList.count;
			//获取当前一共有多少app显示
			var getShowAppDockCount=function(){
				var $apps=$dockApps.find(".dock_app");
				var result=0;
				$apps.each(function(index){
					if($(this).css("display")!=="none"){
					 result++;	
					}
				});
				return result;
			};	
			//重新获得下上面需要隐藏的个数，因为如果删除app的话，删除最后一个，需要向上移动
			var resetHideTopAppsCount=function($willShowItem){
				var willShowAllCount=dockAppsCount-hideTopAppsCount;
				var willShowHight=willShowAllCount*appHeight;
				var hideTempCount=hideTopAppsCount;
				if(!$willShowItem){
					while (willShowHight<dockAppsContainerHeight){
						hideTempCount=hideTopAppsCount;//先把他备份出来
						hideTopAppsCount--;
						if(hideTopAppsCount<=0) {
							hideTempCount=0;
							break;
						}
						willShowHight=(dockAppsCount-hideTopAppsCount)*appHeight;
					}
					hideTopAppsCount=hideTempCount;
					$dockApps.data('hideTopAppsCount',hideTopAppsCount);
				}else {
					var dockId=$willShowItem.get(0).id;
					var showIndex=window.dockAppsList.findData(dockId);
					var canShowCount=Math.floor(dockAppsContainerHeight/appHeight);
					var curLastIndex=canShowCount+hideTopAppsCount-1;
					var indexDiff=showIndex-curLastIndex;
					var maxHideTopCount=dockAppsCount-canShowCount;
					if(showIndex>=0&&indexDiff>0){
						hideTopAppsCount=hideTempCount+indexDiff;
						hideTopAppsCount=hideTopAppsCount<0?0:hideTopAppsCount;
						hideTopAppsCount=hideTopAppsCount>maxHideTopCount?maxHideTopCount:hideTopAppsCount;
						$dockApps.data('hideTopAppsCount',hideTopAppsCount);	
					}else if(showIndex>=0&&indexDiff<0&&Math.abs(indexDiff)>=canShowCount){
						hideTopAppsCount=hideTempCount-parseInt(Math.abs(indexDiff)+1-canShowCount);
						hideTopAppsCount=hideTopAppsCount<0?0:hideTopAppsCount;
						hideTopAppsCount=hideTopAppsCount>maxHideTopCount?maxHideTopCount:hideTopAppsCount;
						$dockApps.data('hideTopAppsCount',hideTopAppsCount);	
					}	
				}
			};
			var toShow=function(top,$app){//闭包，对于动画结束后的操作中，由于用到了top和$app，因此这两个变量不会被销毁。但是，由于该变量在链式作用域中，都引用同一个变量，因此，在动画结束后，循环可能已经过去很多，里面的变量引用极可能已经改变，因此，要通过闭包函数，将参数单独存入函数中。
				return function(){
					if(!(top<0||(top+$app.height())>dockAppsContainerHeight)){//如果不是隐藏的条件
						$app.show();//显示
					}
				};
			};
			//计算title字的多少，对第titleMaxFont+1个字做渐变处理
			var getDockAppTitle=function(titleAll){
				var titleMaxLength=6;
				titleAll=$.trim(titleAll);
				var titleHtml=titleAll;
				if(titleAll){
					var length=titleAll.length;
					if(length>titleMaxLength){
						titleMaxLength=titleMaxLength-1;
						var titleSub=titleAll.substr(0,titleMaxLength);
						var lastChar="<span class='title_more_forIE'>...</span>";
						titleHtml=titleSub+lastChar;
					}
				}
				return titleHtml;
			};
			var showAllAppsList=function(){
				//动画设置，每一个在链表中保存的元素id，都会被遍历，在遍历的每一个元素中计算应该存在的位置
				hideTopAppsCount=$dockApps.data('hideTopAppsCount')||0;//获得图标的偏移量
				for(var i=0;i<dockAppsCount;i++){
					if(i==except){//对于except的元素，不进行处理
						continue;
					}
					var $app=$dockApps.find('#'+window.dockAppsList.get(i).data);//获得链表中data值，从而得到链表所记录的元素
					$app.stop();//停掉当前正在进行的所有的动画，便于重新设置动画
					var top=(i-hideTopAppsCount)*appHeight;//（i-hideTopAppsCount）的意思是要根据当前的偏移个数来计算哪个应用在第一个位置显示
					if(window.dockAppsList.get(i).simple){//是否参与排序，推拽的不参与排序，推拽中的，不进行重绘
						if(top<0){//如果该按钮在容器的上边界之上或者该按钮不能全部显示在容器中，则隐藏
							$app.hide();
							$dockUpBtn.show();	
						}else if((top+appHeight)>dockAppsContainerHeight){
							$app.hide();
							$dockDownBtn.show();
						}else {
							var $appTitle=$app.find(".app_title").eq(0);
							var title=$app.attr("title");
							$appTitle.html(getDockAppTitle(title));
						}
						$app.animate({top:(top+8)+'px',left:"12px"},duration,toShow(top,$app));//思路：要隐藏的按钮要在动画开始前隐藏，而要显示的按钮要在动画之后显示。+8是因为原来有paddint-top 8px
					}
				}
				if(hideTopAppsCount==0){//在resize的时候，如原来upbtn按钮显示，没有关闭的判断
					$dockUpBtn.hide();	
				}
			};
			//执行主函数
			$dockApps.hide();
			if(event&&event.type==="resize"){//提高事件的效率，提前判断移动距离
				var dockAppsHeight=$dockApps.height();
				if(hideTopAppsCount!=0){
					$dockUpBtn.show();	
				}
				if(dockAppsCount&&(dockAppsCount-hideTopAppsCount)*appHeight>dockAppsHeight){
					$dockDownBtn.show();
				}
				var appsCanShowCount=Math.floor(dockAppsHeight/appHeight);
				var appsCurShowCount=getShowAppDockCount();
				var hideTopAppsCount=$dockApps.data('hideTopAppsCount');
				if(appsCurShowCount&&appsCanShowCount<appsCurShowCount){
					//调用showAllAppsList()会造成卡顿，需要改造
					var diff=appsCurShowCount-appsCanShowCount;
					for(var i=1;i<=diff;i++){
						var posion=hideTopAppsCount+appsCurShowCount-i;//list中是从0开始计数的,原来的那个隐藏
						var node=window.dockAppsList.get(posion);
						if(!node) break;
						var $hiddernApp=$dockApps.find('#'+node.data);
						$hiddernApp.hide();
					}
				}else if(appsCurShowCount&&appsCanShowCount>appsCurShowCount){
					var diff=appsCanShowCount-appsCurShowCount;//差值
					if(hideTopAppsCount+appsCanShowCount<=window.dockAppsList.count){//不能全部放下,同时可能上面有隐藏的
					//下面的app一个个出现
						for(var i=1;i<=diff;i++){//此处有bug,11-16回来时更改
							var posion=hideTopAppsCount+appsCurShowCount+i-1;//list中是从0开始计数的
							var node=window.dockAppsList.get(posion);
							if(!node) break;
							var $showApp=$dockApps.find('#'+node.data);
							var top=(appsCurShowCount+i-1)*appHeight;
							$showApp.animate({top:(top+8)+'px',left:"12px"},duration,toShow(top,$showApp));
						}
					}else {//如果都能放下,需要把hideTopAppsCount置为0从新计算
						resetHideTopAppsCount();
						showAllAppsList();
					}
				}
			}else if($willShowDockApp&&$willShowDockApp instanceof jQuery){//把传入引入到当前显示并加hoverClass
				$willShowDockApp.off("mousemove.tuiDock").on("mousemove.tuiDock",function(){
					$willShowDockApp.removeClass(dockAppHoverClass);
				});
				$dockApps.find("."+dockAppHoverClass).removeClass(dockAppHoverClass);
				resetHideTopAppsCount($willShowDockApp);
				showAllAppsList();
				//闪烁已有的app
				$willShowDockApp.addClass(dockAppHoverClass);
				setTimeout(function(){$willShowDockApp.removeClass(dockAppHoverClass);},200);
				setTimeout(function(){$willShowDockApp.addClass(dockAppHoverClass);},400);
				setTimeout(function(){$willShowDockApp.removeClass(dockAppHoverClass);},600);
				setTimeout(function(){$willShowDockApp.addClass(dockAppHoverClass);},800);
			}else if(isBtnMove){
				showAllAppsList();
			}else {//全部重绘
				resetHideTopAppsCount();
				showAllAppsList();
			}
			$dockApps.show();//css里面定义是隐藏的，为了提高效率，防止重排和重绘
		},//tuiResetDockApps结束
		//设置快捷栏是否可以收起，isFixed为bool，true为可以收起，false为不可以收起。鼠标滑动事件的控制也在这里
		tuiSetDockFixed:function(isFixed,dockAfterShow,dockAfterHide,isNotAnimate,isAppsToTabs,isNotDelMask){
			var $dock=$("#dock"), $dockMask=null,$doc=$(document),$dockBtn=$("#dock_btn");
			if($dock.length==0){//快捷栏必须存在
				console.log('tuiSetDockFixed #dock does not exist!');
				return;
			}
			//var $mousemoveDock=$("#mousemove_dock"),remainTime=1000,showDockWidth=2;
			var dockBtnCloseClass="dock_btn_close",dragableWidth=200;//针对拉开的快捷栏，需要将图标外部容器加大，以便可以讲图标拖拽出快捷栏
			var animateTime=260,dockWidth=118,hideDockWidth=-200,dockZIndex=$dock.css("z-index"),maskZIndex=parseInt(dockZIndex+1);
			var showDockMask=function(){//当tabs显示的时候显示遮罩,tabs里面的内容是iframe，捕捉不到鼠标的位置，最后无法隐藏
				$dockMask=$.tui.showMask("dock_mask",maskZIndex,0,dockWidth,$("body"),"mousedown.tuiDock", 
		               		function(event){  
					     		event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡
			             		event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue 
					    		 if($dockMask&&event.target.id=="dock_mask"){
										$dockMask.remove();
										hideDock(event);
					       		 }
					    	}
				);
			};
			//通过判断鼠标位置来设置隐藏和显示dock
			var hideDock=function(event){
				var dockLeft=$dock.offset().left;
				$dockBtn.css({left:"0px"});
				$dockBtn.removeClass(dockBtnCloseClass);
				if(dockLeft==0&&!$dock.is(':animated')){//判断快捷栏是否要关闭的依据是：快捷栏的坐标=0
						$dock.animate({left:hideDockWidth+'px'},animateTime,function(){
							if(typeof dockAfterHide==='function'){//hide结束后执行的有效的回调函数
								dockAfterHide($dock);//执行回调
							}
							var  $dockMask=$("#dock_mask");//因为事件触发直接离开，就没有赋值
							if($dockMask){
								$dockMask.remove();
							}
							$dockBtn.off('click.tuiDock').on('click.tuiDock',showDock);
						});
				}	
			};
			var aotuHideDock=function(event){
				if(event&&event.pageX>dragableWidth){
					hideDock();
				}
			}
			var showDock=function(event){
				var dockLeft=$dock.offset().left;
				$dock.show();
				if(dockLeft<=-dockWidth&&!$dock.is(':animated')){//判断快捷栏没有打开的依据就是：快捷栏的坐标在-width上
					$dock.animate({left:'0px'},animateTime,function(){
						$dockBtn.addClass(dockBtnCloseClass);
						$dockBtn.css({left:"114px"});
						//$dockBtn.off('click.tuiDock').on('click.tuiDock',hideDock);
						if(typeof(dockAfterShow)==='function'){//判断是够是有效的回调
							dockAfterShow.call($dock);//执行回调
						}
						showDockMask();
					});
				}
			};
			if(isFixed){//不能收起
				//$mousemoveDock.off('mouseenter.tuiDock');
				$doc.off('mousemove.tuiDock');
				if(isNotAnimate){
					$dock.css({left:"0px"}).data('isShowDock',true);
				}else {
					$dock.animate({left:'0px'},animateTime).data('isShowDock',true);
				}
				var $mask=$("#dock_mask");
				if($mask&&!isNotDelMask){
					$mask.remove();	
				}
				if($("#tabs").css("display")==="none"){
					$dockBtn.hide();
				}
			}else{//能收起操作，使用mouseenter和mouseleave2个时间
				//$mousemoveDock.off('mouseenter.tuiDock').on('mouseenter.tuiDock',showDock);//绑定事件
				$dock.data('isShowDock',false);
				if(isAppsToTabs){//关闭apps到tabs显示，都要隐藏下。tuiDesktopCloseApps调用
					$dock.css({left:hideDockWidth+"px"});
				}
				$dockBtn.show();
				if($dock.offset().left<0){
					$dockBtn.css({left:"0px"});
					$dockBtn.removeClass(dockBtnCloseClass);
				}
				$dockBtn.off('click.tuiDock').on('click.tuiDock',showDock);
				$doc.off('mousemove.tuiDock').on('mousemove.tuiDock',aotuHideDock);//绑定事件
				
			}
			$.tui.tuiResetDockBtnClass();//因为显示隐藏的操作都调用tuiSetDockFixed函数，所以在这地方重置btn class;
		},//tuiSetDockFixed结束
		//该函数用于添加一个应用按钮，dockApp为按钮的参数，at为添加的位置，如果没有设置at的值，则添加到最后一个应用后面
		tuiAddDockApp:function(appObject,insertPosion,isAppsToDock,$app){
			var _defaults={//系统的默认参数
					dockWidth:118,//快捷栏的宽度
					appHeight:96,
					dockAppActiveClass:"dock_app_active",
					dockAppClass:"dock_app",
					dockAppDelClass:"app_del_icon",
					appOpacityClass:"app_opacity",
					toTabsFunc:"toTabs",//ie下click事件和mouseup全都执行，会打开2个框，原因是推拽过程中的遮罩层，没有颜色，ie会认为在一个元素上，导致click事件执行
					delAppContainerId:"will_del_app_container"
				};
				//进行参数的准备------------------------
				var settings=$.extend({},_defaults);//读取默认参数参数
				var dockAppActiveClass=settings.dockAppActiveClass,appOpacityClass=settings.appOpacityClass,toTabsFunc=settings.toTabsFunc,delAppContainerId=settings.delAppContainerId,dockAppClass=settings.dockAppClass;
				var appHeight=settings.appHeight,dockAppDelClass=settings.dockAppDelClass;
				var $dockApps=$("#dock_apps_container"),$dock=$("#dock"),$doc=$(document);

				if($dockApps.length!=1||$dock.length!=1){//容器必须存在
					console&&console.warn('tuiAddDockApp #dock_bar or #dock_itemlist is not exist!');
					return;
				}
				if(!window.dockAppsList){//验证dockAppList是否存在
					console&&console.warn('tuiAddDockApp  window.dockAppsList is null!');
					return;
				}
				if($('#dock_apps_container .dock_app').length>=$dock.data('tuiMaxDockAppCount')){
					$("#dockInsertLine").hide();
					alert("达到最大数"+$dock.data('tuiMaxDockAppCount')+"个应用，请先删除后继续添加。");
					return;
				}
				var appendToDelAppContainer=function($willDelApp){
					var $delAppContainer;
					if($("#"+delAppContainerId).length<1){
						var delAppContainerHtml='<div id="'+delAppContainerId+'" \
						        			style="position:absolute;z-index:11000;top:0;left:0;"></div>';
						$delAppContainer=$(delAppContainerHtml).appendTo("body");
					}else {$delAppContainer=$("#"+delAppContainerId);};
					$willDelApp.appendTo($delAppContainer);
					$delAppContainer.css({width:$doc.width()+'px',height:$doc.height()+'px'});
					$delAppContainer.show();
					return $delAppContainer;
				};
				//内部函数，用于给按钮添加拖拽方法的函数
				var bindDockAppEvent=function($app){
					$app=($app instanceof jQuery)?$app:$($app);
					var appHeight=settings.appHeight;
					var isFixed=false;//用于记录快捷栏是否是固定的，如果不是固定的，在拖拽的过程中要固定快捷栏，在拖拽结束后恢复事件
					var isDrag=false,readyPageX=0,readyPageY=0,dragValue=10;//用于记录该按钮是否被拖拽了
					var isWillDelApp=false;//用于记录要删除的app
					var isChangePosion=false;//是否交换位置了
					var dockAppsWidth=118;//dock宽度，用于判断拖拽删除的条件
					var dockDelAppWidth=150,dockLeft=14,height=200;//可以拖拽的高度限制
					//var dragableW=[0,$window.width()-dockAppWidth-10];//
					//var dragableH=[0-dockAppsOffsetTop,$window.height()-dockAppsOffsetTop-appHeight];
					var $delAppContainer=null;
					$app.tuiDrag({//该按钮绑定拖动事件
						cursor:'pointer',
						onReadyDrag:function(event){//在点击之前所做的操作
							$(this).css({zIndex:20000});//为避免遮盖，将该按钮设置为最前
							$(this).removeClass(dockAppClass).addClass(dockAppActiveClass);
							var id=$(this).attr('id');
							window.dockAppsList.setCache(window.dockAppsList.findData(id));//设置链表中的临时节点，所有的交换以该节点为准 ，他其实就是为了交换位置用的
							window.dockBtnCurIndex=window.dockAppsList.findData(id);//临时记录当前的要拖动的按钮在链表的位置
							window.dockAppsList.cacheNode.simple=false;//设置标记，动画重绘时不对该按钮进行重绘
							isFixed=$dock.data('isShowDock');//先记录下是否可以拖拽，便于在鼠标放下时恢复之前的设置
							$.tui.tuiSetDockFixed(true,null,null,true,false,true);//将快捷栏设置为固定,不使用animate,否则在tabs那里设置left不起作用	
							isDrag=false,isWillDelApp=false,isChangePosion=false;
							height=$dockApps.height()-appHeight;//可以拖拽的高度限制
							readyPageX=event.pageX,readyPageY=event.pageY;
						},
						onDraging:function(x,y,event){//拖拽时的计算和操作
							var dragDockLeft=dockLeft+x,$drag=$(this),$delIcon=$("."+dockAppDelClass,$drag);
							if(y>=0&&y<height&&dragDockLeft<=dockAppsWidth){
								$drag.removeClass(appOpacityClass);
								var i=parseInt((y+(appHeight/2))/appHeight);//交换条件，只有超过另一个按钮的一半时才算交换
								i+=$dockApps.data('hideTopAppsCount')||0;//计算偏移量，如果已经向上移动了几个位置，就要将偏移量算进坐标计算中避免移动和插入错误
								if(window.dockBtnCurIndex!=i){//如果要换到的地方与它本身的位置不一样，则说明需要交换
									window.dockAppsList.changeCatchNode(i);//交换到真正list中去，同时把原来的删掉
									window.dockBtnCurIndex=i;//更新它的位置，便于下一次交换
									$.tui.tuiResetDockApps(150,null);//重绘
									isChangePosion=true;
								}
								isWillDelApp=false;
							}else if(!isWillDelApp&&dragDockLeft>dockAppsWidth){
								$delAppContainer=appendToDelAppContainer($drag);
								if(dragDockLeft>dockDelAppWidth){//删除加删除图标
									if(!$delIcon.get(0)){
										$drag.addClass(appOpacityClass);
										$drag.append("<div class='"+dockAppDelClass+"'></div>");
									}
									isWillDelApp=true;
								}
							}else if(isWillDelApp&&dragDockLeft>dockAppsWidth&&dragDockLeft<dockDelAppWidth){
								$delIcon.remove();
								isWillDelApp=false;
								$drag.removeClass(appOpacityClass);
							}else if(dragDockLeft<=dockAppsWidth) {
								isWillDelApp=false;
								$delIcon.remove();
								
							}
							var dragingPageX=event.pageX,dragingPageY=event.pageY;
							if(Math.abs(dragingPageX-readyPageX)>dragValue||Math.abs(dragingPageY-readyPageY)>dragValue){
								isDrag=true;
							}
						},
					onFinshed:function(x,y){//拖拽结束后的操作
						var $drag=$(this);
						var resetTime=150;
						$drag.css({zIndex:1}).addClass(dockAppClass).removeClass(dockAppActiveClass).removeClass(appOpacityClass);//将拖拽的按钮回复之前的遮盖关系
						window.dockAppsList.cacheNode.simple=true;//重新设置按钮为可以绘制，便于该按钮复位
						window.dockAppsList.cacheNode=null;
						window.dockBtnCurIndex=null;
						//如果拖出区域，则进行删除
						if(isWillDelApp){
							resetTime=300;
							$.tui.tuiDeleteDockApp($drag.attr('id'),$drag);//进行删除
						}else {
							if($drag.parent().get(0).id===delAppContainerId){
								$drag.appendTo($dockApps);
								//ie7下会造成桌面背景丢失，89没问题
								$("#desktop_background_forIE678").height();
							}
						}
						if($delAppContainer){
							$delAppContainer.remove();
						}
						if(isDrag){
							$.tui.tuiResetDockApps(resetTime,null);//重绘按钮
							if(isChangePosion){
								//为ajax传给后台做准备
								if(window.dockAppsList){
									var list=window.dockAppsList;
									var appidArray=new Array();
									for(var i=0;i<list.count;i++){
										var dockId=list.get(i).data;
										var willPushAppid=$("#"+dockId).attr("appid");
										if(willPushAppid){
											appidArray.push(willPushAppid);
										}
									}
									var confTypeId=$("#confTypeId").val();
									if(!confTypeId){
										confTypeId="";
									}
									$.postJSON(window.GlobalURL+"abframe/dockWidget/updateDockList","dockList="+appidArray+"&confTypeId="+confTypeId);
								}	
							}	
						}
						if(!isFixed){
							$.tui.tuiSetDockFixed(false);
						}
						var toTabs=$drag.attr(toTabsFunc);
						if(!isDrag&&typeof toTabs==="string"){
							eval(toTabs);
						}
					},
					//dragableRangeX:dragableW,//可移动的范围是整个页面横向的区域
					//dragableRangeY:dragableH,
					dragRange:'default'
				});
			};//bindDockAppEvent结束
			if(isAppsToDock){//从apps上往dock上添加
				if(null!=insertPosion&&isNaN(insertPosion)){//如果存在insertPosion，同时insertPosion是无效的数据
					console.warn('tuiAddDockApp insertPosion is not corrent type!');
					return;
				}
				var title=appObject.title,id=appObject.id,toTabs=appObject.toTabs;
				var appid=appObject.appid;
				var appHtml='<div class="dock_app" id="'+id+'" title="'+title+'" appid="'+appid+'"  toTabs="'+toTabs+'">\
								<img src="'+appObject.imgUrl+'" />\
								<div class="app_title">'+title+'</div>\
							 </div>';//添加应用按钮的原文
				var $app=$(appHtml).appendTo($dockApps);//添加到appItem中去
				if(insertPosion==null){//如果没有指定位置，则添加到末尾
					window.dockAppsList.add(new TUINode(id,null));//将id数据保存在链表中，用于位置的重新计算
					insertPosion=window.dockAppsList.count-1;//计算差在什么位置
				}else{
					window.dockAppsList.addAt(insertPosion,new TUINode(id,null));//将数据保存在链表中，用于位置的重新计算，插入链表的位置指定
				}
				var hideTopAppsCount=$dockApps.data('hideTopAppsCount');//获得偏移量，因为在重新设置按钮的时候，需要将按钮先放到插入的位置，位置需要计算偏移量
				//判断是不是插入到当前显示中的最后一个，显示不出来，如果显示不出，需要给hideTopAppsCount+1；
				var topHeight=(insertPosion-hideTopAppsCount+1)*appHeight;
				if(topHeight>$dockApps.height()){
					$dockApps.data('hideTopAppsCount',hideTopAppsCount+1);
				}
				$.tui.tuiResetDockApps(0,null);//重绘按钮位置
				//添加到dockAttrList开始
				if(appid&&appid!="undefined"&&appid!=""){
					var dockAttrList=$dock.data("dockAttrList");
					if(!dockAttrList){
						dockAttrList=new Object;
					}
					dockAttrList[appid]=new Object;	
					dockAttrList[appid].dockid=id;
					dockAttrList[appid].toTabsFunc=toTabs;
					$dock.data("dockAttrList",dockAttrList);
					//为ajax传给后台做准备
					if(window.dockAppsList){
						var list=window.dockAppsList;
						var appidArray=new Array();
						for(var i=0;i<list.count;i++){
							var dockId=list.get(i).data;
							var willPushAppid=$("#"+dockId).attr("appid");
							if(willPushAppid){
								appidArray.push(willPushAppid);
							}
						}
						var confTypeId=$("#confTypeId").val();
						if(!confTypeId){
							confTypeId="";
						}
						$.postJSON(window.GlobalURL+'abframe/dockWidget/updateDockList',"dockList="+appidArray+"&confTypeId="+confTypeId);
					}	
				}
				$("#dockInsertLine").hide();//隐藏插入的线提示
				//添加到dockAttrList结束
			}
			//仅仅绑定事件
			bindDockAppEvent($app);//给该应用按钮添加事件
		},//tuiAddDockAppBtn结束
		//删除dock上的app开始
		tuiDeleteDockApp:function(willDelid,$delDockApp){
			var $dockApps=$("#dock_apps_container");
			var $dock=$("#dock");

			var dockAttrList=$dock.data("dockAttrList");
			if($dockApps.length!=1||$dock.length!=1){//容器必须存在
				console.warn('tuiDeleteDockApp #dock or #dock_apps_container is not exist!');
				return;
			}
			if(!window.dockAppsList){//验证dockAppList是否存在
				console.warn('tuiDeleteDockApp  window.dockAppsList is null!');
				return;
			}
			var at=-1;//删除的位置初始化
			var $app=null;
			if(!isNaN(willDelid)){//如果用户要删除的是按照序号删除的
				var tempName=window.dockAppsList.get(willDelid).data;
				$app=$('#dock_apps_container #'+tempName);
				at=willDelid;
			}else{//如果用户直接指定删除的id
				$app=$('#dock_apps_container #'+willDelid);
				at=window.dockAppsList.findData(willDelid);
			}
			if(at==-1){//如果没有找到，则不进行删除
				console.warn('tuiDeleteDockApp deleting element is not in the list!');
				return;
			}
			$app.off().html('');//将该目标的所有事件释放，清空内容
			$.removeData($app);//删除该dom中的所有数据
			$app.remove();//清理自己
			window.dockAppsList.deleteAt(at);//将链表中改节点的内容删除
			if(dockAttrList){//删除这个上面的值,目前是全部应用添加时不能重复使用。
				var appid=$delDockApp.attr("appid");
				if(appid){
					delete dockAttrList[appid];
					$dock.data("dockAttrList",dockAttrList);
				}
			//为ajax传给后台做准备
				if(window.dockAppsList){
					var list=window.dockAppsList;
					var appidArray=new Array();
					for(var i=0;i<list.count;i++){
						var dockId=list.get(i).data;
						var willPushAppid=$("#"+dockId).attr("appid");
						if(willPushAppid){
							appidArray.push(willPushAppid);
						}
					}
					var confTypeId=$("#confTypeId").val();
					if(!confTypeId){
						confTypeId="";
					}
					$.postJSON(window.GlobalURL+'abframe/dockWidget/updateDockList',"dockList="+appidArray+"&confTypeId="+confTypeId);
				}
			}
		},//删除dock上的app结束
		//从apps全部应用，往dock上拖动，获得插入的位置
		tuiGetInsertDockAppPosition:function(x,y,$dragApp){
			var $dockApps=$("#dock_apps_container"),dockAppClass="dock_app";
			var dockAppActiveClass="dock_app_active",opacityClass="app_opacity";
			var dockAppsWidth=118,appWidthMid=45,appHeight=96;
			var $dockLine=$("#dockInsertLine");
			if(null==x||null==y||isNaN(x)||isNaN(y)){//验证x和y的有效性
				console.warn('tuiInsertDockApp parameter:x, y is null, or x, y is NaN');
				return;
			}
			if(!window.dockAppsList){//链表必须存在
				window.dockAppsList=new TUIList();//如果不存在dockAppList，则创建
			}
			var hideTopAppsCount=$dockApps.data('hideTopAppsCount')||0;//获得图标的偏移量
			var dockAppsContainerHeight=$dockApps.height();
			y-=$dockApps.offset().top;//要将纵坐标减去应用按钮容器的坐标，得到相对容器内的坐标，这样才能做相对位置计算
			var appHeightMid=appHeight/2;
			if( x>(dockAppsWidth-appWidthMid)||y<-appHeightMid||y>(dockAppsContainerHeight-appHeightMid)){//如果x移出了dock区域，则去掉所有mark的样式
				$dockApps.find('.'+dockAppClass).removeClass(dockAppActiveClass);
				$dragApp.addClass(opacityClass);
				$dockLine.hide();
				return -1;
			}
			$dragApp.removeClass(opacityClass);
			var i=parseInt((y+appHeightMid)/appHeight)+hideTopAppsCount;//计算当前的坐标在第几个按钮之上。
			var list=window.dockAppsList;
			var willDownId=list.get(i)&&list.get(i).data;//计算后的按钮的id
			var lineTop=0;
			var lineLeft=0;
			if(willDownId==null){//tempAppId为空则说明根据i的值在链表中查找错误，那就是i值超过了链表的长度（按钮很少，按钮拖到最下面就会出现这个情况）
				i=list.count;//返回链表的最后一个节点
				var upDockAppId=list.get(i-1)&&list.get(i-1).data;
				var $upDock=$("#"+upDockAppId);		
				if($upDock&&$upDock.get(0)){
					var upPosion=$upDock.position();
					lineTop=upPosion.top+96+4;//96是一个dockapp的高度
					lineLeft=upPosion.left+2;
				}else{
					lineTop=96+4;//96是一个dockapp的高度
					lineLeft=2;
				}
			}else {//else if(willDownId!=$dockApps.find('.'+dockAppActiveClass).attr('id')){//如果计算的按钮和之前的按钮的不是同一个，则重新更换class
				//$dockApps.find("."+dockAppClass).removeClass(dockAppActiveClass);//去掉所有的active样式
				var $willDownDockApp=$('#'+willDownId);//将这个向下移动
				//$willDownDockApp.addClass(dockAppActiveClass);//给计算好的按钮添加上mark样式
				//2013-1-9改完在添加的app上面加上一条线
				if($willDownDockApp.css("display")==="none"){
					var upDockAppId=list.get(i-1)&&list.get(i-1).data;
					var $upDock=$("#"+upDockAppId);
					if($upDock&&$upDock.get(0)){
						var upPosion=$upDock.position();
						lineTop=upPosion.top+96+4;//96是一个dockapp的高度
						lineLeft=upPosion.left+2;
					}else{
						lineTop=96+4;//96是一个dockapp的高度
						lineLeft=2;
					}
				}else{	
					var downPosion=$willDownDockApp.position();
					if(!downPosion){
						lineTop=0;
						lineLeft=2;
					}else {
						lineTop=downPosion.top;
						lineLeft=downPosion.left+2;
					}
				}			
			}
			var dockAppHoverClass="dock_app_hover";
			$dockApps.find("."+dockAppHoverClass).removeClass(dockAppHoverClass);
			$dockLine.css({top:lineTop,left:lineLeft});
			$dockLine.show();
			return i;//返回节点位置
		},//tuiGetInsertDockAppPosition结束
		//在dock上显示连接主机等功能，能切换的offce以json方式传入
		tuiDockShowUsasFunc:function(option){
			var _defaults={//系统的默认参数
				usasOffice:null,
				contentId:"dock_usas_container",
				btnId:"dock_btn_office",
				btnActiveClass:"dock_icon_office_active",
				btnNormalClass:"dock_icon_office",
				listId:"dock_usas_list",
				isHide:false
			};
			var settings=$.extend({},_defaults,option);//读取默认参数参数
			var $btn=$("#"+settings.btnId),$container=$("#"+settings.contentId);
			var btnActiveClass=settings.btnActiveClass,btnNormalClass=settings.btnNormalClass,$mask=null,isHide=settings.isHide;
			//设置内容
			//利用ajax取得当前的office,如果没有取到则是null
			var setContent=function(){
				var containerHeight=80;
				var officeCount=0;
				var $offices=$("#offices").find("li");
				if($offices&&$offices.get(0)){
					officeCount=$offices.size();
				}
				containerHeight=parseInt(containerHeight+(officeCount*24));//24是单个的高度
				var arrowHeight=containerHeight*0.8;
				var containerTop=parseFloat(-(arrowHeight-69));
				$container.css({height:containerHeight+"px",top:containerTop+"px"});	
			};//setContent结束
			var showContainer=function(){
				var $desktop=$("#desktop"),$apps=$("#apps");
				if($container.css("display")==="none"){
					setContent();
					$container.show();
					$btn.removeClass(btnNormalClass).addClass(btnActiveClass);
					var position=$("#dock_tool_pannel").position();
					var top=0,left=0;
					if(position){
						top=position.top;
						left=position.left;
					}
					$mask=$.tui.showMask("dockUsasMask",2900,"-"+top,"-"+left,$("#dock_tool_pannel"),"mousedown.tuiDockTip", 
							   function(event) {  
								 event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡
								 event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue
								 if(event.target.id==="dockUsasMask"){
									   $container.fadeOut("fast");
									   $btn.removeClass(btnActiveClass).addClass(btnNormalClass);
									   $mask.remove();
								   }
								},"opacity_bg_forIE678"
					);
					$desktop.off("mousedown.tuiDockTip").on("mousedown.tuiDockTip",function(){
						$container.fadeOut("fast");
						$btn.removeClass(btnActiveClass).addClass(btnNormalClass);
						$mask.remove();
					});
					$apps.off("mousedown.tuiDockTip").on("mousedown.tuiDockTip",function(){
						$container.fadeOut("fast");
						$btn.removeClass(btnActiveClass).addClass(btnNormalClass);
						$mask.remove();
					});
				}else {
					$container.hide();
					$btn.removeClass(btnActiveClass).addClass(btnNormalClass);
					if($mask){$mask.remove();}
				}
			};//showContainer结束
			var hideContainer=function(){
				$container.hide();
				$btn.removeClass(btnActiveClass).addClass(btnNormalClass);
				$("#dockUsasMask").remove();	
			};
			//执行函数
			if(!isHide){
				showContainer();
			}else {
				hideContainer();
			}
		}
	});//extend结束
})(jQuery);