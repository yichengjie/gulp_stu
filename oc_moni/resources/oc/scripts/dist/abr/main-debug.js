define("fare/oc/1.0.0/abr/main-debug", [ "tuiValidator-debug", "tuiDialog-debug", "./services/services-debug", "./controllers/controllers-debug", "./util/FormDataUtil-debug", "./util/FormValid-debug", "underscore-debug", "./directives/directives-debug", "./tpls/table-debug.html", "./tpls/publishObject-debug.html" ], function(require, exports, module) {
    require("tuiValidator-debug");
    require("tuiDialog-debug");
    require("./services/services-debug");
    require("./controllers/controllers-debug");
    require("./directives/directives-debug");
    var app = angular.module("app", [ "app.service", "app.controller", "app.directive" ]);
    /**页面加载完毕之后启动angualr**/
    module.exports = {
        init: function() {
            angular.element(document).ready(function() {
                angular.bootstrap(document, [ "app" ]);
                initTuiForm();
            });
        }
    };
    function initTuiForm() {
        // // 注册验证插件
        $("#abrDataSourceCfgForm").tuiValidator({
            ignore: "",
            submitId: "abrDataSourceCfgSaveBtn",
            isDialog: false,
            isLabel: true,
            isTip: false,
            isLabelDown: true,
            isErrorDown: false,
            dialogMethod: function(messages) {
                $.showTuiMessageAlert(messages, null, 370, 120);
            },
            dialogTip: "label",
            submitHandler: function(form) {
                //获取指定id元素上的controller
                var element = angular.element($("#EditControllerDiv"));
                var scope = element.scope();
                scope.saveFormData();
            }
        });
    }
});

define("fare/oc/1.0.0/abr/services/services-debug", [], function(require, exports, module) {
    var app = angular.module("app.service", []);
    app.factory("FormData", [ function() {
        return {
            id: "",
            action: "",
            carrCode: "",
            //航空公司
            contextPath: "",
            status: "1",
            //1:未生效的记录
            sequcenceNumber: "",
            //序列号
            serviceType: "*",
            //服务类型//  这个从哪里获取呢？
            subCode: "",
            //子代码，服务三字代码，【*】则为不做任何限制，ALL
            internationalTag: "",
            //行程种类,由行程判断得到   I=国际   D=国内（默认值）
            effDate: "",
            //生效日期
            discDate: "",
            //截止日期
            dataSource: "",
            //访问数据源,OPTSVC=ATPCO数据（默认值） TSKOC=航信数据
            publishObjectList: []
        };
    } ]);
    app.factory("ErrorData", [ function() {
        return {
            internationalTag: {
                tip: "必填",
                flag: false
            },
            dataSource: {
                tip: "必填",
                flag: false
            },
            effDate: {
                tip: "",
                flag: false
            },
            discDate: {
                tip: "",
                flag: false
            },
            sequcenceNumber: {
                tip: "",
                flag: false
            },
            subCode: {
                tip: "",
                flag: false
            }
        };
    } ]);
});

