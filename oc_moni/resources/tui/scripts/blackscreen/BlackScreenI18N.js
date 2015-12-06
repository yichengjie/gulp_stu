/**
* JS黑屏控件国际化文件
* 
* @author		huangjian
* @date			2013-07-18
* @copyright 	中国航信重庆研发中心，2013.
*
*/


/*****************************************************
*  国际化样例：
*  __I18N_XXX = {
*  		"zh_CN": "简体中文",
*  		"en_US": "English",
*  		"zh_TW": "繁体中文",
*  };
*  
*  提取文本：
*  		var i18nTxt = __i18n(__I18N_XXX);
*  设置语言：
*  		__setLang("zh_TW");
*/

__I18N_REQUEST_FAILURE = {
	"zh_CN": "请求失败，请重试",
	"en_US": "Request failure, try again",
	"zh_TW": "請求失敗，請重試"
};

__I18N_REQUEST_TIMEOUT = {
		"zh_CN": "服务器返回超时，请重试",
		"en_US": "Service timout, try again",
		"zh_TW": "服務器返回超時，請重試"
	};

// 命令格式提示
__I18N_CMD_TIP = {
	"nm": 
		{	"zh_CN": "格式：NM NUMBER PSGR-NAME(PSGR-CODE)\n例如：NM 1张三 1李四 1李小明",
		   	"en_US": "Format: NM NUMBER PSGR-NAME(PSGR-CODE)\nExample: NM 1zhang/san 2li/si/xiaoming",
		   	"zh_TW": "格式：NM NUMBER PSGR-NAME(PSGR-CODE)\n例如：NM 1張三1李四1李曉明"
		},
	"av": 
		{	"zh_CN": "格式：AV选择项/城市对/日期/航空公司代码\n例如：AV h/peksha/./ca",
			"en_US": "Format: AV option/orgdes/date/airline\nExample: AV h/peksha/./ca",
			"zh_TW": "格式：AV選擇項/城市對/日期/航空公司代碼\n例如：AV h/peksha/./ca"
		},
	"sd": 
		{ 	"zh_CN": "格式：SD序号/舱位/座位数量\n例如：SD1y1",
			"en_US": "Format: SD linenumber/class/seats\nExample: SD1Y1",
			"zh_TW": "格式：SD序號/艙位/座位數量\n例如：SD1y1"
		},
	"ct": 
		{ 	"zh_CN": "格式：CT 城市三字码/TEXT 旅客编码\n例如：ct pek/123456/p1",
			"en_US": "Format: SD linenumber/class/seats\nExample: SD1Y1",
			"zh_TW": "格式：CT 城市三字碼/TEXT 旅客編碼\n例如：ct pek/123456/p1"
		},
	"tk": 
		{ 	"zh_CN": "格式：TK TL 时间/日期/office号\n例如：TK TL 1200/1feb/bjs123",
			"en_US": "Format: TK TL TIME/DATE/OFFICE NUMBER\nExample: TK TL 1200/10feb/bjs123",
			"zh_TW": "格式：TK TL 時間/日期/office号\n例如：TK TL 1200/1feb/bjs123"
		},
	"ssr inft": 
		{ 	"zh_CN": "格式：SSR INFT 航空公司代码 行动代码/人数/城市对/航班号/舱位/航班起飞日期 \n例如：SSR INFT CA NN1 PEKPVG 155 Y 11DEC TEST/BABY 07DEC09/P1",
			"en_US": "Format: SSR INFT AIRLINE ACTION SEATS SEGMENT FLIGHT CABIN DEPARTUREDATE\nExample: SSR INFT CA NN1 PEKPVG 155 Y 11DEC TEST/BABY 07DEC09/P1",
			"zh_TW": "格式：SSR INFT 航空公司代碼 行動代碼/人數/城市對/航班號/艙位/航班起飛日期 \n例如：SSR INFT CA NN1 PEKPVG 155 Y 11DEC TEST/BABY 07DEC09/P1"
		},
	"ssr fqtv":
		{	"zh_CN": "格式：SSR FQTV 航空公司代码 行动代码/航空公司代码卡号/旅客序号/航段序号\n例如：SSR FQTV HU HK/HU122111221/P1/S1",
			"en_US": "Format: SSR FQTV AIRLINE ACTION/CARDNO/PSGID/SEGID\nExample: SSR FQTV HU HK/HU122111221/P1/S1",
			"zh_TW": "格式：SSR FQTV 航空公司代碼 行動代碼/航空公司代碼卡號/旅客序號/航段序號\n例如：SSR FQTV HU HK/HU122111221/P1/S1"
		},
	"ssr foid":
		{	"zh_CN": "格式：SSR FOID 承运人 HK/NI证件号/旅客序号\n例如：SSR FOID CA HK/NI110108200306016012/P1",
			"en_US": "Format: SSR FOID CARRIER HK/NI CARDNO/PSGID\nExample: SSR FOID CA HK/NI110108200306016012/P1",
			"zh_TW": "格式：SSR FOID 承運人 HK/NI證件號/旅客序號\n例如：SSR FOID CA HK/NI110108200306016012/P1"
		},
	"ssr docs":
		{	"zh_CN": "格式：SSR DOCS 承运人HK1 证件类型/发证国家/证件号码/国籍/出生日期/性别/证件有效期限/姓/名/中间名\n例如：SSR DOCS HU HK1 P/CHN/143810297/CHN/24APR76/M/23APR12/XU/XIAOMING/P1",
			"en_US": "Format: SSR DOCS CARRIER HK1 CARDTYPE/COUNTRY/CARDNO/NATION/BIRTH/SEX/EXPIRY/SURNAME/GIVEN/MID\nExample: SSR DOCS HU HK1 P/CHN/143810297/CHN/24APR76/M/23APR12/XU/XIAOMING/P1",
			"zh_TW": "格式：SSR DOCS 承運人HK1 證件類型/法證國家/證件號碼/國籍/出生日期/性別/證件有效期限/姓/名/中間名\n例如：SSR DOCS HU HK1 P/CHN/143810297/CHN/24APR76/M/23APR12/XU/XIAOMING/P1"
		},
	"ssr doca":
		{	"zh_CN": "格式：SSR DOCA 航空公司代码 HK1 地址类型/国家/详细地址/城市/所在省市(州)信息/邮编/婴儿标识I/P旅客序号\n例如：SSR DOCA CA HK1 D/USA/NO17 STREET2/AUSTIN/TX/12345/P1",
			"en_US": "Format: SSR DOCA AIRLINE HK1 ADDRTYPE/COUNTRY/ADDRDETAILS/CITY/STATE/POSTALCODE/INFANTID /PSGID\nExample: SSR DOCA CA HK1 D/USA/NO17 STREET2/AUSTIN/TX/12345/P1",
			"zh_TW": "格式：SSR DOCA 航空公司代碼 HK1 地址類型/國家/詳細地址/城市/所在省市(州)信息/郵編/嬰兒標識I/P旅客序號\n例如：SSR DOCA CA HK1 D/USA/NO17 STREET2/AUSTIN/TX/12345/P1"
		},
	"ssr tkne":
		{	"zh_CN": "格式：SSR TKNE 航空公司代码 行动代码1 城市对 航班号 舱位日期 票号/航段序号/旅客序号\n例如：SSR TKNE HU HK1 NGBPEK 7097 H 07MAY 8803711487812/1/P1",
			"en_US": "Format: SSR TKNE AIRLINE ACTION 1 SEMENT FLIGHT CARBIN DEPARTUREDATE TICKETNO/SEGID/PSGID\nExample: SSR TKNE HU HK1 NGBPEK 7097 H 07MAY 8803711487812/1/P1",
			"zh_TW": "格式：SSR TKNE 航空公司代碼 行動代碼1 城市對 航班號 艙位日期 票號/航段序號/旅客序號\n例如：SSR TKNE HU HK1 NGBPEK 7097 H 07MAY 8803711487812/1/P1"
		}
};

