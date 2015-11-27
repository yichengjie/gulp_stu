var services = require('./services/index.js') ;
var controllers = require('./controllers/index.js') ;
var directives = require('./directives/index.js') ;
//var filters = require('./filters/index.js') ;
var app = angular.module('app',['app.services','app.controllers','app.directives']) ;

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});



