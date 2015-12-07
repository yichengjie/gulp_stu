define(function (require, exports, module) {
	var commonUtil = require('./commonUtil') ;
	var _ = require('underscore') ;
	var jsonDataHelper = require('../data/jsonDataHelper') ;

	module.exports = {
		changeServiceType:function(editScope,data,globalEditStatus){
			var serviceType = data.serviceType ;//serviceType
			//如果是免费则将下面的费用变为不可选择
			if(serviceType=='A'){
				data.noChargeNotAvailable = 'F' ;//设置为免费
			}else if (serviceType=='B'){
				data.noChargeNotAvailable = 'F' ;//设置为免费
			}else if (serviceType=='C'||serviceType=='P'){
				data.noChargeNotAvailable = '' ;//设置为收费
			}else if (serviceType=='E'){
				data.noChargeNotAvailable = 'X' ;//设置为收费
			}
			if(serviceType=='C'||serviceType=='P'){//收费一定为收费且不可编辑
				globalEditStatus.noChargeNotAvailable= false;
			}else{//可编辑
				globalEditStatus.noChargeNotAvailable= true;
			}
			//将是否检查库存设置为 ‘否’
			if(serviceType=='A'||serviceType=='B'||serviceType=='E'){
				data.availability = 'N' ;
				globalEditStatus.availability= false;
			}else{
				globalEditStatus.availability= true;
			}
			//免费/收费
			editScope.noChargeNotAvailableList.list= jsonDataHelper.getNoChargeNotAvailableList(serviceType) ;
			//适用于
			editScope.specifiedServiceFeeAppList.list = jsonDataHelper.getSpecifiedServiceFeeAppList(serviceType) ;
			//发送广播隐藏或显示组件
			editScope.$broadcast('serviceTypeChangeNotice','false') ;//scope.$broadcast('serviceTypeChangeNotice') ;	
		},
		changeNoChargeNotAvailable:function(editScope,data,globalEditStatus){/**当改变是否收费的时候*/
			var serviceType = data.serviceType ;
			var noChargeNotAvailable = data.noChargeNotAvailable ;
			//console.info('serviceType : ' + serviceType) ;
			//服务类型是不是行李附加服务
			var isBaggageFlag = commonUtil.checkBaggageServcie(serviceType) ;
			var in_flag = true ;
			if(isBaggageFlag){//如果为空表收费
				if(noChargeNotAvailable==''){//如果不为收费这下面的置空
					in_flag = true ;
				}else{//免费的时候需要清空填写的信息
					in_flag = false;//隐藏 适用于，里程，金额
				}
			}else{//一般附加服务
				var arr = ['X','E','F','G','H'] ;//dxef
				var flag2 = _.contains(arr, noChargeNotAvailable) ;	
				if(flag2){
					in_flag = false ;//隐藏
				}else{//如果为空表收费
					in_flag = true ;
				}
			}
			
			//var specifiedServiceFeeApp_specialFlag = true;
			//当收费类型为D/X/F/E时暂时不做区分是否为行李或则一般附加服务，这里全部都将适用于置为空
			//这个地方可能还存在一店暂时先把为d时适用于全部置空
			//specifiedServiceFeeApp_specialFlag = false ;//如果不为d，则进入其他的校验，按照其他的进行

			//当是否收费为D时  --行李适用范围必须为空
			if(noChargeNotAvailable=='D'){
				data.baggageTravelApplication = '' ;
				globalEditStatus.baggageTravelApplication = false;
			}else{
				globalEditStatus.baggageTravelApplication = true;
			}
			var freeBaggageAllowancePiecesFlag = true ;
			//当是否收费为D/O时行李件数必修为空,行李类型必须为A,行李子代码必须为0DF
			if(serviceType=='A'){
				if(noChargeNotAvailable=='D'||noChargeNotAvailable=='O'){
					freeBaggageAllowancePiecesFlag = false ;
				}
			}
			editScope.$broadcast('singleChangeByFlagNotice','freeBaggageAllowancePieces',freeBaggageAllowancePiecesFlag+'','false') ;//行李件数置为空
			editScope.$broadcast('singleChangeByFlagNotice','list170VOAndlist201VO',in_flag+'','false') ;//费用//in_fname,in_flag,needDigest
			editScope.$broadcast('singleChangeByFlagNotice','specifiedServiceFeeMileage',in_flag+'','false') ;//里程
			editScope.$broadcast('singleChangeByFlagNotice','specifiedServiceFeeApp',in_flag+'','false') ;//适用于
		},
		changeSpecifiedServiceFeeApp:function(editScope,data){/**当改变适用于的时候*/
			var ssfa = data.specifiedServiceFeeApp ;
			var in_flag = true ;
			//因为只有行李服务适用于才会有[H,C,P]，所以这里不需要判断serviceType是否为C，P
			if(ssfa=='H'||ssfa=='C'||ssfa=='P'){
				//收费字段必须为空，并且170或201必须为空
				//$scope.data.noChargeNotAvailable = '' ;//因为 当serviceType为cp是收费字段一定为空
				in_flag = false;
			}
			//console.info('serviceType : ['+serviceType+'] , ssfa : ['+ssfa+']  , in_flag : ['+in_flag+']' ) ;
			//$scope.FormEditStatusServcie.noChargeNotAvailable =in_flag;
			//170，201显示或隐藏
			editScope.$broadcast('singleChangeByFlagNotice','list170VOAndlist201VO',in_flag+'','false') ;
		}
	} ;

}) ;