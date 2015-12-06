define("fare/oc/1.0.0/edit/main-debug", [ "tuiDialog-debug", "datepicker-debug", "./router-debug", "./services/index-debug", "./services/s7DataService-debug", "./services/services-debug", "./services/s7EditService-debug", "./services/globalFlagService-debug", "./directives/index-debug", "./directives/commonDirective-debug", "./directives/directives-debug", "underscore-debug", "./directives/basicInfoDirective-debug", "../tpls/edit/header-debug.html", "../tpls/edit/choose_div-debug.html", "../tpls/edit/choose-ul-debug.html", "./directives/ruleDetailDirective-debug", "../tpls/edit/geoSpecLoc-debug.html", "./directives/tableDirective-debug", "../tpls/edit/table-debug.html", "../tpls/edit/tr-debug.html", "../tpls/edit/thead-debug.html", "./controllers/index-debug", "jqueryuitimepickeraddon-debug", "./controllers/eidtController-debug", "./controllers/controllers-debug", "./util/S7FormDataUtil-debug", "./data/editJsonData-debug", "./util/S7EditUtil-debug", "./data/jsonDataHelper-debug", "./util/commonUtil-debug", "./controllers/headController-debug", "./controllers/basicInfoController-debug", "./controllers/chargeConfirmController-debug", "./controllers/ruleDetailController-debug", "./filters/filters-debug" ], function(require, exports, module) {
    //var pathStr = require.resolve('src/main') ;
    //console.info("path : " + pathStr) ;
    //require('tuiValidator');
    require("tuiDialog-debug");
    require("datepicker-debug");
    //把整个app的路由加载进来
    require("./router-debug");
    module.exports = {
        init: function() {
            angular.element(document).ready(function() {
                angular.bootstrap(document, [ "app" ]);
                //angular加载完毕以后注册tui插件的校验
                registPageValidate();
            });
        }
    };
    function registPageValidate() {
        //对表单注册校验
        var validator = $("#s7_form").validate({
            meta: ""
        });
        window.validator = validator;
        //s7_save//提交按钮
        $("#s7_save").bind("click", function(e) {
            //直接用来校验表单 同 下面的  validator.form()函数
            //var flag = $("#signupForm").valid() ;
            var flag = validator.form();
            console.info("手动校验表单flag : " + flag);
            if (flag) {
                //获取指定id元素上的controller
                var element = angular.element($("#EditControllerDiv"));
                var scope = element.scope();
                scope.saveFormData("save");
            }
        });
        var element = angular.element($("#EditControllerDiv"));
        var scope = element.scope();
        //点击保存并发布按钮
        $("#s7_saveAndPublish").bind("click", function(e) {
            //直接用来校验表单 同 下面的  validator.form()函数
            var flag = validator.form();
            console.info("手动校验表单 flag : " + flag);
            if (flag) {
                //获取指定id元素上的controller
                scope.saveFormData("saveAndPublish");
            }
        });
        //当整个页面加载完毕后发送一次serviceTypeChange的通知，因为有时候servcieType会有默认值
        setTimeout(function() {
            scope.$broadcast("serviceTypeChangeNotice", "true");
        }, 1e3);
    }
});

define("fare/oc/1.0.0/edit/router-debug", [ "fare/oc/1.0.0/edit/services/index-debug", "fare/oc/1.0.0/edit/services/s7DataService-debug", "fare/oc/1.0.0/edit/services/services-debug", "fare/oc/1.0.0/edit/services/s7EditService-debug", "fare/oc/1.0.0/edit/services/globalFlagService-debug", "fare/oc/1.0.0/edit/directives/index-debug", "fare/oc/1.0.0/edit/directives/commonDirective-debug", "fare/oc/1.0.0/edit/directives/directives-debug", "underscore-debug", "fare/oc/1.0.0/edit/directives/basicInfoDirective-debug", "fare/oc/1.0.0/edit/directives/ruleDetailDirective-debug", "fare/oc/1.0.0/edit/directives/tableDirective-debug", "fare/oc/1.0.0/edit/controllers/index-debug", "jqueryuitimepickeraddon-debug", "fare/oc/1.0.0/edit/controllers/eidtController-debug", "fare/oc/1.0.0/edit/controllers/controllers-debug", "fare/oc/1.0.0/edit/util/S7FormDataUtil-debug", "fare/oc/1.0.0/edit/data/editJsonData-debug", "fare/oc/1.0.0/edit/util/S7EditUtil-debug", "fare/oc/1.0.0/edit/data/jsonDataHelper-debug", "fare/oc/1.0.0/edit/util/commonUtil-debug", "fare/oc/1.0.0/edit/controllers/headController-debug", "fare/oc/1.0.0/edit/controllers/basicInfoController-debug", "fare/oc/1.0.0/edit/controllers/chargeConfirmController-debug", "fare/oc/1.0.0/edit/controllers/ruleDetailController-debug", "fare/oc/1.0.0/edit/filters/filters-debug" ], function(require, exports, module) {
    //require("ui-router") ;
    require("fare/oc/1.0.0/edit/services/index-debug");
    require("fare/oc/1.0.0/edit/directives/index-debug");
    require("fare/oc/1.0.0/edit/controllers/index-debug");
    require("fare/oc/1.0.0/edit/filters/filters-debug");
    //把需要的模块全部加载到testApp中
    var app = angular.module("app", [ "pasvaz.bindonce", "app.factory", "app.controllers", "app.directives", "app.filter" ]);
    app.constant("NEW_ADD_STR", "add");
    //方法3定义全局变量
    app.constant("UPDATE_STR", "update");
    //方法3定义全局变量
    app.constant("DEFAULT_SERVICETYPE", "F");
});

define("fare/oc/1.0.0/edit/services/index-debug", [ "fare/oc/1.0.0/edit/services/s7DataService-debug", "fare/oc/1.0.0/edit/services/services-debug", "fare/oc/1.0.0/edit/services/s7EditService-debug", "fare/oc/1.0.0/edit/services/globalFlagService-debug" ], function(require, exports, module) {
    require("fare/oc/1.0.0/edit/services/s7DataService-debug");
    require("fare/oc/1.0.0/edit/services/s7EditService-debug");
    require("fare/oc/1.0.0/edit/services/globalFlagService-debug");
});

define("fare/oc/1.0.0/edit/services/s7DataService-debug", [ "fare/oc/1.0.0/edit/services/services-debug" ], function(require, exports, module) {
    var app = require("fare/oc/1.0.0/edit/services/services-debug");
    app.factory("FormData", [ "DEFAULT_SERVICETYPE", function(DEFAULT_SERVICETYPE) {
        var contextPath = $.trim($("#contextPath").val());
        var carrCode = $.trim($("#carrCode").val());
        var action = $.trim($("#action").val());
        console.log("[contextPath : " + contextPath + "],[carrCode : " + carrCode + "],[action:" + action + "]");
        return {
            id: "",
            status: "",
            statusDes: "",
            contextPath: contextPath,
            carrCode: carrCode,
            serviceAndSubCode: "",
            serviceType: DEFAULT_SERVICETYPE,
            /*s7中包含信息//默认值为'F'//根据选择的s5决定是'F'/'M'*/
            action: action,
            sel1: {
                showStr: "",
                value: ""
            },
            sel2: {
                showStr: "",
                value: ""
            },
            sel3: {
                showStr: "",
                value: "",
                textTableNo163: ""
            },
            sel4: [],
            basicInfoVo: {
                id: "",
                subCode: "",
                indCxr: "",
                subDescription: "",
                ftmCode: "",
                carrCode: "",
                ftmDescription: "",
                serviceGroup: "",
                serviceGroupDescription: "",
                subGroup: "",
                subGroupDescription: "",
                serveceType: "",
                commercialName: ""
            },
            firstMaintenanceDate: "",
            //-----------页面第二部分开始--------------//
            lastMaintenanceDate: "",
            description: "",
            /*描述*/
            fareBasis: "",
            /*运价基础*/
            freeBaggageAllowancePieces: "",
            /*免费行李件数*/
            firstExcessOccurrence: "1",
            /*收费行李件数起点*/
            lastExcessOccurrence: "",
            /*收费行李件数结束*/
            freeBaggageAllowanceWeight: "",
            /*免费重量*/
            freeBaggageAllowanceUnit: "",
            /*免费单位*/
            noChargeNotAvailable: "",
            /*'E'的时候'免费'//s7中包含信息*/
            baggageTravelApplication: "",
            list196VO: [],
            discountOrNot: "1",
            /*是否打折，这个字段不会保存到数据库*/
            discountRuleTableNo201: "",
            list201VO: [],
            serviceFeeCurTableNo170: "",
            list170VO: [],
            /*-------------页面第二部分结束---------------------------*/
            mileageMinimum: "",
            /*里程//新增字段*/
            mileageMaximum: "",
            /*里程//新增字段*/
            specifiedServiceFeeApp: "",
            /*适用于//新增字段*/
            specServiceFeeColSub: "",
            /*包含，扣除//新增字段*/
            specServiceFeeNetSell: "",
            /*净价/销售价//新增字段*/
            specSevFeeAndOrIndicator: "",
            /*或、和//新增字段*/
            specifiedServiceFeeMileage: "",
            /*里程//新增字段*/
            availability: "N",
            /*必须检查可用性（查库存）*/
            sequenceNumber: "",
            /*优先级序号//--------------------页面第三部分开始---------------------------*/
            passengerTypeCode: "",
            /*旅客类型*/
            minPassengerAge: "",
            /*最小年龄--新增字段*/
            maxPassengerAge: "",
            /*最大年龄--新增字段*/
            firstPassengerOccurrence: "",
            /*个数范围    第几个到第几个【数字】//新增字段*/
            lastPassengerOccurrence: "",
            /*个数范围    第几个到第几个【数字】//新增字段*/
            customerIndexScoreMinimum: "",
            /*客户积分范围【数字】//新增*/
            customerIndexScoreMaxmum: "",
            /*客户积分范围【数字】//新增*/
            frequentFlyerStatus: "",
            /*常旅客状态*/
            accountCodeTableNo172: "",
            /*大客户/特殊客户表（T172）--子表//新增*/
            list172VO: [],
            ticketDesignatorTableNo173: "",
            /*指定客票表（T173）--子表//新增*/
            list173TicketVO: [],
            tktDesignatorTableNo173: "",
            /*173*/
            list173TktVO: [],
            tourCode: "",
            /*旅行编码（关联客票）【字母或数字】--新增*/
            cabin: "",
            /*服务等级*/
            upgradeToCabin: "",
            rbdTableNo198: "",
            /*暂时没啥用,后台也不使用这个字段*/
            list198VO: [],
            /*订座属性表*/
            upgradeToRbdTableNo198: "",
            /*暂时没啥用，后台也不是该字段*/
            list198UpgradeVO: [],
            /*座位属性表，或则升舱属性表*/
            securityTableNo183: "",
            //发布安全表//暂时没啥用，后台也不是该字段*/
            list183VO: [],
            //安全发布表*/
            publicPrivateIndicator: "",
            /*公有、私有//新增字段*/
            carrierFlightTableNo186: "",
            /*航班信息表//暂时没啥用，后台也不是该字段*/
            list186VO: [],
            taxApplication: "Y",
            /*是否含税费//新增字段*/
            tariff: "",
            /*税费*/
            rule: "",
            /*规则*/
            cxrResFareTableNo171: "",
            /*客票舱位等级表*/
            list171VO: [],
            /*客票舱位等级表*/
            equipment: "",
            /*机型*/
            equipmentTypeTableNo165: "",
            list165VO: [],
            startTime: "",
            /*开始时刻*/
            stopTime: "",
            /*结束时刻*/
            timeApplication: "D",
            /*应用范围//新增字段*/
            dayOfWeek: "",
            /*星期 -- 新增字段*/
            dayOfWeekShow: {
                w1: false,
                w2: false,
                w3: false,
                w4: false,
                w5: false,
                w6: false,
                w7: false
            },
            //前台数据，后台无对应的属性
            advancedPurchasePeriod: "",
            /*提前购票时间--新增字段*/
            advancedPurchaseUnit: "",
            /*时间单位 -- 新增字段*/
            advancedPurchaseTktIssue: "",
            /*是否与机票同时出票 -- 新增字段*/
            indicatorReissueRefund: "",
            /*退、改 -- 新增字段*/
            formOfRefund: "",
            /*退款形式--新增字段*/
            indicatorComission: "Y",
            /*(是否有)代理费--新增字段*/
            indicatorInterline: "Y",
            /*是*/
            firstTravelYear: "",
            firstTravelMonth: "",
            firstTravelDay: "",
            lastTravelYear: "",
            lastTravelMonth: "",
            lastTravelDay: "",
            travelStartDate: "",
            /*这个是中间数据，后台不存在对应的属性*/
            travelEndDate: "",
            /*这个是中间数据，后台不存在对应的属性*/
            list178Loc1Id: "",
            /*区域1表格id*/
            list178Loc1: [],
            /*区域1对应的表格*/
            list178Loc2Id: "",
            /*区域2表格id*/
            list178Loc2: [],
            /*区域2对应的表格*/
            list178Loc3Id: "",
            /*区域3表格id*/
            list178Loc3: [],
            /*区域2对应的表格*/
            geoSpecFromToWithin: "",
            /*区域限制*/
            geoSpecSectPortJourney: "P",
            //航段限制-目前返回的是定死的字符串‘P’*/
            geoSpecLoc1Type: "",
            /*区域1类型*/
            geoSpecLoc1: "",
            /*区域1代码*/
            geoSpecLoc2Type: "",
            /*区域2类型*/
            geoSpecLoc2: "",
            /*区域2代码*/
            geoSpecLoc3Type: "",
            /*区域3类型*/
            geoSpecLoc3: "",
            /*区域3代码 下面的都是新增 的字段*/
            geoSpecTravelIndicator: "",
            /*指定区域*/
            geoSpecExceptionStopTime: "",
            /*经停时间//新增字段*/
            geoSpecExceptionStopUnit: "",
            /*经停单位*/
            geoSpecStopConnDes: ""
        };
    } ]);
});

define("fare/oc/1.0.0/edit/services/services-debug", [], function(require, exports, module) {
    var app = angular.module("app.factory", []);
    //require('angular-resource') ;
    return app;
});

