/**                                                    
 * tuiDialog在GUI项目中，负责弹出提示信息等功能，从大类型上划分，分为窗口和消息提示框。每个类型中分为多个小的类型，具体请见$.tui.tuiDialogDefault方法说明。
 * 弹出框支持position:fixed样式，但是该样式在ie6中，效果同absolute，为保证ie6下有这个效果，将在ie6下的窗口position设定为absolute，并在window上绑定了scroll事件，进行重新计算
 * showTuiInfoDialog方法的回调函数是第四个参数，要与其他方法区分开                       
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.10.18         
 * @see                                                
 *	HISTORY                                            
 * 2012-3-29下午04:08:08 创建文件
 * 2012-3-30 更新版本 添加了标题栏的显示和标题栏中关闭按钮的实现，可以通过参数控制。
 * 2012-3-31 对关闭方法进行了修改，在关闭窗口后，窗口中的内容全部清空，可以节省资源。
 *  遮罩层宽度重新进行了修改，在IE6下，将减少22px，以避免出现不必要的滚动条
 *  修改弹出窗口位置方法，如果弹出框的top为负值，说明弹出框上边超出屏幕范围，这是不允许的。必须保证弹出框的上边框显示出来
 * 2012-4-01 修改了确定等按钮出发事件的顺序，先进行关闭，再进行onConfirm等回调函数
 *  修改了遮罩层宽度和高度适应的bug
 * 2012-4-09 版本更新，添加了键盘事件，对于confirm类型的窗口，支持enter和esc键的操作，其他窗口，enter和esc都将触发点击确定按钮的事件。
    现在可以通过enter和esc键来对窗口进行操作了。
 * 2012-4-13 修改了css样式中的所有class的名称，添加了tui前缀
 * 2012-4-13 版本更新，将tuiDrag分离出去。现在的该页面要在引用tui_Drag.js之后引用
 * 2012-4-23 版本更新，修正了在IE6下多次打开窗口，遮罩层不能正确覆盖select的问题
 * 2012-4-26 版本更新，修正一个缺陷，对于窗口中再显示窗口的情况，如果内部窗口的回调函数将外部窗口关闭，则会出现错误。修改后，将关闭窗口的方法优先于回调函数执行，
    在窗口关闭完之后执行回调。此外，关闭窗口时并不真的消除窗口中的内容，以便于回调函数中读取当前窗口中的数据。
 * 2012-5-08 版本更新，修正了因为调整浏览器窗口大小出现遮罩层不能完全覆盖页面的bug。
 * ************************************************
 * 2012-9-14 新版本更新，更换了命名空间，更名为tui。基本放弃了对IE6的维护
 * 2012-9-17 修改了默认参数的mode，增加style，使显示方式和显示样式分开。详情见参数配置
 * 2012-9-21 版本更新，修正了新版的样式中dialog高度错误
 * 2012-9-24 版本更新，宽度和高度添加了百分比设置与auto设置
 * 2012-9-27 版本更新，支持在窗口关闭后仍然执行关闭窗口中的任何代码。注，窗口关闭实际上时隐藏窗口，因此部分定位代码将不会得到正确执行。
 *  程序在打开新的窗口时，才被替换成新窗口内容
 * 2012-10-22 版本更新，新增了小型编辑窗口的方法。
 * 2012-10-23 版本更新，新增了用于div的小型窗口方法。
 * 2012-10-30 版本更新，修正了：第一个窗口可以拖动，第二个窗口不可拖动时的仍然可以拖动的错误。修正了直接调用修改参数方法时的错误
 * 2013-01-10 版本更新，删除了showTuiInfoDialog方法！全部由showTuiMessageDialog代替。
 *  添加了新的方法：showTuiTipDialog
 * 2013-01-14 版本更新，修正了waiting模式下双ID的bug，同时，修改了showTuiWaitingDialog的方法，该方法现在可以在无任何参数时正常显示。
 *  如果存在参数，将按照参数显示另一类窗口
 * 2013-01-25 版本更新，修正了waiting下的宽度和高度大小错误。修正了waiting之后再弹出其他窗口时拖拽的错误。
 *  修正了存在滚动条时显示位置的错误。
 * 2013-01-31 版本更新，修正了在用户指定top和left时，增加滚动条位置的bug
 * 2013-02-04 版本更新，增加了$.showTuiSmallWaitingDialog方法
 * 2013-02-05 版本更新，增加了$.showTuiHTMLDialog方法
 * 2013-03-04 版本更新，修正了在弹出错误窗口时，弹出的内容过多出现滚动条后，鼠标拖动滚动条时和拖拽事件冲突而造成的无法拖动滚动条问题。
 * 2013-04-08 版本更新，增加了$.showTuiModifyDialog方法。在style为text时，已经将id为dialog_info_panel容器加上溢出滚动条了。
 * 2013-05-17 版本更新，修改了在IE浏览器中遮罩层的宽度出现的偏差
 * 2013-05-30 修正了showTuiSmallEditDialog的参数错误。
 * 2013-06-17 版本更新，修改了showMask的调用顺序，现在遮罩层将在窗口弹出之后出现。并且修正IE下出现的滚动条导致的遮罩层大小错误。
 **************************************************/
