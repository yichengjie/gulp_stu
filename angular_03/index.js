/**
 * Created by Administrator on 2015/11/14.
 */
var app = angular.module('app',[]) ;
var getOcshowFlag = function (ocshow,serviceType) {
    console.info("ocshow : ["+ocshow+"] , serviceType : ["+serviceType+"] ") ;
    var flag = true ;
    var ocArr = [] ;
    if(ocshow&&ocshow.length>0&&ocshow!='all'){
        ocArr = ocshow.split(',') ;
    }
    for(var i = 0 ; i < ocArr.length ; i ++){
        flag = _.contains(ocArr,serviceType) ;
    }
    return flag ;
}

app.controller('IndexController', function ($scope) {

    $scope.data = {
        name:'yicj',
        serviceType:''
    } ;
    $scope.serviceTypeList = [
        {name:'服务类型M',value:'M'},
        {name:'服务类型F',value:'F'},
        {name:'服务类型T',value:'T'}
    ] ;
    $scope.changeServiceType = function () {
        $scope.$broadcast('changeServiceTypeEvent',$scope.data.serviceType) ;
    }
});


app.directive('force', function () {
    return {
        restrict:'E',
        replace:true,
        scope:{
            title:'@',
            data:'='
        },
        template: function () {
            return ' <div class="form-group" ng-show="showFlag">'+
                        '<label class="col-sm-2 control-label" ng-bind="title"></label>'+
                        '<div class="col-sm-10" ng-transclude="">' +
                        '</div>' +
                    '</div>' ;
        },
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
                    scope.$on('changeServiceTypeEvent', function (event,servieType) {
                        var flag = getOcshowFlag(ocshow,servieType) ;
                        console.info(flag) ;
                        scope.showFlag = flag ;
                    }) ;
                }
            };
        }
    } ;
}) ;


app.directive('hello', function () {
    return {
        restrice:'A',
        scope:{},
        compile: function (element,attrs) {
            console.info('compile ....') ;
            return {
                pre: function preLink(scope,elment,attrs) {
                    console.info('pre ...') ;

                },
                post: function postLink(scope,element,attrs) {
                    console.info('post ....') ;
                }
            }
        }

    } ;
}) ;