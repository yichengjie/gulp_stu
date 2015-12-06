/**                                                    
 * tuiSuggest是GUI基本框架。它是关于input窗体的基本框架，用于显示下拉菜单，下拉列表等功能。
 * tuiAirportSelecter和tuiSingleSelect都将基于该框架进行开发。
 * tuiSuggest提供事件接口。必须基于jquery。        
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.9.26     
 * @see                                                
 *	HISTORY                                            
 * 2012-10-30下午02:30:08 创建文件
 * 2012-11-21 增加了动态判断弹出位置
 * 2012-11-26 主方法将返回input的jquery对象
 * 2012-12-05 去掉了proxyHtml的没用变量。所有的回调函数增加了event事件的回调参数。
 *   修正了tui样式中带有按钮的input框点击关闭下拉框的bug。
 *   增加了optionNameOnly的选项，可以让选项只显示name
 * 2012-12-06 修正了设置新data时的target参数处理，支持了String和jQuery两种类型的target。但是，String必须是id名
 * 2013-01-14 修正了空选项显示bug
 * 2013-01-23 修正了在XP操作系统下IE7的attr赋值错误。
 * 2013-01-29 版本更新，增加了height参数，可以设置高度，并在高度放不下的情况下出现滚动条
 * 2013-01-30 版本更新，修正了默认选项为String时出现的运算错误。
 *   修正了选项数据中，name为空时，点击下拉选项空值后出现的空格。
 * 2013-02-20 版本更新，修正了tuiSingleSelect中timeout引起的浏览器异常问题。修改suggest框关闭时的机制。
 *   $.tui.hideTuiSuggest方法将不再接收参数，该方法会将所有含有tui_suggest_panel的div全部隐藏起来
 * 2013-02-27 版本更新，如果筛选后的选项中没有一个要显示的项，则不显示下拉框。
 * 2013-04-07 版本更新，修改了checkTuiSuggestItem方法，在回调存在时，仍然会改变选项的值。
 * 2013-04-16 版本更新，修正了获取UID错误的bug
 * 2013-05-07 版本更新，修正了checkTuiSuggestItem方法的item关键字对于数字与字符串的弱类型识别错误，现在1和'1'将不会出现同样的操作了。
 * 2013-05-16 版本更新，添加了输入字符等文字过滤，避免了selector因为加入非法字符造成的语法错误。
 * 2013-05-24 版本更新，对所有的非法字符重新定义
 * 2013-06-03 版本更新，修正了出现因横向滚动条导致下拉框横坐标计算错误的bug
 * 2013-06-04 版本更新，增加了关闭时的回调函数onAfterHide,onBeforeShow。
 *	修改了$.tui.checkTuiSuggestItem方法的匹配方式，现在在模糊匹配之前会先进行全值匹配。
 * 2013-07-17 版本更新，修改了输入框blur事件的延迟事件，从200毫秒延迟到400毫秒。原因是解决在ipad上的延迟时间较短，无法响应按下事件。
 * 2013-08-14 版本更新，增加了$.tui.showTuiSuggestItems和$.tui.hideTuiSuggestItems方法，这两个方法将内部函数向外提供接口。
 * 2013-08-15 版本更新，修改了内部核心代码，内部方法参数做了修改。
 * 2013-11-04 版本更新，增加了多列显示的功能，只能在small模式下使用
 * 2013-12-03 版本更新，重新修正了timeout的时间，在移动端，设置为400ms，在非移动端，设置为120ms
 * 2013-12-12 版本更新，修正了因为ajax返回较慢导致的返回结果将已经关闭的下拉框重新打开。
 * 2013-12-20 版本更新，修正2013-12-13版本的遗留bug。
 * 2013-12-24 版本更新，重新修正了下拉框关闭的方式。
 * 2013-12-25 版本更新，修正了下拉框出现滚动条后，因滚动造成的无法关闭下拉框的bug
 * 2014-01-02 版本更新，修正了在input_advance的情况下，下拉框的选项情况不同的bug
 */
