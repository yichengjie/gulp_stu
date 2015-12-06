define(function(require, exports, module) {
	var _ = require('underscore') ;
	var tableHtml = require('../tpls/table.html') ;
	var tbRow_publishObjectHtml = require('../tpls/publishObject.html') ;
	var app = angular.module("app.directive",[]) ;
	app.directive('tableInfo', function() {
	    return {
	        restrict: 'E',
	        replace: true,
	        scope:{
	        	tableWidth:'@',
	        	hiddenInputId:'@',
	        	rowHtml:'@',
				action:'=',
				titleList:'=',
				list:'=',
				status:'='
	        },
	        template: function(element, attrs){
				var attrHtml = attrs['rowHtml'] ; 
				var retStr = "" ;
				var compiled = _.template(tableHtml);
	        	if('publishObject.html'==attrHtml){
					retStr = compiled({value:tbRow_publishObjectHtml});
	        	}
				return retStr ;
	        },
	        controller:['$scope','$element','$attrs',function($scope, $element, $attrs){
	        	var html =  $scope.rowHtml ;
	        	//新增一行记录
				$scope.tbAddLine = function(){
					if($scope.status!='3'){
						outAllSelect() ;
						if(html=='publishObject.html'){
							$scope.list.push({"type":"V","code":"","selected":true}) ;
						}
					}
				}
				//删除一行记录
				$scope.tbDelLine = function (){
					var len = $scope.list.length ;
					if(len>=1){
						var num = len-1 ;
						angular.forEach($scope.list,function(l,index){
							if(l.selected){
								num = index ;
							}
						}) ;
						$scope.$apply(function(){
							outAllSelect() ;
							$scope.list.splice(num,1) ;
						}) ;
						//这一个一定要触发，要不然无法消除页面之前校验的表格错误信息
						$('#'+$scope.hiddenInputId).trigger('click') ;
					}
				}
				function outAllSelect(){//将所有tr全部置为非选中状态
					angular.forEach($scope.list,function(l){
						l.selected = false ;
					}) ;
				}
				$scope.clickTr = function(l){
					outAllSelect() ;
					l.selected = true ;
				}
				/********select List*********/
				$scope.selectList = {
					"publishObjectList":[
						{"name":"V","value":"V"}
					]
				}  ;
	        }],
			transclude:true,
			link:function(scope, iElm, iAttrs) {
				iElm.find("div.delete_line").bind('click',function(){
					scope.tbDelLine() ;
				}) ;
			}
	    };
	});
	
	
	app.directive('ocError',function(){
		return {
			restrict:'AE',
			replace:true,
			scope:{
				error:"="
			},
			template:function(element,attrs){
				var name = attrs.name ;
				var str = 
					'<label ng-show ="error.'+name+'.flag" class="tui_input_error" style="position: absolute; z-index: 10; width: auto; height: auto;" for="'+name+'" generated="true">'+
						'<span class="icon_error" style="margin:-1px 6px 0 0;"></span><span ng-bind="error.'+name+'.tip"></span>'+
				    '</label>' ;
				return  str ;
			}
		}
	}) ;
	
	app.directive('setFocus', function(){
	  return {
        restrict: 'AE',
        replace: true,
		scope:true,
		link: function(scope, elem, attrs) {
             elem.trigger('click') ;
        }
      };
    });
	
	app.directive("upperInput",function(){
	    return{
	        restrict:'A',
	        require:'ngModel',
	        link:function(scope,element,attrs,ngModel){
	            if (!ngModel)
	                return; // do nothing if no ng-model
	            ngModel.$render = function() {
	                var tmp = ngModel.$viewValue || '' ;
	                tmp = tmp.toUpperCase() ;
	                element.val(tmp);
	                ngModel.$setViewValue(tmp);
	            };
	            // Listen for change events to enable binding
	            element.bind('blur', function() {
	                scope.$apply(read);
	            });
	            //read(); // initialize
	            /// Write data to the model
	            function read() {
	                var tmp = ngModel.$viewValue || '';
	                tmp = tmp.toUpperCase() ;
	                ngModel.$setViewValue(tmp);
	                element.val(tmp);
	            }
	        }
	    }
	}) ;
	
	 //显示隐藏表格
	 app.directive('showHideTable',function(){
	    return {
	        restrict: 'E',
	        replace: true,
	        scope: {
	            tbInfo:'='
	        },
	        controller:['$scope','$element','$attrs',function($scope,$element,$attrs){
				var showTbBtnTip = "填写表格" ;
				var hideTbBtnTip = "收起表格" ;
	            $scope.showHideTable = function(){
	                $scope.tbInfo.flag = ! $scope.tbInfo.flag ;
	                if($scope.tbInfo.flag){//如果当前为显示状态
	                    $scope.tbInfo.title = hideTbBtnTip ;
	                }else{
	                    $scope.tbInfo.title = showTbBtnTip ;
	                }
	            }
	        }],
	        template: '<div>' +
	                      '<a href = "javascript:void(0)" ng-click = "showHideTable();" ng-bind = "tbInfo.title"></a>' +
	                      '<div ng-show = "tbInfo.flag" ng-transclude=""></div>' +
	                  '</div>',
	        transclude:true
	    }
	}) ;
	
	//初始化日期控件
	app.directive('datepicker',function(){
	    return{
	        restrict: 'A',
	        scope: {},
	        link: function (scope,elem,attr) {
	            var currDate = new Date();
	            $(elem).datepicker({minDate:currDate, showButtonPanel:true});
	        }
	    };
	}) ;
	 
	//判断是否能修改value值
	app.directive('canChage',function(){
		return{
			restrict:'A',
			replace:true,
			scope:true,
			link: function(scope, elem, attrs) {
				var name = attrs['canChage'] ;
				var flag = false;
				var status = scope.data.status ;
				if(status=="1"){//未生效的数据源
					flag = true ;
				}else if(status=="2"){
					//只能改截止日期和序列号
					if(name=="effDate"||name=="sequcenceNumber"){
						flag = true; 
					}
				}
				if(!flag){
					attrs.$set("disabled","disabled") ;
				}
	        }
		} ;
	}) ;
	 
}) ;
