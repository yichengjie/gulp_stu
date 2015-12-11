/*$(function(){
 registPageValidate() ;
 }) ;*/

var app = angular.module('app',['pasvaz.bindonce']) ;

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
    //angular加载完毕以后注册tui插件的校验
    registPageValidate() ;
    //整个页面加载完毕后发送一次通知

});

//每个空间对应那种服务类型要显示

app.factory('InputServiceTypeService', [ function(){
    return {
        name:['F','M'],
        email:['F'],
        startDate:['F','M'],
        upgradeToCabin:['F'],
        xxx:['F','T'],
        list198:['F']
    };
}]) ;


app.factory('FormEditFlagService', [ function(){
    return {
        name:true,
        email:true,
        startDate:true,
        upgradeToCabin:true,
        xxx:true,
        list198:true
    };
}]) ;

app.factory('FormShowFlagService', [ function(){
    return {
        name:true,
        email:true,
        startDate:true,
        upgradeToCabin:true,
        xxx:true,
        list198:true
    };
}]) ;



app.controller('EditController',['$scope','$rootScope','FormShowFlagService', 'FormEditFlagService',function ($scope,$rootScope,FormShowFlagService,FormEditFlagService) {
    $scope.data = {
        serviceType:'M',
        serviceGroup:'',
        name:'',
        email:'',
        startDate:'',
        xxx:'',
        list198:[
            {name:'yicj001',sex:'1',add:'henan'},
            {name:'cao002',sex:'1',add:'henan'},
            {name:'zhangsan',sex:'0',add:'beijing'}
        ],
        upgradeToCabin:""
    } ;
    $scope.orgData = angular.copy($scope.data) ;
    $scope.formShow = FormShowFlagService ;
    $scope.formEdit = FormEditFlagService ;


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


    init4Add() ;



    function init4Add(){
        console.info('初始化新增页面数据。。4444。。。。') ;
        //注意这个注释：这个时候发送通知是不生效的，因为这时候页面还没有加载完毕，监听的部分还没有准备好，所以无法接收
        // $scope.$broadcast('changeServiceTypeEvent',$scope.data.serviceType) ;

    }


    //改变serviceType的事件处理函数
    $scope.changeServiceType = function () {
        $scope.$broadcast('changeServiceTypeEvent',$scope.data.serviceType) ;
        //当选择servcieType的时候也需要发送一次对升舱的显示隐藏通知
        var in_fname = "upgradeToCabin" ;
        var in_flag = true ;
        var serviceType = $scope.data.serviceType  ;
        var serviceGroup = $scope.data.serviceGroup ;
        if(serviceType=='F'&&serviceGroup=='BDUP'){
            in_flag = true ;
        }else{
            in_flag = false;
        }
        $rootScope.$broadcast('changeSingleEvent',in_flag,in_fname) ;
        //当serviceType==‘F’是xxx字段必须为0BJ
        if(serviceType=='F'){
            $scope.formEdit.xxx = false;//如果为false则不让编辑
            $scope.data.xxx = '0BJ' ;
        }else{
            $scope.formEdit.xxx = true;
        }
    }



    //改变serviceGroup的事件处理函数
    $scope.changeServiceGroup = function(){
        var in_fname = "upgradeToCabin" ;
        var in_flag = true ;
        var serviceType = $scope.data.serviceType  ;
        var serviceGroup = $scope.data.serviceGroup ;
        if(serviceType=='F'&&serviceGroup=='BDUP'){
            in_flag = true ;
        }else{
            in_flag = false;
        }
        $rootScope.$broadcast('changeSingleEvent',in_flag,in_fname) ;
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


app.directive('force',['FormShowFlagService','InputServiceTypeService', function (FormShowFlagService,InputServiceTypeService) {
    return {
        restrict:'E',
        replace:true,
        scope:{
            title:'@',
            data:'=',
            orgData:'='
        },
        template: function(elem,attrs){
            var fname = attrs['fname'] ;
            var tmpStr = "showData."+fname ;
            var htmlStr =   '<div class="row myinputrow" ng-show="'+tmpStr+'">' +
                '<label bindonce class="col-sm-2 control-label" bo-bind="title"></label>' +
                '<div class="col-sm-10" name="content" ng-transclude="">' +
                '</div>' +
                '</div>'  ;
            return htmlStr ;
        },
        transclude:true,
        controller: function ($scope, $element, $attrs) {
            $scope.showData = FormShowFlagService ;
        },
        link: function (scope,elem,attrs) {
            scope.$on('changeServiceTypeEvent', function (event,in_servieType) {
                //如果serviceType为空的话不做任何操作
                if(in_servieType&&in_servieType.trim().length>0){
                    //console.info('接受到servcieType change 的通知......' + in_servieType) ;
                    var fname = attrs['fname'] ;
                    var ocname = attrs['ocname'] ;
                    var arr = InputServiceTypeService[fname] ;
                    //1.处理显示隐藏问题
                    var flag = getFlagByServcieType(arr,in_servieType) ;
                    console.info("serviceType : ["+in_servieType+"] ,  flag : ["+flag+"]  ,  fname : ["+fname+"] , arr : ["+arr+"] ") ;
                    resetDataByFlag(ocname,flag,scope.data,scope.orgData) ;
                    scope.showData[fname] = flag;
                }
            }) ;

            scope.$on('changeSingleEvent', function (event,in_flag,in_fname) {
                console.info('force 接受到 changeSingleEvent 通知 .... inflag :　['+in_flag+']  in_fname : ['+in_fname+']') ;
                var fname = attrs['fname'] ;
                if(fname==in_fname){//判断接受者是否为自己，如果为自己则需要相应的处理
                    var ocname = attrs['ocname'] ;
                    resetDataByFlag(ocname,in_flag,scope.data,scope.orgData) ;
                    scope.showData[fname] = in_flag;
                }
            }) ;
        }
    } ;
}]) ;

//重置数据
var resetDataByFlag = function(ocname,flag,data,orgData){
    if(!flag){//如果隐藏这需要重置数据
        console.info('我将要把数据置空 ...') ;
        // 将数据置空
        var orgValue = angular.copy(orgData[ocname]) ;
        console.info('原始数据 ： '+orgValue ) ;
        data[ocname] = orgValue ;
    }
}

var getFlagByServcieType = function (arr, serviceType) {
    var flag = _.contains(arr,serviceType) ;
    return flag ;
}


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
    //获取到angular 的scope
    var element = angular.element($("#EditControllerDiv"));
    var scope = element.scope();
    $("#valid2").bind("click",function (e) {
        console.info('手动校验表单') ;
        var flag = validator.form() ;
        console.info("flag : " + flag) ;
        scope.saveData() ;
    })  ;
    //当整个页面加载完毕后发送一次serviceTypeChange的通知，因为有时候servcieType会有默认值
    scope.$apply(function(){
        scope.$broadcast('changeServiceTypeEvent',scope.data.serviceType) ;
    }) ;
}
