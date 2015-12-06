/*指令解析主函数***************************************************************************************************************************/
function handleResponse(command, data) {
	MainCtrl.inputString(data);
	//查看返回是否有soe,如果没有则加上soe
	//如果末尾无三角号，则补上  2013-11-20 党会建
	var intext=data;
	var pos = intext.lastIndexOf(BlackScreenCtrl.SOE);
	var pos2=intext.lastIndexOf("?");//20140411加上?，因为结尾可能传过来问号
	if (intext==""||(pos<0&&pos2<0))
	{
		MainCtrl.inputString(BlackScreenCtrl.SOE);	//2013-11-19 党会建 删除最后不放置这个soe,tapi传出了soe符号
	}
//	if (data.response == null) {
//		alert(MESSAGE_V040100);
//	} else {
//		if (data.response.avStructResult != null) {
//			command_index++;
//			if (showdialog) {
//				$("#dialog").dialog("close");
//				showdialog = false;
//			}
//
//			var jsonobject = data.response.avStructResult;
//
//			if (jsonobject.flag == "E") {
//				avInput = '<TDE Direction="In" Type="Data" xml:space = "preserve"> <XMLData>';
//				avInput = avInput + '<Object Row = "1" Col = "1"><Text>**'
//						+ jsonobject.err + '**</Text></Object>';
//				avInput = avInput
//						+ '<Object Row = "2" Col = "1"><Text>&#x10;</Text></Object>';
//				avInput = avInput + '</XMLData></TDE>';
//			} else {
//				jsonobject = jsonobject.data.out1;
//				/*判断是否是avh指令*/
//				if (data.response.avType == 1) {
//					AVHModular(command.toUpperCase(), jsonobject,
//							data.response.lastAVCmd);
//				}
//				/*av指令*/
//				else if (data.response.avType == 0) {
//					AVModular(command.toUpperCase(), jsonobject,
//							data.response.lastAVCmd);
//				}
//				setSegs(jsonobject.segs);
//			}
//			MainCtrl.inputString(avInput);
//		}
//
//		if (data.response.fullScreenResult != null) {
//			var jsonobject = data.response.fullScreenResult;
//
//			for ( var i = 0; i < jsonobject.length; i++) {
//				FSModular(jsonobject[i]);
//				MainCtrl.inputString(fsInput);
//			}
//		}
//		/*非av指令*/
//		if (data.response.commonResult != null) {
//			var jsonobject = data.response;
//
//			REModular(jsonobject);
//			MainCtrl.inputString(reInput);
//		}
//
//		if (data.response.errorResult != null) {
//			var jsonobject = data.response.errorResult;
//			MainCtrl.inputString(jsonobject);
//			MainCtrl.inputString(BlackScreenCtrl.SOE);
//		}
//	}
}
function trim(str) { //删除左右两端的空格  
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

//锁屏（1）或解锁（0）
function lockScreen(flag) 
{
	MainCtrl.lockScreen(flag);
}

function showTips(str1, str2) {
	xmltext = '<TDE Direction="In" Type="HandleEvent" xml:space="preserve">';
	xmltext = xmltext + '<Handle ObjectID="' + str1 + '" Event="MouseOver">';
	xmltext = xmltext
			+ '<Tips Type="Bubble" Width="15"><Tip Type="Content"><LeftColumn>'
			+ str2 + '</LeftColumn></Tip></Tips>';
	xmltext = xmltext + '</Handle></TDE>';
	MainCtrl.inputString(xmltext);
}
