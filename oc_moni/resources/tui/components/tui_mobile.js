/*
 * author:machi
 * 该JS负责项目使用IPad等移动设备浏览器打开时的操作。
 */
/*
 * 该方法将content的宽度进行设定，用于解决ipad上iframe无法scroll的问题
 */
$(document).ready(function(){
	var $content=$('.content');
	if($content.length==1){
		var h=$(window).height();
		var w=$(window).width();
		var style=$content.attr('style')||"";
		style+="overflow:auto;-webkit-overflow-scrolling: touch;height:"+h+"px;width:"+w+"px;";
		$content.attr('style',style);
	}
});