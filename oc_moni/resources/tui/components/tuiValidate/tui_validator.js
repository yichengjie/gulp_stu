/*
 功能描述:页面上的验证方法
 用户绑定的是form表单的id
 主要是对input的的属性加以验证
 验证需要用class来识别需要验证的类型。class为了避免重复和需要，统一以tui开头，返回ture和false,用户根据返回值来判断是否执行
 其他的操作。用户通过选项来判断是弹框显示错误，或者在错误的后面显示。
 默认是是在右侧显示错误信息。
 弹框的需求：填充错误提示的label,默认获取input 的title的值，可以指定自己所需的其他属性
 greaterEqual：判断2个值大小，主要用于日期和时间的比较
 增加用户在外面自定义验证的 extendRules如
extendRules:{//自己写的验证规则
   classRuleSettings:{tuiAAA:{AAA:true}},//tuiAAA,是需要写在input上的class,后面的AAA，需要跟后面的3个对应上。
   validateMethods:{AAA:function(value,element){return  /^[0-9]{0,}$/.test(value);}},
   labelMessages:{AAA: "只能输入正整数及0"},
   dialogMessages:{AAA: "{0}只能输入正整数及0"}
}
 *@Copyright: Copyright (c) 2015
 *@Company: 中国民航信息网络股份有限公司
 *@author:  党会建  
 @version 0.1 2012/3/2
 @version 0.9 2012/3/27
 @version 1.2 2012/6/12  经过测试
 @version 1.5 2012/12/11 部署到abframe2.0上
 @version 1.5.1 2012/12/19 增加eterm用户名和密码的验证
 @version 2.0 2012/12/24 开始整合eico设计的样式，将提示改完下面。增加isLabelDown属性
 @version 2.1 2013/1/28 允许用户控制提示的位置，和现实错误，错误的位置。
 @version 2.1.1 2013/1/30 更改checkbox在ie7下问题
 @version 2.2 2013/1/31 增加isTip，用户在label情况下，提交时可以加上提示信息，在页面上显示
 @version 2.3 2013/2/4 增加选项excludeIds,排除判断的id项，这些不进行判断验证
 @version 2.3.1 2013/2/28 修改tuiPersonName验证规则
 @version 2.3.2 2013/3/22 增加针对pnr ssr的验证规则
 @version 2.3.2 2013/3/26 调整basicInput:"\"{0}\"允许值为,.?&#*-:/中英数字空格。",
 @version 2.3.3 2013/4/1 增加新的basicInput，名字是basicContent,允许值为,.?#*+-_=:;\/中英数字空格。"
 @version 2.3.4 2013/4/8  修改checkbox出错后，文字会错位
 @version 2.5   2013/4/12 增加equal和includeIds验证
 @version 2.5.2 2013/4/17 验证input是否修改，如果没有修改，不进行提交；一个input,如果原来有值，用户点击后，清空则提示必填。则变成必填项
 @version 2.5.3 2013/4/18 isClick时，可以使用label显示错误
 @version 2.5.4 2013/4/19,label提示时，如果高度不够，使用height:auto自动适应内容
 @version 2.6 2013/4/22,如果按钮上"data-disabled"属性时，则不再执行验证方法
 @version 2.7 2013/4/23,增加extendSubmit，用户在submit之前，再次执行的验证方法
 @version 2.7.1 2013/5/3,部分提示中加入半角  5-24增加其他提示
 @version 2.7.2 2013/5/27,对外暴露清空所有提示信息的接口
 @version 2.7.3 2013/6/6, 马驰修改，日期验证date中，有一个20年的验证，这个在校验年龄时并不适用，凡是超过20岁的都会报错。
	于是增加一个新的验证规则，和date规则相同，只是没有20年限制。新规则的class为tuiAllDate
 @version 2.7.5 2013/6/9, 若一个input选择之后其实已经符合判定了，但是另外一个input的error style还在
 @version 2.7.6 2013/6/13,注释掉防止冒泡方法，会导致on \off等靠冒泡绑定事件的方法失效
 @version 2.7.7 2013/6/17，select修改事件绑定方法，
 @version 2.8  2013/7/4 增加自定义事件供外部使用tuiValidator trigger触发使用
 @version 2.8.1  2013/7/8 自定义事件tuiValidator,不能off掉，ff下会崩溃
 @version 2.8.2 20130719 增加notEqual ,不等于的判断
 @version 2.8.3 20130917 extendRequired 在tip情况下支持，原来仅支持dialog
 @version 2.8.4 20130928 增加大于验证greater
 @version 2.8.5 20131017  20131030bug修改，如果没有class时，提示错误，所有的错误中间没有，间隔；当都是必填时greater等，遇到一个空白比较，不是必填时遇到空白不比较。
 @version 2.8.5.1 20131025  basicInput和basicContent增加@ 
 @version 2.8.6   20131231 修改ssr相关的验证，增加,./等
 @version 2.8.7   20140210 增加tuiXSSDefend 不区分大小写  0217测试发现问题，修改
 @version 2.8.8   20140211 按照扫描结果去除空格等  0212继续
 @version 2.8.9 20150205 修改了trimALL等规则在chrome下不能正确使用方向键。
 */