define("fare/oc/1.0.0/abr/controllers/controllers-debug", [ "fare/oc/1.0.0/abr/util/FormDataUtil-debug", "fare/oc/1.0.0/abr/util/FormValid-debug", "underscore-debug" ], function(require, exports, module) {
    var app = angular.module("app.controller", []);
    var FormDataUtil = require("fare/oc/1.0.0/abr/util/FormDataUtil-debug");
    app.controller("EditController", [ "$scope", "FormData", "$http", "ErrorData", "$q", function($scope, FormData, $http, ErrorData, $q) {
        $scope.error = ErrorData;
        $scope.headerTipStr = "新建数据源配置";
        $scope.data = FormData;
        var id = $.trim($("#id").val());
        var action = $.trim($("#action").val());
        var carrCode = $.trim($("#carrCode").val());
        var contextPath = $.trim($("#contextPath").val());
        //这个字段是判断当前登陆用户的信息//属于航空公司或则航信用户
        FormData.id = id;
        FormData.action = action;
        FormData.carrCode = carrCode;
        FormData.contextPath = contextPath;
        //前面几个一般表格的显示隐藏
        $scope.tbFlagData = {
            publishObject: {
                flag: false,
                title: "填写表格"
            }
        };
        if (action == "add") {
            $scope.headerTipStr = "新建数据源配置";
            initPage4Add();
        } else if (action == "update") {
            $scope.headerTipStr = "更新数据源配置";
            initPage4Update();
        }
        //init add page
        function initPage4Add() {
            initListData($scope.data, $scope.tbFlagData);
        }
        //init update page
        function initPage4Update() {
            var id = $scope.data.id;
            var url = $scope.data.contextPath + "/abr/findAbrDataSourceCfgById?id=" + id;
            $http.get(url).success(function(data) {
                if (data.flag == "true") {
                    FormDataUtil.convertVo2FormData(data.vo, $scope.data);
                    initListData($scope.data, $scope.tbFlagData);
                } else {
                    $.showTuiErrorDialog("获取数据出错！");
                }
            });
        }
        $scope.backPage = function() {
            window.location.href = $scope.data.contextPath + "/abr/toCfgAbrDatasource";
        };
        /******************这一部分是select提供数据开始*************************************/
        /*{"name":"运价相关","value":"F"},{"name":"客票相关","value":"T"},
		 * {"name":"商品相关","value":"M"},{"name":"规则相关","value":"R"}
		 */
        $scope.selectList = {
            serviceTypeList: [ {
                name: "选择",
                value: "*"
            }, {
                name: "免费行李",
                value: "A"
            }, {
                name: "随携行李",
                value: "B"
            }, {
                name: "付费行李",
                value: "C"
            }, {
                name: "预付费行李",
                value: "P"
            }, {
                name: "禁运行李",
                value: "E"
            } ]
        };
        /******************这一部分是select提供数据结束*************************************/
        $scope.tbTitleList = {
            pbObj: [ {
                title: "发布对象类型"
            }, {
                title: "部门代码"
            } ]
        };
        //提交表单数据
        $scope.saveFormData = function() {
            var action = $scope.data.action;
            var url = $scope.data.contextPath + "/abr/saveFormData";
            var vo = FormDataUtil.convertFormData2Vo($scope.data);
            var flag = false;
            $scope.$apply(function() {
                flag = FormDataUtil.validFormData(vo, $scope.error, vo.status);
            });
            var promise = FormDataUtil.validSequcenceNumber(vo.sequcenceNumber, $scope.error, $http, $scope.data.contextPath, vo.id, $q);
            promise.then(function(result) {
                if (flag) {
                    //提示是否保存数据
                    $.showTuiConfirmDialog("保存?", function() {
                        $http.post(url, vo, {
                            params: {
                                action: action
                            }
                        }).success(function(data) {
                            if (data.flag == "true") {
                                $.showTuiSuccessDialog("保存成功！", function() {
                                    $.showTuiWaitingDialog("即将返回查询界面!", 200, 60);
                                    setTimeout(function() {
                                        $.closeTuiWindow();
                                    }, 5e3);
                                    window.location.href = $scope.data.contextPath + "/abr/toCfgAbrDatasource";
                                });
                            } else {
                                $.showTuiErrorDialog("保存数据出错！");
                            }
                        });
                    });
                }
            }, function(error) {
                console.info("error : " + error);
            });
        };
        //初始化数据
        function initListData(dataSourceCfgVo, tbFlagData) {
            //publish object
            initTbData(dataSourceCfgVo.publishObjectList, tbFlagData.publishObject);
        }
        function initTbData(list, flagData) {
            if (list) {
                if (list.length > 0) {
                    flagData.flag = true;
                    flagData.title = "收起表格";
                }
            }
        }
        //数据校验部分
        $scope.validEffDate = function() {
            var effDate = $scope.data.effDate;
            FormDataUtil.validEffDate(effDate, $scope.error, $scope.data.status);
        };
        $scope.validDiscDate = function() {
            var effDate = $scope.data.effDate;
            var discDate = $scope.data.discDate;
            FormDataUtil.validDiscDate(effDate, discDate, $scope.error);
        };
        $scope.validSequcenceNumber = function() {
            var sequcenceNumber = $scope.data.sequcenceNumber;
            FormDataUtil.validSequcenceNumber(sequcenceNumber, $scope.error, $http, $scope.data.contextPath, $scope.data.id, $q);
        };
        $scope.validInternationalTag = function() {
            var internationalTag = $scope.data.internationalTag;
            FormDataUtil.validInternationalTag(internationalTag, $scope.error);
        };
        $scope.validDataSource = function() {
            var dataSource = $scope.data.dataSource;
            FormDataUtil.validDataSource(dataSource, $scope.error);
        };
    } ]);
});

