/**
 * Created by mjn on 2015/11/13.
 */
var app = angular.module('app',[]) ;

app.controller('IndexController', function ($scope) {

    $scope.click1 = function(){
        var serviceType ='F' ;
        $scope.$broadcast('serviceTypeChangeEvent',serviceType);
    }

    
}) ;

app.controller('HelloController', function ($scope) {

    $scope.$on('serviceTypeChangeEvent', function (event, data) {
        console.info("我是 HelloController ：" +data) ;
    }) ;
}) ;

app.controller('TTController',function($scope){
    $scope.$on('serviceTypeChangeEvent', function (event, data) {
        console.info("我是 TTController : " + data) ;
    }) ;
}) ;


app.directive('hello', function () {
    return {
        restrict:'E',
        replace:true,
        template:'<div>hello world</div>',
        link:function(scope,elem,attrs){
            scope.$on('serviceTypeChangeEvent', function (event,data) {
                console.info("我是自定义指令 hello : " + data) ;
            }) ;
        }
    } ;
}) ;

app.directive('hello2', function () {
    return {
        restrict:'E',
        scope:{

        },
        replace:true,
        template:'<div>hello world</div>',
        link:function(scope,elem,attrs){
            scope.$on('serviceTypeChangeEvent', function (event,data) {
                console.info("我是自定义指令 hello2 : " + data) ;
            }) ;
        }
    } ;
}) ;