define("fare/oc/1.0.0/edit/services/s7EditService-debug", [ "fare/oc/1.0.0/edit/services/services-debug" ], function(require, exports, module) {
    var app = require("fare/oc/1.0.0/edit/services/services-debug");
    // $q 是内置服务，所以可以直接使用  
    app.factory("S7EditService", [ "$http", "$q", function($http, $q) {
        return {
            getDataByUrl: function(url) {
                var deferred = $q.defer();
                // 声明延后执行，表示要去监控后面的执行  
                $http({
                    method: "GET",
                    url: url
                }).success(function(data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function(data, status, headers, config) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            postDate: function(url, queryParam) {
                var deferred = $q.defer();
                // 声明延后执行，表示要去监控后面的执行  
                $http({
                    method: "POST",
                    url: url,
                    data: queryParam
                }).success(function(data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function(data, status, headers, config) {
                    deferred.reject(data);
                });
                return deferred.promise;
            }
        };
    } ]);
});

define("fare/oc/1.0.0/edit/services/globalFlagService-debug", [ "fare/oc/1.0.0/edit/services/services-debug" ], function(require, exports, module) {
    var services = require("fare/oc/1.0.0/edit/services/services-debug");
    services.factory("TableStatusServcie", function() {
        return {
            tb183: {
                showFlag: false
            },
            tb171: {
                showFlag: false
            },
            tb172: {
                showFlag: false
            },
            tb173Ticket: {
                showFlag: false
            },
            tb173Tkt: {
                showFlag: false
            },
            tb165: {
                showFlag: false
            },
            tb186: {
                showFlag: false
            },
            tb196: {
                showFlag: false
            },
            tb198: {
                showFlag: false
            },
            tb198UpGrade: {
                showFlag: false
            },
            tb170: {
                showFlag: false
            },
            tb178geo1: {
                showFlag: false
            },
            tb178geo2: {
                showFlag: false
            },
            tb178geo3: {
                showFlag: false
            }
        };
    });
    services.factory("FormEditStatusServcie", function() {
        return {
            firstMaintenanceDate: true,
            lastMaintenanceDate: true,
            description: true,
            fareBasis: true,
            availability: true,
            freeBaggageAllowancePieces: true,
            firstExcessOccurrence: true,
            lastExcessOccurrence: true,
            freeBaggageAllowanceWeight: true,
            freeBaggageAllowanceUnit: true,
            baggageTravelApplication: true,
            list196VO: true,
            noChargeNotAvailable: true,
            list170VO: true,
            list201VO: true,
            specSevFeeAndOrIndicator: true,
            specifiedServiceFeeMileage: true,
            specifiedServiceFeeApp: true,
            specServiceFeeColSub: true,
            specServiceFeeNetSell: true,
            indicatorComission: true,
            taxApplication: true,
            sequenceNumber: true,
            passengerTypeCode: true,
            minPassengerAge: true,
            maxPassengerAge: true,
            firstPassengerOccurrence: true,
            lastPassengerOccurrence: true,
            frequentFlyerStatus: true,
            mileageMinimum: true,
            mileageMaximum: true,
            customerIndexScoreMinimum: true,
            customerIndexScoreMaxmum: true,
            list172VO: true,
            list183VO: true,
            publicPrivateIndicator: true,
            geoSpecFromToWithin: true,
            geoSpecSectPortJourney: true,
            geoSpecTravelIndicator: true,
            geoSpecExceptionStopTime: true,
            geoSpecExceptionStopUnit: true,
            geoSpecStopConnDes: true,
            geoSpecLoc1Type: true,
            geoSpecLoc1: true,
            list178Loc1: true,
            geoSpecLoc2Type: true,
            geoSpecLoc2: true,
            geoSpecLoc3Type: true,
            geoSpecLoc3: true,
            list178Loc3: true,
            travelStartDate: true,
            travelEndDate: true,
            startTime: true,
            stopTime: true,
            timeApplication: true,
            dayOfWeek: true,
            equipment: true,
            list165VO: true,
            list186VO: true,
            cabin: true,
            list198VO: true,
            upgradeToCabin: true,
            list198UpgradeVO: true,
            advancedPurchasePeriod: true,
            advancedPurchaseUnit: true,
            tourCode: true,
            list173TicketVO: true,
            tariff: true,
            rule: true,
            list173TktVO: true,
            list171VO: true,
            advancedPurchaseTktIssue: true,
            indicatorReissueRefund: true,
            formOfRefund: true,
            indicatorInterline: true
        };
    });
    //整个页面的组件在servcieType为xxx时应该显示到页面上
    services.factory("FormStatusService", function() {
        return {
            firstMaintenanceDate: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "firstMaintenanceDate" ],
                showFlag: true,
                editFlag: true
            },
            lastMaintenanceDate: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "lastMaintenanceDate" ],
                showFlag: true,
                editFlag: true
            },
            description: {
                typeList: [ "F", "M", "R", "T", "B", "E" ],
                groupList: [],
                nameList: [ "description" ],
                showFlag: true,
                editFlag: true
            },
            fareBasis: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "fareBasis" ],
                showFlag: true,
                editFlag: true
            },
            availability: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "availability" ],
                showFlag: true,
                editFlag: true
            },
            freeBaggageAllowancePieces: {
                typeList: [ "A" ],
                groupList: [],
                nameList: [ "freeBaggageAllowancePieces" ],
                showFlag: true,
                editFlag: true
            },
            firstAndLastExcessOccurrence: {
                typeList: [ "C", "P" ],
                groupList: [],
                nameList: [ "firstExcessOccurrence", "lastExcessOccurrence" ],
                showFlag: true,
                editFlag: true
            },
            freeBaggageAllowanceWeight: {
                typeList: [ "A", "C", "P" ],
                groupList: [],
                nameList: [ "freeBaggageAllowanceWeight", "freeBaggageAllowanceUnit" ],
                showFlag: true,
                editFlag: true
            },
            baggageTravelApplication: {
                typeList: [ "A", "C", "P" ],
                groupList: [],
                nameList: [ "baggageTravelApplication" ],
                showFlag: true,
                editFlag: true
            },
            list196VO: {
                typeList: [ "A", "C", "P" ],
                groupList: [],
                nameList: [ "list196VO" ],
                showFlag: true,
                editFlag: true
            },
            noChargeNotAvailable: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "noChargeNotAvailable" ],
                showFlag: true,
                editFlag: true
            },
            list170VOAndlist201VO: {
                typeList: [ "F", "M", "R", "T", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "list170VO", "list201VO" ],
                showFlag: true,
                editFlag: true
            },
            specSevFeeAndOrIndicator: {
                typeList: [ "F", "M", "R", "T", "C", "P" ],
                groupList: [],
                nameList: [ "specSevFeeAndOrIndicator" ],
                showFlag: true,
                editFlag: true
            },
            specifiedServiceFeeMileage: {
                typeList: [ "F", "M", "R", "T", "C", "P" ],
                groupList: [],
                nameList: [ "specifiedServiceFeeMileage" ],
                showFlag: true,
                editFlag: true
            },
            specifiedServiceFeeApp: {
                typeList: [ "F", "M", "R", "T", "C", "P" ],
                groupList: [],
                nameList: [ "specifiedServiceFeeApp" ],
                showFlag: true,
                editFlag: true
            },
            specServiceFeeColSub: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "specServiceFeeColSub" ],
                showFlag: true,
                editFlag: true
            },
            specServiceFeeNetSell: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "specServiceFeeNetSell" ],
                showFlag: true,
                editFlag: true
            },
            indicatorComission: {
                typeList: [ "F", "M", "R", "T", "C", "P" ],
                groupList: [],
                nameList: [ "indicatorComission" ],
                showFlag: true,
                editFlag: true
            },
            taxApplication: {
                typeList: [ "F", "M", "R", "T", "C", "P" ],
                groupList: [],
                nameList: [ "taxApplication" ],
                showFlag: true,
                editFlag: true
            },
            sequenceNumber: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "sequenceNumber" ],
                showFlag: true,
                editFlag: true
            },
            passengerTypeCode: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "passengerTypeCode" ],
                showFlag: true,
                editFlag: true
            },
            minAndMaxPassengerAge: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "minPassengerAge", "maxPassengerAge" ],
                showFlag: true,
                editFlag: true
            },
            firstAndLastPassengerOccurrence: {
                typeList: [ "F", "M", "R", "T" ],
                groupList: [],
                nameList: [ "firstPassengerOccurrence", "lastPassengerOccurrence" ],
                showFlag: true,
                editFlag: true
            },
            frequentFlyerStatus: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "frequentFlyerStatus" ],
                showFlag: true,
                editFlag: true
            },
            mileageMinAndMaximum: {
                typeList: [ "F", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "mileageMinimum", "mileageMaximum" ],
                showFlag: true,
                editFlag: true
            },
            customerIndexScoreMinAndMaximum: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "customerIndexScoreMinimum", "customerIndexScoreMaxmum" ],
                showFlag: true,
                editFlag: true
            },
            list172VO: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "list172VO" ],
                showFlag: true,
                editFlag: true
            },
            list183VO: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "list183VO" ],
                showFlag: true,
                editFlag: true
            },
            publicPrivateIndicator: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "publicPrivateIndicator" ],
                showFlag: true,
                editFlag: true
            },
            geoSpecFromToWithin: {
                typeList: [ "F", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "geoSpecFromToWithin" ],
                showFlag: true,
                editFlag: true
            },
            geoSpecSectPortJourney: {
                typeList: [ "F", "R", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "geoSpecSectPortJourney" ],
                showFlag: true,
                editFlag: true
            },
            geoSpecTravelIndicator: {
                typeList: [ "F", "R", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "geoSpecTravelIndicator" ],
                showFlag: true,
                editFlag: true
            },
            geoSpecExceptionStopTimeAndUnit: {
                typeList: [ "F", "R", "A", "C", "P" ],
                groupList: [],
                nameList: [ "geoSpecExceptionStopTime", "geoSpecExceptionStopUnit" ],
                showFlag: true,
                editFlag: true
            },
            geoSpecStopConnDes: {
                typeList: [ "F", "R", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "geoSpecStopConnDes" ],
                showFlag: true,
                editFlag: true
            },
            geoSpecLoc1AndType: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "geoSpecLoc1Type", "geoSpecLoc1" ],
                showFlag: true,
                editFlag: true
            },
            list178Loc1: {
                typeList: [ "F", "M", "A", "C", "P", "T" ],
                groupList: [],
                nameList: [ "list178Loc1" ],
                showFlag: true,
                editFlag: true
            },
            geoSpecLoc2AndType: {
                typeList: [ "F", "R", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "geoSpecLoc2Type", "geoSpecLoc2" ],
                showFlag: true,
                editFlag: true
            },
            list178Loc2: {
                typeList: [ "F", "M", "A", "C", "P", "T" ],
                groupList: [],
                nameList: [ "list178Loc2" ],
                showFlag: true,
                editFlag: true
            },
            geoSpecLoc3AndType: {
                typeList: [ "F", "R", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "geoSpecLoc3Type", "geoSpecLoc3" ],
                showFlag: true,
                editFlag: true
            },
            list178Loc3: {
                typeList: [ "F", "M", "A", "C", "P", "T" ],
                groupList: [],
                nameList: [ "list178Loc3" ],
                showFlag: true,
                editFlag: true
            },
            travelStartDate: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "travelStartDate" ],
                showFlag: true,
                editFlag: true
            },
            travelEndDate: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "travelEndDate" ],
                showFlag: true,
                editFlag: true
            },
            startTime: {
                typeList: [ "F", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "startTime" ],
                showFlag: true,
                editFlag: true
            },
            stopTime: {
                typeList: [ "F", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "stopTime" ],
                showFlag: true,
                editFlag: true
            },
            timeApplication: {
                typeList: [ "hidden" ],
                groupList: [],
                nameList: [ "timeApplication" ],
                showFlag: true,
                editFlag: true
            },
            dayOfWeek: {
                typeList: [ "F", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "dayOfWeek" ],
                showFlag: true,
                editFlag: true
            },
            equipmentAndlist165: {
                typeList: [ "F", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "equipment", "list165VO" ],
                showFlag: true,
                editFlag: true
            },
            list186VO: {
                typeList: [ "F", "R", "T", "A", "B", "C", "E", "P" ],
                groupList: [],
                nameList: [ "list186VO" ],
                showFlag: true,
                editFlag: true
            },
            cabin: {
                typeList: [ "F", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "cabin" ],
                showFlag: true,
                editFlag: true
            },
            list198VO: {
                typeList: [ "F", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "list198VO" ],
                showFlag: true,
                editFlag: true
            },
            upgradeToCabin: {
                typeList: [ "F", "M" ],
                groupList: [ "UP", "BDUP" ],
                nameList: [ "upgradeToCabin" ],
                showFlag: true,
                editFlag: true
            },
            list198UpgradeVO: {
                typeList: [ "F", "M" ],
                groupList: [ "UP", "BDUP", "SA", "BDSA" ],
                nameList: [ "list198UpgradeVO" ],
                showFlag: true,
                editFlag: true
            },
            advancedPurchasePeriodAndUnit: {
                typeList: [ "F", "M", "R", "T", "C", "P" ],
                groupList: [],
                nameList: [ "advancedPurchasePeriod", "advancedPurchaseUnit" ],
                showFlag: true,
                editFlag: true
            },
            tourCode: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "tourCode" ],
                showFlag: true,
                editFlag: true
            },
            list173TicketVO: {
                typeList: [ "F", "M", "R", "T", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "list173TicketVO" ],
                showFlag: true,
                editFlag: true
            },
            tariff: {
                typeList: [ "F", "R", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "tariff" ],
                showFlag: true,
                editFlag: true
            },
            rule: {
                typeList: [ "F", "R", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "rule" ],
                showFlag: true,
                editFlag: true
            },
            list173TktVO: {
                typeList: [ "F", "R", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "list173TktVO" ],
                showFlag: true,
                editFlag: true
            },
            list171VO: {
                typeList: [ "F", "R", "A", "B", "C", "P" ],
                groupList: [],
                nameList: [ "list171VO" ],
                showFlag: true,
                editFlag: true
            },
            advancedPurchaseTktIssue: {
                typeList: [ "F", "R", "T", "P" ],
                groupList: [],
                nameList: [ "advancedPurchaseTktIssue" ],
                showFlag: true,
                editFlag: true
            },
            indicatorReissueRefund: {
                typeList: [ "F", "M", "A", "C", "P", "T" ],
                groupList: [],
                nameList: [ "indicatorReissueRefund" ],
                showFlag: true,
                editFlag: true
            },
            formOfRefund: {
                typeList: [ "F", "M", "R", "T", "C", "P" ],
                groupList: [],
                nameList: [ "formOfRefund" ],
                showFlag: true,
                editFlag: true
            },
            indicatorInterline: {
                typeList: [ "F", "M", "R", "T", "C", "P" ],
                groupList: [],
                nameList: [ "indicatorInterline" ],
                showFlag: true,
                editFlag: true
            }
        };
    });
});

define("fare/oc/1.0.0/edit/directives/index-debug", [ "fare/oc/1.0.0/edit/directives/commonDirective-debug", "fare/oc/1.0.0/edit/directives/directives-debug", "underscore-debug", "fare/oc/1.0.0/edit/directives/basicInfoDirective-debug", "fare/oc/1.0.0/edit/directives/ruleDetailDirective-debug", "fare/oc/1.0.0/edit/directives/tableDirective-debug" ], function(require, exports, module) {
    require("fare/oc/1.0.0/edit/directives/commonDirective-debug");
    //公共指令
    require("fare/oc/1.0.0/edit/directives/basicInfoDirective-debug");
    //基本信息指令
    //require("./tb198UpGradeDirective") ;//[座位属性表/升舱属性]table198指令
    require("fare/oc/1.0.0/edit/directives/ruleDetailDirective-debug");
    //规则明细指令
    require("fare/oc/1.0.0/edit/directives/tableDirective-debug");
});