define("fare/oc/1.0.0/abr/util/FormDataUtil-debug", [ "fare/oc/1.0.0/abr/util/FormValid-debug", "underscore-debug" ], function(require, exports, module) {
    var valid = require("fare/oc/1.0.0/abr/util/FormValid-debug");
    var util = {};
    var _ = require("underscore-debug");
    /**
	 * <pre>
	 * 	功能描述：将formData转化为vo
	 * </pre>
	 * @param {Object} formData
	 */
    util.convertFormData2Vo = function(formData) {
        var vo = {};
        angular.extend(vo, formData);
        delete vo.action;
        delete vo.contextPath;
        for (var i = 0; i < vo.publishObjectList.length; i++) {
            delete vo.publishObjectList[i].selected;
        }
        return vo;
    };
    /**
	 * <pre>
	 * 	功能描述:将vo转化转化为formData
	 * </pre>
	 * @param {Object} vo
	 * @param {Object} formData
	 */
    util.convertVo2FormData = function(vo, formData) {
        for (var p in formData) {
            var flag = vo.hasOwnProperty(p);
            if (flag) {
                formData[p] = vo[p];
            }
        }
    };
    util.validFormData = function(vo, error, status) {
        var flag = true;
        if (!util.validInternationalTag(vo.internationalTag, error)) {
            flag = false;
        }
        if (!util.validDataSource(vo.dataSource, error)) {
            flag = false;
        }
        if (vo.dataSource == "") {
            error.dataSource.flag = true;
            flag = false;
        }
        if (!util.validEffDate(vo.effDate, error, status)) {
            flag = false;
        }
        if (vo.discDate == "") {
            vo.discDate = "9999-12-31";
        } else {
            if (!util.validDiscDate(vo.effDate, vo.discDate, error)) {
                flag = false;
            }
        }
        //校验部门代码list数据合法性
        if (!util.validPublisObjectList(vo.publishObjectList)) {
            flag = false;
        }
        return flag;
    };
    util.validPublisObjectList = function(list) {
        var flag = true;
        var tmpKeyList = [];
        if (list != null && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                var key = list[i].type + $.trim(list[i].code);
                tmpKeyList.push(key);
            }
        }
        var tmp = _.uniq(tmpKeyList);
        if (tmpKeyList.length > tmp.length) {
            $.showTuiMessageDialog("请填写不同的部门代码！");
            flag = false;
        }
        return flag;
    };
    util.validDataSource = function(dataSource, error) {
        var flag = false;
        if (valid.strNotNull(dataSource)) {
            error.dataSource.flag = false;
            flag = true;
        } else {
            error.dataSource.flag = true;
            flag = false;
        }
        return flag;
    };
    util.validInternationalTag = function(internationalTag, error) {
        var flag = false;
        if (valid.strNotNull(internationalTag)) {
            flag = true;
            error.internationalTag.flag = false;
        } else {
            error.internationalTag.flag = true;
            flag = false;
        }
        return flag;
    };
    util.validSequcenceNumber = function(sequcenceNumber, error, $http, contextPath, id, $q) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        //进行数据库校验
        if (valid.strNotNull(sequcenceNumber)) {
            var url = contextPath + "/abr/checkSequcenceNumberNotExixt";
            $http.post(url, {
                id: id,
                sequcenceNumber: sequcenceNumber
            }).success(function(data) {
                if (data.flag == "true") {
                    if (data.existFlag == "true") {
                        error["sequcenceNumber"]["flag"] = true;
                        error["sequcenceNumber"]["tip"] = "序列号已存在!";
                        deferred.reject("序列号已存在!");
                    } else {
                        error["sequcenceNumber"]["flag"] = false;
                        error["sequcenceNumber"]["tip"] = "";
                        deferred.resolve("序列号不存在，可添加!");
                    }
                } else {
                    error["sequcenceNumber"]["flag"] = true;
                    error["sequcenceNumber"]["tip"] = "检查序列号重复出错!";
                    deferred.reject("检查序列号重复出错!");
                }
            });
        } else {
            error["sequcenceNumber"]["flag"] = false;
            error["sequcenceNumber"]["tip"] = "";
            deferred.resolve("序列号为空,可添加!");
        }
        return promise;
    };
    //校验生效日期
    util.validEffDate = function(effDate, error, status) {
        var flag = false;
        if (status == "2") {
            flag = true;
            error["effDate"]["flag"] = false;
            error["effDate"]["tip"] = "";
        } else {
            //生效日期必须大于当前日期
            var currDate = new Date();
            currDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
            var startDate = util.getDate(effDate);
            if (startDate < currDate) {
                flag = false;
                error.effDate.tip = "生效日期必须大于当前日期。";
                error.effDate.flag = true;
            } else {
                flag = true;
                error["effDate"]["flag"] = false;
                error["effDate"]["tip"] = "";
            }
        }
        return flag;
    };
    //校验截止日期
    util.validDiscDate = function(effDate, discDate, error) {
        var flag = false;
        flag = valid.strNotNull(discDate);
        if (flag) {
            //不为空//那就说明合法日期
            var startDate = util.getDate(effDate);
            var endDate = util.getDate(discDate);
            if (startDate > endDate) {
                flag = false;
                error["discDate"]["flag"] = true;
                error["discDate"]["tip"] = "截止日期必须大于等于生效日期。";
            } else {
                flag = true;
                error["discDate"]["flag"] = false;
                error["discDate"]["tip"] = "";
            }
        } else {
            //为空
            flag = true;
            error["discDate"]["flag"] = false;
        }
        return flag;
    };
    util.getDate = function(str) {
        var strs = str.split("-");
        var year = strs[0];
        var month = strs[1];
        var day = strs[2];
        return new Date(year, month - 1, day);
    };
    return util;
});

