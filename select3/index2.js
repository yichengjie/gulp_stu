/**
 * Created by yicj on 2016/1/14.
 */
var app = angular.module("app",[]) ;
function OcUtil (){

}

OcUtil.getSelectTitleByValue = function (list,value) {
    var obj = _.find(list, function (item) {
        return item.value ==value ;
    }) ;
    var title = '选择' ;
    if(obj&&obj.name){
        title =  obj.name ;
    }
    return  title;
}

OcUtil.updateSelectViewValue = function () {

}

app.controller("IndexController",["$scope", function ($scope) {
    console.info("hello am im IndexController ") ;
    $scope.list = [{name:'选择',value:''},{name:'yicj',value:'001'},{name:'yangzhan',value:'002'},{name:'wangtao',value:'003'}] ;
    $scope.data ={
        user:'002'
    } ;
}]) ;

app.directive('hello',function(){
    return{
        restrict:'E',
        replace:true,
        require:'ngModel',
        template:'<div name="select" class="alert alert-success" role="alert">选择</div>',
        scope:{list:'='},
        link: function (scope, elem, attr,ctrl) {
            ctrl.$render = function () {
                var value = ctrl.$viewValue ;
                var title = OcUtil.getSelectTitleByValue(scope.list,value) ;
                elem.html(title);
            }
            console.info('hello am in hello directive....') ;
        }
    }
}) ;


app.directive('ocSelect',function(){
    return{
        restrict:'E',
        replace:true,
        scope:{list:'='},
        require:'ngModel',
        templateUrl:'tpls/select.html',
        link: function (scope, elem, attr,ctrl) {
            ctrl.$render = function () {
                var value = ctrl.$viewValue ;
                var title = OcUtil.getSelectTitleByValue(scope.list,value) ;
                elem.find('p').text(title);
            }
            elem.find('p').bind('click', function (e) {
                elem.toggleClass('open');
                var pStr = elem.find('p').text() ;
                elem.find("li").each(function () {
                    var str = $(this).html() ;
                    if(str==pStr){
                        $(this).addClass("selected") ;
                    }
                }) ;
                e.stopPropagation();
                //将li添加事件处理函数
                elem.find("li").one('click', function (e) {
                    var _this = $(this);
                    var value = _this.attr('data-value') ;
                    _this.addClass('selected').siblings().removeClass('selected');
                    elem.removeClass('open');
                    ctrl.$setViewValue(value) ;
                    elem.find("p").text(_this.text())
                    e.stopPropagation();
                    elem.find("li").unbind('click') ;
                }) ;
            }) ;

        }
    }
}) ;