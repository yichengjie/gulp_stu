/*
 * 使用html5的形式显示曲线图
 * @Copyright: Copyright (c) 2013
 * @Company: 中国民航信息网络股份有限公司
 * @author: 党会建  
 * @see 
 *	HISTORY
 *  2013/5/21  创建文件
 *  2013/5/21  原来传输数据格式为{"CZ3102":{"11:02":"20","11:04":"40","11:06":"60"},"CZ3105":{"11:02":"20","11:04":"80","11:06":"100"}}
 因为后台数据格式不容易拼合，所有改变了格式数据格式为[{"CZ3102":[{"11:02":"20"},{"11:04":"40"},{"11:06":"60"}]},{"CZ3102":[{"11:02":"20"},{"11:04":"40"},{"11:06":"60"}]}]
 * 2013/5/22 自动识别横纵标的宽度，适当裁剪一些显示
 * @version 0.6 2013/5/23 纵轴如果用户不指定，能够自适应
 * @version 0.8 2013/6/26 鼠标单击数据点提示应该包含多个类型，提示位置在下面时自动到上面
 * @version 1.0 2013/7/5 修改bugs,如果出现变化曲线变化不显示
 * @version 1.0.1 2013/7/8 修改bugs,宽度调整
 * @version 1.1.0 2013/7/16 y轴上，如果最大值和最小值一样，需要处理，默认就是最大值是做小值的1.5倍
 * @version 1.1.1 2013/7/18  将pen=null,减少内存占用
 */
   
