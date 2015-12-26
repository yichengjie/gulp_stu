var app = angular.module('app',['ui.router']) ;
app.controller('IndexController', function ($scope) {
    $scope.data = {
        startDate:'2015-11-14'
    } ;
}) ;

app.config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/edit");
    // Now set up the states
    $stateProvider
        .state('edit',{
            url:'/edit',
            views: {
                'filters@': {
                    template: 'This is contacts.defail populating the "hint" ui-view@filters'
                },
                'tabledata@': {
                    template: 'This is contacts.defail populating the "hint" ui-view@tabledata'
                },
                'graph@': {
                    template: 'This is contacts.defail populating the "hint" ui-view@graph'
                }
            }
        })

});