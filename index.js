
function Foo (name){
  this.name = name ;

  this.say=function(){
     console.info('name : ' + this.name) ;
  }

}


function Foo2(){

  this.t = function(fn){
     fn.say() ;
  }
}


(function Client(){
  this.name = "cccc" ;
  var foo = new Foo(this.name) ;
  var foo2 = new Foo2() ;
  foo2.t(foo) ;
})();
