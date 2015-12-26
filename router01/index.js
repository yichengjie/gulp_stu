var app = angular.module('app',['ui.router']) ;
app.controller('IndexController', function ($scope) {
    $scope.data = {
        startDate:'2015-11-14'
    } ;
}) ;

app.config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/state1");
    // Now set up the states
    $stateProvider
        .state('state1', {
            url: "/state1",
            template: "partials/state1.html"
        })
        .state('state1.list', {
            url: "/list",
            template: "partials/state1.list.html",
            controller: function($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
            }
        })
        .state('state2', {
            url: "/state2",
            template: "partials/state2.html"
        })
        .state('state2.list', {
            url: "/list",
            template: "partials/state2.list.html",
            controller: function($scope) {
                $scope.things = ["A", "Set", "Of", "Things"];
            }
        });
});