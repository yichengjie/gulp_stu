define(function(require, exports, module){ 
	 var directives = require("./directives") ;
	 var geoSpecInputHtml =  '<div class="helper_float_left single_edit_div">'+
							'   <label class="nostyle" ng-transclude="">'+
							'   </label>'+
							'</div>' ; 
	var geoSpecLocHtml = require("../../tpls/edit/geoSpecLoc.html") ;
	 
	 //区域部分input套一层壳
	 directives.directive('geoSpecInput', function() {
	    return {
	        restrict: 'E',
	        replace: true,
			scope:true,
	        template: geoSpecInputHtml,
			transclude:true
	    };
	 });
	 
}) ;