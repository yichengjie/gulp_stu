/**
* JS黑屏核心控件
* 
* @author		huangjian
* @date			2013-05-21
* @version 		1.0
* @copyright 	中国航信重庆研发中心，2013.
* 20150521  党会建修改 translate 方法，chrome40以上，空格不对齐
*
*/

/**************************************************
 * 提供以下外部接口：
 * init(options): 初始化控件
 * setConfig(xml, id): 设置自定义配置
 * inputString(str, bNotNewLine): 输入显示内容
 * transmit(): 发送当前命令
 * setFocus(): 设置焦点
 * resize(width, height): 改变大小
 * sendCmd(cmd): 显示并发送指定命令
 * lockScreen(bLock): 锁定/解锁，即是否允许键盘输入
 * isScreenLocked(): 获取锁定状态
 * enableCmdTip(bEnable): 使能命令格式提示
 *************************************************/


/**************************************************
 * 全局变量
 *************************************************/
__BS_EVENT_CMD 					= 1;	// 普通命令
__BS_EVENT_HOTKEY 				= 2;	// 快捷键
__BS_EVENT_FULLSCREEN_DATA 		= 3;	// 全屏数据
__BS_EVENT_FULLSCREEN_HOTKEY 	= 4;	// 全屏快捷键
__BS_EVENT_CLICK 				= 5;	// 鼠标点击
__BS_EVENT_ENHANCE    			= 6;	// 增强命令
__BS_EVENT_LOCKSCREEN			= 7;	// 锁屏事件
__BS_EVENT_RELEASESCREEN		= 8;	// 释放屏幕
__BS_EVENT_FOCUS				= 9;	// 焦点事件
__BS_EVENT_EXCHANGESCREEN		= 10;	// 交换屏幕
__BS_EVENT_PASSENGER_INFO       = 11; 	// 旅客信息导入
 
/**************************************************
 * 黑屏控件
 *************************************************/
// 黑屏控件构造函数
function BlackScreenCtrl()
{
	// 成员变量
	this.container = null;			// 容器元素
	this.historyArea = null;		// 历史区元素
	this.workingArea = null;		// 工作区元素
	this.cmd = "";					// 当前命令
	this.tipWidget = null;			// 提示窗口部件
	this.historyCmdWidget = null;	// 历史命令列表窗口部件
	this.range = null;				// 当前选中对象
	this.scrollTop = 0;				// 当前滚动偏移
	this.bFullScreen = false;		// 是否全屏
	this.fullScreenCtrl = null;		// 全屏控件
}

// 命令起始符
if (__BROWSER.msie)
{
	BlackScreenCtrl.SOE = "\u25BA";
}
else
{
	BlackScreenCtrl.SOE = "\u25B6";
}
BlackScreenCtrl.CMD_TIP_ENABLED = false;        // 命令格式提示与否
BlackScreenCtrl.SCREEN_LOCKED = false;          // 屏幕是否锁住
BlackScreenCtrl.HISTORY_CMD_LIST = new Array(); // 历史命令列表