;(function($){
	$.tui=$.tui||{};
	$.tui.graph=function(){
		var _default={
				target:'',//需要初始化的目标，可以为String，也可以是jQuery类型的。如果是String，必须是id名
				canvasWidth:470,//canvas画布的坐标宽度，注意：此宽度不是canvas的实际宽度，是canvas中坐标轴的宽度
				canvasHeight:210,//canvas画布的坐标高度，注意，此高度不是canvas的实际高度，是canvas中坐标轴的高度
				type:"curve",//类型，画曲线图curve
				dataColors:["#4a8cda","#4cdb4b","#2ab2cc","#e57930","#cdcb14","#ff0000","#00ff05","#333333"],
				title:"",
				tipId:"tip",
				beginX:45,//开始显示图形的起止点
				beginY:10,
				axesYTitle:["0","20","40","60","80","100"],//要求必须等分，自己取上下2个值
				yTitleDivision:6,//Y轴上有多少个点，在axesYTitle不设置的时候起作用
				yTitleXPosion:15,//y轴说明的起点位置
				yTitleDecimalPlaces:2,//Y轴上的小数点位数，，在axesYTitle不设置的时候起作用
				axesTitleColor:"#a7a7a7",
				axesColor:"#e5e5e5",
				rectColor:"#bdc7e0",
				rightRange:10,//右侧的距离
				xTitleAdjust:-12,//横坐标标题的位置，负数是左移
				xTitleAuto:true,//横坐标的标题，自动决定显示，如果很多会减少一个title的显示
				xTitleOneWidth:7,//2个11px数字和字母的宽度相当于一个汉字12px,判断缩减时，以数字和字符为准，里面默认是12px
				bottomRange:55,//下面图形的距离
				datas:null,
				nullDataFlag:"-1",//空数据标识位
				maxMinRate:1.5,//最大值和最小值一样，把最大值设置的倍数关系
				dataPointRadius:6,//数据圆圈半径
				categoryOneWidth:60,//一个种类描述的宽度
				categoryDescWidth:8,//图例的宽度
				categoryFontSize:"14px",//种类描述字体大小
				descX:"",//x轴上说明
				descY:"",//y轴上说明
				descAttr:"info",//提示中除了x y上外，需要加的数据中属性的名称
				descAttrTitle:"变化",
				seriesType:"1"//2数值，1代表百分号。如果是百分号，需要把百分号加在说明上
			},
			settings=$.extend({},_default),
			$panel,descDatas={},//坐标提示时，使用的对象 {"坐标x,坐标y":{"CZ3151":{时间:"12:00","客座率":"23"},},}
			flag=false;//在IE678时，出现数字表盘，存在一个：闪烁的动画效果。记录动画标记
		//参数准备-----------
		for(var i=0;i<arguments.length;i++){
			settings=$.extend(settings,arguments[i]);
		}
		//添加canvas画布
		var canvasHeight=settings.canvasHeight,canvasWidth=settings.canvasWidth,beginX=settings.beginX,beginY=settings.beginY,rightRange=settings.rightRange,bottomRange=settings.bottomRange,axesYTitle=settings.axesYTitle,datas=settings.datas,nullDataFlag=settings.nullDataFlag,axesColor=settings.axesColor,axesTitleColor=settings.axesTitleColor,xTitleAdjust=settings.xTitleAdjust,dataColors=settings.dataColors,dataPointRadius=settings.dataPointRadius,categoryDescWidth=settings.categoryDescWidth,categoryFontSize=settings.categoryFontSize,categoryOneWidth=settings.categoryOneWidth,descX=settings.descX,descY=settings.descY,tipId=settings.tipId,xTitleAuto=settings.xTitleAuto,xTitleOneWidth=settings.xTitleOneWidth,seriesType=settings.seriesType,descAttr=settings.descAttr,descAttrTitle=settings.descAttrTitle;
		if(!datas){return false;}
		var axesXMax=canvasWidth-rightRange,axesYMax=canvasHeight-bottomRange,yTitleValue=[];
			//实际范围内坐标的宽和高,yTitleValue仅仅存值，不含百分比  
		var axesWidth=axesXMax-beginX,axesHeight=axesYMax-beginY;
		var pen,canvasId,oneAxesYvalue=0,oneAxesXvalue=0,xyEventResponse=[];
		var addCanvas=function(){
			var $this=$panel;
			canvasId=$this.attr('id')+"Canvas";
			if($.tui.isIE678()){return;}//如果是IE678版本，则不添加canvas
			var canvasHtml='<canvas width="'+canvasWidth+'" height="'+canvasHeight+'" id="'+canvasId+'" ></canvas>',
			$canvas=$(canvasHtml).appendTo($this);
			pen=$canvas.get(0).getContext("2d");
		};
		var getJsonLength=function(jsonData){
			var jsonLength = 0;
			for(var item in jsonData){
				jsonLength++;
			}
			return jsonLength;
		};
		//如果axesYTitle为空，则自动计算最大和最小，计算axesYTitle
		var resetAxesYTitle=function(){
			if(axesYTitle&&seriesType&&seriesType==="1"){//增加百分号,如果已经有%就不再增加
				for(var i=0;i<axesYTitle.length;i++){
					var oneYTitle=axesYTitle[i];
					oneYTitle=oneYTitle.replace("%","");
					yTitleValue[i]=oneYTitle;
					axesYTitle[i]=oneYTitle+"%";
				}
			}else if(axesYTitle&&seriesType&&seriesType!=="1"){
				yTitleValue=axesYTitle;
			}else {
				var allDatas=[];//存储所有数据的数组
				//对象，来过滤数值是否重复，如果重复，则不放在数组中
				var allDatasObject={};
				var categoryLength=datas.length;//一共有多少种类
				for(var i=0;i<categoryLength;i++){//种类
					var lineDataObject=datas[i];//取出某个种类的数据点
					//取得所有的数据点
					for(var category in lineDataObject){
						var lineDataArray=lineDataObject[category];
						var lineDataLength=lineDataArray.length;
						for(var j=0;j<lineDataLength;j++ ){//数据点也是一系列数组
							var oneData=lineDataArray[j];
							for(var xTitle in oneData){//数据里面是object
								if(xTitle==descAttr){
									continue;
								}
								var nodeData=oneData[xTitle];//具体数据点
								if(nodeData===nullDataFlag||allDatasObject[nodeData]){
									continue;
								}
								try{
									allDatasObject[nodeData]=true;
									allDatas.push(parseFloat(nodeData));
								}
								catch(e){
									console.log(e);
								}
							}
						}
					}
				}//种类for结束
				//开始拼合数据axesYTitle
				var allDatasLength=allDatas.length;
				if(allDatas&&allDatasLength>0){
					allDatas.sort(function(a,b){
						return a-b;
					});
					var minValue=allDatas[0];
					var maxValue=allDatas[allDatasLength-1];
					var yTitleDivision=settings.yTitleDivision;
					if(!yTitleDivision){
						yTitleDivision=6;
					}
					var divisionCount=yTitleDivision-1;
					var decimalPlaces=settings.yTitleDecimalPlaces;
					if(!decimalPlaces){
						decimalPlaces=2;
					}
					var oneRange=Math.ceil((maxValue-minValue)*10*decimalPlaces/divisionCount)/(10*decimalPlaces);
					axesYTitle=[];
					yTitleValue=[];
					var baseMinValue=Math.floor(minValue*10*decimalPlaces)/(10*decimalPlaces);
					for(var ii=0;ii<yTitleDivision;ii++){
						axesYTitle[ii]=Math.ceil((baseMinValue+oneRange*ii)*10*decimalPlaces)/(10*decimalPlaces);
						yTitleValue[ii]=axesYTitle[ii];
						if(seriesType&&seriesType==="1"){
							axesYTitle[ii]=axesYTitle[ii]+"%";
						}
					}
				}//拼合结束
			}//if结束
			
		};
		//绘制圆角矩形
		var drawRoundRect = function (x,y,w,h,r,color) {
			if (w < 2 * r) r = w / 2;
			if (h < 2 * r) r = h / 2;
			pen.beginPath();
			pen.fillStyle=color;
			pen.moveTo(x+r,y);
			pen.arcTo(x+w,y,x+w,y+h,r);
			pen.arcTo(x+w, y+h, x, y+h, r);
			pen.arcTo(x, y+h, x, y, r);
			pen.arcTo(x, y, x+w, y, r);
			//this.arcTo(x+r, y);
			pen.closePath();
			pen.fill();
		};
		//绘制方块
		var drawRect=function(x,y,color,width,height){
			pen.beginPath();
			pen.fillStyle=color;
			pen.fillRect(x,y,width,height);
		};
		//绘制文字
		var drawText=function(text,x,y,color,fontSize){
			if(!fontSize){
				fontSize="12px ";
			}
			pen.fillStyle = color;
			pen.textBaseline ='middle';
			pen.textAlign='left'; 
			try{//firefox下如果画布隐藏，会导致报错，ff22下内存会一直增长，文字绘制不上
				pen.font=fontSize+"  Microsoft YaHei simsun sans-serif";
				pen.fillText(text,x,y);
			}catch(e){
				console.log(e);
				return false;
			}
		};
		//绘制圆点,同时这个点是否可以响应事件
		var drawPoint=function(x,y,color,radius){
			pen.beginPath();
			pen.fillStyle=color;
			pen.arc(x,y,radius,0,Math.PI*2);
			pen.fill();
		};
		//验证是否为json对象
		var isJSON=function(obj){
			var result=false;
			if(obj&&Object.prototype.toString.call(obj)==="[object Object]"&&!obj.length){
				result=true;	
			}
			return result;
		};
		//传入一个二维数组，这个里面是坐标，依据坐标画出一条线
		var drawLine=function(datas,color){
			pen.lineWidth=2;
			if(datas&&Object.prototype.toString.call(datas)==="[object Array]"){
				var length=datas.length;
				pen.beginPath();
				pen.strokeStyle=color;
				for(var i=0;i<length;i++){
					try{
						var xy=datas[i];
						var x=xy[0];
						var y=xy[1];
						if(i===0){
							pen.moveTo(x,y);
						}else {
							pen.lineTo(x,y);	
						}
					}catch(e){
						console.log(e);	
					}
				}
				//pen.closePath();//闭合路径
				pen.stroke();
			}
		};
		//绘图函数
		var drawFrame=function(){
			pen.clearRect(0,0,canvasWidth,canvasHeight);
			//阴影
			/*
			pen.shadowOffsetX=2;
  			pen.shadowOffsetY=2;
  			pen.shadowBlur=4;
  			pen.shadowColor="rgba(0,0,0,0.5)";*/
			//绘制矩形，曲线图等的外围框
			pen.lineWidth=2;
			pen.strokeStyle=settings.rectColor;
			pen.beginPath();
			pen.moveTo(beginX,beginY);
			pen.lineTo(axesXMax,beginY);
			pen.lineTo(axesXMax,axesYMax);
			pen.lineTo(beginX,axesYMax);
			pen.lineTo(beginX,beginY);
			pen.closePath();//闭合路径
			pen.stroke();
			if(axesYTitle&&Object.prototype.toString.call(axesYTitle)==="[object Array]"){
				//绘制坐标上的文字说明
				var axesYTitleLength=axesYTitle.length;
				var lineCount=axesYTitleLength-2;
				oneAxesYvalue=axesHeight/(axesYTitleLength-1);
				//$canvas.data("oneAxesYvalue",oneAxesYvalue);
				for(var i=0;i<axesYTitleLength;i++){
					var yTitle=axesYTitle[i];
					drawText(yTitle,settings.yTitleXPosion,axesYMax-oneAxesYvalue*i,axesTitleColor);
				}
				////绘制里面的网格
				if(axesYTitleLength>2){
					pen.lineWidth=1;
					pen.strokeStyle=axesColor;
					for(var i=1;i<=lineCount;i++){
						pen.beginPath();
						//如果没有0.5,1px的线会模糊
						pen.moveTo(beginX+0.5,beginY+oneAxesYvalue*i+0.5);
						pen.lineTo(axesXMax-0.5,beginY+oneAxesYvalue*i+0.5);
						pen.closePath();//闭合路径
						pen.stroke();
					}
				}
			}
			//绘制横坐标
			if(datas&&Object.prototype.toString.call(datas)==="[object Array]"){
				for(var i=0;i<datas.length;i++){//取出第一组时绘制横坐标   xTitleAuto可以删除一些title,来使页面都能放下。	
					var lineDataObject=datas[i];//进入数组中，是对象
					if(lineDataObject&&Object.prototype.toString.call(lineDataObject)==="[object Object]"){
						for(var category in lineDataObject){
							var lineDataArray=lineDataObject[category];
							var lineDataLength=lineDataArray.length;
							oneAxesXvalue=axesWidth/(lineDataLength-1);
							//判断是否需要缩减
							var isDeleteTitle=false;
							var deleteCount=0;							
							for(var ii=0;ii<lineDataLength;ii++ ){
								var oneData=lineDataArray[ii];
								if(isDeleteTitle&&ii%deleteCount!=0){
									continue;
								}
								for(var xTitle in oneData){
									if(xTitle==descAttr){
										continue;
									}
									if(ii==0&&!isDeleteTitle){
										var xTitleWidth=xTitle.length*xTitleOneWidth;
										if(xTitleWidth>oneAxesXvalue){
											isDeleteTitle=true;
											deleteCount=Math.round( xTitleWidth/oneAxesXvalue);
										}	
									}
									drawText(xTitle,parseFloat(beginX+oneAxesXvalue*ii+xTitleAdjust),axesYMax+10,axesTitleColor);
									break;
								}
							}
							//绘制里面的网格
							if(lineDataLength>2){
								var xLineCount=lineDataLength-2;
								pen.lineWidth=1;
								pen.strokeStyle=axesColor;
								for(var ii=1;ii<=xLineCount;ii++){
									pen.beginPath();
									//如果没有0.5,1px的线会模糊
									pen.moveTo(beginX+0.5+oneAxesXvalue*ii,beginY+0.5);
									pen.lineTo(beginX+0.5+oneAxesXvalue*ii,axesYMax-0.5);
									pen.closePath();//闭合路径
									pen.stroke();
								}
							}
						}
							
					}
					break;
				}
			}
		};
		//计算数据点的应该的y坐标
		var calculateY=function(maxValue,minValue,selfValue){
			var maxMinDiffValue=maxValue-minValue;
			if(maxMinDiffValue==0){
				maxMinDiffValue=minValue*(settings.maxMinRate-1);
				
			}
			var rate=axesHeight/maxMinDiffValue;
			var selfHeight=(selfValue-minValue)*rate;
			var y=axesYMax-selfHeight;
			return y;
			
		};
		//绘制数据坐标点
		var drawDatas=function(){
			//要求所有数据的横纵标必须传入,如果是空数据则传入空数据标识位 descDatas，坐标点上的说明
			if(datas&&yTitleValue&&Object.prototype.toString.call(datas)==="[object Array]"){
				var maxValue=yTitleValue[yTitleValue.length-1];
				var minValue=yTitleValue[0];
				var categoryY=axesYMax+30;
				var ii=0;
				var categoryLength=datas.length;//一共有多少种类
				for(var i=0;i<categoryLength;i++){//种类
					var xyDatas=[];
					var lineDataObject=datas[i];//取出某个种类的数据点
					var lineColor=dataColors[i];
					for(var category in lineDataObject){
						var lineDataArray=lineDataObject[category];
						var lineDataLength=lineDataArray.length;
						oneAxesXvalue=axesWidth/(lineDataLength-1);
						for(var j=0;j<lineDataLength;j++ ){//数据点也是一系列数组
							var oneData=lineDataArray[j];
							for(var xTitle in oneData){//数据里面是object
								var nodeData=oneData[xTitle];//具体数据点
								if(nodeData===nullDataFlag){
									continue;
								}
								var y=calculateY(maxValue,minValue,nodeData);
								var x=beginX+oneAxesXvalue*j;
								drawPoint(x,y,lineColor,dataPointRadius);
								var xy=[x,y];
								xyDatas.push(xy);
								//为描述坐标点准备数据
								var descXy=x+","+y;//描述数据，响应的坐标点
								if(!descDatas[descXy]){
									descDatas[descXy]=new Object;
								}
								if(!descDatas[descXy][category]){
									descDatas[descXy][category]=new Object;
								}
								descDatas[descXy][category][descX]=xTitle;
								descDatas[descXy][category][descY]=nodeData;
								//其他的备注信息
								var info=oneData[descAttr];
								if(info&&info!=""){
									descDatas[descXy][category][descAttrTitle]=info;
								}
							}
						}
					}
					//连接各个点
					drawLine(xyDatas,lineColor);
					//绘制种类描述 
					var categoryX=beginX+categoryOneWidth*i;
					if(categoryX>=axesXMax){
						categoryX=beginX+categoryOneWidth*ii;
						categoryY=axesYMax+35+categoryDescWidth;
						ii++;
					}
					drawRoundRect(categoryX,categoryY-(categoryDescWidth/2),categoryDescWidth,categoryDescWidth,2,lineColor);
					drawText(category,categoryX+categoryDescWidth+2,categoryY,axesTitleColor,categoryFontSize);
			
				}
			}
		};
		//判断是否在响应点上 半径是dataPointRadius
		var isInResonseRadius=function(curX,curY){
			var length=xyEventResponse.length;
			var result=false;
			if(length>0){
				var xRangeMin=curX+dataPointRadius;
				var xRangeMax=curX-dataPointRadius;
				var yRangeMin=curY+dataPointRadius;
				var yRangeMax=curY-dataPointRadius;
			//xyEventResponse的x轴是按照从小到达的顺序存储，以此为提前退出条件
				for(var i=0;i<length;i++){
					var xy=xyEventResponse[i];
					var x=xy[0];
					if(xRangeMin<x){
						return false;
						break;
					}
					if(xRangeMin>x&&xRangeMax<x){
						var y=xy[1];
						if(yRangeMin>y&&yRangeMax<y){
							return x+","+y;
							break;
						}
					}
				}	
			}
			return result;
		};
		//在坐标点上显示说明提示
		var showTip=function($tip,datas,pageX,pageY,canvasX,canvasY){
			$tip.hide();
			$tip.html("");
			$tip.height(70);
			var tipTitle="",descHtml="",isHasInfo=false;
			var i=0;
			for(var title in datas){
				if(i==0){
					tipTitle=title;
					var descObject=datas[title];
					for(var descKey in descObject){
						if(descKey===descAttrTitle){//有变化的信息了，需要改变tip的高度
							isHasInfo=true;
						}
						var descValue=descObject[descKey];
						descHtml=descHtml+'<div class="graph_desc">'+descKey+':<font class="graph_num">'+descValue+'</font></div>';
					}
				}else {
					tipTitle=tipTitle+","+title;
				}
				i++;
			}
			if(isHasInfo){
				$tip.height(90);
			}
			var titleHtml="<div class='graph_category'>"+tipTitle+"</div>";
			var tipLeft=pageX,tipTop=pageY;
			$tip.append(titleHtml).append(descHtml);
			var tipWidth=$tip.width(),tipHeight=$tip.height();
			if(canvasX+tipWidth>canvasWidth){//改变显示的位置,向左显示
				tipLeft=tipLeft-tipWidth;	
			}
			//5是多余的量
			if((canvasY+tipHeight+5)>canvasHeight){//改变显示的位置,向上显示
				tipTop=tipTop-tipHeight;	
			}
			$tip.css({left:tipLeft+"px",top:tipTop+"px"});
			$tip.show();
		};
		//绑定事件开始
		var bindEvent=function(){
			if(descDatas){
				for(var xyStr in descDatas){
					var xyArray=xyStr.split(",");
					xyEventResponse.push(xyArray);
				}
				xyEventResponse.sort(function(a,b){
					if(a&&b&&Object.prototype.toString.call(a)==="[object Array]"&&Object.prototype.toString.call(b)==="[object Array]"&&a.length==2&&b.length==2){
						if(a[0]==b[0]){
							return 0;
						}else {
							var c=parseInt(a[0]);
							var d=parseInt(b[0]);	
							return c-d;
						}
					}	
				});
			}else {
				return;	
			}
			var $canvas=$("#"+canvasId);
			var $canvasOffset=$canvas.offset();
			var offsetLeft=$canvasOffset.left;
			var offsetTop=$canvasOffset.top;
			if($canvas){
				$canvas.off("mousemove.tuiGraph click.tuiGraph").on("mousemove.tuiGraph click.tuiGraph",function(event){
					var pageX=event.pageX, pageY=event.pageY;
					var currentX=pageX-offsetLeft, currentY=pageY-offsetTop;
					var xyStrInResponse=isInResonseRadius(currentX,currentY);
					var $tip=$("#"+tipId);
					if(xyStrInResponse&&typeof xyStrInResponse=="string"){
						//显示坐标点的信息，同时支持click时间
						if($tip&&$tip.css("display")==="none"){
							showTip($tip,descDatas[xyStrInResponse],pageX,pageY,currentX,currentY);
						}
						var onClickFunc=settings.onClick;
						if(event&&event.type==="click"&&onClickFunc&&typeof onClickFunc==="function"){
							onClickFunc.call(null,xyStrInResponse,descDatas[xyStrInResponse]);
						}
					}else {$tip.hide();}
				});	
				
			}
		};
		//----------主方法----------
		if(settings.target instanceof jQuery){
			$panel=settings.target;
		}else{
			$panel=$('#'+settings.target);
		}
		//判断浏览器版本
		if(!$.tui.isIE678()){
			addCanvas();//添加画布，并且开始时钟的运行
			resetAxesYTitle();//自动标记y轴的标题
			drawFrame();
			drawDatas();
			bindEvent();
			pen=null;
			$canvas=null;
		}else{//IE8和以前版本不支持canvas
					
		}
		
	};
})(jQuery);