/**
 * Created by yicj on 2016/2/17.
 */
(function(){

    //路由部分
    var AppRouter = Backbone.Router.extend({
        routes: {
            "help":                 "help",    // #help
            "search":        "search1",  // #search/kiwis
            "search/:query":        "search2",  // #search/kiwis
            "search/:query/p:page": "search3"   // #search/kiwis/p7
        },
        help: function() {
            console.info('路由 help .............') ;
        },
        search1: function(query, page) {
            console.info('路由 search1............') ;
        },
        search2: function(query, page) {
            console.info('路由 search2............') ;
        },
        search3: function(query, page) {
            console.info('路由 search3............') ;
        },
        initialize: function () {
            console.info('路由被实例化 。。。。')  ;
        }

    });

    window.appRouter = new AppRouter() ;

    Backbone.history.start() ;

    $("#help").bind("click", function (event) {
        //appRouter.navigate("help") ;
        appRouter.navigate("help/troubleshooting", {trigger: true, replace: true});
        console.info('help') ;
    }) ;


    $("#search1").bind("click", function (event) {
        appRouter.navigate("search", {trigger: true, replace: true});
        console.info('search') ;
    }) ;

    $("#search2").bind("click", function (event) {
        appRouter.navigate("search/10", {trigger: true, replace: true});
        console.info('search') ;
    }) ;

    $("#search3").bind("click", function (event) {
        appRouter.navigate("search/10/p2", {trigger: true, replace: true});
        console.info('search') ;
    }) ;


}()) ;