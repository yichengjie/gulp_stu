var app = angular.module('app',['pasvaz.bindonce']) ;
app.controller('IndexController',function ($scope) {
    $scope.data = {
        name:'hello world',
        serviceType:'F'
    };
    $scope.serviceTypeList =[
        {name:"服务类型M",value:"M"},
        {name:"服务类型F",value:"F"},
        {name:"服务类型A",value:"A"},
        {name:"服务类型C",value:"C"},
        {name:"服务类型P",value:"P"}
    ]

}) ;
app.directive('myLink', function () {
     return {
         restrict: 'EA',
         transclude: true,
         controller:
         function ($scope, $element,$attrs,$transclude) {
             $transclude(function (clone) {
                 // var a = angular.element('<a>');
                 //a.attr('href', $attrs.value);
                 //a.text(clone.text());
                var href = $attrs.value ;
                var text = clone.text() ;
                var str = "<a target='_new' href ='"+href+"'>"+text+"</a>" ;
                $element.append(str);
             });
         }
     };
 });

app.directive('other',function(){
  return{
    restrict:'A',
    require:'?ngModel',
    transclude:true,
    link:function (scope,elem,attr,ctrl) {
       var v = attr['value'] ;
       elem.bind('blur keyup change', function() {
          scope.$apply(read);
       });
       // Write data to the model
        function read() {
            ctrl.$setViewValue(elem.val()+'$');
        }
        // Specify how UI should be updated
        ctrl.$render = function() {
            elem.val(ctrl.$viewValue || '');
        };
    }
  } ;
}) ;

