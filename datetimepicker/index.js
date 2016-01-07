$(function(){

   /*$.datetimepicker.setLocale('en');
   jQuery('#datetimepicker').datetimepicker({
   	i18n:{
   		en:{
		   months:[
		    '一月','二月','三月','四月',
		    '五月','六月','七月','八月',
		    '九月','十月','十一月','十二月',
		   ],
		   dayOfWeek:[
		    "日", "一", "二", "三", 
		    "四", "五", "六"
		   ]
	  }
   	}
   });*/
	$.datetimepicker.setLocale('zh') ;
	jQuery('#datetimepicker').datetimepicker({
	 	timepicker:true,
	 	format:'Y-m-d H:i'
	});



}) ;


function test (argument) {
	jQuery('#datetimepicker').datetimepicker('show') ;
}