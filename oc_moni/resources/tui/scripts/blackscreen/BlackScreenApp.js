/**
 * JS黑屏控件多窗口框架
 * 
 * @author wuhua
 * @date 2013-06-18
 * @version 1.0
 * @copyright 2013，中国航信重庆研发中心.
 * 
 * ===========================================================================
 * 该控件向外部提供以下接口: 
 * init：初始化黑屏控件
 * inputString(str)：向当前显示的黑屏输入内容
 * setConfig(xml,id)：设置黑屏基础配置
 * sendCmd(cmd)：发送指令cmd;
 * resize(width, height)：设置黑屏宽度与高度
 * fireEvent()：抛出事件
 * transmit()：提交当前指令
 * lockScreen(flag)：锁屏与解屏，在向主机发送指令前必要操作，0表示解屏，1表示锁屏
 * isScreenLocked()：黑屏是否被锁，返回true或者false
 * writeData(path,data,isEnter)：记录日志
 * setElapsedTime(time)：设置服务器处理时间
 * setNetTransportTime(time)：设置网络传输时间
 * setFlow(flow)：设置剩余流量
 * ===========================================================================
 * 
 */
function BlackScreenApp()
{
	// 成员变量
	this.container = null; 			// 容器
	this.toolsBar = null; 			// 黑屏菜单条
	this.screenContainer = null; 	// 黑色区域容器，数组，每个元素包括：屏句柄、屏容器、屏内容。
	this.currentScreen = null; 		// 当前显示的屏
	this.operateScreen = null; 		// 发送命令的屏
	this.blackScreen = null;		// 黑屏区域
	this.statusBar = null; 			// 黑屏状态条
	this.height = null; 			// 容器高度
	this.width = null; 				// 容器宽度
}

/**
 * 控件原型
 */
