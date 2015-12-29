var myAppModule = angular.module('MyApp', ['ui.select2']);

myAppModule.controller('MyController', function($scope) {

	$scope.data = {
    	select2:"two"
    } ; 



	$scope.list_of_string = ['tag1', 'tag2']
    $scope.select2Options = {
        'multiple': true,
        'simple_tags': true,
        'tags': ['tag1', 'tag2', 'tag3', 'tag4']  // Can be empty list.
    };



    /*$scope.select2Options = {
        allowClear:true
    };

    

    setTimeout(function  () {
    	$scope.$apply(function  () {
    		$scope.data.select2 = "one" ;
    	}) ;
    },3000) ;

    $scope.test = function  () {
    	$scope.data.select2 = "three" ;
    }*/
});