// 黑屏控件原型
BlackScreenCtrl.prototype = 
{
	// 构造函数
	constructor: BlackScreenCtrl,
	
	// 初始化
	init: function(options)
	{
		// 获取容器元素
		this.container = document.getElementById(options.containerId);			
		if (!this.container)
		{
			return false;
		}
		
		// 设置参数
		this.setOptions(options);
		
		// 设置容器元素的显示属性
		this.setContainerStyle();
		// 设置鼠标键盘事件
		this.setContainerEventHandler();
		
		// 创建历史区元素
		this.historyArea = document.createElement("div");
		// 设置显示属性
		this.setHistoryAreaStyle();
		// 设置鼠标键盘事件
		this.setHistoryAreaEventHandler();
		
		// 创建工作区元素
		this.workingArea = document.createElement("div");
		// 设置显示属性
		this.setWorkingAreaStyle();
		// 设置鼠标键盘事件
		this.setWorkingAreaEventHandler();
		
		// 加入容器元素
		this.container.appendChild(this.historyArea);
		this.container.appendChild(this.workingArea);
		
		// 创建提示窗口
		this.tipWidget = new BSTipWidget();
		// 历史命令列表窗口部件
		this.historyCmdWidget = new BSHistoryCmdWidget(this);
		
		this.resize();
		this.setFocus();
		this.setSOE();
		
		return true;
	},
	
	// 设置参数
	setOptions: function(options)
	{
		options = options || {};
		
		// 配置参数
		this.fontFamily = options.fontFamily || "新宋体";	// 黑屏字体
		this.fontSize = options.fontSize || 14;			// 黑屏字体大小
		this.historyAreaBgColor = options.historyAreaBgColor || "#555555";  	// 历史区背景颜色
		this.historyAreaFontColor = options.historyAreaFontColor || "#BBBB00"; 	// 历史区字体颜色
		this.workingAreaBgColor = options.workingAreaBgColor || "#000000";		// 工作区背景颜色
		this.workingAreaFontColor = options.workingAreaFontColor || "#00FF00";	// 工作区字体颜色
		this.callback = options.callback;		// 黑屏在页面的回调函数，处理黑屏抛出的事件或消息
		this.appInstance = options.appInstance;	// 外部应用实例的句柄
		this.width = options.width || 800;				// 容器元素宽
		this.height = options.height || 600;			// 容器元素高
		this.containerId = options.containerId;	// 容器元素的id
		this.userFunKey = options.userFunKey;	// 容器绑定的用户自定义快捷键
	},
	
	/** 
	 * 控件配置设置
	 * @param xml 配置内容
	 * @param id 功能号
	 *		 1: 字体颜色显示行数设置
	 *		 2: 系统功能键事件
	 */
	setConfig: function(xml, id)
	{

	},
	
	// 重设控件大小
	resize: function(width, height)
	{
		// 设定控件的长、宽
		this.width = width || this.width;
		this.height = height || this.height;
		this.container.style.width = this.width + "px";
		this.container.style.height = this.height + "px";
		this.workingArea.style.height = this.height * 3 + "px";
		
		// 将历史区滚动至最顶部
		this.container.scrollTop = this.historyArea.offsetHeight;
		__setCaret(this.workingArea, -1);
	},
	
	// 向控件输入内容
	inputString: function(str, bNotNewLine)
	{		
		// 转换响应数据
		var result = this.translate(str);
		
		// 全屏数据
		if (result.mode == "fullScreen")
		{
			// 创建全屏控件
			if (!this.fullScreenCtrl)
			{
				this.fullScreenCtrl = new FullScreenCtrl(this);
			}
			
			// 开始全屏模式
			this.fullScreenCtrl.start(result.html);
		}
		// 普通数据
		else
		{
			if (this.isFullScreen())
			{
				// 结束全屏模式
				this.fullScreenCtrl.finish();
			}
			
			var html = (bNotNewLine ? "" : "<br>") + result.html;
			html = this.shieldSiPassword(html);
			this.workingArea.innerHTML = this.workingArea.innerHTML + html;
			this.pickUpEventItemToBindEventHandler(this.workingArea);
			//__setCaret(this.workingArea, -1);
		}
	},
	
	enableCmdTip: function(bEnable)
	{
		BlackScreenCtrl.CMD_TIP_ENABLED = bEnable;
		if (!BlackScreenCtrl.CMD_TIP_ENABLED)
		{
			this.hideTip();
		}
	},
	
	// 抛出事件
	fireEvent: function(eventId, eventMsg)
	{
		if (this.callback)
		{
			try
			{
				this.callback(eventId, eventMsg, this.appInstance, this);
			}
			catch(e)
			{
				
			}
		}
	},
	
	// 发送命令
	transmit: function()
	{
		var txt = __unescapeHtmlChars(__filterHtmlTags(this.workingArea.innerHTML));
		var cmd = this.pickUpCmd(txt);
		this.sendCmd(cmd);
	},
	
	// 发送功能键
	sendHotKey: function(key, e)
	{
		if (this.isScreenLocked())
		{
			return;
		}
		
		if (e.ctrlKey || e.altKey || e.shiftKey)
		{
			return;
		}
		
		//ie功能键特殊处理
		if(__BROWSER.msie)
		{
			// help快捷键
			if(e.keyCode == 112)
			{
				window.onhelp = function(){return false;};
			}
			e.keyCode =0;
		}
		
		// 显示历史区
		this.historyArea.style.display = "";
		// 从工作区迁移html至历史区
		this.migrateHtml(this.workingArea, this.historyArea);
		this.inputString(BlackScreenCtrl.SOE, true);
		// 定位光标至工作区末尾
		__setCaret(this.workingArea, -1);
		// 容器将历史区滚动至顶部
		this.container.scrollTop = this.historyArea.offsetHeight;
		// 向外部抛出消息
		try
		{
			this.callback(__BS_EVENT_HOTKEY, key, this.appInstance, this);
		}
		catch(ex)
		{	
		}
	},
	
	//用户自定义键与指令处理
	userFunkeyHandle: function(key, e)
	{
		var funData = this.userFunKey[key];
		//20131127 党会建添加
		var isNotNewRow=false;//从起一行
		if(key=="192"){
			funData={command:"#"};
			isNotNewRow=true;
		}
		//用户自定义快捷键 通过jsp页面传入，格式如下
		/* @param xml结构
		 * <Accels>
		 *		<Accel key="\'Ctrl+F1\'" function="\'c\'" remark="\'1212121\'" index="\'0\'" level="\'0\'">
		 *			<Command>&gt;da</Command>
		 *     </Accel>
		 *     ...
	     * </Accels> 
		 */
		if (!funData)
		{
			return;
		}
		//ctrl与shift+f1防止弹出ie帮助
		if(key.indexOf("F1")>0){
			window.onhelp = function(){return false;};
		}
		var cmd = funData.command;
		var bXmit = cmd.indexOf("<") == cmd.length - 1;
		var bSOE = cmd.indexOf(">") == 0;//用户自定义的使用><括起来
		cmd = cmd.replace(/>/, "");
		cmd = cmd.replace(/</, "");
		
		if (bSOE)
		{
			cmd = BlackScreenCtrl.SOE + cmd;
		}
		//SI特殊处理
		var reg = /(^|\W)si( |&nbsp;|\/)*\d{2,7}( |&nbsp;|\/)+(\w+)/gmi;
		var match = reg.exec(cmd); 
		if(match){
			this.workingArea.innerHTML = this.workingArea.innerHTML + cmd;
		}else{
			this.inputString(cmd, true);
		}
		if(bXmit){
			this.transmit();
		}else if(isNotNewRow){//20131128修改党会建
			__setCaret(this.workingArea, 1);
		}else{//20131128修改党会建
			__setCaret(this.workingArea, -1);
		}
		if(e)
		{
			e.keyCode = 0;
		}
	},
	
	// 是否需要迁移工作区内容至历史区
	shouldMigrate: function()
	{
		var ret = true;
		
		// 是否是pata指令
		ret = ret && this.cmd.search(/pat/gmi) < 0;
		ret = ret && this.cmd.search(/trfd/gmi) < 0;
		
		return ret;
	},
	
	// 迁移工作区内容至历史区
	migrateHtml: function()
	{
		if (!this.workingArea.innerHTML)
		{
			return;
		}
		
		// 自动加入换行符
		if (this.historyArea.childNodes.length != 0)
		{
			var brNode = document.createElement("br");
			this.historyArea.appendChild(brNode);
		}
		
		var html = this.workingArea.innerHTML;
		html = this.shieldSiPassword(html);
		this.historyArea.innerHTML += html;
		this.workingArea.innerHTML = "";
		
		// 自动清理历史区   2013-11-20 党会建修改 1000改为 300
		while(this.historyArea.childNodes.length - 300 > 0)
		{
			this.historyArea.removeChild(this.historyArea.childNodes[0]);
		}
	},
	
	// 发送命令
	sendCmd: function(cmd)
	{
		if (this.isScreenLocked())
		{
			return;
		}
		if (!cmd)
		{
			return;
		}
		
		this.cmd = cmd;
		
		// 显示历史区
		this.historyArea.style.display = "";
		
		// 是否需要迁移工作区内容至历史区
		if (this.shouldMigrate())
		{
			// 将内容从工作区迁移至历史区
			this.migrateHtml();
			// 容器将历史区滚动至顶部
			this.container.scrollTop = this.historyArea.offsetHeight;
			// 工作区输入命令

			this.inputString(BlackScreenCtrl.SOE, true);
			this.inputString(this.cmd, true);
		}
		else
		{
			// 暂时什么都不做
		}
		
		// 定位光标至工作区末尾
		__setCaret(this.workingArea, -1);
		
		// 加入历史命令列表
		this.addHistoryCmdList(cmd);
		// 命令处理
		var outCmd = this.formatCmd(this.cmd);
		
		// 向外部抛出消息
		this.fireEvent(__BS_EVENT_CMD, outCmd);
	},
	
	saveScrollTop: function()
	{
		this.scrollTop = this.container.scrollTop;
	},
	
	restoreScrollTop: function()
	{
		this.container.scrollTop = this.scrollTop;
	},
	
	// 格式化主机命令
	formatCmd: function(cmd)
	{
		var outCmd = "";
		var lines = cmd.split("\n");
		for (var i = 0; i < lines.length; i++)
		{
			if (outCmd.length > 0)
			{
				// 命令分隔符：双回车
				outCmd += "\r\n";//2013-11-13 改成\r\n 党会建
			}
			
			var line = lines[i];
			
			// 超长命令处理
			while(line.length > 60)
			{
				outCmd += line.substring(0, 60) + "\r\n" + "-";//2013-11-13 改成\r\n 党会建
				line = line.substring(60);
			}
			outCmd += line;
		}
		return outCmd;
	},
	
	// 屏蔽si指令的密码字段
	shieldSiPassword: function(str)
	{
		var reg = /(^|\W)si( |&nbsp;|\/)*\d{2,7}( |&nbsp;|\/)+(\w+)/gmi;
		var match = reg.exec(str);
		if (match)
		{
			var tmpStr1 = match[0];
			var tmpStr2 = match[4];
			str = str.substring(0, match.index) + tmpStr1.substring(0, tmpStr1.length - tmpStr2.length) + tmpStr2.replace(/./gmi, "*") + str.substring(reg.lastIndex);
		}
		
		//dpay指令密码的隐藏
		var regDpay = /PLEASE&nbsp;INPUT&nbsp;YOUR&nbsp;PASSWORD:[\s\S]+/gmi;
		if(str.match(regDpay)){
			var reg1 = /PASSWORD:(\S+?)<BR>/gmi;
			var reg2 = /PASSWORD:(\S+?)$/gmi;
			var match1 = reg1.exec(str);
			var match2 = reg2.exec(str);
			
			var match = match1 || match2;
					
			var matStr1 = match[0];
			var matStr2 = match[1];
			if(match1){
				str = str.substring(0,match.index) + matStr1.substring(0,matStr1.length-matStr2.length-4) + matStr2.replace(/./gmi,"*")+str.substring(match.lastIndex-4);
			}else{	
				str = str.substring(0,match.index) + matStr1.substring(0,matStr1.length-matStr2.length) + matStr2.replace(/./gmi,"*")+str.substring(match.lastIndex);
			}
			}
		return str;
	},
	
	// 添加历史命令列表
	addHistoryCmdList: function(cmd)
	{
		cmd = this.shieldSiPassword(cmd);
		for (var i = 0; i< BlackScreenCtrl.HISTORY_CMD_LIST.length; i++)
		{
			if (BlackScreenCtrl.HISTORY_CMD_LIST[i] == cmd)
			{
				BlackScreenCtrl.HISTORY_CMD_LIST.splice(i, 1);
				break;
			}
		}
		BlackScreenCtrl.HISTORY_CMD_LIST.unshift(cmd);
		
		if (BlackScreenCtrl.HISTORY_CMD_LIST.length > 10)//2013-11-13 党会建  30改成10
		{
			BlackScreenCtrl.HISTORY_CMD_LIST.splice(10);
		}
	},
	
	// 隐藏控件
	hide: function()
	{
		this.container.style.display = "none";
	},
	
	// 显示控件
	show: function()
	{
		this.container.style.display = "";
		this.setFocus();
	},
	
	// 在控件末尾设置命令开始符
	setSOE: function(element, bNewLine)
	{
		element = element ? element : this.workingArea;
    	
		__setCaret(element, -1);
        
        if (bNewLine)
        {
        	__insertHtml(element, "<br>");
        }
        __insertHtml(element, BlackScreenCtrl.SOE);
	},
	
	// 控件输入焦点
	setFocus: function()
	{
		this.workingArea.focus();
	},
	
	// 设置容器元素的显示属性
	setContainerStyle: function()
	{
		this.container.style.overflow = "auto";
		this.container.style.background = this.workingAreaBgColor;
		this.container.style.color = this.workingAreaFontColor;
		this.container.style.fontSize = this.fontSize + "px";
		this.container.style.fontFamily = this.fontFamily;
		this.container.style.position = "relative";
	},
	
	// 设置历史区的显示属性
	setHistoryAreaStyle: function()
	{
		this.historyArea.style.paddingLeft = "5px";
		this.historyArea.style.background = this.historyAreaBgColor;
		this.historyArea.style.color = this.historyAreaFontColor;
		this.historyArea.style.outline = "none";
		this.historyArea.style.whiteSpace = "nowrap";
		this.historyArea.style.lineHeight = "100%";
		this.historyArea.style.fontFamily = this.fontFamily;
		this.historyArea.style.display = "none";
		this.historyArea.style.position = "relative";
		this.historyArea.style.fontSize = this.fontSize + "px";
		//this.historyArea.style.whiteSpace = "pre";
		this.historyArea.contentEditable = true;
		this.historyArea.tabIndex = 0;
	},
	
	// 设置工作区的显示属性
	setWorkingAreaStyle: function()
	{
		this.workingArea.style.paddingLeft = "5px";
		this.workingArea.style.background = this.workingAreaBgColor;
		this.workingArea.style.color = this.workingAreaFontColor;
		this.workingArea.style.outline = "none";
		this.workingArea.style.whiteSpace = "nowrap";
		this.workingArea.style.lineHeight = "100%";
		this.workingArea.style.fontFamily = this.fontFamily;
		this.workingArea.style.tabIndex = 0;
		this.workingArea.style.position = "relative";
		this.workingArea.style.fontSize = this.fontSize + "px";
		//this.workingArea.style.whiteSpace = "pre";
		this.workingArea.contentEditable = true;
	},
	
	// 设置容器鼠标键盘事件
	setContainerEventHandler: function()
	{
		// 注意this指向对象的变化
		var self = this;
		
		// 容器获得输入焦点，则将输入焦点定位到工作区
		__bindEvent(this.container, "click", function(e){__setCaret(self.workingArea, -1);});
		__bindEvent(this.container, "focus", function(e){self.setFocus();});
	},
	
	// 设置历史区鼠标键盘事件
	setHistoryAreaEventHandler: function()
	{
		// 注意this指向对象的变化
		var self = this;
		__bindEvent(this.historyArea, "click", function(e){self.hideTip(); __preventEventBubble(e);});
		__bindEvent(this.historyArea, "dblclick", function(e){return self.onHistoryAreaDblClick(e);});
		__bindEvent(this.historyArea, "focus", function(e){self.fireEvent(__BS_EVENT_FOCUS, "true");});
		__bindEvent(this.historyArea, "blur", function(e){self.fireEvent(__BS_EVENT_FOCUS, "false_history");});
		__bindEvent(this.historyArea, "dragenter", function(e){__preventEventDefault();});
		__bindEvent(this.historyArea, "drop", function(e){__preventEventDefault();});
		
		if (__BROWSER.msie)
		{
			var bMouseDown = false;
			var bCanSelect = false;
			__bindEvent(this.historyArea, "beforepaste", function(e){return self.onBeforePaste(self.historyArea, e);});
			__bindEvent(this.historyArea, "paste", function(e){return self.onPaste(self.historyArea, e);});
			__bindEvent(this.historyArea, "keydown", function(e){bCanSelect = true; return self.onHistoryAreaKeyDown(e);});
			// 禁止鼠标双击选中文字 
			__bindEvent(this.historyArea, "selectstart", function(e){if (!bCanSelect){__preventEventDefault();}});
			__bindEvent(this.historyArea, "mousedown", function(e){bMouseDown = true;});
			__bindEvent(this.historyArea, "mousemove", function(e){if (bMouseDown){bCanSelect = true;}});
			__bindEvent(this.historyArea, "mouseup", function(e){bMouseDown = false; bCanSelect = false;});
		}
		else
		{
			__bindEvent(this.historyArea, "paste", function(e){return self.onPaste(self.historyArea, e);});
			__bindEvent(this.historyArea, "keydown", function(e){return self.onHistoryAreaKeyDown(e);});
			// 记录光标，双击事件处理句柄中恢复，用以禁止双击选中文字功能
			__bindEvent(this.historyArea, "mousedown", function(e){self.range = __saveCaret();});
		}
	},
	
	// 设置工作区鼠标键盘事件
	setWorkingAreaEventHandler: function()
	{
		// 注意this指向对象的变化
		var self = this;
		__bindEvent(this.workingArea, "click", function(e){self.hideTip(); __preventEventBubble(e);});
		__bindEvent(this.workingArea, "dblclick", function(e){return self.onWorkingAreaDblClick(e);});
		__bindEvent(this.workingArea, "focus", function(e){self.fireEvent(__BS_EVENT_FOCUS, "true");});
		__bindEvent(this.workingArea, "blur", function(e){self.fireEvent(__BS_EVENT_FOCUS, "false_working");});
		__bindEvent(this.workingArea, "dragenter", function(e){__preventEventDefault();});
		__bindEvent(this.workingArea, "drop", function(e){__preventEventDefault();});
		
		if (__BROWSER.msie)
		{
			var bMouseDown = false;
			var bCanSelect = false;
			__bindEvent(this.workingArea, "beforepaste", function(e){return self.onBeforePaste(self.workingArea, e);});
			__bindEvent(this.workingArea, "paste", function(e){return self.onPaste(self.workingArea, e);});
			//20131126 keydown->keyup
			__bindEvent(this.workingArea, "keydown", function(e){bCanSelect = true; return self.onWorkingAreaKeyDown(e);});
			// 禁止鼠标双击选中文字 
			__bindEvent(this.workingArea, "selectstart", function(e){if (!bCanSelect){__preventEventDefault();}});
			__bindEvent(this.workingArea, "mousedown", function(e){bMouseDown = true;});
			__bindEvent(this.workingArea, "mousemove", function(e){if (bMouseDown){bCanSelect = true;}});
			__bindEvent(this.workingArea, "mouseup", function(e){bMouseDown = false; bCanSelect = false;});
		}
		else
		{
			__bindEvent(this.workingArea, "paste", function(e){return self.onPaste(self.workingArea, e);});
			__bindEvent(this.workingArea, "keydown", function(e){return self.onWorkingAreaKeyDown(e);});
			// 记录光标，双击事件处理句柄中恢复，用以禁止双击选中文字功能
			__bindEvent(this.workingArea, "mousedown", function(e){self.range = __saveCaret();});
		}
	},
	
	// 设置基本配置(背景字体颜色)
	setCustomConfig: function(xml)
	{
		var xmlDoc = __createXmlDoc(xml);
	
		this.workingAreaBgColor = __getXmlNodeText(xmlDoc, "BackGround")||this.workingAreaBgColor;
		this.workingArea.style.background = this.workingAreaBgColor;
	
		this.workingAreaFontColor = __getXmlNodeText(xmlDoc, "Text")||this.workingAreaFontColor;
		this.workingArea.style.color = this.workingAreaFontColor;
		
		this.historyAreaBgColor =  __getXmlNodeText(xmlDoc, "HistoryBackGround")||this.historyAreaBgColor;
		this.historyArea.style.background = this.historyAreaBgColor;
		
		this.historyAreaFontColor = __getXmlNodeText(xmlDoc, "HistoryText")||this.historyAreaFontColor;
		this.historyArea.style.color = this.historyAreaFontColor;
		
		var fontSize = __getXmlNodeText(xmlDoc, "FontSize");
		this.fontSize = fontSize ? parseInt(fontSize, 10) : this.fontSize;
		this.container.style.fontSize = this.fontSize + "px";
		this.historyArea.style.fontSize = this.fontSize + "px";
		this.workingArea.style.fontSize = this.fontSize + "px";
		
		this.fontFamily =  __getXmlNodeText(xmlDoc, "Font")||this.fontFamily;
		this.historyArea.style.fontFamily = this.fontFamily;
		this.workingArea.style.fontFamily = this.fontFamily;
		
	},
	
	onBeforePaste: function(target, e)
	{
		// ie浏览器下，如果选中了文字，则不执行粘贴前处理；保证鼠标右键的正确行为。
		if (__BROWSER.msie)
		{
			var range = document.selection.createRange();
			if (range.text.length >0)
			{
				return true;
			}
		}
		
		var self = this;
		// 记住容器滚动条位置
		target.style.position = "static";
		this.saveScrollTop();
		// 光标占位
		var caretHolder = __addCaretHolder(target);
		var tmpDiv = document.createElement("div");
		tmpDiv.contentEditable = true;
		tmpDiv.style.position = "absolute";
		tmpDiv.style.top = caretHolder.offsetTop + "px";
		tmpDiv.style.left = caretHolder.offsetLeft + "px";
		tmpDiv.style.width = "1px";
		tmpDiv.style.height = "1px";
		tmpDiv.style.overflow = "hidden";
		this.container.appendChild(tmpDiv);
		tmpDiv.focus();
		// 执行粘贴操作
		__setTimeoutEx(0, function(){
			var txt = tmpDiv.innerHTML;
			txt = __filterHtmlTags(txt);
			txt = txt.replace(/\u25B6/gm, "<br>"+BlackScreenCtrl.SOE);
			txt = txt.replace(/\x10/gm,"<br>"+BlackScreenCtrl.SOE);//js下替换十六进制自己x10,没有0
			//20140321针对im特殊处理,直接找到im做换行处理
			if(/^[&nbsp;\s]{0,}(IM[&nbsp;\s]{0,}[:A-Z]{1,})/gmi.test(txt)){
				//txt = txt.replace(/[&nbsp;\s]{10,}/gmi,"<br>");
				//20140411在im拷贝过来时，如果后面有换行会找不到,去除的最后的
				txt = txt.replace(/[\r\n]{1,}$/, "");
				if(!(/[\r\n]/gmi.test(txt))){//
					txt = txt.replace(/(IM[&nbsp;\s]{0,}[:A-Z]{1,})/gmi,"<br>$1");
				}
			}
			txt = txt.replace(/^[&nbsp;\s]{0,}<br>{1,}/,"");//去掉第一个<br>
			//针对\r\n坐换行处理
			txt = txt.replace(/\r\n/gmi, "<br>");//2014-02-7 党会建修改,如果先替换\r\n，在上面[\r\n]已经找不到了
			txt = txt.replace(/\n/gmi, "<br>");
			//20131220党会建修改，把。，替换成英文的
			txt = txt.replace(/，/gmi, ",");
			txt = txt.replace(/。/gmi, ".");
			txt = txt.replace(/；/gmi, ";");
			txt = txt.replace(/！/gmi, "!");
			caretHolder.innerHTML = txt;
			__setCaret(caretHolder, -1);
			__removeCaretHolder();
			if (tmpDiv.parentNode)
			{
				tmpDiv.parentNode.removeChild(tmpDiv);
			}
			
			// 粘贴时容器的滚动条会自动滚动，此处需要复原
			target.style.position = "relative";
			self.restoreScrollTop();	
		});
		
		return true;
	},
	
	onPaste: function(target, e)
	{
		if (__BROWSER.msie)
		{
		}
		else
		{
			this.onBeforePaste(target, e);
		}
		
		return false;
	},
	
	onHistoryAreaKeyDown: function(e)
	{
		e = e ? e : window.event;
		var ch = e.keyCode ? e.keyCode : e.which;
		
		// ctrl + F11: 解屏
		if (e.ctrlKey && e.keyCode == 122)
		{
			this.fireEvent(__BS_EVENT_RELEASESCREEN);
			// 不执行默认处理句柄
			__preventEventDefault(e);
			__preventEventBubble(e);
			e.keyCode = 0;
			return false;
		}
		
		if (this.isScreenLocked())
		{
			return false;
		}
		
		if (!__isPrintableChar(ch))
		{
			this.hideTip();
		}
		
		switch (ch)
		{
		case 8:		// backspace
			return true;
		case 27:	// esc
			__insertHtml(this.historyArea, BlackScreenCtrl.SOE);
			break;
		case 13:	// enter
			if(e.ctrlKey || e.shiftKey){
				var cmd = this.pickUpCmd(this.getCaretBeforeText(this.historyArea));
				this.sendCmd(cmd);
			}else{
				__insertHtml(this.historyArea, "<br>");
			}
			break;
		case 37:	// left arrow
			return true;
		case 38:	// up arrow
		    if (e.ctrlKey)
			{
				this.historyCmdWidget.show(this.historyArea, this, {fontSize: this.fontSize * 3 / 4});
				break;
			}
			return true;
		case 39:	// right arrow
			return true;
		case 40:	// down arrow
			if (e.ctrlKey)
			{
				this.historyCmdWidget.show(this.historyArea, this, {fontSize: this.fontSize * 3 / 4});
				break;
			}
			else
			{
				// 判断下方向键是否需要穿越到工作区
				if (this.isCaretTravelToWorkingArea())
				{
					this.workingArea.focus();
					__setCaret(this.workingArea, 0);
					break;
				}
			}
			return true;
		case 46:	//delete
			return true;
		case 83:	//s&&S
			if (e.ctrlKey)	//不同屏切换
			{
				this.fireEvent(__BS_EVENT_EXCHANGESCREEN);
				e.keyCode = 0;
				break;
			}
			return true;
		case 81:	//q&&Q
			if (e.ctrlKey)	//清除当前屏
			{
				this.historyArea.innerHTML = BlackScreenCtrl.SOE;
				this.workingArea.innerHTML = BlackScreenCtrl.SOE;
				__setCaret(this.workingArea, -1);
				e.keyCode = 0;
				break;
			}else if(e.altKey)	//清除当前屏
			{
				this.workingArea.innerHTML = BlackScreenCtrl.SOE;
				__setCaret(this.workingArea, -1);
				e.keyCode = 0;
				break;
			}
			return true;
		case 112:	// F1
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF1", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF1", e);
			}
			else
			{
				this.sendHotKey("F1",e);
			}
			break;
		case 113:	// F2
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF2", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF2", e);
			}
			else
			{
				this.sendHotKey("F2",e);
			}
			break;
		case 114:	// F3
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF3", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF3", e);
			}
			else
			{
				this.sendHotKey("F3",e);
			}
			break;
		case 115:	// F4
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF4", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF4", e);
			}
			else
			{
				this.sendHotKey("F4",e);
			}
			break;
		case 116:	// F5
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF5", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF5", e);
			}
			else
			{
				this.sendHotKey("F5",e);
			}
			break;
		case 117:	// F6
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF6", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF6", e);
			}
			else
			{
				this.sendHotKey("F6",e);
			}
			break;;
		case 118:	// F7
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF7", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF7", e);
			}
			else
			{
				this.sendHotKey("F7",e);
			}
			break;
		case 119:	// F8
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF8", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF8", e);
			}
			else
			{
				this.sendHotKey("F8",e);
			}
			break;
		case 120:	// F9
			this.sendHotKey("F9",e);
			break;
		case 121:	// F10
			this.sendHotKey("F10",e);
			break;
		case 122:	// F11
			__preventEventBubble(e);
			return true;
		case 123:	// F12
			var cmd = this.pickUpCmd(this.getCaretBeforeText(this.historyArea));
			this.sendCmd(cmd);
			break;
		default:
			if (__isPrintableChar(ch))
			{
				this.showCmdTip(this.historyArea);
			}
			return true;
		}

		// 不执行默认处理句柄
		__preventEventDefault(e);
		__preventEventBubble(e);
		return false;
	},
	
	onHistoryAreaDblClick: function(e)
	{
        this.hideTip();
        
		// 恢复光标，禁止双击选中文字
		if (!__BROWSER.msie)
		{
			__restoreCaret(this.range);
		}
		// 拾取命令
		var cmd = this.pickUpCmd(this.getCaretBeforeText(this.historyArea));
		this.sendCmd(cmd);
		return false;
	},
	
	onWorkingAreaKeyDown: function(e)
	{
		e = e ? e : window.event;
		var ch = e.keyCode ? e.keyCode : e.which;
		// ctrl + F11: 解屏
		if (e.ctrlKey && e.keyCode == 122)
		{
			this.fireEvent(__BS_EVENT_RELEASESCREEN);
			// 不执行默认处理句柄
			__preventEventDefault(e);
			__preventEventBubble(e);
			e.keyCode = 0;
			return false;
		}
		
		if (this.isScreenLocked())
		{
			return false;
		}
		
		if (!__isPrintableChar(ch))
		{
			this.hideTip();
		}
		
		switch (ch)
		{
		case 8:		// backspace
			//ff稍微等下 党会建 2013-11-13  没有改			
			return true; //原来的
		case 27:	// esc
			__insertHtml(this.workingArea, BlackScreenCtrl.SOE);
			break;
		case 13:	// enter
			if(e.ctrlKey || e.shiftKey){
				var cmd = this.pickUpCmd(this.getCaretBeforeText(this.workingArea));
				this.sendCmd(cmd);
			}else{
				var afterText = this.getCaretAfterText(this.workingArea);
				//解决chrom下(360急速模式)最后一个字符要按两次enter光标才移动问题
				if(__BROWSER.chrome && afterText==""){
					__insertHtml(this.workingArea, "<br>");
				}
				__insertHtml(this.workingArea, "<br>");
			}
			break;
		case 37:	// left arrow
			return true;
		case 38:	// up arrow
			if (e.ctrlKey)
			{
				this.historyCmdWidget.show(this.workingArea, this, {fontSize: this.fontSize * 3 / 4});
				break;
			}
			else
			{
				// 判断上方向键是否需要穿越到历史区
				if (this.isCaretTravelToHistoryArea())
				{
					this.historyArea.focus();
					__setCaret(this.historyArea, -1);
					break;
				}
			}
			return true;
		case 39:	// right arrow
			return true;
		case 40:	// down arrow
			if (e.ctrlKey)
			{
				this.historyCmdWidget.show(this.workingArea, this, {fontSize: this.fontSize * 3 / 4});
				break;
			}
			return true;
		case 46:	//delete
			return true;
		//党会建 20131126 增加ctrl a 执行cp指令
		case 65: //a
			if (e.ctrlKey)
			{
				//this.sendCmd("cp");
				//20140208,直接放到历史区域了。
				if (this.shouldMigrate())
				{
					// 将内容从工作区迁移至历史区
					this.migrateHtml();
					// 容器将历史区滚动至顶部
					this.container.scrollTop = this.historyArea.offsetHeight;
				}
				break;
			}	
		case 81:	//q&&Q
			if (e.ctrlKey)	//清除当前屏
			{
				this.historyArea.innerHTML = BlackScreenCtrl.SOE;
				this.workingArea.innerHTML = BlackScreenCtrl.SOE;
				__setCaret(this.workingArea, -1);
				e.keyCode = 0;
				break;
			}else if(e.altKey)	//清除当前屏工作区
			{
				this.workingArea.innerHTML = BlackScreenCtrl.SOE;
				__setCaret(this.workingArea, -1);
				e.keyCode = 0;
				break;
			}
			return true;
		case 83:	//s&&S
			if (e.ctrlKey)	//不同屏切换
			{
				this.fireEvent(__BS_EVENT_EXCHANGESCREEN);
				e.keyCode = 0;
				break;
			}
			return true;
		case 112:	// F1
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF1", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF1", e);
			}
			else
			{
				this.sendHotKey("F1",e);
			}
			break;
		case 113:	// F2
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF2", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF2", e);
			}
			else
			{
				this.sendHotKey("F2",e);
			}
			break;
		case 114:	// F3
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF3", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF3", e);
			}
			else
			{
				this.sendHotKey("F3",e);
			}
			break;
		case 115:	// F4
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF4", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF4", e);
			}
			else
			{
				this.sendHotKey("F4",e);
			}
			break;
		case 116:	// F5
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF5", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF5", e);
			}
			else
			{
				this.sendHotKey("F5",e);
			}
			break;
		case 117:	// F6
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF6", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF6", e);
			}
			else
			{
				this.sendHotKey("F6",e);
			}
			break;;
		case 118:	// F7
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF7", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF7", e);
			}
			else
			{
				this.sendHotKey("F7",e);
			}
			break;
		case 119:	// F8
			if(e.ctrlKey)
			{
				this.userFunkeyHandle("CtrlF8", e);
			}
			else if(e.shiftKey)
			{
				this.userFunkeyHandle("ShiftF8", e);
			}
			else
			{
				this.sendHotKey("F8",e);
			}
			break;
		case 120:	// F9
			this.sendHotKey("F9",e);
			break;
		case 121:	// F10
			this.sendHotKey("F10",e);
			break;
		case 122:	// F11
			__preventEventBubble(e);
			return true;
		case 123:	// F12
			var cmd = this.pickUpCmd(this.getCaretBeforeText(this.workingArea));
			this.sendCmd(cmd);
			break;
		case 192:	// ` 20131127党会建添加，变成#，关舱时使用
			this.userFunkeyHandle("192", e);
			break;
		default:
			if (__isPrintableChar(ch))
			{
				this.showCmdTip(this.workingArea);
			}
			return true;
		}
			
		// 不执行默认处理句柄
		__preventEventDefault(e);
		__preventEventBubble(e);
		return false;
	},
	
	
	onWorkingAreaDblClick: function(e)
	{
        this.hideTip();
        
		// 恢复光标，禁止双击选中文字
		if (!__BROWSER.msie)
		{
			__restoreCaret(this.range);
		}
		// 拾取命令
		var cmd = this.pickUpCmd(this.getCaretBeforeText(this.workingArea));
		this.sendCmd(cmd);
		return false;
	},
	
	showCmdTip: function(target)
	{
		if (!BlackScreenCtrl.CMD_TIP_ENABLED)
		{
			return;
		}
		
		if (this.tipWidget.isShowing())
		{
			return;
		}
		
		var cmdStr = this.pickUpCmd(this.getCaretBeforeText(target));
		var cmdList = cmdStr.split("\n");
		var cmdObj = __parseCmd(cmdList[cmdList.length - 1]);
		var cmdKey1 = cmdObj.cmd.toLowerCase();
		var cmdKey2 = cmdKey1 + " " + (cmdObj.params.length > 0 ? cmdObj.params[0].toLowerCase() : "");
		
		var tip = __I18N_CMD_TIP[cmdKey1] || __I18N_CMD_TIP[cmdKey2];
		if (tip)
		{
			var caretHolder = __addCaretHolder(target, "&nbsp;");
			var tipMsg = tip[__LANG];
			var tipX = caretHolder.offsetLeft;
			var tipY = caretHolder.offsetTop + caretHolder.offsetHeight;
			var tipOptions = {fontSize: this.fontSize * 3 / 4};
			__removeCaretHolder(true);
			this.tipWidget.show(target, tipMsg, tipX, tipY, tipOptions);
		}
	},
	
	hideTip: function()
	{
		this.tipWidget.hide();
	},
	// 从文本中提取命令
	pickUpCmd: function(txt)
	{
		var cmd = "";
		var cmdStartPos = txt.lastIndexOf(BlackScreenCtrl.SOE);
		//20140208 党会建修改，如果是开头没有soe，则指令也应该能执行
		if (cmdStartPos >= 0){
			cmd = txt.substring(cmdStartPos + BlackScreenCtrl.SOE.length);
		}else {cmd=txt;}
		var lines = cmd.split(/\r*\n/);
		cmd = "";
		for (var i = 0; i < lines.length; i++)
		{
			var line = __trim(lines[i]);
			if (line)
			{
				if (cmd == "")
				{
					cmd = line;
				}
				else
				{
					cmd += "\n" + line;
				}
			}
		}
		return cmd;
	},
	
	// 转换原始文本，输入和输出都在这里
	translate: function(str)
	{
		// 特殊字符替换
		str = str.replace(/&#x10;/gmi, BlackScreenCtrl.SOE);
		str = str.replace(/&#x1C;/gmi, "\u25E4");
		str = str.replace(/&#x1D;/gmi, "\u25E5");
		str = str.replace(/&#x26;/gmi, "&amp;");
		str = str.replace(/&#x3c;/gmi, "&lt;");
		str = str.replace(/&#x3e;/gmi, "&gt;");
		// 预处理，统一格式
		//2013-11-12 党会建修改开始。rt返回的一些格式再调用 util里面的__createXmlDoc时会出错，认为xml不对 ，对str编码
		var strStarts = "<TDE";
		if (str.length < strStarts.length || str.substring(0, strStarts.length) != strStarts)
		{
			str = __escapeHtmlChars(str);
			str = escape(str);//2013-11-12 党会建增加
			str = "<TDE><RawData>" + str + "</RawData></TDE>";
		}
		
		var result = {mode: "command", html: ""};
		var xmlDoc = __createXmlDoc(str);
		
		// 数据处理
		var html = "";
		var nodes = xmlDoc.documentElement.childNodes;
		for(var i = 0; i < nodes.length; i++)
		{
			var node = nodes[i];
			// 格式化数据
			if (node.nodeName.toLowerCase() == "xmldata")
			{
				// 全屏数据
				if (node.getAttribute("FullScreen") == "1")
				{
					result.mode = "fullScreen";
					html += this.translateFullScreenDataToHtml(node);
				}
				// 增强数据
				else
				{
					html += this.translateEnhanceDataToHtml(node);
				}
			}
			// 纯文本数据
			else
			{
				html += this.translateRawDataToHtml(node);
			}
		}
		//20150521党会建修改，在chrome40以上，替换空格发现不对齐
		// 特殊字符替换
		html = html.replace(/\r\n/gm, "<br>");
		html = html.replace(/\n/gm, "<br>");
		html = html.replace(/\u25B6/gm, BlackScreenCtrl.SOE);//2013-11-13 党会建修改，增加soe符合
		html = html.replace(/\?$/gm,BlackScreenCtrl.SOE);//20140411,发现传过来的数据，里面有x3F ?这个东西，需要替换
		//里面含sp的也会清掉，如spca,白金卡标红，2013-11-29 党会建修改   
		var trianglePattern=/\u25E4([&nbsp;\s]{0,}[\w\.\(\)&nbsp;\s]{0,}[&nbsp;\s]{0,})\u25E5/gim;
		html = html.replace(trianglePattern, __format("<span style='color:red;font-size:13px;position:relative;left:1px;top:-3px;'>\u25E4</span><span style='color:red;'>$1</span><span style='color:red;font-size:13px;position:relative;left:-2px;top:-3px;'>\u25E5</span>"));//显示blink code
		//html = html.replace(/\u25E5/gm, __format("<span style='color:red;font-size:13px;position:relative;left:-1px;top:-3px;'>\u25E5</span>"));//显示blink code
		result.html = html;
		return result;
	},
	
	// 将普通文本转换成html文本
	translateRawDataToHtml: function(xmlNode)
	{
		var txt = __innerText(xmlNode);
		txt = __unescapeHtmlChars(txt);
		txt = __escapeHtmlChars(txt);
		txt = __trimRight(txt);
		txt=unescape(txt);//2013-11-12 党会建增加
		//20150521 chrome40浏览器，错行。需要判断下
		var browser = __getBrowserType();
		var spaceWidth = 9;
		if (browser && browser.chrome && browser.version >= 40) {
			if(this.fontSize){
				spaceWidth =( this.fontSize/2).toFixed(1);
			}
			//需要获取到字号
			txt = txt.replace(/ /gm, "<span style='display:inline-block;width:"+spaceWidth+"px;height:2px;'></span>");//实际chrome那里就是加空格问题引起的
		}else {
			txt = txt.replace(/ /gm, "&nbsp;");//实际chrome那里就是加空格问题引起的
		}
		return txt;
	},
	
	// 将增强文本转换成html文本
	translateEnhanceDataToHtml: function(xmlNode)
	{
		var preTxt = "";
		var preRow = 1;
		var preCol = 1;
		
		//对xml格式进行解析
		var objects = xmlNode.childNodes;
		for (var i = 0; i < objects.length; i++)
		{
			var object = objects[i];
			
			if (object.nodeName.toLowerCase() != "object")
			{
				continue;
			}
			
			var curRow = parseInt(object.getAttribute("Row"), 10);
			var curCol = parseInt(object.getAttribute("Col"), 10);
			var color = object.getAttribute("Color");
			
			var textItem = object.getElementsByTagName("Text");
			var curTxt = __innerText(textItem[0]);
			var curLen = curTxt.length;
			curTxt = curTxt.replace(/ /gm, "&nbsp;");
			
			var attrs = '';
			var eventsItem = object.getElementsByTagName("ItsEvents");
			if (eventsItem.length > 0)
			{
				for (var k = 0; k < eventsItem[0].childNodes.length; k++)
				{
					var eventItem = eventsItem[0].childNodes[k];
					var param = __innerText(eventItem);
					attrs += __format(' __tw3_{0}="{1}"', eventItem.nodeName, param);
				}
			}
			if (color)
			{
				attrs += __format(' style="color:#{0}"', color.replace(/0x/gmi, ""));
			}
			
			if (attrs.length > 0)
			{
				curTxt = __format('<span name="__tw3_EventItem" {0}>{1}</span>', attrs, curTxt); 
			}
			
			// 是否换行
			if (curRow > preRow)
			{
				preCol = 1;
				preTxt += '<br>';
			}
			
			// 补齐空格
			for (var s = preCol; s < curCol; s++)
			{
				preTxt += '&nbsp;';
			}
			
			preRow = curRow;
			preCol = curCol + curLen;
			preTxt += curTxt;
		}
		
		return preTxt;
	},
	
	// 将全屏数据转换成html文本
	translateFullScreenDataToHtml: function(xmlNode)
	{
		var preTxt = "";
		var preRow = 1;
		var preCol = 1;
		
		//对xml格式进行解析
		var objects = xmlNode.childNodes;
		for (var i = 0; i < objects.length; i++)
		{
			var object = objects[i];
			
			if (object.nodeName.toLowerCase() != "object")
			{
				continue;
			}
			
			var curRow = parseInt(object.getAttribute("Row"), 10);
			var curCol = parseInt(object.getAttribute("Col"), 10);
			var editNo = object.getAttribute("EditNo");
			var tab = object.getAttribute("Tab");
			var password = object.getAttribute("Password");
			
			var textItem = object.getElementsByTagName("Text");
			var curTxt = textItem.length > 0 ? __innerText(textItem[0]) : "";
			var curLen = curTxt.length;
			
			// 制表符特殊处理
			if (tab)
			{
				curTxt = "*";
				curLen = 1;
			}
			
			// 复制所有属性
			var attrs = ' name="__tw3_FieldItem"';
			var attrsList = object.attributes;
			for(var k = 0; k < attrsList.length; k++)
			{
				attrs += __format(' {0}="{1}"', attrsList[k].name, attrsList[k].value);
			}
			
			// 可编辑字段
			if (editNo)
			{
				attrs += __format(' maxlength="{0}"', curLen);
				var inputType = password == "1" ? "password" : "text";
				curTxt = __format('<span><input type="{0}" {1} value="{2}"></span>', inputType, attrs, curTxt);
			}
			else
			{
				curTxt = curTxt.replace(/ /gm, "&nbsp;");
				curTxt = __format('<span {0}>{1}</span>', attrs, curTxt);
			}
			
			// 是否换行
			if (curRow > preRow)
			{
				preCol = 1;
				preTxt += '<br>';
			}
			
			// 补齐空格
			for (var s = preCol; s < curCol; s++)
			{
				preTxt += '&nbsp;';
			}
			
			preRow = curRow;
			preCol = curCol + curLen;
			preTxt += curTxt;
		}
		
		return preTxt;
	},
	
	// 对指定元素的特殊子元素添加事件处理
	pickUpEventItemToBindEventHandler: function(element)
	{
		var self = this;
		var nodes = element.getElementsByTagName("span");
		for (var i = 0; i < nodes.length; i++)
		{
			var node = nodes[i];
			var attr = node.attributes["name"];
			if (!attr || attr.nodeValue != "__tw3_EventItem")
			{
				continue;
			}
			
			var bMouseMove = false;
			
			if (node.attributes["__tw3_MouseOver"])
			{
				// 鼠标移动事件
				__bindEvent(node, "mousemove", function(e){self.onEventItemMouseMove(e);});
				// 鼠标移出事件
				__bindEvent(node, "mouseout", function(e){self.onEventItemMouseOut(e);});
				bMouseMove = true;
			}
			
			if (node.attributes["__tw3_Click"])
			{
				// 鼠标点击事件
				__bindEvent(node, "click", function(e){self.onEventItemClick(e);});
				// 如果已经绑定过鼠标移动事件，则不能再次绑定
				if (!bMouseMove)
				{
					// 鼠标移动事件
					__bindEvent(node, "mousemove", function(e){self.onEventItemMouseMove(e);});
					// 鼠标移出事件
					__bindEvent(node, "mouseout", function(e){self.onEventItemMouseOut(e);});
					bMouseMove = true;
				}
			}
		}
	},
	
	onEventItemMouseMove: function(e)
	{
		var element = e.srcElement || e.target;
		var attr;
		
		attr = element.attributes["__tw3_Click"];
		if (attr)
		{
			// 为了能更改光标，先禁用编辑功能
			this.workingArea.contentEditable = false;
			this.historyArea.contentEditable = false;
			element.style.cursor = "pointer";
		}
		
		attr = element.attributes["__tw3_MouseOver"];
		if (attr)
		{
			var params = attr.nodeValue.split(",");
			var tipMsg = params[params.length - 1];
			var tipX = element.offsetLeft + element.offsetWidth;
			var tipY = element.offsetTop + element.offsetHeight;
			var tipOptions = {fontSize: this.fontSize * 3 / 4};
			this.tipWidget.show(element, tipMsg, tipX, tipY, tipOptions);
		}
	},
	
	onEventItemMouseOut: function(e)
	{
		var element = e.srcElement || e.target;
		var attr;
		
		attr = element.attributes["__tw3_Click"];
		if (attr)
		{
			// 恢复编辑功能
			this.workingArea.contentEditable = true;
			this.historyArea.contentEditable = true;
			element.style.cursor = "auto";
		}
		attr = element.attributes["__tw3_MouseOver"];
		if (attr)
		{
			this.hideTip();
		}
	},
	
	onEventItemClick: function(e)
	{
		var element = e.srcElement || e.target;
		
		// 点击后，需要隐藏提示并恢复可编辑功能
		this.hideTip();
		this.workingArea.contentEditable = true;
		this.historyArea.contentEditable = true;
		element.style.cursor = "auto";
		
		var attr = element.attributes["__tw3_Click"];
		if (attr)
		{
			this.fireEvent(__BS_EVENT_CLICK, attr.nodeValue);
		}
	},
	
	// 获取元素光标之前的文本
	getCaretBeforeText: function(element)
	{	
		var content = "";
		var index = 0;
		try
		{
			if (__BROWSER.msie)	// ie
			{
				content = __innerText(element);
				var selRange = document.selection.createRange();
	            var txtRange = document.body.createTextRange();   
	            txtRange.moveToElementText(element); 
	            for (index = 0; txtRange.compareEndPoints("StartToStart", selRange) < 0; index++)
	            {
	            	txtRange.moveStart('character', 1);
	            }
			}
			else	// ff
			{   //20140504 history区域不对，原始找index使用html的元素来找，因为content把html的标签剔除了，所以最后又找一遍\n。发现经常最后的index值会大。
				 //parent里面找的也都是实际的字符，里面字符的长度累加的。拷贝过来的元素被span包裹，span里面多几个<br>，就会多计数。最后发现是innerText计数时，如果包裹了<br>会增加
				content = __unescapeHtmlChars(__filterHtmlTags(element.innerHTML));//将<br>换成了\n,把html标签删除了
				var sel = document.getSelection();
				var selNode = sel.anchorNode;
				var selPos = sel.anchorOffset;
				var parent = element;
				// 宽度优先遍历，寻找光标所在结点在dom中的位置，从而提取光标前的所有文本
				while(parent)
				{
					if (parent == selNode)//这个是循环终止的条件
					{
						if (parent.nodeType == 3)
						{
							index += selPos;
						}
						else
						{
							for(var i = 0; i < selPos; i++)
							{
								index += __innerText(parent.childNodes[i]).length;
							}
						}
						
						break;
					}
					else
					{
						var child = null;
						for(var i = 0; i < parent.childNodes.length; i++)//换行等都算childNodes,因为有<br>
						{
							child = parent.childNodes[i];
							// 如果子结点包含光标，则进入下一轮迭代；否则，计算其文本长度
							if (__isParentNode(child, selNode))
							{
								break;
							}
							else
							{
								var innerText= __innerText(child);
								innerText=innerText.replace(/\n/gmi, "");//20140505 党会建修改 一个node里面含<br>,如果用innerText会转成\n
								index +=innerText.length;//br时+0
							}
						}
						parent = child;
					}
				}
			}
			
			// 计算换行数,如果有需要加上，这个是隐藏字符。需要把换行加上
			for(var i = 0; i < index; i++)
			{
				if (content.charAt(i) == '\n')
				{
					index++;
				}
			}
		}
		catch(e)
		{
			return "";
		}
		
		content = content.substring(0, index);
		content = content.replace(/\r/gmi, '');
		
		return content;
	},
	
	// 获取元素光标之后的文本
	getCaretAfterText: function(element)
	{
		var allText = __BROWSER.msie ? __innerText(element) : __unescapeHtmlChars(__filterHtmlTags(element.innerHTML));
		allText = allText.replace(/\r/gmi, '');
		var beforeText = this.getCaretBeforeText(element);
		var afterText = allText.substring(beforeText.length);
		return afterText;
	},
	
	isCaretTravelToHistoryArea: function()
	{
		var bGo = false;
		var txt = this.getCaretBeforeText(this.workingArea);
		if (!txt)
		{
			bGo = true;
		}
		else
		{
			var mat = txt.match(/\n/gm);
			// 无回车，肯定是第一行
			if (!mat)
			{
				bGo = true;
			}
			/*// 有一个回车，但是在末尾，则也是第一行
			else if (mat.length == 1 && txt.charAt(txt.length - 1) == "\n")
			{
				bGo = true;
			}
			// 有一个回车，但是在开始，则也是第一行
			else if (mat.length == 1 && txt.charAt(0) == "\n")
			{
				bGo = true;
			}*/
		}
		
		return bGo;
	},
	
	isCaretTravelToWorkingArea: function()
	{
		var bGo = false;
		var txt = this.getCaretAfterText(this.historyArea);
		if (!txt)
		{
			bGo = true;
		}
		else
		{
			var mat = txt.match(/\n/gm);
			// 无回车，肯定是最后一行
			if (!mat)	
			{
				bGo = true;
			}
			// 有一个回车，但是在末尾，则也是最后一行
			else if (mat.length == 1 && txt.charAt(txt.length - 1) == "\n")
			{
				bGo = true;
			}
			// 有一个回车，但是在开始，则也是最后一行
			else if (mat.length == 1 && txt.charAt(0) == "\n")
			{
				bGo = true;
			}
		}
		
		return bGo;
	},
	
	// 锁住屏幕，禁止输入
	lockScreen: function(bLock)
	{
		if (bLock)
		{
			this.container.style.cursor = "wait";
			this.workingArea.contentEditable = false;
			this.historyArea.contentEditable = false;
		}
		else
		{
			if (this.isFullScreen())
			{
				return;
			}
			this.container.style.cursor = "auto";
			this.workingArea.contentEditable = true;
			this.historyArea.contentEditable = true;
		}
		BlackScreenCtrl.SCREEN_LOCKED = bLock;
	},
	
	// 判断屏幕是否被锁住
	isScreenLocked: function()
	{
		return BlackScreenCtrl.SCREEN_LOCKED;
	},
	
	// 是否全屏模式
	isFullScreen: function()
	{
		return this.bFullScreen;
	},
	
	// 进入全屏模式
	enterFullScreen: function()
	{
		this.bFullScreen = true;
		this.lockScreen(true);
	},
	
	// 退出全屏模式
	exitFullScreen: function()
	{
		this.bFullScreen = false;
		this.lockScreen(false);
	}
};


/**************************************************
 * 全屏控件
 *************************************************/
// 全屏控件构造函数
function FullScreenCtrl(blackScreenCtrl)
{
	this.blackScreenCtrl = blackScreenCtrl;
	this.container = null;
	this.waiting = false;	// 是否等待响应
	this.init();
}

// 全屏控件原型
FullScreenCtrl.prototype = 
{
	// 构造函数
	constructor: FullScreenCtrl,
	
	// 初始化
	init: function()
	{
		this.container = document.createElement("div");
		this.setContainerEventHandler();
	},
	
	// 开始全屏
	start: function(html)
	{
		// 进入全屏模式
		this.blackScreenCtrl.enterFullScreen();
		this.setContainerStyle(this.container);
		// 内容赋值
		this.container.innerHTML = html;
		this.container.style.display = "";
		// 绑定可编辑的消息处理句柄
		this.pickUpFieldItemToBindEventHandler();
		this.blackScreenCtrl.workingArea.appendChild(this.container);
		this.waiting = false;
		this.container.style.cursor = "text";
	},
	
	// 结束全屏
	finish: function()
	{
		this.container.contentEditable = "inherit";
		this.container.style.cursor = "inherit";
		// 调整可编辑字段显示风格
		this.pickUpFieldItemToRestoreStyle();
		// 迁入历史区
		this.blackScreenCtrl.migrateHtml();
		// 清空内容
		this.container.innerHTML = "";
		this.container.style.display = "none";
		// 退出全屏模式
		this.blackScreenCtrl.exitFullScreen();
	},
	
	setContainerStyle: function()
	{
		this.container.style.fontFamily = this.blackScreenCtrl.fontFamily;
		this.container.style.fontSize = this.blackScreenCtrl.fontSize + "px";
		this.container.style.lineHeight = "100%";
		this.container.style.cursor = "text";
		this.container.contentEditable = false;
	},
	
	setContainerEventHandler: function()
	{
		var self = this;
		__bindEvent(this.container, "dblclick", function(e){return self.onDblClick(e);});
		__bindEvent(document, "keydown", function(e){return self.onKeyDown(e);});
	},
	
	// 可编辑字段处理
	pickUpFieldItemToBindEventHandler: function()
	{
		var self = this;
		var fontSize = this.blackScreenCtrl.fontSize % 2 == 1 ? this.blackScreenCtrl.fontSize + 1 : this.blackScreenCtrl.fontSize;
		var firstField = null;
		var nodes = this.container.getElementsByTagName("input");
		for (var i = 0; i < nodes.length; i++)
		{
			var node = nodes[i];
			var attr = node.attributes["name"];
			if (!attr || attr.nodeValue != "__tw3_FieldItem")
			{
				continue;
			}
			
			// 是否需要显示下划线
			var text = __trim(node.value.replace(/&nbsp;/gm, " "));
			var textEx = text.replace(/^_+/gm, "").replace(/_+$/gm, "");
			var bUnderLine = text != "" &&  textEx == "";
			
			// 设置显示相关属性
			node.value = textEx;
			node.defaultValue = textEx;
			if (bUnderLine)
			{
				node.style.borderBottom = "1px solid #FFFF00";
			}
			
			node.style.margin = "0px";
			node.style.padding = "0px";
			node.style.fontFamily = this.blackScreenCtrl.fontFamily;
			node.style.fontSize = this.blackScreenCtrl.fontSize + "px";
			node.style.background = this.blackScreenCtrl.workingAreaBgColor;
			node.style.color = this.blackScreenCtrl.workingAreaFontColor;
			// 文字宽度是字体大小的1/2
			node.style.width = fontSize / 2 * node.maxLength + "px";
			node.style.cursor = "inherit";
			
			// 绑定特定事件
			__bindEvent(node, "focus", function(e){return self.onFieldItemFocus(e);});
			__bindEvent(node, "blur", function(e){return self.onFieldItemBlur(e);});
			__bindEvent(node, "keydown", function(e){return self.onFieldItemKeyDown(e);});
			__bindEvent(node, "keyup", function(e){return self.onFieldItemKeyUp(e);});
			   //防止事件向上传递 修复在IE8以下 进行无法粘贴操作
			   //新加代码开始
			__bindEvent(node,'paste',function(e) {
		 	if(e && e.stopPropagation) //FF  
                {  
                  e.stopPropagation();  //
                 }  
                   else  //IE  
                 {  
                      window.event.cancelBubble = true;
                 }  	
                 });
			__bindEvent(node,'beforepaste',function(e){
				  if(e && e.stopPropagation) //FF  
                {  
                  e.stopPropagation(); 
                 }  
                   else  //IE  
                 {  
                      window.event.cancelBubble = true;
                 }
			});
			//新加代码结束
			
			if (!firstField)
			{
				firstField = node;
			}
		}
		
		firstField.focus();
	},
	
	// 可编辑字段显示风格恢复
	pickUpFieldItemToRestoreStyle: function()
	{
        // 将可编辑字段由input改为span
		var nodes = this.container.getElementsByTagName("input");
		var count = nodes.length;
		while(nodes.length > 0 && count > 0)
		{
			var node = nodes[0];
			var attr = node.attributes["maxlength"];
			var txt = node.value;
			if (attr && attr.nodeValue)
			{
				var maxlength = parseInt(attr.nodeValue);
				for (var nn = txt.length; nn < maxlength; nn++)
				{
					txt += " ";
				}
			}
			
			node.parentNode.style.borderBottom = node.style.borderBottom;
			node.parentNode.innerHTML = txt.replace(/ /gm, "&nbsp;");
			
			count--;
		}
	},
	
	// 鼠标双击事件
	onDblClick: function(e)
	{
		__preventEventBubble(e);
		var element = e.target || e.srcElement;
		this.commit(element);
	},
	
	// 按键事件
	onKeyDown: function(e)
	{
		var funcKey = "";
		
		e = e ? e : window.event;
		var ch = e.keyCode ? e.keyCode : e.which;
		switch (ch)
		{
		case 114:	// F3
			funcKey = "F3";
			break;
		case 115:	// F4
			funcKey = "F4";
			break;
		case 116:	// F5
			funcKey = "F5";
			break;
		case 123:
			this.commit();
			__preventEventDefault(e);
			__preventEventBubble(e);
			return false;
		case 122:
			funcKey = "F11";
			break;
		default:
			return true;
		}
		
		if (this.checkIdle())
		{
			this.blackScreenCtrl.fireEvent(__BS_EVENT_FULLSCREEN_HOTKEY, funcKey);
		}
		
		if (__BROWSER.msie)
		{
			e.keyCode = 0;
		}
		
		__preventEventDefault(e);
		__preventEventBubble(e);
		return false;
	},
	
	// 可编辑字段获得焦点
	onFieldItemFocus: function(e)
	{
		var element = e.target || e.srcElement;
		element.style.background = "#5A3559";
		setCursorPosition(element,0);
		return true;
	},
	
	// 可编辑字段失去焦点
	onFieldItemBlur: function(e)
	{
		var element = e.target || e.srcElement;
		element.style.background = this.blackScreenCtrl.workingAreaBgColor;
		return true;
	},
	
	// 可编辑元素键盘事件处理
	onFieldItemKeyDown: function(e)
	{
		e = e ? e : window.event;
		var ch = e.keyCode ? e.keyCode : e.which;
		switch (ch)
		{
		case 9:		// tab
		case 13:	// enter
		{
			this.nextFocus(e);
			break;
		}
		case 40:{
			this.nextFocus(e);
			break;
		}
		case 38:{
			this.prevFocust(e);
			break;
		}
		default:
			return true;
		}
		
		// 不执行默认处理句柄
		__preventEventDefault(e);
		__preventEventBubble(e);
		return false;
	},
	
	//可编辑元素键盘弹起事件，主要用于自动tab
	/**
	 * 修复在编辑航段数据时无法自动选择及修改数据
	 */
	onFieldItemKeyUp: function(e)
	{
	    var 	e = e ? e : window.event;
	    var element= e.target || e.srcElement;
		var elemenBottmBorder=element.style.borderBottomWidth;
		var ch = e .keyCode ? e .keyCode : e.which;
		//可编辑框特有功能键	
		  var maxlength = element.maxLength;
			 if(maxlength && element.value.length==maxlength){
			 	   //对有下边框的，不涉及光标问题 
			 	    if(elemenBottmBorder &&elemenBottmBorder=="1px")
		          {
					  this.nextFocus(e);
		          } 
		          else
				 {  
				 	// 对无下边框的数据禁用以下键
					  var keycode=[8,33,34,35,36,37,38,39,40,45,46];
                      var flag = false;
                      for (var i = 0; i < keycode.length; i++) {
                      if (keycode[i] == ch) {
                          flag = true;
                           break;
                        }
                        
                      }
                       if (flag) {
                      }
                      else
                      {
                      	  /*
                      	   *替换光标后面的数据
                      	   * 使用数据接受文本框值，对数组进行操作
                      	   * 将数据装换文本赋给文本框 
                      	   * 设计光标获取和设置问题
                      	   * */
                      	   var val = element.value;
					       var valArr=[];
					       for(var i=0;i<val.length;i++){
					          valArr.push(val[i]);
					         }
                             if(ch!=9){
                               	var index = getObjCursorPosition(element);
                               	 valArr.splice(index, 1, String.fromCharCode(ch));
                                 if(val.length===index)
                                {
                             	 this.nextFocus(e);
                             	 return; 
                                 }
                                    element.value =valArr.join('');
                                    setObjCur(element, index);
                               }                    	  
                      }
                }		 	
	     }
	     
		 
		 return true;
	},
	
	/**
	 * 全屏数据提交
	 * @param element 提交时光标所在元素
	 */
	commit: function(element)
	{
		if (!this.checkIdle())
		{
			return;
		}
		
		var xmlOutput = '<TDE Direction="Out" Type="Data" xml:space="preserve"><XMLData FullScreen="1"  XmitRow="{0}" XmitCol="{1}">';
		var xmitRow = "0";
		var xmitCol = "0";
		
		var tmpXml = "";
		var nodes = this.container.getElementsByTagName("input");
		for (var i = 0; i < nodes.length; i++)
		{
			var node = nodes[i];
			var attr;
			
			attr = node.attributes["name"];
			if (!attr || attr.nodeValue != "__tw3_FieldItem")
			{
				continue;
			}
			
			var text = node.value.replace(/&nbsp;/gm, " ");
			var row = node.attributes["Row"];
			var col = node.attributes["Col"];
			var editNo = node.attributes["EditNo"];
			var maxLength = node.attributes["maxlength"];
			var str = __format('<Object EditNo="{0}" Row="{1}" Col="{2}"><Text>{3}</Text></Object>', editNo.nodeValue, row.nodeValue, col.nodeValue, text);
			
			tmpXml += str;
			
			xmitRow = row.nodeValue;
			xmitCol = parseInt(col.nodeValue, 10) + parseInt(maxLength ? maxLength.nodeValue : node.maxLength, 10) - 1;
		}
		
		// 确定提交时光标位置
		//var attr = element.attributes["name"];
		//if (attr && attr.nodeValue == "__tw3_FieldItem")
		//{
		//	var row = element.attributes["Row"];
		//	xmitRow = row ? row.nodeValue : xmitRow;
		//	var col = element.attributes["Col"];
		//	xmitCol = col ? col.nodeValue : xmitCol;
		//	var text = element.value || __innerText(element);
		//	xmitCol = parseInt(xmitCol, 10) + text.length;
		//}
		
		xmlOutput = __format(xmlOutput, xmitRow, xmitCol);
		xmlOutput += tmpXml + "</XMLData></TDE>";
		xmlOutput = xmlOutput.replace(BlackScreenCtrl.SOE,"");
		this.blackScreenCtrl.fireEvent(__BS_EVENT_FULLSCREEN_DATA, xmlOutput);
	},
	
	checkIdle: function()
	{
		if (this.waiting)
		{
			return false;
		}
		this.waiting = true;
		this.container.style.cursor = "wait";
		return true;
	},
	//光标进入下一个编辑框
	nextFocus: function(e)
	{
		var element = e.target || e.srcElement;
		var parent = element.parentNode;
		var parentNext = parent.nextSibling;
		while(parentNext){
			if (parentNext.nodeName.toLowerCase() == "span"){
				var next = parentNext.childNodes[0];
				while(next){
					if (next.nodeName.toLowerCase() == "input")
					{
						var attr = next.attributes["name"];
						if (attr && attr.nodeValue == "__tw3_FieldItem")
						{
							next.focus();
							break;
						}
					}
					next = next.nextSibling;			
				}
				//判断是否遍历完子元素，如果完了则说明span类没有编辑框
				if(next){		
					break;		
				}
			}	
			parentNext = parentNext.nextSibling;
		}
	},
	prevFocust:function(e){
	   
	   var element = e.target || e.srcElement;
		var parent = element.parentNode;
		var parentPrve = parent.previousSibling;
		while(parentPrve){
			if (parentPrve.nodeName.toLowerCase() == "span"){
				var prve = parentPrve.childNodes[0];
				while(prve){
					if (prve.nodeName.toLowerCase() == "input")
					{
						var attr = prve.attributes["name"];
						if (attr && attr.nodeValue == "__tw3_FieldItem")
						{
							prve.focus();
							break;
						}
					}
					prve = prve.previousSibling;			
				}
				//判断是否遍历完子元素，如果完了则说明span类没有编辑框
				if(prve){		
					break;		
				}
			}	
			parentPrve = parentPrve.previousSibling;
		
	   }
	}
};

// 提示窗口部件
function BSTipWidget()
{
	this.tip = document.createElement("div");
	this.tip.contentEditable = false;
	this.tip.style.background = "#FFFFFF";
	this.tip.style.color = "#000000";
	this.tip.style.overflow = "auto";
	this.tip.style.lineHeight = "100%";
	this.tip.style.padding = "6px";
	this.tip.style.margin = "3px";
	this.tip.style.cursor = "default";
	this.tip.style.position = "absolute";
	this.tip.style.zIndex = "999";
	this.showing = false;
	
	this.hide();
}

BSTipWidget.prototype = 
{
	constructor: BSTipWidget,
	
	/**
	 * 显示提示
	 * @param target 目标元素
	 * @param msg 提示内容
	 * @param x 横坐标
	 * @param y 纵坐标
	 * @param options 可选参数
	 */
	show: function(target, msg, x, y, options)
	{
		msg = __escapeHtmlChars(msg);
		msg = msg.replace(/ /gm, "&nbsp;");
		msg = msg.replace(/\n/gm, "<br>");
		this.tip.innerHTML = msg;
		this.tip.style.left = x + "px";
		this.tip.style.top = y + "px";
		this.tip.style.display = "";
		if (options && options.fontSize)
		{
			this.tip.style.fontSize = options.fontSize + "px";
		}
		if (options && options.fontFamily)
		{
			this.tip.style.fontFamily = options.fontFamily;
		}
		target.appendChild(this.tip);
		
		this.showing = true;
	},
	
	// 隐藏提示
	hide: function()
	{
		__removeCaretHolder(true);
		this.tip.innerHTML = "";
		this.tip.style.display = "none";
		if (this.tip.parentNode)
		{
			this.tip.parentNode.removeChild(this.tip);
		}
		
		this.showing = false;
	},
	
	isShowing: function()
	{
		return this.showing;
	}
};

// 历史命令列表部件
function BSHistoryCmdWidget()
{
	this.container = document.createElement("div");
	this.historyCmdList = null;
	this.selectIndex = -1;
	this.target = null;
	this.init();
	this.blackScreenCtrl = null;
}

BSHistoryCmdWidget.prototype = 
{
	constructor: BSHistoryCmdWidget,
	
	// 初始化
	init: function()
	{
		this.container.tabIndex = 0;
		this.container.style.background = "#FFFFFF";
		this.container.style.color = "#000000";
		this.container.style.overflowX = "hidden";
		this.container.style.overflowY = "auto"; 
		this.container.style.lineHeight = "100%";
		this.container.style.padding = "0px";
		this.container.style.margin = "0px";
		this.container.style.position = "absolute";
		this.container.style.width = "250px";
		this.container.style.height = "200px";
		this.container.style.cursor = "pointer";
		this.container.style.display = "none";
		this.container.style.whiteSpace = "nowrap";
		this.container.style.zIndex = "999";
		this.container.innerHTML = "";
		
		var self = this;
		__bindEvent(this.container, "keydown", function(e){self.onKeyDown(e);});
		__bindEvent(this.container, "click", function(e){self.onClick(e);});
		__bindEvent(this.container, "mouseover", function(e){self.onMouseOver(e);});
		__bindEvent(this.container, "blur", function(e){self.hide();});
	},
	
	/**
	 * 显示
	 * @param target 显示历史命令列表的目标元素
	 */
	show: function(target, blackScreenCtrl, options)
	{
		this.blackScreenCtrl = blackScreenCtrl;
		this.target = target;
		
		this.historyCmdList = BlackScreenCtrl.HISTORY_CMD_LIST;
		if (!this.historyCmdList || this.historyCmdList.length == 0)
		{
			this.hide();
			return;
		}
		
		var caretHolder = __addCaretHolder(target, BlackScreenCtrl.SOE);
		var x = caretHolder.offsetLeft;
		var y = caretHolder.offsetTop + caretHolder.offsetHeight;
		
		this.container.innerHTML = "";
		var documentFragment = document.createDocumentFragment();
		for (var i = 0; i < this.historyCmdList.length; i++)
		{
			var cmd = this.historyCmdList[i];
			cmd = cmd.replace(/\n/gm, "<br>");
			var node = document.createElement("div");
			node.style.borderBottom = "1px dashed #00FF00";
			node.style.padding = "3px";
			node.style.whiteSpace = "nowrap";
			node.innerHTML = cmd;
			node.name = "__tw3_HistoryCmd";
			documentFragment.appendChild(node);
		}
		
		this.container.appendChild(documentFragment);
		this.container.style.display = "";
		this.container.style.left = x + "px";
		this.container.style.top = y + "px";
		if (options && options.fontSize)
		{
			this.container.style.fontSize = options.fontSize + "px";
		}
		if (options && options.fontFamily)
		{
			this.container.style.fontFamily = options.fontFamily;
		}
		
		target.contentEditable = false;
		target.appendChild(this.container);
		
		this.selectIndex = 0;
		this.select();
		this.container.focus();
		
		this.blackScreenCtrl.saveScrollTop();
	},
	
	// 隐藏
	hide: function(bSelected)
	{
		this.target.contentEditable = true;
		var caretHolder = __getCaretHolder();
		if (caretHolder)
		{
			if (!bSelected)
			{
				caretHolder.innerHTML = "";
			}
			__removeCaretHolder();
			this.target.focus();
			__setCaret(caretHolder, -1);
		}
		
		this.selectIndex = -1;
		this.container.innerHTML = "";
		this.container.style.display = "none";
		
		if (this.container.parentNode)
		{
			this.container.parentNode.removeChild(this.container);
		}
		this.blackScreenCtrl.restoreScrollTop();
	},
	
	// 选择上一条
	up: function()
	{
		this.selectIndex = this.selectIndex > 0 ? this.selectIndex - 1 : this.selectIndex;
		this.select();
	},
	
	// 选择下一条
	down: function()
	{
		this.selectIndex = this.selectIndex < this.historyCmdList.length - 1 ? this.selectIndex + 1 : this.selectIndex;
		this.select();
	},
	
	// 选中当前项
	select: function()
	{
		var scrollHeight = 0;
		var nodes = this.container.getElementsByTagName("div");
		for (var i = 0; i < nodes.length; i++)
		{
			if (i == this.selectIndex)
			{
				nodes[i].style.background = "#FFFF00";
			}
			else
			{
				nodes[i].style.background = "#FFFFFF";
			}
			
			if (i <= this.selectIndex)
			{
				scrollHeight += nodes[i].offsetHeight;
			}
		}
		
		this.container.scrollTop = scrollHeight - this.container.offsetHeight;
	},
	onKeyDown: function(e)
	{
		e = e ? e : window.event;
		var ch = e.keyCode ? e.keyCode : e.which; 
		switch (ch)
		{
		case 27:	// esc
			this.hide();
			break;
		case 13:	// enter
			this.pasteHistoryCmd(this.historyCmdList[this.selectIndex]);
			break;
		case 38:	// up arrow
			this.up();
			break;
		case 40:	// down arrow
			this.down();
			break;
		default:
			break;
		}

		// 不执行默认处理句柄
		__preventEventDefault(e);
		__preventEventBubble(e);
		return false;
	},
	
	onClick: function(e)
	{
		var element = e.srcElement || e.target;
		if (element.name == "__tw3_HistoryCmd")
		{
			this.pasteHistoryCmd(element.innerHTML.replace(/<br.*?>/gmi, "\n"));
		}
		
		__preventEventDefault(e);
		__preventEventBubble(e);
	},
	
	onMouseOver: function(e)
	{
		var element = e.srcElement || e.target;
		var childs = this.container.childNodes;
		for (var i = 0; i < childs.length; i++)
		{
			if (i == this.selectIndex)
			{
				continue;
			}
			if (childs[i] == element)
			{
				childs[i].style.background = "#BCDBDA";
			}
			else
			{
				childs[i].style.background = "#FFFFFF";
			}
		}
	},
	
	pasteHistoryCmd: function(cmd)
	{
		var caretHolder = __getCaretHolder();
		caretHolder.innerHTML = BlackScreenCtrl.SOE + __escapeHtmlChars(cmd).replace(/\n/gm, "<br>");
		this.hide(true);
	}
};

