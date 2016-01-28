/**
 * Created by yicj on 2016/1/28.
 */
var app = angular.module('app',[]) ;

app.controller('IndexController', function ($scope,$log,$window) {
    console.log('parentController scope id = ', $scope.$id);
    $scope.primary1Label = 'Prime1';
    $scope.onPrimary1Click = function() {
        $window.alert('Primary1 clicked');
    };
}) ;

app.directive('primary', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.addClass('btn btn-primary');
        }
    }
});

app.directive('secondary', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.addClass('btn');
        }
    }
});

app.directive('buttonBar', function() {
    return {
        restrict: 'EA',
        template: '<div class="span4 well clearfix"><div class="primary-block pull-right"></div><div class="secondary-block"></div></div>',
        replace: true,
        transclude: true,
        scope: {},
        controller: ['$scope', '$element', '$transclude', function ($scope, $element, $transclude) {
            $transclude(function(clone) {
                var primaryBlock = $element.find('div.primary-block');
                var secondaryBlock = $element.find('div.secondary-block');
                var transcludedButtons = clone.filter(':button');
                angular.forEach(transcludedButtons, function(e) {
                    if (angular.element(e).hasClass('primary')) {
                        primaryBlock.append(e);
                    } else if (angular.element(e).hasClass('secondary')) {
                        secondaryBlock.append(e);
                    }
                });
            });
        }],
    };
});


app.directive('tag', function() {
    return {
        restrict: 'E',
        template: '<h1><a href="{{transcluded_content}}">{{transcluded_content}}</a></h1>',
        replace: true,
        transclude: true,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function(scope) {
                    transclude(scope, function(clone) {
                        //scope.transcluded_content = clone[0].textContent;
                    });
                }
            }
        }
    }
});


//注意到，transcludeFn函数需要一个可用的scope作为第一个参数，但是编译函数中没有可用的scope，
// 所以这里需要在链接函数中执行transcludeFn。这种方法实际上是在link函数中同时操作编译
// 后的DOM元素和模板元素(主要是因为transcludeFn函数中保存着指令的内容)。
/*app.directive('buttonBar', function() {//demo3
    return {
        restrict: 'EA',
        template: '<div class="span4 well clearfix">' +
                    '<div class="primary-block pull-right"></div>' +
                    '<div class="secondary-block"></div>' +
                  '</div>',
        replace: true,
        transclude: true,
        compile: function(elem, attrs, transcludeFn) {
            return function (scope, element, attrs) {
                    transcludeFn(scope, function(clone) {
                        var primaryBlock = elem.find('div.primary-block');
                        var secondaryBlock = elem.find('div.secondary-block');
                        var transcludedButtons = clone.filter(':button');
                        angular.forEach(transcludedButtons, function(e) {
                            if (angular.element(e).hasClass('primary')) {
                                primaryBlock.append(e);
                            } else if (angular.element(e).hasClass('secondary')) {
                                secondaryBlock.append(e);
                            }
                        });
                    });
            };
        }
    };
});*/

/*app.directive('buttonBar', function() {//demo 2
    return {
        restrict: 'E',
        template: '<div class="span4 well clearfix">' +
                    '<div class="primary-block pull-right"></div>' +
                    '<div class="secondary-block"></div>' +
                    '<div class="transcluded" ng-transclude></div>' +
                  '</div>',
        replace: true,
        transclude: true,
        link: function(scope, element, attrs) {
            var primaryBlock = element.find('div.primary-block');
            var secondaryBlock = element.find('div.secondary-block');
            //找到transclude块
            var transcludedBlock = element.find('div.transcluded');
            //找到transclude块中所有的button
            var transcludedButtons = transcludedBlock.children().filter(':button');
            angular.forEach(transcludedButtons, function(elem) {
                if (angular.element(elem).hasClass('primary')) {
                    primaryBlock.append(elem);
                } else if (angular.element(elem).hasClass('secondary')) {
                    secondaryBlock.append(elem);
                }
            });
            transcludedBlock.remove();
        }
    };
});*/


angular.element(document).ready(function () {
    angular.bootstrap(document,['app']) ;
}) ;

