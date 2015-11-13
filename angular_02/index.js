/**
 * Created by mjn on 2015/11/13.
 */

var phonecatControllers = angular.module('app',[]) ;

phonecatControllers.controller('SelfCtrl', function($scope) {
    $scope.click = function () {
        $scope.$broadcast('to-child', 'child');
        $scope.$emit('to-parent', 'parent');
    }
});

phonecatControllers.controller('ParentCtrl', function($scope) {
    $scope.$on('to-parent', function(d,data) {
        console.log(data);         //父级能得到值
    });
    $scope.$on('to-child', function(d,data) {
        console.log(data);         //子级得不到值
    });
});

phonecatControllers.controller('ChildCtrl', function($scope){
    $scope.$on('to-child', function(d,data) {
        console.log(data);         //子级能得到值
    });
    $scope.$on('to-parent', function(d,data) {
        console.log(data);         //父级得不到值
    });
});

phonecatControllers.controller('BroCtrl', function($scope){
    $scope.$on('to-parent', function(d,data) {
        console.log(data);        //平级得不到值
    });
    $scope.$on('to-child', function(d,data) {
        console.log(data);        //平级得不到值
    });
});