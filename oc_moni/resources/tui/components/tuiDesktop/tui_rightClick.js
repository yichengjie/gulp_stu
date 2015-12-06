// JavaScript Document  桌面上的右键菜单
;(function($){
	$.extend($.fn,{
		rightClick:function(option){
			var _self=this;
			var _defaults = {
				rightmenuId:null,
				xOffset:null,
				yOffset:null
			};
			var settings = $.extend({},_defaults,option);
			var $rightmenu=$("#"+settings.rightmenuId);
			var xOffset=settings.xOffset;
			var yOffset=settings.yOffset;
			return this.each(function(){// oncontextmenu是右键事件
				this.oncontextmenu=function(event){
					var evt=window.event || event;
					var windowWidth=$(window).width(),windowHeight=$(window).height(),rightmenuHeight=$rightmenu.height(),rightmenuWidth=$rightmenu.width();
					var x=evt.clientX;
					var y=evt.clientY;
					if(windowWidth-x<rightmenuWidth){ x=x-rightmenuWidth;}
					if(windowHeight-y<rightmenuHeight) {y=y-rightmenuHeight;}
					if(xOffset){
						try{
							x=x+parseFloat(xOffset);
						}catch(e){console.log(e);}
					}
					if(yOffset){
						try{
							y=y+parseFloat(yOffset);
						}catch(e){console.log(e);}
					}
					$rightmenu.css({
						top:y,
						left:x
					}).show();
					return false;
				};
				$(document).click(function(){$rightmenu.hide();});	
			});//return结束
		}
	});//extend结束
})(jQuery);