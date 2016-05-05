/**
 * Created by Administrator on 2016/5/5.
 */
var _ = require('underscore') ;
var htmlStr = require('../tpl/hello.html') ;

var busi = {} ;
busi.sayHello = function(){
    console.info('hello world') ;
}

module.exports = busi ;

