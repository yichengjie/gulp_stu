function test() {
  var test = $("#test") ;
  var children = test.children() ;
  var last = children.last() ;
  var inputPosition=last.position();
	var belowTipLeft=inputPosition.left;
	var belowTipTop=inputPosition.top+last.innerHeight()+9;
  console.info("belowTipLeft : " + belowTipLeft) ;
  console.info("belowTipTop : " + belowTipTop) ;
}
