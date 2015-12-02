/*$(function(){
    registPageValidate() ;
}) ;*/

var app = angular.module('app',['pasvaz.bindonce']) ;

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
    //angular加载完毕以后注册tui插件的校验
    registPageValidate() ;
});

var inputJsonData ={
    serviceType:[],
    serviceGroup:[],
    name:[],
    email:[],
    startDate:[],
    list198:[],
    upgradeToCabin:[]
} ;

app.factory('FormEditFlag', [ function(){
    return {
        serviceType:true,
        serviceGroup:true,
        name:true,
        email:true,
        startDate:true,
        list198:true,
        upgradeToCabin:true
    };
}]) ;

app.factory('FormShowFlag', [ function(){
    return {
        serviceType:true,
        serviceGroup:true,
        name:true,
        email:true,
        startDate:true,
        list198:true,
        upgradeToCabin:true
    };
}]) ;







app.controller('EditController',['$scope', function ($scope) {
    $scope.data = {
        serviceType:'M',
        serviceGroup:'',
        name:'',
        email:'',
        startDate:'',
        list198:[
          {name:'yicj001',sex:'1',add:'henan'},
          {name:'cao002',sex:'1',add:'henan'},
          {name:'zhangsan',sex:'0',add:'beijing'},
        ],
        upgradeToCabin:""
    } ;
    $scope.orgData = angular.copy($scope.data) ;
    $scope.serviceTypeList = [
        {name:'服务类型M',value:'M'},
        {name:'服务类型F',value:'F'},
        {name:'服务类型T',value:'T'}
    ] ;

    $scope.serviceGroupList = [
      {name:'选择',value:''},
      {name:'BDUP',value:'BDUP'},
      {name:'UP',value:'UP'}
    ] ;

    $scope.cabinList =[
      {"name":"R-豪华头等舱","value":"R"},{"name":"F-头等舱","value":"F"},
      {"name":"J-豪华商务舱","value":"J"},{"name":"C-商务舱","value":"C"},
      {"name":"P-豪华经济舱","value":"P"},{"name":"Y-经济舱","value":"Y"}
    ] ;


    $scope.saveData = function(){
        console.info($scope.data) ;
    }



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

var getOcshowFlag = function (ocshow,ocgroup,serviceType,ocname,data,orgData) {
    //console.info("ocshow : ["+ocshow+"] , serviceType : ["+serviceType+"] ") ;
    var flag = true ;
    var ocArr = [] ;
    var groupArr = [] ;
    if(ocshow&&ocshow.length>0&&ocshow!='all'){
        ocArr = ocshow.split(',') ;
    }
    if(ocgroup&&ocgroup.length>0){
      groupArr = ocgroup.split(',') ;
    }
    for(var i = 0 ; i < ocArr.length ; i ++){
        flag = _.contains(ocArr,serviceType) ;
    }
    if(flag){
      var serviceGroup = data.serviceGroup ;
      flag = _.contains(groupArr,serviceGroup) ;
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
    '<div class="col-sm-10" name="content" ng-transclude="">' +

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
        template: function($scope, $element, $attrs){
            //$element.find("[name=content]").append('hello wolr')  ;
            //$($element).find("div[name=content]").append('hello') ;
            return htmlStr ;
        },
        transclude:true,
        controller: function ($scope, $element, $attrs, $transclude) {
            $scope.showFlag = true ;
            $transclude(function (clone) {
               /* var a = angular.element('<a>');
                a.attr('href', $attrs.value);
                a.text(clone.text());
                $element.append(a);*/
                //clone.attr('ng-disable') ;
                //var cc = $element.find("[name=content]").attr('class')  ;
                //console.info(cc) ;
                //console.log(" ["+clone.text()+"]") ;
            });
            $scope.forceDisableFlag = false ;
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
                    var ocgroup = attrs['ocgroup'] ;
                    scope.$on('changeServiceTypeEvent', function (event,servieType) {
                        var flag = getOcshowFlag(ocshow,ocgroup,servieType,ocname,scope.data,scope.orgData) ;
                        //console.info('serviceType : ' + servieType + " ,  flag : " + flag) ;
                        scope.showFlag = flag ;
                    }) ;
                }
            };
        }
    } ;
}) ;


app.directive('datepicker', function () {
    return {
        restrict:'A',
        replace:true,
        scope:{},
        require:'?ngModel',
        link: function (scope,elem,attrs,ctrl) {
            if(!ctrl) return ;
            //配置日期控件
            var optionObj = {} ;
            optionObj.dateFormat = "yy-mm-dd" ;
            var updateModel = function(dateText){
                scope.$apply(function  () {
                    //调用angular内部的工具更新双向绑定关系
                    ctrl.$setViewValue(dateText) ;
                }) ;
            }

            optionObj.onSelect = function(dateText,picker){
                console.info('xxxxxxxxxxxxx') ;
                updateModel(dateText) ;
               // elem.focus() ;
                validator.element(elem) ;
                if(scope.select){
                    scope.$apply(function  () {
                        scope.select({date:dateText}) ;
                    }) ;
                }
            }

            ctrl.$render = function(){
                //使用angular内部的 binding-specific 变量
                elem.datepicker('setDate',ctrl.$viewValue || '') ;
            }

            elem.datepicker(optionObj) ;
        }
    } ;
}) ;


/***下面的这部分是jquery valid事件的注册.............***/
var registPageValidate = function () {
    var validator = $("#signupForm").validate({
        meta : "",
        submitHandler:function(form){
            alert('提交表单') ;
            //form.submit();

        }
        //,onsubmit:false//Onubmit：类型 Boolean，默认 true，指定是否提交时验证
        ,ignore:".ignore"
    });
    //将validate保存起来
    window.validator = validator ;

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
        //var flag = $("#signupForm").valid() ;//要想这样写，上面必须的把$("#signupForm").validate(的{meta : "validate",//否则会报错
        var flag = validator.form() ;
        console.info("flag : " + flag) ;
        var element = angular.element($("#EditControllerDiv"));
        var scope = element.scope();
        scope.saveData() ;

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
