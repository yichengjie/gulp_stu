var controllers = require('./controllers.js') ;
//var $ = jQuery = require('jquery');
require('tui-core') ;
require('tui-drag') ;
require('tui-dialog');

controllers.controller('EditController', ['$scope','FormData' ,function ($scope,FormData) {
	$scope.data = FormData ;
	//util1.hello() ;
	//var str = "  ,, hello c    " ;
	//console.info($.trim(str)) ;
	console.info('hello world hello world.....................') ;
	$.showTuiErrorDialog('必须选择到最后一级！');
}]) ;