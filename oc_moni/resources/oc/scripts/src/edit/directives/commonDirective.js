define(function(require, exports, module){
	 var directives = require('./directives') ;
	 var _ = require('underscore') ;
	 //var forceHtml = require('../../tpls/edit/force.html') ;

	 //显示隐藏表格
	 directives.directive('showHideTable',['TableStatusServcie',function(TableStatusServcie){
	    return {
	        restrict: 'E',
	        replace: true,
	        scope: {},
	        controller:['$scope','$element','$attrs',function($scope,$element,$attrs){
	        	$scope.tableStatus = TableStatusServcie ;
	        }],
	        template:function(elem,attrs){
	        	var tname = attrs['tname'] ;
	        	var tmpStr = "tableStatus."+tname+".showFlag" ;
	        	var html = '<a  href = "javascript:void(0)"><span ng-if="'+tmpStr+'" >收起表格</span><span ng-if="!'+tmpStr+'">填写表格</span></a>' ;
	        	return html ;
	        }, 
	        transclude:true,
	        link: function(scope, element, attrs){
	        	element.bind('click',function(){
	        		var tname = attrs['tname'] ;
	        		scope.$apply(function(){
						TableStatusServcie[tname]['showFlag'] = !TableStatusServcie[tname]['showFlag'] ;
	        		}) ;
	        	}) ;
	        }
	    };
	}]) ;


	 //刚添加的一行表格td需要触发focus函数,否则如果直接点击页头部分的保存按钮将无法进行tui的require等校验//不知道为什么
	 directives.directive('setFocus', function(){
		  return {
	        restrict: 'AE',
	        replace: true,
			scope:true,
			link: function(scope, elem, attrs) {
	             elem.trigger('click') ;
	        }
	      };
      });

	 //区域长度限制
	 directives.directive('geoMaxLength',function(){
	    return {
	        restrict: 'AE',
	        replace: true,
	        scope:true,
	        controller:['$scope', '$element', '$attrs',function($scope, $element, $attrs){
				$scope.getGeoLengthByType = function(type){
					type = type || "" ;
				  	var obj = {'A':'1','C':'3','N':'2','P':'3','S':'2','Z':'3'} ;
				    var len = eval("obj['"+type+"']") || 0;
					return len ;
				}
			}],
	        link: function(scope, element, attrs){
	            scope.$watch(attrs['geoMaxLength'], myWatchCallbackFunc);
	            function myWatchCallbackFunc (){
	                var geoMaxLength = attrs['geoMaxLength'] ;
	                var value  = scope.$eval(geoMaxLength) ;
					var len = scope.getGeoLengthByType(value) ;
					element.attr('maxLength',len) ;//设置长度
	            }
	        }
	    }
	  }) ;


	 //tui长度限制属性
	 directives.directive('tuiMaxLength',function(){
	    return {
	        restrict: 'AE',
	        replace: true,
	        scope: true, // 这个必须加上要不然会造成混乱
	        controller:['$scope', '$element', '$attrs',function($scope, $element, $attrs){
				//下面两个是内部工具函数
				$scope.strToJson = function(str){
	                var json = eval('(' + str + ')');
	                return json;
				}

				$scope.splitMaxLengtAttr =  function (tuiMaxLengthStr){
	                var obj = {} ;
	                var start1 = tuiMaxLengthStr.indexOf('{');
	                var end1 = tuiMaxLengthStr.indexOf('}');
	                var str1 = tuiMaxLengthStr.substr(start1,end1+1) ;
	                var start2 = tuiMaxLengthStr.indexOf('[') ;
	                var end2 = tuiMaxLengthStr.indexOf(']') ;
	                var str2 = tuiMaxLengthStr.substring(start2+1,end2) ;
	                obj.str1 = $scope.strToJson(str1);
	                obj.str2 = str2 ;
	                return obj ;
	            }
			}],
	        link: function(scope, element, attrs){
	            scope.$watch(attrs['tuiMaxLength'], myWatchCallbackFunc);
	            function myWatchCallbackFunc (){
	                var tuiMaxLength = attrs['tuiMaxLength'] ;
	                var info =  scope.splitMaxLengtAttr(tuiMaxLength) ;
	                var value2  = scope.$eval(info.str2) ;
	                var valueAttrStr = "info.str1['"+value2+"'] ";
	                var valueAtrr = eval(valueAttrStr) ;
					element.attr('maxLength',valueAtrr) ;//设置长度
	            }
	        }
	    }
	  }) ;



	directives.directive("upperInput",function(){
	    return{
	        restrict:'A',
	        require:'ngModel',
	        link:function(scope,element,attrs,ngModel){
	            if (!ngModel)
	                return; // do nothing if no ng-model
	            // Specify how UI should be updated
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
	 //178表格显示隐藏的链接指令
	 directives.directive('linkTable', function(){
          return {
	        restrict: 'AE',
	        replace: true,
			scope:{
				list:'=',
				geo:'=',
				status:'='
			},
			controller:['$scope',function($scope){
				//点击显示隐藏表格事件处理
				$scope.myClick = function(){
					$scope.geo.showFlag = !$scope.geo.showFlag ;
					if(!$scope.geo.showFlag){////点击取消自定义区域
						var len = $scope.list.length ;
						if($scope.status!='3'){
							//把数据清空
							outAllSelect() ;
							$scope.list.splice(0,len) ;
						}
					}
				}
				function outAllSelect(){//将所有tr全部置为非选中状态
					angular.forEach($scope.list,function(l){
						l.selected = false ;
					}) ;
				}
			}],
	        template: '<a href="javascript:void(0)"><span ng-show="!geo.showFlag">自定义区域</span><span ng-show="geo.showFlag">取消自定义</span></a>',
			link: function(scope, elem, attrs,ctrl) {
	            elem.bind('click', function() {
					scope.$apply(function(){
						scope.myClick() ;
					}) ;
					//var hideId = scope.hiddenInputId ;
					//$('#'+hideId).trigger('click') ;
	            });
	        }
	      };
      }) ;

	
		
	  //日期插件
	 directives.directive('datepicker',function(){
		return{
			restrict: 'A',
			scope: {},
			require:'ngModel',
			link: function (scope,elem,attr,ctrl) {
				if(!ctrl) return ;
				var minDateStr = attr['datepicker'] ;
				var minDate = new Date(minDateStr) ;
				//配置日期控件
		        var optionObj = {} ;
		        optionObj.dateFormat = "yy-mm-dd" ;
		        var updateModel = function(dateText){
		            scope.$apply(function  () {
		                //调用angular内部的工具更新双向绑定关系
		                ctrl.$setViewValue(dateText) ;
		            }) ;
		        }
	            optionObj.onSelect = function(dateText,picker){
	                updateModel(dateText) ;
	               // elem.focus() ;
	                validator.element(elem) ;
	                if(scope.select){
	                    scope.$apply(function  () {
	                        scope.select({date:dateText}) ;
	                    }) ;
	                }
	            }
	            optionObj.minDate = minDate ;
	            optionObj.showButtonPanel = true ;

	            ctrl.$render = function(){
	                //使用angular内部的 binding-specific 变量
	                elem.datepicker('setDate',ctrl.$viewValue || '') ;
	            }
				$(elem).datepicker(optionObj);
			}
		  };
		}) ;
		//时间插件
		directives.directive('timepicker',function(){
			return{
				restrict: 'A',
				scope: {},
				link: function (scope,elem,attr) {
					var timeVar = {
						controlType:'select',
						timeFormat: 'HHmm',
						timeOnly:  true,
						timeOnlyTitle: '选择时间',//Choose Time
						timeText: '时间',//Time
						hourText: '小时',//Hou
						minuteText: '分钟',//Minute
						currentText: '当前',//Current
						closeText: '关闭'//Close
					};
					$(elem).datetimepicker(timeVar);
				}
			};
		}) ;

		
		//重置数据
		var resetDataByFlag = function(nameList,flag,data,orgData){
		    if(!flag){//如果隐藏这需要重置数据
		        for(var i = 0 ; i < nameList.length ;i++){
		        	var curName = nameList[i] ;
		        	var orgValue = angular.copy(orgData[curName]) ;
		        	data[curName] = orgValue ;
		        }
		    }
		};

		var getFlagByServiceTypeAndServiceGroup = function (typeList, groupList,serviceType,serviceGroup) {
		    var flag = _.contains(typeList,serviceType) ;
		    if(flag&&groupList&&groupList.length>0){
		    	flag = _.contains(groupList, serviceGroup) ;
		    }
		    return flag ;
		};

		directives.directive('force',['FormStatusService','FormData',function(FormStatusService,FormData){
			return  {
				restrict:'A',
				scope:{orgData:'='},
				link: function (scope,elem,attrs) {//
					//@param : event 事件本身
					//@param ：needDigest ： 是否需要手动进行脏数据检查
					scope.$on('serviceTypeChangeNotice',function(event,needDigest){
						for(var fname in FormStatusService){
							var typeList = FormStatusService[fname]['typeList'] ;
							var groupList = FormStatusService[fname]['groupList'] ;
							var serviceType = FormData.serviceType;
							var serviceGroup = FormData.sel1.value ;
							var oldFlag = FormStatusService[fname]['showFlag'] ;
							var flag = getFlagByServiceTypeAndServiceGroup(typeList, groupList,serviceType,serviceGroup) ;
							//console.info(fname + ' -- ' + flag + '   , serviceType : ['+serviceType+'] , typeList ['+typeList+'] , groupList :['+groupList+']  , servcieGroup : ['+serviceGroup+'] ') ;
							if(oldFlag==!flag){//如果不同
								var nameList = FormStatusService[fname]['nameList'] ;
								resetDataByFlag(nameList,flag,FormData,scope.orgData) ;
								FormStatusService[fname]['showFlag']= flag;
								if(needDigest&&needDigest=='true'){
									scope.$digest() ;
								}
							}
						}
					}) ;
					// @param :event :自带的事件本身
					// @param :in_fname : 传入的forceName
					// @param :in_flag :传入的隐藏显示的falg----第一要传递字符串
					// @param :needDigest ：是否需要手动脏数据检查  第一要传递字符串
					scope.$on('singleChangeByFlagNotice', function (event,in_fname,in_flag,needDigest) {
						var fname = in_fname ;
						var newFlag = in_flag=='true'?true:false;
						var oldFlag = FormStatusService[fname]['showFlag'] ;
						console.info("fname : ["+fname+"] , newFlag : ["+newFlag+"] , oldFlag : ["+oldFlag+"] ") ;
						if(newFlag==!oldFlag){//当前显隐与将要的显隐相反时
							var nameList = FormStatusService[fname]['nameList'] ;
							resetDataByFlag(nameList,newFlag,FormData,scope.orgData) ;
							FormStatusService[fname]['showFlag']= newFlag;
							if(needDigest&&needDigest=='true'){
								scope.$digest() ;
							}
						}
					}) ;
				}
			} ;
		}]) ;


		//增强指令
		/*directives.directive('force',['FormStatusService','FormData',function(FormStatusService,FormData){
		    return  {
		        restrict:'E',//restrict
		        scope:{
					orgData:'='
		        },
				replace:true,
		        template:function(elem,attrs){
		        	var fname = attrs['fname'] ;
		        	var tmpStr = "showStatus."+fname+".showFlag" ;
		        	var html = '<div class="row row_from" ng-show= "'+tmpStr+'" ng-transclude=""></div>' ;
		        	return html ;
		        },
		        transclude:true,
		        controller:['$scope', '$element', '$attrs',function($scope, $element, $attrs){
		        	$scope.showStatus = FormStatusService ;
		        }] ,
		        link: function (scope,elem,attrs) {//
		        	//@param : event 事件本身
		        	//@param ：needDigest ： 是否需要手动进行脏数据检查
					scope.$on('serviceTypeChangeNotice',function(event,needDigest){
						var fname = attrs['fname'] ;
						var typeList = FormStatusService[fname]['typeList'] ;
						var groupList = FormStatusService[fname]['groupList'] ;
						var serviceType = FormData.serviceType;
						var serviceGroup = FormData.sel1.value ;
						var oldFlag = FormStatusService[fname]['showFlag'] ;
						var flag = getFlagByServiceTypeAndServiceGroup(typeList, groupList,serviceType,serviceGroup) ;
						//console.info(fname + ' -- ' + flag + '   , serviceType : ['+serviceType+'] , typeList ['+typeList+'] , groupList :['+groupList+']  , servcieGroup : ['+serviceGroup+'] ') ;
						if(oldFlag==!flag){//如果不同
							var nameList = FormStatusService[fname]['nameList'] ;
							resetDataByFlag(nameList,flag,FormData,scope.orgData) ;
						    FormStatusService[fname]['showFlag']= flag;
						    if(needDigest&&needDigest=='true'){
						    	scope.$digest() ;
						    }
						}
						
					}) ;
					 // @param :event :自带的事件本身
					 // @param :in_fname : 传入的forceName  
					 //@param :in_flag :传入的隐藏显示的falg----第一要传递字符串
					 // @param :needDigest ：是否需要手动脏数据检查  第一要传递字符串
					scope.$on('singleChangeByFlagNotice', function (event,in_fname,in_flag,needDigest) {
		                var fname = attrs['fname'] ;
		                var tmpFlag = in_flag=='true'?true:false;
		                if(fname==in_fname){//判断接受者是否为自己，如果为自己则需要相应的处理
		                   var oldFlag = FormStatusService[fname]['showFlag'] ;
		                   //console.info("fname : ["+fname+"] , tmpFlag : ["+tmpFlag+"] , oldFlag : ["+oldFlag+"] ") ;
		                   if(tmpFlag==!oldFlag){
		                   		var nameList = FormStatusService[fname]['nameList'] ;			
								resetDataByFlag(nameList,tmpFlag,FormData,scope.orgData) ;
							    FormStatusService[fname]['showFlag']= tmpFlag;
							    if(needDigest&&needDigest=='true'){
							    	scope.$digest() ;
							    }
		                   }
		                }
		            }) ;

		        }
		    } ;
		}]) ;*/
		

 }) ;