//状态栏提示
__I18N_STATUSBAR_MSG = {
	"input":{
		"zh_CN": "可以输入",
		"en_US": "Available",
		"zh_TW": "可以輸入"
	},
	"wait":{
		"zh_CN": "接收等待",
		"en_US": "Busy",
		"zh_TW": "接收等待"
	},
	"serverOperateTime":{
		"zh_CN": "服务器处理时间",
		"en_US": "Server Process Time ",
		"zh_TW": "服務器處理時間"
	},
	"netTransportTime":{
		"zh_CN": "网络传输时间",
		"en_US": "Network Time ",
		"zh_TW": "網絡傳輸時間"
	},
	"remainFlow":{
		"zh_CN": "剩余流量",
		"en_US": "Residual Flow ",
		"zh_TW": "剩餘流量"
	}
};

//黑屏获得输入提示
__I18N_GETFOCUS = {
		"zh_CN": "黑屏获得输入焦点",
		"en_US": "Black screen obtain input focus",
		"zh_TW": "黑屏獲得輸入焦點"
};

//黑屏失去输入焦点提示
__I18N_LOSTFOCUS = {
		"zh_CN": "黑屏失去输入焦点",
		"en_US": "Black screen lost input focus",
		"zh_TW": "黑屏失去輸入焦點"
};

