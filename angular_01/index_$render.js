/**
 * Created by yicj on 2016/1/28.
 */

var app = angular.module('app',[]) ;

app.controller('IndexController', function ($scope,$timeout,$parse) {

    var context = {
        name:'yicj'
    } ;

    $scope.data = context ;


    //模拟一个从后台获取数据的例子
    var timer = $timeout(function () {
        console.info('从后台返回mode 的数据.....') ;
        $scope.data.name = "张三" ;
    },2000);


    timer.then(function () {
        console.info('Timer resoleved!',Date.now()) ;
    }, function () {
        console.info('Timer rejected!',Date.now()) ;
    }) ;


    //当Dom元素从页面上被移除时,angularjs 会在scope上触发$destory事件,
    //这让我们可以有机会来cancel任何潜在的定时器
    $scope.$on('$destory', function (event) {
        $timeout.cancel(timer) ;
    }) ;


}) ;


app.directive('customeEditDiv', function () {
    return{
        restrict:'E',
        replace:true,
        scope:true,
        require:'ngModel',
        template:'<div contenteditable="true" class="cinput"></div>',
        link:function(scope,elem,attrs,ctrl){
            console.info('hello world') ;
            //model --> view
            ctrl.$render = function () {
               console.info('将model的数据更新到视图上....') ;
               elem.html(ctrl.$viewValue) ;
            }
            //当用户与控制器进行交互的时候。ngModelController中的$setViewValue（）方法就会被调用,
            //$parsers的数组中函数就会以流水线的形式被一一调用
            //首先$parsers是view 到 model的一个过度，因此当Model不希望有所更新的时候就返回一个undefined。
            //即 view--->model的一个过度阶段
            //$parsers通常配合指令来用。当ngModelController中的$setViewValue()方法时。会逐个调用$parser.
            ctrl.$parsers.unshift(function(viewValue){
                console.info('[viewValue:'+viewValue+']') ;
                return viewValue ;
            }) ;
            //当绑定的ngModel值发生了变化，并经过$parsers数组中解析器的处理后，这个值会被传递给$formatters流水线
            ctrl.$formatters.push(function (modelValue) {
                console.info('xxxxxxxxxxxxxx') ;
                return modelValue ;
            }) ;

            //view ---> model
            elem.bind('keyup', function (event) {
                var inputStr = elem.html() ;
                ctrl.$setViewValue(inputStr) ;
            }) ;
        }
    } ;
}) ;


    //$parsers通常配合指令来用。当ngModelController中的$setViewValue()方法时。会逐个调用$parser.
   //demo：
   app.directive('oneToTen', function() {
       return {
           require: '?ngModel',
           link: function (scope, ele, attrs, ngModel) {
               if (!ngModel) return;
               ngModel.$parsers.unshift(
                   function (viewValue) {
                       var i = parseInt(viewValue);
                       if (i >= 0 && i < 10) {
                           ngModel.$setValidity('oneToTen', true);
                           return viewValue;
                       } else {
                           ngModel.$setValidity('oneToTen', false);
                           return undefined;
                       }
                   }) ;
           }

       };
   });


//$formatters
//当绑定的ngModel值发生了变化，并经过$parsers数组中解析器的处理后，这个值会被传递给$formatters流水线
//Demo
app.directive('oneToTen', function() {
    return {
        require: '?ngModel',
        link: function(scope, ele, attrs, ngModel) {
            if (!ngModel) return;
            ngModel.$formatters.unshift(function(v) {
                return $filter('number')(v);
            });
        }
    };
});



