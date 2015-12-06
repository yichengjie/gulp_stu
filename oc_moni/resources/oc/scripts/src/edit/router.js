define(function(require, exports, module) {
	//require("ui-router") ;
	require("./services/index") ;
	require("./directives/index") ;
	require("./controllers/index") ;
	require("./filters/filters") ;
	//把需要的模块全部加载到testApp中
	var app = angular.module('app',['pasvaz.bindonce','app.factory','app.controllers','app.directives','app.filter']);
	app.constant('NEW_ADD_STR', 'add');    //方法3定义全局变量
	app.constant('UPDATE_STR', 'update');    //方法3定义全局变量
	app.constant('DEFAULT_SERVICETYPE','F') ;//默认的serviceType
}) ;
