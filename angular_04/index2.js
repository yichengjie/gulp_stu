/**
 * Created by Administrator on 2015/11/14.
 */
$(function(){
   /* $('.select > p').on('click', function(e){
        $('.select').toggleClass('open');
        e.stopPropagation();
    });*/
    /*$('.select ul li').on('click', function(e){
        var _this = $(this);
        $('.select > p').text(_this.attr('data-value'));
        _this.addClass('selected').siblings().removeClass('selected');
        $('.select').removeClass('open');
        e.stopPropagation();
    });*/
    $(document).on('click', function(){
        $('.select').removeClass('open');
    });
});


var getSelectListNameByValue = function  (list,value) {
    var len = list.length ;
    return _.find(list,function  (obj) {
        return obj.value == value ;
    }) ;
} ;


var getNameByNgModel = function  (ngModelStr) {
    // body...
    var index = ngModelStr.indexOf('.') ;
    var name = ngModelStr.substr (index+1) ;
    return name ;
};


var app = angular.module('app',[]) ;
app.controller('IndexController', function ($scope,SelectTitleServcie) {
    $scope.data = {
        startDate:'2015-11-14',
        descr:"info",
        language:'css'
    } ;
    $scope.languageList = [] ;
   
   setTimeout(function  () {//模拟从后台取数据，延迟一段时间
        $scope.$apply(function  () {
       $scope.languageList = [
            {"name":"所有选项","value":""},{"name":"课程html","value":"html"},
            {"name":"课程css","value":"css"},{"name":"课程javascript","value":"javascript"},
            {"name":"课程jquery","value":"jquery"} ];
            var obj = getSelectListNameByValue($scope.languageList,$scope.data.language) ;
            SelectTitleServcie.language = obj.name ;
        }) ;
    },1000);
}) ;

app.factory('SelectTitleServcie', function(){
    return {
        "language":"选择"
    };
}) ;

app.directive('ocselect', ['SelectTitleServcie',function (SelectTitleServcie) {
    return {
        restrict: 'E',
        replace:true,
        scope:{
            name:'@',
            list:'=',
        },
        require:'?ngModel',
        template:function(elem,attrs){
            var ngModelStr = attrs['ngModel'] ;
            var name = getNameByNgModel(ngModelStr) ;
            var str = '<div class="select">'+
                '<p>{{titleObj.'+name+'}}</p>'+
                '<ul>'+
                    '<li ng-click ="clickLi($event)" ng-repeat="l in list" data-value="{{l.value}}">{{l.name}}</li>'
                '</ul>'+
            '</div>';
            return str ;
        },
        link: function (scope, iElement, iAttrs,ctrl) {
            var ngModelStr = iAttrs['ngModel'] ;
            var name = getNameByNgModel(ngModelStr) ;
            scope.titleObj = SelectTitleServcie ;
            var value = ctrl.$viewValue ;
            var obj =getSelectListNameByValue(scope.list,value) ; 
            if(obj){
                scope.titleObj[name] = obj['name'] ;
            }
            iElement.bind('click',function  (event) {
                event.stopPropagation();
                //var name = iAttrs['name'] ;
                var vv = ctrl.$viewValue;
                //当前应该被选中的li
                var curLi = iElement.find("li[data-value="+vv+"]") ;
                if(!curLi.hasClass('selected')){
                    curLi.addClass('selected') ;
                }
                if(iElement.hasClass('open')){
                    iElement.removeClass('open') ;
                }else{//如果之前是close
                     iElement.addClass('open') ;
                }
            }) ;
            scope.clickLi = function  (event) {
                //var name = iAttrs['name'] ;
                event.stopPropagation();
                var _this= $(event.target) ;
                //iElement.find('p').text(_this.html()) ;
                scope.titleObj[name] = _this.html() ;
                _this.addClass('selected').siblings().removeClass('selected');
                iElement.removeClass('open') ;
                var curValue = _this.attr('data-value') ;
                ctrl.$setViewValue(curValue) ;
            };
        }
    };
}]) ;


app.directive('tbinput', [function () {
    return {
        restrict: 'E',
        replace:true,
        template:'<div contentEditable ="true"></div>',
        require:'ngModel',
        link: function (scope, iElement, iAttrs,ctrl) {
            console.info(ctrl.$viewValue) ;
        }
    };
}]) ;

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