define("fare/oc/1.0.0/edit/directives/commonDirective-debug", [ "fare/oc/1.0.0/edit/directives/directives-debug", "underscore-debug" ], function(require, exports, module) {
    var directives = require("fare/oc/1.0.0/edit/directives/directives-debug");
    var _ = require("underscore-debug");
    //var forceHtml = require('../../tpls/edit/force.html') ;
    //显示隐藏表格
    directives.directive("showHideTable", [ "TableStatusServcie", function(TableStatusServcie) {
        return {
            restrict: "E",
            replace: true,
            scope: {},
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                $scope.tableStatus = TableStatusServcie;
            } ],
            template: function(elem, attrs) {
                var tname = attrs["tname"];
                var tmpStr = "tableStatus." + tname + ".showFlag";
                var html = '<a  href = "javascript:void(0)"><span ng-if="' + tmpStr + '" >收起表格</span><span ng-if="!' + tmpStr + '">填写表格</span></a>';
                return html;
            },
            transclude: true,
            link: function(scope, element, attrs) {
                element.bind("click", function() {
                    var tname = attrs["tname"];
                    scope.$apply(function() {
                        TableStatusServcie[tname]["showFlag"] = !TableStatusServcie[tname]["showFlag"];
                    });
                });
            }
        };
    } ]);
    //刚添加的一行表格td需要触发focus函数,否则如果直接点击页头部分的保存按钮将无法进行tui的require等校验//不知道为什么
    directives.directive("setFocus", function() {
        return {
            restrict: "AE",
            replace: true,
            scope: true,
            link: function(scope, elem, attrs) {
                elem.trigger("click");
            }
        };
    });
    //区域长度限制
    directives.directive("geoMaxLength", function() {
        return {
            restrict: "AE",
            replace: true,
            scope: true,
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                $scope.getGeoLengthByType = function(type) {
                    type = type || "";
                    var obj = {
                        A: "1",
                        C: "3",
                        N: "2",
                        P: "3",
                        S: "2",
                        Z: "3"
                    };
                    var len = eval("obj['" + type + "']") || 0;
                    return len;
                };
            } ],
            link: function(scope, element, attrs) {
                scope.$watch(attrs["geoMaxLength"], myWatchCallbackFunc);
                function myWatchCallbackFunc() {
                    var geoMaxLength = attrs["geoMaxLength"];
                    var value = scope.$eval(geoMaxLength);
                    var len = scope.getGeoLengthByType(value);
                    element.attr("maxLength", len);
                }
            }
        };
    });
    //tui长度限制属性
    directives.directive("tuiMaxLength", function() {
        return {
            restrict: "AE",
            replace: true,
            scope: true,
            // 这个必须加上要不然会造成混乱
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                //下面两个是内部工具函数
                $scope.strToJson = function(str) {
                    var json = eval("(" + str + ")");
                    return json;
                };
                $scope.splitMaxLengtAttr = function(tuiMaxLengthStr) {
                    var obj = {};
                    var start1 = tuiMaxLengthStr.indexOf("{");
                    var end1 = tuiMaxLengthStr.indexOf("}");
                    var str1 = tuiMaxLengthStr.substr(start1, end1 + 1);
                    var start2 = tuiMaxLengthStr.indexOf("[");
                    var end2 = tuiMaxLengthStr.indexOf("]");
                    var str2 = tuiMaxLengthStr.substring(start2 + 1, end2);
                    obj.str1 = $scope.strToJson(str1);
                    obj.str2 = str2;
                    return obj;
                };
            } ],
            link: function(scope, element, attrs) {
                scope.$watch(attrs["tuiMaxLength"], myWatchCallbackFunc);
                function myWatchCallbackFunc() {
                    var tuiMaxLength = attrs["tuiMaxLength"];
                    var info = scope.splitMaxLengtAttr(tuiMaxLength);
                    var value2 = scope.$eval(info.str2);
                    var valueAttrStr = "info.str1['" + value2 + "'] ";
                    var valueAtrr = eval(valueAttrStr);
                    element.attr("maxLength", valueAtrr);
                }
            }
        };
    });
    directives.directive("upperInput", function() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;
                // do nothing if no ng-model
                // Specify how UI should be updated
                ngModel.$render = function() {
                    var tmp = ngModel.$viewValue || "";
                    tmp = tmp.toUpperCase();
                    element.val(tmp);
                    ngModel.$setViewValue(tmp);
                };
                // Listen for change events to enable binding
                element.bind("blur", function() {
                    scope.$apply(read);
                });
                //read(); // initialize
                /// Write data to the model
                function read() {
                    var tmp = ngModel.$viewValue || "";
                    tmp = tmp.toUpperCase();
                    ngModel.$setViewValue(tmp);
                    element.val(tmp);
                }
            }
        };
    });
    //178表格显示隐藏的链接指令
    directives.directive("linkTable", function() {
        return {
            restrict: "AE",
            replace: true,
            scope: {
                list: "=",
                geo: "=",
                status: "="
            },
            controller: [ "$scope", function($scope) {
                //点击显示隐藏表格事件处理
                $scope.myClick = function() {
                    $scope.geo.showFlag = !$scope.geo.showFlag;
                    if (!$scope.geo.showFlag) {
                        ////点击取消自定义区域
                        var len = $scope.list.length;
                        if ($scope.status != "3") {
                            //把数据清空
                            outAllSelect();
                            $scope.list.splice(0, len);
                        }
                    }
                };
                function outAllSelect() {
                    //将所有tr全部置为非选中状态
                    angular.forEach($scope.list, function(l) {
                        l.selected = false;
                    });
                }
            } ],
            template: '<a href="javascript:void(0)"><span ng-show="!geo.showFlag">自定义区域</span><span ng-show="geo.showFlag">取消自定义</span></a>',
            link: function(scope, elem, attrs, ctrl) {
                elem.bind("click", function() {
                    scope.$apply(function() {
                        scope.myClick();
                    });
                });
            }
        };
    });
    //日期插件
    directives.directive("datepicker", function() {
        return {
            restrict: "A",
            scope: {},
            require: "ngModel",
            link: function(scope, elem, attr, ctrl) {
                if (!ctrl) return;
                var minDateStr = attr["datepicker"];
                var minDate = new Date(minDateStr);
                //配置日期控件
                var optionObj = {};
                optionObj.dateFormat = "yy-mm-dd";
                var updateModel = function(dateText) {
                    scope.$apply(function() {
                        //调用angular内部的工具更新双向绑定关系
                        ctrl.$setViewValue(dateText);
                    });
                };
                optionObj.onSelect = function(dateText, picker) {
                    updateModel(dateText);
                    // elem.focus() ;
                    validator.element(elem);
                    if (scope.select) {
                        scope.$apply(function() {
                            scope.select({
                                date: dateText
                            });
                        });
                    }
                };
                optionObj.minDate = minDate;
                optionObj.showButtonPanel = true;
                ctrl.$render = function() {
                    //使用angular内部的 binding-specific 变量
                    elem.datepicker("setDate", ctrl.$viewValue || "");
                };
                $(elem).datepicker(optionObj);
            }
        };
    });
    //时间插件
    directives.directive("timepicker", function() {
        return {
            restrict: "A",
            scope: {},
            link: function(scope, elem, attr) {
                var timeVar = {
                    controlType: "select",
                    timeFormat: "HHmm",
                    timeOnly: true,
                    timeOnlyTitle: "选择时间",
                    //Choose Time
                    timeText: "时间",
                    //Time
                    hourText: "小时",
                    //Hou
                    minuteText: "分钟",
                    //Minute
                    currentText: "当前",
                    //Current
                    closeText: "关闭"
                };
                $(elem).datetimepicker(timeVar);
            }
        };
    });
    //重置数据
    var resetDataByFlag = function(nameList, flag, data, orgData) {
        if (!flag) {
            //如果隐藏这需要重置数据
            for (var i = 0; i < nameList.length; i++) {
                var curName = nameList[i];
                var orgValue = angular.copy(orgData[curName]);
                data[curName] = orgValue;
            }
        }
    };
    var getFlagByServcieTypeAndServiceGroup = function(typeList, groupList, serviceType, serviceGroup) {
        var flag = _.contains(typeList, serviceType);
        if (flag && groupList && groupList.length > 0) {
            flag = _.contains(groupList, serviceGroup);
        }
        return flag;
    };
    //增强指令
    directives.directive("force", [ "FormStatusService", "FormData", function(FormStatusService, FormData) {
        return {
            restrict: "E",
            //restrict
            scope: {
                orgData: "="
            },
            replace: true,
            template: function(elem, attrs) {
                var fname = attrs["fname"];
                var tmpStr = "showStatus." + fname + ".showFlag";
                var html = '<div class="row row_from" ng-show= "' + tmpStr + '" ng-transclude=""></div>';
                return html;
            },
            transclude: true,
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                $scope.showStatus = FormStatusService;
            } ],
            link: function(scope, elem, attrs) {
                //
                /*@param : event 事件本身
		        	 *@param ：needDigest ： 是否需要手动进行脏数据检查
		        	 */
                scope.$on("serviceTypeChangeNotice", function(event, needDigest) {
                    var fname = attrs["fname"];
                    var typeList = FormStatusService[fname]["typeList"];
                    var groupList = FormStatusService[fname]["groupList"];
                    var serviceType = FormData.serviceType;
                    var serviceGroup = FormData.sel1.value;
                    var oldFlag = FormStatusService[fname]["showFlag"];
                    var flag = getFlagByServcieTypeAndServiceGroup(typeList, groupList, serviceType, serviceGroup);
                    //console.info(fname + ' -- ' + flag + '   , serviceType : ['+serviceType+'] , typeList ['+typeList+'] , groupList :['+groupList+']  , servcieGroup : ['+serviceGroup+'] ') ;
                    if (oldFlag == !flag) {
                        //如果不同
                        var nameList = FormStatusService[fname]["nameList"];
                        resetDataByFlag(nameList, flag, FormData, scope.orgData);
                        FormStatusService[fname]["showFlag"] = flag;
                        if (needDigest && needDigest == "true") {
                            scope.$digest();
                        }
                    }
                });
                /*
					  @param :event :自带的事件本身
					 * @param :in_fname : 传入的forceName  
					 * @param :in_flag :传入的隐藏显示的falg----第一要传递字符串
					 * @param :needDigest ：是否需要手动脏数据检查  第一要传递字符串
					*/
                scope.$on("singleChangeByFlagNotice", function(event, in_fname, in_flag, needDigest) {
                    var fname = attrs["fname"];
                    var tmpFlag = in_flag == "true" ? true : false;
                    if (fname == in_fname) {
                        //判断接受者是否为自己，如果为自己则需要相应的处理
                        var oldFlag = FormStatusService[fname]["showFlag"];
                        //console.info("fname : ["+fname+"] , tmpFlag : ["+tmpFlag+"] , oldFlag : ["+oldFlag+"] ") ;
                        if (tmpFlag == !oldFlag) {
                            var nameList = FormStatusService[fname]["nameList"];
                            resetDataByFlag(nameList, tmpFlag, FormData, scope.orgData);
                            FormStatusService[fname]["showFlag"] = tmpFlag;
                            if (needDigest && needDigest == "true") {
                                scope.$digest();
                            }
                        }
                    }
                });
            }
        };
    } ]);
});

define("fare/oc/1.0.0/edit/directives/directives-debug", [], function(require, exports, module) {
    var directives = angular.module("app.directives", []);
    return directives;
});

define("fare/oc/1.0.0/edit/directives/basicInfoDirective-debug", [ "underscore-debug", "fare/oc/1.0.0/edit/directives/directives-debug" ], function(require, exports, module) {
    var _ = require("underscore-debug");
    var directives = require("fare/oc/1.0.0/edit/directives/directives-debug");
    var headerHtml = require("fare/oc/1.0.0/tpls/edit/header-debug.html");
    var chooseDivHtml = require("fare/oc/1.0.0/tpls/edit/choose_div-debug.html");
    var chooseUlHtml = require("fare/oc/1.0.0/tpls/edit/choose-ul-debug.html");
    directives.directive("headerDrct", function() {
        return {
            restrict: "AE",
            replace: "true",
            scope: true,
            template: headerHtml,
            link: function(scope, elem, attrs) {}
        };
    });
    directives.directive("chooseDiv", function() {
        return {
            restrict: "AE",
            replace: "true",
            scope: true,
            transclude: true,
            template: chooseDivHtml,
            compile: function compile(tElement, tAttrs, transclude) {
                var urlStr = tAttrs["htmlUrl"];
                var template = _.template(chooseUlHtml);
                var htmlStr = template({
                    value: urlStr
                });
                var tmpDiv = angular.element(tElement).find("div.service_list");
                tmpDiv.append(htmlStr);
            }
        };
    });
});

define("fare/oc/1.0.0/tpls/edit/header-debug.html", [], '<div class="main_box helper_padding_0" ng-controller = "HeaderCtrl">\n	<div class="header_control query_section">\n		<!-- title index -->\n		<div class="helper_float_left query_section_row edit_header">\n			<h1 class="helper_margin_right_10px" ng-bind = "headerTipStr"></h1>\n			<span class="helper_color_blue_2 ">服务类型</span>\n			<span class="helper_color_blue_2 ">|</span>\n			<span class="helper_color_blue_2 ">费用</span>\n			<span class="helper_color_blue_2 ">|</span>\n			<span class="helper_color_blue_2 ">规则</span>\n		</div>\n		<!-- title index -->\n		<!-- 功能按钮start -->\n		<div class="helper_float_right operation_btnlist">\n			<div class="helper_float_left helper_margin_0_2px margin_top_5px" >\n				<div class="btn_page btn_cancel">\n					<div class="btn_left"></div>\n					<div class="btn_content" id="back" ng-click = "backPage();">返回</div>\n					<div class="btn_right"></div>\n				</div>\n			</div>\n			<div class="helper_float_left helper_margin_0_2px margin_top_5px">\n				<div class="btn_page btn_cancel">\n					<div class="btn_left"></div>\n					<div class="btn_content" id="s7_save">保存</div>\n					<div class="btn_right"></div>\n				</div>\n			</div>\n			<div class="helper_float_left helper_margin_0_2px margin_top_5px">\n				<div class="btn_page btn_save">\n					<div class="btn_left"></div>\n					<div class="btn_content" id="s7_saveAndPublish" >保存并发布</div>\n					<div class="btn_right"></div>\n				</div>\n			</div>\n			<div class="clearfix"></div>\n		</div>\n		<!-- 功能按钮end -->\n		<div class="clearfix"></div>\n	</div>\n</div>');

define("fare/oc/1.0.0/tpls/edit/choose_div-debug.html", [], '<div class="choose_box">\n	<div class="srch_input">\n		<div class="helper_float_left input_outer"  ng-transclude="">\n		</div>\n		<div class="clearfix"></div>\n	</div>\n	<div class="service_list">\n	</div>\n</div>');

define("fare/oc/1.0.0/tpls/edit/choose-ul-debug.html", [], '<ul>\n<%if("choose1.html"==value){%>\n	<li bindonce ng-repeat="l in serviceGroupList | serviceGroupFilter:chooseInputData.choose1"\n	 	ng-click="subGroupQuery(l.serviceGroupDescription,l.serviceGroup)" bo-bind="l.serviceGroupDescription">\n	</li>\n<%}else if("choose2.html"==value){%>\n	<li bindonce ng-repeat="l in subGroupList | subGroupFilter : chooseInputData.choose2"\n	 	ng-click="s5Query(l.subGroupDescription,l.subGroup)"  bo-bind="l.subGroupDescription">\n	</li>\n<%}else if("choose3.html"==value){%>\n	<li bindonce ng-repeat="l in lastGroupList  | lastGroupFilter : chooseInputData.choose3"\n	    ng-click="lastChooseClick(l)" class="choose4li">\n		<div class="service_name">\n			<p class="helper_float_left" bo-bind="\'[\'+l.serviceSubCode+\']\'+l.commercialName"></p>\n			<span class="helper_float_left serviceTypeSpan" bo-bind = "l.serviceType"></span>\n			<div class="clearfix"></div>\n		</div>\n	</li>\n<%}else if("choose4.html"==value){%>\n	<li bindonce ng-repeat="l in lastGroupList2" class="choose4li">\n		<div class="service_name">\n			<p class="helper_float_left" bo-bind="\'[\'+l.subCode+\']\'+l.commercialName"></p>\n			<span class = "helper_float_left serviceTypeSpan" ng-bind = "l.serviceType"></span>\n			<span bo-bind="\'x\'+l.subCodeOccurence"></span>\n			<div class="clearfix"></div>\n		</div>\n	</li>\n<%}%>\n</ul>\n');

define("fare/oc/1.0.0/edit/directives/ruleDetailDirective-debug", [ "fare/oc/1.0.0/edit/directives/directives-debug" ], function(require, exports, module) {
    var directives = require("fare/oc/1.0.0/edit/directives/directives-debug");
    var geoSpecInputHtml = '<div class="helper_float_left single_edit_div">' + '   <label class="nostyle" ng-transclude="">' + "   </label>" + "</div>";
    var geoSpecLocHtml = require("fare/oc/1.0.0/tpls/edit/geoSpecLoc-debug.html");
    //区域部分input套一层壳
    directives.directive("geoSpecInput", function() {
        return {
            restrict: "E",
            replace: true,
            scope: true,
            template: geoSpecInputHtml,
            transclude: true
        };
    });
});

define("fare/oc/1.0.0/tpls/edit/geoSpecLoc-debug.html", [], '<div>\n	<!--区域头部开始-->\n	<div class="each_edit_div">\n		<label>{{title}}</label>\n		<div class="each_content_div" ng-transclude="">\n			\n		</div>\n		<div class="clearfix"></div>\n	</div>\n	<!--区域头部结束-->\n	<!--自定义区域部分开始-->\n	<div class="each_edit_div" ng-show = "showTableFlag">\n		<label>&nbsp;</label>\n		<div class = "each_content_div" >\n			<div class = "table_layout">\n				<table>\n					<thead>\n						<tr>\n							<th>类型</th>\n							<th>代码</th>\n							<th>是否适用</th>\n						</tr>\n					</thead>\n					<tbody>\n						<tr class = "hidden">\n							<!-- 这一个inpuy非常重要不能删除 -->\n							<td colspan="4"><input  id = "{{hiddenInputId}}"   type = "text" /></td>\n						</tr>\n						<tr ng-repeat = "l178 in list" ng-click = "clickTr178(l178);" ng-class = "{true:\'selectTd\',false:\'\'}[l178.selected]">\n							<td>\n								<select ng-model="l178.geoLocType"  class = "select_width" style="width:100px;"\n									ng-options="b.value as b.name for b in geoList" \n									ng-change="selectChange178Tb(l178)" >\n								</select>  \n							</td>\n							<td>\n								<div class="input_outer">\n									<input ng-model = "l178.geoLocSpec" geo-max-length = "l178.geoLocType"  \n										   ng-class = "{\'A\':\'tuiRequired tuiAreaCode\',\'C\':\'tuiRequired tuiCityCode\',\'N\':\'tuiRequired tuiCountryCode\',\'P\':\'tuiRequired tuiAirportCode\',\'S\':\'tuiRequired tuiStateCode\',\'Z\':\'tuiRequired tuiZoneCode\'}[l178.geoLocType]"\n										   type="text" tabindex="3" size="5" class="input_normal tuiUpper"/>\n								</div>\n							</td>\n							<td>\n								<div class="input_outer">\n								   <input ng-model = "l178.appl" type="radio" tabindex="3" size="5" class="input_normal"  value="" />适用\n								   <input ng-model = "l178.appl" type="radio" tabindex="3" size="5" class="input_normal"  value="N" />不适用\n								</div>\n							</td>\n						</tr>\n					</tbody>\n				</table>\n				<div class="helper_margin_top_10px">\n					<div class="btn_page btn_add_small">\n	                	<div class="btn_left"></div>\n	                    <div class="btn_content" ng-click = "tb178AddLine();">增加一行</div>\n	                    <div class="btn_right"></div>\n	                </div>\n					<div class="btn_page btn_add_small_2">\n	                	<div class="btn_left"></div>\n	                    <del-tb178></del-tb178>\n	                    <div class="btn_right"></div>\n	                </div>\n					<div class="clearfix"></div>\n				</div>\n			</div>\n			\n			\n			\n		</div>\n		<div class="clearfix"></div>\n	</div>\n	<!--自定义区域部分结束-->\n</div>\n');

