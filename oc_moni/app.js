var express = require('express');
var app = express();
var path = require('path') ;
var compression = require('compression')
var port = process.env.PORT || 3000 ;
app.use(compression());
app.use(express.static(path.join(__dirname,'./resources'))) ;

//导入路由
require('./router')(app) ;
var server = app.listen(port, function () {
    console.info('express server is run in port 3000') ;
});