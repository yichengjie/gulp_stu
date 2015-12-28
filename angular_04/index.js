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
        descr:"info",
        language:''
    } ;

    $scope.languageList = [
        {"name":"所有选项","value":""},{"name":"html","value":"html"},
        {"name":"css","value":"css"},{"name":"javascript","value":"javascript"},
        {"name":"jQuery","value":"jquery"}
    ] ;
}) ;


app.directive('ocselect', [function () {
    return {
        restrict: 'E',
        replace:true,
        require:'?ngModel',
        template:function(){
            var str = 
            '<div class="select">'+
                '<p>所有选项</p>'+
                '<ul>'+
                    '<li data-value="所有选项" class="selected">所有选项</li>'+
                    '<li data-value="html">html</li>'+
                    '<li data-value="css">css</li>'+
                    '<li data-value="javascript">javascript</li>'+
                    '<li data-value="jQuery">jQuery</li>'+
                '</ul>'+
            '</div>';
            return str ;
        },
        link: function (scope, iElement, iAttrs) {
            
        }
    };
}])


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