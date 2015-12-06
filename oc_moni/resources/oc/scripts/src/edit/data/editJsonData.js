define(function (require, exports, module) {
    var jsonDate = {
      advancedPurchasePeriodList:[//提前购票时间单位
        {"name":"分","value":"Nb"}, {"name":"小时","value":"Hb"},
        {"name":"天","value":"Db"}, {"name":"月","value":"Mb"}
      ],//advancedPurchasePeriodList end
      flagData:{
        "t170": {"flag": true,"title": "收起表格"},
  			/*"t201": {"flag": false,"title": "填写表格"},*/
  			"t198": {"flag": false,"title":"填写表格"},
  			"t198Upgrade": {"flag": false,"title":"填写表格"},
  			"t183": {"flag": false,"title":"填写表格"},
  			"t186": {"flag": false,"title":"填写表格"},
  			"t196":{"flag":false,"title":"填写表格"},
  			"t165":{"flag":false,"title":"自定义区域"},
  			"t171":{"flag":false,"title":"填写表格"},
  			"t172":{"flag":false,"title":"填写表格"},
  			"t173Ticket":{"flag":false,"title":"填写表格"},
  			"t173Tkt":{"flag":false,"title":"填写表格"},//list173TktVO
  			"geo1":{"flag":false,"title":"自定义区域"},
  			"geo2":{"flag":false,"title":"自定义区域"},
  			"geo3":{"flag":false,"title":"自定义区域"}
      },//flagData end
      tableData:{
        "t170":{
  				"titieList":[{"title":"销售地类型"},{"title":"销售地代码"},{"title":"金额"},{"title":"货币类型"}],
  				"addObj":{"saleGeographicPointType":"","saleGeographicPoint":"","specFeeAmount":"","specFeeCurrency":"CNY","selected":true}
  			},
  			"t198":{
  				"titieList":[{"title":"市场方/承运方"},{"title":"航空公司"},{"title":"订座舱位1"},
  				             {"title":"订座舱位2"},{"title":"订座舱位3"},{"title":"订座舱位4"},
  				             {"title":"订座舱位5"}],
  				"addObj":{"mktOp":"","cxr":"","rbd1":"","rbd2":"","rbd3":"","rbd4":"","rbd5":"","selected":true}
  			},
        "t198UpGrade":{
          "titieList":[],
          "addObj":{"cxr":"","rbd1":"","rbd2":"","rbd3":"","rbd4":"","rbd5":"","selected":true} 
        },
  			"t196":{
  				"titieList":[{"title":"行李件数"},{"title":"行李子代码"}],
  				"addObj":{"count":"","code":"","selected":true}
  			},
  			"t186":{
  				"titieList":[{"title":"市场方"},{"title":"承运方"},{"title":"航班号"}],
  				"addObj":{"mktCarrier":"","optCarrier":"","fltNo1":"","fltNo2":"","selected":true}
  			},
  			"t183":{
  				"titieList":[{"title":"旅行社"},{"title":"航空公司/分销商"},{"title":"职责/功能码"},
  				             {"title":"区域类型"},{"title":"区域代码"},{"title":"发布对象类型"},
  				             {"title":"发布对象代码"},{"title":"权限"}],
  				"addObj":{"travelAgency":"","carrierGds":"","dutyFunctionCode":"","geographicSpecificationType":"","geographicSpecification":"","codeType":"","code":"","viewBookTkt":"","selected":true}
  			},
  			"t165":{
  				"titieList":[{"title":"机型代码"}],
  				"addObj":{"equipmentCode":"","selected":true}
  			},
  			"t171":{
  				"titieList":[{"title":"航空公司"},{"title":"票价类别"},{"title":"运价类型"}],
  				"addObj":{"count":"","code":"","selected":true}
  			},
  			"t172":{
  				"titieList":[{"title":"大客户编码"}],
  				"addObj":{"accountCode":"","selected":true}
  			},
  			"t173Ticket":{
  				"titieList":[{"title":"指定客票"}],
  				"addObj":{"ticketDesignator":"","selected":true}
  			},
  			"t173Tkt":{
  				"titieList":[{"title":"指定客票"}],
  				"addObj":{"ticketDesignator":"","selected":true}
  			},
  			"t178Loc1":{
  				"titieList":[{"title":"类型"},{"title":"代码"},{"title":"是否适用"}],
  				"addObj":{"geoLocType":"","geoLocSpec":"","appl":"","selected":true}
  			},
  			"t178Loc2":{
  				"titieList":[{"title":"类型"},{"title":"代码"},{"title":"是否适用"}],
  				"addObj":{"geoLocType":"","geoLocSpec":"","appl":"","selected":true}
  			},
  			"t178Loc3":{
  				"titieList":[{"title":"类型"},{"title":"代码"},{"title":"是否适用"}],
  				"addObj":{"geoLocType":"","geoLocSpec":"","appl":"","selected":true}
  			}
      },//table end
      weightUnitList:[//行李重量单位集合
        {"name":"选择","value":""},{"name":"千克","value":"K"},{"name":"磅","value":"P"}
      ],
      specServiceFeeColSubList:[	//SPEC_SERVICE_FEE_COL_SUB//包含/扣除
	       {"name":"包含在票价中","value":"I"},{"name":"单独收费","value":""}
      ],
      noChargeNotAvailableList:[//免费/收费
        {"name":"收费","value":""},{"name":"不适用","value":"X"},
        {"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"},
        {"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}
      ],
      specServiceFeeNetSellList:[//净价/销售价
        {"name":"销售价","value":""},{"name":"净价","value":"N"}
      ],
      baggageTravelApplicationList:[
        {"name":"必须匹配所有的航段","value":"A"},{"name":"至少匹配一个航段","value":"S"},
        {"name":"必须匹配旅行航段中的主航段","value":"M"},{"name":"必须匹配整个行程的每一段","value":"J"},
        {"name":"不限制","value":""}
      ],
      noCharge_notAvailableList:[
        {"name":"收费","value":""},{"name":"不适用","value":"X"},
        {"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"},
        {"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}
      ],
      cabinList:[//舱位list集合
        {"name":"R-豪华头等舱","value":"R"},{"name":"F-头等舱","value":"F"},
        {"name":"J-豪华商务舱","value":"J"},{"name":"C-商务舱","value":"C"},
        {"name":"P-豪华经济舱","value":"P"},{"name":"Y-经济舱","value":"Y"}
      ],
      geoLocTypeList:[//区域集合
        {"name":"选择","value":""},
				{"name":"A-大区","value":"A"},{"name":"C-城市","value":"C"},
				{"name":"N-国家","value":"N"},{"name":"P-机场","value":"P"},
				{"name":"S-州","value":"S"},{"name":"Z-区域","value":"Z"}
      ],
      formOfRefundList:[//退款形式
        {"name":"选择","value":""},{"name":"按原付款渠道退款","value":"1"},
				{"name":"按电子凭证退款","value":"2"}
      ],
      geoSpecSectPortJourneyList:[
        {"name":"选择","value":""},{"name":"区域","value":"S"},
				{"name":"部分","value":"P"},{"name":"全程","value":"J"}
      ],
      geoSpecExceptionStopUnitList:[
        {"name":"选择","value":""},{"name":"分","value":"N"},
        {"name":"小时","value":"H"},{"name":"天","value":"D"},
        {"name":"周","value":"W"},{"name":"月","value":"M"}
      ],
      timeApplicationList:[
        {"name":"选择","value":""},{"name":"分别","value":"D"},
				{"name":"之间","value":"R"}
      ]
    } ;
   return jsonDate ;
}) ;
