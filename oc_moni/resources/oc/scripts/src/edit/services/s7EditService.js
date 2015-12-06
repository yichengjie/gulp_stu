define(function(require, exports, module){ 
	var app = require('./services') ;
	// $q 是内置服务，所以可以直接使用  
	app.factory('S7EditService', ['$http', '$q', function ($http, $q) {  
	  return {  
		    getDataByUrl : function(url) {  
		      var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
		      $http({method: 'GET', url: url}).  
		      success(function(data, status, headers, config) {  
		        deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了  
		      }).  
		      error(function(data, status, headers, config) {  
		        deferred.reject(data);   // 声明执行失败，即服务器返回错误  
		      });  
		      return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
		    },
		    postDate:function(url,queryParam){
		    	var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
		        $http({method: 'POST', url: url,data:queryParam}).  
		        success(function(data, status, headers, config) {  
		           deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了  
		        }).  
		        error(function(data, status, headers, config) {  
		           deferred.reject(data);   // 声明执行失败，即服务器返回错误  
		        });  
		      	return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
		    }
		}
	}]);  

}) ;