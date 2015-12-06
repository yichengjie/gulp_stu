// JavaScript Document
/*
 * 处理左右table布局的方法
 * 该处理方法是将右侧变小。右侧的宽度在table中的rightwidth属性中记录。
 * 2013-04-07 支持IE下的滑动效果了。
 * 2013-05-29 doReset增加第二个参数form用于去掉因tuiValidater出现的label标签
 * 2013-06-24 增加了IE7下因position:relative未重绘的错误。
 * 2013-07-02 增加了常用的table_noramal表格下的全选按钮的相关操作。
 * 2013-10-14 版本更新，去掉了live方法，以适应jquery1.10.2
 * 2013-11-05 bug fix
 * 2013-11-28 增加了屏蔽backspance的方法-modified in 2013-12-12
 * 
 */
var printErr = function (str, err){
	console && console.warn(str + ' have some problem. Err=' + (err && err.toString()))
};
function tuiSetDivide(){
	try{
		var ANIMATE_TIME = 300;
		$(document).off('click.tuiUtil', '.divide_btn').on('click.tuiUtil', '.divide_btn', function (){
		//$('.divide_btn').die('click.tuiInit').live('click.tuiInit',function(){
			if ($.tui.isIE6()){//由于该方法在IE6上存在其他的兼容bug，目前不提供该功能
				return;
			}
			var $this = $(this),
				$table = $this.parents('.table_lr_layout'),
				$left = $('.left', $table),
				$right = $('.right', $table);
			if ($table.length != 1){
				printErr('table left and right, $table is not the one');
				return;
			}
			if ($left.length != 1 || $right.length != 1){
				printErr('table left and right, $left or $right is not the one')
				return;
			}
			if ($right.is(':animated')){
				return;
			}
			if ($this.hasClass('right_btn')){//一开始的打开状态
				$right.children().hide();
				$right.animate({width:0}, ANIMATE_TIME);
				$left.children().show();
				$this.removeClass('right_btn').addClass('left_btn');
			} else {//处于右侧关闭状态
				var w = $table.attr('rightwidth');
				$right.animate({width:w}, ANIMATE_TIME, function (){
					$right.children().show();
				});
				$this.removeClass('left_btn').addClass('right_btn');
			}
		})
	} catch (e){}
}
function tuiDivideRefresh(id){
	try{
		var $this = $("#" + id),
			$table = $this.parents('.table_lr_layout'),
			$left = $('.left', $table),
			$right = $('.right', $table);
		if ($table.length != 1){
			printErr('table left and right, $table is not the one');
			return;
		}
		if ($left.length != 1 || $right.length != 1){
			printErr('table left and right, $left or $right is not the one')
			return;
		}
		if ($right.is(':animated')){
			return;
		}
		var rightHeight = $right.height();
		$left.children().css({height:rightHeight});
	} catch (e){}
	
}
//手动调用斑马线初始化
function zebraStripes(){
	if ($.tui.isIE6() || $.tui.isIE7() || $.tui.isIE8()){
		//标准表格
		$('.table_normal tbody tr').removeClass('tr_single').removeClass('tr_double');
		$('.table_normal tbody tr:even').addClass('tr_single');
		$('.table_normal tbody tr:odd').addClass('tr_double');
		//纵向表格
		$('.table_normal_vertical tbody tr:odd').addClass('tr_single');
		$('.table_normal_vertical tbody tr:even').addClass('tr_double');
		$('.table_normal_vertical tbody th:odd').addClass('th_single');
		$('.table_normal_vertical tbody th:even').addClass('th_double');
	}
}

//2012-12-27将原来的ts_util.js内容复制过来
/**
 * 重置文本框
 * 
 * @param ids
 *            要重置的页面元素ID数组
 */
