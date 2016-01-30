/**
 * Created by Administrator on 2016/1/30.
 */
var app = angular.module('app',[]) ;
app.factory("greeter", function ($window) {
    //这里是一个工厂方法，负责创建greet服务
    return {
        name:'greeter',
        greet:function (text) {
           /* $window.alert(text);*/
            return 'Hello ' + text ;
        }
    };
});
//1.从外部获取$injector
/// true说明$rootScope确实以服务的形式包含在模块的injector中
var injector = angular.injector(['app','ng']);
console.log("has $rootScope=" + injector.has("$rootScope"));//true

//2.controller中可以直接注入$injector
function IndexController($injector,$scope,$log,a){
    var vm = this ;
    vm.name = 'yicj' ;
    $log.info('IndexController start .....') ;
    $log.info(a.greet('yicj')) ;
    $log.info($injector.has('greeter')) ;
    $log.info($injector.get('greeter').greet('yicj2')) ;
}
IndexController.$inject = ['$injector','$scope','$log','greeter'] ;
app.controller('IndexController',IndexController) ;