define("fare/oc/1.0.0/edit/directives/tableDirective-debug", [ "fare/oc/1.0.0/edit/directives/directives-debug", "underscore-debug" ], function(require, exports, module) {
    var directives = require("fare/oc/1.0.0/edit/directives/directives-debug");
    var tableHtml = require("fare/oc/1.0.0/tpls/edit/table-debug.html");
    var trHtml = require("fare/oc/1.0.0/tpls/edit/tr-debug.html");
    var theadHtml = require("fare/oc/1.0.0/tpls/edit/thead-debug.html");
    var _ = require("underscore-debug");
    directives.directive("tableInfo", function() {
        return {
            restrict: "AE",
            replace: true,
            template: tableHtml,
            scope: {
                tableData: "=",
                list: "=",
                tableWidth: "@",
                data: "="
            },
            controller: [ "$scope", function($scope) {
                $scope.column = $scope.tableData.titieList.length;
                //$scope.list = $scope.tableData.list ;//这个list如果是在tableData中传递过来的话，如果是更新视图，则不会刷新视图，不知道为什么
                $scope.status = $scope.data.statusDes;
                $scope.titleList = $scope.tableData.titieList;
                $scope.canNotModifyFlag = function() {
                    var flag = false;
                    if ($scope.status == "3") {
                        flag = true;
                    }
                    return flag;
                };
                //新增一行记录
                $scope.tbAddLine = function() {
                    if ($scope.status != "3") {
                        outAllSelect();
                        //var obj = $.extend({},$scope.tableData.addObj)//也就是将"{}"作为dest参数。 ;
                        var obj = angular.copy($scope.tableData.addObj);
                        $scope.list.push(obj);
                    }
                };
                //删除一行记录
                $scope.tbDelLine = function() {
                    var len = $scope.list.length;
                    if (len >= 1) {
                        var num = len - 1;
                        angular.forEach($scope.list, function(l, index) {
                            if (l.selected) {
                                num = index;
                            }
                        });
                        $scope.$apply(function() {
                            outAllSelect();
                            $scope.list.splice(num, 1);
                        });
                    }
                };
                function outAllSelect() {
                    //将所有tr全部置为非选中状态
                    angular.forEach($scope.list, function(l) {
                        l.selected = false;
                    });
                }
                $scope.clickTr = function(l) {
                    outAllSelect();
                    l.selected = true;
                };
                //下面是特殊的部分，select可能会存在//如果你的表格比较特殊的话可能需要修改修改下面的部分代码
                /**这一部分算是半工作能够部分(因为有的表格会使用这部分数据，但是有的表格不使用这部分数据)**/
                $scope.geoSpecTypeList = [ {
                    name: "选择",
                    value: ""
                }, {
                    name: "A-大区",
                    value: "A"
                }, {
                    name: "C-城市",
                    value: "C"
                }, {
                    name: "N-国家",
                    value: "N"
                }, {
                    name: "P-机场",
                    value: "P"
                }, {
                    name: "S-州",
                    value: "S"
                }, {
                    name: "Z-区域",
                    value: "Z"
                } ];
                $scope.codeTypeList = [ {
                    name: "选择",
                    value: ""
                }, {
                    name: "T-代理人office号",
                    value: "T"
                }, {
                    name: "I-IATA号",
                    value: "I"
                }, {
                    name: "Department/Identifier",
                    value: "X"
                }, {
                    name: "CRS/CXR Department Code",
                    value: "V"
                }, {
                    name: "ERSP No",
                    value: "E"
                }, {
                    name: "LNIATA Number (CRT Address)",
                    value: "L"
                }, {
                    name: "Airline specific codes",
                    value: "A"
                } ];
                //市场方/承运方
                $scope.marketingOpreratingList = [ {
                    name: "选择",
                    value: ""
                }, {
                    name: "M-市场方",
                    value: "M"
                }, {
                    name: "O-承运方",
                    value: "O"
                }, {
                    name: "E-市场方/承运方",
                    value: "E"
                } ];
                /*********183特殊部分开始*******************/
                $scope.selectChange183Tb1 = function(l183) {
                    l183.geographicSpecification = "";
                };
                $scope.selectChange183Tb2 = function(l183) {
                    l183.code = "";
                };
                $scope.viewBookTktList = [ // 权限list
                {
                    name: "选择",
                    value: ""
                }, {
                    name: "查看/订票/出票",
                    value: 1
                }, {
                    name: "仅查看",
                    value: 2
                } ];
                /*********183特殊部分结束*******************/
                /*********198特殊部分开始*******************/
                $scope.selectChange198Tb = function(l198) {
                    reseat198VO(l198);
                };
                //重置数据
                function reseat198VO(l198) {
                    if (l198) {
                        l198.cxr = "";
                        l198.rbd1 = "";
                        l198.rbd2 = "";
                        l198.rbd3 = "";
                        l198.rbd4 = "";
                        l198.rbd5 = "";
                    }
                }
                /*********198特殊部分结束*******************/
                /*********170特殊部分开始*******************/
                $scope.selectChange170Tb = function(l170) {
                    reseat170VO(l170);
                };
                function reseat170VO(l170) {
                    if (l170) {
                        l170.saleGeographicPoint = "";
                    }
                }
                /*********170特殊部分结束*******************/
                //178表格的区域select框发生变化时触发的函数
                $scope.selectChange178Tb = function(l178) {
                    l178.geoLocSpec = "";
                };
            } ],
            compile: function compile(tElement, tAttrs, transclude) {
                var urlStr = tAttrs["htmlUrl"];
                var headerTeplate = _.template(theadHtml);
                var bodyTemplate = _.template(trHtml);
                var headStr = headerTeplate({
                    value: urlStr
                });
                var bodyStr = bodyTemplate({
                    value: urlStr
                });
                var tableElement = angular.element(tElement);
                tableElement.find("thead").append(headStr);
                tableElement.find("tbody").append(bodyStr);
                return {
                    pre: function(scope, element, attrs) {},
                    post: function(scope, element, attrs) {
                        element.find("div.delete_line").bind("click", function() {
                            if (scope.status != "3") {
                                scope.tbDelLine();
                            }
                        });
                    }
                };
            }
        };
    });
});

define("fare/oc/1.0.0/tpls/edit/table-debug.html", [], '<div class = "table_layout" style="width: {{tableWidth}}px;">\n<table>\n<thead>\n</thead>\n<tbody>\n</tbody>\n</table>\n<div class="helper_margin_top_10px">\n	<div class="btn_page btn_add_small">\n    	<div class="btn_left"></div>\n        <div class="btn_content" ng-click = "tbAddLine();" >增加一行</div>\n        <div class="btn_right"></div>\n    </div>\n	<div class="btn_page btn_add_small_2">\n    	<div class="btn_left"></div>\n		<div class="btn_content delete_line">删除一行</div>\n        <div class="btn_right"></div>\n    </div>\n	<div class="clearfix"></div>\n</div>\n</div>\n');

define("fare/oc/1.0.0/tpls/edit/tr-debug.html", [], '<tr ng-repeat = "l in list"   ng-click = "clickTr(l);" ng-class = "{true:\'selectTd\',false:\'\'}[l.selected]">\n<%if("tb183.html"==value){%>\n	<td>\n		<input  name="{{\'t1831\'+$index}}" ng-model = "l.travelAgency" ng-disabled="canNotModifyFlag()"  upper-input\n			maxLength = "1" type="text" tabindex="3" size="4" />\n	</td>\n	<td>\n		<input name="{{\'t1832\'+$index}}" ng-model = "l.carrierGds" maxLength = "3" ng-disabled="canNotModifyFlag()"  \n			type="text" tabindex="3" size="4" />\n		\n	</td>\n	<td>\n		<input name="{{\'t1833\'+$index}}"  ng-model = "l.dutyFunctionCode" maxLength = "2" ng-disabled="canNotModifyFlag()"  \n				type="text" tabindex="3" size="4" />\n	</td>\n	<td>\n		<select  ng-model="l.geographicSpecificationType"  ng-disabled="canNotModifyFlag()"  style="width:100px;"\n				ng-options="c.value as c.name for c in geoSpecTypeList" ng-change="selectChange183Tb1(l)">\n		</select>\n	</td>\n	<td>\n		<input name="{{\'t1835\'+$index}}" ng-model = "l.geographicSpecification" ng-disabled="canNotModifyFlag()"  upper-input=""\n				geo-max-length = "l.geographicSpecificationType"  type="text" tabindex="3"  size="4"\n				ng-class = "{\'A\':\'required areacode\',\'C\':\'required citycode\',\'N\':\'required countrycode\',\'P\':\'required airportcode\',\'S\':\'required statecode\',\'Z\':\'required zonecode\'}[l.geographicSpecificationType]" />\n	</td>\n	<td>\n		<select ng-model="l.codeType"   style="width:100px;" ng-disabled="canNotModifyFlag()" \n				ng-options="d.value as d.name for d in codeTypeList" ng-change="selectChange183Tb2(l)">\n		</select>\n	</td>\n	<td>\n		<input name="{{\'t1836\'+$index}}" ng-model = "l.code" upper-input  ng-disabled="canNotModifyFlag()" type="text" \n			   tabindex="3" size="5"  ng-class = "{T:\'required office\',I:\'required iatanum\'}[l.codeType]"\n			   tui-max-length = "{\'T\':\'6\',\'I\':\'7\',\'X\':\'8\',\'V\':\'8\',\'E\':\'8\',\'L\':\'8\',\'A\':\'8\'}[l.codeType]" />\n	</td>\n	<td>\n		<select ng-model="l.viewBookTkt"   style="width:100px;" ng-disabled="canNotModifyFlag()" \n				ng-options="d.value as d.name for d in viewBookTktList">\n		</select>\n	</td>\n<%}else if("tb171.html"==value){%>\n	<td>\n		<input name="{{\'t1711\'+$index}}" ng-model = "l.carrier"  ng-disabled="canNotModifyFlag()"  upper-input set-focus \n			class = "air required" type = "text" tabindex="1" maxlength="3"  size = "16" />\n	</td>\n	<td>\n		<input  ng-model = "l.resFareClassCode"  ng-disabled="canNotModifyFlag()" \n			type = "text" tabindex="1" maxlength="16"  size = "16" />\n	</td>\n	<td >\n		<input  ng-model = "l.fareTypeCode"  ng-disabled="canNotModifyFlag()" \n				type = "text" tabindex="1" maxlength="3"  size = "16" />\n	</td>\n<%}else if ("tb172.html"==value){%>\n	<td>\n		<input  ng-model = "l.accountCode"  ng-disabled="canNotModifyFlag()"  type = "text" \n			tabindex="1" maxlength="20"  size = "16" />\n	</td>\n<%}else if ("tb173Ticket.html"==value){%>\n	<td>\n		<input  ng-model = "l.ticketDesignator"  ng-disabled="canNotModifyFlag()"  type = "text" \n				tabindex="1" maxlength="10"  size = "16" />\n	</td>\n<%}else if ("tb173Tkt.html"==value){%>\n	<td>\n		<input  ng-model = "l.ticketDesignator"  ng-disabled="canNotModifyFlag()" type = "text" tabindex="1"\n			 maxlength="10"  size = "16" />\n	</td>\n<%}else if ("tb165.html"==value){%>\n	<td>\n		<input name="{{\'t1651\'+$index}}" ng-model = "l.equipmentCode"  ng-disabled="canNotModifyFlag()"  upper-input="" \n			class = "lettersOrNumber" maxLength = "3" type = "text" size = "16"  />\n	</td>\n<%}else if("tb186.html"==value){%>\n	<td>\n		<input name="{{\'t1861\'+$index}}" ng-model = "l.mktCarrier" ng-disabled="canNotModifyFlag()" set-focus  \n			type="text" maxLength = "3" tabindex="3" size="5" class="required" />\n	</td>\n	<td>\n		<input ng-model = "l.optCarrier" maxLength ="3" ng-disabled="canNotModifyFlag()"  \n			type="text" tabindex="3" size="5" />\n	</td>\n	<td>\n		<input name="{{\'t1863\'+$index}}" ng-model = "l.fltNo1" maxLength = "4" ng-disabled="canNotModifyFlag()"  \n			type="text" tabindex="3" size="5" class="required"  />-\n		<input ng-model = "l.fltNo2" maxLength ="4" ng-disabled="canNotModifyFlag()"  type="text" \n			tabindex="3" size="5"  />\n</td>\n<%}else if ("tb196.html"==value){%>\n	<td>\n		<input name="{{\'t1961\'+$index}}" ng-model = "l.count"  ng-disabled="canNotModifyFlag()" \n			   maxLength = "2"  type="text" tabindex="3" size="15" class="positiveInteger"/>\n	</td>\n	<td>\n		<input name="{{\'t1962\'+$index}}" ng-model = "l.code"  upper-input set-focus  ng-disabled="canNotModifyFlag()"\n			ng-class="{true:\'chargeDO\',false:\'\'}[data.noChargeNotAvailable==\'D\'||data.noChargeNotAvailable==\'O\']"\n		 	maxLength = "3"  type="text" tabindex="3" size="15"  class="lettersOrNumber" />\n	</td>\n<%}else if ("tb198.html"==value){%>\n	<td>\n		<select ng-model="l.mktOp" ng-disabled="canNotModifyFlag()"  class = "select_width" style="width:100px;"\n			ng-change = "selectChange198Tb(l)" ng-options="b.value as b.name for b in marketingOpreratingList" >\n		</select>  \n	</td>\n	<td>\n		<input name="{{\'t1982\'+$index}}" ng-model = "l.cxr" upper-input ng-disabled="canNotModifyFlag()"  maxLength = "2"  typ \n		   ng-class = "{true:\'air required\',false:\'\'}[l.mktOp.length>0]"  tabindex="3" size="5" class="input_normal"/>\n	</td>\n	<td>\n		<input name="{{\'t1983\'+$index}}" ng-model = "l.rbd1" upper-input ng-disabled="canNotModifyFlag()"  maxLength = "1" \n		   type="text" tabindex="3" ng-class = "{true:\'seatcode required\',false:\'\'}[l.mktOp.length>0]"  size="3" />\n	</td>\n	<td>\n		<input name="{{\'t1983\'+$index}}" ng-model = "l.rbd2" upper-input ng-disabled="canNotModifyFlag()"  maxLength = "1"  \n			tabindex="3" ng-class = "{true:\'seatcode\',false:\'\'}[l.mktOp.length>0]" type="text"size="3" />\n	</td>\n	<td>\n		<input name="{{\'t1984\'+$index}}" ng-model = "l.rbd3"  upper-input ng-disabled="canNotModifyFlag()" maxLength = "1"  \n			tabindex="3" size="3" ng-class = "{true:\'seatcode\',false:\'\'}[l.mktOp.length>0]" type="text"  />\n	</td>\n	<td>\n		<input name="{{\'t1985\'+$index}}" ng-model = "l.rbd4"  upper-input ng-disabled="canNotModifyFlag()" \n			maxLength = "1"  tabindex="3" size="3" ng-class = "{true:\'seatcode\',false:\'\'}[l.mktOp.length>0]" type="text"  />\n	</td>\n	<td>\n		<input name="{{\'t1986\'+$index}}" ng-model = "l.rbd5" upper-input  ng-disabled="canNotModifyFlag()" maxLength = "1"  \n			tabindex="3" size="3" ng-class = "{true:\'seatcode\',false:\'\'}[l.mktOp.length>0]" type="text"  />\n	</td>\n<%}else if("tb198UpGrade.html"==value){%>\n	<td ng-if = "data.sel1.value==\'UP\'||data.sel1.value==\'BDUP\'">\n		<input name ="{{\'t198ug1\'+$index}}" ng-model = "l.cxr" upper-input ng-disabled="canNotModifyFlag()" \n			   class="air" maxLength="2"  type="text" tabindex="3" size="5" />\n	</td>\n	<td>\n		<input name ="{{\'t198ug2\'+$index}}" ng-model = "l.rbd1" upper-input set-focus ng-disabled="canNotModifyFlag()" \n			class="required seatcode" maxLength="1"  type="text" tabindex="3" size="7"  />\n	</td>\n	<td>\n		<input name ="{{\'t198ug3\'+$index}}" ng-model = "l.rbd2" upper-input ng-disabled="canNotModifyFlag()"  \n			class="seatcode" maxLength="1" type="text" tabindex="3" size="7" />\n	</td>\n	<td>\n		<input name ="{{\'t198ug4\'+$index}}" ng-model = "l.rbd3" upper-input  ng-disabled="canNotModifyFlag()"  \n			class="seatcode" maxLength="1" type="text" tabindex="3" size="7" />\n	</td>\n	<td>\n		<input name ="{{\'t198ug5\'+$index}}" ng-model = "l.rbd4" upper-input ng-disabled="canNotModifyFlag()"  \n			class="seatcode" maxLength="1" type="text" tabindex="3" size="7" />\n	</td>\n	<td>\n		<input name ="{{\'t198ug6\'+$index}}" ng-model = "l.rbd5" upper-input ng-disabled="canNotModifyFlag()"  \n			class="seatcode" maxLength="1" type="text" tabindex="3" size="7"  />\n	</td>\n<%}else if ("tb170.html"==value){%>\n	<td>\n		<select ng-model="l.saleGeographicPointType"  ng-disabled="canNotModifyFlag()" \n				ng-options="o.value as o.name for o in geoSpecTypeList" ng-change="selectChange170Tb(l)">\n		</select>\n	</td>\n	<td>\n		<input name = "{{\'t1701\'+$index}}"  ng-model = "l.saleGeographicPoint" ng-disabled="canNotModifyFlag()" \n			   upper-input geo-max-length = "l.saleGeographicPointType" \n			   ng-class = "{\'A\':\'required areacode\',\'C\':\'required citycode\',\'N\':\'required countrycode\',\'P\':\'required airportcode\',\'S\':\'required statecode\',\'Z\':\'required zonecode\'}[l.saleGeographicPointType]"\n			   type = "text" size = "16"  />\n	</td>\n	<td >\n		<input  name="{{\'t1702\'+$index}}" ng-model = "l.specFeeAmount" class = "required positiveInteger"  set-focus="" type = "text" \n			ng-disabled="canNotModifyFlag()" tabindex="1" maxlength="7"  size = "16" />\n	</td>\n	<td>\n		<input name = "{{\'t1703\'+$index}}" ng-model = "l.specFeeCurrency" upper-input  type = "text" \n			size = "16" maxlength="3"  ng-disabled="canNotModifyFlag()" class = "letter" \n			ng-class = "{true:\'required\',false:\'\'}[l.saleGeographicPointType.length>0]" />\n	</td>\n<%}else if("tb178.html"==value){%>\n	<td>\n		<select ng-model="l.geoLocType" ng-disabled="canNotModifyFlag()"  class = "select_width" style="width:100px;"\n			ng-options="b.value as b.name for b in geoSpecTypeList" ng-change="selectChange178Tb(l)" >\n		</select>  \n	</td>\n	<td>\n		<input name="{{\'t1782\'+$index}}" ng-model = "l.geoLocSpec" geo-max-length = "l.geoLocType" upper-input  \n			ng-disabled="canNotModifyFlag()" type="text" tabindex="3" size="5" class="input_normal"\n			ng-class = "{\'A\':\'required areacode\',\'C\':\'required citycode\',\'N\':\'required countrycode\',\'P\':\'required airportcode\',\'S\':\'required statecode\',\'Z\':\'required zonecode\'}[l.geoLocType]" />\n	</td>\n	<td>\n		   <input ng-model = "l.appl" ng-disabled="canNotModifyFlag()"  type="radio" tabindex="3" size="5" value="" />适用\n		   <input ng-model = "l.appl" ng-disabled="canNotModifyFlag()"  type="radio" tabindex="3" size="5" value="N" />不适用\n	</td>\n<%}else{%>\n	<td colspan="{{column}}">\n		<h3>你传入的html模板不存在，请检查</h3>\n	</td>\n<%}%>\n</tr>');

