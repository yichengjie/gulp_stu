define(function(require, exports, module) {
	var valid = require('./FormValid') ;
	var util = {} ;
	var _ = require('underscore') ;
	/**
	 * <pre>
	 * 	功能描述：将formData转化为vo
	 * </pre>
	 * @param {Object} formData
	 */
	util.convertFormData2Vo = function(formData){
		var vo = {} ;
		angular.extend(vo,formData) ;
		delete vo.action ;
		delete vo.contextPath ;
		for(var i = 0 ; i <vo.publishObjectList.length ; i ++ ){
			delete vo.publishObjectList[i].selected ;
		}
		return vo ;
	}
	/**
	 * <pre>
	 * 	功能描述:将vo转化转化为formData
	 * </pre>
	 * @param {Object} vo
	 * @param {Object} formData
	 */
	util.convertVo2FormData = function(vo,formData){
		for(var p in formData) {
			var flag =  vo.hasOwnProperty(p);
			if(flag){
				formData[p] = vo[p]  ;
			}
		}
	}
	
	util.validFormData = function(vo,error,status){
		var flag = true;
		if(!util.validInternationalTag(vo.internationalTag, error)){
			flag = false;
		}
		if(!util.validDataSource(vo.dataSource, error)){
			flag = false;
		}
		if(vo.dataSource==""){
			error.dataSource.flag = true ;
			flag = false;
		}
		if(!util.validEffDate(vo.effDate, error,status) ){
			flag =false;
		}
		if(vo.discDate==''){
			vo.discDate = '9999-12-31' ;
		}else{
			if(!util.validDiscDate(vo.effDate, vo.discDate, error)){
				flag = false;
			}
		}
		//校验部门代码list数据合法性
		if(!util.validPublisObjectList(vo.publishObjectList)){
			flag = false;
		}
		return flag ;
	}
	
	util.validPublisObjectList = function(list){
		var flag = true ;
		var tmpKeyList = [] ;
		if(list!=null&&list.length>0){
			for(var i=0; i<list.length;i++){
				var key = list[i].type+$.trim(list[i].code) ;
				tmpKeyList.push(key) ;
			}
		}
		var tmp = _.uniq(tmpKeyList) ;
		if(tmpKeyList.length>tmp.length){
			$.showTuiMessageDialog('请填写不同的部门代码！');
			flag = false;
		}
		return flag;
	}
	
	
	
	util.validDataSource = function(dataSource,error){
		var flag = false; 
		if(valid.strNotNull(dataSource)){
			error.dataSource.flag= false ;
			flag = true; 
		}else{
			error.dataSource.flag= true ;
			flag = false;
		}
		return flag ;
	}
	
	util.validInternationalTag = function(internationalTag,error){
		var flag = false;
		if(valid.strNotNull(internationalTag)){
			flag = true ;
			error.internationalTag.flag= false ;
		}else{
			error.internationalTag.flag= true ;
			flag = false;
		}
		return flag; 
	}
	
	util.validSequcenceNumber = function(sequcenceNumber,error,$http,contextPath,id,$q){
		var deferred = $q.defer();
		var promise = deferred.promise;
		//进行数据库校验
		if(valid.strNotNull(sequcenceNumber)){
			var url = contextPath+"/abr/checkSequcenceNumberNotExixt" ;
			$http.post(url,{"id":id,"sequcenceNumber":sequcenceNumber})
			.success(function(data){
				if(data.flag=='true'){
					if(data.existFlag=='true'){
						error['sequcenceNumber']['flag']=true;
						error['sequcenceNumber']['tip']='序列号已存在!' ;
						deferred.reject("序列号已存在!");
					}else{
						error['sequcenceNumber']['flag']=false;
						error['sequcenceNumber']['tip']='' ;	
						deferred.resolve("序列号不存在，可添加!") ;
					}
				}else{
					error['sequcenceNumber']['flag']=true;
					error['sequcenceNumber']['tip']='检查序列号重复出错!' ;
					deferred.reject("检查序列号重复出错!");
				}
				
			});
		}else{
			error['sequcenceNumber']['flag']=false;
			error['sequcenceNumber']['tip']='' ;	
			deferred.resolve("序列号为空,可添加!") ;
		}
		return promise; 
	}
	
	//校验生效日期
	util.validEffDate = function(effDate,error,status){
		var flag = false;
		if(status=='2'){
			flag = true 
			error['effDate']['flag']= false ;
			error['effDate']['tip']= '' ;
		}else{
			//生效日期必须大于当前日期
			var currDate = new Date();
			currDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
			var startDate = util.getDate(effDate) ;
			if(startDate < currDate){
				flag = false;
				error.effDate.tip ="生效日期必须大于当前日期。" ;
				error.effDate.flag = true ;
			}else{
				flag = true 
				error['effDate']['flag']= false ;
				error['effDate']['tip']= '' ;
			}
		}
		return flag ;
	}
	
	//校验截止日期
	util.validDiscDate = function(effDate,discDate,error){
		var flag = false;
		flag = valid.strNotNull(discDate) ;
		if(flag){//不为空//那就说明合法日期
			var startDate = util.getDate(effDate) ;
			var endDate = util.getDate(discDate);
			if(startDate > endDate){
				flag = false;
				error['discDate']['flag']= true ;
				error['discDate']['tip']= '截止日期必须大于等于生效日期。' ;
			}else{
				flag = true ;
				error['discDate']['flag']= false ;
				error['discDate']['tip']= '' ;
			}
		}else{//为空
			flag = true;
			error['discDate']['flag']= false ;
		}
		return flag ;
	}
	
	
	util.getDate = function (str) {
		var strs = str.split('-');
		var year = strs[0];
		var month = strs[1];
		var day = strs[2];
		return new Date(year, month-1, day);
	};
	
	return util ;
}) ;