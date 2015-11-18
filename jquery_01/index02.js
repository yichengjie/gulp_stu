$(function(){
    registPageValidate() ;
}) ;

var app = angular.module('app',['pasvaz.bindonce']) ;

//angular.element(document).ready(function() {
    //angular.bootstrap(document, ['app']);
    //angular加载完毕以后注册tui插件的校验
   // registPageValidate() ;
//});

app.controller('EditController',['$scope', function ($scope) {

    $scope.data = {
        serviceType:'M',
        name:'',
        email:'',
        list198:[
          {name:'yicj001',sex:'1',add:'henan'},
          {name:'cao002',sex:'1',add:'henan'},
          {name:'zhangsan',sex:'0',add:'beijing'},
        ]
    } ;
    $scope.orgData = angular.copy($scope.data) ;
    $scope.serviceTypeList = [
        {name:'服务类型M',value:'M'},
        {name:'服务类型F',value:'F'},
        {name:'服务类型T',value:'T'}
    ] ;
    //这个时候发送通知是不生效的，因为这时候页面还没有加载完毕，监听的部分还没有准备好，所以无法接收
    init4Add() ;
    function init4Add(){
        console.info('初始化新增页面数据。。。。。。') ;
        $scope.$broadcast('changeServiceTypeEvent',$scope.data.serviceType) ;
    }
    $scope.changeServiceType = function () {
        $scope.$broadcast('changeServiceTypeEvent',$scope.data.serviceType) ;
    }

    $scope.addLine = function(){
        var obj = {name:'',sex:'',add:''} ;
        $scope.data.list198.push(obj) ;
    }
    $scope.delLine = function  () {
        var len = $scope.data.list198.length ;
        if(len>0){
            $scope.data.list198.splice(len-1,1) ;
        }   
    }
}]) ;

var getOcshowFlag = function (ocshow,serviceType,ocname,data,orgData) {
    //console.info("ocshow : ["+ocshow+"] , serviceType : ["+serviceType+"] ") ;
    var flag = true ;
    var ocArr = [] ;
    if(ocshow&&ocshow.length>0&&ocshow!='all'){
        ocArr = ocshow.split(',') ;
    }
    for(var i = 0 ; i < ocArr.length ; i ++){
        flag = _.contains(ocArr,serviceType) ;
    }
    if(!flag){
        //console.info(orgData) ;
        var orgValue = angular.copy(orgData[ocname]) ;
        /*if($.isArray(orgValue)){
            data[ocname] = [] ;
        }else{
            data[ocname] = orgValue ;
        }*/
        data[ocname] = orgValue ;
    }
    return flag ;
}


var htmlStr =   '<div class="row myinputrow" ng-show="showFlag">' +
    '<label bindonce class="col-sm-2 control-label" bo-bind="title"></label>' +
    '<div class="col-sm-10" ng-transclude="">' +
    '</div>' +
    '</div>'  ;

app.directive('force', function () {
    return {
        restrict:'E',
        replace:true,
        scope:{
            title:'@',
            data:'=',
            orgData:'='
        },
        template: htmlStr,
        transclude:true,
        controller: function ($scope, $element, $attrs, $transclude) {
            $scope.showFlag = true ;
        },
        compile: function (element, attributes) {
            return {
                pre: function preLink(scope, element, attributes) {
                    // console.info('force 指令 preLink ..') ;
                },
                post: function postLink(scope, elem, attrs) {
                    //console.info('force 指令 postLink ...') ;
                    var ocshow = attrs['ocshow'] ;
                    var ocname =attrs['ocname'];
                    scope.$on('changeServiceTypeEvent', function (event,servieType) {
                        var flag = getOcshowFlag(ocshow,servieType,ocname,scope.data,scope.orgData) ;
                        //console.info('serviceType : ' + servieType + " ,  flag : " + flag) ;
                        scope.showFlag = flag ;
                    }) ;
                }
            };
        }
    } ;
}) ;



/***下面的这部分是jquery valid事件的注册.............***/
var registPageValidate = function () {
    var validator = $("#signupForm").validate({
        meta : "validate",
        submitHandler:function(form){
            alert('提交表单') ;
            //form.submit();
        }
        //,onsubmit:false//Onubmit：类型 Boolean，默认 true，指定是否提交时验证
        ,ignore:".ignore"
    });

    $("#reset").bind("click", function(e){
        console.info('重置表单') ;
        var target = $(e.target);
        if(target.is(':reset')){
            console.info('我是reset') ;
        }else if (target.is(':button')){
            console.info('我是button') ;
        }else if(target.is(':input')){
            console.info('我是input') ;
        }else{
            console.info('我是other') ;
        }
        //把前面验证的 FORM 恢复到验证前原来的状态。
        validator.resetForm() ;
    });

    $("#valid2").bind("click",function (e) {
        console.info('手动校验表单') ;
        //直接用来校验表单 同 下面的  validator.form()函数
        var flag = $("#signupForm").valid() ;
        console.info(flag) ;
        //返回元素的校验规则
        //var rules = $("#email").rules() ;
        //console.info(rules) ;
        //验证表单是否校验通过
        //var flag2 = validator.form() ;
        //console.info(flag2) ;
        //验证单个元素成功或失败
        //var flag3 = validator.element($("#email")) ;
        //console.info(flag3) ;
        //把前面验证的 FORM 恢复到验证前原来的状态。
        //validator.resetForm() ;
    })  ;

}