define("fare/oc/1.0.0/tpls/edit/thead-debug.html", [], '<tr>\n<%if("tb183.html"==value){%>\n	<th>旅行社</th>\n	<th>航空公司/分销商</th>\n	<th>职责/功能码</th>\n	<th>区域类型</th>\n	<th>区域代码</th>\n	<th>发布对象类型</th>\n	<th>发布对象代码</th>\n	<th>权限</th>\n<%}else if("tb171.html"==value){%>\n	<th>航空公司</th>\n	<th>票价类别</th>\n	<th>运价类型</th>\n<%}else if ("tb172.html"==value){%>\n	<th>大客户编码</th>\n<%}else if ("tb173Ticket.html"==value){%>\n	<th>指定客票</th>\n<%}else if ("tb173Tkt.html"==value){%>\n	<th>指定客票</th>\n<%}else if ("tb165.html"==value){%>\n	<th>机型代码</th>\n<%}else if("tb186.html"==value){%>\n	<th>市场方</th>\n	<th>承运方</th>\n	<th>航班号</th>\n<%}else if ("tb196.html"==value){%>\n	<th>行李件数</th>\n	<th>行李子代码</th>\n<%}else if ("tb198.html"==value){%>\n	<th>市场方/承运方</th>\n	<th>航空公司</th>\n	<th>订座舱位1</th>\n	<th>订座舱位2</th>\n	<th>订座舱位3</th>\n	<th>订座舱位4</th>\n	<th>订座舱位5</th>\n<%}else if("tb198UpGrade.html"==value){%>\n	<th ng-if = "data.sel1.value==\'UP\'||data.sel1.value==\'BDUP\'">航空公司</th>\n	<th>订座舱位1</th>\n	<th>订座舱位2</th>\n	<th>订座舱位3</th>\n	<th>订座舱位4</th>\n	<th>订座舱位5</th>\n<%}else if ("tb170.html"==value){%>\n	<th>销售地类型</th>\n	<th>销售地代码</th>\n	<th>金额</th>\n	<th>货币类型</th>\n<%}else if("tb178.html"==value){%>\n	<th>类型</th>\n	<th>代码</th>\n	<th>是否适用</th>\n<%}%>\n</tr>');

//主要用来加载各个控制器（所有的控制器都将在这个文件中被加载）,除此之外再不用做其他，
//因为我们可以有很多个控制器文件，按照具体需要进行添加。
define("fare/oc/1.0.0/edit/controllers/index-debug", [ "jqueryuitimepickeraddon-debug", "fare/oc/1.0.0/edit/controllers/eidtController-debug", "fare/oc/1.0.0/edit/controllers/controllers-debug", "fare/oc/1.0.0/edit/util/S7FormDataUtil-debug", "fare/oc/1.0.0/edit/data/editJsonData-debug", "fare/oc/1.0.0/edit/util/S7EditUtil-debug", "fare/oc/1.0.0/edit/data/jsonDataHelper-debug", "fare/oc/1.0.0/edit/util/commonUtil-debug", "underscore-debug", "fare/oc/1.0.0/edit/controllers/headController-debug", "fare/oc/1.0.0/edit/controllers/basicInfoController-debug", "fare/oc/1.0.0/edit/controllers/chargeConfirmController-debug", "fare/oc/1.0.0/edit/controllers/ruleDetailController-debug" ], function(require, exports, module) {
    //需要的插件
    require("jqueryuitimepickeraddon-debug");
    require("fare/oc/1.0.0/edit/controllers/eidtController-debug");
    //头部
    require("fare/oc/1.0.0/edit/controllers/headController-debug");
    //基本信息部分
    require("fare/oc/1.0.0/edit/controllers/basicInfoController-debug");
    //第一块信息
    require("fare/oc/1.0.0/edit/controllers/chargeConfirmController-debug");
    //第二块信息
    require("fare/oc/1.0.0/edit/controllers/ruleDetailController-debug");
});

define("fare/oc/1.0.0/edit/controllers/eidtController-debug", [ "fare/oc/1.0.0/edit/controllers/controllers-debug", "fare/oc/1.0.0/edit/util/S7FormDataUtil-debug", "fare/oc/1.0.0/edit/data/editJsonData-debug", "fare/oc/1.0.0/edit/util/S7EditUtil-debug", "fare/oc/1.0.0/edit/data/jsonDataHelper-debug", "fare/oc/1.0.0/edit/util/commonUtil-debug", "underscore-debug" ], function(require, exports, module) {
    var controllers = require("fare/oc/1.0.0/edit/controllers/controllers-debug");
    var util = require("fare/oc/1.0.0/edit/util/S7FormDataUtil-debug");
    var jsonDate = require("fare/oc/1.0.0/edit/data/editJsonData-debug");
    var EditUtil = require("fare/oc/1.0.0/edit/util/S7EditUtil-debug");
    var jsonDataHelper = require("fare/oc/1.0.0/edit/data/jsonDataHelper-debug");
    var commonUtil = require("fare/oc/1.0.0/edit/util/commonUtil-debug");
    //最外层controller
    controllers.controller("EditController", [ "$scope", "FormData", "NEW_ADD_STR", "UPDATE_STR", "$http", "S7EditService", "TableStatusServcie", "FormEditStatusServcie", function($scope, FormData, NEW_ADD_STR, UPDATE_STR, $http, S7EditService, TableStatusServcie, FormEditStatusServcie) {
        $scope.NEW_ADD_STR = NEW_ADD_STR;
        //新增action字符串标记
        $scope.UPDATE_STR = UPDATE_STR;
        //更新action字符串标记
        $scope.contextPath = FormData.contextPath;
        //保留一份原始数据，方便数据初始化时使用
        $scope.orgData = angular.copy(FormData);
        //页面上的form数据
        $scope.data = FormData;
        //页面上所有表格的显示或隐藏的的状态数据
        $scope.tableStatus = TableStatusServcie;
        //页面上所有控件的状态数据
        $scope.editStatus = FormEditStatusServcie;
        var s7Id = $("#s7Id").val();
        $scope.data.id = s7Id;
        //第一次进入页面时需要加载的数据
        console.info("准备初始化页面数据..........");
        var url = "";
        var promise = null;
        if (FormData.action == NEW_ADD_STR) {
            //1.新增
            url = $scope.contextPath + "/initPage4Add";
            promise = S7EditService.getDataByUrl(url);
            dealResultData4Add(promise);
        } else if (FormData.action == UPDATE_STR) {
            url = $scope.contextPath + "/initPage4Upate?s7Id=" + $scope.data.id;
            promise = S7EditService.getDataByUrl(url);
            dealResult4Update(promise);
        }
        console.info("页面部分数据其他处理.......");
        $scope.canNotModifyFlag = function() {
            var flag = false;
            if ($scope.data.statusDes == "3") {
                flag = true;
            }
            return flag;
        };
        //日期问题
        var currDate = new Date();
        var curMonthStr = commonUtil.getFullDayOrMonthStr(currDate.getMonth() + 1);
        var curDateStr = commonUtil.getFullDayOrMonthStr(currDate.getDate());
        var nextDateStr = commonUtil.getFullDayOrMonthStr(currDate.getDate() + 1);
        //当前日期
        $scope.currentDateStr = currDate.getFullYear() + "-" + curMonthStr + "-" + curDateStr;
        //下一天日期
        $scope.nextDateStr = currDate.getFullYear() + "-" + curMonthStr + "-" + nextDateStr;
        //select数据开始//
        //提前购票时间单位
        $scope.advancedPurchasePeriodList = jsonDate.advancedPurchasePeriodList;
        //免费/收费
        $scope.noChargeNotAvailableList = {
            list: jsonDataHelper.getNoChargeNotAvailableList($scope.data.serviceType)
        };
        //适用于
        $scope.specifiedServiceFeeAppList = {
            list: jsonDataHelper.getSpecifiedServiceFeeAppList($scope.data.serviceType)
        };
        //select数据结束
        //前面几个一般表格的显示隐藏
        $scope.flagData = jsonDate.flagData;
        //所有的表格定义信息都在这里
        $scope.tableData = jsonDate.tableData;
        //-------------区域对应的表格显示隐藏开始--------//
        var dealShowHide4Upate = function(servcieType, editStatus) {
            //对是否检查库存的处理
            if (_.contains([ "A", "B", "E" ], servcieType)) {
                editStatus["availability"] = false;
            } else {
                editStatus["availability"] = true;
            }
            //对是否收费的处理
            if (_.contains([ "C", "P" ], servcieType)) {
                editStatus["noChargeNotAvailable"] = false;
            } else {
                editStatus["noChargeNotAvailable"] = true;
            }
            //免费/收费
            $scope.noChargeNotAvailableList.list = jsonDataHelper.getNoChargeNotAvailableList(servcieType);
            //适用于
            $scope.specifiedServiceFeeAppList.list = jsonDataHelper.getSpecifiedServiceFeeAppList(servcieType);
        };
        //工具方法
        //(1):初始化新增页面数据
        function dealResultData4Add(promise) {
            promise.then(function(data) {
                // 调用承诺API获取数据 .resolve  
                console.info("获取初始化数据完成....");
                $scope.serviceGroupList = data.serviceGroupList;
                $scope.passengerTypeCodeList = data.passengerList;
                $scope.frequentFlyerStatusList = data.ffpList;
                $scope.equipmentList = data.equipmentList;
                //初始化数据、测试新增的时候才有意义，上线时此行代码没有意义
                EditUtil.initData.initListData($scope.data, $scope.tableStatus);
            }, function(data) {
                // 处理错误 .reject  
                console.error("初始化页面数据出错!");
            });
        }
        //(2):初始化更新页面数据
        function dealResult4Update(promise) {
            promise.then(function(data) {
                // 调用承诺API获取数据 .resolve  
                console.info("获取初始化数据完成....");
                $scope.serviceGroupList = data.serviceGroupList;
                $scope.passengerTypeCodeList = data.passengerList;
                $scope.frequentFlyerStatusList = data.ffpList;
                $scope.equipmentList = data.equipmentList;
                //s7record的信息
                util.convertS7ToFormData(data.s7VO, $scope.data);
                //将查询的s7数据填充到formData中
                EditUtil.initData.initListData(data.s7VO, $scope.tableStatus);
                //其他特殊数据处理
                EditUtil.initData.initOtherData($scope.data);
                //list163
                $scope.data.sel4 = data.list163;
                //发送广播通知页面显示隐藏
                $scope.$broadcast("serviceTypeChangeNotice", "false");
                //发送service
                //当状态为3的时候，页面不可编辑
                if ($scope.data.statusDes == "3") {
                    for (var cname in $scope.editStatus) {
                        $scope.editStatus[cname] = false;
                    }
                }
                dealShowHide4Upate($scope.data.serviceType, $scope.editStatus);
            }, function(data) {
                // 处理错误 .reject  
                console.error("初始化页面数据出错!");
            });
        }
        //保存表格数据到后台
        /**
		 * <pre>
		 * 	功能描述:保存表单数据
		 * </pre>
		 * @param {Object} operType  ['save','saveAndPublish']  点击‘保存’,‘保存并发布’
		 */
        $scope.saveFormData = function(operType) {
            var flag = false;
            var s7 = util.convertFormDataToS7($scope.data);
            flag = util.validFormData(s7, $scope.data, NEW_ADD_STR);
            //console.info(s7) ;
            if (flag) {
                //如果校验通过的话则提交表单数据到后台
                $.showTuiConfirmDialog("保存?", function() {
                    var url = "";
                    if (operType == "save") {
                        if (FormData.action == $scope.NEW_ADD_STR) {
                            //新增数据的话
                            url = $scope.contextPath + "/addS7";
                        } else if (FormData.action == $scope.UPDATE_STR) {
                            //更新数据的话
                            url = $scope.contextPath + "/updateS7";
                        }
                    } else if (operType == "saveAndPublish") {
                        url = $scope.contextPath + "/saveAndPublishS7";
                    }
                    var promise = S7EditService.postDate(url, s7);
                    promise.then(function(data) {
                        if (data.flag == "true") {
                            $.showTuiSuccessDialog("保存成功！", function() {
                                $.showTuiWaitingDialog("即将返回查询界面!", 200, 60);
                                setTimeout(function() {
                                    $.closeTuiWindow();
                                }, 5e3);
                                window.location.href = $scope.contextPath + "/oc/ocView";
                            });
                        } else {
                            $.showTuiErrorDialog("保存数据出错！");
                        }
                    }, function(error) {
                        $.showTuiErrorDialog("保存数据出错！");
                    });
                });
            }
        };
    } ]);
});

define("fare/oc/1.0.0/edit/controllers/controllers-debug", [], function(require, exports, module) {
    var controllers = angular.module("app.controllers", []);
    return controllers;
});

