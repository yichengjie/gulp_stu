define(function(require, exports, module){ 
	 var directives = require("./directives") ;
	 var tableHtml = require("../../tpls/edit/table.html") ;
	 var trHtml = require("../../tpls/edit/tr.html") ;
	 var theadHtml = require("../../tpls/edit/thead.html") ;
	 var _ = require('underscore') ;

	 directives.directive('tableInfo', function(){
		  return {
	        restrict: 'AE',
	        replace: true,
			template:tableHtml,
			scope:{
				tableData:'=',
				list:'=',
				tableWidth:'@',
				data:"="
			},
			controller:['$scope',function($scope){
				$scope.column = $scope.tableData.titieList.length ;
				//$scope.list = $scope.tableData.list ;//这个list如果是在tableData中传递过来的话，如果是更新视图，则不会刷新视图，不知道为什么
				$scope.status = $scope.data.statusDes ;
				$scope.titleList = $scope.tableData.titieList ;
				$scope.canNotModifyFlag = function(){
					var flag = false;
					if($scope.status=='3'){
						flag = true ;
					}
					return flag ;
				}
				//新增一行记录
				$scope.tbAddLine = function(){
					if($scope.status!='3'){
						outAllSelect() ;
						//var obj = $.extend({},$scope.tableData.addObj)//也就是将"{}"作为dest参数。 ;
						var obj = angular.copy($scope.tableData.addObj) ;
						$scope.list.push(obj) ;
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
						//$('#'+$scope.hiddenInputId).trigger('click') ;
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
				//下面是特殊的部分，select可能会存在//如果你的表格比较特殊的话可能需要修改修改下面的部分代码
				/**这一部分算是半工作能够部分(因为有的表格会使用这部分数据，但是有的表格不使用这部分数据)**/
				$scope.geoSpecTypeList = [
					{"name":"选择","value":""},
					{"name":"A-大区","value":"A"},{"name":"C-城市","value":"C"},
					{"name":"N-国家","value":"N"},{"name":"P-机场","value":"P"},
					{"name":"S-州","value":"S"},{"name":"Z-区域","value":"Z"}
				] ;
				$scope.codeTypeList = [
					{"name":"选择","value":""},{"name":"T-代理人office号","value":"T"},
					{"name":"I-IATA号","value":"I"},{"name":"Department/Identifier","value":"X"},
					{"name":"CRS/CXR Department Code","value":"V"},{"name":"ERSP No","value":"E"},
					{"name":"LNIATA Number (CRT Address)","value":"L"},{"name":"Airline specific codes","value":"A"}
				] ;
				//市场方/承运方
				$scope.marketingOpreratingList = [
					{"name":"选择","value":""},
					{"name":"M-市场方","value":"M"},{"name":"O-承运方","value":"O"},
					{"name":"E-市场方/承运方","value":"E"}
				] ;
				/*********183特殊部分开始*******************/
				$scope.selectChange183Tb1 = function(l183){
					l183.geographicSpecification = "" ;
				}
				$scope.selectChange183Tb2 = function(l183){
					l183.code = "" ;
				}
				$scope.viewBookTktList = [// 权限list
					{"name":"选择","value":""},{"name":"查看/订票/出票","value":1},
					{"name":"仅查看","value":2}
				] ;
				/*********183特殊部分结束*******************/
				
				/*********198特殊部分开始*******************/
				$scope.selectChange198Tb = function(l198){
					reseat198VO(l198) ;
				}
				//重置数据
				function reseat198VO (l198){
					if(l198){
						l198.cxr = "" ;
						l198.rbd1 = "" ;
						l198.rbd2 = "" ;
						l198.rbd3 = "" ;
						l198.rbd4 = "" ;
						l198.rbd5 = "" ;
					}
				}
				/*********198特殊部分结束*******************/
				/*********170特殊部分开始*******************/
				$scope.selectChange170Tb = function(l170){
					reseat170VO(l170) ;
				}
				function reseat170VO (l170){
					if(l170){
						l170.saleGeographicPoint = "" ;
						//l170.specFeeAmount = "" ;
					}
				}
			    /*********170特殊部分结束*******************/
				//178表格的区域select框发生变化时触发的函数
				$scope.selectChange178Tb = function(l178){
					l178.geoLocSpec = "" ;
				}
			}],
			compile: function compile(tElement, tAttrs, transclude){
				var urlStr = tAttrs['htmlUrl'] ;
				var headerTeplate = _.template(theadHtml) ; 
				var bodyTemplate = _.template(trHtml);
				var headStr = headerTeplate({value: urlStr}) ;
				var bodyStr = bodyTemplate({value: urlStr});
				var tableElement =  angular.element(tElement) ;
				tableElement.find('thead').append(headStr) ;
				tableElement.find('tbody').append(bodyStr) ;
				return {
					pre: function(scope, element, attrs){
						
					},
					post: function(scope, element, attrs){
						element.find("div.delete_line").bind('click',function(){
							if (scope.status != '3') {
								scope.tbDelLine() ;
							}
						}) ;

					}
				};
			}
	      };
      });
	  
}) ;