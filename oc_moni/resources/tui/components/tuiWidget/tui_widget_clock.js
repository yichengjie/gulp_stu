/**                                                    
 * tuiWidgetClock是用于新版本首页的桌面工具，用于显示一个时钟。
 * 该时钟采用canvas进行绘图。针对IE678版本则显示HH:MM的文字。
 * 该方法依赖jquery.js，同时需要在该方法前引入tui_core.js文件        
 * Copyright: Copyright (c) 2012                       
 * Company: 中国民航信息网络股份有限公司               
 * @author  cma@travelsky.com 马驰                  
 * @version 0.10.1BETA                      
 * @see                                                
 *	HISTORY                                            
 * 2012-12-11 创建文件
 * 2012-12-12 增加了时区设置。获取时间的方法统一到2个方法中
 * 2013-02-06 时区可以传入小数，识别+-符号
 * 2013-04-01 版本更新，更换了时钟样式，表盘不进行绘图了。
 */
;(function($){
	$.tui=$.tui||{};
	$.tui.tuiWidgetClock=function(){
		var _default={
			target:'',//需要初始化的目标，可以为String，也可以是jQuery类型的。如果是String，必须是id名
			axesW:500,//canvas画布的坐标宽度，注意：此宽度不是canvas的实际宽度，是canvas中坐标轴的宽度
			axesH:500,//canvas画布的坐标高度，注意，此高度不是canvas的实际高度，是canvas中坐标轴的高度
			radius:200,//钟表的半径。注意，长度是canvas的坐标长度，不是真实的长度
			showSecond:true,//是否显示秒针。注意，在低版本浏览器下，即使为true也不会显示数字秒数
			utcArea:8//时区，默认是北京时间，东8区，为8，如果是西八区，则为-8。
			},
			settings=$.extend({},_default),
			$panel,//时钟需要放置的容器
			$clock,//时钟本身
			pen,//用于绘图的笔
			flag=false;//在IE678时，出现数字表盘，存在一个：闪烁的动画效果。记录动画标记
		//参数准备-----------
		for(var i=0;i<arguments.length;i++){
			settings=$.extend(settings,arguments[i]);
		}
		//添加canvas画布
		var addCanvas=function(){
			var $this=$panel,
				canvasId=$this.attr('id')+"Canvas";
			if($.tui.isIE678()){return;}//如果是IE678版本，则不添加canvas
			var canvasHtml='<canvas width="'+settings.axesW+'" height="'+settings.axesH+'" id="'+canvasId+'" class="tui_widget_clock_canvas"></canvas>',
				$canvas=$(canvasHtml).appendTo($this);
			pen=$canvas.get(0).getContext('2d');
		};
		//获得小时数，同时计算出分钟的增量，flag为标记，如果为true，则返回分钟的增量，如果为false，则返回原始值。
		var getHour=function(flag){
			var now1=new Date(),
				now=new Date(now1.getTime()+now1.getTimezoneOffset()*60000+settings.utcArea*3600000),//设置时区差的时间
				m=now.getMinutes(),
				h=now.getHours();
			if(!flag)
				h+=m/60;
			return h;
		};
		//获得分钟数，同时计算出秒分量
		var getMinute=function(flag){
			var now1=new Date(),
				now=new Date(now1.getTime()+now1.getTimezoneOffset()*60000+settings.utcArea*3600000),
				m=now.getMinutes(),
				s=now.getSeconds();
			if(!flag)
				m+=s/60;
			return m;
		};
		//获得秒数。
		var getSecond=function(){
			var now=new Date();
			return now.getSeconds();
		}
		//绘图函数
		var draw=function(){
			//获得钟表的点,r为半径，per为角度百分比（时间在钟表一周所在的位置，例如per=min/60）,返回对象res[x,y]。校对后的坐标
			var getPosition=function(r,per){
				var angle=per*2*Math.PI-Math.PI/2,
					result={
						x:r*Math.cos(angle),
						y:r*Math.sin(angle)
					}
				return result;
			}
			//绘图时是将逻辑坐标轴移动到canvas的中央，因此，在绘图的时候，需要将坐标转化为真实的坐标
			var relX=settings.axesW/2,
				relY=settings.axesH/2,
				r=settings.radius,
				now=new Date();
			//清除
			pen.clearRect(0,0,settings.axesW,settings.axesH);
			//阴影
			pen.shadowOffsetX=2;
  			pen.shadowOffsetY=2;
  			pen.shadowBlur=4;
  			pen.shadowColor="rgba(0,0,0,0.5)";
			//绘制分针
			var minute=getPosition(180,getMinute()/60);
			pen.beginPath();
			pen.lineWidth=10;
			pen.strokeStyle="#e97575";
			pen.lineCap="round";
			pen.moveTo(relX,relY);
			pen.lineTo(minute.x+relX,minute.y+relY);
			pen.stroke();
			//绘制时针
			var hour=getPosition(100,(getHour()%12)/12);
			pen.beginPath();
			pen.lineWidth=16;
			pen.strokeStyle="#e97575";
			pen.lineCap="round";
			pen.moveTo(relX,relY);
			pen.lineTo(hour.x+relX,hour.y+relY);
			pen.stroke();
			//绘制秒针
			if(settings.showSecond){
				var hour=getPosition(200,now.getSeconds()/60);
				pen.beginPath();
				pen.lineWidth=4;
				pen.strokeStyle="#e97575";
				pen.lineCap="round";
				pen.moveTo(relX,relY);
				pen.lineTo(hour.x+relX,hour.y+relY);
				pen.stroke();
			}
			//绘制四个标志点，上右下左的刻钟
			/*pen.strokeStyle="#c8c8c8";
			pen.lineWidth=18;
			for(var i=0;i<360;i+=90){
				pen.beginPath();
				var quarterFrom=getPosition(relX-36,i/360);
				var quarterTo=getPosition(relX-18,i/360);
				pen.moveTo(quarterFrom.x+relX,quarterFrom.y+relY);
				pen.lineTo(quarterTo.x+relX,quarterTo.y+relY);
				pen.stroke();
			}*/
			//绘制中心点
			pen.beginPath();
			pen.lineWidth=1;
			pen.strokeStyle="#cecece";
			var gre=pen.createRadialGradient(relX,relY,0,relX,relY,25);//圆心渐变
			gre.addColorStop(0,'#c2c2c2');
  			gre.addColorStop(1,'#fafafa');
			pen.fillStyle=gre;
			pen.arc(relX,relY,15,0,2*Math.PI);
			pen.fill();
			pen.stroke();
		}
		//添加数字表盘
		var addNumberPanel=function(){
			var $this=$panel,
				numId=$this.attr('id')+"Num",
				secId=$this.attr('id')+"Sec";
			if(!$.tui.isIE678()){return;}
			var numHtml='<div class="tui_widget_clock_time" id="'+numId+'"></div>',
				secHtml='<div class="tui_widget_sec" id="'+secId+'">58</div>';
			$('.tui_widget_clock_inner',$this).append(numHtml);
			$('.tui_widget_info',$this).prepend(secHtml);
			$panel.removeClass('common').addClass('digital');
		}
		//将1位数字变成两位数字
		var dealNumber=function(str){
			if((str+"").length<2){
				return "0"+str;
			}else{
				return str;
			}
		}
		//数字表盘中的数字显示
		var exeNumber=function(){
			var now=new Date(),
				h=dealNumber(getHour(true)),
				m=dealNumber(getMinute(true)),
				s=dealNumber(getSecond()),
				numId=$panel.attr('id')+"Num",
				secId=$panel.attr('id')+"Sec"
				str=h+" "+m;
			/*if(flag){
				str=h+":"+m;
				flag=false;
			}else{
				str=h+" "+m;
				flag=true;
			}*/
			$('#'+numId).html(str);
			$('#'+secId).html(s);
		}
		//----------主方法----------
		if(settings.target instanceof jQuery){
			$panel=settings.target;
		}else{
			$panel=$('#'+settings.target);
		}
		//判断浏览器版本
		if(!$.tui.isIE678()){
			addCanvas();//添加画布，并且开始时钟的运行
			draw();
			setInterval(draw,1*1000);
			//draw();
		}else{//IE早起版本，不支持canvas，采用数字的方式显示
			addNumberPanel();
			exeNumber();
			setInterval(exeNumber,1*1000);
		}
		
	}
})(jQuery)