define(function(require, exports, module){ 
	var app = angular.module('app.filter',[]); 
	//过滤choose1
	app.filter("serviceGroupFilter", function() {
	    var myFunc = function(data,inputStr){
			inputStr = inputStr || "" ;
	        var retData = [] ;
	        if(inputStr.length>0){
				inputStr = inputStr.toLowerCase() ;
	            angular.forEach(data,function(e){
	                if(e.serviceGroupDescription.toLowerCase().indexOf(inputStr)!=-1){
	                    retData.push(e) ;
	                }
	            }) ;
	        }else{
	            retData = data ;
	        }
	        return retData ;
	    }
	    return myFunc ;
	});
	
	//subGroupDescription
	app.filter("subGroupFilter", function() {
	    var myFunc = function(data,inputStr){
			inputStr = inputStr || "" ;
	        var retData = [] ;
	        if(inputStr.length>0){
				inputStr = inputStr.toLowerCase() ;
	            angular.forEach(data,function(e){
	                if(e.subGroupDescription.toLowerCase().indexOf(inputStr)!=-1){
	                    retData.push(e) ;
	                }
	            }) ;
	        }else{
	            retData = data ;
	        }
	        return retData ;
	    }
	    return myFunc ;
	});
	//lastGroupList
	app.filter("lastGroupFilter", function() {
	    var myFunc = function(data,inputStr){
			inputStr = inputStr || "" ;
	        var retData = [] ;
	        if(inputStr.length>0){
				inputStr = inputStr.toLowerCase() ;
	            angular.forEach(data,function(e){
					var tmpStr = "["+e.serviceSubCode+"]"+e.commercialName ;
	                if(tmpStr.toLowerCase().indexOf(inputStr)!=-1){
	                    retData.push(e) ;
	                }
	            }) ;
	        }else{
	            retData = data ;
	        }
	        return retData ;
	    }
	    return myFunc ;
	});
	
}) ;