// JavaScript Document
;(function($){
	$.tui=$.tui||{};//tui域名
	//关闭窗口的外部方法，为其他程序使用
	/*-------------------------------拓展方法，外部接口----------------------------------*/
	$.closeTuiWindow=function(){
		$.tui.closeTuiWindow();
	};
	//弹出带遮罩层的弹出框，extraOption是更多的配置，一般的配置在option中设定，其他的设置需要在extraOption中指定才能生效
	$.showTuiModalDialog=function(option,extraOption){
		$.tui.tuiDialog({
			url:option.url||'',
			width:option.width||500,
			height:option.height||400,
			title:option.title||'',
			mode:'window',
			style:'window'
		},extraOption);
	};
	//弹出不带遮罩层的弹出框，extraOption是更多的配置，一般的配置在option中设定，其他的设置需要在extraOption中指定才能生效
	$.showTuiDialog=function(option,extraOption){
		$.tui.tuiDialog({
			url:option.url||'',
			width:option.width||500,
			height:option.height||400,
			title:option.title||'',
			mode:'window',
			style:'window',
			isShowMask:false
		},extraOption);
	};
	//弹出一个HTML内容的窗口，content为HTML代码
	$.showTuiHTMLDialog=function(content,width,height,title,extraOption){
		$.tui.tuiDialog({
			mode:'window',
			style:'text',
			width:width||300,
			height:height||200,
			message:content,
			showTitle:true,
			title:title
		},extraOption);
	}
	//弹出错误提示框，参数中option请见$.tui.tuiDialogDefault
	$.showTuiErrorDialog=function(errorMsg,errorCallback,width,height,option){
		var opt={
			title:'错误',
			width:width||300,
			height:height||180,
			message:errorMsg,
			mode:'no_title_window',
			style:'error',
			onConfirm:errorCallback,
			confirmBtn:true
		};
		opt=$.extend(opt,option);
		$.tui.tuiDialog(opt);
	};
	//弹出信息提示框，注意！这里的callback是第四个参数！！
	/*$.showTuiInfoDialog=function(info,width,height,sureCallback,option){
		var opt={
			title:'信息',
			width:width||300,
			height:height||150,
			message:info,
			mode:'no_title_window',
			style:'info',
			onConfirm:sureCallback,
			confirmBtn:true
		};
		opt=$.extend(opt,option);
		$.tui.tuiDialog(opt);
	};*/
	//弹出等候的消息框，但是消息框中的所有内容，需要info指定
	//注：一般情况下，该方法显示一个默认的“请稍候...”字样的弹出框，不需要任何参数。
	//   如果存在有效的info,width,height的话，将根据参数内容弹出窗口，窗口的样式和无参数时不同！
	$.showTuiWaitingDialog=function(info,width,height,option){
		var w=width||null,
			h=height||null,
			i=info,
			opt;
		if(i||w||h){
			opt={
				width:w||150,
				height:h||56,
				message:info,
				mode:"no_title_window",
				style:'waiting'
			}
		}else{
			opt={
				width:width||150,
				height:height||80,
				mode:'waiting'
			};
		}
		opt=$.extend(opt,option);
		$.tui.tuiDialog(opt);
	};
	//弹出一个等待框，该框只有一个gif图标
	$.showTuiSmallWaitingDialog=function(width,height,option){
		var opt={
			width:width||68,
			height:height||70,
			mode:"no_title_window",
			style:'waiting'
		};
		opt=$.extend(opt,option);
		$.tui.tuiDialog(opt);
	}
	//弹出信息提示框，和Info相同
	$.showTuiMessageDialog=function(info,callback,width,height,option){
		var opt={
			title:'信息',
			width:width||300,
			height:height||150,
			message:info,
			mode:'no_title_window',
			style:'info',
			onConfirm:callback,
			confirmBtn:true
		};
		opt=$.extend(opt,option);
		$.tui.tuiDialog(opt);
	};
	//确认框
	$.showTuiConfirmDialog=function(message,sureCallback,width,height,option){
		var opt={
			title:'确认',
			width:width||300,
			height:height||160,
			message:message,
			mode:'no_title_window',
			style:'confirm',
			onConfirm:sureCallback,
			cancelBtn:true,
			confirmBtn:true
		};
		$.extend(opt,option);
		opt=$.extend(opt,option);
		$.tui.tuiDialog(opt);
	};
	//成功提示框
	$.showTuiSuccessDialog=function(info,sureCallback,width,height,option){
		var opt={
			title:'成功',
			width:width||300,
			height:height||150,
			message:info,
			mode:'no_title_window',
			style:'success',
			onConfirm:sureCallback,
			confirmBtn:true
		};
		opt=$.extend(opt,option);
		$.tui.tuiDialog(opt);
	};
	//显示无图片的提示框，但是有确认按钮
	$.showTuiNoImgDialog=function(message,sureCallback,width,height,option){
		var opt={
			title:'',
			width:width||300,
			height:height||200,
			message:message,
			mode:'no_title_window',
			style:'text',
			onConfirm:sureCallback,
			confirmBtn:true
		};
		opt=$.extend(opt,option);
		$.tui.tuiDialog(opt);
	}
	//显示黑色半透明提示框
	$.showTuiMessageAlert=function(message,sureCallback,width,height,option){
		var opt={
			mode:'alert',
			style:'error',
			width:width||360,
			height:height||100,
			message:message,
			showTitle:true,
			showDefaultBtn:true,
			onConfirm:sureCallback
		};
		opt=$.extend(opt,option);
		$.tui.tuiDialog(opt);
	};
	//小型的编辑窗口，位置需要设定
	$.showTuiSmallEditWindow=function(url,width,height,top,left,extraOption){
		var opt={
			url:url,
			mode:'narrow_window',
			style:'window',
			width:width||200,
			height:height||100,
			showPos:'ex',
			top:top||0,
			left:left||0,
			isShowMask:false,
			isDrag:false
		}
		opt=$.extend(opt,extraOption);
		$.tui.tuiDialog(opt);
	}
	//小型的编辑窗口，位置需要设定
	$.showTuiSmallEditDialog=function(content,callback,width,height,top,left,extraOption){
		var opt={
			message:content,
			confirmBtn:true,
			cancelBtn:true,
			mode:'narrow_window',
			style:'text',
			width:width||200,
			height:height||150,
			showPos:'ex',
			top:top||0,
			left:left||0,
			isShowMask:false,
			isDrag:false,
			onConfirm:callback
		};
		opt=$.extend(opt,extraOption);
		$.tui.tuiDialog(opt);
	}
	//带有蓝色上边框的弹出框，弹出框中不带有默认的按钮，因此需要在content中添加关闭的措施。left和top的位置如果为空，将按照中央进行显示
	$.showTuiTipDialog=function(content,width,height,left,top,extraOption){
		var showPos='c';
		if(left!=null&&top!=null){
			showPos='ex';
		}
		var opt={
			mode:'narrow_window',
			style:'text',
			width:width||300,
			height:height||100,
			message:content,
			showPos:showPos,
			top:top||0,
			left:left||0,
			showTitle:false,
			showDefaultBtn:false,
			confirmBtn:false
		}
		opt=$.extend(opt,extraOption);
		$.tui.tuiDialog(opt);
	}
	//无边框的窗口，弹出的窗口中的内容是content，不是url,无任何按钮。显示窄边窗口
	$.showTuiModifyDialog=function(content,width,height,left,top,extraOption){
		var showPos='c';
		if(left!=null&&top!=null){
			showPos='ex';
		}
		var opt={
			mode:'no_title_window',
			style:'text',
			width:width||300,
			height:height||100,
			message:content,
			showPos:showPos,
			top:top||0,
			left:left||0,
			showTitle:false,
			showDefaultBtn:false,
			confirmBtn:false
		}
		opt=$.extend(opt,extraOption);
		$.tui.tuiDialog(opt);
	}
	//判断弹出窗口是否存在或显示
	$.isTuiWindowVisible=function(){
		return $.tui.isVisible();
	}
	/*----------------------------外部接口结束-------------------------------*/
	$.tui.tuiDialogDefault={//默认参数
		width:300,//弹出框的默认宽度，单位：px，可以为'auto','50%'等
		height:200,//弹出框的默认高度，单位:px
		message:'',//弹出框的显示内容
		url:'',//弹出框显示的内容链接，自动读取url中的内容。
		title:'tui dialog',//弹出框的默认标题
		maskAlphaColor:'#000',//遮罩透明的颜色，默认为黑色
		maskAlpha:0.1,//遮罩的透明度
		isFixed:false,//弹出框是否固定位置，不跟随滚动条滚动
		showTitle:true,//是否显示标题栏，只有window类型的窗口才能显示title，注，该项为false时，showDefaultBtn参数无效
		showDefaultBtn:true,//是否显示标题栏右侧的关闭按钮。注意该按钮不受autoClose的影响，点击后自动关闭。showTitle为false时，不显示
		confirmBtn:false,//是否显示确定按钮
		cancelBtn:false,//是否显示取消按钮
		closeBtn:false,//是否显示关闭按钮
		autoClose:true,//点击确定或取消按钮是否关闭窗口
		onConfirm:null,//回调函数，点击确定时的function
		onCancel:null,//回调函数，点击取消时的function
		onClose:null,//回调函数，点击关闭是的function
		onTitleClose:null,//标题栏中的关闭按钮的回调函数
		isDrag:true,//是否可以拖动
		isShowMask:true,//是否显示遮罩层
		showPos:'c',//显示窗口的位置，可以为c,lt,lb,rt,rb,ex，分表代表的意思是居中，左上，左下，右上，右下，其他
		top:0,//在showPos为ex时有效，窗口的top
		left:0,//在showPos为ex时有效，窗口的left
		btnContext:{//各个按钮的文字
			w_confirm:'确定',
			w_cancel:'取消',
			w_close:'关闭'
		},
		mode:'window',//显示模式，分别为：window,no_title_window,narrow_window,waiting,alert，以上分别对应不同的窗口显示模式
		style:'info'//窗口模式，可以为：window,success,info,confirm,error,waiting,text以上分别对应窗口中的显示内容，window为iframe，后者为文本类型，以icon区别。注意：mode为alert时，style不能为window，如果是window将按照text来处理。
	};
	/*--------------------------------extend拓展开始-------------------------------*/
	$.extend($.tui,{
		tuiDialog:function(){//弹出一个窗口
			/*--------------------参数准备-------------------*/
			var settings=$.extend({},$.tui.tuiDialogDefault);//读取默认参数参数
			for(var i=0;i<arguments.length;i++){//读取多个参数
				settings=$.extend(settings,arguments[i]);
			}
			var isIE=$.tui.isIE(),
				isCSS1=(document.compatMode=="CSS1Compat"),
				isIE7=$.tui.isIE7(),
				isIE8=$.tui.isIE8(),
				isIE6=$.tui.isIE6();
			/*--------------------参数完毕-------------------*/
			
			/*--------------------内部方法-------------------*/
			//显示遮罩层，参数为遮罩的颜色和遮罩的透明度
			var showMask=function(mask_color,mask_alpha){
				var $doc=$(document),
					maskWidth=$doc.width(),//遮罩层的宽度
					maskHeight=$doc.height(),//遮罩层的高度
					$mask,
					maskSrc='<div id="tui_dialog_mask" class="dialog_mask"></div>',
					hasVerticalScroll;
				if($('#tui_dialog_mask').length>0){//已经存在了遮罩层，则不进行新建遮罩层的操作
					$mask=$('#tui_dialog_mask');
				}else{//新建遮罩层
					$mask=$(maskSrc);
					$('body').append($mask);//将新的遮罩层放入body中。
				}
				//判断是否存在纵向滚动条
				if(window.innerHeight){
					hasVerticalScroll = document.body.offsetHeight > innerHeight;
		        }
		        else {
		        	hasVerticalScroll=
		        		(document.documentElement.scrollHeight > document.documentElement.offsetHeight ||
		                document.body.scrollHeight > document.body.offsetHeight);
		        }
				if(isIE){
					//在IE中，body的宽度不将滚动条的宽度算计去，因此，添加遮罩层之后就会让页面出现横向滚动条。
					
					if(hasVerticalScroll){
						//maskWidth -= 17;
					}
				}
				//说明：在IE6下，遮罩层不能使用div，必须使用iframe才能将下拉菜单等盖住
				if(isIE6){//如果是IE6，则需要在遮罩层中添加一个iframe
					$mask.append('<iframe border="0" frameborder="0" style="width:100%;height:100%;filter:alpha(opacity='+(100*mask_alpha)+');" src="about:blank"></iframe>');//添加iframe，用于遮盖下拉菜单等
				}
				$mask.css({width:maskWidth+'px',height:maskHeight+'px',opacity:mask_alpha,background:mask_color}).show();//设置样式，并且尝试显示
				//如果浏览器窗口大小改变，遮罩层应该也改变，因此绑定事件，当修改窗口大小时，遮罩层也改变
				var oWidth=maskWidth,//记录初始时文档结构的大小，如果窗口拉大则增大，但是窗口缩小时必须判断是不是小于初始化时的文档窗口大小了
					oHeight=maskHeight;
				var onResize=function($mask,oWidth,oHeight){//用于绑定窗口事件，当window发生变化，则将遮罩层根据窗口变化。对于小于初始化大小的窗口变化，将不作变化
					return function(){
						var $window=$(window),
						//大小规则：如果浏览器窗口大于文档大小了，遮罩层要跟着窗口增大，如果浏览器窗口小于文档窗口了，则不能跟着减小，因为这会露出部分文档内容
							maskWidth=$window.width()>oWidth?$window.width():oWidth,
							maskHeight=$window.height()>oHeight?$window.height():oHeight;//遮罩层的高度
						$mask.css({width:maskWidth+'px',height:maskHeight+'px'});
					}
				}
				$(window).bind('resize.tuiDialog',onResize($mask,oWidth,oHeight));//绑定方法，在窗口变化时，改变遮罩层的大小
			};
			//关闭遮罩层
			var closeMask=function(){
				$('#tui_dialog_mask').html('').hide();
				$(window).unbind('resize.tuiDialog');//解除绑定遮罩层监听事件
			};
			//针对IE6的方法，由于IE6不支持position:fixed,所以需要通过absolute来模仿，该方法就是滚动条的事件函数
			var tuiDialogScroll=function(){
				var $tui_dialog_window=$('#tui_dialog_window'),
					$document=$(document),
					left=parseInt($tui_dialog_window.css('left')),
					top=parseInt($tui_dialog_window.css('top'));
				$tui_dialog_window.css({
					left:left+($document.scrollLeft()-window.tuiDialogForIE6ScrollX)+'px',
					top:top+($document.scrollTop()-window.tuiDialogForIE6ScrollY)+'px'
				});
				//alert(left+($(document).scrollLeft()-window.tuiDialogForIE6ScrollX)+'px');
				window.tuiDialogForIE6ScrollX=$document.scrollLeft();//
				window.tuiDialogForIE6ScrollY=$document.scrollTop();
			};
			//用于显示dialog窗口，通常是显示一个微型的弹出框,传入参数对象，见默认参数格式
			//无论是什么样的窗口类型，窗口的结构分为四部分，分别为：上边框，中间的内容，下侧按钮和下边框，这四个部分分别由三个方法负责实现，此方法为上边框和下边框的生成
			var showBasicWindow=function(para){
				var $window,//窗口对象
					$win=$(window),
					$document=$(document);
				/*--窗口的显示处理--*/
				//获得弹出窗口
				if($('#tui_dialog_window').length<1){//如果没有找到已经存在的弹出框，则新建一个
					var dialogHtml='<div id="tui_dialog_window" class="dialog_panel"></div>';//弹出框
					$window=$(dialogHtml);
					$('body').append($window);//将新的窗口放入body中。
				}else{
					$window=$('#tui_dialog_window');
				}
				$window.empty().show().css({position:para.isFixed?'fixed':'absolute'});//清楚掉内部的内容，如果该窗口已经存在，内部的内容必须清掉，便于建立新的内容，如果已经存在弹出窗口，很有可能弹出窗口已经隐藏了，因此，需要显示
				//功能增强，如果width或者height参数为'auto'，或'50%';则需要计算高度
				var paraWidth=para.width,
					paraHeight=para.height,
					dialogWidth,
					dialogHeight;
				//处理宽度
				if(!isNaN(paraWidth)){//如果宽度是不可以计算的
					dialogWidth=para.width;
				}else if(paraWidth=="auto"){
					dialogWidth=$win.width();
				}else{
					var reg=/^(\d{1,3})%$/;
					var regRes=reg.exec(paraWidth);
					if(regRes&&regRes.length==2){//计算比例，如果比例有问题，则按照100%计算
						dialogWidth=$win.width()*(parseInt(regRes[1])||100)/100;
					}else{
						dialogWidth=para.width;
					}
				}
				//处理高度
				if(!isNaN(paraHeight)){
					dialogHeight=para.height;
				}else if(paraHeight=="auto"){
					dialogHeight=$win.height();
				}else{
					var reg=/^(\d{1,3})%$/;
					var regRes=reg.exec(paraHeight);
					if(regRes&&regRes.length==2){
						dialogHeight=$win.height()*(parseInt(regRes[1])||100)/100;
					}else{
						dialogHeight=para.height;
					}
				}
				//将计算好的值传回para中，因为在shouBtnPart中，还需要根据宽高计算文本部分的高度
				para.height=dialogHeight;
				//如果参数中是固定位置显示，则按照fixed显示，否则，按照absoluate显示
				var top=0,
					left=0;
				//根据参数固定显示的位置
				switch(para.showPos){
					case 'lt'://左上显示
						break;
					case 'lb'://左下显示
						top=$win.height()-dialogHeight-2;
						break;
					case 'rt'://右上显示
						left=$win.width()-dialogWidth-2;
						break;
					case 'rb'://右下显示
						top=$win.height()-dialogHeight-2;
						left=$win.width()-dialogWidth-2;
						break;
					case 'c'://居中
						top=($win.height()-dialogHeight)/2;//窗口距离上端的距离
						left=($win.width()-dialogWidth)/2;//窗口距离左端的距离
						break;
					default://其他，根据参数决定
						top=para.top;
						left=para.left;
				}
				//上边框必须显示出来，即：显示的时候，上边框不能超出屏幕范围
				top=top>=0?top:0;
				if(isIE6&&para.isFixed){//在IE6的情况下，position:fixed不支持，因此需要单独处理，坑爹的IE6! :(
					/*
					处理思路：在IE6下，要想实现position:fixed，除了使用css的expression之外，就是通过absolute模仿fixed，这样做的好处在于，直接通过css属性进行复制就可以了。
					给window绑定scroll事件，当滚动条滚动时，重新处理top和left。这里使用差值处理，即，记录初始滚轴位置，每当滚轴变化时，将当前的窗口移动滚轴变化量，而不是重新计算top和left，这样做的原因是，窗口可能经过拖动，而拖动后的left和top在该域内不可见。
					*/
					$window.css({position:'absolute',left:$document.scrollLeft()+left+'px',top:$document.scrollTop()+top+'px'});//重新制定位置
					window.tuiDialogForIE6ScrollX=$document.scrollLeft();//记录初始的滚动条位置
					window.tuiDialogForIE6ScrollY=$document.scrollTop();
					$win.bind('scroll.tuiDialog',tuiDialogScroll)//绑定滚动条事件
				}else{
					//如果页面较长，出现了水平和垂直滚动条，则在absolute的定位中需要加上滚动条的移动位置。
					if(!para.isFixed&&para.showPos!='ex'){
						left+=($win.scrollLeft()||0);
						top+=($win.scrollTop()||0);
					}
					$window.css({left:left+'px',top:top+'px'});//窗口的位置
				}
				
				$window.css({width:dialogWidth+'px',height:dialogHeight+'px'});//设定宽高
				/*--窗口显示处理完毕--*/
				/*--窗口内容--*/
				//弹出框的上边栏
				//mode:显示模式，分别为：window,no_title_window,narrow_window,waiting,alert，以上分别对应不同的窗口显示模式
				var mode=para.mode,
					tempT='',
					tempF='',
					defaultBtnHTML='<div id="tui_dialog_close_button" class="dialog_head_close"></div>',
					$defaultBtn;
				switch(mode){
					case "window":
						tempT='<div id="tui_dialog_title" class="dialog_head_left">\
									<div class="dialog_head_right">\
										<div class="dialog_head_content" id="tui_dialog_title_center"></div>\
									</div>\
								</div>\
								<div class="dialog_body_left">\
									<div class="dialog_body_right">\
										<div class="dialog_body_content" id="dialog_content"></div>\
									</div>\
								</div>';
						//弹出框的下边栏
						tempF='<div id="tui_dialog_bottom" class="dialog_foot_left">\
									<div class="dialog_foot_right">\
										<div class="dialog_foot_content"></div>\
									</div>\
								</div>';
						break;
					case "no_title_window":
						tempT='<div id="tui_dialog_title" class="dialog_head_no_title_left">\
									<div class="dialog_head_no_title_right">\
										<div class="dialog_head_no_title_content" id="tui_dialog_title_center"></div>\
									</div>\
								</div>\
								<div class="dialog_body_left">\
									<div class="dialog_body_right">\
										<div class="dialog_body_content" id="dialog_content"></div>\
									</div>\
								</div>';
						//弹出框的下边栏
						tempF='<div id="tui_dialog_bottom" class="dialog_foot_left">\
									<div class="dialog_foot_right">\
										<div class="dialog_foot_content"></div>\
									</div>\
								</div>';
						break;
					case "narrow_window":
						tempT='<div id="tui_dialog_title" class="dialog_head_narrow_left">\
									<div class="dialog_head_narrow_right">\
										<div class="dialog_head_narrow_content" id="tui_dialog_title_center"></div>\
									</div>\
								</div>\
								<div class="dialog_body_narrow_left">\
									<div class="dialog_body_narrow_right">\
										<div class="dialog_body_narrow_content" id="dialog_content"></div>\
									</div>\
								</div>\
								';
						//弹出框的下边栏
						tempF='<div id="tui_dialog_bottom" class="dialog_foot_narrow_left">\
									<div class="dialog_foot_narrow_right">\
										<div class="dialog_foot_narrow_content"></div>\
									</div>\
								</div>';
						break;
					default://针对alert和waiting，需要单独做其他操作
						tempT='';
						tempF='';
				}
				if(tempT!=''&&tempF!=''){//如果是窗口型的样式
					$(tempT).appendTo($window);
					var $windowTitle=$('#tui_dialog_title'),
						$titleCenter=$('#tui_dialog_title_center');//获得标题栏中间部分
					if(para.showTitle&&mode=="window"){//如果需要显示标题
						var titleHTML='<div class="dialog_head_title" id="tui_dialog_title_content">'+para.title+'</div>',
							$titleContext=$(titleHTML).appendTo($titleCenter);//将标题内容放到标题栏中间容器中
						if(para.showDefaultBtn){//如果显示标题栏的关闭按钮
							$defaultBtn=$(defaultBtnHTML).appendTo($titleCenter);//将关闭按钮放入标题中间容器中
							//绑定事件
						}
					}
					var $windowBottom=$(tempF).appendTo($window);//添加下边栏
				}else{//其他的样式
					if(mode=="waiting"){
						var tempT='<div class="dialog_waiting">\
										<div class="dialog_waiting_msg">\
											<div class="icon"></div><span class="content">'+(para.message||'请稍候...')+'</span>\
										</div>\
									</div>',
							$waiting=$(tempT).appendTo($window);
							$window.css({width:150,height:72});//针对waiting类型的，则显示一个固定的一个宽高。
					}else if(mode=='alert'){
						var tempT='<div class="dialog_alert" id="dialog_alert">\
										<div class="dialog_alert_msg" id="dialog_content"></div>\
									</div>',
							$alert=$(tempT).appendTo($window);
						if(para.showDefaultBtn){
							var closeBtn='<div class="dialog_close_icon" id="tui_dialog_close_button"></div>',
								$defaultBtn=$(closeBtn);
							$('#dialog_alert').before($defaultBtn);
						}
					}
				}
				$defaultBtn&&$defaultBtn.length&&$defaultBtn.bind('mousedown.tuiDialog',function(e){
					//此事件的目的是因为拖拽绑定的是mousedown,因此必须要绑定mousedown事件实现防止冒泡，使得click事件顺利出发
					e.stopPropagation();
				}).bind('click.tuiDialog',function(e){
					e.stopPropagation();//防止冒泡
					closeTuiDialog();
					if(typeof(para.onTitleClose)==="function"){
						para.onTitleClose.call(this,e,$window);
					}
				});
				
				/*--窗口内容完毕--*/
				//给窗口上部添加拖动
				if(para.isDrag){
					$window.tuiOffDrag().tuiDrag({handle:($windowTitle&&$windowTitle.length)?$windowTitle:$window,isFixed:para.isFixed,dragRange:'auto'});
				}else{
					$window.tuiOffDrag().tuiDrag('disabled',true);
				}
			};
			//用于关闭窗口
			var closeWindow=function(){
				$('#tui_dialog_window').hide();
				//取消因为IE6而兼容的position:fixed
				$(window).unbind('scroll.tuiDialog',tuiDialogScroll);
			};
			//关闭窗口的统一方法,除了处理关闭窗口，还要负责将缓存中等待显示的信息取出（如果存在）,并进行显示
			var closeTuiDialog=function(){
				closeWindow();//关闭窗口
				closeMask();//关闭遮罩层
				//删除键盘enter和esc事件
				$(document).unbind('keydown.tuiDialog');
				if(window.tuiDialogCache.length>0){//说明缓存中还有要显示的信息
					var tempCfg=window.tuiDialogCache.shift();//取出队列中的配置参数
					$.tui.tuiDialog(tempCfg);//调用第二次
				}
			};
			//无论是什么样的窗口类型，窗口的结构分为四部分，分别为：上边框，中间的内容，下侧按钮和下边框，这四个部分分别由三个方法负责实现，此方法为中间内容的生成
			var showContentPart=function(para){
				//用于过滤和处理一些特殊字符
				var messageFilter=function(str){
					return str;
				}
				var styleList={//各个窗口类型所对应的样式class名称
					'info':'dialog_icon_info',
					'success':'dialog_icon_success',
					'error':'dialog_icon_error',
					'confirm':'dialog_icon_confirm',
					'waiting':'dialog_icon_waiting'
					},
					$dialog_content,
					mode=para.mode,
					style=para.style,
					$iframe;
				if($('#dialog_content').length!=1&&mode!="waiting"){//中间内容不存在的情况下，需要新建一个新的容器
					window.console&&window.console.warn('not found #dialog_content!');
					return;
				}
				$dialog_content=$('#dialog_content');
				$dialog_content.empty();//如果已经存在了内部信息，为防止错误，将内部的信息清空
				switch(style){
					case "window"://内容为一个iframe新页面
						if((mode!='alert')&&(mode!='waiting')){
							var innerHtml='<iframe border="0" id="dialog_iframe" frameborder="0" class="dialog_iframe" src="'+para.url+'"></iframe>';
							$iframe=$(innerHtml).appendTo($dialog_content);
							
							break;
						}
					case "text":
						if(mode!='waiting'){
							$dialog_content.html('<div id="dialog_info_panel" style="overflow:auto;">'+messageFilter(para.message)+'</div>');
						}
						break;
					case "info":
					case "success":
					case "error":
					case "confirm":
					case "waiting":
						var innerHtml='<div class="dialog_info" id="dialog_info_panel">\
                        				<div id="dialog_icon"></div>\
                       					<div class="dialog_info_content" id="dialog_info_content"></div>\
                    				   </div>';
						var $dialog_info=$(innerHtml).appendTo($dialog_content);
						var $dialog_icon=$('#dialog_icon'),
							$dialog_info_content=$('#dialog_info_content');
						$dialog_icon.addClass(styleList[style]);
						$dialog_info_content.html(messageFilter(para.message));
						//去掉dialog_info_content冒泡的事件，因为在一些情况下，滚动条的事件会在拖拽的事件下无法正常使用
						$dialog_info_content.off('mousedown.tuiDialog').on('mousedown.tuiDialog',function(e){
							(e&&e.stopPropagation)?e.stopPropagation():window.event.cancelBubble=true;
						});
						//添加waiting的图标选项之后，在waiting下，由于gif图标与其他图标的大小不同，因此需要重新计算文字的padding
						if(style=="waiting"){
							$dialog_icon.parent().css({paddingLeft:56});
							if(para.message==""){
								$dialog_icon.parent().css({paddingTop:0});//如果没有message，则需要将top的位置去掉，用在只显示gif图标时使用
							}
						}
						break;
				}
				//计算实际的高度
				var sub=0,//此变量为需要减去的高度，因为窗口的高度需要内容框的高度来撑起来。
					$iframe=$('#dialog_iframe'),
					$dialog_info_panel=$('#dialog_info_panel');
				if(para.confirmBtn||para.cancelBtn||para.closeBtn){//如果有按钮，则少30px
					sub+=30;
				}
				if(mode=='window'){//如果是window型的，少43px
					sub+=43;
				}else if(mode=='alert'){//alert少20px
					sub+=20;
				}else if(mode=='no_title_window'){
					sub+=15;
				}else if(mode=='narrow_window'){
					sub+=13;
				}
				$dialog_info_panel.length&&$dialog_info_panel.css({height:(para.height-sub)+'px'});
				$iframe.length&&$iframe.css({height:(para.height-sub)+'px'});
			};
			//显示按钮部分的内容，注意：改方法必须要在内容部分存在时才能调用
			var showButtonPart=function(para){
				var $window=$('#tui_dialog_window'),
					$btn_panel=$('#dialog_btn_panel'),
					mode=para.mode,
					$content=$('#dialog_content'),
					btnHtml='',
					btnContext=para.btnContext;
				if($window.length!=1||$content.length!=1){//必须存在弹出窗口
					return;
				}
				if(mode=="waiting"){//如果是请稍后的弹出框，则不支持按钮
					return;
				}
				if($btn_panel.length!=0){//已经存在btn容器了
					$btn_panel.empty().remove();//清楚因存在的按钮
				}
				if(para.confirmBtn){
					btnHtml+='<div class="btn_page btn_save dialog_btn" id="dialog_btn_confirm">\
								<div class="btn_left"></div>\
								<div class="btn_content" id="tt">&nbsp;'+btnContext.w_confirm+'&nbsp;</div>\
								<div class="btn_right"></div>\
							</div>';
				}
				if(para.cancelBtn){
					btnHtml+='<div class="btn_page btn_cancel dialog_btn" id="dialog_btn_cancel">\
								<div class="btn_left"></div>\
								<div class="btn_content">&nbsp;'+btnContext.w_cancel+'&nbsp;</div>\
								<div class="btn_right"></div>\
							</div>';
				}
				if(para.closeBtn){
					btnHtml+='<div class="btn_page btn_cancel dialog_btn" id="dialog_btn_close">\
								<div class="btn_left"></div>\
								<div class="btn_content">&nbsp;'+btnContext.w_close+'&nbsp;</div>\
								<div class="btn_right"></div>\
							</div>';
				}
				if(btnHtml!=''){
					$btn_panel=$('<div class="dialog_btn_panel" id="dialog_btn_panel"></div>').appendTo($content);
					$btn_panel.html(btnHtml);
				}else{//如果不存在任何按钮，则不作任何操作
					return;
				}
				var $confirm=$('#dialog_btn_confirm'),
					$cancel=$('#dialog_btn_cancel'),
					$close=$('#dialog_btn_close'),
					isAutoClose=para.autoClose;
				//绑定确认
				$confirm.length&&$confirm.bind('mousedown',function(e){e.stopPropagation();}).bind('click.tuiDialog',function(e){
					isAutoClose?closeTuiDialog():'';
					typeof(para.onConfirm)=="function"?para.onConfirm.call(this,e,$window):'';
				});
				//绑定取消
				$cancel.length&&$cancel.bind('mousedown',function(e){e.stopPropagation();}).bind('click.tuiDialog',function(e){
					isAutoClose?closeTuiDialog():'';
					typeof(para.onCancel)=="function"?para.onCancel.call(this,e,$window):'';
				});
				//绑定关闭
				$close.length&&$close.bind('mousedown',function(e){e.stopPropagation();}).bind('click.tuiDialog',function(e){
					isAutoClose?closeTuiDialog():'';
					typeof(para.onClose)=="function"?para.onClose.call(this,e,$window):'';
				});
				//绑定一个键盘事件，用于键盘的事件
				$(document).bind('keydown.tuiDialog',function(e){
					var $confirm=$('#dialog_btn_confirm');
					var $cancel=$('#dialog_btn_cancel');
					var $autoCancel=$('#tui_dialog_close_button');
					if(e.keyCode==13){
						$confirm.length&&$confirm.trigger('click');
					}else if(e.keyCode==27){
						$cancel.length?$cancel.trigger('click'):$autoCancel.length&&$autoCancel.trigger('click');
					}
				});
			};
			/*--------------------方法结束-------------------*/
			/*-------------------主方法开始-------------------*/
			/**/
			window.tuiDialogCache?'':window.tuiDialogCache=new Array();//创建一个用于记录弹出框信息的缓存，为了实现需要弹出多个弹出框的时候，按次序弹出的功能
			if($('#tui_dialog_window:visible').length>0){//说明，调用主方法时，弹出框已经弹出，正在显示别的信息，因此，将该方法放入缓存中，等之前的弹出框关闭了在显示当前弹出框
				window.tuiDialogCache.push(settings);//放入缓存
				return;//所有方法结束，后面的显示过程都不做
			}
			
			showBasicWindow(settings);//显示基本窗口
			showContentPart(settings);//显示窗口中的内容
			showButtonPart(settings);//显示窗口的按钮
			settings.isShowMask?showMask(settings.maskAlphaColor,settings.maskAlpha):'';//显示遮罩层
		},
		closeTuiWindow:function(){//关闭窗口的总方法，用于封装时调用
			//关闭遮罩层
			var closeMask=function(){
				//删除键盘enter和esc事件
				$(document).unbind('keydown.tuiDialog');
				$('#tui_dialog_mask').html('').hide();
				$(window).unbind('resize.tuiDialog');
			};
			//用于关闭弹出窗口
			var closeWindow=function(){
				$('#tui_dialog_window').hide();
				//取消因为IE6而兼容的position:fixed
				$(window).unbind('scroll.tuiDialog');
			};
			//关闭窗口的统一方法,除了处理关闭窗口，还要负责将缓存中等待显示的信息取出（如果存在）,并进行显示
			var closeTuiDialog=function(){
				closeWindow();//关闭窗口
				closeMask();//关闭遮罩层
				if(window.tuiDialogCache&&window.tuiDialogCache.length>0){//说明缓存中还有要显示的信息
					var tempCfg=window.tuiDialogCache.shift();//取出队列中的配置参数
					$.tui.tuiDialog(tempCfg);//调用第二次
				}
			};
			closeTuiDialog();
		},
		isVisible:function(){//判断是否有窗口显示
			var $win=$('#tui_dialog_window');
			if($win.length&&$win.is(':visible')){
				return true;
			}else{
				return false;
			}
		}
	});
	/*----------------------------------extend拓展结束---------------------------------*/
})(jQuery);