//横向分屏
__I18N_CUTSCREEN_X = {
		"zh_CN": "横向分屏",
		"en_US": "Horizontal split",
		"zh_TW": "橫向分屏"
};
//纵向分屏
__I18N_CUTSCREEN_Y = {
		"zh_CN": "纵向分屏",
		"en_US": "Vertical split",
		"zh_TW": "縱向分屏"
};
//增强
__I18N_INCREASE = {
		"zh_CN": "增强显示",
		"en_US": "Rich display",
		"zh_TW": "增強顯示"
};
//新建
__I18N_NEW = {
		"zh_CN": "新建窗口",
		"en_US": "New screen",
		"zh_TW": "新建窗口"
};
//提示
__I18N_TIP = {
		"zh_CN": "命令提示",
		"en_US": "Command prompting",
		"zh_TW": "命令提示"
};
//打开提示
__I18N_TIP_OPEN = {
		"zh_CN": "打开提示",
		"en_US": "Enable prompting",
		"zh_TW": "打開提示"
};
//关闭提示
__I18N_TIP_CLOSE = {
		"zh_CN": "关闭提示",
		"en_US": "Disable prompting",
		"zh_TW": "關閉提示"
};
//酒店
__I18N_HOTEL = {
		"zh_CN": "酒店",
		"en_US": " Hotel",
		"zh_TW": "酒店"
};
//打开酒店
__I18N_HOTEL_OPEN = {
		"zh_CN": "打开酒店",
		"en_US": "Open hotel",
		"zh_TW": "打開酒店"
};
//关闭酒店
__I18N_HOTEL_CLOSE = {
		"zh_CN": "关闭酒店",
		"en_US": "Close hotel",
		"zh_TW": "關閉酒店"
};
//未开通
__I18N_NOT_OPEN = {
		"zh_CN": "未开通",
		"en_US": "Do not open",
		"zh_TW": "未開通"
};
//功能
__I18N_FUNCTION = {
		"zh_CN": "功能",
		"en_US": " function",
		"zh_TW": "功能"
};
//黑屏正在接收数据中，请稍候再操作!
__I18N_OPERATE_LATER  = {
		"zh_CN": "黑屏正在接收数据中，请稍候再操作!",
		"en_US": "Receiving data, please wait!",
		"zh_TW": "黑屏正在接收數據中，請稍後再操作!"
};
//副屏不能超過10個
__I18N_SCREEN_NUM = {
		"zh_CN": "副屏不能超过10个!",
		"en_US": "Subsidiary screen not more than 10!",
		"zh_TW": "副屏不能超過10個!"
};
//主屏
__I18N_MAIN_SCREEN = {
		"zh_CN": "主屏",
		"en_US": "Main screen",
		"zh_TW": "主屏"
};
//副屏
__I18N_SUB_SCREEN = {
		"zh_CN": "副屏",
		"en_US": "Subsidiary screen",
		"zh_TW": "副屏"
};
//确定关闭副屏？
__I18N_CONFIRM_CLOSE = {
		"zh_CN": "确定关闭副屏?",
		"en_US": "Are you sure close subsidiary screen?",
		"zh_TW": "確定關閉副屏?"
};
//该屏正在接收数据，不能删除
__I18N_CANNOT_CLOSE = {
		"zh_CN": "该屏正在接收数据，不能删除!",
		"en_US": "Receiving data, cannot be closed!",
		"zh_TW": "該屏正在接收數據，不能刪除!"
};
//关闭
__I18N_CLOSE = {
		"zh_CN": "关闭",
		"en_US": "Close screen",
		"zh_TW": "關閉"
};
__I18N_GROUP = {
		"zh_CN": "旅客信息导入",
		"en_US": "Import passenger information",
		"zh_TW": "旅客信息導入"
};
__I18N_POINTUP = {
		"zh_CN": "显示工具栏",
		"en_US": "Show toolBar",
		"zh_TW": "顯示工具欄"
};
__I18N_POINTDOWN = {
		"zh_CN": "隐藏工具栏",
		"en_US": "Hide toolBar",
		"zh_TW": "隱藏工具欄"
};