;(function($){
	$.tui = $.tui || {};
	$.tui.tuiSuggest = function (){
		//--------------------参数准备-------------------
		var _default = {
			width:'auto',//默认的宽度，单位为像素，如果是非数字类型的，将按照默认的宽度进行显示。默认宽度是$proxy的宽度。
			/* 注意：宽度为0也会按照auto进行计算
			 * 由于style为big时，是默认的大型下拉框，因此，下拉框的宽度是之前已经设计好的，不能进行指定。只有style为small时才会进行宽度的设定
			 */
			height:'auto',//高度，单位为像素
			target:'',//生效目标，可以为jquery对象，可以为字符串，但是字符串必须是id名
			mode:'autoComplete',//下拉框类型，autoComplete是城市选框，select是单选框将当前的input隐藏，设置一个假的input
			style:'small',//模式目前分为big和small，big将模仿系统下拉菜单模式
			readOnly:false,//是否只读
			popupDir:'auto',//弹出的方向
			col:null,//列数，如果为正整数，则将多列显示。注：请注意弹出框宽度，列宽将根据弹出框的宽度进行平分
			/*
			 * 弹出方向的参数有：auto,up,down。分别是自动判断，向上弹出，向下弹出。该参数只有在style不为big时生效
			 */
			data:[],//数据部分，用于显示下拉框具体内容。
			optionNameOnly:false,//是否只显示data中的name，如果为ture，那么选项中将只显示name值，其他值都不显示
			//数据格式{name:'显示到页面上的文字',val:'选择之后放入input中的value',assist:'协助显示的关键字，比如汉语拼音的缩写',others:'其他字段'}
			maxItemsNum:0,//最大的显示数目，如果为0，意味着不受限制，大于0的整数将会生效
			hoverItemCallback:null,//当通过↑↓按钮选择选项时，选在每一个下拉选项时所进行的操作。如果为空，则按照默认的操作进行。
			/* 回调函数的参数，($input,$proxy)=(真正的输入框，用于显示前端的输入框),this为当前选中的选项
			 * this为当前选中的选项，该对象为选中的li,data中的数据在li中的属性中，分别为：
			 * name="data[i]['name']";val="data[i]['val']";assist="data[i]['assist'];others=data[i]['others']"
			 */
			checkItemCallback:null,//当点击或者enter某个选项时所作的回调函数。如果回调函数为空，则按照默认的操作进行。
			/* 回调函数的参数，($input,$proxy)=(真正的输入框，用于显示前端的输入框),this为当前选中的选项
			 * this为当前选中的选项，该对象为选中的li,data中的数据在li中的属性中，分别为：
			 * name="data[i]['name']";val="data[i]['val']";assist="data[i]['assist'];others=data[i]['others']"
			 */
			showSelectCondition:null,//出现下拉框的条件，回调函数，函数需要返回true或false，如果为ture，则出现下拉框，否则不显示下拉框。
			//回调的参数为($input,$proxy);
			//注：如果没有该回调函数，系统将自动显示下拉框。
			keywordProcess:null,//关键字的处理，用于显示下拉框内容筛选的关键字，函数必须返回一个字符串。
			//返回的字符串将用于关键字进行下拉选项的筛选，如果没有该方法，将自动执行默认处理函数
			//回调的参数为($input,$proxy);
			onAfterHide:null,//在关闭下拉框之后的回调。this为下拉框本身，参数($input,$proxy)
			onBeforeShow:null//在开启下拉框之前的回调，参数($input,$proxy)。注意！在显示之前，下拉框还未生成，因此this不是下拉框
			},
			settings = $.extend({}, _default);
		for(var i = 0; i < arguments.length; i++){
			settings = $.extend(settings, arguments[i]);
		}
		//--------------------参数准备完毕----------------
		//--------------------内部方法-------------------
		var getUId = function (){
			var num = +new Date();
			var id = "tuiSuggest" + num.toString();
			return id;
		};
		/*
		 * 该方法是显示具体下拉框选项的方法，通过读取input中的data，来判断具体显示几条。
		 * srcString：为筛选的文本条件，根据该文本，来进行筛选需要显示的选项
		 * 增加了alwaysShow参数，用于判断是否强行打开下拉框，因为有时下拉框已经被关闭了。
		 */
		var showItems = function (keyword, $input, $proxy, alwaysShow){
			//准备数据
			if (null == alwaysShow){
				alwaysShow = true;
			}
			var data = $input.data('data'),
				inputId = $input.attr('id'),
				inputSelectId = inputId + "Select",
				settings = $input.data('settings'),
				itemFlag = false;//是否有一项显示,如果一项都没显示，那么就不需要显示外框了。
			if(!data || !data.length){//如果没有数据部分，则不显示下拉框
				return;
			}
			var $select, selecthtml, $content, ulhtml = "", showItemsNum, cols, sWidth;
			$select = $('#' + inputSelectId);
			if (settings.style == "big"){//如果是一般的城市下拉框
				if (!$select.length){
					selecthtml = '<div id="' + inputSelectId + '" style="width:220px; top:50px; left:10px;" class="popup_tip suggest_select tui_suggest_panel">\
									<div class="popup_top">\
										<div class="top_left"></div>\
										<div class="top_middle"></div>\
										<div class="top_right"></div>\
									</div>\
									<div class="popup_content">\
										<div class="content_left"></div>\
										<div class="content">\
										</div>\
										<div class="content_right"></div>\
									</div>\
									<div class="popup_bottom">\
										<div class="bottom_left"></div>\
										<div class="bottom_right"></div>\
									</div>\
								</div>';
					$input.before(selecthtml);
					$select = $('#' + inputSelectId);
				}
				ulhtml = '<div class="suggest_select_tip">请输入中文/拼音或者↑↓选择</div><ul>';
			} else {//简化简化版本的下拉框
				if(!$select.length){
					selecthtml = '<div id="' + inputSelectId + '" style="width:200px; top:50px; left:10px;" class="suggest_select_small tui_suggest_panel">\
									<div class="content"></div>\
								</div>';
					$input.before(selecthtml);
					$select = $('#' + inputSelectId);
				}
				ulhtml = '<ul>';
			}
			
			$content = $('.content', $select);//下拉的容器
			keyword = keyword.replace(/[\!\@\#\$\%\^\&\*\(\)\_\+\{\}\"\:\<\>\?\;\'\/\.\,\=\-\`\~\[\]]/g, "\\$&") || "";//过滤非法的字符
			showItemsNum = 0;//用于记录最多显示多少条。如果设置了maxItemsNum,则不能全部显示
			var reg = new RegExp('' + keyword + '.*', 'im'),//用于匹配是否包含关键字
				flag = false;//用于记录是否匹配成功，只要存在一个匹配成功，就设置成true
			for (var i = 0; i < data.length; i++){
				flag = false;
				var dataName = data[i]['name'],
					dataVal = data[i]['val'],
					dataOthers = data[i]['others'],
					dataAssist = data[i]['assist'];
				for (var j in data[i]){//循环匹配每一个关键字
					if(reg.test(data[i][j]) && data[i].hasOwnProperty(j)){//只要有一个匹配成功了，就不需要匹配下一个了
						flag = true;
						break;
					}
				}
				if (keyword == "" || flag){//如果找到了匹配的data或者没有关键字
					if (settings.optionNameOnly){
						ulhtml += '<li name="' + dataName + '" val="' + dataVal + '" others="' + dataOthers + '" assist="' + dataAssist + '"><a>' + (dataName == "" ? "&nbsp;" : dataName) + '</a></li>';
					} else {
						ulhtml += '<li name="' + dataName + '" val="' + dataVal + '" others="' + dataOthers + '" assist="' + dataAssist + '"><a><span>' + dataVal + '</span>' + dataName + '</a></li>';
					}
					showItemsNum++;
					itemFlag = true;
					if (showItemsNum == settings.maxItemsNum){//如果显示的项目数达到了最大限制，则不进行显示了。
						break;
					}
				}
			}
			ulhtml += '</ul>';
			$content.html('').append(ulhtml);//将数据添加到容器中
			//设置下拉框的宽度和高度
			if (settings.style == 'small'){
				if (!$.isNumeric(settings.width)){//默认的宽度
					$select.css({width:(sWidth = $proxy.outerWidth())});
				} else {
					$select.css({width:(sWidth = (settings.width >>> 0))});//避免宽度为小数，因此需要向下取整
				}
				if ($.isNumeric(settings.height)){
					$select.css({height:(settings.height >>> 0)});
				}
				//如果cols为正整数，则分栏
				if ($.isNumeric(settings.cols) && settings.cols > 0){
					cols = settings.cols >>> 0;
					$select.addClass('multi_col');
					$('li', $select).css({
						width:(sWidth / cols) - 14 //padding+border+margin * 2
					});
				}
			}
			if (itemFlag){
				if (alwaysShow || $input.attr('data-show') == 'true'){
					$select.show();
				} else {
					$select.hide();
				}
				//$select.show();//显示下拉框
			} else {
				$select.hide();//如果一个没有显示，那么下拉框也不显示了
			}
			
			//为每一个ul中的li绑定hover事件
			$('ul li',$content).hover(function (){
				$('ul li',$content).removeClass('suggest_select_hover');
				$(this).addClass('suggest_select_hover');
			}, function (){
				$(this).removeClass('suggest_select_hover');
			}).off('click.tuiSuggest').on('click.tuiSuggest', function (event){
				processCheck($input, $proxy, event);
				hideItems($input, $proxy);
			});
			if (settings.style == "big"){//因为popuptip的样式中，左侧和右侧边框无法根据高度进行自适应，因此需要通过js来确定高度
				var $popup = $('#' + inputSelectId + ' .popup_content'),
					borderHeight = $popup.height();
				$('.content_left', $popup).css({height:(borderHeight - 2)});
				$('.content_right', $popup).css({height:(borderHeight - 2)});
			}
			setPosition($input, $proxy);
			//给下拉框绑定滚动事件，防止因为拖动下拉框中的滚动条使得触发blur事件而关闭下拉框
			$select.off('scroll.tuiSuggest').on('scroll.tuiSuggest', function (event){
				var $doc = $(document),
					$this = $(this);
				try {
					clearTimeout(hideTimeout);
					
				}catch(e){}
				//在有滚动条时，如果用户拖动滚动条，那么有可能不选择，再点击别处就必须要关闭，但是这样就关不上了。所以加上以下代码
				$doc.off('click.tuiSuggest').on('click.tuiSuggest', function (event){
					var target = event.target,
						_this = $this.get(0);
					if (!(_this === target || $.contains(_this, target) || $proxy.get(0) === target)){
						hideItems($input, $proxy);
						$(document).off('click.tuiSuggest');
					}
				});
			});
		};//showItems结束--
		$.tui.showTuiSuggestItems = showItems;
		//隐藏下拉框
		var hideItems = function($input, $proxy){
			//准备数据
			var inputId = $input.attr('id'),
				inputSelectId = inputId + "Select",
				$inputSelect = $('#' + inputSelectId);
			$inputSelect.fadeOut(300);
			$proxy.trigger('afterHide.tuiSuggest');
		};//hideItems结束--
		$.tui.hideTuiSuggestItems = hideItems;
		var setPosition = function($input, $proxy){
			//准备数据
			var inputId = $input.attr('id'),
				inputSelectId = inputId+"Select",
				$inputSelect = $('#' + inputSelectId),
				ileft = $proxy.position().left,
				itop = $proxy.position().top,
				Left = ileft - ($inputSelect.width() - $proxy.width()) / 2,
				Top,
				$win = $(window),
				$doc = $(document),
				settings = $input.data('settings'),
				$body = $('body');
			//针对big模式下popup样式，目前只能向下拉。因此，需要将箭头的8px空出来
			if(settings.style == "big")
				Top += 8;//箭头有8px
			/*
			 * 拉出的方向，在small的模式下，弹框可以在某些情况下向上弹出
			 * 向上弹出的情况是，在当前向下弹出的情况下，如果弹出的高度已经低于body下边界，则向上弹出
			 * 如果指定了参数向上弹出，则都向上弹出
			 * 如果指定了参数向下弹出，则都向下弹出
			 */
			if (settings.style == 'small' && settings.popupDir == 'up'){//不通过判断环境位置，直接向上弹出
				Top = itop - $inputSelect.outerHeight();
			} else {//向下弹出
				Top = itop + $proxy.outerHeight();//计算出向下弹出的top
				var supposeUpTop = itop - $inputSelect.outerHeight();//假设它需要向上弹出，因为下面的if中需要在这个值并且如果if为true，也需要计算该值，因此，提前计算出来
				//注：向上弹出的依据是根据position计算的，而不是根据offset计算的！！如果出现问题，需关注此点！
				if (settings.style == 'small' && settings.popupDir == 'auto'){//如果在small下auto模式，如果满足条件，也需要向上弹出的
					if (Top + $inputSelect.outerHeight() > $body.height() && supposeUpTop > 0){//条件，向下弹出没有地方，但是向上弹出有地方
						Top = supposeUpTop;
					}
				}
			}
			
			Left = (Left + $inputSelect.width()) > $doc.width() ? $doc.width() - $inputSelect.width() : Left;
			Left = Left > 0 ? Left : 0;
			$inputSelect.css({left:Left, top:Top});
		};//setPosition结束--
		var processKey = function (event, $input, $proxy){
			//准备数据
			var inputId = $input.attr('id'),
				inputSelectId = inputId + "Select",
				settings = $input.data('settings'),
				$inputSelect = $('#' + inputSelectId);
			//↑↓的处理
			if (/^38$|^40$|^27$|^13$/.test(event.keyCode) && $inputSelect.is(':visible')){//只有在下拉框出现的时候，以上控制键才能生效
				switch(event.keyCode){
					case 38://↑
						prevItem($input);
						var $curr = getCurrentItem($input);
						if (typeof(settings.hoverItemCallback) === "function"){
							settings.hoverItemCallback.call($curr, $input, $proxy, event);
						} else {
							hoverItem($input, $proxy);
						}
						break;
					case 40://↓
						nextItem($input);
						var $curr = getCurrentItem($input);
						if (typeof(settings.hoverItemCallback) === "function"){
							settings.hoverItemCallback.call($curr, $input, $proxy, event);
						} else {
							hoverItem($input, $proxy);
						}
						break;
					case 27://esc
						hideItems($input, $proxy);
						break;
					case 13://enter
						processCheck($input, $proxy);
						break;
				}
			}
			//其他的处理
			else{
				processShow(event, $input, $proxy);
			}
		};//processKey结束--
		//获得当前的选项，返回jquery对象，如果没有选中的选项，则返回空
		var getCurrentItem = function($input){
			var inputId = $input.attr('id'),
				inputSelectId = inputId + "Select",
				$inputSelect = $('#' + inputSelectId);
			if ($inputSelect.length != 1 || !$inputSelect.is(':visible')){
				return;
			}
			var $ul = $('ul', $inputSelect),//选项ul
				$lis = $('li', $ul);
			if ($lis.length < 1){
				return;
			}
			var $current = $('.suggest_select_hover', $ul);
			return $current;
		}
		//用于选择上一个li
		var prevItem = function ($input){
			var inputId = $input.attr('id'),
				inputSelectId = inputId + "Select",
				$inputSelect = $('#' + inputSelectId);
			if ($inputSelect.length != 1 || !$inputSelect.is(':visible')){
				return;
			}
			var $ul = $('ul', $inputSelect),//选项ul
				$lis = $('li', $ul);
			if ($lis.length < 1){
				return;
			}
			var $current = $('.suggest_select_hover',$ul);
			$lis.removeClass('suggest_select_hover')//先除去当前的hover
			if ($current.length != 1){//如果没有选中一个，则选中第一个。结束
				$current = $lis.eq(0);
				$current.addClass('suggest_select_hover');
				return;
			}
			var $prev = $current.prev();
			if($prev.length != 1){//存在上一个选项
				$prev = $lis.eq(0);
			}
			$prev.addClass('suggest_select_hover');
		};//prevItem结束--
		//用于选择上一个li
		var nextItem = function ($input){
			var inputId = $input.attr('id'),
				inputSelectId = inputId + "Select",
				$inputSelect = $('#' + inputSelectId);
			if ($inputSelect.length != 1 || !$inputSelect.is(':visible')){
				return;
			}
			var $ul = $('ul', $inputSelect),//选项ul
				$lis = $('li', $ul);
			if ($lis.length < 1){
				return;
			}
			var $current = $('.suggest_select_hover', $ul);
			$lis.removeClass('suggest_select_hover')//先除去当前的hover
			if($current.length != 1){//如果没有选中一个，则选中第一个。结束
				$current = $lis.eq(0);
				$current.addClass('suggest_select_hover');
				return;
			}
			var $next = $current.next();
			if($next.length != 1){
				$next = $current;
			}
			$next.addClass('suggest_select_hover');
			
		};//nextItem结束--
		//默认的hover操作，只有在键盘输入时有效。如果存在有效的回调函数，则该方法将会无效
		var hoverItem = function ($input, $proxy){
			var inputId = $input.attr('id'),
				inputSelectId = inputId + "Select",
				$inputSelect = $('#' + inputSelectId),
				$current = $('.suggest_select_hover', $inputSelect);
			if ($current.length){
				$proxy.val($current.attr('name'));
			}
		};//hoverItem结束--
		//默认的选择某一选项的操作。如果存在有效的回调函数，则该方法将会无效
		var checkItem = function ($input, $proxy){
			var $current = getCurrentItem($input);
			if ($current && $current.length == 1){
				$input.val($current.attr('val'));
				$proxy.val($current.attr('name'));
				$proxy.focus();//添加改变值之后的焦点
			}
		};//checkItem结束--
		//用于处理显示下拉框的逻辑处理函数
		var processShow = function(event, $input, $proxy){
			var key = "",
				settings = $input.data('settings');
			if (typeof(settings.showSelectCondition) == "function"){
				var showCondition = settings.showSelectCondition($input, $proxy, event);
				if (showCondition){
					if (typeof(settings.keywordProcess) == "function"){
						key = settings.keywordProcess($input, $proxy, event);
					} else{
						key = $proxy.val();
					}
					showItems(key, $input, $proxy, settings);
				}
			} else{
				if (typeof(settings.keywordProcess) == "function"){
					key = settings.keywordProcess($input, $proxy, event);
				} else{
					key = $proxy.val();
				}
				showItems(key, $input, $proxy, settings);
			}
		}//processShow结束--
		//用于处理选择某一个选项后进行的逻辑处理函数
		var processCheck = function ($input, $proxy, event){
			var $curr = getCurrentItem($input),
				settings = $input.data('settings');
			if ($curr && $curr.length == 1){//找到了当前选项
				if (typeof(settings.checkItemCallback) == "function"){
					settings.checkItemCallback.call($curr, $input, $proxy, event);
				} else {
					checkItem($input, $proxy);
				}
				hideItems($input, $proxy);
			}else{
				hideItems($input, $proxy);
			}
			$(document).off('click.tuiSuggest');//针对2013-12-25bug，需要在用户选择选项后将全局的点击事件去掉，否则下次将无法打开下拉框
		}//processCheck结束--
		//----------------------------------------------
		//主函数-----------------------------------------
		var $this,
			$input,//真正的input
			$proxy,//用于显示的input
			hideTimeout;//由于关闭下拉框需要200ms，因此，需要该变量记录timeout，如果在timeout没有到达之前又触发打开下拉框，需要把该timeout取消。
		if (settings.target instanceof jQuery){//判断参数是否是jquery对象，对于jquery对象，必须要有一个id
			$this = settings.target;
			if (!$this.attr('id')){
				$this.attr('id',getUId());
			}
		} else {
			$this = $('#'+settings.target);
		}
		if (settings.mode == 'autoComplete'){//autoComplete模式，input和proxy指向同一个元素
			$input = $proxy = $this;
		}else if (settings.mode == 'select'){//select模式，input是真正的input，proxy是用于显示的假的input
			var thisId = $this.attr('id'),
				thisName = $this.attr('name');
			$input = $this;
			$proxy = $this.clone(true);
			//$proxy.attr({'name':thisName+"Proxy",'id':thisId+"Proxy"});
			$proxy.get(0).name = thisName + "Proxy";
			$proxy.get(0).id = thisId + "Proxy";
			$this.after($proxy);
			$input.hide();
		} else {
			return;
		}
		//将settings保存到input中
		$input.data('settings', settings);
		
		if (settings.readOnly){//如果是只读的
			$proxy.attr('readonly', 'readonly');
		}
		$input.data('data', settings.data);
		//绑定focus事件
		$proxy.off('focus.tuiSuggest').on('focus.tuiSuggest', function (event){
			clearTimeout(hideTimeout);
			//beforeShow的回调函数位置
			if (typeof(settings.onBeforeShow) === 'function'){
				settings.onBeforeShow($input, $proxy);
			}
			$input.attr('data-show', 'true');
			processShow(event, $input, $proxy);
		});
		//绑定blur事件
		$proxy.off('blur.tuiSuggest').on('blur.tuiSuggest', function (event){
			/*
			 * 设置timeout的原因是绑定的blur事件在鼠标点击某个下拉选项时就会触发，因此，下拉框消失，因此无法触发li的click事件
			 */
			$input.attr('data-show', 'false');
			hideTimeout = setTimeout((function ($input, $proxy){
				return function (){
					hideItems($input, $proxy);
				}
			})($input, $proxy), ($.tui.isMobile() ? 400 : 120));
			//hideItems();
		});
		//绑定keyup事件
		$proxy.off('keyup.tuiSuggest').on('keyup.tuiSuggest', function (event){
			if (event.keyCode && event.keyCode != 9){
				processKey(event, $input, $proxy);
			}
		});
		//绑定afterHide事件。
		if (typeof(settings.onAfterHide) === 'function'){
			$proxy.off('afterHide.tuiSuggest').on('afterHide.tuiSuggest', function (){
				settings.onAfterHide.call($('#' + $input.attr('id') + 'Select'), $input, $proxy);
			});
		}
		
		return $input;//返回input的jQuery对象
	}//tuiSuggest结束
	/**
	 * 隐藏下拉框，target为真正的input的id或jQuery对象 2013-02-20废除
	 * 不接受参数，隐藏全部含有tui_suggest_panel的下拉框
	 */
	$.tui.hideTuiSuggest = function (){
		$('.tui_suggest_panel:visible').each(function (){
            var $this = $(this),
				id = $this.attr('id').replace('Select', ''),
				//$input=$('#'+id),
				$proxy = $('#' + id + 'Proxy');
			$proxy.trigger('afterHide.tuiSuggest');
        }).hide();
	}
	/*
	 * 修改一个选项，target为jquery对象或String，但是必须为id，该方法必须在tuiSuggest执行执行才能生效
	 * target的目标必须是input的值。注意：如果是下拉框类型的，target必须是隐藏起来的真正的input，不是用于显示的proxy。
	 * 否则，将按照单个input处理。
	 * 注：针对下拉框的input框，target为input，target的id+Proxy为proxy
	 * itm为显示依据，它可以是Number，字符串。如果是number或者可以转化成number的字符，那么优先按照数字进行判断。
	 * 2013-06-04修改，现在的匹配方式先进行全串匹配，若都没有匹配到，则进行模糊匹配
	 * 如果为字符串，将按照字符串进行匹配。匹配按照data中的数据进行依次匹配，只要匹配到一个合法的选项，后面的匹配工作就停止了。
	 * data中的匹配的顺序是val,name,assist,others,从data的第一个数据进行。
	 * 回调函数为选择某项做的操作，回调参数：$input,$proxy。
	 * 回调函数中的this为data中的匹配的选项，data格式见主方法说明
	 */
	$.tui.checkTuiSuggestItem = function (target, itm, callback, isTrigger){
		var $this, $input, $proxy;
		if (target instanceof jQuery){
			$this = target;
		} else {
			$this = $('#' + target);
		}
		if ($this.length != 1){
			return;
		}
		var id = $this.attr('id'),
			proxy = id + "Proxy";
		$proxy = $('#' + proxy);
		$input = $this;
		if ($proxy.length != 1){//没有找到proxy，认为是普通的input框
			$proxy = $input;
		}
		//根据itm进行查询
		var data = $.tui.getTuiSuggestData($input);//获得数据
		if (!data) return;
		var num = -1;//用于保存需要显示哪个数据的
		if (typeof(itm) == "number" && $.isNumeric(itm)){
			if (itm < 0){
				return;
			}
			num = itm >>> 0;
			if (num >= data.length){//如果是无效的数字，则不行操作
				return;
			}
		} else {//按照关键字进行查找
			var condition = null;
			for (var i = 0; i < data.length; i++){
				var iVal = data[i]['val'],
					iName = data[i]['name'],
					iAssist = data[i]['assist'],
					iOthers = data[i]['others'];
				condition = (
					(iVal && iVal == itm) ||
					(iName && iName == itm) ||
					(iAssist && iAssist == itm) ||
					(iOthers && iOthers == itm)
				);//判断每一个数据的是否存在的条件
				if (condition){
					num = i;
					break;
				}
			}
			for (var i = 0; (!condition) && (i < data.length); i++){
				var iVal = data[i]['val'],
					iName = data[i]['name'],
					iAssist = data[i]['assist'],
					iOthers = data[i]['others'];
				condition = (
					(iVal && iVal.indexOf(itm) >= 0) ||
					(iName && iName.indexOf(itm) >= 0) ||
					(iAssist && iAssist.indexOf(itm) >= 0) ||
					(iOthers && iOthers.indexOf(itm) >= 0)
				);//判断每一个数据的是否存在的条件
				if (condition){
					num = i;
					break;
				}
			}
		}
		if (num < 0){//一个也没找到
			return;
		}
		//执行默认的处理，val放置到input中，name放置到proxy中，如果是默认的单个input模式，最终的input会被赋值name
		$input.val(data[num]['val']);
		$proxy.val(data[num]['name']);
		if (typeof(callback) === 'function'){
			//用于回调的准备
			callback.call(data[num], $input, $proxy);
		}
	}
	/*
	 * 设置suggest需要显示的数据。所有的选项数据都保存在$input的data中，格式见tuiSuggest注释说明。
	 * tuiSuggest支持即时更换数据，因此，所有的数据显示部分，都保存在data中。该方法是用于设置已经存在的input中的某个数据的
	 * 参数：target,data，参数说明：需要更换数据的对象，jQuery或String类型
	 */
	$.tui.setTuiSuggestData=function(target,data){
		if(target instanceof jQuery){
			var $input=target;
		}else{
			var $input=$('#'+target);
		}
		if($input.length<1){
			return;
		}
		$input.data('data',data);
	}
	/*
	 * 获得所有选项的data，target为jQuery或者String
	 */
	$.tui.getTuiSuggestData = function (target){
		var $input = $(target);
		if ($input.length < 1){
			return;
		}
		return $input.data('data');
	}
})($)
 