function doReset(ids, form){
	for (var i = 0; i < ids.length; i++){
		$("#" + ids[i]).val("");
	}
	try {
		form ? $('#' + form).tuiValidator({isClearError:true}) : $('body').tuiValidator({isClearError:true});
	} catch (e){}
};
/**
 * 金额格式化
 * 
 * @param s
 *            要格式化的金额
 * @param n
 *            小数点位数
 * @returns {String} 格式化之后的金额
 */
function convertToDoubleValue(s, n){
      if (null == s || s.length <= 0){
	     return "";
	  } else {
		 var value = parseFloat(s.replace(/[^\d\.-]/g, ""));
         if (isNaN(value) == true){
            alert("输入值不合法,请修改!");
			return "";
         } else {
             n = n > 0 && n <= 20 ? n : 2;  
		     s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";  
		     var l = s.split(".")[0].split("").reverse(),  
		     r = s.split(".")[1];  
		     t = "";  
		     for(i = 0; i < l.length; i ++ )  
		     {  
		     t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
		     }  
		     return t.split("").reverse().join("") + "." + r;  
         }
	  }
 };
 
// ==========================================
// Purpose:把字符串转化为整数
// 参数:s--要转化为整数的字符串
// 返回值:转化后的整数
// 说明：JavaScript自带的函数对于处理数字字符串前带0或为0的有误，
// 如使用parseInt("0025")返回的并不是25，而是21,又如parseInt("0")返回并不是0，而是NaN
// 下面的自定义函数可以处理这一Bug
// 调用方法:
// ==========================================

function parseMyInt(s)
{
	var str = s;
	if (str == "") return 0;
	try{
		for (var i = 0;i < str.length; i++){
			if (str.charAt(0) != '0')
				break;
			else
				str = str.substring(1, str.length);
		}
		if (str == "")
			return 0;
		else
			return parseInt(str);
	} catch (e){
		return 0;
	}
}
// in:date:yyyy-mm-dd
// out:yyyy年mm月dd日
function formatChineseDate(date)
{
   if (date == "") return "";
   var dateArr = date.split("-");
   var year = dateArr[0];
   var month = dateArr[1];
   var day = dateArr[2];
   return (year + "年" + parseMyInt(month) + "月" + parseMyInt(day) + "日");
}

// ==========================================
// 功能: 清空subwindow里文本框、下拉框、日期控件的值
// 返回值:无
// args不清空的控件数组
// 调用方法: 添加重置按钮事件resetSubwindow()
// ==========================================
function resetForm(args){
	with (this.event.srcElement.parentElement) {
		for (var i = 0; i < children.length; i++){
			objField = children[i];
			var isReset = true;
			if(args !=undefined){
				for (var k = 0; k < args.length; k++){
					if (objField.id.indexOf(args[k]) != -1){
						isReset = false;
						break;
					}
				}
			}
			// 包含不清空的控件则跳过
			if (!isReset)
				continue;
			if (objField.type == 'text' && objField.style.display != 'none'){
				objField.value = '';
		    } else if (objField.type == 'select-one'){
				objField.selectedIndex = 0;
			}else if (objField.type == 'checkbox')
				objField.checked = false;
		}
	}
}
// ==========================================
// 功能: 增加回车查询事件
// cmd:按回车所触发的command事件
// 返回值:无
// 调用方法: SubWindow_Search.onkeydown =
// function(){attachEnterEvent(Command_Search);}
// SubWindow_Search为查询容器
// ==========================================
function attachEnterEvent (cmd) {
	if (this.event.keyCode == 13 || event.keyCode == 16777296){// 对应两个enter键的ACSII码
		Command_Search.execute();
	}
}

