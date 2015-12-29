$(document).ready(function() {
      $('select').niceSelect();      
     // FastClick.attach(document.body);
 });

var app = angular.module('app',[]) ;
app.controller('IndexController', ['$scope','$timeout', function ($scope,$timeout) {

	$scope.list1 = [
		{name:"选择",value:""},{name:"课程1",value:"1"},{name:"课程2",value:"2"},{name:"课程3",value:"3"},{name:"课程4",value:"4"}
	] ;
	$scope.status = "2" ;


	$scope.data = {
		descr:"2"
	} ;


	$scope.test = function  () {
		console.info('hello world .....') ;
		$scope.list1 = [{name:"课程1",value:"1"},{name:"课程2",value:"2"}] ;
		$timeout(function  () {
			$('select').niceSelect();   
		},1000) ;
		  
	}

}]) ;