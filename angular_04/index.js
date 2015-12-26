/**
 * Created by Administrator on 2015/11/14.
 */
$(function(){
    $('.select > p').on('click', function(e){
        $('.select').toggleClass('open');
        e.stopPropagation();
    });
    $('.select ul li').on('click', function(e){
        var _this = $(this);
        $('.select > p').text(_this.attr('data-value'));
        _this.addClass('selected').siblings().removeClass('selected');
        $('.select').removeClass('open');
        e.stopPropagation();
    });
    $(document).on('click', function(){
        $('.select').removeClass('open');
    });
});



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