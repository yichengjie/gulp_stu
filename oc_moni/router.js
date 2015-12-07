/**
 * Created by yicj on 2015/12/7.
 */
var path = require('path') ;
module.exports = function(app){

    app.get('/initPage4Add', function (req, res) {
        var retJson = {"flag":"true"} ;
        try{
            var serviceGroupList = [{"serviceGroup":"BG","serviceGroupDescription":"行李"},
                    {"serviceGroup":"SA","serviceGroupDescription":"优选座位组描述F"},
                    {"serviceGroup":"PR","serviceGroupDescription":"机上餐食F"},
                    {"serviceGroup":"SA","serviceGroupDescription":"优选座位组描述M"},
                    {"serviceGroup":"SA","serviceGroupDescription":"优选座位"},
                    {"serviceGroup":"IE","serviceGroupDescription":"候补座位F"},
                    {"serviceGroup":"LG","serviceGroupDescription":"贵宾休息室"},
                    {"serviceGroup":"PR","serviceGroupDescription":"机上餐食M"},
                    {"serviceGroup":"IE","serviceGroupDescription":"候补座位M"},
                    {"serviceGroup":"ML","serviceGroupDescription":"机上餐食组描述F"},
                    {"serviceGroup":"TS","serviceGroupDescription":"酒店组描述F"},
                    {"serviceGroup":"UP","serviceGroupDescription":"升舱组描述F"},
                    {"serviceGroup":"BDUP","serviceGroupDescription":"含升舱的套餐组描述F"},
                    {"serviceGroup":"BDSA","serviceGroupDescription":"含优选座位的套餐组描述F"}] ;
            var passengerList = [{"psgrTypeCode":"ADT","psgrTypeDesc":"成人"},
                    {"psgrTypeCode":"CNN","psgrTypeDesc":"儿童"},
                    {"psgrTypeCode":"UNN","psgrTypeDesc":"无人陪伴儿童"}] ;
            var ffpList = [{"id":"8be6a271ea7c4435b74460c277c204da","cardType":"V","carr":"CA","description":"白金卡","ffpStatus":"1"},
                    {"id":"3b77accb37d94d6ea4fcf9e00694f9cf","cardType":"G","carr":"CA","description":"金卡","ffpStatus":"2"},
                    {"id":"c5eab8fe739b42f49f8a07ac0654831a","cardType":"C","carr":"CA","description":"银卡","ffpStatus":"3"},
                    {"id":"3b72585de6264f76a8059f7aa220b98c","cardType":"P","carr":"CA","description":"普通卡","ffpStatus":"4"}] ;
            var equipmentList = [
                    {"code":"747","description":"B747-400CMB"},
                    {"code":"73G","description":"B737-700"},
                    {"code":"733","description":"B737-3z00"},
                    {"code":"340","description":"A340-300"},
                    {"code":"319","description":"A319-111"}] ;
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

};