;(function($){
$.fn=$.fn||{};
$.extend($.fn,{
	tuiValidator:function(option){
		if (!this.length) {//this只传递进来的那个form对象
		    window.console&&console.warn( "nothing selected, can't validate, returning nothing" );
			return;
		}
	 //初始值
		var _defaults={
			isDialog:false,//是否弹框显示，如果否则在错误后面显示
			isLabel:true,//是否以label形式显示在后面,统一为后面了
			isTip:false,//错误提示显示在指定页面的位置,只能在isLabel时使用
			tipMsg:"请检查红框提示的错误",//tip提示的内容
			$tipArea:null,
			isClearError:false,//20130527增加，情况所有错误，给重置时使用
			isLabelDown:false,//isLabel是在后面，这个是在input框下面显示,如果isDialog也是，则下面显示，同时弹框显示。需要给错误的地方绑定mouseDown事件。
			isLabelError:true,//是否马上显示错误，出错后，不再下面显示错误，而是绑定keyup事件显示。当change时label提示消失，input框有红色标注。
			isErrorDown:null,//error显示的位置,如果不设置，与isLabelDown的位置一样。
			$dialogArea:null,//把弹框的内容放到页面上
			excludeIds:null,//一些id项不进行验证
			includeIds:null,//仅验证一些id
			isClick:false,//提交按钮，调用一个方法来执行验证，不是通过$(document).ready来绑定的。这是已经有click事件了。
			errorClass: "tui_input_error",//错误的css
			errorIcon:"icon_error",//错误提示的红色感叹号标志
			infoClass:"tui_input_info",//输入过程中提示内容的css
			arrowIcon:"tui_icon_arrowTipUp",//错误提示的箭头
			errorElement:"label",//提示消息的html
			ignore:":hidden",//忽略的标签,默认忽略隐藏的
			onsubmit:true,//是否有提交按钮
			submitId:"submitButton",
			dialogTip:"title",//弹框 显示的提示
			dialogMethod:"",//显示弹框的函数
			greaterEqual:"",//例子{fltnum2:"fltnum1"},只能比较2个，属性的值小于等于属性名
			greater:"",//属性名的值大于等于属性的值
			equal:"",//{fltnum2:"fltnum1",}比较2个，要求相等
			notEqual:"",//{{fltnum2:"fltnum1",}比较2个，要求不相等
			extend:"",//自己写扩展函数
			extendSubmit:"",//submit时执行的扩展函数
			extendRequired:"",//用户可以传入多组id,这些id要么都有，要么同时都没有
			disabledAttr:"data-disabled"//按钮上如有这个属性
		};
		//为弹框和label显示设定规则，当用户设定isDialog:true时，默认是关闭label显示的
		if(option.isDialog===true&&typeof option.isLabel==="undefined"){
			option.isLabel=false;
		}
		var settings=$.extend({},_defaults,option);//读取默认参数
		var currentForm=this[0],dialogTip=settings.dialogTip,isDialog=settings.isDialog,isLabel=settings.isLabel,  	extendRequiredArray=settings.extendRequired,dialogErrorMessages="";//因为弹框显示需要全局获取所以，提前定义
		var isLabelDown=settings.isLabelDown,isErrorDown=settings.isErrorDown,excludeIds=settings.excludeIds,includeIds=settings.includeIds,isClick=settings.isClick;
		var errorIcon=settings.errorIcon,arrowIcon=settings.arrowIcon,errorClass=settings.errorClass,infoClass=settings.infoClass;
		var $dialogArea=settings.$dialogArea,isTip=settings.isTip,tipMsg=settings.tipMsg,$tipArea=settings.$tipArea;//2013-1-31添加isTip
		isErrorDown=isErrorDown===null?isLabelDown:isErrorDown;
		var excludeIdsObject={};
		if(excludeIds!==null){
			for(var i=0;i<excludeIds.length;i++){
				excludeIdsObject[excludeIds[i]]=true;
			}
		}
		var includeIdsObject={};
		if(includeIds!==null){
			for(var j=0;j<includeIds.length;j++){
				includeIdsObject[includeIds[j]]=true;
			}
		}
		var	classRuleSettings= {
			tuiRequired: {required: true},//required要放在第一个
			tuiTrim:{trim:true},
			tuiTrim0:{trim0:true},
			tuiTrimAll:{trimAll:true},
			tuiUpper:{upper:true},
			tuiDate: {date: true},
			tuiAllDate: {allDate:true},//马驰增加，新增加一个allDate方法，不带有20年的验证。
			tuiTime: {time: true},
			tuiAlphanumericspace:{alphanumericspace:true},
			tuiAlphanumeric:{alphanumeric:true},
			tuiDigital: {digital: true},
			tuiMathDigital: {mathDigital: true},
			tuiPositiveInteger: {positiveInteger: true},
			tuiLetter: {letter: true},
			tuiAir:{air:true},
			tuiStrictFltnum:{strictFltnum:true},
			tuiFltNum:{fltnum: true},
			tuiCityCode: {citycode:true},
			tuiSegment: {segment:true},
			tuiClass:{subclass:true},
			tuiEmail: {email: true},
			tuiIp:{ip:true},
			tuiPort:{port:true},
			tuiBasicInput:{basicInput:true},
			tuiBasicContent:{basicContent:true},
			tuiOffice:{office:true},
			tuiEQT:{EQT:true},
			tuiPNRNbr:{PNRNbr:true},
			tuiETermUser:{eTermUser:true},
			tuiETermPwd:{eTermPwd:true},
			tuiPersonName:{personName:true},
			tuiGroupName:{groupName:true},
			tuiSSRRmk:{SSRRmk:true},
			tuiContact:{contact:true},
			tuiSSROsi:{SSROsi:true},
			tuiSSROths:{SSROths:true},
			tuiPaxName:{paxName:true},
			tuiChildAge:{childAge:true},
			tuiIsModify:{isModify:true},
			tuiToRequired:{toRequired:true},
			tuiXSSDefend:{XSSDefend:true}
		};
			//合并外面定义的规则
		if(settings.extendRules&& typeof settings.extendRules.classRuleSettings!=="undefined"){
			$.extend(true,classRuleSettings,settings.extendRules.classRuleSettings);
		}
		var validateMethods={//需要的正则表达式和函数
			required: function(value, element, param) {
				switch( element.nodeName.toLowerCase() ) {
				case 'select':
					// could be an array for select-multiple or a string, both are fine this way
					var val = $(element).val();
					return val && val.length > 0;
				case 'input':
					if ( checkable(element) ){
						return getLength(value, element) > 0;
						}
				default:
					return $.trim(value).length > 0 ;
				}
			},
			date:function(value,element)   {return isLegalDate(value);},
			allDate:function(value,element){return isLegalDate(value,true);},//马驰修改，isLegalDate多加了一个参数，如果为true将忽略20年的验证。
			time:function(value,element)   {return /^[0-9]{2}[:]{0,1}[0-9]{2}$/.test(value);},
			alphanumeric:function (value, element){return /^[A-Za-z0-9]{0,}$/.test(value);},
			alphanumericspace:function (value, element){return /^[A-Za-z0-9\s]{0,}$/.test(value);},
			digital:function(value,element){return  /^[0-9]{0,}$/.test(value);},
			mathDigital:function(value,element){return  /^[+-]{0,1}[0-9]{1,}[\.]{0,1}[0-9]{0,}$/.test(value);},
			positiveInteger:function(value,element){return  /^[1-9]{1}[0-9]{0,}$/.test(value);},
			letter:function (value,element){return  /^[a-zA-Z]{0,}$/.test(value);},
			air:function (value,element){return  /^[a-zA-Z]{2}$|^[a-zA-Z]{1}[0-9]{1}$|^[0-9]{1}[a-zA-Z]{1}$/.test(value);},
			airKeyUp:function (value,element){return  /^[0-9a-zA-Z]{0,}$/.test(value);},
			strictFltnum:function(value,element) {return  /^([A-Za-z]{1}[0-9]{1}|[0-9]{1}[A-Za-z]{1}|[A-Za-z]{2})[0-9]{3,4}[A-Za-z]?$/.test(value);},
			fltnum:function(value,element) {return  /^([A-Za-z0-9]{0}|[A-Za-z]{1}[0-9]{1}|[0-9]{1}[A-Za-z]{1}|[A-Za-z]{2})[0-9]{3,4}[A-Za-z]?$/.test(value);},
			fltnumKeyUp:function(value,element) {return  /^[0-9A-Za-z]{0,2}[0-9]{1,4}[A-Za-z]?$/.test(value);},
			citycode:function(value,element){return /^[A-Z]{3}$/i.test(value);},
			citycodeKeyUp:function(value,element){return /^[A-Z]{0,}$/i.test(value);},//city keyup时验证规则
			segment:function(value,element){return /^[A-Z]{6}$/i.test(value);},
			subclass:function(value,element){return /^[A-Z]{1}$/i.test(value);},
			email:function(value,element){return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(value);},
			ip:function(value,element){return /^(25[0-5]|2[0-4][0-9]|1{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|1{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|1{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|1{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/.test(value);},
			port:function(value,element){return /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/.test(value);},
			basicInput:function(value,element){return /^[0-9a-zA-Z\u4E00-\u9FA5\s\-_:#@\?\*,\.\/]{0,}$/g.test(value);},
			office:function(value,element){return /^[A-Za-z]{3}[0-9]{3}$/g.test(value);},
			EQT:function(value,element){return /^[A-Za-z0-9]{3}$/g.test(value);},
			PNRNbr:function(value,element){return /^[A-Za-z0-9]{6}$/g.test(value);},
			eTermUser:function(value,element){return /^[A-Za-z0-9_\$]{2,15}$/g.test(value);},
			eTermPwd:function(value,element){return /^.{1,20}$/g.test(value);},
			personName:function(value,element){return /^[a-zA-Z\u4E00-\u9FA5]{1,}[a-zA-Z\u4E00-\u9FA5\\/]{0,}[a-zA-Z\u4E00-\u9FA5]{1,}$/ig.test(value);},
			groupName:function(value,element){return  /^[a-zA-Z]{1,}[\/]{0,1}[a-zA-Z]{1,}$/.test(value);},
			SSRRmk:function(value,element){return  /^[0-9a-zA-Z \u4E00-\u9FA5\/\s\,\.\-\+\?\(\) ]{0,}$/.test(value);},//20131230 增加\/\s\,\.\-\+\?\(\)
			contact:function(value,element){return /^[0-9a-zA-Z \/\-]{0,}$/.test(value);},
			SSROsi:function(value,element){return  /^[a-zA-Z]{1,}[0-9a-zA-Z\/\s\,\.\-\+\?\(\) ]{0,}$/.test(value);},
			SSROths:function(value,element){return  /^[0-9a-zA-Z\/\s\,\.\+\-\?\(\) ]{0,}$/.test(value);},//20131230 增加\/\s\,\.\-\+\?\(\)
			paxName:function(value,element){return  /^[a-zA-Z\u4E00-\u9FA5]{1,}[a-zA-Z\u4E00-\u9FA5\/]{0,}[a-zA-Z\u4E00-\u9FA5]{1,}$/.test(value);},
			childAge:function(value,element){
				if(/^[0-9]{1,2}$/.test(value)){
					if(value>12||value<2){
                        return false;
                    }
					else {
                        return true;
                    }
				}else {
				    return false;
				}
			},
			basicContent:function(value,element){return /^[0-9a-zA-Z\u4E00-\u9FA5\s\-:\+=;_#@\?\*,&\\\.\/]{0,}$/g.test(value);},
			isModify:function(value,element){
				var $orign=$(element).next("input:hidden");
				var orginValue="";
				if($orign&&$orign.get(0)){
					orginValue=$orign.val();
				}
				if(value===orginValue) {
					return false;
				} else {
				  return true;
				}
			},
			XSSDefend:function(value,element){
				var XSSDefendCheck=/^(.*\s*)(([\\'"\)]{1,})|(\s*script\s*)|(\s*embed\s*)|(<\s*style\s*)|(<\s*img\s*)|(<\s*image\s*)|(<\s*frame\s*)|(\s*object\s*)|(\s*iframe\s*)|(\s*frameset\s*)|(<\s*meta\s*)|(<\s*xml\s*)|(\s*applet\s*)|(\s*link\s*)|(\s*onload\s*)|(\s*alert\s*\())(.*\s*)$/gmi.test(value);
				if(XSSDefendCheck){
					return false;
				}else {
					return true;
				}
			}
		};
		if(settings.extendRules&& typeof settings.extendRules.validateMetheds!=="undefined"){
			$.extend(true,validateMethods,settings.extendRules.validateMetheds);
		}
		if(settings.extendRules&& typeof settings.extendRules.validateMethods!=="undefined"){
			$.extend(true,validateMethods,settings.extendRules.validateMethods);
		}
		if(isLabel){//弹框与否，错误提示的内容不一致，因为弹框需要告诉用户具体错误的位置，不是弹框在后面显示即可
		  var  labelMessages={
			 required: "必填",
			 date: "请输入合法的日期yyyy-mm-dd(在当前年份前后20年之内)",
			 allDate: "请输入合法的日期yyyy-mm-dd",//马驰添加，用于allDate的错误提示，提示其实和date是一样的
			 time:"请输入有效的时间",
			 alphanumericspace:"请输入字母、数字和空格的组合(半角)",
			 alphanumeric: "请输入字母和数字的组合(半角)",
			 digital: "只能输入正整数及0(半角)",
			 mathDigital:"允许输入数字小数点和+-号(半角)",
			 positiveInteger:"只能输入正整数(半角)",
			 number: "请输入合法的数字(半角)",
			 letter:"只能输入字母(半角)",
			 air:"请输入正确的航空公司二字码",
			 strictFltnum:"请输入正确航班号，必须含航空公司代码",
			 fltnum:"请输入正确的航班号，可不含航空公司代码",
			 citycode:"请输入正确的三字码",
			 segment:"请输入正确的航段或城市对",
			 subclass:"请输入正确的舱位",
			 email: "请输入正确格式的电子邮件",
			 ip:"请输入正确的IP,如某段两位及以上则该段不能以0开头(半角)",
			 url: "请输入合法的网址",
			 port:"端口为1-65535的数字(半角)",
			 greaterEqual:"\"{0}\"应该大于等于\"{1}\"",
			 greater:"\"{0}\"应该大于\"{1}\"",
			 equal:"\"{0}\"应该等于\"{1}\"",
			 notEqual:"\"{0}\"应该不等于\"{1}\"",
			 basicInput:"允许值为,.?#@*-_:/中英数字空格(半角)",
			 office:"前面3位字母后面3位数字(半角)",
			 EQT:"机型要求3位字母和数字组合(半角)",
			 PNRNbr:"PNR编码要求6位字母和数字组合(半角)",
			 eTermUser:"需2-15位，允许输入英(大小写) 和数字(半角)",
			 eTermPwd:"需1-20位",
			 personName:"长度大于1且不能以/开始和结束,允许输入值为/中&nbsp;&nbsp;英(大小写)和/(半角)",
			 groupName: "团队名称必须是英文字母或/，大于等于两位，且不能以/开始和结束(半角)",
			 SSRRmk: "允许值为,./+-()?数字英文字母空格",
			 contact:"联系信息为英文字母、数字、空格、/或-",
			 SSROsi:"允许值为,./+-()?数字英文字母空格，只能字母开头",
			 SSROths:"允许值为,./+-()?数字英文字母空格",
			 paxName:"姓名为汉字、英文字母、/，长度不少于2位并且不能以/开始和结束(半角)",
			 childAge:"儿童年龄必须是2-12之间(包含2和12)的自然数(半角)",
			 basicContent:"允许值为,.?&#*+-_=:;@\/中英数字空格(半角)",
			 isModify:"没有任何修改",
			 XSSDefend:"不能含有script、object、iframe、link、applet和'\"\)等字符"
			};
		   if(settings.extendRules&& typeof settings.extendRules.labelMessages!=="undefined"){
				$.extend(true,labelMessages,settings.extendRules.labelMessages);
			}
		};//if结束
	   if(isDialog){//弹框与否，错误提示的内容不一致，因为弹框需要告诉用户具体错误的位置，不是弹框在后面显示即可
		  var  dialogMessages={//定义对象，不能属性加引号和不加引号混合写
			 required:"\"{0}\" 为必填项。",
			 date: "\"{0}\"请输入合法的日期yyyy-mm-dd(在当前年份前后20年之内)。",
			 time: "\"{0}\"请输入有效的时间。",
			 digital:"\"{0}\"只能输入正整数及0(半角)。",
			 mathDigital:"\"{0}\"允许输入数字小数点和+-号(半角)。",
			 positiveInteger:"\"{0}\"只能输入正整数(半角)。",
			 letter:"\"{0}\" 只能输入字母(半角)。",
			 alphanumeric:"\"{0}\" 请输入字母和数字的组合(半角)。",
			 alphanumericspace:"\"{0}\"请输入字母、数字和空格的组合(半角)。",
			 air:"\"{0}\"请输入正确的航空公司二字码。",
			 strictFltnum:"\"{0}\"请输入正确航班号，必须含航空公司代码。",
			 fltnum:"\"{0}\"请输入正确的航班号，可不含航空公司代码。",
			 citycode:"\"{0}\"请输入正确的三字码。",
			 segment:"\"{0}\"请输入正确的航段或城市对。",
			 subclass:"\"{0}\"请输入正确的舱位。",
			 email: "\"{0}\"请输入正确的格式。",
			 ip:"\"{0}\"请输入正确的IP,如某段两位及以上则该段不能以0开头(半角)。",
			 url: "\"{0}\"请输入合法的网址。",
			 port:"\"{0}\"端口为1-65535的数字(半角)",
			 greaterEqual:"\"{0}\"应该大于等于\"{1}\"。",
			 greater:"\"{0}\"应该大于\"{1}\"",
			 equal:"\"{0}\"应该等于\"{1}\"。",
			 notEqual:"\"{0}\"应该不等于\"{1}\"。",
			 basicInput:"\"{0}\"允许值为,.?#@*-:/中英数字空格(半角)。",
			 office:"\"{0}\"前面3位字母后面3位数字(半角)。",
			 EQT:"\"{0}\"机型要求3位字母和数字组合(半角)。",
			 PNRNbr:"\"{0}\"PNR编码要求6位字母和数字组合(半角)。",
			 eTermUser:"\"{0}\"需2-15位，允许输入英(大小写)&nbsp;_$&nbsp;和数字(半角)。",
			 eTermPwd:"\"{0}\"需1-20位。",
			 personName:"\"{0}\"长度大于2且不能以/开始和结束,允许输入值为/中&nbsp;&nbsp;英(大小写)和/(半角)。",
			 groupName: "\"{0}\"必须是英文字母或/，大于等于两位，且不能以/开始和结束(半角)。",
			 SSRRmk: "\"{0}\"允许值为,./+-()?数字英文字母空格。",
			 contact: "\"{0}\"联系信息为英文字母、数字、空格、/或-。",
			 SSROsi:"\"{0}\"允许值为,./+-()?数字英文字母空格，只能字母开头。",
			 SSROths:"\"{0}\"允许值为,./+-()?数字英文字母空格。",
			 paxName:"\"{0}\"姓名为汉字、英文字母、/，长度不少于2位并且不能以/开始和结束。",
			 childAge:"\"{0}\"儿童年龄必须是2-12之间(包含2和12)的自然数(半角)。",
			 basicContent:"\"{0}\"允许值为,.?&#*+-_=:;@\/中英数字空格(半角)",
			 isModify:"\"{0}\"没有任何修改",
			 XSSDefend:"\"{0}\"不能含有script、object、iframe、link、applet和'“\)等字符"
			};
		if(settings.extendRules&& typeof settings.extendRules.dialogMessages!=="undefined"){
				$.extend(true,dialogMessages,settings.extendRules.dialogMessages);
			}
		};//if结束
		//初始化结束
		//取得所有的elements,是jquery对象
		var	elements=function() {
			return $(currentForm).find("input, select, textarea").not(":submit, :reset, :image,:button")
				.not( settings.ignore );
			};
		 //取得class上的属性值
		var classRules=function(element) {
			var rules = {};
			var classes = $(element).attr('class');
			classes && $.each(classes.split(' '), function() {
				if (this in  classRuleSettings) {//这里的this是each的对象
					$.extend(rules,classRuleSettings[this]);
				}
			});
			return rules;
		};
		//判断日期是否合法
		var  isLegalDate=function(datavalue,noTimeLimit){
		   var date = datavalue;
		   if( !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)){
			  return false;
			}
		   var result = true;
		   var curYear = (new Date().getFullYear() - 0);
		   var ymd = date.split(/-/);
		   var year = ymd[0] - 0;
		   var month = ymd[1] - 0;
		   var day = ymd[2] - 0;
			/* month-day relation, January begins from index 1 */
		   var mdr = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		   var isLeapYear = function(){
			  // 判断年份是否是闰年
			  return (year % 400 === 0) || ((year % 4 === 0) && (year % 100 !== 0));
			};
		   if(!noTimeLimit&&(year < curYear - 20 || year > curYear + 20)){
			// 年份超过前后20年，则校验失败
			result = false;
			}
		   if(month > 12 || month < 1){
			// 如果月份不合法，则校验失败
			result = false;
		   }
		  if(mdr[month] < day || day < 1 || day > 31){
			// 日期天数不合法，校验失败
			result = false;
		   }
		  if(month === 2 && !isLeapYear() && day > 28){
			// 年份不是闰年，日期天数不合法，校验失败
			result = false;
		   }
		  return result;
	   };
		//处理前缀需要先验证的规则，返回一个对象。目前三种trimAll、trim、upper、trim0
		//trim0是删掉前面的0
	   var processPerfixRule=function(rule,prefixRules,element,event){
			var value=$(element).val(); //实时的取得value
			if(typeof prefixRules[rule]!==undefined){
				prefixRules[rule]=true;
				if(event){
				  var type=event.type;
				  var code=event.keyCode;
				  if(rule==='trimAll'&&event&&type==="keyup"){
					 value=value.replace(/\s{1,}/g, "");
					 //machi 20150205 在chrome下，上下左右箭头不能在input上生效
					 if (code !== 37 && code !== 38 && code !== 39 && code !== 40){
					 	$(element).val(value);
					 }
				   } else if(rule==='trim'&&event&&(type==="change"||type==="focusout")){
					 value=$.trim(value);
					 $(element).val(value);
				   }else  if(rule==='upper'&&event&&(type==="change"||type==="focusout")){
					 $(element).val(value.toUpperCase());
				   }else if(rule==='trim0'&&event&&type==="keyup"){
					 value=value.replace(/^0{1,}/g, "");
					 if (code !== 37 && code !== 38 && code !== 39 && code !== 40){
					 	$(element).val(value);
					 }
				   }else if(rule==="toRequired"&&event&&type==="focusin"&&value!==""){//用户有鼠标动作后，验证是否required
				   		prefixRules["required"]=true;
						$(element).addClass("tuiRequired");
				   }
				}else if(typeof event==="undefined"){
				  if(rule==='trimAll'){
					 value=value.replace(/\s{1,}/g, "");
					 $(element).val(value);
				   }else if(rule==='trim'){
					 value=$.trim(value);
					 $(element).val(value);
				   }else if(rule==='upper'){
					 $(element).val(value.toUpperCase());
				   }else if(rule==='trim0'){
					 value=value.replace(/^0{1,}/g, "");
					 $(element).val(value);
				   }
				}
			}
		   return prefixRules;
		};
		//一些特殊的验证，keyup和change验证规则不一样。citycode和air,主要是个数的影响，keyup时，超过个数限制后才提示,此处仅验证keyup的情况
		var  processEventDiffRule=function(rule,element,event){
			var value=$(element).val(); //实时的取得value
			var result=null;//如果没有就返回null
			if(rule==='citycode'&&event&&event.type==="keyup"){
				result=validateMethods["citycodeKeyUp"](value,element);
			}else if(rule==='air'&&event&&event.type==="keyup"){
				result=validateMethods["airKeyUp"](value,element);
			}else if(rule==='fltnum'&&event&&event.type==="keyup"){
				result=validateMethods["fltnumKeyUp"](value,element);
				if(value.length>7){
					result=false;
				}
			}
			return result;
		};
		//清除label。这块有一个问题，就是input在外面与其他的input不同级时，$(element).parent().find能找到并删除其他的
		var clearLabelError=function(element){
			if (typeof $(element).siblings().filter("input."+errorClass)[0]!=="object"){//清除label,因为有的时候一行有多个input框，如果有就不清空。
				//$(element).parent().find(settings.errorElement).remove();
				//$(element).parent().find("."+arrowIcon).remove();
				$(element).siblings().filter(settings.errorElement).remove();
				$(element).siblings().filter("."+arrowIcon).remove();
			}
		};
		//清除全部错误提示
		var clearElementError=function(element,isCheckbox){//清除element上的class
			$(element).removeClass(errorClass).removeClass(settings.infoClass);
			if(isCheckbox){//checkbox情况下无论是否如何都要清掉label
				 $(element).siblings().filter(settings.errorElement).remove();
				 if($(element).parent().filter("span").length){
					 var $checkable= findByName(element.name);
					 if($checkable){
						 $checkable.unwrap();
					 }
				  }
			}
			//clearLabelError(element);//2013-1-28删除，这句话会导致每次验证时都删掉label
			if(isTip&&isLabel&&$tipArea.get(0)){
				$tipArea.hide();//2013-1-31隐藏提示
			}
		};
		//显示错误信息，不是弹框的，就在element后面显示
		var showLabel=function(element, message,tipClass,event) {//element是input框
			var errorEle=settings.errorElement;
			var isLabelError=settings.isLabelError;//12-26添加
			//isErrorDown
			var isError=false;
			if(errorClass&&errorIcon&&errorClass===tipClass){
				isError=true;
			}
			if(!isLabelError&&errorClass===tipClass){//不显示error的情况
				clearLabelError(element);
				return;//返回不执行下面
			}
			var $label = $(element).parent().find(errorEle);//取值
			var showLabelDown=function(){//提示在下面显示
				var inputPosition=$(element).position();
				var belowTipLeft=inputPosition.left;
				var belowTipTop=inputPosition.top+$(element).innerHeight()+9;
				var $arrow=$(element).parent().find("."+arrowIcon);
				if(!$arrow||!$arrow.length){
					$arrow=$("<div class='"+arrowIcon+"' style='position:absolute;z-index:11;'></div>");
					$(element).parent().append($arrow);
				}
				$arrow.css({left:parseInt(belowTipLeft+15)+"px",top:parseInt(belowTipTop-6)+"px",margin:0});
				$label.removeClass(errorClass).addClass(infoClass);//下面的都是提示的class因为上面的箭头
				//进行转换，因为箭头问题
				$label.css({left:belowTipLeft+"px",top:belowTipTop+"px",margin:0});
			};
			var clearLabelDown=function(){//清掉下面显示的那些属性
				$(element).parent().find("."+arrowIcon).remove();
				$label.css({left:"",top:"",margin:""});
			};
			if ($label.length ) {//如果存在
				// refresh error/success class
				$label.removeClass().addClass(tipClass);
				$label.html("");
				// check if we have a generated label, replace the message then
				$label.attr("generated") && $label.append(message);
				if(isError){
					$label.prepend('<span class="'+errorIcon+'" style="margin:-1px 6px 0 0;"></span>');
				}
				//$(element).parent().append($label);//因为已经存在了，索引不需要再写信息
			}else{
				// create label
				$label = $("<" + errorEle + " style='position:absolute;z-index:10;width:auto;height:auto;'/>")
					.attr({"for":  idOrName(element), generated: true})
					.addClass(tipClass).html(message || "");
				if(isError){
					$label.prepend('<span class="'+errorIcon+'" style="margin:-1px 6px 0 0;"></span>');	
				}
				$(element).parent().append($label);//写在最后面
			}
			if(!isError&&isLabelDown){//控制提示在下面显示
				showLabelDown();
			}else if(isError&&isErrorDown){//控制错误在下面显示
				showLabelDown();
			}else if(!isLabelDown||!isErrorDown){
				clearLabelDown();
			}
		};
		/*工具类开始*/
		var idOrName=function(element) {
			return  (checkable(element) ? element.name : element.id || element.name);
		};
		var	checkable=function( element ) {
			return /radio|checkbox/i.test(element.type);
		};
		var findByName=function( name ) {
			if(!name) {
				return null;
			}
			// select by name and filter by form for performance over form.find("[name=...]")
			return $(document.getElementsByName(name)).map(function(index, element) {
					return  element.name === name && element  || null;
				});
		};
		var	resetForm=function() {
			$(currentForm).find("input, select, textarea")
				.not(":submit, :reset, :image, [disabled],:button").removeClass( settings.errorClass );
		};
		//清除掉所有错误,20130528
		var clearAllErrors=function($allElements){
			$allElements.each(function(index){//遍历元素，然后去掉加的的提示
			    clearLabelError(this);
				clearElementError(this,checkable(this));
		   });//each方法结束
		};
			//判断slect和checkbox radio长度的
		var	getLength=function(value, element) {
			switch( element.nodeName.toLowerCase() ) {
				case 'select':
					return $("option:selected", element).length;
				case 'input':
					if( checkable( element) ){
						var $checkable= findByName(element.name);
						if(!$checkable){
							return -1;
						}
						var checkableLength=$checkable.filter(':checked').length;
						return checkableLength;
				}
				default:
					break;
			}
			return value.length;
		};
	   //获取错误信息
	   var getErrorMsg = function(){
			if(arguments.length === 0)// 如果没有参数，则返回空字符串
				{return "" ;}
			var template = arguments[0];//第一个值是message,后面是替换{}里面的内容
			var args = template.match(/\{[0-9]{1,}\}/g);//match返回一个数组
			for(var ii = 0, length = args.length; ii < length; ii ++) {
			   template = template.replace(args[ii], arguments[ii + 1]);
			}
			return template;
	   };
	   //20130719修改，将大于等于 等于 不等于合并一个方法 20130928增加大于
	   var allEqualTypeCheck = function(othId,ownId,tipClass,type,element,eve){
			//先清除 tipClass; own>oth
			var $oth=$("#"+othId),$own=$("#"+ownId),result = "",othVal = $oth.val(),ownVal = $own.val(), numOwnVal = "",numOthVal = "";
			//20131030,如果2个输入都是必填则应该，无论如何都验证，如果有一个不是必填，则不验证
			if($oth.hasClass("tuiRequired")&&$own.hasClass("tuiRequired")){
				if(ownVal===""&&othVal===""){//20131017  ||改成&&
				//20131017 取消如果需要比较多两项有一个没有输入，则不需要验证
					return "";
				}
			}else if(!ownVal ||!othVal){
				//如果需要比较多两项有一个没有输入，则不需要验证
				return "";
			}
			//获得错误提示
			var getMsg=function(){
				var msg="",ownErrorInfo=$("#"+ownId).attr(dialogTip);//错误的提示
				var othErrorInfo=$("#"+othId).attr(dialogTip);//错误的提示
				if(isDialog){
					msg=getErrorMsg(dialogMessages[type]+"</br>",ownErrorInfo,othErrorInfo);
				}
				else {
					msg=getErrorMsg(labelMessages[type],ownErrorInfo,othErrorInfo);
				}
				return msg;
			};
			$own.removeClass(tipClass);
			$oth.removeClass(tipClass);
			//大于等于
			if(type==="greaterEqual"){//  //验证大于和等于的方法,label显示的时候，当第二个id的element 被选中的时候触发该函数，传入需要比较的2个id，后面的id大于等于前面
				// 将年月或时间中间的间隔符去掉，都弄成纯数字形式，以便比较大小
				numOwnVal = ownVal.replace(/[-: ]/g, "");
				numOwnVal = numOwnVal.replace(/[a-zA-Z]/g, "");
				numOthVal = othVal.replace(/[-: ]/g, "");
				numOthVal = numOthVal.replace(/[a-zA-Z]/g, "");
				if(numOwnVal - numOthVal < 0){  
					result=getMsg();
				}
			}else if(type==="equal"){
				if(ownVal!==othVal){
					result=getMsg();
				}
			}else if(type==="notEqual"){
				if(ownVal===othVal){
					result=getMsg();
				}
			}else if(type==="greater"){//后面输入的大于前面的
				numOwnVal = ownVal.replace(/[-: ]/g, "");
				numOwnVal = numOwnVal.replace(/[a-zA-Z]/g, "");
				numOthVal = othVal.replace(/[-: ]/g, "");
				numOthVal = numOthVal.replace(/[a-zA-Z]/g, "");
				if(numOwnVal - numOthVal <=0){
					result=getMsg();
				}
			}
			if(!eve){
				eve=null;
			}
			if(result===""){
				if(element&&element.id!==$oth.get(0).id){
					var othEle=$oth.get(0);
					clearElementError(othEle,false);
					clearLabelError(othEle);
					check(othEle,errorClass,eve,true);
				}else if(element&&element.id!==$own.get(0).id){
					var ownEle=$own.get(0);
					clearElementError(ownEle,false);
					clearLabelError(ownEle);
					check(ownEle,errorClass,eve,true);
				}	
			}
			return result;
		};
		//执行扩展的必选验证，数组里的要不全都选，要不全都不选。20130917，label下也能显示
		var extendRequired=function(currendId,_isDialog){
			//var extendRequireds=extendRequiredArray;
			var requiredFunc=validateMethods["required"];
			var diagMsg="";
			//执行label的验证
			var labelRequired=function(currendCheckId,requiredIdsGroup){
				var requiredIdsGroupLengthLabel=requiredIdsGroup.length,message="",isErrorFlag=false,theLastResult="";
				for(var j=0;j<requiredIdsGroupLengthLabel;j++){
					var curRequiredId=requiredIdsGroup[j];
					var $required=$("#"+curRequiredId);
					if(j===requiredIdsGroupLengthLabel-1){//最后一个
						message+='\"'+$required.attr(dialogTip)+"\"必须同时填写。";
					}else {message+='\"'+$required.attr(dialogTip)+"\"、";}
					if(!isErrorFlag){
						result=requiredFunc($required.val(),$required.get(0));
						if(j===0){//theLastResult在循环的第一次时，为“”，因此如果result为true，那就错了。
							theLastResult=result;
						}
					}
					if(theLastResult!==result){
						isErrorFlag=true;
					}
					theLastResult=result;
				}
				if(!isErrorFlag){
					message="";
				}
				return message;
			};
			for(var i=0; i<extendRequiredArray.length;i++){
				var requiredIdsGroup=extendRequiredArray[i];
				var result="";
				var lastResult="";
			    var isErrFlag=false;
				var msg="";
				var requiredIdsGroupLength=requiredIdsGroup.length;
				for(var jj=0;jj<requiredIdsGroupLength;jj++){
					var requiredId=requiredIdsGroup[jj];
					var $required=$("#"+requiredId);
					if(!_isDialog&&currendId&&currendId===requiredId){//20130917,支持label方式
					    //如果发现有，则把其他的都找到，进行比较
						msg=labelRequired(currendId,requiredIdsGroup);
						return msg;
					}else if(_isDialog){
						if(jj===requiredIdsGroupLength-1){
							msg+='\"'+$required.attr(dialogTip)+"\"必须同时填写。";
						}else {msg+='\"'+$required.attr(dialogTip)+"\"、";}
						if(!isErrFlag){
							result=requiredFunc($required.val(),$required.get(0));
							if(jj===0){//lastResult在循环的第一次时，为“”，因此如果result为true，那就错了。
								lastResult=result;
							}
						}
						//if(lastResult&&lastResult!=result){//bug，在j=0时，lastResult为空，无法进入if
						if(lastResult!==result){
							isErrFlag=true;
						}
						lastResult=result;
					}
				}//for
				if(_isDialog&&isErrFlag){
					msg+="</br>";
				}else if(_isDialog&&!isErrFlag){
					msg="";
				}
				diagMsg+=msg;
			}//for
			return diagMsg;
		};
		//执行扩展的必选结束
		//20130408 findByName仅找到具体的元素，如是checkbox和radio后面有说明，这仅仅找到checkbox,后面的说明不能包裹
		//现在要求后面的说明用span包裹，同时命名name保持一致
		var findAllByName=function(name){
			if(!name){
				return null;
			}
				//select by name and filter by form for performance over form.find("[name=...]")
				//ie下getElementsByName有问题
			return $(currentForm).find("[name="+name+"]");
			//$(document.getElementsByName(name));
		};
	   //针对checkbox的情况写的显示，就是要把name一样的checkbox或者radio括上红框
		var showCheckboxError=function(element,errorClass){
		   var $checkable=findAllByName(element.name);
		   $checkable.wrapAll("<span class="+errorClass+"></span>");
		};
		//排除不需要进行验证的id,如果在这返回true
		var isInExcludeIds=function(element){
			if(excludeIds===null) {
				 return false;
		    }
			if(excludeIdsObject&&excludeIdsObject[element.id]){
				return true;
			}else {
				return false;
			}
		};
		//需要进行验证的id,如果在这返回true
		var isIncludeIds=function(element){
			if(includeIds!==null&&includeIdsObject&&includeIdsObject[element.id]){
				return true;
			}else {
				return false;
			}
		};
		/*工具类结束*/
		/**主方法开始，取得到页面上的值，然后验证,只有在dialog时使用**/
	   var checkPrefixRules=function(element,errorClassCheck,event){//这个仅仅是dialog情况绑定大小写转换、trim等用，为了事件
		   var prefixRules={trimAll:false,trim:false,upper:false,trim0:false,toRequired:false};
		   var rules=classRules(element);
		   for (var rule in rules){
			   if(rules.hasOwnProperty(rule)){
			      prefixRules=processPerfixRule(rule,prefixRules,element,event);
			   }
		   }
		};
		//主验证方法,以label的方式显示错误,20130719 增加isNotExecEquals，不执行那些等于的验证，否则循环调用
		var check=function(element,tipClass,event,isNotExecEquals,isExecExtendRequired){
			if (isInExcludeIds(element)) {
				return true;
			}
			if(includeIds!==null&&!isIncludeIds(element)){
                return true;
            }
		   	var isCheckbox=false;//radio和checkbox单独处理，这2个主要是必填的验证。其他的验证也没有
		   	if(checkable(element)) {
				isCheckbox = true;
			}
		   	var prefixRules={required:false,trimAll:false,trim:false,upper:false,trim0:false,toRequired:false};
		   	var result=true;
		   	var rules=classRules(element);
		   	var labelErrorMessages="";//不能定义全局的，因为就在后面显示
		   	var dialogErrorMessage="";//没有s,这个不是全局的
			for (var rule in rules){//rule是规则名称，this是当前的element,greaterEqualCheck的规则不是通过class找到的，需要单独判断
				prefixRules=processPerfixRule(rule,prefixRules,element,event);//需要在前面验证的规则，目前有trim\upper\required\trim0
				//20130415将规则转换为required
				if(rule==="toRequired"&&prefixRules["toRequired"]&&prefixRules["required"]){
					rule="required";
					rules["required"]=true;
				}
				var value=$(element).val(); //实时的取得value
				var dialogErrorInfo=$(element).attr(dialogTip);//弹框错误的提示
				//开始执行验证，一些特殊的验证不使用这个逻辑，如fltNum、citycode和air要求keyup和change是不一样
				var diffRuleResult=processEventDiffRule(rule,element,event);
				if(diffRuleResult!==null){
				 	result=diffRuleResult;
					if(result===false&&isLabel){//label显示
						labelErrorMessages+=labelMessages[rule]+"，";
					}
					if(result===false&&isDialog){//弹框显示
						dialogErrorMessage+=getErrorMsg(dialogMessages[rule],dialogErrorInfo)+"</br>";
					}
				}else if(rules[rule]===true&&typeof validateMethods[rule]==="function"){
					result=validateMethods[rule](value,element);
					if(result===false&&isLabel){//label显示
						labelErrorMessages+=labelMessages[rule]+"，";
					}
					if(result===false&&isDialog){//弹框显示
						dialogErrorMessage+=getErrorMsg(dialogMessages[rule],dialogErrorInfo)+"</br>";
					}
				}
				if(result===false&&prefixRules['required']){ //如果是必填，规则不正确，就不在进行继续的循环判断。
					break;
				}
			}//for循环结束
		//验证全部都选择和全部都不选择，20130917打开
			if(isLabel&&isExecExtendRequired&&extendRequiredArray&&typeof extendRequired==="function"){
				var extendRequiredMsg=extendRequired(element.id,false);
				labelErrorMessages+=extendRequiredMsg;
			}
			//20131017放到上面， 20130418与下面的extend位置对调，因为extend里可能验证必填，这里会清空
		     if(prefixRules['required']===false&&!isCheckbox){//不是必填项，则当值为空时，不出现错误。checkbox没有不需要验证
				var valueTemp=$(element).val();
				if(!validateMethods.required(valueTemp,element)){
					labelErrorMessages="";
					dialogErrorMessage="";
					if(extendRequiredMsg){//20130918验证同时必填,需要提示同时必填
						labelErrorMessages=extendRequiredMsg;
					}
				}
			  }
		//判断greaterEqual和equal等  20130719改为使用allEqualTypeCheck
			if(!isNotExecEquals){//20130719 无论如何都进行验证 取消已经有错了，不再进行greaterEqual验证
			 	var greaterEqualObject=settings.greaterEqual,equalObject=settings.equal,notEqualObject=settings.notEqual,greaterObject=settings.greater,ownId="",othId="",isLowidCheck=false;
				var setErrorMsg=function(type){
					var errMsg=allEqualTypeCheck(othId,ownId,tipClass,type,element,event);//ownId>=othId
					if(isLabel&&errMsg!==""){
					  labelErrorMessages+=errMsg+"，";
					}
					if(isDialog&&errMsg!==""){
					   dialogErrorMessage+=errMsg+"</br>";
					}
				};
				if(greaterEqualObject!==""&&typeof greaterEqualObject==="object"){
					for (ownId in greaterEqualObject){
						if (greaterEqualObject.hasOwnProperty(ownId)) {
							isLowidCheck=false;//只有在label下，值比较小的id才检查
							othId=greaterEqualObject[ownId];
							if(isLabel&&othId===$(element).get(0).id){
							   isLowidCheck=true;
							}
							if(ownId===$(element).get(0).id||isLowidCheck){//所有的都需要验证id
							   setErrorMsg("greaterEqual");
							}
						}//if结束
					}//for结束
				}//大于等于结束
				if(greaterObject&&greaterObject!==""&&typeof greaterObject==="object"){
					for (ownId in greaterObject){
						if (greaterObject.hasOwnProperty(ownId)) {
							isLowidCheck=false;//只有在label下，值比较小的id才检查
							othId=greaterObject[ownId];
							if(isLabel&&othId===$(element).get(0).id){//label时2个id都需要验证
							   isLowidCheck=true;
							}
							if(ownId===$(element).get(0).id||isLowidCheck){//所有的都需要验证id
							   setErrorMsg("greater");
							}
						}//if结束
					}//for结束
				}//大于结束
				if(notEqualObject!==""&&typeof notEqualObject==="object"){//大于等于验证结束
					for (ownId in notEqualObject){
						if(notEqualObject.hasOwnProperty(ownId)){
							othId = notEqualObject[ownId];
							if(ownId===$(element).get(0).id||othId===$(element).get(0).id){//所有的都需要验证id
								setErrorMsg("notEqual");
							}
						}
					}//for结束   
				}//不等于验证结束
				//等于验证开始
				if(equalObject!==""&&typeof equalObject==="object"){//大于等于验证结束
					for ( ownId in equalObject ){
						if(equalObject.hasOwnProperty(ownId)){
							othId = equalObject[ownId];
							if(ownId===$(element).get(0).id||othId===$(element).get(0).id){//所有的都需要验证id
								setErrorMsg("equal");
							}
						}
					}//for结束
				}//等于验证结束
			 }//if结束
			//执行extend的操作，只在label的情况下执行，dialog的执行在提交按钮时判断
			  if(isLabel&&settings.extend&&typeof settings.extend==="object"){//判断里面是不是数组
			  	var  extendFunctions = settings.extend;
				for(var extendLabelId in extendFunctions){
				   if(extendFunctions.hasOwnProperty(extendLabelId)&&$(element).get(0).id===extendLabelId){
					  var msg = extendFunctions[extendLabelId].call();
					  if(msg&&msg.labelMessages&&msg.labelMessages !== ""){
						  labelErrorMessages+=msg.labelMessages+"，";
					  }
				   }
				}//for循环结束
			 }//extend验证介绍
			 dialogErrorMessages+=dialogErrorMessage;
			 clearElementError(element,isCheckbox);//清除掉错误提示，弹框也需要清除,他也决定是否清除label上的提示
			 if(isLabel&&labelErrorMessages!==""){ //label的错误提示
				labelErrorMessages= labelErrorMessages.replace(/，$/,"");
				if(isCheckbox){//如果是checkbox需要显示
					showCheckboxError(element,tipClass);
				}else {
					$(element).addClass(tipClass);//20130609加到else里面
				}
			    showLabel(element,labelErrorMessages,tipClass,event);//显示错误信息
				labelErrorMessages="";
				dialogErrorMessage="";
				return false;
			 }else if(isDialog&&dialogErrorMessage!==""){//判断没有s是否为空来确定是否有错误
				if(isCheckbox){//如果是checkbox需要显示
					showCheckboxError(element,tipClass);
				}
				$(element).addClass(tipClass);
				dialogErrorMessage="";
				return false;
			 }else {
				clearLabelError(element);
			 	return true;
			 }
		};//check结束
		var extendCheck = function(){
			var msg=[];
			var extendFunctions = settings.extend;
		  	for(var extendLabelId in extendFunctions){
                if(extendFunctions.hasOwnProperty(extendLabelId)){
                    msg.push( extendFunctions[extendLabelId].call());
                }
		  	}
		  	if(msg.length>0)
				{return msg;}
		 	else {
				return "";
			}
		};
	   //函数执行主体开始
		var $elements=elements(),submitId=settings.submitId;
		resetForm();//清除错误信息
		//0130528,如果仅仅清空错误，则下面的不需要执行
		if(settings.isClearError){//按钮直接调用，不再绑定事件
			clearAllErrors($elements);
			return ;
		}
		if(isLabel){//label的处理，绑定事件
			$elements.each(function(index){//页面一加载就执行，给每个input等绑定事件，label的时候执行  focusout的事件与change事件冲突
			    validateDelegate(":text,:password,:file,textarea", "keyup.tuiValidator focusin.tuiValidator",check,this,infoClass);
				validateDelegate(":text,:password,:file,select,textarea", "focusout.tuiValidator change.tuiValidator",check,this,errorClass);
				validateDelegate(":radio,:checkbox", "click.tuiValidator",check,this,errorClass);
		   });//each方法结束
		}//if label结束
		if(isDialog&&!isLabel){//dialog的处理,这种绑定事件，目前仅仅是upper,trim,trimall绑定
		   $elements.each(function(index){//页面一加载就执行，给每个input等绑定事件，label的时候执行  focusout的事件与change事件冲突
			   validateDelegate(":text, :password, :file, select, textarea", "focusout.tuiValidator change.tuiValidator",checkPrefixRules,this,errorClass);
		   });//each方法结束
		}//if label结束
		//事件代理方法开始 1,html类型2，事件类型 3，验证的函数名 4，需要验证对象 5，错误提示的css
		function validateDelegate(inputType, eventtype,handler,element,tipClass) {
				 $(element).off(eventtype).on(eventtype+" tuiValidator", function(event) {
			//event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡,会导致on \off等靠冒泡绑定事件的方法失效
			//event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValu。checkbox会使用不了
				var target = $(event.target);
				if (target.is(inputType)) {
						//return handler.call(target,element,errorClass);//20120428删除，如果返回页面false,会导致checkbox取消不了选择
					  handler.call(target,element,tipClass,event);
					}
				});
		}//事件代理方法结束
		//按钮执行提交开始
		var submitHandler=settings.submitHandler;
		if (settings.onsubmit&&submitHandler){
		   if(isClick){//鼠标点击提交按钮，进行检查并提交。不需要再绑定事件了。
				if(validateSubmit($elements)){
				  submitHandler.call(currentForm, $(currentForm));//将当前的form赋值给传递进的函数,这里的this指的是那个按钮
				}
			}else if( document.getElementById(submitId)&&typeof document.getElementById(submitId)==="object"){
				 $("#"+submitId).off("click.tuiValidator").on("click.tuiValidator",function (event) {
				 //event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡,,会导致on \off等靠冒泡绑定事件的方法失效
				 event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue
				 //在执行提交之前，需要执行验证操作
				 if(validateSubmit($elements)){
					submitHandler.call( currentForm, $(currentForm));//将当前的form赋值给传递进的函数,这里的this指的是那个按钮
				  }});
			}else{
				 this.find("input, button").filter(":submit").off("click.tuiValidator").on("click.tuiValidator",function(event) {//this是form表单的jquery对象
				// event.stopPropagation?event.stopPropagation():event.cancelBubble = true;//防止冒泡,,会导致on \off等靠冒泡绑定事件的方法失效
				 	event.preventDefault?event.preventDefault():event.returnValue=false;//防止浏览器默认行为，在IE下，为returnValue
				 	if(validateSubmit($elements)){
						submitHandler.call( currentForm, $(currentForm));
					}//将当前的form赋值给传递进的函数,这里的this指的是那个按钮
				 });
			}
		}//按钮执行提交结束
		//按钮等触发检查的方法开始
		function validateSubmit($elements){
			var disabledAttr=settings.disabledAttr;
			var btnAttr=$("#"+submitId).attr(disabledAttr);
			if(btnAttr&&btnAttr==="true"){
				return false;
			}
			var result=true;
			dialogErrorMessages="";//验证之前，清除信息
			$elements.each(function(index){//再次执行验证
				if(!check(this,settings.errorClass,null,null,true)){//最后的true执行extendRequired
					result=false;
				}
			});//each结束
			//执行extend里面的扩展函数
			var extend=settings.extend;
			if(isDialog&&extend&&extend!==""&&typeof extend==="object"){//判断里面是不是数组
				  var extendMsg=extendCheck();//执行extend检查
				  for(var ii=0;ii<extendMsg.length;ii++){
				  if(extendMsg[ii]&&extendMsg[ii].dialogMessages&&extendMsg[ii].dialogMessages!==""){
					result=false;
					dialogErrorMessages+=extendMsg[ii].dialogMessages+"<br>";
				  }
				 }
			}
			//执行验证扩展的必填，要么都有 要么都没有
			if(isDialog&&extendRequiredArray&&typeof extendRequired==="function"){
				  dialogErrorMessages+=extendRequired(null,true);
				  if(dialogErrorMessages!==""){
					 result=false;
				   }  
			}//if结束
			//执行extendSubmit
			var extendSubmit=settings.extendSubmit;
			if(extendSubmit&&extendSubmit!==""&&Object.prototype.toString.call(extendSubmit) ==="[object Array]"){
				for(var i=0;i<extendSubmit.length;i++){
					var returnValue=extendSubmit[i].call();
					if(Object.prototype.toString.call(returnValue)==="[object Boolean]"&&!returnValue){
						result=false;
					}
				}
			};
			if(isDialog&&!$dialogArea&&dialogErrorMessages!==""){//弹框显示,定义弹框方法
				if(typeof settings.dialogMethod==="function"){
					settings.dialogMethod.call(null,dialogErrorMessages);
				}else if(settings.dialogMethod===""&&typeof $.showTuiMessageAlert==="function"){
					$.showTuiMessageAlert(dialogErrorMessages, null,470, 200);
				}else if(settings.dialogMethod===""&&typeof $.showTsInfoDialog==="function"){
					top.window.$.showTsInfoDialog(dialogErrorMessages,470, 200);
				}else { alert(dialogErrorMessages);}
				dialogErrorMessages="";
			}else if(isDialog&&$dialogArea&&dialogErrorMessages!==""){
				dialogErrorMessages=dialogErrorMessages.replace(/。/g,"；");
				dialogErrorMessages=dialogErrorMessages.replace(/<br>/g,"");
				dialogErrorMessages=dialogErrorMessages.replace(/；$/g,"。");
				$dialogArea.empty();
				$dialogArea.append(dialogErrorMessages);
				dialogErrorMessages="";
			}
			//设置isTip，显示错误提示
			if(isTip&&!result&&isLabel&&$tipArea&&$tipArea.get(0)){
				var left=$(window).width()/2-110;
				$tipArea.css({left:left+"px"});
				$tipArea.html("");
				$tipArea.append(tipMsg);
				$tipArea.show();
			}//if isTip&&!result&&isLabel结束
			return result;
		}//按钮等触发检查的方法结束
    }//tuiValidator主方法结束
});//extend结束
})((jQuery));