BlackScreenApp.prototype = {
		
	// 构造函数
	constructor : BlackScreenApp,

	// 初始化
	init : function(param)
	{
		// 获取容器元素
		this.container = document.getElementById(param.containerId);
		//设置回调函数
		this.callback = param.callback;
		this.imgPath = param.imageUrl+"/{0}";				//控件中所有图片路径
		this.imgUrl = "url("+ this.imgPath+")";			//控件中所有图片url
		
		if (this.container == null || this.container == undefined) {
			alert("The Main control's container '" + param.containerId
					+ "' not exits!");
			return false;
		}
		this.screenContainer = new Array();		// 黑屏核心组件
		this.screenContainer[0] = new Array(); 	// 新建主屏
		this.initToolsBar(); 					// 初始化黑屏菜单
		this.initHandleBar(); 					// 初始化黑屏句柄
		this.initBlackScreen();					// 初始化黑屏容器
		this.initStatusBar(); 					// 初始化黑屏状态栏
		//this.initPointBtn();					// 初始化黑屏内部悬浮按钮 20131112 党会建修改
		this.logPath = "c:\log.txt";			// 日志路径
		this.flowTip = "100";					// 流量提示限制值
		this.multiScreenStatus = 0;				// 分屏状态,有三种：没有分屏，横向、纵向。
		this.isFullScreen = false;				// 是否浏览器全屏
		this.blurLocation = "working";			// 失去焦点的位置
		
		this.currentScreen = this.screenContainer[0][2];
		//2013-11-11 党会建增加
		var screenContainerHeight=600;
		var screenContainerWidth=1200;
		if($){
			var winHeight=$(window).height();
			var winWidth=$(window).width();
			var screenContainerWillHeight=parseFloat(winHeight-50);
			var screenContainerWillWidth=parseFloat(winWidth-200);
			screenContainerHeight=screenContainerWillHeight>screenContainerHeight?screenContainerWillHeight:screenContainerHeight;
			screenContainerWidth=screenContainerWillWidth>screenContainerWidth?screenContainerWillWidth:screenContainerWidth;
		}
		this.resize(screenContainerWidth,screenContainerHeight);
		return true;
	},

	// 初始化工具栏
	initToolsBar : function()
	{
		
		// 工具栏区域
		this.toolsBar = document.createElement("div");
		this.toolsBar.style.height = "34px";
		this.toolsBar.style.marginTop = "-1px";

//		this.imgUrl = "url(./images/{0})";			//控件中所有图片url
//		this.imgPath = "./images/{0}";				//控件中所有图片路径
	
		this.systemBtn = new Array();
	
		//0:分割线
		this.systemBtn[0] = {
			"img" : "line.png"
		};
		//1:横向分屏按钮
		this.systemBtn[1] = {
			"id" : "x_cutScreenBtn",
			"imgUp" : "1.png",
			"imgDown" : "1_down.png",
			"title" : __i18n(__I18N_CUTSCREEN_X)
		};
		//2:纵向分屏按钮
		this.systemBtn[2] = {
			"id" : "y_cutScreenBtn",
			"imgUp" : "2.png",
			"imgDown" : "2_down.png",
			"title" :__i18n( __I18N_CUTSCREEN_Y)
		};
		//3:增强按钮
	/**	this.systemBtn[3] = {
			"id" : "strongBtn",
			"imgUp" : "jiegouhua.png",
			"imgDown" : "jiegouhua_down.png",
			"title" : __i18n(__I18N_INCREASE)
		};**/
		//4:新建按钮
		this.systemBtn[4] = {
				"id" : "newBtn",
				"imgUp" : "xinjian.png",
				"imgDown" : "xinjian_down.png",
				"title" : __i18n(__I18N_NEW)
		};
		//5:提示按钮
		/**this.systemBtn[5] = {
				"id" : "indexBtn",
				"imgUp" : "chat.png",
				"imgDown" : "chat_down.png",
				"title" : __i18n(__I18N_TIP)
			};**/
		//6:团队旅客导入
		/*this.systemBtn[6] = {
				"id" : "groupInBtn",
				"imgUp" : "daoru.png",
				"imgDown" : "daoru_down.png",
				"title" : __i18n(__I18N_GROUP)
			};*/
		//7:Soe指令开始符
		this.systemBtn[7] = {
				"id" : "soeBtn",
				"imgUp" : "soe.png",
				"imgDown" : "soe_down.png",
				"title" : "SOE"
			};
		//8:Xmit提交快捷键按钮
		this.systemBtn[8] = {
				"id" : "xmitBtn",
				"imgUp" : "xmit.png",
				"imgDown" : "xmit_down.png",
				"title" : "Xmit"
			};

		//工具子区域--系统工具按钮区
		this.systemToolBtn = document.createElement("div");
		if (__BROWSER.msie)
		{
			this.systemToolBtn.style.marginTop = "5px";
		}
		else
		{
			this.systemToolBtn.style.marginTop = "4px";
		}
		this.systemToolBtn.style.display = "inline";
		if (__BROWSER.msie)
		{
			this.systemToolBtn.style.styleFloat = "left";
		}
		else
		{
			this.systemToolBtn.style.cssFloat = "left";
		}
		
		//工具子区域--自定义快捷键按钮区
		this.userToolBtn = document.createElement("div");
		if (__BROWSER.msie)
		{
			this.userToolBtn.style.marginTop = "6px";
		}
		else
		{
			this.userToolBtn.style.marginTop = "5px";
		}
		this.userToolBtn.style.marginLeft = "20px";
		this.userToolBtn.style.display = "inline";
		if (__BROWSER.msie)
		{
			this.userToolBtn.style.styleFloat = "left";
		}
		else
		{
			this.userToolBtn.style.cssFloat = "left";
		}
		
		//工具子区域--自定义快捷键按钮隐藏区
		this.userHideTool = document.createElement("div");
		
		//工具子区域--黑屏状态（是否获取输入焦点）
		this.focusStatus = document.createElement("div");

		//初始化隐藏快捷键区域
		this.initUserHideBtn();
		
		this.toolsBar.appendChild(this.systemToolBtn);
		this.toolsBar.appendChild(this.userToolBtn);
		this.toolsBar.appendChild(this.userHideTool);
		this.toolsBar.appendChild(this.focusStatus);
		
		//默认显示的工具按钮
//		var buttonId  = new Array(5,3,0,1,2,4,0,7,8,0,6);
//		去掉团队信息导入、增强显示，唐勇 2013-11-06 
		var buttonId  = new Array(1,2,4,7,8);
		this.createToolBar(buttonId);
		
		this.container.appendChild(this.toolsBar);
	},

	// 工具按钮创建
	createToolBar : function(buttonId)
	{	
		var self = this;
		this.toolsBtn = new Array();
		this.toolsBtn[0] = "";
		for(var i = 0; i<buttonId.length;i++){
			var j = buttonId[i];
			if(j!=0 && null!=this.systemBtn[j]){
				//新建按钮
				this.toolsBtn[j] = document.createElement("button");
				this.toolsBtn[j].setAttribute = ("type","button");
				this.toolsBtn[j].id = this.systemBtn[j].id;
				this.toolsBtn[j].style.background = __format(this.imgUrl,this.systemBtn[j].imgUp);
				this.toolsBtn[j].style.backgroundRepeat = "no-repeat";
				this.toolsBtn[j].style.width = "35px";
				this.toolsBtn[j].style.height = "25px";
				this.toolsBtn[j].style.cursor = "pointer";
				this.toolsBtn[j].style.marginLeft = "8px";
				this.toolsBtn[j].style.marginRight = "8px";
				this.toolsBtn[j].title = this.systemBtn[j].title+"("+__i18n(__I18N_NOT_OPEN)+")";

				//为按钮绑定点击事件
				__bindEvent(this.toolsBtn[j],"click",function(e){ self.toolsBarClickEvent(e);});
				__bindEvent(this.toolsBtn[j],"mousedown",function(e){ self.toolsBarMouseDownEvent(e);});
				__bindEvent(this.toolsBtn[j],"mouseup",function(e){ self.toolsBarMouseUpEvent(e);});
				this.systemToolBtn.appendChild(this.toolsBtn[j]);		
				
			}else{				
				//分割线
				var line = document.createElement("button");
					line.setAttribute = ("type" , "button");
					line.style.background = __format(this.imgUrl,this.systemBtn[0].img);
					line.style.width = "1px";
					line.style.height = "24px";
					line.style.cursor = "default";
					line.style.marginLeft = "4px";
					line.style.marginRight = "4px";
					this.systemToolBtn.appendChild(line);	
			}
		}
		
		//是否获取焦点状态特殊处理
		if (__BROWSER.msie)
		{
			this.focusStatus.style.styleFloat = "right";
		}
		else
		{
			this.focusStatus.style.cssFloat = "right";
		}
		this.focusStatus.style.marginTop = "6px";
		//创建显示图片
		this.focusImg = document.createElement("img");
		this.focusImg.src = __format(this.imgPath, "anniu2.png");
		this.focusImg.style.height = "22px";
		this.focusImg.style.width = "22px";
		if (__BROWSER.msie)
		{
			this.focusImg.style.styleFloat = "right";
		}
		else
		{
			this.focusImg.style.cssFloat = "right";
		}
		this.focusImg.title = __i18n(__I18N_GETFOCUS);
		this.focusStatus.appendChild(this.focusImg);
	},
	
	// 初始化黑屏句柄，上面的那行，蓝色背景，切换多个屏幕用的
	initHandleBar : function()
	{
		var self = this;
		//新建句柄区域
		this.handleBar = document.createElement("div"); 
		this.handleBar.style.marginTop = "-3px";
		this.handleBar.style.backgroundColor = "#0066CC";
		this.handleBar.style.height = "22px";

		//句柄区域元素
		var handleItem = document.createElement("span");
			
		var mainScreenHandle = document.createElement("a");
			mainScreenHandle.href = "javascript:";
			mainScreenHandle.style.background = __format(this.imgUrl,"screen_in.png");
			
			mainScreenHandle.style.width = "60px";
			mainScreenHandle.style.height = "19px";
			mainScreenHandle.style.display = "inline-block";
			mainScreenHandle.style.cursor = "default";
			mainScreenHandle.style.border = "0";
			mainScreenHandle.style.marginTop = "2px";
			mainScreenHandle.title = __i18n(__I18N_MAIN_SCREEN);
			
			//绑定点击事件
			__bindEvent(mainScreenHandle,"click",function(e){ self.showScreen(e);});
			
			handleItem.appendChild(mainScreenHandle);
			
		this.handleBar.appendChild(handleItem);
		this.container.appendChild(this.handleBar);
		this.screenContainer[0][0] = handleItem;
	},

	// 初始化主屏容器
	initBlackScreen : function()
	{
		//初始化黑屏区域
		this.blackScreen = document.createElement("div");
		this.container.appendChild(this.blackScreen);
		
		//初始化时自动建立主屏
		this.screenContainer[0][1] = document.createElement("div");
		this.screenContainer[0][1].id = "bscontainer0";
		if (__BROWSER.msie)
		{
			this.screenContainer[0][1].style.styleFloat = "left";
		}
		else
		{
			this.screenContainer[0][1].style.cssFloat = "left";
		}
		this.blackScreen.appendChild(this.screenContainer[0][1]);

		// 为该容器新建组件  [2] [4]是里面的BlackScreenCtrl 1、3是外面的框
		this.screenContainer[0][2] = new BlackScreenCtrl();//在BlackScreenCtrl里面
		//2013-11-11  党会建  改成高度和宽度自适应
		var screenContainerHeight=600;
		var screenContainerWidth=1200;
		if($){
			var winHeight=$(window).height();
			var winWidth=$(window).width();
			var screenContainerWillHeight=parseFloat(winHeight-50);
			var screenContainerWillWidth=parseFloat(winWidth-200);
			screenContainerHeight=screenContainerWillHeight>screenContainerHeight?screenContainerWillHeight:screenContainerHeight;
			screenContainerWidth=screenContainerWillWidth>screenContainerWidth?screenContainerWillWidth:screenContainerWidth;
		}
		//在bscontainer0里面
		this.screenContainer[0][2].init({
			containerId : this.screenContainer[0][1].id,
			callback : this.fireEvent,
			height : screenContainerHeight,
			width : screenContainerWidth,
			fontSize:18,
			appInstance : this
		});
		this.currentScreen = this.screenContainer[0][2];
		
		//分屏进去
		this.screenContainer[0][3] = document.createElement("div");
		this.screenContainer[0][3].id = "bscontainer0F";
		this.blackScreen.appendChild(this.screenContainer[0][3]);
		// 为该容器新建组件
		this.screenContainer[0][4] = new BlackScreenCtrl();
		this.screenContainer[0][4].init({
			containerId : this.screenContainer[0][3].id,
			callback : this.fireEvent,
			height : 1,
			width : 1,
			appInstance : this
		});	
		this.screenContainer[0][3].style.display = "none";
	},

	// 初始化状态栏
	initStatusBar : function()
	{
		//创建状态栏
		this.statusBar = document.createElement("div");
		this.statusBar.style.height = "18px";
		this.statusBar.style.background = "#CCCCCC";
		this.statusBar.style.paddingTop = "5px";
		this.statusBar.style.fontFamily = "宋体";
		this.statusBar.style.fontSize = "14px";
		this.statusBar.style.color = "#006666";
		this.statusBar.style.paddingTop = "0px";
		if (__BROWSER.msie)
		{
			this.statusBar.style.styleFloat = "left";
		}
		else
		{
			this.statusBar.style.cssFloat = "left";
		}
		
		//分割线
		var sepItems = new Array();
		for(var i=0;i<4;i++){		
			sepItems[i] = document.createElement("span");
			var line = document.createElement("img");			
				line.src = __format(this.imgPath, "line_status.bmp");
				line.style.width = "1px";
				line.style.height = "18px";
				line.style.marginRight = "8px";
				line.style.marginLeft = "8px";
				line.style.verticalAlign = "top";
				sepItems[i].appendChild(line);	
		}
		
		//状态显示图像
		var statusItem = document.createElement("span");
		this.statusImg = document.createElement("img");
		this.statusImg.src = __format(this.imgPath, "anniu4.png");
		this.statusImg.style.height = "18px";
		this.statusImg.style.width = "18px";
		this.statusImg.style.verticalAlign = "top";
		statusItem.appendChild(this.statusImg);
		this.statusBar.appendChild(statusItem);
		
		//状态提示
		this.statusIndex = document.createElement("span");
		this.statusIndex.style.marginLeft = "8px";
		//this.statusIndex.style.display = "block";
		this.statusIndex.paddingTop = "1px";
		this.statusIndex.style.verticalAlign = "top";
		this.statusIndex.innerHTML = __i18n(__I18N_STATUSBAR_MSG["input"]);
		this.statusBar.appendChild(this.statusIndex);
		this.statusBar.appendChild(sepItems[0]);
		
//		//服务器处理时间
//		this.serverOperateTime = document.createElement("span");
//		//this.serverOperateTime.style.display = "block";
//		this.serverOperateTime.paddingTop = "1px";
//		this.serverOperateTime.style.verticalAlign = "top";
//		this.serverOperateTime.innerHTML = __i18n(__I18N_STATUSBAR_MSG["serverOperateTime"]);
//		this.statusBar.appendChild(this.serverOperateTime);
//		this.statusBar.appendChild(sepItems[1]);
//		
//		//网络传输时间
//		this.netTransportTime = document.createElement("span");
//		//this.netTransportTime.style.display = "block";
//		this.netTransportTime.paddingTop = "1px";
//		this.netTransportTime.style.verticalAlign = "top";
//		this.netTransportTime.innerHTML = __i18n(__I18N_STATUSBAR_MSG["netTransportTime"]);
//		this.statusBar.appendChild(this.netTransportTime);
//		this.statusBar.appendChild(sepItems[2]);
//		
//		//剩余流量
//		this.remainFlow = document.createElement("span");
//		//this.remainFlow.style.display = "block";
//		this.remainFlow.paddingTop = "1px";
//		this.remainFlow.style.verticalAlign = "top";
//		this.remainFlow.innerHTML = __i18n(__I18N_STATUSBAR_MSG["remainFlow"]);
//		this.statusBar.appendChild(this.remainFlow);
//		this.statusBar.appendChild(sepItems[3]);
		
		this.container.appendChild(this.statusBar);
	},
	
	// 更新系统功能按钮
	updateSystemToolBtn:function(buttonId)
	{
		for(var i = 0; i<buttonId.length;i++){
			var j = buttonId[i];
			if(j!=0 && null!=this.systemBtn[j]){
				this.toolsBtn[j].title = this.systemBtn[j].title;
			}		
		}
		
	},
	
	// 创建用户自定义快捷键
	createUserToolsBtn : function()
	{
		this.userToolBtn.innerHTML = "";
		this.userHideToolBtn.innerHTML = "";
		
		var self = this;
		for(var key in this.userFunKey){
		
			//需要显示快捷键按钮
			if(null!=this.userFunKey[key]["function"] && this.userFunKey[key]["function"]!=""){ 
				//判断快捷按钮长度
				var toolBarLehgth = this.systemToolBtn.offsetWidth+this.userToolBtn.offsetWidth;
				//长度过长时出现下拉列表
				if(toolBarLehgth>this.width-540){
					this.userHideTool.style.display = "";
					this.createUserHideToolBtn(this.userFunKey[key]);
				}else{
					/*
					var userBtn_left = document.createElement("button");
						userBtn_left.setAttribute("type", "button");
						userBtn_left.style.background = __format(this.imgUrl,"button_left.png");
						userBtn_left.style.width = "4px";
						userBtn_left.style.height = "22px";
						userBtn_left.style.marginLeft = "4px";
						userBtn_left.style.backgroundRepeat = "no-repeat";
						userBtn_left.style.verticalAlign = "top";
						userBtn_left.style.color = "#4B9CE0";
						userBtn_left.style.cursor = "pointer";
						userBtn_left.style.borderStyle = "none";
						
					var userBtn_center = document.createElement("button");
						userBtn_center.setAttribute("type", "button");
						userBtn_center.style.background = __format(this.imgUrl,"button_center.png");
						userBtn_center.style.height = "22px";
						userBtn_center.style.color = "#FFFFFF";
						userBtn_center.style.fontSize = "14px";
						userBtn_center.style.backgroundRepeat = "repeat-x";
						userBtn_center.style.verticalAlign = "top";
						userBtn_center.style.cursor = "pointer";
						userBtn_center.style.borderStyle = "none";
						//IE6/7button传值bug处理
						if(__BROWSER.msie && __BROWSER.version<8){
							userBtn_center.value = this.userFunKey[key]["function"];
							userBtn_center.setAttribute("class",this.userFunKey[key]["key"]);
						}else{
							userBtn_center.innerHTML = this.userFunKey[key]["function"];
							userBtn_center.value = this.userFunKey[key]["key"];
						}
		
					var userBtn_right = document.createElement("button");
						userBtn_right.setAttribute("type", "button");
						userBtn_right.style.background = __format(this.imgUrl,"button_right.png");
						userBtn_right.style.width = "4px";
						userBtn_right.style.height = "22px";
						userBtn_right.style.marginRight = "4px";
						userBtn_right.style.verticalAlign = "top";
						userBtn_right.style.cursor = "pointer";
						userBtn_right.style.backgroundRepeat = "no-repeat";
						userBtn_right.style.color = "#4B9CE0";
						userBtn_right.style.borderStyle = "none";
						
						if(null!=this.userFunKey[key]["remark"]){
							userBtn_left.title = this.userFunKey[key]["remark"];
							userBtn_center.title = this.userFunKey[key]["remark"];
							userBtn_right.title = this.userFunKey[key]["remark"];
						}
		
						this.userToolBtn.appendChild(userBtn_left);
						this.userToolBtn.appendChild(userBtn_center);
						this.userToolBtn.appendChild(userBtn_right);
						//绑定点击事件
						__bindEvent(userBtn_center,"mouseover",function(e){
							var element = e.target || e.srcElement;	
							element.style.color = "#CCCCFF";
						});
						__bindEvent(userBtn_center,"mouseout",function(e){
							var element = e.target || e.srcElement;	
							element.style.color = "#FFFFFF";
						});
						__bindEvent(userBtn_center,"click",function(e){ self.userBtnDown(e);});
						this.userHideTool.style.display = "none";
						*/
						//2013-11-18 党会建修改为最普通的button
						var userBtn = document.createElement("button");
						userBtn.setAttribute("type", "button");
						userBtn.style.backgroundColor ="#428BCA";
						userBtn.style.color = "#FFFFFF";
						userBtn.style.fontSize = "14px";
						userBtn.style.height = "25px";
						userBtn.style.backgroundRepeat = "repeat-x";
						userBtn.style.verticalAlign = "top";
						userBtn.style.cursor = "pointer";
						userBtn.style.marginRight = "3px";
						userBtn.style.border = "1px solid #357EBD";
						userBtn.style.padding="0 6px 0 6px";
						userBtn.style.textAlign="center";
						userBtn.style.borderRadius = "4px";
						//IE6/7button传值bug处理
						if(__BROWSER.msie && __BROWSER.version<8){
							userBtn.value = this.userFunKey[key]["function"];
							userBtn.setAttribute("class",this.userFunKey[key]["key"]);
						}else{
							userBtn.innerHTML = this.userFunKey[key]["function"];
							userBtn.value = this.userFunKey[key]["key"];
						}
						this.userToolBtn.appendChild(userBtn);
						__bindEvent(userBtn,"mouseover",function(e){
							var element = e.target || e.srcElement;	
							element.style.backgroundColor = "#3276B1";
						});
						__bindEvent(userBtn,"mouseout",function(e){
							var element = e.target || e.srcElement;	
							element.style.backgroundColor = "#428BCA";
						});
						__bindEvent(userBtn,"click",function(e){ self.userBtnDown(e);});
				}
			}
		}//for结束
		//弹出设置快捷键的弹框  2013-11-16 党会建添加开始  
		if($){
			var selfBtnHtml='<input type="button" id="seflBtn" value="定义快捷键" style="height:25px;padding:0 6px;border-radius:4px;background-color:#5CB85C;border:1px solid #4CAE4C;cursor:pointer;color:#fff;margin-left:20px;" >';
			$(this.userToolBtn).append(selfBtnHtml);
			var $selfBtn=$("#seflBtn");
			$selfBtn.off("mouseover.selfBtn").on("mouseover.selfBtn",function(){
				$selfBtn.css({backgroundColor:"#47A447",border:"1px solid #398439"});
			 });
			$selfBtn.off("mouseout.selfBtn").on("mouseout.selfBtn",function(){
				$selfBtn.css({backgroundColor:"#5CB85C",border:"1px solid #4CAE4C"});
			 });
			 $selfBtn.off("click.selfBtn").on("click.selfBtn",function(){
				 var options={
		            		url:window.GlobalURL+"/abframe/blackScreenSet/forwardBlackScreenSet",
							title:"设置个人快捷键",
							width:"800",
							height:"600"
					};
		            $.showTuiModalDialog(options);
			 });			
		}
		//2013-11-16 党会建添加结束	
	},
	
	//初始化隐藏的快捷键区域
	initUserHideBtn: function(){	
		this.userHideTool.style.display = "none";
		this.userHideTool.style.width = "290px";
		this.userHideTool.style.marginLeft = "20px";
		if (__BROWSER.msie)
		{
			this.userHideTool.style.styleFloat = "left";
		}
		else
		{
			this.userHideTool.style.cssFloat = "left";
		}
		
		//图像按钮(<<按钮)
		var showBtnDiv  = document.createElement("div");
			showBtnDiv.style.width = "20px";
			showBtnDiv.style.marginTop = "8px";
			if (__BROWSER.msie)
			{
				showBtnDiv.style.styleFloat = "left";
			}
			else
			{
				showBtnDiv.style.cssFloat = "left";
			}
		var showBtn = document.createElement("button");
			showBtn.style.background = __format(this.imgUrl,"show.png");
			showBtn.style.width = "22px";
			showBtn.style.height = "22px";
			showBtn.style.cursor = "pointer";
			if (__BROWSER.msie)
			{
				showBtn.style.styleFloat = "left";
			}
			else
			{
				showBtn.style.cssFloat = "left";
			}
			showBtnDiv.appendChild(showBtn);
			
		//所隐藏的按钮区(<<按钮弹出的区域)
		this.userHideToolBtn = document.createElement("div");
		this.userHideToolBtn.style.backgroundColor = "#0066FF";
		this.userHideToolBtn.style.marginTop = "16px";
		if(__BROWSER.msie && __BROWSER.version<8){
			this.userHideToolBtn.style.marginLeft = "0px";
		}else{
			this.userHideToolBtn.style.marginLeft = "24px";
		}
		this.userHideToolBtn.style.width = "270px";
		this.userHideToolBtn.style.height = "140px";
		this.userHideToolBtn.style.position = "absolute";
		this.userHideToolBtn.style.zIndex = "9000";
		this.userHideToolBtn.style.overflowX = "hidden";
		this.userHideToolBtn.style.overflowY = "auto";
		this.userHideToolBtn.style.display = "none";
		this.userHideToolBtn.style.borderStyle = "solid";
		this.userHideToolBtn.style.borderColor = "#FFFF99";
		this.userHideToolBtn.style.borderWidth = "1px";
		this.userHideToolBtn.tabIndex = 0;
	
		// 给图像绑定点击弹出事件
		var self = this;
		__bindEvent(showBtn, "click", function(e){
			 if(self.userHideToolBtn.style.display == "none") {
				 		self.userHideToolBtn.style.display ="";
				 	}
		        else{
		        		self.userHideToolBtn.style.display ="none"; 
		        	}
			 self.setFocus(true);
			 self.currentScreen.setFocus();
		});
		__bindEvent(this.userHideToolBtn, "blur", function(e){
		        	self.userHideToolBtn.style.display ="none"; 
		});
		this.userHideTool.appendChild(showBtnDiv);
		this.userHideTool.appendChild(this.userHideToolBtn);
		
	},
	
	//构建隐藏的用户自定义按钮
	createUserHideToolBtn: function(obj)
	{		
		var selectBtn = document.createElement("div");
			selectBtn.style.height = "24px";
			selectBtn.style.fontSize = "16px";
			selectBtn.style.lineHeight = "24px";
			selectBtn.style.overflow = "hidden";
			selectBtn.style.fontWeight = "normal";
			selectBtn.style.cursor = "default";
			
		//隐藏区域标签，为了传递div点击对应的命令传递
		var inputValue = document.createElement("input");
			inputValue.type = "hidden";
			inputValue.value = obj["key"];
			
		//快捷按钮名称
		var spanLeft = document.createElement("span");
			if (__BROWSER.msie)
			{
				spanLeft.style.styleFloat = "left";
			}
			else
			{
				spanLeft.style.cssFloat = "left";
			}
			spanLeft.style.color = "#FFFFFF";
			spanLeft.innerHTML  = obj["function"];
			spanLeft.value = obj["key"];
			
		//快捷按钮按键
		var spanRight = document.createElement("span");
			if (__BROWSER.msie)
			{
				spanRight.style.styleFloat = "right";
			}
			else
			{
				spanRight.style.cssFloat = "right";
			}
			spanRight.style.color = "#FFFFFF";
			spanRight.innerHTML  = obj["key"];
			spanRight.value = obj["key"];
			
			selectBtn.appendChild(inputValue);
			selectBtn.appendChild(spanLeft);
			selectBtn.appendChild(spanRight);
			this.userHideToolBtn.appendChild(selectBtn);	
			
		//绑定相关事件
		var self = this;
			__bindEvent(selectBtn, "mouseover", function(e){
				selectBtn.style.backgroundColor = "#0066CC";
			});
			__bindEvent(selectBtn, "mouseout", function(e){
				selectBtn.style.backgroundColor = "#0066FF";
			});
			__bindEvent(selectBtn, "click", function(e){
				self.userHideToolBtn.style.display ="none"; 
				self.userBtnDown(e);
			});
			
	},

	/** 
	 * 控件配置设置
	 * @param xml 配置内容
	 * @param id 功能号
	 *		 3: 字体颜色显示行数设置(默认)
	 *		 2(7): 系统功能键
	 *       1(5): 自定义
	 */
	setConfig : function(xml, id)
	{
		switch(id){
		 case 3:		//设置基本参数
			 for ( var i = 0; i < this.screenContainer.length; i++) {
					this.screenContainer[i][2].setCustomConfig(xml);
					this.screenContainer[i][4].setCustomConfig(xml);
				}
			 break;
		 case 7:		//设置系统功能键
			 var buttonId = this.handleConfigXML(xml);
			 this.updateSystemToolBtn(buttonId);
			 break;
		 case 5:		//设置自定义功能键
			 this.xmlToJson(xml);//在这个地方初始化了userFunKey
			 for ( var i = 0; i < this.screenContainer.length; i++) {
					this.screenContainer[i][2].userFunKey = this.userFunKey;
					this.screenContainer[i][4].userFunKey = this.userFunKey;
				}
			 // 生成相应按钮
			 this.createUserToolsBtn();
			 break;
		 default:break;
		};

	},

	// 设置黑屏高度与宽度
	resize : function(width, height)
	{
		this.height = height;
		this.width = width;
		
		this.container.style.height = height+"px";
		this.container.style.width = width+"px";
		this.toolsBar.style.width = width+"px";
		this.statusBar.style.width = width+"px";
		this.handleBar.style.width = width+"px";
		
		//设置自定义按键区
		this.createUserToolsBtn();
		
		// 20是句柄上层div的高度
		height = height - parseInt(this.toolsBar.style.height) - 18
				- parseInt(this.statusBar.style.height);
		this.blackScreen.style.height = height + "px";
		this.blackScreen.style.width = this.width + "px";
		switch(this.multiScreenStatus){
			case 0:
				for ( var i = 0; i < this.screenContainer.length; i++) {
					this.screenContainer[i][2].resize(width, height);
				}
				break;
			case 1:
				for ( var i = 0; i < this.screenContainer.length; i++) {
					this.screenContainer[i][2].resize(width, height/2);
					this.screenContainer[i][4].resize(width, height/2);
				}
				break;
			case 2:
				for ( var i = 0; i < this.screenContainer.length; i++) {
					this.screenContainer[i][2].resize(width/2, height);
					this.screenContainer[i][4].resize(width/2, height);
				}
				break;
			default:break;
			}
		__setCaret(this.currentScreen.workingArea, -1);		
	},

	// 向控件输入内容
	inputString : function(str)
	{
		if(null == str){
			return false;
		}
		if(null == this.operateScreen){
			this.operateScreen = this.screenContainer[0][2];
		}
		if(this.multiScreenStatus!=0){		
			var operateIndex = parseInt(this.operateScreen.containerId.substring(11));
			if(this.operateScreen.containerId.indexOf("F")>10){	
				//主屏副屏同步显示，注意顺序
				this.screenContainer[operateIndex][2].inputString(str);
				this.screenContainer[operateIndex][4].inputString(str);
				__setCaret(this.screenContainer[operateIndex][4].workingArea, -1);
			}else{
				this.screenContainer[operateIndex][4].inputString(str);
				this.screenContainer[operateIndex][2].inputString(str);
				__setCaret(this.screenContainer[operateIndex][2].workingArea, -1);
			}
		}else{
			this.operateScreen.inputString(str);
			__setCaret(this.operateScreen.workingArea, -1);
		}
			
	},

	// 锁住屏幕，禁止输入
	lockScreen : function(bLock)
 	{
		// 锁屏 --修改状态栏显示数据
		if (bLock == 1) {		
			this.statusImg.src = __format(this.imgPath, "anniu3.png");
			this.statusIndex.innerHTML = __i18n(__I18N_STATUSBAR_MSG["wait"]);
			for ( var i = 0; i < this.screenContainer.length; i++) {
				this.screenContainer[i][2].lockScreen(true);
				this.screenContainer[i][4].lockScreen(true);
			}	
			this.setFocus(false);
		} else {
			// 解屏
			this.statusImg.src = __format(this.imgPath, "anniu4.png");
			this.statusIndex.innerHTML = __i18n(__I18N_STATUSBAR_MSG["input"]);
			for ( var i = 0; i < this.screenContainer.length; i++) {
				this.screenContainer[i][2].lockScreen(false);
				this.screenContainer[i][4].lockScreen(false);
			}
			this.setFocus(true);
			this.currentScreen.setFocus();
		}
	},

	// 判断屏幕是否被锁住
	isScreenLocked : function()
	{
		return this.currentScreen.isScreenLocked();
	},

	// 设置服务器处理时间
	setElapsedTime : function(time)
	{
		this.serverOperateTime.innerHTML ="";// __i18n(__I18N_STATUSBAR_MSG["serverOperateTime"]) +":"+ time;
	},

	// 设置网络传输时间
	setNetTransportTime : function(time)
	{
		this.netTransportTime.innerHTML = "";//__i18n(__I18N_STATUSBAR_MSG["netTransportTime"]) +":"+time;
	},

	// 设置流量
	setFlow : function(flow)
	{
//		if(parseInt(flow)<=parseInt(this.flowTip)){
//			this.remainFlow.style.color = "#FF0000";
//		}else{
//			this.remainFlow.style.color = "#006666";
//		}
//		this.remainFlow.innerHTML = __i18n(__I18N_STATUSBAR_MSG["remainFlow"]) +":"+flow;
	},

	// 设置焦点
	setFocus : function(flag)
	{
		if(flag){
			this.focusImg.title = __i18n(__I18N_GETFOCUS);
			this.focusImg.src = __format(this.imgPath, "anniu2.png");
		}else{
			this.focusImg.title = __i18n(__I18N_LOSTFOCUS);
			this.focusImg.src = __format(this.imgPath, "anniu1.png");
		}
		
	},

	// 系统工具点击事件
	toolsBarClickEvent : function(e)
	{
		var element = e.target || e.srcElement;	
		var title = element.title;
		if(title.indexOf("(")>0){
			title = title.replace(/\(未开通\)/,"");
			title = title.replace(/\(未開通\)/,"");
			title = title.replace(/\(Do not open\)/,"");
			title = __i18n(__I18N_NOT_OPEN)+title+__i18n(__I18N_FUNCTION);
			alert(title);
			this.keepFocus();
			return;
		}
		//防止点击事件后失去焦点（IE下会失去）
		switch (element.id) {
			case "x_cutScreenBtn":
				this.keepFocus();
				this.x_cutScreenBtnClick(element);
				break;
			case "y_cutScreenBtn":
				this.keepFocus();
				this.y_cutScreenBtnClick(element);
				break;
			case "strongBtn":
				this.keepFocus();
				this.strongBtnClick(element);
				break;
			case "newBtn":
				this.keepFocus();
				this.newBtnClick();
				break;
			case "indexBtn":
				this.keepFocus();
				this.indexBtnClick(element);
				break;
			case "groupInBtn":
				this.keepFocus();
				if(!this.isScreenLocked()){
					this.fireEvent(__BS_EVENT_PASSENGER_INFO);
				}
				break;
			case "soeBtn":
				this.currentScreen.saveScrollTop();
				this.keepFocus();
				if(!this.isScreenLocked()){
					__insertHtml(null,BlackScreenCtrl.SOE);
				}
				this.currentScreen.restoreScrollTop();
				break;
			case "xmitBtn":
				this.keepFocus();
				var obj = this.currentScreen;
				if(!this.isScreenLocked()){
					if(this.blurLocation == "history"){
						var cmd = obj.pickUpCmd(obj.getCaretBeforeText(obj.historyArea));
						obj.sendCmd(cmd);
					}else{
						var cmd = obj.pickUpCmd(obj.getCaretBeforeText(obj.workingArea));
						obj.sendCmd(cmd);
					}
				}
				if(obj.isFullScreen()){
					obj.fullScreenCtrl.commit();
				}
				break;
			default:
				this.keepFocus();
			break;
		}
	},

	//回到之前的焦点--防止点击工具按钮后焦点消失
	keepFocus:function()
	{
		this.setFocus(true);
		var beforeText = "";
		if(this.blurLocation == "history"){
			this.currentScreen.historyArea.focus();
			beforeText = this.currentScreen.getCaretBeforeText(this.currentScreen.historyArea);
		}else{
			this.currentScreen.workingArea.focus();
			beforeText = this.currentScreen.getCaretBeforeText(this.currentScreen.workingArea);
		}	
		if(beforeText == ""){
			__setCaret(this.currentScreen.workingArea, -1);
		}
	},
	//系统工具鼠标按下事件（改变图标点下样式）
	toolsBarMouseDownEvent:function(e){
		var element = e.target || e.srcElement;	
		var title = element.title;
		if(title.indexOf("(")>0){
			return;
		}
		if(this.isScreenLocked()){
			return;
		}
		switch (element.id) {
			case "newBtn":
				this.toolsBtn[4].style.background = __format(this.imgUrl,this.systemBtn[4].imgDown);
				break;
			/*case "groupInBtn":
				this.toolsBtn[6].style.background = __format(this.imgUrl,this.systemBtn[6].imgDown);
				break;*/
			case "soeBtn"://2013-11-11党会建修改为 7 8
				this.toolsBtn[7].style.background = __format(this.imgUrl,this.systemBtn[7].imgDown);
				break;
			case "xmitBtn":
				this.toolsBtn[8].style.background = __format(this.imgUrl,this.systemBtn[8].imgDown);
				break;
			default:
				break;
		}
	},
	//系统工具鼠标按下事件（改变图标点下样式）
	toolsBarMouseUpEvent:function(e){
		var element = e.target || e.srcElement;	
		var title = element.title;
		if(title.indexOf("(")>0){
			return;
		}
		if(this.isScreenLocked()){
			return;
		}
		switch (element.id) {
			case "newBtn":
				this.toolsBtn[4].style.background = __format(this.imgUrl,this.systemBtn[4].imgUp);
				break;
			/**case "groupInBtn":
				this.toolsBtn[6].style.background = __format(this.imgUrl,this.systemBtn[6].imgUp);
				break;**/
			case "soeBtn"://2013-11-11党会建修改为 7 8
				this.toolsBtn[7].style.background = __format(this.imgUrl,this.systemBtn[7].imgUp);
				break;
			case "xmitBtn":
				this.toolsBtn[8].style.background = __format(this.imgUrl,this.systemBtn[8].imgUp);
				break;
			default:
				break;
		}
	},
	// 横向分屏
	x_cutScreenBtnClick : function(element)
	{
		var curentIndex = parseInt(this.currentScreen.containerId.substring(11));
		var height = this.height - parseInt(this.toolsBar.style.height) - 20
		- parseInt(this.statusBar.style.height);
		if (element.style.background.indexOf(this.systemBtn[1].imgUp)>0) {
			this.toolsBtn[2].style.background = __format(this.imgUrl, this.systemBtn[2].imgUp);
			element.style.background = __format(this.imgUrl, this.systemBtn[1].imgDown);
			this.multiScreenStatus = 1;
			//分屏的本质是修改屏的高度与宽度，并让分屏可见
			for(var i=0;i<this.screenContainer.length;i++){
				if (__BROWSER.msie)
				{
					this.screenContainer[i][3].style.styleFloat = "none";
					this.screenContainer[i][1].style.styleFloat = "none";
				}
				else
				{
					this.screenContainer[i][3].style.cssFloat = "none";
					this.screenContainer[i][1].style.cssFloat = "none";
				}
				this.screenContainer[i][2].resize(this.width,height/2);
				this.screenContainer[i][3].style.margin = "2px 0px 0px 0px";
				this.screenContainer[i][3].style.width = this.width+"px";
				this.screenContainer[i][3].style.height = (height/2 - 2) +"px";
				this.screenContainer[i][4].resize(this.width, (height/2 - 2));
			}
			this.screenContainer[curentIndex][3].style.display = "";
			__setCaret(this.currentScreen.workingArea, -1);
		} else {
			element.style.background = __format(this.imgUrl, this.systemBtn[1].imgUp);
			this.multiScreenStatus = 0;
			for(var i=0;i<this.screenContainer.length;i++){
				this.screenContainer[i][3].style.display = "none";
				this.screenContainer[i][2].resize(this.width,height);
			}

		}
	},

	// 纵向分屏
	y_cutScreenBtnClick : function(element)
	{
		var curentIndex = parseInt(this.currentScreen.containerId.substring(11));
		var height = this.height - parseInt(this.toolsBar.style.height) - 20
		- parseInt(this.statusBar.style.height);
		if (element.style.background.indexOf(this.systemBtn[2].imgUp)>0) {
			this.toolsBtn[1].style.background = __format(this.imgUrl, this.systemBtn[1].imgUp);
			element.style.background = __format(this.imgUrl, this.systemBtn[2].imgDown);
			this.multiScreenStatus = 2;
			//分屏的本质是修改屏的高度与宽度，并让分屏可见
			for(var i=0;i<this.screenContainer.length;i++){
				this.screenContainer[i][2].resize(this.width/2,height);
				if (__BROWSER.msie)
				{
					this.screenContainer[i][1].style.styleFloat = "left";
					this.screenContainer[i][3].style.styleFloat = "right";
				}
				else
				{
					this.screenContainer[i][1].style.cssFloat = "left";
					this.screenContainer[i][3].style.cssFloat = "right";
				}
				this.screenContainer[i][3].style.margin = "0px";
				this.screenContainer[i][3].style.width = this.width/2+"px";
				this.screenContainer[i][3].style.height = height+"px";
				this.screenContainer[i][4].resize(this.width/2, height);
			}
			this.screenContainer[curentIndex][3].style.display = "";
			__setCaret(this.currentScreen.workingArea, -1);
		} else {
			element.style.background = __format(this.imgUrl, this.systemBtn[2].imgUp);
			this.multiScreenStatus = 0;
			for(var i=0;i<this.screenContainer.length;i++){
				this.screenContainer[i][3].style.display = "none";
				this.screenContainer[i][2].resize(this.width,height);
			}
		}
	},

	// 加强
	strongBtnClick : function(element)
	{
		if(this.isScreenLocked()){alert(__i18n(__I18N_OPERATE_LATER));return false;};
		//增强
		if (element.style.background.indexOf(this.systemBtn[3].imgUp)>0) {
			element.style.background = __format(this.imgUrl, this.systemBtn[3].imgDown);
			this.fireEvent(__BS_EVENT_ENHANCE, "ON",this);
		} else {
			//关闭增强
			element.style.background = __format(this.imgUrl, this.systemBtn[3].imgUp);
			this.fireEvent(__BS_EVENT_ENHANCE,"",this);
		}

	},
	
	// 关闭提示
	indexBtnClick : function(button)
	{
		if (button.style.background.indexOf(this.systemBtn[5].imgUp) > 0) {
			button.style.background = __format(this.imgUrl, this.systemBtn[5].imgDown);
			for ( var i = 0; i < this.screenContainer.length; i++) {
				this.screenContainer[i][2].enableCmdTip(true);
				this.screenContainer[i][4].enableCmdTip(true);
			}
		} else {
			button.style.background = __format(this.imgUrl, this.systemBtn[5].imgUp);
			for ( var i = 0; i < this.screenContainer.length; i++) {
				this.screenContainer[i][2].enableCmdTip(false);
				this.screenContainer[i][4].enableCmdTip(false);
			}
		}
	},

	// 新建--多屏
	newBtnClick : function()
	{
		var self = this;
		// 变量id
		var attrname = "bscontainer";

		// 当前屏实例个数
		var number = this.screenContainer.length;
		if(number>=11){
			alert(__i18n(__I18N_SCREEN_NUM));
			return false;
		}
		// 新建屏
		this.screenContainer[number] = new Array();

		// 创建新句柄
		var handleItem = document.createElement("span");
		handleItem.style.marginLeft = "5px";
		this.screenContainer[0][0].parentNode.appendChild(handleItem);
		this.screenContainer[number][0] = handleItem;

		//句柄按钮
		var handleBtn = document.createElement("a");
			handleBtn.href = "javascript:";
			handleBtn.style.background = __format(this.imgUrl,"Fscreen_in.png");
			handleBtn.style.marginTop = "2px";
			handleBtn.style.backgroundRepeat = "no-repeat";
			handleBtn.style.height = "19px";
			handleBtn.style.width = "40px";
			handleBtn.style.display = "inline-block";
			handleBtn.style.cursor = "default";
			handleBtn.title = __i18n(__I18N_SUB_SCREEN);
			
			//绑定事件
			__bindEvent(handleBtn,"click",function(e){ self.showScreen(e);});
			this.screenContainer[number][0].appendChild(handleBtn);
			
		// 关闭按钮	
		var handleClose = document.createElement("a");
			handleClose.href = "javascript:";
			handleClose.style.background = __format(this.imgUrl,"fpX.png");
			handleClose.style.backgroundRepeat = "no-repeat";
			handleClose.style.height = "19px";
			handleClose.style.width = "20px";
			handleClose.style.display = "inline-block";
			handleClose.style.cursor = "pointer";
			handleClose.title = __i18n(__I18N_CLOSE);
			//绑定事件
			__bindEvent(handleClose,"click",function(e){ self.closeScreen(e);});
			this.screenContainer[number][0].appendChild(handleClose);
		
		// 隐藏当前屏，修改当前屏句柄样式
		var curentIndex = parseInt(this.currentScreen.containerId.substring(11));
		if(curentIndex==0){
			this.screenContainer[curentIndex][0].childNodes[0].style.background = __format(this.imgUrl, "screen_out.png");
		}else{
			this.screenContainer[curentIndex][0].childNodes[0].style.background = __format(this.imgUrl, "Fscreen_out.png");
			this.screenContainer[curentIndex][0].childNodes[1].style.background = __format(this.imgUrl, "fpX_blur.png");
		}
		
		this.screenContainer[curentIndex][2].hide();
		this.screenContainer[curentIndex][4].hide();

		// 创建新的黑屏容器
		this.screenContainer[number][1] = document.createElement("div");
		if(this.multiScreenStatus != 1){
			if (__BROWSER.msie)
			{
				this.screenContainer[number][1].style.styleFloat = "left";
			}
			else
			{
				this.screenContainer[number][1].style.cssFloat = "left";
			}
		}
		this.screenContainer[number][1].setAttribute("id", attrname + number.toString());
		this.blackScreen.appendChild(this.screenContainer[number][1]);

		// 创建新的黑屏组件
		this.screenContainer[number][2] = new BlackScreenCtrl();
		this.screenContainer[number][2].init({
			containerId : attrname + number.toString(),
			callback : this.fireEvent,
			width : this.currentScreen.width,
			height : this.currentScreen.height,
			fontFamily : this.currentScreen.fontFamily,
			fontSize : this.currentScreen.fontSize,
			historyAreaBgColor : this.currentScreen.historyAreaBgColor,
			historyAreaFontColor : this.currentScreen.historyAreaFontColor,
			workingAreaBgColor : this.currentScreen.workingAreaBgColor,
			workingAreaFontColor : this.currentScreen.workingAreaFontColor,
			userFunKey : this.userFunKey,
			appInstance : this
		});

		// 创建新的分屏容器
		this.screenContainer[number][3] = document.createElement("div");
		this.screenContainer[number][3].setAttribute("id", attrname + number.toString()+"F");
		this.blackScreen.appendChild(this.screenContainer[number][3]);

		// 创建新的黑屏组件
		this.screenContainer[number][4] = new BlackScreenCtrl();
		this.screenContainer[number][4].init({
			containerId : attrname + number.toString()+"F",
			callback : this.fireEvent,
			width : this.currentScreen.width,
			height : this.currentScreen.height,
			fontFamily : this.currentScreen.fontFamily,
			fontSize : this.currentScreen.fontSize,
			historyAreaBgColor : this.currentScreen.historyAreaBgColor,
			historyAreaFontColor : this.currentScreen.historyAreaFontColor,
			workingAreaBgColor : this.currentScreen.workingAreaBgColor,
			workingAreaFontColor : this.currentScreen.workingAreaFontColor,
			userFunKey : this.userFunKey,
			appInstance : this
		});
		
		if(this.multiScreenStatus == 0){
			this.screenContainer[number][3].style.display = "none";
		}else if(this.multiScreenStatus == 2){
			if (__BROWSER.msie)
			{
				this.screenContainer[number][3].style.styleFloat = "right";
			}
			else
			{
				this.screenContainer[number][3].style.cssFloat = "right";
			}
		}
		else
		{
			this.screenContainer[number][3].style.margin = "2px 0px 0px 0px";
		}
		
		this.currentScreen = this.screenContainer[number][2];
		// 如果当前有屏正在操作并且已经被锁
		if (this.isScreenLocked()) {
			this.screenContainer[number][2].lockScreen(true);
			this.screenContainer[number][4].lockScreen(true);
		}else{		
			__setCaret(this.currentScreen.workingArea, -1);
		}
	},

	// 点击句柄时显示该屏
	showScreen : function(e)
	{
		var element = e.target || e.srcElement;	
		var index = this.getIndex(element.parentNode);
		var curentIndex = parseInt(this.currentScreen.containerId.substring(11));

		if (index == curentIndex)
			return;

		// 隐藏当前屏，修改当前屏句柄样式
		this.screenContainer[curentIndex][2].hide();
		this.screenContainer[curentIndex][4].hide();
		if(curentIndex==0){
			this.screenContainer[curentIndex][0].childNodes[0].style.background = __format(this.imgUrl, "screen_out.png");
		}else{
			this.screenContainer[curentIndex][0].childNodes[0].style.background = __format(this.imgUrl, "Fscreen_out.png");
			this.screenContainer[curentIndex][0].childNodes[1].style.background = __format(this.imgUrl, "fpX_blur.png");
		}

		// 显示所点击的句柄对应的屏
		this.screenContainer[index][2].show();
		if(this.multiScreenStatus!=0){
			this.screenContainer[index][4].show();
		}
		if(index==0){
			this.screenContainer[index][0].childNodes[0].style.background = __format(this.imgUrl, "screen_in.png");
		}else{
			this.screenContainer[index][0].childNodes[0].style.background = __format(this.imgUrl, "Fscreen_in.png");
			this.screenContainer[index][0].childNodes[1].style.background = __format(this.imgUrl, "fpX.png");
		}
		
		this.currentScreen = this.screenContainer[index][2];
		__setCaret(this.currentScreen.workingArea, -1);
	},
	
	//切换屏--功能键ctrl+s触发
	exchangeScreen: function()
	{
		var screenNum = this.screenContainer.length;
		var currentIndex = 0;
		var nextIndex = 0;
		for(var i=0;i<screenNum;i++){
			//
			if(this.screenContainer[i][2] == this.currentScreen||this.screenContainer[i][4] == this.currentScreen){
				currentIndex = i;
				break;
			}
		}
		if(currentIndex<screenNum-1){
			nextIndex = currentIndex+1;
		}
		
		if(nextIndex==0){
			if(currentIndex==0){
				return;
			}else{
				//隐藏当前屏
				this.screenContainer[currentIndex][0].childNodes[0].style.background = __format(this.imgUrl, "Fscreen_out.png");
				this.screenContainer[currentIndex][0].childNodes[1].style.background = __format(this.imgUrl, "fpX_blur.png");
				//显示主屏
				this.screenContainer[nextIndex][0].childNodes[0].style.background = __format(this.imgUrl, "screen_in.png");
			}
		}else{
			if(currentIndex==0){
				this.screenContainer[currentIndex][0].childNodes[0].style.background = __format(this.imgUrl, "screen_out.png");
			}else{
				//隐藏当前屏
				this.screenContainer[currentIndex][0].childNodes[0].style.background = __format(this.imgUrl, "Fscreen_out.png");
				this.screenContainer[currentIndex][0].childNodes[1].style.background = __format(this.imgUrl, "fpX_blur.png");
			}
			
			//显示下一屏
			this.screenContainer[nextIndex][0].childNodes[0].style.background = __format(this.imgUrl, "Fscreen_in.png");
			this.screenContainer[nextIndex][0].childNodes[1].style.background = __format(this.imgUrl, "fpX.png");
		}
		this.screenContainer[currentIndex][2].hide();
		this.screenContainer[currentIndex][4].hide();
		this.currentScreen = this.screenContainer[nextIndex][2];
		this.currentScreen.show();
		if(this.multiScreenStatus!=0){
			this.screenContainer[nextIndex][4].show();
		}
		if(!this.isScreenLocked()){
			__setCaret(this.currentScreen.workingArea, -1);
		}else{
			this.currentScreen.workingArea.contentEditable = true;
			__setCaret(this.currentScreen.workingArea, -1);
			this.currentScreen.workingArea.contentEditable = false;
		}
		
	},

	// 点击关闭按钮x时关闭该屏
	closeScreen : function(e)
	{
		var element = e.target || e.srcElement;	
		var index = this.getIndex(element.parentNode);
		if (this.isScreenLocked()&&(this.operateScreen == this.screenContainer[index][2]||this.operateScreen == this.screenContainer[index][4])) {
			alert(__i18n(__I18N_CANNOT_CLOSE));
			//防止点击后失去焦点
			this.currentScreen.workingArea.contentEditable = true;
			__setCaret(this.currentScreen.workingArea, -1);
			this.currentScreen.workingArea.contentEditable = false;
			return false;
		}

		if (confirm(__i18n(__I18N_CONFIRM_CLOSE))) {
			// 删除该屏对应的页面元素：句柄，容器
			this.screenContainer[0][0].parentNode.removeChild(this.screenContainer[index][0]);
			this.blackScreen.removeChild(this.screenContainer[index][1]);
			this.blackScreen.removeChild(this.screenContainer[index][3]);

			// 删除数组中的对象
			this.screenContainer.splice(index, 1);

			// 修改组件
			for ( var i = 0; i < this.screenContainer.length; i++) {
				this.screenContainer[i][1].id = "bscontainer" + i.toString();
				this.screenContainer[i][2].container = this.screenContainer[i][1];
				this.screenContainer[i][2].containerId = "bscontainer" + i.toString();
				this.screenContainer[i][3].id = "bscontainer" + i.toString()+"F";
				this.screenContainer[i][4].container = this.screenContainer[i][3];
				this.screenContainer[i][4].containerId = "bscontainer" + i.toString()+"F";
			}

			// 如果删除的屏是当前屏，则把该屏的前一屏作为当前显示屏
			var currentindex = parseInt(this.currentScreen.containerId.substring(11));
			if (currentindex == index) {
				if (currentindex == this.screenContainer.length) {
					currentindex--;
				}
				this.screenContainer[currentindex][2].show();
				if(this.multiScreenStatus!=0){
					this.screenContainer[currentindex][4].show();
				}
				if(currentindex==0){
					this.screenContainer[currentindex][0].childNodes[0].style.background = __format(this.imgUrl, "screen_in.png");
				}else{
					this.screenContainer[currentindex][0].childNodes[0].style.background = __format(this.imgUrl, "Fscreen_in.png");
					this.screenContainer[currentindex][0].childNodes[1].style.background = __format(this.imgUrl, "fpX.png");
				}
				this.currentScreen = this.screenContainer[currentindex][2];
			}
			//防止点击后失去焦点
			if(this.isScreenLocked()){
				this.currentScreen.workingArea.contentEditable = true;
				__setCaret(this.currentScreen.workingArea, -1);
				this.currentScreen.workingArea.contentEditable = false;
			}else{
				__setCaret(this.currentScreen.workingArea, -1);
			}
		}
	},

	//自定义快捷键按钮
	userBtnDown : function(e)
	{   
		if(this.isScreenLocked())return;
		var element = e.target || e.srcElement;
		var key = element.value || element.childNodes[0].value;
		if(__BROWSER.msie && __BROWSER.version<8){
			key = null==element.getAttribute("class")? key : element.getAttribute("class");
		}
		key = key.replace(/\+/gm, "");
		this.currentScreen.userFunkeyHandle(key);
	},
	// 提交当前黑屏内容
	transmit : function()
	{
		if(this.isScreenLocked())return;
		this.operateScreen.transmit();
	},

	// 发送指令
	sendCmd : function(cmd)
	{
		if(this.isScreenLocked())return;
		this.currentScreen.sendCmd(cmd);
	},
	
	// 抛出事件
	fireEvent : function(eventId, msg, appInstance, screen)
	{
		//注意this的变化
		appInstance = appInstance || this;
		try
		{
			switch(eventId){
			case __BS_EVENT_ENHANCE:
				appInstance.callback(eventId,msg);
				break;
			case __BS_EVENT_LOCKSCREEN:
				if(msg=="true"){
					appInstance.lockScreen(1);
				}else{
					appInstance.lockScreen(0);
				}
				break;
			case __BS_EVENT_RELEASESCREEN:
				appInstance.lockScreen(false);
				break;
			case __BS_EVENT_FOCUS://焦点事件
				if(msg=="true"){
					appInstance.setFocus(true);
					appInstance.currentScreen = screen;
					if(null!=appInstance.operateScreen && !appInstance.isScreenLocked()){
						appInstance.operateScreen = screen;
					}
				}else{
					if(msg.indexOf("history")>0){
						appInstance.blurLocation = "history";
					}else{
						appInstance.blurLocation = "working";
					}
					appInstance.setFocus(false);
				}
				break;
			case __BS_EVENT_EXCHANGESCREEN:
				appInstance.exchangeScreen();
				break;
			case __BS_EVENT_CMD:
			case __BS_EVENT_HOTKEY://快捷键
				appInstance.operateScreen = screen;	
				//判断是否分屏
				if(appInstance.multiScreenStatus!=0 && msg!=null){	
					var operateIndex = parseInt(appInstance.operateScreen.containerId.substring(11));
					//在分屏中同步显示命令
					var screenMain = appInstance.screenContainer[operateIndex][2];
					var screenF = appInstance.screenContainer[operateIndex][4];
					var functionReg = /^F([0-9]|10|11)$/g;
					//这里主要处理指令迁移
					if(appInstance.operateScreen.containerId.indexOf("F")>10){		
						if (screenF.shouldMigrate() && !screenMain.innerHTML){
							screenMain.historyArea.style.display = "";
							screenMain.migrateHtml();
						}else{
							//pata不迁移指令，暂时什么也不做
						}
						if(!functionReg.test(msg)){
							screenMain.inputString(BlackScreenCtrl.SOE, true);
							msg = msg.replace(/\n\n/g, "\r\n");
							screenMain.inputString(msg,true);
						}
					}else{
						if (screenMain.shouldMigrate() && !screenF.innerHTML){
							screenF.historyArea.style.display = "";
							screenF.migrateHtml();
						}else{
							//pata不迁移指令，暂时什么也不做
						}
						if(!functionReg.test(msg)){
							screenF.inputString(BlackScreenCtrl.SOE, true);
							msg = msg.replace(/\n\n/g, "\r\n");
							screenF.inputString(msg,true);
						}
					}
					//同步输入可能导致当前操作屏已经被切换，重新赋值
					appInstance.operateScreen = screen;	
				}
				appInstance.callback(eventId,msg);
				break;
			default:
				appInstance.operateScreen = screen;	
				appInstance.callback(eventId,msg);
				break;
			}
		}
		catch(ex)
		{	
		}
	},
	
	//记录日志
	writeData : function(data,isEnter)
	{
		if (__BROWSER.msie)
		{
			try{
				var fso, f; 
				fso = new ActiveXObject("Scripting.FileSystemObject");        
				f = fso.OpenTextFile(this.logPath,8,true);
				f.WriteLine(data);
				if(isEnter == "1"){
					f.WriteLine();
				};
				f.Close(); 
			}catch(ex)
			{	
			}
	     }
	},

	// 获取节点的索引
	getIndex : function(dom)
	{
		if (dom && dom.nodeType && dom.nodeType == 1) // 1.有参数传进来，2.参数必须是DOM节点，3.参数必需是DOM的元素类型的节点
		{
			var oParent = dom.parentNode; // 获取这个元素的父级节点
			var oChilds = oParent.childNodes; // 找这个元素的所有的元素类型的子节点

			// 为兼容FF去掉多余换行等节点
			var childs = new Array();
			for ( var i = 0; i < oChilds.length; i++) {
				if (oChilds[i] && oChilds[i].nodeType
						&& oChilds[i].nodeType == 1) {
					childs[childs.length] = oChilds[i];
				}
			}

			for ( var i = 0; i < childs.length; i++) {
				if (childs[i] == dom) // 如果当前的这个子节点和dom一样，则i既为索引号
					return i;
			}
		} else {
			return 0;
		}

	},

	// 解析功能键初始化xml设置，返回功能键编号
	handleConfigXML : function(xml){
		
		//功能号数组
		var buttonId = new Array();
		
		var xmlDoc = __createXmlDoc(xml);
		var xmlDocument = xmlDoc.documentElement;
		
		var buttonList = xmlDocument.getElementsByTagName("Button");
		
		for(var i=0; i<buttonList.length; i++){
			if(buttonList[i].getAttribute('type')!="1"){
				buttonId[i]=buttonList[i].getAttribute('value')-0;
			}else{
				buttonId[i]=0;
			}
		}
	 return buttonId;
	},
	
	/**自定义功能键XML转换为json对象
	 * 
	 * @param xml结构
	 * <Accels>
	 *		<Accel key="\'Ctrl+F1\'" function="\'c\'" remark="\'1212121\'" index="\'0\'" level="\'0\'">
	 *			<Command>&gt;da</Command>
	 *     </Accel>
	 *     ...
     * </Accels> 
	 */
	xmlToJson : function(xml)
	{
		var xmlDoc = __createXmlDoc(xml);
		var xmlDocument = xmlDoc.documentElement;
		
		var funkeyJson = {};

		var accelNode = xmlDocument.getElementsByTagName("Accel");
		for(var i=0; i<accelNode.length; i++){
			var key = accelNode[i].getAttribute('key');
			var keyCommand = accelNode[i].childNodes[0].text
					|| accelNode[i].childNodes[0].textContent;
	
			var keyData = {
				"key" : key,
				"function" : accelNode[i].getAttribute('function'),
				"remark" : accelNode[i].getAttribute('remark'),
				"index" : accelNode[i].getAttribute('index'),
				"level" : accelNode[i].getAttribute('level'),
				"command" : keyCommand
			};
			
			key = key.replace(/\+/gm, "");
			funkeyJson[key] = keyData;
		}
		this.sortJson(funkeyJson);
	},
	
	//对功能键排序  这里也定义了全局的userFunKey
	sortJson:function(funkeyJson){
		var funkey = new Array(),
			i=0;
		this.userFunKey = {};
		
		for(var key in funkeyJson){
			funkey[i] = key;
			i++;
		}
		funkey.sort();
		
		for(var j=0;j<funkey.length;j++){
			this.userFunKey[funkey[j]] = funkeyJson[funkey[j]];
		}
		
	},
	
	//记事本
	notePadRun: function()
	{
		try{		
			var wsh=new ActiveXObject("WScript.Shell");
			wsh.Run("notepad");
		}catch(e){
			alert("如果没有打开记事本，可能的原因如下：\n1.目前只有IE浏览器支持该功能;\n" +
					"2.IE浏览器安全设置项\"对未标记为可安全执行脚本的ActiveX控件初始化并执行脚本\"设置为\"禁用\"导致该功能不可用，建议设置为\"提示\";"+
					"\n3.若有是否允许Active交互安全的相关提示，请选择\"是\".");
		}
	},
	
	//计算器
	calcRun: function()
	{
		try{		
			var wsh=new ActiveXObject("WScript.Shell");
			wsh.Run("calc");
		}catch(e){
			alert("如果没有打开计算器，可能的原因如下：\n1.目前只有IE浏览器支持该功能;\n" +
					"2.IE浏览器安全设置项\"对未标记为可安全执行脚本的ActiveX控件初始化并执行脚本\"设置为\"禁用\"导致该功能不可用，建议设置为\"提示\";"+
					"\n3.若有是否允许Active交互安全的相关提示，请选择\"是\".");
		}
	},
	// 显示/隐藏工具栏图标
	initPointBtn:function()
	{
		//2013-11-11 党会建修改，
		var self = this;
		var hideDIV = window.parent.document.getElementById("f");
		this.pointDiv = document.createElement("div");
		this.pointDiv.style.position = "relative";
		if (__BROWSER.msie)
		{
			this.pointDiv.style.right = "20px";
			this.pointDiv.style.styleFloat = "right";
		}
		else
		{
			this.pointDiv.style.right = "24px";
			this.pointDiv.style.cssFloat = "right";
		}
		
		this.pointDiv.style.bottom = "50px";
		
		var pointImg = document.createElement("img");
		pointImg.title = __i18n(__I18N_POINTDOWN);
		pointImg.src = __format(this.imgPath, "b.png");
		pointImg.style.height = "28px";
		pointImg.style.width = "28px";
		
		this.pointDiv.appendChild(pointImg);
		this.container.appendChild(this.pointDiv);
		
		__bindEvent(pointImg,"click",function(e){
			if(!self.isFullScreen){
				hideDIV.style.display = "none";
				window.parent.document.getElementById("blackScren").height = parseInt(self.height)+38;
				window.parent.document.getElementById("blackScren").style.height = parseInt(self.height)+38+"px";
				self.resize(self.width,parseInt(self.height)+38);
				self.isFullScreen = true;
				pointImg.src = __format(self.imgPath, "y.png");
				pointImg.title = __i18n(__I18N_POINTUP);
			}else{
				window.parent.document.getElementById("blackScren").height = parseInt(self.height)-38;
				window.parent.document.getElementById("blackScren").style.height = parseInt(self.height)-38+"px";
				self.resize(self.width,parseInt(self.height)-38);
				self.isFullScreen = false;
				pointImg.src = __format(self.imgPath, "b.png");
				pointImg.title = __i18n(__I18N_POINTDOWN);
				$(hideDIV).show("slide",{direction: 'down'},"200");
			}
		});
		__bindEvent(pointImg,"mouseover",function(e){
			if(!self.isFullScreen){
				pointImg.src = __format(self.imgPath, "b1.png");
			}else{
				pointImg.src = __format(self.imgPath, "y1.png");
			}
		});
		__bindEvent(pointImg,"mouseout",function(e){
			if(!self.isFullScreen){
				pointImg.src = __format(self.imgPath, "b.png");
			}else{
				pointImg.src = __format(self.imgPath, "y.png");
			}
		});
		
	}		
};
