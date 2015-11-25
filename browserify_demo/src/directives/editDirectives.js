var directives = require('./directives.js') ;


directives.directive('hello', [function () {
	return {
		restrict: 'E',
		replace:true,
		template:'<div> hello world ,this is my first angular custome directive </div>',
		link: function (scope, iElement, iAttrs) {
			
		}
	};
}])