define("fare/oc/1.0.0/abr/util/FormValid-debug", [], function(require, exports, module) {
    //var $ = require('jquery') ;
    var valid = {};
    //校验字符串不为空，如果为空:false,否则：true
    valid.strNotNull = function(str) {
        var flag = false;
        str = valid.dealStr(str);
        if (str.length > 0) {
            flag = true;
        }
        return flag;
    };
    //字母或数字校验
    valid.strIsAlphanumeric = function(str) {
        return /^[A-Za-z0-9]{0,}$/.test(str);
    };
    //短日期校验
    valid.strIsShortDate = function(str) {
        var flag = false;
        flag = valid.strNotNull(str);
        if (flag) {
            flag = G(str);
        }
        return flag;
    };
    //数字校验
    valid.strIsDigital = function(str) {
        return /^[0-9]{0,}$/.test(str);
    };
    valid.dealStr = function(str) {
        if (str == null) {
            return "";
        } else {
            return $.trim(str);
        }
    };
    var G = function(ak, al) {
        var aj = ak;
        if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(aj)) {
            return false;
        }
        var ar = true;
        var ap = new Date().getFullYear() - 0;
        var i = aj.split(/-/);
        var an = i[0] - 0;
        var am = i[1] - 0;
        var ao = i[2] - 0;
        var aq = [ 0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        var ai = function() {
            return an % 400 == 0 || an % 4 == 0 && an % 100 != 0;
        };
        if (!al && (an < ap - 20 || an > ap + 20)) {
            ar = false;
        }
        if (am > 12 || am < 1) {
            ar = false;
        }
        if (aq[am] < ao || ao < 1 || ao > 31) {
            ar = false;
        }
        if (am == 2 && !ai() && ao > 28) {
            ar = false;
        }
        return ar;
    };
    return valid;
});

