/**
 * Created by yicj on 2016/1/14.
 */

var app = angular.module('app', ['oi.select']);


app.controller('IndexController',['$scope',function($scope){


    $scope.bundle = "001" ;

    $scope.shopArr = [
        {name:'yicj',value:'001'},{name:'yicj2',value:'002'},{name:'yicj3',value:'003'}
    ] ;

}]) ;