define(function(require, exports, module) {
	var util = {};
	util.getRbdTb198TmpStr = function(){
		return "rbd" ;//这个返回值一定要和页面上的相同，对应以前的bookSeat
	};
	util.getRbdUpgradeTb198TmpStr = function() {
		return "rbdUpgrade" ;//这个返回值一定要和页面上的相同//对应以前的seatProp
	};
	
	util.getCommonImgArr = function(){
		var arr = ['0B5', '0DG', '0B3', '0LO', '0LQ', '0LT', '0BO']  ;
		return arr ;
	}
	
	module.exports = util ;
});