define("fare/oc/1.0.0/abr/directives/directives-debug", [ "underscore-debug" ], function(require, exports, module) {
    var _ = require("underscore-debug");
    var tableHtml = require("fare/oc/1.0.0/abr/tpls/table-debug.html");
    var tbRow_publishObjectHtml = require("fare/oc/1.0.0/abr/tpls/publishObject-debug.html");
    var app = angular.module("app.directive", []);
    app.directive("tableInfo", function() {
        return {
            restrict: "E",
            replace: true,
            scope: {
                tableWidth: "@",
                hiddenInputId: "@",
                rowHtml: "@",
                action: "=",
                titleList: "=",
                list: "=",
                status: "="
            },
            template: function(element, attrs) {
                var attrHtml = attrs["rowHtml"];
                var retStr = "";
                var compiled = _.template(tableHtml);
                if ("publishObject.html" == attrHtml) {
                    retStr = compiled({
                        value: tbRow_publishObjectHtml
                    });
                }
                return retStr;
            },
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                var html = $scope.rowHtml;
                //新增一行记录
                $scope.tbAddLine = function() {
                    if ($scope.status != "3") {
                        outAllSelect();
                        if (html == "publishObject.html") {
                            $scope.list.push({
                                type: "V",
                                code: "",
                                selected: true
                            });
                        }
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
                        //这一个一定要触发，要不然无法消除页面之前校验的表格错误信息
                        $("#" + $scope.hiddenInputId).trigger("click");
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
                /********select List*********/
                $scope.selectList = {
                    publishObjectList: [ {
                        name: "V",
                        value: "V"
                    } ]
                };
            } ],
            transclude: true,
            link: function(scope, iElm, iAttrs) {
                iElm.find("div.delete_line").bind("click", function() {
                    scope.tbDelLine();
                });
            }
        };
    });
    app.directive("ocError", function() {
        return {
            restrict: "AE",
            replace: true,
            scope: {
                error: "="
            },
            template: function(element, attrs) {
                var name = attrs.name;
                var str = '<label ng-show ="error.' + name + '.flag" class="tui_input_error" style="position: absolute; z-index: 10; width: auto; height: auto;" for="' + name + '" generated="true">' + '<span class="icon_error" style="margin:-1px 6px 0 0;"></span><span ng-bind="error.' + name + '.tip"></span>' + "</label>";
                return str;
            }
        };
    });
    app.directive("setFocus", function() {
        return {
            restrict: "AE",
            replace: true,
            scope: true,
            link: function(scope, elem, attrs) {
                elem.trigger("click");
            }
        };
    });
    app.directive("upperInput", function() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;
                // do nothing if no ng-model
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
    //显示隐藏表格
    app.directive("showHideTable", function() {
        return {
            restrict: "E",
            replace: true,
            scope: {
                tbInfo: "="
            },
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                var showTbBtnTip = "填写表格";
                var hideTbBtnTip = "收起表格";
                $scope.showHideTable = function() {
                    $scope.tbInfo.flag = !$scope.tbInfo.flag;
                    if ($scope.tbInfo.flag) {
                        //如果当前为显示状态
                        $scope.tbInfo.title = hideTbBtnTip;
                    } else {
                        $scope.tbInfo.title = showTbBtnTip;
                    }
                };
            } ],
            template: "<div>" + '<a href = "javascript:void(0)" ng-click = "showHideTable();" ng-bind = "tbInfo.title"></a>' + '<div ng-show = "tbInfo.flag" ng-transclude=""></div>' + "</div>",
            transclude: true
        };
    });
    //初始化日期控件
    app.directive("datepicker", function() {
        return {
            restrict: "A",
            scope: {},
            link: function(scope, elem, attr) {
                var currDate = new Date();
                $(elem).datepicker({
                    minDate: currDate,
                    showButtonPanel: true
                });
            }
        };
    });
    //判断是否能修改value值
    app.directive("canChage", function() {
        return {
            restrict: "A",
            replace: true,
            scope: true,
            link: function(scope, elem, attrs) {
                var name = attrs["canChage"];
                var flag = false;
                var status = scope.data.status;
                if (status == "1") {
                    //未生效的数据源
                    flag = true;
                } else if (status == "2") {
                    //只能改截止日期和序列号
                    if (name == "effDate" || name == "sequcenceNumber") {
                        flag = true;
                    }
                }
                if (!flag) {
                    attrs.$set("disabled", "disabled");
                }
            }
        };
    });
});

define("fare/oc/1.0.0/abr/tpls/table-debug.html", [], '<div class = "table_layout" style="width: {{tableWidth}}px;">\n	<table>\n	<thead>\n		<tr ng-if = "list.length>0">\n			 <th ng-repeat="tl in titleList" ng-bind="tl.title"></th>\n		</tr>\n		<tr ng-if = "list.length==0">\n			 <th>无记录</th>\n		</tr>\n	</thead>\n	<tbody>\n		<tr class = "hidden">\n			<!-- 这一个inpuy非常重要不能删除 -->\n			<td><input  id = "{{hiddenInputId}}"   type = "text" /></td>\n		</tr>\n		<%=value%>\n	</tbody>\n	</table>\n	<div class="helper_margin_top_10px" ng-show="action==\'add\'">\n		<div class="btn_page btn_add_small">\n	    	<div class="btn_left"></div>\n	        <div class="btn_content" ng-click = "tbAddLine();" >增加一行</div>\n	        <div class="btn_right"></div>\n	    </div>\n		<div class="btn_page btn_add_small_2">\n	    	<div class="btn_left"></div>\n			<div class="btn_content delete_line">删除一行</div>\n	        <div class="btn_right"></div>\n	    </div>\n		<div class="clearfix"></div>\n	</div>\n</div>');

define("fare/oc/1.0.0/abr/tpls/publishObject-debug.html", [], '<tr ng-repeat = "l in list" ng-click = "clickTr(l);" ng-class = "{true:\'selectTd\',false:\'\'}[l.selected]">\n    <td><div class="input_outer">\n		<select ng-model="l.type" \n			style="width:100px;"\n			ng-disabled = "status!=\'1\'"\n			ng-options="c.value as c.name for c in selectList.publishObjectList">\n		</select></div>\n	</td>\n    <td><div class="input_outer"><input type = "text" upper-input="" set-focus="" ng-disabled = "status!=\'1\'" ng-model = "l.code" maxLength ="10" class = "input_normal tuiRequired tuiAlphanumericOrStart"  placeholder = "输入*表示不做限制"></div></td>\n</tr> ');
