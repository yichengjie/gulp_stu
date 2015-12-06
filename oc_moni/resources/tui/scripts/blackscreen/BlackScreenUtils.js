/**
* JS黑屏控件工具集
* 
* @author		huangjian
* @date			2013-07-18
* @copyright 	中国航信重庆研发中心，2013.
*
*/


/**************************************************
 * 全局变量
 *************************************************/
__BROWSER = __getBrowserType();			// 浏览器类型
__LANG = "zh_CN";						// 语言


/**************************************************
 * 全局函数
 *************************************************/
// 删减左空格
function __trimLeft(str)
{
	return str.replace(/^\s+/,"");
}

// 删减右空格
function __trimRight(str)
{
	return str.replace(/\s+$/,"");
}

// 删减左右空格
function __trim(str)
{
	return __trimLeft(__trimRight(str));
}

// 格式化字符串, 
function __format(str, argumentlist)
{
    for(var i = 1; i < arguments.length; i++) 
    {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    
    return str;
}

// 过滤html标签
function __filterHtmlTags(str)
{
	str = str.replace(/<br.*?>/gmi, "\n");
	str = str.replace(/<.*?>/gm, "");
	
	return str;
}

// 获取元素内部文本
function __innerText(element)
{
	return element.innerText || element.textContent || element.text || "";
}

// 转义xml特殊字符
function __escapeXMLChars(str)
{   
	str = str.replace(new RegExp("\\x26", 'gmi'), "&#x26;");
	str = str.replace(new RegExp("\\x3C", 'gmi'), "&#x3C;");
	str = str.replace(new RegExp("\\x3E", 'gmi'), "&#x3E;");
	str = str.replace(new RegExp("\\x10", 'gmi'), "&#x10;");
	str = str.replace(new RegExp("\\x1C", 'gmi'), "&#x1C;");
	str = str.replace(new RegExp("\\x1D", 'gmi'), "&#x1D;");
	
	return str;
}

// 转义html特殊字符
function __escapeHtmlChars(str)
{
	str = str.replace(/&/gm, "&amp;");
	str = str.replace(/"/gm, "&quot;");
	str = str.replace(/>/gm, "&gt;");
	str = str.replace(/</gm, "&lt;");
	//str = str.replace(/ /gm, "&nbsp;");
	
	return str;
}

// 反转义html特殊字符
function __unescapeHtmlChars(str)
{
	str = str.replace(/&quot;/gmi, '"');
	str = str.replace(/&amp;/gmi, "&");
	str = str.replace(/&gt;/gmi, ">");
	str = str.replace(/&lt;/gmi, "<");
	str = str.replace(/&nbsp;/gmi, " ");
	
	return str;
}

// 获取xml文档对象
function __createXmlDoc(str)
{
	var xmlDoc;
	if (__BROWSER.msie)	// ie
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.loadXML(str);
	}
	else	// ff
	{//2013-11-12党会建修改
		xmlDoc = (new DOMParser()).parseFromString(str, "text/xml");
		xmlDoc.text = xmlDoc.documentElement.textContent;
	}
	
	return xmlDoc;
}

// 获取xml文档对象中节点文本
function __getXmlNodeText(xmlDoc, tagName)
{
	var xmlElement = xmlDoc.documentElement;
	var node = xmlElement.getElementsByTagName(tagName);
	if(node.length <= 0)
	{
		return "";
	}
	
	var nodeValue =  node[0].text || node[0].textContent;
	nodeValue = nodeValue.replace(/0x/gm, "");
	
	return __trim(nodeValue);
}

// 为元素绑定事件
function __bindEvent(element, event, handler)
{
	if(document.addEventListener)	//ff
	{
		element.addEventListener(event, handler, false);
	}
	else	// ie
	{
		element.attachEvent("on" + event, handler);
	}
}

// 阻止事件的冒泡行为，即阻止事件流向父元素
function __preventEventBubble(e)
{
	e = e || window.event;
	if (e.stopPropagation)	// ff
	{
		e.stopPropagation();
	}
	else	// ie
	{
		e.cancelBubble = true; 
	}
}

// 阻止事件的默认处理
function __preventEventDefault(e)
{
	e = e || window.event;
	e.returnValue = false;
	if (e.preventDefault) 
	{
		e.preventDefault();
	}
}

// 保存光标
function __saveCaret()
{
	var range;
	if (__BROWSER.msie)
	{
		range = document.selection.createRange();
	}
	else
	{
		range = document.getSelection().getRangeAt(0);
	}
	return range;
}

// 恢复光标
function __restoreCaret(range)
{
	if (__BROWSER.msie)
	{
		range.collapse(true);
        range.select();
	}
	else
	{
		var sel = document.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
		range.collapse(true);
	}
}

// 在元素的指定位置设置输入光标 （注：目前只支持开始位置和结束位置）
function __setCaret(element, pos)
{
	try
	{
		element.focus();
	}
	catch(e)
	{
	}

	var len = __innerText(element).length;
	
	// pos小于0或大于文本长度，则设置光标在输入区域末尾
    pos = pos < 0 ? len : pos > len ? len : pos;
	
    if (document.selection)	// ie
    {
	    var rang = document.body.createTextRange();
    	rang.moveToElementText(element);
        rang.collapse(pos == 0);
        rang.select();
    }
    else if (window.getSelection)	// ff
    {
    	var sel = window.getSelection();
    	var range = document.createRange();
    	range.selectNodeContents(element);
    	range.collapse(pos == 0);
    	sel.removeAllRanges();
    	sel.addRange(range);
	}
}

// 全选某个元素
function __selectAll(element)
{
	if (document.selection)	// ie
	{
	    var rang = document.body.createTextRange();
		rang.moveToElementText(element);
	    rang.select();
	}
	else if (window.getSelection)	// ff
	{
		var sel = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(element);
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

// 在元素的光标处插入内容
function __insertHtml(element, html)
{
	if (document.selection)	// ie
	{
		var range = document.selection.createRange();
		range.collapse(false);
		//alert(html);
		range.pasteHTML(html);
		//ange.text=html;
	}
	else if (window.getSelection)	// ff
	{			
		var sel = window.getSelection();
		var range = sel.getRangeAt(0);
		range.collapse(false);
        var node = range.createContextualFragment(html);
        range.insertNode(node);	        
        range.collapse(false);
        sel.removeAllRanges(); 
        sel.addRange(range);
	}
}

// 添加光标占位符，用以记忆光标位置
//全屏状态下需阻止以下代码的运行
function __addCaretHolder(element, str)
{
	__removeCaretHolder();	  
	 __insertHtml(element, __format('<span id="__tw3_CaretHolder">{0}</span>', str ? str : ""));
	
	return __getCaretHolder();
}

// 移除光标占位符
function __removeCaretHolder(toDelete)
{
	var caretHolder = document.getElementById("__tw3_CaretHolder");
	if (caretHolder)
	{
		if (toDelete)
		{
			if (caretHolder.parentNode)
			{
				caretHolder.parentNode.removeChild(caretHolder);
			}
		}
		else
		{
			caretHolder.id = "";
		}
	}
}

// 获取光标占位符
function __getCaretHolder()
{
	return document.getElementById("__tw3_CaretHolder");
}

// 判断第一个结点是否是第二个结点的父节点
function __isParentNode(parent, child)
{
    while (child)
    {
        if (child == parent)
        {
            return true;
        }
        child = child.parentNode;
    }
    
    return false;
}

// 解析命令
function __parseCmd(cmd)
{
	cmd = cmd.replace(/\//gm, " ");
	cmd = cmd.replace(/:/gm, " ");
	cmd = cmd.replace(/ +/gm, " ");
	var items = cmd.split(" ");
	return {cmd: items[0], params: items.slice(1)};
}

// 获取浏览器类型
function __getBrowserType()
{
	var browser = {};
	var ua = navigator.userAgent.toLowerCase();
	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
	/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
	/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
	/(msie) ([\w.]+)/.exec( ua ) ||
	ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
	[];

	if (match[1])
	{
		browser[match[1]] = true;
		browser.version = parseInt(match[2].split(".")[0] || "0");
	}
	
	return browser;
}

// 可打印字符
function __isPrintableChar(keyCode)
{
	if (keyCode == 32)
	{
		return true;
	}
	if (keyCode >= 65 && keyCode <= 90)	// a(A) ~ z(Z)
	{
		return true;
	}
	if (keyCode >= 96 && keyCode <= 111)	// KP_0 ~ KP_Divide
	{
		return true;
	}
	if (keyCode >= 48 && keyCode <= 57)	// 0 ~ 9
	{
		return true;
	}
	if (keyCode >= 186 && keyCode <= 192)	// 其他符号
	{
		return true;
	}
	if (keyCode >= 219 && keyCode <= 222)	// 其他符号
	{
		return true;
	}
	
	return false;
}

// 设置语言
function __setLang(lang)
{
	__LANG = lang;
}

// 提取国际化文本
function __i18n(v)
{
	return v[__LANG];
}

// 带参数的定时器 
function __setTimeoutEx(time, func, argslist) 
{
    var args = [];
    for (var i = 2; i < arguments.length; i++) 
    {
        args.push(arguments[i]);
    }
    return window.setTimeout(function() {
        func.apply(this, args);
    }, time);
}
/**
 * 获取当前光标位置
 */
 
   function getObjCursorPosition(obj) {
            var ele = obj;
            var cursurPosition = -1;
            if ('selectionStart'  in ele) {//非IE浏览器
                cursurPosition = ele.selectionStart;
                 
            } else {//IE
                var range = document.selection.createRange();
                range.moveStart('character', -ele.value.length-1);
				 cursurPosition = range.text.length;
                range.collapse(true);
                range.select(); 
              
            }
            return cursurPosition;
   }
   /**
    * 设置光标位置，光标根据当前设置的数据滚动而变化
    * 主要用于航段数据修改时数据自动覆盖问题
    */
  function setObjCur(esrc, index) {	
            if ('selectionStart' in esrc) {
				esrc.selectionStart = index+1;
				esrc.selectionEnd = index+1;
				esrc.focus ();
			}
		    else{
               var rtextRange =esrc.createTextRange();
                rtextRange.moveStart('character',index+1);
                rtextRange.collapse(true);
                rtextRange.select();
			}
			 
} 
 /**
  *  设置光标位置
  *   对于__setCaret函数的补充 
  */
  function setCursorPosition(esrc, pos){ 
     if(esrc.setSelectionRange){ 
        esrc.focus(); 
        esrc.setSelectionRange(pos,pos); 
 } 
    else if (esrc.createTextRange) { 
      var range = esrc.createTextRange(); 
      range.collapse(true); 
      range.moveEnd('character', pos); 
      range.moveStart('character', pos); 
      range.select(); 
 } 
} 