// 金额以逗号隔开的形式显示
function floatToStr (nStr){
	if (isNaN(nStr))
		return '0.00';
	nStr = nStr.toFixed(2);// precition
	nStr += '';// to string
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
	
function str2Float (nStr){
	if (isNaN(nStr))
		return 0.00;
	else
		return (parseFloat(nStr)).toFixed(2);
}
/**
 * 将日期型字符串转为日期型变量
 */

function ConvertStrToDate(_dateStr){
	var datePat = /^(\d{4})-(\d{1,2})-(\d{1,2})/; // Like '2005-10-9' patten;
													// matchArray[1]~3 =>
													// year,month,day
	var matchArray = _dateStr.match(datePat); // date is the format ok?
	if (matchArray == null) 
	{
		// alert(_dateStr + " Date is not in a valid format.")
		return false;
	}
	_year = matchArray[1]; // parse date into variables
	_month = matchArray[2]-1; // month {0..11}
	_day = matchArray[3];
	
	var timePat = /(\d{1,2}):(\d{1,2})/;  // Like '18:20' patten;
											// matchArray[1]~2
											// => hour,minute
	matchArray = _dateStr.match(timePat); // time is the format ok?
	if (matchArray == null) 
	{
		_hour=0;
		_minute=0;
	}
	else{
		_hour = matchArray[1]; // parse date into variables
		_minute = matchArray[2];
	}
	return new Date(_year,_month,_day,_hour,_minute);
}

/*
 * 将日期型变量转换为标准字符串 *
 */
function FormatDateToStr(_startTime)
{
	var _strDate = _startTime.getYear();
	_strDate = _strDate + '-' + (_startTime.getMonth() > 8 ? _startTime.getMonth() + 1 : '0' + (_startTime.getMonth() + 1));
	_strDate = _strDate + '-' + (_startTime.getDate() > 9 ? _startTime.getDate() : '0' + _startTime.getDate());
	_strDate = _strDate + ' ' + (_startTime.getHours() > 9 ? _startTime.getHours() : '0' + _startTime.getHours());
	_strDate = _strDate + ':' + (_startTime.getMinutes() > 9 ? _startTime.getMinutes() : '0' + _startTime.getMinutes());
	return _strDate;
}
/**
 * 验证是否存在重复
 * 
 * @param obj
 *            待验证的字符串 
 * @returns 是无重复返回true，否则为false           
 */
function isNotRepeat(obj){
	var tempArr = new Array();	
    for (var i = 0; i < obj.length; i++){     
        if (tempArr.join('').indexOf(obj.charAt(i)) == -1)     
            tempArr[tempArr.length] = obj.charAt(i);  
        else
           return false;
    }     
    return true;  
}

/**
 * 进行日期的计算
 * @param _date 传入日期格式为YYYY-MM-DD
 *        adddays 增加天数用正数，减少天数用负数
 * @returns 返回日期格式为YYYY-MM-DD
 */
function getAddDate(_date, adddays) {
	_date = _date.replace('-','/').replace('-','/');
	var day = new Date(_date);
	if(!adddays) adddays = 0;
	day.setDate(day.getDate()+adddays);	
	var Year = 0; 
	var Month = 0; 
	var Day = 0; 
	var CurrentDate = ""; 
	//初始化时间 
	Year= day.getFullYear();//ie火狐下都可以 
	Month= day.getMonth() + 1; 
	Day = day.getDate(); 
	CurrentDate += Year + "-"; 
	if (Month >= 10 ){ 
		CurrentDate += Month + "-"; 
	} else { 
		CurrentDate += "0" + Month + "-"; 
	} if (Day >= 10 ){ 
		CurrentDate += Day ; 
	} else { 
		CurrentDate += "0" + Day ; 
	} 
	return CurrentDate; 
} 
/**
 * 根据日期的返回星期几
 * @param _date 传入日期格式为YYYY-MM-DD
 * @returns 数字0-6，表示星期天、星期一……星期六
 */
function getweek(_date){
	var _d = _date.split('-');
	var dt = new Date(_d[0], _d[1]-1, _d[2]);
	return dt.getDay();
}
/**
 * 比较两个日期的大小前
 * 
 * @param sDate,eDate 待比较的两个日期，格式要求为yyyy-mm-dd
 *             
 * @returns 当sDate小于等于eDate时，返回true，否则为false
 */
function checkDate(sDate, eDate){
	var asDate = sDate.split('-'); //转成成数组，分别为年，月，日，下同
    var aeDate = eDate.split('-');
	var isDate = asDate[0] + asDate[1] + asDate[2];
	var ieDate = aeDate[0] + aeDate[1] + aeDate[2];
	if (isDate > ieDate){
		return false;
	}
	return true;
}

/**
 * 返回给定日期的周一日期
 * @param _date
 * @returns
 */
function getMonday(_date){
	var day = getweek(_date);
	var days = (day + 6) % 7 * (-1);
	return getAddDate(_date, days);
}
/**
 * 用于创建或修改日历的公共方法，但table的标签id必须为datePannel
 * @param paraStr 参数为一个字符串，格式yyyy-mm-dd，如果为空，则创建当前日期的日历。没有验证功能
 * @returns
 */
function ts_buildDateCalander(paraStr, minDate, maxDate){
	var nDate, Y, M, D, dayOfWeek, today, dateStr, currDateStr;
	var timeStr = paraStr.split('-');
	if (timeStr.length != 3){
		nDate = new Date();
		Y = nDate.getFullYear();
		M = getDateFormat(nDate.getMonth()+1);
		D = getDateFormat(nDate.getDate());
		dayOfWeek = nDate.getDay();
		today = 0;
		dateStr = String(Y) + "-" + M + "-" + D;
		currDateStr = dateStr;
	} else {
		Y = timeStr[0];
		M = timeStr[1];
		D = timeStr[2];
		tempStr1 = paraStr.replace(/\-/g,'/');
		nDate = new Date(tempStr1);
		dayOfWeek = nDate.getDay();
		dateStr = Y + "-" + M + "-" + D;
		currDateStr = dateStr;
		today = 0;
	}
	today = dayOfWeek;
	$('#datePannel tbody td').eq(today).unbind().text(dateStr).addClass('current');
	
	var maxDay = new Date(maxDate.replace(/-/g,'/'));//得到时间范围的最大值
	var minDay = new Date(minDate.replace(/-/g,'/'));//得到时间范围的最小值

	//向前循环输入时间
	for (i = today - 1; i >= 0; i--){
		dateStr = getAddDate(dateStr, -1);
		//获得循环的时间
		var tday = new Date(dateStr.replace(/-/g, '/'));
		if (tday >= minDay){
			$('#datePannel tbody td').eq(i).text(dateStr).unbind().css({backgroundColor:'#FFF', color:'#000'}).hover(
				function (){
					$(this).css({backgroundColor:'#09F', cursor:'pointer'});
				}, function (){
					$(this).css({backgroundColor:'transparent'});
				}
			).bind('click', {dateString:dateStr}, onSelect);
		} else {
			$('#datePannel tbody td').eq(i).text(dateStr).css({backgroundColor:'#FFF', color:'#999'}).unbind();
		}
	}
	dateStr = currDateStr;
	for (i = today + 1; i < 14; i++){
		dateStr = getAddDate(dateStr, 1);
		//获得循环的时间
		var tday = new Date(dateStr.replace(/-/g,'/'));
		if (tday <= maxDay){
			$('#datePannel tbody td').eq(i).text(dateStr).unbind().css({backgroundColor:'#FFF', color:'#000'}).hover(
				function (){
					$(this).css({backgroundColor:'#09F', cursor:'pointer'});
				}, function (){
					$(this).css({backgroundColor:'transparent'});
				}
			).bind('click', {dateString:dateStr}, onSelect);
		} else {
			$('#datePannel tbody td').eq(i).text(dateStr).css({backgroundColor:'#FFF', color:'#999'}).unbind();
		}
	}
}
/**
 * 返回一个合适的日期格式，如将1变成01，2变成02
 * @param str int型
 * @returns
 */
function getDateFormat(str){
	var temp = "";
	if (str < 10 && str > 0){
		temp += "0";
	}
	temp += String(str);
	return temp;
}
/**
 * 阻止冒泡，IE Firefox有效
 * added by mabo
 */
function preventBubble (obj, evt) { 
	var e = (evt) ? evt : window.event; 
	if (window.event) { 
		e.cancelBubble = true; 
	} else { 
		e.stopPropagation(); 
	} 
}
/**
 * 针对应用内部需要打开新的窗口，该方法获得当前窗口所在屏幕的id
 */
function getCurrentDesk(){
	return '#' + top.window.$('.desk_current').attr('id');
}

//获得班期
function getfrequence(itemName){
	var result = '',
		checks = document.getElementsByName(itemName);
	for(var i=0; i<checks.length; i++){
		if(checks[i].checked){
			result = result + checks[i].value; 
		}
	}
	return result;
} 
/**
 * 针对IE7，position:relative的元素在动画结束后出现的未重排的bug进行处理
 */
function reflowForIE(){
	if ($.tui.isIE6() || $.tui.isIE7()){
		var _body = document.body;
		_body.className = _body.className;
	}
}
/*
 * 该方法用于处理常用表格中的全选按钮方法。这个方法会将点击某一行自动选中checkbox的事件等进行绑定。
 * 注：该方法依赖tui_check_all.js，请保证在执行tuiBindCheckAll方法后再执行该方法。
 */
function tuiTableCheckboxSelected (tableId, checkAllId, others){
	var $trs = $('#' + tableId + " tbody tr"),
		$checkAll = $('#' + checkAllId),
		checkBgClass = 'helper_background_color10';
	if (!$trs.length) {
		console && console.log('not found tableId or no tr in table');
		return false;
	}
	if (!$checkAll.length) {
		console && console.log('not found checkall checkbox');
		return false;
	}
	//绑定所有tr的事件
	$trs.off('click.tuiUtil').on('click.tuiUtil', function (e) {
		var $this = $(this),
			$chk = $this.find(':checkbox');
		if ($(e.target).attr('type') != 'checkbox') {
			if ($chk.is(':checked')) {
				$chk.prop('checked', false);
			} else {
				$chk.prop('checked', true);
			}
			$chk.trigger('tuiClick');
		}
		if ($chk.is(':checked')) {
			$this.addClass(checkBgClass);
		} else {
			$this.removeClass(checkBgClass);
		}
	});
	//绑定checkall的事件
	$checkAll.off('click.tuiUtil').on('click.tuiUtil', function(){
		var $this = $(this),
			$allTrs = $trs;
		if ($this.is(':checked')) {
			$allTrs.addClass(checkBgClass);
		} else {
			$allTrs.removeClass(checkBgClass);
		}
	});
}
/*
 *  屏蔽退格键对页面的影响，但是要排除输入框和textarea的情况，同时要支持eterm黑屏的退格键
 */
function tuiCancelBackspace (){
	var backspace = function (event){
		var target = event.target || event.srcElement,//事件源
			type = target.type || target.getAttribute('type');
		var readOnly = target.readOnly,
			disabled = target.disabled;
		var keyCode = event.keyCode ? event.keyCode : event.which;
		var con1, con2;
		if (!readOnly){
			readOnly = false;
		}
		if (!disabled){
			disabled = false; 
		}
		if ($(target).attr('contenteditable') == 'true'){//eterm黑屏
			return true;
		}
		if ((/MSIE (\d)\./i.test(navigator.userAgent)) && ($(target).parent().parent().parent().attr('id') == 'bscontainer')){//IEeterm黑屏
			return true;
		}
		//只有在password，text和textarea的情况下才能使用退格键
		con1 = (keyCode == 8 && (type == 'password' || type == 'text' || type == 'textarea') && (readOnly || disabled));
		con2 = (keyCode == 8 && (type != 'password' && type != 'text' && type != 'textarea'));
		if (con1 || con2){
			return false;
		}
	};
	$(document).off('keydown.tuiUtil').on('keydown.tuiUtil', backspace);//必须是keydown事件，退格键的默认事件已经生效
}





