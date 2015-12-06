//主要用来加载各个控制器（所有的控制器都将在这个文件中被加载）,除此之外再不用做其他，
//因为我们可以有很多个控制器文件，按照具体需要进行添加。
define(function(require, exports, module) {
	 //需要的插件
	 require("jqueryuitimepickeraddon") ;
	 require('./eidtController') ;
	 //头部
	 require("./headController") ;
	 //基本信息部分
	 require("./basicInfoController") ;
	 //第一块信息
	 require("./chargeConfirmController") ;
	 //第二块信息
	 require("./ruleDetailController") ;
});
