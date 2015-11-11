// 所有模块都通过 define 来定义
define(function(require, exports, module) {
  var util = {} ;
  var add = function(){
     console.info('hello world') ;
  }
  util.add = add ;
  // 或者通过 module.exports 提供整个接口
  return util ;
});
