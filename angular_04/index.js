/**
 * Created by Administrator on 2015/11/14.
 */
$(function () {
    //$('#startTime').datepicker(); //绑定输入框
}) ;

var app = angular.module('app',[]) ;
app.controller('IndexController', function ($scope) {
    $scope.data = {
        startDate:'2015-11-14',
        descr:"info"
    } ;
}) ;



app.directive('tbinput', [function () {
    return {
        restrict: 'E',
        replace:true,
        template:'<div contentEditable ="true"></div>',
        require:'ngModel',
        link: function (scope, iElement, iAttrs,ctrl) {
            
        }
    };
}])

app.directive('datepicker', function () {
    return {
        restrict:'A',
        replace:true,
        scope:{},
        require:'?ngModel',
        link: function (scope,elem,attrs,ctrl) {
            elem.datepicker() ;

        }
    } ;
}) ;