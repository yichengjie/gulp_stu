/**
 * Created by yicj on 2016/2/5.
 */
var app = angular.module('app',['angular-growl','ngSanitize']) ;

app.config(['growlProvider', function(growlProvider) {
    //growlProvider.globalTimeToLive(5000);
    growlProvider.globalEnableHtml(true);
}]);

app.controller('IndexController', function ($scope,growl) {
    $scope.addSpecialWarnMessage = function() {
        growl.addWarnMessage("Override global ttl setting", {ttl: 1000});
        growl.addWarnMessage("This adds a warn message",{ttl:2000});
        growl.addInfoMessage("This adds a info message",{ttl:3000});
        growl.addSuccessMessage("This adds a success message",{ttl:4000});
        growl.addErrorMessage("This adds a error message");
    }
    $scope.name = "ycj" ;
}) ;