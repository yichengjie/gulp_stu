var express = require('express');
var app = express();
var path = require('path') ;
var port = process.env.PORT || 3000 ;

app.use(express.static(path.join(__dirname,'/resources'))) ;

app.get('/initPage4Add', function (req, res) {
    var retJson = {"flag":"true"} ;
    try{
        var serviceGroupList = [] ;
        var passengerList = [] ;
        var ffpList = [] ;
        var equipmentList = [] ;
        retJson.serviceGroupList = serviceGroupList ;
        retJson.passengerList = passengerList ;
        retJson.ffpList = ffpList ;
        retJson.equipmentList = equipmentList ;
    }catch(e){
        retJson.flag = "false" ;
        console.info('初始化update页面出错') ;
    } ;
    res.json(retJson);
});


app.get('/initPage4Upate', function (req,res) {
    var retJson = {"flag":"true"} ;
    try{
        var serviceGroupList  = [] ;
        var passengerList = [] ;
        var ffpList = [] ;
        var equipmentList = [] ;
        var list163 = [] ;
        var s7VO = [] ;

        retJson.serviceGroupList = serviceGroupList;
        retJson.passengerList = passengerList ;
        retJson.ffpList = ffpList ;
        retJson.equipmentList = equipmentList ;
        retJson.list163 = list163 ;
        retJson.s7VO = s7VO ;
    }catch(e){
        retJson.flag = "false" ;
        console.info('初始化add页面出错') ;
    }
    res.json(retJson);
}) ;


app.use('/',function (req,res) {
    res.sendFile(path.join(__dirname,'./resources/edit.html')) ;
    //res.send('index');
}) ;





var server = app.listen(port, function () {
    console.info('express server is run in port 3000') ;
});