define("fare/oc/1.0.0/edit/util/S7FormDataUtil-debug", [], function(require, exports, module) {
    var util = {};
    //将查询的s7数据转换为‘FormData’
    util.convertS7ToFormData = function(s7, formData) {
        for (var p in formData) {
            var flag = s7.hasOwnProperty(p);
            if (flag) {
                var tmpStr = s7[p];
                formData[p] = tmpStr;
            }
        }
        //2.填充部分特殊数据
        formData.sel1.showStr = s7.basicInfoVo.serviceGroupDescription;
        formData.sel2.showStr = s7.basicInfoVo.subGroupDescription;
        formData.sel3.showStr = s7.basicInfoVo.commercialName;
        formData.sel1.value = s7.basicInfoVo.serviceGroup;
        formData.sel2.value = s7.basicInfoVo.subGroup;
        formData.sel3.value = s7.basicInfoVo.subCode;
    };
    //提交表单时将formData转换为s7
    util.convertFormDataToS7 = function(formData) {
        var s7 = {};
        angular.extend(s7, formData);
        util.initTravelDate(s7);
        util.initDayOfWeek(s7);
        //处理部分特殊数据
        //删除后台不存在的属性字段
        delete s7.sel1;
        delete s7.sel2;
        delete s7.sel3;
        delete s7.travelStartDate;
        delete s7.travelEndDate;
        delete s7.dayOfWeekShow;
        return s7;
    };
    util.initTravelDate = function(s7) {
        var arr1 = util.getDateArr(s7.travelStartDate);
        var arr2 = util.getDateArr(s7.travelEndDate);
        s7.firstTravelYear = arr1[0];
        s7.firstTravelMonth = arr1[1];
        s7.firstTravelDay = arr1[2];
        //
        s7.lastTravelYear = arr2[0];
        s7.lastTravelMonth = arr2[1];
        s7.lastTravelDay = arr2[2];
    };
    util.initDayOfWeek = function(s7) {
        var dayOfWeekShow = s7.dayOfWeekShow;
        var str = "";
        var index = 1;
        for (var t in dayOfWeekShow) {
            var value = dayOfWeekShow[t];
            if (value) {
                str += index;
            }
            index++;
        }
        s7.dayOfWeek = str;
    };
    //校验交单数据是否可以提交
    util.validFormData = function(formData, orgFormData, NEW_ADD_STR) {
        var action = formData.action;
        var serviceType = formData["serviceType"];
        if (orgFormData.action == NEW_ADD_STR && orgFormData.sel3.showStr == "") {
            //如果第三个选择框没有选择
            $.showTuiErrorDialog("必须选择到最后一级！");
            return false;
        }
        //第一个校验
        //其他校验
        //1.表格数据校验[删除表格中的非法数据:eg:第一个字段为空的假数据]
        util.delInValidList(formData);
        util.dealOtherData(formData);
        //2.一般字段校验
        /*var groupType = orgFormData.sel1.value ;
		if(groupType=='UP'||groupType=='BDUP'){
			if(formData.upgradeToCabin.length==0){
				$.showTuiErrorDialog('选择升舱时，升舱到的服务等级必填!');
				return false;
			}
		}*/
        //如果为 【和】那么金额必填
        if (formData["specSevFeeAndOrIndicator"] == "A" || formData["noChargeNotAvailable"] == "" && formData["specifiedServiceFeeMileage"] == "") {
            if (formData["list201VO"].length == 0 && formData["list170VO"].length == 0) {
                return false;
            }
        }
        if (formData["startTime"] == "") {
            //起始时刻为空
            if (formData["stopTime"] != "") {
                $.showTuiErrorDialog("开始时间和结束时间必须同时为空或不为空。");
                return false;
            }
        } else {
            //起始不为空
            if (formData["stopTime"] == "") {
                $.showTuiErrorDialog("开始时间和结束时间必须同时为空或不为空。");
                return false;
            }
        }
        if (formData["geoSpecFromToWithin"] != "") {
            //如果不为不限区域则区域必填
            if (formData["geoSpecLoc1"] == "" && formData["list178Loc1"].length == 0) {
                $.showTuiErrorDialog("当区域限制不为不限区域时，区域1的代码必须有值。");
                return false;
            }
        }
        if (formData["geoSpecFromToWithin"] == "W") {
            if (formData["geoSpecLoc2"] !== "" || formData["list178Loc2"].length != 0 || formData["geoSpecLoc3"] !== "" || formData["list178Loc3"].length != 0) {
                $.showTuiErrorDialog("当区域限制为区域1内部时，区域2和经过区域的代码必须为空。");
                return false;
            }
        }
        return true;
    };
    //处理表单其他数据
    util.dealOtherData = function(formData) {
        var serviceType = formData.serviceType;
        if (serviceType == "A") {
            formData.firstExcessOccurrence = "";
            formData.lastExcessOccurrence = "";
        }
        if (serviceType == "C" || serviceType == "P") {
            if (formData.firstExcessOccurrence.length > 0) {
                if (formData.lastExcessOccurrence == "") {
                    //若后者不填写，则后者默认等于前者
                    formData.lastExcessOccurrence = formData.firstExcessOccurrence;
                }
            }
        }
    };
    util.strNotNull = function(str) {
        var tmp = str || "";
        tmp = $.trim(tmp + "");
        var flag = false;
        if (tmp.length > 0) {
            flag = true;
        }
        return flag;
    };
    /**
	 * <pre>
	 * 	删除表格中无效数据
	 * </pre>
	 * @param {Object} formData
	 */
    util.delInValidList = function(formData) {
        //170表格
        var t170 = [];
        angular.forEach(formData.list170VO, function(m) {
            if (util.strNotNull(m.specFeeAmount)) {
                //如果存在的话
                t170.push(m);
            }
        });
        //list198VO
        var t198 = [];
        angular.forEach(formData.list198VO, function(m) {
            if (util.strNotNull(m.mktOp)) {
                t198.push(m);
            }
        });
        formData.list198VO = t198;
        //list198UpgradeVO
        var t198up = [];
        angular.forEach(formData.list198UpgradeVO, function(m) {
            if (util.strNotNull(m.rbd1)) {
                t198up.push(m);
            }
        });
        formData.list198UpgradeVO = t198up;
        //list183VO
        var t183 = [];
        angular.forEach(formData.list183VO, function(m) {
            var flag = false;
            for (var p in m) {
                var v = m[p];
                if (util.strNotNull(v)) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                t183.push(m);
            }
        });
        formData.list183VO = t183;
        //list186VO
        var t186 = [];
        angular.forEach(formData.list186VO, function(m) {
            if (util.strNotNull(m.fltNo1)) {
                t186.push(m);
            }
        });
        formData.list186VO = t186;
        //list178Loc1
        var tloc1 = [];
        angular.forEach(formData.list178Loc1, function(m) {
            if (util.strNotNull(m.geoLocType)) {
                tloc1.push(m);
            }
        });
        formData.list178Loc1 = tloc1;
        //list178Loc2
        var tloc2 = [];
        angular.forEach(formData.list178Loc2, function(m) {
            if (util.strNotNull(m.geoLocType)) {
                tloc2.push(m);
            }
        });
        formData.list178Loc2 = tloc2;
        //list178Loc3
        var tloc3 = [];
        angular.forEach(formData.list178Loc3, function(m) {
            if (util.strNotNull(m.geoLocType.length)) {
                tloc3.push(m);
            }
        });
        formData.list178Loc3 = tloc3;
        //行李件数表格处理
        var t196 = [];
        angular.forEach(formData.list196VO, function(m) {
            if (util.strNotNull(m.count) && util.strNotNull(m.code)) {
                t196.push(m);
            }
        });
        formData.list196VO = t196;
        //171表格无效数据删除
        var t171 = [];
        angular.forEach(formData.list171VO, function(m) {
            if (util.strNotNull(m.carrier)) {
                t171.push(m);
            }
        });
        formData.list171VO = t171;
        //172表格删除无效数据
        var t172 = [];
        angular.forEach(formData.list172VO, function(m) {
            if (util.strNotNull(m.accountCode)) {
                t172.push(m);
            }
        });
        formData.list172VO = t172;
        //173-1表格删除无效数据
        var t173_1 = [];
        angular.forEach(formData.list173TicketVO, function(m) {
            if (util.strNotNull(m.ticketDesignator)) {
                t173_1.push(m);
            }
        });
        formData.list173TicketVO = t173_1;
        //173-2表格删除无效数据
        var t173_2 = [];
        angular.forEach(formData.list173TktVO, function(m) {
            if (m.ticketDesignator.length > 0) {
                t173_2.push(m);
            }
        });
        formData.list173TktVO = t173_2;
        //165
        var t165 = [];
        angular.forEach(formData.list165VO, function(m) {
            if (m.equipmentCode.length > 0) {
                //如果存在的话
                t165.push(m);
            }
        });
        formData.list165VO = t165;
    };
    util.getDate = function(str) {
        var strs = str.split("-");
        var year = strs[0];
        var month = strs[1];
        var day = strs[2];
        return new Date(year, month - 1, day);
    };
    util.getDateArr = function(str) {
        var arr = [];
        var year = "";
        var month = "";
        var day = "";
        if (str.length > 0) {
            var infos = str.split("-");
            if (infos.length == 3) {
                arr.push(infos[0]);
                arr.push(infos[1]);
                arr.push(infos[2]);
            }
        }
        return arr;
    };
    module.exports = util;
});

define("fare/oc/1.0.0/edit/data/editJsonData-debug", [], function(require, exports, module) {
    var jsonDate = {
        advancedPurchasePeriodList: [ //提前购票时间单位
        {
            name: "分",
            value: "Nb"
        }, {
            name: "小时",
            value: "Hb"
        }, {
            name: "天",
            value: "Db"
        }, {
            name: "月",
            value: "Mb"
        } ],
        //advancedPurchasePeriodList end
        flagData: {
            t170: {
                flag: true,
                title: "收起表格"
            },
            /*"t201": {"flag": false,"title": "填写表格"},*/
            t198: {
                flag: false,
                title: "填写表格"
            },
            t198Upgrade: {
                flag: false,
                title: "填写表格"
            },
            t183: {
                flag: false,
                title: "填写表格"
            },
            t186: {
                flag: false,
                title: "填写表格"
            },
            t196: {
                flag: false,
                title: "填写表格"
            },
            t165: {
                flag: false,
                title: "自定义区域"
            },
            t171: {
                flag: false,
                title: "填写表格"
            },
            t172: {
                flag: false,
                title: "填写表格"
            },
            t173Ticket: {
                flag: false,
                title: "填写表格"
            },
            t173Tkt: {
                flag: false,
                title: "填写表格"
            },
            //list173TktVO
            geo1: {
                flag: false,
                title: "自定义区域"
            },
            geo2: {
                flag: false,
                title: "自定义区域"
            },
            geo3: {
                flag: false,
                title: "自定义区域"
            }
        },
        //flagData end
        tableData: {
            t170: {
                titieList: [ {
                    title: "销售地类型"
                }, {
                    title: "销售地代码"
                }, {
                    title: "金额"
                }, {
                    title: "货币类型"
                } ],
                addObj: {
                    saleGeographicPointType: "",
                    saleGeographicPoint: "",
                    specFeeAmount: "",
                    specFeeCurrency: "CNY",
                    selected: true
                }
            },
            t198: {
                titieList: [ {
                    title: "市场方/承运方"
                }, {
                    title: "航空公司"
                }, {
                    title: "订座舱位1"
                }, {
                    title: "订座舱位2"
                }, {
                    title: "订座舱位3"
                }, {
                    title: "订座舱位4"
                }, {
                    title: "订座舱位5"
                } ],
                addObj: {
                    mktOp: "",
                    cxr: "",
                    rbd1: "",
                    rbd2: "",
                    rbd3: "",
                    rbd4: "",
                    rbd5: "",
                    selected: true
                }
            },
            t198UpGrade: {
                titieList: [],
                addObj: {
                    cxr: "",
                    rbd1: "",
                    rbd2: "",
                    rbd3: "",
                    rbd4: "",
                    rbd5: "",
                    selected: true
                }
            },
            t196: {
                titieList: [ {
                    title: "行李件数"
                }, {
                    title: "行李子代码"
                } ],
                addObj: {
                    count: "",
                    code: "",
                    selected: true
                }
            },
            t186: {
                titieList: [ {
                    title: "市场方"
                }, {
                    title: "承运方"
                }, {
                    title: "航班号"
                } ],
                addObj: {
                    mktCarrier: "",
                    optCarrier: "",
                    fltNo1: "",
                    fltNo2: "",
                    selected: true
                }
            },
            t183: {
                titieList: [ {
                    title: "旅行社"
                }, {
                    title: "航空公司/分销商"
                }, {
                    title: "职责/功能码"
                }, {
                    title: "区域类型"
                }, {
                    title: "区域代码"
                }, {
                    title: "发布对象类型"
                }, {
                    title: "发布对象代码"
                }, {
                    title: "权限"
                } ],
                addObj: {
                    travelAgency: "",
                    carrierGds: "",
                    dutyFunctionCode: "",
                    geographicSpecificationType: "",
                    geographicSpecification: "",
                    codeType: "",
                    code: "",
                    viewBookTkt: "",
                    selected: true
                }
            },
            t165: {
                titieList: [ {
                    title: "机型代码"
                } ],
                addObj: {
                    equipmentCode: "",
                    selected: true
                }
            },
            t171: {
                titieList: [ {
                    title: "航空公司"
                }, {
                    title: "票价类别"
                }, {
                    title: "运价类型"
                } ],
                addObj: {
                    count: "",
                    code: "",
                    selected: true
                }
            },
            t172: {
                titieList: [ {
                    title: "大客户编码"
                } ],
                addObj: {
                    accountCode: "",
                    selected: true
                }
            },
            t173Ticket: {
                titieList: [ {
                    title: "指定客票"
                } ],
                addObj: {
                    ticketDesignator: "",
                    selected: true
                }
            },
            t173Tkt: {
                titieList: [ {
                    title: "指定客票"
                } ],
                addObj: {
                    ticketDesignator: "",
                    selected: true
                }
            },
            t178Loc1: {
                titieList: [ {
                    title: "类型"
                }, {
                    title: "代码"
                }, {
                    title: "是否适用"
                } ],
                addObj: {
                    geoLocType: "",
                    geoLocSpec: "",
                    appl: "",
                    selected: true
                }
            },
            t178Loc2: {
                titieList: [ {
                    title: "类型"
                }, {
                    title: "代码"
                }, {
                    title: "是否适用"
                } ],
                addObj: {
                    geoLocType: "",
                    geoLocSpec: "",
                    appl: "",
                    selected: true
                }
            },
            t178Loc3: {
                titieList: [ {
                    title: "类型"
                }, {
                    title: "代码"
                }, {
                    title: "是否适用"
                } ],
                addObj: {
                    geoLocType: "",
                    geoLocSpec: "",
                    appl: "",
                    selected: true
                }
            }
        },
        //table end
        weightUnitList: [ //行李重量单位集合
        {
            name: "选择",
            value: ""
        }, {
            name: "千克",
            value: "K"
        }, {
            name: "磅",
            value: "P"
        } ],
        specServiceFeeColSubList: [ //SPEC_SERVICE_FEE_COL_SUB//包含/扣除
        {
            name: "包含在票价中",
            value: "I"
        }, {
            name: "单独收费",
            value: ""
        } ],
        noChargeNotAvailableList: [ //免费/收费
        {
            name: "收费",
            value: ""
        }, {
            name: "不适用",
            value: "X"
        }, {
            name: "免费，不出EMD单",
            value: "F"
        }, {
            name: "免费，出EMD单",
            value: "E"
        }, {
            name: "免费，不出EMD单，不要求预定",
            value: "G"
        }, {
            name: "免费，出EMD单，不要求预定",
            value: "H"
        }, {
            name: "免费，行李规则遵循市场方航空公司规则",
            value: "D"
        }, {
            name: "免费，行李规则遵循承运方航空公司规则",
            value: "O"
        } ],
        specServiceFeeNetSellList: [ //净价/销售价
        {
            name: "销售价",
            value: ""
        }, {
            name: "净价",
            value: "N"
        } ],
        baggageTravelApplicationList: [ {
            name: "必须匹配所有的航段",
            value: "A"
        }, {
            name: "至少匹配一个航段",
            value: "S"
        }, {
            name: "必须匹配旅行航段中的主航段",
            value: "M"
        }, {
            name: "必须匹配整个行程的每一段",
            value: "J"
        }, {
            name: "不限制",
            value: ""
        } ],
        noCharge_notAvailableList: [ {
            name: "收费",
            value: ""
        }, {
            name: "不适用",
            value: "X"
        }, {
            name: "免费，不出EMD单",
            value: "F"
        }, {
            name: "免费，出EMD单",
            value: "E"
        }, {
            name: "免费，不出EMD单，不要求预定",
            value: "G"
        }, {
            name: "免费，出EMD单，不要求预定",
            value: "H"
        }, {
            name: "免费，行李规则遵循市场方航空公司规则",
            value: "D"
        }, {
            name: "免费，行李规则遵循承运方航空公司规则",
            value: "O"
        } ],
        cabinList: [ //舱位list集合
        {
            name: "R-豪华头等舱",
            value: "R"
        }, {
            name: "F-头等舱",
            value: "F"
        }, {
            name: "J-豪华商务舱",
            value: "J"
        }, {
            name: "C-商务舱",
            value: "C"
        }, {
            name: "P-豪华经济舱",
            value: "P"
        }, {
            name: "Y-经济舱",
            value: "Y"
        } ],
        geoLocTypeList: [ //区域集合
        {
            name: "选择",
            value: ""
        }, {
            name: "A-大区",
            value: "A"
        }, {
            name: "C-城市",
            value: "C"
        }, {
            name: "N-国家",
            value: "N"
        }, {
            name: "P-机场",
            value: "P"
        }, {
            name: "S-州",
            value: "S"
        }, {
            name: "Z-区域",
            value: "Z"
        } ],
        formOfRefundList: [ //退款形式
        {
            name: "选择",
            value: ""
        }, {
            name: "按原付款渠道退款",
            value: "1"
        }, {
            name: "按电子凭证退款",
            value: "2"
        } ],
        geoSpecSectPortJourneyList: [ {
            name: "选择",
            value: ""
        }, {
            name: "区域",
            value: "S"
        }, {
            name: "部分",
            value: "P"
        }, {
            name: "全程",
            value: "J"
        } ],
        geoSpecExceptionStopUnitList: [ {
            name: "选择",
            value: ""
        }, {
            name: "分",
            value: "N"
        }, {
            name: "小时",
            value: "H"
        }, {
            name: "天",
            value: "D"
        }, {
            name: "周",
            value: "W"
        }, {
            name: "月",
            value: "M"
        } ],
        timeApplicationList: [ {
            name: "选择",
            value: ""
        }, {
            name: "分别",
            value: "D"
        }, {
            name: "之间",
            value: "R"
        } ]
    };
    return jsonDate;
});

