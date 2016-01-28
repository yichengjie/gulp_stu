/**
 * Created by yicj on 2016/1/28.
 */
var app = angular.module('app',[]) ;

app.controller('IndexController', function ($scope,$parse) {
    var context = {
        name: "dreamapple"
    };

    $scope.data = context ;
    // 因为这个解析的语句中含有我们想要解析的表达式，
    // 所以要把不相关的用引号引起来，整体然后用+连接
    var expression = "name";
    var getter = $parse(expression);
    var setter = getter.assign;
    //false
    console.log(getter.literal);
    //false
    console.log(getter.constant);
    //undefined
    console.log(setter);
   // setter($scope,'new value') ;
    //hello
    console.log('-----------------> ' + getter());
    console.log('-----------------> ' + getter(context));
    //function (self, locals) {
    //  return fn(self, locals, left, right);
    // }
    console.log(getter);

    $scope.ParsedValue = getter(context);
}) ;


angular.element(document).ready(function () {
    angular.bootstrap(document,['app']);
}) ;