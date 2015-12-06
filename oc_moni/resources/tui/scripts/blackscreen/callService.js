
	var passengerCount=0;
	var log = "0";
	var commandCount = 0;

	// ajax发送指令或功能键
	function callservice(URL, inputString, isFunctionKey,isFullScreen)
	{
		var flag=false;
		var  search=inputString.toUpperCase().search(/(@[\s\S]*\+[\s\S]*X)/g);
		if(search!=-1){
			flag=true;
			inputString=inputString.substring(0,search+1);
		}
		var t1 = new Date();
		var str1 = t1.getTime();
		if(log=="1" && __BROWSER.msie){
			commandCount++;
			var month1 = t1.getMonth()+1;
			var time1 = t1.getFullYear()+"-"+month1+"-"+t1.getDate()+" "+t1.getHours()+":"+t1.getMinutes() +":"+t1.getSeconds();
			if(inputString.toUpperCase().indexOf("SI")==0){
				var login = commandCount+". 发送时间"+time1+", 发送指令:"+"SI";
				MainCtrl.writeData(login, "0");
			}else if(inputString.toUpperCase().indexOf("AI")==0){
				var login = commandCount+". 发送时间"+time1+", 发送指令:"+"AI";
				MainCtrl.writeData(login, "0");
			}else{
				var login = commandCount+". 发送时间"+time1+", 发送指令:"+inputString;
				MainCtrl.writeData(login, "0");
			}
		}
		//20140318党会建修改 后台过滤\,导致pnr封口有问题。如果传入是\给他转成@
		inputString=inputString.replace(/\\/gmi, "@");
		$.ajax({
				type: "post",
				url: URL,
				data : {
					inputString : encodeURIComponent(inputString),
					functionKey : isFunctionKey,
					fullScreen : isFullScreen
				},
				dataType : "text",
				//jsonp:'callback',
				timeout: 40000,
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					//解屏
					lockScreen(false);
					if (errorThrown == "timeout")
					{
						MainCtrl.inputString(__i18n(__I18N_REQUEST_TIMEOUT));
					}
					else
					{
						MainCtrl.inputString(__i18n(__I18N_REQUEST_FAILURE));
					}
					MainCtrl.inputString(BlackScreenCtrl.SOE);
				},
				success : function(data) {
					lockScreen(false);
//					if(checkSession(data)==false){
//						return;
//					}
					var t2 = new Date();
					var str2 = t2.getTime();	
					if(data.response!=null && log == "1" && __BROWSER.msie){
						var month2 = t2.getMonth()+1;
						var time2 = t2.getFullYear()+"-"+month2+"-"+t2.getDate()+" "+t2.getHours()+":"+t2.getMinutes() +":"+t2.getSeconds();
						var logjson = $.toJSON(data);
						logjson=logjson.replace(/\"indexOf[\s\S]*?\}\,/gm," ");
						logjson=logjson.replace(/\"remove[\s\S]*?\}\,/gm," ");
						var logout = commandCount + ". " + MESSAGE_M090228 + time2 + MESSAGE_M090229 + logjson;
						MainCtrl.writeData(logout, "1");
					}
					//解析返回
					handleResponse(inputString, data);
					//返回后解屏
					if(data.response != null)
					{
						if(data.response.executeTime !=null)
						{
							MainCtrl.setElapsedTime(data.response.executeTime + "ms");		
							if(str2 - str1 - data.response.executeTime<50){
								MainCtrl.setNetTransportTime("50ms");
							}else{
								MainCtrl.setNetTransportTime((str2 - str1 - data.response.executeTime) + "ms");
							}
						}
						
						if(data.response.remainPacket !=null){
							MainCtrl.setFlow(data.response.remainPacket);
						}
										
						if(data.response.seatCount !=null)
						{
							passengerCount = data.response.seatCount;
						}			
					}
					//如果封口时为@+x或者为etdz出票，则自动刷新当日订单tab页，如果当日订单tab页面没有打开则打开，
					if(inputString.search(/etdz/g)!=-1||inputString.search(/ETDZ/g)!=-1){
						flag=true;
					}
					if(flag){
						queryIntraDay(flag);
					}
				}
			});
		}