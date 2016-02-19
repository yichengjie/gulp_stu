/**
 * Created by yicj on 2016/2/18.
 */
var app = angular.module('app',['ui.bootstrap']) ;
app.controller('IndexController', function ($scope) {
    $scope.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];
    $scope.addAlert = function() {
        $scope.alerts.push({msg: 'Another alert!'});
    };
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}) ;