define("fare/oc/1.0.0/edit/util/S7EditUtil-debug", [], function(require, exports, module) {
    /**
	 * 处理表单特殊数据
	 * @param {Object} formData
	 */
    var initOtherData = function(formData) {
        //处理旅行起始日期
        if (formData.firstTravelYear != "" && formData.firstTravelMonth != "" && formData.firstTravelDay != "") {
            formData.travelStartDate = formData.firstTravelYear + "-" + formData.firstTravelMonth + "-" + formData.firstTravelDay;
        }
        //处理旅行结束日期
        if (formData.firstTravelYear != "" && formData.firstTravelMonth != "" && formData.firstTravelDay != "") {
            formData.travelEndDate = formData.lastTravelYear + "-" + formData.lastTravelMonth + "-" + formData.lastTravelDay;
        }
        //星期
        var dayofWake = formData.dayOfWeek;
        var len = dayofWake.length;
        for (var i = 0; i < len; i++) {
            var s = dayofWake.charAt(i);
            var tmpStr = "w" + s;
            formData.dayOfWeekShow[tmpStr] = true;
        }
    };
    //这是一个私有的辅助方法
    var initTbData = function(list, curItem) {
        if (list.length > 0) {
            curItem.showFlag = true;
        } else {
            curItem.showFlag = false;
        }
    };
    var initListData = function(s7VO, flagData) {
        if (s7VO.list170VO.length > 0) {
            //170表格
            initTbData(s7VO.list170VO, flagData.tb170);
        }
        if (s7VO.list201VO.length > 0) {
            //201表格
            initTbData(s7VO.list201VO, flagData.tb170);
        }
        //198
        initTbData(s7VO.list198VO, flagData.tb198);
        //----9
        //198_2
        initTbData(s7VO.list198UpgradeVO, flagData.tb198UpGrade);
        //----10
        //list183VO
        initTbData(s7VO.list183VO, flagData.tb183);
        //-----1
        //list186VO
        initTbData(s7VO.list186VO, flagData.tb186);
        //-----7
        //geo1 //list178Loc1
        initTbData(s7VO.list178Loc1, flagData.tb178geo1);
        //--12
        //geo2 //list178Loc2
        initTbData(s7VO.list178Loc2, flagData.tb178geo2);
        //---13
        //geo3 //list178Loc3
        initTbData(s7VO.list178Loc3, flagData.tb178geo3);
        //----14
        //196//备注例外行李
        initTbData(s7VO.list196VO, flagData.tb196);
        //----8
        //165
        initTbData(s7VO.list165VO, flagData.tb165);
        //------6
        //171
        initTbData(s7VO.list171VO, flagData.tb171);
        //-----2
        initTbData(s7VO.list172VO, flagData.tb172);
        //-----3
        initTbData(s7VO.list173TicketVO, flagData.tb173Ticket);
        //------4
        initTbData(s7VO.list173TktVO, flagData.tb173Tkt);
    };
    //这边是要返回的方法的集合处
    var EditUtil = {
        initData: {
            /*初始化*/
            initOtherData: initOtherData,
            initListData: initListData
        }
    };
    return EditUtil;
});

define("fare/oc/1.0.0/edit/data/jsonDataHelper-debug", [], function(require, exports, module) {
    module.exports = {
        getNoChargeNotAvailableList: function(servcieType) {
            var tmp = servcieType || "";
            var retArr = [];
            var defaultArr = [ {
                name: "收费",
                value: ""
            }, {
                name: "不适用",
                value: "X"
            }, {
                name: "免费，不出EMD单",
                value: "F"
            }, {
                name: "免费，出EMD单",
                value: "E"
            }, {
                name: "免费，不出EMD单，不要求预定",
                value: "G"
            }, {
                name: "免费，出EMD单，不要求预定",
                value: "H"
            }, {
                name: "免费，行李规则遵循市场方航空公司规则",
                value: "D"
            }, {
                name: "免费，行李规则遵循承运方航空公司规则",
                value: "O"
            } ];
            if (tmp == "A") {
                retArr = [ {
                    name: "免费，不出EMD单",
                    value: "F"
                }, {
                    name: "免费，行李规则遵循市场方航空公司规则",
                    value: "D"
                } ];
            } else if (tmp == "B") {
                retArr = [ {
                    name: "免费，不出EMD单",
                    value: "F"
                } ];
            } else if (tmp == "E") {
                retArr = [ {
                    name: "不适用",
                    value: "X"
                } ];
            } else {
                retArr = defaultArr;
            }
            return retArr;
        },
        getSpecifiedServiceFeeAppList: function(serviceType) {
            /**适用于**/
            var tmp = serviceType || "";
            var arr = [ {
                name: "每一个票价组成部分算一次服务费用",
                value: "1"
            }, {
                name: "每一个票价组成部分算一半的服务费用",
                value: "2"
            }, {
                name: "每用一次服务算一次服务费用",
                value: "3"
            }, {
                name: "匹配的部分航程算一次服务费用",
                value: "4"
            }, {
                name: "服务收费对应每张售票",
                value: "5"
            } ];
            switch (tmp) {
              case "F":
                arr = [ {
                    name: "每一个票价组成部分算一次服务费用",
                    value: "1"
                }, {
                    name: "每一个票价组成部分算一半的服务费用",
                    value: "2"
                }, {
                    name: "每用一次服务算一次服务费用",
                    value: "3"
                }, {
                    name: "匹配的部分航程算一次服务费用",
                    value: "4"
                }, {
                    name: "服务收费对应每张售票",
                    value: "5"
                } ];
                break;

              case "M":
                arr = [ {
                    name: "每用一次服务算一次服务费用",
                    value: "3"
                } ];
                break;

              case "R":
                arr = [ {
                    name: "服务收费对应每张售票",
                    value: "5"
                } ];
                break;

              case "T":
                arr = [ {
                    name: "每用一次服务算一次服务费用",
                    value: "3"
                }, {
                    name: "服务收费对应每张售票",
                    value: "5"
                } ];
                break;

              case "A":
                arr = [];
                break;

              case "B":
                arr = [];
                break;

              case "C":
                arr = [ {
                    name: "按托运点收费",
                    value: "3"
                }, {
                    name: "按全行程收费",
                    value: "4"
                }, {
                    name: "每公斤按公布运价的0.5%收费",
                    value: "H"
                }, {
                    name: "每公斤按公布运价的1%收费",
                    value: "C"
                }, {
                    name: "每公斤按公布运价的1.5%收费",
                    value: "P"
                }, {
                    name: "按每公斤收费",
                    value: "K"
                }, {
                    name: "按每5公斤收费",
                    value: "F"
                } ];
                break;

              case "E":
                arr = [];
                break;

              case "P":
                arr = [ {
                    name: "按托运点收费",
                    value: "3"
                }, {
                    name: "按全行程收费",
                    value: "4"
                }, {
                    name: "每公斤按公布运价的0.5%收费",
                    value: "H"
                }, {
                    name: "每公斤按公布运价的1%收费",
                    value: "C"
                }, {
                    name: "每公斤按公布运价的1.5%收费",
                    value: "P"
                }, {
                    name: "按每公斤收费",
                    value: "K"
                }, {
                    name: "按每5公斤收费",
                    value: "F"
                } ];
                break;

              default:
                console.info("传入的serviceType有问题");
            }
            return arr;
        }
    };
});

define("fare/oc/1.0.0/edit/util/commonUtil-debug", [ "underscore-debug" ], function(require, exports, module) {
    var _ = require("underscore-debug");
    module.exports = {
        checkCommonServcie: function(serviceType) {
            //判断服务类型是不是一般附加服务
            var arr = [ "F", "M", "R", "T" ];
            var flag = _.contains(arr, serviceType);
            return flag;
        },
        checkBaggageServcie: function(serviceType) {
            //判断服务类型是不是行李附加服务
            var arr = [ "A", "B", "C", "E", "P" ];
            var flag = _.contains(arr, serviceType);
            return flag;
        },
        getFullDayOrMonthStr: function(dateOrMonthNum) {
            //获得日或月的字符串
            if (dateOrMonthNum < 10) {
                return "0" + dateOrMonthNum;
            }
            return dateOrMonthNum + "";
        }
    };
});

define("fare/oc/1.0.0/edit/controllers/headController-debug", [ "fare/oc/1.0.0/edit/controllers/controllers-debug" ], function(require, exports, module) {
    var controllers = require("fare/oc/1.0.0/edit/controllers/controllers-debug");
    //headerController
    controllers.controller("HeaderCtrl", [ "$scope", "FormData", "NEW_ADD_STR", function($scope, FormData, NEW_ADD_STR) {
        $scope.NEW_ADD_STR = NEW_ADD_STR;
        $scope.contextPath = FormData.contextPath;
        $scope.backPage = function() {
            window.location.href = $scope.contextPath + "/oc/ocView";
        };
        var action = FormData.action || "";
        if (action == $scope.NEW_ADD_STR) {
            $scope.headerTipStr = "新建服务费用";
        } else {
            //表示为修改页面跳转过来的
            $scope.headerTipStr = "更新服务费用";
        }
    } ]);
});

define("fare/oc/1.0.0/edit/controllers/basicInfoController-debug", [ "fare/oc/1.0.0/edit/controllers/controllers-debug", "fare/oc/1.0.0/edit/data/jsonDataHelper-debug", "fare/oc/1.0.0/edit/util/commonUtil-debug", "underscore-debug" ], function(require, exports, module) {
    var controllers = require("fare/oc/1.0.0/edit/controllers/controllers-debug");
    var jsonDataHelper = require("fare/oc/1.0.0/edit/data/jsonDataHelper-debug");
    var commonUtil = require("fare/oc/1.0.0/edit/util/commonUtil-debug");
    var _ = require("underscore-debug");
    //页面第一个部分/////////选择附加服务部分/////////////////////////////////////////
    //select级联controller
    controllers.controller("BasicInfoCtrl", [ "$scope", "$http", "FormData", "DEFAULT_SERVICETYPE", "FormEditStatusServcie", function($scope, $http, FormData, DEFAULT_SERVICETYPE, FormEditStatusServcie) {
        //chooseInput的输入数据
        $scope.chooseInputData = {
            choose1: "",
            choose2: "",
            choose3: ""
        };
        $scope.data = FormData;
        $scope.showChooseFunc = function() {
            var str = "";
            var str1 = FormData.sel1.showStr || "";
            var str2 = FormData.sel2.showStr || "";
            var str3 = FormData.sel3.showStr || "";
            if (str1.length > 0) {
                str = str1;
            }
            if (str2.length > 0) {
                str += " > " + str2;
            }
            if (str3.length > 0) {
                str += " > " + str3;
            }
            return str;
        };
        //choose第一个框中li点击事件
        $scope.subGroupQuery = function(showStr, serviceGroup) {
            var contextPath = $scope.contextPath;
            FormData.sel1.showStr = showStr;
            FormData.sel1.value = serviceGroup;
            //把第二个选项框以前保留的信息清空
            FormData.sel2.showStr = "";
            FormData.sel2.value = "";
            //把第三个选项框以前保留的信息清空
            FormData.sel3.showStr = "";
            FormData.sel3.value = "";
            $scope.lastGroupList = [];
            $scope.lastGroupList2 = [];
            //清空formData信息
            FormData.serviceAndSubCode = "";
            FormData.serviceType = DEFAULT_SERVICETYPE;
            //
            FormData.noChargeNotAvailable = "";
            //设置为默认
            var url = contextPath + "/basicInfo/queryBasicInfoByGroup";
            var carrier = $scope.data.carrCode;
            var jqeryData = {};
            //post方式提交
            var jueryParam = {
                params: {
                    carrier: carrier,
                    serviceGroup: serviceGroup
                }
            };
            //地址问号形式
            $http.post(url, jqeryData, jueryParam).success(function(data, status, headers, config) {
                $scope.subGroupList = data;
            }).error(function(data, status, headers, config) {
                //处理错误
                alert("查询出错!");
            });
            $scope.data.basicInfoVo.serviceGroup = "";
            $scope.data.basicInfoVo.subGroup = "";
            $scope.data.basicInfoVo.subCode = "";
            $scope.data.sel4 = [];
        };
        //第二个li点击事件
        $scope.s5Query = function(showStr, subGroup) {
            var contextPath = $scope.contextPath;
            FormData.sel2.showStr = showStr;
            FormData.sel2.value = subGroup;
            //清空第三个选项框
            FormData.sel3.showStr = "";
            FormData.sel3.value = "";
            $scope.lastGroupList = [];
            FormData.serviceAndSubCode = "";
            FormData.serviceType = DEFAULT_SERVICETYPE;
            //
            $scope.lastGroupList2 = [];
            FormData.noChargeNotAvailable = "";
            //设置为默认
            var url = contextPath + "/s5/queryS5BySubGroup";
            var carrier = $scope.data.carrCode;
            var serviceGroup = FormData.sel1.value;
            var jqeryData = {};
            //post方式提交
            var jueryParam = {
                params: {
                    carrier: carrier,
                    serviceGroup: serviceGroup,
                    subGroup: subGroup
                }
            };
            //地址问号形式
            $http.post(url, jqeryData, jueryParam).success(function(data, status, headers, config) {
                $scope.lastGroupList = data;
            }).error(function(data, status, headers, config) {
                //处理错误
                alert("查询出错!");
            });
            $scope.data.basicInfoVo.serviceGroup = "";
            $scope.data.basicInfoVo.subGroup = "";
            $scope.data.basicInfoVo.subCode = "";
            $scope.data.sel4 = [];
        };
        //第三个li点击事件
        $scope.lastChooseClick = function(l) {
            //当点击的饿时候把整个表单重置//除了serviceType外的其他字段
            for (var pname in $scope.data) {
                if (!_.contains([ "sel1", "sel2", "sel3", "sel4" ], pname)) {
                    $scope.data[pname] = angular.copy($scope.orgData[pname]);
                }
            }
            validator.resetForm();
            //$scope.data.discountOrNot = '1' ;
            //$scope.data.list201VO = [] ;//数据初始化
            var carrCode = l.carrCode;
            var serviceSubCode = l.serviceSubCode;
            var commercialName = l.commercialName;
            var serviceType = l.serviceType;
            //发送通知
            FormData.carrCode = carrCode;
            FormData.serviceAndSubCode = serviceSubCode;
            FormData.serviceType = serviceType;
            //如果是免费则将下面的费用变为不可选择
            if (serviceType == "A") {
                FormData.noChargeNotAvailable = "F";
            } else if (serviceType == "B") {
                FormData.noChargeNotAvailable = "F";
            } else if (serviceType == "C" || serviceType == "P") {
                FormData.noChargeNotAvailable = "";
            } else if (serviceType == "E") {
                FormData.noChargeNotAvailable = "X";
            }
            if (serviceType == "C" || serviceType == "P") {
                //收费一定为收费且不可编辑
                FormEditStatusServcie.noChargeNotAvailable = false;
            } else {
                //可编辑
                FormEditStatusServcie.noChargeNotAvailable = true;
            }
            //将是否检查库存设置为 ‘否’
            if (serviceType == "A" || serviceType == "B" || serviceType == "E") {
                FormData.availability = "N";
                FormEditStatusServcie.availability = false;
            } else {
                FormEditStatusServcie.availability = true;
            }
            //免费/收费
            $scope.noChargeNotAvailableList.list = jsonDataHelper.getNoChargeNotAvailableList(serviceType);
            //适用于
            $scope.specifiedServiceFeeAppList.list = jsonDataHelper.getSpecifiedServiceFeeAppList(serviceType);
            //填充basicInfo信息start
            $scope.data.basicInfoVo.serviceGroup = l.attributesGroup;
            $scope.data.basicInfoVo.subGroup = l.attributesSubgroup;
            $scope.data.basicInfoVo.subCode = serviceSubCode;
            //填充basicInfo信息end
            FormData.sel3.showStr = "[" + serviceSubCode + "]" + commercialName;
            FormData.sel3.value = serviceSubCode;
            //这个一定要放在比较靠下的地方，以等待servcieType等书库已经填充到FormData中
            $scope.$parent.$broadcast("serviceTypeChangeNotice");
            //scope.$broadcast('serviceTypeChangeNotice') ;	
            var textTableNo163 = l.subCodeTableNo163 || "";
            textTableNo163 = textTableNo163 * 1;
            var url = FormData.contextPath + "/s7/query4ClickService";
            var queryParam = {
                subCodeTableNo163: textTableNo163 + "",
                carrCode: l.carrCode,
                serviceType: l.serviceType,
                serviceAndSubCode: l.serviceSubCode
            };
            $http.post(url, queryParam).success(function(data, status, headers, config) {
                $scope.lastGroupList2 = data.tb163List;
                $scope.data.sel4 = data.tb163List;
                $scope.data.sequenceNumber = data.maxSequenceNumber * 1 + 10;
            }).error(function(data, status, headers, config) {
                //处理错误
                console.info("查询出错!");
            });
            //清空金额缓存数据
            $scope.data.discountOrNot = "1";
            $scope.data.list201VO = [];
        };
    } ]);
});

define("fare/oc/1.0.0/edit/controllers/chargeConfirmController-debug", [ "fare/oc/1.0.0/edit/controllers/controllers-debug", "fare/oc/1.0.0/edit/data/editJsonData-debug", "fare/oc/1.0.0/edit/util/commonUtil-debug", "underscore-debug", "fare/oc/1.0.0/edit/data/jsonDataHelper-debug" ], function(require, exports, module) {
    var controllers = require("fare/oc/1.0.0/edit/controllers/controllers-debug");
    var jsonDate = require("fare/oc/1.0.0/edit/data/editJsonData-debug");
    var commonUtil = require("fare/oc/1.0.0/edit/util/commonUtil-debug");
    var jsonDataHelper = require("fare/oc/1.0.0/edit/data/jsonDataHelper-debug");
    var _ = require("underscore-debug");
    //页面第二个部分///////费用确定部分////////////////////////////////////////////////////////
    controllers.controller("ChargeConfirmCtrl", [ "$scope", "FormData", "FormEditStatusServcie", function($scope, FormData, FormEditStatusServcie) {
        $scope.data = FormData;
        //当选择免费或则收费时触发的事件
        //行李重量单位集合
        $scope.weightUnitList = jsonDate.weightUnitList;
        //SPEC_SERVICE_FEE_COL_SUB//包含/扣除
        $scope.specServiceFeeColSubList = jsonDate.specServiceFeeColSubList;
        //净价/销售价
        $scope.specServiceFeeNetSellList = jsonDate.specServiceFeeNetSellList;
        $scope.baggageTravelApplicationList = jsonDate.baggageTravelApplicationList;
        $scope.chargeCanClickFlag = function() {
            var flag = true;
            if ($scope.data.serviceType == "A" || $scope.data.serviceType == "C" || $scope.data.serviceType == "P" || $scope.data.statusDes == "3") {
                flag = false;
            }
            return flag;
        };
        //当点击后//这个flag管理页面上的金额、适用于、里程 这个三个字段(这三个字段显示隐藏一直)
        $scope.noChargeNotAvailableFlag = true;
        //这个flag管理页面上的行李适用范围
        $scope.noChargeNotAvailableFlag2 = true;
        //当是否收费改变时触发的函数
        $scope.changeNoChargeNotAvailable = function() {
            var servcieType = $scope.data.serviceType;
            var noChargeNotAvailable = $scope.data.noChargeNotAvailable;
            //console.info('servcieType : ' + servcieType) ;
            //服务类型是不是行李附加服务
            var isBaggageFlag = commonUtil.checkBaggageServcie(servcieType);
            var in_flag = true;
            if (isBaggageFlag) {
                //如果为空表收费
                if (noChargeNotAvailable == "") {
                    //如果不为收费这下面的置空
                    in_flag = true;
                } else {
                    //免费的时候需要清空填写的信息
                    in_flag = false;
                }
            } else {
                //一般附加服务
                var arr = [ "X", "E", "F", "G", "H" ];
                //dxef
                var flag2 = _.contains(arr, noChargeNotAvailable);
                if (flag2) {
                    in_flag = false;
                } else {
                    //如果为空表收费
                    in_flag = true;
                }
            }
            //一般服务时//当收费字段为D/X/F/E时适用于才可能存在空
            /*var dxefFlag = false ;
				if(!isBaggageFlag){//,'X','E','F'因为这些时使用于已经是空了
					if(_.contains(['D'], noChargeNotAvailable)){
						dxefFlag = true ;
					}
				}
				if(dxefFlag){

				}else{

				}*/
            $scope.$parent.$broadcast("singleChangeByFlagNotice", "list170VOAndlist201VO", in_flag + "", "false");
            //费用//in_fname,in_flag,needDigest
            $scope.$parent.$broadcast("singleChangeByFlagNotice", "specifiedServiceFeeMileage", in_flag + "", "false");
            //里程
            $scope.$parent.$broadcast("singleChangeByFlagNotice", "specifiedServiceFeeApp", in_flag + "", "false");
            //适用于
            //当是否收费为D时  --行李适用范围必须为空
            if (noChargeNotAvailable == "D") {
                $scope.data.baggageTravelApplication = "";
                FormEditStatusServcie.baggageTravelApplication = false;
            } else {
                FormEditStatusServcie.baggageTravelApplication = true;
            }
        };
        //适用于改变时
        $scope.changeSpecifiedServiceFeeApp = function() {
            var serviceType = $scope.data.serviceType;
            var ssfa = $scope.data.specifiedServiceFeeApp;
            var in_flag = true;
            if (serviceType == "C" || serviceType == "P") {
                if (ssfa == "H" || ssfa == "C" || ssfa == "P") {
                    //收费字段必须为空，并且170或201必须为空
                    //$scope.data.noChargeNotAvailable = '' ;//因为 当servcieType为cp是收费字段一定为空
                    in_flag = false;
                }
            }
            //console.info('serviceType : ['+serviceType+'] , ssfa : ['+ssfa+']  , in_flag : ['+in_flag+']' ) ;
            //$scope.FormEditStatusServcie.noChargeNotAvailable =in_flag;
            //170，201显示或隐藏
            $scope.$parent.$broadcast("singleChangeByFlagNotice", "list170VOAndlist201VO", in_flag + "", "false");
        };
        //170表的显示隐藏函数
        $scope.t170FlagFunc = function(type) {
            var flag = false;
            var ssfa = $scope.data.specifiedServiceFeeApp;
            if ($scope.flagData.t170.flag) {
                //如果应该显示
                if (type == "t170") {
                    if ($scope.data.discountOrNot == "1") {
                        flag = true;
                    }
                } else if (type == "t201") {
                    if ($scope.data.discountOrNot == "0") {
                        flag = true;
                    }
                }
            }
            if (flag) {
                if ($scope.data.serviceType == "C" || $scope.data.serviceType == "P") {
                    if (ssfa == "H" || ssfa == "C" || ssfa == "P") {
                        flag = false;
                    }
                }
            }
            return flag;
        };
        $scope.clickDiscount2 = function(l) {
            var type = l.discountType;
            if (type == "1") {
                //全额
                l.discountNum = "";
            } else {
                l.onePriceNum = "";
            }
        };
        //金额选择全额或则折扣时
        $scope.clickDiscount = function(dt) {
            //当点击时可以触发展开表格
            $scope.flagData.t170.flag = true;
            $scope.flagData.t170.title = "收起表格";
            $scope.data.discountOrNot = dt;
            if (dt == "1") {
                //全额
                $scope.data.list201VO = [];
            } else {
                //折扣
                //第三列一定要已选中
                $scope.data.list170VO = [];
                var sel3value = $scope.data.sel3.value;
                if (sel3value.length > 0) {
                    $scope.data.list201VO = [];
                    //数据初始化
                    //1.判断套餐/非套餐
                    //2.套餐:显示每一条,非套餐的话总的显示一条
                    var serviceGroup = $scope.data.sel1.value;
                    //BD
                    if (serviceGroup != null && serviceGroup.length > 2 && serviceGroup.indexOf("BD") === 0) {
                        //说明是套餐
                        var tmpArr = [];
                        //[1]页面显示的字符串,[2]折扣类型,[3]一口价,[4]一口价单位,[5]折扣数
                        for (var i = 0; i < $scope.data.sel4.length; i++) {
                            var l = $scope.data.sel4[i];
                            var obj = {
                                subCode: l.subCode,
                                commercialName: l.commercialName,
                                discountType: "1",
                                onePriceNum: "",
                                discountNum: ""
                            };
                            tmpArr.push(obj);
                        }
                        $scope.data.list201VO = tmpArr;
                    } else {
                        //说明是非套餐
                        $scope.data.list201VO = [];
                        //数据初始化
                        //显示str $scope.data.sel3.showStr
                        var subCode = $scope.data.sel3.value;
                        var index = 2 + subCode.length;
                        //'['+subCode+']'
                        var sel3ShowStr = $scope.data.sel3.showStr;
                        var commercialName = sel3ShowStr.substring(index);
                        //[1]页面显示的字符串,[2]折扣类型,[3]一口价,[4]一口价单位,[5]折扣数
                        var obj = {
                            subCode: subCode,
                            commercialName: commercialName,
                            discountType: "1",
                            onePriceNum: "",
                            discountNum: ""
                        };
                        $scope.data.list201VO = [ obj ];
                    }
                } else {
                    $scope.data.list201VO = [];
                    //数据初始化
                    alert("服务必须选择到最后一级!");
                }
            }
        };
    } ]);
});

define("fare/oc/1.0.0/edit/controllers/ruleDetailController-debug", [ "fare/oc/1.0.0/edit/controllers/controllers-debug", "fare/oc/1.0.0/edit/data/editJsonData-debug" ], function(require, exports, module) {
    var controllers = require("fare/oc/1.0.0/edit/controllers/controllers-debug");
    var jsonDate = require("fare/oc/1.0.0/edit/data/editJsonData-debug");
    //页面第三部分/////////规则详细部分/////////////////////////////////////////////////////////
    controllers.controller("RuleDetailCtrl", [ "$scope", "FormData", "NEW_ADD_STR", "$http", function($scope, FormData, NEW_ADD_STR, $http) {
        $scope.data = FormData;
        $scope.NEW_ADD_STR = NEW_ADD_STR;
        $scope.noCharge_notAvailableList = jsonDate.noCharge_notAvailableList;
        //舱位list集合
        $scope.cabinList = jsonDate.cabinList;
        //区域集合
        $scope.geoLocTypeList = jsonDate.geoLocTypeList;
        //退/改
        $scope.indicatorReissueRefundList = jsonDate.geoLocTypeList;
        //退款形式
        $scope.formOfRefundList = jsonDate.formOfRefundList;
        $scope.geoSpecSectPortJourneyList = jsonDate.geoSpecSectPortJourneyList;
        $scope.geoSpecExceptionStopUnitList = jsonDate.geoSpecExceptionStopUnitList;
        $scope.timeApplicationList = jsonDate.timeApplicationList;
        $scope.getUpGradeTableTile = function() {
            var sel1Value = FormData.sel1.value;
            var tmpStr = "";
            if (sel1Value == "SA" || sel1Value == "BDSA") {
                tmpStr = "座位属性表";
            } else if (sel1Value == "UP" || sel1Value == "BDUP") {
                tmpStr = "升舱属性表";
            }
            return tmpStr;
        };
        var list = [ "SA", "BDSA", "UP", "BDUP" ];
        $scope.showUpGradeTableFlag = function() {
            var flag = false;
            var index = list.indexOf(FormData.sel1.value);
            if (index != -1) {
                flag = true;
            }
            if (flag) {
                //如果为true，并且serviceType为M，或F时显示
                if ($scope.data.serviceType == "M" || $scope.data.serviceType == "F") {
                    flag = true;
                } else {
                    flag = false;
                }
            }
            return flag;
        };
        var list2 = [ "UP", "BDUP" ];
        $scope.showUpGradeServiceFlag = function() {
            //升舱到的服务等级
            var flag = false;
            var index = list2.indexOf(FormData.sel1.value);
            if (index != -1) {
                flag = true;
            }
            if (flag) {
                //如果为true，并且serviceType为M，或F时显示
                if ($scope.data.serviceType == "M" || $scope.data.serviceType == "F") {
                    flag = true;
                } else {
                    flag = false;
                }
            }
            return flag;
        };
        //upGradeTable td input size //如果是座位属性表长度为10，订座属性表长度为3
        $scope.getUpGradeInputSize = function() {
            var sel1Value = FormData.sel1.value;
            var len = 5;
            if (sel1Value == "SA" || sel1Value == "BDSA") {
                len = 10;
            } else if (sel1Value == "UP" || sel1Value == "BDUP") {
                len = 5;
            }
            return len;
        };
        //改变机型的select框
        $scope.selectChangeEquipment = function() {
            $scope.flagData.t165.title = "自定义区域";
            $scope.flagData.t165.flag = false;
        };
        //data.list178Loc1开始
        //区域1 select改变
        $scope.selectChangeGeoSpecLoc1 = function() {
            $scope.data.geoSpecLoc1 = "";
            $scope.flagData.geo1.title = "自定义区域";
            $scope.flagData.geo1.flag = false;
        };
        //区域2 select改变
        $scope.selectChangeGeoSpecLoc2 = function() {
            $scope.data.geoSpecLoc2 = "";
            $scope.flagData.geo2.title = "自定义区域";
            $scope.flagData.geo2.flag = false;
        };
        //区域3 select改变
        $scope.selectChangeGeoSpecLoc3 = function() {
            $scope.data.geoSpecLoc3 = "";
            $scope.flagData.geo3.title = "自定义区域";
            $scope.flagData.geo3.flag = false;
        };
    } ]);
});

define("fare/oc/1.0.0/edit/filters/filters-debug", [], function(require, exports, module) {
    var app = angular.module("app.filter", []);
    //过滤choose1
    app.filter("serviceGroupFilter", function() {
        var myFunc = function(data, inputStr) {
            inputStr = inputStr || "";
            var retData = [];
            if (inputStr.length > 0) {
                inputStr = inputStr.toLowerCase();
                angular.forEach(data, function(e) {
                    if (e.serviceGroupDescription.toLowerCase().indexOf(inputStr) != -1) {
                        retData.push(e);
                    }
                });
            } else {
                retData = data;
            }
            return retData;
        };
        return myFunc;
    });
    //subGroupDescription
    app.filter("subGroupFilter", function() {
        var myFunc = function(data, inputStr) {
            inputStr = inputStr || "";
            var retData = [];
            if (inputStr.length > 0) {
                inputStr = inputStr.toLowerCase();
                angular.forEach(data, function(e) {
                    if (e.subGroupDescription.toLowerCase().indexOf(inputStr) != -1) {
                        retData.push(e);
                    }
                });
            } else {
                retData = data;
            }
            return retData;
        };
        return myFunc;
    });
    //lastGroupList
    app.filter("lastGroupFilter", function() {
        var myFunc = function(data, inputStr) {
            inputStr = inputStr || "";
            var retData = [];
            if (inputStr.length > 0) {
                inputStr = inputStr.toLowerCase();
                angular.forEach(data, function(e) {
                    var tmpStr = "[" + e.serviceSubCode + "]" + e.commercialName;
                    if (tmpStr.toLowerCase().indexOf(inputStr) != -1) {
                        retData.push(e);
                    }
                });
            } else {
                retData = data;
            }
            return retData;
        };
        return myFunc;
    });
});
